 
import React, { useEffect, useRef, useState } from 'react'
import { CompanyInfo } from './CompanyInfo'
import { BotMessageSquare, Send, X } from 'lucide-react';
import RequestToSimaduAI from './RequestToSikuyi';

interface ChatMessage {
  hideInChat?: boolean;
  role: "model" | "user";
  text?: string;
  isLoader?: boolean;
  isError?: boolean;
}

interface PopupAiProps {
  aiActive: boolean;
  setAiActive: (active: boolean) => void;
}

interface ButtonAiProps {
  aiActive: boolean;
  setAiActive: (active: boolean) => void;
}

const LoaderAi = (
  <div className="bubble bubble-ai rounded-md">
    <span className="sender sender-ai">Simadu AI</span>
    <div className="mess-greenai">
      <div className="loader"></div>
    </div>
  </div>
);

const PopupAi: React.FC<PopupAiProps> = ({ aiActive, setAiActive }) => {
  const { requestAi } = RequestToSimaduAI();
  const [disButton, setDisButton] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      hideInChat: true,
      role: "model",
      text: CompanyInfo,
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMess = inputRef.current?.value.trim();
    if (!userMess) return;
    if (inputRef.current) inputRef.current.value = "";
    setDisButton(true);

    // Update chat history when user sends a message
    setChatHistory((history) => [...history, { role: "user", text: userMess }]);

    // Add loader to chat history temporarily
    setChatHistory((history) => [...history, { role: "model", isLoader: true }]);

    try {
      setTimeout(async () => {
        const res = await requestAi([
          ...chatHistory,
          { role: "user", text: `By using the details given above and only using Indonesian please answer this question: ${userMess}` },
        ]);

        setDisButton(false);
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.isLoader ? { role: "model", hideInChat: false, text: res, isError: false } : msg
          )
        );
      }, 2000);
    } catch (error) {
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.isLoader ? { 
            role: "model", 
            hideInChat: false, 
            text: error instanceof Error ? error.message : 'An unknown error occurred', 
            isError: true 
          } : msg
        )
      );
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ 
        top: chatBodyRef.current.scrollHeight, 
        behavior: "smooth" 
      });
    }
  }, [chatHistory]);

  return (
    <div
      className="px-3 py-2 bg-white dark:bg-gray-800 rounded-md popup-ai shadow-sm flex flex-col items-center fixed"
      style={{ 
        display: aiActive ? "flex" : "none", 
        right: "20px", 
        bottom: "140px", 
        zIndex: "2000" 
      }}
    >
      <div className="w-full py-2 border-bottom items-center flex justify-between">
        <div className="flex gap-2 items-center">
          <span className="text-primary dark:text-textDark font-bold">Simadu AI</span>
        </div>
        <button 
          className="btn btn-close text-black dark:text-white" 
          onClick={() => setAiActive(!aiActive)}
        >
          <X />
        </button>
      </div>
      <div 
        className="w-full flex gap-2 body-chat-greenai py-3 flex-col" 
        ref={chatBodyRef}
      >
        {chatHistory.length > 1 ? (
          chatHistory.map((chat, index) => {
            if (chat.isLoader) {
              return <div key={index}>{LoaderAi}</div>;
            }
            return (
              !chat.hideInChat && (
                <div
                  key={index}
                  className={`bubble bubble-${chat.role === "model" ? "ai" : "user"} ${
                    chat.isError ? "text-red-500" : ""
                  } rounded-md`}
                >
                  <span
                    className={`sender sender-${chat.role === "model" ? "ai" : "user"}`}
                  >
                    {chat.role === "model" ? "SimaduAI" : "User"}
                  </span>
                  <p className="mess-greenai">{chat.text}</p>
                </div>
              )
            );
          })
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <span className="text-satoshi text-muted border-bottom text-black dark:text-white">
              Tanyakan apa saja ke Simadu AI
            </span>
          </div>
        )}
      </div>
      <form className="w-full gap-2 flex items-center" onSubmit={handleSubmit}>
        <div className="w-full">
          <input
            type="text"
            ref={inputRef}
            placeholder="Tanya Dengan SimaduAI.."
            required
            className="w-full bg-gray-200 dark:bg-gray-600 text-black dark:text-white p-2 rounded-md"
          />
        </div>
        <div>
          <button 
            className="button p-2 rounded-md bg-primary text-white" 
            disabled={disButton}
          >
            <Send />
          </button>
        </div>
      </form>
    </div>
  );
};

const ButtonAi: React.FC<ButtonAiProps> = ({ aiActive, setAiActive }) => {
  const [firstSpan, setFirstSpan] = useState<boolean>(false);
  
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFirstSpan(true);
    }, 500);
    
    const timer2 = setTimeout(() => {
      setFirstSpan(false);
    }, 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div 
      className='fixed con-btn-ai flex justify-center items-center' 
      style={{
        right: "20px", 
        bottom: "30px", 
        zIndex: "1000"
      }}
    >
      <div 
        className='bg-primary span-hover-greenai text-white' 
        style={{ opacity: firstSpan ? "1" : "0" }}
      >
        <span>Simadu AI</span>
      </div>
      <div 
        className='rounded-md btn-ai flex items-center justify-center text-white shadow-sm bg-primary dark:bg-primaryDark' 
        onClick={() => setAiActive(!aiActive)}
      >
        <BotMessageSquare />
      </div>
    </div>
  );
};

const SimaduAI: React.FC = () => {
  const [aiActive, setAiActive] = useState<boolean>(false);
  
  return (
    <div>
      <PopupAi aiActive={aiActive} setAiActive={setAiActive} />
      <ButtonAi aiActive={aiActive} setAiActive={setAiActive} />
    </div>
  );
};

export default SimaduAI;