import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/CookieConsent.css'

interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytical: boolean
  performance: boolean
  advertising: boolean
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  functional: false,
  analytical: false,
  performance: false,
  advertising: false
}

export default function CookieConsent() {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setIsVisible(true)
    } else {
      try {
        const savedPrefs = JSON.parse(consent)
        if (savedPrefs.preferences) {
          setPreferences(savedPrefs.preferences)
        }
      } catch {
        // Old format, ignore
      }
    }
  }, [])

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      timestamp: new Date().toISOString(),
      preferences: prefs
    }))
    setIsVisible(false)
    setShowPreferences(false)
  }

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytical: true,
      performance: true,
      advertising: true
    }
    setPreferences(allAccepted)
    saveConsent(allAccepted)
  }

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      functional: false,
      analytical: false,
      performance: false,
      advertising: false
    }
    setPreferences(onlyNecessary)
    saveConsent(onlyNecessary)
  }

  const handleSavePreferences = () => {
    saveConsent(preferences)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return // Cannot toggle necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (!isVisible) return null

  return (
    <>
      {/* Main Cookie Banner */}
      {!showPreferences && (
        <div className="cookie-consent">
          <div className="cookie-content">
            <div className="cookie-text">
              <h4>{t('cookieBanner.title', 'We waarderen uw privacy')}</h4>
              <p>
                {t('cookieBanner.description', 'We gebruiken cookies om uw browse-ervaring te verbeteren, gepersonaliseerde advertenties of inhoud weer te geven en ons verkeer te analyseren. Door op "Alles accepteren" te klikken, stemt u in met ons gebruik van cookies.')}
                {' '}
                <Link to="/cookies">{t('cookieBanner.learnMore', 'Meer informatie')}</Link>
              </p>
            </div>
            <div className="cookie-buttons">
              <button className="cookie-btn cookie-btn-customize" onClick={() => setShowPreferences(true)}>
                {t('cookieBanner.customize', 'Aanpassen')}
              </button>
              <button className="cookie-btn cookie-btn-decline" onClick={handleRejectAll}>
                {t('cookieBanner.rejectAll', 'Alles weigeren')}
              </button>
              <button className="cookie-btn cookie-btn-accept" onClick={handleAcceptAll}>
                {t('cookieBanner.acceptAll', 'Alles accepteren')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Modal */}
      {showPreferences && (
        <div className="cookie-modal-overlay">
          <div className="cookie-modal">
            <div className="cookie-modal-header">
              <h3>{t('cookieBanner.preferencesTitle', 'Toestemmingsvoorkeuren aanpassen')}</h3>
              <button className="cookie-modal-close" onClick={() => setShowPreferences(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="cookie-modal-body">
              <p className="cookie-modal-intro">
                {t('cookieBanner.preferencesIntro', 'We gebruiken cookies om u te helpen efficiënt te navigeren en bepaalde functies uit te voeren. U vindt gedetailleerde informatie over alle cookies onder de relevante toestemmingscategorie hieronder.')}
              </p>

              {/* Necessary Cookies - Always Active */}
              <div className="cookie-category">
                <div className="cookie-category-header">
                  <div className="cookie-category-info">
                    <h4>{t('cookieBanner.necessary', 'Noodzakelijk')}</h4>
                    <span className="cookie-always-active">{t('cookieBanner.alwaysActive', 'Altijd actief')}</span>
                  </div>
                </div>
                <p className="cookie-category-desc">
                  {t('cookieBanner.necessaryDesc', 'Noodzakelijke cookies zijn cruciaal voor de basisfuncties van de website en zonder deze werkt de website niet op de beoogde manier. Deze cookies slaan geen persoonlijk identificeerbare gegevens op.')}
                </p>
              </div>

              {/* Functional Cookies */}
              <div className="cookie-category">
                <div className="cookie-category-header">
                  <div className="cookie-category-info">
                    <h4>{t('cookieBanner.functional', 'Functioneel')}</h4>
                  </div>
                  <label className="cookie-toggle">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={() => togglePreference('functional')}
                    />
                    <span className="cookie-toggle-slider"></span>
                  </label>
                </div>
                <p className="cookie-category-desc">
                  {t('cookieBanner.functionalDesc', 'Functionele cookies helpen bepaalde functionaliteiten uit te voeren, zoals het delen van de inhoud van de website op sociale mediaplatforms, het verzamelen van feedback en andere functies van derden.')}
                </p>
              </div>

              {/* Analytical Cookies */}
              <div className="cookie-category">
                <div className="cookie-category-header">
                  <div className="cookie-category-info">
                    <h4>{t('cookieBanner.analytical', 'Analytisch')}</h4>
                  </div>
                  <label className="cookie-toggle">
                    <input
                      type="checkbox"
                      checked={preferences.analytical}
                      onChange={() => togglePreference('analytical')}
                    />
                    <span className="cookie-toggle-slider"></span>
                  </label>
                </div>
                <p className="cookie-category-desc">
                  {t('cookieBanner.analyticalDesc', 'Analytische cookies worden gebruikt om te begrijpen hoe bezoekers omgaan met de website. Deze cookies helpen informatie te verstrekken over de statistieken van het aantal bezoekers, het bouncepercentage, de verkeersbron, enz.')}
                </p>
              </div>

              {/* Performance Cookies */}
              <div className="cookie-category">
                <div className="cookie-category-header">
                  <div className="cookie-category-info">
                    <h4>{t('cookieBanner.performance', 'Prestatie')}</h4>
                  </div>
                  <label className="cookie-toggle">
                    <input
                      type="checkbox"
                      checked={preferences.performance}
                      onChange={() => togglePreference('performance')}
                    />
                    <span className="cookie-toggle-slider"></span>
                  </label>
                </div>
                <p className="cookie-category-desc">
                  {t('cookieBanner.performanceDesc', 'Prestatiecookies worden gebruikt om de belangrijkste prestatie-indexen van de website te begrijpen en te analyseren, wat helpt bij het leveren van een betere gebruikerservaring voor de bezoekers.')}
                </p>
              </div>

              {/* Advertising Cookies */}
              <div className="cookie-category">
                <div className="cookie-category-header">
                  <div className="cookie-category-info">
                    <h4>{t('cookieBanner.advertising', 'Advertentie')}</h4>
                  </div>
                  <label className="cookie-toggle">
                    <input
                      type="checkbox"
                      checked={preferences.advertising}
                      onChange={() => togglePreference('advertising')}
                    />
                    <span className="cookie-toggle-slider"></span>
                  </label>
                </div>
                <p className="cookie-category-desc">
                  {t('cookieBanner.advertisingDesc', 'Advertentiecookies worden gebruikt om bezoekers gepersonaliseerde advertenties te bezorgen op basis van de eerder bezochte pagina\'s en om de effectiviteit van de advertentiecampagne te analyseren.')}
                </p>
              </div>
            </div>

            <div className="cookie-modal-footer">
              <button className="cookie-btn cookie-btn-decline" onClick={handleRejectAll}>
                {t('cookieBanner.rejectAll', 'Alles weigeren')}
              </button>
              <button className="cookie-btn cookie-btn-save" onClick={handleSavePreferences}>
                {t('cookieBanner.savePreferences', 'Voorkeuren opslaan')}
              </button>
              <button className="cookie-btn cookie-btn-accept" onClick={handleAcceptAll}>
                {t('cookieBanner.acceptAll', 'Alles accepteren')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
