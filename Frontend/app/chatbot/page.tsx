"use client"

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BotIcon as Robot, ThumbsUp, MapPin, Shield, Newspaper } from "lucide-react";

// Define types
interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

type QuestionButton = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm Artemis AI, your travel assistant. How can I assist you today?", isUser: false },
  ]);
  const [awaitingPlaces, setAwaitingPlaces] = useState(false);
  const [places, setPlaces] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const simulateResponse = (question: string) => {
    let response: string;
    switch (question) {
      case "Recommendations":
        response = "Here are some recommendations: Visit the art museum, try the street food market, and take a scenic hike.";
        break;
      case "Plan my Itinerary":
        response = "Let's plan your itinerary. What places do you want to visit?";
        setAwaitingPlaces(true);
        return;
      case "Safety Rating":
        response = "The area's safety rating is 8/10. Be mindful of your surroundings and secure valuables.";
        break;
      case "Local News":
        response = "Latest news update: A cultural festival is happening this weekend in the city center.";
        break;
      default:
        response = "I'm not sure about that. Can you try again?";
    }
    const newMessage: Message = { id: messages.length + 2, text: response, isUser: false };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleUserInput = (input: string) => {
    const newMessage: Message = { id: messages.length + 1, text: input, isUser: true };
    setMessages((prev) => [...prev, newMessage]);
    
    if (awaitingPlaces) {
      const updatedPlaces = [...places, input];
      setPlaces(updatedPlaces);
      if (updatedPlaces.length >= 3) {
        setAwaitingPlaces(false);
        const itineraryResponse = `You should first spend 4 days in ${updatedPlaces[0]}, 3 days in ${updatedPlaces[1]}, and 1 day in ${updatedPlaces[2]}. Commute by train for the cheapest route. These places are safe xyz.`;
        setMessages((prev) => [...prev, { id: prev.length + 2, text: itineraryResponse, isUser: false }]);
      }
    } else {
      setTimeout(() => simulateResponse(input), 1000);
    }
  };

  const handleQuestionClick = (question: string) => {
    handleUserInput(question);
  };

  const questionButtons: QuestionButton[] = [
    { icon: <ThumbsUp className="w-5 h-5" />, label: "Recommendations", action: () => handleQuestionClick("Recommendations") },
    { icon: <MapPin className="w-5 h-5" />, label: "Plan my Itinerary", action: () => handleQuestionClick("Plan my Itinerary") },
    { icon: <Shield className="w-5 h-5" />, label: "Safety Rating", action: () => handleQuestionClick("Safety Rating") },
    { icon: <Newspaper className="w-5 h-5" />, label: "Local News", action: () => handleQuestionClick("Local News") },
  ];

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
  );
}


// "use client"

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Send } from "lucide-react";
// import { motion } from "framer-motion";

// // Define types
// interface Message {
//   text: string;
//   sender: "bot" | "user";
// }
// type Screen = "main" | "itinerary" | "safety" | "recommendations" | "news";
// export default function ChatbotUI() {
//   const [messages, setMessages] = useState<Message[]>([
//     { text: "Hi! How can I assist you today?", sender: "bot" }
//   ]);
//   const [currentScreen, setCurrentScreen] = useState<Screen>("main");
//   const handleButtonClick = (option: string) => {
//     if (option === "Plan my Itinerary") {
//       setCurrentScreen("itinerary");
//     } else if (option === "Safety Rating") {
//       setCurrentScreen("safety");
//     } else if (option === "Recommendations") {
//       setCurrentScreen("recommendations");
//     } else if (option === "Local News") {
//       setCurrentScreen("news");
//     } else {
//       setMessages((prev) => [...prev, { text: option, sender: "user" }]);
//     }
//   };
//   return (
//     <div className="flex flex-col h-screen bg-black p-4 text-white">
//       {currentScreen === "main" && (
//         <>
//           <Card className="flex-1 overflow-auto p-4 rounded-lg bg-gray-900 shadow-lg border border-purple-500">
//             <CardContent>
//               {messages.map((msg, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className={`my-2 p-2 rounded-lg w-fit max-w-xs ${
//                     msg.sender === "bot"
//                       ? "bg-purple-700 text-white"
//                       : "bg-purple-500 text-white ml-auto"
//                   } shadow-md`}
//                 >
//                   {msg.text}
//                 </motion.div>
//               ))}
//             </CardContent>
//           </Card>
//           <div className="grid grid-cols-2 gap-2 mt-4">
//             {["Plan my Itinerary", "Recommendations", "Safety Rating", "Local News"].map(
//               (option) => (
//                 <motion.div key={option} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                   <Button
//                     className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 shadow-md border border-purple-400"
//                     onClick={() => handleButtonClick(option)}
//                   >
//                     {option}
//                   </Button>
//                 </motion.div>
//               )
//             )}
//           </div>
//         </>
//       )}
//       {currentScreen !== "main" && (
//         <div className="flex flex-col space-y-4">
//           <Input placeholder={`Enter details for ${currentScreen}`} className="bg-gray-800 text-white" />
//           <Button onClick={() => setCurrentScreen("main")} className="bg-purple-600 text-white">
//             Submit
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }


