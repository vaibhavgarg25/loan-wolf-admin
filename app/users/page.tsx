"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface User {
  id?: string;
  firstName: string;
  email: string;
  status: string;
  documentURLs: {
    aadhar: string;
    pan: string;
    studentID: string;
  };
}

const UsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<User>({
    firstName: "",
    email: "",
    status: "Pending",
    documentURLs: {
      aadhar: "",
      pan: "",
      studentID: "",
    },
  });

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(usersCollection);

        const fetchedUsers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];

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

  // Handle adding a new user
  const handleAddUser = async () => {
    try {
      const userRef = await addDoc(collection(db, "users"), newUser);
      setUsers((prev) => [...prev, { ...newUser, id: userRef.id }]);
      setNewUser({
        firstName: "",
        email: "",
        status: "Pending",
        documentURLs: { aadhar: "", pan: "", studentID: "" },
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please try again.");
    }
  };

  // Handle verifying a user
  const handleVerifyUser = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { status: "Verified" });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: "Verified" } : user
        )
      );
    } catch (error) {
      console.error("Error verifying user:", error);
      alert("Failed to verify user. Please try again.");
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="p-8 space-y-8 h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-5xl font-bold tracking-tight">User Management</h2>
        <div className="flex space-x-4">
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/3"
          />
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            Add User
          </Button>
        </div>
      </div>

      {/* User List */}
      <Card className="h-[83%] overflow-hidden pb-5">
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
              {users
                .filter((user) =>
                  user.firstName
                    ? user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
                    : true
                )
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    {/* User Info */}
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={user.photoURL || ""}
                          alt={user.firstName || "User"}
                        />
                        <AvatarFallback>
                          {user.firstName ? user.firstName.charAt(0) : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.firstName || "Unknown User"}</p>
                        <p className="text-sm text-muted-foreground">
                          User ID: {user.id}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditModalOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleVerifyUser(user.id!)}
                        disabled={user.status === "Verified"}
                      >
                        {user.status === "Verified" ? "Verified" : "Verify"}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id!)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New User</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Fill in the details to add a new user.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await handleAddUser(); // Function to add the user
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
          >
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Basic Information</h3>
              <div>
                <label className="block font-medium mb-1">Name</label>
                <Input
                  type="text"
                  value={newUser.firstName || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={newUser.email || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Status</label>
                <Input
                  type="text"
                  value={newUser.status || "Pending"}
                  onChange={(e) =>
                    setNewUser({ ...newUser, status: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Additional Information</h3>
              <div>
                <label className="block font-medium mb-1">Age</label>
                <Input
                  type="number"
                  value={newUser.age || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, age: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">City</label>
                <Input
                  type="text"
                  value={newUser.city || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, city: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Occupation</label>
                <Input
                  type="text"
                  value={newUser.occupation || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, occupation: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Document Links */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <h3 className="font-bold text-lg">Documents</h3>
              <div>
                <label className="block font-medium mb-1">Aadhar Card</label>
                <Input
                  type="text"
                  placeholder="Link to Aadhar Card"
                  value={newUser.documentURLs?.aadhar || ""}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      documentURLs: {
                        ...newUser.documentURLs,
                        aadhar: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">PAN Card</label>
                <Input
                  type="text"
                  placeholder="Link to PAN Card"
                  value={newUser.documentURLs?.pan || ""}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      documentURLs: {
                        ...newUser.documentURLs,
                        pan: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Student ID</label>
                <Input
                  type="text"
                  placeholder="Link to Student ID"
                  value={newUser.documentURLs?.studentID || ""}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      documentURLs: {
                        ...newUser.documentURLs,
                        studentID: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit/View User Modal */}
      {selectedUser && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">View/Edit User</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                You can edit or view the user's details here.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleEditUser(selectedUser.id!); // You can define this function to update the user
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
            >
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Basic Information</h3>
                <div>
                  <label className="block font-medium mb-1">Name</label>
                  <Input
                    type="text"
                    value={selectedUser.firstName || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={selectedUser.email || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Status</label>
                  <Input
                    type="text"
                    value={selectedUser.status || "Pending"}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        status: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Additional Information</h3>
                <div>
                  <label className="block font-medium mb-1">Age</label>
                  <Input
                    type="number"
                    value={selectedUser.age || ""}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, age: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">City</label>
                  <Input
                    type="text"
                    value={selectedUser.city || ""}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Occupation</label>
                  <Input
                    type="text"
                    value={selectedUser.occupation || ""}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, occupation: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Document Links */}
              <div className="col-span-1 md:col-span-2 space-y-4">
                <h3 className="font-bold text-lg">Documents</h3>
                <div>
                  <label className="block font-medium mb-1">Aadhar Card</label>
                  <Input
                    type="text"
                    placeholder="Link to Aadhar Card"
                    value={selectedUser.documentURLs?.aadhar || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        documentURLs: {
                          ...selectedUser.documentURLs,
                          aadhar: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">PAN Card</label>
                  <Input
                    type="text"
                    placeholder="Link to PAN Card"
                    value={selectedUser.documentURLs?.pan || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        documentURLs: {
                          ...selectedUser.documentURLs,
                          pan: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Student ID</label>
                  <Input
                    type="text"
                    placeholder="Link to Student ID"
                    value={selectedUser.documentURLs?.studentID || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        documentURLs: {
                          ...selectedUser.documentURLs,
                          studentID: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UsersPage;
