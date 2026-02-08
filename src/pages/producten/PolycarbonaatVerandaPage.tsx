import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import '../../styles/ProductPage.css'

export default function PolycarbonaatVerandaPage() {
  const { t } = useTranslation()

  return (
    <div className="product-page">
      <Helmet>
        <title>{t('productPages.polycarbonaat.title')} | VivaVerandas</title>
        <meta name="description" content={t('productPages.polycarbonaat.description1')} />
        <link rel="canonical" href="https://vivaverandas.nl/producten/polycarbonaat-veranda" />
        <meta property="og:title" content={`${t('productPages.polycarbonaat.title')} | VivaVerandas`} />
        <meta property="og:description" content={t('productPages.polycarbonaat.subtitle')} />
        <meta property="og:url" content="https://vivaverandas.nl/producten/polycarbonaat-veranda" />
      </Helmet>

      <Header />

      <section className="product-hero">
        <div className="product-hero-bg">
          <img src="/polikarbonat/polikarbonat-veranda.png" alt={t('productPages.polycarbonaat.heroAlt')} />
        </div>
        <div className="container product-hero-content">
          <h1>{t('productPages.polycarbonaat.title')}</h1>
          <p>{t('productPages.polycarbonaat.subtitle')}</p>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="product-highlights">
        <div className="container">
          <div className="highlights-grid">
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="pi pi-calendar"></i>
              </div>
              <span>{t('productPages.polycarbonaat.experienceYears')}</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="pi pi-palette"></i>
              </div>
              <span>{t('productPages.polycarbonaat.colorOptions')}</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="pi pi-verified"></i>
              </div>
              <span>{t('productPages.polycarbonaat.specGuaranteeValue')}</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="pi pi-wrench"></i>
              </div>
              <span>{t('productPages.polycarbonaat.serviceText')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="product-info">
        <div className="container">
          <div className="product-grid">
            <div className="product-content">
              <h2>{t('productPages.polycarbonaat.mainTitle')}</h2>
              <p>{t('productPages.polycarbonaat.description1')}</p>
              <p>{t('productPages.polycarbonaat.description2')}</p>

              <h3>{t('productPages.polycarbonaat.benefitsTitle')}</h3>
              <ul className="benefits-list">
                <li>{t('productPages.polycarbonaat.benefit1')}</li>
                <li>{t('productPages.polycarbonaat.benefit2')}</li>
                <li>{t('productPages.polycarbonaat.benefit3')}</li>
                <li>{t('productPages.polycarbonaat.benefit4')}</li>
                <li>{t('productPages.polycarbonaat.benefit5')}</li>
                <li>{t('productPages.polycarbonaat.benefit6')}</li>
                <li>{t('productPages.polycarbonaat.benefit7')}</li>
              </ul>
            </div>
            <div className="product-image">
              <img src="/polikarbonat/polikarbonat-verdana-2.jpg" alt={t('productPages.polycarbonaat.heroAlt')} />
            </div>
          </div>
        </div>
      </section>

      {/* What is section */}
      <section className="product-what-is">
        <div className="container">
          <div className="what-is-grid">
            <div className="what-is-image">
              <img src="/polikarbonat/polikarbonat-veranda.png" alt={t('productPages.polycarbonaat.title')} />
            </div>
            <div className="what-is-content">
              <h2>{t('productPages.polycarbonaat.whatIsTitle')}</h2>
              <p>{t('productPages.polycarbonaat.whatIsText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose section */}
      <section className="product-why-choose">
        <div className="container">
          <div className="why-choose-grid">
            <div className="why-choose-content">
              <h2>{t('productPages.polycarbonaat.whyChooseTitle')}</h2>
              <p>{t('productPages.polycarbonaat.whyChooseText')}</p>
            </div>
            <div className="why-choose-image">
              <img src="/Overkapping-met-spie.webp" alt={t('productPages.polycarbonaat.title')} />
            </div>
          </div>
        </div>
      </section>

      {/* Customize section */}
      <section className="product-customize">
        <div className="container">
          <div className="customize-grid">
            <div className="customize-image">
              <img src="/polikarbonat/polikarbonat-veranda-3.jpg" alt={t('productPages.polycarbonaat.title')} />
            </div>
            <div className="customize-content">
              <h2>{t('productPages.polycarbonaat.customizeTitle')}</h2>
              <p>{t('productPages.polycarbonaat.customizeText')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="product-specs">
        <div className="container">
          <h2>{t('productPages.common.specifications')}</h2>
          <div className="specs-grid">
            <div className="spec-item">
              <h4>{t('productPages.polycarbonaat.specFrame')}</h4>
              <p>{t('productPages.polycarbonaat.specFrameValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.polycarbonaat.specPanels')}</h4>
              <p>{t('productPages.polycarbonaat.specPanelsValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.polycarbonaat.specColors')}</h4>
              <p>{t('productPages.polycarbonaat.specColorsValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.common.maxWidth')}</h4>
              <p>{t('productPages.polycarbonaat.specWidthValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.polycarbonaat.specInsulation')}</h4>
              <p>{t('productPages.polycarbonaat.specInsulationValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.common.guarantee')}</h4>
              <p>{t('productPages.polycarbonaat.specGuaranteeValue')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation section */}
      <section className="product-installation">
        <div className="container">
          <div className="installation-grid">
            <div className="installation-content">
              <h2>{t('productPages.polycarbonaat.installationTitle')}</h2>
              <p>{t('productPages.polycarbonaat.installationText')}</p>
            </div>
            <div className="installation-image">
              <img src="/Overkapping-met-spie.webp" alt={t('productPages.polycarbonaat.title')} />
            </div>
          </div>
        </div>
      </section>

      {/* Affordable section */}
      <section className="product-affordable">
        <div className="container">
          <div className="affordable-content">
            <h2>{t('productPages.polycarbonaat.affordableTitle')}</h2>
            <p>{t('productPages.polycarbonaat.affordableText')}</p>
          </div>
        </div>
      </section>

      <section className="product-gallery">
        <div className="container">
          <h2>{t('productPages.common.projectGallery')}</h2>
          <div className="gallery-grid">
            <img src="/polikarbonat/polikarbonat-veranda.png" alt={`${t('productPages.polycarbonaat.title')} 1`} />
            <img src="/polikarbonat/polikarbonat-verdana-2.jpg" alt={`${t('productPages.polycarbonaat.title')} 2`} />
            <img src="/polikarbonat/polikarbonat-veranda-3.jpg" alt={`${t('productPages.polycarbonaat.title')} 3`} />
            <img src="/Overkapping-Helder-poly.webp" alt={`${t('productPages.polycarbonaat.title')} 4`} />
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="container">
          <h2>{t('productPages.common.interestedIn')} {t('productPages.polycarbonaat.title')}?</h2>
          <p>{t('productPages.common.requestQuoteSubtitle')}</p>
          <div className="cta-buttons">
            <Link to="/offerte/polycarbonaat-veranda-configurator" className="btn btn-primary btn-large">{t('productPages.common.requestQuote')}</Link>
            <a href="tel:+31773902201" className="btn btn-secondary btn-large">{t('productPages.common.callUs')}</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
