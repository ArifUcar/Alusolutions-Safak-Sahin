import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import '../../styles/ProductPage.css'

export default function SchuifwandPage() {
  return (
    <div className="product-page">
      <Header />
      <section className="product-hero">
        <div className="product-hero-bg">
          <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80" alt="Glazen Schuifwand" />
        </div>
        <div className="container product-hero-content">
          <h1>Glazen Schuifwand</h1>
          <p>Windvrij genieten met maximaal uitzicht</p>
        </div>
      </section>

      <section className="product-info">
        <div className="container">
          <div className="product-grid">
            <div className="product-content">
              <h2>Wat is een Glazen Schuifwand?</h2>
              <p>Een glazen schuifwand transformeert uw veranda tot een windvrije buitenkamer. De panelen schuiven eenvoudig opzij voor maximale ventilatie.</p>
              <p>Perfect als aanvulling op uw bestaande veranda of overkapping.</p>
              <h3>Voordelen</h3>
              <ul className="benefits-list">
                <li>Windvrij genieten</li>
                <li>Eenvoudig te openen</li>
                <li>Onbelemmerd uitzicht</li>
                <li>Verleng uw buitenseizoen</li>
                <li>Gehard veiligheidsglas</li>
                <li>Kindveilig slot</li>
              </ul>
            </div>
            <div className="product-image">
              <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80" alt="Glazen Schuifwand" />
            </div>
          </div>
        </div>
      </section>

      <section className="product-specs">
        <div className="container">
          <h2>Specificaties</h2>
          <div className="specs-grid">
            <div className="spec-item"><h4>Materiaal</h4><p>Aluminium rails met gehard glas</p></div>
            <div className="spec-item"><h4>Glasdikte</h4><p>8mm of 10mm gehard glas</p></div>
            <div className="spec-item"><h4>Systeem</h4><p>2, 3, 4 of 5 rails</p></div>
            <div className="spec-item"><h4>Hoogte</h4><p>Tot 3 meter</p></div>
            <div className="spec-item"><h4>Breedte per paneel</h4><p>Tot 1 meter</p></div>
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
            <img src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80" alt="Project 3" />
            <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80" alt="Project 4" />
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="container">
          <h2>Interesse in een Glazen Schuifwand?</h2>
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
