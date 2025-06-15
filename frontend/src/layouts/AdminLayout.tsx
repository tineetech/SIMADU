import { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarMobile from "../components/Navigations/SidebarMobile";
import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/Navigations/Sidebar";

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background dark:bg-backgroundDark text-text dark:text-textDark">
            <div className="md:hidden">
                <SidebarMobile isOpen={isSidebarOpen} onClose={closeSidebar} />
            </div>
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto container p-4 sm:p-6 md:p-8">
                    {/* Pass toggle to header so it can control sidebar */}
                    <DashboardHeader onToggleSidebar={toggleSidebar} />
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
