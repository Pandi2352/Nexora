import { forwardRef } from 'react'
import { Search } from 'lucide-react'
import { Input, type InputProps } from './Input'

export interface SearchInputProps extends Omit<InputProps, 'prefix'> {
  /** Optional custom clear callback */
  onClear?: () => void
}

/**
 * Standardized SearchInput primitive with search icon and clear 'X' icon.
 * Clears on clicking 'X' or pressing Escape when focused.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      placeholder = 'Search...',
      icon = Search,
      allowClear = true,
      size = 'md',
      'aria-label': ariaLabel = 'Search',
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        const syntheticEvent = {
          target: { value: '' },
          currentTarget: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>
        props.onChange?.(syntheticEvent)
        props.onClear?.()
      }
      onKeyDown?.(e)
    }

    return (
      <Input
        ref={ref}
        type="text"
        icon={icon}
        allowClear={allowClear}
        size={size}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  },
)

SearchInput.displayName = 'SearchInput'
