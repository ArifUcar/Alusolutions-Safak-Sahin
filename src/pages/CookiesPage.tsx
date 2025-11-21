import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/LegalPage.css'

export default function CookiesPage() {
  return (
    <div className="legal-page">
      <Header />
      <section className="legal-hero"><div className="container"><h1>Cookiebeleid</h1></div></section>
      <section className="legal-content">
        <div className="container">
          <h2>Wat zijn cookies?</h2>
          <p>Cookies zijn kleine tekstbestanden die op uw apparaat worden opgeslagen wanneer u onze website bezoekt.</p>

          <h2>Welke cookies gebruiken wij?</h2>
          <p><strong>Functionele cookies:</strong> Noodzakelijk voor het functioneren van de website.</p>
          <p><strong>Analytische cookies:</strong> Om inzicht te krijgen in het gebruik van de website.</p>

          <h2>Cookies beheren</h2>
          <p>U kunt cookies blokkeren of verwijderen via uw browserinstellingen.</p>

          <h2>Contact</h2>
          <p>Vragen over ons cookiebeleid? Neem contact op via info@alusolutions.nl</p>
        </div>
      </section>
      <Footer />
    </div>
  )
}
