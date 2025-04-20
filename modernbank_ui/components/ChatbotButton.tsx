'use client'

// components/ChatbotButton.tsx
import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';

export default function ChatbotButton() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen((prev) => !prev);
    };

    return (
<>
  {/* Chat Open Button */}
  <button
    onClick={toggleChat}
    className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-br from-[#1C4E80] to-[#0B1F3A] text-white rounded-full shadow-xl hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-300"
    aria-label="Open chat"
  >
    <ChatBubbleLeftEllipsisIcon className="w-6 h-6 mx-auto" />
  </button>

  {/* Chat Window */}
  {isChatOpen && <ChatWindow closeChat={toggleChat} />}
</>
    );
}
