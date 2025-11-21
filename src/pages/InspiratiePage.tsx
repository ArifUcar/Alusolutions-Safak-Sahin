import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/InspiratiePage.css'

export default function InspiratiePage() {
  return (
    <div className="inspiratie-page">
      <Header />

      {/* Hero Section */}
      <section className="inspiratie-hero">
        <div className="inspiratie-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
            alt="Inspiratie"
          />
        </div>
        <div className="container inspiratie-hero-content">
          <h1>Inspiratie</h1>
          <p>Ontdek onze prachtige projecten en laat u inspireren</p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-buttons">
            <button className="filter-btn active">Alle projecten</button>
            <button className="filter-btn">Polycarbonaat</button>
            <button className="filter-btn">Glazen Veranda</button>
            <button className="filter-btn">Lamellen</button>
            <button className="filter-btn">Vouwdak</button>
            <button className="filter-btn">Tuinkamer</button>
          </div>
        </div>
      </section>

      {/* Main Gallery */}
      <section className="main-gallery">
        <div className="container">
          <div className="gallery-masonry">
            <div className="gallery-item large">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" alt="Luxe veranda" />
              <div className="gallery-overlay">
                <span className="gallery-category">Glazen Veranda</span>
                <h3>Moderne Glazen Veranda</h3>
                <p>Amsterdam</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80" alt="Polycarbonaat" />
              <div className="gallery-overlay">
                <span className="gallery-category">Polycarbonaat</span>
                <h3>Klassieke Overkapping</h3>
                <p>Rotterdam</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" alt="Tuinkamer" />
              <div className="gallery-overlay">
                <span className="gallery-category">Tuinkamer</span>
                <h3>Sfeervolle Tuinkamer</h3>
                <p>Utrecht</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80" alt="Lamellen" />
              <div className="gallery-overlay">
                <span className="gallery-category">Lamellen</span>
                <h3>Lamellen Veranda</h3>
                <p>Den Haag</p>
              </div>
            </div>
            <div className="gallery-item large">
              <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80" alt="Vouwdak" />
              <div className="gallery-overlay">
                <span className="gallery-category">Vouwdak</span>
                <h3>Vouwdak Systeem</h3>
                <p>Eindhoven</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&q=80" alt="Modern" />
              <div className="gallery-overlay">
                <span className="gallery-category">Glazen Veranda</span>
                <h3>Strakke Lijnen</h3>
                <p>Tilburg</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80" alt="Luxe" />
              <div className="gallery-overlay">
                <span className="gallery-category">Tuinkamer</span>
                <h3>Luxe Uitstraling</h3>
                <p>Groningen</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" alt="Klassiek" />
              <div className="gallery-overlay">
                <span className="gallery-category">Polycarbonaat</span>
                <h3>Tijdloos Design</h3>
                <p>Almere</p>
              </div>
            </div>
            <div className="gallery-item large">
              <img src="https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80" alt="Schuifwand" />
              <div className="gallery-overlay">
                <span className="gallery-category">Glazen Schuifwand</span>
                <h3>Glazen Schuifwand</h3>
                <p>Breda</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80" alt="Elegant" />
              <div className="gallery-overlay">
                <span className="gallery-category">Lamellen</span>
                <h3>Elegante Lamellen</h3>
                <p>Nijmegen</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&q=80" alt="Compact" />
              <div className="gallery-overlay">
                <span className="gallery-category">Polycarbonaat</span>
                <h3>Compacte Oplossing</h3>
                <p>Arnhem</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="featured-projects">
        <div className="container">
          <h2>Uitgelichte Projecten</h2>
          <p className="section-subtitle">Bekijk onze meest bijzondere realisaties</p>

          <div className="featured-grid">
            <div className="featured-item">
              <div className="featured-image">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" alt="Project 1" />
              </div>
              <div className="featured-content">
                <span className="featured-category">Glazen Veranda</span>
                <h3>Villa Amsterdam</h3>
                <p>
                  Een prachtige glazen veranda voor een moderne villa in Amsterdam.
                  Met geïntegreerde LED-verlichting en elektrische zonwering.
                </p>
                <ul className="featured-specs">
                  <li>Afmeting: 6m x 4m</li>
                  <li>Materiaal: Aluminium frame</li>
                  <li>Glas: Gehard veiligheidsglas</li>
                </ul>
                <a href="#" className="btn btn-primary">Bekijk project</a>
              </div>
            </div>

            <div className="featured-item reverse">
              <div className="featured-image">
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80" alt="Project 2" />
              </div>
              <div className="featured-content">
                <span className="featured-category">Tuinkamer</span>
                <h3>Landelijke Tuinkamer</h3>
                <p>
                  Complete tuinkamer met glazen schuifwanden voor een landhuis.
                  Perfect voor het hele jaar door gebruik.
                </p>
                <ul className="featured-specs">
                  <li>Afmeting: 8m x 5m</li>
                  <li>Inclusief: Glazen schuifwanden</li>
                  <li>Extra: Vloerverwarming voorbereid</li>
                </ul>
                <a href="#" className="btn btn-primary">Bekijk project</a>
              </div>
            </div>

            <div className="featured-item">
              <div className="featured-image">
                <img src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80" alt="Project 3" />
              </div>
              <div className="featured-content">
                <span className="featured-category">Lamellen Veranda</span>
                <h3>Moderne Lamellen</h3>
                <p>
                  Innovatieve lamellen veranda met elektrische bediening.
                  Optimale controle over licht en schaduw.
                </p>
                <ul className="featured-specs">
                  <li>Afmeting: 5m x 3.5m</li>
                  <li>Bediening: Elektrisch met app</li>
                  <li>Kleur: Antraciet</li>
                </ul>
                <a href="#" className="btn btn-primary">Bekijk project</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before After Section */}
      <section className="before-after">
        <div className="container">
          <h2>Transformaties</h2>
          <p className="section-subtitle">Zie hoe wij buitenruimtes transformeren</p>

          <div className="transformation-grid">
            <div className="transformation-item">
              <div className="transformation-images">
                <div className="before">
                  <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" alt="Voor" />
                  <span>Voor</span>
                </div>
                <div className="after">
                  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80" alt="Na" />
                  <span>Na</span>
                </div>
              </div>
              <h3>Tuin Renovatie Rotterdam</h3>
            </div>
            <div className="transformation-item">
              <div className="transformation-images">
                <div className="before">
                  <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80" alt="Voor" />
                  <span>Voor</span>
                </div>
                <div className="after">
                  <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" alt="Na" />
                  <span>Na</span>
                </div>
              </div>
              <h3>Terras Uitbreiding Utrecht</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Styles Section */}
      <section className="styles-section">
        <div className="container">
          <h2>Stijlen & Materialen</h2>
          <div className="styles-grid">
            <div className="style-card">
              <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&q=80" alt="Modern" />
              <h3>Modern</h3>
              <p>Strakke lijnen en minimalistisch design</p>
            </div>
            <div className="style-card">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80" alt="Klassiek" />
              <h3>Klassiek</h3>
              <p>Tijdloze elegantie en warmte</p>
            </div>
            <div className="style-card">
              <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500&q=80" alt="Landelijk" />
              <h3>Landelijk</h3>
              <p>Natuurlijke materialen en gezelligheid</p>
            </div>
            <div className="style-card">
              <img src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=500&q=80" alt="Industrieel" />
              <h3>Industrieel</h3>
              <p>Robuust en stoer karakter</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="inspiratie-cta">
        <div className="container">
          <h2>Geïnspireerd geraakt?</h2>
          <p>Laat ons uw droomveranda realiseren. Vraag een vrijblijvende offerte aan!</p>
          <div className="cta-buttons">
            <a href="/#offerte" className="btn btn-primary btn-large">Offerte aanvragen</a>
            <Link to="/contact" className="btn btn-secondary btn-large">Neem contact op</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
