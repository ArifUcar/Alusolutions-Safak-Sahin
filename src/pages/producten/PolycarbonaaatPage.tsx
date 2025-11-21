import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import '../../styles/ProductPage.css'

export default function PolycarbonaatPage() {
  return (
    <div className="product-page">
      <Header />

      {/* Hero */}
      <section className="product-hero">
        <div className="product-hero-bg">
          <img src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1920&q=80" alt="Polycarbonaat Veranda" />
        </div>
        <div className="container product-hero-content">
          <h1>Polycarbonaat Veranda</h1>
          <p>Duurzaam, betaalbaar en lichtdoorlatend</p>
        </div>
      </section>

      {/* Product Info */}
      <section className="product-info">
        <div className="container">
          <div className="product-grid">
            <div className="product-content">
              <h2>Wat is een Polycarbonaat Veranda?</h2>
              <p>
                Een polycarbonaat veranda is de ideale keuze voor wie op zoek is naar een duurzame
                en betaalbare terrasoverkapping. Dankzij de sterke en heldere polycarbonaat dakplaten
                geniet je van veel lichtinval, zonder in te leveren op bescherming tegen regen en wind.
              </p>
              <p>
                Bij AluSolutions leveren wij jouw polycarbonaat veranda volledig afgestemd op jouw wensen.
                Binnen 3 weken zorgen onze verandabouwers voor een snelle levering en vakkundige plaatsing.
              </p>

              <h3>Voordelen</h3>
              <ul className="benefits-list">
                <li>Uitstekende lichtdoorlatendheid</li>
                <li>UV-bestendig en weerbestendig</li>
                <li>Lichtgewicht maar sterk</li>
                <li>Betaalbare optie</li>
                <li>Makkelijk te onderhouden</li>
                <li>Lange levensduur (10-15 jaar)</li>
              </ul>
            </div>
            <div className="product-image">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" alt="Polycarbonaat Veranda voorbeeld" />
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="product-specs">
        <div className="container">
          <h2>Specificaties</h2>
          <div className="specs-grid">
            <div className="spec-item">
              <h4>Materiaal</h4>
              <p>Aluminium frame met polycarbonaat platen</p>
            </div>
            <div className="spec-item">
              <h4>Dikte platen</h4>
              <p>16mm of 32mm kanaalplaten</p>
            </div>
            <div className="spec-item">
              <h4>Kleuren</h4>
              <p>Helder, opaal of getint</p>
            </div>
            <div className="spec-item">
              <h4>Frame kleuren</h4>
              <p>Antraciet, wit, crème of RAL kleur</p>
            </div>
            <div className="spec-item">
              <h4>Maximale breedte</h4>
              <p>Tot 7 meter</p>
            </div>
            <div className="spec-item">
              <h4>Garantie</h4>
              <p>10 jaar op constructie</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="product-gallery">
        <div className="container">
          <h2>Projecten</h2>
          <div className="gallery-grid">
            <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80" alt="Project 1" />
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" alt="Project 2" />
            <img src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80" alt="Project 3" />
            <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80" alt="Project 4" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="product-cta">
        <div className="container">
          <h2>Interesse in een Polycarbonaat Veranda?</h2>
          <p>Vraag vrijblijvend een offerte aan of maak een afspraak voor advies op maat</p>
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
