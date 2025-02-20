"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiUser, FiLogOut } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai";
import Link from "next/link";
import { fetchAdminUsernameById } from "@/services/api";

const Sidebar = () => {
  const currentPath = usePathname();
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminId = localStorage.getItem("adminId");
        if (!adminId) {
          setError("ID Admin tidak ditemukan. Silakan login kembali.");
          return;
        }

        // Fetch admin username by ID
        const { username, error } = await fetchAdminUsernameById(adminId);
        if (error) {
          setError(error);
        } else {
          setUsername(username);
        }
      } catch (err) {
        console.error("Error fetching admin username:", err);
        setError("Terjadi kesalahan saat mengambil data admin.");
      }
    };

    fetchData();
  }, []);

  const isActive = (path: string) =>
    currentPath.startsWith(path)
      ? "bg-gray-700 text-white"
      : "hover:bg-gray-700 text-white";

  return (
    <div className="w-64 bg-gray-800 h-screen flex flex-col justify-between overflow-hidden">
      <div className="p-6 overflow-y-auto">
        <div className="flex items-center space-x-4 pb-4 border-b border-gray-700">
          <div className="rounded-full bg-gray-500 w-10 h-10"></div>
          <div>
            <p className="text-lg font-semibold text-white">
              {username || (error ? "Error fetching user" : "Loading...")}
            </p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
        <nav className="mt-4 space-y-2">
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
            <span>Account</span>
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("adminId"); // Hapus sesi pengguna
              localStorage.removeItem("token"); // Jika menggunakan token
              window.location.href = "/auth/login"; // Redirect ke login
            }}
            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 text-white w-full text-left"
          >
            <FiLogOut className="text-xl" />
            <span>Logout</span>
          </button>
          
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">© 2023 Your Company</p>
      </div>
    </div>
  );
};

export default Sidebar;
