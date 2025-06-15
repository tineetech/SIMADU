import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SendIcon, Bot } from "lucide-react";

type ChatMessage = {
    id: number;
    from: "bot" | "user";
    message: string;
};

type ChatBotModalProps = {
    onClose: () => void;
};

export default function ChatBotModal({ onClose }: ChatBotModalProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, from: "bot", message: "Halo! Ada yang bisa dibantu?" },
    ]);
    const [input, setInput] = useState("");

    const modalRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage: ChatMessage = {
            id: Date.now(),
            from: "user",
            message: input,
        };

        setMessages((prev) => [...prev, newMessage]);

        // Balasan dummy
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    from: "bot",
                    message: "Terima kasih atas pertanyaannya! Tim kami akan menindaklanjuti.",
                },
            ]);
        }, 800);

        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSend();
    };

    // Detect click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                ref={modalRef}
                className="fixed bottom-24 right-6 z-50 w-80 h-[28rem] bg-tertiary dark:bg-tertiaryDark text-text dark:text-textDark rounded-md shadow-xl flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="px-4">
                    <div className="flex justify-between items-center border-b border-textBody dark:border-textBodyDark py-4">
                        <div className="flex items-center gap-2">
                            <Bot size={32} />
                            <h2 className="font-semibold text-xl">SIMADU AI</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="leading-none cursor-pointer"
                        >
                            <X />
                        </button>
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 p-4 space-y-2 overflow-y-auto text-sm scroll-smooth">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`px-4 py-2 rounded-xl whitespace-pre-wrap break-words ${msg.from === "bot"
                                ? "bg-secondary text-textDark text-left text-sm max-w-[75%]"
                                : "bg-accent dark:bg-accentDark text-white ml-auto text-right max-w-[75%]"
                                }`}
                            style={{ width: "fit-content" }}
                        >
                            {msg.message}
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="flex px-4 py-4 gap-2">
                    <input
                        type="text"
                        placeholder="Ketik pesan..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-background dark:bg-backgroundDark w-full rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <button onClick={handleSend} className="text-textDark bg-accent dark:bg-accentDark flex items-center justify-center p-2 rounded-md hover:scale-110 transition ease-in-out cursor-pointer">
                        <SendIcon />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
