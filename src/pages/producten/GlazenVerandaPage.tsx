import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import '../../styles/ProductPage.css'

export default function GlazenVerandaPage() {
  const { t } = useTranslation()

  return (
    <div className="product-page">
      <Helmet>
        <title>{t('productPages.glazen.title')} | VivaVerandas</title>
        <meta name="description" content={t('productPages.glazen.description1')} />
        <link rel="canonical" href="https://vivaverandas.nl/producten/glazen-veranda" />
        <meta property="og:title" content={`${t('productPages.glazen.title')} | VivaVerandas`} />
        <meta property="og:description" content={t('productPages.glazen.subtitle')} />
        <meta property="og:url" content="https://vivaverandas.nl/producten/glazen-veranda" />
      </Helmet>

      <Header />

      <section className="product-hero">
        <div className="product-hero-bg">
          <img src="/Glazen-Overkapping.webp" alt={t('productPages.glazen.heroAlt')} />
        </div>
        <div className="container product-hero-content">
          <h1>{t('productPages.glazen.title')}</h1>
          <p>{t('productPages.glazen.subtitle')}</p>
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
              <span>{t('productPages.glazen.experienceYears')}</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="pi pi-palette"></i>
              </div>
              <span>{t('productPages.glazen.colorOptions')}</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="pi pi-verified"></i>
              </div>
              <span>{t('productPages.glazen.specGuaranteeValue')}</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <i className="pi pi-wrench"></i>
              </div>
              <span>{t('productPages.glazen.serviceText')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="product-info">
        <div className="container">
          <div className="product-grid">
            <div className="product-content">
              <h2>{t('productPages.glazen.mainTitle')}</h2>
              <p>{t('productPages.glazen.description1')}</p>
              <p>{t('productPages.glazen.description2')}</p>

              <h3>{t('productPages.glazen.benefitsTitle')}</h3>
              <ul className="benefits-list">
                <li>{t('productPages.glazen.benefit1')}</li>
                <li>{t('productPages.glazen.benefit2')}</li>
                <li>{t('productPages.glazen.benefit3')}</li>
                <li>{t('productPages.glazen.benefit4')}</li>
                <li>{t('productPages.glazen.benefit5')}</li>
                <li>{t('productPages.glazen.benefit6')}</li>
                <li>{t('productPages.glazen.benefit7')}</li>
              </ul>
            </div>
            <div className="product-image">
              <img src="/glasLux-home.webp" alt={t('productPages.glazen.heroAlt')} />
            </div>
          </div>
        </div>
      </section>

      {/* What is section */}
      <section className="product-what-is">
        <div className="container">
          <div className="what-is-grid">
            <div className="what-is-image">
              <img src="/Glazendak-cremewit-1.webp" alt={t('productPages.glazen.title')} />
            </div>
            <div className="what-is-content">
              <h2>{t('productPages.glazen.whatIsTitle')}</h2>
              <p>{t('productPages.glazen.whatIsText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose section */}
      <section className="product-why-choose">
        <div className="container">
          <div className="why-choose-grid">
            <div className="why-choose-content">
              <h2>{t('productPages.glazen.whyChooseTitle')}</h2>
              <p>{t('productPages.glazen.whyChooseText')}</p>
            </div>
            <div className="why-choose-image">
              <img src="/Tuinkamer-met-glazenschuifwanden-r96cf3vfsj301y31nv8v88rmlr026cvk5ly402n4i0.webp" alt={t('productPages.glazen.title')} />
            </div>
          </div>
        </div>
      </section>

      {/* Customize section */}
      <section className="product-customize">
        <div className="container">
          <div className="customize-grid">
            <div className="customize-image">
              <img src="/Glazen-Overkapping.webp" alt={t('productPages.glazen.title')} />
            </div>
            <div className="customize-content">
              <h2>{t('productPages.glazen.customizeTitle')}</h2>
              <p>{t('productPages.glazen.customizeText')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="product-specs">
        <div className="container">
          <h2>{t('productPages.common.specifications')}</h2>
          <div className="specs-grid">
            <div className="spec-item">
              <h4>{t('productPages.glazen.specFrame')}</h4>
              <p>{t('productPages.glazen.specFrameValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.glazen.specGlassType')}</h4>
              <p>{t('productPages.glazen.specGlassTypeValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.glazen.specOptions')}</h4>
              <p>{t('productPages.glazen.specOptionsValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.common.maxWidth')}</h4>
              <p>{t('productPages.glazen.specWidthValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.glazen.specDrainage')}</h4>
              <p>{t('productPages.glazen.specDrainageValue')}</p>
            </div>
            <div className="spec-item">
              <h4>{t('productPages.common.guarantee')}</h4>
              <p>{t('productPages.glazen.specGuaranteeValue')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation section */}
      <section className="product-installation">
        <div className="container">
          <div className="installation-grid">
            <div className="installation-content">
              <h2>{t('productPages.glazen.installationTitle')}</h2>
              <p>{t('productPages.glazen.installationText')}</p>
            </div>
            <div className="installation-image">
              <img src="/glasLux-home.webp" alt={t('productPages.glazen.title')} />
            </div>
          </div>
        </div>
      </section>

      <section className="product-gallery">
        <div className="container">
          <h2>{t('productPages.common.projectGallery')}</h2>
          <div className="gallery-grid">
            <img src="/Glazen-Overkapping.webp" alt={`${t('productPages.glazen.title')} 1`} />
            <img src="/glasLux-home.webp" alt={`${t('productPages.glazen.title')} 2`} />
            <img src="/Glazendak-cremewit-1.webp" alt={`${t('productPages.glazen.title')} 3`} />
            <img src="/Tuinkamer-met-glazenschuifwanden-r96cf3vfsj301y31nv8v88rmlr026cvk5ly402n4i0.webp" alt={`${t('productPages.glazen.title')} 4`} />
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="container">
          <h2>{t('productPages.common.interestedIn')} {t('productPages.glazen.title')}?</h2>
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
