import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import type { ConfiguratorSubmission, Configurator, MultiLanguageText } from '../../lib/supabase'

interface SubmissionWithConfigurator extends ConfiguratorSubmission {
  configurator?: Configurator
}

export default function ConfiguratorSubmissionsPage() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language as keyof MultiLanguageText
  const [submissions, setSubmissions] = useState<SubmissionWithConfigurator[]>([])
  const [configurators, setConfigurators] = useState<Configurator[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterConfigurator, setFilterConfigurator] = useState('all')
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithConfigurator | null>(null)

  useEffect(() => {
    loadData()
  }, [filterStatus, filterConfigurator])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load configurators for filter
      const { data: configData } = await supabase
        .from('configurators')
        .select('*')
        .order('name->nl', { ascending: true })

      if (configData) {
        setConfigurators(configData)
      }

      // Load submissions
      let query = supabase
        .from('configurator_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      if (filterConfigurator !== 'all') {
        query = query.eq('configurator_id', filterConfigurator)
      }

      const { data, error } = await query

      if (error) throw error

      // Attach configurator info to each submission
      const submissionsWithConfig = (data || []).map(sub => ({
        ...sub,
        configurator: configData?.find(c => c.id === sub.configurator_id)
      }))

      setSubmissions(submissionsWithConfig)
    } catch (error) {
      console.error('Error loading submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus }
      if (newStatus === 'viewed') {
        updateData.viewed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('configurator_submissions')
        .update(updateData)
        .eq('id', id)

      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.configuratorSubmissions.deleteConfirm', 'Bu talebi silmek istediğinizden emin misiniz?'))) return

    try {
      const { error, data } = await supabase
        .from('configurator_submissions')
        .delete()
        .eq('id', id)
        .select()

      if (error) {
        console.error('Delete error:', error)
        alert(`Silme hatası: ${error.message}`)
        return
      }

      // Check if anything was actually deleted
      if (!data || data.length === 0) {
        console.warn('No rows deleted - RLS policy may be blocking')
        alert('Silme işlemi başarısız. Yetki sorunu olabilir.')
        return
      }

      loadData()
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null)
      }
    } catch (error: any) {
      console.error('Error deleting:', error)
      alert(`Silme hatası: ${error?.message || 'Bilinmeyen hata'}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'pending'
      case 'viewed': return 'confirmed'
      case 'quoted': return 'confirmed'
      case 'accepted': return 'completed'
      case 'rejected': return 'cancelled'
      default: return 'pending'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return t('admin.configuratorSubmissions.statusNew', 'Yeni')
      case 'viewed': return t('admin.configuratorSubmissions.statusViewed', 'Görüldü')
      case 'quoted': return t('admin.configuratorSubmissions.statusQuoted', 'Teklif Verildi')
      case 'accepted': return t('admin.configuratorSubmissions.statusAccepted', 'Kabul Edildi')
      case 'rejected': return t('admin.configuratorSubmissions.statusRejected', 'Reddedildi')
      default: return status
    }
  }

  const getLocalizedText = (text: MultiLanguageText | undefined): string => {
    if (!text) return ''
    return text[currentLang] || text['nl'] || ''
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleBlockAppointmentSlot = async (date: string, time: string) => {
    if (!confirm(`${date} tarihinde ${time} saatini kilitlemek istediğinizden emin misiniz?`)) return

    try {
      const { error } = await supabase
        .from('blocked_slots')
        .upsert([{ date, time, appointment_id: null }], { onConflict: 'date,time' })

      if (error) throw error
      alert('Randevu saati başarıyla kilitlendi!')
    } catch (error: any) {
      console.error('Error blocking slot:', error)
      alert(`Hata: ${error?.message || 'Bilinmeyen hata'}`)
    }
  }

  const renderConfigurationData = (data: Record<string, any>) => {
    const entries = Object.entries(data).filter(([key]) => !key.startsWith('_'))

    return (
      <div className="config-data-grid">
        {entries.map(([key, value]) => (
          <div key={key} className="config-data-item">
            <strong>{key.replace(/_/g, ' ')}:</strong>
            <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
          </div>
        ))}
      </div>
    )
  }

  const renderAppointmentInfo = (data: Record<string, any>) => {
    const appointment = data._appointment
    if (!appointment || !appointment.requested) return null

    return (
      <div className="appointment-info-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <h4>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {t('admin.configuratorSubmissions.appointmentRequested', 'Randevu Talebi')}
          </h4>
          <button
            onClick={() => handleBlockAppointmentSlot(appointment.date, appointment.time)}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}
            title="Bu tarihi kilitle"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Kilitle
          </button>
        </div>
        <div className="appointment-details">
          <p><strong>{t('admin.configuratorSubmissions.serviceType', 'Hizmet')}:</strong> {appointment.service_type}</p>
          <p><strong>{t('admin.configuratorSubmissions.date', 'Tarih')}:</strong> {appointment.date}</p>
          <p><strong>{t('admin.configuratorSubmissions.time', 'Saat')}:</strong> {appointment.time}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>{t('admin.configuratorSubmissions.title', 'Konfiguratör Talepleri')}</h1>
        <div className="appointment-stats">
          <span>{t('admin.configuratorSubmissions.total', 'Toplam')}: {submissions.length}</span>
        </div>
      </div>

      <div className="filters-row">
        <div className="filter-group">
          <label>{t('admin.configuratorSubmissions.filterStatus', 'Durum')}:</label>
          <div className="filter-buttons">
            {['all', 'new', 'viewed', 'quoted', 'accepted', 'rejected'].map(status => (
              <button
                key={status}
                className={`admin-btn ${filterStatus === status ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                onClick={() => setFilterStatus(status)}
              >
                {status === 'all' ? t('admin.configuratorSubmissions.all', 'Tümü') : getStatusText(status)}
              </button>
            ))}
          </div>
        </div>

        {configurators.length > 0 && (
          <div className="filter-group">
            <label>{t('admin.configuratorSubmissions.filterConfigurator', 'Konfiguratör')}:</label>
            <select
              value={filterConfigurator}
              onChange={(e) => setFilterConfigurator(e.target.value)}
              className="filter-select"
            >
              <option value="all">{t('admin.configuratorSubmissions.allConfigurators', 'Tüm Konfiguratörler')}</option>
              {configurators.map(config => (
                <option key={config.id} value={config.id}>
                  {getLocalizedText(config.name)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>{t('common.loading', 'Yükleniyor...')}</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
          <h3>{t('admin.configuratorSubmissions.noSubmissions', 'Henüz konfiguratör talebi yok')}</h3>
          <p>{t('admin.configuratorSubmissions.noSubmissionsDesc', 'Müşteriler konfiguratörü tamamladığında burada görünecek.')}</p>
        </div>
      ) : (
        <div className="submissions-grid">
          {submissions.map(submission => (
            <div key={submission.id} className={`submission-card ${submission.status === 'new' ? 'is-new' : ''}`}>
              <div className="submission-card-header">
                <div className="submission-info">
                  <div className="submission-name">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <h3>{submission.contact_name}</h3>
                  </div>
                  {submission.configurator && (
                    <span className="configurator-badge">
                      {getLocalizedText(submission.configurator.name)}
                    </span>
                  )}
                </div>
                <span className={`status-badge ${getStatusColor(submission.status)}`}>
                  {getStatusText(submission.status)}
                </span>
              </div>

              <div className="submission-card-body">
                <div className="contact-info-grid">
                  <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <a href={`mailto:${submission.contact_email}`}>{submission.contact_email}</a>
                  </div>
                  <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <a href={`tel:${submission.contact_phone}`}>{submission.contact_phone}</a>
                  </div>
                  {submission.contact_city && (
                    <div className="contact-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{submission.contact_address}, {submission.contact_city}</span>
                    </div>
                  )}
                </div>

                {submission.configuration_data._appointment?.requested && (
                  renderAppointmentInfo(submission.configuration_data)
                )}

                <div className="submission-date">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {formatDate(submission.created_at)}
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedSubmission(selectedSubmission?.id === submission.id ? null : submission)}
                  style={{ marginTop: '1rem' }}
                >
                  {selectedSubmission?.id === submission.id
                    ? t('admin.configuratorSubmissions.hideDetails', 'Detayları Gizle')
                    : t('admin.configuratorSubmissions.showDetails', 'Detayları Göster')}
                </button>

                {selectedSubmission?.id === submission.id && (
                  <div className="submission-details">
                    <h4>{t('admin.configuratorSubmissions.configurationDetails', 'Konfigürasyon Detayları')}</h4>
                    {renderConfigurationData(submission.configuration_data)}

                    {submission.notes && (
                      <div className="submission-notes">
                        <strong>{t('admin.configuratorSubmissions.notes', 'Notlar')}:</strong>
                        <p>{submission.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="submission-card-footer">
                <select
                  value={submission.status}
                  onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                  className="appointment-status-select"
                >
                  <option value="new">{getStatusText('new')}</option>
                  <option value="viewed">{getStatusText('viewed')}</option>
                  <option value="quoted">{getStatusText('quoted')}</option>
                  <option value="accepted">{getStatusText('accepted')}</option>
                  <option value="rejected">{getStatusText('rejected')}</option>
                </select>

                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => handleDelete(submission.id)}
                  style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  {t('common.delete', 'Sil')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .filters-row {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group label {
          font-weight: 600;
          color: var(--heading-text);
          font-size: 0.875rem;
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-select {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--card-bg);
          color: var(--body-text);
          font-size: 0.9rem;
          max-width: 300px;
        }

        .submissions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .submission-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .submission-card.is-new {
          border-left: 4px solid #8b5cf6;
        }

        .submission-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .submission-card-header {
          padding: 1.25rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background: var(--section-bg);
          gap: 1rem;
        }

        .submission-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .submission-name {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .submission-name svg {
          color: #8b5cf6;
        }

        .submission-name h3 {
          margin: 0;
          font-size: 1.125rem;
          color: var(--heading-text);
        }

        .configurator-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.15));
          color: #7c3aed;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .submission-card-body {
          padding: 1.25rem;
        }

        .contact-info-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .contact-item svg {
          color: var(--muted-text);
          flex-shrink: 0;
        }

        .contact-item a {
          color: var(--body-text);
          text-decoration: none;
        }

        .contact-item a:hover {
          color: #8b5cf6;
        }

        .appointment-info-box {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(167, 139, 250, 0.1));
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 10px;
          padding: 1rem;
          margin: 1rem 0;
        }

        .appointment-info-box h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 0.75rem 0;
          color: #7c3aed;
          font-size: 0.95rem;
        }

        .appointment-details p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
          color: var(--body-text);
        }

        .submission-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--muted-text);
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .submission-details {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .submission-details h4 {
          margin: 0 0 1rem 0;
          font-size: 0.95rem;
          color: var(--heading-text);
        }

        .config-data-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .config-data-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .config-data-item strong {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--muted-text);
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .config-data-item span {
          color: var(--body-text);
          font-size: 0.9rem;
        }

        .submission-notes {
          margin-top: 1rem;
          padding: 1rem;
          background: var(--section-bg);
          border-radius: 8px;
        }

        .submission-notes strong {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--heading-text);
        }

        .submission-notes p {
          margin: 0;
          color: var(--body-text);
          line-height: 1.6;
        }

        .submission-card-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          background: var(--section-bg);
        }

        @media (max-width: 768px) {
          .submissions-grid {
            grid-template-columns: 1fr;
          }

          .config-data-grid {
            grid-template-columns: 1fr;
          }

          .submission-card-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-buttons {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  )
}
