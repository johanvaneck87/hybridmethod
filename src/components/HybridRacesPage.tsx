import { useState, useMemo, useEffect } from 'preact/hooks'
import backgroundImage from '../picture/pexels-victorfreitas-841130.jpg'
import eventsData from '../data/events.json'
import { EventMap } from './EventMap'

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
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  url: string
  description: string
  image: string
}

type SortField = 'date' | 'location' | 'name'
type FilterType = 'all' | 'solo' | 'duo'
type FilterDifficulty = 'all' | 'beginner' | 'intermediate' | 'advanced'

// Haversine formula to calculate distance between two coordinates in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function HybridRacesPage() {
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<FilterDifficulty>('all')
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true)
  const [showMap, setShowMap] = useState(false)
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [filterMonth, setFilterMonth] = useState<string>('')
  const [filterLocation, setFilterLocation] = useState<string>('')
  const [filterRadius, setFilterRadius] = useState<number>(50)
  const [searchCoordinates, setSearchCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false)

  const events = eventsData as Event[]

  // Geocode location to coordinates when filterLocation changes
  useEffect(() => {
    if (!filterLocation.trim()) {
      setSearchCoordinates(null)
      return
    }

    const geocodeLocation = async () => {
      setIsGeocodingLoading(true)
      try {
        // Using Nominatim geocoding API (OpenStreetMap)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(filterLocation)}&countrycodes=nl&limit=1`
        )
        const data = await response.json()

        if (data && data.length > 0) {
          setSearchCoordinates({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          })
        } else {
          setSearchCoordinates(null)
        }
      } catch (error) {
        console.error('Geocoding error:', error)
        setSearchCoordinates(null)
      } finally {
        setIsGeocodingLoading(false)
      }
    }

    // Debounce the geocoding request
    const timeoutId = setTimeout(geocodeLocation, 500)
    return () => clearTimeout(timeoutId)
  }, [filterLocation])

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...events]

    // Filter by selected event (if one is clicked on the map)
    if (selectedEventId) {
      filtered = filtered.filter(event => event.id === selectedEventId)
      return filtered
    }

    // Filter by upcoming events only
    if (showUpcomingOnly) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(event => new Date(event.date) >= today)
    }

    // Filter by month
    if (filterMonth) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date)
        const eventMonth = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`
        return eventMonth === filterMonth
      })
    }

    // Filter by location with radius (geographic distance search)
    if (filterLocation && searchCoordinates) {
      filtered = filtered.filter(event => {
        const distance = calculateDistance(
          searchCoordinates.lat,
          searchCoordinates.lng,
          event.coordinates.lat,
          event.coordinates.lng
        )
        return distance <= filterRadius
      })
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType)
    }

    // Filter by difficulty
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(event => event.difficulty === filterDifficulty)
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortBy === 'location') {
        return a.location.localeCompare(b.location)
      } else {
        return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [events, sortBy, filterType, filterDifficulty, showUpcomingOnly, selectedEventId, filterMonth, filterLocation, searchCoordinates, filterRadius])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-black">
      {/* Hero Section - Fixed below header, 26.25vh height (5% bigger) */}
      <div className="sticky top-0 pt-16" style={{ height: 'calc(30.25vh + 64px)' }}>
        <div className="h-full">
          <div className="max-w-7xl mx-auto px-6 h-full">
            <div className="flex h-full">
              {/* Left side - Image */}
              <div className="w-1/2 relative h-full">
                <div
                  className="w-full h-full bg-cover bg-center bg-no-repeat rounded-lg"
                  style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                  {/* Dark overlay with gradient to blend into right side */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/20 to-black rounded-lg"></div>
                </div>
              </div>

              {/* Right side - Text box */}
              <div className="w-1/2 bg-black flex items-center justify-end pl-12">
                <div className="bg-[#D94800]" style={{ width: 'calc(45rem * 0.64)', paddingLeft: 'calc(2rem * 1.5)', paddingRight: '3rem', paddingTop: 'calc(2rem * 1.8)', paddingBottom: 'calc(2rem * 1.875)' }}>
                  <h2 className="text-black font-semibold text-3xl md:text-4xl lg:text-5xl leading-snug uppercase tracking-wide text-left">
                    FIND YOUR
                    <br />
                    NEXT HYBRID
                    <br />
                    FITNESS RACE
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - Events List */}
      <div className="relative z-10 bg-black pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filters and sorting */}
          <div className="sticky top-16 z-30 bg-black/60 backdrop-blur-sm pt-2 pb-4 mb-8 flex flex-wrap gap-4">
              {/* Show Map checkbox */}
              <div>
                <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                  Map
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMap}
                    onChange={(e) => setShowMap(e.currentTarget.checked)}
                    className="w-5 h-5 cursor-pointer accent-[#D94800]"
                  />
                </label>
              </div>

              {/* Show upcoming only checkbox */}
              <div>
                <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                  Upcoming Only
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showUpcomingOnly}
                    onChange={(e) => setShowUpcomingOnly(e.currentTarget.checked)}
                    className="w-5 h-5 cursor-pointer accent-[#D94800]"
                  />
                </label>
              </div>

              {/* Sort by */}
              <div>
                <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.currentTarget.value as SortField)}
                  className="bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#D94800]"
                >
                  <option value="date">Date</option>
                  <option value="location">Location</option>
                  <option value="name">Name</option>
                </select>
              </div>

              {/* Filter by type */}
              <div>
                <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                  Race Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.currentTarget.value as FilterType)}
                  className="bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#D94800]"
                >
                  <option value="all">All</option>
                  <option value="solo">Solo</option>
                  <option value="duo">Duo</option>
                </select>
              </div>

              {/* Filter by difficulty */}
              <div>
                <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                  Difficulty
                </label>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.currentTarget.value as FilterDifficulty)}
                  className="bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#D94800]"
                >
                  <option value="all">All</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Filter by month */}
              <div>
                <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                  Month
                </label>
                <input
                  type="month"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.currentTarget.value)}
                  className="bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#D94800]"
                />
              </div>

              {/* Filter by location */}
              <div>
                <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                  Location {isGeocodingLoading && <span className="text-xs text-[#D94800]">(searching...)</span>}
                </label>
                <input
                  type="text"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.currentTarget.value)}
                  placeholder="City or postcode"
                  className="bg-gray-900 border border-white/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
                />
              </div>

              {/* Filter radius */}
              <div>
                <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                  Radius (km)
                </label>
                <select
                  value={filterRadius}
                  onChange={(e) => setFilterRadius(Number(e.currentTarget.value))}
                  className="bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#D94800]"
                  disabled={!filterLocation}
                >
                  <option value="25">25 km</option>
                  <option value="50">50 km</option>
                  <option value="100">100 km</option>
                  <option value="200">200 km</option>
                </select>
              </div>
            </div>

            {/* Interactive Map with event markers */}
            {showMap && (
              <div className="mb-8 -mx-6 md:mx-0 px-6 md:px-0 relative z-10">
                <EventMap
                  events={events}
                  highlightedEventId={hoveredEventId}
                  selectedEventId={selectedEventId}
                  onEventClick={setSelectedEventId}
                />
              </div>
            )}

            {/* Results count and submit link */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <p className="text-gray-400">
                  Showing {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? 's' : ''}
                </p>
                {selectedEventId && (
                  <button
                    onClick={() => setSelectedEventId(null)}
                    className="text-sm bg-[#D94800] text-black font-medium px-4 py-1 rounded uppercase tracking-wide hover:bg-[#E85D00] transition-colors duration-200"
                  >
                    Show all events
                  </button>
                )}
              </div>
              <p className="text-gray-400">
                Race not found? <a href="/hybridmethod/submit-event" className="text-[#D94800] hover:text-[#E85D00] underline transition-colors duration-200">Submit a race</a>
              </p>
            </div>

            {/* Events list - Instagram square format (1:1) */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {filteredAndSortedEvents.map((event) => (
                <div
                  key={event.id}
                  className="relative aspect-square bg-gray-900 border border-white/20 rounded-lg overflow-hidden hover:border-[#D94800] transition-colors duration-200 group"
                  onMouseEnter={() => setHoveredEventId(event.id)}
                  onMouseLeave={() => setHoveredEventId(null)}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${event.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90"></div>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white uppercase tracking-wide mb-3">
                        {event.name}
                      </h3>

                      <div className="space-y-2 text-white mb-3">
                        <p className="flex items-center gap-2 text-sm">
                          <span>📅</span>
                          <span>{formatDate(event.date)}</span>
                        </p>
                        <p className="flex items-center gap-2 text-sm">
                          <span>📍</span>
                          <span>{event.location}</span>
                        </p>
                        <p className="flex items-center gap-2 text-sm">
                          <span>⚡</span>
                          <span className="capitalize">{event.difficulty}</span>
                        </p>
                      </div>
                    </div>

                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-[#D94800] text-black font-medium px-6 py-2 rounded uppercase tracking-wide text-sm hover:bg-[#E85D00] transition-colors duration-200 text-center"
                    >
                      View Event
                    </a>
                  </div>
                </div>
              ))}
            </div>

          {filteredAndSortedEvents.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl">No events found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
