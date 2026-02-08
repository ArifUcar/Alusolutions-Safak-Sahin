import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import type { Appointment, Contact } from '../../lib/supabase'

export default function DashboardPage() {
  const { t, i18n } = useTranslation()
  const [stats, setStats] = useState({
    appointments: 0,
    pendingAppointments: 0,
    contacts: 0,
    unreadContacts: 0,
    offertes: 0
  })
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([])
  const [recentMessages, setRecentMessages] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [
        { count: appointmentsCount },
        { count: pendingAppointmentsCount },
        { count: contactsCount },
        { count: unreadCount },
        { count: offertesCount },
        { data: appointments },
        { data: messages }
      ] = await Promise.all([
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('contacts').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('offertes').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(5)
      ])

      setStats({
        appointments: appointmentsCount || 0,
        pendingAppointments: pendingAppointmentsCount || 0,
        contacts: contactsCount || 0,
        unreadContacts: unreadCount || 0,
        offertes: offertesCount || 0
      })
      setRecentAppointments(appointments || [])
      setRecentMessages(messages || [])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const locale = i18n.language === 'tr' ? 'tr-TR' : 'nl-NL'
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t('admin.appointments.statusPending')
      case 'confirmed': return t('admin.appointments.statusConfirmed')
      case 'completed': return t('admin.appointments.statusCompleted')
      case 'cancelled': return t('admin.appointments.statusCancelled')
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', color: '#92400e' }
      case 'confirmed': return { bg: '#d1fae5', color: '#065f46' }
      case 'completed': return { bg: '#dbeafe', color: '#1e40af' }
      case 'cancelled': return { bg: '#fee2e2', color: '#991b1b' }
      default: return { bg: '#f3f4f6', color: '#374151' }
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>{t('admin.dashboard.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>{t('admin.dashboard.title')}</h1>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{t('admin.dashboard.totalAppointments')}</h3>
          <div className="value">{stats.appointments}</div>
        </div>

        <div className="stat-card highlight">
          <h3>{t('admin.dashboard.pendingAppointments')}</h3>
          <div className="value">{stats.pendingAppointments}</div>
        </div>

        <div className="stat-card">
          <h3>{t('admin.dashboard.totalMessages')}</h3>
          <div className="value">{stats.contacts}</div>
        </div>

        <div className="stat-card highlight">
          <h3>{t('admin.dashboard.unreadMessages')}</h3>
          <div className="value">{stats.unreadContacts}</div>
        </div>

        <div className="stat-card">
          <h3>{t('admin.dashboard.totalOffertes')}</h3>
          <div className="value">{stats.offertes}</div>
        </div>
      </div>

      {/* Recent Appointments & Messages Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '20px' }}>

        {/* Recent Appointments */}
        <div className="admin-table-container">
          <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{t('admin.dashboard.recentAppointments')}</h3>
            <Link to="/admin/appointments" className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              {t('admin.dashboard.viewAll')}
            </Link>
          </div>
          {recentAppointments.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--admin-sidebar-text-muted)' }}>
              {t('admin.dashboard.noRecentAppointments')}
            </div>
          ) : (
            <div style={{ padding: '10px' }}>
              {recentAppointments.map(apt => (
                <div key={apt.id} style={{
                  padding: '12px 15px',
                  borderBottom: '1px solid var(--admin-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>{apt.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--admin-sidebar-text-muted)' }}>
                      {formatDate(apt.preferred_date)} - {apt.preferred_time}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    background: getStatusColor(apt.status).bg,
                    color: getStatusColor(apt.status).color
                  }}>
                    {getStatusText(apt.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="admin-table-container">
          <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{t('admin.dashboard.recentMessages')}</h3>
            <Link to="/admin/contacts" className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              {t('admin.dashboard.viewAll')}
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--admin-sidebar-text-muted)' }}>
              {t('admin.dashboard.noRecentMessages')}
            </div>
          ) : (
            <div style={{ padding: '10px' }}>
              {recentMessages.map(msg => (
                <Link
                  key={msg.id}
                  to="/admin/contacts"
                  style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid var(--admin-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    color: 'inherit',
                    fontWeight: msg.is_read ? 'normal' : 600
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: msg.is_read ? 500 : 600, marginBottom: '4px' }}>{msg.name}</div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: 'var(--admin-sidebar-text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {msg.subject}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!msg.is_read && (
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#22c55e'
                      }}></span>
                    )}
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-sidebar-text-muted)', whiteSpace: 'nowrap' }}>
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Access */}
      <div className="admin-table-container" style={{ marginTop: '20px' }}>
        <h3 style={{ padding: '15px 20px', borderBottom: '1px solid var(--admin-border)', margin: 0 }}>
          {t('admin.dashboard.quickAccess')}
        </h3>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <Link to="/admin/appointments" className="admin-btn admin-btn-secondary">
            {t('admin.dashboard.viewAppointments')}
          </Link>
          <Link to="/admin/contacts" className="admin-btn admin-btn-secondary">
            {t('admin.dashboard.viewMessages')}
          </Link>
          <Link to="/admin/offertes" className="admin-btn admin-btn-secondary">
            {t('admin.dashboard.viewOffertes')}
          </Link>
          <Link to="/admin/gallery" className="admin-btn admin-btn-secondary">
            {t('admin.dashboard.uploadImage')}
          </Link>
          <Link to="/admin/blog" className="admin-btn admin-btn-secondary">
            {t('admin.dashboard.manageBlog')}
          </Link>
        </div>
      </div>
    </div>
  )
}
