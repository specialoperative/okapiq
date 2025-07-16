import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const dataSources = [
  {
    name: "U.S. Census Bureau",
    type: "Primary",
    dataPoints: ["Demographics", "Industry Statistics", "Economic Indicators"],
    updateFrequency: "Quarterly",
    reliability: "Very High",
  },
  {
    name: "IRS Business Master File",
    type: "Primary",
    dataPoints: ["Tax Status", "Entity Type", "Revenue Classification"],
    updateFrequency: "Annually",
    reliability: "Very High",
  },
  {
    name: "SEC EDGAR Database",
    type: "Primary",
    dataPoints: ["Financial Filings", "Ownership Structure", "Corporate Events"],
    updateFrequency: "Real-time",
    reliability: "Very High",
  },
  {
    name: "Bureau of Labor Statistics",
    type: "Primary",
    dataPoints: ["Employment Data", "Wage Information", "Industry Trends"],
    updateFrequency: "Monthly",
    reliability: "High",
  },
  {
    name: "State Business Registries",
    type: "Primary",
    dataPoints: ["Registration Status", "Business Address", "Officer Information"],
    updateFrequency: "Monthly",
    reliability: "High",
  },
  {
    name: "D&B Business Directory",
    type: "Secondary",
    dataPoints: ["Credit Ratings", "Company Size", "Industry Classification"],
    updateFrequency: "Monthly",
    reliability: "Medium-High",
  },
  {
    name: "Social Media Platforms",
    type: "Secondary",
    dataPoints: ["Online Presence", "Customer Engagement", "Brand Sentiment"],
    updateFrequency: "Daily",
    reliability: "Medium",
  },
  {
    name: "Industry Associations",
    type: "Secondary",
    dataPoints: ["Membership Data", "Industry Standards", "Market Trends"],
    updateFrequency: "Quarterly",
    reliability: "Medium-High",
  },
  {
    name: "Company Websites",
    type: "Secondary",
    dataPoints: ["Service Offerings", "Team Information", "Pricing Data"],
    updateFrequency: "Variable",
    reliability: "Medium",
  },
  {
    name: "OkapIQ Proprietary Research",
    type: "Primary",
    dataPoints: ["Owner Demographics", "Acquisition Readiness", "Valuation Metrics"],
    updateFrequency: "Continuous",
    reliability: "High",
  },
]

export function DataSourcesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Source Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Key Data Points</TableHead>
          <TableHead>Update Frequency</TableHead>
          <TableHead>Reliability</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataSources.map((source) => (
          <TableRow key={source.name}>
            <TableCell className="font-medium">{source.name}</TableCell>
            <TableCell>
              <Badge variant={source.type === "Primary" ? "default" : "secondary"}>{source.type}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {source.dataPoints.map((point) => (
                  <Badge key={point} variant="outline" className="bg-gray-100 dark:bg-gray-800">
                    {point}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>{source.updateFrequency}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  source.reliability === "Very High"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : source.reliability === "High"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      : source.reliability === "Medium-High"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                }
              >
                {source.reliability}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

