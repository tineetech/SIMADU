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

export default function ReviewReportPage() {
    const dummyReports: Report[] = [
        {
            title: "Laporan Kehilangan Barang",
            description: "Barang hilang di ruang kelas B203 saat jam istirahat.",
            submittedAt: "2025-04-24",
            image: "/images/about.jpg",
            status: "Tertunda",
            category: "Lainnya",
        },
        {
            title: "Kerusakan Fasilitas",
            description: "Kursi patah di ruang kelas A102.",
            submittedAt: "2025-04-22",
            image: "/images/about.jpg",
            status: "Selesai",
            category: "Lainnya",
        },
        {
            title: "Kebisingan Berlebihan",
            description: "Terdapat kebisingan dari ruang praktik musik selama jam pelajaran.",
            submittedAt: "2025-04-20",
            image: "/images/about.jpg",
            status: "Tertunda",
            category: "Lainnya",
        },
        {
            title: "Laporan Penemuan Barang",
            description: "Ditemukan dompet hitam di taman belakang kampus.",
            submittedAt: "2025-04-19",
            image: "/images/about.jpg",
            status: "Tertunda",
            category: "Lainnya",
        },
        {
            title: "Kebocoran Atap",
            description: "Atap bocor di lorong lantai 3.",
            submittedAt: "2025-04-18",
            image: "/images/about.jpg",
            status: "Diproses",
            category: "Lainnya",
        },
        {
            title: "Pencemaran Suara",
            description: "Bunyi mesin genset mengganggu saat belajar.",
            submittedAt: "2025-04-17",
            image: "/images/about.jpg",
            status: "Diterima",
            category: "Sampah",
        },
        {
            title: "Lampu Jalan Mati",
            description: "Lampu jalan depan gerbang kampus tidak menyala.",
            submittedAt: "2025-04-16",
            image: "/images/about.jpg",
            status: "Diproses",
            category: "PJU mati",
        },
        {
            title: "Pohon Tumbang",
            description: "Pohon tumbang di dekat parkiran motor.",
            submittedAt: "2025-04-15",
            image: "/images/about.jpg",
            status: "Diproses",
            category: "Jalan Rusak",
        },
        {
            title: "Banjir di Lorong",
            description: "Air meluap di lorong bawah gedung C saat hujan.",
            submittedAt: "2025-04-14",
            image: "/images/about.jpg",
            status: "Diproses",
            category: "Banjir",
        },
        {
            title: "Jalan Rusak",
            description: "Aspal rusak di belakang gedung olahraga.",
            submittedAt: "2025-04-13",
            image: "/images/about.jpg",
            status: "Tertunda",
            category: "Jalan Rusak",
        },
    ];

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
    const statusOptions = ["Semua", "Diterima", "Diproses", "Selesai"];
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 5;

    const pendingReports = dummyReports.filter(report => report.status === "Tertunda");

    const filteredReports = dummyReports
        .filter(report => report.status !== "Tertunda")
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
        setFilterStatus("Diproses");
        setTimeout(() => {
            reportListRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

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
                            {dummyReports
                                .filter((report) => report.status === "Diproses")
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
                            {dummyReports.filter((r) => r.status === "Diproses").length > 3 && (
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
                            <StatusReportChart />
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
