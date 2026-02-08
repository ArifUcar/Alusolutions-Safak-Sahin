import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/MobileFloatingButtons.css'

export default function MobileFloatingButtons() {
  const navigate = useNavigate()
  const location = useLocation()

  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null
  }

  return (
    <div className="mobile-floating-buttons">
      {/* Phone Button - Left */}
      <a
        href="tel:+31773902201"
        className="floating-btn phone-btn"
        aria-label="Bel ons"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
        </svg>
      </a>

      {/* Appointment Button - Right */}
      <button
        onClick={() => navigate('/afspraak')}
        className="floating-btn appointment-btn"
        aria-label="Afspraak maken"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="26" height="26">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
        </svg>
      </button>
    </div>
  )
}
