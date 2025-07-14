import { NextRequest, NextResponse } from 'next/server';
import { supabaseUpdateRow } from '@/lib/supabase/serverQueryHelper';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Extract the ID for matching and remove it from update data
    const { quarterly_notes_id, ...updateData } = data;
    
    if (!quarterly_notes_id) {
      return NextResponse.json({ error: 'quarterly_notes_id is required for updates' }, { status: 400 });
    }
    
    await supabaseUpdateRow(
      "eq_rms_qrtly_notes", 
      "quarterly_notes_id", 
      quarterly_notes_id, 
      updateData
    );
    
    return NextResponse.json({ message: 'Quarterly notes updated successfully' });
  } catch (error) {
    console.error('Error updating quarterly notes:', error);
    return NextResponse.json({ error: 'Error updating quarterly notes' }, { status: 500 });
  }
}
