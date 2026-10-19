import type { ComponentProps } from 'react'
import { buttonVariants, type ButtonSize, type ButtonVariant } from './button-variants'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonVariants({ variant, size, className })} {...props} />
}
