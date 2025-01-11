import { Card } from "@/components/ui/card";
import {
  Users,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
} from "lucide-react";
import { ActivityChart } from "@/components/activity-chart";
import { RecentLoans } from "@/components/recent-loans";

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold mt-2">2,543</h3>
            </div>
            <div className="p-4 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-500">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>12% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Loans</p>
              <h3 className="text-2xl font-bold mt-2">1,259</h3>
            </div>
            <div className="p-4 bg-primary/10 rounded-full">
              <Banknote className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-red-500">
            <ArrowDownRight className="h-4 w-4 mr-1" />
            <span>4% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
              <h3 className="text-2xl font-bold mt-2">$4.2M</h3>
            </div>
            <div className="p-4 bg-primary/10 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-500">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>18% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Auctions</p>
              <h3 className="text-2xl font-bold mt-2">342</h3>
            </div>
            <div className="p-4 bg-primary/10 rounded-full">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-500">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>8% from last month</span>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <div className="p-6">
            <h3 className="text-lg font-medium">Platform Activity</h3>
            <p className="text-sm text-muted-foreground">Daily platform activity over time</p>
          </div>
          <ActivityChart />
        </Card>

        <Card className="col-span-3">
          <div className="p-6">
            <h3 className="text-lg font-medium">Recent Loans</h3>
            <p className="text-sm text-muted-foreground">Latest loan applications</p>
          </div>
          <RecentLoans />
        </Card>
      </div>
    </div>
  );
}