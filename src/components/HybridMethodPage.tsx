export function HybridMethodPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#D94800] uppercase tracking-wide text-center">
          Hybrid Method
        </h1>

        <p className="text-lg mb-12 text-gray-300 text-center">
          De plek om je voor te bereiden op je volgende doel
        </p>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-8 md:p-12">
            <h2 className="text-white text-3xl font-bold mb-8 uppercase tracking-wide text-center">
              Hybrid Method Approach
            </h2>

            <div className="text-white space-y-8">
              <p className="text-lg leading-relaxed">
                De personal training / coaching bestaat uit drie pijlers, namelijk <span className="text-[#D94800] font-semibold">persoonlijk</span>, <span className="text-[#D94800] font-semibold">doelgericht</span> en <span className="text-[#D94800] font-semibold">methodisch</span>.
              </p>

              <div className="space-y-6 pl-6 border-l-4 border-[#D94800]">
                <div>
                  <h3 className="text-[#D94800] text-xl font-semibold mb-3 uppercase tracking-wide">
                    Persoonlijk
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Trainingsschema's afgestemd op de individu, die in verschillende vormen kan trainen, namelijk individueel, in groepsverband (bijvoorbeeld Crossfit of Hyrox) of een hybride vorm. Daarnaast ook de mogelijkheid tot (duo) personal training.
                  </p>
                </div>

                <div>
                  <h3 className="text-[#D94800] text-xl font-semibold mb-3 uppercase tracking-wide">
                    Doelgericht
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Het is bedoeld voor sporters die naar een bepaald evenement, zoals Hyrox of andere hybride evenementen toe trainen. Hybrid Method ondersteunt daarbij de weg naar het doel.
                  </p>
                </div>

                <div>
                  <h3 className="text-[#D94800] text-xl font-semibold mb-3 uppercase tracking-wide">
                    Methodisch
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Er wordt gewerkt vanuit een bepaalde methodiek. Hierbij wordt rekening gehouden met de belastbaarheid van de individu, aantal keer per week trainen en juiste verdeling kracht en conditie. Ook techniek komt hier aan bod.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
