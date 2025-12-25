import { useState, useEffect } from 'preact/hooks'
import { navigate, type Route } from '../router'

interface HeaderProps {
  currentRoute: Route
}

export function Header({ currentRoute }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [language, setLanguage] = useState<'nl' | 'en'>('nl')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: MouseEvent, route: Route) => {
    e.preventDefault()
    navigate(route)
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
      isScrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-black'
    }`}>
      <div className={`max-w-7xl mx-auto px-6 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}>
        <div className="flex items-center justify-between">
          {/* Left side - HYBRID RACES logo */}
          <button
            onClick={(e) => handleNavClick(e, 'home')}
            className={`font-semibold tracking-[0.25em] transition-all duration-300 text-[#D94800] whitespace-nowrap ${
              isScrolled ? 'text-2xl lg:text-3xl' : 'text-3xl lg:text-4xl'
            }`}
          >
            HYBRID RACES
          </button>

          {/* Hamburger menu button - visible on mobile only */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={(e) => handleNavClick(e, 'find-a-race')}
              className={`text-sm lg:text-base font-medium uppercase tracking-wide transition-colors duration-200 whitespace-nowrap ${
                currentRoute === 'find-a-race' ? 'text-[#D94800]' : 'text-white hover:text-[#D94800]'
              }`}
            >
              FIND A RACE
            </button>
            <div className="relative group">
              <button
                onClick={(e) => handleNavClick(e, 'submit-event')}
                className={`text-sm lg:text-base font-medium uppercase tracking-wide transition-colors duration-200 whitespace-nowrap ${
                  currentRoute === 'submit-event' || currentRoute === 'events' || currentRoute === 'hybrid-races' || currentRoute === 'hybrid-method' ? 'text-[#D94800]' : 'text-white hover:text-[#D94800]'
                }`}
              >
                SUBMIT A RACE
              </button>
              {/* Dropdown submenu */}
              <div className="absolute top-full left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                <div className="bg-gray-900 border border-white/20 rounded-lg shadow-lg py-2 px-4 min-w-[180px] flex flex-col gap-2">
                  <button
                    onClick={(e) => handleNavClick(e, 'events')}
                    className={`text-sm font-normal tracking-wide transition-colors duration-200 whitespace-nowrap text-left ${
                      currentRoute === 'events' ? 'text-[#D94800]' : 'text-white hover:text-[#D94800]'
                    }`}
                  >
                    Events
                  </button>
                  <button
                    onClick={(e) => handleNavClick(e, 'hybrid-races')}
                    className={`text-sm font-normal tracking-wide transition-colors duration-200 whitespace-nowrap text-left ${
                      currentRoute === 'hybrid-races' ? 'text-[#D94800]' : 'text-white hover:text-[#D94800]'
                    }`}
                  >
                    Hybrid Races
                  </button>
                  <button
                    onClick={(e) => handleNavClick(e, 'hybrid-method')}
                    className={`text-sm font-normal tracking-wide transition-colors duration-200 whitespace-nowrap text-left ${
                      currentRoute === 'hybrid-method' ? 'text-[#D94800]' : 'text-white hover:text-[#D94800]'
                    }`}
                  >
                    Method
                  </button>
                </div>
              </div>
            </div>
            <a
              href="https://www.instagram.com/hybridraces/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm lg:text-base font-medium uppercase tracking-wide text-white hover:text-[#D94800] transition-colors duration-200 whitespace-nowrap"
              aria-label="Follow on Instagram"
            >
              INSTAGRAM
            </a>
            <a
              href="mailto:contact@hybridmethod.com"
              className="text-sm lg:text-base font-medium uppercase tracking-wide text-white hover:text-[#D94800] transition-colors duration-200 whitespace-nowrap"
              aria-label="Send email"
            >
              EMAIL
            </a>
            <select
              value={language}
              onChange={(e) => setLanguage(e.currentTarget.value as 'nl' | 'en')}
              className="bg-transparent border border-white/20 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-[#D94800] cursor-pointer"
            >
              <option value="nl" className="bg-gray-900">NL</option>
              <option value="en" className="bg-gray-900">EN</option>
            </select>
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        <nav className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 mt-6' : 'max-h-0'}`}>
          <div className="flex flex-col gap-4 pb-4">
            <button
              onClick={(e) => handleNavClick(e, 'find-a-race')}
              className={`text-lg font-medium uppercase tracking-wide transition-colors duration-200 text-left ${
                currentRoute === 'find-a-race' ? 'text-[#D94800]' : 'text-white hover:text-[#D94800]'
              }`}
            >
              FIND A RACE
            </button>
            <div className="flex flex-col gap-1">
              <button
                onClick={(e) => handleNavClick(e, 'submit-event')}
                className={`text-lg font-medium uppercase tracking-wide transition-colors duration-200 text-left ${
                  currentRoute === 'submit-event' ? 'text-[#D94800]' : 'text-white hover:text-[#D94800]'
                }`}
              >
                SUBMIT A RACE
              </button>
              <button
                onClick={(e) => handleNavClick(e, 'events')}
                className={`text-base font-normal tracking-wide transition-colors duration-200 text-left ${
                  currentRoute === 'events' ? 'text-[#D94800]' : 'text-gray-400 hover:text-[#D94800]'
                }`}
              >
                Events
              </button>
              <button
                onClick={(e) => handleNavClick(e, 'hybrid-races')}
                className={`text-base font-normal tracking-wide transition-colors duration-200 text-left ${
                  currentRoute === 'hybrid-races' ? 'text-[#D94800]' : 'text-gray-400 hover:text-[#D94800]'
                }`}
              >
                Hybrid Races
              </button>
              <button
                onClick={(e) => handleNavClick(e, 'hybrid-method')}
                className={`text-base font-normal tracking-wide transition-colors duration-200 text-left ${
                  currentRoute === 'hybrid-method' ? 'text-[#D94800]' : 'text-gray-400 hover:text-[#D94800]'
                }`}
              >
                Method
              </button>
            </div>
            <a
              href="https://www.instagram.com/hybridraces/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium uppercase tracking-wide text-white hover:text-[#D94800] transition-colors duration-200"
              aria-label="Follow on Instagram"
              onClick={() => setMobileMenuOpen(false)}
            >
              INSTAGRAM
            </a>
            <a
              href="mailto:contact@hybridmethod.com"
              className="text-lg font-medium uppercase tracking-wide text-white hover:text-[#D94800] transition-colors duration-200"
              aria-label="Send email"
              onClick={() => setMobileMenuOpen(false)}
            >
              EMAIL
            </a>
            <div>
              <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-400">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.currentTarget.value as 'nl' | 'en')}
                className="bg-gray-900 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-[#D94800] w-full"
              >
                <option value="nl">Nederlands</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
