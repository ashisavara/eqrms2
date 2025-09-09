// Server actions for group & mandate selection
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

// Server action to fetch user's default group and mandate from view_leads_tagcrm
export async function getUserDefaultGroupMandate() {
  try {
    console.log('🔄 getUserDefaultGroupMandate: Starting...');
    
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('❌ getUserDefaultGroupMandate: Auth error or no user:', { authError, userId: user?.id });
      return { group: null, mandate: null, error: 'User not authenticated' }
    }

    console.log('🔄 getUserDefaultGroupMandate: User authenticated, ID:', user.id);

    // Fetch user's default group and mandate from view_leads_tagcrm
    const { data, error } = await supabase
      .from('view_leads_tagcrm')
      .select(`
        lead_id,
        rel_group_id,
        group_name,
        primary_inv_mandate,
        mandate_name
      `)
      .eq('lead_supabase_id', user.id)
      .single()

    console.log('🔄 getUserDefaultGroupMandate: Database query result:', { data, error });

    if (error) {
      console.error('❌ getUserDefaultGroupMandate: Database error:', error);
      return { group: null, mandate: null, error: 'Failed to fetch default group/mandate' }
    }

    if (!data) {
      console.log('❌ getUserDefaultGroupMandate: No data found for user:', user.id);
      return { group: null, mandate: null, error: 'No default group/mandate found' }
    }

    const result = {
      group: {
        id: data.rel_group_id,
        name: data.group_name
      },
      mandate: {
        id: data.primary_inv_mandate,
        name: data.mandate_name
      },
      error: null
    };

    console.log('✅ getUserDefaultGroupMandate: Successfully fetched:', result);
    return result;
  } catch (error) {
    console.error('❌ getUserDefaultGroupMandate: Unexpected error:', error);
    return { group: null, mandate: null, error: 'Failed to fetch default group/mandate' }
  }
}
