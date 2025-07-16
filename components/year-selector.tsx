"use client"

import { useCensus } from "@/contexts/census-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function YearSelector() {
  const { selectedYear, setSelectedYear, availableYears } = useCensus()

  return (
    <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value, 10))}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select year" />
      </SelectTrigger>
      <SelectContent>
        {availableYears.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

