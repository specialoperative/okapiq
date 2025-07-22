import Link from "next/link"
import { Users, PieChart, Globe, Database, Home } from "lucide-react"

export function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <span className="text-2xl font-bold text-okapiq-600">OkapIQ</span>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link
            href="/"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-okapiq-50 dark:hover:bg-gray-700"
          >
            <Home className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Dashboard
          </Link>
          <Link
            href="/data-validation"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-okapiq-50 dark:hover:bg-gray-700"
          >
            <Database className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Data Validation
          </Link>
          <Link
            href="/fragment-analysis"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-okapiq-50 dark:hover:bg-gray-700"
          >
            <PieChart className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Fragment Analysis
          </Link>
          <Link
            href="/social-media"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-okapiq-50 dark:hover:bg-gray-700"
          >
            <Globe className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Social Media Analysis
          </Link>
          <Link
            href="/client-use-cases"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-okapiq-50 dark:hover:bg-gray-700"
          >
            <Users className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Client Use Cases
          </Link>
        </nav>
      </div>
    </div>
  )
}
