import { Report } from "../types";
import { motion } from "framer-motion";

// Helper function: Title Case
const toTitleCase = (str: string) =>
    str
        .toLowerCase()
        .split(/[\s_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

// Helper function: Format tanggal
const formatDate = (isoDate: string) => {
    if (!isoDate) return "Tanggal tidak tersedia";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "Tanggal tidak valid";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
};


type ReportListProps = {
    report: Report;
    index: number;
    onViewDetail?: (report: Report) => void;
    hideDetailButton?: boolean;
};

export default function ReportList({
    report,
    onViewDetail,
    index,
    hideDetailButton = false,
}: ReportListProps) {
    const getStatusBadgeColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200";
            case "proses":
                return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200";
            case "success":
                return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
        }
    };

    
    return (
        <motion.div
            className="bg-tertiary dark:bg-tertiaryDark p-4 rounded-md shadow-md"
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            layout
        >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-6">
                {/* Left section */}
                <div className="flex gap-4 w-full md:w-2/3">
                    <img
                        src={report.image}
                        alt=""
                        className="rounded-md w-16 h-16 object-cover shrink-0"
                    />
                    <div className="flex flex-col gap-1 w-full">
                        <h2 className="text-lg font-medium truncate">
                            {report.category ? toTitleCase(report.category) : "Lainnya"}
                        </h2>
                        <p className="text-sm text-textBody dark:text-textBodyDark line-clamp-2">
                            {report.description}
                        </p>
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4 w-full md:w-auto">
                    <p className="text-sm whitespace-nowrap">
                        {formatDate(report.submittedAt)}
                    </p>
                    <div className="min-w-[100px]">
                        <span
                            className={`text-sm font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeColor(
                                report.status
                            )}`}
                        >
                            {toTitleCase(report.status)}
                        </span>
                    </div>
                    {!hideDetailButton && (
                        <button
                            onClick={() => onViewDetail?.(report)}
                            className="bg-primary hover:bg-primary/90 px-4 py-2 text-white rounded-md text-sm whitespace-nowrap"
                        >
                            Detail Laporan
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
