import React from 'react';
import Navbar from '../navbar/_components/navbar';
import Sidebar from '../sidebar/_components/sidebar';
import Content from '../content/_components/content';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="flex h-screen">
       
        <Sidebar />
      
        <div className="flex flex-col flex-1 ml-10 mt-6 bg-[#0D1B2A]">
          <Navbar />
          <div className='mt-5'>
            <Content />
          </div>
        
          <main className="p-6 overflow-y-auto">
            {children}
          </main>
        </div>

      </div>
    );
  };
  
export default MainLayout;