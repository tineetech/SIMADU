import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { Report } from "../../types";

interface ReportModalProps {
    report: Report | null;
    onClose: () => void;
}

const getStatusBadgeColor = (status: string) => {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200";
        case "proses":
            return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200";
        case "success":
            return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200";
        default:
            return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
};

export default function ReportModal({ report, onClose }: ReportModalProps) {
    if (!report) return null;

    console.log(report)

    const isDark = document.documentElement.classList.contains("dark");
    const updateStatus = async (id: number) => {
        if (!id || isNaN(id)) {
            console.warn("ID tidak valid saat updateStatus:", id);
            return { error: true };
        }

        try {
            console.log(id)
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lapor/update-status/${id}`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken') ?? ''}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'proses',
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Update status failed:', data);
                Swal.fire({
                    title: "Gagal Update Status!",
                    text: data.error ?? 'Gagal update coba lagi nanti.',
                    icon: "error",
                    confirmButtonColor: "#2563eb",
                    background: isDark ? "#1f2937" : undefined,
                    color: isDark ? "#f9fafb" : undefined,
                    customClass: {
                        popup: isDark ? "dark-swal" : "",
                    },
                });
                return { error: true }; // Return object indicating failure
            }

            console.log('Successfully updated status:', data);
            return data; // Return successful data
        } catch (error) {
            console.error('Network error (updateStatus):', error);
            Swal.fire({
                title: "Gagal Update Status!",
                text: 'Terjadi kesalahan jaringan.',
                icon: "error",
                confirmButtonColor: "#2563eb",
                background: isDark ? "#1f2937" : undefined,
                color: isDark ? "#f9fafb" : undefined,
                customClass: {
                    popup: isDark ? "dark-swal" : "",
                },
            });
            return { error: true }; // Return object indicating failure
        }
    };

    const sendCoin = async (user_id: number) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/koin/update/${user_id}`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken') ?? ''}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: 500,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Send coin failed:', data);
                Swal.fire({
                    title: "Gagal Update Koin!",
                    text: data.error ?? 'Gagal update koin coba lagi nanti.',
                    icon: "error",
                    confirmButtonColor: "#2563eb",
                    background: isDark ? "#1f2937" : undefined,
                    color: isDark ? "#f9fafb" : undefined,
                    customClass: {
                        popup: isDark ? "dark-swal" : "",
                    },
                });
                return { error: true }; // Return object indicating failure
            }

            console.log('Successfully updated koin:', data);
            return data; // Return successful data
        } catch (error) {
            console.error('Network error (sendCoin):', error);
            Swal.fire({
                title: "Gagal Update Koin!",
                text: 'Terjadi kesalahan jaringan.',
                icon: "error",
                confirmButtonColor: "#2563eb",
                background: isDark ? "#1f2937" : undefined,
                color: isDark ? "#f9fafb" : undefined,
                customClass: {
                    popup: isDark ? "dark-swal" : "",
                },
            });
            return { error: true }; // Return object indicating failure
        }
    };

    const handleVerification = async (id: number, user_id: number) => {

        if (!id) {
            console.warn("ID atau user_id tidak valid:", { id });
            return;
        }

        const isDark = document.documentElement.classList.contains("dark");

        const result = await Swal.fire({
            title: "Verifikasi laporan ini?",
            text: "Pastikan laporan sudah ditinjau sebelum memverifikasi.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Verifikasi",
            cancelButtonText: "Batal",
            confirmButtonColor: "#2563eb",
            background: isDark ? "#1f2937" : undefined,
            color: isDark ? "#f9fafb" : undefined,
            customClass: {
                popup: isDark ? "dark-swal" : "",
            },
        });

        if (result.isConfirmed) {
            const resStatus = await updateStatus(id);
            if (resStatus?.error) {
                return; // Stop if updateStatus failed
            }

            const resCoint = await sendCoin(user_id);
            if (resCoint?.error) {
                return; // Stop if sendCoin failed
            }

            Swal.fire({
                title: "Terverifikasi!",
                text: "Laporan telah berhasil diverifikasi.",
                icon: "success",
                background: isDark ? "#1f2937" : undefined,
                color: isDark ? "#f9fafb" : undefined,
                customClass: {
                    popup: isDark ? "dark-swal" : "",
                },
            });

            // Tutup modal setelah verifikasi berhasil
            onClose();
        }
    };

    const statusOptions = ["pending", "proses", "success"];

    const handleManualStatusUpdate = async (newStatus: string) => {
        if (!report) return;
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lapor/update-status/${report.id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken') ?? ''}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await res.json();

        if (!res.ok) {
            Swal.fire({
                title: "Gagal Update Status!",
                text: data.error ?? 'Coba lagi nanti.',
                icon: "error",
                confirmButtonColor: "#2563eb",
                background: isDark ? "#1f2937" : undefined,
                color: isDark ? "#f9fafb" : undefined,
                customClass: {
                    popup: isDark ? "dark-swal" : "",
                },
            });
            return;
        }

        Swal.fire({
            title: "Status Diperbarui!",
            text: `Status berhasil diubah menjadi "${newStatus}".`,
            icon: "success",
            confirmButtonColor: "#2563eb",
            background: isDark ? "#1f2937" : undefined,
            color: isDark ? "#f9fafb" : undefined,
            customClass: {
                popup: isDark ? "dark-swal" : "",
            },
        });

        onClose();
    };

    if (!report?.id) {
        return (
            <AnimatePresence>
                <motion.div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col items-center gap-4"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                    >
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-700 dark:text-gray-100">Memuat data laporan...</p>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            {report && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-tertiary dark:bg-tertiaryDark p-6 rounded-xl shadow-2xl w-full max-w-md relative"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="flex flex-col gap-4">
                            <img
                                src={report.image}
                                alt={report.title}
                                className="rounded-lg w-full max-h-56 object-cover"
                            />

                            <div className="flex items-start justify-between">
                                <h2 className="text-lg font-semibold text-text dark:text-textDark">{report.title}</h2>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeColor(report.status)}`}>
                                    {report.status}
                                </span>
                            </div>

                            <p className="text-sm text-textBody dark:text-textBodyDark leading-relaxed">
                                {report.description}
                            </p>

                            <div className="text-xs text-textBody dark:text-textBodyDark mt-2">
                                Dilaporkan pada: <span className="font-medium">{report.submittedAt}</span>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 text-text dark:text-textDark hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >
                                    Tutup
                                </button>

                                {report.status === "pending" ? (
                                    report.id && report.user_id ? (
                                        <button
                                            onClick={() => handleVerification(report.id, report.user_id)}
                                            className="px-4 py-2 rounded-md text-sm font-medium bg-primary hover:bg-primary/70 text-white transition"
                                        >
                                            Verifikasi
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
                                        >
                                            Memuat...
                                        </button>
                                    )
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <select
                                            onChange={(e) => handleManualStatusUpdate(e.target.value)}
                                            className="px-3 py-2 text-sm rounded-md border dark:border-gray-600 text-text dark:text-textDark bg-white dark:bg-gray-800 focus:outline-none"
                                            defaultValue={report.status}
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}