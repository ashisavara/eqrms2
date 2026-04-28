'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export function CreateAccountButton({ phoneE164 }: { phoneE164: string }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleConfirm() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin-create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_e164: phoneE164 }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data?.error ?? 'Failed to create account')
        setIsLoading(false)
        return
      }

      toast.success('Account created successfully!')
      setOpen(false)
      setTimeout(() => router.refresh(), 1000)
    } catch {
      toast.error('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-center" />

      <span onClick={() => setOpen(true)} className="blue-hyperlink cursor-pointer">
        Create Account
      </span>

      {open && (
        <Sheet open={true} onOpenChange={(v) => !isLoading && setOpen(v)}>
          <SheetContent className="!w-[400px] !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Create Login Account</SheetTitle>
            </SheetHeader>

            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-700">
                This will create a new login account for:
              </p>
              <p className="text-sm font-bold">{phoneE164}</p>
              <p className="text-sm text-gray-500">
                Once created, the lead will be able to log in to the investor
                portal using this phone number via WhatsApp OTP.
              </p>
              <p className="text-sm text-amber-600 font-medium">
                If an account already exists for this number, you will be
                notified and no duplicate will be created.
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Creating...' : 'Confirm & Create'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}
