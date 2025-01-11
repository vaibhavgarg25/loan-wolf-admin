"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const HelpDesk = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch users (dummy data)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dummy user data
        const fetchedUsers = [
          { id: '1', name: 'John Doe', status: 'Active', createdAt: { seconds: 1627847287 } },
          { id: '2', name: 'Jane Smith', status: 'Inactive', createdAt: { seconds: 1627847287 } },
          { id: '3', name: 'Alice Johnson', status: 'Active', createdAt: { seconds: 1627847287 } },
        ];
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrorMessage("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-8 space-y-8 h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-5xl font-bold tracking-tight">User List</h2>
      </div>
      <Card className='h-[83%] overflow-hidden pb-5'>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading users...</p>
          ) : errorMessage ? (
            <p className="text-red-600">{errorMessage}</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div className="space-y-4 overflow-y-auto h-[80vh] scrollbar-hide">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">User ID: {user.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{user.status}</p>
                    <p className="text-sm text-muted-foreground">Joined {new Date(user.createdAt.seconds * 1000).toLocaleString()}</p>
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

export default HelpDesk;