import React from 'react';
import { FiSearch, FiBell } from 'react-icons/fi';

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-4 rounded-md bg-gray-800 shadow">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <FiSearch className="absolute top-2 left-2 text-gray-500" />
          <input
            type="text"
            className="pl-8 pr-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
            placeholder="Search..."
          />
        </div>
        <FiBell className="text-xl text-gray-400" />
      </div>
    </div>
  );
};

export default Navbar;
