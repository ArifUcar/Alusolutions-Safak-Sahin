import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import type { MenuItem, MenuItemCommandEvent } from 'primereact/menuitem'
import { useTheme } from '../context/ThemeContext'
import { supabase } from '../lib/supabase'
import { LogoIcon } from './Logo'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import '../styles/Header.css'

interface Configurator {
  id: string
  slug: string
  name: Record<string, string>
  icon: string | null
  is_active: boolean
}

export default function Header() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [configurators, setConfigurators] = useState<Configurator[]>([])
  const langMenuRef = useRef<Menu>(null)

  // Load active configurators
  useEffect(() => {
    const loadConfigurators = async () => {
      const { data } = await supabase
        .from('configurators')
        .select('id, slug, name, icon, is_active')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (data) {
        setConfigurators(data)
      }
    }
    loadConfigurators()
  }, [])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const languageOptions = [
    {
      label: '🇳🇱 Nederlands',
      command: () => changeLanguage('nl')
    },
    {
      label: '🇬🇧 English',
      command: () => changeLanguage('en')
    },
    {
      label: '🇩🇪 Deutsch',
      command: () => changeLanguage('de')
    }
  ]

// Build configurator menu items dynamically
  const configuratorItems: MenuItem[] = configurators.map(config => ({
    label: config.name[i18n.language] || config.name['nl'] || config.slug,
    icon: config.icon || 'pi pi-cog',
    command: () => navigate(`/offerte/${config.slug}`)
  }))

  const menuItems: MenuItem[] = [
    {
      label: t('header.products'),
      icon: 'pi pi-th-large',
      items: [
        {
          label: t('header.polycarbonaatVeranda'),
          icon: 'pi pi-sun',
          command: () => navigate('/producten/polycarbonaat-veranda')
        },
        {
          label: t('header.glazenVeranda'),
          icon: 'pi pi-window-maximize',
          command: () => navigate('/producten/glazen-veranda')
        },
        {
          label: t('header.lamelVeranda'),
          icon: 'pi pi-bars',
          command: () => navigate('/producten/lamel-veranda')
        },
        {
          label: t('header.cubeVeranda'),
          icon: 'pi pi-box',
          command: () => navigate('/producten/cube-veranda')
        }
      ]
    },
    {
      label: t('header.about'),
      icon: 'pi pi-info-circle',
      command: () => navigate('/over-ons')
    },
    {
      label: t('header.inspiration'),
      icon: 'pi pi-images',
      items: [
        {
          label: t('header.projectGallery'),
          icon: 'pi pi-image',
          command: () => navigate('/inspiratie')
        },
        {
          label: t('header.blogsTips'),
          icon: 'pi pi-book',
          command: () => navigate('/blog')
        }
      ]
    },
    {
      label: t('header.requestQuote'),
      icon: 'pi pi-file-edit',
      items: [
        {
          label: t('offerte.chooseProduct'),
          icon: 'pi pi-list',
          command: () => navigate('/offerte')
        },
        { separator: true },
        ...configuratorItems,
        ...(configuratorItems.length > 0 ? [{ separator: true }] : []),
        {
          label: t('header.makeAppointment'),
          icon: 'pi pi-calendar',
          command: () => navigate('/afspraak')
        },
        {
          label: t('header.callDirect'),
          icon: 'pi pi-phone',
          command: () => window.location.href = 'tel:+31773902201'
        }
      ]
    },
    {
      label: t('header.contact'),
      icon: 'pi pi-envelope',
      items: [
        {
          label: t('header.contactForm'),
          icon: 'pi pi-send',
          command: () => navigate('/contact')
        },
        {
          label: t('header.visitShowroom'),
          icon: 'pi pi-map-marker',
          command: () => navigate('/showroom')
        },
        {
          label: t('header.faq'),
          icon: 'pi pi-question-circle',
          command: () => navigate('/faq')
        }
      ]
    },
    {
      label: t('header.plateReplace'),
      icon: 'pi pi-sync',
      command: () => navigate('/offerte-polycarbonaat-platen-wisselen')
    }
  ]

  const start = (
    <Link to="/" className="logo-link">
      <div className="logo">
        <div className="logo-icon">
          <LogoIcon />
        </div>
        <div className="logo-text">
          <h1>
            <span className="logo-viva">Viva</span>
            <span className="logo-verandas">Verandas</span>
          </h1>
        </div>
      </div>
    </Link>
  )

  const end = (
    <div className="header-actions">
      <Button
        label={t('header.makeAppointment')}
        icon="pi pi-calendar-plus"
        className="p-button-success p-button-rounded cta-button"
        onClick={() => navigate('/afspraak')}
      />

      <Menu model={languageOptions} popup ref={langMenuRef} />
      <Button
        icon="pi pi-globe"
        className="p-button-text p-button-rounded lang-toggle"
        onClick={(e) => langMenuRef.current?.toggle(e)}
        tooltip={i18n.language.toUpperCase()}
        tooltipOptions={{ position: 'bottom' }}
      />

      <Button
        icon={theme === 'light' ? 'pi pi-moon' : 'pi pi-sun'}
        className="p-button-text p-button-rounded theme-toggle"
        onClick={toggleTheme}
        tooltip={theme === 'light' ? t('header.darkMode') : t('header.lightMode')}
        tooltipOptions={{ position: 'bottom' }}
      />

      <Button
        icon={theme === 'light' ? 'pi pi-moon' : 'pi pi-sun'}
        className="p-button-text p-button-rounded mobile-theme-toggle"
        onClick={toggleTheme}
      />

      <Button
        icon="pi pi-bars"
        className="p-button-text p-button-rounded mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(true)}
      />
    </div>
  )

  return (
    <>
      <header className="main-header">
        <Menubar model={menuItems} start={start} end={end} className="custom-menubar" />
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
            {/* Header with close button */}
            <div className="mobile-menu-header">
              <div className="mobile-menu-logo">
                <div className="mobile-logo-icon">
                  <LogoIcon />
                </div>
                <div className="mobile-logo-text">
                  <h2>
                    <span className="logo-viva">Viva</span>
                    <span className="logo-verandas">Verandas</span>
                  </h2>
                </div>
              </div>
              <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
                <i className="pi pi-times"></i>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="mobile-menu-nav">
              {menuItems.map((item, index) => (
                <div key={index} className="mobile-nav-item">
                  {item.items ? (
                    <>
                      <div className="mobile-nav-group-title">
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                      </div>
                      <div className="mobile-nav-subitems">
                        {item.items.map((subItem: MenuItem, subIndex: number) => (
                          subItem.separator ? (
                            <div key={subIndex} className="mobile-nav-separator"></div>
                          ) : subItem.items ? (
                            <div key={subIndex} className="mobile-nav-subgroup">
                              <div className="mobile-nav-subgroup-title">{subItem.label}</div>
                              {subItem.items.map((subSubItem: MenuItem, subSubIndex: number) => (
                                <button
                                  key={subSubIndex}
                                  className="mobile-nav-link mobile-nav-link-nested"
                                  onClick={() => {
                                    if (subSubItem.command) subSubItem.command({} as MenuItemCommandEvent)
                                    setMobileMenuOpen(false)
                                  }}
                                >
                                  <i className={subSubItem.icon}></i>
                                  <span>{subSubItem.label}</span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <button
                              key={subIndex}
                              className="mobile-nav-link"
                              onClick={() => {
                                if (subItem.command) subItem.command({} as MenuItemCommandEvent)
                                setMobileMenuOpen(false)
                              }}
                            >
                              <i className={subItem.icon}></i>
                              <span>{subItem.label}</span>
                            </button>
                          )
                        ))}
                      </div>
                    </>
                  ) : (
                    <button
                      className="mobile-nav-link mobile-nav-link-main"
                      onClick={() => {
                        if (item.command) item.command({} as MenuItemCommandEvent)
                        setMobileMenuOpen(false)
                      }}
                    >
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                    </button>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="mobile-menu-cta">
              <button
                className="mobile-cta-button"
                onClick={() => {
                  navigate('/afspraak')
                  setMobileMenuOpen(false)
                }}
              >
                <i className="pi pi-calendar-plus"></i>
                <span>{t('header.makeAppointment')}</span>
              </button>
            </div>

            {/* Footer Actions */}
            <div className="mobile-menu-footer">
              <div className="mobile-lang-selector">
                <button
                  className={`mobile-lang-btn ${i18n.language === 'nl' ? 'active' : ''}`}
                  onClick={() => changeLanguage('nl')}
                >
                  NL
                </button>
                <button
                  className={`mobile-lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                  onClick={() => changeLanguage('en')}
                >
                  EN
                </button>
                <button
                  className={`mobile-lang-btn ${i18n.language === 'de' ? 'active' : ''}`}
                  onClick={() => changeLanguage('de')}
                >
                  DE
                </button>
              </div>
              <button
                className="mobile-footer-btn"
                onClick={toggleTheme}
              >
                <i className={theme === 'light' ? 'pi pi-moon' : 'pi pi-sun'}></i>
                <span>{theme === 'light' ? t('header.darkMode') : t('header.lightMode')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
