import { NextRequest, NextResponse } from 'next/server';
import { supabaseUpdateRow } from '@/lib/supabase/serverQueryHelper';

export async function POST(req: NextRequest) {
  try {
    const { login_uuid, lead_name } = await req.json();

    if (!login_uuid || !lead_name?.trim()) {
      return NextResponse.json(
        { error: 'login_uuid and lead_name are required' },
        { status: 400 }
      );
    }

    // Update the lead_name in login_profile table using serverQueryHelper
    await supabaseUpdateRow(
      'login_profile',
      'uuid',
      login_uuid,
      { lead_name: lead_name.trim() }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to update lead name' },
      { status: 500 }
    );
  }
}
