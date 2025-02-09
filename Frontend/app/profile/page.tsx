"use client";  // Ensure this line is at the top

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import EditProfileForm from "@/components/EditProfileForm";  // Ensure this component exists
import MapComponent from "@/components/MapComponent";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type BucketListItem = {
  name: string;
  lat: number;
  lng: number;
};

type UserProfile = {
  id: string;
  profilePicture?: string;
  name: string;
  bio: string;
  age: number;
  height: string;
  weight: string;
  trips: number;
  countries: number;
  bucketList: BucketListItem[];
};

export default function ProfilePage() {
  const userId = "user123";
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);  // State to toggle edit mode

  useEffect(() => {
    fetch(`http://localhost:8000/api/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched User Data:', data);  // Debug: Confirm data is fetched
        setUserData(data);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div 
      className="max-w-md mx-auto h-[844px] flex flex-col items-center space-y-6 pt-20 relative"
      style={{
        backgroundColor: "#5B76C8",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Profile Card (Now Lower) */}
      <div className="relative w-full max-w-sm bg-[#C0AFE0]/90 rounded-lg shadow-lg px-10 py-5 text-center z-6">
        
        {/* 🔥 Edit Button - Clickable & Above Everything */}
        <div className="absolute top-4 right-4 z-30">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-gray-800/50 hover:bg-gray-700 text-purple-400"
            onClick={() => setIsEditing(true)}
          >
            ✏️ {/* Replace with an icon if needed */}
          </Button>
        </div>
  
        {/* Profile Picture - Now Lower */}
        <div className="flex justify-center -mt-20">
          <Avatar className="w-32 h-32 border-2 border-white-500 overflow-hidden">
            <img 
              src={`http://localhost:8000/${userData.profilePicture}`} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full"
            />
          </Avatar>
        </div>
  
        {/* Display Age, Height, and Weight (Inside Card) */}
        <h1 className="text-2xl font-bold text-white mt-2">{userData.name}</h1>
        <div className="flex gap-4 justify-center mt-4">
          <Badge className="bg-[#7D9CCE] text-white px-2 py-2 rounded-full text-lg">
            {userData.age} <span className="text-xs ml-1">yrs</span>
          </Badge>
          <Badge className="bg-[#7D9CCE] text-[white] px-2 py-2 rounded-full text-lg">
            {userData.height} <span className="text-xs ml-1">ft</span>
          </Badge>
          <Badge className="bg-[#7D9CCE] text-white px-2 py-2 rounded-full text-lg">
            {userData.weight} <span className="text-xs ml-1">lbs</span>
          </Badge>
        </div>
      </div>

      {/* Bucket List Map (Outside the Card) */}
      <div className="mt-6 w-full max-w-md rounded-2xl overflow-hidden shadow-lg">
        <h2 className="text-xl text-center font-bold text-white-500 mb-2"> Bucket List ❤️ </h2>
        <MapComponent userId={userId} />
      </div>
  
      {/* 🔥 Edit Form - Now Pops Up Over Everything */}
      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Edit Profile</h2>
            <EditProfileForm 
              userId={userId} 
              onProfileUpdated={(updatedData) => {
                setUserData(updatedData);
                setIsEditing(false);
              }} 
            />
            <button 
              className="mt-4 text-white bg-red-500 px-4 py-2 rounded-full hover:bg-red-600"
              onClick={() => setIsEditing(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}  