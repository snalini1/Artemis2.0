"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ Extract city name from URL
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CityPage() {
  const params = useParams(); // ✅ Get URL parameters
  const cityName = decodeURIComponent(params.name as string); // ✅ Extract city name

  const [cityData, setCityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCityData() {
      try {
        const response = await fetch("http://localhost:8000/api/get_city_data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ city_name: cityName }), // ✅ Send city name to backend
        });

        const data = await response.json();
        setCityData(data);
      } catch (error) {
        console.error("Error fetching city data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCityData();
  }, [cityName]);

  if (loading) return <p className="text-white p-6">Loading...</p>;
  if (!cityData) return <p className="text-red-400 p-6">City not found.</p>;

  return (
    <div className="h-full bg-gray-900">
      {/* Image Section */}
      {cityData.image_url && (
        <div className="relative h-[300px]">
          <img
            src={cityData.image_url}
            alt={`Image of ${cityData.city_name}`}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
          <Link href="/explore" className="absolute top-4 left-4 z-10">
            <Button variant="ghost" size="icon" className="rounded-full bg-white/20 backdrop-blur-sm">
              <ChevronLeft className="h-6 w-6 text-white" />
            </Button>
          </Link>
        </div>
      )}

      {/* City Info */}
      <div className="px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-purple-400">{cityData.city_name}</h1>
        <h2 className="text-lg text-[#859dc7]">Safety Score: {cityData.safety_score}</h2>
        <Card className="bg-[#859dc7] border-0">
          <CardContent className="p-6">
            <p className="text-white leading-relaxed">{cityData.description}</p>
          </CardContent>
        </Card>
        <h2 className="text-lg text-purple-400 mt-4">Safety Information:</h2>
        <Card className="bg-gray-800 border-0">
          <CardContent className="p-6">
            <p className="text-white leading-relaxed">{cityData.safety_description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
