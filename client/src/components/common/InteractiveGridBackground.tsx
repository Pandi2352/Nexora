import { useEffect, useRef } from 'react'

interface InteractiveGridBackgroundProps {
  cellSize?: number
  radius?: number
  className?: string
}

interface ActiveCell {
  col: number
  row: number
  alpha: number
}

/**
 * Interactive square-grid background.
 * Default view is completely clean (no visible squares).
 * When hovering, a subtle black square-grid spotlight emerges around the cursor,
 * and the hovered square illuminates with a clean dark/black border and fill.
 */
export function InteractiveGridBackground({
  cellSize = 52,
  radius = 240,
  className = '',
}: InteractiveGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const cellsRef = useRef<Map<string, ActiveCell>>(new Map())
  const animFrameRef = useRef<number | null>(null)
  const isRunningRef = useRef(false)
  const mouseRef = useRef({ x: -1000, y: -1000, active: false, opacity: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1

    const resize = () => {
      dpr = window.devicePixelRatio || 1
      width = canvas.parentElement?.clientWidth || window.innerWidth
      height = canvas.parentElement?.clientHeight || window.innerHeight

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      draw()
    }

    const draw = () => {
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, width, height)

      const mouse = mouseRef.current
      if (mouse.active && mouse.opacity < 1) {
        mouse.opacity = Math.min(1, mouse.opacity + 0.1)
      } else if (!mouse.active && mouse.opacity > 0) {
        mouse.opacity = Math.max(0, mouse.opacity - 0.03)
      }

      if (mouse.opacity > 0) {
        // Compute grid bounds around cursor
        const minX = Math.max(0, Math.floor((mouse.x - radius) / cellSize) * cellSize)
        const maxX = Math.min(width, Math.ceil((mouse.x + radius) / cellSize) * cellSize)
        const minY = Math.max(0, Math.floor((mouse.y - radius) / cellSize) * cellSize)
        const maxY = Math.min(height, Math.ceil((mouse.y + radius) / cellSize) * cellSize)

        // Radial spotlight clipping mask for the square grid
        ctx.save()
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2)
        ctx.clip()

        // Draw delicate light-slate grid lines only in spotlight
        ctx.lineWidth = 1
        ctx.strokeStyle = `rgba(226, 232, 240, ${mouse.opacity * 0.85})`

        ctx.beginPath()
        for (let x = minX; x <= maxX; x += cellSize) {
          ctx.moveTo(x + 0.5, minY)
          ctx.lineTo(x + 0.5, maxY)
        }
        for (let y = minY; y <= maxY; y += cellSize) {
          ctx.moveTo(minX, y + 0.5)
          ctx.lineTo(maxX, y + 0.5)
        }
        ctx.stroke()

        // Soft radial gradient mask to fade grid smoothly at spotlight edges
        const radialFade = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          radius * 0.25,
          mouse.x,
          mouse.y,
          radius,
        )
        radialFade.addColorStop(0, 'rgba(255, 255, 255, 0)')
        radialFade.addColorStop(1, 'rgba(255, 255, 255, 1)')
        ctx.fillStyle = radialFade
        ctx.fillRect(minX, minY, maxX - minX, maxY - minY)

        ctx.restore()
      }

      // Render active / hovered squares with soft, light-slate tones
      let hasActiveCells = false
      cellsRef.current.forEach((cell, key) => {
        if (cell.alpha <= 0) {
          cellsRef.current.delete(key)
          return
        }

        hasActiveCells = true
        const startX = cell.col * cellSize
        const startY = cell.row * cellSize
        const cellAlpha = cell.alpha * mouse.opacity

        if (cellAlpha > 0.01) {
          // Soft light-slate fill (slate-100)
          ctx.fillStyle = `rgba(241, 245, 249, ${cellAlpha * 0.75})`
          ctx.fillRect(startX + 1, startY + 1, cellSize - 1, cellSize - 1)

          // Delicate light-slate border (slate-300)
          ctx.strokeStyle = `rgba(203, 213, 225, ${cellAlpha * 0.85})`
          ctx.lineWidth = 1
          ctx.strokeRect(startX + 0.5, startY + 0.5, cellSize, cellSize)
        }

        cell.alpha -= 0.025
      })

      ctx.restore()

      if (hasActiveCells || mouse.opacity > 0) {
        animFrameRef.current = requestAnimationFrame(draw)
      } else {
        isRunningRef.current = false
      }
    }

    const startLoop = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true
        animFrameRef.current = requestAnimationFrame(draw)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (x < 0 || y < 0 || x > width || y > height) {
        mouseRef.current.active = false
        return
      }

      mouseRef.current.x = x
      mouseRef.current.y = y
      mouseRef.current.active = true

      const col = Math.floor(x / cellSize)
      const row = Math.floor(y / cellSize)
      const key = `${col},${row}`

      cellsRef.current.set(key, { col, row, alpha: 1.0 })
      startLoop()
    }

    const onPointerLeave = () => {
      mouseRef.current.active = false
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('mouseleave', onPointerLeave)
    resize()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mouseleave', onPointerLeave)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [cellSize, radius])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  )
}
