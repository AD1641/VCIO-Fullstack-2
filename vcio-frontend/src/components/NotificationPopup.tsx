type Notification = {
  title: string;
  message: string;
  time: string;
};

type Props = {
  notifications: Notification[];
  closePopup: () => void;
};

export default function NotificationPopup({ notifications, closePopup }: Props) {
  return (
    <div className="popup-card">
      <div className="popup-content">
        {notifications.length === 0 ? (
          <div className="popup-empty">No new notifications</div>
        ) : (
          notifications.map((n, index) => (
            <div key={index} className="popup-item">
              <div className="popup-text">
                <span className="popup-title">{n.title}</span>: {n.message}
              </div>
              <div className="popup-time">{n.time}</div>
            </div>
          ))
        )}
      </div>
      
      {/* See All Button */}
      <div className="popup-footer">
        <button className="see-all-btn" onClick={closePopup}>See all</button>
      </div>
    </div>
  );
}
