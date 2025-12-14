import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { GalleryImage } from '../lib/supabase'
import '../styles/ImageSelector.css'

interface ImageSelectorProps {
  selectedImages: string[]
  onSelect: (images: string[]) => void
  maxSelect?: number
  category?: string
  title?: string
}

export default function ImageSelector({
  selectedImages,
  onSelect,
  maxSelect = 10,
  category,
  title = 'Beğendiğiniz Görselleri Seçin'
}: ImageSelectorProps) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(category || 'all')

  const categories = [
    { value: 'all', label: 'Tümü' },
    { value: 'veranda', label: 'Veranda' },
    { value: 'carport', label: 'Carport' },
    { value: 'tuinkamer', label: 'Tuinkamer' },
    { value: 'glazen', label: 'Glazen' },
    { value: 'lamellen', label: 'Lamellen' }
  ]

  useEffect(() => {
    loadImages()
  }, [selectedCategory])

  const loadImages = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

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

  const toggleImage = (url: string) => {
    if (selectedImages.includes(url)) {
      onSelect(selectedImages.filter(img => img !== url))
    } else if (selectedImages.length < maxSelect) {
      onSelect([...selectedImages, url])
    }
  }

  return (
    <div className="image-selector">
      <div className="image-selector-header">
        <h3>{title}</h3>
        <span className="selection-count">
          {selectedImages.length} / {maxSelect} seçili
        </span>
      </div>

      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat.value}
            className={`category-btn ${selectedCategory === cat.value ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="selector-loading">
          <div className="spinner"></div>
          <p>Görseller yükleniyor...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="selector-empty">
          <p>Bu kategoride görsel bulunamadı</p>
        </div>
      ) : (
        <div className="selector-grid">
          {images.map(image => (
            <div
              key={image.id}
              className={`selector-item ${selectedImages.includes(image.url) ? 'selected' : ''}`}
              onClick={() => toggleImage(image.url)}
            >
              <img src={image.url} alt={image.alt} />
              {selectedImages.includes(image.url) && (
                <div className="selected-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedImages.length > 0 && (
        <div className="selected-preview">
          <h4>Seçilen Görseller:</h4>
          <div className="preview-grid">
            {selectedImages.map((url, index) => (
              <div key={index} className="preview-item">
                <img src={url} alt="" />
                <button
                  className="remove-btn"
                  onClick={() => toggleImage(url)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
