import React from "react";
import Navbar from "../navbar/_components/navbar";
import Sidebar from "../sidebar/_components/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#182237] flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Kontainer Utama */}
      <div className="flex-1 flex flex-col bg-[#0D1B2A] overflow-auto">
        {/* Navbar */}
        <header className="bg-[#0D1B2A] px-6 py-4 mb-1 mt-2">
          <Navbar />
        </header>

        {/* Konten Utama */}
        <main className="flex-1 px-6 py-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
