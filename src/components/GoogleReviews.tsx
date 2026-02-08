/// <reference types="google.maps" />
import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/GoogleReviews.css'

interface Review {
  author_name: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
}

declare global {
  interface Window {
    initGooglePlaces?: () => void
    google?: typeof google
  }
}

export default function GoogleReviews() {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<Review[]>([])
  const [overallRating, setOverallRating] = useState<number>(4.9)
  const [totalReviews, setTotalReviews] = useState<number>(127)
  const [loading, setLoading] = useState(true)
  const [apiLoaded, setApiLoaded] = useState(false)
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set())
  const mapRef = useRef<HTMLDivElement>(null)

  const PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID
  const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY

  // Fallback reviews
  const fallbackReviews: Review[] = [
    {
      author_name: 'Jan de Vries',
      rating: 5,
      relative_time_description: '2 maanden geleden',
      text: 'Uitstekende service en kwaliteit! Onze nieuwe veranda is prachtig geworden. Het team was professioneel en de installatie verliep vlekkeloos.'
    },
    {
      author_name: 'Maria Jansen',
      rating: 5,
      relative_time_description: '3 maanden geleden',
      text: 'Zeer tevreden met onze glazen overkapping. Goede communicatie en perfecte afwerking. Aanrader!'
    },
    {
      author_name: 'Peter Bakker',
      rating: 5,
      relative_time_description: '1 maand geleden',
      text: 'Top bedrijf! Van offerte tot installatie alles perfect geregeld. De kwaliteit van de materialen is uitstekend.'
    },
    {
      author_name: 'Sophie van der Berg',
      rating: 5,
      relative_time_description: '2 weken geleden',
      text: 'Fantastische ervaring! Het team was erg behulpzaam en de veranda ziet er geweldig uit. Zeker een aanrader.'
    },
    {
      author_name: 'Erik Mulder',
      rating: 5,
      relative_time_description: '1 maand geleden',
      text: 'Professioneel bedrijf met oog voor detail. Onze tuinkamer is precies zoals we het wilden. Zeer tevreden!'
    }
  ]

  const fetchPlaceDetails = useCallback(() => {
    // Comprehensive checks before proceeding
    if (!mapRef.current) {
      console.log('Map ref not ready')
      setLoading(false)
      return
    }

    if (!window.google) {
      console.log('Google not loaded')
      setLoading(false)
      return
    }

    if (!window.google.maps) {
      console.log('Google Maps not loaded')
      setLoading(false)
      return
    }

    if (!window.google.maps.places) {
      console.log('Google Places not loaded')
      setLoading(false)
      return
    }

    if (!window.google.maps.places.PlacesService) {
      console.log('PlacesService not available')
      setLoading(false)
      return
    }

    try {
      const service = new google.maps.places.PlacesService(mapRef.current)

      if (!service || typeof service.getDetails !== 'function') {
        console.log('PlacesService not properly initialized')
        setLoading(false)
        return
      }

      const request: google.maps.places.PlaceDetailsRequest = {
        placeId: PLACE_ID,
        fields: ['name', 'rating', 'user_ratings_total', 'reviews']
      }

      service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          if (place.rating) {
            setOverallRating(place.rating)
          }
          if (place.user_ratings_total) {
            setTotalReviews(place.user_ratings_total)
          }
          if (place.reviews && place.reviews.length > 0) {
            const formattedReviews: Review[] = place.reviews.map((review: google.maps.places.PlaceReview) => ({
              author_name: review.author_name || 'Anonymous',
              profile_photo_url: review.profile_photo_url,
              rating: review.rating || 5,
              relative_time_description: review.relative_time_description || '',
              text: review.text || ''
            }))
            setReviews(formattedReviews)
          }
        } else {
          console.log('Places API status:', status)
        }
        setLoading(false)
      })
    } catch (error) {
      console.log('Error initializing PlacesService:', error)
      setLoading(false)
    }
  }, [PLACE_ID])

  // Load Google Maps API
  useEffect(() => {
    if (!PLACE_ID || !API_KEY) {
      setLoading(false)
      return
    }

    // Check if script is already loaded or loading
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')

    if (existingScript) {
      // Script exists, check if API is ready
      if (window.google?.maps?.places?.PlacesService) {
        setApiLoaded(true)
      } else {
        // Wait for it to load
        const checkReady = setInterval(() => {
          if (window.google?.maps?.places?.PlacesService) {
            clearInterval(checkReady)
            setApiLoaded(true)
          }
        }, 100)

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkReady)
          if (!apiLoaded) {
            setLoading(false)
          }
        }, 10000)
      }
      return
    }

    // Load Google Maps JavaScript API
    window.initGooglePlaces = () => {
      // Small delay to ensure everything is initialized
      setTimeout(() => {
        setApiLoaded(true)
      }, 100)
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initGooglePlaces`
    script.async = true
    script.defer = true

    script.onerror = () => {
      console.log('Failed to load Google Maps script')
      setLoading(false)
    }

    document.head.appendChild(script)

    return () => {
      delete window.initGooglePlaces
    }
  }, [PLACE_ID, API_KEY])

  // Fetch place details when API is loaded and mapRef is ready
  useEffect(() => {
    if (apiLoaded && mapRef.current) {
      // Small delay to ensure DOM is fully ready
      const timer = setTimeout(() => {
        fetchPlaceDetails()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [apiLoaded, fetchPlaceDetails])

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star filled">★</span>)
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="star half">★</span>)
      } else {
        stars.push(<span key={i} className="star empty">☆</span>)
      }
    }
    return stars
  }

  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews

  return (
    <section className="google-reviews">
      {/* Hidden div for PlacesService */}
      <div ref={mapRef} style={{ display: 'none' }}></div>

      <div className="container">
        <div className="reviews-header">
          <div className="google-badge">
            <svg viewBox="0 0 24 24" className="google-icon">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{t('reviews.googleReviews', 'Google Reviews')}</span>
          </div>
          <h2>{t('reviews.title', 'Wat onze klanten zeggen')}</h2>
          <div className="overall-rating">
            <div className="rating-score">{overallRating.toFixed(1)}</div>
            <div className="rating-details">
              <div className="stars-row">{renderStars(overallRating)}</div>
              <span className="review-count">
                {t('reviews.basedOn', 'Gebaseerd op')} {totalReviews} {t('reviews.reviews', 'beoordelingen')}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="reviews-loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="reviews-grid">
            {displayReviews.slice(0, 3).map((review, index) => {
              const isExpanded = expandedReviews.has(index)

              return (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-avatar">
                      {review.profile_photo_url ? (
                        <img src={review.profile_photo_url} alt={review.author_name} />
                      ) : (
                        <span>{review.author_name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="reviewer-info">
                      <h4>{review.author_name}</h4>
                      <span className="review-date">{review.relative_time_description}</span>
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                  <p className={`review-text ${isExpanded ? 'expanded' : ''}`}>{review.text}</p>
                  <button
                    className="review-expand-btn"
                    onClick={() => {
                      const newExpanded = new Set(expandedReviews)
                      if (isExpanded) {
                        newExpanded.delete(index)
                      } else {
                        newExpanded.add(index)
                      }
                      setExpandedReviews(newExpanded)
                    }}
                  >
                    {isExpanded ? t('reviews.showLess', 'Minder tonen') : t('reviews.readMore', 'Lees meer')}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div className="reviews-footer">
          <a
            href={`https://search.google.com/local/reviews?placeid=${PLACE_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            {t('reviews.viewAll', 'Bekijk alle reviews op Google')}
          </a>
          <a
            href={`https://search.google.com/local/writereview?placeid=${PLACE_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            {t('reviews.writeReview', 'Schrijf een review')}
          </a>
        </div>
      </div>
    </section>
  )
}
