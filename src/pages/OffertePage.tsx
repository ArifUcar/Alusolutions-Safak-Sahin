import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import '../styles/OffertePage.css'

interface Configurator {
  id: string
  slug: string
  name: Record<string, string>
  description: Record<string, string>
  image_url: string | null
  is_active: boolean
}

export default function OffertePage() {
  const { t, i18n } = useTranslation()
  const [configurators, setConfigurators] = useState<Configurator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfigurators = async () => {
      const { data } = await supabase
        .from('configurators')
        .select('id, slug, name, description, image_url, is_active')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (data) {
        setConfigurators(data)
      }
      setLoading(false)
    }
    loadConfigurators()
  }, [])

  const getLocalizedText = (obj: Record<string, string> | null, fallback: string = '') => {
    if (!obj) return fallback
    return obj[i18n.language] || obj['nl'] || fallback
  }

  // Default images for configurators based on slug
  const getDefaultImage = (slug: string) => {
    const imageMap: Record<string, string> = {
      'cube-veranda': '/cube-veranda.webp',
      'lamel-veranda': '/lamellen-overkapping.webp',
      'glazen-veranda': '/Glazendak-cremewit-1.webp',
      'polycarbonaat-veranda': '/antra-veranda-PC5-1.webp',
      'vouwdak-veranda': '/Vouwdak-open-details.webp',
      'tuinkamer': '/Tuinkamer-Antraciet.webp',
      'carport': '/cube-veranda.webp',
      'glazen-schuifwand': '/glazen-schuifwand-5-rails.webp'
    }
    return imageMap[slug] || '/Glazen-Overkapping.webp'
  }

  return (
    <div className="offerte-page offerte-list-page">
      <Helmet>
        <title>{t('offerte.pageTitle')} | VivaVerandas</title>
        <meta name="description" content={t('offerte.pageDescription')} />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="offerte-hero">
        <div className="offerte-hero-bg">
          <img src="/cozy-patio-with-sofas-table-pergola-shade-patio-2048x1365.jpg.webp" alt="Veranda" />
        </div>
        <div className="container offerte-hero-content">
          <h1>{t('offerte.title')}</h1>
          <p>{t('offerte.subtitle')}</p>
        </div>
      </section>

      {/* Configurators Grid */}
      <section className="offerte-configurators">
        <div className="container">
          <h2>{t('offerte.chooseProduct')}</h2>
          <p className="section-subtitle">{t('offerte.chooseProductSubtitle')}</p>

          {loading ? (
            <div className="loading-spinner">
              <i className="pi pi-spin pi-spinner"></i>
            </div>
          ) : configurators.length === 0 ? (
            <div className="no-configurators">
              <p>{t('offerte.noConfigurators')}</p>
            </div>
          ) : (
            <div className="configurators-grid">
              {configurators.map((config) => (
                <Link
                  key={config.id}
                  to={`/offerte/${config.slug}`}
                  className="configurator-card"
                >
                  <div className="configurator-image">
                    <img
                      src={config.image_url || getDefaultImage(config.slug)}
                      alt={getLocalizedText(config.name, config.slug)}
                    />
                  </div>
                  <div className="configurator-content">
                    <h3>{getLocalizedText(config.name, config.slug)}</h3>
                    {config.description && (
                      <p>{getLocalizedText(config.description, '')}</p>
                    )}
                    <span className="configurator-cta">
                      {t('offerte.startConfigurator')}
                      <i className="pi pi-arrow-right"></i>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="offerte-benefits">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="pi pi-check-circle"></i>
              </div>
              <h3>{t('offerte.benefit1.title')}</h3>
              <p>{t('offerte.benefit1.description')}</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="pi pi-clock"></i>
              </div>
              <h3>{t('offerte.benefit2.title')}</h3>
              <p>{t('offerte.benefit2.description')}</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="pi pi-euro"></i>
              </div>
              <h3>{t('offerte.benefit3.title')}</h3>
              <p>{t('offerte.benefit3.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative CTA */}
      <section className="offerte-alternative">
        <div className="container">
          <div className="alternative-content">
            <h2>{t('offerte.alternativeTitle')}</h2>
            <p>{t('offerte.alternativeDescription')}</p>
            <div className="alternative-buttons">
              <Link to="/afspraak" className="btn btn-primary">
                <i className="pi pi-calendar"></i>
                {t('offerte.makeAppointment')}
              </Link>
              <a href="tel:+31773902201" className="btn btn-secondary">
                <i className="pi pi-phone"></i>
                {t('offerte.callUs')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
