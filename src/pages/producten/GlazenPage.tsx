import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import '../../styles/ProductPage.css'

export default function GlazenPage() {
  return (
    <div className="product-page">
      <Header />
      <section className="product-hero">
        <div className="product-hero-bg">
          <img src="/Glazen-Overkapping.webp" alt="Glazen Veranda" />
        </div>
        <div className="container product-hero-content">
          <h1>Glazen Veranda</h1>
          <p>Maximale transparantie en luxe uitstraling</p>
        </div>
      </section>

      <section className="product-info">
        <div className="container">
          <div className="product-grid">
            <div className="product-content">
              <h2>Wat is een Glazen Veranda?</h2>
              <p>Een glazen veranda biedt maximale lichtinval en een onbelemmerd uitzicht op uw tuin. Het gehard glas is veilig, sterk en gemakkelijk te reinigen.</p>
              <p>Bij AluSolutions gebruiken we uitsluitend hoogwaardig gehard glas dat voldoet aan alle veiligheidsnormen.</p>
              <h3>Voordelen</h3>
              <ul className="benefits-list">
                <li>Maximale lichtinval</li>
                <li>Onbelemmerd uitzicht</li>
                <li>Luxe uitstraling</li>
                <li>Gehard veiligheidsglas</li>
                <li>Zelfreinigend glas beschikbaar</li>
                <li>Lange levensduur</li>
              </ul>
            </div>
            <div className="product-image">
              <img src="/glasLux-home.webp" alt="Glazen Veranda" />
            </div>
          </div>
        </div>
      </section>

      <section className="product-specs">
        <div className="container">
          <h2>Specificaties</h2>
          <div className="specs-grid">
            <div className="spec-item"><h4>Materiaal</h4><p>Aluminium frame met gehard glas</p></div>
            <div className="spec-item"><h4>Glasdikte</h4><p>8mm gehard veiligheidsglas</p></div>
            <div className="spec-item"><h4>Opties</h4><p>Helder, getint of zelfreinigend</p></div>
            <div className="spec-item"><h4>Frame kleuren</h4><p>Alle RAL kleuren mogelijk</p></div>
            <div className="spec-item"><h4>Maximale breedte</h4><p>Tot 6 meter</p></div>
            <div className="spec-item"><h4>Garantie</h4><p>10 jaar op constructie</p></div>
          </div>
        </div>
      </section>

      <section className="product-gallery">
        <div className="container">
          <h2>Projecten</h2>
          <div className="gallery-grid">
            <img src="/Glazendak-cremewit-1.webp" alt="Project 1" />
            <img src="/Antra-veranda-GC3-1-300x300.webp" alt="Project 2" />
            <img src="/antra-veranda-GCD5-300x300.webp" alt="Project 3" />
            <img src="/Glazenwand-1.webp" alt="Project 4" />
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="container">
          <h2>Interesse in een Glazen Veranda?</h2>
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
