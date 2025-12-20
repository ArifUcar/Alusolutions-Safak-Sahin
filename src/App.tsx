import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import InspiratiePage from './pages/InspiratiePage'
import AppointmentPage from './pages/AppointmentPage'
import SimpleAppointmentPage from './pages/SimpleAppointmentPage'
import DynamicConfiguratorPage from './pages/DynamicConfiguratorPage'

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

// Admin pages
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import GalleryPage from './pages/admin/GalleryPage'
import ProductsPage from './pages/admin/ProductsPage'
import PagesPage from './pages/admin/PagesPage'
import ContactsPage from './pages/admin/ContactsPage'
import AppointmentsPage from './pages/admin/AppointmentsPage'
import OffertesPage from './pages/admin/OffertesPage'
import ConfiguratorsPage from './pages/admin/ConfiguratorsPage'
import ConfiguratorEditPage from './pages/admin/ConfiguratorEditPage'
import ConfiguratorSubmissionsPage from './pages/admin/ConfiguratorSubmissionsPage'

// Components
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Main pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/over-ons" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/inspiratie" element={<InspiratiePage />} />
            <Route path="/afspraak" element={<AppointmentPage />} />
            <Route path="/afspraak-maken" element={<SimpleAppointmentPage />} />
            <Route path="/offerte" element={<Navigate to="/offerte/glazen-veranda" replace />} />
            <Route path="/offerte/:configuratorSlug" element={<DynamicConfiguratorPage />} />

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

            {/* Admin routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="pages" element={<PagesPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="offertes" element={<OffertesPage />} />
              <Route path="configurators" element={<ConfiguratorsPage />} />
              <Route path="configurators/new" element={<ConfiguratorEditPage />} />
              <Route path="configurators/:id" element={<ConfiguratorEditPage />} />
              <Route path="configurator-submissions" element={<ConfiguratorSubmissionsPage />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
