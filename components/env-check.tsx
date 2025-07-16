"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export function EnvCheck() {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null)

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/check-env")
        const data = await response.json()
        setHasApiKey(data.hasCensusApiKey)
      } catch (error) {
        console.error("Error checking environment variables:", error)
        setHasApiKey(false)
      }
    }

    checkApiKey()
  }, [])

  if (hasApiKey === null) {
    return null
  }

  if (hasApiKey) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>Census API Key Configured</AlertTitle>
        <AlertDescription>
          The Census API key is properly configured. The application can make API calls to the Census Bureau.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Census API Key Missing</AlertTitle>
      <AlertDescription>
        The Census API key is not configured. Please set the CENSUS_API_KEY environment variable to enable Census API
        integration.
      </AlertDescription>
    </Alert>
  )
}
