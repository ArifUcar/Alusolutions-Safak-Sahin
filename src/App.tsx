import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import InspiratiePage from './pages/InspiratiePage'
import AfspraakPage from './pages/AfspraakPage'
import OffertePage from './pages/OffertePage'
import DynamicConfiguratorPage from './pages/DynamicConfiguratorPage'


// Product pages
import CubeVerandaPage from './pages/producten/CubeVerandaPage'
import LamelVerandaPage from './pages/producten/LamelVerandaPage'
import GlazenVerandaPage from './pages/producten/GlazenVerandaPage'
import PolycarbonaatVerandaPage from './pages/producten/PolycarbonaatVerandaPage'

// Other pages
import ShowroomPage from './pages/ShowroomPage'
import FAQPage from './pages/FAQPage'
import PlaatWisselenPage from './pages/PlaatWisselenPage'
import PrivacyPage from './pages/PrivacyPage'
import VoorwaardenPage from './pages/VoorwaardenPage'
import CookiesPage from './pages/CookiesPage'

// Admin pages
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import GalleryPage from './pages/admin/GalleryPage'
import ContactsPage from './pages/admin/ContactsPage'
import AppointmentsPage from './pages/admin/AppointmentsPage'
import AppointmentSettingsPage from './pages/admin/AppointmentSettingsPage'
import ConfiguratorsPage from './pages/admin/ConfiguratorsPage'
import ConfiguratorEditPage from './pages/admin/ConfiguratorEditPage'
import ConfiguratorSubmissionsPage from './pages/admin/ConfiguratorSubmissionsPage'
import BlogPostsPage from './pages/admin/BlogPostsPage'
import BlogEditPage from './pages/admin/BlogEditPage'
import AdminPlaatWisselenPage from './pages/admin/PlaatWisselenPage'

// Blog pages
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'

// Components
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import MobileFloatingButtons from './components/MobileFloatingButtons'
import CookieConsent from './components/CookieConsent'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <MobileFloatingButtons />
          <CookieConsent />
          <Routes>
            {/* Main pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/over-ons" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/inspiratie" element={<InspiratiePage />} />
            <Route path="/afspraak" element={<AfspraakPage />} />
            <Route path="/offerte" element={<OffertePage />} />
            <Route path="/offerte/:configuratorSlug" element={<DynamicConfiguratorPage />} />

            {/* Product pages */}
            <Route path="/producten/cube-veranda" element={<CubeVerandaPage />} />
            <Route path="/producten/lamel-veranda" element={<LamelVerandaPage />} />
            <Route path="/producten/glazen-veranda" element={<GlazenVerandaPage />} />
            <Route path="/producten/polycarbonaat-veranda" element={<PolycarbonaatVerandaPage />} />

            {/* Other pages */}
            <Route path="/offerte-polycarbonaat-platen-wisselen" element={<PlaatWisselenPage />} />
            <Route path="/showroom" element={<ShowroomPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/voorwaarden" element={<VoorwaardenPage />} />
            <Route path="/cookies" element={<CookiesPage />} />

            {/* Blog pages */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="appointment-settings" element={<AppointmentSettingsPage />} />
              <Route path="configurators" element={<ConfiguratorsPage />} />
              <Route path="configurators/new" element={<ConfiguratorEditPage />} />
              <Route path="configurators/:id" element={<ConfiguratorEditPage />} />
              <Route path="configurator-submissions" element={<ConfiguratorSubmissionsPage />} />
              <Route path="blog" element={<BlogPostsPage />} />
              <Route path="blog/new" element={<BlogEditPage />} />
              <Route path="blog/:id" element={<BlogEditPage />} />
              <Route path="plaat-wisselen" element={<AdminPlaatWisselenPage />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
