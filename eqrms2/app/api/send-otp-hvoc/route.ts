import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomInt } from 'crypto'
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

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10)
const OTP_LENGTH = parseInt(process.env.OTP_LENGTH || '4', 10)
const MAX_OTPS_PER_HOUR = parseInt(process.env.MAX_OTPS_PER_HOUR || '5', 10)
const DEV_ECHO_OTP = (process.env.EXPOSE_OTP_IN_RESPONSE || 'false') === 'true'
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || '+91'

// AI Sensy configuration
const AI_SENSY_API_URL = 'https://backend.aisensy.com/campaign/t1/api/v2'
const AI_SENSY_CAMPAIGN_NAME = 'RMS OTP Login'
const AI_SENSY_USER_NAME = 'IME Capital Pvt Ltd.'

// Function to send OTP via AI Sensy WhatsApp API
async function sendWhatsAppOTP(phoneNumber: string, otpCode: string, deviceId?: string) {
  try {
    // Check for required API key
    const apiKey = process.env.AI_SENSY_API_KEY
    if (!apiKey) {
      throw new Error('AI_SENSY_API_KEY environment variable is required')
    }
    
    // Test: Send phone number with + prefix to see if AI Sensy handles it correctly
    const destination = phoneNumber
    
    const payload = {
      apiKey: apiKey,
      campaignName: AI_SENSY_CAMPAIGN_NAME,
      destination: destination,
      userName: AI_SENSY_USER_NAME,
      templateParams: [
        otpCode // This will replace $FirstName in your template
      ],
      source: deviceId ? `device-${deviceId}` : 'otp-hvoc-form',
      media: {},
      buttons: [
        {
          type: "button",
          sub_type: "url",
          index: 0,
          parameters: [
            {
              type: "text",
              text: otpCode // Also put OTP in button for easy copying
            }
          ]
        }
      ],
      carouselCards: [],
      location: {},
      attributes: {},
      paramsFallbackValue: {
        FirstName: otpCode // Fallback value
      }
    }
    
    const response = await fetch(AI_SENSY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    
    if (!response.ok) {
      console.error(`[AI SENSY] API Error:`, result)
      throw new Error(`AI Sensy API error: ${result.message || 'Unknown error'}`)
    }

    console.log(`[AI SENSY] Success:`, result)
    return { success: true, messageId: result.messageId || 'unknown' }
    
  } catch (error) {
    console.error(`[AI SENSY] Failed to send WhatsApp OTP:`, error)
    throw error
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const inputPhone = String(body?.phone_number || '')
    const lead_name = String(body?.lead_name || '')
    const device_id = String(body?.device_id || '')
    const trigger_source = String(body?.trigger_source || 'form')

    // Validate lead_name is provided
    if (!lead_name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Optional: shared-secret if called by an external system like AI Sensy
    if (trigger_source === 'ai-sensy') {
      const token = req.headers.get('x-api-key')
      if (!token || token !== process.env.SENSY_SHARED_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const phone_number = normalizePhone(inputPhone, DEFAULT_COUNTRY_CODE)
    if (!phone_number) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    const ip_address = req.headers.get('x-forwarded-for') || 'unknown'

    // Rate limit per phone_number
    const supabaseAdmin = createSupabaseAdmin()
    const { count } = await supabaseAdmin
      .from('otp_hvoc')
      .select('*', { count: 'exact', head: true })
      .eq('phone_number', phone_number)
      .gt('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())

    if ((count || 0) >= MAX_OTPS_PER_HOUR) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    // Invalidate previous active OTPs for this number
    await supabaseAdmin
      .from('otp_hvoc')
      .update({ used: true })
      .eq('phone_number', phone_number)
      .eq('used', false)

    // Generate OTP
    const min = 10 ** (OTP_LENGTH - 1)
    const max = 10 ** OTP_LENGTH
    const otp = randomInt(min, max).toString()
    const expires_at = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString()

    // Persist OTP to database with otp_lead_name
    const { error: insertErr } = await supabaseAdmin.from('otp_hvoc').insert({
      phone_number,
      otp_code: otp,
      expires_at,
      used: false,
      ip_address,
      device_id,
      otp_lead_name: lead_name,
    })
    if (insertErr) {
      console.error(insertErr)
      return NextResponse.json({ error: 'Failed to save OTP' }, { status: 500 })
    }

    // Send OTP via WhatsApp using AI Sensy
    let whatsappResult: { success: boolean; messageId?: string; error?: string } | null = null
    try {
      whatsappResult = await sendWhatsAppOTP(phone_number, otp, device_id)
    } catch (whatsappError) {
      console.error('WhatsApp delivery failed:', whatsappError)
      // Don't fail the entire request - user can still see dev OTP
      whatsappResult = { 
        success: false, 
        error: whatsappError instanceof Error ? whatsappError.message : 'Unknown error' 
      }
    }

    return NextResponse.json({ 
      success: true, 
      dev_otp: DEV_ECHO_OTP ? otp : undefined,
      whatsapp_sent: whatsappResult?.success || false,
      whatsapp_message_id: whatsappResult?.messageId,
      whatsapp_error: whatsappResult?.error
    })
    
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
