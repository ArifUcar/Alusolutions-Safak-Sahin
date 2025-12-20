import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/ContactPage.css'

export default function ContactPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    naam: '',
    telefoon: '',
    email: '',
    woonplaats: '',
    onderwerp: '',
    bericht: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert(t('contactPage.form.successMessage'))
  }

  return (
    <div className="contact-page">
      <Header />

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-bg">
          <img
            src="/glasLux-home.webp"
            alt={t('contactPage.hero.title')}
          />
        </div>
        <div className="container contact-hero-content">
          <h1>{t('contactPage.hero.title')}</h1>
          <p>{t('contactPage.hero.subtitle')}</p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h2>{t('contactPage.form.title')}</h2>
              <p>{t('contactPage.form.subtitle')}</p>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="naam">{t('contactPage.form.name')} *</label>
                    <input
                      type="text"
                      id="naam"
                      name="naam"
                      placeholder={t('contactPage.form.namePlaceholder')}
                      value={formData.naam}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefoon">{t('contactPage.form.phone')} *</label>
                    <input
                      type="tel"
                      id="telefoon"
                      name="telefoon"
                      placeholder={t('contactPage.form.phonePlaceholder')}
                      value={formData.telefoon}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">{t('contactPage.form.email')} *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder={t('contactPage.form.emailPlaceholder')}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="woonplaats">{t('contactPage.form.city')}</label>
                    <input
                      type="text"
                      id="woonplaats"
                      name="woonplaats"
                      placeholder={t('contactPage.form.cityPlaceholder')}
                      value={formData.woonplaats}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="onderwerp">{t('contactPage.form.subject')} *</label>
                  <select
                    id="onderwerp"
                    name="onderwerp"
                    value={formData.onderwerp}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t('contactPage.form.subjectPlaceholder')}</option>
                    <option value="polycarbonaat">{t('contactPage.form.subjectPolycarbonaat')}</option>
                    <option value="platenwissel">{t('contactPage.form.subjectPlatenwissel')}</option>
                    <option value="glazen">{t('contactPage.form.subjectGlazen')}</option>
                    <option value="lamellen">{t('contactPage.form.subjectLamellen')}</option>
                    <option value="vouwdak">{t('contactPage.form.subjectVouwdak')}</option>
                    <option value="schuifwand">{t('contactPage.form.subjectSchuifwand')}</option>
                    <option value="overige">{t('contactPage.form.subjectOverige')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="bericht">{t('contactPage.form.message')} *</label>
                  <textarea
                    id="bericht"
                    name="bericht"
                    placeholder={t('contactPage.form.messagePlaceholder')}
                    rows={5}
                    value={formData.bericht}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="foto">{t('contactPage.form.photo')}</label>
                  <input
                    type="file"
                    id="foto"
                    name="foto"
                    accept="image/*"
                    className="file-input"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-large">
                  {t('contactPage.form.submit')}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-wrapper">
              <div className="contact-intro">
                <h2>{t('contactPage.info.title')}</h2>
                <p>
                  {t('contactPage.info.intro1')}
                </p>
                <p>
                  {t('contactPage.info.intro2')}
                </p>
              </div>

              <div className="contact-details-box">
                <div className="contact-detail-item">
                  <div className="detail-icon">📞</div>
                  <div className="detail-content">
                    <strong>{t('contactPage.info.phone')}</strong>
                    <p>+31 85 060 5036</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">✉️</div>
                  <div className="detail-content">
                    <strong>{t('contactPage.info.email')}</strong>
                    <p>info@alusolutions.nl</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">📍</div>
                  <div className="detail-content">
                    <strong>{t('contactPage.info.showroom')}</strong>
                    <p>Mariastraat 22</p>
                    <p>5953 NL Reuver</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">🕐</div>
                  <div className="detail-content">
                    <strong>{t('contactPage.info.hours')}</strong>
                    <p>{t('contactPage.info.hoursMonThu')}</p>
                    <p>{t('contactPage.info.hoursFri')}</p>
                    <p>{t('contactPage.info.hoursSat')}</p>
                  </div>
                </div>
              </div>

              <div className="social-contact">
                <h3>{t('contactPage.info.followUs')}</h3>
                <div className="social-buttons">
                  <a href="#" className="social-btn facebook">{t('contactPage.info.facebook')}</a>
                  <a href="#" className="social-btn instagram">{t('contactPage.info.instagram')}</a>
                  <a href="#" className="social-btn whatsapp">{t('contactPage.info.whatsapp')}</a>
                  <a href="#" className="social-btn youtube">{t('contactPage.info.youtube')}</a>
                </div>
              </div>

              <a href="#" className="btn btn-primary btn-large appointment-btn">
                {t('contactPage.info.appointment')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2>{t('contactPage.map.title')}</h2>
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2498.5!2d6.0789!3d51.2876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c74b8a5c8b1a1f%3A0x1234567890abcdef!2sMariastraat%2022%2C%205953%20NL%20Reuver%2C%20Netherlands!5e0!3m2!1sen!2snl!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="AluSolutions Locatie"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="container">
          <div className="reviews-header">
            <h2>{t('contactPage.reviews.title')}</h2>
            <div className="reviews-summary">
              <div className="rating-score">4.8</div>
              <div className="rating-info">
                <div className="stars">★★★★★</div>
                <p>{t('contactPage.reviews.rating')}</p>
              </div>
            </div>
          </div>

          <div className="reviews-highlights">
            <div className="highlight-item">✓ {t('contactPage.reviews.highlight1')}</div>
            <div className="highlight-item">✓ {t('contactPage.reviews.highlight2')}</div>
            <div className="highlight-item">✓ {t('contactPage.reviews.highlight3')}</div>
          </div>

          <div className="reviews-grid">
            <div className="review-card">
              <div className="review-header">
                <div className="review-avatar">BR</div>
                <div>
                  <strong>Bright Ride</strong>
                  <span>11 November 2025</span>
                </div>
              </div>
              <div className="review-stars">★★★★★</div>
              <p>De jongens hebben een top werk geleverd en zeer tevreden over het eind resultaat van mijn glazen schuif deur</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="review-avatar">DG</div>
                <div>
                  <strong>Dennis Gerritzen</strong>
                  <span>4 September 2025</span>
                </div>
              </div>
              <div className="review-stars">★★★★★</div>
              <p>Goede service, aardige vakmensen en snel gemaakt.</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="review-avatar">CT</div>
                <div>
                  <strong>Carin Titulaer</strong>
                  <span>28 April 2025</span>
                </div>
              </div>
              <div className="review-stars">★★★★★</div>
              <p>Erg blij met mijn nieuwe veranda. Goed werk geleverd</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="review-avatar">OY</div>
                <div>
                  <strong>Orhan Yilmaz</strong>
                  <span>3 Mei 2024</span>
                </div>
              </div>
              <div className="review-stars">★★★★★</div>
              <p>Topservice en topkwaliteit, denkt mee en supersnel geregeld.</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="review-avatar">HP</div>
                <div>
                  <strong>Hanifi Pehlivan</strong>
                  <span>13 September 2024</span>
                </div>
              </div>
              <div className="review-stars">★★★★★</div>
              <p>Top kwaliteit! Fijn klantvriendelijk. Wij zijn erg tevreden met onze nieuwe overkapping. Zeer deskundig en werkt secuur en netjes.</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="review-avatar">MK</div>
                <div>
                  <strong>Mandy Kessels</strong>
                  <span>6 December 2024</span>
                </div>
              </div>
              <div className="review-stars">★★★★★</div>
              <p>Super geholpen echte aanrader lief personeel en erg snel n netjes respect</p>
            </div>
          </div>

          <div className="reviews-cta">
            <a href="#" className="btn btn-secondary">{t('contactPage.reviews.writeReview')}</a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta">
        <div className="container">
          <h2>{t('contactPage.cta.title')}</h2>
          <p>{t('contactPage.cta.subtitle')}</p>
          <div className="cta-buttons">
            <a href="/#offerte" className="btn btn-primary btn-large">{t('contactPage.cta.quote')}</a>
            <a href="#" className="btn btn-secondary btn-large">{t('contactPage.cta.call')}</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
