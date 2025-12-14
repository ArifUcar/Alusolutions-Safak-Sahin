import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/AppointmentPage.css'

interface OfferteFormData {
  // Step 1: Overkapping type
  overkappingType: string

  // Step 2: Goot type
  gootType: string

  // Step 3: Kleur
  kleur: string

  // Step 4: Materiaal
  materiaal: string

  // Step 5: Afmetingen
  breedte: string
  lengte: string

  // Step 6: Verlichting
  verlichting: string

  // Step 7: Meer opties
  meerOpties: boolean

  // Step 8: Opties (if meerOpties = true)
  rechterKant: string
  rechterSpie: string
  linkerKant: string
  linkerSpie: string
  voorkant: string
  achterkant: string

  // Step 9: Montage
  montage: string

  // Step 10: Contact gegevens
  naam: string
  straat: string
  woonplaats: string
  email: string
  telefoon: string
  opmerking: string
}

export default function AppointmentPage() {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState<OfferteFormData>({
    overkappingType: '',
    gootType: '',
    kleur: '',
    materiaal: '',
    breedte: '',
    lengte: '',
    verlichting: '',
    meerOpties: false,
    rechterKant: '',
    rechterSpie: '',
    linkerKant: '',
    linkerSpie: '',
    voorkant: '',
    achterkant: '',
    montage: '',
    naam: '',
    straat: '',
    woonplaats: '',
    email: '',
    telefoon: '+31',
    opmerking: ''
  })

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }


  const handleNext = () => {
    // Skip step 8 if meerOpties is false
    if (currentStep === 7 && !formData.meerOpties) {
      setCurrentStep(9)
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    // Skip step 8 if going back and meerOpties is false
    if (currentStep === 9 && !formData.meerOpties) {
      setCurrentStep(7)
    } else {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Prepare data for Supabase (convert camelCase to snake_case)
      const offerteData = {
        overkapping_type: formData.overkappingType,
        goot_type: formData.gootType,
        kleur: formData.kleur,
        materiaal: formData.materiaal,
        breedte: formData.breedte,
        lengte: formData.lengte,
        verlichting: formData.verlichting,
        meer_opties: formData.meerOpties,
        rechter_kant: formData.rechterKant || null,
        rechter_spie: formData.rechterSpie || null,
        linker_kant: formData.linkerKant || null,
        linker_spie: formData.linkerSpie || null,
        voorkant: formData.voorkant || null,
        achterkant: formData.achterkant || null,
        montage: formData.montage,
        naam: formData.naam,
        straat: formData.straat,
        woonplaats: formData.woonplaats,
        email: formData.email,
        telefoon: formData.telefoon,
        opmerking: formData.opmerking || null,
        status: 'new'
      }

      const { data, error } = await supabase
        .from('offertes')
        .insert([offerteData])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Offerte submitted successfully:', data)
      setSubmitStatus('success')

      // Reset form after 3 seconds
      setTimeout(() => {
        setCurrentStep(1)
        setFormData({
          overkappingType: '',
          gootType: '',
          kleur: '',
          materiaal: '',
          breedte: '',
          lengte: '',
          verlichting: '',
          meerOpties: false,
          rechterKant: '',
          rechterSpie: '',
          linkerKant: '',
          linkerSpie: '',
          voorkant: '',
          achterkant: '',
          montage: '',
          naam: '',
          straat: '',
          woonplaats: '',
          email: '',
          telefoon: '+31',
          opmerking: ''
        })
        setSubmitStatus('idle')
      }, 3000)

    } catch (error) {
      console.error('Error submitting offerte:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalSteps = formData.meerOpties ? 10 : 9

  // Get current image based on current step and selections
  const getCurrentImage = () => {
    switch (currentStep) {
      case 1:
        if (formData.overkappingType === 'standaard') {
          return '/Offorte/glazen-veranda/overkapping/Standaard.png'
        } else if (formData.overkappingType === 'vrijstaand') {
          return '/Offorte/glazen-veranda/overkapping/Vrijstaand.png'
        }
        return '/Offorte/glazen-veranda/overkapping/Standaard.png'

      case 2:
        if (formData.gootType === 'rechte-goot') {
          return '/Offorte/glazen-veranda/goot-type/Rechte-Goot.png'
        } else if (formData.gootType === 'halfronde-goot') {
          return '/Offorte/glazen-veranda/goot-type/Halfronde-Goot.png'
        }
        return '/Offorte/glazen-veranda/goot-type/Rechte-Goot.png'

      case 3:
        if (formData.kleur === 'wit') {
          return '/Offorte/glazen-veranda/kleur/Wit.png'
        } else if (formData.kleur === 'creme-wit') {
          return '/Offorte/glazen-veranda/kleur/Creme-wit.png'
        } else if (formData.kleur === 'antraciet') {
          return '/Offorte/glazen-veranda/kleur/Antraciet.png'
        } else if (formData.kleur === 'zwart') {
          return '/Offorte/glazen-veranda/kleur/Zwart.png'
        }
        return '/Offorte/glazen-veranda/kleur/Wit.png'

      case 4:
        if (formData.materiaal === 'polycarbonaat-opaal') {
          return '/Offorte/glazen-veranda/materiaal/polycarbonaat-opaal.png'
        } else if (formData.materiaal === 'polycarbonaat-helder') {
          return '/Offorte/glazen-veranda/materiaal/polycarbonaat-helder.png'
        } else if (formData.materiaal === 'polycarbonaat-warmte') {
          return '/Offorte/glazen-veranda/materiaal/polycarbonaat-warmte.png'
        } else if (formData.materiaal === 'helder-glas') {
          return '/Offorte/glazen-veranda/materiaal/helder-glas.png'
        } else if (formData.materiaal === 'opaal-glas') {
          return '/Offorte/glazen-veranda/materiaal/opaal-glas.png'
        } else if (formData.materiaal === 'getint-glas') {
          return '/Offorte/glazen-veranda/materiaal/getint-glas.png'
        }
        return '/Offorte/glazen-veranda/materiaal/helder-glas.png'

      case 6:
        if (formData.verlichting === 'geen') {
          return '/Offorte/glazen-veranda/verlichting/Geen-verlichting.png'
        } else if (formData.verlichting === 'koud-wit') {
          return '/Offorte/glazen-veranda/verlichting/koud-wit.png'
        } else if (formData.verlichting === 'warm-wit') {
          return '/Offorte/glazen-veranda/verlichting/warm-wit.png'
        } else if (formData.verlichting === 'koud-warm-daglicht') {
          return '/Offorte/glazen-veranda/verlichting/koud-warm-daglicht.png'
        }
        return '/Offorte/glazen-veranda/verlichting/Geen-verlichting.png'

      case 8:
        // For options step, show the first selected option or a default
        if (formData.rechterKant) {
          return `/Offorte/glazen-veranda/opties-bevestigen/rechterkant/${formData.rechterKant}.png`
        }
        return '/Offorte/glazen-veranda/opties-bevestigen/rechterkant/geen-wand.png'

      default:
        // Use the last selected image from previous steps
        if (formData.kleur) {
          return `/Offorte/glazen-veranda/kleur/${formData.kleur === 'creme-wit' ? 'Creme-wit' : formData.kleur.charAt(0).toUpperCase() + formData.kleur.slice(1)}.png`
        } else if (formData.gootType) {
          return `/Offorte/glazen-veranda/goot-type/${formData.gootType === 'rechte-goot' ? 'Rechte-Goot' : 'Halfronde-Goot'}.png`
        } else if (formData.overkappingType) {
          return `/Offorte/glazen-veranda/overkapping/${formData.overkappingType.charAt(0).toUpperCase() + formData.overkappingType.slice(1)}.png`
        }
        return '/Offorte/glazen-veranda/overkapping/Standaard.png'
    }
  }

  return (
    <div className="appointment-page">
      <Header />

      {/* Main Form Section */}
      <section className="offerte-section">
        <div className="offerte-container">
          {/* Left Side - Image */}
          <div className="offerte-image">
            <img
              src={getCurrentImage()}
              alt="Geselecteerde optie"
              key={getCurrentImage()} // Force re-render on image change
            />
          </div>

          {/* Right Side - Form */}
          <div className="offerte-form-container">
            <form onSubmit={handleSubmit} className="offerte-form">

              {/* Step 1: Overkapping Type */}
              {currentStep === 1 && (
                <div className="form-step">
                  <h2>{t('offerte.step1.title')}</h2>
                  <p className="step-subtitle">{t('offerte.required')}</p>

                  <div className="image-options-grid">
                    <label className={`image-option ${formData.overkappingType === 'standaard' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="overkappingType"
                        value="standaard"
                        checked={formData.overkappingType === 'standaard'}
                        onChange={(e) => handleChange('overkappingType', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/overkapping/Standaard.png" alt="Standaard" />
                      <span className="option-label">{t('offerte.step1.standaard')}</span>
                      <span className="option-desc">{t('offerte.step1.standaardDesc')}</span>
                    </label>

                    <label className={`image-option ${formData.overkappingType === 'vrijstaand' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="overkappingType"
                        value="vrijstaand"
                        checked={formData.overkappingType === 'vrijstaand'}
                        onChange={(e) => handleChange('overkappingType', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/overkapping/Vrijstaand.png" alt="Vrijstaand" />
                      <span className="option-label">{t('offerte.step1.vrijstaand')}</span>
                      <span className="option-desc">{t('offerte.step1.vrijstaandDesc')}</span>
                    </label>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-next"
                    onClick={handleNext}
                    disabled={!formData.overkappingType}
                  >
                    {t('offerte.nextButton')} →
                  </button>
                </div>
              )}

              {/* Step 2: Goot Type */}
              {currentStep === 2 && (
                <div className="form-step">
                  <h2>{t('offerte.step2.title')}</h2>
                  <p className="step-subtitle">{t('offerte.required')}</p>

                  <div className="image-options-grid">
                    <label className={`image-option ${formData.gootType === 'rechte-goot' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gootType"
                        value="rechte-goot"
                        checked={formData.gootType === 'rechte-goot'}
                        onChange={(e) => handleChange('gootType', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/goot-type/Rechte-Goot.png" alt="Rechte Goot" />
                      <span className="option-label">{t('offerte.step2.rechteGoot')}</span>
                    </label>

                    <label className={`image-option ${formData.gootType === 'halfronde-goot' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gootType"
                        value="halfronde-goot"
                        checked={formData.gootType === 'halfronde-goot'}
                        onChange={(e) => handleChange('gootType', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/goot-type/Halfronde-Goot.png" alt="Halfronde Goot" />
                      <span className="option-label">{t('offerte.step2.halfrondeGoot')}</span>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleBack}>
                      ← {t('offerte.backButton')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNext}
                      disabled={!formData.gootType}
                    >
                      {t('offerte.nextButton')} →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Kleur */}
              {currentStep === 3 && (
                <div className="form-step">
                  <h2>{t('offerte.step3.title')}</h2>
                  <p className="step-subtitle">{t('offerte.required')}</p>

                  <div className="image-options-grid four-columns">
                    <label className={`image-option ${formData.kleur === 'wit' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="kleur"
                        value="wit"
                        checked={formData.kleur === 'wit'}
                        onChange={(e) => handleChange('kleur', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/kleur/Wit.png" alt="Wit" />
                      <span className="option-label">{t('offerte.step3.wit')}</span>
                    </label>

                    <label className={`image-option ${formData.kleur === 'creme-wit' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="kleur"
                        value="creme-wit"
                        checked={formData.kleur === 'creme-wit'}
                        onChange={(e) => handleChange('kleur', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/kleur/Creme-wit.png" alt="Creme Wit" />
                      <span className="option-label">{t('offerte.step3.cremeWit')}</span>
                    </label>

                    <label className={`image-option ${formData.kleur === 'antraciet' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="kleur"
                        value="antraciet"
                        checked={formData.kleur === 'antraciet'}
                        onChange={(e) => handleChange('kleur', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/kleur/Antraciet.png" alt="Antraciet" />
                      <span className="option-label">{t('offerte.step3.antraciet')}</span>
                    </label>

                    <label className={`image-option ${formData.kleur === 'zwart' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="kleur"
                        value="zwart"
                        checked={formData.kleur === 'zwart'}
                        onChange={(e) => handleChange('kleur', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/kleur/Zwart.png" alt="Zwart" />
                      <span className="option-label">{t('offerte.step3.zwart')}</span>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleBack}>
                      ← {t('offerte.backButton')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNext}
                      disabled={!formData.kleur}
                    >
                      {t('offerte.nextButton')} →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Materiaal */}
              {currentStep === 4 && (
                <div className="form-step">
                  <h2>{t('offerte.step4.title')}</h2>
                  <p className="step-subtitle">{t('offerte.required')}</p>

                  <div className="image-options-grid three-columns">
                    <label className={`image-option ${formData.materiaal === 'polycarbonaat-opaal' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="materiaal"
                        value="polycarbonaat-opaal"
                        checked={formData.materiaal === 'polycarbonaat-opaal'}
                        onChange={(e) => handleChange('materiaal', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/materiaal/polycarbonaat-opaal.png" alt="Polycarbonaat Opaal" />
                      <span className="option-label">{t('offerte.step4.polycarbonaat')} Opaal</span>
                    </label>

                    <label className={`image-option ${formData.materiaal === 'polycarbonaat-helder' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="materiaal"
                        value="polycarbonaat-helder"
                        checked={formData.materiaal === 'polycarbonaat-helder'}
                        onChange={(e) => handleChange('materiaal', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/materiaal/polycarbonaat-helder.png" alt="Polycarbonaat Helder" />
                      <span className="option-label">{t('offerte.step4.polycarbonaat')} Helder</span>
                    </label>

                    <label className={`image-option ${formData.materiaal === 'polycarbonaat-warmte' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="materiaal"
                        value="polycarbonaat-warmte"
                        checked={formData.materiaal === 'polycarbonaat-warmte'}
                        onChange={(e) => handleChange('materiaal', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/materiaal/polycarbonaat-warmte.png" alt="Polycarbonaat Warmte" />
                      <span className="option-label">{t('offerte.step4.polycarbonaat')} Warmte</span>
                    </label>

                    <label className={`image-option ${formData.materiaal === 'helder-glas' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="materiaal"
                        value="helder-glas"
                        checked={formData.materiaal === 'helder-glas'}
                        onChange={(e) => handleChange('materiaal', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/materiaal/helder-glas.png" alt="Helder Glas" />
                      <span className="option-label">Helder {t('offerte.step4.glas')}</span>
                    </label>

                    <label className={`image-option ${formData.materiaal === 'opaal-glas' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="materiaal"
                        value="opaal-glas"
                        checked={formData.materiaal === 'opaal-glas'}
                        onChange={(e) => handleChange('materiaal', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/materiaal/opaal-glas.png" alt="Opaal Glas" />
                      <span className="option-label">Opaal {t('offerte.step4.glas')}</span>
                    </label>

                    <label className={`image-option ${formData.materiaal === 'getint-glas' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="materiaal"
                        value="getint-glas"
                        checked={formData.materiaal === 'getint-glas'}
                        onChange={(e) => handleChange('materiaal', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/materiaal/getint-glas.png" alt="Getint Glas" />
                      <span className="option-label">Getint {t('offerte.step4.glas')}</span>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleBack}>
                      ← {t('offerte.backButton')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNext}
                      disabled={!formData.materiaal}
                    >
                      {t('offerte.nextButton')} →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Afmetingen */}
              {currentStep === 5 && (
                <div className="form-step">
                  <h2>{t('offerte.step5.title')}</h2>
                  <p className="step-subtitle">{t('offerte.required')}</p>

                  <div className="dimensions-group">
                    <div className="form-group">
                      <label htmlFor="breedte">{t('offerte.step5.breedte')}</label>
                      <input
                        type="number"
                        id="breedte"
                        value={formData.breedte}
                        onChange={(e) => handleChange('breedte', e.target.value)}
                        placeholder={t('offerte.step5.breedtePlaceholder')}
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lengte">{t('offerte.step5.lengte')}</label>
                      <input
                        type="number"
                        id="lengte"
                        value={formData.lengte}
                        onChange={(e) => handleChange('lengte', e.target.value)}
                        placeholder={t('offerte.step5.lengtePlaceholder')}
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleBack}>
                      ← {t('offerte.backButton')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNext}
                      disabled={!formData.breedte || !formData.lengte}
                    >
                      {t('offerte.nextButton')} →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 6: Verlichting */}
              {currentStep === 6 && (
                <div className="form-step">
                  <h2>{t('offerte.step6.title')}</h2>
                  <p className="step-subtitle">{t('offerte.required')}</p>

                  <div className="image-options-grid four-columns">
                    <label className={`image-option ${formData.verlichting === 'geen' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="verlichting"
                        value="geen"
                        checked={formData.verlichting === 'geen'}
                        onChange={(e) => handleChange('verlichting', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/verlichting/Geen-verlichting.png" alt="Geen Verlichting" />
                      <span className="option-label">{t('offerte.step6.geen')}</span>
                    </label>

                    <label className={`image-option ${formData.verlichting === 'koud-wit' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="verlichting"
                        value="koud-wit"
                        checked={formData.verlichting === 'koud-wit'}
                        onChange={(e) => handleChange('verlichting', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/verlichting/koud-wit.png" alt="Koud Wit" />
                      <span className="option-label">Koud Wit</span>
                    </label>

                    <label className={`image-option ${formData.verlichting === 'warm-wit' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="verlichting"
                        value="warm-wit"
                        checked={formData.verlichting === 'warm-wit'}
                        onChange={(e) => handleChange('verlichting', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/verlichting/warm-wit.png" alt="Warm Wit" />
                      <span className="option-label">Warm Wit</span>
                    </label>

                    <label className={`image-option ${formData.verlichting === 'koud-warm-daglicht' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="verlichting"
                        value="koud-warm-daglicht"
                        checked={formData.verlichting === 'koud-warm-daglicht'}
                        onChange={(e) => handleChange('verlichting', e.target.value)}
                      />
                      <img src="/Offorte/glazen-veranda/verlichting/koud-warm-daglicht.png" alt="Koud-Warm-Daglicht" />
                      <span className="option-label">Koud-Warm-Daglicht</span>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleBack}>
                      ← {t('offerte.backButton')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNext}
                      disabled={!formData.verlichting}
                    >
                      {t('offerte.nextButton')} →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 7: Meer Opties */}
              {currentStep === 7 && (
                <div className="form-step">
                  <h2>{t('offerte.step7.title')}</h2>
                  <p className="step-subtitle">{t('offerte.required')}</p>

                  <div className="radio-group">
                    <label className={`radio-option ${formData.meerOpties === true ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="meerOpties"
                        value="ja"
                        checked={formData.meerOpties === true}
                        onChange={() => handleChange('meerOpties', true)}
                      />
                      <div className="radio-content">
                        <span className="radio-title">{t('offerte.step7.ja')}</span>
                        <span className="radio-desc">{t('offerte.step7.jaDesc')}</span>
                      </div>
                    </label>

                    <label className={`radio-option ${formData.meerOpties === false ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="meerOpties"
                        value="nee"
                        checked={formData.meerOpties === false}
                        onChange={() => handleChange('meerOpties', false)}
                      />
                      <div className="radio-content">
                        <span className="radio-title">{t('offerte.step7.nee')}</span>
                        <span className="radio-desc">{t('offerte.step7.neeDesc')}</span>
                      </div>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleBack}>
                      ← {t('offerte.backButton')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNext}
                    >
                      {t('offerte.nextButton')} →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 8: Opties (only if meerOpties = true) */}
              {currentStep === 8 && formData.meerOpties && (
                <div className="form-step">
                  <h2>{t('offerte.step8.title')}</h2>
                  <p className="step-subtitle">{t('offerte.optional')}</p>

                  <div className="options-grid">
                    <div className="form-group">
                      <label>{t('offerte.step8.rechterKant')}</label>
                      <select
                        value={formData.rechterKant}
                        onChange={(e) => handleChange('rechterKant', e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t('offerte.step8.selectOption')}</option>
                        <option value="glas">{t('offerte.step8.glas')}</option>
                        <option value="screen">{t('offerte.step8.screen')}</option>
                        <option value="geen">{t('offerte.step8.geen')}</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>{t('offerte.step8.rechterSpie')}</label>
                      <select
                        value={formData.rechterSpie}
                        onChange={(e) => handleChange('rechterSpie', e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t('offerte.step8.selectOption')}</option>
                        <option value="ja">{t('offerte.step8.ja')}</option>
                        <option value="nee">{t('offerte.step8.nee')}</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>{t('offerte.step8.linkerKant')}</label>
                      <select
                        value={formData.linkerKant}
                        onChange={(e) => handleChange('linkerKant', e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t('offerte.step8.selectOption')}</option>
                        <option value="glas">{t('offerte.step8.glas')}</option>
                        <option value="screen">{t('offerte.step8.screen')}</option>
                        <option value="geen">{t('offerte.step8.geen')}</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>{t('offerte.step8.linkerSpie')}</label>
                      <select
                        value={formData.linkerSpie}
                        onChange={(e) => handleChange('linkerSpie', e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t('offerte.step8.selectOption')}</option>
                        <option value="ja">{t('offerte.step8.ja')}</option>
                        <option value="nee">{t('offerte.step8.nee')}</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>{t('offerte.step8.voorkant')}</label>
                      <select
                        value={formData.voorkant}
                        onChange={(e) => handleChange('voorkant', e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t('offerte.step8.selectOption')}</option>
                        <option value="glas">{t('offerte.step8.glas')}</option>
                        <option value="screen">{t('offerte.step8.screen')}</option>
                        <option value="geen">{t('offerte.step8.geen')}</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>{t('offerte.step8.achterkant')}</label>
                      <select
                        value={formData.achterkant}
                        onChange={(e) => handleChange('achterkant', e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t('offerte.step8.selectOption')}</option>
                        <option value="glas">{t('offerte.step8.glas')}</option>
                        <option value="screen">{t('offerte.step8.screen')}</option>
                        <option value="geen">{t('offerte.step8.geen')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleBack}>
                      ← {t('offerte.backButton')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNext}
                    >
                      {t('offerte.nextButton')} →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 9: Montage */}
              {currentStep === 9 && (
                <div className="form-step">
                  <h2>{t('offerte.step9.title')}</h2>
                  <p className="step-subtitle">{t('offerte.required')}</p>

                  <div className="radio-group">
                    <label className={`radio-option ${formData.montage === 'inclusief' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="montage"
                        value="inclusief"
                        checked={formData.montage === 'inclusief'}
                        onChange={(e) => handleChange('montage', e.target.value)}
                      />
                      <div className="radio-content">
                        <span className="radio-title">{t('offerte.step9.inclusief')}</span>
                        <span className="radio-desc">{t('offerte.step9.inclusiefDesc')}</span>
                      </div>
                    </label>

                    <label className={`radio-option ${formData.montage === 'exclusief' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="montage"
                        value="exclusief"
                        checked={formData.montage === 'exclusief'}
                        onChange={(e) => handleChange('montage', e.target.value)}
                      />
                      <div className="radio-content">
                        <span className="radio-title">{t('offerte.step9.exclusief')}</span>
                        <span className="radio-desc">{t('offerte.step9.exclusiefDesc')}</span>
                      </div>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleBack}>
                      ← {t('offerte.backButton')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNext}
                      disabled={!formData.montage}
                    >
                      {t('offerte.nextButton')} →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 10: Contact Gegevens */}
              {currentStep === 10 && (
                <div className="form-step">
                  <h2>{t('offerte.step10.title')}</h2>
                  <p className="step-subtitle">{t('offerte.step10.subtitle')}</p>

                  <div className="contact-form">
                    <div className="form-group">
                      <label htmlFor="naam">
                        {t('offerte.step10.naam')}*
                        <span className="field-required">{t('offerte.required')}</span>
                      </label>
                      <input
                        type="text"
                        id="naam"
                        value={formData.naam}
                        onChange={(e) => handleChange('naam', e.target.value)}
                        placeholder={t('offerte.step10.naamPlaceholder')}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="straat">
                        {t('offerte.step10.straat')}*
                        <span className="field-required">{t('offerte.required')}</span>
                      </label>
                      <input
                        type="text"
                        id="straat"
                        value={formData.straat}
                        onChange={(e) => handleChange('straat', e.target.value)}
                        placeholder={t('offerte.step10.straatPlaceholder')}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="woonplaats">
                        {t('offerte.step10.woonplaats')}*
                        <span className="field-required">{t('offerte.required')}</span>
                      </label>
                      <input
                        type="text"
                        id="woonplaats"
                        value={formData.woonplaats}
                        onChange={(e) => handleChange('woonplaats', e.target.value)}
                        placeholder={t('offerte.step10.woonplaatsPlaceholder')}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">
                        {t('offerte.step10.email')}*
                        <span className="field-required">{t('offerte.required')}</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder={t('offerte.step10.emailPlaceholder')}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="telefoon">
                        {t('offerte.step10.telefoon')}*
                        <span className="field-required">{t('offerte.required')}</span>
                      </label>
                      <input
                        type="tel"
                        id="telefoon"
                        value={formData.telefoon}
                        onChange={(e) => handleChange('telefoon', e.target.value)}
                        placeholder="+31"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="opmerking">
                        {t('offerte.step10.opmerking')}
                        <span className="field-optional">{t('offerte.optional')}</span>
                      </label>
                      <textarea
                        id="opmerking"
                        value={formData.opmerking}
                        onChange={(e) => handleChange('opmerking', e.target.value)}
                        placeholder={t('offerte.step10.opmerkingPlaceholder')}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleBack} disabled={isSubmitting}>
                      ← {t('offerte.backButton')}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!formData.naam || !formData.straat || !formData.woonplaats || !formData.email || !formData.telefoon || isSubmitting}
                    >
                      {isSubmitting ? t('offerte.submitting') : t('offerte.submitButton')}
                    </button>
                  </div>

                  {/* Success/Error Notification */}
                  {submitStatus === 'success' && (
                    <div className="notification notification-success">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      <div>
                        <strong>{t('offerte.successTitle')}</strong>
                        <p>{t('offerte.successMessage')}</p>
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
                        <strong>{t('offerte.errorTitle')}</strong>
                        <p>{t('offerte.errorMessage')}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Progress Indicator */}
              <div className="progress-indicator">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  {t('offerte.step')} {currentStep} {t('offerte.of')} {totalSteps}
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
