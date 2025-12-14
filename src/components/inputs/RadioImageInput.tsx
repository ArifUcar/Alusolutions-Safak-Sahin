import type { ConfiguratorOption, MultiLanguageText } from '../../lib/supabase'

interface RadioImageInputProps {
  options: ConfiguratorOption[]
  value: string
  onChange: (value: string) => void
  error?: string
  getLocalizedText: (text: MultiLanguageText | undefined) => string
}

export default function RadioImageInput({ options, value, onChange, error, getLocalizedText }: RadioImageInputProps) {
  return (
    <div className="input-group">
      <div className="radio-image-grid">
        {options.map((option) => {
          const isSelected = value === option.option_value
          return (
            <div
              key={option.id}
              className={`radio-image-option ${isSelected ? 'selected' : ''}`}
              onClick={() => onChange(option.option_value)}
            >
              {option.image_url && (
                <div className="option-image-wrapper">
                  <img
                    src={option.image_url}
                    alt={getLocalizedText(option.label)}
                    className="option-image"
                  />
                </div>
              )}
              <div className="option-label">
                <span className="option-label-text">{getLocalizedText(option.label)}</span>
                {option.description && getLocalizedText(option.description) && (
                  <span className="option-description">{getLocalizedText(option.description)}</span>
                )}
                {option.price_modifier !== 0 && (
                  <span className="option-price">
                    {option.price_modifier > 0 ? '+' : ''}{option.price_modifier}€
                  </span>
                )}
              </div>
              {isSelected && (
                <div className="option-checkmark">✓</div>
              )}
            </div>
          )
        })}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}
