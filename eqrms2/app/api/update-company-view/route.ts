import { NextRequest, NextResponse } from 'next/server';
import { supabaseUpdateRow } from '@/lib/supabase/serverQueryHelper';

export async function POST(request: NextRequest) {
  try {
    const { companyId, data } = await request.json();
    await supabaseUpdateRow("eq_rms_company", "company_id", companyId, data);
    return NextResponse.json({ message: 'Company updated successfully' });
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'Error updating company' }, { status: 500 });
  }
}
