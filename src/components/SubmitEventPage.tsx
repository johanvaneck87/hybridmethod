import { useState, useEffect } from 'preact/hooks'

// Complete list of countries with their ISO codes
const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MK', name: 'Macedonia' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KP', name: 'North Korea' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SZ', name: 'Swaziland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VA', name: 'Vatican City' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' }
]

export function SubmitEventPage() {
  // Check if user returned from FormSubmit success page
  const urlParams = new URLSearchParams(window.location.search)
  const successParam = urlParams.get('success') === 'true'

  const [isLocalGym, setIsLocalGym] = useState<boolean | null>(null)
  const [isMultipleDays, setIsMultipleDays] = useState<boolean | null>(null)
  const [selectedRaceTypes, setSelectedRaceTypes] = useState<string[]>([])
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(successParam)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [instagramUrl, setInstagramUrl] = useState('https://')
  const [websiteUrl, setWebsiteUrl] = useState('https://')
  const [ticketsUrl, setTicketsUrl] = useState('')
  const [workoutWeightsUrl, setWorkoutWeightsUrl] = useState('')
  const [priceType, setPriceType] = useState<'single' | 'range' | 'soldout' | null>(null)
  const [countrySearch, setCountrySearch] = useState('')
  const [selectedCountryCode, setSelectedCountryCode] = useState('')
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)

  // Clear success parameter from URL when component mounts
  useEffect(() => {
    if (successParam) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('#countrySearch') && !target.closest('.absolute.z-50')) {
        setIsCountryDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

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
        target.value = '' // Clear file input
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB. Please select a smaller image.')
        target.value = '' // Clear file input
        setSelectedImage(null)
        setImagePreview(null)
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

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    // Validate country selection
    if (!selectedCountryCode) {
      alert('Please select a country')
      return
    }

    setIsSubmitting(true)

    const form = e.target as HTMLFormElement

    try {
      // Create FormData object
      const formData = new FormData(form)

      // Add selected race types and divisions as individual fields for PHP
      selectedRaceTypes.forEach(type => {
        formData.append(type.toLowerCase().replace(/\s+/g, '-'), 'on')
      })

      // Add the image if selected
      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      // Submit to PHP backend
      // Note: Form submission only works in production due to CORS restrictions
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

      if (isLocalhost) {
        // For testing on localhost, just show success without actually submitting
        console.log('Form data (localhost test mode):', Object.fromEntries(formData.entries()))
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
        throw new Error('Form submission is disabled on localhost. Please test on the production site: https://hybridraces.fit/submit-a-race')
      }

      const response = await fetch('https://hybridraces.fit/form.php', {
        method: 'POST',
        body: formData
      })

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      // Try to parse JSON, but handle non-JSON responses
      let result
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
      } else {
        // If response is not JSON, treat it as text
        const text = await response.text()
        console.log('Non-JSON response:', text)
        result = { success: true } // Assume success if we got a response
      }

      if (result.success || result.success === undefined) {
        // Show success message
        setIsSubmitted(true)

        // Reset form
        form.reset()
        setIsLocalGym(null)
        setIsMultipleDays(null)
        setSelectedRaceTypes([])
        setSelectedDivisions([])
        setSelectedImage(null)
        setImagePreview(null)
        setInstagramUrl('https://')
        setWebsiteUrl('https://')
        setTicketsUrl('')
        setWorkoutWeightsUrl('')
        setPriceType(null)
        setCountrySearch('')
        setSelectedCountryCode('')
      } else {
        throw new Error(result.error || 'Submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`There was an error submitting the form: ${errorMessage}\n\nPlease try again or contact us at hybridraces@gmail.com`)
    } finally {
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
            encType="multipart/form-data"
            className="bg-gray-900 border border-white/20 rounded-lg p-6 md:p-8"
          >
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
                      style={{ colorScheme: 'dark', maxWidth: '100%' }}
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
                      style={{ colorScheme: 'dark', maxWidth: '100%' }}
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
                    style={{ colorScheme: 'dark', maxWidth: '100%' }}
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
            <div className="relative">
              <label htmlFor="country" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Country *
              </label>
              <input
                type="text"
                id="countrySearch"
                value={countrySearch}
                onInput={(e) => {
                  setCountrySearch((e.target as HTMLInputElement).value)
                  setIsCountryDropdownOpen(true)
                }}
                onFocus={() => setIsCountryDropdownOpen(true)}
                placeholder="Search for a country..."
                autoComplete="off"
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
              />
              <input
                type="hidden"
                id="country"
                name="country"
                value={selectedCountryCode}
              />
              {isCountryDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-black border border-white/20 rounded max-h-60 overflow-y-auto">
                  {COUNTRIES
                    .filter(country =>
                      country.name.toLowerCase().includes(countrySearch.toLowerCase())
                    )
                    .map(country => (
                      <div
                        key={country.code}
                        onClick={() => {
                          setSelectedCountryCode(country.code)
                          setCountrySearch(country.name)
                          setIsCountryDropdownOpen(false)
                        }}
                        className="px-4 py-2 text-white hover:bg-[#D94800] cursor-pointer"
                      >
                        {country.name}
                      </div>
                    ))}
                  {COUNTRIES.filter(country =>
                    country.name.toLowerCase().includes(countrySearch.toLowerCase())
                  ).length === 0 && (
                    <div className="px-4 py-2 text-gray-400">No countries found</div>
                  )}
                </div>
              )}
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

            {/* Ticket Price */}
            <div>
              <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Ticket Price *
              </label>
              <div className="space-y-3">
                {/* Price Type Selection */}
                <div className="space-y-2">
                  {[
                    { value: 'single' as const, label: 'Single price' },
                    { value: 'range' as const, label: 'Price range' },
                    { value: 'soldout' as const, label: 'Sold out' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priceType"
                        value={option.value}
                        checked={priceType === option.value}
                        onChange={(e) => setPriceType(e.currentTarget.value as 'single' | 'range' | 'soldout')}
                        className="w-4 h-4 cursor-pointer accent-[#D94800]"
                        required
                      />
                      <span className="text-white">{option.label}</span>
                    </label>
                  ))}
                </div>

                {/* Price Input Fields */}
                {priceType === 'single' && (
                  <div>
                    <input
                      type="number"
                      id="priceMin"
                      name="priceMin"
                      min="0"
                      className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                      placeholder="Price (€)"
                    />
                  </div>
                )}

                {priceType === 'range' && (
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
                )}

                {priceType === 'soldout' && (
                  <input
                    type="hidden"
                    name="priceMin"
                    value="Sold out"
                  />
                )}
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
                About this event (in English) *
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
                placeholder="Provide a brief description of the event in English..."
              />
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
                    onChange={(e) => setTicketsUrl(e.currentTarget.value)}
                    className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label htmlFor="workoutWeights" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                    Workout & Weights
                  </label>
                  <input
                    type="url"
                    id="workoutWeights"
                    name="workoutWeights"
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                    value={workoutWeightsUrl}
                    onChange={(e) => setWorkoutWeightsUrl(e.currentTarget.value)}
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
