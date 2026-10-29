// Ambient activity for the dot grid: a few scattered dots at a time fade
// toward Código and back, like a terminal quietly working. Kept faint so the
// grid can still go unnoticed next to the character.
const MAX_ACTIVE = 4
const SPAWN_EVERY = 0.6 // s — average gap between new sparks
const LIFETIME = 1.6 // s — fade in and out, one smooth arc
const PEAK = 0.3 // max Código opacity, well under the cursor's full 1

export function createSparks() {
  let active: { index: number; start: number }[] = []

  return {
    reset() {
      active = []
    },

    // Writes each dot's current spark amount into `out` (zeroed elsewhere).
    update(out: Float32Array, now: number, dt: number) {
      const seconds = now / 1000
      active = active.filter(spark => seconds - spark.start < LIFETIME)
      if (out.length && active.length < MAX_ACTIVE && Math.random() < dt / SPAWN_EVERY) {
        active.push({ index: Math.floor(Math.random() * out.length), start: seconds })
      }

      out.fill(0)
      for (const spark of active) {
        const progress = (seconds - spark.start) / LIFETIME
        out[spark.index] = PEAK * Math.sin(Math.PI * progress)
      }
    },
  }
}
