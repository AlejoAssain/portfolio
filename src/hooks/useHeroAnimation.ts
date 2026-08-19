import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

// The source video is composited on pure black. Kling/h264 can leave faint
// near-black noise, so pixels below the threshold go fully transparent and
// a short feather band above it blends the cutout edge instead of leaving a
// hard silhouette line.
const LUMA_CUTOFF = 32
const LUMA_FEATHER = 18
// Internal render resolution is halved before the per-pixel key pass — the
// character is soft 3D art already, so the softness from the downscale is
// invisible, and it keeps the pixel loop cheap during scroll-scrub.
const RENDER_SCALE = 0.5
const SOURCE_VIDEO_FPS = 24
const HOOD_FINAL_FRAME_TIME = 5.083333

const PUPIL_INFLUENCE_RADIUS = 220
const PUPIL_MAX_OFFSET = 6

export function useHeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const idleLayerRef = useRef<HTMLDivElement>(null)
  const pupilsWrapRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) return

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      const drawFrame = () => {
        if (video.readyState < 2) return

        const width = Math.round(video.videoWidth * RENDER_SCALE)
        const height = Math.round(video.videoHeight * RENDER_SCALE)
        if (!width || !height) return
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }

        ctx.drawImage(video, 0, 0, width, height)
        const frame = ctx.getImageData(0, 0, width, height)
        const data = frame.data
        for (let i = 0; i < data.length; i += 4) {
          const luma =
            data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
          if (luma <= LUMA_CUTOFF) {
            data[i + 3] = 0
          } else if (luma < LUMA_CUTOFF + LUMA_FEATHER) {
            data[i + 3] = Math.round(
              ((luma - LUMA_CUTOFF) / LUMA_FEATHER) * 255,
            )
          }
        }
        ctx.putImageData(frame, 0, 0)
      }

      // Setting video.currentTime seeks asynchronously — the decoded frame
      // isn't available to drawImage until the browser fires `seeked`, so
      // that event (not the tween's onUpdate tick) is what actually keeps
      // the canvas in sync while scrubbing.
      video.addEventListener('seeked', drawFrame)

      // The idle layer (no-pupils art + cursor-tracking pupils overlay) is
      // the resting state shown before the user has scrolled at all. The
      // video's own first frame is pixel-matched to that same pose (with
      // natural, non-tracking pupils baked in), so the moment scrolling
      // starts we just hide the idle layer and the canvas underneath reads
      // as a continuation, not a swap — pupils simply stop following the
      // cursor and lock into the baked animation.
      const setIdleVisible = (visible: boolean) => {
        if (idleLayerRef.current) {
          idleLayerRef.current.style.opacity = visible ? '1' : '0'
        }
      }

      const getFinalFrameTime = () =>
        Math.max(
          Math.min(HOOD_FINAL_FRAME_TIME, video.duration - 1 / SOURCE_VIDEO_FPS),
          0,
        )

      const drawFinalFrame = () => {
        const finalFrameTime = getFinalFrameTime()
        setIdleVisible(false)
        if (Math.abs(video.currentTime - finalFrameTime) > 0.001) {
          video.currentTime = finalFrameTime
        }
        requestAnimationFrame(drawFrame)
      }

      const mm = gsap.matchMedia()

      // Below lg the character is hidden entirely (see Hero.tsx), so the
      // scroll-jacked pin has nothing to reveal — running it anyway would
      // freeze the page for +140% of scroll with no visual payoff.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const setupScrub = () => {
          setIdleVisible(true)
          if (video.readyState >= 2) {
            drawFrame()
          } else {
            video.addEventListener('loadeddata', drawFrame, { once: true })
          }

          gsap.timeline({
            scrollTrigger: {
              id: 'hero-pin',
              trigger: containerRef.current,
              start: 'top top',
              end: '+=140%',
              scrub: true,
              pin: true,
              onUpdate: (self) => {
                setIdleVisible(self.progress < 0.01)
                if (self.progress >= 0.999) drawFinalFrame()
              },
            },
          }).fromTo(
            video,
            { currentTime: 0 },
            { currentTime: getFinalFrameTime(), ease: 'none' },
          )
        }

        if (video.readyState >= 1) {
          setupScrub()
        } else {
          video.addEventListener('loadedmetadata', setupScrub, { once: true })
          return () =>
            video.removeEventListener('loadedmetadata', setupScrub)
        }
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        video.currentTime = 0
        setIdleVisible(true)
        if (video.readyState >= 2) {
          drawFrame()
        } else {
          video.addEventListener('loadeddata', drawFrame, { once: true })
        }
      })

      return () => video.removeEventListener('seeked', drawFrame)
    },
    { scope: containerRef },
  )

  // Pupils drift a few px toward the cursor within the eye sockets baked
  // into the pupils overlay art — a shared offset for both eyes, not
  // independent per-eye tracking.
  useEffect(() => {
    const character = characterRef.current
    const pupils = pupilsWrapRef.current
    if (!character || !pupils) return

    let frame = 0

    const onMove = (event: PointerEvent) => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = character.getBoundingClientRect()
        const eyeX = rect.left + rect.width * 0.5
        const eyeY = rect.top + rect.height * 0.3

        const dx = event.clientX - eyeX
        const dy = event.clientY - eyeY
        const distance = Math.hypot(dx, dy) || 1
        const pull =
          (Math.min(distance, PUPIL_INFLUENCE_RADIUS) /
            PUPIL_INFLUENCE_RADIUS) *
          PUPIL_MAX_OFFSET

        pupils.style.setProperty('--pupil-x', `${(dx / distance) * pull}px`)
        pupils.style.setProperty('--pupil-y', `${(dy / distance) * pull}px`)
      })
    }

    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return {
    containerRef,
    characterRef,
    videoRef,
    canvasRef,
    idleLayerRef,
    pupilsWrapRef,
  }
}
