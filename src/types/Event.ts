export interface RaceEvent {
  id: string
  eventname: string
  localgym: string
  organizationgym: string
  startdate: string
  enddate: string
  location: string
  coordinates: {
    lat: number
    lng: number
  }
  typerace: string[]
  divisions: string[]
  ticketpricelow: string
  ticketpricehigh: string
  fitnessobstacle: string
  indooroutdoor: string
  hyroxworkout: string
  description: string
  image: string
  instagram: string
  website: string
  ticketUrl: string
  workout: string
  weights: string
  contactEmail: string
  country: string
}
