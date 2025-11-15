import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { getToken } from "../data/auth";
import "../styles/MessagePage.css";
import { useChat } from "../hooks/useChat";
import { useProfileContext } from "../context/ProfileContext";

function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const token = getToken();
  const { profile } = useProfileContext();
  const myUserId = profile?.id;


  const receiverIdParam = searchParams.get("userId");
  const receiverUsername = searchParams.get("username");
  const receiverId = receiverIdParam ? parseInt(receiverIdParam) : null;

  const { messages, sendMessage, setReceiverId } = useChat(null);

  // Fetch conversations from backend
  const fetchConversations = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/messages/conversations",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConversations(res.data);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  }, [token]);

  // Open conversation
  const openConversation = useCallback(
    (chat) => {
      setSelectedChat(chat);

      // Update receiverId to fetch messages
      setReceiverId(chat.userId);

      // Mark messages as seen
      axios
        .put(`http://localhost:3001/api/messages/seen/${chat.userId}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          // Reset unread count locally
          setConversations((prev) =>
            prev.map((c) =>
              c.userId === chat.userId ? { ...c, unreadCount: 0 } : c
            )
          );
        })
        .catch((err) => console.error("Error marking messages as seen:", err));
    },
    [setReceiverId, token]
  );

  // Auto-open chat when opened from profile
  useEffect(() => {
    if (receiverId && receiverUsername) {
      const chat = {
        userId: receiverId,
        username: receiverUsername,
        profilePic: "/avatars/default-profile-icon.png",
      };
      setSelectedChat(chat);
      setReceiverId(receiverId);
    }
  }, [receiverId, receiverUsername, setReceiverId]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Get messages
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    await sendMessage(newMessage.trim());
    setNewMessage("");
  };

  return (
    <div className="messages-container">
      <Navbar />
      <div className="messages-card">
        <div className="messages-left">
          <h2>Messages</h2>
          <div className="chat-list">
            {conversations.length === 0 && <p>No conversations yet.</p>}
            {conversations.map((chat) => (
              <div
                key={chat.userId}
                className={`chat-item ${
                  selectedChat?.userId === chat.userId ? "active" : ""
                }`}
                onClick={() => openConversation(chat)}
              >
                <img
                  src={chat.profilePic}
                  alt={chat.username}
                  className="chat-avatar"
                />
                <div>
                  <strong>{chat.username}</strong>
                  <p className="last-message">
                    {chat.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="messages-right">
          {selectedChat ? (
            <>
              <h3>{selectedChat.username}</h3>
              <div className="chat-window">
                {messages
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((m) => (
                    <div
                      key={m.id}
                      className={`message ${
                        m.senderId === myUserId ? "sent" : "received"
                      }`}
                    >
                      {m.content}
                    </div>
                ))}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" ? handleSendMessage() : null
                  }
                  placeholder="Type a message..."
                />
                <button className="send-btn" onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat">Select a chat to start messaging</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
