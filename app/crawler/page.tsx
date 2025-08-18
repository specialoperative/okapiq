"use client"

import { useState } from "react"
import { CrawlerSearchForm } from "@/components/crawler-search-form"
import { CrawlerResults } from "@/components/crawler-results"
import type { CrawledBusiness } from "@/services/crawler-service"
import { Building, Search, Users, Mail, BarChart3 } from "lucide-react"

export default function CrawlerPage() {
  const [results, setResults] = useState<CrawledBusiness[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleResultsFound = (newResults: CrawledBusiness[]) => {
    setResults(newResults)
    setHasSearched(true)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700">
          OkapIQ SMB Intelligence
        </h1>
        <p className="text-xl text-gray-600 mt-4">Find, analyze, and target SMBs for any business need</p>
      </div>

      <CrawlerSearchForm onResultsFound={handleResultsFound} />

      {hasSearched && (
        <div className="mt-8">
          {results.length > 0 ? (
            <CrawlerResults results={results} />
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-700">No businesses found</p>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                No businesses match your search criteria. Try adjusting your filters or selecting a different industry.
              </p>
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">How Different Teams Use OkapIQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="bg-white p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-green-800">Marketing Teams</h3>
              <p className="text-gray-600 mt-2">
                Build targeted email lists and segment prospects by industry, size, and location
              </p>
            </div>

            <div className="text-center p-6 bg-emerald-50 rounded-lg">
              <div className="bg-white p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-emerald-800">Business Development</h3>
              <p className="text-gray-600 mt-2">Identify potential clients and connect with decision-makers directly</p>
            </div>

            <div className="text-center p-6 bg-teal-50 rounded-lg">
              <div className="bg-white p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Building className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-medium text-teal-800">PE Firms & Search Funds</h3>
              <p className="text-gray-600 mt-2">Discover acquisition targets and analyze market fragmentation</p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="bg-white p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-green-800">Market Researchers</h3>
              <p className="text-gray-600 mt-2">Analyze industry trends and generate competitive intelligence</p>
            </div>
          </div>

          <div className="mt-12 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4">What You Can Do With OkapIQ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full mt-1">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Find businesses by specific criteria</p>
                  <p className="text-sm text-gray-600">
                    Filter by industry, location, revenue, employee count and more
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full mt-1">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Access verified contact information</p>
                  <p className="text-sm text-gray-600">Get phone numbers, email addresses, and social profiles</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full mt-1">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Analyze market intelligence</p>
                  <p className="text-sm text-gray-600">View industry fragmentation and business metrics</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full mt-1">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Export data for your workflows</p>
                  <p className="text-sm text-gray-600">Download results as CSV for use in your existing tools</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
