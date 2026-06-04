import { useEffect } from 'react'

const cursorX = '--cursor-x'
const cursorY = '--cursor-y'

export function useCursorGlow() {
  useEffect(() => {
    let frameId: number | null = null

    const root = document.documentElement

    const setPosition = (x: number, y: number) => {
      root.style.setProperty(cursorX, `${x}px`)
      root.style.setProperty(cursorY, `${y}px`)
    }

    setPosition(window.innerWidth / 2, window.innerHeight / 2)

    const updatePosition = (event: MouseEvent | PointerEvent) => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }

      frameId = requestAnimationFrame(() => {
        setPosition(event.clientX, event.clientY)
      })
    }

    window.addEventListener('pointermove', updatePosition)
    window.addEventListener('mousemove', updatePosition)

    return () => {
      window.removeEventListener('pointermove', updatePosition)
      window.removeEventListener('mousemove', updatePosition)

      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])
}
