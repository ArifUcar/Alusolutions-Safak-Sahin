import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DynamicConfigurator from '../components/DynamicConfigurator'

export default function DynamicConfiguratorPage() {
  const { configuratorSlug } = useParams<{ configuratorSlug: string }>()
  const slug = configuratorSlug

  if (!slug) {
    return (
      <div>
        <Header />
        <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Configurator niet gevonden</h2>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <DynamicConfigurator configuratorSlug={slug} />
      <Footer />
    </div>
  )
}
