import { useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { format, isThisWeek, isThisMonth, parseISO } from "date-fns";
import { id } from "date-fns/locale";

// Tipe untuk notifikasi
interface Notification {
    id: number;
    title: string;
    description: string;
    date: string;
}

// Dummy data notifikasi dengan tanggal
const rawNotifications: Notification[] = [
    {
        id: 1,
        title: "Laporan dikonfirmasi",
        description: "Laporan tentang jalan rusak telah dikonfirmasi oleh petugas.",
        date: "2025-05-10",
    },
    {
        id: 2,
        title: "Komentar baru",
        description: "Seseorang mengomentari laporan Anda tentang lampu jalan mati.",
        date: "2025-05-08",
    },
    {
        id: 3,
        title: "Coin ditambahkan",
        description: "Anda menerima 50 coin dari kontribusi laporan harian.",
        date: "2025-04-26",
    },
    {
        id: 4,
        title: "Laporan ditutup",
        description: "Laporan Anda tentang saluran air tersumbat telah ditutup.",
        date: "2025-04-02",
    },
];

// Fungsi untuk mengelompokkan notifikasi berdasarkan waktu
function groupNotifications(notifications: Notification[]): Record<string, Notification[]> {
    const groups: Record<string, Notification[]> = {
        "Minggu Ini": [],
        "Bulan Ini": [],
        "Lebih Lama": [],
    };

    notifications.forEach((notif) => {
        const notifDate = parseISO(notif.date);
        if (isThisWeek(notifDate, { weekStartsOn: 1 })) {
            groups["Minggu Ini"].push(notif);
        } else if (isThisMonth(notifDate)) {
            groups["Bulan Ini"].push(notif);
        } else {
            groups["Lebih Lama"].push(notif);
        }
    });

    return groups;
}

export default function NotificationsHistory() {
    const [hoveredNotifId, setHoveredNotifId] = useState<number | null>(null);

    const grouped = groupNotifications(rawNotifications);

    return (
        <aside className="col-span-3 space-y-6">
            <div className="bg-tertiary dark:bg-tertiaryDark rounded-md shadow p-4">
                <h3 className="font-semibold text-lg mb-4 text-center">
                    Riwayat Notifikasi
                </h3>

                {Object.entries(grouped).map(([timeLabel, items]) =>
                    items.length > 0 ? (
                        <div key={timeLabel} className="mt-6">
                            <h4 className="text-sm font-medium text-textBody dark:text-textBodyDark mb-2">
                                {timeLabel}
                            </h4>
                            <ul className="space-y-3">
                                {items.map((notif) => (
                                    <motion.li
                                        key={notif.id}
                                        initial="hidden"
                                        whileHover="visible"
                                        animate="hidden"
                                        onMouseEnter={() => setHoveredNotifId(notif.id)}
                                        onMouseLeave={() => setHoveredNotifId(null)}
                                        className="relative group bg-gray-50 dark:bg-gray-800 p-3 rounded-md shadow-sm flex items-start gap-3"
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
                                                        className="mt-2 text-xs text-textBody dark:text-textBodyDark overflow-hidden"
                                                    >
                                                        {notif.description}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    ) : null
                )}
            </div>
        </aside>
    );
}
