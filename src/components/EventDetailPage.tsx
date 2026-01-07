import eventsData from '../data/events.json'
import type { RaceEvent as Event} from '../types/Event'
import { CountryFlag } from './CountryFlag'

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
<div className="mb-3 md:mb-4">
  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-wide leading-tight">
    <span className="inline-flex items-end gap-3">
      <span>{event.eventname}</span>

      <span className="flex items-end">
        <CountryFlag country={event.country} size="large" />
      </span>
    </span>
  </h1>
</div>

            <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-4 text-base md:text-xl text-white">
              <span className="flex items-center gap-1.5 md:gap-2">
                <span className="flex-shrink-0">📅</span>
                <span>{event.enddate ? formatDateRange(event.startdate, event.enddate) : formatDate(event.startdate)}</span>
              </span>
              <span className="flex items-center gap-1.5 md:gap-2">
                <span className="flex-shrink-0">📍</span>
                <span>{event.location}</span>
              </span>
              <span className="flex items-center gap-1.5 md:gap-2">
                <span className="flex-shrink-0">🏃‍♂️</span>
                <span className="capitalize">{event.typerace.join(', ')}</span>
              </span>
              {event.organizationgym && (
                <span className="flex items-center gap-1.5 md:gap-2">
                  <span className="flex-shrink-0">🏢</span>
                  <span>{event.organizationgym}</span>
                </span>
              )}
            </div>
          </div>
        </div>

      {/* Event Content */}
      <div className="relative z-10 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold mb-3 md:mb-6 uppercase tracking-wide">About this event</h2>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-6 md:mb-12">
              {event.description}
            </p>

            {/* Event Information Sections */}
            <div className="space-y-8">
              {/* Event Details Section */}
              <div>
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-wide text-[#D94800]">Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Date</p>
                    <p className="text-base text-white font-medium">
                      {event.enddate ? formatDateRange(event.startdate, event.enddate) : formatDate(event.startdate)}
                    </p>
                  </div>
                  <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Location</p>
                    <p className="text-base text-white font-medium">{event.location}</p>
                  </div>
                  {event.organizationgym && (
                    <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Organization / Gym</p>
                      <p className="text-base text-white font-medium">{event.organizationgym}</p>
                    </div>
                  )}
                  <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Race Type(s)</p>
                    <p className="text-base text-white font-medium">{event.typerace.join(', ')}</p>
                  </div>
                  {event.divisions && event.divisions.length > 0 && (
                    <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Division(s)</p>
                      <p className="text-base text-white font-medium">{event.divisions.join(', ')}</p>
                    </div>
                  )}
                  <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Ticket Price (range)</p>
                    <p className="text-base text-white font-medium">
                      {(() => {
                        // Check if value is a number (supports both comma and dot decimals)
                        const isLowNumber = !isNaN(Number(event.ticketpricelow?.toString().replace(',', '.')))
                        const isHighNumber = !isNaN(Number(event.ticketpricehigh?.toString().replace(',', '.')))

                        if (event.ticketpricehigh && isLowNumber && isHighNumber) {
                          return `€${event.ticketpricelow} - €${event.ticketpricehigh}`
                        } else if (event.ticketpricelow && isLowNumber) {
                          return `€${event.ticketpricelow}`
                        } else {
                          return event.ticketpricelow || '-'
                        }
                      })()}
                    </p>
                  </div>
                  <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Venue Type</p>
                    <p className="text-base text-white font-medium">{event.indooroutdoor}</p>
                  </div>
                  <div className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">HYROX Workout</p>
                    <p className="text-base text-white font-medium">{event.hyroxworkout}</p>
                  </div>
                </div>
              </div>

            {/* Contact & Links Section */}
            <div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-wide text-[#D94800]">Socials & Contact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {event.instagram && (
                  <a
                    href={event.instagram.startsWith('http') ? event.instagram : `https://instagram.com/${event.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-3 hover:border-[#D94800] transition-colors duration-200 group"
                  >
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Instagram</p>
                    <p className="text-sm text-white font-medium group-hover:text-[#D94800] transition-colors flex items-center gap-2">
                      {event.instagram}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}></line>
                      </svg>
                    </p>
                  </a>
                )}
                {event.website && (
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-3 hover:border-[#D94800] transition-colors duration-200 group"
                  >
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Official Website</p>
                    <p className="text-sm text-white font-medium group-hover:text-[#D94800] transition-colors flex items-center gap-2">
                      Visit Website
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </p>
                  </a>
                )}
                {event.ticketUrl && (
                  <a
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-3 hover:border-[#D94800] transition-colors duration-200 group"
                  >
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Buy Tickets</p>
                    <p className="text-sm text-white font-medium group-hover:text-[#D94800] transition-colors flex items-center gap-2">
                      Get Your Tickets
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </p>
                    </a>
                  )}
                {event.workoutWeights && (
                  <a
                    href={event.workoutWeights}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-3 hover:border-[#D94800] transition-colors duration-200 group"
                  >
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Workout & Weights Guide</p>
                    <p className="text-sm text-white font-medium group-hover:text-[#D94800] transition-colors flex items-center gap-2">
                      View Workout & Weights
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="2" y="10" width="3" height="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        <rect x="19" y="10" width="3" height="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        <line x1="5" y1="12" x2="10" y2="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        <line x1="14" y1="12" x2="19" y2="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        <rect x="10" y="10" width="4" height="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                      </svg>
                    </p>
                  </a>
                )}
                {event.contactEmail && (
                  <a
                    href={`mailto:${event.contactEmail}`}
                    className="bg-gray-900/60 backdrop-blur-sm border border-white/20 rounded-lg p-3 hover:border-[#D94800] transition-colors duration-200 group"
                  >
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Contact</p>
                    <p className="text-sm text-white font-medium group-hover:text-[#D94800] transition-colors flex items-center gap-2">
                      {event.contactEmail}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </p>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>
    </div>
  )
}
