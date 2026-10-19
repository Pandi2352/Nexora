import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'

export interface OtpInputProps {
  /** The current OTP string value. */
  value: string
  /** Callback fired whenever any digit is changed. */
  onChange: (value: string) => void
  /** Optional callback fired when all digits have been entered. */
  onComplete?: (value: string) => void
  /** Total number of digits (default 6). */
  length?: number
  /** Disables all digit inputs. */
  disabled?: boolean
  /** Shows danger / error border states. */
  error?: boolean
  /** Whether the first empty digit automatically focuses on mount (default true). */
  autoFocus?: boolean
  /** Size variant: sm, md (default), lg. */
  size?: 'sm' | 'md' | 'lg'
  /** Optional label or aria-label for the whole field. */
  ariaLabel?: string
  /** Optional container class name. */
  className?: string
  /** Optional single box class name override. */
  inputClassName?: string
}

const sizeClasses = {
  sm: 'size-9 sm:size-10 text-base',
  md: 'size-11 sm:size-12 text-xl',
  lg: 'size-13 sm:size-14 text-2xl',
}

/**
 * Common reusable OTP / PIN / 2FA digit input component with keyboard navigation,
 * clipboard paste handling, auto-focus, and auto-complete triggers.
 */
export function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled = false,
  error = false,
  autoFocus = true,
  size = 'md',
  ariaLabel = 'Verification code',
  className,
  inputClassName,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const digits = Array.from({ length }, (_, i) => value[i] || '')

  useEffect(() => {
    if (autoFocus && !disabled) {
      // Focus the first empty digit, or the first box
      const firstEmpty = digits.findIndex((d) => !d)
      const targetIndex = firstEmpty === -1 ? 0 : firstEmpty
      inputRefs.current[targetIndex]?.focus()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (index: number, char: string) => {
    const cleaned = char.replace(/\D/g, '')
    if (!cleaned) return

    const newDigits = [...digits]
    newDigits[index] = cleaned[cleaned.length - 1] ?? ''
    const nextVal = newDigits.join('').slice(0, length)
    onChange(nextVal)

    if (nextVal.length === length && onComplete) {
      onComplete(nextVal)
    }

    if (cleaned && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newDigits = [...digits]
      if (newDigits[index]) {
        newDigits[index] = ''
        onChange(newDigits.join(''))
      } else if (index > 0) {
        newDigits[index - 1] = ''
        onChange(newDigits.join(''))
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) {
      onChange(pasted)
      if (pasted.length === length && onComplete) {
        onComplete(pasted)
      }
      const nextIndex = Math.min(pasted.length, length - 1)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('flex items-center justify-center gap-2 sm:gap-2.5', className)}
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[i] || ''}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            'text-center font-bold font-mono rounded-md border bg-white transition-colors focus:outline-none cursor-pointer',
            sizeClasses[size],
            error
              ? 'border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-red-600'
              : 'border-slate-300 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 text-slate-900',
            disabled && 'bg-slate-50 cursor-not-allowed opacity-60',
            inputClassName,
          )}
        />
      ))}
    </div>
  )
}
