import { useMemo } from 'react'
import { Select } from './select/Select'
import type { SelectOption } from './select/select.types'
import { COUNTRIES } from './countries-data'

export interface CountrySelectProps {
  label?: string
  value?: string
  onChange: (country: string) => void
  error?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export function CountrySelect({
  label = 'Country',
  value = '',
  onChange,
  error,
  placeholder = 'Select country...',
  disabled,
  required,
  className,
}: CountrySelectProps) {
  const matchedCountry = useMemo(() => {
    if (!value || typeof value !== 'string') return null
    const query = value.trim().toLowerCase()
    return COUNTRIES.find(
      (c) => c.name.toLowerCase() === query || c.code.toLowerCase() === query,
    )
  }, [value])

  const normalizedValue = matchedCountry ? matchedCountry.name : (value ? value.trim() : '')

  const options = useMemo<SelectOption<string>[]>(() => {
    const list: SelectOption<string>[] = COUNTRIES.map((c) => ({
      value: c.name,
      label: `${c.name} (${c.code})`,
    }))

    if (normalizedValue && !list.some((o) => o.value.toLowerCase() === normalizedValue.toLowerCase())) {
      list.unshift({ value: normalizedValue, label: normalizedValue })
    }
    return list
  }, [normalizedValue])

  return (
    <Select<string>
      label={label}
      value={normalizedValue}
      options={options}
      onChange={(val: string) => onChange(val || '')}
      placeholder={placeholder}
      searchable
      clearable
      error={error}
      disabled={disabled}
      required={required}
      className={className}
    />
  )
}
