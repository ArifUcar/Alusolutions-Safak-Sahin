import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import '../../styles/ProductPage.css'

export default function VouwdakPage() {
  return (
    <div className="product-page">
      <Header />
      <section className="product-hero">
        <div className="product-hero-bg">
          <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80" alt="Vouwdak Veranda" />
        </div>
        <div className="container product-hero-content">
          <h1>Vouwdak Veranda</h1>
          <p>Flexibel opvouwbaar voor elk seizoen</p>
        </div>
      </section>

      <section className="product-info">
        <div className="container">
          <div className="product-grid">
            <div className="product-content">
              <h2>Wat is een Vouwdak Veranda?</h2>
              <p>Een vouwdak veranda combineert bescherming met flexibiliteit. Het doek kan elektrisch open en dicht worden geschoven, zodat u zelf bepaalt wanneer u onder de blote hemel zit.</p>
              <p>Ideaal voor wie het beste van beide werelden wil: beschutting wanneer nodig, open lucht wanneer gewenst.</p>
              <h3>Voordelen</h3>
              <ul className="benefits-list">
                <li>Volledig opvouwbaar</li>
                <li>Elektrische bediening</li>
                <li>Water- en UV-werend doek</li>
                <li>Sfeervolle uitstraling</li>
                <li>Ingebouwde LED-verlichting mogelijk</li>
                <li>Windbestendig tot 6 Beaufort</li>
              </ul>
            </div>
            <div className="product-image">
              <img src="https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80" alt="Vouwdak Veranda" />
            </div>
          </div>
        </div>
      </section>

      <section className="product-specs">
        <div className="container">
          <h2>Specificaties</h2>
          <div className="specs-grid">
            <div className="spec-item"><h4>Materiaal</h4><p>Aluminium frame met PVC doek</p></div>
            <div className="spec-item"><h4>Bediening</h4><p>Elektrisch met afstandsbediening</p></div>
            <div className="spec-item"><h4>Doek</h4><p>Weerbestendig, UV-werend PVC</p></div>
            <div className="spec-item"><h4>Doek kleuren</h4><p>Wit, crème, grijs of antraciet</p></div>
            <div className="spec-item"><h4>Maximale breedte</h4><p>Tot 7 meter</p></div>
            <div className="spec-item"><h4>Garantie</h4><p>10 jaar op frame, 5 jaar op doek</p></div>
          </div>
        </div>
      </section>

      <section className="product-gallery">
        <div className="container">
          <h2>Projecten</h2>
          <div className="gallery-grid">
            <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80" alt="Project 1" />
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80" alt="Project 2" />
            <img src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&q=80" alt="Project 3" />
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" alt="Project 4" />
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="container">
          <h2>Interesse in een Vouwdak Veranda?</h2>
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
