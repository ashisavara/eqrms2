'use server'

import { createClient } from '@/lib/supabase/server'

// Server action for checking user authentication (replaces supabase.auth.getUser)
export async function getUserServerAction() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return { error: error.message, user: null }
    }
    
    return { user, error: null }
  } catch (error) {
    console.error('Get user error:', error)
    return { error: 'Failed to get user', user: null }
  }
}

// Server action for OTP verification (replaces supabase.auth.verifyOtp)
export async function verifyOtpServerAction(tokenHash: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp({ 
      token_hash: tokenHash, 
      type: 'email' 
    })
    
    if (error) {
      return { error: error.message, data: null }
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Verify OTP error:', error)
    return { error: 'Failed to verify OTP', data: null }
  }
}
