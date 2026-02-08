import type { ConfiguratorOption, MultiLanguageText } from '../../lib/supabase'

interface SelectInputProps {
  options: ConfiguratorOption[]
  value: string
  onChange: (value: string) => void
  error?: string
  getLocalizedText: (text: MultiLanguageText | undefined) => string
  placeholder?: string
}

export default function SelectInput({ options, value, onChange, error, getLocalizedText, placeholder }: SelectInputProps) {
  return (
    <div className="input-group">
      <select
        className="select-input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder || 'Selecteer...'}</option>
        {options.map((option) => (
          <option key={option.id} value={option.option_value}>
            {getLocalizedText(option.label)}
          </option>
        ))}
      </select>
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}
