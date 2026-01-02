import { useState } from 'preact/hooks'

export function SubmitEventPage() {
  const [isLocalGym, setIsLocalGym] = useState<boolean | null>(null)
  const [isMultipleDays, setIsMultipleDays] = useState<boolean | null>(null)
  const [selectedRaceTypes, setSelectedRaceTypes] = useState<string[]>([])
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [instagramUrl, setInstagramUrl] = useState('https://')
  const [websiteUrl, setWebsiteUrl] = useState('https://')
  const [ticketsUrl, setTicketsUrl] = useState('https://')
  const [workoutUrl, setWorkoutUrl] = useState('https://')
  const [weightsUrl, setWeightsUrl] = useState('https://')

  const toggleRaceType = (type: string) => {
    setSelectedRaceTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const toggleDivision = (division: string) => {
    setSelectedDivisions(prev =>
      prev.includes(division) ? prev.filter(d => d !== division) : [...prev, division]
    )
  }

  const handleUrlChange = (value: string, setter: (val: string) => void) => {
    if (!value.startsWith('https://')) {
      setter('https://')
    } else {
      setter(value)
    }
  }

  const handleImageSelect = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        return
      }

      setSelectedImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getCoordinates = async (location: string, country: string): Promise<{ lat: number; lng: number }> => {
    try {
      const searchQuery = country ? `${location}, ${country}` : location
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        {
          headers: {
            'User-Agent': 'HybridMethod-EventMap/1.0'
          }
        }
      )

      const results = await response.json()

      if (results && results.length > 0) {
        return {
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon)
        }
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error)
    }

    // Default to Amsterdam if geocoding fails
    return { lat: 52.3676, lng: 4.9041 }
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.target as HTMLFormElement

    try {
      // Get location and country for coordinates
      const locationInput = form.querySelector('[name="location"]') as HTMLInputElement
      const location = locationInput.value
      const countryInput = form.querySelector('[name="country"]') as HTMLInputElement
      const country = countryInput.value

      // Get coordinates from location
      const coordinates = await getCoordinates(location, country)

      // Generate ID from event name and year
      const eventName = (form.querySelector('[name="name"]') as HTMLInputElement).value
      const startDate = (form.querySelector('[name="startDate"]') as HTMLInputElement)?.value ||
                       (form.querySelector('[name="eventDate"]') as HTMLInputElement)?.value || ''
      const year = startDate ? new Date(startDate).getFullYear() : new Date().getFullYear()
      const eventId = eventName.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + '-' + year

      // Determine image URL
      const imageUrl = selectedImage
        ? 'REPLACE_WITH_IMAGE_URL_AFTER_UPLOAD'
        : 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop'

      // Create complete JSON object for events.json
      const eventData = {
        id: eventId,
        eventname: (form.querySelector('[name="name"]') as HTMLInputElement).value,
        localgym: (form.querySelector('[name="localGym"]:checked') as HTMLInputElement)?.value || '',
        organizationgym: (form.querySelector('[name="gym"]') as HTMLInputElement)?.value ||
                        (form.querySelector('[name="organization"]') as HTMLInputElement)?.value || '',
        startdate: (form.querySelector('[name="startDate"]') as HTMLInputElement)?.value ||
                  (form.querySelector('[name="eventDate"]') as HTMLInputElement)?.value || '',
        enddate: (form.querySelector('[name="endDate"]') as HTMLInputElement)?.value || '',
        location: location,
        coordinates: coordinates,
        typerace: selectedRaceTypes,
        divisions: selectedDivisions,
        ticketpricelow: (form.querySelector('[name="priceMin"]') as HTMLInputElement)?.value || '',
        ticketpricehigh: (form.querySelector('[name="priceMax"]') as HTMLInputElement)?.value || '',
        fitnessobstacle: (form.querySelector('[name="eventType"]:checked') as HTMLInputElement)?.value || '',
        indooroutdoor: (form.querySelector('[name="venue"]:checked') as HTMLInputElement)?.value || '',
        hyroxworkout: (form.querySelector('[name="hyroxWorkout"]:checked') as HTMLInputElement)?.value || '',
        description: (form.querySelector('[name="description"]') as HTMLTextAreaElement)?.value || '',
        image: imageUrl,
        instagram: (form.querySelector('[name="instagram"]') as HTMLInputElement)?.value || '',
        website: (form.querySelector('[name="website"]') as HTMLInputElement)?.value || '',
        ticketUrl: (form.querySelector('[name="tickets"]') as HTMLInputElement)?.value || '',
        workout: (form.querySelector('[name="workout"]') as HTMLInputElement)?.value || '',
        weights: (form.querySelector('[name="weights"]') as HTMLInputElement)?.value || '',
        contactEmail: (form.querySelector('[name="contactEmail"]') as HTMLInputElement)?.value || '',
        country: country
      }

      // Create formatted JSON string
      const formattedJSON = JSON.stringify(eventData, null, 2)

      // Create FormData with all form fields
      const formData = new FormData(form)

      // Add computed fields to FormData
      formData.append('coordinates_lat', coordinates.lat.toString())
      formData.append('coordinates_lng', coordinates.lng.toString())
      formData.append('raceTypes_formatted', selectedRaceTypes.join(', '))
      formData.append('divisions_formatted', selectedDivisions.join(', '))
      formData.append('COPY_PASTE_JSON_FOR_EVENTS_FILE', formattedJSON)

      // Submit to FormSubmit.co using fetch
      await fetch('https://formsubmit.co/hybridraces@gmail.com', {
        method: 'POST',
        body: formData
      })

      // Show success message
      setIsSubmitted(true)
      setIsSubmitting(false)
      setIsLocalGym(null)
      setIsMultipleDays(null)
      setSelectedRaceTypes([])
      setSelectedDivisions([])
      setSelectedImage(null)
      setImagePreview(null)
      setInstagramUrl('https://')
      setWebsiteUrl('https://')
      setTicketsUrl('https://')
      setWorkoutUrl('https://')
      setWeightsUrl('https://')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting the form. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#D94800] uppercase tracking-wide text-center">
          Submit A Race
        </h1>
        <p className="text-lg mb-8 text-gray-300 text-center">
          Know of a hybrid race event that's not on our list? Let us know!
        </p>

        {isSubmitted ? (
          <div className="bg-gray-900 border border-white/20 rounded-lg p-8 md:p-12 text-center">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-[#D94800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">Thank You!</h2>
            <p className="text-lg text-gray-300 mb-6">
              Your race submission has been received. We'll review it and add it to our list soon.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-[#D94800] text-black font-medium px-6 py-3 rounded uppercase tracking-wide text-sm hover:bg-[#E85D00] transition-colors duration-200"
            >
              Submit Another Race
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 border border-white/20 rounded-lg p-6 md:p-8"
          >
            {/* FormSubmit configuration - these will be included in FormData */}
            <input type="hidden" name="_subject" value="New Race Submission - HybridRaces.com" />
            <input type="hidden" name="_captcha" value="false" />

          <div className="space-y-6">
            {/* Event Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Event Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                placeholder="e.g. Amsterdam Hybrid Challenge"
              />
            </div>

            {/* Multiple Days */}
            <div>
              <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Multiple Days *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="multipleDays"
                    value="yes"
                    required
                    onChange={() => setIsMultipleDays(true)}
                    className="w-4 h-4 cursor-pointer accent-[#D94800]"
                  />
                  <span className="text-white">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="multipleDays"
                    value="no"
                    required
                    onChange={() => setIsMultipleDays(false)}
                    className="w-4 h-4 cursor-pointer accent-[#D94800]"
                  />
                  <span className="text-white">No</span>
                </label>
              </div>
            </div>

            {/* Start Date & End Date - Conditional */}
            {isMultipleDays !== null && (
              isMultipleDays ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      required
                      className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      required
                      className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="eventDate" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    required
                    className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                  />
                </div>
              )
            )}

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                placeholder="e.g. RAI, Amsterdam"
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                placeholder="e.g. Netherlands"
              />
            </div>

            {/* Local Gym */}
            <div>
              <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Local Gym *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="localGym"
                    value="yes"
                    required
                    onChange={() => setIsLocalGym(true)}
                    className="w-4 h-4 cursor-pointer accent-[#D94800]"
                  />
                  <span className="text-white">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="localGym"
                    value="no"
                    required
                    onChange={() => setIsLocalGym(false)}
                    className="w-4 h-4 cursor-pointer accent-[#D94800]"
                  />
                  <span className="text-white">No</span>
                </label>
              </div>
            </div>

            {/* Organization / Gym - Conditional */}
            {isLocalGym !== null && (
              <div>
                <label htmlFor="organizationGym" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                  {isLocalGym ? 'Gym *' : 'Organization *'}
                </label>
                <input
                  type="text"
                  id="organizationGym"
                  name={isLocalGym ? 'gym' : 'organization'}
                  required
                  className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                  placeholder={isLocalGym ? 'e.g. CrossFit Amsterdam' : 'e.g. HYROX'}
                />
              </div>
            )}

            {/* Race Types */}
            <div>
              <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Race Types * (select all that apply)
              </label>
              <input type="hidden" name="raceTypes" value={selectedRaceTypes.join(', ')} required={selectedRaceTypes.length === 0} />
              <div className="space-y-2">
                {['Solo', 'Duo / Buddy', 'Relay', 'Team', 'Other'].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRaceTypes.includes(type)}
                      onChange={() => toggleRaceType(type)}
                      className="w-4 h-4 cursor-pointer accent-[#D94800]"
                    />
                    <span className="text-white">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Division */}
            <div>
              <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Division * (select all that apply)
              </label>
              <input type="hidden" name="division" value={selectedDivisions.join(', ')} required={selectedDivisions.length === 0} />
              <div className="space-y-2">
                {['Open / Regular', 'Pro / Heavy', 'Other'].map(division => (
                  <label key={division} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDivisions.includes(division)}
                      onChange={() => toggleDivision(division)}
                      className="w-4 h-4 cursor-pointer accent-[#D94800]"
                    />
                    <span className="text-white">{division}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ticket Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Ticket Price Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    id="priceMin"
                    name="priceMin"
                    min="0"
                    className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                    placeholder="Min (€)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    id="priceMax"
                    name="priceMax"
                    min="0"
                    className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                    placeholder="Max (€)"
                  />
                </div>
              </div>
            </div>

            {/* Indoor / Outdoor */}
            <div>
              <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Indoor / Outdoor *
              </label>
              <div className="space-y-2">
                {['Indoor', 'Outdoor', 'Indoor & Outdoor'].map(venue => (
                  <label key={venue} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="venue"
                      value={venue}
                      required
                      className="w-4 h-4 cursor-pointer accent-[#D94800]"
                    />
                    <span className="text-white">{venue}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hyrox Workout */}
            <div>
              <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Hyrox Workout *
              </label>
              <div className="space-y-2">
                {['Yes', 'No'].map(hyrox => (
                  <label key={hyrox} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hyroxWorkout"
                      value={hyrox}
                      required
                      className="w-4 h-4 cursor-pointer accent-[#D94800]"
                    />
                    <span className="text-white">{hyrox}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fitness / Obstacle */}
            <div>
              <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Fitness / Obstacle *
              </label>
              <div className="space-y-2">
                {['Fitness', 'Obstacle'].map(eventType => (
                  <label key={eventType} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="eventType"
                      value={eventType}
                      required
                      className="w-4 h-4 cursor-pointer accent-[#D94800]"
                    />
                    <span className="text-white">{eventType}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* About this event */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                About this event *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                placeholder="Provide a brief description of the event..."
              />
              <p className="text-xs text-gray-500 mt-1">Please write in English</p>
            </div>

            {/* Event Image Upload */}
            <div>
              <label htmlFor="eventImage" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Event Image
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  id="eventImage"
                  name="eventImage"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#D94800] file:text-black file:font-medium file:cursor-pointer hover:file:bg-[#E85D00]"
                />
                <p className="text-sm text-gray-400">
                  Upload a high-quality event image (recommended: 800x800px or larger, max 5MB). If no image is provided, a default placeholder will be used.
                </p>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2 text-gray-400">Preview:</p>
                    <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden border border-white/20">
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Links Section */}
            <div className="pt-4 border-t border-white/20">
              <h3 className="text-lg font-semibold mb-4 uppercase tracking-wide text-gray-400">
                Links & Contact
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                    Instagram *
                  </label>
                  <input
                    type="url"
                    id="instagram"
                    name="instagram"
                    required
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                    value={instagramUrl}
                    onChange={(e) => handleUrlChange(e.currentTarget.value, setInstagramUrl)}
                    className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                    Website *
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    required
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                    value={websiteUrl}
                    onChange={(e) => handleUrlChange(e.currentTarget.value, setWebsiteUrl)}
                    className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label htmlFor="tickets" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                    Tickets
                  </label>
                  <input
                    type="url"
                    id="tickets"
                    name="tickets"
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                    value={ticketsUrl}
                    onChange={(e) => handleUrlChange(e.currentTarget.value, setTicketsUrl)}
                    className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label htmlFor="workout" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                    Workout
                  </label>
                  <input
                    type="url"
                    id="workout"
                    name="workout"
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                    value={workoutUrl}
                    onChange={(e) => handleUrlChange(e.currentTarget.value, setWorkoutUrl)}
                    className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label htmlFor="weights" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                    Weights
                  </label>
                  <input
                    type="url"
                    id="weights"
                    name="weights"
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                    value={weightsUrl}
                    onChange={(e) => handleUrlChange(e.currentTarget.value, setWeightsUrl)}
                    className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                    Contact / Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                    className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                    placeholder="contact@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D94800] text-black font-medium px-6 py-3 rounded uppercase tracking-wide text-sm hover:bg-[#E85D00] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Event'}
              </button>
            </div>
          </div>
        </form>
        )}
      </div>
    </div>
  )
}
