import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { isThisWeek, parseISO } from "date-fns";
import { getAllNotifications, Notification } from "../../services/getNotificationData";

export default function NotificationWidget() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllNotifications();
            setNotifications(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotif(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const thisWeekNotifications = notifications.filter((notif) =>
        isThisWeek(parseISO(notif.date), { weekStartsOn: 1 })
    );

    const hasUnread = thisWeekNotifications.some((notif) => !notif.checked);

    const handleNotifClick = (id: number) => {
        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === id ? { ...notif, checked: true } : notif
            )
        );

        navigate("/profile");
    };

    return (
        <div className="relative" ref={notifRef}>
            <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative text-text dark:text-textDark"
            >
                <Bell size={24} />
                {hasUnread && (
                    <span className="absolute bottom-0 right-0 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
                )}
            </button>

            <AnimatePresence>
                {showNotif && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-tertiary dark:bg-tertiaryDark rounded-xl shadow-lg p-4 z-10 custom-scrollbar"
                    >
                        <h2 className="text-text dark:text-textDark font-semibold mb-3">Notifikasi</h2>
                        <ul className="space-y-2 text-sm text-text dark:text-textDark">
                            {thisWeekNotifications.length > 0 ? (
                                thisWeekNotifications.map((notif) => (
                                    <li
                                        key={notif.id}
                                        className={`rounded-lg p-3 cursor-pointer hover:shadow-md transition ${notif.checked
                                                ? "bg-gray-100 dark:bg-gray-700"
                                                : "bg-gray-50 dark:bg-gray-800"
                                            }`}
                                        onClick={() => handleNotifClick(notif.id)}
                                    >
                                        <div className="font-medium">{notif.title}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {notif.description}
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Tidak ada notifikasi minggu ini.
                                </p>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
