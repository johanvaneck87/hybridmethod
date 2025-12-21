export function SubmitEventPage() {

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#D94800] uppercase tracking-wide text-center">
          Submit A Race
        </h1>
        <p className="text-lg mb-8 text-gray-300 text-center">
          Ken je een hybrid race event dat nog niet op onze lijst staat? Laat het ons weten!
        </p>

        <form action="https://formsubmit.co/johanvaneck87@gmail.com" method="POST" className="bg-gray-900 border border-white/20 rounded-lg p-6 md:p-8">
          {/* FormSubmit configuration */}
          <input type="hidden" name="_subject" value="New Race Submission" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />

          <div className="space-y-6">
            {/* Event Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Event Naam *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                placeholder="Bijv. Amsterdam Hybrid Challenge"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Datum *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Locatie *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                placeholder="Bijv. Amsterdam, Nederland"
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Type *
              </label>
              <select
                id="type"
                name="type"
                required
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
              >
                <option value="solo">Solo</option>
                <option value="duo">Duo</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Moeilijkheidsgraad *
              </label>
              <select
                id="difficulty"
                name="difficulty"
                required
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Website URL *
              </label>
              <input
                type="url"
                id="url"
                name="url"
                required
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                placeholder="https://example.com"
              />
            </div>

            {/* Event Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Event Foto URL (Instagram Formaat - 1:1) *
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                required
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Geef een URL naar een vierkante foto (1:1 ratio, bijv. 1080x1080px) geschikt voor Instagram posts
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Beschrijving *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                placeholder="Geef een korte beschrijving van het event..."
              />
            </div>

            {/* Contact Email */}
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Je Email *
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                required
                className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D94800]"
                placeholder="je@email.com"
              />
              <p className="text-sm text-gray-500 mt-1">
                We gebruiken je email alleen om contact met je op te nemen over dit event.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#D94800] text-black font-medium px-6 py-3 rounded uppercase tracking-wide text-sm hover:bg-[#E85D00] transition-colors duration-200"
              >
                Event Indienen
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
