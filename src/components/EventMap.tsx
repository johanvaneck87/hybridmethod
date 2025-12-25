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
  highlightedEventId?: string | null
  selectedEventId?: string | null
  onEventClick?: (eventId: string) => void
}

export function EventMap({ events, highlightedEventId, selectedEventId, onEventClick }: EventMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())

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
    const createCustomIcon = (zoom: number, eventId: string, isHighlighted: boolean = false) => {
      // Base size at zoom level 7, scales with zoom
      const baseSize = isHighlighted ? 18 : 14
      const baseZoom = 7
      const scaleFactor = Math.pow(1.25, zoom - baseZoom)
      const size = Math.max(isHighlighted ? 12 : 8, Math.min(isHighlighted ? 40 : 30, baseSize * scaleFactor))
      const borderWidth = Math.max(isHighlighted ? 2 : 1, Math.min(isHighlighted ? 4 : 2.5, (isHighlighted ? 2.5 : 1.5) * scaleFactor))

      // Determine color based on selection state
      let backgroundColor: string
      if (selectedEventId) {
        // If an event is selected, only that event gets orange color, others are gray
        backgroundColor = eventId === selectedEventId ? '#D94800' : '#808080'
      } else {
        // Normal state: highlighted events get brighter orange
        backgroundColor = isHighlighted ? '#E85D00' : '#D94800'
      }

      const boxShadow = isHighlighted ? '0 4px 8px rgba(232, 93, 0, 0.5)' : '0 2px 4px rgba(0,0,0,0.3)'

      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${backgroundColor}; width: ${size}px; height: ${size}px; border-radius: 50%; border: ${borderWidth}px solid white; box-shadow: ${boxShadow}; transition: all 0.2s ease;"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      })
    }

    // Add markers for each event
    events.forEach((event) => {
      const marker = L.marker([event.coordinates.lat, event.coordinates.lng], {
        icon: createCustomIcon(map.getZoom(), event.id, false)
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

      // Add click handler to filter events
      marker.on('click', () => {
        if (onEventClick) {
          onEventClick(event.id)
        }
      })

      markersRef.current.set(event.id, marker)
    })

    // Update marker sizes on zoom
    const updateMarkerSizes = () => {
      const zoom = map.getZoom()
      markersRef.current.forEach((marker, eventId) => {
        const isHighlighted = eventId === highlightedEventId
        marker.setIcon(createCustomIcon(zoom, eventId, isHighlighted))
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

  // Update highlighted marker when highlightedEventId or selectedEventId changes
  useEffect(() => {
    if (!mapInstanceRef.current) return

    const zoom = mapInstanceRef.current.getZoom()
    markersRef.current.forEach((marker, eventId) => {
      const isHighlighted = eventId === highlightedEventId
      const createCustomIcon = (zoom: number, eventId: string, isHighlighted: boolean = false) => {
        const baseSize = isHighlighted ? 18 : 14
        const baseZoom = 7
        const scaleFactor = Math.pow(1.25, zoom - baseZoom)
        const size = Math.max(isHighlighted ? 12 : 8, Math.min(isHighlighted ? 40 : 30, baseSize * scaleFactor))
        const borderWidth = Math.max(isHighlighted ? 2 : 1, Math.min(isHighlighted ? 4 : 2.5, (isHighlighted ? 2.5 : 1.5) * scaleFactor))

        // Determine color based on selection state
        let backgroundColor: string
        if (selectedEventId) {
          // If an event is selected, only that event gets orange color, others are gray
          backgroundColor = eventId === selectedEventId ? '#D94800' : '#808080'
        } else {
          // Normal state: highlighted events get brighter orange
          backgroundColor = isHighlighted ? '#E85D00' : '#D94800'
        }

        const boxShadow = isHighlighted ? '0 4px 8px rgba(232, 93, 0, 0.5)' : '0 2px 4px rgba(0,0,0,0.3)'

        return L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${backgroundColor}; width: ${size}px; height: ${size}px; border-radius: 50%; border: ${borderWidth}px solid white; box-shadow: ${boxShadow}; transition: all 0.2s ease;"></div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        })
      }
      marker.setIcon(createCustomIcon(zoom, eventId, isHighlighted))
    })
  }, [highlightedEventId, selectedEventId])

  return <div ref={mapRef} className="w-full rounded-lg" style={{ height: '100%', minHeight: '300px' }} />
}
