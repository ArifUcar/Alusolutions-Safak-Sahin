import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import '../../styles/ProductPage.css'

export default function LamellenPage() {
  return (
    <div className="product-page">
      <Header />
      <section className="product-hero">
        <div className="product-hero-bg">
          <img src="/lamellen-overkapping.webp" alt="Lamellen Veranda" />
        </div>
        <div className="container product-hero-content">
          <h1>Lamellen Veranda</h1>
          <p>Verstelbare zonwering voor optimaal comfort</p>
        </div>
      </section>

      <section className="product-info">
        <div className="container">
          <div className="product-grid">
            <div className="product-content">
              <h2>Wat is een Lamellen Veranda?</h2>
              <p>Een lamellen veranda biedt ultieme flexibiliteit. De draaibare lamellen reguleren zonlicht en ventilatie naar wens, van volledig open tot volledig gesloten.</p>
              <p>Perfect voor wie maximale controle wil over licht en schaduw gedurende de dag.</p>
              <h3>Voordelen</h3>
              <ul className="benefits-list">
                <li>Verstelbare lamellen (0-135°)</li>
                <li>Optimale zonwering</li>
                <li>Goede ventilatie</li>
                <li>Waterafvoer via lamellen</li>
                <li>Elektrisch bedienbaar</li>
                <li>Modern design</li>
              </ul>
            </div>
            <div className="product-image">
              <img src="/LAmellen-veranda-afstandbediening.webp" alt="Lamellen Veranda" />
            </div>
          </div>
        </div>
      </section>

      <section className="product-specs">
        <div className="container">
          <h2>Specificaties</h2>
          <div className="specs-grid">
            <div className="spec-item"><h4>Materiaal</h4><p>Aluminium frame en lamellen</p></div>
            <div className="spec-item"><h4>Bediening</h4><p>Elektrisch met afstandsbediening</p></div>
            <div className="spec-item"><h4>Rotatie</h4><p>0° tot 135° verstelbaar</p></div>
            <div className="spec-item"><h4>Frame kleuren</h4><p>Alle RAL kleuren mogelijk</p></div>
            <div className="spec-item"><h4>Maximale breedte</h4><p>Tot 6 meter per sectie</p></div>
            <div className="spec-item"><h4>Garantie</h4><p>10 jaar op constructie, 5 jaar op motor</p></div>
          </div>
        </div>
      </section>

      <section className="product-gallery">
        <div className="container">
          <h2>Projecten</h2>
          <div className="gallery-grid">
            <img src="/Lamellen-dak-open.webp" alt="Project 1" />
            <img src="/Ecoline-lamellendak-antraciet-open.webp" alt="Project 2" />
            <img src="/LuxeLine-lamellendak-vrijstaand-dicht.webp" alt="Project 3" />
            <img src="/lamellen-overkapping.webp" alt="Project 4" />
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="container">
          <h2>Interesse in een Lamellen Veranda?</h2>
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
