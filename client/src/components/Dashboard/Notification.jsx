import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext'; 
import './Notification.css';

const BACKEND_URL = "http://localhost:5000";

const Notification = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BACKEND_URL}/api/notifications`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notificationData) => {

      setNotifications(prev => [notificationData, ...prev]);
    };

    socket.on('new-notification', handleNewNotification);

    return () => {
      socket.off('new-notification', handleNewNotification);
    };
  }, [socket]);

  const markAllAsRead = async () => {
   
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));


    try {
        const token = localStorage.getItem('token');
        await fetch(`${BACKEND_URL}/api/notifications/mark-read`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      
    }
  };

  if (loading) {
    return <div className="notifications-container"><p>Loading notifications...</p></div>;
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <button 
          onClick={markAllAsRead} 
          className="mark-read-btn"
         
          disabled={!notifications.some(n => !n.is_read)}
        >
          Mark all as read
        </button>
      </div>

      <ul className="notifications-list">
        {notifications.length === 0 ? (
          <p className="empty-msg">No notifications available. 🎉</p>
        ) : (
          notifications.map((notif) => (
            <li key={notif.id} className={`notification-item ${notif.is_read ? 'read' : ''}`}>
              <div className="notif-message">{notif.message}</div>
              <div className="notif-meta">{new Date(notif.created_at).toLocaleString()}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Notification;