import { NextResponse, type NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const csv = body?.csv as string | undefined
    const url = body?.url as string | undefined

    const raw = csv ?? (url ? await (await fetch(url)).text() : undefined)
    if (!raw) return NextResponse.json({ error: "csv or url is required" }, { status: 400 })

    const rows = parseCsv(raw)
    const headers = rows.shift() || []
    const out = rows.map((r) => mapRow(headers, r))

    return NextResponse.json({ results: out })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 })
  }
}

function parseCsv(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  return lines.map((l) => l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((s) => s.replace(/^\"|\"$/g, "")))
}

function mapRow(headers: string[], row: string[]) {
  const get = (name: string) => row[headers.findIndex((h) => h.toLowerCase() === name.toLowerCase())]

  const businessName = get("Business Name") || get("business_name") || get("BorrowerName") || "Unknown"
  const zip = get("Zip") || get("ZIP") || get("ZipCode") || get("zip")
  const naics = get("NAICS") || get("Naics")
  const loanAmountStr = get("Loan Amount") || get("loan_amount") || "0"
  const loanAmount = Number(loanAmountStr.replace(/[^0-9.]/g, "")) || 0
  const loanYear = Number((get("Loan Date") || get("DisbursementDate") || "").slice(0, 4)) || 0
  const ownerAge = Number(get("OwnerAge") || 0)
  const status = (get("Status") || get("LoanStatus") || "").toLowerCase()

  const succession = successionScore(loanYear, ownerAge)
  const riskBump = ["default", "charged off"].includes(status) ? 15 : 0
  const succession_score = Math.min(100, succession + riskBump)

  return {
    business_name: businessName,
    zip,
    naics,
    loan_amount: loanAmount,
    loan_year: loanYear,
    owner_age: ownerAge || undefined,
    loan_status: status || undefined,
    succession_score,
  }
}

function successionScore(loanYear: number, ownerAge?: number): number {
  const ageScore = ownerAge && ownerAge > 60 ? 20 : 0
  const yearScore = loanYear && loanYear < 2015 ? 20 : 0
  return 60 + ageScore + yearScore
}