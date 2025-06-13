import { motion } from "framer-motion";
import { LayoutDashboard, LogOut, Megaphone, Coins } from "lucide-react";
import { Link } from "react-router-dom";

const sidebarItems = [
    { icon: <LayoutDashboard />, label: "Dashboard", path: "/admin" },
    { icon: <Megaphone />, label: "Laporan", path: "/admin/laporan" },
    { icon: <Coins />, label: "Coins", path: "/admin/koin" },
];

export default function Sidebar() {

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-tertiaryDark ml-4 my-4 shadow-xl w-20 flex flex-col items-center py-6 space-y-8 rounded-[20px]"
        >
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-text font-bold text-xl">
                A
            </div>
            <div className="flex flex-col gap-8 text-textDark">
                {sidebarItems.map((item, index) => {
                    return (
                        <Link key={index} onClick={() => window.location.href = item.path}>
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-full flex items-center justify-center"
                            >
                                {item.icon}
                            </motion.div>
                        </Link>
                    );
                })}

            </div>

            <div className="mt-auto">
                <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-textDark hover:text-red-500"
                >
                    <LogOut />
                </motion.button>
            </div>
        </motion.div>
    );
}
