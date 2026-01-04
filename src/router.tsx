import { useState, useEffect } from 'preact/hooks'

export type Route = 'home' | 'hybrid-races' | 'events' | 'blog' | 'hybrid-method' | 'submit-a-race' | 'find-a-race' | 'event-detail' | 'instagram'

let currentRoute: Route = 'find-a-race'
let currentEventId: string | null = null
const listeners: Set<(route: Route, eventId?: string | null) => void> = new Set()

export function navigate(route: Route, eventId?: string) {
  currentRoute = route
  currentEventId = eventId || null

  let url = '/'
  if (route === 'event-detail' && eventId) {
    url = `/event/${eventId}`
  } else if (route === 'home' || route === 'find-a-race') {
    url = '/'
  } else {
    url = `/${route}`
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
      const path = window.location.pathname.replace(/^\//, '')
      let newRoute: Route = 'find-a-race'
      let newEventId: string | null = null

      if (path === 'hybrid-races' || path === 'events' || path === 'blog' || path === 'hybrid-method' || path === 'submit-a-race' || path === 'find-a-race' || path === 'instagram') {
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
const path = window.location.pathname.replace(/^\//, '')
if (path === 'hybrid-races' || path === 'events' || path === 'blog' || path === 'hybrid-method' || path === 'submit-a-race' || path === 'find-a-race' || path === 'instagram') {
  currentRoute = path as Route
} else if (path.startsWith('event/')) {
  currentRoute = 'event-detail'
  currentEventId = path.replace('event/', '')
}
