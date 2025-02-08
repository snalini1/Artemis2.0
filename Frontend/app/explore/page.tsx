"use client"; // ✅ Needed for useState & Hooks

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

type Destination = {
  id: string;
  name: string;
  image: string;
};

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Ensure destinations are properly defined
  const destinations: Destination[] = [
    { id: "1", name: "Paris", image: "/placeholder.svg?height=100&width=150" },
    { id: "2", name: "Tokyo", image: "/placeholder.svg?height=100&width=150" },
    { id: "3", name: "New York", image: "/placeholder.svg?height=100&width=150" },
    { id: "4", name: "Rome", image: "/placeholder.svg?height=100&width=150" },
    { id: "5", name: "Sydney", image: "/placeholder.svg?height=100&width=150" },
    { id: "6", name: "Barcelona", image: "/placeholder.svg?height=100&width=150" },
  ];

  // ✅ Make sure `filteredDestinations` is properly filtered
  const filteredDestinations = destinations.filter((dest) =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <DestinationCard key={destination.id} name={destination.name} image={destination.image} />
        ))}
      </div>
    </div>
  );
}

function DestinationCard({ name, image }: { name: string; image: string }) {
  return (
    <Card className="bg-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <img src={image} alt={name} className="w-full h-24 object-cover" />
        <div className="p-2">
          <h3 className="font-semibold text-purple-400">{name}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
