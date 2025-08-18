import { AlertTriangle, TrendingUp } from "lucide-react"

const insights = [
  {
    id: 1,
    title: "Healthcare SMBs showing strong acquisition potential",
    description:
      "87% of dental practices are solo-owned with owners averaging 58 years old, indicating high acquisition potential in the next 5-10 years.",
    type: "opportunity",
    date: "2 hours ago",
  },
  {
    id: 2,
    title: "Food & Beverage sector facing valuation challenges",
    description:
      "60% of restaurants change ownership within 5 years, but 80% lack transferable digital records, creating pricing uncertainty.",
    type: "warning",
    date: "1 day ago",
  },
  {
    id: 3,
    title: "Logistics industry fragmentation increasing",
    description:
      "Trucking SMBs show 45% underreporting of fleet utilization, creating opportunities for consolidation and operational improvements.",
    type: "opportunity",
    date: "2 days ago",
  },
  {
    id: 4,
    title: "E-commerce acquisition fraud risk rising",
    description:
      "33% of Amazon FBA listings inflate revenue by 50%+, requiring enhanced due diligence during acquisitions.",
    type: "warning",
    date: "3 days ago",
  },
]

export function RecentInsights() {
  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <div key={insight.id} className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="mt-0.5">
            {insight.type === "opportunity" ? (
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium">{insight.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{insight.description}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{insight.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
