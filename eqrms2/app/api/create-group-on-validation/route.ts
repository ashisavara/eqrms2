import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { uuid, lead_name } = await req.json();

    if (!uuid || !lead_name) {
      return NextResponse.json(
        { error: 'uuid and lead_name are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Call the rpc_create_group_on_login_form_validation RPC function
    const { data, error } = await supabase.rpc('rpc_create_group_on_login_form_validation', {
      p_uuid: uuid,
      p_lead_name: lead_name
    });

    if (error) {
      console.error('Error calling rpc_create_group_on_login_form_validation:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create group' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, final_group_name: data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
