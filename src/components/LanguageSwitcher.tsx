import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import 'flag-icons/css/flag-icons.min.css'
import '../styles/LanguageSwitcher.css'

const languages = [
  { code: 'nl', name: 'Nederlands', flagCode: 'nl' },
  { code: 'de', name: 'Deutsch', flagCode: 'de' },
  { code: 'en', name: 'English', flagCode: 'gb' },
  { code: 'fr', name: 'Français', flagCode: 'fr' },
  { code: 'it', name: 'Italiano', flagCode: 'it' },
  { code: 'tr', name: 'Türkçe', flagCode: 'tr' }
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | null>(null)

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code)
    setIsOpen(false)
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 300)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isOpen])

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  return (
    <div
      className="language-dropdown"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="language-dropdown-btn"
        onClick={toggleDropdown}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className={`fi fi-${currentLanguage.flagCode}`}></span>
        <span className="language-name">{currentLanguage.name}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <>
          <div className="language-dropdown-backdrop" onClick={() => setIsOpen(false)} />
          <div className="language-dropdown-content">
            <div className="language-dropdown-header">
              <span>Taal selecteren</span>
              <button
                className="language-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="language-options-grid">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
                  onClick={() => changeLanguage(lang.code)}
                  aria-label={`Switch to ${lang.name}`}
                >
                  <span className={`fi fi-${lang.flagCode}`}></span>
                  <span className="language-option-name">{lang.name}</span>
                  {i18n.language === lang.code && <span className="check-icon">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
