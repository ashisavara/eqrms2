'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { getUserServerAction, verifyOtpServerAction, logoutServerAction } from './otpServerActions'
import { useGroupMandate } from '@/lib/contexts/GroupMandateContext'
import Section from "@/components/uiComponents/section"
import ImageTextBox from "@/components/uiComponents/image-text-box"
import YouTube from "@/components/uiComponents/youtube"
import PageTitle from "@/components/uiComponents/page-title"
import SectionTextHighlight from "@/components/uiComponents/section-text-highlight"
import AlertBox from "@/components/uiBlocks/AlertBox"

export default function RMSLandingPage() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [status, setStatus] = useState('')
  const [whatsappStatus, setWhatsappStatus] = useState<string>('')
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  // Get the setDefaultGroupMandate function from context
  const { setDefaultGroupMandate } = useGroupMandate()

  // E.164 phone number validation
  const isValidE164 = (phone: string): boolean => {
    // E.164 format: + followed by 10-15 digits total
    const e164Regex = /^\+[1-9]\d{9,14}$/
    return e164Regex.test(phone.trim())
  }

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
      window.location.href = '/app'
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local state even if there's an error
      setCurrentUser(null)
      setStatus('')
      setWhatsappStatus('')
      setOtpSent(false)
      setPhone('')
      setOtp('')
      // Still redirect even if there's an error
      window.location.href = '/app'
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
      setStatus(`Signed in! ${userType} - Loading...`)
      
      // Reset OTP sent state
      setOtpSent(false)
      
      // Redirect to investments page after successful login
      setTimeout(() => {
        window.location.href = '/investments'
      }, 100) // Back to 0.5 second delay
      
    } catch (error) {
      setStatus(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* RMS Page Content */}
      <PageTitle 
        title="IME RMS (Research Management Solution)" 
        caption="The 1st tool every to give you direct access to detailed rating rationales on investment funds." 
      />
      
      <Section className="py-6">
        <div className="ime-grid-2col">
          <div>
          <Card className="w-full max-w-md">
        <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-gray-700">
            IME RMS: Login / Sign-up
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
                <Label htmlFor="phone">Phone Number (with country code)</Label>
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
                    disabled={!isValidE164(phone) || isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send OTP (WhatsApp)'}
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

        </CardContent>
      </Card>
          </div>
          <div className="border border-gray-800 rounded-md"><YouTube url="https://youtu.be/3WnkkjU5S0g" /></div>
        </div>
      </Section>

      <Section className="bg-blue-50">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/weak-flow-down-insights.png"
                heading="The problem we help solve"
                imgSide="left"
            >
                <p>In traditional wealth management, investors <b>depend on their relationship managers</b> for investment advice - these are sales-persons with targets, incentives and clear conflicts of interest. </p>
                <p>Additionally, <b>important insights get lost,</b> as views flow down multiple levels from fund managers, to central research teams, to relationship managers and finally to you, the end investor.</p>
                <p> By giving you <b>direct access</b> to the detailed ratings & rationales of IME's central research team, the IME RMS helps ensure a <b>single point-of-truth</b> and ensures that <b>investment advice is driven by research</b>, and not sales.</p>
            </ImageTextBox>
        </Section>

        <Section>
       <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-12 py-12">
        <div className="w-full md:w-[400px] md:min-w-[200px] md:flex-shrink-0 text-center my-auto"> 
            <h2 className="bg-white">Unmatched Transparency</h2>
            <p>Gain <b>direct access</b> to the <b>detailed rating rationales</b> across an exhaustive universe of MFs, PMSs, AIFs & Global Funds. <br /><br /> The <b>first-time ever</b> an investments firm is making publicly available the thoughts that go behind fund recommendations - ensuring a <b>single-point-of truth</b> and investment advice driven by research, not sales.</p>
            
           
        </div>
        <div className="w-full md:flex-1">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-auto rounded-lg shadow-lg"
          >
            <source src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/IME%20RMS%20Rating%20Demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>        
        </div>
        </Section>

        <Section className="bg-gray-50">
       <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-12 py-12">
        <div className="w-full md:flex-1">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-auto rounded-lg shadow-lg"
          >
            <source src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/Mandate%20Gif.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>  
        <div className="w-full md:w-[400px] md:min-w-[200px] md:flex-shrink-0 text-center my-auto"> 
            <h2 className="bg-gray-50">True Customisation</h2>
            <p>The <b>IME Investment Mandate </b> helps you move <b>from the confusion</b> of too many investment option <b>to clarity </b>on the specific categories  that are tailor-made to your unique needs. <br/><br/> Your Mandate is developed in consultation with an <b>IME Private Banker</b>, on the basis of a <b>detailed evaluation</b> of your risk-profile, financial plan, preferences, beliefs, and other needs.</p>
        </div>      
        </div>
        </Section>
      <SectionTextHighlight color="blue">
        <p>We offer a no-commitment free 15-Day Trial of the IME RMS, which includes access to a Dedicated Private Banker who can help build your customised Financial Plan & Investment Mandate, and review your existing portfolio. </p>
        <p>Sign-up today to experience the difference of direct access to central research insights makes to your wealth creation journey! </p>
      </SectionTextHighlight>
    </div>
  )
}
