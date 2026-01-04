import { useRouter } from '../router'
import { Header } from './Header'
import { HomePage } from './HomePage'
import { BlogPage } from './BlogPage'
import { SubmitEventPage } from './SubmitEventPage'
import { FindARacePage } from './FindARacePage'
import { EventDetailPage } from './EventDetailPage'
import { InstagramPage } from './InstagramPage'

export function App() {
  const [currentRoute, eventId] = useRouter()

  return (
    <div className="min-h-screen">
      <Header currentRoute={currentRoute} />
      {currentRoute === 'home' && <FindARacePage />}
      {currentRoute === 'hybrid-races' && <FindARacePage />}
      {currentRoute === 'events' && <FindARacePage />}
      {currentRoute === 'blog' && <BlogPage />}
      {currentRoute === 'hybrid-method' && <HomePage />}
      {currentRoute === 'submit-a-race' && <SubmitEventPage />}
      {currentRoute === 'find-a-race' && <FindARacePage />}
      {currentRoute === 'event-detail' && eventId && <EventDetailPage eventId={eventId} />}
      {currentRoute === 'instagram' && <InstagramPage />}
    </div>
  )
}
