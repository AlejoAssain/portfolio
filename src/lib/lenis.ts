import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

type ScrollToOptions = Parameters<Lenis['scrollTo']>[1]

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches

// Under reduced motion, skip Lenis entirely — it hijacks wheel/touch to
// produce inertia scrolling, which is exactly the motion this preference
// asks to remove. `scrollTo` falls back to an instant native jump.
export const lenis = prefersReducedMotion
  ? {
      scrollTo: (target: string, _options?: ScrollToOptions) =>
        document.querySelector(target)?.scrollIntoView(),
    }
  : new Lenis({ allowNestedScroll: true })

if (lenis instanceof Lenis) {
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)
} else {
  window.addEventListener('scroll', () => ScrollTrigger.update())
}

// Native `scroll` fires for every scroll origin (Lenis's own lerp updates
// real `window.scrollY` each frame, same as wheel/keyboard/anchor jumps do),
// so passive UI subscribers can listen to it directly. Lenis's own 'scroll'
// event (used above for `ScrollTrigger.update`) is reserved for cases that
// need tick-exact sync with Lenis's raf loop — a plain subscriber doesn't.
export function onScroll(callback: () => void) {
  window.addEventListener('scroll', callback)
  return () => window.removeEventListener('scroll', callback)
}

// The hero no longer pins, so its copy scrolls up under the header right
// away — the header has to go solid as soon as the page moves at all.
export function isScrolled() {
  return window.scrollY > 24
}

export function scrollToSection(href: string) {
  lenis.scrollTo(href)
}
