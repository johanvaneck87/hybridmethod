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
    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      touchZoom: true,
      dragging: true,
      attributionControl: false
    }).setView([52.1326, 5.2913], 7)

    // Add custom attribution control with only Google Maps
    L.control.attribution({
      position: 'bottomright',
      prefix: false
    }).addAttribution('© Google Maps').addTo(map)

    // Add Google Maps tiles
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: ''
    }).addTo(map)

    // Invalidate size after a short delay to ensure proper rendering
    setTimeout(() => {
      map.invalidateSize()
    }, 100)

    mapInstanceRef.current = map

    // Function to create custom icon based on zoom level
    const createCustomIcon = (zoom: number) => {
      // Base size at zoom level 7, scales with zoom
      const baseSize = 14
      const baseZoom = 7
      const scaleFactor = Math.pow(1.25, zoom - baseZoom)
      const size = Math.max(8, Math.min(30, baseSize * scaleFactor))
      const borderWidth = Math.max(1, Math.min(2.5, 1.5 * scaleFactor))

      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: #D94800; width: ${size}px; height: ${size}px; border-radius: 50%; border: ${borderWidth}px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      })
    }

    // Store markers so we can update them
    const markers: L.Marker[] = []

    // Add markers for each event
    events.forEach((event) => {
      const marker = L.marker([event.coordinates.lat, event.coordinates.lng], {
        icon: createCustomIcon(map.getZoom())
      }).addTo(map)

      // Add popup with event info
      marker.bindPopup(`
        <div style="font-family: sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #D94800;">${event.name}</h3>
          <p style="margin: 4px 0; font-size: 14px;">${new Date(event.date).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}</p>
          <p style="margin: 4px 0; font-size: 14px;">📍 ${event.location}</p>
        </div>
      `)

      markers.push(marker)
    })

    // Update marker sizes on zoom
    const updateMarkerSizes = () => {
      const zoom = map.getZoom()
      markers.forEach(marker => {
        marker.setIcon(createCustomIcon(zoom))
      })
    }

    map.on('zoomend', updateMarkerSizes)

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [events])

  return <div ref={mapRef} className="h-64 md:h-96 w-full rounded-lg" style={{ minHeight: '300px' }} />
}
