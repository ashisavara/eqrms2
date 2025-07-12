import { NextRequest, NextResponse } from 'next/server';
import { supabaseInsertRow } from '@/lib/supabase/serverQueryHelper';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    await supabaseInsertRow("eq_rms_qrtly_notes", data);
    return NextResponse.json({ message: 'Quarterly notes added successfully' });
  } catch (error) {
    console.error('Error adding quarterly notes:', error);
    return NextResponse.json({ error: 'Error adding quarterly notes' }, { status: 500 });
  }
}
