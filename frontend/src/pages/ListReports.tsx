// src/components/ListReports.tsx
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReportList from "./ReportList";
import { Report } from "../types"; // Asumsi Report type sudah didefinisikan

// Perbarui atau definisikan ulang interface Report jika belum ada di src/types.ts
// Contoh penyesuaian jika diperlukan:
// interface Report {
//     id: number;
//     title: string; // Akan kita derive dari kategori atau status
//     image: string;
//     description: string;
//     status: string; // 'pending', 'proses', 'failed', 'success'
//     submittedAt: string; // Tanggal dalam format string
//     user_id: number;
//     User?: {
//         username: string;
//         email: string;
//     };
//     // ... properti lain dari Laporan model jika ingin ditampilkan
// }

export default function ListReports() {
    const [reports, setReports] = useState<Report[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true); // Default to true for initial fetch
    const [error, setError] = useState<string | null>(null);

    // Dapatkan token otentikasi dari localStorage
    const token = localStorage.getItem('authToken');

    const fetchReports = async () => {
        setLoading(true);
        setError(null); // Reset error state
        try {
            // Kita akan tambahkan paginasi ke endpoint laporan
            // Jika backend tidak mendukung query parameter page/limit untuk laporan,
            // Anda mungkin perlu menyesuaikan ini atau meminta perubahan di backend.
            // Untuk sementara, kita asumsikan dukungan paginasi mirip dengan postingan.
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/lapor/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Sertakan token di header
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data laporan.');
            }

            const result = await response.json();
            console.log("Raw API Reports:", result.data); // Debugging raw data

            if (result?.data && Array.isArray(result.data)) {
                // Memetakan data dari API ke format Report yang diharapkan komponen
                const formattedReports: Report[] = result.data.map((item: any) => {
                    // Logika untuk menentukan title dan status sesuai dengan Report interface Anda
                    // Asumsi: 'status' langsung dari API, 'title' bisa dari 'category' atau 'description'
                    return {
                        id: item.id,
                        title: item.category ? `Laporan ${item.category.replace(/_/g, ' ').toUpperCase()}` : 'Laporan Warga',
                        image: item.image ?? '',
                        description: item.description.substring(0, 100) + (item.description.length > 100 ? '...' : ''), // Batasi deskripsi
                        status: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Kapitalisasi status
                        submittedAt: item.created_at.substring(0, 10), // Hanya ambil tanggal
                        user_id: item.user_id,
                        User: item.User // Sertakan data User jika diperlukan di ReportList
                    };
                });
                setReports(formattedReports);
                // Asumsi backend memberikan informasi paginasi di `result.pagination`
                setTotalPages(result.pagination?.totalPages || 1);
            } else {
                setReports([]);
                setTotalPages(1);
                console.warn("Data laporan tidak ditemukan atau bukan array.");
            }
        } catch (e: any) {
            console.error("Error fetching reports:", e);
            setError(e.message || "Terjadi kesalahan saat memuat laporan.");
            setReports([]); // Kosongkan laporan jika ada error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Panggil fetchReports hanya jika token tersedia.
        // Ini menghindari fetch awal tanpa token jika user belum login.
        if (token) {
            fetchReports();
        } else {
            setLoading(false);
            setError("Anda tidak memiliki akses. Silakan login.");
        }
    }, [page, token]); // Tambahkan token ke dependency array agar fetch ulang saat token berubah

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    if (error) {
        return (
            <div className="text-center text-red-500 mt-4 bg-tertiary dark:bg-tertiaryDark p-4 rounded-md shadow">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:w-full px-10 md:px-20">
            <h2 className="text-2xl font-bold mb-4 text-center">Daftar Laporan</h2>
            {loading ? (
                // Skeleton loading for reports
                <div className="flex flex-col gap-5 mt-5">
                    <div className="bg-gray-100 dark:bg-gray-800 w-full overflow-hidden rounded-xl h-40 animate-pulse"></div>
                    <div className="bg-gray-100 dark:bg-gray-800 w-full overflow-hidden rounded-xl h-40 animate-pulse"></div>
                    <div className="bg-gray-100 dark:bg-gray-800 w-full overflow-hidden rounded-xl h-40 animate-pulse"></div>
                </div>
            ) : reports.length > 0 ? (
                reports.map((report) => (
                    <ReportList key={report.id} report={report} />
                ))
            ) : (
                <p className="text-center text-gray-500 mt-4 bg-tertiary dark:bg-tertiaryDark p-4 rounded-md shadow">
                    Tidak ada laporan yang tersedia.
                </p>
            )}

            {totalPages > 1 && ( // Tampilkan paginasi hanya jika ada lebih dari 1 halaman
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1 || loading}
                        className="px-4 py-2 mx-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 disabled:opacity-50"
                    >
                        <ChevronLeft />
                    </button>
                    <span className="text-gray-600 dark:text-gray-400">
                        Halaman {page} dari {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages || loading}
                        className="px-4 py-2 mx-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 disabled:opacity-50"
                    >
                        <ChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
}