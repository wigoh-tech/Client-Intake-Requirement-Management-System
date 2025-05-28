"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useUser } from "@clerk/nextjs";

interface Sender {
  name: string;
  role: string;
  email: string;
}

interface Message {
  sender: Sender;
  message: string;
  time: string;
}

export default function ReviewSection({
  requirementVersionId,
}: {
  requirementVersionId: number;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { user } = useUser();

  // Fetch messages from backend API
  const fetchComments = async () => {
    if (!requirementVersionId) return;
    try {
      const res = await axios.get(`/api/comments?requirementVersionId=${requirementVersionId}`);
      // res.data.content is an array of Message
      setMessages(res.data.content || []);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  useEffect(() => {
    if (!requirementVersionId) return;

    fetchComments();

    // Setup socket.io client (optional: enable only if you use WS server)
    socketRef.current = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    socketRef.current.on("new_comment", (comment: any) => {
      const newMsg: Message = {
        sender: comment.sender || comment.author || { name: "Unknown", role: "client", email: "" },
        message:
          typeof comment.content === "string"
            ? comment.content
            : comment.content?.text || JSON.stringify(comment.content),
        time: comment.createdAt || new Date().toISOString(),
      };

      setMessages((prev) => {
        // Avoid duplicate messages
        if (prev.some((msg) => msg.message === newMsg.message && msg.time === newMsg.time)) {
          return prev;
        }
        return [...prev, newMsg];
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [requirementVersionId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);

    try {
      await axios.post("/api/comments", {
        content: newMessage,
        requirementVersionId,
      });

      setNewMessage("");
      fetchComments(); // Refresh messages after sending
    } catch (err) {
      console.error("Error sending message", err);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-4 p-4 border rounded-xl bg-white shadow">
      <div className="h-156 overflow-y-auto border-b pb-4 mb-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-400">No messages yet.</p>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 flex ${
              msg.sender.role === "admin" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-xl p-3 max-w-[70%] ${
                msg.sender.role === "admin" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
              }`}
            >
              <div className="text-sm font-semibold">
                {msg.sender.role === "admin" ? "Admin" : msg.sender.name}
              </div>
              {/* Show only message text, NOT JSON */}
              <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.time).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-violet-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
