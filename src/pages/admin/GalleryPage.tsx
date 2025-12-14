import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import type { GalleryImage } from '../../lib/supabase'

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: 'all', label: 'Tümü' },
    { value: 'veranda', label: 'Veranda' },
    { value: 'carport', label: 'Carport' },
    { value: 'tuinkamer', label: 'Tuinkamer' },
    { value: 'glazen', label: 'Glazen' },
    { value: 'lamellen', label: 'Lamellen' },
    { value: 'other', label: 'Diğer' }
  ]

  useEffect(() => {
    loadImages()
  }, [selectedCategory])

  const loadImages = async () => {
    setLoading(true)
    try {
      let query = supabase.from('gallery').select('*').order('created_at', { ascending: false })

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Error loading images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        const filePath = `${fileName}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath)

        // Save to database
        const { error: dbError } = await supabase
          .from('gallery')
          .insert({
            url: publicUrl,
            alt: file.name.split('.')[0],
            category: selectedCategory === 'all' ? 'other' : selectedCategory,
            is_active: true
          })

        if (dbError) throw dbError
      }

      loadImages()
    } catch (error) {
      console.error('Error uploading:', error)
      alert('Yükleme hatası!')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return

    try {
      // Extract filename from URL
      const fileName = image.url.split('/').pop()

      // Delete from storage
      if (fileName) {
        await supabase.storage.from('gallery').remove([fileName])
      }

      // Delete from database
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', image.id)

      if (error) throw error
      loadImages()
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Silme hatası!')
    }
  }

  const handleToggleActive = async (image: GalleryImage) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .update({ is_active: !image.is_active })
        .eq('id', image.id)

      if (error) throw error
      loadImages()
    } catch (error) {
      console.error('Error updating:', error)
    }
  }

  const handleUpdateCategory = async (image: GalleryImage, newCategory: string) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .update({ category: newCategory })
        .eq('id', image.id)

      if (error) throw error
      loadImages()
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Galeri Yönetimi</h1>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Yükleniyor...' : '+ Görsel Yükle'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
      </div>

      <div className="gallery-filters" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`admin-btn ${selectedCategory === cat.value ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <h3>Henüz görsel yok</h3>
          <p>Görsel yüklemek için yukarıdaki butona tıklayın</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map(image => (
            <div key={image.id} className="gallery-item" style={{ opacity: image.is_active ? 1 : 0.5 }}>
              <img src={image.url} alt={image.alt} />
              <div className="gallery-item-info" style={{ padding: '10px' }}>
                <select
                  value={image.category}
                  onChange={(e) => handleUpdateCategory(image, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '5px',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0',
                    fontSize: '0.8rem'
                  }}
                >
                  {categories.filter(c => c.value !== 'all').map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="actions">
                <button
                  onClick={() => handleToggleActive(image)}
                  style={{
                    background: image.is_active ? '#22c55e' : '#9ca3af',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem'
                  }}
                >
                  {image.is_active ? 'Aktif' : 'Pasif'}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(image)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
