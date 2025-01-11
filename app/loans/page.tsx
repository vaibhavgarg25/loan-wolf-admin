"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch loans (dummy data)
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dummy loan data
        const fetchedLoans = [
          { id: '1', amount: 5000, status: 'Approved', createdAt: { seconds: 1627847287 } },
          { id: '2', amount: 10000, status: 'Pending', createdAt: { seconds: 1627847287 } },
          { id: '3', amount: 15000, status: 'Rejected', createdAt: { seconds: 1627847287 } },
        ];
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
      <Card className='h-[83%] overflow-hidden pb-5'>
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
                <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Loan Amount: ${loan.amount}</p>
                    <p className="text-sm text-muted-foreground">Loan ID: {loan.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{loan.status}</p>
                    <p className="text-sm text-muted-foreground">Applied {new Date(loan.createdAt.seconds * 1000).toLocaleString()}</p>
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
