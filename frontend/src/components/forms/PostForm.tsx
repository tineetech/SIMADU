import { useRef, useState } from "react";
import { Image, Smile, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import DataUser from "../../services/dataUser";

const LoaderAi = (
    <div className="loader-post"></div>
);

export default function PostForm() {
    const [isFocused, setIsFocused] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageRaw, setImageRaw] = useState<string | null>(null);
    const [showEmojis, setShowEmojis] = useState(false);
    const [postContent, setPostContent] = useState("");
    const token = localStorage.getItem('authToken') ?? '';
    const datasUser = DataUser()

    const fileInputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleWrapperFocus = () => {
        if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
        setIsFocused(true);
    };

    const handleWrapperBlur = () => {
        blurTimeoutRef.current = setTimeout(() => {
            if (!wrapperRef.current?.contains(document.activeElement)) {
                setIsFocused(false);
                setShowEmojis(false);
            }
        }, 150);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = () => {
                setIsFocused(true);
                setImageRaw(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEmojiClick = (emoji: string) => {
        setPostContent((prev) => prev + emoji);
    };
    const [postProses, setPostProses] = useState(false)
    const post = async () => {
        setPostProses(true)
        const formData = new FormData();
        formData.append('content', postContent?.toString() ?? '');
        formData.append('user_id', datasUser?.data?.user_id?.toString() ?? '');
        
        try {
            if (selectedImage !== null) {

                formData.append('media', selectedImage ?? null);
                formData.append('type', 'image');

                const res = await fetch(`${import.meta.env.VITE_POST_SERVICE}/api/postingan/create`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                })

                if (!res?.ok) {
                    console.error(res)
                    Swal.fire({
                        title: "Gagal Membuat Postingan",
                        text: "Terjadi kesalahan saat menghubungi server.",
                        icon: "error",
                    });
                    setPostProses(false)
                    return
                }

                Swal.fire({
                    title: "Berhasil Membuat Postingan",
                    text: "Postingan berhasil dibuat.",
                    icon: "success",
                }).then((res) => {
                    if (res.isConfirmed) {
                        location.reload()
                    }
                })
                return
            }

            const res = await fetch(`${import.meta.env.VITE_POST_SERVICE}/api/postingan/create`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!res?.ok) {
                Swal.fire({
                    title: "Gagal Membuat Postingan",
                    text: "Terjadi kesalahan saat menghubungi server.",
                    icon: "error",
                });
                setPostProses(false)
                return
            }

            Swal.fire({
                title: "Berhasil Membuat Postingan",
                text: "Postingan berhasil dibuat.",
                icon: "success",
            }).then((res) => {
                if (res.isConfirmed) {
                    location.reload()
                }
            });
            setPostProses(false)
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <motion.div
            animate={{ scale: isFocused ? 1.01 : 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-gray-100 dark:bg-tertiaryDark p-4 rounded-lg mb-6 overflow-hidden"
        >
            <div
                ref={wrapperRef}
                onFocus={handleWrapperFocus}
                onBlur={handleWrapperBlur}
                tabIndex={-1}
            >
                {/* Preview Gambar di atas */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            key="image-preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative mb-4"
                        >
                            <img src={imageRaw ?? ""} alt="preview" className="rounded-lg max-h-60 object-cover" />
                            <button
                                className="absolute top-2 right-2 bg-gray-500 p-1 rounded-full hover:bg-black/80"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X size={18} color="white" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Text Area */}
                <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-tertiaryDark text-textBody dark:text-textBodyDark p-3 rounded-lg resize-none outline-none"
                    rows={isFocused ? 4 : 3}
                    placeholder="Apa yang ingin kamu bagikan hari ini?"
                />

                {/* Aksi Form */}
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            key="form-actions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-center justify-between mt-2 px-1">
                                <div className="flex gap-4 text-gray-400 relative overflow-visible">
                                    <button
                                        type="button"
                                        className="hover:text-accent"
                                        title="Gambar"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Image size={20} />
                                    </button>

                                    <div className="relative flex">
                                        <button
                                            type="button"
                                            className="hover:text-accent"
                                            title="Emoji"
                                            onClick={() => setShowEmojis((prev) => !prev)}
                                        >
                                            <Smile size={20} />
                                        </button>

                                        <AnimatePresence>
                                            {showEmojis && (
                                                <motion.div
                                                    key="emoji-picker"
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="absolute bottom-full left-1/2 -translate-x-4 mb-2 z-50 bg-background dark:bg-backgroundDark p-4 rounded-xl shadow-xl grid grid-cols-8 gap-3 text-2xl min-w-[260px] after:content-[''] after:absolute after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2 after:border-[8px] after:border-transparent after:border-t-tertiary dark:after:border-t-tertiaryDark"
                                                >
                                                    {["😀", "😂", "😎", "😢", "🤔", "🔥", "❤️", "👍", "🙌", "🌟", "💡", "💬"].map((emoji) => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => handleEmojiClick(emoji)}
                                                            className="hover:scale-125 transition-transform duration-200"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </motion.div>

                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <button className="bg-primary text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition" onClick={() => post()}>
                                    {
                                        postProses ? (
                                            <div>
                                                {LoaderAi}
                                            </div>
                                        ) : 'Posting'
                                    }
                                </button>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
