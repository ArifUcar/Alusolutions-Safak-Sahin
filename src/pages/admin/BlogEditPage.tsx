import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Editor } from 'primereact/editor'
import { supabase } from '../../lib/supabase'
import type { MultiLanguageText } from '../../lib/supabase'
import 'quill/dist/quill.snow.css'

export default function BlogEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isEditing = id !== 'new' && id !== undefined
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState<{
    slug: string
    title: MultiLanguageText
    excerpt: MultiLanguageText
    content: MultiLanguageText
    featured_image: string
    category: string
    author: string
    is_published: boolean
  }>({
    slug: '',
    title: { nl: '', en: '', tr: '', de: '' },
    excerpt: { nl: '', en: '', tr: '', de: '' },
    content: { nl: '', en: '', tr: '', de: '' },
    featured_image: '',
    category: '',
    author: '',
    is_published: false
  })

  const [currentLanguage, setCurrentLanguage] = useState<keyof MultiLanguageText>('nl')
  const languages: { code: keyof MultiLanguageText; name: string }[] = [
    { code: 'nl', name: 'Nederlands' },
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Turkce' },
    { code: 'de', name: 'Deutsch' }
  ]

  useEffect(() => {
    if (isEditing && id) {
      loadPost()
    }
  }, [id])

  const loadPost = async () => {
    if (!id) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setFormData({
        slug: data.slug,
        title: data.title || { nl: '', en: '', tr: '', de: '' },
        excerpt: data.excerpt || { nl: '', en: '', tr: '', de: '' },
        content: data.content || { nl: '', en: '', tr: '', de: '' },
        featured_image: data.featured_image || '',
        category: data.category || '',
        author: data.author || '',
        is_published: data.is_published
      })
    } catch (error) {
      console.error('Error loading post:', error)
      alert(t('admin.blog.loadError'))
      navigate('/admin/blog')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const postData = {
        slug: formData.slug,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        featured_image: formData.featured_image || null,
        category: formData.category || null,
        author: formData.author || null,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }

      if (isEditing) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert(postData)

        if (error) throw error
      }

      navigate('/admin/blog')
    } catch (error: any) {
      console.error('Error saving post:', error)
      if (error.code === '23505') {
        alert(t('admin.blog.slugExists'))
      } else {
        alert(t('admin.blog.saveError'))
      }
    } finally {
      setSaving(false)
    }
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const fileName = `blog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

      // Upload to Supabase Storage (gallery bucket)
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName)

      setFormData({ ...formData, featured_image: publicUrl })
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Görsel yükleme hatası!')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, featured_image: '' })
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => navigate('/admin/blog')}
            style={{ marginRight: '1rem' }}
          >
            ← {t('common.back')}
          </button>
          <h1 style={{ display: 'inline' }}>
            {isEditing ? t('admin.blog.editPost') : t('admin.blog.newPost')}
          </h1>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? t('common.saving') : t('common.save')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-form" style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="form-group">
            <label>{t('admin.blog.slug')} *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="mijn-blog-post"
              required
            />
            <small>{t('admin.blog.slugHelp')}</small>
          </div>

          <div className="form-group">
            <label>{t('admin.blog.category')}</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Veranda, Tips, Nieuws..."
            />
          </div>

          <div className="form-group">
            <label>{t('admin.blog.author')}</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label>{t('admin.blog.featuredImage')}</label>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
              background: 'var(--section-bg)'
            }}>
              {formData.featured_image ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={formData.featured_image}
                    alt="Featured"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '6px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    >
                      Değiştir
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger"
                      onClick={handleRemoveImage}
                      style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5, marginBottom: '0.5rem' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <p style={{ margin: '0 0 0.75rem 0', color: 'var(--muted-text)', fontSize: '0.9rem' }}>
                    PNG, JPG, WEBP, GIF desteklenir
                  </p>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    style={{ fontSize: '0.85rem' }}
                  >
                    {uploading ? 'Yükleniyor...' : 'Görsel Yükle'}
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              style={{ width: 'auto' }}
            />
            <span>{t('admin.blog.publishPost')}</span>
          </label>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{t('admin.blog.multiLanguage')}</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {languages.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setCurrentLanguage(lang.code)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--border-color)',
                  background: currentLanguage === lang.code ? '#8b5cf6' : 'var(--section-bg)',
                  color: currentLanguage === lang.code ? 'white' : 'var(--body-text)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--section-bg)', borderRadius: '8px' }}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>{t('admin.blog.title')} ({languages.find(l => l.code === currentLanguage)?.name}) *</label>
            <input
              type="text"
              value={formData.title[currentLanguage] || ''}
              onChange={(e) => {
                const newTitle = { ...formData.title, [currentLanguage]: e.target.value }
                const updates: any = { title: newTitle }
                if (!isEditing && currentLanguage === 'nl' && !formData.slug) {
                  updates.slug = generateSlug(e.target.value)
                }
                setFormData({ ...formData, ...updates })
              }}
              placeholder={t('admin.blog.titlePlaceholder')}
              required={currentLanguage === 'nl'}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>{t('admin.blog.excerpt')} ({languages.find(l => l.code === currentLanguage)?.name})</label>
            <textarea
              value={formData.excerpt[currentLanguage] || ''}
              onChange={(e) => setFormData({
                ...formData,
                excerpt: { ...formData.excerpt, [currentLanguage]: e.target.value }
              })}
              placeholder={t('admin.blog.excerptPlaceholder')}
              rows={3}
            />
            <small>{t('admin.blog.excerptHelp')}</small>
          </div>

          <div className="form-group">
            <label>{t('admin.blog.content')} ({languages.find(l => l.code === currentLanguage)?.name}) *</label>
            <Editor
              value={formData.content[currentLanguage] || ''}
              onTextChange={(e) => setFormData({
                ...formData,
                content: { ...formData.content, [currentLanguage]: e.htmlValue || '' }
              })}
              style={{ height: '400px' }}
              placeholder={t('admin.blog.contentPlaceholder')}
            />
            <small style={{ marginTop: '0.5rem', display: 'block' }}>Kalın, italik, liste ve daha fazla biçimlendirme seçeneği mevcuttur</small>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? t('common.saving') : isEditing ? t('common.save') : t('admin.blog.createPost')}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => navigate('/admin/blog')}
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  )
}
