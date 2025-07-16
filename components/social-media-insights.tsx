import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, TrendingUp, Award, Users } from "lucide-react"

export function SocialMediaInsights() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Valuation Impact</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our analysis reveals significant correlations between social media metrics and business valuation:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium">EBITDA Multiple Enhancement</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SMBs with top-quartile social engagement command 0.5-1.2x higher EBITDA multiples compared to
                    industry averages.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium">Customer Retention Correlation</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Positive social sentiment correlates with 22% higher customer retention rates, directly impacting
                    recurring revenue valuation.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium">Acquisition Attractiveness</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    91% of PE firms and strategic buyers cite social media presence as a factor in acquisition
                    screening.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Competitive Positioning</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Social media analysis provides critical insights into competitive positioning and market differentiation:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium">Share of Voice</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Quantitative analysis of brand mentions relative to competitors reveals market positioning and
                    awareness gaps.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium">Sentiment Differential</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Comparative sentiment analysis identifies reputation advantages and vulnerabilities relative to
                    competitors.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium">Content Effectiveness</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Analysis of engagement by content type reveals differentiation opportunities and messaging
                    effectiveness.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">Customer Insights</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Social media data provides valuable insights into customer demographics, preferences, and behavior patterns:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h4 className="font-medium mb-2">Demographic Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Platform-specific audience demographics reveal customer age, location, and professional characteristics.
                This data helps identify target market alignment and expansion opportunities.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h4 className="font-medium mb-2">Preference Mapping</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Content engagement patterns reveal customer preferences, pain points, and decision factors. This insight
                enables more effective marketing and product development strategies.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h4 className="font-medium mb-2">Loyalty Indicators</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Repeat engagement, advocacy behavior, and sentiment trends provide predictive indicators of customer
                loyalty and lifetime value potential.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-800 dark:text-amber-400">Risk Assessment</h4>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Social media analysis also identifies potential risks and vulnerabilities:
            </p>
            <ul className="mt-2 space-y-1 pl-5">
              <li className="text-sm text-amber-700 dark:text-amber-300 list-disc">
                <strong>Reputation Vulnerabilities:</strong> Negative sentiment patterns or recurring customer
                complaints that could impact brand value
              </li>
              <li className="text-sm text-amber-700 dark:text-amber-300 list-disc">
                <strong>Response Deficiencies:</strong> Slow or inadequate response to customer inquiries or complaints
              </li>
              <li className="text-sm text-amber-700 dark:text-amber-300 list-disc">
                <strong>Competitive Threats:</strong> Emerging competitors gaining social traction or shifting customer
                sentiment
              </li>
              <li className="text-sm text-amber-700 dark:text-amber-300 list-disc">
                <strong>Content Gaps:</strong> Missing or underperforming content types that competitors are leveraging
                effectively
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

