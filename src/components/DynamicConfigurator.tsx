import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTranslation } from 'react-i18next'
import type { Configurator, ConfiguratorStep, MultiLanguageText, StepCondition } from '../lib/supabase'
import StepRenderer from './StepRenderer'
import '../styles/DynamicConfigurator.css'

interface DynamicConfiguratorProps {
  configuratorSlug: string
}

export default function DynamicConfigurator({ configuratorSlug }: DynamicConfiguratorProps) {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const currentLang = i18n.language as keyof MultiLanguageText

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [configurator, setConfigurator] = useState<Configurator | null>(null)
  const [allSteps, setAllSteps] = useState<ConfiguratorStep[]>([])
  const [visibleSteps, setVisibleSteps] = useState<ConfiguratorStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Contact form data (last step)
  const [contactData, setContactData] = useState({
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    contact_city: '',
    notes: ''
  })

  useEffect(() => {
    // Only load if slug is provided
    if (configuratorSlug && configuratorSlug.trim()) {
      loadConfigurator()
    }
  }, [configuratorSlug])

  useEffect(() => {
    // Recalculate visible steps when formData changes (for conditional logic)
    if (allSteps.length > 0) {
      const filtered = filterVisibleSteps(allSteps, formData)
      setVisibleSteps(filtered)
    }
  }, [formData, allSteps])

  // Auto-select first option when step changes
  useEffect(() => {
    const currentStep = getCurrentStep()
    if (!currentStep) return

    // Only auto-select for radio-image, radio, and select types
    if (!['radio-image', 'radio', 'select'].includes(currentStep.input_type)) return

    // Check if this step already has a value
    if (formData[currentStep.field_name] !== undefined) return

    // Get the first active option
    const firstOption = currentStep.configurator_options?.[0]
    if (firstOption) {
      setFormData(prev => ({
        ...prev,
        [currentStep.field_name]: firstOption.option_value
      }))
    }
  }, [currentStepIndex, visibleSteps])

  const loadConfigurator = async () => {
    setLoading(true)
    try {
      // Load configurator
      const { data: configData, error: configError } = await supabase
        .from('configurators')
        .select('*')
        .eq('slug', configuratorSlug)
        .eq('is_active', true)
        .single()

      if (configError) throw configError
      if (!configData) {
        alert('Configurator niet gevonden')
        navigate('/')
        return
      }

      setConfigurator(configData)

      // Load steps with options
      const { data: stepsData, error: stepsError } = await supabase
        .from('configurator_steps')
        .select(`
          *,
          configurator_options (*)
        `)
        .eq('configurator_id', configData.id)
        .order('step_order', { ascending: true })

      if (stepsError) throw stepsError

      // Sort options by display_order
      const sortedSteps = (stepsData || []).map(step => ({
        ...step,
        configurator_options: (step.configurator_options || [])
          .filter((opt: any) => opt.is_active)
          .sort((a: any, b: any) => a.display_order - b.display_order)
      }))

      setAllSteps(sortedSteps)
      setVisibleSteps(filterVisibleSteps(sortedSteps, {}))
    } catch (error) {
      console.error('Error loading configurator:', error)
      alert('Fout bij het laden van de configurator')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const filterVisibleSteps = (steps: ConfiguratorStep[], data: Record<string, any>): ConfiguratorStep[] => {
    // First filter by conditions
    let filtered = steps.filter(step => {
      if (!step.show_condition) return true
      return evaluateCondition(step.show_condition, data)
    })

    // If there are non-required steps and no "more_customization" field in data yet
    const hasNonRequiredSteps = filtered.some(step => !step.is_required)
    const requiredSteps = filtered.filter(step => step.is_required)

    // If we have both required and non-required steps, inject a gateway question
    if (hasNonRequiredSteps && requiredSteps.length > 0) {
      // Check if user has answered the gateway question
      if (data._more_customization === false) {
        // User said "No" - only show required steps
        filtered = requiredSteps
      } else if (data._more_customization === undefined) {
        // User hasn't answered yet - show required steps only
        // The gateway question will be shown separately
        filtered = requiredSteps
      }
      // If data._more_customization === true, show all steps (already filtered)
    }

    return filtered
  }

  const evaluateCondition = (condition: StepCondition | StepCondition[], data: Record<string, any>): boolean => {
    // If array, evaluate all conditions (AND logic)
    if (Array.isArray(condition)) {
      return condition.every(c => evaluateSingleCondition(c, data))
    }
    return evaluateSingleCondition(condition, data)
  }

  const evaluateSingleCondition = (condition: StepCondition, data: Record<string, any>): boolean => {
    const fieldValue = data[condition.field]

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value
      case 'not_equals':
        return fieldValue !== condition.value
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value)
      case 'less_than':
        return Number(fieldValue) < Number(condition.value)
      case 'contains':
        return String(fieldValue || '').includes(String(condition.value))
      default:
        return false
    }
  }

  const getLocalizedText = (text: MultiLanguageText | undefined): string => {
    if (!text) return ''
    return text[currentLang] || text['nl'] || ''
  }

  const getCurrentStep = (): ConfiguratorStep | null => {
    return visibleSteps[currentStepIndex] || null
  }

  const validateCurrentStep = (): boolean => {
    const currentStep = getCurrentStep()
    if (!currentStep) return true

    const newErrors: Record<string, string> = {}
    const value = formData[currentStep.field_name]

    // Required validation
    if (currentStep.is_required && (value === undefined || value === '' || value === null)) {
      newErrors[currentStep.field_name] = 'Dit veld is verplicht'
    }

    // Number validation
    if (currentStep.input_type === 'number' && value !== undefined && value !== '') {
      const numValue = Number(value)
      if (currentStep.min_value !== undefined && numValue < currentStep.min_value) {
        newErrors[currentStep.field_name] = `Minimum waarde is ${currentStep.min_value}`
      }
      if (currentStep.max_value !== undefined && numValue > currentStep.max_value) {
        newErrors[currentStep.field_name] = `Maximum waarde is ${currentStep.max_value}`
      }
    }

    // Text regex validation
    if (currentStep.input_type === 'text' && currentStep.validation_regex && value) {
      const regex = new RegExp(currentStep.validation_regex)
      if (!regex.test(value)) {
        newErrors[currentStep.field_name] = 'Ongeldige invoer'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    // Check if we're on the gateway question
    const hasNonRequiredSteps = allSteps.some(step => !step.is_required)
    const requiredSteps = allSteps.filter(step => step.is_required)
    const isOnGatewayStep =
      hasNonRequiredSteps &&
      requiredSteps.length > 0 &&
      currentStepIndex === visibleSteps.length

    // If on gateway question step
    if (isOnGatewayStep) {
      if (formData._more_customization === undefined) {
        alert('Lütfen bir seçenek seçin')
        return
      }
      // Recalculate visible steps based on choice
      const filtered = filterVisibleSteps(allSteps, formData)
      setVisibleSteps(filtered)
      setCurrentStepIndex(currentStepIndex + 1)
      setErrors({})
      return
    }

    if (!validateCurrentStep()) return

    // Move to next step (could be another form step, gateway question, or contact form)
    setCurrentStepIndex(currentStepIndex + 1)
    setErrors({})
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      // If going back from gateway question or steps after it, reset the choice
      const hasNonRequiredSteps = allSteps.some(step => !step.is_required)
      const requiredSteps = allSteps.filter(step => step.is_required)
      const isLeavingGatewayArea =
        hasNonRequiredSteps &&
        requiredSteps.length > 0 &&
        currentStepIndex === visibleSteps.length

      if (isLeavingGatewayArea && formData._more_customization !== undefined) {
        // Reset gateway choice
        const { _more_customization, ...rest } = formData
        setFormData(rest)
        // Recalculate steps
        const filtered = filterVisibleSteps(allSteps, rest)
        setVisibleSteps(filtered)
      }

      setCurrentStepIndex(currentStepIndex - 1)
      setErrors({})
    }
  }

  const handleSubmit = async () => {
    // Validate contact form
    if (!contactData.contact_name || !contactData.contact_email || !contactData.contact_phone) {
      alert('Vul alstublieft alle verplichte velden in')
      return
    }

    setSubmitting(true)
    try {
      const submissionData = {
        configurator_id: configurator?.id,
        configuration_data: formData,
        contact_name: contactData.contact_name,
        contact_email: contactData.contact_email,
        contact_phone: contactData.contact_phone,
        contact_address: contactData.contact_address || null,
        contact_city: contactData.contact_city || null,
        notes: contactData.notes || null,
        status: 'new' as const,
        submitted_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('configurator_submissions')
        .insert(submissionData)

      if (error) throw error

      alert('Uw aanvraag is succesvol verzonden! We nemen zo snel mogelijk contact met u op.')
      navigate('/')
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Er is een fout opgetreden. Probeer het later opnieuw.')
    } finally {
      setSubmitting(false)
    }
  }

  const getCurrentPreviewImage = (): string => {
    const currentStep = getCurrentStep()
    if (!currentStep) return configurator?.image_url || ''

    // If show_preview_image is enabled, find the selected option's image
    if (currentStep.show_preview_image) {
      const selectedValue = formData[currentStep.field_name]
      if (selectedValue && currentStep.configurator_options) {
        const selectedOption = currentStep.configurator_options.find(
          (opt: any) => opt.option_value === selectedValue
        )
        if (selectedOption?.image_url) {
          return selectedOption.image_url
        }
      }
    }

    return configurator?.image_url || ''
  }

  if (loading) {
    return (
      <div className="configurator-loading">
        <div className="spinner"></div>
        <p>Laden...</p>
      </div>
    )
  }

  if (!configurator) {
    return (
      <div className="configurator-error">
        <h2>Configurator niet gevonden</h2>
      </div>
    )
  }

  const currentStep = getCurrentStep()

  // Check if we need to show the gateway question
  const hasNonRequiredSteps = allSteps.some(step => !step.is_required)
  const requiredSteps = allSteps.filter(step => step.is_required)
  const showGatewayQuestion =
    hasNonRequiredSteps &&
    requiredSteps.length > 0 &&
    currentStepIndex === visibleSteps.length &&
    formData._more_customization === undefined

  const isLastStep = currentStepIndex === visibleSteps.length && !showGatewayQuestion
  const totalSteps = visibleSteps.length + (showGatewayQuestion ? 1 : 0) + 1 // +1 for contact form
  const progress = ((currentStepIndex + 1) / totalSteps) * 100

  return (
    <div className="dynamic-configurator">
      <div className="configurator-container">
        {/* Left: Preview Image */}
        <div className="configurator-preview">
          <div className="preview-image-container">
            {getCurrentPreviewImage() ? (
              <img
                src={getCurrentPreviewImage()}
                alt={getLocalizedText(configurator.name)}
                className="preview-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23f3f4f6" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-size="18"%3EGörsel Yüklenemedi%3C/text%3E%3C/svg%3E'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                aspectRatio: '16/9',
                background: 'var(--section-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                color: 'var(--muted-text)'
              }}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <p>Görsel Önizlemesi</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Form */}
        <div className="configurator-form">
          {/* Progress Bar */}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="step-counter">
            Stap {currentStepIndex + 1} van {totalSteps}
          </div>

          {showGatewayQuestion ? (
            // Gateway Question: "More Customization?"
            <div className="step-content">
              <h2 className="step-title">Daha fazla özelleştirmek ister misiniz?</h2>
              <p className="step-subtitle">İstediğiniz takdirde ek özelleştirme seçeneklerini görebilirsiniz.</p>

              <div className="gateway-options">
                <button
                  className={`gateway-option ${formData._more_customization === true ? 'selected' : ''}`}
                  onClick={() => {
                    setFormData({ ...formData, _more_customization: true })
                    setErrors({})
                  }}
                >
                  <div className="gateway-icon">✓</div>
                  <div className="gateway-text">
                    <strong>Evet</strong>
                    <small>Daha fazla seçenek görmek istiyorum</small>
                  </div>
                </button>

                <button
                  className={`gateway-option ${formData._more_customization === false ? 'selected' : ''}`}
                  onClick={() => {
                    setFormData({ ...formData, _more_customization: false })
                    setErrors({})
                  }}
                >
                  <div className="gateway-icon">→</div>
                  <div className="gateway-text">
                    <strong>Hayır</strong>
                    <small>Devam etmek istiyorum</small>
                  </div>
                </button>
              </div>
            </div>
          ) : !isLastStep && currentStep ? (
            // Configuration Steps
            <div className="step-content">
              <h2 className="step-title">{getLocalizedText(currentStep.title)}</h2>
              {currentStep.subtitle && (
                <p className="step-subtitle">{getLocalizedText(currentStep.subtitle)}</p>
              )}

              <StepRenderer
                step={currentStep}
                value={formData[currentStep.field_name]}
                onChange={(value) => {
                  setFormData({ ...formData, [currentStep.field_name]: value })
                  setErrors({})
                }}
                error={errors[currentStep.field_name]}
                currentLang={currentLang}
              />

              {currentStep.help_text && getLocalizedText(currentStep.help_text) && (
                <p className="step-help-text">{getLocalizedText(currentStep.help_text)}</p>
              )}
            </div>
          ) : (
            // Contact Form (Last Step)
            <div className="step-content contact-step">
              <h2 className="step-title">Uw gegevens</h2>
              <p className="step-subtitle">Vul uw contactgegevens in om uw offerte te ontvangen</p>

              <div className="contact-form">
                <div className="form-group">
                  <label>Naam *</label>
                  <input
                    type="text"
                    value={contactData.contact_name}
                    onChange={(e) => setContactData({ ...contactData, contact_name: e.target.value })}
                    placeholder="Jan de Vries"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>E-mail *</label>
                  <input
                    type="email"
                    value={contactData.contact_email}
                    onChange={(e) => setContactData({ ...contactData, contact_email: e.target.value })}
                    placeholder="jan@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Telefoon *</label>
                  <input
                    type="tel"
                    value={contactData.contact_phone}
                    onChange={(e) => setContactData({ ...contactData, contact_phone: e.target.value })}
                    placeholder="+31 6 12345678"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Adres</label>
                  <input
                    type="text"
                    value={contactData.contact_address}
                    onChange={(e) => setContactData({ ...contactData, contact_address: e.target.value })}
                    placeholder="Straat 123"
                  />
                </div>

                <div className="form-group">
                  <label>Woonplaats</label>
                  <input
                    type="text"
                    value={contactData.contact_city}
                    onChange={(e) => setContactData({ ...contactData, contact_city: e.target.value })}
                    placeholder="Amsterdam"
                  />
                </div>

                <div className="form-group">
                  <label>Opmerkingen</label>
                  <textarea
                    value={contactData.notes}
                    onChange={(e) => setContactData({ ...contactData, notes: e.target.value })}
                    placeholder="Extra opmerkingen of vragen..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="step-navigation">
            <button
              className="btn btn-secondary"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
            >
              ← Vorige
            </button>

            {!isLastStep ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Volgende →
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Verzenden...' : 'Offerte aanvragen'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
