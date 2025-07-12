import { NextRequest, NextResponse } from 'next/server';
import { supabaseUpdateRow } from '@/lib/supabase/serverQueryHelper';

export async function POST(request: NextRequest) {
  try {
    const { companyId, data } = await request.json();
    await supabaseUpdateRow("eq_rms_qrtly_notes_view", "company_id", companyId, data);
    return NextResponse.json({ message: 'Qtr Notes updated successfully' });
  } catch (error) {
    console.error('Error updating quarter notes:', error);
    return NextResponse.json({ error: 'Error updating Quarter Notes' }, { status: 500 });
  }
}
