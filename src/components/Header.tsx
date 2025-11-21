import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import '../styles/Header.css'

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileActiveMenu, setMobileActiveMenu] = useState<string | null>(null)
  const { theme, toggleTheme } = useTheme()

  const handleMouseEnter = (menu: string) => {
    setActiveDropdown(menu)
  }

  const handleMouseLeave = () => {
    setActiveDropdown(null)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    setMobileActiveMenu(null)
  }

  const toggleMobileDropdown = (menu: string) => {
    setMobileActiveMenu(mobileActiveMenu === menu ? null : menu)
  }

  return (
    <header className="main-header">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <h1>ALU<span>SOLUTIONS</span></h1>
            <p className="tagline">Wij Brengen Buitenleven Binnen</p>
          </Link>
        </div>

        <nav className="main-nav">
          {/* Onze diensten dropdown */}
          <div
            className="nav-item has-dropdown"
            onMouseEnter={() => handleMouseEnter('diensten')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">
              Onze diensten <span className="arrow">▾</span>
            </span>
            {activeDropdown === 'diensten' && (
              <div className="dropdown-menu">
                <div className="dropdown-content">
                  <div className="dropdown-section">
                    <h4>Veranda's</h4>
                    <Link to="/producten/polycarbonaat">Polycarbonaat Veranda</Link>
                    <Link to="/producten/glazen">Glazen Veranda</Link>
                    <Link to="/producten/lamellen">Lamellen Veranda</Link>
                    <Link to="/producten/vouwdak">Vouwdak Veranda</Link>
                  </div>
                  <div className="dropdown-section">
                    <h4>Overige</h4>
                    <Link to="/producten/schuifwand">Glazen Schuifwand</Link>
                    <Link to="/producten/cube">Cube Veranda</Link>
                    <Link to="/producten/tuinkamer">Tuinkamer</Link>
                    <Link to="/producten/carport">Carport</Link>
                  </div>
                  <div className="dropdown-section">
                    <h4>Services</h4>
                    <Link to="/contact">Platenwissel</Link>
                    <Link to="/contact">Onderhoud</Link>
                    <Link to="/contact">Reparatie</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Over ons */}
          <Link to="/over-ons" className="nav-link">Over ons</Link>

          {/* Inspiratie dropdown */}
          <div
            className="nav-item has-dropdown"
            onMouseEnter={() => handleMouseEnter('inspiratie')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">
              Inspiratie <span className="arrow">▾</span>
            </span>
            {activeDropdown === 'inspiratie' && (
              <div className="dropdown-menu">
                <div className="dropdown-content single">
                  <Link to="/inspiratie">Projecten Galerij</Link>
                  <Link to="/inspiratie">Voor & Na</Link>
                  <Link to="/inspiratie">Stijlen</Link>
                  <Link to="/contact">Blogs & Tips</Link>
                </div>
              </div>
            )}
          </div>

          {/* Offerte aanvragen dropdown */}
          <div
            className="nav-item has-dropdown"
            onMouseEnter={() => handleMouseEnter('offerte')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">
              Offerte aanvragen <span className="arrow">▾</span>
            </span>
            {activeDropdown === 'offerte' && (
              <div className="dropdown-menu">
                <div className="dropdown-content single">
                  <Link to="/offerte">Online Offerte</Link>
                  <Link to="/afspraak">Gratis Inmeten</Link>
                  <a href="tel:+31850605036">Bel Direct</a>
                </div>
              </div>
            )}
          </div>

          {/* Contact dropdown */}
          <div
            className="nav-item has-dropdown"
            onMouseEnter={() => handleMouseEnter('contact')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">
              Contact <span className="arrow">▾</span>
            </span>
            {activeDropdown === 'contact' && (
              <div className="dropdown-menu">
                <div className="dropdown-content single">
                  <Link to="/contact">Contact Formulier</Link>
                  <Link to="/showroom">Showroom Bezoeken</Link>
                  <Link to="/faq">Veelgestelde Vragen</Link>
                </div>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <Link to="/afspraak" className="btn btn-cta">
            Afspraak maken <span>→</span>
          </Link>
        </nav>

        {/* Theme Toggle Button */}
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          )}
        </button>

        {/* Mobile menu button */}
        <button className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-content">
          {/* Onze diensten dropdown */}
          <div className="mobile-nav-item">
            <button className="mobile-nav-link" onClick={() => toggleMobileDropdown('diensten')}>
              Onze diensten <span className={`arrow ${mobileActiveMenu === 'diensten' ? 'active' : ''}`}>▾</span>
            </button>
            {mobileActiveMenu === 'diensten' && (
              <div className="mobile-dropdown">
                <div className="mobile-dropdown-section">
                  <h4>Veranda's</h4>
                  <Link to="/producten/polycarbonaat" onClick={toggleMobileMenu}>Polycarbonaat Veranda</Link>
                  <Link to="/producten/glazen" onClick={toggleMobileMenu}>Glazen Veranda</Link>
                  <Link to="/producten/lamellen" onClick={toggleMobileMenu}>Lamellen Veranda</Link>
                  <Link to="/producten/vouwdak" onClick={toggleMobileMenu}>Vouwdak Veranda</Link>
                </div>
                <div className="mobile-dropdown-section">
                  <h4>Overige</h4>
                  <Link to="/producten/schuifwand" onClick={toggleMobileMenu}>Glazen Schuifwand</Link>
                  <Link to="/producten/cube" onClick={toggleMobileMenu}>Cube Veranda</Link>
                  <Link to="/producten/tuinkamer" onClick={toggleMobileMenu}>Tuinkamer</Link>
                  <Link to="/producten/carport" onClick={toggleMobileMenu}>Carport</Link>
                </div>
                <div className="mobile-dropdown-section">
                  <h4>Services</h4>
                  <Link to="/contact" onClick={toggleMobileMenu}>Platenwissel</Link>
                  <Link to="/contact" onClick={toggleMobileMenu}>Onderhoud</Link>
                  <Link to="/contact" onClick={toggleMobileMenu}>Reparatie</Link>
                </div>
              </div>
            )}
          </div>

          {/* Over ons */}
          <Link to="/over-ons" className="mobile-nav-link" onClick={toggleMobileMenu}>Over ons</Link>

          {/* Inspiratie dropdown */}
          <div className="mobile-nav-item">
            <button className="mobile-nav-link" onClick={() => toggleMobileDropdown('inspiratie')}>
              Inspiratie <span className={`arrow ${mobileActiveMenu === 'inspiratie' ? 'active' : ''}`}>▾</span>
            </button>
            {mobileActiveMenu === 'inspiratie' && (
              <div className="mobile-dropdown">
                <Link to="/inspiratie" onClick={toggleMobileMenu}>Projecten Galerij</Link>
                <Link to="/inspiratie" onClick={toggleMobileMenu}>Voor & Na</Link>
                <Link to="/inspiratie" onClick={toggleMobileMenu}>Stijlen</Link>
                <Link to="/contact" onClick={toggleMobileMenu}>Blogs & Tips</Link>
              </div>
            )}
          </div>

          {/* Offerte aanvragen dropdown */}
          <div className="mobile-nav-item">
            <button className="mobile-nav-link" onClick={() => toggleMobileDropdown('offerte')}>
              Offerte aanvragen <span className={`arrow ${mobileActiveMenu === 'offerte' ? 'active' : ''}`}>▾</span>
            </button>
            {mobileActiveMenu === 'offerte' && (
              <div className="mobile-dropdown">
                <Link to="/offerte" onClick={toggleMobileMenu}>Online Offerte</Link>
                <Link to="/afspraak" onClick={toggleMobileMenu}>Gratis Inmeten</Link>
                <a href="tel:+31850605036" onClick={toggleMobileMenu}>Bel Direct</a>
              </div>
            )}
          </div>

          {/* Contact dropdown */}
          <div className="mobile-nav-item">
            <button className="mobile-nav-link" onClick={() => toggleMobileDropdown('contact')}>
              Contact <span className={`arrow ${mobileActiveMenu === 'contact' ? 'active' : ''}`}>▾</span>
            </button>
            {mobileActiveMenu === 'contact' && (
              <div className="mobile-dropdown">
                <Link to="/contact" onClick={toggleMobileMenu}>Contact Formulier</Link>
                <Link to="/showroom" onClick={toggleMobileMenu}>Showroom Bezoeken</Link>
                <Link to="/faq" onClick={toggleMobileMenu}>Veelgestelde Vragen</Link>
              </div>
            )}
          </div>

          {/* Theme Toggle in Mobile */}
          <div className="mobile-theme-toggle">
            <button className="mobile-theme-btn" onClick={toggleTheme}>
              {theme === 'light' ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>

          {/* CTA Button */}
          <Link to="/afspraak" className="mobile-cta-btn" onClick={toggleMobileMenu}>
            Afspraak maken <span>→</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}
