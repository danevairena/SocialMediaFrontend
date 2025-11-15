import { useState, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { useProfileContext } from "../contexts/ProfileContext";

export default function ChatWindow({ receiver }) {
  const { profile } = useProfileContext();
  const { messages, sendMessage, fetchMessages } = useChat(receiver?.id);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to las message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark as read - only if there are unread messages
  useEffect(() => {
    const markSeen = async () => {
      if (!profile?.id || !receiver?.id) return;
      // Check for unread messages
      const hasUnread = messages.some(
        (msg) => msg.senderId === receiver.id && !msg.seen
      );
      if (!hasUnread) return;

      try {
        await fetch(`http://localhost:3001/api/messages/seen/${receiver.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        // Refetch messages after mark
        fetchMessages();
      } catch (err) {
        console.error("Error marking messages as seen:", err);
      }
    };

    markSeen();
  }, [messages, profile?.id, receiver?.id, fetchMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    await sendMessage(trimmed);
    setNewMessage("");
  };

  return (
    <div
      className="d-flex flex-column border rounded p-3"
      style={{ height: "500px", maxWidth: "500px" }}
    >
      <h5 className="mb-3">{receiver.username}</h5>
      <div
        className="flex-grow-1 overflow-auto mb-3"
        style={{ maxHeight: "400px", scrollBehavior: "smooth" }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`d-flex mb-2 ${
              msg.senderId === profile.id ? "justify-content-end" : "justify-content-start"
            }`}
          >
            <div
              className={`p-2 rounded ${
                msg.senderId === profile.id ? "bg-primary text-white" : "bg-light"
              }`}
              style={{ maxWidth: "70%" }}
            >
              <div>{msg.content}</div>
              <small className="text-muted d-block text-end">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {msg.senderId === profile.id && msg.seen && " ✓"}
              </small>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}
