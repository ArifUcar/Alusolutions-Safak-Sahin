import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Offerte } from '../../lib/supabase'

export default function OffertesPage() {
  const [offertes, setOffertes] = useState<Offerte[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOfferte, setSelectedOfferte] = useState<Offerte | null>(null)

  useEffect(() => {
    loadOffertes()
  }, [filterStatus])

  const loadOffertes = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('offertes')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      const { data, error } = await query

      if (error) throw error
      setOffertes(data || [])
    } catch (error) {
      console.error('Error loading offertes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('offertes')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      loadOffertes()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deze offerte verwijderen?')) return

    try {
      const { error } = await supabase
        .from('offertes')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadOffertes()
      if (selectedOfferte?.id === id) {
        setSelectedOfferte(null)
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
      case 'new': return 'Nieuw'
      case 'viewed': return 'Bekeken'
      case 'quoted': return 'Offerte verzonden'
      case 'accepted': return 'Geaccepteerd'
      case 'rejected': return 'Afgewezen'
      default: return status
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Offerte Aanvragen</h1>
        <div className="appointment-stats">
          <span>Totaal: {offertes.length}</span>
        </div>
      </div>

      <div style={{ marginBottom: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {['all', 'new', 'viewed', 'quoted', 'accepted', 'rejected'].map(status => (
          <button
            key={status}
            className={`admin-btn ${filterStatus === status ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setFilterStatus(status)}
          >
            {status === 'all' ? 'Alle' : getStatusText(status)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Laden...</p>
        </div>
      ) : offertes.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <h3>Geen offertes gevonden</h3>
          <p>Er zijn nog geen offerte aanvragen.</p>
        </div>
      ) : (
        <div className="offertes-grid">
          {offertes.map(offerte => (
            <div key={offerte.id} className="offerte-card">
              <div className="offerte-card-header">
                <div className="offerte-name">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <h3>{offerte.naam}</h3>
                </div>
                <span className={`status-badge ${getStatusColor(offerte.status)}`}>
                  {getStatusText(offerte.status)}
                </span>
              </div>

              <div className="offerte-card-body">
                <div className="offerte-info-grid">
                  <div className="offerte-info-item">
                    <strong>Overkapping:</strong>
                    <span>{offerte.overkapping_type}</span>
                  </div>
                  <div className="offerte-info-item">
                    <strong>Goot type:</strong>
                    <span>{offerte.goot_type}</span>
                  </div>
                  <div className="offerte-info-item">
                    <strong>Kleur:</strong>
                    <span>{offerte.kleur}</span>
                  </div>
                  <div className="offerte-info-item">
                    <strong>Materiaal:</strong>
                    <span>{offerte.materiaal}</span>
                  </div>
                  <div className="offerte-info-item">
                    <strong>Afmetingen:</strong>
                    <span>{offerte.breedte}m x {offerte.lengte}m</span>
                  </div>
                  <div className="offerte-info-item">
                    <strong>Verlichting:</strong>
                    <span>{offerte.verlichting}</span>
                  </div>
                  <div className="offerte-info-item">
                    <strong>Montage:</strong>
                    <span>{offerte.montage}</span>
                  </div>
                </div>

                {offerte.meer_opties && (
                  <div className="offerte-extra-options">
                    <strong>Extra opties:</strong>
                    <ul>
                      {offerte.rechter_kant && <li>Rechter kant: {offerte.rechter_kant}</li>}
                      {offerte.rechter_spie && <li>Rechter spie: {offerte.rechter_spie}</li>}
                      {offerte.linker_kant && <li>Linker kant: {offerte.linker_kant}</li>}
                      {offerte.linker_spie && <li>Linker spie: {offerte.linker_spie}</li>}
                      {offerte.voorkant && <li>Voorkant: {offerte.voorkant}</li>}
                      {offerte.achterkant && <li>Achterkant: {offerte.achterkant}</li>}
                    </ul>
                  </div>
                )}

                <div className="offerte-contact-info">
                  <div className="offerte-info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>{offerte.email}</span>
                  </div>
                  <div className="offerte-info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>{offerte.telefoon}</span>
                  </div>
                  <div className="offerte-info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{offerte.straat}, {offerte.woonplaats}</span>
                  </div>
                </div>

                {offerte.opmerking && (
                  <div className="offerte-message">
                    <strong>Opmerking:</strong>
                    <p>{offerte.opmerking}</p>
                  </div>
                )}

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedOfferte(selectedOfferte?.id === offerte.id ? null : offerte)}
                  style={{ marginTop: '1rem' }}
                >
                  {selectedOfferte?.id === offerte.id ? 'Verberg details' : 'Toon alle details'}
                </button>
              </div>

              <div className="offerte-card-footer">
                <select
                  value={offerte.status}
                  onChange={(e) => handleStatusChange(offerte.id, e.target.value)}
                  className="appointment-status-select"
                >
                  <option value="new">Nieuw</option>
                  <option value="viewed">Bekeken</option>
                  <option value="quoted">Offerte verzonden</option>
                  <option value="accepted">Geaccepteerd</option>
                  <option value="rejected">Afgewezen</option>
                </select>

                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => handleDelete(offerte.id)}
                  style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Verwijder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .offertes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
          gap: 1.5rem;
        }

        .offerte-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .offerte-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .offerte-card-header {
          padding: 1.25rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--section-bg);
        }

        .offerte-name {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .offerte-name svg {
          color: #22c55e;
        }

        .offerte-name h3 {
          margin: 0;
          font-size: 1.125rem;
          color: var(--heading-text);
        }

        .offerte-card-body {
          padding: 1.25rem;
        }

        .offerte-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .offerte-info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .offerte-info-item strong {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--muted-text);
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .offerte-info-item span {
          color: var(--body-text);
          font-size: 0.95rem;
        }

        .offerte-info-item svg {
          width: 16px;
          height: 16px;
          color: var(--muted-text);
        }

        .offerte-extra-options {
          background: var(--section-bg);
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .offerte-extra-options strong {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--heading-text);
        }

        .offerte-extra-options ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .offerte-extra-options li {
          padding: 0.5rem 0;
          color: var(--body-text);
          font-size: 0.9rem;
          border-bottom: 1px solid var(--border-color);
        }

        .offerte-extra-options li:last-child {
          border-bottom: none;
        }

        .offerte-contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
          margin-top: 1rem;
        }

        .offerte-contact-info .offerte-info-item {
          flex-direction: row;
          align-items: center;
          gap: 0.5rem;
        }

        .offerte-message {
          background: var(--section-bg);
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .offerte-message strong {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--heading-text);
        }

        .offerte-message p {
          margin: 0;
          color: var(--body-text);
          line-height: 1.6;
        }

        .offerte-card-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          background: var(--section-bg);
        }

        @media (max-width: 768px) {
          .offertes-grid {
            grid-template-columns: 1fr;
          }

          .offerte-info-grid {
            grid-template-columns: 1fr;
          }

          .offerte-card-footer {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  )
}
