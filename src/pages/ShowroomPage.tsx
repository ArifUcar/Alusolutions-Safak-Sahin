import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/ProductPage.css'

export default function ShowroomPage() {
  return (
    <div className="product-page">
      <Helmet>
        <title>Showroom Bezoeken | VivaVerandas Reuver</title>
        <meta name="description" content="Bezoek onze showroom in Reuver en bekijk onze veranda's en overkappingen in het echt. Persoonlijk advies van onze experts." />
        <link rel="canonical" href="https://vivaverandas.nl/showroom" />
        <meta property="og:title" content="Showroom Bezoeken | VivaVerandas" />
        <meta property="og:description" content="Bezoek onze showroom in Reuver en bekijk onze veranda's en overkappingen in het echt." />
        <meta property="og:url" content="https://vivaverandas.nl/showroom" />
      </Helmet>

      <Header />
      <section className="product-hero">
        <div className="product-hero-bg">
          <img src="/alusolutions-ons-project-1.webp" alt="Showroom" />
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2500!2d6.082766!3d51.280102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c74f53a508958d%3A0x618238c611b6b837!2sAluSolutions%20%7C%20Veranda's%20%26%20Overkappingen!5e0!3m2!1snl!2snl!4v1703000000000"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '10px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
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
            <a href="tel:+31773902201" className="btn btn-secondary btn-large">Bel ons</a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
