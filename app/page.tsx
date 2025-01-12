"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Banknote, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Clock 
} from "lucide-react";
import { ActivityChart } from "@/components/activity-chart";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const loansCollection = collection(db, "loan_requests"); // Replace "loan_requests" with your collection name
        const querySnapshot = await getDocs(loansCollection);

        const fetchedLoans = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLoans(fetchedLoans);
      } catch (error) {
        console.error("Error fetching loans:", error);
        setErrorMessage("Failed to load loans. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
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
              <p className="text-sm font-medium text-muted-foreground">
                Active Loans
              </p>
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
              <p className="text-sm font-medium text-muted-foreground">
                Total Volume
              </p>
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
              <p className="text-sm font-medium text-muted-foreground">
                Active Auctions
              </p>
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

      {/* Charts and Recent Loans */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Platform Activity */}
        <Card className="col-span-4">
          <div className="p-6">
            <h3 className="text-lg font-medium">Platform Activity</h3>
            <p className="text-sm text-muted-foreground">
              Daily platform activity over time
            </p>
          </div>
          <ActivityChart />
        </Card>

        {/* Recent Loans */}
        <Card className="col-span-3">
          <div className="p-6">
            <h3 className="text-lg font-medium">Recent Loans</h3>
            <p className="text-sm text-muted-foreground">
              Latest loan applications
            </p>
            {loading ? (
              <p>Loading loans...</p>
            ) : errorMessage ? (
              <p className="text-red-600">{errorMessage}</p>
            ) : loans.length === 0 ? (
              <p>No loans found.</p>
            ) : (
              <div className="space-y-4 overflow-y-auto h-[50vh] scrollbar-hide">
                {loans.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Loan Amount: ${loan.amount}</p>
                      
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{loan.status}</p>
                      <p className="text-sm text-muted-foreground">
                        Applied{" "}
                        {loan.createdAt
                          ? new Date(loan.createdAt.seconds * 1000).toLocaleString()
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
