import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../data/auth";

export function useUnreadChats() {
  const [unreadChats, setUnreadChats] = useState(0);

  useEffect(() => {
    const fetchUnreadChats = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/messages/conversations", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        // count how much chats have unread messages
        const count = res.data.filter(chat => Number(chat.unreadCount) > 0).length;
        setUnreadChats(count);
      } catch (err) {
        console.error("Error fetching unread chats:", err);
      }
    };

    fetchUnreadChats();
    const interval = setInterval(fetchUnreadChats, 5000); // refresh each 5 secs
    return () => clearInterval(interval);
  }, []);

  return unreadChats;
}
