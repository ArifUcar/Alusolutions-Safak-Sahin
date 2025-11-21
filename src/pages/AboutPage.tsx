import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/AboutPage.css'

export default function AboutPage() {
  return (
    <div className="about-page">
      <Header />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
            alt="Over AluSolutions"
          />
        </div>
        <div className="container about-hero-content">
          <h1>Over Ons</h1>
          <p>Uw partner voor hoogwaardige terrasoplossingen</p>
        </div>
      </section>

      {/* Who Are We */}
      <section className="who-are-we">
        <div className="container">
          <div className="who-wrapper">
            <div className="who-content">
              <h2>Wie zijn wij?</h2>
              <p>
                Wij zijn een toonaangevend bedrijf dat gespecialiseerd is in het leveren van stijlvolle
                en duurzame terrasoplossingen. Met trots bieden we een breed assortiment aan hoogwaardige
                producten, waaronder veranda's, glazen schuifwanden en zijwanden, om uw buitenruimte te
                transformeren in een oase van comfort en schoonheid.
              </p>
              <p>
                Aarzel niet langer en neem vandaag nog contact met ons op om uw offerte aan te vragen.
                Samen maken we van uw buitenruimte een plek waar u volop kunt genieten, ongeacht het weer!
              </p>
              <Link to="/#offerte" className="btn btn-primary">Vraag offerte aan</Link>
            </div>
            <div className="who-image">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                alt="AluSolutions team"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="quality-section">
        <div className="container">
          <div className="quality-wrapper">
            <div className="quality-image">
              <img
                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80"
                alt="Kwaliteit en vakmanschap"
              />
            </div>
            <div className="quality-content">
              <h2>Kwaliteit en vakmanschap</h2>
              <p>
                Bij Alusolutions hechten we veel waarde aan kwaliteit en vakmanschap. Onze producten
                zijn vervaardigd met hoogwaardige materialen en innovatieve technologieën, wat resulteert
                in duurzame en betrouwbare oplossingen. Onze toegewijde en ervaren teamleden staan altijd
                klaar om u te adviseren en te begeleiden bij het maken van de beste keuzes voor uw
                specifieke situatie.
              </p>
              <p>
                We streven naar klanttevredenheid en nemen elke uitdaging met enthousiasme aan. Vanaf
                het eerste contact tot de installatie en nazorg, wij streven ernaar om een uitstekende
                service te bieden en een langdurige relatie met onze klanten op te bouwen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="features-banner">
        <div className="container">
          <h2>Ontdek onze tijdloze en elegante terrasoplossingen</h2>
          <p>
            Laat uw buitenruimte stralen met onze stijlvolle veranda's en glazen schuifwanden,
            die een tijdloze en elegante uitstraling toevoegen aan uw woning.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="about-benefits">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">📐</div>
              <h3>Maatwerk terrasoplossingen</h3>
              <p>
                Bij Alusolutions geloven we in maatwerk. Wij ontwerpen en creëren terrasoplossingen
                die perfect passen bij uw specifieke wensen, zodat u kunt genieten van een buitenruimte
                die helemaal van u is.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌟</div>
              <h3>Verbeter uw buitenbeleving</h3>
              <p>
                Onze hoogwaardige terrasoplossingen verbeteren uw buitenbeleving, zodat u optimaal
                kunt genieten van het buitenleven in alle seizoenen.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🛡️</div>
              <h3>Comfort en bescherming</h3>
              <p>
                Onze terrasoplossingen bieden niet alleen comfort, maar beschermen u ook tegen weer
                en wind, zodat u zorgeloos kunt genieten van uw buitenruimte.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Create Your Oasis */}
      <section className="oasis-section">
        <div className="oasis-bg">
          <img
            src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80"
            alt="Buitenoase"
          />
        </div>
        <div className="container oasis-content">
          <h2>Creëer Uw Buitenoase</h2>
          <p>
            Bij Alusolutions streven we ernaar om uw buitenruimte te transformeren in een oase van
            comfort, stijl en elegantie. Met op maat gemaakte terrasoplossingen en hoogwaardige
            producten, maken we uw droomproject werkelijkheid. Vraag vandaag nog een offerte aan
            en ontdek de mogelijkheden voor uw unieke buitenomgeving.
          </p>
          <Link to="/#offerte" className="btn btn-primary btn-large">Gratis Offerte Aanvragen</Link>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Ons Team</h2>
          <p className="section-subtitle">Maak kennis met onze ervaren professionals</p>
          <div className="team-grid">
            <div className="team-member">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" alt="Team member" />
              <h3>Jan van der Berg</h3>
              <span>Directeur</span>
            </div>
            <div className="team-member">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" alt="Team member" />
              <h3>Lisa de Jong</h3>
              <span>Sales Manager</span>
            </div>
            <div className="team-member">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" alt="Team member" />
              <h3>Mark Jansen</h3>
              <span>Hoofd Monteur</span>
            </div>
            <div className="team-member">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" alt="Team member" />
              <h3>Emma Bakker</h3>
              <span>Klantenservice</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Onze Waarden</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">🎯</div>
              <h3>Kwaliteit</h3>
              <p>Alleen de beste materialen en vakmanschap</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🤝</div>
              <h3>Betrouwbaarheid</h3>
              <p>Afspraken komen wij altijd na</p>
            </div>
            <div className="value-item">
              <div className="value-icon">💡</div>
              <h3>Innovatie</h3>
              <p>Continue verbetering van onze producten</p>
            </div>
            <div className="value-item">
              <div className="value-icon">❤️</div>
              <h3>Klanttevredenheid</h3>
              <p>Uw tevredenheid is onze prioriteit</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <h2>Klaar om te beginnen?</h2>
          <p>Neem vandaag nog contact met ons op voor een vrijblijvende offerte</p>
          <div className="cta-buttons">
            <Link to="/#offerte" className="btn btn-primary btn-large">Offerte aanvragen</Link>
            <Link to="/#contact" className="btn btn-secondary btn-large">Contact opnemen</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
