interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  error?: string
  min?: number
  max?: number
  placeholder?: string
}

export default function NumberInput({ value, onChange, error, min, max, placeholder }: NumberInputProps) {
  return (
    <div className="input-group">
      <input
        type="number"
        className="number-input"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        placeholder={placeholder}
      />
      {error && <span className="input-error">{error}</span>}
      {(min !== undefined || max !== undefined) && (
        <small className="input-hint">
          {min !== undefined && max !== undefined
            ? `Tussen ${min} en ${max}`
            : min !== undefined
            ? `Minimaal ${min}`
            : `Maximaal ${max}`}
        </small>
      )}
    </div>
  )
}
