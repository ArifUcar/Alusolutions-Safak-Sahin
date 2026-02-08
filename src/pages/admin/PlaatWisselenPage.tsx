import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import type { PlaatWisselenRequest } from '../../lib/supabase'

export default function PlaatWisselenPage() {
  const { i18n } = useTranslation()
  const [requests, setRequests] = useState<PlaatWisselenRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<PlaatWisselenRequest | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    loadRequests()
  }, [filterStatus])

  const loadRequests = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('plaat_wisselen_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      const { data, error } = await query

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error loading requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('plaat_wisselen_requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      loadRequests()
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, status: newStatus as any })
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu talebi silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('plaat_wisselen_requests')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSelectedRequest(null)
      loadRequests()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'badge-warning'
      case 'contacted': return 'badge-info'
      case 'quoted': return 'badge-primary'
      case 'completed': return 'badge-success'
      case 'cancelled': return 'badge-danger'
      default: return 'badge-secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Bekliyor',
      contacted: 'İletişime Geçildi',
      quoted: 'Teklif Verildi',
      completed: 'Tamamlandı',
      cancelled: 'İptal'
    }
    return labels[status] || status
  }

  const getRoofTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      veranda: 'Veranda',
      carport: 'Carport',
      tuinoverkapping: 'Tuinoverkapping',
      serre: 'Serre',
      maatwerk: 'Maatwerk constructie'
    }
    return labels[type] || type
  }

  const getPlateTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      helder: 'Helder',
      opaal: 'Opaal',
      brons: 'Brons',
      grijs: 'Grijs'
    }
    return labels[type] || type
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Plaat Wisselen Talepleri</h1>
        <select
          className="admin-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd' }}
        >
          <option value="all">Tüm Talepler</option>
          <option value="pending">Bekliyor</option>
          <option value="contacted">İletişime Geçildi</option>
          <option value="quoted">Teklif Verildi</option>
          <option value="completed">Tamamlandı</option>
          <option value="cancelled">İptal</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          <h3>Henüz talep yok</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedRequest ? '1fr 1fr' : '1fr', gap: '20px' }}>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Müşteri</th>
                  <th>Plaat Sayısı</th>
                  <th>Durum</th>
                  <th>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(request => (
                  <tr
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    style={{
                      cursor: 'pointer',
                      background: selectedRequest?.id === request.id ? '#f0f9ff' : undefined
                    }}
                  >
                    <td>
                      <div style={{ fontWeight: 600 }}>{request.first_name} {request.last_name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        {request.city}
                      </div>
                    </td>
                    <td>{request.plate_count} plaat</td>
                    <td>
                      <span className={`admin-badge ${getStatusBadgeClass(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </span>
                    </td>
                    <td>{new Date(request.created_at).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'nl-NL')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedRequest && (
            <div className="admin-form" style={{ height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Talep Detayları</h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <strong>Ad Soyad:</strong> {selectedRequest.first_name} {selectedRequest.last_name}
                </div>
                <div>
                  <strong>E-posta:</strong> {selectedRequest.email}
                </div>
                <div>
                  <strong>Telefon:</strong> {selectedRequest.phone}
                </div>
                <div>
                  <strong>Adres:</strong> {selectedRequest.address}, {selectedRequest.postcode} {selectedRequest.city}
                </div>

                <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

                <div>
                  <strong>Plaat Sayısı:</strong> {selectedRequest.plate_count}
                </div>
                <div>
                  <strong>Derinlik:</strong> {selectedRequest.depth}
                </div>
                <div>
                  <strong>Çatı Tipi:</strong> {getRoofTypeLabel(selectedRequest.roof_type)}
                </div>
                <div>
                  <strong>Plaat Tipi:</strong> {getPlateTypeLabel(selectedRequest.plate_type)}
                </div>

                {selectedRequest.message && (
                  <>
                    <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
                    <div>
                      <strong>Mesaj:</strong>
                      <p style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>{selectedRequest.message}</p>
                    </div>
                  </>
                )}

                {selectedRequest.image_url && (
                  <>
                    <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
                    <div>
                      <strong>Fotoğraf:</strong>
                      <a
                        href={selectedRequest.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'block', marginTop: '8px' }}
                      >
                        <img
                          src={selectedRequest.image_url}
                          alt="Mevcut durum"
                          style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                      </a>
                    </div>
                  </>
                )}

                <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

                <div>
                  <strong>Durum:</strong>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => handleStatusChange(selectedRequest.id, e.target.value)}
                    style={{ marginLeft: '10px', padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd' }}
                  >
                    <option value="pending">Bekliyor</option>
                    <option value="contacted">İletişime Geçildi</option>
                    <option value="quoted">Teklif Verildi</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="cancelled">İptal</option>
                  </select>
                </div>

                <div>
                  <strong>Tarih:</strong> {new Date(selectedRequest.created_at).toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'nl-NL')}
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href={`mailto:${selectedRequest.email}?subject=Plaat wisselen offerte`}
                  className="admin-btn admin-btn-primary"
                >
                  E-posta Gönder
                </a>
                <a
                  href={`tel:${selectedRequest.phone}`}
                  className="admin-btn admin-btn-secondary"
                >
                  Ara
                </a>
                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => handleDelete(selectedRequest.id)}
                >
                  Sil
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
