import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

// The loop ships twice because no single format carries alpha everywhere:
// Chrome/Firefox decode VP9-alpha WebM, WebKit (Safari, and every iOS
// browser) only decodes HEVC-alpha — and plays VP9 WebM with the alpha
// dropped, so it can't just be listed as a <source> fallback. Every iOS
// browser identifies as Safari without "Chrome", which this matches too.
const isWebKit = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
export const CHARACTER_LOOP_SRC = isWebKit
  ? '/character/alejo-loop-hevc.mp4'
  : '/character/alejo-loop.webm'
export const CHARACTER_POSTER_SRC = '/character/alejo-loop-poster.webp'

// How far the character dims once the hero has scrolled away: it stays on
// screen leaning on the viewport edge at the same size, just pushed into
// the background.
const BACKGROUND_OPACITY = 0.2

export function useHeroAnimation() {
  const containerRef = useRef<HTMLElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const entranceRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useGSAP(
    () => {
      const video = videoRef.current
      if (!video) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Muted + playsInline is what lets this autoplay on iOS. If the
        // browser still refuses (Low Power Mode), the poster is frame 0 of
        // the same loop, so the character just holds still.
        video.play().catch(() => {})

        // Leans in from past the right edge it rests against.
        gsap.from(entranceRef.current, {
          xPercent: 35,
          opacity: 0,
          duration: 1.2,
          delay: 0.2,
          ease: 'power4.out',
        })

        // `scrub: true`, not a numeric lag: Lenis already smooths the scroll
        // position, and stacking a second catch-up delay on top is what made
        // the old scroll-scrubbed video feel detached from the hand.
        gsap.to(characterRef.current, {
          opacity: BACKGROUND_OPACITY,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom 30%',
            scrub: true,
          },
        })

        return () => video.pause()
      })

      // No playback and no movement: the poster holds still, and the only
      // change is a short dim once most of the hero is gone, so the content
      // after it still reads over the character.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.to(characterRef.current, {
          opacity: BACKGROUND_OPACITY,
          duration: 0.2,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'bottom 40%',
            toggleActions: 'play none none reverse',
          },
        })
      })
    },
    { scope: containerRef },
  )

  return { containerRef, characterRef, entranceRef, videoRef }
}
