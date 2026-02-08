import { useState, useEffect } from 'react'
import { Slider } from 'primereact/slider'
import { InputNumber } from 'primereact/inputnumber'
import type { ConfiguratorOption, MultiLanguageText } from '../../lib/supabase'
import './DimensionInput.css'

interface DimensionsInputProps {
  options: ConfiguratorOption[]
  value: Record<string, number>
  onChange: (value: Record<string, number>) => void
  error?: string
  min?: number
  max?: number
  step?: number
  getLocalizedText: (text: MultiLanguageText | undefined) => string
}

export default function DimensionsInput({
  options,
  value,
  onChange,
  error,
  min = 100,
  max = 1200,
  step = 10,
  getLocalizedText
}: DimensionsInputProps) {
  const [localValues, setLocalValues] = useState<Record<string, number>>(value || {})

  useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(localValues)) {
      setLocalValues(value)
    }
  }, [value])

  // Initialize values for all options if not set
  useEffect(() => {
    const initialValues: Record<string, number> = {}
    let hasChanges = false

    options.forEach(opt => {
      if (localValues[opt.option_value] === undefined) {
        initialValues[opt.option_value] = min
        hasChanges = true
      } else {
        initialValues[opt.option_value] = localValues[opt.option_value]
      }
    })

    if (hasChanges) {
      setLocalValues(initialValues)
      onChange(initialValues)
    }
  }, [options])

  const handleChange = (optionValue: string, newValue: number) => {
    const updated = { ...localValues, [optionValue]: newValue }
    setLocalValues(updated)
    onChange(updated)
  }

  const getIcon = (optionValue: string) => {
    const lower = optionValue.toLowerCase()
    if (lower.includes('breed') || lower.includes('width')) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12H3M21 12l-4-4m4 4l-4 4M3 12l4-4m-4 4l4 4" />
        </svg>
      )
    }
    if (lower.includes('diep') || lower.includes('length') || lower.includes('leng')) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v18M12 3l-4 4m4-4l4 4M12 21l-4-4m4 4l4-4" />
        </svg>
      )
    }
    if (lower.includes('hoog') || lower.includes('height')) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4" />
        </svg>
      )
    }
    // Default icon
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12H3M21 12l-4-4m4 4l-4 4M3 12l4-4m-4 4l4 4" />
      </svg>
    )
  }

  const displayInMeters = (cm: number) => {
    return (cm / 100).toFixed(2)
  }

  // Generate tick marks
  const generateTicks = () => {
    const ticks = []
    const tickCount = 5
    for (let i = 0; i <= tickCount; i++) {
      const tickValue = min + ((max - min) / tickCount) * i
      ticks.push(tickValue)
    }
    return ticks
  }

  const ticks = generateTicks()

  return (
    <div className={`dimensions-input ${error ? 'has-error' : ''}`}>
      {options.map((option) => {
        const currentValue = localValues[option.option_value] || min
        const percentage = ((currentValue - min) / (max - min)) * 100

        return (
          <div key={option.id} className="dimension-input" style={{ marginBottom: '1.5rem' }}>
            {/* Visual Header */}
            <div className="dimension-header">
              <div className="dimension-icon">{getIcon(option.option_value)}</div>
              <div className="dimension-info">
                <span className="dimension-label">{getLocalizedText(option.label)}</span>
                <div className="dimension-display">
                  <span className="dimension-value">{currentValue}</span>
                  <span className="dimension-unit">cm</span>
                  <span className="dimension-meters">({displayInMeters(currentValue)} m)</span>
                </div>
              </div>
            </div>

            {/* Slider Section */}
            <div className="dimension-slider-section">
              <div className="dimension-slider-container">
                <Slider
                  value={currentValue}
                  onChange={(e) => handleChange(option.option_value, e.value as number)}
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
                    const newVal = Math.max(min, currentValue - step)
                    handleChange(option.option_value, newVal)
                  }}
                  disabled={currentValue <= min}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>

                <InputNumber
                  value={currentValue}
                  onValueChange={(e) => {
                    if (e.value !== null && e.value !== undefined && e.value >= min && e.value <= max) {
                      handleChange(option.option_value, e.value)
                    }
                  }}
                  min={min}
                  max={max}
                  step={step}
                  suffix=" cm"
                  className="dimension-number-input"
                  inputClassName="dimension-number-field"
                  showButtons={false}
                />

                <button
                  type="button"
                  className="dimension-btn increase"
                  onClick={() => {
                    const newVal = Math.min(max, currentValue + step)
                    handleChange(option.option_value, newVal)
                  }}
                  disabled={currentValue >= max}
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
                    className={`preset-btn ${currentValue === preset ? 'active' : ''}`}
                    onClick={() => handleChange(option.option_value, preset)}
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
                style={{ width: `${Math.max(20, percentage)}%` }}
              >
                <span className="bar-label">{currentValue} cm</span>
              </div>
              <div className="dimension-scale">
                <span>{min} cm</span>
                <span>{max} cm</span>
              </div>
            </div>
          </div>
        )
      })}

      {/* Error Message */}
      {error && <span className="dimension-error">{error}</span>}

      {/* Hint */}
      <div className="dimension-hint">
        {min} - {max} cm arası değer girebilirsiniz
      </div>
    </div>
  )
}
