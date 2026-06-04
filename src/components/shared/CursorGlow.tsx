import { useCursorGlow } from '@/hooks'

const cursorGlowBackground =
  'radial-gradient(520px at var(--cursor-x, 50vw) var(--cursor-y, 50vh), rgba(100, 200, 180, 0.08), transparent 72%)'

export function CursorGlow() {
  useCursorGlow()

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 mix-blend-screen"
      style={{ background: cursorGlowBackground }}
    />
  )
}
