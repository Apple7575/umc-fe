import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";

const ProtectedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='h-dvh flex flex-col'>
      <NavBar />
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-black text-white rounded"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className='flex-1 mt-12'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;