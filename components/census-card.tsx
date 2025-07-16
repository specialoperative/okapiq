"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, TrendingUp, DollarSign, Users } from "lucide-react"

export function CensusCard() {
  return (
    <Card className="shadow-md border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white pb-4">
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Census-Powered Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-3 rounded-full mt-1">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Age Demographics</h3>
              <p className="text-sm text-gray-600 mt-1">
                Identify areas with higher business owner retirement potential
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-3 rounded-full mt-1">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Income Analysis</h3>
              <p className="text-sm text-gray-600 mt-1">Determine optimal pricing based on local income levels</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-3 rounded-full mt-1">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Market Fragmentation</h3>
              <p className="text-sm text-gray-600 mt-1">Predict industry fragmentation based on census demographics</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-3 rounded-full mt-1">
              <Map className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Marketing Insights</h3>
              <p className="text-sm text-gray-600 mt-1">Calculate recommended marketing spend for each location</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
