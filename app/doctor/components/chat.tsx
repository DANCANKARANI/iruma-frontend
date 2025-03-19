"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string; // Unique ID for each message
  sender: "pharmacist" | "doctor"; // Sender role
  text: string; // Message content
  timestamp: string; // Timestamp of the message
}

export default function DoctorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const connectWebSocket = () => {
      const wsUrl = "ws://localhost:8000/ws"; // Use port 8000 (Go Fiber server)
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        console.log("WebSocket connection established");
      };

      socketRef.current.onmessage = (event) => {
        if (!isMounted) return; // Skip if component is unmounted
        try {
          const newMessage: Message = JSON.parse(event.data);
          // Check if the message is already in the state to avoid duplicates
          if (!messages.some((msg) => msg.id === newMessage.id)) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      socketRef.current.onerror = () => {
        // Suppress WebSocket errors (e.g., during page refresh)
        // Do not log the error to avoid cluttering the console
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket connection closed. Reconnecting...");
        setTimeout(() => {
          if (isMounted && socketRef.current?.readyState === WebSocket.CLOSED) {
            connectWebSocket(); // Reconnect
          }
        }, 3000); // Reconnect after 3 seconds
      };
    };

    connectWebSocket();

    return () => {
      isMounted = false; // Mark component as unmounted
      if (socketRef.current) {
        socketRef.current.close(); // Close WebSocket connection
      }
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(), // Use timestamp as a unique ID
      sender: "doctor",
      text: inputText,
      timestamp: new Date().toLocaleTimeString(),
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(newMessage));
    }

    // Add the message to the local state immediately
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">💬 Chat with Pharmacist</h1>

      <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-md">
        {messages.map((message) => (
          <div
            key={message.id} // Add a unique key prop
            className={`mb-4 ${
              message.sender === "doctor" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-[70%] ${
                message.sender === "doctor"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.sender === "doctor" ? "You" : "Pharmacist"} •{" "}
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-600"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}