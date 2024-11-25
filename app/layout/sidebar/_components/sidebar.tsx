import React from 'react';
import { FiUser, FiSettings, FiLogOut, FiDollarSign } from 'react-icons/fi';
import { AiOutlineDashboard } from 'react-icons/ai';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 h-screen p-6">
      <div className="flex items-center space-x-4 pb-4 border-b border-gray-700">
        <div className="rounded-full bg-gray-500 w-10 h-10"></div>
        <div>
          <p className="text-lg font-semibold">user1</p>
          <p className="text-xs text-gray-400">Administrator</p>
        </div>
      </div>
      <nav className="mt-4 space-y-2">
        <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <AiOutlineDashboard className="text-xl" />
          <span>Dashboard</span>
        </a>
        <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <FiUser className="text-xl" />
          <span>Users</span>
        </a>
        <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <FiDollarSign className="text-xl" />
          <span>Transactions</span>
        </a>
        <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <FiSettings className="text-xl" />
          <span>Settings</span>
        </a>
        <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
