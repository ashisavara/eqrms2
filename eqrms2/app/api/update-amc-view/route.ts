import { NextRequest, NextResponse } from 'next/server';
import { supabaseUpdateRow } from '@/lib/supabase/serverQueryHelper';

export async function POST(request: NextRequest) {
  try {
    const { id, data } = await request.json();
    await supabaseUpdateRow("rms_amc", "id", id, data);
    return NextResponse.json({ message: 'AMC updated successfully' });
  } catch (error) {
    console.error('Error updating AMC:', error);
    return NextResponse.json({ error: 'Error updating AMC' }, { status: 500 });
  }
}
