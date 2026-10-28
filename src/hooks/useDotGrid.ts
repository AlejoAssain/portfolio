import { useEffect, useRef } from 'react'

// Adapted from React Bits' Dot Grid, stripped to what direction.md allows:
// no glow, no bounce, no click shockwave. Dots sit still in Línea; the ones
// near the cursor ease toward Código and drift a few px away from it.
const GAP_FINE = 28 // px between dot centers, mouse devices
const GAP_COARSE = 36 // touch devices: fewer dots, and no interaction at all
const DOT_RADIUS = 1.2
const REACH = 150 // px around the cursor that dots respond to
const PUSH = 6 // max px a dot drifts away from the cursor
const SWELL = 0.6 // extra radius at full influence, as a fraction
const SETTLE = 0.15 // s — exponential time constant, a soft ease-out with no overshoot

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

    const interactive = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    ).matches

    let xs = new Float32Array(0)
    let ys = new Float32Array(0)
    let influence = new Float32Array(0)
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
      const offsetX = (width - (cols - 1) * gap) / 2
      const offsetY = (height - (rows - 1) * gap) / 2
      xs = new Float32Array(cols * rows)
      ys = new Float32Array(cols * rows)
      influence = new Float32Array(cols * rows)
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          xs[row * cols + col] = offsetX + col * gap
          ys[row * cols + col] = offsetY + row * gap
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      // Resting dots in one path — the common case, one fill call.
      ctx.fillStyle = baseColor
      ctx.beginPath()
      for (let i = 0; i < xs.length; i++) {
        if (influence[i] > 0.01) continue
        ctx.moveTo(xs[i] + DOT_RADIUS, ys[i])
        ctx.arc(xs[i], ys[i], DOT_RADIUS, 0, Math.PI * 2)
      }
      ctx.fill()

      for (let i = 0; i < xs.length; i++) {
        const amount = influence[i]
        if (amount <= 0.01) continue
        const dx = xs[i] - pointer.x
        const dy = ys[i] - pointer.y
        const distance = Math.hypot(dx, dy) || 1
        const x = xs[i] + (dx / distance) * PUSH * amount
        const y = ys[i] + (dy / distance) * PUSH * amount
        const radius = DOT_RADIUS * (1 + SWELL * amount)

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.globalAlpha = 1
        ctx.fillStyle = baseColor
        ctx.fill()
        ctx.globalAlpha = amount
        ctx.fillStyle = activeColor
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const ease = 1 - Math.exp(-dt / SETTLE)
      let moving = false

      for (let i = 0; i < xs.length; i++) {
        let target = 0
        if (pointer.inside) {
          const distance = Math.hypot(xs[i] - pointer.x, ys[i] - pointer.y)
          if (distance < REACH) target = smootherstep(1 - distance / REACH)
        }
        influence[i] += (target - influence[i]) * ease
        if (Math.abs(target - influence[i]) > 0.002) moving = true
      }

      draw()
      // Idle once everything has settled: no frames burn while the cursor rests.
      raf = moving ? requestAnimationFrame(frame) : 0
    }

    const wake = () => {
      if (raf) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.inside = true
      wake()
    }

    const onLeave = () => {
      pointer.inside = false
      wake()
    }

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
