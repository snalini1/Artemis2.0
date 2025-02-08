"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Star } from "lucide-react"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

type Review = {
  id: string
  author: string
  rating: number
  text: string
  date: string
  avatar: string
}

export default function CityPage() {
  const [reviews] = useState<Review[]>([
    {
      id: "1",
      author: "Sarah Johnson",
      rating: 5,
      text: "Amazing city! Felt very safe walking around, even at night. The local community is very welcoming.",
      date: "2 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      author: "Michael Chen",
      rating: 4,
      text: "Great experience overall. Public transportation is reliable and the city is very clean.",
      date: "1 week ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      author: "Emma Wilson",
      rating: 5,
      text: "Beautiful architecture and rich culture. The safety measures in tourist areas are excellent.",
      date: "2 weeks ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  return (
    <div className="h-full bg-gray-900">
      {/* Header */}
      <div className="relative h-[300px] bg-[#bfb3d5]">
        <Link href="/explore" className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="icon" className="rounded-full bg-white/20 backdrop-blur-sm">
            <ChevronLeft className="h-6 w-6 text-white" />
          </Button>
        </Link>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled-JeNmzlku1FbOzUAVTcgEUTfJ0bvMsl.png"
          alt="City"
          className="w-full h-full object-cover"
        />
      </div>

      {/* City Info */}
      <div className="px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-purple-400">Tokyo</h1>
          <div className="flex items-center space-x-2">
            <span className="text-xl text-[#859dc7]">Safety Score:</span>
            <div className="flex items-center">
              <Star className="w-5 h-5 fill-purple-400 text-purple-400" />
              <span className="ml-1 text-xl text-purple-400">4.8</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="bg-[#859dc7] border-0">
          <CardContent className="p-6">
            <p className="text-white leading-relaxed">
              Tokyo, Japan's busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to
              historic temples. The city is known for its safety, cleanliness, and efficient public transportation
              system. Visitors can explore various districts, each with its unique character and attractions.
            </p>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-purple-400">Traveler Reviews</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {reviews.map((review) => (
                <CarouselItem key={review.id}>
                  <Card className="bg-gray-800 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.avatar || "/placeholder.svg"}
                          alt={review.author}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-purple-400">{review.author}</h3>
                            <span className="text-sm text-gray-400">{review.date}</span>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-purple-400 text-purple-400" />
                            ))}
                          </div>
                          <p className="text-gray-300">{review.text}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-purple-400 hover:text-purple-300" />
            <CarouselNext className="text-purple-400 hover:text-purple-300" />
          </Carousel>
        </div>
      </div>
    </div>
  )
}

