import { motion, AnimatePresence } from "framer-motion";
import { MoonIcon, SunIcon } from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";

export default function DarkModeToggle() {
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <motion.button
            onClick={toggleDarkMode}
            className="relative w-14 h-7 rounded-full focus:outline-none"
            initial={false}
            animate={{ backgroundColor: darkMode ? "#4B5563" : "rgba(0, 0, 0, .1)" }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow-md flex items-center justify-center"
                layout
                transition={{
                    layout: { type: "spring", bounce: 0.25, duration: 0.4 },
                    default: { duration: 0.4 },
                }}
                animate={{
                    x: darkMode ? 28 : 0,
                    backgroundColor: darkMode ? "#191970" : "#F1DF6B",
                }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {darkMode ? (
                        <motion.div
                            key="moon"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MoonIcon size={16} className="text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <SunIcon size={16} className="text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.button>
    );
}
