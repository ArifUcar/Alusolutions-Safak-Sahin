import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import '../../styles/ProductPage.css'

export default function CubePage() {
  return (
    <div className="product-page">
      <Header />
      <section className="product-hero">
        <div className="product-hero-bg">
          <img src="/cube-Overkapping.webp" alt="Cube Veranda" />
        </div>
        <div className="container product-hero-content">
          <h1>Cube Veranda</h1>
          <p>Strak modern design voor uw tuin</p>
        </div>
      </section>

      <section className="product-info">
        <div className="container">
          <div className="product-grid">
            <div className="product-content">
              <h2>Wat is een Cube Veranda?</h2>
              <p>De Cube veranda is het toppunt van modern design. Met strakke lijnen en een minimalistische uitstraling past deze perfecte kubus in elke moderne tuin.</p>
              <p>Vrijstaand of tegen de woning, de Cube maakt altijd indruk.</p>
              <h3>Voordelen</h3>
              <ul className="benefits-list">
                <li>Ultra modern design</li>
                <li>Vrijstaand mogelijk</li>
                <li>Strakke afwerking</li>
                <li>Ingebouwde LED-verlichting</li>
                <li>Diverse dakopties</li>
                <li>Windschermen mogelijk</li>
              </ul>
            </div>
            <div className="product-image">
              <img src="/cube-veranda.webp" alt="Cube Veranda" />
            </div>
          </div>
        </div>
      </section>

      <section className="product-specs">
        <div className="container">
          <h2>Specificaties</h2>
          <div className="specs-grid">
            <div className="spec-item"><h4>Materiaal</h4><p>Premium aluminium constructie</p></div>
            <div className="spec-item"><h4>Dakopties</h4><p>Glas, lamellen of polycarbonaat</p></div>
            <div className="spec-item"><h4>Design</h4><p>Minimalistisch kubusvorm</p></div>
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
            <img src="/cube-Overkapping.webp" alt="Project 1" />
            <img src="/cube-veranda.webp" alt="Project 2" />
            <img src="/LuxeLine-lamellendak-vrijstaand-dicht.webp" alt="Project 3" />
            <img src="/cozy-patio-with-sofas-table-pergola-shade-patio-2048x1365.jpg.webp" alt="Project 4" />
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="container">
          <h2>Interesse in een Cube Veranda?</h2>
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
