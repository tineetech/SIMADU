import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReportedPost } from "../../types";

interface PostDetailModalProps {
    post: ReportedPost | null;
    onClose: () => void;
    onVerify?: () => void;
}

export default function PostDetailModal({ post, onClose, onVerify }: PostDetailModalProps) {

    return (
        <AnimatePresence>
            {post && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white dark:bg-backgroundDark p-6 rounded-xl shadow-2xl w-full max-w-md relative"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col gap-4">
                            {/* Optional image */}
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt="Post Image"
                                    className="rounded-lg w-full max-h-56 object-cover"
                                />
                            )}

                            <div className="flex flex-col gap-1">
                                <h2 className="text-lg font-semibold text-text dark:text-textDark">{post.title}</h2>
                                <p className="text-sm text-gray-500 dark:text-textBodyDark">
                                    Dilaporkan oleh: <strong>{post.reportedBy}</strong>
                                </p>
                                <p className="text-sm text-gray-500 dark:text-textBodyDark">
                                    Tanggal: <span className="font-medium">{post.date}</span>
                                </p>
                                <p className="text-sm text-gray-600 dark:text-textBodyDark">
                                    <strong>Kategori:</strong> {post.category}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-textBodyDark">
                                    <strong>Alasan Laporan:</strong> {post.reason}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-textDark leading-relaxed mt-2 whitespace-pre-line">
                                    <strong>Isi Postingan:</strong><br />
                                    {post.content}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 text-text dark:text-textDark hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >
                                    Tutup
                                </button>
                                {onVerify && (
                                    <button
                                        onClick={() => {
                                            onVerify();
                                            onClose();
                                        }}
                                        className="px-4 py-2 rounded-md text-sm font-medium bg-primary hover:bg-primary/70 text-white transition"
                                    >
                                        Verifikasi
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
