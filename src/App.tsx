import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import InspiratiePage from './pages/InspiratiePage'
import OffertePage from './pages/OffertePage'
import AfspraakPage from './pages/AfspraakPage'

// Product pages
import PolycarbonaatPage from './pages/producten/PolycarbonaaatPage'
import GlazenPage from './pages/producten/GlazenPage'
import LamellenPage from './pages/producten/LamellenPage'
import VouwdakPage from './pages/producten/VouwdakPage'
import SchuifwandPage from './pages/producten/SchuifwandPage'
import CubePage from './pages/producten/CubePage'
import TuinkamerPage from './pages/producten/TuinkamerPage'
import CarportPage from './pages/producten/CarportPage'

// Other pages
import ShowroomPage from './pages/ShowroomPage'
import FAQPage from './pages/FAQPage'
import PrivacyPage from './pages/PrivacyPage'
import VoorwaardenPage from './pages/VoorwaardenPage'
import CookiesPage from './pages/CookiesPage'

// Components
import ScrollToTop from './components/ScrollToTop'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
        {/* Main pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/over-ons" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/inspiratie" element={<InspiratiePage />} />
        <Route path="/offerte" element={<OffertePage />} />
        <Route path="/afspraak" element={<AfspraakPage />} />

        {/* Product pages */}
        <Route path="/producten/polycarbonaat" element={<PolycarbonaatPage />} />
        <Route path="/producten/glazen" element={<GlazenPage />} />
        <Route path="/producten/lamellen" element={<LamellenPage />} />
        <Route path="/producten/vouwdak" element={<VouwdakPage />} />
        <Route path="/producten/schuifwand" element={<SchuifwandPage />} />
        <Route path="/producten/cube" element={<CubePage />} />
        <Route path="/producten/tuinkamer" element={<TuinkamerPage />} />
        <Route path="/producten/carport" element={<CarportPage />} />

        {/* Other pages */}
        <Route path="/showroom" element={<ShowroomPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/voorwaarden" element={<VoorwaardenPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
      </Routes>
    </Router>
    </ThemeProvider>
  )
}

export default App
