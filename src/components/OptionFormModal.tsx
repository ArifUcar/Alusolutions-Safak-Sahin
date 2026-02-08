import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ConfiguratorOption, MultiLanguageText } from '../lib/supabase'

interface OptionFormModalProps {
  stepId: string
  option: ConfiguratorOption | null
  onClose: () => void
  onSave: () => void
}

export default function OptionFormModal({ stepId, option, onClose, onSave }: OptionFormModalProps) {
  const isEditing = !!option
  const [saving, setSaving] = useState(false)
  const [currentLang, setCurrentLang] = useState<keyof MultiLanguageText>('nl')
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    option_value: option?.option_value || '',
    label: option?.label || { nl: '', en: '', tr: '', de: '', fr: '', it: '' },
    description: option?.description || { nl: '', en: '', tr: '', de: '', fr: '', it: '' },
    image_url: option?.image_url || '',
    display_order: option?.display_order || 1,
    is_active: option?.is_active ?? true
  })

  const languages: { code: keyof MultiLanguageText; name: string }[] = [
    { code: 'nl', name: 'NL' },
    { code: 'en', name: 'EN' },
    { code: 'tr', name: 'TR' },
    { code: 'de', name: 'DE' }
  ]

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Lütfen bir görsel dosyası seçin')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır')
      return
    }

    setUploading(true)

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `configurator-images/${fileName}`

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('gallery')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

      setFormData({ ...formData, image_url: publicUrl })
      alert('Görsel başarıyla yüklendi!')
    } catch (error) {
      console.error('Upload error:', error)
      alert('Görsel yüklenirken hata oluştu!')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const optionData = {
        step_id: stepId,
        option_value: formData.option_value,
        label: formData.label,
        description: formData.description,
        image_url: formData.image_url || null,
        display_order: formData.display_order,
        is_active: formData.is_active
      }

      if (isEditing) {
        const { error } = await supabase
          .from('configurator_options')
          .update(optionData)
          .eq('id', option.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('configurator_options')
          .insert(optionData)

        if (error) throw error
      }

      onSave()
      onClose()
    } catch (error: any) {
      console.error('Error saving option:', error)
      if (error.code === '23505') {
        alert('Bu option_value zaten kullanılıyor!')
      } else {
        alert('Kaydetme hatası!')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Seçenek Düzenle' : 'Yeni Seçenek'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Basic Info */}
          <div className="form-section">
            <h3>Temel Bilgiler</h3>

            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>Değer (Value) *</label>
                <input
                  type="text"
                  value={formData.option_value}
                  onChange={(e) => setFormData({ ...formData, option_value: e.target.value })}
                  placeholder="standaard"
                  pattern="[a-z0-9_\-]+"
                  required
                />
                <small>Sadece küçük harf, rakam, tire ve alt çizgi</small>
              </div>

              <div className="form-group" style={{ flex: '0 0 150px' }}>
                <label>Sıra *</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                  min="1"
                  required
                />
              </div>

            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <span>Aktif</span>
                </label>
              </div>
            </div>
          </div>

          {/* Multi-language Labels */}
          <div className="form-section">
            <h3>Çoklu Dil Etiketler</h3>

            <div className="language-tabs">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  className={`lang-tab ${currentLang === lang.code ? 'active' : ''}`}
                  onClick={() => setCurrentLang(lang.code)}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            <div className="language-content">
              <div className="form-group">
                <label>Etiket ({currentLang.toUpperCase()}) {currentLang === 'nl' && '*'}</label>
                <input
                  type="text"
                  value={formData.label[currentLang] || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    label: { ...formData.label, [currentLang]: e.target.value }
                  })}
                  placeholder="Standaard"
                  required={currentLang === 'nl'}
                />
              </div>

              <div className="form-group">
                <label>Açıklama ({currentLang.toUpperCase()})</label>
                <textarea
                  value={formData.description[currentLang] || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    description: { ...formData.description, [currentLang]: e.target.value }
                  })}
                  placeholder="Opsiyonel açıklama"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="form-section">
            <h3>Görsel</h3>

            <div className="form-group">
              <label>Görsel Yükle</label>
              <div style={{ marginBottom: '0.5rem' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="admin-btn admin-btn-secondary"
                  style={{
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    opacity: uploading ? 0.6 : 1,
                    margin: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-small"></span>
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      📤 Bilgisayardan Yükle
                    </>
                  )}
                </label>
              </div>
              {formData.image_url && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--section-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="90"%3E%3Crect fill="%23ddd" width="120" height="90"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3EGörsel Yüklenemedi%3C/text%3E%3C/svg%3E'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--body-text)', marginBottom: '0.25rem' }}>
                        <strong>Önizleme:</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)', wordBreak: 'break-all' }}>
                        {formData.image_url}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      style={{ padding: '0.5rem', fontSize: '1rem' }}
                      title="Görseli kaldır"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'Kaydediliyor...' : isEditing ? 'Güncelle' : 'Oluştur'}
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
              İptal
            </button>
          </div>
        </form>

        <style>{`
          .modal-content.large {
            max-width: 900px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
          }

          .modal-body {
            flex: 1;
            max-height: calc(90vh - 140px);
            overflow-y: auto;
            overflow-x: hidden;
            padding: 1.5rem;
          }

          .form-section {
            margin-bottom: 1.5rem;
            padding: 1.25rem;
            background: var(--section-bg);
            border-radius: 8px;
            border: 1px solid var(--border-color);
          }

          .form-section h3 {
            margin: 0 0 1rem 0;
            color: var(--heading-text);
            font-size: 1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .form-section h3::before {
            content: '';
            width: 4px;
            height: 1rem;
            background: #8b5cf6;
            border-radius: 2px;
          }

          .form-row {
            display: flex;
            gap: 1rem;
          }

          .form-row .form-group {
            flex: 1;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-group:last-child {
            margin-bottom: 0;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--heading-text);
            font-size: 0.875rem;
          }

          .form-group label.checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0;
            cursor: pointer;
          }

          .form-group label.checkbox-label input[type="checkbox"] {
            width: auto;
            margin: 0;
            cursor: pointer;
          }

          .form-group input[type="text"],
          .form-group input[type="number"],
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 0.625rem 0.875rem;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background: var(--card-bg);
            color: var(--body-text);
            font-size: 0.9rem;
            transition: all 0.2s ease;
          }

          .form-group input[type="text"]:focus,
          .form-group input[type="number"]:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: #8b5cf6;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
          }

          .form-group small {
            display: block;
            margin-top: 0.25rem;
            font-size: 0.75rem;
            color: var(--muted-text);
          }

          .language-tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
          }

          .lang-tab {
            padding: 0.5rem 1rem;
            border: 1px solid var(--border-color);
            background: var(--card-bg);
            color: var(--body-text);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .lang-tab:hover {
            background: var(--section-bg);
            border-color: #8b5cf6;
          }

          .lang-tab.active {
            background: #8b5cf6;
            color: #fff;
            border-color: #8b5cf6;
          }

          .language-content {
            padding: 1.25rem;
            background: var(--card-bg);
            border-radius: 6px;
            border: 1px solid var(--border-color);
          }

          .form-actions {
            display: flex;
            gap: 0.75rem;
            justify-content: flex-end;
            padding: 1.25rem 1.5rem;
            border-top: 1px solid var(--border-color);
            background: var(--section-bg);
            margin: 1.5rem -1.5rem -1.5rem -1.5rem;
            border-radius: 0 0 12px 12px;
            position: sticky;
            bottom: 0;
          }

          .admin-btn {
            padding: 0.625rem 1.5rem;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
            font-size: 0.9rem;
          }

          .admin-btn-primary {
            background: linear-gradient(135deg, #8b5cf6, #a78bfa);
            color: white;
          }

          .admin-btn-primary:hover:not(:disabled) {
            background: linear-gradient(135deg, #7c3aed, #8b5cf6);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
          }

          .admin-btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .admin-btn-secondary {
            background: var(--card-bg);
            color: var(--body-text);
            border: 1px solid var(--border-color);
          }

          .admin-btn-secondary:hover:not(:disabled) {
            background: var(--section-bg);
            border-color: #8b5cf6;
          }

          .admin-btn-secondary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .spinner-small {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid var(--border-color);
            border-top-color: #8b5cf6;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            .modal-content.large {
              max-width: 95vw;
              max-height: 95vh;
            }

            .modal-body {
              padding: 1rem;
              max-height: calc(95vh - 120px);
            }

            .form-row {
              flex-direction: column;
              gap: 0;
            }

            .form-row .form-group {
              flex: none !important;
            }

            .form-section {
              padding: 1rem;
              margin-bottom: 1rem;
            }

            .language-tabs {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 0.25rem;
            }

            .language-content {
              padding: 1rem;
            }

            .form-actions {
              flex-direction: column;
              padding: 1rem;
              margin: 1rem -1rem -1rem -1rem;
              gap: 0.5rem;
            }

            .admin-btn {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
