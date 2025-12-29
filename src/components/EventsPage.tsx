import { useState, useMemo } from 'preact/hooks'
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

export function EventsPage() {
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<FilterDifficulty>('all')
  const [showPastEvents, setShowPastEvents] = useState(false)
  const [showMap, setShowMap] = useState(true)

  const events = eventsData as Event[]

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...events]

    // Filter by past/upcoming events
    if (!showPastEvents) {
      // By default, show only upcoming events
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(event => new Date(event.date) >= today)
    }
    // When showPastEvents is true, show ALL events (no date filter)

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
  }, [events, sortBy, filterType, filterDifficulty, showPastEvents])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#D94800] uppercase tracking-wide text-center">
          Find A Race
        </h1>

        <p className="text-lg mb-12 text-gray-300 text-center">
          Mis je een race? <a href="/hybridmethod/submit-event" className="text-[#D94800] hover:text-[#E85D00] underline transition-colors duration-200">Meld een nieuwe race</a>
        </p>

        {/* Filters and sorting */}
        <div className="sticky top-[64px] z-30 bg-black/60 backdrop-blur-sm pt-2 pb-4 mb-8 flex flex-wrap gap-4">
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

          {/* Show past events checkbox */}
          <div>
            <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
              Time Period
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPastEvents}
                onChange={(e) => setShowPastEvents(e.currentTarget.checked)}
                className="w-5 h-5 cursor-pointer accent-[#D94800]"
              />
              <span className="text-white">Show past events</span>
            </label>
          </div>

          {/* Show Map checkbox */}
          <div>
            <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
              Show Map
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showMap}
                onChange={(e) => setShowMap(e.currentTarget.checked)}
                className="w-5 h-5 cursor-pointer accent-[#D94800]"
              />
              <span className="text-white">Show</span>
            </label>
          </div>
        </div>

        {/* Interactive Map with event markers */}
        {showMap && (
          <div className="mb-8 -mx-6 md:mx-0 px-6 md:px-0 relative z-10">
            <EventMap events={filteredAndSortedEvents} />
          </div>
        )}

        {/* Results count */}
        <p className="text-gray-400 mb-6">
          Showing {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? 's' : ''}
        </p>

        {/* Events list - Instagram square format (1:1) */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredAndSortedEvents.map((event) => (
            <div
              key={event.id}
              className="relative aspect-square bg-gray-900 border border-white/20 rounded-lg overflow-hidden hover:border-[#D94800] transition-colors duration-200 group"
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
  )
}
