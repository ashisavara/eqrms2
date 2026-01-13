'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface OtpConditionalVisibilityProps {
  children: React.ReactNode;
}

export function OtpConditionalVisibility({ children }: OtpConditionalVisibilityProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')

  // E.164 phone number validation
  const isValidE164 = (phone: string): boolean => {
    // E.164 format: + followed by 10-15 digits total
    const e164Regex = /^\+[1-9]\d{9,14}$/
    return e164Regex.test(phone.trim())
  }

  const sendOtp = async () => {
    if (!name.trim()) {
      setStatus('Please enter your name')
      return
    }

    if (!phone) {
      setStatus('Please enter a phone number')
      return
    }

    if (!isValidE164(phone)) {
      setStatus('Please enter a valid phone number with country code (e.g., +91XXXXXXXXXX)')
      return
    }

    setIsLoading(true)
    setStatus('Sending OTP...')
    setOtp('') // Clear any previous OTP
    
    try {
      const res = await fetch('/api/send-otp-hvoc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone_number: phone,
          lead_name: name.trim()
        }),
      })
      
      const json = await res.json()
      
      if (!res.ok) {
        setStatus(`Error: ${json.error || 'Failed to send OTP'}`)
        return
      }

      setStatus('OTP sent! Check your WhatsApp')
      setOtpSent(true) // Show OTP input section
      
    } catch (error) {
      setStatus(`Error: ${error}`)
    } finally {
      setIsLoading(false)
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
      const res = await fetch('/api/verify-otp-hvoc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, otp_code: otp }),
      })
      
      const json = await res.json()
      
      if (!res.ok) {
        setStatus(`Error: ${json.error || 'verification failed'}`)
        return
      }

      // Verification successful!
      setStatus('Verified! Loading content...')
      setIsVerified(true)
      
    } catch (error) {
      setStatus(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  // If verified, show the protected content
  if (isVerified) {
    return <>{children}</>
  }

  // Otherwise, show the OTP form
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      {!otpSent ? (
        // Name + Phone inputs + Send OTP button
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name"
            type="text" 
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
          <Label htmlFor="phone">Phone Number (with country code)</Label>
          <Input 
            id="phone"
            type="tel" 
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full"
          />
          <Button 
            onClick={sendOtp}
            disabled={!name.trim() || !isValidE164(phone) || isLoading}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send OTP (WhatsApp)'}
          </Button>
        </div>
      ) : (
        // OTP input + Verify button + Change Phone button
        <div className="space-y-2">
          <Label htmlFor="otp">Enter OTP</Label>
          <Input 
            id="otp"
            type="text" 
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP from WhatsApp"
            className="w-full"
          />
          <div className="flex gap-2">
            <Button 
              onClick={verifyOtp}
              disabled={!otp.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setOtpSent(false)
                setOtp('')
                setStatus('')
              }}
            >
              Change Details
            </Button>
          </div>
        </div>
      )}
      {status && (
        <div className="p-3 rounded-lg border bg-orange-50 border-orange-200">
          <div className="text-sm text-orange-700">{status}</div>
        </div>
      )}
    </div>
  )
}
