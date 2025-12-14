import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Appointment } from '../../lib/supabase'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadAppointments()
  }, [filterStatus])

  const loadAppointments = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      const { data, error } = await query

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      loadAppointments()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadAppointments()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'pending'
      case 'confirmed': return 'confirmed'
      case 'completed': return 'completed'
      case 'cancelled': return 'cancelled'
      default: return 'pending'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Bekliyor'
      case 'confirmed': return 'Onaylandı'
      case 'completed': return 'Tamamlandı'
      case 'cancelled': return 'İptal'
      default: return status
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Randevu Yönetimi</h1>
        <div className="appointment-stats">
          <span>Toplam: {appointments.length}</span>
        </div>
      </div>

      <div style={{ marginBottom: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            className={`admin-btn ${filterStatus === status ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setFilterStatus(status)}
          >
            {status === 'all' ? 'Tümü' : getStatusText(status)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h3>Randevu bulunamadı</h3>
          <p>Henüz randevu kaydı bulunmuyor.</p>
        </div>
      ) : (
        <div className="appointments-grid">
          {appointments.map(apt => (
            <div key={apt.id} className="appointment-card">
              <div className="appointment-card-header">
                <div className="appointment-name">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <h3>{apt.name}</h3>
                </div>
                <span className={`status-badge ${getStatusColor(apt.status)}`}>
                  {getStatusText(apt.status)}
                </span>
              </div>

              <div className="appointment-card-body">
                <div className="appointment-info-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>{apt.email}</span>
                </div>

                <div className="appointment-info-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>{apt.phone}</span>
                </div>

                <div className="appointment-info-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{apt.preferred_date} - {apt.preferred_time}</span>
                </div>

                <div className="appointment-info-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{apt.service_type}</span>
                </div>

                {apt.message && (
                  <div className="appointment-message">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <p>{apt.message}</p>
                  </div>
                )}
              </div>

              <div className="appointment-card-footer">
                <select
                  value={apt.status}
                  onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                  className="appointment-status-select"
                >
                  <option value="pending">Bekliyor</option>
                  <option value="confirmed">Onaylandı</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal</option>
                </select>

                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => handleDelete(apt.id)}
                  style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
