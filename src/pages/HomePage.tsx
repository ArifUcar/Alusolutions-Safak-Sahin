import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/HomePage.css'

export default function HomePage() {
  const { t } = useTranslation()
  return (
    <div className="home-page">
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
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products" id="diensten">
        <div className="container">
          <h2>{t('home.products.title')}</h2>
          <p className="section-subtitle">{t('home.products.subtitle')}</p>

          <div className="products-grid">
            <div className="product-card">
              <img src="/antra-veranda-PC5-1.webp" alt="Polycarbonaat Veranda" />
              <div className="product-content">
                <h3>{t('products.polycarbonaat')}</h3>
                <p>{t('home.products.poly.description')}</p>
                <a href="#" className="btn btn-primary">{t('home.products.moreInfo')}</a>
              </div>
            </div>
            <div className="product-card">
              <img src="/Glazendak-cremewit-1.webp" alt="Glazen Veranda" />
              <div className="product-content">
                <h3>{t('products.glazen')}</h3>
                <p>{t('home.products.glazen.description')}</p>
                <a href="#" className="btn btn-primary">{t('home.products.moreInfo')}</a>
              </div>
            </div>
            <div className="product-card">
              <img src="/lamellen-overkapping.webp" alt="Lamellen Veranda" />
              <div className="product-content">
                <h3>{t('products.lamellen')}</h3>
                <p>{t('home.products.lamellen.description')}</p>
                <a href="#" className="btn btn-primary">{t('home.products.moreInfo')}</a>
              </div>
            </div>
            <div className="product-card">
              <img src="/Vouwdak-halfopen.webp" alt="Vouwdak Veranda" />
              <div className="product-content">
                <h3>{t('products.vouwdak')}</h3>
                <p>{t('home.products.vouwdak.description')}</p>
                <a href="#" className="btn btn-primary">{t('home.products.moreInfo')}</a>
              </div>
            </div>
            <div className="product-card">
              <img src="/glazen-schuifwand-5-rails.webp" alt="Glazen Schuifwand" />
              <div className="product-content">
                <h3>{t('products.schuifwand')}</h3>
                <p>{t('home.products.schuifwand.description')}</p>
                <a href="#" className="btn btn-primary">{t('home.products.moreInfo')}</a>
              </div>
            </div>
            <div className="product-card">
              <img src="/Tuinkamer-Antraciet.webp" alt="Tuinkamer" />
              <div className="product-content">
                <h3>{t('products.tuinkamer')}</h3>
                <p>{t('home.products.tuinkamer.description')}</p>
                <a href="#" className="btn btn-primary">{t('home.products.moreInfo')}</a>
              </div>
            </div>
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
              <a href="#contact" className="btn btn-primary">{t('home.benefits.cta')}</a>
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
              <img src="/Grondstof-Polycarbonaat.webp" alt="Offerte aanvragen" />
              <h3>{t('home.process.step1.title')}</h3>
              <p>{t('home.process.step1.description')}</p>
            </div>
            <div className="process-item">
              <div className="process-number">2</div>
              <img src="/alusolutions-ons-project-1.webp" alt="Persoonlijk advies" />
              <h3>{t('home.process.step2.title')}</h3>
              <p>{t('home.process.step2.description')}</p>
            </div>
            <div className="process-item">
              <div className="process-number">3</div>
              <img src="/Overkapping-met-spie.webp" alt="Productie" />
              <h3>{t('home.process.step3.title')}</h3>
              <p>{t('home.process.step3.description')}</p>
            </div>
            <div className="process-item">
              <div className="process-number">4</div>
              <img src="/Antraciet-veranda-met-sutter.webp" alt="Installatie" />
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

      {/* Inspiration Gallery */}
      <section className="inspiration" id="inspiratie">
        <div className="container">
          <h2>{t('home.inspiration.title')}</h2>
          <div className="inspiration-grid">
            <div className="inspiration-item large">
              <img src="/sunlight-illuminating-cozy-patio-with-dining-table-hanging-plants-copy-space-2048x1366.jpg.webp" alt="Luxe veranda inspiratie" />
              <div className="inspiration-overlay">
                <span>{t('home.inspiration.luxury')}</span>
              </div>
            </div>
            <div className="inspiration-item">
              <img src="/Veranda-cremewit.webp" alt="Moderne stijl" />
              <div className="inspiration-overlay">
                <span>{t('home.inspiration.modern')}</span>
              </div>
            </div>
            <div className="inspiration-item">
              <img src="/tuinkamer-antraciet-met-glazenwand-vast.webp" alt="Klassieke stijl" />
              <div className="inspiration-overlay">
                <span>{t('home.inspiration.classic')}</span>
              </div>
            </div>
            <div className="inspiration-item">
              <img src="/Glazenwand-1.webp" alt="Met glazen wanden" />
              <div className="inspiration-overlay">
                <span>{t('home.inspiration.glassWalls')}</span>
              </div>
            </div>
            <div className="inspiration-item">
              <img src="/tuinkamer-bij-zwembad.webp" alt="Tuinkamer" />
              <div className="inspiration-overlay">
                <span>{t('home.inspiration.gardenRoom')}</span>
              </div>
            </div>
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

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2>{t('home.testimonials.title')}</h2>
          <div className="testimonials-grid">
            <div className="testimonial-item">
              <div className="testimonial-image">
                <img src="/Grondstof-Polycarbonaat.webp" alt="Jan de Vries" />
              </div>
              <div className="testimonial-content">
                <p>"{t('home.testimonials.review1.text')}"</p>
                <div className="testimonial-author">
                  <strong>{t('home.testimonials.review1.name')}</strong>
                  <span>{t('home.testimonials.review1.location')}</span>
                </div>
                <div className="testimonial-stars">★★★★★</div>
              </div>
            </div>
            <div className="testimonial-item">
              <div className="testimonial-image">
                <img src="/Polycarbonaat-kleuren.webp" alt="Maria Jansen" />
              </div>
              <div className="testimonial-content">
                <p>"{t('home.testimonials.review2.text')}"</p>
                <div className="testimonial-author">
                  <strong>{t('home.testimonials.review2.name')}</strong>
                  <span>{t('home.testimonials.review2.location')}</span>
                </div>
                <div className="testimonial-stars">★★★★★</div>
              </div>
            </div>
            <div className="testimonial-item">
              <div className="testimonial-image">
                <img src="/LAmellen-veranda-afstandbediening.webp" alt="Peter Bakker" />
              </div>
              <div className="testimonial-content">
                <p>"{t('home.testimonials.review3.text')}"</p>
                <div className="testimonial-author">
                  <strong>{t('home.testimonials.review3.name')}</strong>
                  <span>{t('home.testimonials.review3.location')}</span>
                </div>
                <div className="testimonial-stars">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is a Polycarbonate Veranda */}
      <section className="info-section" id="over-ons">
        <div className="container">
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
              <div className="color-swatch" style={{ backgroundColor: '#8B4513' }}></div>
              <span>{t('home.colors.brown')}</span>
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
                    <p>+31 85 060 5036</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <strong>{t('home.contact.email')}</strong>
                    <p>Info@alusolutions.nl</p>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2498.5!2d6.0789!3d51.2876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c74b8a5c8b1a1f%3A0x1234567890abcdef!2sMariastraat%2022%2C%205953%20NL%20Reuver%2C%20Netherlands!5e0!3m2!1sen!2snl!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '10px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AluSolutions Locatie"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
