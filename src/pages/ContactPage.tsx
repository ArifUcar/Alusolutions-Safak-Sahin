import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/ContactPage.css'

export default function ContactPage() {
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
    alert('Bedankt voor uw bericht! Wij nemen zo snel mogelijk contact met u op.')
  }

  return (
    <div className="contact-page">
      <Header />

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
            alt="Contact AluSolutions"
          />
        </div>
        <div className="container contact-hero-content">
          <h1>Contact</h1>
          <p>Wij staan voor u klaar</p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h2>Contact formulier</h2>
              <p>Vul het formulier in en wij nemen zo snel mogelijk contact met u op.</p>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="naam">Naam *</label>
                    <input
                      type="text"
                      id="naam"
                      name="naam"
                      placeholder="Voor- en achternaam"
                      value={formData.naam}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefoon">Telefoon *</label>
                    <input
                      type="tel"
                      id="telefoon"
                      name="telefoon"
                      placeholder="Telefoonnummer"
                      value={formData.telefoon}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email adres"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="woonplaats">Woonplaats</label>
                    <input
                      type="text"
                      id="woonplaats"
                      name="woonplaats"
                      placeholder="Stad"
                      value={formData.woonplaats}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="onderwerp">Onderwerp *</label>
                  <select
                    id="onderwerp"
                    name="onderwerp"
                    value={formData.onderwerp}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecteer een onderwerp</option>
                    <option value="polycarbonaat">Polycarbonaat veranda</option>
                    <option value="platenwissel">Platenwissel</option>
                    <option value="glazen">Glazen veranda</option>
                    <option value="lamellen">Lamellen veranda</option>
                    <option value="vouwdak">Vouwdak veranda</option>
                    <option value="schuifwand">Glazen schuifwand</option>
                    <option value="overige">Overige</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="bericht">Bericht *</label>
                  <textarea
                    id="bericht"
                    name="bericht"
                    placeholder="Stel hier uw vraag"
                    rows={5}
                    value={formData.bericht}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="foto">Foto of voorbeeld (niet verplicht)</label>
                  <input
                    type="file"
                    id="foto"
                    name="foto"
                    accept="image/*"
                    className="file-input"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-large">
                  Verstuur bericht
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-wrapper">
              <div className="contact-intro">
                <h2>Wil je contact opnemen met AluSolutions?</h2>
                <p>
                  Heb je vragen over onze producten, of heb je hulp nodig bij het plaatsen van een bestelling?
                  Misschien wil je gewoon je gedachten delen? Bij AluSolutions horen we graag van je!
                  Ons toegewijde team staat klaar om snel en efficiënt te reageren op al je vragen.
                </p>
                <p>
                  Voor directe hulp adviseren we je om contact met ons op te nemen via WhatsApp.
                  Daarnaast zijn we ook bereikbaar via e-mail of ons contactformulier.
                </p>
              </div>

              <div className="contact-details-box">
                <div className="contact-detail-item">
                  <div className="detail-icon">📞</div>
                  <div className="detail-content">
                    <strong>Telefoon</strong>
                    <p>+31 85 060 5036</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">✉️</div>
                  <div className="detail-content">
                    <strong>Email</strong>
                    <p>info@alusolutions.nl</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">📍</div>
                  <div className="detail-content">
                    <strong>Showroom</strong>
                    <p>Mariastraat 22</p>
                    <p>5953 NL Reuver</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">🕐</div>
                  <div className="detail-content">
                    <strong>Openingstijden</strong>
                    <p>Ma-Do: 09:00 - 17:00</p>
                    <p>Vrijdag: Gesloten</p>
                    <p>Za: 10:00 - 15:00</p>
                  </div>
                </div>
              </div>

              <div className="social-contact">
                <h3>Volg ons</h3>
                <div className="social-buttons">
                  <a href="#" className="social-btn facebook">Facebook</a>
                  <a href="#" className="social-btn instagram">Instagram</a>
                  <a href="#" className="social-btn whatsapp">WhatsApp</a>
                  <a href="#" className="social-btn youtube">YouTube</a>
                </div>
              </div>

              <a href="#" className="btn btn-primary btn-large appointment-btn">
                Maak een afspraak
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2>Bezoek onze showroom</h2>
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
            <h2>Wat onze klanten zeggen</h2>
            <div className="reviews-summary">
              <div className="rating-score">4.8</div>
              <div className="rating-info">
                <div className="stars">★★★★★</div>
                <p>Gebaseerd op 64 recensies</p>
              </div>
            </div>
          </div>

          <div className="reviews-highlights">
            <div className="highlight-item">✓ Hoge kwaliteit vakmanschap en betrouwbaarheid</div>
            <div className="highlight-item">✓ Vriendelijke service en oplossingen op maat</div>
            <div className="highlight-item">✓ Goede prijs-kwaliteitverhouding en professioneel resultaat</div>
          </div>

          <div className="reviews-grid">
            <div className="review-card">
              <div className="review-header">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Bright Ride" />
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
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" alt="Dennis Gerritzen" />
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
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Carin Titulaer" />
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
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" alt="Orhan Yilmaz" />
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
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80" alt="Hanifi Pehlivan" />
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
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80" alt="Mandy Kessels" />
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
            <a href="#" className="btn btn-secondary">Schrijf een review</a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta">
        <div className="container">
          <h2>Ontdek nu de geweldige aanbiedingen!</h2>
          <p>Mis deze kans niet en vraag vandaag nog een vrijblijvende offerte aan</p>
          <div className="cta-buttons">
            <a href="/#offerte" className="btn btn-primary btn-large">Offerte aanvragen</a>
            <a href="#" className="btn btn-secondary btn-large">Bel ons direct</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
