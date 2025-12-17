import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Helper function for ILIKE-based fallback search (for generic lead search)
async function performIlikeSearchGeneric(supabase: any, phone: string | null, name: string | null, limit: number) {
  const searchStrategies = [];

  // Strategy 1: Combined OR search (if both parameters provided)
  if (phone && name) {
    searchStrategies.push({
      name: 'combined_search',
      query: supabase
        .from('view_leads_tagcrm')
        .select('lead_id, lead_name, lead_progression, lead_source, phone_e164, login_name, rm_name')
        .or(`lead_name.ilike.%${name}%,phone_e164.ilike.%${phone}%`)
        .limit(limit)
    });
  }

  // Strategy 2: Name contains search
  if (name) {
    searchStrategies.push({
      name: 'name_contains',
      query: supabase
        .from('view_leads_tagcrm')
        .select('lead_id, lead_name, lead_progression, lead_source, phone_e164, login_name, rm_name')
        .ilike('lead_name', `%${name}%`)
        .limit(limit)
    });
  }

  // Strategy 3: Phone number match
  if (phone) {
    searchStrategies.push({
      name: 'phone_match',
      query: supabase
        .from('view_leads_tagcrm')
        .select('lead_id, lead_name, lead_progression, lead_source, phone_e164, login_name, rm_name')
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
        lead_progression: item.lead_progression || null,
        lead_source: item.lead_source || null,
        phone_e164: item.phone_e164,
        login_name: item.login_name || null,
        rm_name: item.rm_name || null,
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

    console.log('Search Leads (Generic) API called with:', { phone, name, limit });

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
    const { data: rpcData, error: rpcError } = await supabase.rpc('search_leads_flexible', {
      p_phone: phone || null,
      p_name: name || null,
      p_limit: limit
    });

    if (rpcError) {
      // Log full error details for debugging
      console.error('RPC Error Details:', {
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
        const fallbackResults = await performIlikeSearchGeneric(supabase, phone, name, limit);
        
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
      const fallbackResults = await performIlikeSearchGeneric(supabase, phone, name, limit);
      
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