import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import type { GalleryImage } from '../../lib/supabase'

interface GalleryCategory {
  id: string
  name: string
  slug: string
  sort_order: number
}

export default function GalleryPage() {
  const { t } = useTranslation()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadCategory, setUploadCategory] = useState('')
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)

  // Category management modal
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null)
  const [editCategoryName, setEditCategoryName] = useState('')

  // Default categories (fallback)
  const defaultCategories: GalleryCategory[] = [
    { id: '1', name: 'Veranda', slug: 'veranda', sort_order: 1 },
    { id: '2', name: 'Carport', slug: 'carport', sort_order: 2 },
    { id: '3', name: 'Tuinkamer', slug: 'tuinkamer', sort_order: 3 },
    { id: '4', name: 'Glazen Veranda', slug: 'glazen', sort_order: 4 },
    { id: '5', name: 'Lamellen Veranda', slug: 'lamellen', sort_order: 5 },
    { id: '6', name: 'Polycarbonaat', slug: 'polycarbonaat', sort_order: 6 },
    { id: '7', name: 'Cube Veranda', slug: 'cube', sort_order: 7 },
    { id: '8', name: 'Overige', slug: 'other', sort_order: 99 }
  ]

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadImages()
  }, [selectedCategory])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        console.log('Using default categories')
        setCategories(defaultCategories)
      } else if (data && data.length > 0) {
        setCategories(data)
      } else {
        setCategories(defaultCategories)
      }
    } catch {
      setCategories(defaultCategories)
    }
  }

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setPendingFiles(Array.from(files))
    setUploadCategory(selectedCategory === 'all' ? '' : selectedCategory)
    setShowUploadModal(true)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpload = async () => {
    if (!uploadCategory || pendingFiles.length === 0) {
      alert(t('admin.gallery.selectCategory', 'Lütfen bir kategori seçin'))
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const totalFiles = pendingFiles.length
      let completed = 0

      for (const file of pendingFiles) {
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
            category: uploadCategory,
            is_active: true
          })

        if (dbError) throw dbError

        completed++
        setUploadProgress(Math.round((completed / totalFiles) * 100))
      }

      setShowUploadModal(false)
      setPendingFiles([])
      setUploadCategory('')
      loadImages()
    } catch (error) {
      console.error('Error uploading:', error)
      alert(t('admin.gallery.uploadError'))
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm(t('admin.gallery.deleteConfirm'))) return

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
      alert(t('admin.gallery.deleteError'))
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

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    try {
      const { error } = await supabase
        .from('gallery_categories')
        .insert({
          name: newCategoryName.trim(),
          slug: slug,
          sort_order: categories.length + 1
        })

      if (error) {
        // If table doesn't exist, just add to local state
        setCategories([...categories, {
          id: Date.now().toString(),
          name: newCategoryName.trim(),
          slug: slug,
          sort_order: categories.length + 1
        }])
      } else {
        loadCategories()
      }

      setNewCategoryName('')
      setShowCategoryModal(false)
    } catch {
      // Add to local state as fallback
      setCategories([...categories, {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        slug: slug,
        sort_order: categories.length + 1
      }])
      setNewCategoryName('')
      setShowCategoryModal(false)
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory || !editCategoryName.trim()) return

    try {
      const { error } = await supabase
        .from('gallery_categories')
        .update({ name: editCategoryName.trim() })
        .eq('id', editingCategory.id)

      if (error) {
        // Update local state
        setCategories(categories.map(cat =>
          cat.id === editingCategory.id ? { ...cat, name: editCategoryName.trim() } : cat
        ))
      } else {
        loadCategories()
      }

      setEditingCategory(null)
      setEditCategoryName('')
    } catch {
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id ? { ...cat, name: editCategoryName.trim() } : cat
      ))
      setEditingCategory(null)
      setEditCategoryName('')
    }
  }

  const handleDeleteCategory = async (category: GalleryCategory) => {
    if (!confirm(`"${category.name}" kategorisini silmek istediğinize emin misiniz?`)) return

    try {
      // First update all images with this category to 'other'
      await supabase
        .from('gallery')
        .update({ category: 'other' })
        .eq('category', category.slug)

      const { error } = await supabase
        .from('gallery_categories')
        .delete()
        .eq('id', category.id)

      if (error) {
        setCategories(categories.filter(cat => cat.id !== category.id))
      } else {
        loadCategories()
      }

      if (selectedCategory === category.slug) {
        setSelectedCategory('all')
      }
      loadImages()
    } catch {
      setCategories(categories.filter(cat => cat.id !== category.id))
    }
  }

  const handleMoveCategory = async (category: GalleryCategory, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex(cat => cat.id === category.id)
    if (direction === 'up' && currentIndex === 0) return
    if (direction === 'down' && currentIndex === categories.length - 1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const newCategories = [...categories]
    const [removed] = newCategories.splice(currentIndex, 1)
    newCategories.splice(newIndex, 0, removed)

    // Update sort orders
    const updatedCategories = newCategories.map((cat, index) => ({
      ...cat,
      sort_order: index + 1
    }))

    setCategories(updatedCategories)

    // Update in database
    try {
      for (const cat of updatedCategories) {
        await supabase
          .from('gallery_categories')
          .update({ sort_order: cat.sort_order })
          .eq('id', cat.id)
      }
    } catch {
      console.log('Could not update sort order in database')
    }
  }

  // Lazy loading image component
  const LazyImage = useCallback(({ src, alt }: { src: string; alt: string }) => {
    const [loaded, setLoaded] = useState(false)
    const [inView, setInView] = useState(false)
    const imgRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        },
        { rootMargin: '100px' }
      )

      if (imgRef.current) {
        observer.observe(imgRef.current)
      }

      return () => observer.disconnect()
    }, [])

    return (
      <div ref={imgRef} className="lazy-image-container">
        {!loaded && (
          <div className="image-placeholder">
            <div className="spinner-small"></div>
          </div>
        )}
        {inView && (
          <img
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
          />
        )}
      </div>
    )
  }, [])

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>{t('admin.gallery.title')}</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="admin-btn admin-btn-outline"
            onClick={() => setShowCategoryManager(true)}
            style={{ border: '1px solid #e5e7eb' }}
          >
            ⚙️ {t('admin.gallery.manageCategories', 'Kategorileri Yönet')}
          </button>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? t('admin.gallery.uploading') : t('admin.gallery.uploadButton')}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      <div className="gallery-filters" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className={`admin-btn ${selectedCategory === 'all' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setSelectedCategory('all')}
          >
            {t('admin.gallery.all')}
          </button>
          {categories.map(cat => (
            <button
              key={cat.slug}
              className={`admin-btn ${selectedCategory === cat.slug ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              onClick={() => setSelectedCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>{t('admin.gallery.loading')}</p>
        </div>
      ) : images.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <h3>{t('admin.gallery.noImages')}</h3>
          <p>{t('admin.gallery.noImagesDesc')}</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map(image => (
            <div key={image.id} className="gallery-item" style={{ opacity: image.is_active ? 1 : 0.5 }}>
              <LazyImage src={image.url} alt={image.alt} />
              <div className="gallery-item-footer" style={{
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {/* Category Select */}
                <select
                  value={image.category}
                  onChange={(e) => handleUpdateCategory(image, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0',
                    fontSize: '0.8rem',
                    background: '#fff'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => handleToggleActive(image)}
                    style={{
                      background: image.is_active ? '#22c55e' : '#9ca3af',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    {image.is_active ? t('admin.gallery.active') : t('admin.gallery.inactive')}
                  </button>
                  <button
                    onClick={() => handleDelete(image)}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '4px',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => !uploading && setShowUploadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('admin.gallery.uploadTitle', 'Fotoğraf Yükle')}</h2>
              {!uploading && (
                <button className="modal-close" onClick={() => setShowUploadModal(false)}>×</button>
              )}
            </div>
            <div className="modal-body">
              <div className="upload-preview">
                <p style={{ marginBottom: '10px', fontWeight: 600 }}>
                  {pendingFiles.length} {t('admin.gallery.filesSelected', 'dosya seçildi')}
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {pendingFiles.slice(0, 6).map((file, index) => (
                    <div
                      key={index}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                  {pendingFiles.length > 6 && (
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        background: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        color: '#6b7280'
                      }}
                    >
                      +{pendingFiles.length - 6}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  {t('admin.gallery.selectCategoryLabel', 'Kategori Seçin')} *
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  disabled={uploading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">{t('admin.gallery.chooseCategoryPlaceholder', '-- Kategori seçin --')}</option>
                  {categories.map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {uploading && (
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>{t('admin.gallery.uploadingProgress', 'Yükleniyor...')}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${uploadProgress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
              >
                {t('common.cancel', 'İptal')}
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={handleUpload}
                disabled={uploading || !uploadCategory}
              >
                {uploading ? t('admin.gallery.uploading') : t('admin.gallery.uploadButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div className="modal-overlay" onClick={() => setShowCategoryManager(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h2>{t('admin.gallery.manageCategories', 'Kategorileri Yönet')}</h2>
              <button className="modal-close" onClick={() => setShowCategoryManager(false)}>×</button>
            </div>
            <div className="modal-body">
              {/* Add new category */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder={t('admin.gallery.newCategoryPlaceholder', 'Yeni kategori adı...')}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    fontSize: '0.95rem'
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  + Ekle
                </button>
              </div>

              {/* Category list */}
              <div className="category-list">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="category-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      marginBottom: '8px'
                    }}
                  >
                    {/* Reorder buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <button
                        onClick={() => handleMoveCategory(category, 'up')}
                        disabled={index === 0}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: index === 0 ? 'not-allowed' : 'pointer',
                          opacity: index === 0 ? 0.3 : 1,
                          padding: '2px',
                          fontSize: '12px'
                        }}
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMoveCategory(category, 'down')}
                        disabled={index === categories.length - 1}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: index === categories.length - 1 ? 'not-allowed' : 'pointer',
                          opacity: index === categories.length - 1 ? 0.3 : 1,
                          padding: '2px',
                          fontSize: '12px'
                        }}
                      >
                        ▼
                      </button>
                    </div>

                    {/* Category name / edit */}
                    {editingCategory?.id === category.id ? (
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditCategory()
                          if (e.key === 'Escape') {
                            setEditingCategory(null)
                            setEditCategoryName('')
                          }
                        }}
                        autoFocus
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: '4px',
                          border: '1px solid #3b82f6',
                          fontSize: '0.9rem'
                        }}
                      />
                    ) : (
                      <span style={{ flex: 1, fontWeight: 500 }}>{category.name}</span>
                    )}

                    <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>({category.slug})</span>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {editingCategory?.id === category.id ? (
                        <>
                          <button
                            onClick={handleEditCategory}
                            style={{
                              background: '#22c55e',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 10px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => {
                              setEditingCategory(null)
                              setEditCategoryName('')
                            }}
                            style={{
                              background: '#9ca3af',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 10px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingCategory(category)
                              setEditCategoryName(category.name)
                            }}
                            style={{
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 10px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 10px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowCategoryManager(false)}
              >
                {t('common.close', 'Kapat')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal (kept for backwards compatibility) */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>{t('admin.gallery.addCategory', 'Yeni Kategori Ekle')}</h2>
              <button className="modal-close" onClick={() => setShowCategoryModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  {t('admin.gallery.categoryName', 'Kategori Adı')}
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder={t('admin.gallery.categoryNamePlaceholder', 'örn: Glazen Schuifwand')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    fontSize: '1rem'
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowCategoryModal(false)}
              >
                {t('common.cancel', 'İptal')}
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
              >
                {t('common.save', 'Kaydet')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .lazy-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          background: #f3f4f6;
          overflow: hidden;
        }

        .lazy-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
        }

        .spinner-small {
          width: 24px;
          height: 24px;
          border: 2px solid #e5e7eb;
          border-top-color: #22c55e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #9ca3af;
          line-height: 1;
        }

        .modal-close:hover {
          color: #374151;
        }

        .modal-body {
          padding: 20px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .gallery-item {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .gallery-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .gallery-item-footer {
          border-top: 1px solid #f3f4f6;
        }
      `}</style>
    </div>
  )
}
