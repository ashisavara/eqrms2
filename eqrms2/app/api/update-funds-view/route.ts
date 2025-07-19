import { NextRequest, NextResponse } from 'next/server';
import { supabaseUpdateRow } from '@/lib/supabase/serverQueryHelper';

export async function POST(request: NextRequest) {
  try {
    const { fund_id, data } = await request.json();
    await supabaseUpdateRow("rms_funds", "fund_id", fund_id, data);
    return NextResponse.json({ message: 'Fund updated successfully' });
  } catch (error) {
    console.error('Error updating Fund:', error);
    return NextResponse.json({ error: 'Error updating fund' }, { status: 500 });
  }
}
