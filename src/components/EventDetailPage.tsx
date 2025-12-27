import eventsData from '../data/events.json'

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
}

interface EventDetailPageProps {
  eventId: string
}

export function EventDetailPage({ eventId }: EventDetailPageProps) {
  const events = eventsData as Event[]
  const event = events.find(e => e.id === eventId)

  if (!event) {
    return (
      <div className="bg-black min-h-screen pt-24 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Event not found</h1>
          <p className="text-gray-400">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

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
    <div className="bg-black min-h-screen relative">
      {/* Sticky background image and gradient */}
      <div className="sticky top-0 z-0 h-[60vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black"></div>
        </div>
      </div>

      {/* Content that scrolls over sticky background */}
      <div className="relative z-10">
        {/* Event Title Overlay - Scrolls with content */}
        <div className="-mt-[60vh] h-[60vh] min-h-[400px] flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-12 w-full">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-wide mb-4">
              {event.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-xl text-white">
              <span className="flex items-center gap-2">
                📅 {event.endDate ? formatDateRange(event.date, event.endDate) : formatDate(event.date)}
              </span>
              <span className="flex items-center gap-2">
                📍 {event.location}
              </span>
              {event.raceTypes ? (
                <span className="flex items-center gap-2">
                  🏃‍♂️ <span className="capitalize">{event.raceTypes.join(', ')}</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  ⚡ <span className="capitalize">{event.difficulty}</span>
                </span>
              )}
              {!event.raceTypes && (
                <span className="flex items-center gap-2">
                  🏃 <span className="capitalize">{event.type}</span>
                </span>
              )}
              {event.organization && (
                <span className="flex items-center gap-2">
                  🏢 {event.organization}
                </span>
              )}
            </div>
          </div>
        </div>

      {/* Event Content */}
      <div className="relative z-10 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 uppercase tracking-wide">About this event</h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            {event.description}
          </p>

          {/* Event Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-[#D94800]">Date</h3>
              <p className="text-gray-300">{event.endDate ? formatDateRange(event.date, event.endDate) : formatDate(event.date)}</p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-[#D94800]">Location</h3>
              <p className="text-gray-300">{event.location}</p>
            </div>
            {event.raceTypes ? (
              <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2 text-[#D94800]">Race Types</h3>
                <p className="text-gray-300">{event.raceTypes.join(', ')}</p>
              </div>
            ) : (
              <>
                <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2 text-[#D94800]">Event Type</h3>
                  <p className="text-gray-300 capitalize">{event.type} Race</p>
                </div>
                <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2 text-[#D94800]">Difficulty Level</h3>
                  <p className="text-gray-300 capitalize">{event.difficulty}</p>
                </div>
              </>
            )}
            {event.organization && (
              <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2 text-[#D94800]">Organization</h3>
                <p className="text-gray-300">{event.organization}</p>
              </div>
            )}
          </div>

          {/* External Link Button */}
          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#D94800] text-black font-semibold px-8 py-3 rounded tracking-[0.25em] text-lg hover:bg-[#E85D00] transition-colors duration-200"
            >
              VIEW EVENT DETAILS
            </a>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
