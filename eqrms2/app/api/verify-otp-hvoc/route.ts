import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { normalizePhone } from '@/lib/phone'

// Create Supabase client function to avoid module-level initialization
function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required Supabase environment variables')
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || '+91'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const inputPhone = String(body?.phone_number || '')
    const otp_code = String(body?.otp_code || '')

    const phone_number = normalizePhone(inputPhone, DEFAULT_COUNTRY_CODE)
    if (!phone_number || !otp_code) {
      return NextResponse.json({ error: 'Missing phone or OTP' }, { status: 400 })
    }

    // Create Supabase admin client
    const supabaseAdmin = createSupabaseAdmin()

    // Find a valid OTP (not used, not expired) from otp_hvoc table
    const { data: matches, error: findErr } = await supabaseAdmin
      .from('otp_hvoc')
      .select('id, expires_at, used, otp_lead_name')
      .eq('phone_number', phone_number)
      .eq('otp_code', otp_code)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)

    if (findErr || !matches || matches.length === 0) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 })
    }

    const rec = matches[0]
    if (new Date(rec.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 401 })
    }

    // Mark as used
    await supabaseAdmin.from('otp_hvoc').update({ used: true }).eq('id', rec.id)

    // Return success with lead information (no session creation)
    return NextResponse.json({ 
      success: true,
      verified: true,
      lead_name: rec.otp_lead_name,
      phone_number: phone_number
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
