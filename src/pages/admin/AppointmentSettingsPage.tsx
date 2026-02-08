import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { AppointmentSettings, BlockedSlot } from '../../lib/supabase'

interface BlockedDate {
  date: string
  slots: string[]
  isFullDay: boolean
}

interface WorkingHours {
  id: string
  day_of_week: number
  is_open: boolean
  open_time: string
  close_time: string
  break_start: string | null
  break_end: string | null
}

const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
const TIME_OPTIONS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00'
]

const ALL_TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
]

export default function AppointmentSettingsPage() {
  const [settings, setSettings] = useState<AppointmentSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<AppointmentSettings | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)

  // Blocked dates state
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [loadingBlocked, setLoadingBlocked] = useState(true)
  const [activeTab, setActiveTab] = useState<'types' | 'blocked' | 'hours'>('types')
  const [blockDate, setBlockDate] = useState('')
  const [blockFullDay, setBlockFullDay] = useState(true)
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [savingBlock, setSavingBlock] = useState(false)

  // Working hours state
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([])
  const [loadingHours, setLoadingHours] = useState(true)
  const [savingHours, setSavingHours] = useState(false)

  const [formData, setFormData] = useState({
    service_type: '',
    duration_slots: 2,
    name: { nl: '', en: '', de: '', tr: '' },
    description: { nl: '', en: '', de: '', tr: '' },
    is_active: true,
    display_order: 0
  })

  useEffect(() => {
    loadSettings()
    loadBlockedDates()
    loadWorkingHours()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('appointment_settings')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setSettings(data || [])
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBlockedDates = async () => {
    setLoadingBlocked(true)
    try {
      // Get blocked slots from today onwards
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('blocked_slots')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (error) throw error

      // Group by date
      const grouped: Record<string, string[]> = {}
      ;(data || []).forEach((slot: BlockedSlot) => {
        if (!grouped[slot.date]) {
          grouped[slot.date] = []
        }
        grouped[slot.date].push(slot.time)
      })

      // Convert to array with full day detection
      const result: BlockedDate[] = Object.entries(grouped).map(([date, slots]) => ({
        date,
        slots,
        isFullDay: slots.length >= ALL_TIME_SLOTS.length
      }))

      setBlockedDates(result)
    } catch (error) {
      console.error('Error loading blocked dates:', error)
    } finally {
      setLoadingBlocked(false)
    }
  }

  const loadWorkingHours = async () => {
    setLoadingHours(true)
    try {
      const { data, error } = await supabase
        .from('working_hours')
        .select('*')
        .order('day_of_week', { ascending: true })

      if (error) throw error

      if (data && data.length > 0) {
        setWorkingHours(data)
      } else {
        // Set default working hours if none exist
        const defaultHours: WorkingHours[] = DAY_NAMES.map((_, index) => ({
          id: `temp-${index}`,
          day_of_week: index,
          is_open: index >= 1 && index <= 6, // Monday-Saturday open
          open_time: '09:00',
          close_time: index === 6 ? '15:00' : '17:00', // Saturday shorter
          break_start: index !== 0 && index !== 6 ? '12:00' : null,
          break_end: index !== 0 && index !== 6 ? '13:00' : null
        }))
        setWorkingHours(defaultHours)
      }
    } catch (error) {
      console.error('Error loading working hours:', error)
      // Set defaults on error
      const defaultHours: WorkingHours[] = DAY_NAMES.map((_, index) => ({
        id: `temp-${index}`,
        day_of_week: index,
        is_open: index >= 1 && index <= 6,
        open_time: '09:00',
        close_time: index === 6 ? '15:00' : '17:00',
        break_start: index !== 0 && index !== 6 ? '12:00' : null,
        break_end: index !== 0 && index !== 6 ? '13:00' : null
      }))
      setWorkingHours(defaultHours)
    } finally {
      setLoadingHours(false)
    }
  }

  const handleWorkingHoursChange = (dayIndex: number, field: keyof WorkingHours, value: any) => {
    setWorkingHours(prev => prev.map(h =>
      h.day_of_week === dayIndex ? { ...h, [field]: value } : h
    ))
  }

  const saveWorkingHours = async () => {
    setSavingHours(true)
    try {
      // Upsert all working hours
      const dataToSave = workingHours.map(h => ({
        day_of_week: h.day_of_week,
        is_open: h.is_open,
        open_time: h.open_time,
        close_time: h.close_time,
        break_start: h.break_start || null,
        break_end: h.break_end || null,
        updated_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from('working_hours')
        .upsert(dataToSave, { onConflict: 'day_of_week' })

      if (error) throw error

      alert('Çalışma saatleri başarıyla kaydedildi!')
      loadWorkingHours()
    } catch (error: any) {
      console.error('Error saving working hours:', error)
      alert(`Hata: ${error?.message || 'Bilinmeyen hata'}`)
    } finally {
      setSavingHours(false)
    }
  }

  const handleBlockDate = async () => {
    if (!blockDate) {
      alert('Lütfen bir tarih seçin')
      return
    }

    if (!blockFullDay && selectedSlots.length === 0) {
      alert('Lütfen en az bir saat seçin')
      return
    }

    setSavingBlock(true)
    try {
      const slotsToBlock = blockFullDay ? ALL_TIME_SLOTS : selectedSlots

      // Insert blocked slots
      const blockedData = slotsToBlock.map(time => ({
        date: blockDate,
        time: time,
        appointment_id: null // Manual block, not from appointment
      }))

      const { error } = await supabase
        .from('blocked_slots')
        .upsert(blockedData, { onConflict: 'date,time' })

      if (error) throw error

      // Reset form
      setBlockDate('')
      setBlockFullDay(true)
      setSelectedSlots([])
      loadBlockedDates()
      alert('Tarih başarıyla kilitlendi!')
    } catch (error: any) {
      console.error('Error blocking date:', error)
      alert(`Hata: ${error?.message || 'Bilinmeyen hata'}`)
    } finally {
      setSavingBlock(false)
    }
  }

  const handleUnblockDate = async (date: string) => {
    if (!confirm(`${date} tarihindeki tüm kilitleri kaldırmak istediğinizden emin misiniz?`)) return

    try {
      const { error } = await supabase
        .from('blocked_slots')
        .delete()
        .eq('date', date)

      if (error) throw error
      loadBlockedDates()
    } catch (error) {
      console.error('Error unblocking date:', error)
      alert('Kilit kaldırma hatası!')
    }
  }

  const handleUnblockSlot = async (date: string, time: string) => {
    try {
      const { error } = await supabase
        .from('blocked_slots')
        .delete()
        .eq('date', date)
        .eq('time', time)

      if (error) throw error
      loadBlockedDates()
    } catch (error) {
      console.error('Error unblocking slot:', error)
    }
  }

  const toggleSlot = (time: string) => {
    setSelectedSlots(prev =>
      prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time]
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('appointment_settings')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('appointment_settings')
          .insert(formData)

        if (error) throw error
      }

      resetForm()
      loadSettings()
    } catch (error) {
      console.error('Error saving:', error)
      alert('Kaydetme hatası!')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item: AppointmentSettings) => {
    setEditingItem(item)
    setFormData({
      service_type: item.service_type,
      duration_slots: item.duration_slots,
      name: item.name as any || { nl: '', en: '', de: '', tr: '' },
      description: item.description as any || { nl: '', en: '', de: '', tr: '' },
      is_active: item.is_active,
      display_order: item.display_order
    })
    setIsCreating(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ayarı silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('appointment_settings')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadSettings()
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Silme hatası!')
    }
  }

  const resetForm = () => {
    setFormData({
      service_type: '',
      duration_slots: 2,
      name: { nl: '', en: '', de: '', tr: '' },
      description: { nl: '', en: '', de: '', tr: '' },
      is_active: true,
      display_order: settings.length
    })
    setEditingItem(null)
    setIsCreating(false)
  }

  const getDurationText = (slots: number) => {
    const hours = (slots * 30) / 60
    if (hours < 1) return `${slots * 30} dakika`
    if (hours === 1) return '1 saat'
    return `${hours} saat`
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Randevu Ayarları</h1>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid var(--admin-border)', paddingBottom: '10px' }}>
        <button
          className={`admin-btn ${activeTab === 'types' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('types')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          Randevu Tipleri
        </button>
        <button
          className={`admin-btn ${activeTab === 'blocked' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('blocked')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <line x1="9" y1="14" x2="15" y2="20"></line>
            <line x1="15" y1="14" x2="9" y2="20"></line>
          </svg>
          Tarih Kilitleme
        </button>
        <button
          className={`admin-btn ${activeTab === 'hours' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('hours')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Çalışma Saatleri
        </button>
      </div>

      {activeTab === 'types' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => {
                resetForm()
                setIsCreating(true)
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Yeni Randevu Tipi
            </button>
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', background: 'var(--admin-card-bg)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--admin-text-secondary)' }}>
              <strong>Bilgi:</strong> Her randevu tipi için süre belirleyebilirsiniz. Süre, 30 dakikalık slotlar halinde hesaplanır.
              Örneğin, 2 slot = 1 saat, 4 slot = 2 saat. Bir randevu onaylandığında, belirlenen süre kadar zaman dilimi kitlenir.
            </p>
          </div>

      {(isCreating || editingItem) && (
        <div className="admin-form-card" style={{ marginBottom: '30px' }}>
          <h3>{editingItem ? 'Randevu Tipini Düzenle' : 'Yeni Randevu Tipi'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Servis Tipi (slug) *</label>
                <input
                  type="text"
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  placeholder="ornek: showroom, thuisbezoek"
                  required
                  disabled={!!editingItem}
                />
                <small style={{ color: 'var(--admin-text-secondary)' }}>
                  Sistem tarafından kullanılır, değiştirilemez
                </small>
              </div>

              <div className="form-group">
                <label>Süre (slot sayısı) *</label>
                <select
                  value={formData.duration_slots}
                  onChange={(e) => setFormData({ ...formData, duration_slots: parseInt(e.target.value) })}
                  required
                >
                  <option value={1}>1 slot (30 dk)</option>
                  <option value={2}>2 slot (1 saat)</option>
                  <option value={3}>3 slot (1.5 saat)</option>
                  <option value={4}>4 slot (2 saat)</option>
                  <option value={5}>5 slot (2.5 saat)</option>
                  <option value={6}>6 slot (3 saat)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>İsim (Hollandaca) *</label>
              <input
                type="text"
                value={formData.name.nl}
                onChange={(e) => setFormData({ ...formData, name: { ...formData.name, nl: e.target.value } })}
                placeholder="Örn: Showroom Bezoek"
                required
              />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>İsim (İngilizce)</label>
                <input
                  type="text"
                  value={formData.name.en}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                  placeholder="Showroom Visit"
                />
              </div>
              <div className="form-group">
                <label>İsim (Almanca)</label>
                <input
                  type="text"
                  value={formData.name.de}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, de: e.target.value } })}
                  placeholder="Showroom Besuch"
                />
              </div>
              <div className="form-group">
                <label>İsim (Türkçe)</label>
                <input
                  type="text"
                  value={formData.name.tr}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, tr: e.target.value } })}
                  placeholder="Showroom Ziyareti"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Açıklama (Hollandaca)</label>
              <textarea
                value={formData.description.nl}
                onChange={(e) => setFormData({ ...formData, description: { ...formData.description, nl: e.target.value } })}
                placeholder="Kısa açıklama..."
                rows={2}
              />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Sıralama</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>

              <div className="form-group">
                <label>&nbsp;</label>
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  Aktif
                </label>
              </div>
            </div>

            <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                {saving ? 'Kaydediliyor...' : (editingItem ? 'Güncelle' : 'Kaydet')}
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={resetForm}>
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      ) : settings.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <h3>Henüz ayar yok</h3>
          <p>Randevu tiplerini ve sürelerini ekleyin</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sıra</th>
                <th>Servis Tipi</th>
                <th>İsim (NL)</th>
                <th>Süre</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((item) => (
                <tr key={item.id}>
                  <td>{item.display_order}</td>
                  <td>
                    <code style={{
                      background: 'var(--admin-hover)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.85rem'
                    }}>
                      {item.service_type}
                    </code>
                  </td>
                  <td>{(item.name as any)?.nl || '-'}</td>
                  <td>
                    <span style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}>
                      {getDurationText(item.duration_slots)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${item.is_active ? 'confirmed' : 'cancelled'}`}>
                      {item.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="admin-btn admin-btn-secondary"
                        onClick={() => handleEdit(item)}
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      >
                        Düzenle
                      </button>
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => handleDelete(item.id)}
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        </>
      )}

      {activeTab === 'blocked' && (
        <>
          <div style={{ marginBottom: '20px', padding: '15px', background: 'var(--admin-card-bg)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--admin-text-secondary)' }}>
              <strong>Bilgi:</strong> Belirli tarihleri veya saatleri kilitleyerek müşterilerin o zamanlarda randevu almasını engelleyebilirsiniz.
              Tatil günleri, özel etkinlikler veya müsait olmadığınız zamanlar için kullanabilirsiniz.
            </p>
          </div>

          {/* Block Date Form */}
          <div className="admin-form-card" style={{ marginBottom: '30px' }}>
            <h3>Yeni Tarih Kilitle</h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div className="form-group">
                <label>Tarih *</label>
                <input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ maxWidth: '300px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={blockFullDay}
                    onChange={(e) => {
                      setBlockFullDay(e.target.checked)
                      if (e.target.checked) setSelectedSlots([])
                    }}
                  />
                  Tüm Günü Kilitle
                </label>
              </div>

              {!blockFullDay && (
                <div className="form-group">
                  <label>Kilitlenecek Saatler</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                    {ALL_TIME_SLOTS.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => toggleSlot(time)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: '1px solid var(--admin-border)',
                          background: selectedSlots.includes(time) ? '#ef4444' : 'var(--admin-card-bg)',
                          color: selectedSlots.includes(time) ? 'white' : 'var(--admin-text)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={handleBlockDate}
                  disabled={savingBlock}
                >
                  {savingBlock ? 'Kaydediliyor...' : 'Tarihi Kilitle'}
                </button>
              </div>
            </div>
          </div>

          {/* Blocked Dates List */}
          <h3 style={{ marginBottom: '15px' }}>Kilitli Tarihler</h3>
          {loadingBlocked ? (
            <div className="loading-screen">
              <div className="spinner"></div>
              <p>Yükleniyor...</p>
            </div>
          ) : blockedDates.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h3>Kilitli tarih yok</h3>
              <p>Henüz kilitlenmiş bir tarih bulunmuyor</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {blockedDates.map(blocked => (
                <div
                  key={blocked.date}
                  style={{
                    background: 'var(--admin-card-bg)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '10px',
                    padding: '15px 20px',
                    borderLeft: blocked.isFullDay ? '4px solid #ef4444' : '4px solid #f59e0b'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px', flexWrap: 'wrap' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>
                        {formatDate(blocked.date)}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        {blocked.isFullDay ? (
                          <span style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}>
                            Tüm Gün Kilitli
                          </span>
                        ) : (
                          <>
                            <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>
                              Kilitli saatler:
                            </span>
                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                              {blocked.slots.map(time => (
                                <span
                                  key={time}
                                  style={{
                                    background: '#fef2f2',
                                    color: '#dc2626',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleUnblockSlot(blocked.date, time)}
                                  title="Tıklayarak kilidi kaldır"
                                >
                                  {time} ✕
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={() => handleUnblockDate(blocked.date)}
                      style={{ padding: '6px 12px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    >
                      Kilidi Kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'hours' && (
        <>
          <div style={{ marginBottom: '20px', padding: '15px', background: 'var(--admin-card-bg)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--admin-text-secondary)' }}>
              <strong>Bilgi:</strong> Her gün için çalışma saatlerini ve mola zamanlarını ayarlayabilirsiniz.
              Müşteriler sadece bu saatler içinde randevu alabilir.
            </p>
          </div>

          {loadingHours ? (
            <div className="loading-screen">
              <div className="spinner"></div>
              <p>Yükleniyor...</p>
            </div>
          ) : (
            <div className="admin-form-card">
              <h3>Haftalık Çalışma Saatleri</h3>
              <div style={{ display: 'grid', gap: '15px' }}>
                {workingHours.map((hours) => (
                  <div
                    key={hours.day_of_week}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 80px 1fr',
                      gap: '15px',
                      alignItems: 'center',
                      padding: '15px',
                      background: hours.is_open ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '8px',
                      border: `1px solid ${hours.is_open ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}
                  >
                    {/* Day Name */}
                    <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                      {DAY_NAMES[hours.day_of_week]}
                    </div>

                    {/* Open/Closed Toggle */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={hours.is_open}
                        onChange={(e) => handleWorkingHoursChange(hours.day_of_week, 'is_open', e.target.checked)}
                      />
                      <span style={{ fontSize: '0.85rem', color: hours.is_open ? '#22c55e' : '#ef4444' }}>
                        {hours.is_open ? 'Açık' : 'Kapalı'}
                      </span>
                    </label>

                    {/* Time Settings */}
                    {hours.is_open && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>Açılış:</span>
                          <select
                            value={hours.open_time}
                            onChange={(e) => handleWorkingHoursChange(hours.day_of_week, 'open_time', e.target.value)}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--admin-border)', background: 'var(--admin-card-bg)' }}
                          >
                            {TIME_OPTIONS.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>Kapanış:</span>
                          <select
                            value={hours.close_time}
                            onChange={(e) => handleWorkingHoursChange(hours.day_of_week, 'close_time', e.target.value)}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--admin-border)', background: 'var(--admin-card-bg)' }}
                          >
                            {TIME_OPTIONS.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', borderLeft: '1px solid var(--admin-border)', paddingLeft: '10px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>Mola:</span>
                          <select
                            value={hours.break_start || ''}
                            onChange={(e) => {
                              handleWorkingHoursChange(hours.day_of_week, 'break_start', e.target.value || null)
                              if (!e.target.value) {
                                handleWorkingHoursChange(hours.day_of_week, 'break_end', null)
                              }
                            }}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--admin-border)', background: 'var(--admin-card-bg)' }}
                          >
                            <option value="">Yok</option>
                            {TIME_OPTIONS.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                          {hours.break_start && (
                            <>
                              <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>-</span>
                              <select
                                value={hours.break_end || ''}
                                onChange={(e) => handleWorkingHoursChange(hours.day_of_week, 'break_end', e.target.value || null)}
                                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--admin-border)', background: 'var(--admin-card-bg)' }}
                              >
                                {TIME_OPTIONS.map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={saveWorkingHours}
                  disabled={savingHours}
                >
                  {savingHours ? 'Kaydediliyor...' : 'Çalışma Saatlerini Kaydet'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
