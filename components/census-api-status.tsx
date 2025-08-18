"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

export function CensusApiStatus() {
  const [status, setStatus] = useState<"checking" | "available" | "unavailable">("checking")
  const [message, setMessage] = useState<string>("")

  const checkApiKey = async () => {
    setStatus("checking")

    try {
      const response = await fetch("/api/census?checkApiKey=true")
      const data = await response.json()

      if (data.success) {
        setStatus("available")
        setMessage("Census API key is configured and working properly")
      } else {
        setStatus("unavailable")
        setMessage(data.error || "Census API key is missing or invalid")
      }
    } catch (error) {
      setStatus("unavailable")
      setMessage("Failed to check Census API status")
    }
  }

  useEffect(() => {
    checkApiKey()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Census API Status
          {status === "checking" && <RefreshCw className="h-4 w-4 animate-spin" />}
          {status === "available" && <CheckCircle className="h-4 w-4 text-green-500" />}
          {status === "unavailable" && <AlertCircle className="h-4 w-4 text-red-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <Badge variant={status === "available" ? "default" : status === "checking" ? "outline" : "destructive"}>
              {status === "available" ? "Connected" : status === "checking" ? "Checking..." : "Not Connected"}
            </Badge>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          </div>
          <Button size="sm" onClick={checkApiKey} disabled={status === "checking"}>
            {status === "checking" ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Check Again
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
