// components/AdminLSB/Sidebar.tsx

import React from "react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white">
      <div className="py-6 px-4 text-xl font-semibold border-b border-gray-700">
        <Link href="/admin">
            Admin Panel
        </Link>
      </div>
      <ul className="mt-6 space-y-4">
        <li>
          <Link href="/admin/user-management" className="block px-4 py-2 hover:bg-gray-700 rounded">
            User Management
          </Link>
        </li>
        <li>
          <Link href="/admin/loan-management" className="block px-4 py-2 hover:bg-gray-700 rounded">
            Loan/Auction Management
          </Link>
        </li>
        <li>
          <Link href="/admin/financial-reports" className="block px-4 py-2 hover:bg-gray-700 rounded">
            Financial Reports
          </Link>
        </li>
        <li>
          <Link href="/admin/settings" className="block px-4 py-2 hover:bg-gray-700 rounded">
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
