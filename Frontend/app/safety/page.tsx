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
        { id: "1", name: "🚔 Police", number: data.emergency_numbers.Police },
        { id: "2", name: "🚑 Ambulance", number: data.emergency_numbers.Ambulance },
        { id: "3", name: "🔥 Fire", number: data.emergency_numbers.Fire },
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
    <div className="p-4 space-y-4 bg-gray-900 min-h-full">
      <h1 className="text-2xl font-bold text-purple-400">Safety Center</h1>
      {showAlert && (
        <Card className="bg-red-900 border-red-500">
          <CardContent className="p-4 flex items-center justify-between">
            <span className="text-red-100">🚨 Emergency alert sent successfully!</span>
            <Button variant="ghost" size="sm" onClick={() => setShowAlert(false)}>
              <X size={20} className="text-red-100" />
            </Button>
          </CardContent>
        </Card>
      )}
      <Button
        className="w-full bg-red-600 hover:bg-red-700 text-white"
        onClick={handleEmergencyAlert}
        disabled={loadingAlert}
      >
        {loadingAlert ? "Sending Alert..." : <><AlertTriangle className="mr-2" size={20} />Send Emergency Alert</>}
      </Button>
      <Card className="bg-gray-800 text-gray-100">
        <CardContent className="p-4 flex items-center space-x-2">
          <MapPin size={20} className="text-purple-400" />
          <span>📍 {userLocation}</span>
        </CardContent>
      </Card>
      <h2 className="text-xl font-semibold text-purple-400">Local Emergency Numbers</h2>
      <Card className="bg-gray-800">
        <CardContent className="p-4 space-y-2">
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
      <span className="text-gray-300">{name}</span>
      <Button variant="ghost" className="text-blue-400">
        <Phone size={16} className="mr-2" />
        {number}
      </Button>
    </div>
  );
}
