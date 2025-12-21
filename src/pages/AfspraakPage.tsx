import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TimeSlotPicker from '../components/TimeSlotPicker'
import { supabase } from '../lib/supabase'
import '../styles/AfspraakPage.css'

export default function AfspraakPage() {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    afspraakType: '',
    datum: '',
    tijd: '',
    naam: '',
    email: '',
    telefoon: '',
    opmerking: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting appointment:', err)
      setError(t('appointment.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const getServiceTypeLabel = (type: string) => {
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
        <section className="afspraak-simple">
          <div className="container">
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>{t('appointment.success.title')}</h2>
              <p>{t('appointment.success.message')}</p>
              <div className="success-details">
                <p><strong>{t('appointment.summary.type')}:</strong> {getServiceTypeLabel(formData.afspraakType)}</p>
                <p><strong>{t('appointment.summary.date')}:</strong> {formData.datum}</p>
                <p><strong>{t('appointment.summary.time')}:</strong> {formData.tijd}</p>
              </div>
              <p className="success-note">{t('appointment.success.note')}</p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  return (
    <div className="afspraak-page">
      <Header />

      <section className="afspraak-simple">
        <div className="container">
          <div className="afspraak-header">
            <h1>{t('appointment.title')}</h1>
            <p>{t('appointment.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="afspraak-form">
            {/* Appointment Type */}
            <div className="form-group">
              <label htmlFor="afspraakType">{t('appointment.step1.title')} *</label>
              <select
                id="afspraakType"
                name="afspraakType"
                value={formData.afspraakType}
                onChange={handleChange}
                required
              >
                <option value="">{t('appointment.summary.notSelected')}</option>
                <option value="showroom">{t('appointment.types.showroom')}</option>
                <option value="thuisbezoek">{t('appointment.types.homeVisit')}</option>
                <option value="advies">{t('appointment.types.advice')}</option>
              </select>
            </div>

            {/* Date & Time */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="datum">{t('appointment.form.date')} *</label>
                <input
                  type="date"
                  id="datum"
                  name="datum"
                  value={formData.datum}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('appointment.form.time')} *</label>
              <TimeSlotPicker
                selectedDate={formData.datum}
                selectedTime={formData.tijd}
                onTimeSelect={handleTimeSelect}
              />
            </div>

            {/* Contact Info */}
            <div className="form-row">
              <div className="form-group">
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
              <div className="form-group">
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
            </div>

            <div className="form-group">
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

            <div className="form-group">
              <label htmlFor="opmerking">{t('appointment.form.remarks')}</label>
              <textarea
                id="opmerking"
                name="opmerking"
                placeholder={t('appointment.form.remarksPlaceholder')}
                rows={4}
                value={formData.opmerking}
                onChange={handleChange}
              ></textarea>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <div className="opening-hours">
              <p>{t('appointment.openingHours')}</p>
            </div>

            <button type="submit" className="btn btn-primary btn-large" disabled={submitting || !formData.tijd}>
              {submitting ? t('appointment.submitting') : t('appointment.confirm')}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
