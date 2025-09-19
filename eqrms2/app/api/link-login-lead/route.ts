import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { login_uuid, lead_id } = await req.json();

    if (!login_uuid || !lead_id) {
      return NextResponse.json(
        { error: 'login_uuid and lead_id are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Call the link_login_to_lead RPC function
    const { data, error } = await supabase.rpc('link_login_to_lead', {
      p_login_uuid: login_uuid,
      p_lead_id: lead_id
    });

    if (error) {
      console.error('Error calling link_login_to_lead:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to link login to lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
