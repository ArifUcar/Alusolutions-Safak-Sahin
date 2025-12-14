import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    pages: 0,
    gallery: 0,
    products: 0,
    appointments: 0,
    contacts: 0,
    unreadContacts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [
        { count: pagesCount },
        { count: galleryCount },
        { count: productsCount },
        { count: appointmentsCount },
        { count: contactsCount },
        { count: unreadCount }
      ] = await Promise.all([
        supabase.from('pages').select('*', { count: 'exact', head: true }),
        supabase.from('gallery').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('is_read', false)
      ])

      setStats({
        pages: pagesCount || 0,
        gallery: galleryCount || 0,
        products: productsCount || 0,
        appointments: appointmentsCount || 0,
        contacts: contactsCount || 0,
        unreadContacts: unreadCount || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Toplam Sayfa</h3>
          <div className="value">{stats.pages}</div>
        </div>

        <div className="stat-card">
          <h3>Galeri Görselleri</h3>
          <div className="value">{stats.gallery}</div>
        </div>

        <div className="stat-card">
          <h3>Ürünler</h3>
          <div className="value">{stats.products}</div>
        </div>

        <div className="stat-card">
          <h3>Randevular</h3>
          <div className="value">{stats.appointments}</div>
        </div>

        <div className="stat-card highlight">
          <h3>Okunmamış Mesajlar</h3>
          <div className="value">{stats.unreadContacts}</div>
        </div>

        <div className="stat-card">
          <h3>Toplam Mesaj</h3>
          <div className="value">{stats.contacts}</div>
        </div>
      </div>

      <div className="admin-table-container">
        <h3 style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', margin: 0 }}>
          Hızlı Erişim
        </h3>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <a href="/admin/pages" className="admin-btn admin-btn-secondary">
            Sayfa Ekle
          </a>
          <a href="/admin/gallery" className="admin-btn admin-btn-secondary">
            Görsel Yükle
          </a>
          <a href="/admin/products" className="admin-btn admin-btn-secondary">
            Ürün Ekle
          </a>
          <a href="/admin/appointments" className="admin-btn admin-btn-secondary">
            Randevuları Gör
          </a>
          <a href="/admin/contacts" className="admin-btn admin-btn-secondary">
            Mesajları Gör
          </a>
        </div>
      </div>
    </div>
  )
}
