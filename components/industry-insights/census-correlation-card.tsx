import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CensusCorrelationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Census Correlation Insights</CardTitle>
        <CardDescription>Key demographic factors correlated with industry presence</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Services</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Urban Population</Badge>
            <Badge variant="outline">Higher Education</Badge>
            <Badge variant="outline">Median Income $75k+</Badge>
            <Badge variant="outline">Tech Adoption</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Manufacturing</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Suburban Areas</Badge>
            <Badge variant="outline">Transportation Hubs</Badge>
            <Badge variant="outline">Technical Education</Badge>
            <Badge variant="outline">Industrial Zoning</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Wholesale</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Logistics Centers</Badge>
            <Badge variant="outline">Interstate Proximity</Badge>
            <Badge variant="outline">Commercial Zoning</Badge>
            <Badge variant="outline">Business Districts</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Construction</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Population Growth</Badge>
            <Badge variant="outline">New Housing Permits</Badge>
            <Badge variant="outline">Infrastructure Spending</Badge>
            <Badge variant="outline">Trade Schools</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

