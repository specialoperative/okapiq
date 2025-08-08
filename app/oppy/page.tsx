"use client"

import { useState } from "react"
import type { CrawledBusiness } from "@/services/crawler-service"
import { CrawlerSearchForm } from "@/components/crawler-search-form"
import { CrawlerResults } from "@/components/crawler-results"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function OppyPage() {
  const [results, setResults] = useState<CrawledBusiness[]>([])
  const [searched, setSearched] = useState(false)

  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-white">OkapIQ</Link>
            <div className="flex items-center gap-3">
              <Link href="/solutions"><Button variant="outline" className="bg-transparent border-green-600 text-green-400 hover:bg-green-600 hover:text-white">Solutions</Button></Link>
              <Link href="/contact"><Button className="bg-green-600 hover:bg-green-700 text-white">Book a Demo</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-gradient-to-br from-gray-900 to-black py-12 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Oppy – Opportunity Finder</h1>
          <p className="text-gray-300 mt-4 text-lg max-w-3xl">Scan markets without API keys. Use mock public data to find SMB leads, score opportunities, and export CRM-ready lists.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        <CrawlerSearchForm onResultsFound={(r)=>{setResults(r); setSearched(true)}} />

        {searched && (
          <div>
            {results.length > 0 ? (
              <CrawlerResults results={results} />
            ) : (
              <div className="text-center py-16 bg-gray-900/40 rounded-lg border border-gray-800">
                <p className="text-gray-300">No results found. Try changing your filters.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}