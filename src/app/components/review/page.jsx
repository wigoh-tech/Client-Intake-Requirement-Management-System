"use client";
import { useState, useEffect } from "react";

export default function ReviewSection({ requirementVersionId, user }) {
  const [activeTab, setActiveTab] = useState("comment");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!requirementVersionId) return;
    fetch(`/api/comments?requirementVersionId=${requirementVersionId}`)
      .then((res) => res.json())
      .then(setComments);
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
          author: user.name,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to send comment. Server said: ${errorText}`);
      }

      const savedComment = await res.json();
      setComments((prev) =>
        Array.isArray(prev) ? [...prev, savedComment] : [savedComment]
      );
      setMessage("");
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert(err.message);
    }
  };

  return (
    <div className="p-4">
      <div className="mt-4">
        <div className="flex space-x-4 pb-2">
          <button onClick={() => setActiveTab("comment")}
            className={`py-1 px-3 ${
              activeTab === "comment"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"}`}>
            Comment
          </button>
          <button onClick={() => setActiveTab("history")}
            className={`py-1 px-3 ${activeTab === "history"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}>
            History
          </button>
        </div>
        <div className="mt-4">
          {activeTab === "comment" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Conversation</h3>
              <div className="space-y-4 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded ">
                {Array.isArray(comments) &&
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`flex ${
                        comment.author === user.name
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg max-w-md ${
                          comment.author === user.name
                            ? "bg-green-100 text-green-900"
                            : "bg-blue-100 text-blue-900"
                        }`}
                      >
                        {comment.content}
                      </div>
                    </div>
                  ))}
              </div>
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Chat History</h3>
              <div className="space-y-3">
                {Array.isArray(comments) &&
                  comments.map((comment) => (
                    <div key={comment.id}>
                      <div>
                        <p className="text-xs text-gray-500 mt-1">
                          {comment.author}
                        </p>
                        <div
                          className={`px-4 py-2 rounded-lg max-w-md shadow-sm ${
                            comment.author === user.name
                              ? "bg-green-100 text-green-900"
                              : "bg-blue-100 text-blue-900"
                          }`}
                        >
                          <p className="whitespace-pre-line">
                            {comment.content}
                          </p>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
