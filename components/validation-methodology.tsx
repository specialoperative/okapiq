import { Card, CardContent } from "@/components/ui/card"
import { Check, AlertTriangle, Info } from "lucide-react"

export function ValidationMethodology() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Data Collection Process</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">1</span>
                </span>
                <div>
                  <p className="font-medium">Primary Source Integration</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Direct API connections to authoritative data sources including government databases, financial
                    institutions, and industry associations.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">2</span>
                </span>
                <div>
                  <p className="font-medium">Web Scraping & Monitoring</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Automated collection from public sources including company websites, social media, and online
                    directories with compliance safeguards.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">3</span>
                </span>
                <div>
                  <p className="font-medium">Proprietary Research</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Direct outreach and verification for high-value data points, particularly for financial metrics and
                    ownership information.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">4</span>
                </span>
                <div>
                  <p className="font-medium">Partner Network</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Data sharing agreements with industry partners including brokers, accountants, and financial
                    institutions with strict privacy controls.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Validation Techniques</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </span>
                <div>
                  <p className="font-medium">Multi-Source Verification</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Each data point is verified against at least 3 independent sources before inclusion, with confidence
                    scores assigned based on source reliability.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </span>
                <div>
                  <p className="font-medium">Statistical Validation</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Anomaly detection algorithms flag outliers for human review, with industry-specific thresholds for
                    key metrics like revenue and profitability.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </span>
                <div>
                  <p className="font-medium">Temporal Consistency</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Historical data analysis ensures consistency over time, with automated flagging of unexpected
                    changes in key metrics.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </span>
                <div>
                  <p className="font-medium">Expert Review</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Industry specialists review data for contextual accuracy, particularly for high-value acquisition
                    targets and complex industries.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Data Quality Assurance Framework</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="bg-green-100 p-1.5 rounded-full mr-2">
                  <Info className="h-4 w-4 text-green-600" />
                </div>
                <h4 className="font-medium">Accuracy Measures</h4>
              </div>
              <ul className="space-y-1 pl-8">
                <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">Source credibility scoring</li>
                <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">Cross-reference verification</li>
                <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">Industry benchmark comparison</li>
                <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">Historical trend analysis</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="bg-green-100 p-1.5 rounded-full mr-2">
                  <Info className="h-4 w-4 text-green-600" />
                </div>
                <h4 className="font-medium">Completeness Checks</h4>
              </div>
              <ul className="space-y-1 pl-8">
                <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">Required field validation</li>
                <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">
                  Industry-specific data requirements
                </li>
                <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">Time-series completeness</li>
                <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">Relationship validation</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="bg-green-100 p-1.5 rounded-full mr-2">
                  <Info className="h-4 w-4 text-green-600" />
                </div>
                <h4 className="font-medium">Timeliness Verification</h4>
              </div>
              <ul className="space-y-1 pl-8">
                <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">Recency timestamps</li>
                <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">Update frequency monitoring</li>
                <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">Source freshness assessment</li>
                <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">Change detection alerts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-800 dark:text-amber-400">Data Limitations Disclosure</h4>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              While OkapIQ maintains rigorous validation standards, users should be aware of inherent limitations in SMB
              data:
            </p>
            <ul className="mt-2 space-y-1 pl-5">
              <li className="text-sm text-amber-700 dark:text-amber-300 list-disc">
                Private company financial data may be self-reported and not audited
              </li>
              <li className="text-sm text-amber-700 dark:text-amber-300 list-disc">
                Industry classification systems have inherent overlaps and ambiguities
              </li>
              <li className="text-sm text-amber-700 dark:text-amber-300 list-disc">
                Rapid changes in business conditions may not be immediately reflected
              </li>
              <li className="text-sm text-amber-700 dark:text-amber-300 list-disc">
                Regional variations in data availability and quality exist
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
