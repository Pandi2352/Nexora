import { type ComponentType, type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: ComponentType<{ className?: string }>
  inputClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputClassName,
      type = 'text',
      label,
      error,
      hint,
      icon: Icon,
      id: customId,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = customId || generatedId
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    return (
      <div className={cn('w-full space-y-1.5', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-slate-700',
              disabled && 'text-slate-400 cursor-not-allowed',
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Icon className="size-4" />
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
              Icon && 'pl-9',
              error && 'border-red-500 focus-visible:outline-red-500',
              inputClassName,
            )}
            {...props}
          />
        </div>
        {error ? (
          <p id={errorId} className="text-xs text-red-600">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    )
  },
)
Input.displayName = 'Input'
