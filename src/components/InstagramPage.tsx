import eventsData from '../data/events.json'
import { EventTileImage } from './EventTileImage'
import type { RaceEvent as Event } from '../types/Event'

export function InstagramPage() {
  const events = eventsData as Event[]
  const sortedEvents = [...events].reverse()

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-[#D94800] uppercase tracking-wide text-center">
          Instagram
        </h1>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedEvents.map((event) => (
            <div key={event.id} className="space-y-4">
              <p className="text-sm text-gray-400">{event.id}</p>

              {/* Instagram 4:5 */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
                <div className="absolute inset-0">
                  <EventTileImage event={event} aspect="instagram" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



