import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/ProductPage.css'

export default function ShowroomPage() {
  return (
    <div className="product-page">
      <Header />
      <section className="product-hero">
        <div className="product-hero-bg">
          <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80" alt="Showroom" />
        </div>
        <div className="container product-hero-content">
          <h1>Bezoek onze Showroom</h1>
          <p>Bekijk en ervaar onze veranda's in het echt</p>
        </div>
      </section>

      <section className="product-info">
        <div className="container">
          <div className="product-grid">
            <div className="product-content">
              <h2>Welkom in onze Showroom</h2>
              <p>In onze showroom kunt u diverse veranda's en overkappingen bekijken en ervaren. Onze adviseurs staan klaar om al uw vragen te beantwoorden.</p>
              <p>Maak een afspraak voor persoonlijk advies of kom langs tijdens openingstijden.</p>
              <h3>Openingstijden</h3>
              <ul className="benefits-list">
                <li>Maandag - Donderdag: 09:00 - 17:00</li>
                <li>Vrijdag: Gesloten</li>
                <li>Zaterdag: 10:00 - 15:00</li>
                <li>Zondag: Gesloten</li>
              </ul>
              <h3>Adres</h3>
              <p>Mariastraat 22<br/>5953 NL Reuver</p>
            </div>
            <div className="product-image">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2498.5!2d6.0789!3d51.2876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c74b8a5c8b1a1f%3A0x1234567890abcdef!2sMariastraat%2022%2C%205953%20NL%20Reuver%2C%20Netherlands!5e0!3m2!1sen!2snl!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '10px' }}
                allowFullScreen
                loading="lazy"
                title="Showroom Locatie"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="container">
          <h2>Maak een afspraak</h2>
          <p>Plan uw bezoek aan onze showroom</p>
          <div className="cta-buttons">
            <Link to="/afspraak" className="btn btn-primary btn-large">Afspraak maken</Link>
            <a href="tel:+31850605036" className="btn btn-secondary btn-large">Bel ons</a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
