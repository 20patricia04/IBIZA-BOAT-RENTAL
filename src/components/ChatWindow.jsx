import { useState, useEffect } from "react";
import { sendMessage, uploadFile } from "../services/chatService";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { ChatContext } from "./ChatContext";
// în interiorul ChatWindow


function ChatWindow() {
  const location = useLocation();
  const [input, setInput] = useState("");
  const { messages, setMessages, setCurrentConversationId } = useContext(ChatContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.pathname === "/chat/new") {
      setMessages([]);
    }
  }, [location.pathname]);

  const handleSend = async () => {
    if (input.trim() === "" && !selectedFile) return; //Dacă NU există niciun text introdus (sau textul este doar spații goale) ȘI NU este selectat niciun fișier, atunci nu face nimic
    const userMessages = [...messages];

    // Adăugăm mesaj informativ cu numele fișierului
    if (selectedFile) {
      const fileNameMessage = {
        role: "user",
        content: `📎 Fișier încărcat: **${selectedFile.name}**`,
      };
      setMessages([...userMessages, fileNameMessage]);
      setInput("");
      setLoading(true);
      
      // Adăugare document .docx
      const uploadResult = await uploadFile(selectedFile);

      const botFileMsg = {
        role: "bot",
        content: uploadResult.extractedText || "Nu s-a putut extrage textul din fișier.",
      };

      setMessages([...userMessages, fileNameMessage, botFileMsg]);
      setSelectedFile(null);
      setInput("");
      setLoading(false);
      return;
    }

    // Mesaj text normal
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    const response = await sendMessage(input);
    const botMessage = { role: "bot", content: response.answer };
    setMessages([...updatedMessages, botMessage]);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="chat-window">
      {isEmpty ? (
        <div className="chat-empty-state">
          <p className="chat-welcome-message">
            Salut! Scrie un mesaj pentru a începe conversația.
          </p>
          <div className="chat-input">
            <label htmlFor="file-upload" className="file-upload-btn">+</label>
            <input
              id="file-upload"
              type="file"
              accept=".docx"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedFile(file);
                  setInput(`📎 Fișier încărcat: **${file.name}**`);
                }
              }}
            />


            <input
              type="text"
              placeholder="Type '/' for commands"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim() !== "" && !loading) {
                  handleSend();
                }
              }}              
            />
            <button onClick={handleSend} disabled={loading}>&uarr;</button>
          </div>
        </div>
      ) : (
        <>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div className={`chat-message ${msg.role}`} key={idx}>
                <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <label htmlFor="file-upload" className="file-upload-btn">+</label>
            <input
              id="file-upload"
              type="file"
              accept=".docx"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedFile(file);
                  setInput(`📎 Fișier încărcat: **${file.name}**`);
                }
              }}
              
            />

            <input
              type="text"
              placeholder="Type '/' for commands"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim() !== "" && !loading) {
                  handleSend();
                }
              }}              
            />
            <button onClick={handleSend} disabled={loading}>&uarr;</button>
          </div>


        </>
      )}
    </div>
  );
}

const saveCurrentConversation = async () => {
  if (messages.length === 0) return;

  try {
    const payload = {
      messages: messages, // Poți adăuga și timestamp, titlu etc.
    };
    await createConversation(payload);
  } catch (error) {
    console.error("Eroare la salvarea conversației:", error);
  }
};


export default ChatWindow;