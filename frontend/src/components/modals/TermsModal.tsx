import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TermsModal({
    onClose,
    onAgree,
}: {
    onClose: () => void;
    onAgree: () => void;
}) {
    const contentRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [canAgree, setCanAgree] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const el = contentRef.current;
            if (!el) return;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
                setCanAgree(true);
            }
        };
        contentRef.current?.addEventListener("scroll", handleScroll);
        return () => contentRef.current?.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        // Close modal if clicked outside
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        // Close modal on ESC key press
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center px-4"
            >
                <motion.div
                    ref={modalRef}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-tertiary dark:bg-tertiaryDark rounded-lg p-6 w-full max-w-lg shadow-lg relative"
                >
                    <h3 className="text-lg font-semibold mb-4">Syarat & Ketentuan Penukaran Koin</h3>

                    <div
                        ref={contentRef}
                        className="max-h-60 overflow-y-auto p-3 border border-gray-600 rounded text-sm bg-background dark:bg-backgroundDark"
                    >
                        <ol className="list-decimal pl-4 space-y-2">
                            <li>Minimal penukaran adalah 10.000 koin.</li>
                            <li>Akun harus dalam status terverifikasi sebelum melakukan penukaran.</li>
                            <li>Setiap penukaran akan dikenakan pajak layanan sebesar 10% dari jumlah koin.</li>
                            <li>Proses penukaran membutuhkan waktu maksimal 2x24 jam setelah pengajuan diterima.</li>
                            <li>Koin yang sudah ditukar tidak dapat dikembalikan dengan alasan apapun.</li>
                            <li>Penerima dana penukaran harus sesuai dengan data pada akun pengguna.</li>
                            <li>Pihak penyelenggara berhak menolak penukaran yang terindikasi manipulatif atau curang.</li>
                        </ol>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            className="text-sm px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
                            onClick={onClose}
                        >
                            Batal
                        </button>
                        <button
                            disabled={!canAgree}
                            onClick={onAgree}
                            className={`text-sm px-4 py-2 rounded ${canAgree
                                ? "bg-accent hover:opacity-90 cursor-pointer"
                                : "bg-gray-500 text-gray-300 cursor-not-allowed"
                                }`}
                        >
                            Setuju
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
