import { Info, Trash2 } from 'lucide-react';
import { ReportedPost } from '../types';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

interface Props {
    post: ReportedPost;
    onClick: () => void;
}


export default function ReportedPostCard({ post, onClick }: Props) {
    const handleDelete = async () => {
        const isDark = document.documentElement.classList.contains('dark');

        const result = await Swal.fire({
            title: `Yakin ingin menghapus post ini karena ${post.reason}?`,
            text: "Pastikan untuk memeriksa kembali postingan ini sebelum dihapus!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
            background: isDark ? '#1f2937' : undefined, // Tailwind's bg-gray-800
            color: isDark ? '#f9fafb' : undefined, // Tailwind's text-gray-100
            customClass: {
                popup: isDark ? 'dark-swal' : '',
            },
        });

        if (result.isConfirmed) {
            console.log('berhasil dihapus');
            Swal.fire({
                title: 'Dihapus!',
                text: 'Laporan berhasil dihapus.',
                icon: 'success',
                background: isDark ? '#1f2937' : undefined,
                color: isDark ? '#f9fafb' : undefined,
                customClass: {
                    popup: isDark ? 'dark-swal' : '',
                },
            });
        }
    };

    return (
        <motion.div
            className="rounded-xl p-4 bg-background dark:bg-backgroundDark shadow hover:shadow-md transition"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <h3 className="text-sm font-semibold">{post.reason}</h3>
                    <p className="text-xs font-light text-textBody dark:text-textBodyDark">
                        Dilaporkan oleh {post.reportedBy}
                    </p>
                </div>
                <div className="flex gap-3 items-center">
                    <button
                        onClick={onClick}
                        className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                        title="Lihat Detail"
                    >
                        <Info />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-800 transition cursor-pointer"
                        title="Hapus Laporan"
                    >
                        <Trash2 />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
