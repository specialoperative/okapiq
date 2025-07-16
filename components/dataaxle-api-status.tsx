"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, RefreshCw, Building, Users } from "lucide-react"

export function DataAxleApiStatus() {
  const [status, setStatus] = useState<{
    checking: boolean
    peopleApiValid: boolean
    placesApiValid: boolean
  }>({
    checking: true,
    peopleApiValid: false,
    placesApiValid: false,
  })

  const checkApiTokens = async () => {
    setStatus((prev) => ({ ...prev, checking: true }))

    try {
      const response = await fetch("/api/dataaxle?action=check-tokens")
      const data = await response.json()

      setStatus({
        checking: false,
        peopleApiValid: data.peopleApiValid,
        placesApiValid: data.placesApiValid,
      })
    } catch (error) {
      console.error("Error checking DataAxle API tokens:", error)
      setStatus({
        checking: false,
        peopleApiValid: false,
        placesApiValid: false,
      })
    }
  }

  useEffect(() => {
    checkApiTokens()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          DataAxle API Status
          {status.checking && <RefreshCw className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">People API (e65ac1c780a)</p>
                <p className="text-sm text-muted-foreground">321,618,456 records</p>
              </div>
            </div>
            <Badge variant={status.checking ? "outline" : status.peopleApiValid ? "default" : "destructive"}>
              {status.checking ? (
                "Checking..."
              ) : status.peopleApiValid ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Not Connected
                </span>
              )}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Places API (a96078c5944)</p>
                <p className="text-sm text-muted-foreground">19,408,413 records</p>
              </div>
            </div>
            <Badge variant={status.checking ? "outline" : status.placesApiValid ? "default" : "destructive"}>
              {status.checking ? (
                "Checking..."
              ) : status.placesApiValid ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Not Connected
                </span>
              )}
            </Badge>
          </div>

          <div className="flex justify-end">
            <Button size="sm" onClick={checkApiTokens} disabled={status.checking}>
              {status.checking ? (
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
        </div>
      </CardContent>
    </Card>
  )
}
