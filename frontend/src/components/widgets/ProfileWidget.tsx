import { useEffect, useRef, useState } from "react";
import { LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logout from "../../services/logout";
import DataUser from "../../services/dataUser";

export default function ProfileWidget() {
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const datas = DataUser()

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfile(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        Logout();
    };

    return (
        <div className="relative hidden md:block" ref={profileRef}>
            <button
                onClick={() => {
                    setShowProfile(!showProfile);
                }}
                className="rounded-full overflow-hidden w-10 h-10"
            >
                <img
                    src={datas?.data?.avatar ?? ''}
                    alt="Profile"
                    className="object-cover w-full h-full"
                />
            </button>
            <AnimatePresence>
                {showProfile && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-tertiary dark:bg-tertiaryDark rounded-xl shadow-lg p-4 z-10 text-text dark:text-textDark"
                    >
                        <div className="flex flex-col items-center">
                            <img
                                src={datas?.data?.avatar ?? ''}
                                alt="Profile"
                                className="w-16 h-16 rounded-full mb-2"
                            />
                            <div className="text-center">
                                <p className="font-semibold">{datas?.data?.username ?? ''}</p>
                                <p className="text-sm text-textBody dark:text-textBodyDark">{datas?.data?.email ?? ''}</p>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <a
                                href="/profile"
                                className="flex items-center gap-2 px-3 py-2 hover:bg-accent hover:text-white dark:hover:bg-accentDark rounded-lg transition"
                            >
                                <User size={16} /> Profile
                            </a>
                            <button className="flex items-center gap-2 px-3 py-2 hover:bg-red-500 hover:text-white rounded-lg transition w-full" onClick={() => handleLogout()}>
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}