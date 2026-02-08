import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTranslation } from 'react-i18next'
import type { Configurator, ConfiguratorStep, MultiLanguageText, StepCondition, AppointmentSettings } from '../lib/supabase'
import StepRenderer from './StepRenderer'
import TimeSlotPicker from './TimeSlotPicker'
import '../styles/DynamicConfigurator.css'

interface DynamicConfiguratorProps {
  configuratorSlug: string
}

export default function DynamicConfigurator({ configuratorSlug }: DynamicConfiguratorProps) {
  const { t, i18n } = useTranslation()
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

  // Appointment booking data
  const [appointmentSettings, setAppointmentSettings] = useState<AppointmentSettings[]>([])
  const [wantsAppointment, setWantsAppointment] = useState<boolean | null>(null)
  const [appointmentData, setAppointmentData] = useState({
    service_type: '',
    date: '',
    time: ''
  })

  useEffect(() => {
    // Only load if slug is provided
    if (configuratorSlug && configuratorSlug.trim()) {
      loadConfigurator()
      loadAppointmentSettings()
    }
  }, [configuratorSlug])

  const loadAppointmentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_settings')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (!error && data) {
        setAppointmentSettings(data)
        // Pre-select first type if available
        if (data.length > 0) {
          setAppointmentData(prev => ({ ...prev, service_type: data[0].service_type }))
        }
      }
    } catch (err) {
      console.error('Error loading appointment settings:', err)
    }
  }

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
        alert(t('configuratorForm.notFound'))
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
      alert(t('configuratorForm.loadError'))
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
      newErrors[currentStep.field_name] = t('configuratorForm.required')
    }

    // Number validation
    if (currentStep.input_type === 'number' && value !== undefined && value !== '') {
      const numValue = Number(value)
      if (currentStep.min_value !== undefined && numValue < currentStep.min_value) {
        newErrors[currentStep.field_name] = t('configuratorForm.minValue', { value: currentStep.min_value })
      }
      if (currentStep.max_value !== undefined && numValue > currentStep.max_value) {
        newErrors[currentStep.field_name] = t('configuratorForm.maxValue', { value: currentStep.max_value })
      }
    }

    // Text regex validation
    if (currentStep.input_type === 'text' && currentStep.validation_regex && value) {
      const regex = new RegExp(currentStep.validation_regex)
      if (!regex.test(value)) {
        newErrors[currentStep.field_name] = t('configuratorForm.invalidInput')
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
        alert(t('configuratorForm.selectOption'))
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
      alert(t('configuratorForm.fillRequired'))
      return
    }

    // Validate appointment if user wants one
    if (wantsAppointment && (!appointmentData.date || !appointmentData.time)) {
      alert(t('configuratorForm.fillAppointment'))
      return
    }

    setSubmitting(true)
    try {
      // Save configurator submission with appointment data included
      const submissionData = {
        configurator_id: configurator?.id,
        configuration_data: {
          ...formData,
          _appointment: wantsAppointment ? {
            requested: true,
            service_type: appointmentData.service_type,
            date: appointmentData.date,
            time: appointmentData.time
          } : { requested: false }
        },
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

      // Send data to n8n webhook
      try {
        // Build step details with labels for better readability
        const stepDetails: Record<string, any> = {}
        visibleSteps.forEach(step => {
          const fieldValue = formData[step.field_name]
          const selectedOption = step.configurator_options?.find(
            (opt: any) => opt.option_value === fieldValue
          )

          stepDetails[step.field_name] = {
            stepTitle: step.title,
            fieldName: step.field_name,
            value: fieldValue,
            label: selectedOption?.label || fieldValue,
            imageUrl: selectedOption?.image_url || null,
            inputType: step.input_type
          }
        })

        const webhookPayload = {
          // Configurator info
          configurator: {
            id: configurator?.id,
            name: configurator?.name,
            slug: configurator?.slug,
            category: configurator?.category
          },
          // All form data (raw values)
          formData: formData,
          // Detailed step information with labels
          stepDetails: stepDetails,
          // Contact information
          contact: {
            name: contactData.contact_name,
            email: contactData.contact_email,
            phone: contactData.contact_phone,
            address: contactData.contact_address || null,
            city: contactData.contact_city || null,
            notes: contactData.notes || null
          },
          // Appointment data (if requested)
          appointment: wantsAppointment ? {
            requested: true,
            serviceType: appointmentData.service_type,
            date: appointmentData.date,
            time: appointmentData.time
          } : {
            requested: false
          },
          // Metadata
          metadata: {
            submittedAt: new Date().toISOString(),
            language: currentLang,
            totalSteps: visibleSteps.length
          }
        }

        const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_CONFIGURATOR_WEBHOOK_URL

        if (N8N_WEBHOOK_URL) {
          // Use no-cors mode to bypass CORS restrictions
          // Note: Response cannot be read, but data will be sent
          await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain',
            },
            body: JSON.stringify(webhookPayload)
          })
        }
      } catch (webhookError) {
        // Don't block the submission if webhook fails
        console.error('Webhook error:', webhookError)
      }

      alert(t('configuratorForm.successMessage'))
      navigate('/')
    } catch (error) {
      console.error('Error submitting:', error)
      alert(t('configuratorForm.errorMessage'))
    } finally {
      setSubmitting(false)
    }
  }

  const getCurrentPreviewImage = (): string => {
    const currentStep = getCurrentStep()
    if (!currentStep) return configurator?.image_url || ''

    // For dimension type steps, show a default measurement image
    const dimensionTypes = ['dimension', 'dimensions', 'dimension-width', 'dimension-length', 'dimension-height']
    if (dimensionTypes.includes(currentStep.input_type)) {
      return '/Veranda-antraciet.webp'
    }

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
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  if (!configurator) {
    return (
      <div className="configurator-error">
        <h2>{t('configuratorForm.notFound')}</h2>
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
                  <p>{t('configuratorForm.imagePreview')}</p>
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
            {t('configuratorForm.stepOf', { current: currentStepIndex + 1, total: totalSteps })}
          </div>

          {showGatewayQuestion ? (
            // Gateway Question: "More Customization?"
            <div className="step-content">
              <h2 className="step-title">{t('configuratorForm.gatewayTitle')}</h2>
              <p className="step-subtitle">{t('configuratorForm.gatewaySubtitle')}</p>

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
                    <strong>{t('configuratorForm.gatewayYes')}</strong>
                    <small>{t('configuratorForm.gatewayYesDesc')}</small>
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
                    <strong>{t('configuratorForm.gatewayNo')}</strong>
                    <small>{t('configuratorForm.gatewayNoDesc')}</small>
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
              <div className="contact-header">
                <div className="contact-header-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <h2 className="step-title">{t('configuratorForm.contactTitle')}</h2>
                  <p className="step-subtitle">{t('configuratorForm.contactSubtitle')}</p>
                </div>
              </div>

              <div className="contact-form">
                <div className="form-grid">
                  <div className="form-group with-icon">
                    <label>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      {t('configuratorForm.name')} *
                    </label>
                    <input
                      type="text"
                      value={contactData.contact_name}
                      onChange={(e) => setContactData({ ...contactData, contact_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group with-icon">
                    <label>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      {t('configuratorForm.phone')} *
                    </label>
                    <input
                      type="tel"
                      value={contactData.contact_phone}
                      onChange={(e) => setContactData({ ...contactData, contact_phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group with-icon full-width">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    {t('configuratorForm.email')} *
                  </label>
                  <input
                    type="email"
                    value={contactData.contact_email}
                    onChange={(e) => setContactData({ ...contactData, contact_email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group with-icon">
                    <label>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {t('configuratorForm.address')}
                    </label>
                    <input
                      type="text"
                      value={contactData.contact_address}
                      onChange={(e) => setContactData({ ...contactData, contact_address: e.target.value })}
                    />
                  </div>

                  <div className="form-group with-icon">
                    <label>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      {t('configuratorForm.city')}
                    </label>
                    <input
                      type="text"
                      value={contactData.contact_city}
                      onChange={(e) => setContactData({ ...contactData, contact_city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group with-icon full-width">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    {t('configuratorForm.notes')}
                  </label>
                  <textarea
                    value={contactData.notes}
                    onChange={(e) => setContactData({ ...contactData, notes: e.target.value })}
                    placeholder={t('configuratorForm.notesPlaceholder')}
                    rows={3}
                  />
                </div>

                {/* Appointment Booking Option */}
                {appointmentSettings.length > 0 && (
                  <div className="appointment-section">
                    <div className="appointment-header">
                      <div className="appointment-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <div>
                        <h3>{t('configuratorForm.appointmentTitle')}</h3>
                        <p>{t('configuratorForm.appointmentSubtitle')}</p>
                      </div>
                    </div>

                    <div className="appointment-choice">
                      <button
                        type="button"
                        className={`appointment-btn ${wantsAppointment === true ? 'selected' : ''}`}
                        onClick={() => setWantsAppointment(true)}
                      >
                        <span className="appointment-btn-icon">✓</span>
                        <span>{t('configuratorForm.appointmentYes')}</span>
                      </button>
                      <button
                        type="button"
                        className={`appointment-btn ${wantsAppointment === false ? 'selected' : ''}`}
                        onClick={() => setWantsAppointment(false)}
                      >
                        <span className="appointment-btn-icon">→</span>
                        <span>{t('configuratorForm.appointmentNo')}</span>
                      </button>
                    </div>

                    {wantsAppointment && (
                      <div className="appointment-form">
                        <div className="form-group with-icon">
                          <label>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                            </svg>
                            {t('configuratorForm.appointmentType')} *
                          </label>
                          <select
                            value={appointmentData.service_type}
                            onChange={(e) => setAppointmentData({ ...appointmentData, service_type: e.target.value, time: '' })}
                            className="modern-select"
                          >
                            {appointmentSettings.map(setting => (
                              <option key={setting.id} value={setting.service_type}>
                                {(setting.name as Record<string, string>)[currentLang] || (setting.name as Record<string, string>)['nl'] || setting.service_type}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group with-icon date-picker-group">
                          <label>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            {t('configuratorForm.date')} *
                          </label>
                          <div className="date-input-wrapper">
                            <input
                              type="date"
                              value={appointmentData.date}
                              onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value, time: '' })}
                              min={new Date().toISOString().split('T')[0]}
                              className="modern-date-input"
                            />
                            <div className="date-display">
                              {appointmentData.date ? (
                                <>
                                  <span className="date-day">
                                    {new Date(appointmentData.date).toLocaleDateString('nl-NL', { weekday: 'long' })}
                                  </span>
                                  <span className="date-full">
                                    {new Date(appointmentData.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  </span>
                                </>
                              ) : (
                                <span className="date-placeholder">{t('configuratorForm.selectDate')}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="form-group with-icon">
                          <label>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {t('configuratorForm.time')} *
                          </label>
                          <TimeSlotPicker
                            selectedDate={appointmentData.date}
                            selectedTime={appointmentData.time}
                            onTimeSelect={(time) => setAppointmentData({ ...appointmentData, time })}
                            serviceType={appointmentData.service_type}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
              ← {t('configuratorForm.previous')}
            </button>

            {!isLastStep ? (
              <button className="btn btn-primary" onClick={handleNext}>
                {t('configuratorForm.next')} →
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? t('configuratorForm.submitting') : t('configuratorForm.requestQuote')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
