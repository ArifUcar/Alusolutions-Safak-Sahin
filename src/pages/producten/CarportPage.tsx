import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import '../../styles/ProductPage.css'

export default function CarportPage() {
  return (
    <div className="product-page">
      <Header />
      <section className="product-hero">
        <div className="product-hero-bg">
          <img src="/antra-veranda-PHCAR9-300x300.webp" alt="Carport" />
        </div>
        <div className="container product-hero-content">
          <h1>Carport</h1>
          <p>Bescherm uw auto stijlvol</p>
        </div>
      </section>

      <section className="product-info">
        <div className="container">
          <div className="product-grid">
            <div className="product-content">
              <h2>Wat is een Carport?</h2>
              <p>Een aluminium carport beschermt uw auto tegen regen, sneeuw, hagel en UV-straling. Stijlvol en duurzaam, een waardevolle toevoeging aan uw woning.</p>
              <p>Verkrijgbaar voor één of meerdere auto's, volledig op maat gemaakt.</p>
              <h3>Voordelen</h3>
              <ul className="benefits-list">
                <li>Bescherming tegen weer</li>
                <li>Onderhoudsvrij aluminium</li>
                <li>Verhoogt woningwaarde</li>
                <li>Diverse dakopties</li>
                <li>Op maat gemaakt</li>
                <li>Snelle montage</li>
              </ul>
            </div>
            <div className="product-image">
              <img src="/Overkapping-met-spie.webp" alt="Carport" />
            </div>
          </div>
        </div>
      </section>

      <section className="product-specs">
        <div className="container">
          <h2>Specificaties</h2>
          <div className="specs-grid">
            <div className="spec-item"><h4>Materiaal</h4><p>Aluminium constructie</p></div>
            <div className="spec-item"><h4>Dakopties</h4><p>Polycarbonaat of aluminium</p></div>
            <div className="spec-item"><h4>Capaciteit</h4><p>1, 2 of meer auto's</p></div>
            <div className="spec-item"><h4>Frame kleuren</h4><p>Alle RAL kleuren mogelijk</p></div>
            <div className="spec-item"><h4>Afmetingen</h4><p>Op maat gemaakt</p></div>
            <div className="spec-item"><h4>Garantie</h4><p>10 jaar</p></div>
          </div>
        </div>
      </section>

      <section className="product-gallery">
        <div className="container">
          <h2>Projecten</h2>
          <div className="gallery-grid">
            <img src="/antra-veranda-PHCAR9-300x300.webp" alt="Project 1" />
            <img src="/Overkapping-met-spie.webp" alt="Project 2" />
            <img src="/Overkapping-Helder-poly.webp" alt="Project 3" />
            <img src="/antra-veranda-PC5-1.webp" alt="Project 4" />
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="container">
          <h2>Interesse in een Carport?</h2>
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
