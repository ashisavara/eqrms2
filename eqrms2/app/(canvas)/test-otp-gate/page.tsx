import { OtpConditionalVisibility } from '@/components/uiComponents/otp-conditional-visibility'

export default function TestOtpGatePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Premium Content Test</h1>
      
      <p className="text-gray-600 mb-8">
        This is a test page for the OTP conditional visibility component. 
        The content below is protected and will only be visible after OTP verification.
      </p>

      <OtpConditionalVisibility hvoc="test-page">
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            🎉 Protected Content Unlocked!
          </h2>
          <p className="text-green-700 mb-4">
            Congratulations! You've successfully verified your OTP and can now access this premium content.
          </p>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border border-green-300">
              <h3 className="font-semibold text-green-900 mb-2">Premium Insight #1</h3>
              <p className="text-gray-700">
                This could be exclusive market research, investment insights, or any premium content you want to gate.
              </p>
            </div>
            <div className="bg-white p-4 rounded border border-green-300">
              <h3 className="font-semibold text-green-900 mb-2">Premium Insight #2</h3>
              <p className="text-gray-700">
                The OTP verification ensures that users provide their contact information before accessing this content.
              </p>
            </div>
            <div className="bg-white p-4 rounded border border-green-300">
              <h3 className="font-semibold text-green-900 mb-2">Premium Insight #3</h3>
              <p className="text-gray-700">
                All leads are captured in the otp_hvoc table with name and phone number for follow-up.
              </p>
            </div>
          </div>
        </div>
      </OtpConditionalVisibility>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Enter your name and phone number (with country code, e.g., +91XXXXXXXXXX)</li>
          <li>Click "Send OTP" - you'll receive an OTP via WhatsApp</li>
          <li>Enter the OTP code and click "Verify"</li>
          <li>Once verified, the protected content above will be revealed</li>
          <li>Navigate away and come back - you'll need to verify again (no persistence)</li>
        </ol>
      </div>
    </div>
  )
}
