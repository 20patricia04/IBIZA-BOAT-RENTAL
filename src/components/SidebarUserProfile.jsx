import { Link } from "react-router-dom";
import { FaComments, FaSearch, FaCogs } from "react-icons/fa";
import "../styles/userProfile.css";
import logo from '../assets/chat-icon.png';

function SidebarUserProfile() {
  const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "U";


  return (
    <div className="sidebar sidebar-compact">
      <Link to="/dashboard" className="sidebar-logo">
        <div className="logo-circle">
            <img src={logo} alt="Logo" className="logo-img" />
        </div>
      </Link>


      <nav className="sidebar-menu icons-only">
        <Link to="/chats" className="sidebar-item">
          <FaComments className="chat-icon-chat-search" />
        </Link>
        <Link to="/search" className="sidebar-item">
          <FaSearch className="chat-icon-chat-search" />
        </Link>
      </nav>
    </div>
  );
}

export default SidebarUserProfile;
