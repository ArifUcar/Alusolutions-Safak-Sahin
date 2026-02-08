import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import type { MultiLanguageText, ConfiguratorStep, ConfiguratorOption } from '../../lib/supabase'
import StepFormModal from '../../components/StepFormModal'
import OptionFormModal from '../../components/OptionFormModal'
import DynamicConfigurator from '../../components/DynamicConfigurator'

type ActiveTab = 'general' | 'steps' | 'preview'

export default function ConfiguratorEditPage() {
  const { t } = useTranslation()
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
    icon: string
    is_active: boolean
    display_order: number
  }>({
    slug: '',
    name: { nl: '', en: '', tr: '', de: '' },
    description: { nl: '', en: '', tr: '', de: '' },
    category: 'veranda',
    image_url: '',
    icon: 'pi pi-cog',
    is_active: true,
    display_order: 0
  })

  const [showIconPicker, setShowIconPicker] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [iconInputMode, setIconInputMode] = useState<'select' | 'manual'>('select')

  // Handle image upload to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      alert(t('admin.configurators.invalidFileType', 'Ongeldig bestandstype. Gebruik JPG, PNG, WebP of GIF.'))
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('admin.configurators.fileTooLarge', 'Bestand is te groot. Maximum 5MB.'))
      return
    }

    setUploadingImage(true)

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `configurator-${formData.slug || Date.now()}-${Date.now()}.${fileExt}`
      const filePath = `configurators/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath)

      setFormData({ ...formData, image_url: publicUrl })
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(t('admin.configurators.uploadError', 'Fout bij uploaden van afbeelding.'))
    } finally {
      setUploadingImage(false)
    }
  }

  // Popular PrimeNG icons for configurators
  const availableIcons = [
    // Veranda & Overkapping (Most Relevant)
    'pi pi-home', 'pi pi-building', 'pi pi-warehouse', 'pi pi-shop',
    'pi pi-window-maximize', 'pi pi-window-minimize', 'pi pi-stop',
    'pi pi-th-large', 'pi pi-table', 'pi pi-objects-column',
    'pi pi-box', 'pi pi-inbox', 'pi pi-server', 'pi pi-database',
    'pi pi-align-justify', 'pi pi-bars', 'pi pi-list', 'pi pi-grip-vertical',
    'pi pi-grip-horizontal', 'pi pi-ellipsis-h', 'pi pi-minus',
    'pi pi-sun', 'pi pi-cloud', 'pi pi-bolt', 'pi pi-moon',
    'pi pi-eye', 'pi pi-shield', 'pi pi-lock', 'pi pi-verified',
    'pi pi-expand', 'pi pi-arrows-alt', 'pi pi-arrows-h', 'pi pi-arrows-v',
    'pi pi-chevron-up', 'pi pi-angle-up', 'pi pi-caret-up',
    'pi pi-sliders-h', 'pi pi-sliders-v', 'pi pi-cog', 'pi pi-cogs',
    'pi pi-wrench', 'pi pi-hammer', 'pi pi-palette',

    // Buildings & Structures
    'pi pi-building', 'pi pi-warehouse', 'pi pi-shop', 'pi pi-box',
    'pi pi-objects-column', 'pi pi-window-maximize', 'pi pi-window-minimize',
    'pi pi-stop', 'pi pi-th-large', 'pi pi-table', 'pi pi-grip-vertical',

    // Nature & Weather
    'pi pi-sun', 'pi pi-moon', 'pi pi-cloud', 'pi pi-bolt', 'pi pi-wave',

    // Tools & Construction
    'pi pi-cog', 'pi pi-cogs', 'pi pi-wrench', 'pi pi-hammer', 'pi pi-palette',
    'pi pi-pencil', 'pi pi-eraser', 'pi pi-sliders-h', 'pi pi-sliders-v',

    // Shapes & Objects
    'pi pi-circle', 'pi pi-circle-fill', 'pi pi-square', 'pi pi-stop-circle',
    'pi pi-box', 'pi pi-cube', 'pi pi-star', 'pi pi-star-fill', 'pi pi-heart',
    'pi pi-heart-fill', 'pi pi-flag', 'pi pi-flag-fill', 'pi pi-bookmark',
    'pi pi-bookmark-fill', 'pi pi-tag', 'pi pi-tags',

    // Arrows & Directions
    'pi pi-arrow-up', 'pi pi-arrow-down', 'pi pi-arrow-left', 'pi pi-arrow-right',
    'pi pi-arrow-up-right', 'pi pi-arrow-down-left', 'pi pi-arrows-h', 'pi pi-arrows-v',
    'pi pi-arrows-alt', 'pi pi-chevron-up', 'pi pi-chevron-down', 'pi pi-chevron-left',
    'pi pi-chevron-right', 'pi pi-angle-up', 'pi pi-angle-down', 'pi pi-angle-left',
    'pi pi-angle-right', 'pi pi-angle-double-up', 'pi pi-angle-double-down',
    'pi pi-angle-double-left', 'pi pi-angle-double-right', 'pi pi-caret-up',
    'pi pi-caret-down', 'pi pi-caret-left', 'pi pi-caret-right', 'pi pi-expand',
    'pi pi-compress', 'pi pi-external-link', 'pi pi-directions', 'pi pi-compass',

    // Actions
    'pi pi-check', 'pi pi-check-circle', 'pi pi-check-square', 'pi pi-times',
    'pi pi-times-circle', 'pi pi-plus', 'pi pi-plus-circle', 'pi pi-minus',
    'pi pi-minus-circle', 'pi pi-search', 'pi pi-search-plus', 'pi pi-search-minus',
    'pi pi-filter', 'pi pi-filter-fill', 'pi pi-filter-slash', 'pi pi-sort',
    'pi pi-sort-alpha-down', 'pi pi-sort-alpha-up', 'pi pi-sort-amount-down',
    'pi pi-sort-amount-up', 'pi pi-sync', 'pi pi-refresh', 'pi pi-replay',
    'pi pi-undo', 'pi pi-redo', 'pi pi-history', 'pi pi-trash', 'pi pi-copy',
    'pi pi-clone', 'pi pi-save', 'pi pi-print', 'pi pi-download', 'pi pi-upload',
    'pi pi-cloud-upload', 'pi pi-cloud-download',

    // Media & Images
    'pi pi-image', 'pi pi-images', 'pi pi-camera', 'pi pi-video', 'pi pi-play',
    'pi pi-pause', 'pi pi-stop', 'pi pi-forward', 'pi pi-backward', 'pi pi-eject',
    'pi pi-volume-up', 'pi pi-volume-down', 'pi pi-volume-off', 'pi pi-microphone',

    // Files & Documents
    'pi pi-file', 'pi pi-file-edit', 'pi pi-file-pdf', 'pi pi-file-word',
    'pi pi-file-excel', 'pi pi-file-import', 'pi pi-file-export', 'pi pi-folder',
    'pi pi-folder-open', 'pi pi-folder-plus', 'pi pi-paperclip', 'pi pi-inbox',
    'pi pi-envelope', 'pi pi-send', 'pi pi-receipt',

    // Users & People
    'pi pi-user', 'pi pi-users', 'pi pi-user-plus', 'pi pi-user-minus',
    'pi pi-user-edit', 'pi pi-id-card', 'pi pi-address-book',

    // Communication
    'pi pi-phone', 'pi pi-mobile', 'pi pi-tablet', 'pi pi-desktop', 'pi pi-comments',
    'pi pi-comment', 'pi pi-whatsapp', 'pi pi-discord', 'pi pi-slack',
    'pi pi-telegram', 'pi pi-facebook', 'pi pi-twitter', 'pi pi-instagram',
    'pi pi-youtube', 'pi pi-linkedin', 'pi pi-github', 'pi pi-google',
    'pi pi-microsoft', 'pi pi-apple', 'pi pi-amazon', 'pi pi-paypal',

    // E-commerce & Money
    'pi pi-shopping-cart', 'pi pi-shopping-bag', 'pi pi-wallet', 'pi pi-credit-card',
    'pi pi-money-bill', 'pi pi-euro', 'pi pi-dollar', 'pi pi-percentage',
    'pi pi-calculator', 'pi pi-chart-bar', 'pi pi-chart-line', 'pi pi-chart-pie',

    // Navigation & Location
    'pi pi-map', 'pi pi-map-marker', 'pi pi-globe', 'pi pi-car', 'pi pi-truck',
    'pi pi-sitemap', 'pi pi-directions', 'pi pi-compass',

    // Security
    'pi pi-shield', 'pi pi-lock', 'pi pi-lock-open', 'pi pi-unlock', 'pi pi-key',
    'pi pi-eye', 'pi pi-eye-slash', 'pi pi-verified', 'pi pi-ban',
    'pi pi-exclamation-circle', 'pi pi-exclamation-triangle', 'pi pi-info-circle',
    'pi pi-question-circle',

    // Time & Calendar
    'pi pi-calendar', 'pi pi-calendar-plus', 'pi pi-calendar-minus',
    'pi pi-calendar-times', 'pi pi-clock', 'pi pi-stopwatch', 'pi pi-hourglass',

    // Layout & UI
    'pi pi-bars', 'pi pi-list', 'pi pi-align-left', 'pi pi-align-center',
    'pi pi-align-right', 'pi pi-align-justify', 'pi pi-ellipsis-h', 'pi pi-ellipsis-v',
    'pi pi-grip-vertical', 'pi pi-grip-horizontal', 'pi pi-th-large', 'pi pi-table',
    'pi pi-list-check', 'pi pi-ticket',

    // Technology
    'pi pi-wifi', 'pi pi-bluetooth', 'pi pi-link', 'pi pi-share-alt', 'pi pi-server',
    'pi pi-database', 'pi pi-code', 'pi pi-terminal', 'pi pi-qrcode', 'pi pi-barcode',
    'pi pi-microchip', 'pi pi-power-off',

    // Other
    'pi pi-bell', 'pi pi-bell-slash', 'pi pi-thumbs-up', 'pi pi-thumbs-down',
    'pi pi-trophy', 'pi pi-megaphone', 'pi pi-bullseye', 'pi pi-gift', 'pi pi-crown',
    'pi pi-sparkles', 'pi pi-prime', 'pi pi-lightbulb', 'pi pi-graduation-cap',
    'pi pi-briefcase', 'pi pi-palette', 'pi pi-spinner', 'pi pi-at', 'pi pi-hashtag',
    'pi pi-percentage', 'pi pi-asterisk', 'pi pi-equals', 'pi pi-info',
    'pi pi-question', 'pi pi-exclamation'
  ]

  const [currentLanguage, setCurrentLanguage] = useState<keyof MultiLanguageText>('nl')
  const languages: { code: keyof MultiLanguageText; name: string }[] = [
    { code: 'nl', name: 'Nederlands' },
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'de', name: 'Deutsch' }
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
        description: data.description || { nl: '', en: '', tr: '', de: '' },
        category: data.category || 'veranda',
        image_url: data.image_url || '',
        icon: data.icon || 'pi pi-cog',
        is_active: data.is_active,
        display_order: data.display_order
      })
    } catch (error) {
      console.error('Error loading configurator:', error)
      alert(t('admin.configurators.loadError'))
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
        icon: formData.icon || null,
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

      alert(t('admin.configurators.saved'))
    } catch (error: any) {
      console.error('Error saving configurator:', error)
      if (error.code === '23505') {
        alert(t('admin.configurators.slugExists'))
      } else {
        alert(t('admin.configurators.saveError'))
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
    if (!confirm(t('admin.configurators.deleteStepConfirm'))) return

    try {
      const { error } = await supabase
        .from('configurator_steps')
        .delete()
        .eq('id', stepId)

      if (error) throw error
      loadSteps()
    } catch (error) {
      console.error('Error deleting step:', error)
      alert(t('admin.configurators.deleteError'))
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
      alert(t('admin.configurators.moveStepError'))
    }
  }

  // Delete option
  const handleDeleteOption = async (optionId: string) => {
    if (!confirm(t('admin.configurators.deleteOptionConfirm'))) return

    try {
      const { error } = await supabase
        .from('configurator_options')
        .delete()
        .eq('id', optionId)

      if (error) throw error
      loadSteps()
    } catch (error) {
      console.error('Error deleting option:', error)
      alert(t('admin.configurators.deleteError'))
    }
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
            onClick={() => navigate('/admin/configurators')}
            style={{ marginRight: '1rem' }}
          >
            ← {t('common.back')}
          </button>
          <h1 style={{ display: 'inline' }}>
            {isEditing ? t('admin.configurators.editConfigurator') : t('admin.configurators.newConfigurator')}
          </h1>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? t('admin.configurators.saving') : t('common.save')}
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
            {t('admin.configurators.tabGeneral')}
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
            {t('admin.configurators.tabSteps')} {!isEditing && `(${t('admin.configurators.saveFirst')})`}
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
            {t('admin.configurators.tabPreview')} {!isEditing && `(${t('admin.configurators.saveFirst')})`}
          </button>
        </div>

        <div className="tab-content">
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-section">
                <h3>{t('admin.configurators.generalInfo')}</h3>

                <div className="form-group">
                  <label>{t('admin.configurators.slugLabel')} *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="glazen-veranda"
                    required
                  />
                  <small>{t('admin.configurators.slugHelp')}</small>
                </div>

                <div className="form-group">
                  <label>{t('admin.configurators.categoryLabel')} *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="veranda">Veranda</option>
                    <option value="carport">Carport</option>
                    <option value="tuinkamer">Tuinkamer</option>
                    <option value="lamellen">Lamellen</option>
                    <option value="other">{t('admin.configurators.categoryOther')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{t('admin.configurators.displayOrder')}</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                  <small>{t('admin.configurators.displayOrderHelp')}</small>
                </div>

                <div className="form-group">
                  <label>{t('admin.configurators.imageLabel', 'Afbeelding')}</label>
                  <div className="image-upload-wrapper">
                    <div className="image-upload-input">
                      <label className="file-upload-btn">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          style={{ display: 'none' }}
                        />
                        <i className={uploadingImage ? 'pi pi-spin pi-spinner' : 'pi pi-upload'}></i>
                        <span>
                          {uploadingImage
                            ? t('admin.configurators.uploading', 'Uploaden...')
                            : t('admin.configurators.chooseFile', 'Kies afbeelding')}
                        </span>
                      </label>
                      {formData.image_url && (
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => setFormData({ ...formData, image_url: '' })}
                          title={t('common.delete', 'Verwijderen')}
                        >
                          <i className="pi pi-times"></i>
                        </button>
                      )}
                    </div>
                    {formData.image_url && (
                      <div className="image-preview">
                        <img src={formData.image_url} alt="Preview" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        <span className="image-url-text">{formData.image_url.split('/').pop()}</span>
                      </div>
                    )}
                  </div>
                  <small>{t('admin.configurators.imageHelp', 'Afbeelding die op de offerte pagina wordt getoond (max 5MB)')}</small>
                </div>

                <div className="form-group">
                  <label>{t('admin.configurators.iconLabel', 'Menu Icoon')}</label>

                  {/* Mode Toggle */}
                  <div className="icon-mode-toggle">
                    <button
                      type="button"
                      className={`mode-btn ${iconInputMode === 'select' ? 'active' : ''}`}
                      onClick={() => setIconInputMode('select')}
                    >
                      <i className="pi pi-th-large"></i>
                      {t('admin.configurators.selectIcon', 'Seç')}
                    </button>
                    <button
                      type="button"
                      className={`mode-btn ${iconInputMode === 'manual' ? 'active' : ''}`}
                      onClick={() => setIconInputMode('manual')}
                    >
                      <i className="pi pi-pencil"></i>
                      {t('admin.configurators.manualIcon', 'Manuel')}
                    </button>
                  </div>

                  {/* Select Mode */}
                  {iconInputMode === 'select' && (
                    <div className="icon-selector">
                      <div className="icon-preview-box" onClick={() => setShowIconPicker(!showIconPicker)}>
                        <i className={formData.icon}></i>
                        <span>{formData.icon}</span>
                        <i className="pi pi-chevron-down"></i>
                      </div>
                      {showIconPicker && (
                        <div className="icon-picker-dropdown">
                          <div className="icon-picker-grid">
                            {availableIcons.map(icon => (
                              <button
                                key={icon}
                                type="button"
                                className={`icon-picker-item ${formData.icon === icon ? 'selected' : ''}`}
                                onClick={() => {
                                  setFormData({ ...formData, icon })
                                  setShowIconPicker(false)
                                }}
                                title={icon}
                              >
                                <i className={icon}></i>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manual Mode */}
                  {iconInputMode === 'manual' && (
                    <div className="icon-manual-input">
                      <div className="icon-input-with-preview">
                        <i className={formData.icon || 'pi pi-question'}></i>
                        <input
                          type="text"
                          value={formData.icon}
                          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                          placeholder="pi pi-home"
                        />
                      </div>
                    </div>
                  )}

                  <small>{t('admin.configurators.iconHelp', 'Icoon dat in het header menu wordt getoond (örn: pi pi-home)')}</small>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <span>{t('admin.configurators.activePublished')}</span>
                  </label>
                  <small style={{ display: 'block', marginTop: '0.5rem', marginLeft: '1.75rem' }}>
                    {t('admin.configurators.activeHelp')}
                  </small>
                </div>
              </div>

              <div className="form-section">
                <h3>{t('admin.configurators.multiLanguageInfo')}</h3>

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
                    <label>{t('admin.configurators.nameLabel')} ({languages.find(l => l.code === currentLanguage)?.name}) *</label>
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
                    {currentLanguage === 'nl' && <small>{t('admin.configurators.requiredField')}</small>}
                  </div>

                  <div className="form-group">
                    <label>{t('admin.configurators.descriptionLabel')} ({languages.find(l => l.code === currentLanguage)?.name})</label>
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
                  {saving ? t('admin.configurators.saving') : isEditing ? t('admin.configurators.update') : t('admin.configurators.create')}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => navigate('/admin/configurators')}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          )}

          {/* STEPS TAB */}
          {activeTab === 'steps' && (
            <div className="steps-management">
              <div className="steps-header">
                <h3>{t('admin.configurators.stepsCount', { count: steps.length })}</h3>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => setIsCreatingStep(true)}
                >
                  + {t('admin.configurators.newStep')}
                </button>
              </div>

              {loadingSteps ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="spinner"></div>
                  <p>{t('common.loading')}</p>
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
                  <h3>{t('admin.configurators.noSteps')}</h3>
                  <p>{t('admin.configurators.noStepsDesc')}</p>
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
                                <span className="meta-badge required">{t('admin.configurators.required')}</span>
                              )}
                              {step.configurator_options && (
                                <span className="meta-badge">
                                  {step.configurator_options.length} {t('admin.configurators.optionsCount')}
                                </span>
                              )}
                              {step.show_condition && (
                                <span className="meta-badge conditional">⚠ {t('admin.configurators.conditional')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="step-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="icon-btn"
                            onClick={() => handleMoveStep(step.id, 'up')}
                            disabled={index === 0}
                            title={t('admin.configurators.moveUp')}
                          >
                            ↑
                          </button>
                          <button
                            className="icon-btn"
                            onClick={() => handleMoveStep(step.id, 'down')}
                            disabled={index === steps.length - 1}
                            title={t('admin.configurators.moveDown')}
                          >
                            ↓
                          </button>
                          <button
                            className="icon-btn edit"
                            onClick={() => {
                              setEditingStep(step)
                              setIsCreatingStep(true)
                            }}
                            title={t('common.edit')}
                          >
                            ✏
                          </button>
                          <button
                            className="icon-btn delete"
                            onClick={() => handleDeleteStep(step.id)}
                            title={t('common.delete')}
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
                              <strong>{t('admin.configurators.titleEN')}:</strong> {step.title.en || '-'}
                            </div>
                            <div>
                              <strong>{t('admin.configurators.titleTR')}:</strong> {step.title.tr || '-'}
                            </div>
                            {step.subtitle?.nl && (
                              <div>
                                <strong>{t('admin.configurators.subtitle')}:</strong> {step.subtitle.nl}
                              </div>
                            )}
                            {step.help_text?.nl && (
                              <div>
                                <strong>{t('admin.configurators.helpText')}:</strong> {step.help_text.nl}
                              </div>
                            )}
                            {step.show_preview_image && (
                              <div>
                                <strong>{t('admin.configurators.previewImage')}:</strong> {t('common.yes')} ({step.preview_image_base_path || '-'})
                              </div>
                            )}
                            {step.show_condition && (
                              <div>
                                <strong>{t('admin.configurators.condition')}:</strong> {JSON.stringify(step.show_condition)}
                              </div>
                            )}
                          </div>

                          <div className="options-management">
                            <div className="options-header">
                              <strong>{t('admin.configurators.optionsLabel')} ({step.configurator_options?.length || 0})</strong>
                              <button
                                className="admin-btn admin-btn-sm admin-btn-primary"
                                onClick={() => {
                                  setCurrentStepId(step.id)
                                  setEditingOption(null)
                                  setIsCreatingOption(true)
                                }}
                              >
                                + {t('admin.configurators.newOption')}
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
                                              <span className="meta-badge-small inactive">{t('admin.configurators.statusInactive')}</span>
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
                                          title={t('common.edit')}
                                        >
                                          ✏
                                        </button>
                                        <button
                                          className="icon-btn delete"
                                          onClick={() => handleDeleteOption(opt.id)}
                                          title={t('common.delete')}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <div className="empty-options">
                                <p>{t('admin.configurators.noOptions')}</p>
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
                  <strong>{t('admin.configurators.livePreview')}</strong>
                  <p>{t('admin.configurators.livePreviewDesc')}</p>
                </div>
              </div>
              <div className="preview-wrapper">
                {formData.slug && formData.slug.trim() ? (
                  <DynamicConfigurator configuratorSlug={formData.slug} />
                ) : (
                  <div className="preview-error">
                    <p>{t('admin.configurators.previewError')}</p>
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

        /* Image Upload Styles */
        .image-upload-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .image-upload-input {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .file-upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .file-upload-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        .file-upload-btn i {
          font-size: 1rem;
        }

        .remove-image-btn {
          width: 36px;
          height: 36px;
          border: 1px solid #ef4444;
          background: transparent;
          color: #ef4444;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .remove-image-btn:hover {
          background: #ef4444;
          color: white;
        }

        .image-preview {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 250px;
        }

        .image-preview img {
          width: 100%;
          height: auto;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .image-url-text {
          font-size: 0.75rem;
          color: var(--muted-text);
          word-break: break-all;
          font-family: monospace;
        }

        /* Icon Selector Styles */
        .icon-selector {
          position: relative;
        }

        .icon-preview-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--card-bg);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .icon-preview-box:hover {
          border-color: #8b5cf6;
        }

        .icon-preview-box i:first-child {
          font-size: 1.25rem;
          color: #8b5cf6;
        }

        .icon-preview-box span {
          flex: 1;
          font-family: monospace;
          font-size: 0.875rem;
          color: var(--body-text);
        }

        .icon-preview-box i:last-child {
          font-size: 0.75rem;
          color: var(--muted-text);
        }

        .icon-picker-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.5rem;
          padding: 1rem;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          z-index: 100;
          max-height: 300px;
          overflow-y: auto;
        }

        .icon-picker-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
          gap: 0.5rem;
        }

        .icon-picker-item {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--section-bg);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1.1rem;
          color: var(--body-text);
        }

        .icon-picker-item:hover {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
        }

        .icon-picker-item.selected {
          border-color: #8b5cf6;
          background: #8b5cf6;
          color: white;
        }

        /* Icon Mode Toggle */
        .icon-mode-toggle {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .mode-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-color);
          background: var(--section-bg);
          color: var(--body-text);
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .mode-btn:hover {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
        }

        .mode-btn.active {
          background: #8b5cf6;
          color: white;
          border-color: #8b5cf6;
        }

        .mode-btn i {
          font-size: 0.875rem;
        }

        /* Icon Manual Input */
        .icon-manual-input {
          margin-top: 0.5rem;
        }

        .icon-input-with-preview {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--card-bg);
        }

        .icon-input-with-preview > i:first-child {
          font-size: 1.5rem;
          color: #8b5cf6;
          width: 32px;
          text-align: center;
        }

        .icon-input-with-preview input {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--body-text);
          font-size: 0.9rem;
          font-family: monospace;
          outline: none;
        }

        .icon-input-with-preview input::placeholder {
          color: var(--muted-text);
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
