import Sidebar from "@/components/AdminLSB/sidebar";

const AdminPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-border rounded-lg shadow">
            <h2 className="text-xl font-semibold">User Management</h2>
            <p className="mt-2">View and manage users.</p>
          </div>
          <div className="p-6 border border-border rounded-lg shadow">
            <h2 className="text-xl font-semibold">Loan/Auction Management</h2>
            <p className="mt-2">Monitor and manage auctions.</p>
          </div>
          <div className="p-6 border border-border rounded-lg shadow">
            <h2 className="text-xl font-semibold">Financial Reports</h2>
            <p className="mt-2">View detailed reports.</p>
          </div>
          <div className="p-6 border border-border rounded-lg shadow">
            <h2 className="text-xl font-semibold">Settings</h2>
            <p className="mt-2">Configure system preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
