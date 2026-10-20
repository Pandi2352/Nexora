import type { ComponentType, InputHTMLAttributes, ReactNode } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Eye, EyeOff, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/cn'

export type InputSize = 'sm' | 'md' | 'lg'
export type InputStatus = 'default' | 'error' | 'success' | 'warning'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?: ReactNode
  error?: string | string[] | ReactNode
  warning?: string | ReactNode
  success?: string | ReactNode
  hint?: string | ReactNode
  icon?: ComponentType<{ className?: string }>
  endIcon?: ComponentType<{ className?: string }>
  prefix?: ReactNode
  suffix?: ReactNode
  cornerAction?: ReactNode
  inputClassName?: string
  size?: InputSize
  status?: InputStatus
  showPasswordToggle?: boolean
  showPasswordStrength?: boolean
  allowClear?: boolean
  onClear?: () => void
  isLoading?: boolean
  showCount?: boolean
  requiredIndicator?: boolean
  optionalIndicator?: boolean
}

export const inputSizeClasses: Record<InputSize, string> = {
  sm: 'min-h-9 px-2.5 text-xs',
  md: 'min-h-10 px-3 text-sm',
  lg: 'min-h-11 px-3.5 text-sm sm:text-base',
}

export const inputStatusClasses: Record<InputStatus, string> = {
  error: 'border-red-400 focus:border-red-500',
  success: 'border-emerald-400 focus:border-emerald-500',
  warning: 'border-amber-400 focus:border-amber-500',
  default: 'border-slate-300 hover:border-slate-400 focus:border-brand-500',
}

interface InputAdornmentProps {
  isLoading?: boolean; allowClear?: boolean; hasValue?: boolean
  disabled?: boolean; readOnly?: boolean; canToggle?: boolean
  passwordVisible?: boolean; onTogglePassword?: () => void
  onClear?: () => void; EndIcon?: ComponentType<{ className?: string }>
}

export function InputAdornment({
  isLoading,
  allowClear,
  hasValue,
  disabled,
  readOnly,
  canToggle,
  passwordVisible,
  onTogglePassword,
  onClear,
  EndIcon,
}: InputAdornmentProps) {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 gap-1">
      {isLoading && <Loader2 className="size-4 animate-spin text-brand-600" aria-label="Loading" />}
      {allowClear && hasValue && !disabled && !readOnly && !isLoading && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear input"
          className="rounded-md p-1 text-slate-400 hover:text-slate-600 cursor-pointer focus-visible:outline-brand-600"
        >
          <X className="size-3.5" />
        </button>
      )}
      {canToggle && !isLoading && (
        <button
          type="button"
          disabled={disabled}
          onClick={onTogglePassword}
          aria-label={passwordVisible ? 'Hide password' : 'Show password'}
          aria-pressed={passwordVisible}
          className="rounded-md p-1 text-slate-400 hover:text-slate-600 cursor-pointer focus-visible:outline-brand-600 disabled:cursor-not-allowed"
        >
          {passwordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      )}
      {EndIcon && !canToggle && !isLoading && (
        <span className="pointer-events-none text-slate-400 pr-1">
          <EndIcon className="size-4" />
        </span>
      )}
    </div>
  )
}

interface InputFeedbackProps {
  error?: string | string[] | ReactNode
  warning?: string | ReactNode
  success?: string | ReactNode
  hint?: string | ReactNode
  errorId?: string
  warningId?: string
  successId?: string
  hintId?: string
  showCount?: boolean
  currentLength?: number
  maxLength?: number
}

export function PasswordStrengthBar({ password }: { password?: string }) {
  if (!password) return null
  const len = password.length
  let score = (len >= 8 ? 1 : 0) + (/[A-Z]/.test(password) && /[a-z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) + (/[^A-Za-z0-9]/.test(password) ? 1 : 0)
  if (len < 6) score = Math.min(score, 1)

  const cfg = [
    { label: '', bar: 'bg-slate-200', text: '' },
    { label: 'Weak', bar: 'bg-red-500', text: 'text-red-500' },
    { label: 'Fair', bar: 'bg-amber-500', text: 'text-amber-500' },
    { label: 'Good', bar: 'bg-yellow-500', text: 'text-yellow-600' },
    { label: 'Strong', bar: 'bg-emerald-500', text: 'text-emerald-600' },
  ][score] ?? { label: '', bar: 'bg-slate-200', text: '' }

  return (
    <div className="flex items-center gap-2 mt-1 select-none">
      <div className="flex-1 grid grid-cols-4 gap-1 h-1">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className={cn('h-full rounded-full transition-colors duration-150', step <= score ? cfg.bar : 'bg-slate-200')} />
        ))}
      </div>
      <span className={cn('text-[10px] font-normal tracking-wide', cfg.text)}>{cfg.label}</span>
    </div>
  )
}

export function InputFeedback({
  error,
  warning,
  success,
  hint,
  errorId,
  warningId,
  successId,
  hintId,
  showCount,
  currentLength = 0,
  maxLength,
}: InputFeedbackProps) {
  if (!error && !warning && !success && !hint && !showCount) return null

  return (
    <div className="flex items-start justify-between gap-2 min-h-[1.25rem]">
      <div className="flex-1">
        {error ? (
          <div id={errorId} role="alert" className="space-y-0.5">
            {Array.isArray(error) ? (
              error.map((msg, i) => (
                <p key={i} className="flex items-center gap-1.5 text-xs text-red-500 font-normal">
                  <AlertCircle className="size-3.5 shrink-0 stroke-[1.5]" aria-hidden="true" />
                  <span>{msg}</span>
                </p>
              ))
            ) : (
              <p className="flex items-center gap-1.5 text-xs text-red-500 font-normal">
                <AlertCircle className="size-3.5 shrink-0 stroke-[1.5]" aria-hidden="true" />
                <span>{error}</span>
              </p>
            )}
          </div>
        ) : warning ? (
          <p id={warningId} className="flex items-center gap-1.5 text-xs text-amber-600 font-normal">
            <AlertTriangle className="size-3.5 shrink-0 stroke-[1.5]" aria-hidden="true" />
            <span>{warning}</span>
          </p>
        ) : success ? (
          <p id={successId} className="flex items-center gap-1.5 text-xs text-emerald-600 font-normal">
            <CheckCircle2 className="size-3.5 shrink-0 stroke-[1.5]" aria-hidden="true" />
            <span>{success}</span>
          </p>
        ) : hint ? (
          <p id={hintId} className="text-[11px] text-slate-400 font-normal leading-normal">{hint}</p>
        ) : null}
      </div>

      {showCount && (
        <span className="text-[11px] text-slate-400 font-normal shrink-0 pt-0.5">
          {currentLength}{maxLength ? `/${maxLength}` : ''}
        </span>
      )}
    </div>
  )
}
