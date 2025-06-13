import { JSX } from "react";
import { Report } from "../types";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion"; // ✅ Import motion

type ReportProgressListProps = {
    idx: number;
    report: Report;
    icon: JSX.Element;
    onViewDetail: (report: Report) => void;
};

export default function ReportProgressList({
    idx,
    icon,
    report,
    onViewDetail,
}: ReportProgressListProps) {
    return (
        <motion.div
            key={idx}
            className="bg-tertiary dark:bg-tertiaryDark shadow-md rounded-md p-4 flex items-center gap-4 cursor-pointer"
            onClick={() => onViewDetail(report)}
            whileHover={{ scale: 1.02, boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="p-2.5 rounded-md bg-orange-200 text-text">
                {icon}
            </div>
            <div className="flex-1">
                <h2 className="text-sm font-medium">{report.title}</h2>
                <p className="text-xs text-gray-500 mt-1">{report.submittedAt}</p>
            </div>
            <div>
                <ChevronRight />
            </div>
        </motion.div>
    );
}
