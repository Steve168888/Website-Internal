"use client";

import React from "react";
import { usePathname } from "next/navigation"; // Gunakan usePathname untuk mendapatkan path aktif
import { FiUser, FiLogOut } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai";
import Link from "next/link";

const Sidebar = () => {
  const currentPath = usePathname(); // Dapatkan path aktif

  const isActive = (path: string) =>
    currentPath.startsWith(path)
      ? "bg-gray-700 text-white"
      : "hover:bg-gray-700 text-white"; // Kelas untuk link aktif

  return (
    <div className="w-64 bg-gray-800 h-screen flex flex-col justify-between overflow-hidden">
      <div className="p-6 overflow-y-auto">
        <div className="flex items-center space-x-4 pb-4 border-b border-gray-700">
          <div className="rounded-full bg-gray-500 w-10 h-10"></div>
          <div>
            <p className="text-lg font-semibold text-white">user1</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
        <nav className="mt-4 space-y-2">
          {/* Navigation links */}
          <Link
            href="/dashboard"
            className={`flex items-center space-x-2 p-2 rounded ${isActive(
              "/dashboard"
            )}`}
          >
            <AiOutlineDashboard className="text-xl" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/users"
            className={`flex items-center space-x-2 p-2 rounded ${isActive(
              "/users"
            )}`}
          >
            <FiUser className="text-xl" />
            <span>Users</span>
          </Link>
          <Link
            href="/auth/login"
            className={`flex items-center space-x-2 p-2 rounded ${isActive(
              "/auth/login"
            )}`}
          >
            <FiLogOut className="text-xl" />
            <span>Logout</span>
          </Link>
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">© 2023 Your Company</p>
      </div>
    </div>
  );
};

export default Sidebar;
