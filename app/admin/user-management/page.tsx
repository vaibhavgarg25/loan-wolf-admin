import Sidebar from "@/components/AdminLSB/sidebar";

const UserManagementPage = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        <p className="text-gray-700">List of users will be displayed here.</p>
      </div>
    </div>
  );
};

export default UserManagementPage;
