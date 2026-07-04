import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface TiltOptions {
  /** Bounded rotation range — the card never tilts past ±this many degrees. */
  maxTiltDeg?: number
}

const DEFAULT_MAX_TILT_DEG = 10
const HOVER_LIFT_PX = 12
const HOVER_SCALE = 1.02
/** Per-frame catch-up factor: higher = snappier, lower = floatier. */
const LERP_FACTOR = 0.14
/** Values closer to target than this are snapped, and the loop stops. */
const SETTLE_EPSILON = 0.01

interface TiltState {
  tiltX: number
  tiltY: number
  glowX: number
  glowY: number
  lift: number
  scale: number
}

const RESTING: TiltState = { tiltX: 0, tiltY: 0, glowX: 50, glowY: 50, lift: 0, scale: 1 }

/**
 * Pointer-driven 3D tilt for a DOM element, smoothed with an exponential lerp.
 *
 * Instead of writing pointer values directly (which fights CSS transitions and
 * feels steppy), a requestAnimationFrame loop eases the current state toward
 * the target every frame and writes CSS custom properties
 * (--tilt-x/--tilt-y/--glow-x/--glow-y/--card-lift/--card-scale) on the element.
 * The loop only runs while values are moving, then stops — zero idle cost and
 * zero React re-renders. Hover lift/scale ride the same spring-like motion.
 * Works for mouse and touch (pointer events). Disabled under reduced motion.
 */
export function useTilt<T extends HTMLElement>({
  maxTiltDeg = DEFAULT_MAX_TILT_DEG,
}: TiltOptions = {}) {
  const ref = useRef<T>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || reducedMotion) return

    const current: TiltState = { ...RESTING }
    let target: TiltState = { ...RESTING }
    let frameId = 0

    const lerp = (from: number, to: number) => from + (to - from) * LERP_FACTOR

    const settled = () =>
      (Object.keys(current) as (keyof TiltState)[]).every(
        (key) => Math.abs(current[key] - target[key]) < SETTLE_EPSILON,
      )

    const step = () => {
      current.tiltX = lerp(current.tiltX, target.tiltX)
      current.tiltY = lerp(current.tiltY, target.tiltY)
      current.glowX = lerp(current.glowX, target.glowX)
      current.glowY = lerp(current.glowY, target.glowY)
      current.lift = lerp(current.lift, target.lift)
      current.scale = lerp(current.scale, target.scale)

      element.style.setProperty('--tilt-x', `${current.tiltX.toFixed(3)}deg`)
      element.style.setProperty('--tilt-y', `${current.tiltY.toFixed(3)}deg`)
      element.style.setProperty('--glow-x', `${current.glowX.toFixed(2)}%`)
      element.style.setProperty('--glow-y', `${current.glowY.toFixed(2)}%`)
      element.style.setProperty('--card-lift', `${current.lift.toFixed(2)}px`)
      element.style.setProperty('--card-scale', current.scale.toFixed(4))

      if (settled()) {
        Object.assign(current, target)
        frameId = 0
      } else {
        frameId = requestAnimationFrame(step)
      }
    }

    const wake = () => {
      if (!frameId) frameId = requestAnimationFrame(step)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      const relativeX = (event.clientX - rect.left) / rect.width // 0..1
      const relativeY = (event.clientY - rect.top) / rect.height
      target = {
        tiltX: -(relativeY - 0.5) * 2 * maxTiltDeg,
        tiltY: (relativeX - 0.5) * 2 * maxTiltDeg,
        glowX: relativeX * 100,
        glowY: relativeY * 100,
        lift: HOVER_LIFT_PX,
        scale: HOVER_SCALE,
      }
      wake()
    }

    const reset = () => {
      target = { ...RESTING, glowX: current.glowX, glowY: current.glowY }
      wake()
    }

    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerleave', reset)
    element.addEventListener('pointercancel', reset)
    return () => {
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerleave', reset)
      element.removeEventListener('pointercancel', reset)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [maxTiltDeg, reducedMotion])

  return ref
}
