import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DarkModeToggle from "./widgets/DarkmodeToggle";
import NotificationWidget from "./widgets/NotificationWidget";
import ProfileWidget from "./widgets/ProfileWidget";
import SidebarMobile from "./Navigations/SidebarMobile";
import { Menu } from "lucide-react";

type DashboardHeaderProps = {
    onToggleSidebar?: () => void;
};

export default function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const pageTitles: Record<string, string> = {
        "/admin/": "Admin Dashboard",
        "/admin": "Admin Dashboard",
        "/admin/laporan/": "Laporan",
        "/admin/laporan": "Laporan",
        "/admin/koin": "Verifikasi Koin"
    };

    const currentPath = location.pathname;
    const pageTitle = pageTitles[currentPath];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <>
            <div className="flex justify-between items-center relative mb-8">
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden text-text dark:text-textDark"
                        onClick={onToggleSidebar}
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-semibold text-text dark:text-textDark">
                        {pageTitle}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <DarkModeToggle />
                    <NotificationWidget />
                    <div className="hidden md:block">
                        <ProfileWidget />
                    </div>
                </div>
            </div>

            {/* Sidebar with framer-motion */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-backgroundDark z-50 shadow-lg p-4"
                    >
                        <SidebarMobile onClose={toggleSidebar} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
