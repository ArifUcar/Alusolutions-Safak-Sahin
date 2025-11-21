import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/OffertePage.css'

interface FormData {
  locatie: string
  gootType: string
  dakType: string
  kleur: string
  breedte: string
  diepte: string
  naam: string
  email: string
  telefoon: string
  adres: string
  postcode: string
  woonplaats: string
  opmerking: string
}

export default function OffertePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 7

  const [formData, setFormData] = useState<FormData>({
    locatie: '',
    gootType: '',
    dakType: '',
    kleur: '',
    breedte: '',
    diepte: '',
    naam: '',
    email: '',
    telefoon: '',
    adres: '',
    postcode: '',
    woonplaats: '',
    opmerking: ''
  })

  const handleOptionSelect = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Bedankt voor uw offerte aanvraag! Wij nemen binnen 24 uur contact met u op.')
  }

  const stepImages = [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80'
  ]

  return (
    <div className="offerte-page">
      <Header />

      {/* Main Form Section */}
      <section className="offerte-main">
        <div className="offerte-container">
          {/* Left Image */}
          <div className="offerte-image">
            <img src={stepImages[currentStep - 1]} alt="Veranda voorbeeld" />
          </div>

          {/* Right Form */}
          <div className="offerte-form-wrapper">
            {/* Progress Bar */}
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Location */}
              {currentStep === 1 && (
                <div className="form-step">
                  <h2>Waar wilt u overkapping</h2>
                  <p className="step-label">Waar komt je overkapping*<span className="required">Verplicht</span></p>

                  <div className="option-cards">
                    <label className={`option-card ${formData.locatie === 'standaard' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="locatie"
                        value="standaard"
                        checked={formData.locatie === 'standaard'}
                        onChange={() => handleOptionSelect('locatie', 'standaard')}
                      />
                      <div className="option-content">
                        <strong>Standaard</strong>
                        <span>Bestaande muur</span>
                      </div>
                    </label>

                    <label className={`option-card ${formData.locatie === 'vrijstaand' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="locatie"
                        value="vrijstaand"
                        checked={formData.locatie === 'vrijstaand'}
                        onChange={() => handleOptionSelect('locatie', 'vrijstaand')}
                      />
                      <div className="option-content">
                        <strong>Vrijstaand</strong>
                        <span>Vrij in de tuin</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Gutter Type */}
              {currentStep === 2 && (
                <div className="form-step">
                  <h2>Welke Goot Type*</h2>
                  <p className="step-label">Kies uw goot type<span className="required">Verplicht</span></p>

                  <div className="option-cards">
                    <label className={`option-card with-image ${formData.gootType === 'halfrond' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gootType"
                        value="halfrond"
                        checked={formData.gootType === 'halfrond'}
                        onChange={() => handleOptionSelect('gootType', 'halfrond')}
                      />
                      <div className="option-content">
                        <strong>Halfronde Goot</strong>
                        <span>Klassiek Ontwerp</span>
                      </div>
                      <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=80" alt="Halfronde Goot" />
                    </label>

                    <label className={`option-card with-image ${formData.gootType === 'recht' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gootType"
                        value="recht"
                        checked={formData.gootType === 'recht'}
                        onChange={() => handleOptionSelect('gootType', 'recht')}
                      />
                      <div className="option-content">
                        <strong>Rechte Goot</strong>
                        <span>Moderne Afwerking</span>
                      </div>
                      <img src="https://images.unsplash.com/photo-1558618047-f4b511cc0c0b?w=100&q=80" alt="Rechte Goot" />
                    </label>
                  </div>
                </div>
              )}

              {/* Step 3: Roof Type */}
              {currentStep === 3 && (
                <div className="form-step">
                  <h2>Welk Dak Type*</h2>
                  <p className="step-label">Kies uw dak type<span className="required">Verplicht</span></p>

                  <div className="option-cards">
                    <label className={`option-card ${formData.dakType === 'polycarbonaat' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="dakType"
                        value="polycarbonaat"
                        checked={formData.dakType === 'polycarbonaat'}
                        onChange={() => handleOptionSelect('dakType', 'polycarbonaat')}
                      />
                      <div className="option-content">
                        <strong>Polycarbonaat</strong>
                        <span>Lichtdoorlatend & Duurzaam</span>
                      </div>
                    </label>

                    <label className={`option-card ${formData.dakType === 'glas' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="dakType"
                        value="glas"
                        checked={formData.dakType === 'glas'}
                        onChange={() => handleOptionSelect('dakType', 'glas')}
                      />
                      <div className="option-content">
                        <strong>Glas</strong>
                        <span>Maximale transparantie</span>
                      </div>
                    </label>

                    <label className={`option-card ${formData.dakType === 'lamellen' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="dakType"
                        value="lamellen"
                        checked={formData.dakType === 'lamellen'}
                        onChange={() => handleOptionSelect('dakType', 'lamellen')}
                      />
                      <div className="option-content">
                        <strong>Lamellen</strong>
                        <span>Verstelbare zonwering</span>
                      </div>
                    </label>

                    <label className={`option-card ${formData.dakType === 'vouwdak' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="dakType"
                        value="vouwdak"
                        checked={formData.dakType === 'vouwdak'}
                        onChange={() => handleOptionSelect('dakType', 'vouwdak')}
                      />
                      <div className="option-content">
                        <strong>Vouwdak</strong>
                        <span>Flexibel opvouwbaar</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Color */}
              {currentStep === 4 && (
                <div className="form-step">
                  <h2>Welke Kleur*</h2>
                  <p className="step-label">Kies uw gewenste kleur<span className="required">Verplicht</span></p>

                  <div className="color-options">
                    <label className={`color-option ${formData.kleur === 'antraciet' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="kleur"
                        value="antraciet"
                        checked={formData.kleur === 'antraciet'}
                        onChange={() => handleOptionSelect('kleur', 'antraciet')}
                      />
                      <div className="color-swatch" style={{ background: '#2c3e50' }}></div>
                      <span>Antraciet</span>
                    </label>

                    <label className={`color-option ${formData.kleur === 'wit' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="kleur"
                        value="wit"
                        checked={formData.kleur === 'wit'}
                        onChange={() => handleOptionSelect('kleur', 'wit')}
                      />
                      <div className="color-swatch" style={{ background: '#ffffff', border: '2px solid #ddd' }}></div>
                      <span>Wit</span>
                    </label>

                    <label className={`color-option ${formData.kleur === 'creme' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="kleur"
                        value="creme"
                        checked={formData.kleur === 'creme'}
                        onChange={() => handleOptionSelect('kleur', 'creme')}
                      />
                      <div className="color-swatch" style={{ background: '#f5f5dc' }}></div>
                      <span>Crème</span>
                    </label>

                    <label className={`color-option ${formData.kleur === 'zwart' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="kleur"
                        value="zwart"
                        checked={formData.kleur === 'zwart'}
                        onChange={() => handleOptionSelect('kleur', 'zwart')}
                      />
                      <div className="color-swatch" style={{ background: '#1a1a1a' }}></div>
                      <span>Zwart</span>
                    </label>

                    <label className={`color-option ${formData.kleur === 'grijs' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="kleur"
                        value="grijs"
                        checked={formData.kleur === 'grijs'}
                        onChange={() => handleOptionSelect('kleur', 'grijs')}
                      />
                      <div className="color-swatch" style={{ background: '#808080' }}></div>
                      <span>Grijs</span>
                    </label>

                    <label className={`color-option ${formData.kleur === 'ral' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="kleur"
                        value="ral"
                        checked={formData.kleur === 'ral'}
                        onChange={() => handleOptionSelect('kleur', 'ral')}
                      />
                      <div className="color-swatch ral-swatch"></div>
                      <span>RAL kleur</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 5: Dimensions */}
              {currentStep === 5 && (
                <div className="form-step">
                  <h2>Afmetingen</h2>
                  <p className="step-label">Vul de gewenste afmetingen in<span className="required">Verplicht</span></p>

                  <div className="dimension-inputs">
                    <div className="dimension-group">
                      <label htmlFor="breedte">Breedte (cm)*</label>
                      <input
                        type="number"
                        id="breedte"
                        name="breedte"
                        placeholder="Bijv. 400"
                        value={formData.breedte}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="dimension-group">
                      <label htmlFor="diepte">Diepte (cm)*</label>
                      <input
                        type="number"
                        id="diepte"
                        name="diepte"
                        placeholder="Bijv. 300"
                        value={formData.diepte}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="dimension-note">
                    <p>Weet u de exacte afmetingen niet? Geen probleem! Onze specialist meet alles gratis op bij u thuis.</p>
                  </div>
                </div>
              )}

              {/* Step 6: Personal Info */}
              {currentStep === 6 && (
                <div className="form-step">
                  <h2>Uw Gegevens</h2>
                  <p className="step-label">Vul uw contactgegevens in<span className="required">Verplicht</span></p>

                  <div className="personal-info-grid">
                    <div className="form-group">
                      <label htmlFor="naam">Naam*</label>
                      <input
                        type="text"
                        id="naam"
                        name="naam"
                        placeholder="Uw volledige naam"
                        value={formData.naam}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email*</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="uw@email.nl"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="telefoon">Telefoon*</label>
                      <input
                        type="tel"
                        id="telefoon"
                        name="telefoon"
                        placeholder="06 12345678"
                        value={formData.telefoon}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="adres">Adres</label>
                      <input
                        type="text"
                        id="adres"
                        name="adres"
                        placeholder="Straat en huisnummer"
                        value={formData.adres}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="postcode">Postcode</label>
                      <input
                        type="text"
                        id="postcode"
                        name="postcode"
                        placeholder="1234 AB"
                        value={formData.postcode}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="woonplaats">Woonplaats</label>
                      <input
                        type="text"
                        id="woonplaats"
                        name="woonplaats"
                        placeholder="Uw woonplaats"
                        value={formData.woonplaats}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Summary & Additional Info */}
              {currentStep === 7 && (
                <div className="form-step">
                  <h2>Aanvullende Informatie</h2>
                  <p className="step-label">Heeft u nog opmerkingen of vragen?</p>

                  <div className="summary-section">
                    <h3>Uw keuzes:</h3>
                    <ul className="summary-list">
                      <li><strong>Locatie:</strong> {formData.locatie || 'Niet geselecteerd'}</li>
                      <li><strong>Goot type:</strong> {formData.gootType || 'Niet geselecteerd'}</li>
                      <li><strong>Dak type:</strong> {formData.dakType || 'Niet geselecteerd'}</li>
                      <li><strong>Kleur:</strong> {formData.kleur || 'Niet geselecteerd'}</li>
                      <li><strong>Afmetingen:</strong> {formData.breedte && formData.diepte ? `${formData.breedte} x ${formData.diepte} cm` : 'Niet ingevuld'}</li>
                    </ul>
                  </div>

                  <div className="form-group">
                    <label htmlFor="opmerking">Opmerkingen</label>
                    <textarea
                      id="opmerking"
                      name="opmerking"
                      placeholder="Vertel ons meer over uw wensen of stel uw vragen..."
                      rows={4}
                      value={formData.opmerking}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {currentStep > 1 && (
                  <button type="button" className="btn-back" onClick={prevStep}>
                    <span>←</span>
                  </button>
                )}

                {currentStep < totalSteps ? (
                  <button type="button" className="btn-next" onClick={nextStep}>
                    Volgende <span>→</span>
                  </button>
                ) : (
                  <button type="submit" className="btn-submit">
                    Verstuur Aanvraag <span>→</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
