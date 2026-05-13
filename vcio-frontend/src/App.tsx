import { useState } from "react";
import "./styles/main.css";
import Header from "./components/Header";
import ChatPage from "./pages/ChatPage"; 
import Dashboard from "./pages/Dashboard";
import Timeline from "./pages/Timeline";

// Types needed for Header
type Notification = {
  title: string;
  message: string;
  time: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("chat");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  
  const [notifications] = useState<Notification[]>([
    { title: "Security alert", message: "MFA not enabled for users", time: "2 minutes ago" },
    { title: "Compliance issue", message: "Detected in Northwind", time: "10 minutes ago" },
  ]);

  return (
    <>
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        notifications={notifications}
        showPopup={showPopup}
        setShowPopup={setShowPopup}
      />

      {/* The View Container */}
      <div className="app-container">
        {currentPage === "chat" && <ChatPage />}
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "timeline" && (
          <Timeline
            filteredLicences={[]} // TODO: Replace with actual filtered licences data
            expandedMonths={[]} // TODO: Replace with actual expanded months state
            toggleMonth={() => {}} // TODO: Replace with actual toggleMonth handler
            filter="" // TODO: Replace with actual filter value
            setFilter={() => {}} // TODO: Replace with actual setFilter handler
          />
        )}
      </div>
    </>
  );
}
