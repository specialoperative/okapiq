import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataAxleApiStatus } from "@/components/dataaxle-api-status"
import { BusinessSearch } from "@/components/business-search"
import { PeopleSearch } from "@/components/people-search"

export default function DataExplorerPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Data Explorer</h1>
        <p className="text-muted-foreground">Search and explore data from DataAxle's People and Places databases</p>
      </div>

      <div className="mb-6">
        <DataAxleApiStatus />
      </div>

      <Tabs defaultValue="businesses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="businesses">Business Search</TabsTrigger>
          <TabsTrigger value="people">People Search</TabsTrigger>
        </TabsList>

        <TabsContent value="businesses">
          <Card>
            <CardHeader>
              <CardTitle>Search Businesses</CardTitle>
              <CardDescription>Search the DataAxle Places database containing 19.4M business records</CardDescription>
            </CardHeader>
            <CardContent>
              <BusinessSearch />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="people">
          <Card>
            <CardHeader>
              <CardTitle>Search People</CardTitle>
              <CardDescription>
                Search the DataAxle People database containing 321.6M individual records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PeopleSearch />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
