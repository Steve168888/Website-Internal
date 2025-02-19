"use client";

import React from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  // Ambil nama halaman dari path
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/users") return "Account";
    
    // Jika path adalah /users/campaignDetail atau /users/campaignList/:id maka tampilkan "Campaign"
    if (pathname.startsWith("/users/campaignDetail") || pathname.startsWith("/users/campaignList/")) {
      return "Campaign";
    }

    return "Page";
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-md bg-gray-800 text-white shadow">
      <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
    </div>
  );
};

export default Navbar;
