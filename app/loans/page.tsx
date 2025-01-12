"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config"; // Ensure this points to your Firebase config
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch loans from Firestore
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
    <div className="p-8 space-y-8 h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-5xl font-bold tracking-tight">Loan List</h2>
      </div>
      <Card className="h-[83%] overflow-hidden pb-5">
        <CardHeader>
          <CardTitle>All Loans</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading loans...</p>
          ) : errorMessage ? (
            <p className="text-red-600">{errorMessage}</p>
          ) : loans.length === 0 ? (
            <p>No loans found.</p>
          ) : (
            <div className="space-y-4 overflow-y-auto h-[80vh] scrollbar-hide">
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">Loan Amount: ${loan.amount}</p>
                    <p className="text-sm text-muted-foreground">Loan ID: {loan.id}</p>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanList;
