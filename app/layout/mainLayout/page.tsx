import React from 'react';
import Navbar from '../navbar/_components/navbar';
import Sidebar from '../sidebar/_components/sidebar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar tetap */}
      <Sidebar />

      {/* Kontainer utama */}
      <div className="flex flex-col flex-1 bg-[#0D1B2A]">
        {/* Navbar tetap */}
        <div className="mt-5 top-3 z-10 mx-5">
          <Navbar />
        </div>

        {/* Konten utama dengan scrollbar */}
        <main className="mt-5 flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
