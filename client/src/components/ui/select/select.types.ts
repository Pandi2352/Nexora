import type { ComponentType, ReactNode } from 'react'

export interface SelectOption<T = string> {
  value: T
  label: string
  description?: string
  icon?: ComponentType<{ className?: string }>
  disabled?: boolean
  badge?: string
}

export type SelectSize = 'sm' | 'md' | 'lg'

export interface BaseSelectProps<T = string> {
  options: SelectOption<T>[]
  placeholder?: string
  label?: string
  error?: string
  warning?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  size?: SelectSize
  searchable?: boolean
  clearable?: boolean
  className?: string
  triggerClassName?: string
  menuClassName?: string
  icon?: ComponentType<{ className?: string }>
  id?: string
  cornerAction?: ReactNode
}

export interface SingleSelectProps<T = string> extends BaseSelectProps<T> {
  multiple?: false
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
}

export interface MultiSelectProps<T = string> extends BaseSelectProps<T> {
  multiple: true
  value?: T[]
  defaultValue?: T[]
  onChange?: (value: T[]) => void
}

export type SelectProps<T = string> = SingleSelectProps<T> | MultiSelectProps<T>
