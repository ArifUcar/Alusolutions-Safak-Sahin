import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { ConfiguratorSubmission, Configurator } from '../../lib/supabase'

export default function ConfiguratorSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ConfiguratorSubmission[]>([])
  const [configurators, setConfigurators] = useState<Configurator[]>([])
  const [loading, setLoading] = useState(true)
  const [filterConfigurator, setFilterConfigurator] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedSubmission, setSelectedSubmission] = useState<ConfiguratorSubmission | null>(null)

  useEffect(() => {
    loadConfigurators()
    loadSubmissions()
  }, [filterConfigurator, filterStatus])

  const loadConfigurators = async () => {
    try {
      const { data, error } = await supabase
        .from('configurators')
        .select('id, slug, name')
        .order('name->nl')

      if (error) throw error
      setConfigurators(data || [])
    } catch (error) {
      console.error('Error loading configurators:', error)
    }
  }

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('configurator_submissions')
        .select('*')
        .order('submitted_at', { ascending: false })

      if (filterConfigurator !== 'all') {
        query = query.eq('configurator_id', filterConfigurator)
      }

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      const { data, error } = await query

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error loading submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('configurator_submissions')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      loadSubmissions()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu talebi silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('configurator_submissions')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadSubmissions()
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null)
      }
    } catch (error) {
      console.error('Error deleting:', error)
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
      case 'new': return 'Yeni'
      case 'viewed': return 'Görüldü'
      case 'quoted': return 'Teklif Gönderildi'
      case 'accepted': return 'Kabul Edildi'
      case 'rejected': return 'Reddedildi'
      default: return status
    }
  }

  const getConfiguratorName = (configuratorId?: string) => {
    if (!configuratorId) return 'Bilinmeyen'
    const config = configurators.find(c => c.id === configuratorId)
    return config?.name.nl || 'Bilinmeyen'
  }

  const renderConfigurationData = (data: Record<string, any>) => {
    return Object.entries(data).map(([key, value]) => {
      // Format key for display (remove underscores, capitalize)
      const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

      // Format value
      let displayValue = value
      if (typeof value === 'boolean') {
        displayValue = value ? 'Evet' : 'Hayır'
      } else if (value === null || value === undefined) {
        displayValue = '-'
      } else if (typeof value === 'object') {
        displayValue = JSON.stringify(value)
      }

      return (
        <div key={key} className="config-item">
          <strong>{displayKey}:</strong>
          <span>{String(displayValue)}</span>
        </div>
      )
    })
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Konfigüratör Talepleri</h1>
        <div className="submission-stats">
          <span>Toplam: {submissions.length}</span>
        </div>
      </div>

      <div style={{ marginBottom: '25px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontWeight: '600', color: 'var(--body-text)' }}>Konfigüratör:</span>
          <select
            value={filterConfigurator}
            onChange={(e) => setFilterConfigurator(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--card-bg)',
              color: 'var(--body-text)'
            }}
          >
            <option value="all">Tümü</option>
            {configurators.map(config => (
              <option key={config.id} value={config.id}>
                {config.name.nl}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {['all', 'new', 'viewed', 'quoted', 'accepted', 'rejected'].map(status => (
            <button
              key={status}
              className={`admin-btn ${filterStatus === status ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'Tümü' : getStatusText(status)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <h3>Henüz talep yok</h3>
          <p>Gelen talepler burada görünecektir.</p>
        </div>
      ) : (
        <div className="submissions-grid">
          {submissions.map(submission => (
            <div key={submission.id} className="submission-card">
              <div className="submission-card-header">
                <div className="submission-name">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <h3>{submission.contact_name}</h3>
                </div>
                <span className={`status-badge ${getStatusColor(submission.status)}`}>
                  {getStatusText(submission.status)}
                </span>
              </div>

              <div className="submission-card-body">
                <div className="submission-info">
                  <div className="info-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    </svg>
                    {getConfiguratorName(submission.configurator_id)}
                  </div>
                  <div className="info-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {new Date(submission.submitted_at).toLocaleDateString('tr-TR')}
                  </div>
                </div>

                <div className="configuration-data">
                  <strong style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--heading-text)' }}>
                    Konfigürasyon:
                  </strong>
                  <div className="config-grid">
                    {renderConfigurationData(submission.configuration_data)}
                  </div>
                </div>

                <div className="contact-info">
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
                    <span>{submission.contact_phone}</span>
                  </div>
                  {submission.contact_address && (
                    <div className="contact-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{submission.contact_address}{submission.contact_city && `, ${submission.contact_city}`}</span>
                    </div>
                  )}
                </div>

                {submission.notes && (
                  <div className="submission-notes">
                    <strong>Notlar:</strong>
                    <p>{submission.notes}</p>
                  </div>
                )}
              </div>

              <div className="submission-card-footer">
                <select
                  value={submission.status}
                  onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                  className="status-select"
                >
                  <option value="new">Yeni</option>
                  <option value="viewed">Görüldü</option>
                  <option value="quoted">Teklif Gönderildi</option>
                  <option value="accepted">Kabul Edildi</option>
                  <option value="rejected">Reddedildi</option>
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
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .submission-stats {
          display: flex;
          gap: 1rem;
          color: var(--muted-text);
          font-size: 0.95rem;
        }

        .submissions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
          gap: 1.5rem;
        }

        .submission-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
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
          align-items: center;
          background: var(--section-bg);
        }

        .submission-name {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .submission-name svg {
          color: #22c55e;
        }

        .submission-name h3 {
          margin: 0;
          font-size: 1.125rem;
          color: var(--heading-text);
        }

        .submission-card-body {
          padding: 1.25rem;
        }

        .submission-info {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .info-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: var(--section-bg);
          border-radius: 6px;
          font-size: 0.85rem;
          color: var(--muted-text);
        }

        .configuration-data {
          margin: 1rem 0;
          padding: 1rem;
          background: var(--section-bg);
          border-radius: 8px;
        }

        .config-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .config-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .config-item strong {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--muted-text);
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .config-item span {
          color: var(--body-text);
          font-size: 0.95rem;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
          margin-top: 1rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--body-text);
          font-size: 0.9rem;
        }

        .contact-item svg {
          color: var(--muted-text);
          flex-shrink: 0;
        }

        .contact-item a {
          color: #8b5cf6;
          text-decoration: none;
        }

        .contact-item a:hover {
          text-decoration: underline;
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

        .status-select {
          flex: 1;
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--card-bg);
          color: var(--body-text);
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .submissions-grid {
            grid-template-columns: 1fr;
          }

          .config-grid {
            grid-template-columns: 1fr;
          }

          .submission-card-footer {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  )
}
