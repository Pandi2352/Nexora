import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  disabled?: boolean
  error?: boolean
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  error = false,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const digits = Array.from({ length }, (_, i) => value[i] || '')

  const handleChange = (index: number, char: string) => {
    // Only accept numeric digits
    const cleaned = char.replace(/\D/g, '')
    if (!cleaned) return

    const newDigits = [...digits]
    newDigits[index] = cleaned[cleaned.length - 1] ?? ''
    const nextVal = newDigits.join('').slice(0, length)
    onChange(nextVal)

    // Move to next input if filled
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
      const nextIndex = Math.min(pasted.length, length - 1)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-2.5">
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
          autoFocus={i === 0}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`size-11 sm:size-12 text-center text-xl font-bold font-mono rounded-md border bg-white transition-colors focus:outline-none ${
            error
              ? 'border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-red-600'
              : 'border-slate-300 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 text-slate-900'
          } ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : 'cursor-text'}`}
        />
      ))}
    </div>
  )
}
