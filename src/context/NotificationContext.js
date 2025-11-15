import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useProfileContext } from './ProfileContext';

const NotificationContext = createContext();
const BASE_URL = "http://localhost:3001";

export const NotificationProvider = ({ children }) => {
  const { profile } = useProfileContext();
  const userId = profile?.id || null;
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/notifications/user/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications, userId]);

  const addNotification = async (type, senderId, postId = null) => {
    if (!userId) return;
    try {
      await axios.post(`${BASE_URL}/api/notifications`, {
        ReceiverID: userId,
        SenderID: senderId,
        Type: type,
        PostID: postId
      });
      fetchNotifications();
    } catch (err) {
      console.error("Error adding notification:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      await axios.put(`${BASE_URL}/api/notifications/user/${userId}/read`);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
