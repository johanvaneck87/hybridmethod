import { useEffect, useRef, useState } from 'preact/hooks'

const backgroundImage = 'https://images.hybridraces.fit/public_html/uploads/Mainpage.jpg'

export function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight

        // Calculate progress - starts at 100% (on screen, covering), moves to 0% (off screen left)
        // Delayed start - text appears later in the scroll
        const rawProgress = 1 - (rect.top / windowHeight)
        const progress = Math.max(0, Math.min(1, rawProgress))
        // Use steeper curve for later reveal: starts at 100, ends at 0
        setScrollProgress(100 - (Math.pow(progress, 2.5) * 100))
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // scrollProgress goes from 100 (covering) to 0 (revealed)
  // Need negative values: 0 (start) to -100 (end)
  const translateX = -100 + scrollProgress

  return (
    <div className="bg-black">
      {/* Hero Section - Fixed */}
      <div className="sticky top-0 h-screen flex items-start overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center">
          <div className="flex w-full">
            {/* Left side - Image */}
            <div className="relative" style={{ width: '75%', height: 'calc(40vh + 64px)' }}>
              <div
                className="absolute inset-0 bg-cover bg-left-top bg-no-repeat rounded-lg"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              >
                {/* Dark overlay with gradient to blend into right side */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/15 to-black rounded-lg"></div>
              </div>
            </div>

            {/* Right side - Text box */}
            <div className="flex items-center justify-end pl-12" style={{ width: '25%', height: 'calc(40vh + 64px)' }}>
              <div className="bg-[#D94800] px-12 h-full flex items-center w-full">
                <h2 className="text-black font-semibold text-4xl md:text-5xl lg:text-6xl leading-tight uppercase tracking-wide">
                  PREPARE
                  <br />
                  FOR YOUR
                  <br />
                  NEXT
                  <br />
                  HYBRID
                  <br />
                  RACE
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - Scrolls over hero with fade gradient reveal */}
      <div ref={contentRef} className="relative z-10 bg-black" style={{ minHeight: '150vh' }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-8 w-full">
            <div className="bg-black p-12">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-[#D94800] uppercase tracking-wide text-center">
                Hybrid Method
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

          {/* Fade gradient overlay that slides away - positioned to cover the entire sticky container */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 30%, transparent 100%)',
              transform: `translate3d(${translateX}%, 0px, 0px) scale3d(1, 1, 1)`,
              willChange: 'transform',
              transformStyle: 'preserve-3d'
            }}
          />
        </div>
      </div>
    </div>
  )
}
