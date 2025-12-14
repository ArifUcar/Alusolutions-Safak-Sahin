import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Product, GalleryImage } from '../../lib/supabase'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showGalleryPicker, setShowGalleryPicker] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image_url: '',
    gallery_images: [] as string[],
    specifications: {} as Record<string, string>,
    is_active: true
  })

  const [newSpec, setNewSpec] = useState({ key: '', value: '' })

  const categories = [
    'Veranda',
    'Carport',
    'Tuinkamer',
    'Glazen',
    'Lamellen',
    'Schuifwand',
    'Vouwdak',
    'Cube'
  ]

  useEffect(() => {
    loadProducts()
    loadGalleryImages()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGalleryImages(data || [])
    } catch (error) {
      console.error('Error loading gallery:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingProduct.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert(formData)

        if (error) throw error
      }

      resetForm()
      loadProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Kaydetme hatası!')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category || '',
      image_url: product.image_url || '',
      gallery_images: product.gallery_images || [],
      specifications: product.specifications || {},
      is_active: product.is_active
    })
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadProducts()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setIsCreating(false)
    setFormData({
      name: '',
      description: '',
      category: '',
      image_url: '',
      gallery_images: [],
      specifications: {},
      is_active: true
    })
  }

  const addSpecification = () => {
    if (newSpec.key && newSpec.value) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [newSpec.key]: newSpec.value
        }
      })
      setNewSpec({ key: '', value: '' })
    }
  }

  const removeSpecification = (key: string) => {
    const { [key]: _, ...rest } = formData.specifications
    setFormData({ ...formData, specifications: rest })
  }

  const toggleGalleryImage = (url: string) => {
    if (formData.gallery_images.includes(url)) {
      setFormData({
        ...formData,
        gallery_images: formData.gallery_images.filter(img => img !== url)
      })
    } else {
      setFormData({
        ...formData,
        gallery_images: [...formData.gallery_images, url]
      })
    }
  }

  if (isCreating) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}</h1>
          <button className="admin-btn admin-btn-secondary" onClick={resetForm}>
            ← Geri
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Ürün Adı</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Seçin...</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
            />
          </div>

          <div className="form-group">
            <label>Ana Görsel URL</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="Görsel URL'si veya galeriden seçin"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowGalleryPicker(true)}
              >
                Galeriden Seç
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Galeri Görselleri ({formData.gallery_images.length} seçili)</label>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setShowGalleryPicker(true)}
            >
              Görselleri Yönet
            </button>
            {formData.gallery_images.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                {formData.gallery_images.map((url, i) => (
                  <img key={i} src={url} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Özellikler</label>
            {Object.entries(formData.specifications).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                <span style={{ flex: 1 }}><strong>{key}:</strong> {value}</span>
                <button
                  type="button"
                  onClick={() => removeSpecification(key)}
                  style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Özellik adı"
                value={newSpec.key}
                onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
              />
              <input
                type="text"
                placeholder="Değer"
                value={newSpec.value}
                onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
              />
              <button type="button" className="admin-btn admin-btn-secondary" onClick={addSpecification}>
                Ekle
              </button>
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              Aktif
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="admin-btn admin-btn-primary">
              {editingProduct ? 'Güncelle' : 'Oluştur'}
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={resetForm}>
              İptal
            </button>
          </div>
        </form>

        {showGalleryPicker && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#fff',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '800px',
              maxHeight: '80vh',
              overflow: 'auto',
              width: '90%'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>Görsel Seç</h3>
                <button onClick={() => setShowGalleryPicker(false)} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                {galleryImages.map(img => (
                  <div
                    key={img.id}
                    onClick={() => toggleGalleryImage(img.url)}
                    style={{
                      cursor: 'pointer',
                      border: formData.gallery_images.includes(img.url) ? '3px solid #22c55e' : '3px solid transparent',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => setShowGalleryPicker(false)}
                style={{ marginTop: '20px', width: '100%' }}
              >
                Tamam ({formData.gallery_images.length} seçili)
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Ürün Yönetimi</h1>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => setIsCreating(true)}
        >
          + Yeni Ürün
        </button>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h3>Henüz ürün yok</h3>
          <p>Yeni ürün eklemek için butona tıklayın</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Görsel</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt=""
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>
                    <span className={`status-badge ${product.is_active ? 'confirmed' : 'pending'}`}>
                      {product.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="admin-btn admin-btn-secondary"
                      onClick={() => handleEdit(product)}
                      style={{ padding: '6px 12px' }}
                    >
                      Düzenle
                    </button>
                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={() => handleDelete(product.id)}
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
