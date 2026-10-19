import { forwardRef, useId, useState } from 'react'
import { cn } from '@/lib/cn'
import {
  type InputProps,
  type InputSize,
  type InputStatus,
  InputAdornment,
  InputFeedback,
  PasswordStrengthBar,
  inputSizeClasses,
  inputStatusClasses,
} from './input-helpers'

export type { InputProps, InputSize, InputStatus }

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className, inputClassName, type = 'text', label, error, warning, success, hint,
      icon: Icon, endIcon: EndIcon, prefix, suffix, cornerAction, id: customId,
      disabled, readOnly, required, size = 'md', status: customStatus,
      showPasswordToggle = true, showPasswordStrength = false, allowClear = false,
      onClear, isLoading = false, showCount = false, requiredIndicator = true,
      optionalIndicator = false, maxLength, value, defaultValue, onChange,
      'aria-describedby': externalDescribedBy, ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = customId || generatedId
    const errorId = `${inputId}-error`
    const warningId = `${inputId}-warning`
    const hintId = `${inputId}-hint`
    const successId = `${inputId}-success`

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [innerVal, setInnerVal] = useState<string>(String(value ?? defaultValue ?? ''))

    const isPassword = type === 'password'
    const canToggle = isPassword && showPasswordToggle
    const inputType = canToggle && passwordVisible ? 'text' : type

    const effectiveStatus: InputStatus =
      customStatus || (error ? 'error' : success ? 'success' : warning ? 'warning' : 'default')

    const currentVal = value !== undefined ? String(value) : innerVal
    const hasValue = currentVal.length > 0

    const handleClear = () => {
      setInnerVal('')
      onClear?.()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) setInnerVal(e.target.value)
      onChange?.(e)
    }

    const describedBy = [
      externalDescribedBy,
      error ? errorId : undefined,
      warning ? warningId : undefined,
      success ? successId : undefined,
      hint ? hintId : undefined,
    ].filter(Boolean).join(' ') || undefined

    return (
      <div className={cn('w-full space-y-1', className)}>
        {(label || cornerAction) && (
          <div className="flex items-center justify-between gap-2">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  'block text-xs sm:text-sm font-medium text-slate-700',
                  disabled && 'cursor-not-allowed text-slate-400',
                )}
              >
                {label}
                {required && requiredIndicator && (
                  <span className="ml-1 text-red-500 font-normal" aria-hidden="true">*</span>
                )}
                {!required && optionalIndicator && (
                  <span className="ml-1 text-slate-400 text-xs font-normal">(optional)</span>
                )}
              </label>
            )}
            {cornerAction && <div className="text-xs text-slate-500">{cornerAction}</div>}
          </div>
        )}

        <div className="relative flex rounded-md">
          {prefix && (
            <span className="inline-flex items-center px-3 border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-xs sm:text-sm rounded-l-md select-none shrink-0">
              {prefix}
            </span>
          )}

          <div className="relative w-full">
            {Icon && (
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400',
                  disabled && 'text-slate-300',
                )}
              >
                <Icon className="size-4" />
              </span>
            )}

            <input
              {...props}
              id={inputId}
              ref={ref}
              type={inputType}
              value={value}
              defaultValue={defaultValue}
              maxLength={maxLength}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              aria-invalid={effectiveStatus === 'error'}
              aria-describedby={describedBy}
              onChange={handleChange}
              className={cn(
                'w-full rounded-md border bg-white text-slate-900 placeholder:text-slate-400 transition-colors',
                'outline-none focus:outline-none focus-visible:outline-none',
                'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:hover:border-slate-300',
                'read-only:cursor-default read-only:bg-slate-50',
                inputSizeClasses[size],
                prefix && 'rounded-l-none',
                suffix && 'rounded-r-none',
                Icon && 'pl-9',
                (canToggle || allowClear || isLoading || EndIcon) && 'pr-10',
                inputStatusClasses[effectiveStatus],
                inputClassName,
              )}
            />

            <InputAdornment
              isLoading={isLoading}
              allowClear={allowClear}
              hasValue={hasValue}
              disabled={disabled}
              readOnly={readOnly}
              canToggle={canToggle}
              passwordVisible={passwordVisible}
              onTogglePassword={() => setPasswordVisible((v) => !v)}
              onClear={handleClear}
              EndIcon={EndIcon}
            />
          </div>

          {suffix && (
            <span className="inline-flex items-center px-3 border border-l-0 border-slate-300 bg-slate-50 text-slate-500 text-xs sm:text-sm rounded-r-md select-none shrink-0">
              {suffix}
            </span>
          )}
        </div>

        {isPassword && showPasswordStrength && (
          <PasswordStrengthBar password={currentVal} />
        )}

        <InputFeedback
          error={error}
          warning={warning}
          success={success}
          hint={hint}
          errorId={errorId}
          warningId={warningId}
          successId={successId}
          hintId={hintId}
          showCount={showCount}
          currentLength={currentVal.length}
          maxLength={maxLength}
        />
      </div>
    )
  },
)

Input.displayName = 'Input'
