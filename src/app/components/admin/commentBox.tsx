"use client";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import io, { Socket } from "socket.io-client";

interface Comment {
  id: number;
  author: string;
  content: string;
  requirementVersionId: number;
  createdAt?: string;
  parentCommentId?: number | null;
  sender?: string;
}

export default function CommentBox({ requirementVersionId }: { requirementVersionId: number }) {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("comment");
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useUser();
  const currentUsername = user?.username || user?.firstName || "Unknown";
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!requirementVersionId) return;

    // Connect socket only once
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:4000", {
        transports: ["websocket"],
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });
    }

    // Initial comment fetch
    fetch(`/api/comments?requirementVersionId=${requirementVersionId}`)
      .then((res) => res.json())
      .then((data: Comment[]) => setComments(data))
      .catch((err) => console.error("Fetch comments error:", err));

    const handleNewComment = (comment: Comment) => {
      if (comment.requirementVersionId === requirementVersionId) {
        setComments((prev) => [...prev, comment]);
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
          author: currentUsername,
        }),
      });

      if (!res.ok) throw new Error("Failed to send comment");

      setMessage("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex space-x-4 pb-2">
        <button
          onClick={() => setActiveTab("comment")}
          className={`py-1 px-3 ${
            activeTab === "comment" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
          }`}
        >
          Comment
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`py-1 px-3 ${
            activeTab === "history" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
          }`}
        >
          History
        </button>
      </div>

      <div className="space-y-4 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded">
        {comments.map((comment) => {
          const isCurrentUser = comment.author === currentUsername;
          return (
            <div
              key={comment.id}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-md break-words ${
                  isCurrentUser ? "bg-green-100 text-green-900" : "bg-blue-100 text-blue-900"
                }`}
              >
                {comment.content}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-lg"
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}


