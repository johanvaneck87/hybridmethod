import { useEffect, useRef, useState } from 'preact/hooks'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { navigate } from '../router'
import { CountryFlag } from './CountryFlag'
import type { RaceEvent as Event } from '../types/Event'

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
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([])
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null)

  // Helper to get selected event
  const selectedEvent = selectedEvents.length > 0 ? selectedEvents[currentEventIndex] : null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.toLocaleDateString('en-US', { month: 'long' })
    const day = date.toLocaleDateString('en-US', { day: 'numeric' })
    const year = date.toLocaleDateString('en-US', { year: 'numeric' })
    return `${month} ${day}, ${year}`
  }

  const formatDateRange = (startDateString: string, endDateString: string) => {
    const startDate = new Date(startDateString)
    const endDate = new Date(endDateString)

    const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' })
    const startDay = startDate.toLocaleDateString('en-US', { day: 'numeric' })
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' })
    const endDay = endDate.toLocaleDateString('en-US', { day: 'numeric' })
    const year = endDate.toLocaleDateString('en-US', { year: 'numeric' })

    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
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

    // Group events by location (same coordinates)
    const eventsByLocation = new Map<string, Event[]>()
    events.forEach((event) => {
      const key = `${event.coordinates.lat},${event.coordinates.lng}`
      if (!eventsByLocation.has(key)) {
        eventsByLocation.set(key, [])
      }
      eventsByLocation.get(key)!.push(event)
    })

    // Sort events at each location by date (closest to future or most recent first)
    const today = new Date()
    eventsByLocation.forEach((locationEvents) => {
      locationEvents.sort((a, b) => {
        const dateA = new Date(a.startdate)
        const dateB = new Date(b.startdate)

        // Both in future: closest first
        if (dateA >= today && dateB >= today) {
          return dateA.getTime() - dateB.getTime()
        }
        // Both in past: most recent first
        if (dateA < today && dateB < today) {
          return dateB.getTime() - dateA.getTime()
        }
        // One future, one past: future first
        return dateA >= today ? -1 : 1
      })
    })

    // Add one marker per location (using first event's ID as marker ID)
    eventsByLocation.forEach((locationEvents) => {
      const firstEvent = locationEvents[0]
      const marker = L.marker([firstEvent.coordinates.lat, firstEvent.coordinates.lng], {
        icon: createCustomIcon(map.getZoom(), firstEvent.id, false)
      }).addTo(map)

      // Add click handler to show event popup(s)
      marker.on('click', () => {
        setSelectedEvents(locationEvents)
        setCurrentEventIndex(0)
        if (onEventClick) {
          onEventClick(firstEvent.id)
        }
      })

      markersRef.current.set(firstEvent.id, marker)
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
          onClick={() => {
            setSelectedEvents([])
            setCurrentEventIndex(0)
          }}
        >
          <div
            className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[280px] lg:max-w-[300px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Controls above the tile */}
            <div className="flex items-center justify-between mb-3">
              {/* Navigation arrows and event counter - left side */}
              <div className="flex items-center gap-2">
                {selectedEvents.length > 1 && (
                  <>
                    {/* Previous button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentEventIndex((prev) => (prev === 0 ? selectedEvents.length - 1 : prev - 1))
                      }}
                      className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-[#D94800] transition-colors duration-200 p-2 rounded-full"
                      aria-label="Previous event"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Event counter */}
                    <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {currentEventIndex + 1} / {selectedEvents.length}
                    </div>

                    {/* Next button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentEventIndex((prev) => (prev === selectedEvents.length - 1 ? 0 : prev + 1))
                      }}
                      className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-[#D94800] transition-colors duration-200 p-2 rounded-full"
                      aria-label="Next event"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Close button - right side */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedEvents([])
                  setCurrentEventIndex(0)
                }}
                className="bg-black/60 backdrop-blur-sm text-white hover:text-[#D94800] transition-colors duration-200 p-2 rounded-full"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Event Tile */}
            <div className="relative aspect-square">

              {/* Event Tile */}
              <div
                onClick={() => navigate('event-detail', selectedEvent.id)}
                className="relative w-full h-full bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-[#D94800] transition-colors duration-200 cursor-pointer"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center z-0"
                  style={{ backgroundImage: `url(${selectedEvent.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90 z-0"></div>
                </div>

                {/* Country Flag - Top Right */}
                <div className="absolute top-2 right-2 z-10">
                  <CountryFlag country={selectedEvent.country} size="small" />
                </div>

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col p-6">
                  {/* Event name - fixed height to reserve space for 2 lines */}
                  <div className="pr-12 mb-2 md:mb-0" style={{ height: '4.5rem' }}>
                    <h3 className="text-[1.75rem] md:text-2xl font-bold text-white uppercase tracking-wide line-clamp-2 leading-tight flex items-start">
                      <span>{selectedEvent.eventname}</span>
                    </h3>
                  </div>

                  {/* Event details - always starts at same position from top */}
                  <div className="space-y-1 text-white mb-6">
                    <p className="flex items-center gap-2 text-sm md:text-sm">
                      <span>📅</span>
                      <span>{selectedEvent.enddate ? formatDateRange(selectedEvent.startdate, selectedEvent.enddate) : formatDate(selectedEvent.startdate)}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm md:text-sm">
                      <span>📍</span>
                      <span>{selectedEvent.location}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm md:text-sm">
                      <span>🏃‍♂️</span>
                      <span className="capitalize">{selectedEvent.typerace.join(', ')}</span>
                    </p>
                    {selectedEvent.organizationgym && (
                      <p className="flex items-center gap-2 text-sm md:text-sm">
                        <span>🏢</span>
                        <span>{selectedEvent.organizationgym}</span>
                      </p>
                    )}
                  </div>

                  {/* Button - always at same position from top */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-[#D94800] text-black font-semibold px-6 py-2 rounded tracking-[0.15em] text-base md:text-base text-center">
                      Event information
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
