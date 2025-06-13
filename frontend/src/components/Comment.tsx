/* eslint-disable */
import { ArrowRight, ChevronDown, Reply, Trash, } from "lucide-react";
import { CommentInterface } from "../types";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useState } from "react";

interface CommentProps {
    comment: CommentInterface;
    postingan: any;
    handleReply: any;
}

export default function Comment({ comment, postingan, handleReply }: CommentProps) {
    const token = localStorage.getItem("authToken") ?? "";
    const decodedToken = jwtDecode(token);

    const deleteKomen = async (id: number) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_POST_SERVICE}/api/postingan/comments/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                Swal.fire({
                    title: "Gagal Menghapus Komentar",
                    text: "Terjadi kesalahan saat menghubungi server.",
                    icon: "error",
                });
                return;
            }

            const data = await res.json();
            Swal.fire({
                title: "Berhasil Menghapus Komentar",
                text: data.message,
                icon: "success",
            }).then((res) => {
                if (res.isConfirmed) {
                    location.reload();
                }
            });
        } catch (e) {
            console.error(e);
        }
    };

    console.log({comment})
    const [isSeeRepl, setIsSeeReply] = useState(false)

    return (
        <div className="flex gap-3 py-3 w-full">
            {/* Avatar */}
            <img
                src={comment.avatar || "https://via.placeholder.com/150"}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
            />

            {/* Content */}
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col w-full">
                        <div className="flex items-center gap-1 text-sm font-semibold">
                            <span>@{comment.username}</span>
                            {comment.replyTo && (
                                <span className="flex items-center text-xs">
                                    <ArrowRight size={14} />
                                    <span>@{comment.replyTo}</span>
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 break-words">
                            {comment.content}
                        </p>
                        
                        <div className="flex gap-3 mt-3 w-full flex-col">
                            <div className="flex gap-3">
                                <button
                                    className="flex items-center gap-1 hover:text-accent hover:cursor-pointer"
                                    onClick={() => setIsSeeReply(!isSeeRepl)}
                                >
                                    <ChevronDown size={18} /> Lihat {comment?.replies?.length ?? 0} Balasan
                                </button>
                                <button
                                    className="flex items-center gap-1 hover:text-accent hover:cursor-pointer"
                                    onClick={() => handleReply(comment.id, comment.username)}
                                >
                                    <Reply size={18} /> Balas
                                </button>
                            </div>
                            <div className={`w-full py-5 h-auto flex-col gap-8 ${isSeeRepl ? "flex" : "hidden"} rounded-sm`}>
                                {
                                    comment.replies.length > 0 ? comment.replies.map((item) => (
                                        <div className="flex gap-1 text-sm font-semibold">               
                                            {/* Avatar */}
                                            <img
                                                src={item.avatar || "https://via.placeholder.com/150"}
                                                alt="avatar"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div className="flex flex-col">
                                                <span>@{item.username}</span>
                                                {comment.replyTo && (
                                                    <span className="flex items-center text-xs">
                                                        <ArrowRight size={14} />
                                                        <span>@{comment.replyTo}</span>
                                                    </span>
                                                )}
                                                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 break-words">
                                                    {item.content}
                                                </p>

                                            </div>
                                        </div>
                                    )) : ""
                                }
                            </div>
                        </div>
                    </div>

                    {/* Delete Button */}
                    {comment.user_id === decodedToken.id && postingan.comment_count > 0 && (
                        <button
                            onClick={() => deleteKomen(comment.id)}
                            className="text-red-500 hover:text-red-600 transition"
                            title="Hapus Komentar"
                        >
                            <Trash size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
