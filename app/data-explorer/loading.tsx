"use client"

import { Loader2 } from "lucide-react"

export default function DataExplorerLoading() {
  return (
    <div className="flex h-full min-h-[40vh] w-full items-center justify-center bg-black">
      <Loader2 className="h-10 w-10 animate-spin text-green-500" />
      <span className="ml-3 text-green-400">Loading Data Explorer&hellip;</span>
    </div>
  )
}
