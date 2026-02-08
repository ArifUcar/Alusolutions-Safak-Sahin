import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Calendar } from 'primereact/calendar'
import { addLocale } from 'primereact/api'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TimeSlotPicker from '../components/TimeSlotPicker'
import { supabase } from '../lib/supabase'
import type { AppointmentSettings } from '../lib/supabase'
import '../styles/AfspraakPage.css'

// Add Dutch locale for Calendar
addLocale('nl', {
  firstDayOfWeek: 1,
  dayNames: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  dayNamesShort: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  dayNamesMin: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
  monthNames: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  monthNamesShort: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  today: 'Vandaag',
  clear: 'Wissen'
})

export default function AfspraakPage() {
  const { t, i18n } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentSettings[]>([])

  const [formData, setFormData] = useState({
    afspraakType: '',
    datum: '',
    tijd: '',
    naam: '',
    email: '',
    telefoon: '',
    opmerking: ''
  })

  useEffect(() => {
    loadAppointmentTypes()
  }, [])

  const loadAppointmentTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_settings')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (!error && data) {
        setAppointmentTypes(data)
      }
    } catch (err) {
      console.error('Error loading appointment types:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'afspraakType') {
      setFormData({ ...formData, [name]: value, tijd: '' })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleTimeSelect = (time: string) => {
    setFormData({ ...formData, tijd: time })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const { error: dbError } = await supabase
        .from('appointments')
        .insert({
          name: formData.naam,
          email: formData.email,
          phone: formData.telefoon,
          service_type: formData.afspraakType,
          preferred_date: formData.datum,
          preferred_time: formData.tijd,
          message: formData.opmerking || null,
          status: 'pending'
        })

      if (dbError) throw dbError

      try {
        const APPOINTMENT_WEBHOOK_URL = import.meta.env.VITE_N8N_APPOINTMENT_WEBHOOK_URL

        if (APPOINTMENT_WEBHOOK_URL) {
          const appointmentWebhookPayload = {
            contact: {
              name: formData.naam,
              email: formData.email,
              phone: formData.telefoon
            },
            appointment: {
              serviceType: formData.afspraakType,
              date: formData.datum,
              time: formData.tijd,
              message: formData.opmerking || null,
              status: 'pending'
            },
            source: {
              type: 'afspraak_page',
              page: 'AfspraakPage'
            },
            metadata: {
              submittedAt: new Date().toISOString(),
              language: i18n.language
            }
          }

          await fetch(APPOINTMENT_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(appointmentWebhookPayload)
          })
        }
      } catch (webhookError) {
        console.error('Appointment webhook error:', webhookError)
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting appointment:', err)
      setError(t('appointment.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const getServiceTypeLabel = (type: string) => {
    const setting = appointmentTypes.find(s => s.service_type === type)
    if (setting) {
      const name = setting.name as Record<string, string>
      return name[i18n.language] || name['nl'] || type
    }
    switch (type) {
      case 'showroom': return t('appointment.types.showroom')
      case 'thuisbezoek': return t('appointment.types.homeVisit')
      case 'advies': return t('appointment.types.advice')
      default: return type
    }
  }

  if (submitted) {
    return (
      <div className="afspraak-page">
        <Header />
        <main className="afspraak-main-new">
          <div className="afspraak-success-card">
            <div className="success-icon-new">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2>{t('appointment.success.title')}</h2>
            <p className="success-subtitle">{t('appointment.success.message')}</p>
            <div className="success-summary">
              <div className="summary-item">
                <span className="summary-label">{t('appointment.summary.type')}</span>
                <span className="summary-value">{getServiceTypeLabel(formData.afspraakType)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{t('appointment.summary.date')}</span>
                <span className="summary-value">{formData.datum}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{t('appointment.summary.time')}</span>
                <span className="summary-value">{formData.tijd}</span>
              </div>
            </div>
            <p className="success-note-new">{t('appointment.success.note')}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="afspraak-page">
      <Helmet>
        <title>{t('appointment.title')} | VivaVerandas</title>
        <meta name="description" content={t('appointment.subtitle')} />
        <link rel="canonical" href="https://vivaverandas.nl/afspraak" />
        <meta property="og:title" content={`${t('appointment.title')} | VivaVerandas`} />
        <meta property="og:description" content={t('appointment.subtitle')} />
        <meta property="og:url" content="https://vivaverandas.nl/afspraak" />
      </Helmet>

      <Header />

      <main className="afspraak-main-new">
        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className="afspraak-form-card">
          {/* Section 1: Service Type */}
          <div className="form-section">
            <div className="section-header">
              <span className="section-number">1</span>
              <h3>{t('appointment.step1.title')}</h3>
            </div>
            <div className="service-type-grid">
              {appointmentTypes.length > 0 ? (
                appointmentTypes.map(type => (
                  <label
                    key={type.id}
                    className={`service-type-card ${formData.afspraakType === type.service_type ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="afspraakType"
                      value={type.service_type}
                      checked={formData.afspraakType === type.service_type}
                      onChange={handleChange}
                    />
                    <span className="service-icon">
                      {type.service_type === 'showroom' && '🏢'}
                      {type.service_type === 'thuisbezoek' && '🏠'}
                      {type.service_type === 'advies' && '💬'}
                      {!['showroom', 'thuisbezoek', 'advies'].includes(type.service_type) && '📋'}
                    </span>
                    <span className="service-name">
                      {(type.name as Record<string, string>)[i18n.language] || (type.name as Record<string, string>)['nl'] || type.service_type}
                    </span>
                  </label>
                ))
              ) : (
                <>
                  <label className={`service-type-card ${formData.afspraakType === 'showroom' ? 'selected' : ''}`}>
                    <input type="radio" name="afspraakType" value="showroom" checked={formData.afspraakType === 'showroom'} onChange={handleChange} />
                    <span className="service-icon">🏢</span>
                    <span className="service-name">{t('appointment.types.showroom')}</span>
                  </label>
                  <label className={`service-type-card ${formData.afspraakType === 'advies' ? 'selected' : ''}`}>
                    <input type="radio" name="afspraakType" value="advies" checked={formData.afspraakType === 'advies'} onChange={handleChange} />
                    <span className="service-icon">💬</span>
                    <span className="service-name">{t('appointment.types.advice')}</span>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Section 2: Date & Time */}
          <div className="form-section">
            <div className="section-header">
              <span className="section-number">2</span>
              <h3>{t('appointment.form.dateTime', 'Datum & Tijd')}</h3>
            </div>
            <div className="datetime-grid">
              <div className="datetime-column">
                <label className="datetime-label">{t('appointment.form.date')}</label>
                <Calendar
                  id="datum"
                  value={formData.datum ? new Date(formData.datum) : null}
                  onChange={(e) => {
                    if (e.value) {
                      const date = e.value as Date
                      const formatted = date.toISOString().split('T')[0]
                      setFormData({ ...formData, datum: formatted, tijd: '' })
                    }
                  }}
                  minDate={new Date()}
                  locale={i18n.language === 'nl' ? 'nl' : undefined}
                  dateFormat="dd/mm/yy"
                  disabledDays={[0]}
                  className="appointment-calendar-new"
                  inline
                />
              </div>
              <div className="datetime-column">
                <label className="datetime-label">{t('appointment.form.time')}</label>
                <TimeSlotPicker
                  selectedDate={formData.datum}
                  selectedTime={formData.tijd}
                  onTimeSelect={handleTimeSelect}
                  serviceType={formData.afspraakType}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Contact Info */}
          <div className="form-section">
            <div className="section-header">
              <span className="section-number">3</span>
              <h3>{t('appointment.contactInfo', 'Contactgegevens')}</h3>
            </div>
            <div className="contact-grid">
              <div className="form-field">
                <label htmlFor="naam">{t('appointment.form.name')} *</label>
                <input
                  type="text"
                  id="naam"
                  name="naam"
                  placeholder={t('appointment.form.namePlaceholder')}
                  value={formData.naam}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="telefoon">{t('appointment.form.phone')} *</label>
                <input
                  type="tel"
                  id="telefoon"
                  name="telefoon"
                  placeholder={t('appointment.form.phonePlaceholder')}
                  value={formData.telefoon}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field full-width">
                <label htmlFor="email">{t('appointment.form.email')} *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t('appointment.form.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field full-width">
                <label htmlFor="opmerking">{t('appointment.form.remarks')}</label>
                <textarea
                  id="opmerking"
                  name="opmerking"
                  placeholder={t('appointment.form.remarksPlaceholder')}
                  rows={3}
                  value={formData.opmerking}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Section */}
          <div className="form-submit-section">
            <button
              type="submit"
              className="submit-btn"
              disabled={submitting || !formData.tijd || !formData.afspraakType}
            >
              {submitting ? (
                <>
                  <span className="spinner"></span>
                  {t('appointment.submitting')}
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 16l2 2 4-4"></path>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {t('appointment.confirm')}
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
