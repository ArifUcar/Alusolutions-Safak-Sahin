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
            src="/glasLux-home.webp"
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
              <img src="/Glazen-Overkapping.webp" alt="Luxe veranda" />
              <div className="gallery-overlay">
                <span className="gallery-category">Glazen Veranda</span>
                <h3>Moderne Glazen Veranda</h3>
                <p>Amsterdam</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/Overkapping-Helder-poly.webp" alt="Polycarbonaat" />
              <div className="gallery-overlay">
                <span className="gallery-category">Polycarbonaat</span>
                <h3>Klassieke Overkapping</h3>
                <p>Rotterdam</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/tuinkamer-antraciet-met-glazenwand-vast.webp" alt="Tuinkamer" />
              <div className="gallery-overlay">
                <span className="gallery-category">Tuinkamer</span>
                <h3>Sfeervolle Tuinkamer</h3>
                <p>Utrecht</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/lamellen-overkapping.webp" alt="Lamellen" />
              <div className="gallery-overlay">
                <span className="gallery-category">Lamellen</span>
                <h3>Lamellen Veranda</h3>
                <p>Den Haag</p>
              </div>
            </div>
            <div className="gallery-item large">
              <img src="/Vouwdak-halfopen.webp" alt="Vouwdak" />
              <div className="gallery-overlay">
                <span className="gallery-category">Vouwdak</span>
                <h3>Vouwdak Systeem</h3>
                <p>Eindhoven</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/Glazendak-cremewit-1.webp" alt="Modern" />
              <div className="gallery-overlay">
                <span className="gallery-category">Glazen Veranda</span>
                <h3>Strakke Lijnen</h3>
                <p>Tilburg</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/Tuinkamer-met-glazenschuifwanden-r96cf3vfsj301y31nv8v88rmlr026cvk5ly402n4i0.webp" alt="Luxe" />
              <div className="gallery-overlay">
                <span className="gallery-category">Tuinkamer</span>
                <h3>Luxe Uitstraling</h3>
                <p>Groningen</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/antra-veranda-PC5-1.webp" alt="Klassiek" />
              <div className="gallery-overlay">
                <span className="gallery-category">Polycarbonaat</span>
                <h3>Tijdloos Design</h3>
                <p>Almere</p>
              </div>
            </div>
            <div className="gallery-item large">
              <img src="/glazen-schuifwand-5-rails.webp" alt="Schuifwand" />
              <div className="gallery-overlay">
                <span className="gallery-category">Glazen Schuifwand</span>
                <h3>Glazen Schuifwand</h3>
                <p>Breda</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/Lamellen-dak-open.webp" alt="Elegant" />
              <div className="gallery-overlay">
                <span className="gallery-category">Lamellen</span>
                <h3>Elegante Lamellen</h3>
                <p>Nijmegen</p>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/Polycarbonaat-kleuren.webp" alt="Compact" />
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
                <img src="/Glazen-Overkapping.webp" alt="Project 1" />
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
                <img src="/tuinkamer-antraciet-met-glazenwand-vast.webp" alt="Project 2" />
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
                <img src="/Lamellen-dak-open.webp" alt="Project 3" />
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
                  <img src="/Grondstof-Polycarbonaat.webp" alt="Voor" />
                  <span>Voor</span>
                </div>
                <div className="after">
                  <img src="/Glazen-Overkapping.webp" alt="Na" />
                  <span>Na</span>
                </div>
              </div>
              <h3>Tuin Renovatie Rotterdam</h3>
            </div>
            <div className="transformation-item">
              <div className="transformation-images">
                <div className="before">
                  <img src="/cozy-patio-with-sofas-table-pergola-shade-patio-2048x1365.jpg.webp" alt="Voor" />
                  <span>Voor</span>
                </div>
                <div className="after">
                  <img src="/tuinkamer-antraciet-met-glazenwand-vast.webp" alt="Na" />
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
              <img src="/cube-Overkapping.webp" alt="Modern" />
              <h3>Modern</h3>
              <p>Strakke lijnen en minimalistisch design</p>
            </div>
            <div className="style-card">
              <img src="/Glazendak-cremewit-1.webp" alt="Klassiek" />
              <h3>Klassiek</h3>
              <p>Tijdloze elegantie en warmte</p>
            </div>
            <div className="style-card">
              <img src="/Overkapping-met-spie.webp" alt="Landelijk" />
              <h3>Landelijk</h3>
              <p>Natuurlijke materialen en gezelligheid</p>
            </div>
            <div className="style-card">
              <img src="/LuxeLine-lamellendak-vrijstaand-dicht.webp" alt="Industrieel" />
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
