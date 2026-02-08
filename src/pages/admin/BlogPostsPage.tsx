import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import type { BlogPost, MultiLanguageText } from '../../lib/supabase'

export default function BlogPostsPage() {
  const { t, i18n } = useTranslation()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    loadPosts()
  }, [filterPublished])

  const loadPosts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterPublished === 'published') {
        query = query.eq('is_published', true)
      } else if (filterPublished === 'draft') {
        query = query.eq('is_published', false)
      }

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error loading blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.blog.deleteConfirm'))) return

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadPosts()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          is_published: !post.is_published,
          published_at: !post.is_published ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id)

      if (error) throw error
      loadPosts()
    } catch (error) {
      console.error('Error updating:', error)
    }
  }

  const getLocalizedText = (text: MultiLanguageText | undefined): string => {
    if (!text) return ''
    const lang = i18n.language as keyof MultiLanguageText
    return text[lang] || text.nl || ''
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>{t('admin.blog.title')}</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            className="admin-select"
            value={filterPublished}
            onChange={(e) => setFilterPublished(e.target.value as 'all' | 'published' | 'draft')}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}
          >
            <option value="all">{t('admin.blog.filterAll')}</option>
            <option value="published">{t('admin.blog.filterPublished')}</option>
            <option value="draft">{t('admin.blog.filterDraft')}</option>
          </select>
          <Link to="/admin/blog/new" className="admin-btn admin-btn-primary">
            + {t('admin.blog.newPost')}
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <h3>{t('admin.blog.noPosts')}</h3>
          <Link to="/admin/blog/new" className="admin-btn admin-btn-primary">
            {t('admin.blog.createFirst')}
          </Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.blog.tableTitle')}</th>
                <th>{t('admin.blog.tableCategory')}</th>
                <th>{t('admin.blog.tableStatus')}</th>
                <th>{t('admin.blog.tableDate')}</th>
                <th>{t('admin.blog.tableActions')}</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{getLocalizedText(post.title)}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>/{post.slug}</div>
                  </td>
                  <td>{post.category || '-'}</td>
                  <td>
                    <span
                      className={`status-badge ${post.is_published ? 'status-success' : 'status-pending'}`}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        background: post.is_published ? '#dcfce7' : '#fef3c7',
                        color: post.is_published ? '#166534' : '#92400e'
                      }}
                    >
                      {post.is_published ? t('admin.blog.published') : t('admin.blog.draft')}
                    </span>
                  </td>
                  <td>
                    {new Date(post.created_at).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'nl-NL')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        to={`/admin/blog/${post.id}`}
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      >
                        {t('common.edit')}
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className="admin-btn"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.85rem',
                          background: post.is_published ? '#fef3c7' : '#dcfce7',
                          color: post.is_published ? '#92400e' : '#166534',
                          border: 'none'
                        }}
                      >
                        {post.is_published ? t('admin.blog.unpublish') : t('admin.blog.publish')}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      >
                        {t('common.delete')}
                      </button>
                    </div>
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
