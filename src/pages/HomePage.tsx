import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/HomePage.css'

export default function HomePage() {
  return (
    <div className="home-page">
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
            alt="Modern veranda"
          />
        </div>
        <div className="container hero-content">
          <h2>Polycarbonaat veranda</h2>
          <p>
            Een polycarbonaat veranda is de ideale keuze voor wie op zoek is naar een duurzame
            en betaalbare terrasoverkapping. Dankzij de sterke en heldere polycarbonaat dakplaten
            geniet je van veel lichtinval, zonder in te leveren op bescherming tegen regen en wind.
          </p>
          <p>
            Bij AluSolutions leveren wij jouw polycarbonaat veranda volledig afgestemd op jouw wensen.
            Binnen 3 weken zorgen onze verandabouwers voor een snelle levering en vakkundige plaatsing.
          </p>
          <a href="#offerte" className="btn btn-primary btn-large">Vraag eenvoudig een offerte aan!</a>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="gallery-preview">
        <div className="container">
          <div className="gallery-grid">
            <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80" alt="Glazen overkapping" />
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" alt="Aluminium veranda" />
            <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80" alt="Tuinkamer met veranda" />
            <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80" alt="Moderne overkapping" />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products" id="diensten">
        <div className="container">
          <h2>Onze Producten</h2>
          <p className="section-subtitle">Ontdek ons complete assortiment hoogwaardige veranda's en overkappingen</p>

          <div className="products-grid">
            <div className="product-card">
              <img src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=500&q=80" alt="Polycarbonaat Veranda" />
              <div className="product-content">
                <h3>Polycarbonaat Veranda</h3>
                <p>Duurzaam en betaalbaar met uitstekende lichtdoorlatendheid</p>
                <a href="#" className="btn btn-primary">Meer info</a>
              </div>
            </div>
            <div className="product-card">
              <img src="https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=500&q=80" alt="Glazen Veranda" />
              <div className="product-content">
                <h3>Glazen Veranda</h3>
                <p>Maximale transparantie voor een luxe uitstraling</p>
                <a href="#" className="btn btn-primary">Meer info</a>
              </div>
            </div>
            <div className="product-card">
              <img src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=500&q=80" alt="Lamellen Veranda" />
              <div className="product-content">
                <h3>Lamellen Veranda</h3>
                <p>Verstelbare lamellen voor optimale zonwering</p>
                <a href="#" className="btn btn-primary">Meer info</a>
              </div>
            </div>
            <div className="product-card">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80" alt="Vouwdak Veranda" />
              <div className="product-content">
                <h3>Vouwdak Veranda</h3>
                <p>Flexibel opvouwbaar dak voor elk seizoen</p>
                <a href="#" className="btn btn-primary">Meer info</a>
              </div>
            </div>
            <div className="product-card">
              <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500&q=80" alt="Glazen Schuifwand" />
              <div className="product-content">
                <h3>Glazen Schuifwand</h3>
                <p>Naadloze overgang tussen binnen en buiten</p>
                <a href="#" className="btn btn-primary">Meer info</a>
              </div>
            </div>
            <div className="product-card">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80" alt="Tuinkamer" />
              <div className="product-content">
                <h3>Tuinkamer</h3>
                <p>Complete uitbreiding van uw woonruimte</p>
                <a href="#" className="btn btn-primary">Meer info</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Benefits */}
      <section className="benefits">
        <div className="container">
          <h2>Ervaar de unieke voordelen van een polycarbonaat veranda</h2>

          <div className="benefits-wrapper">
            <div className="benefits-image">
              <img src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80" alt="Elegante veranda" />
            </div>
            <div className="benefits-content">
              <h3>Betaalbare elegantie met onze polycarbonaat veranda's</h3>
              <p>
                De investering in een polycarbonaat veranda is afhankelijk van meerdere factoren,
                zoals de afmetingen van de constructie en de keuze voor aanvullende opties zoals
                ingebouwde LED-spots, zijwanden of schuifdeuren.
              </p>
              <p>
                Wij begrijpen dat de keuze voor een veranda een belangrijke beslissing is die afgestemd
                moet zijn op zowel uw budget als uw levensstijl. Daarom bieden we persoonlijk advies
                en gedetailleerde informatie over de mogelijkheden en kosten.
              </p>
              <a href="#contact" className="btn btn-primary">Neem contact op</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Features */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Jaar ervaring</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Tevreden klanten</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Projecten voltooid</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">7</span>
              <span className="stat-label">Jaar Garantie</span>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process">
        <div className="container">
          <h2>Hoe werkt het?</h2>
          <p className="section-subtitle">In 4 eenvoudige stappen naar uw droomveranda</p>

          <div className="process-grid">
            <div className="process-item">
              <div className="process-number">1</div>
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80" alt="Offerte aanvragen" />
              <h3>Offerte Aanvragen</h3>
              <p>Vul ons formulier in met uw wensen en ontvang binnen 24 uur een vrijblijvende offerte.</p>
            </div>
            <div className="process-item">
              <div className="process-number">2</div>
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80" alt="Persoonlijk advies" />
              <h3>Persoonlijk Advies</h3>
              <p>Onze experts komen bij u langs voor een gratis inmeting en advies op maat.</p>
            </div>
            <div className="process-item">
              <div className="process-number">3</div>
              <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80" alt="Productie" />
              <h3>Productie</h3>
              <p>Uw veranda wordt op maat gemaakt in onze eigen productie faciliteit.</p>
            </div>
            <div className="process-item">
              <div className="process-number">4</div>
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80" alt="Installatie" />
              <h3>Installatie</h3>
              <p>Binnen 3 weken wordt uw veranda vakkundig geplaatst door onze monteurs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Affordable Quality */}
      <section className="quality">
        <div className="container">
          <div className="quality-wrapper">
            <div className="quality-content">
              <h2>Betaalbare kwaliteit polycarbonaat veranda's</h2>
              <p>
                De kosten van een polycarbonaat veranda hangen af van de grootte en extra's zoals spots,
                zijwanden of schuifdeuren. Toch is zo'n veranda een voordelige keuze die lang meegaat en
                er mooi uitziet.
              </p>
              <ul className="quality-list">
                <li>Kosten van materialen: goedkoper dan glas, economisch voordelig</li>
                <li>Lagere installatiekosten: eenvoudige installatie verlaagt arbeidskosten</li>
                <li>Duurzaamheid en onderhoud: langdurig met minimaal onderhoud</li>
                <li>Energie-efficiëntie: isolatie verlaagt energiekosten</li>
                <li>Veelzijdigheid: flexibel ontwerp, efficiënte productie</li>
              </ul>
            </div>
            <div className="quality-image">
              <img src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80" alt="Kwaliteit veranda" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features">
        <div className="container">
          <h2>Waarom kiezen voor AluSolutions?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🏆</div>
              <h3>Premium Kwaliteit</h3>
              <p>Alleen de beste materialen voor een langdurig resultaat</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🛠️</div>
              <h3>Vakkundige Montage</h3>
              <p>Ervaren monteurs voor een perfecte installatie</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📐</div>
              <h3>Op Maat Gemaakt</h3>
              <p>Elke veranda wordt speciaal voor u ontworpen</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💰</div>
              <h3>Scherpe Prijzen</h3>
              <p>Kwaliteit hoeft niet duur te zijn</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>Snelle Levering</h3>
              <p>Binnen 3 weken geplaatst</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤝</div>
              <h3>Persoonlijke Service</h3>
              <p>Direct contact met onze specialisten</p>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration Gallery */}
      <section className="inspiration" id="inspiratie">
        <div className="container">
          <h2>Inspiratie voor jouw veranda</h2>
          <div className="inspiration-grid">
            <div className="inspiration-item large">
              <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80" alt="Luxe veranda inspiratie" />
              <div className="inspiration-overlay">
                <span>Luxe Veranda</span>
              </div>
            </div>
            <div className="inspiration-item">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80" alt="Moderne stijl" />
              <div className="inspiration-overlay">
                <span>Modern</span>
              </div>
            </div>
            <div className="inspiration-item">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" alt="Klassieke stijl" />
              <div className="inspiration-overlay">
                <span>Klassiek</span>
              </div>
            </div>
            <div className="inspiration-item">
              <img src="https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&q=80" alt="Met glazen wanden" />
              <div className="inspiration-overlay">
                <span>Glazen Wanden</span>
              </div>
            </div>
            <div className="inspiration-item">
              <img src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&q=80" alt="Tuinkamer" />
              <div className="inspiration-overlay">
                <span>Tuinkamer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Gallery */}
      <section className="gallery-full">
        <div className="container">
          <h2>Recente Projecten</h2>
          <div className="gallery-full-grid">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80" alt="Project 1" />
            <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80" alt="Project 2" />
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" alt="Project 3" />
            <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80" alt="Project 4" />
            <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80" alt="Project 5" />
            <img src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&q=80" alt="Project 6" />
            <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80" alt="Project 7" />
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" alt="Project 8" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2>Wat onze klanten zeggen</h2>
          <div className="testimonials-grid">
            <div className="testimonial-item">
              <div className="testimonial-image">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80" alt="Jan de Vries" />
              </div>
              <div className="testimonial-content">
                <p>"Uitstekende service en kwaliteit. Onze veranda is perfect geworden en de monteurs waren zeer professioneel."</p>
                <div className="testimonial-author">
                  <strong>Jan de Vries</strong>
                  <span>Amsterdam</span>
                </div>
                <div className="testimonial-stars">★★★★★</div>
              </div>
            </div>
            <div className="testimonial-item">
              <div className="testimonial-image">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" alt="Maria Jansen" />
              </div>
              <div className="testimonial-content">
                <p>"Van offerte tot plaatsing, alles verliep soepel. Zeer tevreden met het eindresultaat!"</p>
                <div className="testimonial-author">
                  <strong>Maria Jansen</strong>
                  <span>Rotterdam</span>
                </div>
                <div className="testimonial-stars">★★★★★</div>
              </div>
            </div>
            <div className="testimonial-item">
              <div className="testimonial-image">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80" alt="Peter Bakker" />
              </div>
              <div className="testimonial-content">
                <p>"Goede prijs-kwaliteit verhouding. De veranda ziet er prachtig uit en is binnen 2 weken geplaatst."</p>
                <div className="testimonial-author">
                  <strong>Peter Bakker</strong>
                  <span>Utrecht</span>
                </div>
                <div className="testimonial-stars">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is a Polycarbonate Veranda */}
      <section className="info-section" id="over-ons">
        <div className="container">
          <div className="info-grid">
            <div className="info-item">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" alt="Wat is veranda" />
              <h3>Wat is een polycarbonaat veranda?</h3>
              <p>Een polycarbonaat veranda van Alusolutions is een duurzame terras- of tuinoverkapping die je woning verlengt met een stijlvolle buitenruimte.</p>
            </div>
            <div className="info-item">
              <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80" alt="Voordelen" />
              <h3>Voordelen van polycarbonaat</h3>
              <p>Polycarbonaat is een robuust, lichtdoorlatend materiaal dat bescherming biedt tegen UV-stralen en weersinvloeden.</p>
            </div>
            <div className="info-item">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80" alt="Waarom Alusolutions" />
              <h3>Waarom kiezen voor Alusolutions?</h3>
              <p>Bij Alusolutions kies je voor kwaliteit en duurzaamheid. Onze veranda's zijn sterk en onderhoudsarm.</p>
            </div>
            <div className="info-item">
              <img src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&q=80" alt="Personaliseer" />
              <h3>Personaliseer je veranda</h3>
              <p>Elke veranda kan worden gepersonaliseerd met opties zoals LED-verlichting, zonwering en zijwanden.</p>
            </div>
            <div className="info-item">
              <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80" alt="Installatie" />
              <h3>Plaatsing en installatie</h3>
              <p>Onze experts zorgen voor een snelle en professionele installatie van je veranda.</p>
            </div>
            <div className="info-item">
              <img src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&q=80" alt="Showroom" />
              <h3>Ontdek onze showroom</h3>
              <p>Bezoek onze showroom om de kwaliteit van onze veranda's zelf te ervaren.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Colors Section */}
      <section className="colors">
        <div className="container">
          <h2>Beschikbare Kleuren</h2>
          <p className="section-subtitle">Kies de perfecte kleur die past bij uw woning</p>
          <div className="colors-grid">
            <div className="color-item">
              <div className="color-swatch" style={{ backgroundColor: '#333333' }}></div>
              <span>Antraciet</span>
            </div>
            <div className="color-item">
              <div className="color-swatch" style={{ backgroundColor: '#ffffff', border: '1px solid #ddd' }}></div>
              <span>Wit</span>
            </div>
            <div className="color-item">
              <div className="color-swatch" style={{ backgroundColor: '#f5f5dc' }}></div>
              <span>Crème</span>
            </div>
            <div className="color-item">
              <div className="color-swatch" style={{ backgroundColor: '#8B4513' }}></div>
              <span>Bruin</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg">
          <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80" alt="Veranda achtergrond" />
        </div>
        <div className="container cta-content">
          <h2>Klaar voor jouw droomveranda?</h2>
          <p>Vraag vandaag nog een vrijblijvende offerte aan en ontdek de mogelijkheden.</p>
          <div className="cta-buttons">
            <a href="#offerte" className="btn btn-primary btn-large">Offerte aanvragen</a>
            <a href="#contact" className="btn btn-secondary btn-large">Neem contact op</a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <div className="container">
          <h2>Veelgestelde vragen</h2>
          <p>Ontdek onze makkelijke stap-voor-stap gids voor jouw polycarbonaat veranda.</p>

          <div className="faq-list">
            <details className="faq-item">
              <summary>Is een vergunning nodig om een terrasoverkapping te plaatsen?</summary>
              <p>In de meeste gevallen is geen vergunning nodig als de overkapping aan bepaalde voorwaarden voldoet. Neem contact met ons op voor advies over vergunningen in uw gemeente.</p>
            </details>
            <details className="faq-item">
              <summary>Hoe lang gaat een terrasoverkapping mee?</summary>
              <p>Onze veranda's gaan jarenlang mee met minimaal onderhoud. Met de juiste verzorging kunt u rekenen op een levensduur van 20+ jaar.</p>
            </details>
            <details className="faq-item">
              <summary>Zijn jullie terrasoverkappingen bestand tegen alle weersomstandigheden?</summary>
              <p>Ja, onze producten zijn ontworpen voor het Nederlandse klimaat en bestand tegen regen, wind, sneeuw en UV-straling.</p>
            </details>
            <details className="faq-item">
              <summary>Hoe lang duurt het om een terrasoverkapping te installeren?</summary>
              <p>Binnen 3 weken zorgen wij voor levering en vakkundige plaatsing. De installatie zelf duurt meestal 1-2 dagen.</p>
            </details>
            <details className="faq-item">
              <summary>Kan ik mijn veranda later uitbreiden met extra opties?</summary>
              <p>Ja, onze veranda's zijn modulair ontworpen. U kunt later eenvoudig LED-verlichting, zijwanden of schuifdeuren toevoegen.</p>
            </details>
            <details className="faq-item">
              <summary>Bieden jullie financieringsmogelijkheden aan?</summary>
              <p>Ja, wij werken samen met verschillende financieringspartners. Vraag naar de mogelijkheden tijdens uw persoonlijke adviesgesprek.</p>
            </details>
          </div>

          <a href="#offerte" className="btn btn-primary">Vrijblijvende Offerte aanvragen</a>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-info">
              <h2>Neem contact op</h2>
              <p>Heeft u vragen of wilt u een afspraak maken? Neem gerust contact met ons op!</p>

              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div>
                    <strong>Adres</strong>
                    <p>Mariastraat 22, 5953 NL Reuver</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <div>
                    <strong>Telefoon</strong>
                    <p>+31 85 060 5036</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <strong>E-mail</strong>
                    <p>Info@alusolutions.nl</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🕐</span>
                  <div>
                    <strong>Openingstijden</strong>
                    <p>Ma-Vr: 08:00 - 17:00</p>
                    <p>Za: 09:00 - 15:00</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2498.5!2d6.0789!3d51.2876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c74b8a5c8b1a1f%3A0x1234567890abcdef!2sMariastraat%2022%2C%205953%20NL%20Reuver%2C%20Netherlands!5e0!3m2!1sen!2snl!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '10px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AluSolutions Locatie"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
