import { useId, useRef, useState, type MouseEvent } from 'react'
import { cn } from '@/lib/cn'
import { InputFeedback } from '../input-helpers'
import { SelectMenu } from './SelectMenu'
import { SelectTrigger } from './SelectTrigger'
import type { MultiSelectProps, SelectOption, SelectProps, SingleSelectProps } from './select.types'

export function Select<T = string>(props: MultiSelectProps<T>): React.JSX.Element
export function Select<T = string>(props: SingleSelectProps<T>): React.JSX.Element
export function Select<T = string>(props: SelectProps<T>): React.JSX.Element {
  const isMulti = Boolean(props.multiple)
  const singleProps = !isMulti ? (props as SingleSelectProps<T>) : undefined
  const multiProps = isMulti ? (props as MultiSelectProps<T>) : undefined

  const {
    options,
    placeholder = 'Select an option...',
    label,
    error,
    warning,
    hint,
    disabled = false,
    required = false,
    size = 'md',
    searchable,
    clearable = false,
    className,
    triggerClassName,
    menuClassName,
    icon,
    id: customId,
    cornerAction,
  } = props

  const generatedId = useId()
  const selectId = customId || generatedId
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const [uncontrolledSingle, setUncontrolledSingle] = useState<T | undefined>(
    singleProps?.defaultValue,
  )
  const [uncontrolledMulti, setUncontrolledMulti] = useState<T[]>(
    multiProps?.defaultValue || [],
  )

  const currentSingle = singleProps
    ? singleProps.value !== undefined
      ? singleProps.value
      : uncontrolledSingle
    : undefined

  const currentMulti: T[] = multiProps
    ? multiProps.value !== undefined
      ? multiProps.value
      : uncontrolledMulti
    : []

  const selectedValues: T[] = isMulti
    ? currentMulti
    : currentSingle !== undefined
      ? [currentSingle]
      : []

  const selectedOptions = options.filter((opt) => selectedValues.includes(opt.value))

  const handleToggle = () => {
    if (!disabled) setIsOpen((prev) => !prev)
  }

  const handleSelectOption = (opt: SelectOption<T>) => {
    if (isMulti && multiProps) {
      const isSelected = currentMulti.includes(opt.value)
      const next = isSelected ? currentMulti.filter((v) => v !== opt.value) : [...currentMulti, opt.value]
      if (multiProps.value === undefined) setUncontrolledMulti(next)
      multiProps.onChange?.(next)
    } else if (singleProps) {
      if (singleProps.value === undefined) setUncontrolledSingle(opt.value)
      singleProps.onChange?.(opt.value)
      setIsOpen(false)
    }
  }

  const handleRemoveItem = (val: T, e: MouseEvent) => {
    e.stopPropagation()
    if (!isMulti || !multiProps) return
    const next = currentMulti.filter((v) => v !== val)
    if (multiProps.value === undefined) setUncontrolledMulti(next)
    multiProps.onChange?.(next)
  }

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation()
    if (isMulti && multiProps) {
      if (multiProps.value === undefined) setUncontrolledMulti([])
      multiProps.onChange?.([])
    } else if (singleProps) {
      if (singleProps.value === undefined) setUncontrolledSingle(undefined)
      singleProps.onChange?.(undefined as unknown as T)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false)
    }
  }

  return (
    <div
      ref={containerRef}
      onBlur={handleBlur}
      className={cn('relative w-full space-y-1', className)}
    >
      {(label || cornerAction) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label
              htmlFor={selectId}
              className={cn(
                'block text-xs sm:text-sm font-medium text-slate-700',
                disabled && 'cursor-not-allowed text-slate-400',
              )}
            >
              {label}
              {required && <span className="ml-1 text-red-500 font-normal">*</span>}
            </label>
          )}
          {cornerAction && <div className="text-xs text-slate-500">{cornerAction}</div>}
        </div>
      )}

      <div className="relative">
        <SelectTrigger<T>
          id={selectId}
          isOpen={isOpen}
          disabled={disabled}
          error={!!error}
          size={size}
          placeholder={placeholder}
          multiple={isMulti}
          selectedOptions={selectedOptions}
          icon={icon}
          clearable={clearable}
          className={triggerClassName}
          onToggle={handleToggle}
          onRemoveItem={handleRemoveItem}
          onClear={handleClear}
        />

        {isOpen && (
          <SelectMenu<T>
            options={options}
            selectedValues={selectedValues}
            multiple={isMulti}
            searchable={searchable ?? options.length > 5}
            className={menuClassName}
            onSelect={handleSelectOption}
          />
        )}
      </div>

      <InputFeedback
        error={error}
        warning={warning}
        hint={hint}
        errorId={`${selectId}-error`}
        hintId={`${selectId}-hint`}
      />
    </div>
  )
}
