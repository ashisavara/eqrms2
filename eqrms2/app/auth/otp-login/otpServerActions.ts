'use server'

import { createClient } from '@/lib/supabase/server'

// Server action for checking user authentication (replaces supabase.auth.getUser)
export async function getUserServerAction() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Return user if found, null if not (no error logging for logged out users)
    return { user: user || null, error: null }
  } catch (error) {
    // Silent fail - just return no user
    return { user: null, error: null }
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

// Server action for logging out (replaces supabase.auth.signOut)
export async function logoutServerAction() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return { error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { error: 'Failed to logout' }
  }
}

// Server action for logging out from ChangeGroup component
export async function logoutFromChangeGroupAction() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return { error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { error: 'Failed to logout' }
  }
}
