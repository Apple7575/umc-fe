import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";

const HomeLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
    <div className='h-dvh flex flex-col'>
        <NavBar setSidebarOpen={setSidebarOpen} />
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className='flex-1 mt-25'>
            <Outlet />
        </main>
        <Footer />
    </div>
    );
};

export default HomeLayout;