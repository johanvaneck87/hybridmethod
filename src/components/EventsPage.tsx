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
}

type SortField = 'date' | 'location' | 'name'
type FilterType = 'all' | 'solo' | 'duo'
type FilterDifficulty = 'all' | 'beginner' | 'intermediate' | 'advanced'

export function EventsPage() {
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<FilterDifficulty>('all')
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true)

  const events = eventsData as Event[]

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
  }, [events, sortBy, filterType, filterDifficulty])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-[#FF4500] uppercase tracking-wide">
          Events
        </h1>

        {/* Interactive Map with event markers */}
        <div className="mb-12">
          <EventMap events={events} />
        </div>

        {/* Filters and sorting */}
        <div className="mb-8 flex flex-wrap gap-4">
          {/* Sort by */}
          <div>
            <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.currentTarget.value as SortField)}
              className="bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#FF4500]"
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
              className="bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#FF4500]"
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
              className="bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#FF4500]"
            >
              <option value="all">All</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Show upcoming only checkbox */}
          <div>
            <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
              Show
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUpcomingOnly}
                onChange={(e) => setShowUpcomingOnly(e.currentTarget.checked)}
                className="w-5 h-5 bg-gray-900 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-[#FF4500] checked:bg-[#FF4500] cursor-pointer"
              />
              <span className="text-white">Upcoming only</span>
            </label>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-400 mb-6">
          Showing {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? 's' : ''}
        </p>

        {/* Events list */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-900 border border-white/20 rounded-lg p-6 hover:border-[#FF4500] transition-colors duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-white uppercase tracking-wide">
                  {event.name}
                </h3>
                <span className={`px-3 py-1 rounded text-xs font-medium uppercase ${
                  event.type === 'solo'
                    ? 'bg-[#FF4500] text-black'
                    : 'bg-gray-700 text-white'
                }`}>
                  {event.type}
                </span>
              </div>

              <div className="space-y-2 text-gray-300 mb-4">
                <p className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{formatDate(event.date)}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{event.location}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>⚡</span>
                  <span className="capitalize">{event.difficulty}</span>
                </p>
              </div>

              <p className="text-sm text-gray-400 mb-4">
                {event.description}
              </p>

              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#FF4500] text-black font-medium px-6 py-2 rounded uppercase tracking-wide text-sm hover:bg-[#FF6B35] transition-colors duration-200"
              >
                View Event
              </a>
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
