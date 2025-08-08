"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function MiniLBO() {
  const [purchasePrice, setPurchasePrice] = useState(5000000)
  const [debtPct, setDebtPct] = useState(70)
  const [rate, setRate] = useState(9)
  const [ebitda, setEbitda] = useState(1000000)
  const [growth, setGrowth] = useState(10)
  const [exitMultiple, setExitMultiple] = useState(5)
  const [years, setYears] = useState(5)

  const result = useMemo(() => {
    const equityPct = (100 - debtPct) / 100
    const debtPctF = debtPct / 100
    const rateF = rate / 100
    const growthF = growth / 100
    const equity = purchasePrice * equityPct
    const debt = purchasePrice * debtPctF
    const debtService = debt * rateF

    let e = ebitda
    const cashFlows: number[] = []
    for (let y = 1; y <= years; y++) {
      e = e * (1 + (y === 1 ? 0 : growthF))
      cashFlows.push(Math.max(0, e - debtService))
    }
    const exitValue = e * exitMultiple

    // Simple IRR approximation via binary search
    function irr(cfs: number[], guess = 0.2) {
      let low = -0.99, high = 3, npv = (r: number) => cfs.reduce((s, cf, i) => s + cf / Math.pow(1 + r, i + 1), -equity)
      for (let i = 0; i < 60; i++) {
        const mid = (low + high) / 2
        const val = npv(mid) + exitValue / Math.pow(1 + mid, years)
        if (val > 0) low = mid; else high = mid
      }
      return ((low + high) / 2) * 100
    }

    const irrPct = irr(cashFlows)
    const equityMultiple = (cashFlows.reduce((a, b) => a + b, 0) + exitValue) / equity
    return { irrPct, equityMultiple, equity, debt, exitValue }
  }, [purchasePrice, debtPct, rate, ebitda, growth, exitMultiple, years])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mini LBO Model</CardTitle>
        <CardDescription>Quick IRR and equity multiple, entirely client-side</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="space-y-3">
          <label className="text-sm text-muted-foreground">Purchase Price ($)</label>
          <Input type="number" value={purchasePrice} onChange={e=>setPurchasePrice(Number(e.target.value)||0)} />
          <label className="text-sm text-muted-foreground">Debt %</label>
          <Input type="number" value={debtPct} onChange={e=>setDebtPct(Number(e.target.value)||0)} />
          <label className="text-sm text-muted-foreground">Interest Rate %</label>
          <Input type="number" value={rate} onChange={e=>setRate(Number(e.target.value)||0)} />
        </div>
        <div className="space-y-3">
          <label className="text-sm text-muted-foreground">EBITDA (TTM)</label>
          <Input type="number" value={ebitda} onChange={e=>setEbitda(Number(e.target.value)||0)} />
          <label className="text-sm text-muted-foreground">EBITDA Growth %</label>
          <Input type="number" value={growth} onChange={e=>setGrowth(Number(e.target.value)||0)} />
          <label className="text-sm text-muted-foreground">Exit Multiple (x)</label>
          <Input type="number" value={exitMultiple} onChange={e=>setExitMultiple(Number(e.target.value)||0)} />
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-500">Equity: ${result.equity.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Debt: ${result.debt.toLocaleString()}</div>
          <div className="text-lg font-semibold">IRR: {result.irrPct.toFixed(1)}%</div>
          <div className="text-lg font-semibold">Equity Multiple: {result.equityMultiple.toFixed(2)}x</div>
          <div className="text-sm text-gray-500">Exit Value: ${result.exitValue.toLocaleString()}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function DealPipeline() {
  const stages = ["Sourced", "Contacted", "NDA", "LOI", "Closed"]
  const [counts, setCounts] = useState([12, 7, 4, 2, 1])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Pipeline</CardTitle>
        <CardDescription>Fast Kanban-style overview (static data)</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-5">
        {stages.map((s, i) => (
          <div key={s} className="rounded-lg border border-gray-800 bg-gray-900/40 p-4">
            <div className="text-sm text-gray-400 mb-2">{s}</div>
            <div className="text-3xl font-bold text-white">{counts[i]}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function CIMGenerator() {
  const [name, setName] = useState("Sunshine HVAC, LLC")
  const [industry, setIndustry] = useState("HVAC")
  const [highlights, setHighlights] = useState("Recurring maintenance revenue, 20-year brand, dense ZIP coverage")

  const handleGenerate = () => {
    const content = `CIM – ${name}\nIndustry: ${industry}\nHighlights: ${highlights}\n\nFinancial Snapshot\n• Revenue: $1.2M (TTM)\n• EBITDA: $240k (20%)\n\nMarket\n• Fragmentation: High (HHI < 1500)\n• TAM (county): $87M\n` 
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${name.replace(/\s+/g, "_")}_CIM.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI CIM Generator (Stub)</CardTitle>
        <CardDescription>Exports a mock 1-pager without any API usage</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <label className="text-sm text-muted-foreground">Business Name</label>
        <Input value={name} onChange={e=>setName(e.target.value)} />
        <label className="text-sm text-muted-foreground">Industry</label>
        <Input value={industry} onChange={e=>setIndustry(e.target.value)} />
        <label className="text-sm text-muted-foreground">Highlights</label>
        <Input value={highlights} onChange={e=>setHighlights(e.target.value)} />
        <div>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleGenerate}>Generate 1-Pager</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AcquisitionAssistantPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-white">Acquisition Assistant</h1>
          <p className="text-gray-300 mt-4 text-lg max-w-3xl">Deal pipeline, CIMs, and IRR modeling—running locally with no external keys.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <Tabs defaultValue="pipeline">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="pipeline" className="data-[state=active]:bg-gray-800">Pipeline</TabsTrigger>
            <TabsTrigger value="lbo" className="data-[state=active]:bg-gray-800">Mini LBO</TabsTrigger>
            <TabsTrigger value="cim" className="data-[state=active]:bg-gray-800">CIM</TabsTrigger>
          </TabsList>
          <TabsContent value="pipeline"><DealPipeline /></TabsContent>
          <TabsContent value="lbo"><MiniLBO /></TabsContent>
          <TabsContent value="cim"><CIMGenerator /></TabsContent>
        </Tabs>
      </main>
    </div>
  )
}