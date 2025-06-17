import { JSX, useRef, useState } from "react";
import {
    Trash2,
    TrafficCone,
    CloudRain,
    LightbulbOff,
    FolderSearch,
    AlertCircle,
} from "lucide-react";
import SearchBar from "../components/widgets/SearchBar";
import SelectCategoryFilter from "../components/widgets/SelectCategoryFilter";
import { Report } from "../types";
import ReportList from "../components/ReportList";
import { AnimatePresence } from "framer-motion";
import ReportCard from "../components/cards/ReportCard";
import ReportModal from "../components/modals/ReportModal";
import StatusReportChart from "../components/charts/StatusReportChart";
import ReportProgressList from "../components/ReportProgressList";
import OptionFilter from "../components/widgets/OptionFilterProps";
import GetLaporanData from "../services/getLaporanData";

export default function ReviewReportPage() {
    const { data: laporanRaw, loading } = GetLaporanData();

    const laporanArray = Array.isArray(laporanRaw?.data) ? laporanRaw.data : [];

    const Reports: Report[] = laporanArray.map((lapor: any) => ({
        id: lapor.id, // ⬅️ Tambahkan ini
        user_id: lapor.user_id, // ⬅️ dan ini
        title: lapor.title || "Tanpa Judul",
        description: lapor.description || lapor.notes || "Tidak ada deskripsi",
        submittedAt: lapor.event_date || "2025-01-01",
        image: lapor.image || "/images/about.jpg",
        status: lapor.status || "Pending",
        category: lapor.category || "Lainnya",
    }));


    // Fungsi bantu untuk dapatkan nama bulan dari ISO string
    const getMonthName = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString("id-ID", { month: "long", year: "numeric" }); // contoh: "Juni 2025"
    };

    // Kelompokkan laporan berdasarkan bulan dan status
    const getMonthlyStatusData = (reports: Report[]) => {
        const monthlyMap: Record<string, { pending: number; proses: number; success: number }> = {};

        reports.forEach((report) => {
            const month = getMonthName(report.submittedAt); // pakai submittedAt dari Report

            if (!monthlyMap[month]) {
                monthlyMap[month] = { pending: 0, proses: 0, success: 0 };
            }

            if (report.status === "pending") monthlyMap[month].pending += 1;
            else if (report.status === "proses") monthlyMap[month].proses += 1;
            else if (report.status === "success") monthlyMap[month].success += 1;
        });

        // Konversi ke array
        const result = Object.entries(monthlyMap).map(([bulan, value]) => ({
            bulan,
            ...value,
        }));

        // Urutkan berdasarkan waktu bulan
        result.sort((a, b) => new Date("1 " + a.bulan).getTime() - new Date("1 " + b.bulan).getTime());

        return result;
    };

    const monthlyStatusData = getMonthlyStatusData(Reports);

    const categoryIcons: { [key: string]: JSX.Element } = {
        "Jalan Rusak": <TrafficCone />,
        "Sampah": <Trash2 />,
        "PJU mati": <LightbulbOff />,
        "Banjir": <CloudRain />,
        "Lainnya": <FolderSearch />,
    };

    const reportListRef = useRef<HTMLDivElement | null>(null);

    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("Semua");
    const [filterStatus, setFilterStatus] = useState("Semua");
    const statusOptions = ["Semua", "pending", "proses", "success"];
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 5;

    const pendingReports = Reports.filter(report => report.status === "pending");

    const filteredReports = Reports
        .filter(report => report.status !== "pending")
        .filter((report) => {
            const matchSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCategory = filterCategory === "Semua" || report.category === filterCategory;
            const matchStatus = filterStatus === "Semua" || report.status === filterStatus;
            return matchSearch && matchCategory && matchStatus;
        });

    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
    const paginatedReports = filteredReports.slice(
        (currentPage - 1) * reportsPerPage,
        currentPage * reportsPerPage
    );

    const handleViewAllProgress = () => {
        setFilterStatus("pending");
        setTimeout(() => {
            reportListRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    if (loading) {
        return <p className="text-center py-10">Memuat laporan...</p>;
    }


    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Kiri */}
                <div className="flex flex-col md:col-span-8">
                    {/* Laporan Tertunda */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-semibold">Laporan Tertunda</h1>
                            <p className="text-textBody dark:text-textBodyDark">{pendingReports.length} Laporan</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {pendingReports.length > 0 ? (
                                pendingReports.slice(0, 3).map((report, index) => (
                                    <ReportCard
                                        key={index}
                                        index={index}
                                        item={report}
                                        onViewDetail={setSelectedReport}
                                        colSpan="col-span-1"
                                    />
                                ))
                            ) : (
                                <p className="col-span-12 text-center text-textBody dark:text-textBodyDark">
                                    Tidak ada laporan tertunda.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Filter dan Search */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between my-8 gap-4">
                        <h1 className="text-xl font-semibold">Seluruh Laporan</h1>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <SearchBar value={searchTerm} onChange={setSearchTerm} placeHolder="Cari laporan..." />
                            <SelectCategoryFilter
                                value={filterCategory}
                                onChange={setFilterCategory}
                                options={[
                                    { label: "Semua", value: "Semua" },
                                    { label: "Jalan Rusak", value: "Jalan Rusak" },
                                    { label: "Sampah Menumpuk", value: "Sampah" },
                                    { label: "PJU Mati", value: "PJU mati" },
                                    { label: "Banjir", value: "Banjir" },
                                    { label: "Lainnya", value: "Lainnya" },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Filter Status */}
                    <div className="mb-4">
                        <OptionFilter
                            options={statusOptions}
                            selected={filterStatus}
                            onChange={setFilterStatus}
                        />
                    </div>

                    {/* All Report */}
                    <div ref={reportListRef} className="flex flex-col gap-4">
                        <AnimatePresence>
                            {paginatedReports.map((report, index) => (
                                <ReportList index={index} report={report} onViewDetail={setSelectedReport} />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-6 gap-2 flex-wrap">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 min-w-[36px] text-sm rounded-md ${currentPage === page ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Kanan */}
                <div className="flex flex-col md:col-span-4">
                    {/* Report Progress */}
                    <div className="mb-6">
                        <h1 className="text-xl font-semibold mb-4">Proses Laporan</h1>
                        <div className="flex flex-col gap-4">
                            {Reports
                                .filter((report) => report.status === "proses")
                                .slice(0, 3)
                                .map((report, idx) => {
                                    const icon = categoryIcons[report.category] || <AlertCircle className="text-gray-400" />;
                                    return (
                                        <ReportProgressList
                                            key={idx}
                                            idx={idx}
                                            report={report}
                                            icon={icon}
                                            onViewDetail={setSelectedReport}
                                        />
                                    );
                                })}
                            {Reports.filter((r) => r.status === "proses").length > 3 && (
                                <div className="flex justify-end">
                                    <p
                                        className="text-sm font-light cursor-pointer hover:underline"
                                        onClick={handleViewAllProgress}
                                    >
                                        Lihat semua
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Chart */}
                    <div className="flex flex-col">
                        <h1 className="text-xl font-semibold mb-4">Statistik Laporan</h1>
                        <div className="bg-tertiary dark:bg-tertiaryDark rounded-md shadow-md w-full p-4 overflow-x-auto">
                            <StatusReportChart dataStatus={monthlyStatusData} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Laporan */}
            <ReportModal
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
            />
        </>
    );
}
