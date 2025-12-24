// Server actions for group selection
// Database fetchers

'use server'

import { createClient } from '@/lib/supabase/server'

// Server action to check initial auth state
export async function checkInitialAuthAction() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return { user: null, isAuthenticated: false, error: error.message }
    }
    
    return { 
      user: user || null, 
      isAuthenticated: !!user, 
      error: null 
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return { user: null, isAuthenticated: false, error: 'Failed to check auth state' }
  }
}

// Server action to get current user session
export async function getCurrentUserAction() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return { user: null, error: error.message }
    }
    
    return { user: user || null, error: null }
  } catch (error) {
    console.error('Get current user error:', error)
    return { user: null, error: 'Failed to get current user' }
  }
}

