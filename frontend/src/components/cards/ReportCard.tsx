import { motion } from "framer-motion";
import { Report } from "../../types";

type ReportCardProps = {
    index: number;
    item: Report;
    onViewDetail: (report: Report) => void;
    colSpan: string;
};

const toTitleCase = (str: string) =>
    str
        .toLowerCase()
        .split(/[\s_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

const formatDate = (isoDate: string) => {
    if (!isoDate) return "Tanggal tidak tersedia";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "Tanggal tidak valid";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
};

const getStatusBadgeColor = (status: string) => {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200";
        case "Diterima":
            return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200";
        case "proses":
            return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200";
        case "success":
            return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200";
        default:
            return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
};

export default function ReportCard({
    index,
    item,
    onViewDetail,
    colSpan,
}: ReportCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }} 
            animate={{ opacity: 1, x: 0 }}   
            transition={{ duration: 0.6 }}     
            key={index}
            className={`bg-tertiary dark:bg-tertiaryDark rounded-md ${colSpan} shadow-md p-8 m-0 flex flex-col justify-between`}
        >
            <div className="flex flex-col gap-2 mb-4 flex-grow">
                <div className="flex justify-between items-start">
                    <h1 className="font-medium leading-snug line-clamp-2 max-w-[80%]">
                        {item.category ? toTitleCase(item.category) : "Laporan Warga"}
                    </h1>
                    <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeColor(
                            item.status
                        )}`}
                    >
                        {item.status}
                    </span>
                </div>
                <p className="text-sm line-clamp-3 text-textBody dark:text-textBodyDark">
                    {item.description}
                </p>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-xs font-light text-textBody dark:text-textBodyDark">
                    {formatDate(item.submittedAt)}
                </p>
                <button
                    onClick={() => onViewDetail(item)}
                    className="hover:cursor-pointer text-textBody dark:text-textBodyDark text-sm"
                >
                    Detail
                </button>
            </div>
        </motion.div>
    );
}
