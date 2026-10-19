import { useCallback, useEffect, useState, type RefObject } from 'react'

export type Placement = 'top' | 'bottom'

export interface AutoPlacementOptions {
  /**
   * Preferred direction. If 'top' or 'bottom', forces that direction.
   * If 'auto' (default), dynamically measures viewport space above and below.
   */
  preferred?: 'auto' | 'top' | 'bottom'
  /** Minimum pixel space required below the element before flipping to top. Default: 280. */
  minSpace?: number
  /** Margin from viewport edges in pixels. Default: 12. */
  boundaryMargin?: number
}

/**
 * Automatically computes whether a floating menu (select, dropdown) should open
 * below or above its trigger element depending on viewport collision.
 */
export function useAutoPlacement(
  triggerRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  options: AutoPlacementOptions = {},
) {
  const { preferred = 'auto', minSpace = 280, boundaryMargin = 12 } = options
  const [placement, setPlacement] = useState<Placement>(
    preferred === 'top' ? 'top' : 'bottom',
  )
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return

    if (preferred === 'top' || preferred === 'bottom') {
      setPlacement(preferred)
      return
    }

    const rect = triggerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top

    // If space below is less than required minimum and space above has more room, flip to top
    if (spaceBelow < minSpace && spaceAbove > spaceBelow) {
      setPlacement('top')
      setMaxHeight(Math.max(120, spaceAbove - boundaryMargin))
    } else {
      setPlacement('bottom')
      setMaxHeight(Math.max(120, spaceBelow - boundaryMargin))
    }
  }, [triggerRef, preferred, minSpace, boundaryMargin])

  useEffect(() => {
    if (!isOpen) return

    updatePosition()

    const handleScrollOrResize = () => {
      updatePosition()
    }

    window.addEventListener('resize', handleScrollOrResize)
    // Capture scroll on any parent scrollable container
    window.addEventListener('scroll', handleScrollOrResize, true)

    return () => {
      window.removeEventListener('resize', handleScrollOrResize)
      window.removeEventListener('scroll', handleScrollOrResize, true)
    }
  }, [isOpen, updatePosition])

  return { placement, maxHeight, updatePosition }
}
