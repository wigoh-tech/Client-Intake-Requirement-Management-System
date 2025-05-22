// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useUser } from "@clerk/nextjs";
// import { io } from "socket.io-client";

// export default function ReviewSection({ requirementVersionId }) {
//   const [activeTab, setActiveTab] = useState("comment");
//   const [message, setMessage] = useState("");
//   const [comments, setComments] = useState([]);
//   const [history, setHistory] = useState([]);
//   const socketRef = useRef(null);

//   const { user } = useUser();
//   const currentUsername =
//   user?.username ||
//   user?.firstName ||
//   user?.emailAddresses?.[0]?.emailAddress ||
//   "Unknown";

    
//   useEffect(() => {
//     if (!requirementVersionId) return;

//     socketRef.current = io("http://localhost:4000", {
//       transports: ["websocket"],
//     });

//     fetch(`/api/comments?requirementVersionId=${requirementVersionId}`)
//     .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) {
//           setComments(data);
//         } else {
//           setComments([]);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching comments:", err);
//       });

//     const handleNewComment = (comment) => {
//       setComments((prev) => {
//         if (prev.find((c) => c.id === comment.id)) return prev;
//         return [...prev, comment];
//       });

//     };

//     socketRef.current.on("new_comment", handleNewComment);

//     return () => {
//       socketRef.current?.off("new_comment", handleNewComment);
//       socketRef.current?.disconnect();
//     };
//   }, [requirementVersionId]);

//   const handleSend = async () => {
//     if (!message.trim()) return;

//     try {
//       const res = await fetch("/api/comments", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           content: { text: message },
//           reply: null, 
//           requirementVersionId,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to send comment");

//       setMessage(""); 
//     } catch (err) {
//       console.error("Failed to send message:", err);
//     }
//   };

//   return (
//     <div className="p-4 border rounded-lg bg-white shadow-md">
//       {/* Tabs */}
//       <div className="flex space-x-4 border-b pb-2 mb-2">
//         <button
//           onClick={() => setActiveTab("comment")}
//           className={`py-1 px-3 ${
//             activeTab === "comment"
//               ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
//               : "text-gray-600"
//           }`}
//         >
//           Comment
//         </button>
//       </div>

//       {/* Comment Section */}
//       {activeTab === "comment" && (
//         <div className="space-y-4 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded">
//           {comments.map((comment) => {
//             const isCurrentUser = comment.author === currentUsername;
//             return (
//               <div
//                 key={comment.id}
//                 className={`flex ${
//                   isCurrentUser ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`px-4 py-2 rounded-lg max-w-md break-words ${
//                     isCurrentUser
//                       ? "bg-green-100 text-green-900"
//                       : "bg-blue-100 text-blue-900"
//                   }`}
//                 >
//                   {comment.content?.text || comment.content}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}


//       <div className="mt-4 flex gap-2">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className="flex-grow px-4 py-2 border rounded-lg"
//         />
//         <button
//           onClick={handleSend}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }


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
  const currentUsername =
    user?.username ||
    user?.firstName ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";
  
  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments?requirementVersionId=${requirementVersionId}`);
      const allMessages: Message[] = (res.data.content || []).map((c: any) => ({
        sender: c.sender || c.author || { name: "Unknown", role: "client", email: "" },
        message: typeof c.content === "string" ? c.content : c.content?.text || JSON.stringify(c.content),
        time: c.createdAt || new Date().toISOString(),
      }));
      setMessages(allMessages);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  useEffect(() => {
    if (!requirementVersionId) return;

    fetchComments();

    socketRef.current = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    socketRef.current.on("new_comment", (comment: any) => {
      const newMsg: Message = {
        sender: comment.sender || comment.author || { name: "Unknown", role: "client", email: "" },
        message: typeof comment.content === "string" ? comment.content : comment.content?.text || JSON.stringify(comment.content),
        time: comment.createdAt || new Date().toISOString(),
      };

      setMessages((prev) => {
        if (prev.some(msg => msg.message === newMsg.message && msg.time === newMsg.time)) return prev;
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
    } catch (err) {
      console.error("Error sending message", err);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-4 p-4 border rounded-xl bg-white shadow">
      <div className="h-96 overflow-y-auto border-b pb-4 mb-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-400">No messages yet.</p>
        )}
        {messages
          .filter((msg) => msg.sender.name === "mishamdeva" || msg.sender.role === "admin")
          .map((msg, index) => (
            <div
              key={index}
              className={`mb-3 flex ${msg.sender.role === "admin" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-xl p-3 max-w-[70%] ${
                  msg.sender.role === "admin" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
                }`}
              >
                <div className="text-sm font-semibold">
                  {msg.sender.role === "admin" ? "Admin" : msg.sender.name}
                </div>
                <div className="text-sm">{msg.message}</div>
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
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}




