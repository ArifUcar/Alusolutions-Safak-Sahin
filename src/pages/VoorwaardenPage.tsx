import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/LegalPage.css'

export default function VoorwaardenPage() {
  return (
    <div className="legal-page">
      <Header />
      <section className="legal-hero"><div className="container"><h1>Algemene Voorwaarden</h1></div></section>
      <section className="legal-content">
        <div className="container">
          <h2>Artikel 1 - Definities</h2>
          <p>In deze voorwaarden wordt verstaan onder VivaVerandas: de onderneming gevestigd te Reuver, ingeschreven bij de KVK onder nummer 90086449.</p>

          <h2>Artikel 2 - Toepasselijkheid</h2>
          <p>Deze voorwaarden zijn van toepassing op alle aanbiedingen en overeenkomsten van VivaVerandas.</p>

          <h2>Artikel 3 - Offertes</h2>
          <p>Alle offertes zijn vrijblijvend en 30 dagen geldig, tenzij anders aangegeven.</p>

          <h2>Artikel 4 - Levering</h2>
          <p>De levertijd wordt in overleg bepaald en is indicatief.</p>

          <h2>Artikel 5 - Garantie</h2>
          <p>VivaVerandas biedt 10 jaar garantie op de constructie bij normaal gebruik.</p>

          <h2>Artikel 6 - Betaling</h2>
          <p>Betaling geschiedt conform de op de factuur vermelde betalingsvoorwaarden.</p>
        </div>
      </section>
      <Footer />
    </div>
  )
}
