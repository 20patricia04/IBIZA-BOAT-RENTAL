import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaComments, FaSearch, FaCogs, FaPlus } from "react-icons/fa";
import "../styles/dashboard.css";
import logo from '../assets/chat-icon.png';
import axios from "axios";
import { createConversation, getConversationHistory } from "../services/chatService";

function Sidebar() {
  const [userEmail, setUserEmail] = useState("");
  const [userInitial, setUserInitial] = useState("U");
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const { conversationId: activeConversationId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
    const storedEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");

    if (storedEmail) {
      setUserEmail(storedEmail);
      setUserInitial(storedEmail.charAt(0).toUpperCase());
    }

    if (token && userId) {
      axios.get(`http://localhost:8000/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const email = res.data.email;
        setUserEmail(email);
        setUserInitial(email.charAt(0).toUpperCase());

        // Update storage in case it's outdated
        localStorage.setItem("userEmail", email);
      })
      .catch(err => {
        console.error("Failed to fetch user data:", err);
        if (!storedEmail) {
          setUserEmail("unknown@example.com");
          setUserInitial("U");
        }
      });

      fetchConversations();
    } else {
      if (!storedEmail) {
        setUserEmail("unknown@example.com");
        setUserInitial("U");
      }
    }
  }, []);

  const fetchConversations = async () => {
    try {
      const history = await getConversationHistory();
      setConversations(history);
    } catch (error) {
      console.error("Failed to fetch conversation history:", error);
    }
  };

  const handleNewChat = async () => {
    try {
      const newConversation = await createConversation({ title: "New Conversation" });
      navigate(`/chat/${newConversation.id}`);
      fetchConversations();
    } catch (error) {
      console.error("Failed to create new conversation:", error);
    }
  };

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" className="logo" />
          <span className="logo-text">DOSETIMPEX</span>
        </div>

        <nav className="sidebar-menu">
          <button onClick={handleNewChat} className="sidebar-item new-chat-button">
            <div className="item-left"><FaPlus className="chat-icon-chat-search" /><span>New Chat</span></div>
          </button>

          <Link to="/search" className="sidebar-item">
            <div className="item-left"><FaSearch className="chat-icon-chat-search" /><span>Search</span></div>
          </Link>
          <Link to="/settings" className="sidebar-item">
            <div className="item-left"><FaCogs className="chat-icon-settings"/><span>Settings</span></div>
          </Link>

          <div className="conversation-history">
            <h3>Chats</h3>
            {conversations.length > 0 ? (
              <ul>
                {conversations.map(conv => (
                  <li key={conv.id} className={conv.id === activeConversationId ? "active-chat-item" : ""}>
                    <Link to={`/chat/${conv.id}`} className="sidebar-item">
                      <div className="item-left"><FaComments className="chat-icon-chat-search" /><span>{conv.title || `Conversation ${conv.id.substring(0, 4)}...`}</span></div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-chats-message">No conversations yet.</p>
            )}
          </div>
        </nav>
      </div>

      <Link to="/profile" className="sidebar-user">
        <div className="user-avatar">{userInitial}</div>
        <div className="user-info">
          <div className="user-email">{userEmail}</div>
        </div>
      </Link>
    </div>
  );
}

export default Sidebar;
