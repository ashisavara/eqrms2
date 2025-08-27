'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function OtpTestPage() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [devOtp, setDevOtp] = useState<string>()
  const [status, setStatus] = useState('')
  const [debugInfo, setDebugInfo] = useState('')
  const [whatsappStatus, setWhatsappStatus] = useState<string>('')
  const [userInfo, setUserInfo] = useState<string>('')
  
  const supabase = createClient()

  useEffect(() => {
    // Debug info to confirm the page is loading
    setDebugInfo(`Page loaded at: ${new Date().toISOString()}`)
    
    // Check if we can access Supabase
    const checkSupabase = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setDebugInfo(prev => `${prev}\nSupabase accessible. User: ${user ? 'Logged in' : 'Not logged in'}`)
      } catch (error) {
        setDebugInfo(prev => `${prev}\nSupabase error: ${error}`)
      }
    }
    
    checkSupabase()
  }, [supabase])

  const sendOtp = async () => {
    if (!phone) {
      setStatus('Please enter a phone number')
      return
    }

    setStatus('Sending OTP...')
    setWhatsappStatus('')
    
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, device_id: deviceId }),
      })
      
      const json = await res.json()
      
      if (!res.ok) {
        setStatus(`Error: ${json.error || 'Failed to send OTP'}`)
        return
      }

      setStatus('OTP sent! Check your WhatsApp (or see DEV OTP below)')
      setDevOtp(json.dev_otp)
      
      // Display WhatsApp delivery status
      if (json.whatsapp_sent) {
        setWhatsappStatus(`✅ WhatsApp sent successfully! Message ID: ${json.whatsapp_message_id}`)
      } else {
        setWhatsappStatus(`❌ WhatsApp delivery failed: ${json.whatsapp_error || 'Unknown error'}`)
      }
    } catch (error) {
      setStatus(`Error: ${error}`)
    }
  }

  const verifyOtp = async () => {
    if (!phone || !otp) {
      setStatus('Please enter both phone and OTP')
      return
    }

    setStatus('Verifying OTP...')
    
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, otp_code: otp, device_id: deviceId }),
      })
      
      const json = await res.json()
      
      if (!res.ok) {
        setStatus(`Error: ${json.error || 'verification failed'}`)
        return
      }

      // Create a real Supabase session using token_hash from admin.generateLink (email magic link flow)
      const tokenHash = json.token_hash as string
      const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'email' })
      
      if (error) {
        setStatus(`verifyOtp failed: ${error.message}`)
        return
      }

      // Show success with user info
      const userType = json.is_existing_user ? 'Existing user' : 'New user'
      const actionInfo = json.user_created ? ' (user created)' : ' (existing user logged in)'
      setStatus(`Signed in! ${userType}${actionInfo} - user_id: ${data.session?.user?.id}`)
      
      // Update debug info with user details
      setUserInfo(`User Type: ${userType}\nLogin Email: ${json.login_email}\nUser Created: ${json.user_created ? 'Yes' : 'No'}`)
    } catch (error) {
      setStatus(`Error: ${error}`)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setStatus('Signed out')
    setDevOtp(undefined)
    setOtp('')
    setUserInfo('')
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">OTP Test Login</h1>
      
      {/* Debug info */}
      <div className="text-xs bg-gray-100 p-2 rounded">
        <div className="font-semibold">Debug Info:</div>
        <pre className="whitespace-pre-wrap">{debugInfo}</pre>
      </div>

      {/* User Info */}
      {userInfo && (
        <div className="text-xs bg-blue-100 p-2 rounded">
          <div className="font-semibold">User Info:</div>
          <pre className="whitespace-pre-wrap">{userInfo}</pre>
        </div>
      )}

      <label className="block text-sm">Phone (E.164 recommended, eg. +91XXXXXXXXXX)</label>
      <input 
        className="border rounded w-full p-2" 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)} 
        placeholder="+91..." 
      />

      <label className="block text-sm mt-2">Device ID (optional)</label>
      <input 
        className="border rounded w-full p-2" 
        value={deviceId} 
        onChange={(e) => setDeviceId(e.target.value)} 
      />

      <button className="border rounded px-4 py-2 mt-2" onClick={sendOtp}>
        Send OTP
      </button>

      {devOtp && (
        <div className="mt-4 p-3 border rounded">
          <div className="text-sm opacity-70">DEV OTP (remove in prod):</div>
          <div className="text-xl font-mono">{devOtp}</div>
        </div>
      )}

      {whatsappStatus && (
        <div className="mt-4 p-3 border rounded">
          <div className="text-sm opacity-70">WhatsApp Status:</div>
          <div className="text-lg font-mono">{whatsappStatus}</div>
        </div>
      )}

      <label className="block text-sm mt-4">Enter OTP</label>
      <input 
        className="border rounded w-full p-2" 
        value={otp} 
        onChange={(e) => setOtp(e.target.value)} 
      />
      <button className="border rounded px-4 py-2 mt-2" onClick={verifyOtp}>
        Verify & Sign In
      </button>

      <div className="mt-4 text-sm">{status}</div>

      <button className="border rounded px-4 py-2 mt-6" onClick={logout}>
        Logout
      </button>
    </div>
  )
}