import { NextRequest, NextResponse } from 'next/server';
import { supabaseListRead } from '@/lib/supabase/serverQueryHelper';
import { LoginProfileWithRoles } from '../../(rms)/internal/link-login-lead/types';

export async function POST(req: NextRequest) {
  try {
    const { searchTerm, searchType, limit = 50 } = await req.json();

    if (!searchTerm?.trim()) {
      return NextResponse.json(
        { error: 'Search term is required' },
        { status: 400 }
      );
    }

    // Build filters based on search type
    const filters = [];
    
    if (searchType === 'phone') {
      filters.push((query: any) => query.ilike('phone_number', `%${searchTerm.trim()}%`));
    } else if (searchType === 'name') {
      filters.push((query: any) => query.ilike('lead_name', `%${searchTerm.trim()}%`));
    }

    // Add limit filter
    filters.push((query: any) => query.limit(limit));

    // Search the v_login_profile_with_roles view
    const results = await supabaseListRead<LoginProfileWithRoles>({
      table: 'v_login_profile_with_roles',
      columns: 'uuid, phone_number, lead_name, user_roles, lead_id, crm_lead_name, group_id, group_name, rm_name',
      filters
    });

    return NextResponse.json({ data: results || [] });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search login profiles' },
      { status: 500 }
    );
  }
}
