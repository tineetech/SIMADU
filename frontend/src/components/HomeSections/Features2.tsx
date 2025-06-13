import { useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, Users, Bot, Coins, ArrowRight } from "lucide-react"; // Import ikon dari Lucide React
import { JSX } from "react/jsx-runtime";

interface Feature {
    title: string;
    icon: JSX.Element;
    description: string;
}

const features: Feature[] = [
    {
        title: "Lapor Masalah",
        icon: <Megaphone className="w-6 h-6 mr-3" />,
        description:
            "Laporkan berbagai permasalahan kota seperti jalan rusak, lampu mati, dan sampah menumpuk secara cepat. Setiap laporan akan diverifikasi dan diteruskan ke pihak terkait agar segera ditindaklanjuti.",
    },
    {
        title: "Komunitas & Solusi",
        icon: <Users className="w-6 h-6 mr-3" />,
        description:
            "Terhubung dengan warga lain untuk berdiskusi, berbagi solusi, dan berkontribusi dalam menciptakan lingkungan yang lebih baik. Komunitas dapat memberikan masukan dan dukungan dalam menyelesaikan masalah kota.",
    },
    {
        title: "AI Asisten Kota",
        icon: <Bot className="w-6 h-6 mr-3" />,
        description:
            "Dapatkan jawaban cepat mengenai regulasi kota, solusi permasalahan umum, serta saran mengenai lingkungan dan infrastruktur dengan bantuan kecerdasan buatan yang selalu siap membantu.",
    },
    {
        title: "Sistem Coin & Reward",
        icon: <Coins className="w-6 h-6 mr-3" />,
        description:
            "Setiap laporan yang diverifikasi akan mendapatkan coin sebagai apresiasi. Coin ini bisa dikumpulkan dan ditukar dengan berbagai reward menarik seperti diskon merchant atau akses premium dalam aplikasi.",
    },
];

export default function Features2() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <section className="px-6 my-40">
            <h1 className="text-2xl md:text-4xl font-bold mb-6">Fitur Utama <span className="text-primary">simadu</span></h1>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2 flex flex-col space-y-4">
                    {features.map((feature, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`flex items-center px-6 justify-between py-4 rounded-lg font-semibold md:text-lg transition-all duration-300 ${
                                selectedIndex === index
                                    ? "bg-primary dark:bg-primaryDark shadow-lg w-[100%] text-white"
                                    : "bg-tertiary border-1 border-gray-300 text-black dark:text-gray-200 dark:border-0 hover:text-white dark:bg-slate-700 w-[90%] dark:hover:bg-primaryDark hover:w-[100%] hover:bg-primary"
                            }`}
                        >
                            <div className="flex">
                                {feature.icon}
                                {feature.title}
                            </div>
                            {
                                selectedIndex === index ? (
                                    <div className="bg-white p-1.5 rounded-full">
                                        <ArrowRight size={18} color="#345B93" />
                                    </div>
                                ) : ''
                            }
                        </button>
                    ))}
                </div>

                <motion.div
                    key={selectedIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full md:w-1/2 bg-white border-2 border-gray-200 rounded-lg p-8 flex dark:bg-slate-700 dark:border-0 flex-col"
                >
                    <h2 className="text-xl md:text-2xl font-bold mb-4">{features[selectedIndex].title}</h2>
                    <p className="md:text-lg leading-relaxed">{features[selectedIndex].description}</p>
                </motion.div>
            </div>
        </section>
    );
}