import { useEffect, useRef } from 'react'
import { createDotActivity } from '@/lib/dotActivity'

// Adapted from React Bits' Dot Grid, stripped to what direction.md allows:
// no glow, no bounce, no click shockwave. Dots rest in Línea and come alive
// with the character's typing (lib/dotActivity); the ones near the cursor
// ease toward Código and drift a few px away from it.
const GAP_FINE = 28 // px between dot centers, mouse devices
const GAP_COARSE = 36 // touch devices: fewer dots, ambient only
const DOT_RADIUS = 1.2
const REACH = 150 // px around the cursor that dots respond to
const PUSH = 6 // max px a dot drifts away from the cursor
const SWELL = 0.8 // extra radius at full intensity, as a fraction
const SETTLE = 0.15 // s — exponential time constant, a soft ease-out with no overshoot
const TOUCH_FRAME = 1000 / 30 // ms — touch devices run the ambient layer at 30fps

// Older Safari parses oklch in CSS but not in canvas fillStyle, where an
// unparseable color is silently ignored. Hex mirrors of index.css tokens.
const FALLBACK = { '--line': '#2C332A', '--code': '#6BA5FF' }

function canvasColor(ctx: CanvasRenderingContext2D, token: keyof typeof FALLBACK) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
  ctx.fillStyle = '#000000'
  ctx.fillStyle = value
  return ctx.fillStyle === '#000000' ? FALLBACK[token] : value
}

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)

export function useDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const baseColor = canvasColor(ctx, '--line')
    const activeColor = canvasColor(ctx, '--code')

    const animated = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    const interactive = animated && window.matchMedia('(hover: hover) and (pointer: fine)').matches

    let xs = new Float32Array(0)
    let ys = new Float32Array(0)
    let influence = new Float32Array(0) // cursor, 0–1
    let glow = new Float32Array(0) // ambient activity, 0–1
    let offsetX = new Float32Array(0)
    let offsetY = new Float32Array(0)
    const activity = createDotActivity()
    const pointer = { x: 0, y: 0, inside: false }
    let raf = 0
    let last = 0

    const build = () => {
      // Sized to the large viewport (h-lvh), so mobile toolbars showing or
      // hiding don't change it.
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

      const gap = interactive ? GAP_FINE : GAP_COARSE
      const cols = Math.floor(width / gap) + 1
      const rows = Math.floor(height / gap) + 1
      // Center the grid so the leftover margin is even on both sides.
      const offsetLeft = (width - (cols - 1) * gap) / 2
      const offsetTop = (height - (rows - 1) * gap) / 2
      const count = cols * rows
      xs = new Float32Array(count)
      ys = new Float32Array(count)
      influence = new Float32Array(count)
      glow = new Float32Array(count)
      offsetX = new Float32Array(count)
      offsetY = new Float32Array(count)
      activity.reset()
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          xs[row * cols + col] = offsetLeft + col * gap
          ys[row * cols + col] = offsetTop + row * gap
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      // Resting dots in one path — the common case, one fill call.
      ctx.fillStyle = baseColor
      ctx.beginPath()
      for (let i = 0; i < xs.length; i++) {
        if (influence[i] > 0.01 || glow[i] > 0.01) continue
        ctx.moveTo(xs[i] + DOT_RADIUS, ys[i])
        ctx.arc(xs[i], ys[i], DOT_RADIUS, 0, Math.PI * 2)
      }
      ctx.fill()

      for (let i = 0; i < xs.length; i++) {
        const amount = influence[i]
        const intensity = Math.max(amount, glow[i])
        if (intensity <= 0.01) continue
        let x = xs[i] + offsetX[i]
        let y = ys[i] + offsetY[i]
        if (amount > 0.01) {
          const dx = xs[i] - pointer.x
          const dy = ys[i] - pointer.y
          const distance = Math.hypot(dx, dy) || 1
          x += (dx / distance) * PUSH * amount
          y += (dy / distance) * PUSH * amount
        }

        ctx.beginPath()
        ctx.arc(x, y, DOT_RADIUS * (1 + SWELL * intensity), 0, Math.PI * 2)
        ctx.globalAlpha = 1
        ctx.fillStyle = baseColor
        ctx.fill()
        ctx.globalAlpha = intensity
        ctx.fillStyle = activeColor
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!interactive && now - last < TOUCH_FRAME) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const ease = 1 - Math.exp(-dt / SETTLE)

      for (let i = 0; i < xs.length; i++) {
        let target = 0
        if (pointer.inside) {
          const distance = Math.hypot(xs[i] - pointer.x, ys[i] - pointer.y)
          if (distance < REACH) target = smootherstep(1 - distance / REACH)
        }
        influence[i] += (target - influence[i]) * ease
      }

      activity.update(now / 1000, dt, xs, ys, glow, offsetX, offsetY)
      draw()
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.inside = true
    }

    const onLeave = () => (pointer.inside = false)

    const onOut = (event: PointerEvent) => {
      if (!event.relatedTarget) onLeave()
    }

    // Mobile toolbars still fire resize on every scroll gesture; coalesce to
    // one check per frame and skip the rebuild when the canvas didn't change.
    let resizeRaf = 0
    const onResize = () => {
      if (resizeRaf) return
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0
        const ratio = Math.min(window.devicePixelRatio || 1, 2)
        if (
          canvas.width === Math.round(canvas.clientWidth * ratio) &&
          canvas.height === Math.round(canvas.clientHeight * ratio)
        ) return
        build()
        draw()
      })
    }

    build()
    draw()
    window.addEventListener('resize', onResize)
    if (animated) {
      // Always running for the ambient layer; rAF already pauses in hidden tabs.
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    if (interactive) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerout', onOut)
      window.addEventListener('blur', onLeave)
    }

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(resizeRaf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerout', onOut)
      window.removeEventListener('blur', onLeave)
    }
  }, [])

  return canvasRef
}
