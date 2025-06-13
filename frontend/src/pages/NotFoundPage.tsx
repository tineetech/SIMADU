import { Link } from "react-router-dom";
import { Ghost } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background dark:bg-backgroundDark flex flex-col items-center justify-center text-center px-4 transition-colors">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
            >
                <Ghost className="w-20 h-20 text-accent dark:text-white" />
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-5xl font-bold text-gray-900 dark:text-white mb-4"
            >
                404
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-gray-600 dark:text-gray-400 mb-6"
            >
                Halaman yang kamu cari tidak ditemukan.
            </motion.p>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                <Link
                    to="/"
                    className="bg-accent text-white dark:bg-white dark:text-black px-6 py-3 rounded-2xl hover:opacity-90 transition"
                >
                    Kembali ke Beranda
                </Link>
            </motion.div>
        </div>
    );
}
