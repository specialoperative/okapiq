"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

const engagementData = [
  {
    platform: "Facebook",
    engagement: 68,
    industry: 42,
  },
  {
    platform: "Instagram",
    engagement: 75,
    industry: 58,
  },
  {
    platform: "Twitter",
    engagement: 45,
    industry: 38,
  },
  {
    platform: "LinkedIn",
    engagement: 62,
    industry: 45,
  },
  {
    platform: "Google Business",
    engagement: 82,
    industry: 65,
  },
]

const sentimentData = [
  {
    platform: "Facebook",
    positive: 65,
    neutral: 25,
    negative: 10,
  },
  {
    platform: "Instagram",
    positive: 78,
    neutral: 18,
    negative: 4,
  },
  {
    platform: "Twitter",
    positive: 52,
    neutral: 30,
    negative: 18,
  },
  {
    platform: "LinkedIn",
    positive: 70,
    neutral: 25,
    negative: 5,
  },
  {
    platform: "Google Business",
    positive: 68,
    neutral: 22,
    negative: 10,
  },
]

const growthData = [
  {
    month: "Jan",
    followers: 1200,
    engagement: 3.2,
  },
  {
    month: "Feb",
    followers: 1350,
    engagement: 3.5,
  },
  {
    month: "Mar",
    followers: 1500,
    engagement: 3.8,
  },
  {
    month: "Apr",
    followers: 1750,
    engagement: 4.2,
  },
  {
    month: "May",
    followers: 2100,
    engagement: 4.5,
  },
  {
    month: "Jun",
    followers: 2400,
    engagement: 4.8,
  },
]

export function SocialMediaMetrics() {
  return (
    <Tabs defaultValue="engagement" className="space-y-4">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="engagement">Engagement</TabsTrigger>
        <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
        <TabsTrigger value="growth">Growth Trends</TabsTrigger>
      </TabsList>

      <TabsContent value="engagement">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Engagement Metrics vs. Industry Average</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Engagement rate measures the level of audience interaction with social content. Higher engagement
              correlates with stronger customer relationships and brand loyalty.
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="engagement" name="Business Engagement %" fill="#22c55e" />
                <Bar dataKey="industry" name="Industry Average %" fill="#15803d" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="font-medium mb-2">Key Insights</h4>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Engagement exceeds industry average across all platforms
                  </li>
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Google Business shows strongest performance (82%)
                  </li>
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Twitter engagement needs improvement (45%)
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="font-medium mb-2">Business Impact</h4>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Strong engagement indicates healthy customer relationships
                  </li>
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Above-average metrics suggest effective content strategy
                  </li>
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    High Google engagement correlates with local market strength
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sentiment">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Sentiment Analysis by Platform</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Sentiment analysis measures the emotional tone of customer interactions. Positive sentiment indicates
              strong brand perception and customer satisfaction.
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={sentimentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="platform" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="positive" name="Positive %" fill="#22c55e" stackId="stack" />
                <Bar dataKey="neutral" name="Neutral %" fill="#94a3b8" stackId="stack" />
                <Bar dataKey="negative" name="Negative %" fill="#ef4444" stackId="stack" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="font-medium mb-2">Key Insights</h4>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Instagram shows highest positive sentiment (78%)
                  </li>
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Twitter has highest negative sentiment (18%)
                  </li>
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Overall positive sentiment averages 66.6% across platforms
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="font-medium mb-2">Business Impact</h4>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Strong positive sentiment indicates healthy brand perception
                  </li>
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Twitter sentiment suggests need for improved customer service
                  </li>
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Visual platforms (Instagram) show strongest customer affinity
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="growth">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Growth Trends (6-Month)</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Growth metrics track audience expansion and engagement improvement over time. Consistent growth indicates
              effective social strategy and increasing brand awareness.
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="followers" name="Followers" stroke="#22c55e" />
                <Line yAxisId="right" type="monotone" dataKey="engagement" name="Engagement Rate %" stroke="#15803d" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="font-medium mb-2">Key Insights</h4>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    100% follower growth over 6 months (1,200 to 2,400)
                  </li>
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    50% engagement rate improvement (3.2% to 4.8%)
                  </li>
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Consistent month-over-month growth in both metrics
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="font-medium mb-2">Business Impact</h4>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Strong growth trajectory indicates effective marketing
                  </li>
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Increasing engagement with larger audience shows content relevance
                  </li>
                  <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Growth pattern suggests sustainable customer acquisition strategy
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

