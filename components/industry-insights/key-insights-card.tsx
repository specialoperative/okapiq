import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Mail, Users, Building } from "lucide-react"

export function KeyInsightsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Key Insights</CardTitle>
        <CardDescription>Actionable intelligence from our industry analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Growth Opportunities</h3>
            <p className="text-sm text-muted-foreground">
              Services sector shows 12% YoY growth with highest email coverage at 54.2%
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Email Penetration</h3>
            <p className="text-sm text-muted-foreground">
              624,574 businesses with email addresses out of 18.3M total businesses
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Target Demographics</h3>
            <p className="text-sm text-muted-foreground">
              Manufacturing businesses show highest correlation with urban population centers
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Building className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Industry Concentration</h3>
            <p className="text-sm text-muted-foreground">
              Top 3 industries represent 90.1% of businesses with email addresses
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
