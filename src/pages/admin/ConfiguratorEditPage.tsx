import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Configurator, MultiLanguageText, ConfiguratorStep, ConfiguratorOption, StepInputType } from '../../lib/supabase'
import StepFormModal from '../../components/StepFormModal'
import OptionFormModal from '../../components/OptionFormModal'
import DynamicConfigurator from '../../components/DynamicConfigurator'

type ActiveTab = 'general' | 'steps' | 'preview'

export default function ConfiguratorEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = id !== 'new' && id !== undefined

  const [activeTab, setActiveTab] = useState<ActiveTab>('general')
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)

  // Steps state
  const [steps, setSteps] = useState<ConfiguratorStep[]>([])
  const [loadingSteps, setLoadingSteps] = useState(false)
  const [editingStep, setEditingStep] = useState<ConfiguratorStep | null>(null)
  const [isCreatingStep, setIsCreatingStep] = useState(false)
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null)

  // Options state
  const [editingOption, setEditingOption] = useState<ConfiguratorOption | null>(null)
  const [isCreatingOption, setIsCreatingOption] = useState(false)
  const [currentStepId, setCurrentStepId] = useState<string | null>(null)

  const [formData, setFormData] = useState<{
    slug: string
    name: MultiLanguageText
    description: MultiLanguageText
    category: string
    image_url: string
    is_active: boolean
    display_order: number
  }>({
    slug: '',
    name: { nl: '', en: '', tr: '', de: '', fr: '', it: '' },
    description: { nl: '', en: '', tr: '', de: '', fr: '', it: '' },
    category: 'veranda',
    image_url: '',
    is_active: true,
    display_order: 0
  })

  const [currentLanguage, setCurrentLanguage] = useState<keyof MultiLanguageText>('nl')
  const languages: { code: keyof MultiLanguageText; name: string }[] = [
    { code: 'nl', name: 'Nederlands' },
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'it', name: 'Italiano' }
  ]

  useEffect(() => {
    if (isEditing && id) {
      loadConfigurator()
      loadSteps()
    }
  }, [id])

  const loadConfigurator = async () => {
    if (!id) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('configurators')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setFormData({
        slug: data.slug,
        name: data.name,
        description: data.description || { nl: '', en: '', tr: '', de: '', fr: '', it: '' },
        category: data.category || 'veranda',
        image_url: data.image_url || '',
        is_active: data.is_active,
        display_order: data.display_order
      })
    } catch (error) {
      console.error('Error loading configurator:', error)
      alert('Konfigüratör yüklenemedi!')
      navigate('/admin/configurators')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const configData = {
        slug: formData.slug,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        image_url: formData.image_url || null,
        is_active: formData.is_active,
        display_order: formData.display_order
      }

      if (isEditing) {
        const { error } = await supabase
          .from('configurators')
          .update(configData)
          .eq('id', id)

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('configurators')
          .insert(configData)
          .select()
          .single()

        if (error) throw error

        // Navigate to edit mode with the new ID
        navigate(`/admin/configurators/${data.id}`, { replace: true })
      }

      alert('Kaydedildi!')
    } catch (error: any) {
      console.error('Error saving configurator:', error)
      if (error.code === '23505') {
        alert('Bu slug zaten kullanılıyor!')
      } else {
        alert('Kaydetme hatası!')
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

  // Load steps
  const loadSteps = async () => {
    if (!id || id === 'new') return

    setLoadingSteps(true)
    try {
      const { data, error } = await supabase
        .from('configurator_steps')
        .select(`
          *,
          configurator_options (*)
        `)
        .eq('configurator_id', id)
        .order('step_order', { ascending: true })

      if (error) throw error
      setSteps(data || [])
    } catch (error) {
      console.error('Error loading steps:', error)
    } finally {
      setLoadingSteps(false)
    }
  }

  // Delete step
  const handleDeleteStep = async (stepId: string) => {
    if (!confirm('Bu adımı silmek istediğinizden emin misiniz? Tüm seçenekler de silinecektir.')) return

    try {
      const { error } = await supabase
        .from('configurator_steps')
        .delete()
        .eq('id', stepId)

      if (error) throw error
      loadSteps()
    } catch (error) {
      console.error('Error deleting step:', error)
      alert('Silme hatası!')
    }
  }

  // Move step up/down
  const handleMoveStep = async (stepId: string, direction: 'up' | 'down') => {
    const stepIndex = steps.findIndex(s => s.id === stepId)
    if (stepIndex === -1) return

    const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1
    if (targetIndex < 0 || targetIndex >= steps.length) return

    const currentStep = steps[stepIndex]
    const targetStep = steps[targetIndex]

    try {
      // Use a temporary negative value to avoid unique constraint violation
      const tempOrder = -999999

      // Step 1: Set current to temporary value
      await supabase
        .from('configurator_steps')
        .update({ step_order: tempOrder })
        .eq('id', currentStep.id)

      // Step 2: Move target to current's position
      await supabase
        .from('configurator_steps')
        .update({ step_order: currentStep.step_order })
        .eq('id', targetStep.id)

      // Step 3: Move current to target's position
      await supabase
        .from('configurator_steps')
        .update({ step_order: targetStep.step_order })
        .eq('id', currentStep.id)

      loadSteps()
    } catch (error) {
      console.error('Error moving step:', error)
      alert('Adım sırası değiştirilemedi!')
    }
  }

  // Delete option
  const handleDeleteOption = async (optionId: string) => {
    if (!confirm('Bu seçeneği silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('configurator_options')
        .delete()
        .eq('id', optionId)

      if (error) throw error
      loadSteps()
    } catch (error) {
      console.error('Error deleting option:', error)
      alert('Silme hatası!')
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
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
            onClick={() => navigate('/admin/configurators')}
            style={{ marginRight: '1rem' }}
          >
            ← Geri
          </button>
          <h1 style={{ display: 'inline' }}>
            {isEditing ? 'Konfigüratör Düzenle' : 'Yeni Konfigüratör'}
          </h1>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      <div className="tabs-container">
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Genel
          </button>
          <button
            className={`tab-btn ${activeTab === 'steps' ? 'active' : ''}`}
            onClick={() => setActiveTab('steps')}
            disabled={!isEditing}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            Adımlar {!isEditing && '(Önce kaydedin)'}
          </button>
          <button
            className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
            disabled={!isEditing}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Önizleme {!isEditing && '(Önce kaydedin)'}
          </button>
        </div>

        <div className="tab-content">
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-section">
                <h3>Temel Bilgiler</h3>

                <div className="form-group">
                  <label>Slug (URL) *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="glazen-veranda"
                    required
                  />
                  <small>URL-friendly identifier. Örnek: glazen-veranda</small>
                </div>

                <div className="form-group">
                  <label>Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="veranda">Veranda</option>
                    <option value="carport">Carport</option>
                    <option value="tuinkamer">Tuinkamer</option>
                    <option value="lamellen">Lamellen</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Sıra</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                  <small>Liste gösteriminde sıralama için</small>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <span>Aktif (Yayında)</span>
                  </label>
                  <small style={{ display: 'block', marginTop: '0.5rem', marginLeft: '1.75rem' }}>
                    Bu seçeneği işaretlerseniz konfigüratör web sitesinde görünür olur
                  </small>
                </div>
              </div>

              <div className="form-section">
                <h3>Çoklu Dil Bilgileri</h3>

                <div className="language-tabs">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`lang-tab ${currentLanguage === lang.code ? 'active' : ''}`}
                      onClick={() => setCurrentLanguage(lang.code)}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>

                <div className="language-content">
                  <div className="form-group">
                    <label>İsim ({languages.find(l => l.code === currentLanguage)?.name}) *</label>
                    <input
                      type="text"
                      value={formData.name[currentLanguage] || ''}
                      onChange={(e) => {
                        const newName = { ...formData.name, [currentLanguage]: e.target.value }
                        const updates: any = { name: newName }

                        // Auto-generate slug from Dutch name if creating
                        if (!isEditing && currentLanguage === 'nl' && !formData.slug) {
                          updates.slug = generateSlug(e.target.value)
                        }

                        setFormData({ ...formData, ...updates })
                      }}
                      placeholder="Glazen Veranda"
                      required={currentLanguage === 'nl'}
                    />
                    {currentLanguage === 'nl' && <small>Bu alan zorunludur (default language)</small>}
                  </div>

                  <div className="form-group">
                    <label>Açıklama ({languages.find(l => l.code === currentLanguage)?.name})</label>
                    <textarea
                      value={formData.description[currentLanguage] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        description: { ...formData.description, [currentLanguage]: e.target.value }
                      })}
                      placeholder="Configureer uw glazen veranda..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? 'Kaydediliyor...' : isEditing ? 'Güncelle' : 'Oluştur'}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => navigate('/admin/configurators')}
                >
                  İptal
                </button>
              </div>
            </form>
          )}

          {/* STEPS TAB */}
          {activeTab === 'steps' && (
            <div className="steps-management">
              <div className="steps-header">
                <h3>Adımlar ({steps.length})</h3>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => setIsCreatingStep(true)}
                >
                  + Yeni Adım
                </button>
              </div>

              {loadingSteps ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="spinner"></div>
                  <p>Yükleniyor...</p>
                </div>
              ) : steps.length === 0 ? (
                <div className="placeholder-content">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                  <h3>Henüz adım yok</h3>
                  <p>Yeni adım eklemek için butona tıklayın</p>
                </div>
              ) : (
                <div className="steps-list">
                  {steps.map((step, index) => (
                    <div key={step.id} className="step-card">
                      <div className="step-card-header" onClick={() => setExpandedStepId(expandedStepId === step.id ? null : step.id)}>
                        <div className="step-info">
                          <div className="step-number">{step.step_order}</div>
                          <div className="step-details">
                            <h4>{step.title.nl}</h4>
                            <div className="step-meta">
                              <span className="meta-badge">
                                {step.input_type}
                              </span>
                              <span className="meta-badge">
                                {step.field_name}
                              </span>
                              {step.is_required && (
                                <span className="meta-badge required">Zorunlu</span>
                              )}
                              {step.configurator_options && (
                                <span className="meta-badge">
                                  {step.configurator_options.length} seçenek
                                </span>
                              )}
                              {step.show_condition && (
                                <span className="meta-badge conditional">⚠ Koşullu</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="step-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="icon-btn"
                            onClick={() => handleMoveStep(step.id, 'up')}
                            disabled={index === 0}
                            title="Yukarı taşı"
                          >
                            ↑
                          </button>
                          <button
                            className="icon-btn"
                            onClick={() => handleMoveStep(step.id, 'down')}
                            disabled={index === steps.length - 1}
                            title="Aşağı taşı"
                          >
                            ↓
                          </button>
                          <button
                            className="icon-btn edit"
                            onClick={() => {
                              setEditingStep(step)
                              setIsCreatingStep(true)
                            }}
                            title="Düzenle"
                          >
                            ✏
                          </button>
                          <button
                            className="icon-btn delete"
                            onClick={() => handleDeleteStep(step.id)}
                            title="Sil"
                          >
                            ×
                          </button>
                          <button className="icon-btn expand">
                            {expandedStepId === step.id ? '▼' : '▶'}
                          </button>
                        </div>
                      </div>

                      {expandedStepId === step.id && (
                        <div className="step-card-body">
                          <div className="step-details-grid">
                            <div>
                              <strong>Başlık (EN):</strong> {step.title.en || '-'}
                            </div>
                            <div>
                              <strong>Başlık (TR):</strong> {step.title.tr || '-'}
                            </div>
                            {step.subtitle?.nl && (
                              <div>
                                <strong>Alt Başlık:</strong> {step.subtitle.nl}
                              </div>
                            )}
                            {step.help_text?.nl && (
                              <div>
                                <strong>Yardım Metni:</strong> {step.help_text.nl}
                              </div>
                            )}
                            {step.show_preview_image && (
                              <div>
                                <strong>Önizleme Görseli:</strong> Evet ({step.preview_image_base_path || '-'})
                              </div>
                            )}
                            {step.show_condition && (
                              <div>
                                <strong>Koşul:</strong> {JSON.stringify(step.show_condition)}
                              </div>
                            )}
                          </div>

                          <div className="options-management">
                            <div className="options-header">
                              <strong>Seçenekler ({step.configurator_options?.length || 0})</strong>
                              <button
                                className="admin-btn admin-btn-sm admin-btn-primary"
                                onClick={() => {
                                  setCurrentStepId(step.id)
                                  setEditingOption(null)
                                  setIsCreatingOption(true)
                                }}
                              >
                                + Yeni Seçenek
                              </button>
                            </div>

                            {step.configurator_options && step.configurator_options.length > 0 ? (
                              <div className="options-list">
                                {step.configurator_options
                                  .sort((a, b) => a.display_order - b.display_order)
                                  .map(opt => (
                                    <div key={opt.id} className="option-item-detailed">
                                      <div className="option-main">
                                        {opt.image_url && (
                                          <img
                                            src={opt.image_url}
                                            alt={opt.label.nl}
                                            className="option-thumbnail"
                                          />
                                        )}
                                        <div className="option-info">
                                          <div className="option-title">
                                            <span className="option-value">{opt.option_value}</span>
                                            <span className="option-label">{opt.label.nl}</span>
                                          </div>
                                          {opt.description?.nl && (
                                            <div className="option-desc">{opt.description.nl}</div>
                                          )}
                                          <div className="option-meta">
                                            <span className="meta-badge-small">#{opt.display_order}</span>
                                            {!opt.is_active && (
                                              <span className="meta-badge-small inactive">Pasif</span>
                                            )}
                                            {opt.price_modifier !== 0 && (
                                              <span className="meta-badge-small price">
                                                {opt.price_modifier > 0 ? '+' : ''}{opt.price_modifier}€
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="option-actions">
                                        <button
                                          className="icon-btn edit"
                                          onClick={() => {
                                            setCurrentStepId(step.id)
                                            setEditingOption(opt)
                                            setIsCreatingOption(true)
                                          }}
                                          title="Düzenle"
                                        >
                                          ✏
                                        </button>
                                        <button
                                          className="icon-btn delete"
                                          onClick={() => handleDeleteOption(opt.id)}
                                          title="Sil"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <div className="empty-options">
                                <p>Henüz seçenek yok. Yukarıdaki butona tıklayarak ekleyin.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add/Edit Step Modal */}
              {isCreatingStep && id && id !== 'new' && (
                <StepFormModal
                  configuratorId={id}
                  step={editingStep}
                  onClose={() => {
                    setIsCreatingStep(false)
                    setEditingStep(null)
                  }}
                  onSave={() => {
                    loadSteps()
                  }}
                />
              )}

              {/* Add/Edit Option Modal */}
              {isCreatingOption && currentStepId && (
                <OptionFormModal
                  stepId={currentStepId}
                  option={editingOption}
                  onClose={() => {
                    setIsCreatingOption(false)
                    setEditingOption(null)
                    setCurrentStepId(null)
                  }}
                  onSave={() => {
                    loadSteps()
                  }}
                />
              )}
            </div>
          )}

          {/* PREVIEW TAB */}
          {activeTab === 'preview' && (
            <div className="preview-container">
              <div className="preview-notice">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <div>
                  <strong>Canlı Önizleme</strong>
                  <p>Bu, konfigüratörünüzün kullanıcılar tarafından nasıl görüneceğinin canlı önizlemesidir. Değişikliklerinizi kaydettiğinizde otomatik olarak güncellenecektir.</p>
                </div>
              </div>
              <div className="preview-wrapper">
                {formData.slug && formData.slug.trim() ? (
                  <DynamicConfigurator configuratorSlug={formData.slug} />
                ) : (
                  <div className="preview-error">
                    <p>Önizleme için lütfen önce konfigüratörü kaydedin ve bir slug girin.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .steps-management {
          padding: 0;
        }

        .steps-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .steps-header h3 {
          margin: 0;
          color: var(--heading-text);
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .step-card {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--section-bg);
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .step-card:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .step-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          cursor: pointer;
          user-select: none;
        }

        .step-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #8b5cf6;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }

        .step-details {
          flex: 1;
        }

        .step-details h4 {
          margin: 0 0 0.5rem 0;
          color: var(--heading-text);
          font-size: 1rem;
        }

        .step-meta {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .meta-badge.required {
          background: #ef4444;
          color: white;
        }

        .meta-badge.conditional {
          background: #f59e0b;
          color: white;
        }

        .step-actions {
          display: flex;
          gap: 0.5rem;
        }

        .icon-btn {
          width: 32px;
          height: 32px;
          border: 1px solid var(--border-color);
          background: var(--card-bg);
          color: var(--body-text);
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          font-size: 1rem;
        }

        .icon-btn:hover:not(:disabled) {
          background: var(--section-bg);
          border-color: #8b5cf6;
        }

        .icon-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .icon-btn.edit:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .icon-btn.delete:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        .icon-btn.expand {
          font-size: 0.75rem;
        }

        .step-card-body {
          padding: 1rem;
          border-top: 1px solid var(--border-color);
          background: var(--card-bg);
        }

        .step-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .step-details-grid > div {
          font-size: 0.9rem;
          color: var(--body-text);
        }

        .step-details-grid strong {
          color: var(--muted-text);
          font-size: 0.8rem;
          display: block;
          margin-bottom: 0.25rem;
        }

        .options-preview {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .options-preview > strong {
          display: block;
          margin-bottom: 0.75rem;
          color: var(--heading-text);
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .option-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          background: var(--section-bg);
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .option-value {
          font-family: monospace;
          color: #8b5cf6;
          font-weight: 600;
        }

        .option-label {
          flex: 1;
          color: var(--body-text);
        }

        .option-image {
          font-size: 1.2rem;
        }

        .options-management {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .options-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .options-header > strong {
          color: var(--heading-text);
        }

        .admin-btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .option-item-detailed {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          margin-bottom: 0.75rem;
          transition: all 0.2s ease;
        }

        .option-item-detailed:hover {
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .option-main {
          display: flex;
          gap: 1rem;
          flex: 1;
          align-items: start;
        }

        .option-thumbnail {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        .option-info {
          flex: 1;
        }

        .option-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .option-desc {
          font-size: 0.875rem;
          color: var(--muted-text);
          margin-bottom: 0.5rem;
        }

        .option-meta {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .meta-badge-small {
          display: inline-block;
          padding: 0.125rem 0.5rem;
          background: var(--section-bg);
          border-radius: 3px;
          font-size: 0.75rem;
          color: var(--muted-text);
        }

        .meta-badge-small.inactive {
          background: #ef4444;
          color: white;
        }

        .meta-badge-small.price {
          background: #10b981;
          color: white;
        }

        .option-actions {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .empty-options {
          text-align: center;
          padding: 2rem;
          color: var(--muted-text);
          background: var(--section-bg);
          border-radius: 6px;
          font-size: 0.875rem;
        }

        .empty-options p {
          margin: 0;
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
          padding: 1rem;
        }

        .modal-content {
          background: var(--card-bg);
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-header h2 {
          margin: 0;
          color: var(--heading-text);
        }

        .modal-close {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: var(--muted-text);
          font-size: 1.5rem;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: var(--section-bg);
          color: var(--body-text);
        }

        .modal-body {
          padding: 1.5rem;
        }

        .tabs-container {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
        }

        .tabs-nav {
          display: flex;
          gap: 0;
          border-bottom: 1px solid var(--border-color);
          background: var(--section-bg);
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          border: none;
          background: transparent;
          color: var(--muted-text);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 3px solid transparent;
        }

        .tab-btn:hover:not(:disabled) {
          background: var(--card-bg);
          color: var(--heading-text);
        }

        .tab-btn.active {
          color: #8b5cf6;
          border-bottom-color: #8b5cf6;
          background: var(--card-bg);
        }

        .tab-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tab-btn svg {
          width: 18px;
          height: 18px;
        }

        .tab-content {
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section h3 {
          margin: 0 0 1.5rem 0;
          color: var(--heading-text);
          font-size: 1.125rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: 500;
        }

        .checkbox-label input[type="checkbox"] {
          width: auto;
          margin: 0;
          cursor: pointer;
        }

        .checkbox-label span {
          user-select: none;
        }

        .language-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .lang-tab {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-color);
          background: var(--section-bg);
          color: var(--body-text);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .lang-tab:hover {
          background: var(--card-bg);
          border-color: #8b5cf6;
        }

        .lang-tab.active {
          background: #8b5cf6;
          color: #fff;
          border-color: #8b5cf6;
        }

        .language-content {
          padding: 1.5rem;
          background: var(--section-bg);
          border-radius: 8px;
        }

        .placeholder-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          color: var(--muted-text);
        }

        .placeholder-content svg {
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .placeholder-content h3 {
          margin: 0 0 0.5rem 0;
          color: var(--heading-text);
        }

        .placeholder-content p {
          margin: 0;
          font-size: 0.875rem;
        }

        .preview-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .preview-notice {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.1));
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-left: 4px solid #8b5cf6;
          border-radius: 8px;
        }

        .preview-notice svg {
          flex-shrink: 0;
          color: #8b5cf6;
          margin-top: 0.25rem;
        }

        .preview-notice strong {
          display: block;
          margin-bottom: 0.25rem;
          color: var(--heading-text);
          font-size: 0.95rem;
        }

        .preview-notice p {
          margin: 0;
          color: var(--body-text);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .preview-wrapper {
          border: 2px dashed var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          background: var(--section-bg);
        }

        .preview-error {
          padding: 3rem 2rem;
          text-align: center;
          color: var(--muted-text);
        }

        .preview-error p {
          margin: 0;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .tabs-nav {
            flex-direction: column;
          }

          .tab-btn {
            border-bottom: none;
            border-left: 3px solid transparent;
          }

          .tab-btn.active {
            border-left-color: #8b5cf6;
            border-bottom-color: transparent;
          }

          .language-tabs {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  )
}
