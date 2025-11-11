import { InstagramIcon, MailIcon } from './Icons'
import { navigate, type Route } from '../router'

interface HeaderProps {
  currentRoute: Route
}

export function Header({ currentRoute }: HeaderProps) {
  const handleNavClick = (e: MouseEvent, route: Route) => {
    e.preventDefault()
    navigate(route)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - HYBRID METHOD logo */}
          <button
            onClick={(e) => handleNavClick(e, 'home')}
            className="text-white font-semibold text-xl tracking-[0.25em] hover:text-[#FF4500] transition-colors duration-200"
          >
            HYBRID METHOD
          </button>

          {/* Right side - Navigation */}
          <nav className="flex items-center gap-10">
            <button
              onClick={(e) => handleNavClick(e, 'events')}
              className={`text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${
                currentRoute === 'events' ? 'text-[#FF4500]' : 'text-white hover:text-[#FF4500]'
              }`}
            >
              EVENTS
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'blog')}
              className={`text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${
                currentRoute === 'blog' ? 'text-[#FF4500]' : 'text-white hover:text-[#FF4500]'
              }`}
            >
              BLOG
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'hybrid-method')}
              className={`text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${
                currentRoute === 'hybrid-method' ? 'text-[#FF4500]' : 'text-white hover:text-[#FF4500]'
              }`}
            >
              HYBRID METHOD
            </button>
            <a
              href="https://www.instagram.com/hybridmethod/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium uppercase tracking-wide text-white hover:text-[#FF4500] transition-colors duration-200"
              aria-label="Follow on Instagram"
            >
              INSTAGRAM
            </a>
            <a
              href="mailto:contact@hybridmethod.com"
              className="text-sm font-medium uppercase tracking-wide text-white hover:text-[#FF4500] transition-colors duration-200"
              aria-label="Send email"
            >
              EMAIL
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
