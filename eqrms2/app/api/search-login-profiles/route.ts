import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { searchTerm, searchType, limit = 50 } = await req.json();

    if (!searchTerm?.trim()) {
      return NextResponse.json(
        { error: 'Search term is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.rpc('search_login', {
      p_phone: searchType === 'phone' ? searchTerm.trim() : null,
      p_name:  searchType === 'name'  ? searchTerm.trim() : null,
      p_limit: limit
    });

    if (error) {
      console.error('search_login RPC error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json(
        { error: `Search function error: ${error.message}`, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search login profiles' },
      { status: 500 }
    );
  }
}
