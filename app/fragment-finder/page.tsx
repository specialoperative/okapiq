import Link from "next/link"
import FragmentAnalysisPage from "@/app/fragment-analysis/page"
import { Button } from "@/components/ui/button"

export default function FragmentFinderPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-white">Fragment Finder</h1>
          <p className="text-gray-300 mt-4 text-lg max-w-3xl">Roll-up targeting and fragmentation analysis using mock data with HHI/geo tools.
          </p>
        </div>
      </header>
      <main className="bg-black">
        <FragmentAnalysisPage />
      </main>
    </div>
  )
}