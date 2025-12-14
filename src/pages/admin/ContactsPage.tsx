import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Contact } from '../../lib/supabase'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [filterUnread, setFilterUnread] = useState(false)

  useEffect(() => {
    loadContacts()
  }, [filterUnread])

  const loadContacts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterUnread) {
        query = query.eq('is_read', false)
      }

      const { data, error } = await query

      if (error) throw error
      setContacts(data || [])
    } catch (error) {
      console.error('Error loading contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ is_read: true })
        .eq('id', id)

      if (error) throw error
      loadContacts()
    } catch (error) {
      console.error('Error updating:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSelectedContact(null)
      loadContacts()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const openMessage = (contact: Contact) => {
    setSelectedContact(contact)
    if (!contact.is_read) {
      handleMarkAsRead(contact.id)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Mesajlar</h1>
        <button
          className={`admin-btn ${filterUnread ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setFilterUnread(!filterUnread)}
        >
          {filterUnread ? 'Tümünü Göster' : 'Sadece Okunmamış'}
        </button>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <h3>Mesaj bulunamadı</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedContact ? '1fr 1fr' : '1fr', gap: '20px' }}>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Gönderen</th>
                  <th>Konu</th>
                  <th>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(contact => (
                  <tr
                    key={contact.id}
                    onClick={() => openMessage(contact)}
                    style={{
                      cursor: 'pointer',
                      fontWeight: contact.is_read ? 'normal' : 'bold',
                      background: selectedContact?.id === contact.id ? '#f0f9ff' : undefined
                    }}
                  >
                    <td>
                      <div>{contact.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'normal' }}>
                        {contact.email}
                      </div>
                    </td>
                    <td>{contact.subject}</td>
                    <td>{new Date(contact.created_at).toLocaleDateString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedContact && (
            <div className="admin-form" style={{ height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>{selectedContact.subject}</h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong>Gönderen:</strong> {selectedContact.name}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Email:</strong> {selectedContact.email}
              </div>
              {selectedContact.phone && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Telefon:</strong> {selectedContact.phone}
                </div>
              )}
              <div style={{ marginBottom: '15px' }}>
                <strong>Tarih:</strong> {new Date(selectedContact.created_at).toLocaleString('tr-TR')}
              </div>

              <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {selectedContact.message}
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  className="admin-btn admin-btn-primary"
                >
                  Yanıtla
                </a>
                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => handleDelete(selectedContact.id)}
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
