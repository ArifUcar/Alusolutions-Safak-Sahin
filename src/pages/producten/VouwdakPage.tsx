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
          <img src="/Vouwdak-halfopen.webp" alt="Vouwdak Veranda" />
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
              <img src="/Vouwdak-open-details.webp" alt="Vouwdak Veranda" />
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
            <img src="/Verdaca-binnenkant-open-4.webp" alt="Project 1" />
            <img src="/Vouwdak-halfopen.webp" alt="Project 2" />
            <img src="/Vouwdak-open-details.webp" alt="Project 3" />
            <img src="/cozy-patio-with-sofas-table-pergola-shade-patio-2048x1365.jpg.webp" alt="Project 4" />
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
