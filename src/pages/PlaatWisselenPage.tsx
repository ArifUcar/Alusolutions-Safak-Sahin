import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import '../styles/PlaatWisselenPage.css'

export default function PlaatWisselenPage() {
  const { t, i18n } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    postcode: '',
    city: '',
    phone: '',
    email: '',
    plateCount: '1',
    depth: '100cm',
    roofType: '',
    plateType: 'helder',
    message: ''
  })

  const plateCountOptions = Array.from({ length: 20 }, (_, i) => i + 1)
  const depthOptions = ['100cm', '150cm', '200cm', '250cm', '300cm', '350cm', '400cm', '450cm', '500cm']
  const roofTypeOptions = [
    { value: 'veranda', labelKey: 'plateReplace.roofTypes.veranda' },
    { value: 'carport', labelKey: 'plateReplace.roofTypes.carport' },
    { value: 'tuinoverkapping', labelKey: 'plateReplace.roofTypes.tuinoverkapping' },
    { value: 'serre', labelKey: 'plateReplace.roofTypes.serre' },
    { value: 'maatwerk', labelKey: 'plateReplace.roofTypes.maatwerk' }
  ]
  const plateTypeOptions = [
    { value: 'helder', labelKey: 'plateReplace.plateTypes.helder' },
    { value: 'opaal', labelKey: 'plateReplace.plateTypes.opaal' },
    { value: 'brons', labelKey: 'plateReplace.plateTypes.brons' },
    { value: 'grijs', labelKey: 'plateReplace.plateTypes.grijs' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      let imageUrl = null

      // Upload image if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `plaat-wisselen/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, selectedFile)

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName)
          imageUrl = urlData.publicUrl
        }
      }

      // Save to database
      const { error: dbError } = await supabase
        .from('plaat_wisselen_requests')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          address: formData.address,
          postcode: formData.postcode,
          city: formData.city,
          phone: formData.phone,
          email: formData.email,
          plate_count: parseInt(formData.plateCount),
          depth: formData.depth,
          roof_type: formData.roofType,
          plate_type: formData.plateType,
          message: formData.message || null,
          image_url: imageUrl,
          status: 'pending'
        })

      if (dbError) throw dbError

      // Send webhook notification
      try {
        const PLATEN_WISSELEN_WEBHOOK_URL = import.meta.env.VITE_N8N_PLATEN_WISSELEN_WEBHOOK_URL
        if (PLATEN_WISSELEN_WEBHOOK_URL) {
          await fetch(PLATEN_WISSELEN_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
              type: 'plaat_wisselen',
              contact: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                fullName: `${formData.firstName} ${formData.lastName}`,
                address: formData.address,
                postcode: formData.postcode,
                city: formData.city,
                fullAddress: `${formData.address}, ${formData.postcode} ${formData.city}`,
                phone: formData.phone,
                email: formData.email
              },
              details: {
                plateCount: parseInt(formData.plateCount),
                depth: formData.depth,
                roofType: formData.roofType,
                plateType: formData.plateType,
                message: formData.message || null,
                imageUrl: imageUrl
              },
              source: {
                type: 'plaat_wisselen_page',
                page: 'PlaatWisselenPage'
              },
              metadata: {
                submittedAt: new Date().toISOString(),
                language: i18n.language
              }
            })
          })
        }
      } catch (webhookError) {
        console.error('Webhook error:', webhookError)
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting form:', err)
      setError(t('plateReplace.form.error'))
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="plaat-wisselen-page">
        <Header />
        <main className="plaat-wisselen-main">
          <div className="container">
            <div className="success-card">
              <div className="success-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2>{t('plateReplace.success.title')}</h2>
              <p>{t('plateReplace.success.text1')}</p>
              <p>{t('plateReplace.success.text2')}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="plaat-wisselen-page">
      <Helmet>
        <title>{t('plateReplace.pageTitle')} | VivaVerandas</title>
        <meta name="description" content={t('plateReplace.metaDescription')} />
        <link rel="canonical" href="https://vivaverandas.nl/offerte-polycarbonaat-platen-wisselen" />
      </Helmet>

      <Header />

      <main className="plaat-wisselen-main">
        <div className="container">
          {/* Page Header */}
          <div className="page-header">
            <h1>{t('plateReplace.title')}</h1>
            <p>{t('plateReplace.subtitle')}</p>
          </div>

          <div className="content-wrapper">
            {/* Form Section */}
            <div className="form-section">
              <form onSubmit={handleSubmit} className="plaat-form">
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="firstName">{t('plateReplace.form.firstName')} *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder={t('plateReplace.form.firstName')}
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="lastName">{t('plateReplace.form.lastName')} *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder={t('plateReplace.form.lastName')}
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="address">{t('plateReplace.form.address')} *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder={t('plateReplace.form.addressPlaceholder')}
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="postcode">{t('plateReplace.form.postcode')} *</label>
                    <input
                      type="text"
                      id="postcode"
                      name="postcode"
                      placeholder={t('plateReplace.form.postcode')}
                      value={formData.postcode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="city">{t('plateReplace.form.city')} *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder={t('plateReplace.form.city')}
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="phone">{t('plateReplace.form.phone')} *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder={t('plateReplace.form.phone')}
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">{t('plateReplace.form.email')} *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder={t('plateReplace.form.email')}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="plateCount">{t('plateReplace.form.plateCount')}</label>
                    <select
                      id="plateCount"
                      name="plateCount"
                      value={formData.plateCount}
                      onChange={handleChange}
                    >
                      {plateCountOptions.map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="depth">{t('plateReplace.form.depth')}</label>
                    <select
                      id="depth"
                      name="depth"
                      value={formData.depth}
                      onChange={handleChange}
                    >
                      {depthOptions.map(depth => (
                        <option key={depth} value={depth}>{depth}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="roofType">{t('plateReplace.form.roofType')}</label>
                    <select
                      id="roofType"
                      name="roofType"
                      value={formData.roofType}
                      onChange={handleChange}
                    >
                      <option value="">{t('plateReplace.form.roofTypeSelect')}</option>
                      {roofTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="plateType">{t('plateReplace.form.plateType')}</label>
                    <select
                      id="plateType"
                      name="plateType"
                      value={formData.plateType}
                      onChange={handleChange}
                    >
                      {plateTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="photo">{t('plateReplace.form.photo')}</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <span className="file-name">
                      {selectedFile ? selectedFile.name : t('plateReplace.form.noFile')}
                    </span>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="message">{t('plateReplace.form.message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder={t('plateReplace.form.message')}
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {error && (
                  <div className="error-message">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    {error}
                  </div>
                )}

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner"></span>
                      {t('plateReplace.form.submitting')}
                    </>
                  ) : (
                    t('plateReplace.form.submit')
                  )}
                </button>
              </form>
            </div>

            {/* Steps Section */}
            <div className="steps-section">
              <div className="step-item">
                <div className="step-icon green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div className="step-content">
                  <h3>{t('plateReplace.steps.step1')}</h3>
                  <p>{t('plateReplace.steps.step1Desc')}</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-icon green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div className="step-content">
                  <h3>{t('plateReplace.steps.step2')}</h3>
                  <p>{t('plateReplace.steps.step2Desc')}</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-icon green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                </div>
                <div className="step-content">
                  <h3>{t('plateReplace.steps.step3')}</h3>
                  <p>{t('plateReplace.steps.step3Desc')}</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-icon green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="5" x2="5" y2="19"></line>
                    <circle cx="6.5" cy="6.5" r="2.5"></circle>
                    <circle cx="17.5" cy="17.5" r="2.5"></circle>
                  </svg>
                </div>
                <div className="step-content">
                  <h3>{t('plateReplace.steps.step4')}</h3>
                  <p>{t('plateReplace.steps.step4Desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="info-section">
            <div className="info-block">
              <h2>{t('plateReplace.info.whyTitle')}</h2>
              <p>{t('plateReplace.info.whyText1')}</p>
              <p>{t('plateReplace.info.whyText2')}</p>
            </div>

            <div className="info-block">
              <h2>{t('plateReplace.info.forTitle')}</h2>
              <p>{t('plateReplace.info.forText')}</p>
              <ul className="check-list">
                <li>{t('plateReplace.info.forList1')}</li>
                <li>{t('plateReplace.info.forList2')}</li>
                <li>{t('plateReplace.info.forList3')}</li>
                <li>{t('plateReplace.info.forList4')}</li>
              </ul>
              <p>{t('plateReplace.info.forText2')}</p>
            </div>

            <div className="info-block highlight">
              <h2>{t('plateReplace.info.areaTitle')}</h2>
              <p>{t('plateReplace.info.areaText')}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
