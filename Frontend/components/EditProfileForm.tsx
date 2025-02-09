import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

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
  bucketList: { name: string; lat: number; lng: number }[];
};

type EditProfileFormProps = {
  userId: string;
  onProfileUpdated: (updatedProfile: UserProfile) => void;
};

type FormDataType = {
  name: string;
  bio: string;
  age: string;
  height: string;
  weight: string;
  trips: string;
  countries: string;
  profilePicture: File | null;
};

export default function EditProfileForm({ userId, onProfileUpdated }: EditProfileFormProps) {
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    bio: '',
    age: '',
    height: '',
    weight: '',
    trips: '',
    countries: '',
    profilePicture: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name in formData) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prevData) => ({ ...prevData, profilePicture: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
  
    Object.keys(formData).forEach((key) => {
      if (key === "profilePicture" && formData.profilePicture) {
        data.append("profilePicture", formData.profilePicture);
      } else if (formData[key as keyof FormDataType]) {
        let value = formData[key as keyof FormDataType];
        if (["age", "trips", "countries"].includes(key)) {
          value = String(Number(value));  // ✅ Convert to stringified number
        }
        data.append(key, value as string);
      }
    });
  
    console.log("Form Data Sent:", [...data]);
  
    const apiUrl = `http://localhost:8000/api/user/${userId}`;
    console.log("API Request URL:", apiUrl);
    console.log("Form Data:", [...data]);
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",  // ✅ Change this from PUT to POST
        body: data,
      });
  
      console.log("Response Status:", response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error updating profile:", errorText);
        return;
      }
  
      const updatedProfile = await response.json();
      console.log("Profile updated:", updatedProfile);
      onProfileUpdated(updatedProfile);
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-4 rounded-lg">
      <input type="text" name="name" placeholder="Name" onChange={handleInputChange} className="w-full p-2 rounded bg-gray-700 text-white" />
      <textarea name="bio" placeholder="Bio" onChange={handleInputChange} className="w-full p-2 rounded bg-gray-700 text-white" />
      <input type="number" name="age" placeholder="Age" onChange={handleInputChange} className="w-full p-2 rounded bg-gray-700 text-white" />
      <input type="text" name="height" placeholder="Height" onChange={handleInputChange} className="w-full p-2 rounded bg-gray-700 text-white" />
      <input type="text" name="weight" placeholder="Weight" onChange={handleInputChange} className="w-full p-2 rounded bg-gray-700 text-white" />
      <input type="number" name="trips" placeholder="Trips" onChange={handleInputChange} className="w-full p-2 rounded bg-gray-700 text-white" />
      <input type="number" name="countries" placeholder="Countries" onChange={handleInputChange} className="w-full p-2 rounded bg-gray-700 text-white" />
      <input type="file" name="profilePicture" onChange={handleFileChange} className="w-full p-2 rounded bg-gray-700 text-white" />
      <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white">Save</Button>
    </form>
  );
}

