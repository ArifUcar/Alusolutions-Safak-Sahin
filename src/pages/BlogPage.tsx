import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import type { BlogPost, MultiLanguageText } from '../lib/supabase'
import '../styles/BlogPage.css'

export default function BlogPage() {
  const { t, i18n } = useTranslation()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error loading blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLocalizedText = (text: MultiLanguageText | undefined): string => {
    if (!text) return ''
    const lang = i18n.language as keyof MultiLanguageText
    return text[lang] || text.nl || ''
  }

  const categories = ['all', ...new Set(posts.map(p => p.category).filter(Boolean))]

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(p => p.category === selectedCategory)

  return (
    <div className="blog-page">
      <Header />

      <section className="blog-hero">
        <div className="blog-hero-bg">
          <img src="/glasLux-home.webp" alt="Blog" />
        </div>
        <div className="container blog-hero-content">
          <h1>{t('blog.hero.title')}</h1>
          <p>{t('blog.hero.subtitle')}</p>
        </div>
      </section>

      <section className="blog-content">
        <div className="container">
          {categories.length > 1 && (
            <div className="blog-categories">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'all' ? t('blog.allPosts') : cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="blog-loading">
              <div className="spinner"></div>
              <p>{t('common.loading')}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="blog-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <h3>{t('blog.noPosts')}</h3>
              <p>{t('blog.noPostsDescription')}</p>
            </div>
          ) : (
            <div className="blog-grid">
              {filteredPosts.map(post => (
                <Link to={`/blog/${post.slug}`} key={post.id} className="blog-card">
                  {post.featured_image && (
                    <div className="blog-card-image">
                      <img src={post.featured_image} alt={getLocalizedText(post.title)} />
                    </div>
                  )}
                  <div className="blog-card-content">
                    {post.category && (
                      <span className="blog-card-category">{post.category}</span>
                    )}
                    <h2>{getLocalizedText(post.title)}</h2>
                    {post.excerpt && (
                      <p className="blog-card-excerpt">{getLocalizedText(post.excerpt)}</p>
                    )}
                    <div className="blog-card-meta">
                      {post.author && <span className="blog-author">{post.author}</span>}
                      <span className="blog-date">
                        {new Date(post.published_at || post.created_at).toLocaleDateString(i18n.language === 'nl' ? 'nl-NL' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <span className="blog-card-link">
                      {t('common.readMore')} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="blog-cta">
        <div className="container">
          <h2>{t('blog.cta.title')}</h2>
          <p>{t('blog.cta.subtitle')}</p>
          <div className="cta-buttons">
            <Link to="/offerte" className="btn btn-primary btn-large">{t('blog.cta.quoteButton')}</Link>
            <Link to="/contact" className="btn btn-secondary btn-large">{t('blog.cta.contactButton')}</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
