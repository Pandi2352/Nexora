import type { ComponentProps } from 'react'
import { Loader2 } from 'lucide-react'
import { buttonVariants, type ButtonSize, type ButtonVariant } from './button-variants'

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export function Button({
  variant,
  size,
  className,
  loading = false,
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}
