import { ChevronRight } from "lucide-react";
import { JSX } from "react";
import { motion } from "framer-motion";

type StatsCardProps = {
    bgColor: string;
    icon: JSX.Element;
    title: string;
    value: string | number;
    link: string;
};

export default function StatsCard({ bgColor, icon, title, value, link }: StatsCardProps) {
    return (
        <motion.a
            href={link}
            whileHover={{ scale: 1.02, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-background dark:bg-backgroundDark shadow-md rounded-md p-2 flex gap-4 items-center cursor-pointer no-underline"
        >
            <div className={`${bgColor} p-2.5 rounded-md flex items-center text-text`}>
                {icon}
            </div>
            <div className="flex w-full justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="text-xs">{title}</h1>
                    <h2 className="text-lg font-semibold">{value}</h2>
                </div>
                <ChevronRight size={20} />
            </div>
        </motion.a>
    );
}
