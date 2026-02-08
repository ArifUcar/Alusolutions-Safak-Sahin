import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/LegalPage.css'

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <Header />
      <section className="legal-hero"><div className="container"><h1>Privacy Policy</h1></div></section>
      <section className="legal-content">
        <div className="container">
          <h2>1. Inleiding</h2>
          <p>VivaVerandas respecteert uw privacy en zorgt ervoor dat de persoonlijke informatie die u ons verschaft vertrouwelijk wordt behandeld.</p>

          <h2>2. Gegevens die wij verzamelen</h2>
          <p>Wij verzamelen gegevens die u zelf aan ons verstrekt, zoals naam, adres, e-mailadres en telefoonnummer wanneer u contact met ons opneemt of een offerte aanvraagt.</p>

          <h2>3. Gebruik van gegevens</h2>
          <p>Uw gegevens worden gebruikt voor het verwerken van uw aanvraag, het versturen van offertes en het leveren van onze diensten.</p>

          <h2>4. Bewaartermijn</h2>
          <p>Wij bewaren uw gegevens niet langer dan noodzakelijk voor het doel waarvoor ze zijn verzameld.</p>

          <h2>5. Uw rechten</h2>
          <p>U heeft recht op inzage, correctie en verwijdering van uw gegevens. Neem hiervoor contact met ons op.</p>

          <h2>6. Contact</h2>
          <p>Voor vragen over ons privacybeleid kunt u contact opnemen via info@vivaverandas.nl</p>
        </div>
      </section>
      <Footer />
    </div>
  )
}
