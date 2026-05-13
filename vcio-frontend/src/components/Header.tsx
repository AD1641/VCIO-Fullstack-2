import NotificationPopup from "./NotificationPopup";

type Notification = {
  title: string;
  message: string;
  time: string;
};

type HeaderProps = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  notifications: Notification[];
  showPopup: boolean;
  setShowPopup: (show: boolean) => void;
};

export default function Header({ currentPage, setCurrentPage, notifications, showPopup, setShowPopup }: HeaderProps) {
  return (
    <header className="header">
      
      {/* LEFT SECTION: Logo + Bell + Nav */}
      <div className="header-left">
        
        {/* 1. VODAFONE LOGO (SVG) */}
        <div className="logo-container">
          <svg viewBox="0 0 100 100" className="vodafone-logo">
          <g>
            <image href="/icons/vodafoneHeader.svg" width="100" height="100" />
          </g>
          </svg>
        </div>

        {/* 2. NOTIFICATIONS (Wrapper is 'relative' so popup floats relative to this) */}
        <div className="notification-wrapper">
          <div className="bell-icon" onClick={() => setShowPopup(!showPopup)}>
            {/* SVG Bell Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            
            {/* Red Badge */}
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </div>

          
          {showPopup && (
            <NotificationPopup 
              notifications={notifications} 
              closePopup={() => setShowPopup(false)} 
            />
          )}
        </div>

        {/* 3. NAVIGATION */}
        <nav className="nav-links">
          {["chat", "dashboard", "timeline"].map((page) => (
            <span
              key={page}
              className={currentPage === page ? "active" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </span>
          ))}
        </nav>
      </div>

      {/* RIGHT SECTION */}
      <div className="header-right">
        <strong>Vcio.</strong> AI-powered Chief Information Officer
      </div>
    </header>
  );
}
