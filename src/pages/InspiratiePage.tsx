import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import type { GalleryImage } from '../lib/supabase'
import '../styles/InspiratiePage.css'

interface GalleryCategory {
  id: string
  name: string
  slug: string
  sort_order: number
}

const IMAGES_PER_PAGE = 12

export default function InspiratiePage() {
  const { t } = useTranslation()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null)
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_PAGE)
  const [totalCount, setTotalCount] = useState(0)

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
    setVisibleCount(IMAGES_PER_PAGE)
    loadImages()
  }, [selectedCategory])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
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
      // First get total count
      let countQuery = supabase
        .from('gallery')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      if (selectedCategory !== 'all') {
        countQuery = countQuery.eq('category', selectedCategory)
      }

      const { count } = await countQuery
      setTotalCount(count || 0)

      // Then get first batch of images (only needed fields for performance)
      let query = supabase
        .from('gallery')
        .select('id, url, alt, category, is_active, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(0, IMAGES_PER_PAGE - 1)

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

  const loadMoreImages = async () => {
    setLoadingMore(true)
    try {
      let query = supabase
        .from('gallery')
        .select('id, url, alt, category, is_active, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(visibleCount, visibleCount + IMAGES_PER_PAGE - 1)

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error

      if (data && data.length > 0) {
        setImages(prev => [...prev, ...data])
        setVisibleCount(prev => prev + data.length)
      }
    } catch (error) {
      console.error('Error loading more images:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  const getCategoryLabel = (categorySlug: string) => {
    const cat = categories.find(c => c.slug === categorySlug)
    return cat ? cat.name : categorySlug
  }

  // Lazy loading image component with priority support
  const LazyImage = ({ src, alt, onClick, priority = false }: { src: string; alt: string; onClick: () => void; priority?: boolean }) => {
    const [loaded, setLoaded] = useState(false)
    const [inView, setInView] = useState(priority) // Priority images start as in view
    const imgRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (priority) return // Skip observer for priority images

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        },
        { rootMargin: '300px' } // Increased margin for earlier loading
      )

      if (imgRef.current) {
        observer.observe(imgRef.current)
      }

      return () => observer.disconnect()
    }, [priority])

    return (
      <div ref={imgRef} className="lazy-image-wrapper" onClick={onClick}>
        {!loaded && (
          <div className="image-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        )}
        {inView && (
          <img
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            style={{ opacity: loaded ? 1 : 0 }}
          />
        )}
      </div>
    )
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxImage) return

      if (e.key === 'Escape') {
        setLightboxImage(null)
      } else if (e.key === 'ArrowRight') {
        const currentIndex = images.findIndex(img => img.id === lightboxImage.id)
        if (currentIndex < images.length - 1) {
          setLightboxImage(images[currentIndex + 1])
        }
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = images.findIndex(img => img.id === lightboxImage.id)
        if (currentIndex > 0) {
          setLightboxImage(images[currentIndex - 1])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxImage, images])

  const goToNextImage = () => {
    if (!lightboxImage) return
    const currentIndex = images.findIndex(img => img.id === lightboxImage.id)
    if (currentIndex < images.length - 1) {
      setLightboxImage(images[currentIndex + 1])
    }
  }

  const goToPrevImage = () => {
    if (!lightboxImage) return
    const currentIndex = images.findIndex(img => img.id === lightboxImage.id)
    if (currentIndex > 0) {
      setLightboxImage(images[currentIndex - 1])
    }
  }

  return (
    <div className="inspiratie-page">
      <Helmet>
        <title>{t('inspiratie.hero.title')} | VivaVerandas</title>
        <meta name="description" content={t('inspiratie.hero.subtitle')} />
        <link rel="canonical" href="https://vivaverandas.nl/inspiratie" />
        <meta property="og:title" content={`${t('inspiratie.hero.title')} | VivaVerandas`} />
        <meta property="og:description" content={t('inspiratie.hero.subtitle')} />
        <meta property="og:url" content="https://vivaverandas.nl/inspiratie" />
        {/* Preload first 2 images for faster LCP */}
        {images.slice(0, 2).map((img, idx) => (
          <link key={idx} rel="preload" as="image" href={img.url} />
        ))}
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="inspiratie-hero">
        <div className="container">
          <h1>{t('inspiratie.hero.title')}</h1>
          <p>{t('inspiratie.hero.subtitle')}</p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              {t('inspiratie.filters.all', 'Alles')}
            </button>
            {categories.map(cat => (
              <button
                key={cat.slug}
                className={`filter-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                {cat.name}
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
            <>
              <div className="gallery-masonry">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className={`gallery-item ${index % 5 === 0 ? 'large' : ''}`}
                  >
                    <LazyImage
                      src={image.url}
                      alt={image.alt}
                      onClick={() => setLightboxImage(image)}
                      priority={index < 4} // First 4 images load with high priority
                    />
                    <div className="gallery-overlay" onClick={() => setLightboxImage(image)}>
                      <span className="gallery-category">{getCategoryLabel(image.category)}</span>
                      <span className="gallery-zoom">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {images.length < totalCount && (
                <div className="load-more-container">
                  <button
                    className="load-more-btn"
                    onClick={loadMoreImages}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <span className="load-more-spinner"></span>
                        {t('common.loading', 'Laden...')}
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                        {t('inspiratie.gallery.loadMore', 'Meer laden')}
                        <span className="load-more-count">
                          ({images.length} / {totalCount})
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
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

            {/* Navigation arrows */}
            {images.findIndex(img => img.id === lightboxImage.id) > 0 && (
              <button className="lightbox-nav lightbox-prev" onClick={goToPrevImage}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}

            {images.findIndex(img => img.id === lightboxImage.id) < images.length - 1 && (
              <button className="lightbox-nav lightbox-next" onClick={goToNextImage}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}

            <img src={lightboxImage.url} alt={lightboxImage.alt} />
            <div className="lightbox-info">
              <span className="lightbox-category">{getCategoryLabel(lightboxImage.category)}</span>
              <span className="lightbox-counter">
                {images.findIndex(img => img.id === lightboxImage.id) + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
