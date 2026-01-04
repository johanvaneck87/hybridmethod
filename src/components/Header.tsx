import { useState, useEffect } from 'preact/hooks'
import { navigate, type Route } from '../router'

interface HeaderProps {
  currentRoute: Route
}

export function Header({ currentRoute }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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
                currentRoute === 'find-a-race' || currentRoute === 'home' ? 'text-[#D94800]' : 'text-white hover:text-[#D94800]'
              }`}
            >
              FIND A RACE
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'submit-a-race')}
              className={`text-sm lg:text-base font-medium uppercase tracking-wide transition-colors duration-200 whitespace-nowrap ${
                currentRoute === 'submit-a-race' ? 'text-[#D94800]' : 'text-white hover:text-[#D94800]'
              }`}
            >
              SUBMIT A RACE
            </button>
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
              href="mailto:hybridraces@gmail.com"
              className="text-sm lg:text-base font-medium uppercase tracking-wide text-white hover:text-[#D94800] transition-colors duration-200 whitespace-nowrap"
              aria-label="Send email"
            >
              EMAIL
            </a>
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        <nav className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 mt-6' : 'max-h-0'}`}>
          <div className="flex flex-col gap-4 pb-4">
            <button
              onClick={(e) => handleNavClick(e, 'find-a-race')}
              className={`text-lg font-medium uppercase tracking-wide transition-colors duration-200 text-left ${
                currentRoute === 'find-a-race' || currentRoute === 'home' ? 'text-[#D94800]' : 'text-white hover:text-[#D94800]'
              }`}
            >
              FIND A RACE
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'submit-a-race')}
              className={`text-lg font-medium uppercase tracking-wide transition-colors duration-200 text-left ${
                currentRoute === 'submit-a-race' ? 'text-[#D94800]' : 'text-white hover:text-[#D94800]'
              }`}
            >
              SUBMIT A RACE
            </button>
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
              href="mailto:hybridraces@gmail.com"
              className="text-lg font-medium uppercase tracking-wide text-white hover:text-[#D94800] transition-colors duration-200"
              aria-label="Send email"
              onClick={() => setMobileMenuOpen(false)}
            >
              EMAIL
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
