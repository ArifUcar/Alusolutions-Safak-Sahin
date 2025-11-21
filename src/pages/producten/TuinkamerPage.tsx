import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import '../../styles/ProductPage.css'

export default function TuinkamerPage() {
  return (
    <div className="product-page">
      <Header />
      <section className="product-hero">
        <div className="product-hero-bg">
          <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80" alt="Tuinkamer" />
        </div>
        <div className="container product-hero-content">
          <h1>Tuinkamer</h1>
          <p>Het hele jaar genieten van uw tuin</p>
        </div>
      </section>

      <section className="product-info">
        <div className="container">
          <div className="product-grid">
            <div className="product-content">
              <h2>Wat is een Tuinkamer?</h2>
              <p>Een tuinkamer is een volledig afgesloten veranda waarmee u het hele jaar door kunt genieten van uw tuin, ongeacht het weer.</p>
              <p>Perfect als extra leefruimte, werkplek of hobbyruimte met uitzicht op de tuin.</p>
              <h3>Voordelen</h3>
              <ul className="benefits-list">
                <li>Het hele jaar bruikbaar</li>
                <li>Extra leefruimte</li>
                <li>Volledig geïsoleerd</li>
                <li>Verwarming mogelijk</li>
                <li>Verhoogt woningwaarde</li>
                <li>Diverse afwerkingen</li>
              </ul>
            </div>
            <div className="product-image">
              <img src="https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80" alt="Tuinkamer" />
            </div>
          </div>
        </div>
      </section>

      <section className="product-specs">
        <div className="container">
          <h2>Specificaties</h2>
          <div className="specs-grid">
            <div className="spec-item"><h4>Materiaal</h4><p>Geïsoleerd aluminium systeem</p></div>
            <div className="spec-item"><h4>Beglazing</h4><p>HR++ isolatieglas</p></div>
            <div className="spec-item"><h4>Dak</h4><p>Geïsoleerde dakpanelen</p></div>
            <div className="spec-item"><h4>Deuren</h4><p>Schuif- of vouwdeuren</p></div>
            <div className="spec-item"><h4>Afmetingen</h4><p>Volledig op maat</p></div>
            <div className="spec-item"><h4>Garantie</h4><p>10 jaar</p></div>
          </div>
        </div>
      </section>

      <section className="product-gallery">
        <div className="container">
          <h2>Projecten</h2>
          <div className="gallery-grid">
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" alt="Project 1" />
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80" alt="Project 2" />
            <img src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&q=80" alt="Project 3" />
            <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80" alt="Project 4" />
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="container">
          <h2>Interesse in een Tuinkamer?</h2>
          <p>Vraag vrijblijvend een offerte aan</p>
          <div className="cta-buttons">
            <Link to="/offerte" className="btn btn-primary btn-large">Offerte aanvragen</Link>
            <Link to="/afspraak" className="btn btn-secondary btn-large">Afspraak maken</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
