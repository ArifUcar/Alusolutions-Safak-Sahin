import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { Sidebar } from 'primereact/sidebar'
import type { MenuItem } from 'primereact/menuitem'
import { useTheme } from '../context/ThemeContext'
import { supabase } from '../lib/supabase'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import '../styles/Header.css'

interface Configurator {
  id: string
  slug: string
  name: Record<string, string>
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
        .select('id, slug, name, is_active')
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
      label: '🇹🇷 Türkçe',
      command: () => changeLanguage('tr')
    },
    {
      label: '🇩🇪 Deutsch',
      command: () => changeLanguage('de')
    },
    {
      label: '🇫🇷 Français',
      command: () => changeLanguage('fr')
    },
    {
      label: '🇮🇹 Italiano',
      command: () => changeLanguage('it')
    }
  ]

  // Build configurator menu items dynamically
  const configuratorItems: MenuItem[] = configurators.map(config => ({
    label: config.name[i18n.language] || config.name['nl'] || config.slug,
    icon: 'pi pi-cog',
    command: () => navigate(`/offerte/${config.slug}`)
  }))

  const menuItems: MenuItem[] = [
    {
      label: t('header.services'),
      icon: 'pi pi-th-large',
      items: [
        {
          label: t('header.verandas'),
          icon: 'pi pi-home',
          items: [
            {
              label: t('products.polycarbonaat'),
              icon: 'pi pi-box',
              command: () => navigate('/producten/polycarbonaat')
            },
            {
              label: t('products.glazen'),
              icon: 'pi pi-sparkles',
              command: () => navigate('/producten/glazen')
            },
            {
              label: t('products.lamellen'),
              icon: 'pi pi-bars',
              command: () => navigate('/producten/lamellen')
            },
            {
              label: t('products.vouwdak'),
              icon: 'pi pi-chevron-up',
              command: () => navigate('/producten/vouwdak')
            }
          ]
        },
        {
          separator: true
        },
        {
          label: t('header.other'),
          icon: 'pi pi-palette',
          items: [
            {
              label: t('products.schuifwand'),
              icon: 'pi pi-arrows-h',
              command: () => navigate('/producten/schuifwand')
            },
            {
              label: t('products.cube'),
              icon: 'pi pi-stop',
              command: () => navigate('/producten/cube')
            },
            {
              label: t('products.tuinkamer'),
              icon: 'pi pi-building',
              command: () => navigate('/producten/tuinkamer')
            },
            {
              label: t('products.carport'),
              icon: 'pi pi-car',
              command: () => navigate('/producten/carport')
            }
          ]
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
          label: t('header.beforeAfter'),
          icon: 'pi pi-replay',
          command: () => navigate('/inspiratie')
        },
        {
          label: t('header.styles'),
          icon: 'pi pi-palette',
          command: () => navigate('/inspiratie')
        },
        {
          label: t('header.blogsTips'),
          icon: 'pi pi-book',
          command: () => navigate('/contact')
        }
      ]
    },
    {
      label: t('header.requestQuote'),
      icon: 'pi pi-file-edit',
      items: [
        // Dynamic configurators
        ...configuratorItems,
        ...(configuratorItems.length > 0 ? [{ separator: true }] : []),
        {
          label: t('header.freeMeasurement'),
          icon: 'pi pi-calendar',
          command: () => navigate('/afspraak')
        },
        {
          label: t('header.callDirect'),
          icon: 'pi pi-phone',
          command: () => window.location.href = 'tel:+31850605036'
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
    }
  ]

  const start = (
    <Link to="/" className="logo-link">
      <div className="logo">
        <h1>ALU<span>SOLUTIONS</span></h1>
        <p className="tagline">{t('header.tagline')}</p>
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
        className="p-button-text p-button-rounded"
        onClick={(e) => langMenuRef.current?.toggle(e)}
        tooltip={i18n.language.toUpperCase()}
        tooltipOptions={{ position: 'bottom' }}
      />

      <Button
        icon={theme === 'light' ? 'pi pi-moon' : 'pi pi-sun'}
        className="p-button-text p-button-rounded"
        onClick={toggleTheme}
        tooltip={theme === 'light' ? t('header.darkMode') : t('header.lightMode')}
        tooltipOptions={{ position: 'bottom' }}
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

      {/* Mobile Sidebar */}
      <Sidebar
        visible={mobileMenuOpen}
        onHide={() => setMobileMenuOpen(false)}
        position="left"
        className="mobile-sidebar"
      >
        <div className="mobile-logo">
          <h2>ALU<span>SOLUTIONS</span></h2>
          <p>{t('header.tagline')}</p>
        </div>

        <Menu
          model={[
            ...menuItems,
            { separator: true },
            {
              label: t('header.makeAppointment'),
              icon: 'pi pi-calendar-plus',
              command: () => {
                navigate('/afspraak')
                setMobileMenuOpen(false)
              },
              className: 'mobile-cta-item'
            }
          ]}
          className="mobile-menu"
        />

        <div className="mobile-actions">
          <Button
            label={i18n.language.toUpperCase()}
            icon="pi pi-globe"
            className="p-button-outlined w-full mb-2"
            onClick={(e) => langMenuRef.current?.toggle(e)}
          />

          <Button
            label={theme === 'light' ? t('header.darkMode') : t('header.lightMode')}
            icon={theme === 'light' ? 'pi pi-moon' : 'pi pi-sun'}
            className="p-button-outlined w-full"
            onClick={toggleTheme}
          />
        </div>
      </Sidebar>
    </>
  )
}
