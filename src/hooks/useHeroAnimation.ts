import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

// The source video is composited on pure black. Kling/h264 can leave faint
// near-black noise, so pixels below the threshold go fully transparent and
// a short feather band above it blends the cutout edge instead of leaving a
// hard silhouette line. Runs on both breakpoints — mix-blend-mode on the
// raw <video> was tried for mobile as a cheaper alternative, but it only
// blends within its own stacking context, so isolated wrapper elements (or
// any backdrop that isn't a flat, fully opaque color) leave the source's
// true black showing through. Per-pixel alpha is the only thing that's
// actually transparent regardless of what's behind it.
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

const DESKTOP_QUERY = '(min-width: 1024px)'
const DESKTOP_PIN_DISTANCE = '+=140%'
const MOBILE_PIN_DISTANCE = '+=70%'
// A plain `scrub: true` snaps the timeline to scroll position instantly, so
// any fast input — a hard trackpad flick, or scrollToSection's animated
// jump — blows through the whole hood transition in a couple hundred ms.
// A numeric scrub adds that many seconds of lag while the timeline catches
// up to the scroll position, spreading the video out over real time no
// matter how quickly the underlying scroll position moves.
const SCRUB_SMOOTHING = 1

export function useHeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const idleLayerRef = useRef<HTMLDivElement>(null)
  const pupilsWrapRef = useRef<HTMLDivElement>(null)

  const { contextSafe } = useGSAP(
    () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) return

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      // Every deferred video listener goes through here so matchMedia branch
      // cleanup can always remove it. Under React StrictMode's dev-mode
      // mount→cleanup→mount, a listener left dangling from the first
      // (reverted) mount fires again once the second mount's own listener is
      // also attached — double-running scrub setup and corrupting the pin.
      const addVideoListener = <K extends keyof HTMLMediaElementEventMap>(
        type: K,
        cb: (event: HTMLMediaElementEventMap[K]) => void,
        options?: AddEventListenerOptions,
      ) => {
        video.addEventListener(type, cb, options)
        return () => video.removeEventListener(type, cb)
      }

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
      const enableCanvasDrawing = () => addVideoListener('seeked', drawFrame)

      // The idle layer (no-pupils art + cursor-tracking pupils overlay) is
      // the resting state shown before the user has scrolled at all. The
      // video's own first frame is pixel-matched to that same pose (with
      // natural, non-tracking pupils baked in), so the moment scrolling
      // starts we just hide the idle layer and the video/canvas underneath
      // reads as a continuation, not a swap.
      const setIdleVisible = (visible: boolean) => {
        if (idleLayerRef.current) {
          idleLayerRef.current.style.opacity = visible ? '1' : '0'
        }
      }

      // Runs `cb` once metadata is available, synchronously if it already
      // is. Always returns a cleanup, even in the sync case (no-op there),
      // so callers can compose it unconditionally.
      const whenMetadataReady = (cb: () => void) => {
        if (video.readyState >= 1) {
          cb()
          return () => {}
        }
        return addVideoListener('loadedmetadata', cb, { once: true })
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

      mm.add(
        `${DESKTOP_QUERY} and (prefers-reduced-motion: no-preference)`,
        () => {
          const cleanupCanvas = enableCanvasDrawing()

          // contextSafe: when metadata isn't ready yet, this runs later from
          // an event callback, outside the synchronous window useGSAP tracks
          // for auto-revert — without this wrapper the ScrollTrigger it
          // creates would survive a StrictMode revert as an orphan.
          const setupScrub = contextSafe(() => {
            setIdleVisible(true)

            gsap.timeline({
              scrollTrigger: {
                id: 'hero-pin',
                trigger: containerRef.current,
                start: 'top top',
                end: DESKTOP_PIN_DISTANCE,
                scrub: SCRUB_SMOOTHING,
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
          })

          const cleanupDrawFrame =
            video.readyState >= 2
              ? (drawFrame(), () => {})
              : addVideoListener('loadeddata', drawFrame, { once: true })
          const cleanupMetadata = whenMetadataReady(setupScrub)

          return () => {
            cleanupCanvas()
            cleanupDrawFrame()
            cleanupMetadata()
          }
        },
      )

      // Same canvas/luma-key pipeline as desktop (see the LUMA_CUTOFF note
      // above for why mix-blend-mode isn't good enough here) — just a
      // shorter pin distance since there's less empty space below the fold
      // to spend on it, plus the iOS playback quirk below.
      mm.add(
        `(max-width: 1023px) and (prefers-reduced-motion: no-preference)`,
        () => {
          let videoFailed = false
          const cleanupCanvas = enableCanvasDrawing()

          // iOS can block programmatic currentTime scrubbing until a video
          // has been "primed" by play() inside a real user gesture — even
          // though it's muted and never visibly plays here.
          const unlockPlayback = () => {
            video.play().then(() => video.pause()).catch(() => {})
          }
          window.addEventListener('touchstart', unlockPlayback, {
            once: true,
            passive: true,
          })

          // Never leave an empty gap: if the video can't play at all, keep
          // the (always-available, image-based) idle layer up for good
          // instead of handing off to a video that never arrives.
          const cleanupError = addVideoListener('error', () => {
            videoFailed = true
            setIdleVisible(true)
          })

          const setupScrub = contextSafe(() => {
            if (videoFailed) return
            setIdleVisible(true)

            gsap.timeline({
              scrollTrigger: {
                id: 'hero-pin',
                trigger: containerRef.current,
                start: 'top top',
                end: MOBILE_PIN_DISTANCE,
                scrub: SCRUB_SMOOTHING,
                pin: true,
                onUpdate: (self) => {
                  if (videoFailed) return
                  setIdleVisible(self.progress < 0.01)
                  if (self.progress >= 0.999) drawFinalFrame()
                },
              },
            }).fromTo(
              video,
              { currentTime: 0 },
              { currentTime: getFinalFrameTime(), ease: 'none' },
            )
          })

          const cleanupDrawFrame =
            video.readyState >= 2
              ? (drawFrame(), () => {})
              : addVideoListener('loadeddata', drawFrame, { once: true })
          const cleanupMetadata = whenMetadataReady(setupScrub)

          return () => {
            window.removeEventListener('touchstart', unlockPlayback)
            cleanupCanvas()
            cleanupError()
            cleanupDrawFrame()
            cleanupMetadata()
          }
        },
      )

      mm.add(`${DESKTOP_QUERY} and (prefers-reduced-motion: reduce)`, () => {
        const cleanupCanvas = enableCanvasDrawing()

        const cleanupMetadata = whenMetadataReady(() => {
          video.currentTime = getFinalFrameTime()
        })

        return () => {
          cleanupCanvas()
          cleanupMetadata()
        }
      })

      mm.add(
        `(max-width: 1023px) and (prefers-reduced-motion: reduce)`,
        () => {
          const cleanupCanvas = enableCanvasDrawing()
          const cleanupError = addVideoListener('error', () =>
            setIdleVisible(true),
          )
          const cleanupSeeked = addVideoListener('seeked', () =>
            setIdleVisible(false),
          )
          const cleanupMetadata = whenMetadataReady(() => {
            video.currentTime = getFinalFrameTime()
          })

          return () => {
            cleanupCanvas()
            cleanupError()
            cleanupSeeked()
            cleanupMetadata()
          }
        },
      )
    },
    { scope: containerRef },
  )

  // Pupils drift a few px toward the cursor within the eye sockets baked
  // into the pupils overlay art — a shared offset for both eyes, not
  // independent per-eye tracking. Desktop-only: there's no persistent
  // cursor on touch, and Pointer Events fire pointermove for touch-drags
  // too, which would otherwise do this work on every scroll frame on phone.
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

    const desktopQuery = window.matchMedia(DESKTOP_QUERY)
    const syncListener = (matches: boolean) => {
      window.removeEventListener('pointermove', onMove)
      if (matches) window.addEventListener('pointermove', onMove)
    }
    syncListener(desktopQuery.matches)
    const onQueryChange = (event: MediaQueryListEvent) =>
      syncListener(event.matches)
    desktopQuery.addEventListener('change', onQueryChange)

    return () => {
      desktopQuery.removeEventListener('change', onQueryChange)
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
