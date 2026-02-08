import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import '../../styles/ProductPage.css'

export default function CubeVerandaPage() {
  const { t } = useTranslation()

  return (
    <div className="product-page">
      <Helmet>
        <title>{t('productPages.cube.title')} | VivaVerandas</title>
        <meta name="description" content={t('productPages.cube.description1')} />
        <link rel="canonical" href="https://vivaverandas.nl/producten/cube-veranda" />
        <meta property="og:title" content={`${t('productPages.cube.title')} | VivaVerandas`} />
        <meta property="og:description" content={t('productPages.cube.subtitle')} />
        <meta property="og:url" content="https://vivaverandas.nl/producten/cube-veranda" />
      </Helmet>

      <Header />

      <section className="product-hero">
        <div className="product-hero-bg">
          <img src="/cube-veranda.webp" alt={t('productPages.cube.heroAlt')} />
        </div>
        <div className="container product-hero-content">
          <h1>{t('productPages.cube.title')}</h1>
          <p>{t('productPages.cube.subtitle')}</p>
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
              <span>{t('productPages.cube.experienceYears')}</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="pi pi-palette"></i>
              </div>
              <span>{t('productPages.cube.colorOptions')}</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="pi pi-verified"></i>
              </div>
              <span>{t('productPages.cube.specGuaranteeValue')}</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="pi pi-wrench"></i>
              </div>
              <span>{t('productPages.cube.serviceText')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="product-info">
        <div className="container">
          <div className="product-grid">
            <div className="product-content">
              <h2>{t('productPages.cube.mainTitle')}</h2>
              <p>{t('productPages.cube.description1')}</p>
              <p>{t('productPages.cube.description2')}</p>

              <h3>{t('productPages.cube.benefitsTitle')}</h3>
              <ul className="benefits-list">
                <li>{t('productPages.cube.benefit1')}</li>
                <li>{t('productPages.cube.benefit2')}</li>
                <li>{t('productPages.cube.benefit3')}</li>
                <li>{t('productPages.cube.benefit4')}</li>
                <li>{t('productPages.cube.benefit5')}</li>
                <li>{t('productPages.cube.benefit6')}</li>
                <li>{t('productPages.cube.benefit7')}</li>
              </ul>
            </div>
            <div className="product-image">
              <img src="/cube-Overkapping.webp" alt={t('productPages.cube.heroAlt')} />
            </div>
          </div>
        </div>
      </section>

      {/* What is section */}
      <section className="product-what-is">
        <div className="container">
          <div className="what-is-grid">
            <div className="what-is-image">
              <img src="/cube-vernda.png" alt={t('productPages.cube.title')} />
            </div>
            <div className="what-is-content">
              <h2>{t('productPages.cube.whatIsTitle')}</h2>
              <p>{t('productPages.cube.whatIsText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose section */}
      <section className="product-why-choose">
        <div className="container">
          <div className="why-choose-grid">
            <div className="why-choose-content">
              <h2>{t('productPages.cube.whyChooseTitle')}</h2>
              <p>{t('productPages.cube.whyChooseText')}</p>
            </div>
            <div className="why-choose-image">
              <img src="/cube-2.jpg" alt={t('productPages.cube.title')} />
            </div>
          </div>
        </div>
      </section>

      {/* Customize section */}
      <section className="product-customize">
        <div className="container">
          <div className="customize-grid">
            <div className="customize-image">
              <img src="/cube-veranda.webp" alt={t('productPages.cube.title')} />
            </div>
            <div className="customize-content">
              <h2>{t('productPages.cube.customizeTitle')}</h2>
              <p>{t('productPages.cube.customizeText')}</p>
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
              <p>{t('productPages.cube.specMaterial')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.cube.specRoof')}</h4>
              <p>{t('productPages.cube.specRoofValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.common.maxWidth')}</h4>
              <p>{t('productPages.cube.specWidthValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.cube.specDepth')}</h4>
              <p>{t('productPages.cube.specDepthValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.cube.specLighting')}</h4>
              <p>{t('productPages.cube.specLightingValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.common.guarantee')}</h4>
              <p>{t('productPages.cube.specGuaranteeValue')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation section */}
      <section className="product-installation">
        <div className="container">
          <div className="installation-grid">
            <div className="installation-content">
              <h2>{t('productPages.cube.installationTitle')}</h2>
              <p>{t('productPages.cube.installationText')}</p>
            </div>
            <div className="installation-image">
              <img src="/cube-Overkapping.webp" alt={t('productPages.cube.title')} />
            </div>
          </div>
        </div>
      </section>

      <section className="product-gallery">
        <div className="container">
          <h2>{t('productPages.common.projectGallery')}</h2>
          <div className="gallery-grid">
            <img src="/cube-veranda.webp" alt={`${t('productPages.cube.title')} 1`} />
            <img src="/cube-Overkapping.webp" alt={`${t('productPages.cube.title')} 2`} />
            <img src="/cube-vernda.png" alt={`${t('productPages.cube.title')} 3`} />
            <img src="/cube-2.jpg" alt={`${t('productPages.cube.title')} 4`} />
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="container">
          <h2>{t('productPages.common.interestedIn')} {t('productPages.cube.title')}?</h2>
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
