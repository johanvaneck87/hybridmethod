import { useState, useEffect } from 'preact/hooks'

export type Route = 'home' | 'hybrid-races' | 'events' | 'blog' | 'hybrid-method' | 'submit-event'

let currentRoute: Route = 'home'
const listeners: Set<(route: Route) => void> = new Set()

export function navigate(route: Route) {
  currentRoute = route
  const basePath = '/hybridmethod'
  window.history.pushState({}, '', route === 'home' ? basePath : `${basePath}/${route}`)
  listeners.forEach(listener => listener(route))
}

export function useRouter(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(currentRoute)

  useEffect(() => {
    listeners.add(setRoute)
    return () => {
      listeners.delete(setRoute)
    }
  }, [])

  return [route, navigate]
}

// Initialize route from URL
const path = window.location.pathname.replace('/hybridmethod', '').replace(/^\//, '')
if (path === 'hybrid-races' || path === 'events' || path === 'blog' || path === 'hybrid-method' || path === 'submit-event') {
  currentRoute = path
}
