import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import type { Configurator } from '../../lib/supabase'

export default function ConfiguratorsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [configurators, setConfigurators] = useState<Configurator[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadConfigurators()
  }, [filterCategory, filterStatus])

  const loadConfigurators = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('configurators')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (filterCategory !== 'all') {
        query = query.eq('category', filterCategory)
      }

      if (filterStatus === 'active') {
        query = query.eq('is_active', true)
      } else if (filterStatus === 'inactive') {
        query = query.eq('is_active', false)
      }

      const { data, error } = await query

      if (error) throw error
      setConfigurators(data || [])
    } catch (error) {
      console.error('Error loading configurators:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('configurators')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      loadConfigurators()
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.configurators.deleteConfirmFull'))) return

    try {
      const { error } = await supabase
        .from('configurators')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadConfigurators()
    } catch (error) {
      console.error('Error deleting:', error)
      alert(t('admin.configurators.deleteError'))
    }
  }

  const handleDuplicate = async (configurator: Configurator) => {
    try {
      // 1. Create the new configurator
      const newConfigData = {
        slug: `${configurator.slug}-copy-${Date.now()}`,
        name: {
          ...configurator.name,
          nl: `${configurator.name.nl} (${t('admin.configurators.copy')})`
        },
        description: configurator.description,
        category: configurator.category,
        image_url: configurator.image_url,
        icon: configurator.icon,
        is_active: false,
        display_order: configurator.display_order
      }

      const { data: newConfigurator, error: configError } = await supabase
        .from('configurators')
        .insert(newConfigData)
        .select()
        .single()

      if (configError) throw configError

      // 2. Get all steps with their options from the original configurator
      const { data: originalSteps, error: stepsError } = await supabase
        .from('configurator_steps')
        .select('*, configurator_options(*)')
        .eq('configurator_id', configurator.id)
        .order('step_order', { ascending: true })

      if (stepsError) throw stepsError

      // 3. Copy each step and its options
      if (originalSteps && originalSteps.length > 0) {
        for (const step of originalSteps) {
          // Create new step
          const newStepData = {
            configurator_id: newConfigurator.id,
            step_order: step.step_order,
            title: step.title,
            subtitle: step.subtitle,
            input_type: step.input_type,
            field_name: step.field_name,
            is_required: step.is_required,
            min_value: step.min_value,
            max_value: step.max_value,
            step_value: step.step_value,
            validation_regex: step.validation_regex,
            help_text: step.help_text,
            show_condition: step.show_condition,
            show_preview_image: step.show_preview_image,
            preview_image_base_path: step.preview_image_base_path
          }

          const { data: newStep, error: newStepError } = await supabase
            .from('configurator_steps')
            .insert(newStepData)
            .select()
            .single()

          if (newStepError) throw newStepError

          // Copy options for this step
          if (step.configurator_options && step.configurator_options.length > 0) {
            const newOptions = step.configurator_options.map((option: any) => ({
              step_id: newStep.id,
              option_value: option.option_value,
              label: option.label,
              description: option.description,
              image_url: option.image_url,
              display_order: option.display_order,
              is_active: option.is_active,
              price_modifier: option.price_modifier
            }))

            const { error: optionsError } = await supabase
              .from('configurator_options')
              .insert(newOptions)

            if (optionsError) throw optionsError
          }
        }
      }

      loadConfigurators()
    } catch (error) {
      console.error('Error duplicating:', error)
      alert(t('admin.configurators.duplicateError'))
    }
  }

  const categories = ['all', 'veranda', 'carport', 'tuinkamer', 'lamellen', 'other']

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>{t('admin.configurators.title')}</h1>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => navigate('/admin/configurators/new')}
        >
          + {t('admin.configurators.newConfigurator')}
        </button>
      </div>

      <div style={{ marginBottom: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ alignSelf: 'center', fontWeight: '600', color: 'var(--body-text)' }}>{t('admin.configurators.category')}:</span>
          {categories.map(cat => (
            <button
              key={cat}
              className={`admin-btn ${filterCategory === cat ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat === 'all' ? t('admin.configurators.all') : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ alignSelf: 'center', fontWeight: '600', color: 'var(--body-text)' }}>{t('admin.configurators.status')}:</span>
          {['all', 'active', 'inactive'].map(status => (
            <button
              key={status}
              className={`admin-btn ${filterStatus === status ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? t('admin.configurators.all') : status === 'active' ? t('admin.configurators.statusActive') : t('admin.configurators.statusInactive')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      ) : configurators.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <h3>{t('admin.configurators.noConfigurators')}</h3>
          <p>{t('admin.configurators.noConfiguratorsDesc')}</p>
        </div>
      ) : (
        <div className="configurators-grid">
          {configurators.map(config => (
            <div key={config.id} className="configurator-card">
              <div className="configurator-card-header">
                {config.image_url && (
                  <img src={config.image_url} alt={config.name.nl} className="configurator-thumbnail" />
                )}
                <div className="configurator-info">
                  <h3>{config.name.nl}</h3>
                  {config.description && <p className="configurator-desc">{config.description.nl}</p>}
                  <div className="configurator-meta">
                    <span className="meta-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      </svg>
                      {config.category || 'Uncategorized'}
                    </span>
                    <span className="meta-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      /{config.slug}
                    </span>
                  </div>
                </div>
                <div className="configurator-status">
                  <span className={`status-badge ${config.is_active ? 'confirmed' : 'pending'}`}>
                    {config.is_active ? t('admin.configurators.statusActive') : t('admin.configurators.statusInactive')}
                  </span>
                </div>
              </div>

              <div className="configurator-card-footer">
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => navigate(`/admin/configurators/${config.id}`)}
                  style={{ padding: '8px 16px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  {t('common.edit')}
                </button>

                <button
                  className="admin-btn"
                  onClick={() => handleToggleActive(config.id, config.is_active)}
                  style={{
                    padding: '8px 16px',
                    background: config.is_active ? '#f59e0b' : '#22c55e',
                    color: '#fff',
                    border: 'none'
                  }}
                >
                  {config.is_active ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      {t('admin.configurators.hide')}
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                      {t('admin.configurators.publish')}
                    </>
                  )}
                </button>

                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => handleDuplicate(config)}
                  style={{ padding: '8px 16px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  {t('admin.configurators.duplicate')}
                </button>

                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => handleDelete(config.id)}
                  style={{ padding: '8px 16px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .configurators-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
          gap: 1.5rem;
        }

        .configurator-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .configurator-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .configurator-card-header {
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: start;
          border-bottom: 1px solid var(--border-color);
        }

        .configurator-thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .configurator-info {
          flex: 1;
        }

        .configurator-info h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
          color: var(--heading-text);
        }

        .configurator-desc {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          color: var(--muted-text);
        }

        .configurator-meta {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .meta-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: var(--section-bg);
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--muted-text);
        }

        .meta-badge svg {
          width: 14px;
          height: 14px;
        }

        .configurator-status {
          margin-left: auto;
        }

        .configurator-card-footer {
          padding: 1rem 1.5rem;
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          background: var(--section-bg);
        }

        .admin-btn svg {
          margin-right: 0.25rem;
          vertical-align: middle;
        }

        @media (max-width: 768px) {
          .configurators-grid {
            grid-template-columns: 1fr;
          }

          .configurator-card-header {
            flex-direction: column;
          }

          .configurator-thumbnail {
            width: 100%;
            height: 150px;
          }

          .configurator-card-footer {
            flex-direction: column;
          }

          .admin-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
