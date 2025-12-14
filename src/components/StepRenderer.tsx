import type { ConfiguratorStep, MultiLanguageText } from '../lib/supabase'
import RadioImageInput from './inputs/RadioImageInput'
import RadioInput from './inputs/RadioInput'
import CheckboxInput from './inputs/CheckboxInput'
import TextInput from './inputs/TextInput'
import NumberInput from './inputs/NumberInput'
import SelectInput from './inputs/SelectInput'
import TextareaInput from './inputs/TextareaInput'

interface StepRendererProps {
  step: ConfiguratorStep
  value: any
  onChange: (value: any) => void
  error?: string
  currentLang: keyof MultiLanguageText
}

export default function StepRenderer({ step, value, onChange, error, currentLang }: StepRendererProps) {
  const getLocalizedText = (text: MultiLanguageText | undefined): string => {
    if (!text) return ''
    return text[currentLang] || text['nl'] || ''
  }

  const options = step.configurator_options || []

  switch (step.input_type) {
    case 'radio-image':
      return (
        <RadioImageInput
          options={options}
          value={value}
          onChange={onChange}
          error={error}
          getLocalizedText={getLocalizedText}
        />
      )

    case 'radio':
      return (
        <RadioInput
          options={options}
          value={value}
          onChange={onChange}
          error={error}
          getLocalizedText={getLocalizedText}
        />
      )

    case 'checkbox':
      return (
        <CheckboxInput
          options={options}
          value={value}
          onChange={onChange}
          error={error}
          getLocalizedText={getLocalizedText}
        />
      )

    case 'text':
      return (
        <TextInput
          value={value}
          onChange={onChange}
          error={error}
          placeholder={getLocalizedText(step.help_text)}
        />
      )

    case 'number':
      return (
        <NumberInput
          value={value}
          onChange={onChange}
          error={error}
          min={step.min_value}
          max={step.max_value}
          placeholder={getLocalizedText(step.help_text)}
        />
      )

    case 'select':
      return (
        <SelectInput
          options={options}
          value={value}
          onChange={onChange}
          error={error}
          getLocalizedText={getLocalizedText}
          placeholder="Selecteer een optie..."
        />
      )

    case 'textarea':
      return (
        <TextareaInput
          value={value}
          onChange={onChange}
          error={error}
          placeholder={getLocalizedText(step.help_text)}
        />
      )

    default:
      return <div>Onbekend input type: {step.input_type}</div>
  }
}
