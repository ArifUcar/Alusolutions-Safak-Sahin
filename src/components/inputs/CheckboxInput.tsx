import type { ConfiguratorOption, MultiLanguageText } from '../../lib/supabase'

interface CheckboxInputProps {
  options: ConfiguratorOption[]
  value: string[]
  onChange: (value: string[]) => void
  error?: string
  getLocalizedText: (text: MultiLanguageText | undefined) => string
}

export default function CheckboxInput({ options, value = [], onChange, error, getLocalizedText }: CheckboxInputProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue])
    } else {
      onChange(value.filter(v => v !== optionValue))
    }
  }

  return (
    <div className="input-group">
      <div className="checkbox-list">
        {options.map((option) => (
          <label key={option.id} className="checkbox-option">
            <input
              type="checkbox"
              value={option.option_value}
              checked={value.includes(option.option_value)}
              onChange={(e) => handleChange(option.option_value, e.target.checked)}
            />
            <span className="checkbox-label">
              {getLocalizedText(option.label)}
              {option.description && getLocalizedText(option.description) && (
                <small className="checkbox-description">{getLocalizedText(option.description)}</small>
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
