'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { getUserServerAction, verifyOtpServerAction, logoutServerAction } from './otpServerActions'
import { useGroupMandate } from '@/lib/contexts/GroupMandateContext'

export default function OtpTestPage() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [status, setStatus] = useState('')
  const [whatsappStatus, setWhatsappStatus] = useState<string>('')
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  // Get the setDefaultGroupMandate function from context
  const { setDefaultGroupMandate } = useGroupMandate()

  useEffect(() => {
    // Check if we can access Supabase
    const checkSupabase = async () => {
      try {
        const { user } = await getUserServerAction()
        if (user) {
          setCurrentUser(user)
          setStatus(`Already logged in as: ${user.email}`)
        }
      } catch (error) {
        console.error('Supabase connection error:', error)
      }
    }
    
    checkSupabase()
  }, [])

  const sendOtp = async () => {
    if (!phone) {
      setStatus('Please enter a phone number')
      return
    }

    setIsLoading(true)
    setStatus('Sending OTP...')
    setWhatsappStatus('')
    setOtp('') // Clear any previous OTP
    
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone }),
      })
      
      const json = await res.json()
      
      if (!res.ok) {
        setStatus(`Error: ${json.error || 'Failed to send OTP'}`)
        return
      }

      setStatus('OTP sent! Check your WhatsApp')
      setOtpSent(true) // Show OTP input section
      
      // Display WhatsApp delivery status
      if (json.whatsapp_sent) {
        setWhatsappStatus(`✅ WhatsApp sent successfully!`)
      } else {
        setWhatsappStatus(`❌ WhatsApp delivery failed: ${json.whatsapp_error || 'Unknown error'}`)
      }
    } catch (error) {
      setStatus(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Call server action to logout from Supabase
      const result = await logoutServerAction()
      
      if (result.error) {
        console.error('Logout error:', result.error)
        // Still clear local state even if server logout fails
      }
      
      // Clear local state
      setCurrentUser(null)
      setStatus('')
      setWhatsappStatus('')
      setOtpSent(false)
      setPhone('')
      setOtp('')
      
      // Redirect to refresh the page
      window.location.href = '/auth/otp-login'
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local state even if there's an error
      setCurrentUser(null)
      setStatus('')
      setWhatsappStatus('')
      setOtpSent(false)
      setPhone('')
      setOtp('')
    }
  }

  const verifyOtp = async () => {
    if (!phone || !otp) {
      setStatus('Please enter both phone and OTP')
      return
    }

    setIsLoading(true)
    setStatus('Verifying OTP...')
    
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, otp_code: otp }),
      })
      
      const json = await res.json()
      
      if (!res.ok) {
        setStatus(`Error: ${json.error || 'verification failed'}`)
        return
      }

      // Create a real Supabase session using token_hash from admin.generateLink (email magic link flow)
      const tokenHash = json.token_hash as string
      const { data, error } = await verifyOtpServerAction(tokenHash)
      
      if (error) {
        setStatus(`verifyOtp failed: ${error}`)
        return
      }

      // Set default group/mandate from database on successful login
      setStatus('Logging in...')
      try {
        const result = await setDefaultGroupMandate()
        
        if (result.success) {
          console.log('✅ Default group/mandate set successfully:', result.group, result.mandate)
        } else {
          console.warn('⚠️ Failed to set default group/mandate:', result.error)
        }
      } catch (error) {
        console.error('❌ Error setting default group/mandate:', error)
      }

      // Show success and redirect to investments
      const userType = json.is_existing_user ? 'Existing user' : 'New user'
      const actionInfo = json.user_created ? ' (user created)' : ' (existing user logged in)'
      setStatus(`Signed in! ${userType}${actionInfo} - Setting up defaults...`)
      
      // Reset OTP sent state
      setOtpSent(false)
      
      // Redirect to investments page after successful login
      setTimeout(() => {
        window.location.href = '/investments'
      }, 500) // Back to 0.5 second delay
      
    } catch (error) {
      setStatus(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            WhatsApp OTP Login
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentUser ? (
            /* Logged In State - Show Logout Button */
            <div className="space-y-4">
              
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="w-full"
              >
                Logout
              </Button>
            </div>
          ) : (
            /* Logged Out State - Show OTP Form */
            <>
              {/* Phone Number Section */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                  className="w-full"
                />
                {/* Only show Send OTP button if OTP hasn't been sent yet */}
                {!otpSent && (
                  <Button 
                    onClick={sendOtp} 
                    className="w-full"
                    disabled={!phone.trim() || isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </Button>
                )}
              </div>

              {/* OTP Section - Only show after OTP is sent */}
              {otpSent && (
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP from WhatsApp"
                    className="w-full"
                    maxLength={6}
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={verifyOtp} 
                      className="flex-1"
                      disabled={!otp.trim() || isLoading}
                    >
                      {isLoading ? 'Verifying...' : 'Sign In'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setOtpSent(false)
                        setOtp('')
                        setStatus('')
                        setWhatsappStatus('')
                      }}
                    >
                      Change Phone
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Status Messages */}
          {status && (
            <div className="p-3 rounded-lg border bg-orange-50 border-orange-200">
              <div className="text-sm text-orange-700">{status}</div>
            </div>
          )}

          {/* WhatsApp Status */}
          {whatsappStatus && (
                <div className="p-3 rounded-lg border bg-green-50 border-green-200">
                  <div className="text-green-900 text-sm">{whatsappStatus}</div>
                </div>
              )}
        </CardContent>
      </Card>
    </div>
  )
}