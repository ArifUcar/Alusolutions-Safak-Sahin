import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { ConfiguratorStep, MultiLanguageText, StepInputType } from '../lib/supabase'

interface StepFormModalProps {
  configuratorId: string
  step: ConfiguratorStep | null
  onClose: () => void
  onSave: () => void
}

export default function StepFormModal({ configuratorId, step, onClose, onSave }: StepFormModalProps) {
  const isEditing = !!step
  const [saving, setSaving] = useState(false)
  const [currentLang, setCurrentLang] = useState<keyof MultiLanguageText>('nl')

  const [formData, setFormData] = useState({
    step_order: step?.step_order || 1,
    title: step?.title || { nl: '', en: '', tr: '', de: '', fr: '', it: '' },
    subtitle: step?.subtitle || { nl: '', en: '', tr: '', de: '', fr: '', it: '' },
    input_type: (step?.input_type || 'radio-image') as StepInputType,
    field_name: step?.field_name || '',
    is_required: step?.is_required ?? true,
    min_value: step?.min_value || undefined,
    max_value: step?.max_value || undefined,
    validation_regex: step?.validation_regex || '',
    help_text: step?.help_text || { nl: '', en: '', tr: '', de: '', fr: '', it: '' },
    show_preview_image: step?.show_preview_image || false,
    preview_image_base_path: step?.preview_image_base_path || ''
  })

  const languages: { code: keyof MultiLanguageText; name: string }[] = [
    { code: 'nl', name: 'NL' },
    { code: 'en', name: 'EN' },
    { code: 'tr', name: 'TR' },
    { code: 'de', name: 'DE' },
    { code: 'fr', name: 'FR' },
    { code: 'it', name: 'IT' }
  ]

  const inputTypes: { value: StepInputType; label: string }[] = [
    { value: 'radio-image', label: 'Radio (Görsel)' },
    { value: 'radio', label: 'Radio (Metin)' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'text', label: 'Metin' },
    { value: 'number', label: 'Sayı' },
    { value: 'select', label: 'Dropdown' },
    { value: 'textarea', label: 'Uzun Metin' }
  ]

  // Auto-generate field_name from NL title
  useEffect(() => {
    if (!isEditing && formData.title.nl && !formData.field_name) {
      const fieldName = formData.title.nl
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '')
      setFormData(prev => ({ ...prev, field_name: fieldName }))
    }
  }, [formData.title.nl, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const stepData = {
        configurator_id: configuratorId,
        step_order: formData.step_order,
        title: formData.title,
        subtitle: formData.subtitle,
        input_type: formData.input_type,
        field_name: formData.field_name,
        is_required: formData.is_required,
        min_value: formData.min_value || null,
        max_value: formData.max_value || null,
        validation_regex: formData.validation_regex || null,
        help_text: formData.help_text,
        show_condition: null, // Will be added later
        show_preview_image: formData.show_preview_image,
        preview_image_base_path: formData.preview_image_base_path || null
      }

      if (isEditing) {
        const { error } = await supabase
          .from('configurator_steps')
          .update(stepData)
          .eq('id', step.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('configurator_steps')
          .insert(stepData)

        if (error) throw error
      }

      onSave()
      onClose()
    } catch (error: any) {
      console.error('Error saving step:', error)
      if (error.code === '23505') {
        alert('Bu field_name veya step_order zaten kullanılıyor!')
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
          <h2>{isEditing ? 'Adım Düzenle' : 'Yeni Adım'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Basic Info */}
          <div className="form-section">
            <h3>Temel Bilgiler</h3>

            <div className="form-row">
              <div className="form-group" style={{ flex: '0 0 150px' }}>
                <label>Adım Sırası *</label>
                <input
                  type="number"
                  value={formData.step_order}
                  onChange={(e) => setFormData({ ...formData, step_order: parseInt(e.target.value) || 1 })}
                  min="1"
                  required
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Alan Adı (field_name) *</label>
                <input
                  type="text"
                  value={formData.field_name}
                  onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                  placeholder="goot_type"
                  pattern="[a-z0-9_]+"
                  required
                />
                <small>Sadece küçük harf, rakam ve alt çizgi (_)</small>
              </div>

              <div className="form-group" style={{ flex: '0 0 200px' }}>
                <label>Input Tipi *</label>
                <select
                  value={formData.input_type}
                  onChange={(e) => setFormData({ ...formData, input_type: e.target.value as StepInputType })}
                  required
                >
                  {inputTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_required}
                    onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
                  />
                  <span>Zorunlu Alan</span>
                </label>
              </div>
            </div>
          </div>

          {/* Multi-language Titles */}
          <div className="form-section">
            <h3>Çoklu Dil Başlıklar</h3>

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
                <label>Başlık ({currentLang.toUpperCase()}) {currentLang === 'nl' && '*'}</label>
                <input
                  type="text"
                  value={formData.title[currentLang] || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, [currentLang]: e.target.value }
                  })}
                  placeholder="Goot type"
                  required={currentLang === 'nl'}
                />
              </div>

              <div className="form-group">
                <label>Alt Başlık ({currentLang.toUpperCase()})</label>
                <input
                  type="text"
                  value={formData.subtitle[currentLang] || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    subtitle: { ...formData.subtitle, [currentLang]: e.target.value }
                  })}
                  placeholder="Kies uw goot type (opsiyonel)"
                />
              </div>

              <div className="form-group">
                <label>Yardım Metni ({currentLang.toUpperCase()})</label>
                <textarea
                  value={formData.help_text[currentLang] || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    help_text: { ...formData.help_text, [currentLang]: e.target.value }
                  })}
                  placeholder="Ek açıklama (opsiyonel)"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Validation (for text/number inputs) */}
          {(formData.input_type === 'text' || formData.input_type === 'number') && (
            <div className="form-section">
              <h3>Validasyon</h3>

              {formData.input_type === 'number' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Minimum Değer</label>
                    <input
                      type="number"
                      value={formData.min_value || ''}
                      onChange={(e) => setFormData({ ...formData, min_value: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Maximum Değer</label>
                    <input
                      type="number"
                      value={formData.max_value || ''}
                      onChange={(e) => setFormData({ ...formData, max_value: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="100"
                    />
                  </div>
                </div>
              )}

              {formData.input_type === 'text' && (
                <div className="form-group">
                  <label>Regex Pattern</label>
                  <input
                    type="text"
                    value={formData.validation_regex}
                    onChange={(e) => setFormData({ ...formData, validation_regex: e.target.value })}
                    placeholder="^[A-Z0-9]+$"
                  />
                  <small>Opsiyonel regex validation</small>
                </div>
              )}
            </div>
          )}

          {/* Preview Image Settings */}
          {(formData.input_type === 'radio-image' || formData.input_type === 'radio' || formData.input_type === 'select') && (
            <div className="form-section" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(167, 139, 250, 0.05))', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
              <h3>🖼️ Önizleme Görseli Ayarları</h3>
              <div style={{ padding: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--body-text)' }}>
                <strong>💡 Önemli:</strong> Bu ayarı aktif ederseniz, her seçeneğe yüklenen görsel sol taraftaki büyük fotoğraf olarak gösterilir.
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.show_preview_image}
                      onChange={(e) => setFormData({ ...formData, show_preview_image: e.target.checked })}
                    />
                    <span>Seçilen seçeneğin görseli ana büyük fotoğrafta gösterilsin</span>
                  </label>
                  <small style={{ display: 'block', marginTop: '0.5rem', marginLeft: '1.5rem', color: 'var(--muted-text)' }}>
                    Bu seçeneği işaretlerseniz, kullanıcı bir seçenek seçtiğinde o seçeneğe yüklediğiniz görsel sol tarafta büyük olarak görünür.
                  </small>
                </div>
              </div>
            </div>
          )}

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

          .admin-btn-secondary:hover {
            background: var(--section-bg);
            border-color: #8b5cf6;
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
