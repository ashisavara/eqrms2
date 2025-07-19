import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { search_term } = await request.json();
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('eq_rms_company')
      .select('ime_name, company_id')
      .ilike('ime_name', `%${search_term}%`)
      .limit(10);

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching companies:', error);
    return NextResponse.json({ error: 'Error searching companies' }, { status: 500 });
  }
} 