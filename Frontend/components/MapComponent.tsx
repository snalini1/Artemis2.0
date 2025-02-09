"use client";

import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

type BucketListItem = {
  name: string;
  lat: number;
  lng: number;
};

type MapComponentProps = {
  userId: string;
};

export default function MapComponent({ userId }: MapComponentProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDGv3WZGVNs7Pvh5cVxXMRUnAQw1mWioh8",  // Replace with your actual API key
  });

  const [bucketList, setBucketList] = useState<BucketListItem[]>([]);

  // Fetch bucket list data from FastAPI
  useEffect(() => {
    fetch(`http://localhost:8000/api/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Bucket List:", data.bucketList);
        setBucketList(data.bucketList || []);
      })
      .catch((error) => console.error("Error fetching bucket list:", error));
  }, [userId]);

  // Handle map click to add new locations
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const newLocation: BucketListItem = {
      name: `Pinned Location ${bucketList.length + 1}`,
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    // Save new location to FastAPI backend
    fetch(`http://localhost:8000/api/user/${userId}/bucket-list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLocation),
    })
      .then((response) => response.json())
      .then((updatedProfile) => {
        setBucketList(updatedProfile.bucketList || []);
      })
      .catch((error) => console.error("Error saving location:", error));
  };

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={{ lat: 0, lng: 0 }}
      zoom={2}
      onClick={handleMapClick}
    >
      {bucketList.map((location, idx) => (
        <Marker key={idx} position={{ lat: location.lat, lng: location.lng }} />
      ))}
    </GoogleMap>
  );
}
