import { useState, useMemo, useEffect } from 'preact/hooks'
import backgroundImage from '../picture/Mainpage.jpg'
import eventsData from '../data/events.json'
import { EventMap } from './EventMap'
import { navigate } from '../router'
import type { RaceEvent as Event } from '../types/Event'

type FilterType = 'all' | 'solo' | 'duo' | 'relay' | 'team' | 'other'
type DivisionType = 'all' | 'open' | 'pro' | 'other'
type VenueType = 'all' | 'indoor' | 'outdoor' | 'indoor-outdoor'

export function FindARacePage() {
  // Temporary filter states (not yet applied)
  const [tempFilterType, setTempFilterType] = useState<FilterType>('all')
  const [tempOnlyUpcomingEvents, setTempOnlyUpcomingEvents] = useState(false)
  const [tempLocationSearch, setTempLocationSearch] = useState('')
  const [tempDistanceKm, setTempDistanceKm] = useState('')
  const [tempHyroxOnly, setTempHyroxOnly] = useState(false)
  const [tempOrganisation, setTempOrganisation] = useState('')
  const [tempMonth, setTempMonth] = useState('')
  const [tempYear, setTempYear] = useState('')
  const [tempDivision, setTempDivision] = useState<DivisionType>('all')
  const [tempVenue, setTempVenue] = useState<VenueType>('all')
  const [tempNewestFirst, setTempNewestFirst] = useState(false)

  // Applied filter states (actually used for filtering)
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [onlyUpcomingEvents, setOnlyUpcomingEvents] = useState(false)
  const [locationSearch, setLocationSearch] = useState('')
  const [distanceKm, setDistanceKm] = useState('')
  const [hyroxOnly, setHyroxOnly] = useState(false)
  const [organisation, setOrganisation] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [division, setDivision] = useState<DivisionType>('all')
  const [venue, setVenue] = useState<VenueType>('all')
  const [newestFirst, setNewestFirst] = useState(false)

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [searchCoordinates, setSearchCoordinates] = useState<{ lat: number; lng: number } | null>(null)

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

  // Auto-apply filters on desktop (always) and on mobile (when both location and distance are filled)
  useEffect(() => {
    // Apply all filters immediately on both desktop and mobile
    setFilterType(tempFilterType)
    setOnlyUpcomingEvents(tempOnlyUpcomingEvents)
    setLocationSearch(tempLocationSearch)
    setDistanceKm(tempDistanceKm)
    setHyroxOnly(tempHyroxOnly)
    setOrganisation(tempOrganisation)
    setMonth(tempMonth)
    setYear(tempYear)
    setDivision(tempDivision)
    setVenue(tempVenue)
    setNewestFirst(tempNewestFirst)
  }, [tempFilterType, tempOnlyUpcomingEvents, tempLocationSearch, tempDistanceKm, tempHyroxOnly, tempOrganisation, tempMonth, tempYear, tempDivision, tempVenue, tempNewestFirst])

  const events = eventsData as Event[]

  // Geocode location to coordinates when locationSearch changes
  useEffect(() => {
    if (!locationSearch.trim()) {
      setSearchCoordinates(null)
      return
    }

    const geocodeLocation = async () => {
      try {
        const searchQuery = `${locationSearch}, Netherlands`
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
          const cityResult = data.find((item: any) =>
            item.type === 'administrative' ||
            item.type === 'city' ||
            item.addresstype === 'city' ||
            item.addresstype === 'town' ||
            item.addresstype === 'municipality'
          ) || data[0]

          setSearchCoordinates({
            lat: parseFloat(cityResult.lat),
            lng: parseFloat(cityResult.lon)
          })
        } else {
          setSearchCoordinates(null)
        }
      } catch (error) {
        console.error('Geocoding error:', error)
        setSearchCoordinates(null)
      }
    }

    const timeoutId = setTimeout(geocodeLocation, 500)
    return () => clearTimeout(timeoutId)
  }, [locationSearch])

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

  // Extract unique organizations from events
  const uniqueOrganizations = useMemo(() => {
    const orgs = new Set<string>()
    events.forEach(event => {
      if (event.organizationgym) {
        orgs.add(event.organizationgym)
      }
    })
    return Array.from(orgs).sort()
  }, [events])

  const resetFilters = () => {
    setTempFilterType('all')
    setTempOnlyUpcomingEvents(false)
    setTempLocationSearch('')
    setTempDistanceKm('')
    setTempHyroxOnly(false)
    setTempOrganisation('')
    setTempMonth('')
    setTempYear('')
    setTempDivision('all')
    setTempVenue('all')
    setTempNewestFirst(false)
    // Also apply the reset immediately
    setFilterType('all')
    setOnlyUpcomingEvents(false)
    setLocationSearch('')
    setDistanceKm('')
    setHyroxOnly(false)
    setOrganisation('')
    setMonth('')
    setYear('')
    setDivision('all')
    setVenue('all')
    setNewestFirst(false)
  }

  // Helper function to remove individual filter
  const removeFilter = (filterKey: string) => {
    switch (filterKey) {
      case 'filterType':
        setTempFilterType('all')
        if (!isMobile) setFilterType('all')
        break
      case 'onlyUpcomingEvents':
        setTempOnlyUpcomingEvents(false)
        if (!isMobile) setOnlyUpcomingEvents(false)
        break
      case 'location':
        setTempLocationSearch('')
        setTempDistanceKm('')
        if (!isMobile) {
          setLocationSearch('')
          setDistanceKm('')
        }
        break
      case 'hyroxOnly':
        setTempHyroxOnly(false)
        if (!isMobile) setHyroxOnly(false)
        break
      case 'organisation':
        setTempOrganisation('')
        if (!isMobile) setOrganisation('')
        break
      case 'month':
        setTempMonth('')
        setTempYear('')
        if (!isMobile) {
          setMonth('')
          setYear('')
        }
        break
      case 'division':
        setTempDivision('all')
        if (!isMobile) setDivision('all')
        break
      case 'venue':
        setTempVenue('all')
        if (!isMobile) setVenue('all')
        break
      case 'newestFirst':
        setTempNewestFirst(false)
        if (!isMobile) setNewestFirst(false)
        break
    }
  }

  // Get active filters for display as chips
  const getActiveFilters = useMemo(() => {
    const filters: { key: string; label: string }[] = []

    if (tempFilterType !== 'all') {
      const typeLabel = tempFilterType === 'duo' ? 'Duo / Buddy' : tempFilterType.charAt(0).toUpperCase() + tempFilterType.slice(1)
      filters.push({ key: 'filterType', label: typeLabel })
    }
    if (tempOnlyUpcomingEvents) {
      filters.push({ key: 'onlyUpcomingEvents', label: 'Upcoming only' })
    }
    if (tempLocationSearch.trim() !== '' && tempDistanceKm.trim() !== '') {
      filters.push({ key: 'location', label: `${tempLocationSearch} (${tempDistanceKm} km)` })
    }
    if (tempHyroxOnly) {
      filters.push({ key: 'hyroxOnly', label: 'HYROX only' })
    }
    if (tempOrganisation !== '') {
      filters.push({ key: 'organisation', label: tempOrganisation })
    }
    if (tempMonth !== '' || tempYear !== '') {
      const monthLabel = tempMonth !== '' ? monthOptions.find(m => m.value === tempMonth)?.label : ''
      const yearLabel = tempYear !== '' ? tempYear : ''
      filters.push({ key: 'month', label: `${monthLabel}${monthLabel && yearLabel ? ' ' : ''}${yearLabel}`.trim() })
    }
    if (tempDivision !== 'all') {
      const divLabel = tempDivision === 'open' ? 'Open / Regular' : tempDivision === 'pro' ? 'Pro / Heavy' : 'Other'
      filters.push({ key: 'division', label: divLabel })
    }
    if (tempVenue !== 'all') {
      const venueLabel = tempVenue === 'indoor' ? 'Indoor' : tempVenue === 'outdoor' ? 'Outdoor' : 'Indoor & Outdoor'
      filters.push({ key: 'venue', label: venueLabel })
    }
    if (tempNewestFirst) {
      filters.push({ key: 'newestFirst', label: 'Newest to oldest' })
    }

    return filters
  }, [tempFilterType, tempOnlyUpcomingEvents, tempLocationSearch, tempDistanceKm, tempHyroxOnly, tempOrganisation, tempMonth, tempYear, tempDivision, tempVenue, tempNewestFirst])

  // Calculate number of active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filterType !== 'all') count++
    if (onlyUpcomingEvents) count++ // Count when showing only upcoming events (when checked)
    // Location and distance count as one filter only when both are filled
    if (locationSearch !== '' && distanceKm !== '') count++
    if (hyroxOnly) count++
    if (organisation !== '') count++
    // Month and year count as one filter when either or both are filled
    if (month !== '' || year !== '') count++
    if (division !== 'all') count++
    if (venue !== 'all') count++
    if (newestFirst) count++
    return count
  }, [filterType, onlyUpcomingEvents, locationSearch, distanceKm, hyroxOnly, organisation, month, year, division, venue, newestFirst])

  // Calculate preview count based on temporary filters (for "Show X Events" button)
  const tempFilteredEventsCount = useMemo(() => {
    let filtered = [...events]

    // Filter by upcoming events only (when onlyUpcomingEvents is true)
    if (tempOnlyUpcomingEvents) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(event => new Date(event.startdate) >= today)
    }

    // Filter by race type (using typerace array)
    if (tempFilterType !== 'all') {
      filtered = filtered.filter(event => {
        if (event.typerace && event.typerace.length > 0) {
          // Check if any raceType matches the selected filter
          return event.typerace.some((raceType: string) => {
            const normalizedRaceType = raceType.toLowerCase().replace(/\s+/g, '-').replace('/', '-')
            const normalizedFilter = tempFilterType.toLowerCase().replace(/\s+/g, '-')
            return normalizedRaceType.includes(normalizedFilter) ||
                   (tempFilterType === 'duo' && raceType.toLowerCase().includes('buddy'))
          })
        }
        return false
      })
    }

    // Filter by location and distance - use searchCoordinates if available
    if (tempLocationSearch.trim() !== '' && tempDistanceKm.trim() !== '' && searchCoordinates) {
      const maxDistance = parseFloat(tempDistanceKm)
      if (!isNaN(maxDistance)) {
        filtered = filtered.filter(event => {
          const distance = calculateDistance(
            searchCoordinates.lat,
            searchCoordinates.lng,
            event.coordinates.lat,
            event.coordinates.lng
          )
          return distance <= maxDistance
        })
      }
    }

    // Filter by Hyrox only
    if (tempHyroxOnly) {
      filtered = filtered.filter(event =>
        event.hyroxworkout === 'Yes'
      )
    }

    // Filter by organization
    if (tempOrganisation !== '') {
      filtered = filtered.filter(event =>
        event.organizationgym === tempOrganisation
      )
    }

    // Filter by month and/or year - checks if event spans the selected month
    if (tempMonth !== '' || tempYear !== '') {
      filtered = filtered.filter(event => {
        const startDate = new Date(event.startdate)
        const endDate = event.enddate ? new Date(event.enddate) : startDate

        const startMonth = String(startDate.getMonth() + 1).padStart(2, '0')
        const startYear = String(startDate.getFullYear())
        const endMonth = String(endDate.getMonth() + 1).padStart(2, '0')
        const endYear = String(endDate.getFullYear())

        if (tempMonth !== '' && tempYear !== '') {
          // Check if the event spans the selected month/year
          const selectedDate = new Date(parseInt(tempYear), parseInt(tempMonth) - 1, 1)
          const selectedEndDate = new Date(parseInt(tempYear), parseInt(tempMonth), 0) // Last day of month
          return startDate <= selectedEndDate && endDate >= selectedDate
        } else if (tempMonth !== '') {
          // Check if event spans the selected month (any year)
          return (startMonth === tempMonth || endMonth === tempMonth ||
                  (parseInt(startMonth) < parseInt(tempMonth) && parseInt(endMonth) > parseInt(tempMonth)))
        } else {
          // Check if event is in the selected year
          return startYear === tempYear || endYear === tempYear
        }
      })
    }

    // Filter by division (using divisions array)
    if (tempDivision !== 'all') {
      filtered = filtered.filter(event => {
        if (event.divisions && event.divisions.length > 0) {
          // Check if any division matches the selected filter
          return event.divisions.some(division => {
            const normalizedDivision = division.toLowerCase().replace(/\s+/g, '-').replace('/', '-')
            const normalizedFilter = tempDivision.toLowerCase().replace(/\s+/g, '-')
            return normalizedDivision.includes(normalizedFilter) ||
                   (tempDivision === 'open' && (division.toLowerCase().includes('regular') || division.toLowerCase().includes('normal') || division.toLowerCase().includes('open'))) ||
                   (tempDivision === 'pro' && (division.toLowerCase().includes('heavy') || division.toLowerCase().includes('pro')))
          })
        }
        return false
      })
    }

    // Filter by venue (Indoor/Outdoor)
    if (tempVenue !== 'all') {
      filtered = filtered.filter(event => {
        if (!event.indooroutdoor) return false
        const eventVenue = event.indooroutdoor.toLowerCase()

        if (tempVenue === 'indoor') {
          return eventVenue === 'indoor'
        } else if (tempVenue === 'outdoor') {
          return eventVenue === 'outdoor'
        } else if (tempVenue === 'indoor-outdoor') {
          return eventVenue.includes('indoor') && eventVenue.includes('outdoor')
        }
        return false
      })
    }

    return filtered.length
  }, [tempFilterType, tempOnlyUpcomingEvents, tempLocationSearch, tempDistanceKm, searchCoordinates, tempHyroxOnly, tempOrganisation, tempMonth, tempYear, tempDivision, tempVenue, events])

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...events]

    // Filter by upcoming events only (when onlyUpcomingEvents is true)
    if (onlyUpcomingEvents) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(event => new Date(event.startdate) >= today)
    }

    // Filter by race type (using typerace array)
    if (filterType !== 'all') {
      filtered = filtered.filter(event => {
        if (event.typerace && event.typerace.length > 0) {
          // Check if any raceType matches the selected filter
          return event.typerace.some((raceType: string) => {
            const normalizedRaceType = raceType.toLowerCase().replace(/\s+/g, '-').replace('/', '-')
            const normalizedFilter = filterType.toLowerCase().replace(/\s+/g, '-')
            return normalizedRaceType.includes(normalizedFilter) ||
                   (filterType === 'duo' && raceType.toLowerCase().includes('buddy'))
          })
        }
        return false
      })
    }

    // Filter by location and distance - ONLY if BOTH are provided and geocoding succeeded
    if (locationSearch.trim() !== '' && distanceKm.trim() !== '' && searchCoordinates) {
      const maxDistance = parseFloat(distanceKm)
      if (!isNaN(maxDistance)) {
        filtered = filtered.filter(event => {
          const distance = calculateDistance(
            searchCoordinates.lat,
            searchCoordinates.lng,
            event.coordinates.lat,
            event.coordinates.lng
          )
          return distance <= maxDistance
        })
      }
    }

    // Filter by Hyrox only
    if (hyroxOnly) {
      filtered = filtered.filter(event =>
        event.hyroxworkout === 'Yes'
      )
    }

    // Filter by organization
    if (organisation !== '') {
      filtered = filtered.filter(event =>
        event.organizationgym === organisation
      )
    }

    // Filter by month and/or year - checks if event spans the selected month
    if (month !== '' || year !== '') {
      filtered = filtered.filter(event => {
        const startDate = new Date(event.startdate)
        const endDate = event.enddate ? new Date(event.enddate) : startDate

        const startMonth = String(startDate.getMonth() + 1).padStart(2, '0')
        const startYear = String(startDate.getFullYear())
        const endMonth = String(endDate.getMonth() + 1).padStart(2, '0')
        const endYear = String(endDate.getFullYear())

        if (month !== '' && year !== '') {
          // Check if the event spans the selected month/year
          // Event matches if it starts in or before the selected month and ends in or after the selected month
          const selectedDate = new Date(parseInt(year), parseInt(month) - 1, 1)
          const selectedEndDate = new Date(parseInt(year), parseInt(month), 0) // Last day of month
          return startDate <= selectedEndDate && endDate >= selectedDate
        } else if (month !== '') {
          // Check if event spans the selected month (any year)
          return (startMonth === month || endMonth === month ||
                  (parseInt(startMonth) < parseInt(month) && parseInt(endMonth) > parseInt(month)))
        } else {
          // Check if event is in the selected year
          return startYear === year || endYear === year
        }
      })
    }

    // Filter by division (using divisions array)
    if (division !== 'all') {
      filtered = filtered.filter(event => {
        if (event.divisions && event.divisions.length > 0) {
          // Check if any division matches the selected filter
          return event.divisions.some(div => {
            const normalizedDivision = div.toLowerCase().replace(/\s+/g, '-').replace('/', '-')
            const normalizedFilter = division.toLowerCase().replace(/\s+/g, '-')
            return normalizedDivision.includes(normalizedFilter) ||
                   (division === 'open' && (div.toLowerCase().includes('regular') || div.toLowerCase().includes('normal') || div.toLowerCase().includes('open'))) ||
                   (division === 'pro' && (div.toLowerCase().includes('heavy') || div.toLowerCase().includes('pro')))
          })
        }
        return false
      })
    }

    // Filter by venue (Indoor/Outdoor)
    if (venue !== 'all') {
      filtered = filtered.filter(event => {
        if (!event.indooroutdoor) return false
        const eventVenue = event.indooroutdoor.toLowerCase()

        if (venue === 'indoor') {
          return eventVenue === 'indoor'
        } else if (venue === 'outdoor') {
          return eventVenue === 'outdoor'
        } else if (venue === 'indoor-outdoor') {
          return eventVenue.includes('indoor') && eventVenue.includes('outdoor')
        }
        return false
      })
    }

    // Sort by date (newest first if newestFirst is true, otherwise oldest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.startdate).getTime()
      const dateB = new Date(b.startdate).getTime()
      return newestFirst ? dateB - dateA : dateA - dateB
    })

    return filtered
  }, [events, filterType, onlyUpcomingEvents, locationSearch, distanceKm, searchCoordinates, hyroxOnly, organisation, month, year, division, venue, newestFirst])

  const getCountryFlag = (countryCode: string) => {
    const code = countryCode.toUpperCase()
    // Handle full country names
    if (code === 'THE NETHERLANDS' || code === 'NETHERLANDS') return '🇳🇱'
    if (code === 'UNITED KINGDOM' || code === 'UK') return '🇬🇧'
    if (code === 'GERMANY') return '🇩🇪'

    // Handle ISO codes
    const flags: Record<string, string> = {
      'NL': '🇳🇱',
      'GB': '🇬🇧',
      'DE': '🇩🇪',
      'BE': '🇧🇪',
      'FR': '🇫🇷',
      'ES': '🇪🇸',
      'IT': '🇮🇹',
      'US': '🇺🇸',
      'CA': '🇨🇦',
      'AU': '🇦🇺'
    }
    return flags[code] || '🌍'
  }

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
                className="w-full bg-gray-900 border border-white/20 rounded px-3 py-2.5 text-base md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
              />
            </div>
            <div className="w-24">
              <input
                type="text"
                value={tempDistanceKm}
                onChange={(e) => setTempDistanceKm(e.currentTarget.value)}
                placeholder="km"
                className="w-full bg-gray-900 border border-white/20 rounded px-3 py-2.5 text-base md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
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
                    className="w-full bg-gray-900 border border-white/20 rounded px-3 py-2.5 text-base md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
                  />
                </div>
                <div className="w-24">
                  <input
                    type="text"
                    value={tempDistanceKm}
                    onChange={(e) => setTempDistanceKm(e.currentTarget.value)}
                    placeholder="km"
                    className="w-full bg-gray-900 border border-white/20 rounded px-3 py-2.5 text-base md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
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
              {/* Active Filter Chips */}
              {getActiveFilters.length > 0 && (
                <div className="pb-1">
                  <div className="flex flex-wrap gap-2">
                    {getActiveFilters.map(filter => (
                      <button
                        key={filter.key}
                        onClick={() => removeFilter(filter.key)}
                        className="inline-flex items-center gap-1.5 bg-[#D94800] text-white text-xs px-2.5 py-1 rounded-full hover:bg-[#E85D00] transition-colors duration-200"
                      >
                        <span>{filter.label}</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reset All Filters */}
              <button
                onClick={resetFilters}
                className="block w-full text-left text-xs font-medium uppercase tracking-wide text-[#D94800] hover:text-[#E85D00] transition-colors duration-200 pb-2 border-b border-white/10"
              >
                Reset All Filters
              </button>

              {/* Show toggles */}
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
                  Show
                </label>
                <div className="space-y-2 flex flex-col">
                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={tempNewestFirst}
                      onChange={(e) => setTempNewestFirst(e.currentTarget.checked)}
                      className="w-4 h-4 cursor-pointer accent-[#D94800]"
                    />
                    <span className="text-sm text-white">Newest to oldest event</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={tempOnlyUpcomingEvents}
                      onChange={(e) => setTempOnlyUpcomingEvents(e.currentTarget.checked)}
                      className="w-4 h-4 cursor-pointer accent-[#D94800]"
                    />
                    <span className="text-sm text-white">Only upcoming events</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={tempHyroxOnly}
                      onChange={(e) => setTempHyroxOnly(e.currentTarget.checked)}
                      className="w-4 h-4 cursor-pointer accent-[#D94800]"
                    />
                    <span className="text-sm text-white">Only HYROX workouts</span>
                  </label>
                </div>
              </div>

              {/* Organisation / Gym */}
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
                  Organisation / Gym
                </label>
                <select
                  value={tempOrganisation}
                  onChange={(e) => setTempOrganisation(e.currentTarget.value)}
                  className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
                >
                  <option value="">All</option>
                  {uniqueOrganizations.map(org => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
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
                  <option value="duo">Duo / Buddy</option>
                  <option value="relay">Relay</option>
                  <option value="team">Team</option>
                  <option value="other">Other</option>
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
                  <option value="open">Open / Regular</option>
                  <option value="pro">Pro / Heavy</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Venue Type */}
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
                  Venue Type
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

              {/* Close button */}
              <button
                onClick={() => setMobileFiltersOpen(false)}
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

          {/* Active Filter Chips - Mobile */}
          {getActiveFilters.length > 0 && (
            <div className="pb-1">
              <div className="flex flex-wrap gap-2">
                {getActiveFilters.map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => removeFilter(filter.key)}
                    className="inline-flex items-center gap-1.5 bg-[#D94800] text-white text-xs px-2.5 py-1 rounded-full hover:bg-[#E85D00] transition-colors duration-200"
                  >
                    <span>{filter.label}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reset All Filters button */}
          <button
            onClick={resetFilters}
            className="block w-full text-left text-xs font-medium uppercase tracking-wide text-[#D94800] hover:text-[#E85D00] transition-colors duration-200 pb-3 border-b border-white/10 mb-3"
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
                className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-base md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
              />
            </div>
            <div className="w-16">
              <input
                type="text"
                value={tempDistanceKm}
                onChange={(e) => setTempDistanceKm(e.currentTarget.value)}
                placeholder="km"
                className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-base md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D94800]"
              />
            </div>
          </div>

          {/* Show toggles */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
              Show
            </label>
            <div className="space-y-2 flex flex-col">
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={tempNewestFirst}
                  onChange={(e) => setTempNewestFirst(e.currentTarget.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#D94800]"
                />
                <span className="text-sm text-white">Newest to oldest event</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={tempOnlyUpcomingEvents}
                  onChange={(e) => setTempOnlyUpcomingEvents(e.currentTarget.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#D94800]"
                />
                <span className="text-sm text-white">Only upcoming events</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={tempHyroxOnly}
                  onChange={(e) => setTempHyroxOnly(e.currentTarget.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#D94800]"
                />
                <span className="text-sm text-white">Only HYROX workouts</span>
              </label>
            </div>
          </div>

          {/* Organisation / Gym */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
              Organisation / Gym
            </label>
            <select
              value={tempOrganisation}
              onChange={(e) => setTempOrganisation(e.currentTarget.value)}
              className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
            >
              <option value="">All</option>
              {uniqueOrganizations.map(org => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
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
              <option value="duo">Duo / Buddy</option>
              <option value="relay">Relay</option>
              <option value="team">Team</option>
              <option value="other">Other</option>
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
              <option value="open">Open / Regular</option>
              <option value="pro">Pro / Heavy</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Venue Type */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
              Venue Type
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
                    <span className="hidden sm:inline">Race not found? </span><button onClick={() => navigate('submit-a-race')} className="text-[#D94800] hover:text-[#E85D00] underline transition-colors duration-200 cursor-pointer">Submit a race</button>
                  </p>
                </div>

                <div className="relative z-10 mb-6 md:mb-12">
                  <div className="h-[calc(100vh-280px)] md:h-[calc(100vh-200px)]">
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
                    <span className="hidden sm:inline">Race not found? </span><button onClick={() => navigate('submit-a-race')} className="text-[#D94800] hover:text-[#E85D00] underline transition-colors duration-200 cursor-pointer">Submit a race</button>
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

              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${event.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90"></div>
              </div>

              {/* Country Flag - Top Right */}
              <div className="absolute top-4 right-4 z-10">
                <span className="text-2xl md:text-3xl border-2 border-white/30 rounded px-2 py-1 bg-black/40 backdrop-blur-sm">
                  {getCountryFlag(event.country)}
                </span>
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col p-6">
                {/* Event name - fixed height for 2 lines */}
                <div>
                  <h3 className="text-[1.75rem] md:text-2xl font-bold text-white uppercase tracking-wide line-clamp-2 h-[4.75rem] md:h-[4.5rem] leading-tight flex items-start">
                    <span>{event.eventname}</span>
                  </h3>
                </div>

                {/* Event details - always starts at same position */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1 text-white mb-3">
                    <p className="flex items-center gap-2 text-base md:text-sm">
                      <span>📅</span>
                      <span>{event.enddate ? formatDateRange(event.startdate, event.enddate) : formatDate(event.startdate)}</span>
                    </p>
                    <p className="flex items-center gap-2 text-base md:text-sm">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </p>
                    <p className="flex items-center gap-2 text-base md:text-sm">
                      <span>🏃‍♂️</span>
                      <span className="capitalize">{event.typerace.join(', ')}</span>
                    </p>
                    {event.organizationgym && (
                      <p className="flex items-center gap-2 text-base md:text-sm">
                        <span>🏢</span>
                        <span>{event.organizationgym}</span>
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
