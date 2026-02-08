import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GoogleReviews from '../components/GoogleReviews'
import '../styles/ContactPage.css'

const CONTACT_WEBHOOK_URL = import.meta.env.VITE_N8N_CONTACT_WEBHOOK_URL

interface WorkingHours {
  day_of_week: number
  is_open: boolean
  open_time: string
  close_time: string
  break_start: string | null
  break_end: string | null
}

export default function ContactPage() {
  const { t, i18n } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([])
  const [formData, setFormData] = useState({
    naam: '',
    telefoon: '',
    email: '',
    woonplaats: '',
    onderwerp: '',
    bericht: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    loadWorkingHours()
  }, [])

  const loadWorkingHours = async () => {
    try {
      const { data, error } = await supabase
        .from('working_hours')
        .select('*')
        .order('day_of_week', { ascending: true })

      if (!error && data) {
        setWorkingHours(data)
      }
    } catch (err) {
      console.error('Error loading working hours:', err)
    }
  }

  const formatTime = (time: string) => {
    return time.substring(0, 5) // "09:00:00" -> "09:00"
  }

  const getDayName = (dayOfWeek: number): string => {
    const lang = i18n.language
    const days: Record<string, string[]> = {
      nl: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      tr: ['Pazar', 'Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi']
    }
    return (days[lang] || days['nl'])[dayOfWeek]
  }

  const formatWorkingHoursDisplay = () => {
    if (workingHours.length === 0) {
      // Fallback to static text if no data
      return (
        <>
          <p>{t('contactPage.info.hoursMonThu')}</p>
          <p>{t('contactPage.info.hoursFri')}</p>
          <p>{t('contactPage.info.hoursSat')}</p>
        </>
      )
    }

    // Group days with same hours
    const groupedHours: { days: number[]; hours: WorkingHours }[] = []

    workingHours.forEach(wh => {
      const existing = groupedHours.find(g =>
        g.hours.is_open === wh.is_open &&
        g.hours.open_time === wh.open_time &&
        g.hours.close_time === wh.close_time
      )
      if (existing) {
        existing.days.push(wh.day_of_week)
      } else {
        groupedHours.push({ days: [wh.day_of_week], hours: wh })
      }
    })

    return groupedHours.map((group, idx) => {
      const { days, hours } = group
      let dayLabel = ''

      // Check for consecutive days
      const sortedDays = days.sort((a, b) => a - b)
      if (sortedDays.length > 2 && sortedDays[sortedDays.length - 1] - sortedDays[0] === sortedDays.length - 1) {
        dayLabel = `${getDayName(sortedDays[0])} - ${getDayName(sortedDays[sortedDays.length - 1])}`
      } else {
        dayLabel = sortedDays.map(d => getDayName(d)).join(', ')
      }

      if (!hours.is_open) {
        return <p key={idx}>{dayLabel}: {t('contactPage.info.closed', 'Gesloten')}</p>
      }

      return (
        <p key={idx}>
          {dayLabel}: {formatTime(hours.open_time)} - {formatTime(hours.close_time)}
        </p>
      )
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrl: string | null = null

      // Upload file to Supabase Storage if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `contact_${Date.now()}.${fileExt}`
        const filePath = `contact-photos/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, selectedFile)

        if (uploadError) {
          console.error('Upload error:', uploadError)
        } else {
          const { data: urlData } = supabase.storage
            .from('uploads')
            .getPublicUrl(filePath)
          imageUrl = urlData.publicUrl
        }
      }

      // Save to Supabase
      const { error: supabaseError } = await supabase
        .from('contacts')
        .insert({
          name: formData.naam,
          email: formData.email,
          phone: formData.telefoon || null,
          subject: formData.onderwerp,
          message: formData.bericht,
          city: formData.woonplaats || null,
          image_url: imageUrl,
          is_read: false
        })

      if (supabaseError) {
        console.error('Supabase error:', supabaseError)
        throw supabaseError
      }

      // Send to n8n webhook
      if (CONTACT_WEBHOOK_URL) {
        const webhookPayload = {
          contact: {
            name: formData.naam,
            email: formData.email,
            phone: formData.telefoon,
            city: formData.woonplaats
          },
          message: {
            subject: formData.onderwerp,
            body: formData.bericht
          },
          photo: imageUrl,
          source: {
            type: 'contact_page',
            page: 'ContactPage'
          },
          metadata: {
            submittedAt: new Date().toISOString(),
            language: i18n.language
          }
        }

        await fetch(CONTACT_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: JSON.stringify(webhookPayload)
        })
      }

      console.log('Form submitted:', formData)
      alert(t('contactPage.form.successMessage'))

      // Reset form
      setFormData({
        naam: '',
        telefoon: '',
        email: '',
        woonplaats: '',
        onderwerp: '',
        bericht: ''
      })
      setSelectedFile(null)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(t('contactPage.form.errorMessage', 'Er is een fout opgetreden. Probeer het opnieuw.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      <Helmet>
        <title>{t('contactPage.hero.title')} | VivaVerandas</title>
        <meta name="description" content={t('contactPage.hero.subtitle')} />
        <link rel="canonical" href="https://vivaverandas.nl/contact" />
        <meta property="og:title" content={`${t('contactPage.hero.title')} | VivaVerandas`} />
        <meta property="og:description" content={t('contactPage.hero.subtitle')} />
        <meta property="og:url" content="https://vivaverandas.nl/contact" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-bg">
          <img
            src="/glasLux-home.webp"
            alt={t('contactPage.hero.title')}
          />
        </div>
        <div className="container contact-hero-content">
          <h1>{t('contactPage.hero.title')}</h1>
          <p>{t('contactPage.hero.subtitle')}</p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h2>{t('contactPage.form.title')}</h2>
              <p>{t('contactPage.form.subtitle')}</p>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="naam">{t('contactPage.form.name')} *</label>
                    <input
                      type="text"
                      id="naam"
                      name="naam"
                      placeholder={t('contactPage.form.namePlaceholder')}
                      value={formData.naam}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefoon">{t('contactPage.form.phone')} *</label>
                    <input
                      type="tel"
                      id="telefoon"
                      name="telefoon"
                      placeholder={t('contactPage.form.phonePlaceholder')}
                      value={formData.telefoon}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">{t('contactPage.form.email')} *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder={t('contactPage.form.emailPlaceholder')}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="woonplaats">{t('contactPage.form.city')}</label>
                    <input
                      type="text"
                      id="woonplaats"
                      name="woonplaats"
                      placeholder={t('contactPage.form.cityPlaceholder')}
                      value={formData.woonplaats}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="onderwerp">{t('contactPage.form.subject')} *</label>
                  <select
                    id="onderwerp"
                    name="onderwerp"
                    value={formData.onderwerp}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t('contactPage.form.subjectPlaceholder')}</option>
                    <option value="polycarbonaat">{t('contactPage.form.subjectPolycarbonaat')}</option>
                    <option value="platenwissel">{t('contactPage.form.subjectPlatenwissel')}</option>
                    <option value="glazen">{t('contactPage.form.subjectGlazen')}</option>
                    <option value="lamellen">{t('contactPage.form.subjectLamellen')}</option>
                    <option value="vouwdak">{t('contactPage.form.subjectVouwdak')}</option>
                    <option value="schuifwand">{t('contactPage.form.subjectSchuifwand')}</option>
                    <option value="overige">{t('contactPage.form.subjectOverige')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="bericht">{t('contactPage.form.message')} *</label>
                  <textarea
                    id="bericht"
                    name="bericht"
                    placeholder={t('contactPage.form.messagePlaceholder')}
                    rows={5}
                    value={formData.bericht}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="foto">{t('contactPage.form.photo')}</label>
                  <input
                    type="file"
                    id="foto"
                    name="foto"
                    accept="image/*"
                    className="file-input"
                    onChange={handleFileChange}
                  />
                  {selectedFile && (
                    <span className="file-selected">{selectedFile.name}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('common.sending', 'Verzenden...') : t('contactPage.form.submit')}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-wrapper">
              <div className="contact-intro">
                <h2>{t('contactPage.info.title')}</h2>
                <p>
                  {t('contactPage.info.intro1')}
                </p>
                <p>
                  {t('contactPage.info.intro2')}
                </p>
              </div>

              <div className="contact-details-box">
                <div className="contact-detail-item">
                  <div className="detail-icon">📞</div>
                  <div className="detail-content">
                    <strong>{t('contactPage.info.phone')}</strong>
                    <p>+31 77 390 2201</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">✉️</div>
                  <div className="detail-content">
                    <strong>{t('contactPage.info.email')}</strong>
                    <p>info@vivaverandas.nl</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">📍</div>
                  <div className="detail-content">
                    <strong>{t('contactPage.info.showroom')}</strong>
                    <p>Mariastraat 22</p>
                    <p>5953 NL Reuver</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">🕐</div>
                  <div className="detail-content">
                    <strong>{t('contactPage.info.hours')}</strong>
                    {formatWorkingHoursDisplay()}
                  </div>
                </div>
              </div>

              <a href="/afspraak" className="btn btn-primary btn-large appointment-btn">
                {t('contactPage.info.appointment')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2>{t('contactPage.map.title')}</h2>
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2500!2d6.082766!3d51.280102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c74f53a508958d%3A0x618238c611b6b837!2sAluSolutions%20%7C%20Veranda's%20%26%20Overkappingen!5e0!3m2!1snl!2snl"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="VivaVerandas Locatie"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <GoogleReviews />

      {/* CTA Section */}
      <section className="contact-cta">
        <div className="container">
          <h2>{t('contactPage.cta.title')}</h2>
          <p>{t('contactPage.cta.subtitle')}</p>
          <div className="cta-buttons">
            <a href="/#offerte" className="btn btn-primary btn-large">{t('contactPage.cta.quote')}</a>
            <a href="#" className="btn btn-secondary btn-large">{t('contactPage.cta.call')}</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
