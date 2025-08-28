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
const LOGIN_ALIAS_DOMAIN = process.env.LOGIN_ALIAS_DOMAIN || 'wa-login.local'

// Helper function to create shadow email alias from phone
function aliasEmailFromPhone(phone: string, domain: string): string {
  // Remove + and any non-digit characters, then prefix with 'p'
  const digits = phone.replace(/\D/g, '')
  return `p${digits}@${domain}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const inputPhone = String(body?.phone_number || '')
    const otp_code = String(body?.otp_code || '')
    const device_id = String(body?.device_id || '')

    const phone_number = normalizePhone(inputPhone, DEFAULT_COUNTRY_CODE)
    if (!phone_number || !otp_code) {
      return NextResponse.json({ error: 'Missing phone or OTP' }, { status: 400 })
    }

    // Create Supabase admin client
    const supabaseAdmin = createSupabaseAdmin()

    // Find a valid OTP (not used, not expired)
    const { data: matches, error: findErr } = await supabaseAdmin
      .from('otp_requests')
      .select('id, expires_at, used')
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
    await supabaseAdmin.from('otp_requests').update({ used: true }).eq('id', rec.id)

    // Check if ANY user already has this phone number in their metadata
    let usersWithPhone = null
    let phoneQueryError = null
    
    try {
      // Call our custom SQL function to find user by phone number
      const { data: functionResult, error: functionError } = await supabaseAdmin
        .rpc('find_user_by_phone', { search_phone: phone_number })
      
      if (functionError) {
        console.error('[OTP] SQL function call failed:', functionError)
        phoneQueryError = functionError
      } else if (functionResult && functionResult.length > 0) {
        const userData = functionResult[0]
        
        if (userData.found) {
          usersWithPhone = [{
            id: userData.user_id,
            email: userData.user_email,
            metadata: { phone_number: userData.phone_number }
          }]
        }
      }
      
    } catch (e) {
      console.error('[OTP] Error calling SQL function:', e)
      phoneQueryError = e
    }

    let isExistingUser = false
    let existingUserEmail = null

    if (!phoneQueryError && usersWithPhone && usersWithPhone.length > 0) {
      isExistingUser = true
      existingUserEmail = usersWithPhone[0].email
    }

    // Determine which email to use for login
    const loginEmail = isExistingUser ? existingUserEmail : aliasEmailFromPhone(phone_number, LOGIN_ALIAS_DOMAIN)

    // Prepare metadata - only for new users
    let metadata = null
    if (!isExistingUser) {
      metadata = {
        phone_number,
        login_via: 'whatsapp_otp',
        default_role: 'guest',
      }
    }

    // Always use magic link system for login (new or existing users)
    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: loginEmail,
      options: {
        data: metadata, // null for existing users, metadata object for new users
      },
    } as any)

    if (linkErr || !linkData) {
      console.error('[OTP] Failed to generate login link:', linkErr)
      return NextResponse.json({ error: 'Failed to generate login link' }, { status: 500 })
    }

    // Return token_hash to the client so it can create a real Supabase session via verifyOtp
    const token_hash = (linkData as any)?.properties?.hashed_token || null
    const action_link = (linkData as any)?.action_link || null

    if (!token_hash) {
      console.error('[OTP] Missing token hash from generateLink response:', linkData)
      return NextResponse.json({ error: 'Missing token hash from Supabase' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      token_hash, 
      action_link, 
      login_email: loginEmail,
      is_existing_user: isExistingUser,
      user_created: !isExistingUser
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}