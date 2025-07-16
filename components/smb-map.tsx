"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
})

interface SMBData {
  id: string
  name: string
  industry: string
  location: {
    lat: number
    lng: number
  }
  // ... other properties
}

export function SMBMap() {
  const [smbData, setSMBData] = useState<SMBData[]>([])

  useEffect(() => {
    // In a real scenario, you would fetch this data from your API
    const mockData: SMBData[] = [
      {
        id: "1",
        name: "Tech Solutions Inc.",
        industry: "Technology",
        location: { lat: 40.7128, lng: -74.006 },
      },
      {
        id: "2",
        name: "Green Energy Co.",
        industry: "Renewable Energy",
        location: { lat: 34.0522, lng: -118.2437 },
      },
      // ... add more mock data as needed
    ]
    setSMBData(mockData)
  }, [])

  return (
    <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {smbData.map((smb) => (
        <Marker key={smb.id} position={[smb.location.lat, smb.location.lng]}>
          <Popup>
            <h3>{smb.name}</h3>
            <p>Industry: {smb.industry}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

