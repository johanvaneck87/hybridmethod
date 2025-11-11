import { useEffect, useRef } from 'preact/hooks'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Event {
  id: string
  name: string
  date: string
  location: string
  coordinates: {
    lat: number
    lng: number
  }
  type: 'solo' | 'duo'
  difficulty: string
}

interface EventMapProps {
  events: Event[]
}

export function EventMap({ events }: EventMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map centered on Netherlands
    const map = L.map(mapRef.current).setView([52.1326, 5.2913], 7)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    mapInstanceRef.current = map

    // Custom icon for markers
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: #FF4500; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })

    // Add markers for each event
    events.forEach((event) => {
      const marker = L.marker([event.coordinates.lat, event.coordinates.lng], {
        icon: customIcon
      }).addTo(map)

      // Add popup with event info
      marker.bindPopup(`
        <div style="font-family: sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #FF4500;">${event.name}</h3>
          <p style="margin: 4px 0; font-size: 14px;">${new Date(event.date).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}</p>
          <p style="margin: 4px 0; font-size: 14px;">📍 ${event.location}</p>
        </div>
      `)
    })

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [events])

  return <div ref={mapRef} className="h-96 rounded-lg" />
}
