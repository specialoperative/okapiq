export default function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 h-40 bg-muted rounded animate-pulse"></div>
        <div className="h-40 bg-muted rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
        ))}
      </div>

      <div className="h-10 w-full bg-muted rounded animate-pulse mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-80 bg-muted rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}

