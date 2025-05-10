import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const HomeLayout = () => {
    return (
    <div className='h-dvh flex flex-col'>
        <NavBar />
        <main className='flex-1 mt-25 ml-10'>
            <Outlet />
        </main>
        <Footer />
    </div>
    );
};

export default HomeLayout;