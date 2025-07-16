import { Card, CardContent } from "@/components/ui/card"
import { Facebook, Twitter, Linkedin, Instagram, Star } from "lucide-react"

export function SocialMediaOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Why Social Media Matters</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Social media presence has become a critical indicator of SMB health, customer relationships, and brand
            value. Our analysis reveals that:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                SMBs with strong social engagement sell for 0.5-1.2x higher EBITDA multiples
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                91% of buyers research SMBs on social media before acquisition
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                Social sentiment correlates with customer retention at 78% accuracy
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                Negative review response time predicts operational efficiency with 65% accuracy
              </span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4">What We Analyze</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Facebook className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Facebook</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Engagement, reviews, response time</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-start space-x-3">
                <div className="bg-sky-100 p-2 rounded-full">
                  <Twitter className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Twitter</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mentions, sentiment, response rate</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-start space-x-3">
                <div className="bg-pink-100 p-2 rounded-full">
                  <Instagram className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Instagram</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Visual content, audience demographics</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Linkedin className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">LinkedIn</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Professional network, employee activity
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-start space-x-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Review Sites</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Google, Yelp, industry-specific reviews
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Social Media Analysis Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2">Data Collection</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                API integration with major platforms
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Historical data analysis (36 months)
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Competitor benchmarking
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Industry-specific metrics
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Analysis Techniques</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Sentiment analysis (NLP)
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Engagement trend modeling
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Response time assessment
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Content effectiveness scoring
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Business Impact Assessment</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Customer acquisition correlation
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Brand equity valuation
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Crisis vulnerability assessment
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Growth opportunity identification
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

