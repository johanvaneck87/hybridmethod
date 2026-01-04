import { useState, useMemo, useEffect } from 'preact/hooks'
import backgroundImage from '../picture/pexels-victorfreitas-841130.jpg'
import eventsData from '../data/events.json'
import { EventMap } from './EventMap'
import type { Event } from '../types/Event'



type SortField = 'date' | 'location' | 'name'

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

export function HybridRacesLandingPage() {
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [filterRaceType, setFilterRaceType] = useState<string>('all')
  const [filterOrganization, setFilterOrganization] = useState<string>('all')
  const [filterDivision, setFilterDivision] = useState<string>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [onlyHyrox, setOnlyHyrox] = useState(false)
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true)
  const [showMap, setShowMap] = useState(false)
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [filterMonth, setFilterMonth] = useState<string>('')
  const [filterLocation, setFilterLocation] = useState<string>('')
  const [filterRadius, setFilterRadius] = useState<number>(50)
  const [searchCoordinates, setSearchCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false)
  const [flippedEventId, setFlippedEventId] = useState<string | null>(null)

  const events = eventsData as Event[]

  // Extract unique race types from all events
  const uniqueRaceTypes = useMemo(() => {
    const types = new Set<string>()
    events.forEach(event => {
      if (event.raceTypes && event.raceTypes.length > 0) {
        event.raceTypes.forEach(type => types.add(type))
      } else if (event.type) {
        types.add(event.type.charAt(0).toUpperCase() + event.type.slice(1))
      }
    })
    return Array.from(types).sort()
  }, [events])

  // Extract unique organizations from all events
  const uniqueOrganizations = useMemo(() => {
    const orgs = new Set<string>()
    events.forEach(event => {
      if (event.organization) {
        orgs.add(event.organization)
      }
    })
    return Array.from(orgs).sort()
  }, [events])

  // Extract unique divisions from all events
  const uniqueDivisions = useMemo(() => {
    const divs = new Set<string>()
    events.forEach(event => {
      if (event.divisions && event.divisions.length > 0) {
        event.divisions.forEach(div => divs.add(div))
      }
    })
    return Array.from(divs).sort()
  }, [events])

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
        // Add Netherlands to the query for better results
        const searchQuery = `${filterLocation}, Netherlands`
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=nl&limit=5&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'HybridMethodWebsite/1.0'
            }
          }
        )
        const data = await response.json()

        if (data && data.length > 0) {
          // Prioritize city-level results over other types
          const cityResult = data.find((item: any) =>
            item.type === 'administrative' ||
            item.type === 'city' ||
            item.addresstype === 'city' ||
            item.addresstype === 'town' ||
            item.addresstype === 'municipality'
          ) || data[0]

          console.log('Geocoding result for', filterLocation, ':', {
            lat: parseFloat(cityResult.lat),
            lng: parseFloat(cityResult.lon),
            display_name: cityResult.display_name
          })

          setSearchCoordinates({
            lat: parseFloat(cityResult.lat),
            lng: parseFloat(cityResult.lon)
          })
        } else {
          console.log('No geocoding results for', filterLocation)
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
      console.log('Filtering by location:', filterLocation, 'with radius:', filterRadius, 'km')
      console.log('Search coordinates:', searchCoordinates)

      filtered = filtered.filter(event => {
        const distance = calculateDistance(
          searchCoordinates.lat,
          searchCoordinates.lng,
          event.coordinates.lat,
          event.coordinates.lng
        )
        console.log(`Distance to ${event.name} (${event.location}):`, distance.toFixed(2), 'km', distance <= filterRadius ? '✓' : '✗')
        return distance <= filterRadius
      })

      console.log('Filtered events count:', filtered.length)
    }

    // Filter by race type
    if (filterRaceType !== 'all') {
      filtered = filtered.filter(event => {
        if (event.raceTypes && event.raceTypes.length > 0) {
          return event.raceTypes.some(raceType =>
            raceType.toLowerCase() === filterRaceType.toLowerCase()
          )
        }
        return event.type === filterRaceType.toLowerCase()
      })
    }

    // Filter by organization
    if (filterOrganization !== 'all') {
      filtered = filtered.filter(event => event.organization === filterOrganization)
    }

    // Filter by division
    if (filterDivision !== 'all') {
      filtered = filtered.filter(event => {
        if (event.divisions && event.divisions.length > 0) {
          return event.divisions.some(div => div === filterDivision)
        }
        return false
      })
    }

    // Filter by difficulty
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(event => event.difficulty === filterDifficulty)
    }

    // Filter by HYROX workouts only
    if (onlyHyrox) {
      filtered = filtered.filter(event => event.hyroxWorkout === 'Yes')
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
  }, [events, sortBy, filterRaceType, filterOrganization, filterDivision, filterDifficulty, onlyHyrox, showUpcomingOnly, selectedEventId, filterMonth, filterLocation, searchCoordinates, filterRadius])

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
                <div className="bg-[#D94800]" style={{ width: 'calc(45rem * 0.64)', paddingLeft: 'calc(2rem * 2)', paddingRight: '3rem', paddingTop: 'calc(2rem * 1.8)', paddingBottom: 'calc(2rem * 1.875)' }}>
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
          <div className="flex gap-6 items-start">
            {/* Left sidebar - Filters (width equals one event block in 4-column grid) */}
            <div className="w-[calc((100%-3*1.5rem)/4)] flex-shrink-0">
              <div className="sticky top-20 bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                <h3 className="text-xl font-semibold text-[#D94800] uppercase tracking-wide mb-6">Filters</h3>
                <div className="space-y-6">
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
                      className="w-full bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#D94800]"
                    >
                      <option value="date">Date</option>
                      <option value="location">Location</option>
                      <option value="name">Name</option>
                    </select>
                  </div>

                  {/* Filter by race type */}
                  <div>
                    <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                      Race Type
                    </label>
                    <select
                      value={filterRaceType}
                      onChange={(e) => setFilterRaceType(e.currentTarget.value)}
                      className="w-full bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#D94800]"
                    >
                      <option value="all">All</option>
                      {uniqueRaceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by organization */}
                  <div>
                    <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                      Organization / Gym
                    </label>
                    <select
                      value={filterOrganization}
                      onChange={(e) => setFilterOrganization(e.currentTarget.value)}
                      className="w-full bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#D94800]"
                    >
                      <option value="all">All</option>
                      {uniqueOrganizations.map(org => (
                        <option key={org} value={org}>{org}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by division */}
                  {uniqueDivisions.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                        Division
                      </label>
                      <select
                        value={filterDivision}
                        onChange={(e) => setFilterDivision(e.currentTarget.value)}
                        className="w-full bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#D94800]"
                      >
                        <option value="all">All</option>
                        {uniqueDivisions.map(div => (
                          <option key={div} value={div}>{div}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Filter by difficulty */}
                  <div>
                    <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                      Difficulty
                    </label>
                    <select
                      value={filterDifficulty}
                      onChange={(e) => setFilterDifficulty(e.currentTarget.value)}
                      className="w-full bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#D94800]"
                    >
                      <option value="all">All</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Only HYROX workouts checkbox */}
                  <div>
                    <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                      Only HYROX
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onlyHyrox}
                        onChange={(e) => setOnlyHyrox(e.currentTarget.checked)}
                        className="w-5 h-5 cursor-pointer accent-[#D94800]"
                      />
                      <span className="text-white text-sm">Only HYROX workouts</span>
                    </label>
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
                      className="w-full bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#D94800]"
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
                      className="w-full bg-gray-900 border border-white/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
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
                      className="w-full bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#D94800]"
                      disabled={!filterLocation}
                    >
                      <option value="25">25 km</option>
                      <option value="50">50 km</option>
                      <option value="100">100 km</option>
                      <option value="200">200 km</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Map and Events */}
            <div className="flex-1">
              {/* Interactive Map with event markers */}
              {showMap && (
                <div className="mb-8 relative z-10">
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

              {/* Events list - Instagram vertical format (4:5) in 3 columns */}
              <div className="grid gap-6 grid-cols-3">
                {filteredAndSortedEvents.map((event) => {
                  const isFlipped = flippedEventId === event.id
                  return (
                    <div
                      key={event.id}
                      className="relative aspect-square"
                      style={{ perspective: '1000px' }}
                      onMouseEnter={() => setHoveredEventId(event.id)}
                      onMouseLeave={() => setHoveredEventId(null)}
                    >
                      <div
                        className="relative w-full h-full transition-transform duration-600"
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                        }}
                      >
                        {/* Front side */}
                        <div
                          className="absolute inset-0 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-[#D94800] transition-colors duration-200 cursor-pointer"
                          style={{
                            backfaceVisibility: 'hidden',
                            backgroundImage: `url(${event.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                          onClick={() => setFlippedEventId(event.id)}
                        >
                          {/* Dark overlay */}
                          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90"></div>

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
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Event
                            </a>
                          </div>
                        </div>

                        {/* Back side */}
                        <div
                          className="absolute inset-0 bg-gray-900 border border-[#D94800] rounded-lg overflow-hidden cursor-pointer"
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                          }}
                          onClick={() => setFlippedEventId(null)}
                        >
                          <div className="h-full flex flex-col justify-center items-center p-6 bg-gradient-to-b from-black/90 to-black">
                            <p className="text-white text-2xl font-bold uppercase tracking-wide">
                              Test
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredAndSortedEvents.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                  <p className="text-xl">No events found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
