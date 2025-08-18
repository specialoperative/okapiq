import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentActivities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "added",
    target: "500 new SMBs in the tech sector",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "updated",
    target: "financial data for 1000+ companies",
    time: "4 hours ago",
  },
  {
    id: 3,
    user: {
      name: "Bob Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "generated",
    target: "Q3 SMB Growth Report",
    time: "1 day ago",
  },
  {
    id: 4,
    user: {
      name: "Alice Brown",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "integrated",
    target: "new Census data for better insights",
    time: "2 days ago",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {recentActivities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name} {activity.action} <span className="font-bold">{activity.target}</span>
            </p>
            <p className="text-sm text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
