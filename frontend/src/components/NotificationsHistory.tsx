import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { format, isThisWeek, isThisMonth, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { getAllNotifications, Notification } from "../services/getNotificationData";

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
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const fetchNotif = async () => {
            const data = await getAllNotifications();
            setNotifications(data);
        };
        fetchNotif();
    }, []);

    const grouped = groupNotifications(notifications);

    return (
        <aside className="col-span-3 space-y-6">
            <div className="bg-tertiary dark:bg-tertiaryDark rounded-md shadow p-4">
                <h3 className="font-semibold text-lg mb-4 text-center">Riwayat Notifikasi</h3>

                {notifications.length === 0 ? (
                    <div className="text-center text-sm text-textBody dark:text-textBodyDark mt-8">
                        Belum ada notifikasi saat ini.
                    </div>
                ) : (
                    Object.entries(grouped).map(([timeLabel, items]) =>
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
                                                <p className="text-sm font-medium">{notif.title}</p>
                                                <p className="text-xs text-textBody dark:text-textBodyDark">
                                                    {format(parseISO(notif.date), "dd MMM yyyy", { locale: id })}
                                                </p>

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
                    )
                )}
            </div>
        </aside>
    );
}
