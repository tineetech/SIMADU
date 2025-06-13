import { useState } from "react";
import ChatBotButton from "./ChatBotButton";
import ChatBotModal from "./modals/ChatBotModal";
import { AnimatePresence } from "framer-motion";

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <ChatBotButton onClick={() => setIsOpen((prev) => !prev)} />

            <AnimatePresence>
                {isOpen && (
                    <ChatBotModal onClose={() => setIsOpen(false)} />
                )}
            </AnimatePresence>
        </>
    );
}
