/**
 * POST /api/admin-create-account
 *
 * Admin-initiated account creation from the CRM. Decoupled from the OTP flow —
 * no OTP is required here. The same alias-email + generateLink pattern is used
 * so that the DB triggers (profile row, role assignment, etc.) fire exactly as
 * they would for an OTP-originated signup.
 *
 * Flow:
 *  1. Validate request — phone_e164 is required.
 *  2. Call find_user_by_phone RPC — if a user already exists, return a 409 so
 *     the client can show a "contact Investor Desk" message.
 *  3. Synthesize a shadow alias email from the phone digits (same format as
 *     verify-otp: p<digits>@<LOGIN_ALIAS_DOMAIN>).
 *  4. Call auth.admin.generateLink({ type: 'magiclink' }) — Supabase implicitly
 *     creates the account and stores the metadata at this point.
 *  5. Return success. The caller does not need the token_hash; it is discarded.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required Supabase environment variables')
  }
  return createClient(supabaseUrl, supabaseKey)
}

const LOGIN_ALIAS_DOMAIN = process.env.LOGIN_ALIAS_DOMAIN || 'wa-login.local'

function aliasEmailFromPhone(phone: string, domain: string): string {
  const digits = phone.replace(/\D/g, '')
  return `p${digits}@${domain}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const phone_e164 = String(body?.phone_e164 || '').trim()

    if (!phone_e164) {
      return NextResponse.json({ error: 'Missing phone_e164' }, { status: 400 })
    }

    const supabaseAdmin = createSupabaseAdmin()

    // Check if an account already exists for this phone number
    const { data: functionResult, error: functionError } = await supabaseAdmin
      .rpc('find_user_by_phone', { search_phone: phone_e164 })

    if (functionError) {
      console.error('[admin-create-account] find_user_by_phone error:', functionError)
      return NextResponse.json({ error: 'Failed to check existing users' }, { status: 500 })
    }

    if (functionResult && functionResult.length > 0 && functionResult[0].found) {
      return NextResponse.json(
        { error: 'A login account already exists for this phone number. Please contact the Investor Desk to get the linking done.' },
        { status: 409 }
      )
    }

    // Synthesize shadow alias email (same format as verify-otp)
    const loginEmail = aliasEmailFromPhone(phone_e164, LOGIN_ALIAS_DOMAIN)

    const metadata = {
      phone_number: phone_e164,
      login_via: 'whatsapp_otp',
      default_role: 'guest',
    }

    // Create the account — generateLink implicitly creates the auth user and
    // fires all DB triggers. The token_hash is not needed here.
    const { error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: loginEmail,
      options: { data: metadata },
    } as any)

    if (linkErr) {
      console.error('[admin-create-account] generateLink error:', linkErr)
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    return NextResponse.json({ success: true, login_email: loginEmail })
  } catch (e) {
    console.error('[admin-create-account] unexpected error:', e)
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
