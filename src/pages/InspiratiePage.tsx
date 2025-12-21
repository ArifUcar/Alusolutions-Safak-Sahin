import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import type { GalleryImage } from '../lib/supabase'
import '../styles/InspiratiePage.css'

export default function InspiratiePage() {
  const { t } = useTranslation()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null)

  const categories = [
    { value: 'all', label: t('inspiratie.filters.all') },
    { value: 'veranda', label: 'Veranda' },
    { value: 'glazen', label: t('inspiratie.filters.glass') },
    { value: 'lamellen', label: t('inspiratie.filters.slats') },
    { value: 'tuinkamer', label: t('inspiratie.filters.gardenRoom') },
    { value: 'carport', label: 'Carport' },
    { value: 'other', label: t('header.other') }
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

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat ? cat.label : category
  }

  return (
    <div className="inspiratie-page">
      <Header />

      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat.value}
                className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Gallery */}
      <section className="main-gallery">
        <div className="container">
          {loading ? (
            <div className="gallery-loading">
              <div className="spinner"></div>
              <p>{t('common.loading')}</p>
            </div>
          ) : images.length === 0 ? (
            <div className="gallery-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <h3>{t('inspiratie.gallery.noImages')}</h3>
              <p>{t('inspiratie.gallery.noImagesDescription')}</p>
            </div>
          ) : (
            <div className="gallery-masonry">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`gallery-item ${index % 5 === 0 ? 'large' : ''}`}
                  onClick={() => setLightboxImage(image)}
                >
                  <img src={image.url} alt={image.alt} loading="lazy" />
                  <div className="gallery-overlay">
                    <span className="gallery-category">{getCategoryLabel(image.category)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="inspiratie-cta">
        <div className="container">
          <h2>{t('inspiratie.cta.title')}</h2>
          <p>{t('inspiratie.cta.subtitle')}</p>
          <div className="cta-buttons">
            <Link to="/offerte" className="btn btn-primary btn-large">{t('inspiratie.cta.quoteButton')}</Link>
            <Link to="/contact" className="btn btn-secondary btn-large">{t('inspiratie.cta.contactButton')}</Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="lightbox" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxImage(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <img src={lightboxImage.url} alt={lightboxImage.alt} />
            <div className="lightbox-info">
              <span className="lightbox-category">{getCategoryLabel(lightboxImage.category)}</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
