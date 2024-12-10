import React from 'react';
import { FiUser, FiSettings, FiLogOut, FiDollarSign } from 'react-icons/fi';
import { AiOutlineDashboard } from 'react-icons/ai';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 h-screen flex flex-col justify-between overflow-hidden"> {/* Updated: Added flex layout for better control and overflow-hidden */}
      <div className="p-6 overflow-y-auto"> {/* Updated: Added overflow-y-auto for scrolling */}
        <div className="flex items-center space-x-4 pb-4 border-b border-gray-700">
          <div className="rounded-full bg-gray-500 w-10 h-10"></div>
          <div>
            <p className="text-lg font-semibold text-white">user1</p> {/* Updated: Added text-white for better readability */}
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
        <nav className="mt-4 space-y-2">
          {/* Navigation links */}
          <Link href="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <AiOutlineDashboard className="text-xl text-white" /> {/* Updated: Ensured icon text color matches theme */}
            <span className="text-white">Dashboard</span> {/* Updated: Added text-white */}
          </Link>
          <Link href="/users" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FiUser className="text-xl text-white" /> {/* Updated: Ensured icon text color matches theme */}
            <span className="text-white">Users</span> {/* Updated: Added text-white */}
          </Link>
          <Link href="/transactions" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FiDollarSign className="text-xl text-white" /> {/* Updated: Ensured icon text color matches theme */}
            <span className="text-white">Transactions</span> {/* Updated: Added text-white */}
          </Link>
          <Link href="/settings" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FiSettings className="text-xl text-white" /> {/* Updated: Ensured icon text color matches theme */}
            <span className="text-white">Settings</span> {/* Updated: Added text-white */}
          </Link>
          <Link href="/logout" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <FiLogOut className="text-xl text-white" /> {/* Updated: Ensured icon text color matches theme */}
            <span className="text-white">Logout</span> {/* Updated: Added text-white */}
          </Link>
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700">
        {/* Updated: Added footer or additional fixed content */}
        <p className="text-xs text-gray-500">© 2023 Your Company</p>
      </div>
    </div>
  );
};

export default Sidebar;
