import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { format, isThisWeek, isThisMonth, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import DataUser from "../services/dataUser"; // Import DataUser untuk mendapatkan token

// Tipe untuk notifikasi yang akan ditampilkan di UI
interface Notification {
    id: number;
    title: string;
    description: string;
    date: string; // Tanggal dalam format ISO string
}

// Fungsi untuk mengelompokkan notifikasi berdasarkan waktu
function groupNotifications(notifications: Notification[]): Record<string, Notification[]> {
    const groups: Record<string, Notification[]> = {
        "Hari Ini": [], // Tambahkan grup Hari Ini
        "Minggu Ini": [],
        "Bulan Ini": [],
        "Lebih Lama": [],
    };

    const today = new Date(); // Dapatkan tanggal hari ini

    notifications.forEach((notif) => {
        const notifDate = parseISO(notif.date);

        // Atur weekStartsOn ke 1 (Senin) sesuai standar ISO jika tidak ditentukan secara eksplisit, atau sesuaikan dengan kebutuhan Anda
        const options = { locale: id, weekStartsOn: 1 }; // Menggunakan Senin sebagai awal minggu

        // Memeriksa apakah notifikasi hari ini
        if (format(notifDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
            groups["Hari Ini"].push(notif);
        } else if (isThisWeek(notifDate, options)) {
            groups["Minggu Ini"].push(notif);
        } else if (isThisMonth(notifDate, options)) {
            groups["Bulan Ini"].push(notif);
        } else {
            groups["Lebih Lama"].push(notif);
        }
    });

    // Urutkan notifikasi dalam setiap grup dari yang terbaru ke terlama
    for (const key in groups) {
        groups[key].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    }

    return groups;
}

export default function NotificationsHistory() {
    const datas = DataUser(); // Ambil data pengguna, termasuk token
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredNotifId, setHoveredNotifId] = useState<number | null>(null);

    const token = localStorage.getItem('authToken'); // Dapatkan token dari localStorage

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!token) {
                setError("Autentikasi diperlukan. Silakan login.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notification/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal mengambil notifikasi.');
                }

                const result = await response.json();
                // console.log("Raw API Notifications:", result.data); // Debugging raw data

                // Memetakan data dari API ke format Notification yang diharapkan UI
                const formattedNotifications: Notification[] = result.data.map((item: any) => {
                    let title = "Notifikasi Baru";
                    let description = "Detail tidak tersedia.";

                    // Logika untuk menentukan judul dan deskripsi berdasarkan 'type' dari backend
                    if (item.type === 'laporan') {
                        const statusText = item.Laporan?.status || item.status_laporan || '';
                        title = `Laporan ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`;
                        description = item.Laporan?.description || item.deskripsi_laporan || "Tidak ada deskripsi laporan.";
                    } else if (item.type === 'postingan') {
                        title = 'Aktivitas Postingan'; // Bisa lebih spesifik jika backend menyediakan detail
                        description = item.deskripsi_laporan || "Ada aktivitas baru pada postingan Anda.";
                    } else if (item.type === 'coin') {
                        title = 'Coin Ditambahkan';
                        // Backend tidak memberikan jumlah koin langsung di notifikasi, jadi gunakan deskripsi umum
                        description = `Anda menerima coin dari kontribusi.`;
                    } else {
                        // Untuk tipe notifikasi lain atau default
                        title = item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : "Notifikasi";
                        description = item.deskripsi_laporan || "Detail tidak tersedia.";
                    }

                    return {
                        id: item.id,
                        title: title,
                        description: description,
                        date: item.created_at, // Format ISO string dari backend
                    };
                });
                setNotifications(formattedNotifications);
                // console.log("Formatted Notifications for UI:", formattedNotifications); // Debugging formatted data

            } catch (err: any) {
                console.error("Error fetching notifications:", err);
                setError(err.message || "Terjadi kesalahan saat memuat notifikasi.");
                setNotifications([]); // Kosongkan notifikasi jika ada error
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [token, datas]); // Tambahkan `datas` ke dependency array jika `DataUser` memicu update yang ingin Anda pantau.
                        // Namun, `token` sudah cukup untuk memicu fetch saat login/logout.

    const grouped = groupNotifications(notifications);

    return (
        <aside className="col-span-3 space-y-6">
            <div className="bg-tertiary dark:bg-tertiaryDark rounded-md shadow p-4">
                <h3 className="font-semibold text-lg mb-4 text-center">
                    Riwayat Notifikasi
                </h3>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-40">
                        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-3 text-textBody dark:text-textBodyDark">Memuat notifikasi...</p>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-40 text-red-500 text-center">
                        <p>{error}</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex items-center justify-center h-40 text-textBody dark:text-textBodyDark text-center">
                        Tidak ada notifikasi yang tersedia.
                    </div>
                ) : (
                    Object.entries(grouped).map(([timeLabel, items]) =>
                        items.length > 0 ? (
                            <div key={timeLabel} className="mt-6">
                                <h4 className="text-sm font-medium text-textBody dark:text-textBodyDark mb-2">
                                    {timeLabel}
                                </h4>
                                <ul className="space-y-3">
                                    <AnimatePresence>
                                        {items.map((notif) => (
                                            <motion.li
                                                key={notif.id}
                                                // Removed initial and animate from here, controlled by AnimatePresence
                                                // onMouseEnter/Leave for description hover
                                                onMouseEnter={() => setHoveredNotifId(notif.id)}
                                                onMouseLeave={() => setHoveredNotifId(null)}
                                                className="relative group bg-gray-50 dark:bg-gray-800 p-3 rounded-md shadow-sm flex items-start gap-3"
                                                layout // For smooth layout transitions
                                            >
                                                <Bell className="text-primary mt-1 shrink-0" size={20} />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {notif.title}
                                                    </p>
                                                    <p className="text-xs text-textBody dark:text-textBodyDark">
                                                        {format(parseISO(notif.date), "dd MMM yyyy", { locale: id })}
                                                    </p>

                                                    {/* Hover Deskripsi */}
                                                    <AnimatePresence>
                                                        {hoveredNotifId === notif.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: "auto" }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="mt-2 text-xs text-textBody dark:text-textBodyDark overflow-hidden"
                                                            >
                                                                {notif.description}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                </ul>
                            </div>
                        ) : null
                    )
                )}
            </div>
        </aside>
    );
}