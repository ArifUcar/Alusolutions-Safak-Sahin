import { useState, useEffect } from 'react'
import { Slider } from 'primereact/slider'
import { InputNumber } from 'primereact/inputnumber'
import { useTranslation } from 'react-i18next'
import './DimensionInput.css'

interface DimensionInputProps {
  value: number
  onChange: (value: number) => void
  error?: string
  min?: number
  max?: number
  step?: number
  unit?: string
  label?: string
  icon?: 'width' | 'length' | 'height'
}

export default function DimensionInput({
  value,
  onChange,
  error,
  min = 100,
  max = 1000,
  step = 10,
  unit = 'cm',
  label: _label,
  icon = 'width'
}: DimensionInputProps) {
  const { t } = useTranslation()
  const [localValue, setLocalValue] = useState<number>(value || min)

  useEffect(() => {
    if (value !== undefined && value !== localValue) {
      setLocalValue(value)
    }
  }, [value])

  const handleSliderChange = (e: any) => {
    const newValue = e.value as number
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleInputChange = (e: any) => {
    const newValue = e.value as number
    if (newValue !== null && newValue >= min && newValue <= max) {
      setLocalValue(newValue)
      onChange(newValue)
    }
  }

  // Convert cm to meters for display
  const displayInMeters = (cm: number) => {
    return (cm / 100).toFixed(2)
  }

  // Calculate percentage for visual bar
  const percentage = ((localValue - min) / (max - min)) * 100

  // Get icon SVG based on type
  const getIcon = () => {
    switch (icon) {
      case 'width':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12H3M21 12l-4-4m4 4l-4 4M3 12l4-4m-4 4l4 4" />
          </svg>
        )
      case 'length':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v18M12 3l-4 4m4-4l4 4M12 21l-4-4m4 4l4-4" />
          </svg>
        )
      case 'height':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4" />
          </svg>
        )
    }
  }

  // Generate tick marks
  const ticks = []
  const tickCount = 5
  for (let i = 0; i <= tickCount; i++) {
    const tickValue = min + ((max - min) / tickCount) * i
    ticks.push(tickValue)
  }

  return (
    <div className={`dimension-input ${error ? 'has-error' : ''}`}>
      {/* Visual Header */}
      <div className="dimension-header">
        <div className="dimension-icon">{getIcon()}</div>
        <div className="dimension-display">
          <span className="dimension-value">{localValue}</span>
          <span className="dimension-unit">{unit}</span>
          {unit === 'cm' && (
            <span className="dimension-meters">({displayInMeters(localValue)} m)</span>
          )}
        </div>
      </div>

      {/* Slider Section */}
      <div className="dimension-slider-section">
        <div className="dimension-slider-container">
          <Slider
            value={localValue}
            onChange={handleSliderChange}
            min={min}
            max={max}
            step={step}
            className="dimension-slider"
          />
          {/* Tick marks */}
          <div className="dimension-ticks">
            {ticks.map((tick) => (
              <div
                key={tick}
                className="dimension-tick"
                style={{ left: `${((tick - min) / (max - min)) * 100}%` }}
              >
                <span className="tick-line"></span>
                <span className="tick-label">{tick}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="dimension-input-section">
        <div className="dimension-input-wrapper">
          <button
            type="button"
            className="dimension-btn decrease"
            onClick={() => {
              const newVal = Math.max(min, localValue - step)
              setLocalValue(newVal)
              onChange(newVal)
            }}
            disabled={localValue <= min}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <InputNumber
            value={localValue}
            onValueChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            suffix={` ${unit}`}
            className="dimension-number-input"
            inputClassName="dimension-number-field"
            showButtons={false}
          />

          <button
            type="button"
            className="dimension-btn increase"
            onClick={() => {
              const newVal = Math.min(max, localValue + step)
              setLocalValue(newVal)
              onChange(newVal)
            }}
            disabled={localValue >= max}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="dimension-presets">
          {[min, Math.round((min + max) / 4), Math.round((min + max) / 2), Math.round((min + max) * 3 / 4), max].map((preset) => (
            <button
              key={preset}
              type="button"
              className={`preset-btn ${localValue === preset ? 'active' : ''}`}
              onClick={() => {
                setLocalValue(preset)
                onChange(preset)
              }}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Representation */}
      <div className="dimension-visual">
        <div
          className="dimension-bar"
          style={{
            width: `${Math.max(20, percentage)}%`
          }}
        >
          <span className="bar-label">{localValue} {unit}</span>
        </div>
        <div className="dimension-scale">
          <span>{min} {unit}</span>
          <span>{max} {unit}</span>
        </div>
      </div>

      {/* Error Message */}
      {error && <span className="dimension-error">{error}</span>}

      {/* Hint */}
      <div className="dimension-hint">
        {t('configuratorForm.dimensionHint', { min, max, unit, defaultValue: `Waarde tussen ${min} en ${max} ${unit}` })}
      </div>
    </div>
  )
}
