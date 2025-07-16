import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function EmailCoverageCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Email Coverage</CardTitle>
        <CardDescription>Percentage of businesses with email addresses by industry</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Services</span>
            <span className="text-sm font-medium">54.2%</span>
          </div>
          <Progress value={54.2} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Manufacturing</span>
            <span className="text-sm font-medium">47.6%</span>
          </div>
          <Progress value={47.6} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Wholesale</span>
            <span className="text-sm font-medium">38.5%</span>
          </div>
          <Progress value={38.5} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Construction</span>
            <span className="text-sm font-medium">29.3%</span>
          </div>
          <Progress value={29.3} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Agriculture</span>
            <span className="text-sm font-medium">18.7%</span>
          </div>
          <Progress value={18.7} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
