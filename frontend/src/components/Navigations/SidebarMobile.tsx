import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, LogOut, Megaphone, Coins, X, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const sidebarItems = [
    { icon: <LayoutDashboard />, label: "Dashboard", path: "/admin" },
    { icon: <Megaphone />, label: "Laporan", path: "/admin/laporan" },
    { icon: <Coins />, label: "Coins", path: "/admin/koin" },
    { icon: <User />, label: "Profile", path: "/profile" },
];

type SidebarProps = {
    isOpen?: boolean;
    onClose?: () => void;
};

export default function SidebarMobile({ isOpen = false, onClose }: SidebarProps) {
    const location = useLocation();

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={onClose}
                        />
                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-tertiaryDark shadow-xl py-6 px-4 space-y-8 rounded-r-2xl z-50
                                fixed top-0 left-0 h-full w-64 md:w-20 flex flex-col items-start md:hidden"
                        >
                            {/* Close button */}
                            <button onClick={onClose} className="self-end mb-2 text-textDark">
                                <X size={24} />
                            </button>

                            {/* Logo */}
                            <div className="flex gap-2 items-center">
                                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-text font-bold text-xl">
                                    A
                                </div>
                                <h2 className="text-xl font-semibold">Acumalaka</h2>
                            </div>

                            {/* Menu */}
                            <div className="flex flex-col gap-4 text-textDark w-full">
                                {sidebarItems.map((item, index) => {
                                    const isActive = location.pathname.startsWith(item.path);
                                    return (
                                        <div key={index} onClick={() => window.location.href = item.path}>
                                            <motion.div
                                                whileTap={{ scale: 0.97 }}
                                                className={`p-2 rounded-md flex items-center gap-3 w-full
                                                    ${isActive ? "bg-primary text-white" : "hover:bg-background hover:text-primary hover:scale-105 transition-all ease-in-out cursor-pointer"}`}
                                            >
                                                {item.icon}
                                                {item.label}
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Logout */}
                            <div className="mt-auto w-full">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="text-textDark hover:bg-red-500 flex w-full items-center gap-2 p-2"
                                >
                                    <LogOut />
                                    Logout
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
