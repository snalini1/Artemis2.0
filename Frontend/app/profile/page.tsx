"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

// Define types
interface Message {
  text: string;
  sender: "bot" | "user";
}
type Screen = "main" | "itinerary" | "safety" | "recommendations" | "news";
export default function ChatbotUI() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! How can I assist you today?", sender: "bot" }
  ]);
  const [currentScreen, setCurrentScreen] = useState<Screen>("main");
  const handleButtonClick = (option: string) => {
    if (option === "Plan my Itinerary") {
      setCurrentScreen("itinerary");
    } else if (option === "Safety Rating") {
      setCurrentScreen("safety");
    } else if (option === "Recommendations") {
      setCurrentScreen("recommendations");
    } else if (option === "Local News") {
      setCurrentScreen("news");
    } else {
      setMessages((prev) => [...prev, { text: option, sender: "user" }]);
    }
  };
  return (
    <div className="flex flex-col h-screen bg-black p-4 text-white">
      {currentScreen === "main" && (
        <>
          <Card className="flex-1 overflow-auto p-4 rounded-lg bg-gray-900 shadow-lg border border-purple-500">
            <CardContent>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`my-2 p-2 rounded-lg w-fit max-w-xs ${
                    msg.sender === "bot"
                      ? "bg-purple-700 text-white"
                      : "bg-purple-500 text-white ml-auto"
                  } shadow-md`}
                >
                  {msg.text}
                </motion.div>
              ))}
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {["Plan my Itinerary", "Recommendations", "Safety Rating", "Local News"].map(
              (option) => (
                <motion.div key={option} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 shadow-md border border-purple-400"
                    onClick={() => handleButtonClick(option)}
                  >
                    {option}
                  </Button>
                </motion.div>
              )
            )}
          </div>
        </>
      )}
      {currentScreen !== "main" && (
        <div className="flex flex-col space-y-4">
          <Input placeholder={`Enter details for ${currentScreen}`} className="bg-gray-800 text-white" />
          <Button onClick={() => setCurrentScreen("main")} className="bg-purple-600 text-white">
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Card, CardContent } from "@/components/ui/card"
// import { MapPin, Edit2, Ruler, Users, Dumbbell, Heart, Cake, Plane, Globe } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import type React from "react" // Import React

// type TravelStat = {
//   value: number
//   label: string
//   icon: React.ReactNode
// }

// type Achievement = {
//   id: string
//   name: string
//   icon: React.ReactNode
//   color: string
// }

// export default function ProfilePage() {
//   const [stats] = useState<TravelStat[]>([
//     { value: 12, label: "Countries", icon: <Globe className="w-5 h-5" /> },
//     { value: 24, label: "Trips", icon: <Plane className="w-5 h-5" /> },
//   ])

//   const [achievements] = useState<Achievement[]>([
//     { id: "1", name: "22 years old", icon: <Cake className="w-4 h-4" />, color: "bg-blue-500" },
//     { id: "2", name: "5'4'", icon: <Ruler className="w-4 h-4" />, color: "bg-purple-500" },
//     { id: "3", name: "120lbs", icon: <Dumbbell className="w-4 h-4" />, color: "bg-pink-500" },
//   ])

//   return (
//     <div className="p-4 space-y-6 bg-gray-900 min-h-full">
//       {/* Profile Header */}
//       <div className="relative">
//         <div className="absolute top-2 right-2">
//           <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 hover:bg-gray-800">
//             <Edit2 className="w-5 h-5 text-purple-400" />
//           </Button>
//         </div>
//         <div className="flex flex-col items-center text-center space-y-4">
//           <div className="relative group">
//             <Avatar className="w-32 h-32 border-4 border-purple-500 group-hover:border-blue-400 transition-all duration-300">
//               <AvatarImage
//                 src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled-EL3p1WewPAODJBdZv4DDWFhEbRub6n.png"
//                 alt="Profile picture"
//                 className="object-cover"
//               />
//               <AvatarFallback>AS</AvatarFallback>
//             </Avatar>
//             <div className="absolute inset-0 rounded-full bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//           </div>
//           <div className="space-y-1">
//             <h1 className="text-3xl font-bold text-purple-400">Avanti Singh</h1>
//             <p className="text-gray-400">@wanderlust_avanti</p>
//           </div>
//           <div className="flex gap-2">
//             {achievements.map((achievement) => (
//               <Badge
//                 key={achievement.id}
//                 className={`${achievement.color} text-white px-3 py-1 flex items-center gap-1 hover:opacity-90 transition-opacity`}
//               >
//                 {achievement.icon}
//                 {achievement.name}
//               </Badge>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Bio Section */}
//       <Card className="bg-gray-800 border-0">
//         <CardContent className="p-6 text-center">
//           <p className="text-gray-300 leading-relaxed">
//             ✨ Travel enthusiast exploring the world one adventure at a time! Currently planning my next journey to
//             Southeast Asia. Love making new friends and discovering hidden gems! 🌏
//           </p>
//         </CardContent>
//       </Card>

//       {/* Stats Section */}
//       <div className="grid grid-cols-2 gap-4">
//         {stats.map((stat, index) => (
//           <Card key={index} className="bg-gray-800 border-0 hover:bg-gray-700 transition-colors duration-300">
//             <CardContent className="p-4 text-center space-y-2">
//               <div className="w-10 h-10 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
//                 {stat.icon}
//               </div>
//               <div className="text-2xl font-bold text-purple-400">{stat.value}</div>
//               <div className="text-sm text-gray-400">{stat.label}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Recent Adventures */}
//       <div className="space-y-4">
//         <h2 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
//           <Heart className="w-5 h-5" /> Recent Adventures
//         </h2>
//         <div className="grid gap-4">
//           <AdventureCard
//             image="/placeholder.svg?height=150&width=300"
//             location="Bali, Indonesia"
//             date="Last week"
//             likes={42}
//           />
//           <AdventureCard
//             image="/placeholder.svg?height=150&width=300"
//             location="Tokyo, Japan"
//             date="2 weeks ago"
//             likes={38}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// function AdventureCard({
//   image,
//   location,
//   date,
//   likes,
// }: { image: string; location: string; date: string; likes: number }) {
//   return (
//     <Card className="bg-gray-800 border-0 overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300">
//       <CardContent className="p-0">
//         <div className="relative">
//           <img src={image || "/placeholder.svg"} alt={location} className="w-full h-40 object-cover" />
//           <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900/90 to-transparent">
//             <div className="flex justify-between items-end">
//               <div>
//                 <h3 className="text-lg font-semibold text-white flex items-center gap-2">
//                   <MapPin className="w-4 h-4" /> {location}
//                 </h3>
//                 <p className="text-sm text-gray-300">{date}</p>
//               </div>
//               <div className="flex items-center gap-1 text-purple-400">
//                 <Heart className="w-4 h-4 fill-current" />
//                 <span className="text-sm">{likes}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


