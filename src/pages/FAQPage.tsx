import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/FAQPage.css'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { q: "Hoe lang duurt de levering van een veranda?", a: "De gemiddelde levertijd is 3-4 weken na het plaatsen van uw bestelling. Dit kan variëren afhankelijk van het type veranda en eventuele maatwerk opties." },
    { q: "Wat kost een veranda?", a: "De prijs van een veranda hangt af van het type, de afmetingen en de gekozen opties. Vraag vrijblijvend een offerte aan voor een exacte prijsopgave." },
    { q: "Hoelang duurt de montage?", a: "De montage duurt gemiddeld 1-2 dagen, afhankelijk van de grootte en complexiteit van de veranda." },
    { q: "Is er garantie op de veranda?", a: "Ja, wij bieden 10 jaar garantie op de constructie en 5 jaar op bewegende delen zoals motoren." },
    { q: "Heb ik een vergunning nodig?", a: "In de meeste gevallen is een veranda vergunningsvrij mits deze voldoet aan bepaalde voorwaarden. Wij adviseren u hierover tijdens het adviesgesprek." },
    { q: "Kan ik de veranda zelf plaatsen?", a: "Wij raden aan om de montage door onze vakmensen te laten uitvoeren voor optimaal resultaat en behoud van garantie." },
    { q: "Welke kleuren zijn beschikbaar?", a: "Onze veranda's zijn leverbaar in vele standaardkleuren. Daarnaast is elke RAL kleur mogelijk als maatwerk optie." },
    { q: "Kan ik verlichting en verwarming toevoegen?", a: "Ja, wij bieden diverse opties voor ingebouwde LED-verlichting en terrasverwarming." },
    { q: "Hoe onderhoud ik mijn veranda?", a: "Een aluminium veranda is vrijwel onderhoudsvrij. Af en toe reinigen met water en een zachte doek volstaat." },
    { q: "Komen jullie ook bij mij in de buurt?", a: "Wij plaatsen veranda's door heel Nederland. Neem contact op om te bespreken wat de mogelijkheden zijn." }
  ]

  return (
    <div className="faq-page">
      <Header />
      <section className="faq-hero">
        <div className="container">
          <h1>Veelgestelde Vragen</h1>
          <p>Vind antwoorden op de meest gestelde vragen</p>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                  {faq.q}
                  <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                </button>
                {openIndex === index && <div className="faq-answer"><p>{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-cta">
        <div className="container">
          <h2>Staat uw vraag er niet bij?</h2>
          <p>Neem gerust contact met ons op</p>
          <a href="/contact" className="btn btn-primary btn-large">Contact opnemen</a>
        </div>
      </section>
      <Footer />
    </div>
  )
}
