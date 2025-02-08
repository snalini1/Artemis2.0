"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import Link from "next/link"

type Destination = {
  id: string
  name: string
  image: string
}

export default function ExplorePage() {
  const [destinations] = useState<Destination[]>([
    { id: "1", name: "Paris", image: "/images/paris.png" }, 
    { id: "2", name: "Tokyo", image: "/images/tokyo.png" },
    { id: "3", name: "New York", image: "/images/nyc.png" },
    { id: "4", name: "Mumbai", image: "/images/mumbai.png" },
    { id: "5", name: "Sydney", image: "/images/sydney.png" },
    { id: "6", name: "Rome", image: "/images/rome.png" },
    { id: "7", name: "Bogota", image: "/images/bogota.png" },
    { id: "8", name: "Cairo", image: "/images/cairo.png" },
    { id: "9", name: "Bangalore", image: "/images/bangalore.png" },
    { id: "10", name: "Istanbul", image: "/images/istanbul.png" },
    { id: "11", name: "Bangkok", image: "/images/bangkok.png" },
    { id: "12", name: "Mexico City", image: "/images/mexicocity.png" },
    { id: "13", name: "Moscow", image: "/images/moscow.png" },
    { id: "14", name: "Tijuana", image: "/images/tijuana.png" },
  ]);

  const [searchTerm, setSearchTerm] = useState("")

  const filteredDestinations = destinations.filter((dest) => dest.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="p-4 space-y-4 bg-gray-900 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-purple-400 mb-4">Explore</h1>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search cities and places"
          className="pl-10 bg-gray-800 text-gray-100 border-purple-500 focus:border-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
      </div>
      <h2 className="text-xl font-semibold text-purple-400 mt-6">Popular Destinations</h2>
      <div className="grid grid-cols-2 gap-4">
        {filteredDestinations.map((destination) => (
          <Link key={destination.id} href={`/city/${encodeURIComponent(destination.name)}`}>
            <Card className="bg-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  className="w-full h-24 object-cover"
                />
                <div className="p-2">
                  <h3 className="font-semibold text-purple-400">{destination.name}</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