// import { useState, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { BotIcon as Robot, ThumbsUp, MapPin, Shield, Newspaper } from "lucide-react"

// type Message = {
//   id: number
//   text: string
//   isUser: boolean
// }

// type QuestionButton = {
//   icon: React.ReactNode
//   label: string
//   action: () => void
// }

// export default function ChatbotPage() {
//   const [messages, setMessages] = useState<Message[]>([
//     { id: 1, text: "Hi there! I'm Artemis AI, your travel assistant. How can I help you today?", isUser: false },
//   ])
//   const messagesEndRef = useRef<HTMLDivElement>(null)

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   useEffect(scrollToBottom, []) //Fixed useEffect dependency

//   const simulateResponse = (question: string) => {
//     let response: string
//     switch (question) {
//       case "Recommendations":
//         response =
//           "Based on your preferences, I recommend visiting the local art museum, trying out the famous street food market, and taking a scenic hike in the nearby national park. Would you like more specific details on any of these?"
//         break
//       case "Plan Itinerary":
//         response =
//           "Let's start planning your itinerary. How many days will you be staying, and are there any specific activities or places you'd like to include?"
//         break
//       case "Safety Rating":
//         response =
//           "The current safety rating for this area is 8/10. It's generally safe for tourists, but always be aware of your surroundings, especially at night. Keep your valuables secure and stick to well-lit, populated areas."
//         break
//       case "Local News":
//         response =
//           "Here's the latest local news: There's a cultural festival happening this weekend in the city center. Also, a new eco-friendly transportation system has just been launched, making it easier for tourists to get around."
//         break
//       default:
//         response = "I'm sorry, I didn't understand that question. Could you please try again?"
//     }
//     const newMessage: Message = { id: messages.length + 2, text: response, isUser: false }
//     setMessages((prev) => [...prev, newMessage])
//   }

//   const handleQuestionClick = (question: string) => {
//     const newMessage: Message = { id: messages.length + 1, text: question, isUser: true }
//     setMessages((prev) => [...prev, newMessage])
//     setTimeout(() => simulateResponse(question), 1000)
//   }

//   const questionButtons: QuestionButton[] = [
//     {
//       icon: <ThumbsUp className="w-5 h-5" />,
//       label: "Recommendations",
//       action: () => handleQuestionClick("Recommendations"),
//     },
//     {
//       icon: <MapPin className="w-5 h-5" />,
//       label: "Plan Itinerary",
//       action: () => handleQuestionClick("Plan Itinerary"),
//     },
//     {
//       icon: <Shield className="w-5 h-5" />,
//       label: "Safety Rating",
//       action: () => handleQuestionClick("Safety Rating"),
//     },
//     { icon: <Newspaper className="w-5 h-5" />, label: "Local News", action: () => handleQuestionClick("Local News") },
//   ]

//   return (
//     <div className="p-4 h-full flex flex-col bg-gray-900">
//       <h1 className="text-2xl font-bold mb-4 text-purple-400">Artemis AI</h1>
//       <div className="flex-grow overflow-y-auto space-y-4 mb-4 pb-4">
//         {messages.map((message) => (
//           <Card
//             key={message.id}
//             className={`${message.isUser ? "ml-auto bg-[#364684]" : "mr-auto bg-gray-800"} max-w-[80%]`}
//           >
//             <CardContent className="p-3 flex items-start space-x-2">
//               {!message.isUser && <Robot className="text-purple-400 mt-1" size={20} />}
//               <p className={`${message.isUser ? "text-[#ffffff]" : "text-gray-100"}`}>{message.text}</p>
//             </CardContent>
//           </Card>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="grid grid-cols-2 gap-2">
//         {questionButtons.map((button, index) => (
//           <Button
//             key={index}
//             onClick={button.action}
//             variant="outline"
//             className="text-purple-400 border-purple-500 hover:bg-purple-900 flex items-center justify-center"
//           >
//             {button.icon}
//             <span className="ml-2">{button.label}</span>
//           </Button>
//         ))}
//       </div>
//     </div>
//   )
// }

