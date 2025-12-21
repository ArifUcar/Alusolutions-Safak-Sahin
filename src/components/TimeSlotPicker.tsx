import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import '../styles/TimeSlotPicker.css'

interface TimeSlotPickerProps {
  selectedDate: string
  selectedTime: string
  onTimeSelect: (time: string) => void
}

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
]

export default function TimeSlotPicker({ selectedDate, selectedTime, onTimeSelect }: TimeSlotPickerProps) {
  const { t } = useTranslation()
  const [blockedSlots, setBlockedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedDate) {
      loadBlockedSlots()
    }
  }, [selectedDate])

  const loadBlockedSlots = async () => {
    if (!selectedDate) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('blocked_slots')
        .select('time')
        .eq('date', selectedDate)

      if (error) throw error
      setBlockedSlots(data?.map(slot => slot.time) || [])
    } catch (error) {
      console.error('Error loading blocked slots:', error)
      setBlockedSlots([])
    } finally {
      setLoading(false)
    }
  }

  const isSlotBlocked = (time: string) => {
    return blockedSlots.includes(time)
  }

  const isPastSlot = (time: string) => {
    if (!selectedDate) return false

    const now = new Date()
    const slotDate = new Date(selectedDate)
    const [hours, minutes] = time.split(':').map(Number)
    slotDate.setHours(hours, minutes, 0, 0)

    return slotDate < now
  }

  const isWeekend = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = date.getDay()
    return day === 0 // Sunday only - Saturday is open 10:00-15:00
  }

  const isSaturday = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.getDay() === 6
  }

  const getSaturdaySlots = () => {
    return ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30']
  }

  const getAvailableSlots = () => {
    if (!selectedDate) return TIME_SLOTS
    if (isWeekend(selectedDate)) return []
    if (isSaturday(selectedDate)) return getSaturdaySlots()
    return TIME_SLOTS
  }

  const availableSlots = getAvailableSlots()

  if (!selectedDate) {
    return (
      <div className="time-slot-picker">
        <p className="select-date-first">{t('appointment.selectDateFirst')}</p>
      </div>
    )
  }

  if (isWeekend(selectedDate) && !isSaturday(selectedDate)) {
    return (
      <div className="time-slot-picker">
        <p className="weekend-closed">{t('appointment.closedSunday')}</p>
      </div>
    )
  }

  return (
    <div className="time-slot-picker">
      {loading ? (
        <div className="loading-slots">
          <div className="spinner-small"></div>
          <span>{t('common.loading')}</span>
        </div>
      ) : (
        <>
          <div className="slots-grid">
            {availableSlots.map((time) => {
              const isBlocked = isSlotBlocked(time)
              const isPast = isPastSlot(time)
              const isDisabled = isBlocked || isPast
              const isSelected = selectedTime === time

              return (
                <button
                  key={time}
                  type="button"
                  className={`time-slot ${isSelected ? 'selected' : ''} ${isBlocked ? 'blocked' : ''} ${isPast ? 'past' : ''}`}
                  onClick={() => !isDisabled && onTimeSelect(time)}
                  disabled={isDisabled}
                  title={isBlocked ? t('appointment.slotBooked') : isPast ? t('appointment.slotPast') : ''}
                >
                  {time}
                  {isBlocked && <span className="blocked-icon">✕</span>}
                </button>
              )
            })}
          </div>
          <div className="slots-legend">
            <div className="legend-item">
              <span className="legend-dot available"></span>
              <span>{t('appointment.available')}</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot blocked"></span>
              <span>{t('appointment.booked')}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
