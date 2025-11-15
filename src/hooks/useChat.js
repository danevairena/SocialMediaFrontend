import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { getToken } from "../data/auth";
import { useProfileContext } from "../context/ProfileContext";

export function useChat(initialReceiverId) {
  const { profile } = useProfileContext();
  const [receiverId, setReceiverId] = useState(initialReceiverId);
  const [messages, setMessages] = useState([]);
  const intervalRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    if (!profile?.id) return;
    if (!receiverId || isNaN(receiverId)) return;

    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(
        `http://localhost:3001/api/messages/${receiverId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data);
    } catch (err) {
      console.error("useChat: error fetching messages:", err);
    }
  }, [profile?.id, receiverId]);

  const sendMessage = useCallback(
    async (content) => {
      if (!profile?.id || !receiverId || !content.trim()) return;

      try {
        const token = getToken();
        if (!token) return;

        const { data } = await axios.post(
          "http://localhost:3001/api/messages",
          { receiverId, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.error("useChat: error sending message:", err);
      }
    },
    [profile?.id, receiverId]
  );

  // Fetch new messages when receiverId is changed
  useEffect(() => {
    if (!receiverId) {
      setMessages([]);
      return;
    }

    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 3000);

    return () => clearInterval(intervalRef.current);
  }, [receiverId, fetchMessages]);

  return { messages, sendMessage, setReceiverId };
}
