import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Helper function for ILIKE-based fallback search (for linking context)
async function performIlikeSearchForLinking(supabase: any, phone: string | null, name: string | null, limit: number) {
  const searchStrategies = [];

  // Strategy 1: Combined OR search (if both parameters provided)
  if (phone && name) {
    searchStrategies.push({
      name: 'combined_search',
      query: supabase
        .from('leads_tagging')
        .select('lead_id, lead_name, phone_e164, primary_rm_uuid')
        .or(`lead_name.ilike.%${name}%,phone_e164.ilike.%${phone}%`)
        .limit(limit)
    });
  }

  // Strategy 2: Name contains search
  if (name) {
    searchStrategies.push({
      name: 'name_contains',
      query: supabase
        .from('leads_tagging')
        .select('lead_id, lead_name, phone_e164, primary_rm_uuid')
        .ilike('lead_name', `%${name}%`)
        .limit(limit)
    });
  }

  // Strategy 3: Phone number match
  if (phone) {
    searchStrategies.push({
      name: 'phone_match',
      query: supabase
        .from('leads_tagging')
        .select('lead_id, lead_name, phone_e164, primary_rm_uuid')
        .ilike('phone_e164', `%${phone}%`)
        .limit(limit)
    });
  }

  for (const strategy of searchStrategies) {
    const { data: strategyData, error: strategyError } = await strategy.query;
    
    if (!strategyError && strategyData && strategyData.length > 0) {
      // Map results to match RPC format
      return strategyData.map((item: any) => ({
        lead_id: item.lead_id,
        lead_name: item.lead_name,
        phone_e164: item.phone_e164,
        primary_rm_uuid: item.primary_rm_uuid,
        name_score: null, // No similarity scoring in ILIKE
        phone_exact: phone ? item.phone_e164 === phone : false
      }));
    }
  }

  return [];
}

export async function POST(req: NextRequest) {
  try {
    const { phone, name, limit = 20 } = await req.json();

    console.log('Search Leads for Linking API called with:', { phone, name, limit });

    // At least one parameter must be provided
    if (!phone && !name) {
      console.log('Missing required parameters: at least one of phone or name must be provided');
      return NextResponse.json(
        { error: 'At least one search parameter (phone or name) is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Try the Supabase RPC function first (with pg_trgm similarity)
    const { data: rpcData, error: rpcError } = await supabase.rpc('search_leads_new_login', {
      p_phone: phone || null,
      p_name: name || null,
      p_limit: limit
    });

    if (rpcError) {
      // Log full error details for debugging
      console.error('RPC Error Details (search_leads_new_login):', {
        message: rpcError.message,
        code: rpcError.code,
        details: rpcError.details,
        hint: rpcError.hint,
        full: rpcError
      });

      // Check if it's a pg_trgm related error
      const isPgTrgmError = rpcError.message?.includes('similarity') || 
                           rpcError.message?.includes('pg_trgm') ||
                           rpcError.message?.includes('function') ||
                           rpcError.code === '42883'; // function does not exist
      
      if (isPgTrgmError) {
        // Fallback to ILIKE-based search
        const fallbackResults = await performIlikeSearchForLinking(supabase, phone, name, limit);
        
        return NextResponse.json({ 
          data: fallbackResults,
          fallback: true,
          error: 'pg_trgm extension not working - using ILIKE fallback',
          rpcError: rpcError.message
        });
      } else {
        // Other RPC errors (auth, etc.)
        return NextResponse.json(
          { error: `Search function error: ${rpcError.message}`, code: rpcError.code, details: rpcError.details },
          { status: 500 }
        );
      }
    }

    // If RPC succeeded but returned 0 results, try fallback
    if (!rpcData || rpcData.length === 0) {
      const fallbackResults = await performIlikeSearchForLinking(supabase, phone, name, limit);
      
      if (fallbackResults.length > 0) {
        return NextResponse.json({ 
          data: fallbackResults,
          fallback: true,
          message: 'RPC returned 0 results - pg_trgm may not be working properly'
        });
      }
    }

    // RPC worked successfully
    return NextResponse.json({ data: rpcData });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

