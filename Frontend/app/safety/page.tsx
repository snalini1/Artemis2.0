"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, AlertTriangle, X } from "lucide-react";

type EmergencyContact = {
  id: string;
  name: string;
  number: string;
};

export default function SafetyPage() {
  const [showAlert, setShowAlert] = useState(false);
  const [loadingAlert, setLoadingAlert] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [userLocation, setUserLocation] = useState<string>("Fetching...");
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoordinates(coords);
          fetchEmergencyNumbers(coords);
        },
        () => setUserLocation("Location access denied.")
      );
    } else {
      setUserLocation("Geolocation not supported.");
    }
  }, []);

  async function fetchEmergencyNumbers(coords: { latitude: number; longitude: number }) {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/get_emergency_numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coords),
      });

      if (!response.ok) throw new Error("Failed to fetch emergency numbers");
      const data = await response.json();
      setUserLocation(data.country);
      setEmergencyContacts([
        { id: "1", name: "Police", number: data.emergency_numbers.Police },
        { id: "2", name: "Ambulance", number: data.emergency_numbers.Ambulance },
        { id: "3", name: "Fire Department", number: data.emergency_numbers.Fire },
      ]);
    } catch (error) {
      setUserLocation("Could not fetch location data.");
    }
  }

  async function handleEmergencyAlert() {
    if (!coordinates) {
      alert("Unable to send emergency alert. Location not available.");
      return;
    }

    setLoadingAlert(true);
    setShowAlert(false);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/send_emergency_alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          message: "Emergency alert triggered from the Safety Page.",
        }),
      });

      if (!response.ok) throw new Error("Failed to send emergency alert");
      const data = await response.json();
      console.log("Emergency Alert Response:", data);
      setShowAlert(true); // Show success alert
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      alert("Failed to send emergency alert. Please try again.");
    } finally {
      setLoadingAlert(false);
    }
  }

  return (
    <div className="p-4 space-y-4 min-h-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Safety Center</h1>
      </div>

      {/* Alert Section */}
      {showAlert && (
        <Card className="bg-red-600 border-red-700">
          <CardContent className="p-4 flex items-center justify-between">
            <span className="text-white">Emergency alert sent to your contacts!</span>
            <Button variant="ghost" size="sm" onClick={() => setShowAlert(false)}>
              <X size={20} className="text-white" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Emergency Button */}
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={handleEmergencyAlert}
          disabled={loadingAlert}
          className="bg-red-600 border-red-600 text-white text-lg py-6 flex items-center justify-center space-x-2 w-full rounded-lg shadow-lg hover:bg-red-500 focus:outline-none transition-transform transform hover:scale-105"
        >
          {loadingAlert ? (
            "Sending Alert..."
          ) : (
            <>
              <AlertTriangle size={24} />
              <span>Send Emergency Alert</span>
            </>
          )}
        </button>
      </div>

      {/* Location Section */}
      <Card className="bg-[#364684]/60 backdrop-blur-sm border-[#859dc7]">
        <CardContent className="p-6 flex items-center space-x-3">
          <MapPin size={24} className="text-[#bfb3d5]" />
          <span className="text-[#fcfbf9] text-lg">Current location: {userLocation}</span>
        </CardContent>
      </Card>

      {/* Emergency Numbers Section */}
      <h2 className="text-xl font-semibold text-white mt-6">Local Emergency Numbers</h2>
      <Card className="bg-[#364684]/40 backdrop-blur-sm border-[#859dc7]">
        <CardContent className="p-4 space-y-3">
          {emergencyContacts.map((contact) => (
            <EmergencyNumber key={contact.id} name={contact.name} number={contact.number} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function EmergencyNumber({ name, number }: { name: string; number: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-white text-lg">{name}</span>
      <Button variant="ghost" className="text-white hover:text-[#bfb3d5] text-lg">
        <Phone size={16} className="mr-2" />
        {number}
      </Button>
    </div>
  );
}
