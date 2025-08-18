"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  ExternalLink,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  Users,
  Award,
  BarChart3,
  TrendingUp,
  TrendingDown,
  MapPin,
} from "lucide-react"
import type { CrawledBusiness } from "@/services/crawler-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CensusIntegration } from "@/components/census-integration"

interface CrawlerResultsProps {
  results: CrawledBusiness[]
}

export function CrawlerResults({ results }: CrawlerResultsProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<CrawledBusiness | null>(null)
  const [activeTab, setActiveTab] = useState("business")

  const formatCurrency = (value?: number) => {
    if (!value) return "Unknown"
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
      value,
    )
  }

  const renderArbitrageScore = (score?: number) => {
    if (!score) return "Unknown"

    let color, icon, label

    if (score < 0.8) {
      color = "bg-green-100 text-green-800 border-green-200"
      icon = <TrendingDown className="h-3.5 w-3.5 mr-1" />
      label = "Undervalued"
    } else if (score > 1.2) {
      color = "bg-red-100 text-red-800 border-red-200"
      icon = <TrendingUp className="h-3.5 w-3.5 mr-1" />
      label = "Overvalued"
    } else {
      color = "bg-yellow-100 text-yellow-800 border-yellow-200"
      icon = <BarChart3 className="h-3.5 w-3.5 mr-1" />
      label = "Fair value"
    }

    return (
      <Badge className={`${color} flex items-center font-normal`}>
        {icon}
        {label} ({score.toFixed(2)})
      </Badge>
    )
  }

  const renderFragmentationIndex = (index?: number) => {
    if (!index) return "Unknown"

    let color, label

    if (index > 80) {
      color = "bg-green-100 text-green-800 border-green-200"
      label = "Highly Fragmented"
    } else if (index < 60) {
      color = "bg-red-100 text-red-800 border-red-200"
      label = "Consolidated"
    } else {
      color = "bg-yellow-100 text-yellow-800 border-yellow-200"
      label = "Moderately Fragmented"
    }

    return (
      <Badge className={`${color} font-normal`}>
        {label} ({index}%)
      </Badge>
    )
  }

  const exportToCsv = () => {
    // Create CSV content
    const headers = [
      "Name",
      "Address",
      "Industry",
      "Estimated Revenue",
      "Employee Count",
      "Owner Name",
      "Owner Email",
      "Arbitrage Score",
      "Fragmentation Index",
    ]

    const rows = results.map((business) => [
      business.name,
      business.address,
      business.industry,
      business.estimatedRevenue || "",
      business.employeeCount || "",
      business.ownerName || "",
      business.ownerEmail || "",
      business.arbitrageScore || "",
      business.fragmentationIndex || "",
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "okapiq-smb-results.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Award className="h-6 w-6 text-green-600" />
            Found {results.length} matching SMBs
          </h2>
          <p className="text-muted-foreground">Click on a business to view detailed information</p>
        </div>
        <Button
          onClick={exportToCsv}
          variant="outline"
          className="flex items-center gap-2 border-green-200 hover:bg-green-50 hover:text-green-700"
        >
          <Download size={16} />
          Export to CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-4">
              <CardTitle className="text-green-800">SMB Results</CardTitle>
              <CardDescription>Businesses matching your search criteria</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Industry</TableHead>
                      <TableHead className="font-semibold">Est. Revenue</TableHead>
                      <TableHead className="font-semibold">Arbitrage</TableHead>
                      <TableHead className="font-semibold">Fragmentation</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((business, index) => (
                      <TableRow
                        key={index}
                        className={`cursor-pointer hover:bg-green-50 ${selectedBusiness === business ? "bg-green-50" : ""}`}
                        onClick={() => setSelectedBusiness(business)}
                      >
                        <TableCell className="font-medium">{business.name}</TableCell>
                        <TableCell>{business.industry}</TableCell>
                        <TableCell>{formatCurrency(business.estimatedRevenue)}</TableCell>
                        <TableCell>{renderArbitrageScore(business.arbitrageScore)}</TableCell>
                        <TableCell>{renderFragmentationIndex(business.fragmentationIndex)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-800 hover:bg-green-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedBusiness(business)
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {selectedBusiness && (
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-green-800">Business Details</CardTitle>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="business"
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                    >
                      Business
                    </TabsTrigger>
                    <TabsTrigger
                      value="census"
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                    >
                      Census Data
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-0">
                <TabsContent value="business" className="m-0">
                  <div className="p-6 space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="text-xl font-semibold text-green-800">{selectedBusiness.name}</h3>
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-green-500" />
                        {selectedBusiness.address}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Building className="h-4 w-4 text-green-500" />
                          Industry
                        </p>
                        <p className="font-medium">{selectedBusiness.industry}</p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-500" />
                          Founded
                        </p>
                        <p className="font-medium">{selectedBusiness.founded || "Unknown"}</p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          Revenue
                        </p>
                        <p className="font-medium">{formatCurrency(selectedBusiness.estimatedRevenue)}</p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-500" />
                          Employees
                        </p>
                        <p className="font-medium">{selectedBusiness.employeeCount || "Unknown"}</p>
                      </div>
                    </div>

                    {selectedBusiness.ownerName && (
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-500">Owner</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-medium">{selectedBusiness.ownerName}</p>
                          {selectedBusiness.ownerEmail && (
                            <a
                              href={`mailto:${selectedBusiness.ownerEmail}`}
                              className="text-green-600 hover:text-green-800 flex items-center gap-1"
                            >
                              <Mail size={16} />
                              Contact
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedBusiness.phone && (
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone size={16} className="text-green-500" />
                          <a href={`tel:${selectedBusiness.phone}`} className="text-green-600 hover:text-green-800">
                            {selectedBusiness.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {selectedBusiness.website && (
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-500">Website</p>
                        <div className="flex items-center gap-2 mt-1">
                          <ExternalLink size={16} className="text-green-500" />
                          <a
                            href={selectedBusiness.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800"
                          >
                            {selectedBusiness.website.replace("https://", "")}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-4 space-y-3">
                      <p className="text-sm font-medium text-gray-500">Market Intelligence</p>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-3 bg-green-50 rounded-md">
                          <p className="text-xs text-green-700 font-medium">Arbitrage Score</p>
                          <div className="mt-1">{renderArbitrageScore(selectedBusiness.arbitrageScore)}</div>
                          <p className="text-xs mt-2 text-gray-600">
                            {selectedBusiness.arbitrageScore && selectedBusiness.arbitrageScore < 0.8
                              ? "This business appears to be undervalued compared to industry averages."
                              : selectedBusiness.arbitrageScore && selectedBusiness.arbitrageScore > 1.2
                                ? "This business appears to be overvalued compared to industry averages."
                                : "This business is priced at fair market value."}
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-md">
                          <p className="text-xs text-green-700 font-medium">Fragmentation Index</p>
                          <div className="mt-1">{renderFragmentationIndex(selectedBusiness.fragmentationIndex)}</div>
                          <p className="text-xs mt-2 text-gray-600">
                            {selectedBusiness.fragmentationIndex && selectedBusiness.fragmentationIndex > 80
                              ? "Highly fragmented industry with many small players - ideal for roll-up strategy."
                              : selectedBusiness.fragmentationIndex && selectedBusiness.fragmentationIndex < 60
                                ? "Consolidated industry with few dominant players."
                                : "Moderately fragmented industry with acquisition opportunities."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="census" className="m-0">
                  <CensusIntegration selectedBusiness={selectedBusiness} />
                </TabsContent>
              </CardContent>
            </Card>
          )}

          {!selectedBusiness && (
            <Card className="border-0 shadow-md h-full">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-green-800">Business Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Building className="h-12 w-12 text-gray-300 mb-4" />
                  <p>Select a business to view details</p>
                  <p className="text-sm mt-2 max-w-xs">
                    Click on any row in the table to see detailed information about that business
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
