import { useState, useMemo } from 'preact/hooks'
import backgroundImage from '../picture/pexels-victorfreitas-841130.jpg'
import eventsData from '../data/events.json'
import { EventMap } from './EventMap'
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
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  url: string
  description: string
  image: string
}

type SortField = 'date' | 'location' | 'name'
type FilterType = 'all' | 'solo' | 'duo'
type FilterDifficulty = 'all' | 'beginner' | 'intermediate' | 'advanced'

export function FindARacePage() {
  // Temporary filter states (not yet applied)
  const [tempSortBy, setTempSortBy] = useState<SortField>('date')
  const [tempFilterType, setTempFilterType] = useState<FilterType>('all')
  const [tempFilterDifficulty, setTempFilterDifficulty] = useState<FilterDifficulty>('all')
  const [tempShowUpcomingOnly, setTempShowUpcomingOnly] = useState(true)

  // Applied filter states (actually used for filtering)
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<FilterDifficulty>('all')
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true)

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  const events = eventsData as Event[]

  const applyFilters = () => {
    setSortBy(tempSortBy)
    setFilterType(tempFilterType)
    setFilterDifficulty(tempFilterDifficulty)
    setShowUpcomingOnly(tempShowUpcomingOnly)
    setMobileFiltersOpen(false)
  }

  const resetFilters = () => {
    setTempSortBy('date')
    setTempFilterType('all')
    setTempFilterDifficulty('all')
    setTempShowUpcomingOnly(true)
    // Also apply the reset immediately
    setSortBy('date')
    setFilterType('all')
    setFilterDifficulty('all')
    setShowUpcomingOnly(true)
  }

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...events]

    // Filter by upcoming events only
    if (showUpcomingOnly) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(event => new Date(event.date) >= today)
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
  }, [events, sortBy, filterType, filterDifficulty, showUpcomingOnly])

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
      <div className="relative z-10 bg-black text-white pt-24 md:pt-12 pb-12 min-h-screen">
        <div className="mx-auto max-w-7xl px-6">
        {/* Mobile Filter Toggle and View Mode - Fixed at bottom on mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-transparent px-6 flex gap-2">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex-1 bg-gray-900 border border-white/20 rounded px-4 py-3 text-white flex items-center justify-between"
          >
            <span className="font-medium uppercase tracking-wide">Filters</span>
            <span className={`transform transition-transform duration-200 ${mobileFiltersOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            className="bg-gray-900 border border-white/20 rounded px-4 py-3 text-white flex items-center gap-2"
          >
            {viewMode === 'list' ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span className="font-medium uppercase tracking-wide text-sm">MAP</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span className="font-medium uppercase tracking-wide text-sm">LIST</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Filters Fullscreen Overlay */}
        {mobileFiltersOpen && (
          <div className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-black z-40 overflow-y-auto pt-16">
            {/* Close button at top */}
            <div className="sticky top-0 bg-black z-50 px-6 py-4 border-b border-white/20">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-gray-900 border border-white/20 rounded px-4 py-3 text-white flex items-center justify-between"
              >
                <span className="font-medium uppercase tracking-wide">Filters</span>
                <span className="transform rotate-180">▼</span>
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* Reset Filters button */}
              <button
                onClick={resetFilters}
                className="text-[#D94800] font-medium uppercase tracking-wide text-xs hover:text-[#E85D00] transition-colors duration-200"
              >
                Reset Filters
              </button>
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

              {/* Filter by difficulty */}
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
                  Difficulty
                </label>
                <select
                  value={tempFilterDifficulty}
                  onChange={(e) => setTempFilterDifficulty(e.currentTarget.value as FilterDifficulty)}
                  className="w-full bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
                >
                  <option value="all">All</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Show upcoming only checkbox */}
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
                  Show
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempShowUpcomingOnly}
                    onChange={(e) => setTempShowUpcomingOnly(e.currentTarget.checked)}
                    className="w-4 h-4 cursor-pointer accent-[#D94800]"
                  />
                  <span className="text-sm text-white">Upcoming only</span>
                </label>
              </div>

              {/* Apply button to close filters */}
              <button
                onClick={applyFilters}
                className="w-full bg-[#D94800] text-black font-medium px-6 py-2 rounded uppercase tracking-wide hover:bg-[#E85D00] transition-colors duration-200"
              >
                Apply Filters
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
                <h3 className="text-base font-semibold uppercase tracking-wide text-white">Filters</h3>
                <button
                  onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white hover:text-[#D94800] transition-colors duration-200"
                >
                  {viewMode === 'list' ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span>MAP</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      <span>LIST</span>
                    </>
                  )}
                </button>
              </div>

          {/* Reset Filters button */}
          <button
            onClick={resetFilters}
            className="text-[#D94800] font-medium uppercase tracking-wide text-xs hover:text-[#E85D00] transition-colors duration-200"
          >
            Reset Filters
          </button>

          {/* Sort by */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
              Sort by
            </label>
            <select
              value={tempSortBy}
              onChange={(e) => setTempSortBy(e.currentTarget.value as SortField)}
              className="bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
            >
              <option value="date">Date</option>
              <option value="location">Location</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Filter by type */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
              Race Type
            </label>
            <select
              value={tempFilterType}
              onChange={(e) => setTempFilterType(e.currentTarget.value as FilterType)}
              className="bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
            >
              <option value="all">All</option>
              <option value="solo">Solo</option>
              <option value="duo">Duo</option>
            </select>
          </div>

          {/* Filter by difficulty */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
              Difficulty
            </label>
            <select
              value={tempFilterDifficulty}
              onChange={(e) => setTempFilterDifficulty(e.currentTarget.value as FilterDifficulty)}
              className="bg-gray-900 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#D94800]"
            >
              <option value="all">All</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Show upcoming only checkbox */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide text-gray-400">
              Show
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tempShowUpcomingOnly}
                onChange={(e) => setTempShowUpcomingOnly(e.currentTarget.checked)}
                className="w-4 h-4 cursor-pointer accent-[#D94800]"
              />
              <span className="text-sm text-white">Upcoming only</span>
            </label>
          </div>

          {/* Apply Filters button */}
          <button
            onClick={applyFilters}
            className="w-full bg-[#D94800] text-black font-medium px-6 py-2 rounded uppercase tracking-wide hover:bg-[#E85D00] transition-colors duration-200"
          >
            Apply Filters
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
                  <div className="h-[calc(100vh-240px)] md:h-[calc(100vh-200px)]">
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
                  <h3 className="text-3xl md:text-2xl font-bold text-white uppercase tracking-wide mb-3">
                    {event.name}
                  </h3>

                  <div className="space-y-2 text-white mb-3">
                    <p className="flex items-center gap-2 text-base md:text-sm">
                      <span>📅</span>
                      <span>{formatDate(event.date)}</span>
                    </p>
                    <p className="flex items-center gap-2 text-base md:text-sm">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </p>
                    <p className="flex items-center gap-2 text-base md:text-sm">
                      <span>⚡</span>
                      <span className="capitalize">{event.difficulty}</span>
                    </p>
                  </div>
                </div>

                <div className="inline-block bg-[#D94800] text-black font-semibold px-6 py-2 rounded tracking-[0.25em] text-lg md:text-base text-center">
                  hybridraces.fit
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
