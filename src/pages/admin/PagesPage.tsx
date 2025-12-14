import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Page } from '../../lib/supabase'

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    page_type: 'configurator' as 'content' | 'configurator',
    is_published: false,
    show_in_header: false,
    header_order: 0
  })

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPages(data || [])
    } catch (error) {
      console.error('Error loading pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingPage) {
        const { error } = await supabase
          .from('pages')
          .update(formData)
          .eq('id', editingPage.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('pages')
          .insert(formData)

        if (error) throw error
      }

      resetForm()
      loadPages()
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Kaydetme hatası!')
    }
  }

  const handleEdit = (page: Page) => {
    setEditingPage(page)
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content || '',
      meta_description: page.meta_description || '',
      page_type: page.page_type || 'content',
      is_published: page.is_published,
      show_in_header: page.show_in_header || false,
      header_order: page.header_order || 0
    })
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadPages()
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Silme hatası!')
    }
  }

  const handleTogglePublish = async (page: Page) => {
    try {
      const { error } = await supabase
        .from('pages')
        .update({ is_published: !page.is_published })
        .eq('id', page.id)

      if (error) throw error
      loadPages()
    } catch (error) {
      console.error('Error updating:', error)
    }
  }

  const resetForm = () => {
    setEditingPage(null)
    setIsCreating(false)
    setFormData({
      title: '',
      slug: '',
      content: '',
      meta_description: '',
      page_type: 'configurator',
      is_published: false,
      show_in_header: false,
      header_order: 0
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  if (isCreating) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>{editingPage ? 'Sayfa Düzenle' : 'Yeni Sayfa'}</h1>
          <button className="admin-btn admin-btn-secondary" onClick={resetForm}>
            ← Geri
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Başlık</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  title: e.target.value,
                  slug: editingPage ? formData.slug : generateSlug(e.target.value)
                })
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>URL Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Meta Açıklama (SEO)</label>
            <input
              type="text"
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              placeholder="Arama motorları için açıklama..."
            />
          </div>

          <div className="form-group">
            <div style={{
              padding: '15px',
              borderRadius: '8px',
              background: '#f3e8ff',
              border: '1px solid #d8b4fe'
            }}>
              <p style={{ color: '#6b21a8', fontSize: '0.95rem', margin: 0, fontWeight: '500' }}>
                ℹ️ Bu sayfa Konfigüratör seçeneklerini gösterecek. Seçenekleri "Konfigüratör" menüsünden yönetebilirsiniz.
              </p>
            </div>
          </div>

          <div className="form-group">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px',
              borderRadius: '8px',
              background: formData.is_published ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${formData.is_published ? '#bbf7d0' : '#fecaca'}`,
              transition: 'all 0.3s ease'
            }}>
              <div>
                <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                  Yayınla
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  {formData.is_published ? 'Sayfa yayında ve görünür' : 'Sayfa taslak olarak saklanacak'}
                </div>
              </div>
              <label style={{
                position: 'relative',
                display: 'inline-block',
                width: '56px',
                height: '28px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: formData.is_published ? '#22c55e' : '#ef4444',
                  borderRadius: '28px',
                  transition: '0.3s',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '22px',
                    width: '22px',
                    left: formData.is_published ? '30px' : '3px',
                    bottom: '3px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: '0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}></span>
                </span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px',
              borderRadius: '8px',
              background: formData.show_in_header ? '#eff6ff' : '#f9fafb',
              border: `1px solid ${formData.show_in_header ? '#bfdbfe' : '#e5e7eb'}`,
              transition: 'all 0.3s ease'
            }}>
              <div>
                <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                  Header'da Göster
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  {formData.show_in_header ? 'Sayfa menüde görünecek' : 'Sayfa menüde görünmeyecek'}
                </div>
              </div>
              <label style={{
                position: 'relative',
                display: 'inline-block',
                width: '56px',
                height: '28px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formData.show_in_header}
                  onChange={(e) => setFormData({ ...formData, show_in_header: e.target.checked })}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: formData.show_in_header ? '#3b82f6' : '#9ca3af',
                  borderRadius: '28px',
                  transition: '0.3s',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '22px',
                    width: '22px',
                    left: formData.show_in_header ? '30px' : '3px',
                    bottom: '3px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: '0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}></span>
                </span>
              </label>
            </div>
          </div>

          {formData.show_in_header && (
            <div className="form-group">
              <label>Header Sırası</label>
              <input
                type="number"
                value={formData.header_order}
                onChange={(e) => setFormData({ ...formData, header_order: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="admin-btn admin-btn-primary">
              {editingPage ? 'Güncelle' : 'Oluştur'}
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={resetForm}>
              İptal
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Sayfa Yönetimi</h1>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => setIsCreating(true)}
        >
          + Yeni Sayfa
        </button>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      ) : pages.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <h3>Henüz sayfa yok</h3>
          <p>Yeni sayfa oluşturmak için butona tıklayın</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>URL</th>
                <th>Tip</th>
                <th>Header</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id}>
                  <td>{page.title}</td>
                  <td>/{page.slug}</td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      background: page.page_type === 'configurator' ? '#8b5cf6' : '#3b82f6',
                      color: '#fff'
                    }}>
                      {page.page_type === 'configurator' ? 'Konfig' : 'İçerik'}
                    </span>
                  </td>
                  <td>
                    {page.show_in_header ? (
                      <span style={{ color: '#22c55e' }}>✓ ({page.header_order})</span>
                    ) : '-'}
                  </td>
                  <td>
                    <span className={`status-badge ${page.is_published ? 'confirmed' : 'pending'}`}>
                      {page.is_published ? 'Yayında' : 'Taslak'}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="admin-btn admin-btn-secondary"
                      onClick={() => handleEdit(page)}
                      style={{ padding: '6px 12px' }}
                    >
                      Düzenle
                    </button>
                    <button
                      className="admin-btn"
                      onClick={() => handleTogglePublish(page)}
                      style={{
                        padding: '6px 12px',
                        background: page.is_published ? '#f59e0b' : '#22c55e',
                        color: '#fff',
                        border: 'none'
                      }}
                    >
                      {page.is_published ? 'Gizle' : 'Yayınla'}
                    </button>
                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={() => handleDelete(page.id)}
                      style={{ padding: '6px 12px' }}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
