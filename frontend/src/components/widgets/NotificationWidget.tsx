import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { isThisWeek, parseISO } from "date-fns";
import DataUser from "../../services/dataUser";

export default function NotificationWidget() {
    const [notifications, setNotifications] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const datas = DataUser()
    const token = localStorage.getItem('authToken') ?? '';

    const getAllNotif = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_NOTIF_SERVICE}/api/notification`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                console.log("gagal get notif: ", res)
                return 
            }

            const data = await res.json()
            console.log(data)
            if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
                const mappedNotifications = data.data.filter((item) => item.user_id === datas.data?.user_id).map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    detail: item.message,
                    date: item.created_at.split('T')[0], // Ambil hanya bagian tanggal
                    checked: !!item.is_read, // Konversi is_read menjadi boolean
                    // Anda bisa menambahkan mapping field lain jika dibutuhkan
                }));
                setNotifications(mappedNotifications);
            } else {
                console.log("Tidak ada data notifikasi yang valid dari API.");
                setNotifications([]); // Set state ke array kosong jika tidak ada data
            }
        } catch (e) {
            console.error(e)
        }
    }
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

    useEffect(() => {
        getAllNotif()
    }, [])

    // Filter notifikasi minggu ini
    const thisWeekNotifications = notifications.filter((notif) =>
        isThisWeek(parseISO(notif.date), { weekStartsOn: 1 })
    );

    // Cek apakah ada yang belum dibaca
    const hasUnread = thisWeekNotifications.some((notif) => !notif.checked);

    const handleNotifClick = (id: number) => {
        // Tandai sebagai telah dicek (hanya lokal/simulasi)
        const updated = notifications.map((notif) =>
            notif.id === id ? { ...notif, checked: true } : notif
        );
        setNotifications(updated);

        // Navigasi ke halaman notifikasi
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
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <li
                                        key={notif.id}
                                        className="rounded-lg p-3 cursor-pointer hover:shadow-md transition bg-gray-50 dark:bg-gray-800"
                                        onClick={() => handleNotifClick(notif.id)}
                                    >
                                        <div className="font-medium">{notif.title}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {notif.detail}
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
