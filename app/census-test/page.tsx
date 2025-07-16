import { CensusApiTest } from "@/components/census-api-test"
import { EnvCheck } from "@/components/env-check"

export default function CensusTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Census API Integration Test</h1>
      <div className="mb-6">
        <EnvCheck />
      </div>
      <CensusApiTest />
    </div>
  )
}
