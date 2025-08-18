import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialMediaOverview } from "@/components/social-media-overview"
import { SocialMediaMetrics } from "@/components/social-media-metrics"
import { SocialMediaInsights } from "@/components/social-media-insights"

export default function SocialMediaPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Social Media Analysis</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Analysis Framework</CardTitle>
              <CardDescription>Comprehensive assessment of SMB social media presence and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                OkapIQ's social media analysis provides a comprehensive assessment of an SMB's online presence,
                engagement metrics, and brand sentiment. By analyzing social media data, we can identify valuable
                insights about customer relationships, market positioning, and growth potential.
              </p>
              <SocialMediaOverview />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Metrics</CardTitle>
              <CardDescription>Key performance indicators across social platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <SocialMediaMetrics />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Insights</CardTitle>
              <CardDescription>Strategic implications of social media analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <SocialMediaInsights />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
