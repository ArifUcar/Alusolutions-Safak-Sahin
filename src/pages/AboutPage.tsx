import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/AboutPage.css'

export default function AboutPage() {
  const { t } = useTranslation()
  return (
    <div className="about-page">
      <Header />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <img
            src="/Glazen-Overkapping.webp"
            alt="Over AluSolutions"
          />
        </div>
        <div className="container about-hero-content">
          <h1>{t('about.hero.title')}</h1>
          <p>{t('about.hero.subtitle')}</p>
        </div>
      </section>

      {/* Who Are We */}
      <section className="who-are-we">
        <div className="container">
          <div className="who-wrapper">
            <div className="who-content">
              <h2>{t('about.who.title')}</h2>
              <p>{t('about.who.description1')}</p>
              <p>{t('about.who.description2')}</p>
              <Link to="/#offerte" className="btn btn-primary">{t('about.who.cta')}</Link>
            </div>
            <div className="who-image">
              <img
                src="/Veranda-antraciet.webp"
                alt="AluSolutions team"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="quality-section">
        <div className="container">
          <div className="quality-wrapper">
            <div className="quality-image">
              <img
                src="/Glazendak-cremewit-1.webp"
                alt="Kwaliteit en vakmanschap"
              />
            </div>
            <div className="quality-content">
              <h2>{t('about.quality.title')}</h2>
              <p>{t('about.quality.description1')}</p>
              <p>{t('about.quality.description2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="features-banner">
        <div className="container">
          <h2>{t('about.banner.title')}</h2>
          <p>{t('about.banner.description')}</p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="about-benefits">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">📐</div>
              <h3>{t('about.benefits.custom.title')}</h3>
              <p>{t('about.benefits.custom.description')}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌟</div>
              <h3>{t('about.benefits.experience.title')}</h3>
              <p>{t('about.benefits.experience.description')}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🛡️</div>
              <h3>{t('about.benefits.protection.title')}</h3>
              <p>{t('about.benefits.protection.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Create Your Oasis */}
      <section className="oasis-section">
        <div className="oasis-bg">
          <img
            src="/Tuinkamer-Antraciet.webp"
            alt="Buitenoase"
          />
        </div>
        <div className="container oasis-content">
          <h2>{t('about.oasis.title')}</h2>
          <p>{t('about.oasis.description')}</p>
          <Link to="/#offerte" className="btn btn-primary btn-large">{t('about.oasis.cta')}</Link>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>{t('about.team.title')}</h2>
          <p className="section-subtitle">{t('about.team.subtitle')}</p>
          <div className="team-grid">
            <div className="team-member">
              <img src="/Grondstof-Polycarbonaat.webp" alt="Team member" />
              <h3>{t('about.team.member1.name')}</h3>
              <span>{t('about.team.member1.role')}</span>
            </div>
            <div className="team-member">
              <img src="/Polycarbonaat-kleuren.webp" alt="Team member" />
              <h3>{t('about.team.member2.name')}</h3>
              <span>{t('about.team.member2.role')}</span>
            </div>
            <div className="team-member">
              <img src="/Overkapping-Helder-poly.webp" alt="Team member" />
              <h3>{t('about.team.member3.name')}</h3>
              <span>{t('about.team.member3.role')}</span>
            </div>
            <div className="team-member">
              <img src="/Verdaca-binnenkant-open-4.webp" alt="Team member" />
              <h3>{t('about.team.member4.name')}</h3>
              <span>{t('about.team.member4.role')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>{t('about.values.title')}</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">🎯</div>
              <h3>{t('about.values.quality.title')}</h3>
              <p>{t('about.values.quality.description')}</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🤝</div>
              <h3>{t('about.values.reliability.title')}</h3>
              <p>{t('about.values.reliability.description')}</p>
            </div>
            <div className="value-item">
              <div className="value-icon">💡</div>
              <h3>{t('about.values.innovation.title')}</h3>
              <p>{t('about.values.innovation.description')}</p>
            </div>
            <div className="value-item">
              <div className="value-icon">❤️</div>
              <h3>{t('about.values.satisfaction.title')}</h3>
              <p>{t('about.values.satisfaction.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <h2>{t('about.cta.title')}</h2>
          <p>{t('about.cta.description')}</p>
          <div className="cta-buttons">
            <Link to="/#offerte" className="btn btn-primary btn-large">{t('about.cta.requestQuote')}</Link>
            <Link to="/#contact" className="btn btn-secondary btn-large">{t('about.cta.contact')}</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
