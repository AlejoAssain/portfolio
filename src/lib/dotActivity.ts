// Ambient life for the dot grid, driven by the character typing: every
// keystroke sends a short ripple out of the laptop, every few seconds a wide
// pulse crosses the whole screen, and scattered dots spark on their own.
// Writes per-dot glow (0–1, toward Código) and an outward offset in px.

const SPARK_MAX = 10
const SPARK_EVERY = 0.15 // s — average gap between new sparks
const SPARK_LIFE = 1.4 // s
const SPARK_PEAK = 0.75

type Ripple = {
  x: number
  y: number
  start: number
  speed: number // px/s
  reach: number // px — the ring fades out by here
  band: number // px — ring thickness
  peak: number
  push: number // px — max outward drift at the ring
}

// Keystroke reach scales with the character (fraction of its height, ~240px
// on desktop) so the rings don't swamp a phone screen.
const KEYSTROKE = { speed: 260, band: 34, peak: 0.95, push: 2 }
const KEYSTROKE_REACH = 0.36
const PULSE = { speed: 520, reach: 2200, band: 110, peak: 0.7, push: 4 }
const KEY_GAP: [number, number] = [0.12, 0.55] // s — irregular, like typing
const PULSE_GAP: [number, number] = [4.5, 7] // s

// Where the hands meet the keyboard, as a fraction of the character's box.
// Read from the DOM so it follows the character's responsive size.
const KEYBOARD = { x: 0.32, y: 0.38 }

const between = ([min, max]: [number, number]) => min + Math.random() * (max - min)
const smooth = (t: number) => t * t * (3 - 2 * t)

function keyboardPoint() {
  const box = document.querySelector('[data-dot-origin]')?.getBoundingClientRect()
  if (!box?.width) return { x: window.innerWidth * 0.85, y: window.innerHeight * 0.6, size: 600 }
  return {
    x: box.left + box.width * KEYBOARD.x,
    y: box.top + box.height * KEYBOARD.y,
    size: box.height,
  }
}

export function createDotActivity() {
  let sparks: { index: number; start: number }[] = []
  let ripples: Ripple[] = []
  let nextKey = 0
  let nextPulse = 1.2

  return {
    reset() {
      sparks = []
      ripples = []
    },

    update(
      seconds: number,
      dt: number,
      xs: Float32Array,
      ys: Float32Array,
      glow: Float32Array,
      offsetX: Float32Array,
      offsetY: Float32Array,
    ) {
      if (seconds >= nextKey) {
        const { x, y, size } = keyboardPoint()
        ripples.push({
          // Keys sit a little apart on the keyboard; jitter keeps rings from stacking.
          x: x + (Math.random() - 0.5) * 30,
          y,
          start: seconds,
          reach: size * KEYSTROKE_REACH,
          ...KEYSTROKE,
        })
        nextKey = seconds + between(KEY_GAP)
      }
      if (seconds >= nextPulse) {
        const { x, y } = keyboardPoint()
        ripples.push({ x, y, start: seconds, ...PULSE })
        nextPulse = seconds + between(PULSE_GAP)
      }
      ripples = ripples.filter((r) => (seconds - r.start) * r.speed < r.reach + r.band)

      sparks = sparks.filter((s) => seconds - s.start < SPARK_LIFE)
      if (xs.length && sparks.length < SPARK_MAX && Math.random() < dt / SPARK_EVERY) {
        sparks.push({ index: Math.floor(Math.random() * xs.length), start: seconds })
      }

      glow.fill(0)
      offsetX.fill(0)
      offsetY.fill(0)

      for (const r of ripples) {
        const radius = (seconds - r.start) * r.speed
        // Rings weaken as they travel, so the source reads as the source.
        const strength = r.peak * (1 - smooth(Math.min(1, radius / r.reach)))
        for (let i = 0; i < xs.length; i++) {
          const dx = xs[i] - r.x
          const dy = ys[i] - r.y
          const distance = Math.hypot(dx, dy) || 1
          const gap = Math.abs(distance - radius)
          if (gap >= r.band) continue
          const amount = strength * smooth(1 - gap / r.band)
          if (amount > glow[i]) glow[i] = amount
          offsetX[i] += (dx / distance) * r.push * amount
          offsetY[i] += (dy / distance) * r.push * amount
        }
      }

      for (const s of sparks) {
        const amount = SPARK_PEAK * Math.sin(Math.PI * ((seconds - s.start) / SPARK_LIFE))
        if (amount > glow[s.index]) glow[s.index] = amount
      }
    },
  }
}
