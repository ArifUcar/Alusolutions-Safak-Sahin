import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import '../styles/TimeSlotPicker.css'

interface TimeSlotPickerProps {
  selectedDate: string
  selectedTime: string
  onTimeSelect: (time: string) => void
  serviceType?: string // To check duration requirements
}

interface WorkingHours {
  day_of_week: number
  is_open: boolean
  open_time: string
  close_time: string
  break_start: string | null
  break_end: string | null
}

// Default time slots fallback
const DEFAULT_TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
]

export default function TimeSlotPicker({ selectedDate, selectedTime, onTimeSelect, serviceType }: TimeSlotPickerProps) {
  const { t } = useTranslation()
  const [blockedSlots, setBlockedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [durationSlots, setDurationSlots] = useState(2) // Default 1 hour (2 x 30min)
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([])
  const [loadingHours, setLoadingHours] = useState(true)

  // Load working hours on mount
  useEffect(() => {
    loadWorkingHours()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      loadBlockedSlots()
    }
  }, [selectedDate])

  useEffect(() => {
    if (serviceType) {
      loadServiceDuration()
    }
  }, [serviceType])

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
      }
    } catch (error) {
      console.error('Error loading working hours:', error)
      // Will use fallback logic
    } finally {
      setLoadingHours(false)
    }
  }

  const loadServiceDuration = async () => {
    if (!serviceType) return

    try {
      const { data, error } = await supabase
        .from('appointment_settings')
        .select('duration_slots')
        .eq('service_type', serviceType)
        .eq('is_active', true)
        .single()

      if (!error && data) {
        setDurationSlots(data.duration_slots)
      }
    } catch (error) {
      console.error('Error loading service duration:', error)
    }
  }

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

  // Generate time slots from open_time to close_time, excluding break time
  const generateTimeSlots = (openTime: string, closeTime: string, breakStart: string | null, breakEnd: string | null): string[] => {
    const slots: string[] = []

    const [openHour, openMin] = openTime.split(':').map(Number)
    const [closeHour, closeMin] = closeTime.split(':').map(Number)

    let breakStartMinutes = -1
    let breakEndMinutes = -1

    if (breakStart && breakEnd) {
      const [bsHour, bsMin] = breakStart.split(':').map(Number)
      const [beHour, beMin] = breakEnd.split(':').map(Number)
      breakStartMinutes = bsHour * 60 + bsMin
      breakEndMinutes = beHour * 60 + beMin
    }

    let currentMinutes = openHour * 60 + openMin
    const closeMinutes = closeHour * 60 + closeMin

    while (currentMinutes < closeMinutes) {
      // Skip break time
      if (breakStartMinutes >= 0 && currentMinutes >= breakStartMinutes && currentMinutes < breakEndMinutes) {
        currentMinutes += 30
        continue
      }

      const hours = Math.floor(currentMinutes / 60)
      const mins = currentMinutes % 60
      slots.push(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`)

      currentMinutes += 30
    }

    return slots
  }

  // Get working hours for a specific day
  const getDayWorkingHours = (dateStr: string): WorkingHours | null => {
    if (workingHours.length === 0) return null

    const date = new Date(dateStr)
    const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.

    return workingHours.find(h => h.day_of_week === dayOfWeek) || null
  }

  // Check if a day is closed
  const isDayClosed = (dateStr: string): boolean => {
    const dayHours = getDayWorkingHours(dateStr)

    // If we have working hours data and the day is marked as closed
    if (dayHours) {
      return !dayHours.is_open
    }

    // Fallback: Sunday is closed
    const date = new Date(dateStr)
    return date.getDay() === 0
  }

  // Get available slots for the selected date
  const getAvailableSlots = (): string[] => {
    if (!selectedDate) return DEFAULT_TIME_SLOTS

    const dayHours = getDayWorkingHours(selectedDate)

    if (dayHours && dayHours.is_open) {
      return generateTimeSlots(
        dayHours.open_time,
        dayHours.close_time,
        dayHours.break_start,
        dayHours.break_end
      )
    }

    // Fallback to default if no working hours data or day is closed
    if (!dayHours && workingHours.length === 0) {
      const date = new Date(selectedDate)
      const day = date.getDay()

      // Sunday closed
      if (day === 0) return []

      // Saturday: shorter hours
      if (day === 6) {
        return ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30']
      }

      return DEFAULT_TIME_SLOTS
    }

    return []
  }

  // Get next N slots starting from a given time
  const getConsecutiveSlots = (startTime: string, count: number, availableSlots: string[]): string[] => {
    const startIndex = availableSlots.indexOf(startTime)
    if (startIndex === -1) return []

    const slots: string[] = []
    for (let i = 0; i < count; i++) {
      if (startIndex + i < availableSlots.length) {
        slots.push(availableSlots[startIndex + i])
      }
    }
    return slots
  }

  // Check if a slot has enough consecutive available slots for the appointment duration
  const hasEnoughConsecutiveSlots = (time: string, availableSlots: string[]): boolean => {
    const neededSlots = getConsecutiveSlots(time, durationSlots, availableSlots)
    if (neededSlots.length < durationSlots) return false

    // Check if any of the needed slots are blocked
    return !neededSlots.some(slot => blockedSlots.includes(slot))
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

  const availableSlots = getAvailableSlots()

  if (!selectedDate) {
    return (
      <div className="time-slot-picker">
        <p className="select-date-first">{t('appointment.selectDateFirst')}</p>
      </div>
    )
  }

  if (isDayClosed(selectedDate)) {
    const dayHours = getDayWorkingHours(selectedDate)
    const date = new Date(selectedDate)
    const dayName = date.toLocaleDateString('nl-NL', { weekday: 'long' })

    return (
      <div className="time-slot-picker">
        <p className="weekend-closed">
          {dayHours ? t('appointment.closedDay', { day: dayName }) : t('appointment.closedSunday')}
        </p>
      </div>
    )
  }

  return (
    <div className="time-slot-picker">
      {(loading || loadingHours) ? (
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
              const notEnoughSlots = !!serviceType && !hasEnoughConsecutiveSlots(time, availableSlots)
              const isDisabled = isBlocked || isPast || notEnoughSlots
              const isSelected = selectedTime === time

              let title = ''
              if (isBlocked) title = t('appointment.slotBooked')
              else if (isPast) title = t('appointment.slotPast')
              else if (notEnoughSlots) title = t('appointment.notEnoughTime', 'Yeterli süre yok')

              return (
                <button
                  key={time}
                  type="button"
                  className={`time-slot ${isSelected ? 'selected' : ''} ${isBlocked ? 'blocked' : ''} ${isPast ? 'past' : ''} ${notEnoughSlots ? 'unavailable' : ''}`}
                  onClick={() => !isDisabled && onTimeSelect(time)}
                  disabled={isDisabled}
                  title={title}
                >
                  {time}
                  {isBlocked && <span className="blocked-icon">✕</span>}
                </button>
              )
            })}
          </div>
          {durationSlots > 1 && (
            <div className="duration-info" style={{
              background: '#e0f2fe',
              padding: '10px 15px',
              borderRadius: '8px',
              marginTop: '15px',
              fontSize: '0.85rem',
              color: '#0369a1'
            }}>
              {t('appointment.durationInfo', { duration: (durationSlots * 30) / 60 })}
            </div>
          )}
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
