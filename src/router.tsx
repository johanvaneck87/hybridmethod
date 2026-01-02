import { useState, useEffect } from 'preact/hooks'

export type Route = 'home' | 'hybrid-races' | 'events' | 'blog' | 'hybrid-method' | 'submit-event' | 'find-a-race' | 'event-detail' | 'instagram'

let currentRoute: Route = 'find-a-race'
let currentEventId: string | null = null
const listeners: Set<(route: Route, eventId?: string | null) => void> = new Set()

export function navigate(route: Route, eventId?: string) {
  currentRoute = route
  currentEventId = eventId || null
  const basePath = '/hybridmethod'

  let url = basePath
  if (route === 'event-detail' && eventId) {
    url = `${basePath}/event/${eventId}`
  } else if (route === 'home' || route === 'find-a-race') {
    url = basePath
  } else {
    url = `${basePath}/${route}`
  }

  window.history.pushState({}, '', url)
  window.scrollTo(0, 0)
  listeners.forEach(listener => listener(route, currentEventId))
}

export function useRouter(): [Route, string | null, (route: Route, eventId?: string) => void] {
  const [route, setRoute] = useState<Route>(currentRoute)
  const [eventId, setEventId] = useState<string | null>(currentEventId)

  useEffect(() => {
    const listener = (newRoute: Route, newEventId?: string | null) => {
      setRoute(newRoute)
      setEventId(newEventId || null)
    }
    listeners.add(listener)

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname.replace('/hybridmethod', '').replace(/^\//, '')
      let newRoute: Route = 'find-a-race'
      let newEventId: string | null = null

      if (path === 'hybrid-races' || path === 'events' || path === 'blog' || path === 'hybrid-method' || path === 'submit-event' || path === 'find-a-race' || path === 'instagram') {
        newRoute = path as Route
      } else if (path.startsWith('event/')) {
        newRoute = 'event-detail'
        newEventId = path.replace('event/', '')
      } else if (path === '' || path === 'home') {
        newRoute = 'find-a-race'
      }

      currentRoute = newRoute
      currentEventId = newEventId
      listeners.forEach(listener => listener(newRoute, newEventId))
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      listeners.delete(listener)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  return [route, eventId, navigate]
}

// Initialize route from URL
const path = window.location.pathname.replace('/hybridmethod', '').replace(/^\//, '')
if (path === 'hybrid-races' || path === 'events' || path === 'blog' || path === 'hybrid-method' || path === 'submit-event' || path === 'find-a-race' || path === 'instagram') {
  currentRoute = path as Route
} else if (path.startsWith('event/')) {
  currentRoute = 'event-detail'
  currentEventId = path.replace('event/', '')
}
