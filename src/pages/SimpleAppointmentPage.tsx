import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/AppointmentPage.css'

export default function SimpleAppointmentPage() {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+31',
    service_type: '',
    preferred_date: '',
    preferred_time: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const appointmentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service_type: formData.service_type,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        message: formData.message || null,
        status: 'pending'
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Appointment submitted successfully:', data)
      setSubmitStatus('success')

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '+31',
          service_type: '',
          preferred_date: '',
          preferred_time: '',
          message: ''
        })
        setSubmitStatus('idle')
      }, 3000)

    } catch (error) {
      console.error('Error submitting appointment:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const serviceTypes = [
    { value: 'showroom-bezoek', label: 'Showroom bezoek' },
    { value: 'gratis-opmeting', label: 'Gratis opmeting bij u thuis' },
    { value: 'offerte-bespreking', label: 'Offerte bespreking' },
    { value: 'algemeen-advies', label: 'Algemeen advies' },
    { value: 'reparatie', label: 'Reparatie' },
    { value: 'onderhoud', label: 'Onderhoud' }
  ]

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ]

  return (
    <div className="appointment-page">
      <Header />

      <section className="appointment-simple-section">
        <div className="container">
          <div className="appointment-simple-container">
            <div className="appointment-simple-header">
              <h1>{t('appointment.title') || 'Maak een Afspraak'}</h1>
              <p>{t('appointment.subtitle') || 'Plan een gratis opmeting, showroom bezoek of adviesgesprek.'}</p>
            </div>

            <form onSubmit={handleSubmit} className="appointment-simple-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    {t('appointment.name') || 'Naam'}*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('appointment.namePlaceholder') || 'Uw volledige naam'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    {t('appointment.email') || 'E-mail'}*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('appointment.emailPlaceholder') || 'uw.email@voorbeeld.nl'}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">
                    {t('appointment.phone') || 'Telefoon'}*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+31"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="service_type">
                    {t('appointment.serviceType') || 'Type afspraak'}*
                  </label>
                  <select
                    id="service_type"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t('appointment.selectService') || 'Selecteer een type'}</option>
                    {serviceTypes.map(service => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="preferred_date">
                    {t('appointment.preferredDate') || 'Voorkeursdatum'}*
                  </label>
                  <input
                    type="date"
                    id="preferred_date"
                    name="preferred_date"
                    value={formData.preferred_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="preferred_time">
                    {t('appointment.preferredTime') || 'Voorkeurtijd'}*
                  </label>
                  <select
                    id="preferred_time"
                    name="preferred_time"
                    value={formData.preferred_time}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t('appointment.selectTime') || 'Selecteer een tijd'}</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  {t('appointment.message') || 'Bericht'} ({t('offerte.optional') || 'Optioneel'})
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('appointment.messagePlaceholder') || 'Vertel ons waar we u mee kunnen helpen...'}
                  rows={4}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={isSubmitting}
              >
                {isSubmitting ? (t('offerte.submitting') || 'Verzenden...') : (t('appointment.submitButton') || 'Afspraak Maken')}
              </button>

              {/* Success/Error Notification */}
              {submitStatus === 'success' && (
                <div className="notification notification-success">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <div>
                    <strong>{t('appointment.successTitle') || 'Afspraak aangevraagd!'}</strong>
                    <p>{t('appointment.successMessage') || 'We nemen zo spoedig mogelijk contact met u op om uw afspraak te bevestigen.'}</p>
                  </div>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="notification notification-error">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <div>
                    <strong>{t('offerte.errorTitle') || 'Er is iets misgegaan'}</strong>
                    <p>{t('offerte.errorMessage') || 'Probeer het later opnieuw of neem telefonisch contact op.'}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
