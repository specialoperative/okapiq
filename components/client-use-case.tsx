import { Card, CardContent } from "@/components/ui/card"
import { Check, AlertTriangle, TrendingUp, BookOpen } from "lucide-react"

interface ClientUseCaseProps {
  title: string
  description: string
  challenges: string[]
  solutions: string[]
  keyMetrics: string[]
  caseStudy: {
    title: string
    content: string
  }
}

export function ClientUseCase({
  title,
  description,
  challenges,
  solutions,
  keyMetrics,
  caseStudy,
}: ClientUseCaseProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 p-2 rounded-full mr-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <h4 className="text-lg font-medium">Key Challenges</h4>
              </div>
              <ul className="space-y-3">
                {challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-amber-100 p-1 rounded-full mr-2 mt-0.5">
                      <span className="text-amber-600 text-xs font-bold">{index + 1}</span>
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="text-lg font-medium">OkapIQ Solutions</h4>
              </div>
              <ul className="space-y-3">
                {solutions.map((solution, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                      <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-medium">Case Study: {caseStudy.title}</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{caseStudy.content}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="text-lg font-medium">Key Metrics</h4>
            </div>
            <ul className="space-y-3">
              {keyMetrics.map((metric, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-purple-100 p-1 rounded-full mr-2 mt-0.5">
                    <span className="text-purple-600 text-xs font-bold">{index + 1}</span>
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{metric}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h4 className="text-lg font-medium mb-4">How OkapIQ Delivers Value for {title}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h5 className="font-medium mb-2">Data Advantage</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access to comprehensive data on 33.2M SMBs with proprietary metrics and insights not available from
                other sources. Census integration provides critical demographic context for strategic decision-making.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h5 className="font-medium mb-2">Time Efficiency</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Reduce research and due diligence time by up to 80% with pre-validated data and automated analysis.
                Focus efforts on high-potential opportunities identified through AI-powered matching algorithms.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h5 className="font-medium mb-2">Strategic Insights</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transform raw data into actionable intelligence with industry-specific analysis and benchmarking.
                Identify patterns and opportunities that competitors miss with fragment analysis and demographic
                correlation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
