import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GoogleReviews from '../components/GoogleReviews'
import '../styles/HomePage.css'

export default function HomePage() {
  const { t } = useTranslation()
  return (
    <div className="home-page">
      <Helmet>
        <title>VivaVerandas | Aluminium Veranda's & Overkappingen in Reuver, Limburg</title>
        <meta name="description" content={t('home.hero.description1')} />
        <link rel="canonical" href="https://vivaverandas.nl/" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <img
            src="/glasLux-home.webp"
            alt="Modern veranda"
          />
        </div>
        <div className="container hero-content">
          <h2>{t('home.hero.title')}</h2>
          <p>{t('home.hero.description1')}</p>
          <p>{t('home.hero.description2')}</p>
          <a href="#offerte" className="btn btn-primary btn-large">{t('home.hero.cta')}</a>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="gallery-preview">
        <div className="container">
          <div className="gallery-grid">
            <img src="/Glazen-Overkapping.webp" alt="Glazen overkapping" />
            <img src="/Veranda-antraciet.webp" alt="Aluminium veranda" />
            <img src="/Tuinkamer-met-glazenschuifwanden-r96cf3vfsj301y31nv8v88rmlr026cvk5ly402n4i0.webp" alt="Tuinkamer met veranda" />
            <img src="/Overkapping-Helder-poly.webp" alt="Moderne overkapping" />
            <img src="/cube-veranda.webp" alt="Cube veranda" />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products" id="diensten">
        <div className="container">
          <h2>{t('home.products.title')}</h2>
          <p className="section-subtitle">{t('home.products.subtitle')}</p>

          <div className="products-grid">
            <Link to="/producten/polycarbonaat-veranda" className="product-card">
              <img src="/antra-veranda-PC5-1.webp" alt="Polycarbonaat Veranda" />
              <div className="product-content">
                <h3>{t('header.polycarbonaatVeranda')}</h3>
                <p>{t('home.products.poly.description')}</p>
              </div>
            </Link>
            <Link to="/producten/glazen-veranda" className="product-card">
              <img src="/Glazendak-cremewit-1.webp" alt="Glazen Veranda" />
              <div className="product-content">
                <h3>{t('header.glazenVeranda')}</h3>
                <p>{t('home.products.glazen.description')}</p>
              </div>
            </Link>
            <Link to="/producten/lamel-veranda" className="product-card">
              <img src="/lamellen-overkapping.webp" alt="Lamel Veranda" />
              <div className="product-content">
                <h3>{t('header.lamelVeranda')}</h3>
                <p>{t('home.products.lamellen.description')}</p>
              </div>
            </Link>
            <Link to="/producten/cube-veranda" className="product-card">
              <img src="/cube-veranda.webp" alt="Cube Veranda" />
              <div className="product-content">
                <h3>{t('header.cubeVeranda')}</h3>
                <p>{t('home.products.cube.description')}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Unique Benefits */}
      <section className="benefits">
        <div className="container">
          <h2>{t('home.benefits.title')}</h2>

          <div className="benefits-wrapper">
            <div className="benefits-image">
              <img src="/Overkapping-Helder-poly.webp" alt="Elegante veranda" />
            </div>
            <div className="benefits-content">
              <h3>{t('home.benefits.subtitle')}</h3>
              <p>{t('home.benefits.description1')}</p>
              <p>{t('home.benefits.description2')}</p>
              <a href="tel:+31773902201" className="btn btn-primary">
                <i className="pi pi-phone" style={{ marginRight: '8px' }}></i>
                {t('home.benefits.cta')} - +31 77 390 2201
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Features */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">{t('home.stats.experience')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">{t('home.stats.clients')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">{t('home.stats.projects')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">7</span>
              <span className="stat-label">{t('home.stats.warranty')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process">
        <div className="container">
          <h2>{t('home.process.title')}</h2>
          <p className="section-subtitle">{t('home.process.subtitle')}</p>

          <div className="process-grid">
            <div className="process-item">
              <div className="process-number">1</div>
              <div className="process-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3>{t('home.process.step1.title')}</h3>
              <p>{t('home.process.step1.description')}</p>
            </div>
            <div className="process-item">
              <div className="process-number">2</div>
              <div className="process-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>{t('home.process.step2.title')}</h3>
              <p>{t('home.process.step2.description')}</p>
            </div>
            <div className="process-item">
              <div className="process-number">3</div>
              <div className="process-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h3>{t('home.process.step3.title')}</h3>
              <p>{t('home.process.step3.description')}</p>
            </div>
            <div className="process-item">
              <div className="process-number">4</div>
              <div className="process-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3>{t('home.process.step4.title')}</h3>
              <p>{t('home.process.step4.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Affordable Quality */}
      <section className="quality">
        <div className="container">
          <div className="quality-wrapper">
            <div className="quality-content">
              <h2>{t('home.quality.title')}</h2>
              <p>{t('home.quality.description')}</p>
              <ul className="quality-list">
                <li>{t('home.quality.feature1')}</li>
                <li>{t('home.quality.feature2')}</li>
                <li>{t('home.quality.feature3')}</li>
                <li>{t('home.quality.feature4')}</li>
                <li>{t('home.quality.feature5')}</li>
              </ul>
            </div>
            <div className="quality-image">
              <img src="/Glazendak-cremewit-1.webp" alt="Kwaliteit veranda" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features">
        <div className="container">
          <h2>{t('home.features.title')}</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🏆</div>
              <h3>{t('home.features.quality.title')}</h3>
              <p>{t('home.features.quality.description')}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🛠️</div>
              <h3>{t('home.features.installation.title')}</h3>
              <p>{t('home.features.installation.description')}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📐</div>
              <h3>{t('home.features.custom.title')}</h3>
              <p>{t('home.features.custom.description')}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💰</div>
              <h3>{t('home.features.pricing.title')}</h3>
              <p>{t('home.features.pricing.description')}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>{t('home.features.delivery.title')}</h3>
              <p>{t('home.features.delivery.description')}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤝</div>
              <h3>{t('home.features.service.title')}</h3>
              <p>{t('home.features.service.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Glazen Schuifwanden Section */}
      <section className="glass-walls-section">
        <div className="container">
          <div className="glass-walls-wrapper">
            <div className="glass-walls-image">
              <img src="/glazen-schuifwand-5-rails.webp" alt="Glazen Schuifwanden" />
            </div>
            <div className="glass-walls-content">
              <h2>{t('home.features.openingTypes.title')}</h2>
              <p>{t('home.features.openingTypes.description')}</p>
              <div className="glass-walls-features">
                <div className="glass-wall-type">
                  <i className="pi pi-arrows-h"></i>
                  <span>{t('home.glassWalls.sliding')}</span>
                </div>
                <div className="glass-wall-type">
                  <i className="pi pi-arrows-alt"></i>
                  <span>{t('home.glassWalls.folding')}</span>
                </div>
              </div>
              <Link to="/inspiratie" className="btn btn-primary">{t('home.glassWalls.cta')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration Gallery */}
      <section className="inspiration" id="inspiratie">
        <div className="container">
          <h2>{t('home.inspiration.title')}</h2>
          <div className="inspiration-products-grid">
            <Link to="/producten/polycarbonaat-veranda" className="inspiration-product-item">
              <img src="/polikarbonat/polikarbonat-veranda.png" alt={t('header.polycarbonaatVeranda')} />
              <div className="inspiration-product-overlay">
                <h3>{t('header.polycarbonaatVeranda')}</h3>
                <span className="view-more">{t('common.readMore')} →</span>
              </div>
            </Link>
            <Link to="/producten/lamel-veranda" className="inspiration-product-item">
              <img src="/lamellen-overkapping.webp" alt={t('header.lamelVeranda')} />
              <div className="inspiration-product-overlay">
                <h3>{t('header.lamelVeranda')}</h3>
                <span className="view-more">{t('common.readMore')} →</span>
              </div>
            </Link>
            <Link to="/producten/cube-veranda" className="inspiration-product-item">
              <img src="/cube-vernda.png" alt={t('header.cubeVeranda')} />
              <div className="inspiration-product-overlay">
                <h3>{t('header.cubeVeranda')}</h3>
                <span className="view-more">{t('common.readMore')} →</span>
              </div>
            </Link>
            <Link to="/producten/glazen-veranda" className="inspiration-product-item">
              <img src="/Glazendak-cremewit-1.webp" alt={t('header.glazenVeranda')} />
              <div className="inspiration-product-overlay">
                <h3>{t('header.glazenVeranda')}</h3>
                <span className="view-more">{t('common.readMore')} →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* More Gallery */}
      <section className="gallery-full">
        <div className="container">
          <h2>{t('home.gallery.title')}</h2>
          <div className="gallery-full-grid">
            <img src="/Veranda-antraciet.webp" alt="Project 1" />
            <img src="/Glazen-Overkapping.webp" alt="Project 2" />
            <img src="/lamellen-overkapping.webp" alt="Project 3" />
            <img src="/cube-veranda.webp" alt="Project 4" />
            <img src="/Vouwdak-open-details.webp" alt="Project 5" />
            <img src="/Lamellen-dak-open.webp" alt="Project 6" />
            <img src="/glazen-schuifwand-5-rails.webp" alt="Project 7" />
            <img src="/Tuinkamer-Antraciet.webp" alt="Project 8" />
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <GoogleReviews />

      {/* What is a Polycarbonate Veranda */}
      <section className="info-section" id="over-ons">
        <div className="container">
          <div className="info-header" style={{ textAlign: 'center', width: '100%' }}>
            <h2>{t('home.info.title')}</h2>
            <p className="section-subtitle">{t('home.info.subtitle')}</p>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <img src="/antra-veranda-PC5-1.webp" alt="Wat is veranda" />
              <h3>{t('home.info.what.title')}</h3>
              <p>{t('home.info.what.description')}</p>
            </div>
            <div className="info-item">
              <img src="/Grondstof-Polycarbonaat.webp" alt="Voordelen" />
              <h3>{t('home.info.benefits.title')}</h3>
              <p>{t('home.info.benefits.description')}</p>
            </div>
            <div className="info-item">
              <img src="/Overkapping-Helder-poly.webp" alt="Waarom Alusolutions" />
              <h3>{t('home.info.whyUs.title')}</h3>
              <p>{t('home.info.whyUs.description')}</p>
            </div>
            <div className="info-item">
              <img src="/Polycarbonaat-kleuren.webp" alt="Personaliseer" />
              <h3>{t('home.info.personalize.title')}</h3>
              <p>{t('home.info.personalize.description')}</p>
            </div>
            <div className="info-item">
              <img src="/Antraciet-veranda-met-sutter.webp" alt="Installatie" />
              <h3>{t('home.info.installation.title')}</h3>
              <p>{t('home.info.installation.description')}</p>
            </div>
            <div className="info-item">
              <img src="/Verdaca-binnenkant-open-4.webp" alt="Showroom" />
              <h3>{t('home.info.showroom.title')}</h3>
              <p>{t('home.info.showroom.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Colors Section */}
      <section className="colors">
        <div className="container">
          <h2>{t('home.colors.title')}</h2>
          <p className="section-subtitle">{t('home.colors.subtitle')}</p>
          <div className="colors-grid">
            <div className="color-item">
              <div className="color-swatch" style={{ backgroundColor: '#333333' }}></div>
              <span>{t('home.colors.anthracite')}</span>
            </div>
            <div className="color-item">
              <div className="color-swatch" style={{ backgroundColor: '#ffffff', border: '1px solid #ddd' }}></div>
              <span>{t('home.colors.white')}</span>
            </div>
            <div className="color-item">
              <div className="color-swatch" style={{ backgroundColor: '#f5f5dc' }}></div>
              <span>{t('home.colors.cream')}</span>
            </div>
            <div className="color-item">
              <div className="color-swatch" style={{ backgroundColor: '#000000' }}></div>
              <span>{t('home.colors.black')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg">
          <img src="/cozy-patio-with-sofas-table-pergola-shade-patio-2048x1365.jpg.webp" alt="Veranda achtergrond" />
        </div>
        <div className="container cta-content">
          <h2>{t('home.cta.title')}</h2>
          <p>{t('home.cta.description')}</p>
          <div className="cta-buttons">
            <a href="#offerte" className="btn btn-primary btn-large">{t('home.cta.requestQuote')}</a>
            <a href="#contact" className="btn btn-secondary btn-large">{t('home.cta.contact')}</a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <div className="container">
          <h2>{t('home.faq.title')}</h2>
          <p>{t('home.faq.subtitle')}</p>

          <div className="faq-list">
            <details className="faq-item">
              <summary>{t('home.faq.q1.question')}</summary>
              <p>{t('home.faq.q1.answer')}</p>
            </details>
            <details className="faq-item">
              <summary>{t('home.faq.q2.question')}</summary>
              <p>{t('home.faq.q2.answer')}</p>
            </details>
            <details className="faq-item">
              <summary>{t('home.faq.q3.question')}</summary>
              <p>{t('home.faq.q3.answer')}</p>
            </details>
            <details className="faq-item">
              <summary>{t('home.faq.q4.question')}</summary>
              <p>{t('home.faq.q4.answer')}</p>
            </details>
            <details className="faq-item">
              <summary>{t('home.faq.q5.question')}</summary>
              <p>{t('home.faq.q5.answer')}</p>
            </details>
            <details className="faq-item">
              <summary>{t('home.faq.q6.question')}</summary>
              <p>{t('home.faq.q6.answer')}</p>
            </details>
          </div>

          <a href="#offerte" className="btn btn-primary">{t('home.faq.cta')}</a>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-info">
              <h2>{t('home.contact.title')}</h2>
              <p>{t('home.contact.subtitle')}</p>

              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div>
                    <strong>{t('home.contact.address')}</strong>
                    <p>Mariastraat 22, 5953 NL Reuver</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <div>
                    <strong>{t('home.contact.phone')}</strong>
                    <p>+31 77 390 2201</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <strong>{t('home.contact.email')}</strong>
                    <p>Info@vivaverandas.nl</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🕐</span>
                  <div>
                    <strong>{t('home.contact.hours')}</strong>
                    <p>{t('home.contact.weekdays')}</p>
                    <p>{t('home.contact.saturday')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2500!2d6.082766!3d51.280102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c74f53a508958d%3A0x618238c611b6b837!2sAluSolutions%20%7C%20Veranda's%20%26%20Overkappingen!5e0!3m2!1snl!2snl"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '10px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="VivaVerandas Locatie"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
