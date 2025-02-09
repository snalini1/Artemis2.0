"use client";  // Ensure this line is at the top

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import EditProfileForm from "@/components/EditProfileForm";  // Ensure this component exists
import MapComponent from "@/components/MapComponent";

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
    <div className="p-4 space-y-6 bg-gray-900 min-h-full">
      {/* Edit Button */}
      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-gray-800/50 hover:bg-gray-800 text-purple-400"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </Button>
      </div>

      {/* Display Profile or Edit Form */}
      {isEditing ? (
        <EditProfileForm 
          userId={userId} 
          onProfileUpdated={(updatedData) => {
            setUserData(updatedData);
            setIsEditing(false);
          }} 
        />
      ) : (
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="w-32 h-32 border-4 border-purple-500">
            <img src={`http://localhost:8000/${userData.profilePicture}`} alt="Profile" className="object-cover" />
          </Avatar>
          <h1 className="text-3xl font-bold text-purple-400">{userData.name}</h1>

          {/* Display Bio */}
          <p className="text-gray-400">{userData.bio}</p>

          {/* Display Age, Height, and Weight */}
          <div className="flex gap-4 justify-center mt-4">
            <Badge className="bg-blue-500 text-white px-5 py-3 rounded-full text-lg">{userData.age} <span className="text-xs ml-1">yrs</span></Badge>
            <Badge className="bg-purple-500 text-white px-5 py-3 rounded-full text-lg">{userData.height} <span className="text-xs ml-1">ft</span></Badge>
            <Badge className="bg-pink-500 text-white px-5 py-3 rounded-full text-lg">{userData.weight} <span className="text-xs ml-1">lbs</span></Badge>
          </div>

          {/* Bucket List Map */}
          <div className="mt-6 w-full rounded-2xl overflow-hidden shadow-lg">
            <h2 className="text-xl font-bold text-purple-400 mb-2">Bucket List Map</h2>
            <MapComponent userId={userId} />
          </div>
        </div>
      )}
    </div>
  );
}

