import { useParams } from 'react-router-dom';
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ChatWindow from "./ChatWindow";
import "../styles/dashboard.css"; // Păstrăm importul CSS existent

function Dashboard() {
  const { conversationId } = useParams();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <ChatWindow conversationId={conversationId} />
      </div>
    </div>
  );
}

export default Dashboard;
