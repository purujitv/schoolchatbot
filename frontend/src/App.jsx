import React, { useState } from 'react';
import axios from 'axios';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { MessageCircle } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Ask me anything about students, teachers, or classes.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: false
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    // Add user's message to chat UI
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post("https://schoolchatbot-27vz.onrender.com/ask", { question: text });

      // Add chatbot's response
      const botMessage = {
        id: newMessage.id + 1,
        text: response.data.answer,  // <-- Use 'answer' from backend
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Failed to fetch response:", error);

      const errorMessage = {
        id: newMessage.id + 1,
        text: "⚠️ Failed to get response from server. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center gap-2">
          <MessageCircle size={24} />
          <h1 className="text-xl font-semibold">School Chatbot</h1>
        </div>

        {/* Messages Container */}
        <div className="h-[500px] overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              timestamp={message.timestamp}
              isOwn={message.isOwn}
            />
          ))}

          {isLoading && (
            <div className="text-gray-500 text-sm mt-2">Thinking...</div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default App;
