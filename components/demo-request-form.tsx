"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { scheduleDemo } from "@/app/actions/email-actions"
import { Loader2, Check } from "lucide-react"

export function DemoRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await scheduleDemo(formData)

      if (result.success) {
        setIsSuccess(true)
        // Reset form
        event.currentTarget.reset()
      } else {
        setError(result.error || "Something went wrong. Please try again.")
      }
    } catch (err) {
      setError("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {isSuccess ? (
        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Demo Request Received!</h3>
          <p className="text-gray-600">
            Thank you for your interest in OkapIQ. We've sent your demo request to our team. You'll receive an email
            shortly to schedule your personalized demo.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" name="name" placeholder="Enter your name" required className="mt-1" />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              defaultValue="osiris@rollupbiz.com"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" name="company" placeholder="Enter your company name" className="mt-1" />
          </div>

          {error && <div className="p-3 text-sm bg-red-50 border border-red-100 text-red-600 rounded-md">{error}</div>}

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Schedule My Demo"
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            By submitting this form, you'll get access to our database of 10,000+ qualified leads and comprehensive
            financial data from Reference USA.
          </p>
        </form>
      )}
    </div>
  )
}
