import type { ConfiguratorOption, MultiLanguageText } from '../../lib/supabase'

interface RadioInputProps {
  options: ConfiguratorOption[]
  value: string
  onChange: (value: string) => void
  error?: string
  getLocalizedText: (text: MultiLanguageText | undefined) => string
}

export default function RadioInput({ options, value, onChange, error, getLocalizedText }: RadioInputProps) {
  return (
    <div className="input-group">
      <div className="radio-list">
        {options.map((option) => (
          <label key={option.id} className="radio-option">
            <input
              type="radio"
              name="radio-group"
              value={option.option_value}
              checked={value === option.option_value}
              onChange={(e) => onChange(e.target.value)}
            />
            <span className="radio-label">
              {getLocalizedText(option.label)}
              {option.description && getLocalizedText(option.description) && (
                <small className="radio-description">{getLocalizedText(option.description)}</small>
              )}
              {option.price_modifier !== 0 && (
                <span className="option-price-inline">
                  ({option.price_modifier > 0 ? '+' : ''}{option.price_modifier}€)
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}
