import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Home, Users, FileText, AlertCircle, User, LogOut, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import DarkModeToggle from "../widgets/DarkmodeToggle";
import NotificationWidget from "../widgets/NotificationWidget";
import ProfileWidget from "../widgets/ProfileWidget";
import checkIsLogin from "../../services/checkIsLogin";
import DataUser from "../../services/dataUser";
import logoutUser from "../../services/logout";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { data, loading } = DataUser();
    const navLinks = [
        { name: "Home", path: "/", icon: <Home size={20} /> },
        { name: "Komunitas", path: "/komunitas", icon: <Users size={20} /> },
        { name: "Lapor", path: "/lapor", icon: <AlertCircle size={20} /> },
        // { name: "Artikel", path: "/artikel", icon: <FileText size={20} /> },
    ];

    const handleLogout = () => {
        logoutUser();
    };

    useEffect(() => {
        const verifyLogin = async () => {
            const loggedIn = await checkIsLogin();
            setIsLoggedIn(loggedIn);
            console.log("Status Login dari useEffect:", loggedIn);
        };

        verifyLogin();
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all text-text w-full md:mx-auto md:px-5 dark:text-white duration-300 ${scrolled ? "bg-tertiary dark:bg-tertiaryDark md:bg-transparent md:dark:bg-transparent" : "bg-transparent dark:bg-transparent"
                }`}
        >
            <div className={`container md:bg-gray-200 shadow md:dark:bg-gray-700 mt-5 mx-auto w-full px-10 md:rounded-4xl md:px-10 py-4 flex items-center filter justify-between ${scrolled ? 'backdrop-blur-sm bg-opacity-25' : ''}`}>

                {/* Logo */}
                <Link to="/" className="text-xl m-0 font-bold">
                    {/* simadu */}
                    <img src="/images/logo.png" className="w-10 flex dark:hidden" alt="" />
                    <img src="/images/logo2.png" className="w-10 hidden dark:flex" alt="" />
                </Link>

                {/* Navigasi (Desktop) */}
                <nav className="hidden md:flex font-medium">
                    {navLinks.map((link) => {
                        const isActive = link.path === "/"
                            ? location.pathname === "/"
                            : location.pathname.startsWith(link.path);

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 space-x-2 transition ${isActive ? "bg-primary  text-textDark dark:bg-primary  rounded-3xl" : "hover:text-accent"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex">
                        <DarkModeToggle />
                    </div>
                    {
                        isLoggedIn ? (
                            <div className="hidden sm:flex gap-6 items-center">
                                <NotificationWidget />
                                <ProfileWidget />
                            </div>
                        ) : (
                            <div onClick={() => window.location.href = '/login'} className="hidden md:flex items-center gap-1 cursor-pointer bg-accent dark:bg-accentDark px-2 py-1.5 rounded-full text-textDark">
                                Sign in
                            </div>
                        )
                    }
                </div>

                {/* Mobile */}
                <div className="flex pl-4 items-center gap-4 md:hidden">
                    <DarkModeToggle />
                    {/* Hamburger (Mobile) */}
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                key="mobile-menu"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.25 }}
                                className="absolute top-full left-0 w-full bg-tertiary dark:bg-tertiaryDark shadow-md flex flex-col items-start py-4 space-y-4 md:hidden px-6 z-50"
                            >
                                {/* Profile Section */}
                                {isLoggedIn && (
                                    <div className="flex items-center justify-between w-full">
                                        {(() => {
                                            if (loading) {
                                                return (
                                                    <div className="flex items-center space-x-3 w-full animate-pulse">
                                                        <div className="w-16 h-16 bg-gray-300 rounded-full" />
                                                        <div className="space-y-2">
                                                            <div className="w-32 h-5 bg-gray-300 rounded" />
                                                            <div className="w-48 h-4 bg-gray-200 rounded" />
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            if (!data) return null;

                                            return (
                                                <>
                                                    <div className="flex items-center space-x-3 w-full">
                                                        <img
                                                            src={data.avatar || "/images/profile.jpg"}
                                                            alt="Profile"
                                                            className="w-16 h-16 rounded-full object-cover"
                                                        />
                                                        <div>
                                                            <p className="text-lg font-semibold">
                                                                {data.username || `${data.first_name ?? ""} ${data.last_name ?? ""}`}
                                                            </p>
                                                            <p className="text-sm text-textBody dark:text-textBodyDark">
                                                                {data.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <NotificationWidget />
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}

                                {/* Nav Links */}
                                {navLinks.map((link) => {
                                    const isActive = link.path === "/"
                                        ? location.pathname === "/"
                                        : location.pathname.startsWith(link.path);

                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center space-x-3 text-lg w-full py-2 px-4 rounded-lg transition ease-in-out ${isActive ? "bg-accent text-textDark" : "hover:bg-accent hover:text-textDark"
                                                }`}
                                        >
                                            {link.icon}
                                            <span>{link.name}</span>
                                        </Link>
                                    );
                                })}

                                {
                                    isLoggedIn ? (
                                        <>
                                            {/* Profile Link */}
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center space-x-3 text-lg w-full py-2 px-4 rounded-lg transition ease-in-out ${location.pathname === "/profile"
                                                    ? "bg-primary  text-textDark"
                                                    : "hover:bg-primary "
                                                    }`}
                                            >
                                                <User size={20} />
                                                <span>Profile</span>
                                            </Link>

                                            {/* Logout Button */}
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    // handle actual logout here
                                                    handleLogout()
                                                    console.log("Logged out");
                                                }}
                                                className="flex items-center space-x-3 text-lg w-full py-2 px-4 rounded-lg hover:bg-red-600 text-left transition"
                                            >
                                                <LogOut size={20} />
                                                <span>Logout</span>
                                            </button>
                                        </>
                                    ) : (
                                        <div onClick={() => window.location.href = '/login'} className="lg:hidden hover:bg-accent hover:text-textDark flex items-center space-x-3 text-lg w-full py-2 px-4 rounded-lg transition ease-in-out cursor-pointer">
                                            <LogIn size={20} />
                                            <span>Login</span>
                                        </div>
                                    )
                                }
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
