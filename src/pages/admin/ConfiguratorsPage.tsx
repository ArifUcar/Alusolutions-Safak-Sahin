import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Configurator } from '../../lib/supabase'

export default function ConfiguratorsPage() {
  const navigate = useNavigate()
  const [configurators, setConfigurators] = useState<Configurator[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadConfigurators()
  }, [filterCategory, filterStatus])

  const loadConfigurators = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('configurators')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (filterCategory !== 'all') {
        query = query.eq('category', filterCategory)
      }

      if (filterStatus === 'active') {
        query = query.eq('is_active', true)
      } else if (filterStatus === 'inactive') {
        query = query.eq('is_active', false)
      }

      const { data, error } = await query

      if (error) throw error
      setConfigurators(data || [])
    } catch (error) {
      console.error('Error loading configurators:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('configurators')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      loadConfigurators()
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu konfigüratörü silmek istediğinizden emin misiniz? Tüm adımlar ve seçenekler de silinecektir.')) return

    try {
      const { error } = await supabase
        .from('configurators')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadConfigurators()
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Silme hatası!')
    }
  }

  const handleDuplicate = async (configurator: Configurator) => {
    try {
      const newConfigData = {
        ...configurator,
        id: undefined,
        slug: `${configurator.slug}-kopya`,
        name: {
          ...configurator.name,
          nl: `${configurator.name.nl} (Kopya)`
        },
        is_active: false,
        created_at: undefined,
        updated_at: undefined
      }

      const { error } = await supabase
        .from('configurators')
        .insert(newConfigData)

      if (error) throw error
      loadConfigurators()
    } catch (error) {
      console.error('Error duplicating:', error)
      alert('Kopyalama hatası!')
    }
  }

  const categories = ['all', 'veranda', 'carport', 'tuinkamer', 'lamellen', 'other']

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Konfigüratör Yönetimi</h1>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => navigate('/admin/configurators/new')}
        >
          + Yeni Konfigüratör
        </button>
      </div>

      <div style={{ marginBottom: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ alignSelf: 'center', fontWeight: '600', color: 'var(--body-text)' }}>Kategori:</span>
          {categories.map(cat => (
            <button
              key={cat}
              className={`admin-btn ${filterCategory === cat ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat === 'all' ? 'Tümü' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ alignSelf: 'center', fontWeight: '600', color: 'var(--body-text)' }}>Durum:</span>
          {['all', 'active', 'inactive'].map(status => (
            <button
              key={status}
              className={`admin-btn ${filterStatus === status ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'Tümü' : status === 'active' ? 'Aktif' : 'Pasif'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      ) : configurators.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <h3>Henüz konfigüratör yok</h3>
          <p>Yeni konfigüratör oluşturmak için butona tıklayın</p>
        </div>
      ) : (
        <div className="configurators-grid">
          {configurators.map(config => (
            <div key={config.id} className="configurator-card">
              <div className="configurator-card-header">
                {config.image_url && (
                  <img src={config.image_url} alt={config.name.nl} className="configurator-thumbnail" />
                )}
                <div className="configurator-info">
                  <h3>{config.name.nl}</h3>
                  {config.description && <p className="configurator-desc">{config.description.nl}</p>}
                  <div className="configurator-meta">
                    <span className="meta-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      </svg>
                      {config.category || 'Uncategorized'}
                    </span>
                    <span className="meta-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      /{config.slug}
                    </span>
                  </div>
                </div>
                <div className="configurator-status">
                  <span className={`status-badge ${config.is_active ? 'confirmed' : 'pending'}`}>
                    {config.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>

              <div className="configurator-card-footer">
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => navigate(`/admin/configurators/${config.id}`)}
                  style={{ padding: '8px 16px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Düzenle
                </button>

                <button
                  className="admin-btn"
                  onClick={() => handleToggleActive(config.id, config.is_active)}
                  style={{
                    padding: '8px 16px',
                    background: config.is_active ? '#f59e0b' : '#22c55e',
                    color: '#fff',
                    border: 'none'
                  }}
                >
                  {config.is_active ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      Gizle
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                      Yayınla
                    </>
                  )}
                </button>

                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => handleDuplicate(config)}
                  style={{ padding: '8px 16px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Kopyala
                </button>

                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => handleDelete(config.id)}
                  style={{ padding: '8px 16px' }}
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
        .configurators-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
          gap: 1.5rem;
        }

        .configurator-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .configurator-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .configurator-card-header {
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: start;
          border-bottom: 1px solid var(--border-color);
        }

        .configurator-thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .configurator-info {
          flex: 1;
        }

        .configurator-info h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
          color: var(--heading-text);
        }

        .configurator-desc {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          color: var(--muted-text);
        }

        .configurator-meta {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .meta-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: var(--section-bg);
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--muted-text);
        }

        .meta-badge svg {
          width: 14px;
          height: 14px;
        }

        .configurator-status {
          margin-left: auto;
        }

        .configurator-card-footer {
          padding: 1rem 1.5rem;
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          background: var(--section-bg);
        }

        .admin-btn svg {
          margin-right: 0.25rem;
          vertical-align: middle;
        }

        @media (max-width: 768px) {
          .configurators-grid {
            grid-template-columns: 1fr;
          }

          .configurator-card-header {
            flex-direction: column;
          }

          .configurator-thumbnail {
            width: 100%;
            height: 150px;
          }

          .configurator-card-footer {
            flex-direction: column;
          }

          .admin-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
