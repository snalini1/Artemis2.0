"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BotIcon as Robot, ThumbsUp, MapPin, Shield, Newspaper } from "lucide-react";

const API_URL = "http://127.0.0.1:5000/chatbot"; // ✅ Backend route

type Message = {
  id: number;
  text: string;
  isUser: boolean;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi there! I'm Artemis AI, your travel assistant. How can I help you today?", isUser: false },
  ]);
  const [inputText, setInputText] = useState(""); // User input
  const [expectingItinerary, setExpectingItinerary] = useState(false); // ✅ Track user input phase

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  /** Handles user message input */
  const sendMessage = async (question: string) => {
    const newMessage: Message = { id: messages.length + 1, text: question, isUser: true };
    setMessages((prev) => [...prev, newMessage]);

    // ✅ Step 1: If expecting itinerary locations, send them instead of calling GroqCloud
    if (expectingItinerary) {
      setExpectingItinerary(false); // Reset flag
      fetchItinerary(question);
      return;
    }

    // ✅ Step 2: Normal chatbot query
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question }),
      });

      const data = await response.json();
      const botResponse: Message = { id: messages.length + 2, text: data.response, isUser: false };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages((prev) => [...prev, { id: messages.length + 2, text: "Error fetching response. Try again.", isUser: false }]);
    }
  };

  /** Handles itinerary-specific flow */
  const handleItineraryRequest = () => {
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, text: "Plan My Itinerary", isUser: true },
      { id: prev.length + 2, text: "Type in your destinations (separate multiple locations with commas).", isUser: false },
    ]);
    setExpectingItinerary(true); // ✅ Expecting location input from user next
  };

  /** Calls backend to fetch itinerary from GroqCloud */
  const fetchItinerary = async (locations: string) => {
    try {
      const response = await fetch(`${API_URL}/plan_itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locations }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 2, text: data.response, isUser: false },
      ]);
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      setMessages((prev) => [...prev, { id: prev.length + 2, text: "Failed to fetch itinerary.", isUser: false }]);
    }
  };

  /** Handles form input submission */
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText("");
    }
  };

  const questionButtons = [
    { icon: <MapPin className="w-5 h-5" />, label: "Plan My Itinerary", action: handleItineraryRequest },
    { icon: <Newspaper className="w-5 h-5" />, label: "Local News", action: () => sendMessage("Local News") },
    { icon: <ThumbsUp className="w-5 h-5" />, label: "Recommendations", action: () => sendMessage("Recommendations") },
    { icon: <Shield className="w-5 h-5" />, label: "Safety Ratings", action: () => sendMessage("Safety Ratings") },
  ];

  return (
    <div className="p-4 h-full flex flex-col bg-gray-1000">
      <h1 className="text-2xl text-center font-bold mb-4 text-white-400">Artemis AI</h1>
      <div className="flex-grow overflow-y-auto space-y-4 mb-4 pb-4">
        {messages.map((message) => (
          <Card key={message.id} className={`${message.isUser ? "ml-auto bg-[#364684]" : "mr-auto bg-gray-800"} max-w-[80%]`}>
            <CardContent className="p-3 flex items-start space-x-2">
              {!message.isUser && <Robot className="text-purple-400 mt-1" size={20} />}
              <p className={`${message.isUser ? "text-[#ffffff]" : "text-gray-100"}`}>{message.text}</p>
            </CardContent>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {questionButtons.map((button, index) => (
          <Button key={index} onClick={button.action} variant="outline" className="text-purple-400 border-purple-500 hover:bg-purple-900 flex items-center justify-center">
            {button.icon}
            <span className="ml-2">{button.label}</span>
          </Button>
        ))}
      </div>

      {/* Text Input */}
      <form onSubmit={handleInputSubmit} className="mt-4 flex items-center">
        <input
          type="text"
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          placeholder="Type your destination/s..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button type="submit" className="ml-2 bg-purple-500 text-white">Send</Button>
      </form>
    </div>
  );
}
