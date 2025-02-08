"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, AlertTriangle, X } from "lucide-react"

type EmergencyContact = {
  id: string
  name: string
  number: string
}

export default function SafetyPage() {
  const [showAlert, setShowAlert] = useState(false)
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
  const [userLocation, setUserLocation] = useState<string>("Unknown")

  useEffect(() => {
    // Simulating fetching user's location
    setTimeout(() => setUserLocation("New York, USA"), 1000)

    // Simulating fetching emergency numbers based on location
    setTimeout(() => {
      setEmergencyContacts([
        { id: "1", name: "Police", number: "911" },
        { id: "2", name: "Ambulance", number: "911" },
        { id: "3", name: "Fire Department", number: "911" },
        { id: "4", name: "Poison Control", number: "1-800-222-1222" },
      ])
    }, 1500)
  }, [])

  const handleEmergencyAlert = () => {
    setShowAlert(true)
    // In a real app, this would trigger an actual alert to emergency contacts
    setTimeout(() => setShowAlert(false), 5000) // Hide alert after 5 seconds
  }

  return (
    <div className="p-4 space-y-4 bg-gray-900 min-h-full">
      <h1 className="text-2xl font-bold text-purple-400">Safety Center</h1>
      {showAlert && (
        <Card className="bg-red-900 border-red-500">
          <CardContent className="p-4 flex items-center justify-between">
            <span className="text-red-100">Emergency alert sent to your contacts!</span>
            <Button variant="ghost" size="sm" onClick={() => setShowAlert(false)}>
              <X size={20} className="text-red-100" />
            </Button>
          </CardContent>
        </Card>
      )}
      <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleEmergencyAlert}>
        <AlertTriangle className="mr-2" size={20} />
        Send Emergency Alert
      </Button>
      <Card className="bg-gray-800 text-gray-100">
        <CardContent className="p-4 flex items-center space-x-2">
          <MapPin size={20} className="text-purple-400" />
          <span>Your current location: {userLocation}</span>
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
      <Button variant="outline" className="w-full text-purple-400 border-purple-500 hover:bg-purple-900">
        View More Resources
      </Button>
    </div>
  )
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
  )
}

