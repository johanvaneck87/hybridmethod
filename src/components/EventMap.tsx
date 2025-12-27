import { useEffect, useRef, useState } from 'preact/hooks'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { navigate } from '../router'

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
  image: string
  url: string
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

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

      // Add click handler to show event popup
      marker.on('click', () => {
        setSelectedEvent(event)
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
        html: `<div style="background-color: ${backgroundColor}; width: ${size}px; height: ${size}px; border-radius: 50%; border: ${borderWidth}px solid white; box-shadow: ${boxShadow}; transition: all 0.2s ease; cursor: pointer;"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      })
    }

    // Remove all old event handlers and add new ones
    markersRef.current.forEach((marker, eventId) => {
      // Remove old handlers
      marker.off('mouseover')
      marker.off('mouseout')

      // Add new hover handlers
      marker.on('mouseover', () => {
        setHoveredMarkerId(eventId)
      })

      marker.on('mouseout', () => {
        setHoveredMarkerId(null)
      })

      // Update icon for current state
      const isHighlighted = eventId === highlightedEventId || eventId === hoveredMarkerId
      marker.setIcon(createCustomIcon(zoom, eventId, isHighlighted))
    })
  }, [highlightedEventId, selectedEventId, events, hoveredMarkerId])

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full rounded-lg" style={{ height: '100%', minHeight: '300px' }} />

      {/* Event Popup Overlay */}
      {selectedEvent && (
        <div
          className="absolute inset-0 z-[1001] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[280px] lg:max-w-[300px] aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Event Tile */}
            <div
              onClick={() => navigate('event-detail', selectedEvent.id)}
              className="relative w-full h-full bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-[#D94800] transition-colors duration-200 cursor-pointer"
            >
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedEvent(null)
                }}
                className="absolute top-3 right-3 z-10 text-white hover:text-[#D94800] transition-colors duration-200"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedEvent.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6">
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-2xl font-bold text-white uppercase tracking-wide mb-3">
                    {selectedEvent.name}
                  </h3>

                  <div className="space-y-2 text-white mb-3">
                    <p className="flex items-center gap-2 text-sm">
                      <span>📅</span>
                      <span>{formatDate(selectedEvent.date)}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <span>📍</span>
                      <span>{selectedEvent.location}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <span>⚡</span>
                      <span className="capitalize">{selectedEvent.difficulty}</span>
                    </p>
                  </div>
                </div>

                <div className="inline-block bg-[#D94800] text-black font-semibold px-6 py-2 rounded tracking-[0.15em] text-base text-center">
                  Event information
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
