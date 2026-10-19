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
  value,
  onChange,
  error,
  placeholder = 'Select country...',
  disabled,
  required,
  className,
}: CountrySelectProps) {
  const options = useMemo<SelectOption<string>[]>(() => {
    return COUNTRIES.map((c) => ({
      value: c.name,
      label: `${c.name} (${c.code})`,
    }))
  }, [])

  return (
    <Select<string>
      label={label}
      value={value || ''}
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
