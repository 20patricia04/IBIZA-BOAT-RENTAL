import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { createConversation } from "../services/chatService";
import { ChatContext } from "./ChatContext";
import { useContext } from "react";

function Topbar() {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const main = document.querySelector(".main-area");
    if (main) {
      if (darkMode) {
        main.classList.remove("light-mode");
      } else {
        main.classList.add("light-mode");
      }
    }
  }, [darkMode]);
  
  const { messages, setMessages, setCurrentConversationId } = useContext(ChatContext);

  const handleNewChat = async () => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
    console.log("Token:", token);
    console.log("UserEmail:", userEmail);
    if (!token || !userEmail) {
      const token=sessionStorage.getItem("authToken");
      const userEmail=sessionStorage.getItem("userEmail");
      console.error("Token sau email lipsă.");
      return;
    }
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.sub;
      console.log("userId extras din token:", userId);

      if (messages.length > 0) {
        await createConversation({
          user_id: userId,
          title: `Conversație salvată - ${new Date().toLocaleString()}`,
          sender: messages[messages.length - 1]?.content || "Mesaj implicit"
        });
      }
  

      const response = await createConversation({
        user_id: userId,
        title: `Conversație nouă - ${new Date().toLocaleString()}`,
        sender: "Bună!"
      });
  
  
      const conversationId = response.conversation_id || response.id; 
      if (!conversationId) {
        console.error("conversation_id lipsă în răspuns");
        return;
      }
  
      setMessages([]);
      setCurrentConversationId(conversationId);  

      navigate(`/chat/${conversationId}`);


    } catch (error) {
      console.error("Eroare la crearea conversației:", error);
    }
  };
  
  

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="topbar">
      <button className="new-chat-btn" onClick={handleNewChat}>+ New chat</button>
      <div className="toggle-switch" onClick={toggleTheme}>
        <div className={`switch-circle ${darkMode ? "left" : "right"}`}></div>
      </div>
    </div>
  );
}

export default Topbar;
