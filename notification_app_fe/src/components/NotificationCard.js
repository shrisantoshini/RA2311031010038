import React from 'react';
import './NotificationCard.css';

function NotificationCard({ notification, isNew }) {
  // Determine badge color based on notification type
  const getBadgeColor = (type) => {
    switch (type) {
      case 'Placement':
        return '#10b981'; // Emerald
      case 'Result':
        return '#3b82f6'; // Blue
      case 'Event':
        return '#f59e0b'; // Amber
      default:
        return '#64748b'; // Slate
    }
  };

  const formattedDate = new Date(notification.Timestamp).toLocaleString();

  return (
    <div className={`notification-card ${isNew ? 'is-new' : 'is-viewed'}`}>
      <div className="notification-header">
        <span 
          className="type-badge" 
          style={{ backgroundColor: getBadgeColor(notification.Type) }}
        >
          {notification.Type}
        </span>
        <span className="timestamp">{formattedDate}</span>
      </div>
      <p className="message">{notification.Message}</p>
      {isNew && <span className="new-indicator">New</span>}
    </div>
  );
}

export default NotificationCard;
