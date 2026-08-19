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
  : new Lenis()

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

export function isPastHero() {
  const heroTrigger = ScrollTrigger.getById('hero-pin')
  if (!heroTrigger) return false
  return window.scrollY >= heroTrigger.end
}

// Enough real time to watch the hood animation finish during the pin, plus
// a normal-feeling scroll speed for whatever distance remains beyond it. A
// flat duration for the whole trip made the visible remainder crawl, since
// the pinned (visually static) portion ate most of the time budget.
const PIN_WATCH_DURATION = 2.2
const POST_PIN_SCROLL_SPEED = 2400 // px/s

// Scrolling away from the hero mid-pin would cut its scroll-scrubbed hood
// animation off half-played, so a click while still inside that pinned zone
// gets a scroll long enough to watch it finish; once past it, scrolling
// uses Lenis's own default duration/easing.
//
// This has to be two separate scrollTo calls, not one scroll eased over the
// combined distance: an ease-out curve front-loads its velocity, so a
// single tween covering pin-distance + remaining-distance blows through the
// pin in the first fraction of a second (racing past `heroEnd` and
// releasing the pin) long before the hood video is done scrubbing, then
// crawls through the remainder. Scrolling the pin stretch at constant speed
// first guarantees the video actually gets its full PIN_WATCH_DURATION
// before the pin can release, then the leftover distance eases out normally.
export function scrollToSection(href: string) {
  if (isPastHero()) {
    lenis.scrollTo(href)
    return
  }

  const heroTrigger = ScrollTrigger.getById('hero-pin')
  if (!heroTrigger) {
    lenis.scrollTo(href)
    return
  }

  const heroEnd = heroTrigger.end
  const target = document.querySelector(href)
  const targetTop = target
    ? target.getBoundingClientRect().top + window.scrollY
    : heroEnd
  const visibleDistance = Math.max(targetTop - heroEnd, 0)

  ;(lenis as Lenis).scrollTo(heroEnd, {
    duration: PIN_WATCH_DURATION,
    easing: (t: number) => t,
    onComplete: () => {
      if (visibleDistance <= 0) return
      lenis.scrollTo(href, {
        duration: visibleDistance / POST_PIN_SCROLL_SPEED,
        // ease-out-snap's cubic-bezier is tuned to match GSAP's power4.out.
        easing: gsap.parseEase('power4.out'),
      })
    },
  })
}
