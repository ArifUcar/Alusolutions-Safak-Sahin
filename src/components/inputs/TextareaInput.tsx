interface TextareaInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
}

export default function TextareaInput({ value, onChange, error, placeholder }: TextareaInputProps) {
  return (
    <div className="input-group">
      <textarea
        className="textarea-input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}
