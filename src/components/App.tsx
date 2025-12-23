import { useRouter } from '../router'
import { Header } from './Header'
import { HomePage } from './HomePage'
import { HybridRacesPage } from './HybridRacesPage'
import { EventsPage } from './EventsPage'
import { BlogPage } from './BlogPage'
import { HybridMethodPage } from './HybridMethodPage'
import { SubmitEventPage } from './SubmitEventPage'

export function App() {
  const [currentRoute] = useRouter()

  return (
    <div className="min-h-screen">
      <Header currentRoute={currentRoute} />
      {currentRoute === 'home' && <HomePage />}
      {currentRoute === 'hybrid-races' && <HybridRacesPage />}
      {currentRoute === 'events' && <EventsPage />}
      {currentRoute === 'blog' && <BlogPage />}
      {currentRoute === 'hybrid-method' && <HybridMethodPage />}
      {currentRoute === 'submit-event' && <SubmitEventPage />}
    </div>
  )
}
