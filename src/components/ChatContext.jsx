// src/contexts/ChatContext.js
import { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  return (
    <ChatContext.Provider value={{
      messages,
      setMessages,
      currentConversationId,
      setCurrentConversationId
    }}>
      {children}
    </ChatContext.Provider>
  );
};
