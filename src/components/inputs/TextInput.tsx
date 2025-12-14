interface TextInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
}

export default function TextInput({ value, onChange, error, placeholder }: TextInputProps) {
  return (
    <div className="input-group">
      <input
        type="text"
        className="text-input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}
