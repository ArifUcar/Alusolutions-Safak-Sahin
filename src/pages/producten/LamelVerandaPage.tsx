import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import '../../styles/ProductPage.css'

export default function LamelVerandaPage() {
  const { t } = useTranslation()

  return (
    <div className="product-page">
      <Helmet>
        <title>{t('productPages.lamel.title')} | VivaVerandas</title>
        <meta name="description" content={t('productPages.lamel.description1')} />
        <link rel="canonical" href="https://vivaverandas.nl/producten/lamel-veranda" />
        <meta property="og:title" content={`${t('productPages.lamel.title')} | VivaVerandas`} />
        <meta property="og:description" content={t('productPages.lamel.subtitle')} />
        <meta property="og:url" content="https://vivaverandas.nl/producten/lamel-veranda" />
      </Helmet>

      <Header />

      <section className="product-hero">
        <div className="product-hero-bg">
          <img src="/lamellen-overkapping.webp" alt={t('productPages.lamel.heroAlt')} />
        </div>
        <div className="container product-hero-content">
          <h1>{t('productPages.lamel.title')}</h1>
          <p>{t('productPages.lamel.subtitle')}</p>
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
              <span>{t('productPages.lamel.experienceYears')}</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="pi pi-palette"></i>
              </div>
              <span>{t('productPages.lamel.colorOptions')}</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="pi pi-verified"></i>
              </div>
              <span>{t('productPages.lamel.specGuaranteeValue')}</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="pi pi-wrench"></i>
              </div>
              <span>{t('productPages.lamel.serviceText')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="product-info">
        <div className="container">
          <div className="product-grid">
            <div className="product-content">
              <h2>{t('productPages.lamel.mainTitle')}</h2>
              <p>{t('productPages.lamel.description1')}</p>
              <p>{t('productPages.lamel.description2')}</p>

              <h3>{t('productPages.lamel.benefitsTitle')}</h3>
              <ul className="benefits-list">
                <li>{t('productPages.lamel.benefit1')}</li>
                <li>{t('productPages.lamel.benefit2')}</li>
                <li>{t('productPages.lamel.benefit3')}</li>
                <li>{t('productPages.lamel.benefit4')}</li>
                <li>{t('productPages.lamel.benefit5')}</li>
                <li>{t('productPages.lamel.benefit6')}</li>
                <li>{t('productPages.lamel.benefit7')}</li>
              </ul>
            </div>
            <div className="product-image">
              <img src="/Lamellen-dak-open.webp" alt={t('productPages.lamel.heroAlt')} />
            </div>
          </div>
        </div>
      </section>

      {/* What is section */}
      <section className="product-what-is">
        <div className="container">
          <div className="what-is-grid">
            <div className="what-is-image">
              <img src="/LAmellen-veranda-afstandbediening.webp" alt={t('productPages.lamel.title')} />
            </div>
            <div className="what-is-content">
              <h2>{t('productPages.lamel.whatIsTitle')}</h2>
              <p>{t('productPages.lamel.whatIsText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose section */}
      <section className="product-why-choose">
        <div className="container">
          <div className="why-choose-grid">
            <div className="why-choose-content">
              <h2>{t('productPages.lamel.whyChooseTitle')}</h2>
              <p>{t('productPages.lamel.whyChooseText')}</p>
            </div>
            <div className="why-choose-image">
              <img src="/LuxeLine-lamellendak-vrijstaand-dicht.webp" alt={t('productPages.lamel.title')} />
            </div>
          </div>
        </div>
      </section>

      {/* Customize section */}
      <section className="product-customize">
        <div className="container">
          <div className="customize-grid">
            <div className="customize-image">
              <img src="/lamellen-overkapping.webp" alt={t('productPages.lamel.title')} />
            </div>
            <div className="customize-content">
              <h2>{t('productPages.lamel.customizeTitle')}</h2>
              <p>{t('productPages.lamel.customizeText')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="product-specs">
        <div className="container">
          <h2>{t('productPages.common.specifications')}</h2>
          <div className="specs-grid">
            <div className="spec-item">
              <h4>{t('productPages.common.material')}</h4>
              <p>{t('productPages.lamel.specMaterial')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.lamel.specLamelSize')}</h4>
              <p>{t('productPages.lamel.specLamelSizeValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.common.maxWidth')}</h4>
              <p>{t('productPages.lamel.specWidthValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.lamel.specControl')}</h4>
              <p>{t('productPages.lamel.specControlValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.lamel.specSensors')}</h4>
              <p>{t('productPages.lamel.specSensorsValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.common.guarantee')}</h4>
              <p>{t('productPages.lamel.specGuaranteeValue')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation section */}
      <section className="product-installation">
        <div className="container">
          <div className="installation-grid">
            <div className="installation-content">
              <h2>{t('productPages.lamel.installationTitle')}</h2>
              <p>{t('productPages.lamel.installationText')}</p>
            </div>
            <div className="installation-image">
              <img src="/Lamellen-dak-open.webp" alt={t('productPages.lamel.title')} />
            </div>
          </div>
        </div>
      </section>

      {/* Affordable section */}
      <section className="product-affordable">
        <div className="container">
          <div className="affordable-content">
            <h2>{t('productPages.lamel.affordableTitle')}</h2>
            <p>{t('productPages.lamel.affordableText')}</p>
          </div>
        </div>
      </section>

      <section className="product-gallery">
        <div className="container">
          <h2>{t('productPages.common.projectGallery')}</h2>
          <div className="gallery-grid">
            <img src="/lamellen-overkapping.webp" alt={`${t('productPages.lamel.title')} 1`} />
            <img src="/Lamellen-dak-open.webp" alt={`${t('productPages.lamel.title')} 2`} />
            <img src="/LAmellen-veranda-afstandbediening.webp" alt={`${t('productPages.lamel.title')} 3`} />
            <img src="/LuxeLine-lamellendak-vrijstaand-dicht.webp" alt={`${t('productPages.lamel.title')} 4`} />
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="container">
          <h2>{t('productPages.common.interestedIn')} {t('productPages.lamel.title')}?</h2>
          <p>{t('productPages.common.requestQuoteSubtitle')}</p>
          <div className="cta-buttons">
            <Link to="/afspraak" className="btn btn-primary btn-large">{t('productPages.common.requestQuote')}</Link>
            <a href="tel:+31773902201" className="btn btn-secondary btn-large">{t('productPages.common.callUs')}</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
