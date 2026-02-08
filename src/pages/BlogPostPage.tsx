import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import type { BlogPost, MultiLanguageText } from '../lib/supabase'
import '../styles/BlogPage.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (slug) {
      loadPost()
      incrementViewCount()
    }
  }, [slug])

  const loadPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          setNotFound(true)
        }
        throw error
      }
      setPost(data)
    } catch (error) {
      console.error('Error loading blog post:', error)
    } finally {
      setLoading(false)
    }
  }

  const incrementViewCount = async () => {
    try {
      await supabase.rpc('increment_blog_view', { post_slug: slug })
    } catch (error) {
      // Silently fail - view count is not critical
      console.log('View count increment not available')
    }
  }

  const getLocalizedText = (text: MultiLanguageText | undefined): string => {
    if (!text) return ''
    const lang = i18n.language as keyof MultiLanguageText
    return text[lang] || text.nl || ''
  }

  const formatContent = (content: string) => {
    // If content is already HTML (from rich text editor), return as-is
    if (content.includes('<') && content.includes('>')) {
      return content
    }
    // Fallback for plain text content
    return content
      .split('\n\n')
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('')
      .replace(/\n/g, '<br/>')
  }

  const getExcerpt = (content: string, maxLength: number = 160): string => {
    // Strip HTML tags
    const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  if (loading) {
    return (
      <div className="blog-post-page">
        <Header />
        <div className="blog-content">
          <div className="container">
            <div className="blog-loading">
              <div className="spinner"></div>
              <p>{t('common.loading')}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="blog-post-page">
        <Header />
        <div className="blog-content">
          <div className="container">
            <div className="blog-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3>{t('blog.postNotFound')}</h3>
              <p>{t('blog.postNotFoundDescription')}</p>
              <Link to="/blog" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                {t('blog.backToBlog')}
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const title = getLocalizedText(post.title)
  const description = post.excerpt
    ? getLocalizedText(post.excerpt as MultiLanguageText)
    : getExcerpt(getLocalizedText(post.content))
  const image = post.featured_image || 'https://vivaverandas.nl/glasLux-home.webp'
  const url = `https://vivaverandas.nl/blog/${slug}`
  const publishedDate = post.published_at || post.created_at

  return (
    <div className="blog-post-page">
      <Helmet>
        <title>{title} | VivaVerandas Blog</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content="VivaVerandas" />
        <meta property="article:published_time" content={publishedDate} />
        {post.author && <meta property="article:author" content={post.author} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": description,
            "image": image,
            "url": url,
            "datePublished": publishedDate,
            "dateModified": post.updated_at || publishedDate,
            "author": {
              "@type": "Person",
              "name": post.author || "VivaVerandas"
            },
            "publisher": {
              "@type": "Organization",
              "name": "VivaVerandas",
              "logo": {
                "@type": "ImageObject",
                "url": "https://vivaverandas.nl/logo.svg"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": url
            }
          })}
        </script>
      </Helmet>

      <Header />

      <section className="blog-post-hero">
        <div className="blog-post-hero-bg">
          <img
            src={post.featured_image || '/glasLux-home.webp'}
            alt={getLocalizedText(post.title)}
          />
        </div>
        <div className="container blog-post-hero-content">
          {post.category && (
            <span className="category">{post.category}</span>
          )}
          <h1>{getLocalizedText(post.title)}</h1>
          <div className="blog-post-meta">
            {post.author && <span>{post.author}</span>}
            <span>
              {new Date(post.published_at || post.created_at).toLocaleDateString(
                i18n.language === 'nl' ? 'nl-NL' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </span>
          </div>
        </div>
      </section>

      <section className="blog-post-content">
        <article className="blog-post-article">
          <div
            className="blog-post-body"
            dangerouslySetInnerHTML={{ __html: formatContent(getLocalizedText(post.content)) }}
          />
          <div className="blog-post-back">
            <Link to="/blog">← {t('blog.backToBlog')}</Link>
          </div>
        </article>
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
