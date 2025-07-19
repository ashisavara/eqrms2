import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { search_term } = await request.json();
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('rms_funds')
      .select('fund_name, slug')
      .ilike('fund_name', `%${search_term}%`)
      .limit(10);

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching funds:', error);
    return NextResponse.json({ error: 'Error searching funds' }, { status: 500 });
  }
} 