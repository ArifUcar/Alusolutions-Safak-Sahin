import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/AfspraakPage.css'

interface FormData {
  afspraakType: string
  datum: string
  tijd: string
  naam: string
  email: string
  telefoon: string
  adres: string
  postcode: string
  woonplaats: string
  opmerking: string
}

export default function AfspraakPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const [formData, setFormData] = useState<FormData>({
    afspraakType: '',
    datum: '',
    tijd: '',
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
    console.log('Afspraak submitted:', formData)
    alert('Bedankt voor uw afspraak! Wij nemen binnen 24 uur contact met u op ter bevestiging.')
  }

  const stepImages = [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80'
  ]

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
  ]

  return (
    <div className="afspraak-page">
      <Header />

      {/* Main Form Section */}
      <section className="afspraak-main">
        <div className="afspraak-container">
          {/* Left Image */}
          <div className="afspraak-image">
            <img src={stepImages[currentStep - 1]} alt="Showroom" />
          </div>

          {/* Right Form */}
          <div className="afspraak-form-wrapper">
            {/* Progress Bar */}
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Appointment Type */}
              {currentStep === 1 && (
                <div className="form-step">
                  <h2>Type Afspraak</h2>
                  <p className="step-label">Wat voor soort afspraak wilt u maken?<span className="required">Verplicht</span></p>

                  <div className="option-cards">
                    <label className={`option-card ${formData.afspraakType === 'showroom' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="afspraakType"
                        value="showroom"
                        checked={formData.afspraakType === 'showroom'}
                        onChange={() => handleOptionSelect('afspraakType', 'showroom')}
                      />
                      <div className="option-content">
                        <strong>Showroom Bezoek</strong>
                        <span>Bekijk onze veranda's in onze showroom</span>
                      </div>
                    </label>

                    <label className={`option-card ${formData.afspraakType === 'thuisbezoek' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="afspraakType"
                        value="thuisbezoek"
                        checked={formData.afspraakType === 'thuisbezoek'}
                        onChange={() => handleOptionSelect('afspraakType', 'thuisbezoek')}
                      />
                      <div className="option-content">
                        <strong>Thuisbezoek</strong>
                        <span>Gratis inmeten en advies bij u thuis</span>
                      </div>
                    </label>

                    <label className={`option-card ${formData.afspraakType === 'advies' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="afspraakType"
                        value="advies"
                        checked={formData.afspraakType === 'advies'}
                        onChange={() => handleOptionSelect('afspraakType', 'advies')}
                      />
                      <div className="option-content">
                        <strong>Adviesgesprek</strong>
                        <span>Telefonisch of video adviesgesprek</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {currentStep === 2 && (
                <div className="form-step">
                  <h2>Datum & Tijd</h2>
                  <p className="step-label">Kies uw gewenste datum en tijd<span className="required">Verplicht</span></p>

                  <div className="datetime-section">
                    <div className="form-group">
                      <label htmlFor="datum">Datum*</label>
                      <input
                        type="date"
                        id="datum"
                        name="datum"
                        value={formData.datum}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="time-slots">
                      <label>Tijd*</label>
                      <div className="slots-grid">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            className={`time-slot ${formData.tijd === time ? 'selected' : ''}`}
                            onClick={() => handleOptionSelect('tijd', time)}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="availability-note">
                    <p>📅 Wij zijn geopend: Ma-Do 09:00-17:00, Za 10:00-15:00</p>
                  </div>
                </div>
              )}

              {/* Step 3: Personal Info */}
              {currentStep === 3 && (
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

              {/* Step 4: Summary */}
              {currentStep === 4 && (
                <div className="form-step">
                  <h2>Bevestiging</h2>
                  <p className="step-label">Controleer uw afspraak gegevens</p>

                  <div className="summary-section">
                    <h3>Uw afspraak:</h3>
                    <ul className="summary-list">
                      <li><strong>Type:</strong> {formData.afspraakType || 'Niet geselecteerd'}</li>
                      <li><strong>Datum:</strong> {formData.datum || 'Niet geselecteerd'}</li>
                      <li><strong>Tijd:</strong> {formData.tijd || 'Niet geselecteerd'}</li>
                      <li><strong>Naam:</strong> {formData.naam || 'Niet ingevuld'}</li>
                      <li><strong>Email:</strong> {formData.email || 'Niet ingevuld'}</li>
                      <li><strong>Telefoon:</strong> {formData.telefoon || 'Niet ingevuld'}</li>
                    </ul>
                  </div>

                  <div className="form-group">
                    <label htmlFor="opmerking">Opmerkingen</label>
                    <textarea
                      id="opmerking"
                      name="opmerking"
                      placeholder="Heeft u nog vragen of opmerkingen?"
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
                    Bevestig Afspraak <span>→</span>
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
