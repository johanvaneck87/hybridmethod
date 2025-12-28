import { useState, useMemo, useEffect } from 'preact/hooks'
import backgroundImage from '../picture/pexels-victorfreitas-841130.jpg'
import eventsData from '../data/events.json'
import { EventMap } from './EventMap'
import { navigate } from '../router'

interface Event {
  id: string
  name: string
  organization?: string
  date: string
  endDate?: string
  location: string
  coordinates: {
    lat: number
    lng: number
  }
  type: 'solo' | 'duo'
  raceTypes?: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  url: string
  description: string
  image: string
  country?: string
}

type SortField = 'date' | 'location' | 'name'
type FilterType = 'all' | 'solo' | 'duo'
type DivisionType = 'all' | 'open' | 'pro' | 'other'
type VenueType = 'all' | 'indoor' | 'outdoor' | 'indoor-outdoor'

export function FindARacePage() {
  // Temporary filter states (not yet applied)
  const [tempSortBy, setTempSortBy] = useState<SortField>('date')
  const [tempFilterType, setTempFilterType] = useState<FilterType>('all')
  const [tempShowPastEvents, setTempShowPastEvents] = useState(false)
  const [tempLocationSearch, setTempLocationSearch] = useState('')
  const [tempDistanceKm, setTempDistanceKm] = useState('')
  const [tempLocalGymOnly, setTempLocalGymOnly] = useState(false)
  const [tempHyroxOnly, setTempHyroxOnly] = useState(false)
  const [tempOrganisation, setTempOrganisation] = useState('')
  const [tempMonth, setTempMonth] = useState('')
  const [tempYear, setTempYear] = useState('')
  const [tempDivision, setTempDivision] = useState<DivisionType>('all')
  const [tempVenue, setTempVenue] = useState<VenueType>('all')

  // Applied filter states (actually used for filtering)
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [showPastEvents, setShowPastEvents] = useState(false)
  const [locationSearch, setLocationSearch] = useState('')
  const [distanceKm, setDistanceKm] = useState('')
  const [localGymOnly, setLocalGymOnly] = useState(false)
  const [hyroxOnly, setHyroxOnly] = useState(false)
  const [organisation, setOrganisation] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [division, setDivision] = useState<DivisionType>('all')
  const [venue, setVenue] = useState<VenueType>('all')

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-apply location and distance filters when both are filled (mobile only)
  useEffect(() => {
    if (!isMobile) return // Only apply auto-filtering on mobile

    if (tempLocationSearch.trim() !== '' && tempDistanceKm.trim() !== '') {
      // Both filled - apply filter
      setLocationSearch(tempLocationSearch)
      setDistanceKm(tempDistanceKm)
    } else {
      // If either is empty, clear both filters
      setLocationSearch('')
      setDistanceKm('')
    }
  }, [tempLocationSearch, tempDistanceKm, isMobile])

  const events = eventsData as Event[]

  // Helper function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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

  // Generate month options (Dutch)
  const monthOptions = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maart' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Augustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ]

  // Generate year options (current year - 1 to current year + 2)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years: { value: string; label: string }[] = []
    for (let i = -1; i <= 2; i++) {
      const year = currentYear + i
      years.push({ value: String(year), label: String(year) })
    }
    return years
  }

  const yearOptions = useMemo(() => generateYearOptions(), [])

  // Helper function to get coordinates from location search (simplified geocoding)
  const getCoordinatesFromLocation = (locationSearch: string): { lat: number, lng: number } | null => {
    // Simple mapping of Dutch cities to coordinates (you can expand this)
    const cityCoordinates: { [key: string]: { lat: number, lng: number } } = {
      'amsterdam': { lat: 52.3676, lng: 4.9041 },
      'rotterdam': { lat: 51.9225, lng: 4.47917 },
      'delft': { lat: 52.0116, lng: 4.3571 },
      'den haag': { lat: 52.0705, lng: 4.3007 },
      'utrecht': { lat: 52.0907, lng: 5.1214 },
      'eindhoven': { lat: 51.4416, lng: 5.4697 },
      'groningen': { lat: 53.2194, lng: 6.5665 },
      'nijmegen': { lat: 51.8426, lng: 5.8526 },
      'wijchen': { lat: 51.8069, lng: 5.7236 },
      'biddinghuizen': { lat: 52.4556, lng: 5.6944 },
      'vijfhuizen': { lat: 52.3394, lng: 4.6897 }
    }

    const searchLower = locationSearch.toLowerCase().trim()
    return cityCoordinates[searchLower] || null
  }

  const applyFilters = () => {
    setSortBy(tempSortBy)
    setFilterType(tempFilterType)
    setShowPastEvents(tempShowPastEvents)
    setLocationSearch(tempLocationSearch)
    setDistanceKm(tempDistanceKm)
    setLocalGymOnly(tempLocalGymOnly)
    setHyroxOnly(tempHyroxOnly)
    setOrganisation(tempOrganisation)
    setMonth(tempMonth)
    setYear(tempYear)
    setDivision(tempDivision)
    setVenue(tempVenue)
    setMobileFiltersOpen(false)
  }

  const resetFilters = () => {
    setTempSortBy('date')
    setTempFilterType('all')
    setTempShowPastEvents(false)
    setTempLocationSearch('')
    setTempDistanceKm('')
    setTempLocalGymOnly(false)
    setTempHyroxOnly(false)
    setTempOrganisation('')
    setTempMonth('')
    setTempYear('')
    setTempDivision('all')
    setTempVenue('all')
    // Also apply the reset immediately
    setSortBy('date')
    setFilterType('all')
    setShowPastEvents(false)
    setLocationSearch('')
    setDistanceKm('')
    setLocalGymOnly(false)
    setHyroxOnly(false)
    setOrganisation('')
    setMonth('')
    setYear('')
    setDivision('all')
    setVenue('all')
  }

  // Calculate number of active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (sortBy !== 'date') count++
    if (filterType !== 'all') count++
    if (showPastEvents) count++
    // Location and distance count as one filter only when both are filled
    if (locationSearch !== '' && distanceKm !== '') count++
    if (localGymOnly) count++
    if (hyroxOnly) count++
    if (organisation !== '') count++
    // Month and year count as one filter when either or both are filled
    if (month !== '' || year !== '') count++
    if (division !== 'all') count++
    if (venue !== 'all') count++
    return count
  }, [sortBy, filterType, showPastEvents, locationSearch, distanceKm, localGymOnly, hyroxOnly, organisation, month, year, division, venue])

  // Calculate preview count based on temporary filters (for "Show X Events" button)
  const tempFilteredEventsCount = useMemo(() => {
    let filtered = [...events]

    // Filter by upcoming events only (unless showPastEvents is checked)
    if (!tempShowPastEvents) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(event => new Date(event.date) >= today)
    }

    // Filter by type
    if (tempFilterType !== 'all') {
      filtered = filtered.filter(event => event.type === tempFilterType)
    }

    // Filter by location and distance - ONLY if BOTH are provided
    if (tempLocationSearch.trim() !== '' && tempDistanceKm.trim() !== '') {
      const searchCoords = getCoordinatesFromLocation(tempLocationSearch)
      if (searchCoords) {
        const maxDistance = parseFloat(tempDistanceKm)
        if (!isNaN(maxDistance)) {
          filtered = filtered.filter(event => {
            const distance = calculateDistance(
              searchCoords.lat,
              searchCoords.lng,
              event.coordinates.lat,
              event.coordinates.lng
            )
            return distance <= maxDistance
          })
        }
      }
    }

    // Filter by local gym only (placeholder - would need gym data in events)
    if (tempLocalGymOnly) {
      // For now, this would filter events that have "gym" in the name
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes('hyrox') ||
        event.name.toLowerCase().includes('gym')
      )
    }

    return filtered.length
  }, [tempFilterType, tempShowPastEvents, tempLocationSearch, tempDistanceKm, tempLocalGymOnly, events])

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...events]

    // Filter by upcoming events only (unless showPastEvents is checked)
    if (!showPastEvents) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(event => new Date(event.date) >= today)
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType)
    }

    // Filter by location and distance - ONLY if BOTH are provided
    if (locationSearch.trim() !== '' && distanceKm.trim() !== '') {
      const searchCoords = getCoordinatesFromLocation(locationSearch)
      if (searchCoords) {
        const maxDistance = parseFloat(distanceKm)
        if (!isNaN(maxDistance)) {
          filtered = filtered.filter(event => {
            const distance = calculateDistance(
              searchCoords.lat,
              searchCoords.lng,
              event.coordinates.lat,
              event.coordinates.lng
            )
            return distance <= maxDistance
          })
        }
      }
    }

    // Filter by local gym only
    if (localGymOnly) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes('hyrox') ||
        event.name.toLowerCase().includes('gym')
      )
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
  }, [events, sortBy, filterType, showPastEvents, locationSearch, localGymOnly])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateRange = (startDateString: string, endDateString: string) => {
    const startDate = new Date(startDateString)
    const endDate = new Date(endDateString)

    const startDay = startDate.toLocaleDateString('nl-NL', { day: 'numeric' })
    const startMonth = startDate.toLocaleDateString('nl-NL', { month: 'long' })
    const endDay = endDate.toLocaleDateString('nl-NL', { day: 'numeric' })
    const endMonth = endDate.toLocaleDateString('nl-NL', { month: 'long' })
    const year = endDate.toLocaleDateString('nl-NL', { year: 'numeric' })

    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`
  }

  return (
    <div className="bg-black">
      {/* Hero Section - Fixed below header, 26.25vh height (5% bigger) - Hidden on mobile */}
      <div className="hidden md:block sticky top-0 pt-16" style={{ height: 'calc(30.25vh + 64px)' }}>
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
                <div className="bg-[#D94800] w-full max-w-[28.8rem] flex items-center justify-center" style={{ aspectRatio: '1.6', padding: 'clamp(1.5rem, 3vw, 3rem) clamp(1rem, 2.5vw, 2.5rem)' }}>
                  <h2 className="text-black font-semibold uppercase tracking-wide" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.125rem)', lineHeight: '1.15' }}>
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
      <div className="relative z-10 bg-black text-white pt-48 md:pt-12 pb-12 min-h-screen">
        <div className="mx-auto max-w-7xl px-6">
        {/* Mobile Filter Toggle and View Mode - Fixed at top on mobile */}
        <div
          className="md:hidden fixed top-0 left-0 right-0 z-30 bg-black px-6 py-4 border-b border-white/20 transition-all duration-300"
          style={{ marginTop: isScrolled ? '40px' : '56px' }}
        >
          {/* Location Search and Distance - Always visible */}
          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <input
                type="text"
                value={tempLocationSearch}
                onChange={(e) => setTempLocationSearch(e.currentTarget.value)}
                placeholder="Postcode or city"
                className="w-full bg-gray-900 border border-white/20 rounded px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
              />
            </div>
            <div className="w-24">
              <input
                type="text"
                value={tempDistanceKm}
                onChange={(e) => setTempDistanceKm(e.currentTarget.value)}
                placeholder="km"
                className="w-full bg-gray-900 border border-white/20 rounded px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex-1 bg-gray-900 border border-white/20 rounded px-4 py-2.5 text-white flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium uppercase tracking-wide text-sm">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#D94800] text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <span className={`transform transition-transform duration-200 ${mobileFiltersOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
              className="w-24 bg-gray-900 border border-white/20 rounded px-2 py-2.5 text-white flex items-center justify-center gap-1.5"
            >
              {viewMode === 'list' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span className="font-medium uppercase tracking-wide text-sm">Map</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span className="font-medium uppercase tracking-wide text-sm">List</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Filters Fullscreen Overlay */}
        {mobileFiltersOpen && (
          <div
            className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-black z-40 overflow-y-auto transition-all duration-300"
            style={{ paddingTop: isScrolled ? '40px' : '56px' }}
          >
            {/* Location/Distance and Close button at top */}
            <div className="sticky top-0 bg-black z-50 px-6 py-4 border-b border-white/20">
              {/* Location Search and Distance */}
              <div className="flex gap-2 mb-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={tempLocationSearch}
                    onChange={(e) => setTempLocationSearch(e.currentTarget.value)}
                    placeholder="Postcode or city"
                    className="w-full bg-gray-900 border border-white/20 rounded px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
                  />
                </div>
                <div className="w-24">
                  <input
                    type="text"
                    value={tempDistanceKm}
                    onChange={(e) => setTempDistanceKm(e.currentTarget.value)}
                    placeholder="km"
                    className="w-full bg-gray-900 border border-white/20 rounded px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
                  />
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-gray-900 border border-white/20 rounded px-4 py-2.5 text-white flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium uppercase tracking-wide text-sm">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-[#D94800] text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <span className="transform rotate-180">▼</span>
              </button>
            </div>

            <div className="px-6 py-4 space-y-3">
              {/* Reset All Filters */}
              <button
                onClick={resetFilters}
                className="block text-xs font-medium uppercase tracking-wide text-[#D94800] hover:text-[#E85D00] transition-colors duration-200"
              >
                Reset All Filters
              </button>

              {/* Show Past events, Local gym, and Only Hyrox workouts toggles */}
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
                  Show
                </label>
                <div className="space-y-2 flex flex-col">
                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={tempShowPastEvents}
                      onChange={(e) => setTempShowPastEvents(e.currentTarget.checked)}
                      className="w-4 h-4 cursor-pointer accent-[#D94800]"
                    />
                    <span className="text-sm text-white">Past events</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={tempLocalGymOnly}
                      onChange={(e) => setTempLocalGymOnly(e.currentTarget.checked)}
                      className="w-4 h-4 cursor-pointer accent-[#D94800]"
                    />
                    <span className="text-sm text-white">Local gym</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={tempHyroxOnly}
                      onChange={(e) => setTempHyroxOnly(e.currentTarget.checked)}
                      className="w-4 h-4 cursor-pointer accent-[#D94800]"
                    />
                    <span className="text-sm text-white">Only Hyrox workouts</span>
                  </label>
                </div>
              </div>

              {/* Sort by */}
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
                  Sort by
                </label>
                <select
                  value={tempSortBy}
                  onChange={(e) => setTempSortBy(e.currentTarget.value as SortField)}
                  className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
                >
                  <option value="date">Date</option>
                  <option value="location">Location</option>
                  <option value="name">Name</option>
                </select>
              </div>

              {/* Organisation / Gym */}
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
                  Organisation / Gym
                </label>
                <input
                  type="text"
                  value={tempOrganisation}
                  onChange={(e) => setTempOrganisation(e.currentTarget.value)}
                  placeholder="Search organisation"
                  className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
                />
              </div>

              {/* Month / Year */}
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
                  Month / Year
                </label>
                <div className="flex gap-2">
                  <select
                    value={tempMonth}
                    onChange={(e) => setTempMonth(e.currentTarget.value)}
                    className="flex-1 bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
                  >
                    <option value="">Month</option>
                    {monthOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={tempYear}
                    onChange={(e) => setTempYear(e.currentTarget.value)}
                    className="w-24 bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
                  >
                    <option value="">Year</option>
                    {yearOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter by type */}
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
                  Race Type
                </label>
                <select
                  value={tempFilterType}
                  onChange={(e) => setTempFilterType(e.currentTarget.value as FilterType)}
                  className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
                >
                  <option value="all">All</option>
                  <option value="solo">Solo</option>
                  <option value="duo">Duo</option>
                </select>
              </div>

              {/* Division */}
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
                  Division
                </label>
                <select
                  value={tempDivision}
                  onChange={(e) => setTempDivision(e.currentTarget.value as DivisionType)}
                  className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
                >
                  <option value="all">All</option>
                  <option value="open">Open</option>
                  <option value="pro">Pro</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Indoor / Outdoor */}
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
                  Indoor / Outdoor
                </label>
                <select
                  value={tempVenue}
                  onChange={(e) => setTempVenue(e.currentTarget.value as VenueType)}
                  className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
                >
                  <option value="all">All</option>
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="indoor-outdoor">Indoor & Outdoor</option>
                </select>
              </div>

              {/* Apply button to close filters */}
              <button
                onClick={applyFilters}
                className="w-full bg-[#D94800] text-black font-bold px-6 py-2 rounded uppercase tracking-wide hover:bg-[#E85D00] transition-colors duration-200"
              >
                Show {tempFilteredEventsCount} Event{tempFilteredEventsCount !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {/* Layout Container - Desktop: Sidebar + Grid, Mobile: Stacked */}
        <div className="flex gap-6 items-start">
          {/* Filters Sidebar - Left on desktop, hidden on mobile */}
          <div className="hidden md:block md:sticky md:top-[80px] md:w-[calc((100%-3*1.5rem)/4)] flex-shrink-0">
            <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-4 space-y-3">
              {/* Header with FILTERS and MAP/LIST toggle */}
              <div className="flex items-center justify-between pb-3 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold uppercase tracking-wide text-white">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <span className="bg-[#D94800] text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                  className="flex items-center gap-2 text-base font-semibold uppercase tracking-wide text-white hover:text-[#D94800] transition-colors duration-200"
                >
                  {viewMode === 'list' ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span>MAP</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      <span>LIST</span>
                    </>
                  )}
                </button>
              </div>

          {/* Reset All Filters button */}
          <button
            onClick={resetFilters}
            className="block text-xs font-medium uppercase tracking-wide text-[#D94800] hover:text-[#E85D00] transition-colors duration-200"
          >
            Reset All Filters
          </button>

          {/* Location Search and Distance */}
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={tempLocationSearch}
                onChange={(e) => setTempLocationSearch(e.currentTarget.value)}
                placeholder="Postcode or city"
                className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
              />
            </div>
            <div className="w-16">
              <input
                type="text"
                value={tempDistanceKm}
                onChange={(e) => setTempDistanceKm(e.currentTarget.value)}
                placeholder="km"
                className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
              />
            </div>
          </div>

          {/* Show Past events and Local gym toggles */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
              Show
            </label>
            <div className="space-y-2 flex flex-col">
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={tempShowPastEvents}
                  onChange={(e) => setTempShowPastEvents(e.currentTarget.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#D94800]"
                />
                <span className="text-sm text-white">Past events</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={tempLocalGymOnly}
                  onChange={(e) => setTempLocalGymOnly(e.currentTarget.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#D94800]"
                />
                <span className="text-sm text-white">Local gym</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={tempHyroxOnly}
                  onChange={(e) => setTempHyroxOnly(e.currentTarget.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#D94800]"
                />
                <span className="text-sm text-white">Only Hyrox workouts</span>
              </label>
            </div>
          </div>

          {/* Sort by */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
              Sort by
            </label>
            <select
              value={tempSortBy}
              onChange={(e) => setTempSortBy(e.currentTarget.value as SortField)}
              className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
            >
              <option value="date">Date</option>
              <option value="location">Location</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Organisation / Gym */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
              Organisation / Gym
            </label>
            <input
              type="text"
              value={tempOrganisation}
              onChange={(e) => setTempOrganisation(e.currentTarget.value)}
              placeholder="Search organisation"
              className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
            />
          </div>

          {/* Month / Year */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
              Month / Year
            </label>
            <div className="flex gap-2">
              <select
                value={tempMonth}
                onChange={(e) => setTempMonth(e.currentTarget.value)}
                className="flex-1 bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
              >
                <option value="">Month</option>
                {monthOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={tempYear}
                onChange={(e) => setTempYear(e.currentTarget.value)}
                className="w-20 bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
              >
                <option value="">Year</option>
                {yearOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter by type */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
              Race Type
            </label>
            <select
              value={tempFilterType}
              onChange={(e) => setTempFilterType(e.currentTarget.value as FilterType)}
              className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
            >
              <option value="all">All</option>
              <option value="solo">Solo</option>
              <option value="duo">Duo</option>
            </select>
          </div>

          {/* Division */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
              Division
            </label>
            <select
              value={tempDivision}
              onChange={(e) => setTempDivision(e.currentTarget.value as DivisionType)}
              className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="pro">Pro</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Indoor / Outdoor */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
              Indoor / Outdoor
            </label>
            <select
              value={tempVenue}
              onChange={(e) => setTempVenue(e.currentTarget.value as VenueType)}
              className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
            >
              <option value="all">All</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
              <option value="indoor-outdoor">Indoor & Outdoor</option>
            </select>
          </div>

          {/* Apply Filters button */}
          <button
            onClick={applyFilters}
            className="w-full bg-[#D94800] text-black font-bold px-3 py-1.5 rounded uppercase tracking-wide text-sm hover:bg-[#E85D00] transition-colors duration-200"
          >
            Show {tempFilteredEventsCount} Event{tempFilteredEventsCount !== 1 ? 's' : ''}
          </button>
            </div>
          </div>

          {/* Main Content Area - Events Grid or Map */}
          <div className="flex-1">
            {viewMode === 'map' ? (
              /* Map View - Full available height */
              <>
                {/* Results count and submit link */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-400">
                    Showing {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-gray-400">
                    <span className="hidden sm:inline">Race not found? </span><a href="/hybridmethod/submit-event" className="text-[#D94800] hover:text-[#E85D00] underline transition-colors duration-200">Submit a race</a>
                  </p>
                </div>

                <div className="relative z-10 mb-6 md:mb-12">
                  <div className="h-[calc(100vh-380px)] md:h-[calc(100vh-280px)]">
                    <EventMap events={filteredAndSortedEvents} />
                  </div>
                </div>
              </>
            ) : (
              /* List View */
              <>
                {/* Results count and submit link */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-400">
                    Showing {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-gray-400">
                    <span className="hidden sm:inline">Race not found? </span><a href="/hybridmethod/submit-event" className="text-[#D94800] hover:text-[#E85D00] underline transition-colors duration-200">Submit a race</a>
                  </p>
                </div>

                {/* Events list - 3 columns on desktop */}
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => navigate('event-detail', event.id)}
              className="relative aspect-square bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-[#D94800] active:border-[#D94800] focus-within:border-[#D94800] transition-colors duration-200 group cursor-pointer"
            >
              {/* Country Flag - Top Right */}
              <div className="absolute top-2 right-2 z-10">
                <div className="border border-white/40 rounded-sm p-0.5">
                  {event.country === 'BE' ? (
                    <svg className="w-6 h-4" viewBox="0 0 9 6" xmlns="http://www.w3.org/2000/svg">
                      <rect fill="#000" width="3" height="6"/>
                      <rect fill="#FDDA24" x="3" width="3" height="6"/>
                      <rect fill="#EF3340" x="6" width="3" height="6"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-4" viewBox="0 0 9 6" xmlns="http://www.w3.org/2000/svg">
                      <rect fill="#AE1C28" width="9" height="2"/>
                      <rect fill="#FFF" y="2" width="9" height="2"/>
                      <rect fill="#21468B" y="4" width="9" height="2"/>
                    </svg>
                  )}
                </div>
              </div>

              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${event.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col p-6">
                {/* Event name - fixed height for 2 lines */}
                <div>
                  <h3 className="text-3xl md:text-2xl font-bold text-white uppercase tracking-wide line-clamp-2 h-[5.25rem] md:h-[4.5rem] flex items-start">
                    <span>{event.name}</span>
                  </h3>
                </div>

                {/* Event details - always starts at same position */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1 text-white mb-3">
                    <p className="flex items-center gap-2 text-base md:text-sm">
                      <span>📅</span>
                      <span>{event.endDate ? formatDateRange(event.date, event.endDate) : formatDate(event.date)}</span>
                    </p>
                    <p className="flex items-center gap-2 text-base md:text-sm">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </p>
                    <p className="flex items-center gap-2 text-base md:text-sm">
                      <span>{event.raceTypes ? '🏃‍♂️' : '⚡'}</span>
                      <span className="capitalize">{event.raceTypes ? event.raceTypes.join(', ') : event.difficulty}</span>
                    </p>
                    {event.organization && (
                      <p className="flex items-center gap-2 text-base md:text-sm">
                        <span>🏢</span>
                        <span>{event.organization}</span>
                      </p>
                    )}
                  </div>

                  <div className="inline-block bg-[#D94800] text-black font-semibold px-6 py-2 rounded tracking-[0.15em] text-lg md:text-base text-center">
                    Event information
                  </div>
                </div>
              </div>
            </div>
          ))}
                </div>

                {filteredAndSortedEvents.length === 0 && (
                  <div className="text-center text-gray-400 py-12">
                    <p className="text-xl">No events found matching your filters.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
