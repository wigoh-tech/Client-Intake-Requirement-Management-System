"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { io } from "socket.io-client";

export default function ReviewSection({ requirementVersionId }) {
  const [activeTab, setActiveTab] = useState("comment");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const socketRef = useRef(null);

  const { user } = useUser();
  const currentUsername =
    user?.username ||
    user?.firstName ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "Unknown";

  useEffect(() => {
    if (!requirementVersionId) return;

    socketRef.current = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    fetch(`/api/comments?requirementVersionId=${requirementVersionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setComments(data);
          setHistory(data);
        } else {
          setComments([]);
          setHistory([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
      });

    const handleNewComment = (comment) => {
      console.log("Received new comment via socket:", comment); // Debug
      if (comment.requirementVersionId === requirementVersionId) {
        setComments((prev) => [...prev, comment]);
        setHistory((prev) => [...prev, comment]);
      }
    };

    socketRef.current.on("new_comment", handleNewComment);

    return () => {
      socketRef.current?.off("new_comment", handleNewComment);
    };
  }, [requirementVersionId]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: message,
          requirementVersionId,
          parentCommentId: null,
        }),
      });

      if (!res.ok) throw new Error("Failed to send comment");
      const newComment = await res.json();

      setComments((prev) => [...prev, newComment]);
      setHistory((prev) => [...prev, newComment]);
      setMessage("");
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2 mb-2">
        <button
          onClick={() => setActiveTab("comment")}
          className={`py-1 px-3 ${
            activeTab === "comment"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-gray-600"
          }`}
        >
          Comment
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`py-1 px-3 ${
            activeTab === "history"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-gray-600"
          }`}
        >
          History
        </button>
      </div>

      {/* Comment Section */}
      {activeTab === "comment" && (
        <div className="space-y-4 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded">
          {comments.map((comment) => {
            const isCurrentUser = comment.author === currentUsername;
            return (
              <div
                key={comment.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-md break-words ${
                    isCurrentUser
                      ? "bg-green-100 text-green-900"
                      : "bg-blue-100 text-blue-900"
                  }`}
                >
                  {comment.content}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History Section */}
      {activeTab === "history" && (
        <div className="space-y-3 max-h-64 overflow-y-auto p-2 bg-gray-100 rounded">
          {history.length > 0 ? (
            history.map((comment) => (
              <div
                key={comment.id}
                className="text-sm text-gray-700 border-b pb-2"
              >
                <div className="font-bold">{comment.author}</div>
                <div>{comment.content}</div>
                <div className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No history available.</p>
          )}
        </div>
      )}

      {/* Input Section */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
