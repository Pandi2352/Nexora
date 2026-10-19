import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  showCount?: boolean
  textareaClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      textareaClassName,
      label,
      hint,
      error,
      showCount = false,
      maxLength,
      id: customId,
      disabled,
      required,
      rows = 3,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const textareaId = customId || generatedId
    const currentLength = String(value ?? defaultValue ?? '').length

    return (
      <div className={cn('w-full space-y-1', className)}>
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={textareaId} className="block text-xs font-medium text-slate-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            {showCount && maxLength && (
              <span className="text-[11px] text-slate-400">
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          className={cn(
            'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400',
            'transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500',
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500',
            textareaClassName,
          )}
          {...props}
        />

        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : hint ? (
          <p className="text-[11px] text-slate-500">{hint}</p>
        ) : null}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
