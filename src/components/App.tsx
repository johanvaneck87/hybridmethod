import { useRouter } from '../router'
import { Header } from './Header'
import { HomePage } from './HomePage'
import { HybridRacesLandingPage } from './HybridRacesLandingPage'
import { HybridRacesPage } from './HybridRacesPage'
import { EventsPage } from './EventsPage'
import { BlogPage } from './BlogPage'
import { SubmitEventPage } from './SubmitEventPage'
import { FindARacePage } from './FindARacePage'
import { EventDetailPage } from './EventDetailPage'

export function App() {
  const [currentRoute, eventId] = useRouter()

  return (
    <div className="min-h-screen">
      <Header currentRoute={currentRoute} />
      {currentRoute === 'home' && <HybridRacesPage />}
      {currentRoute === 'hybrid-races' && <HybridRacesLandingPage />}
      {currentRoute === 'events' && <EventsPage />}
      {currentRoute === 'blog' && <BlogPage />}
      {currentRoute === 'hybrid-method' && <HomePage />}
      {currentRoute === 'submit-event' && <SubmitEventPage />}
      {currentRoute === 'find-a-race' && <FindARacePage />}
      {currentRoute === 'event-detail' && eventId && <EventDetailPage eventId={eventId} />}
    </div>
  )
}
