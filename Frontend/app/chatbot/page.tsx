"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BotIcon as Robot, ThumbsUp, MapPin, Shield, Newspaper } from "lucide-react"

type Message = {
  id: number
  text: string
  isUser: boolean
}

type QuestionButton = {
  icon: React.ReactNode
  label: string
  action: () => void
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi there! I'm Artemis AI, your travel assistant. How can I help you today?", isUser: false },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, []) //Fixed useEffect dependency

  const simulateResponse = (question: string) => {
    let response: string
    switch (question) {
      case "Recommendations":
        response =
          "Based on your preferences, I recommend visiting the local art museum, trying out the famous street food market, and taking a scenic hike in the nearby national park. Would you like more specific details on any of these?"
        break
      case "Plan Itinerary":
        response =
          "Let's start planning your itinerary. How many days will you be staying, and are there any specific activities or places you'd like to include?"
        break
      case "Safety Rating":
        response =
          "The current safety rating for this area is 8/10. It's generally safe for tourists, but always be aware of your surroundings, especially at night. Keep your valuables secure and stick to well-lit, populated areas."
        break
      case "Local News":
        response =
          "Here's the latest local news: There's a cultural festival happening this weekend in the city center. Also, a new eco-friendly transportation system has just been launched, making it easier for tourists to get around."
        break
      default:
        response = "I'm sorry, I didn't understand that question. Could you please try again?"
    }
    const newMessage: Message = { id: messages.length + 2, text: response, isUser: false }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleQuestionClick = (question: string) => {
    const newMessage: Message = { id: messages.length + 1, text: question, isUser: true }
    setMessages((prev) => [...prev, newMessage])
    setTimeout(() => simulateResponse(question), 1000)
  }

  const questionButtons: QuestionButton[] = [
    {
      icon: <ThumbsUp className="w-5 h-5" />,
      label: "Recommendations",
      action: () => handleQuestionClick("Recommendations"),
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Plan Itinerary",
      action: () => handleQuestionClick("Plan Itinerary"),
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: "Safety Rating",
      action: () => handleQuestionClick("Safety Rating"),
    },
    { icon: <Newspaper className="w-5 h-5" />, label: "Local News", action: () => handleQuestionClick("Local News") },
  ]

  return (
    <div className="p-4 h-full flex flex-col bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-purple-400">Artemis AI</h1>
      <div className="flex-grow overflow-y-auto space-y-4 mb-4 pb-4">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`${message.isUser ? "ml-auto bg-[#364684]" : "mr-auto bg-gray-800"} max-w-[80%]`}
          >
            <CardContent className="p-3 flex items-start space-x-2">
              {!message.isUser && <Robot className="text-purple-400 mt-1" size={20} />}
              <p className={`${message.isUser ? "text-[#ffffff]" : "text-gray-100"}`}>{message.text}</p>
            </CardContent>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {questionButtons.map((button, index) => (
          <Button
            key={index}
            onClick={button.action}
            variant="outline"
            className="text-purple-400 border-purple-500 hover:bg-purple-900 flex items-center justify-center"
          >
            {button.icon}
            <span className="ml-2">{button.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

