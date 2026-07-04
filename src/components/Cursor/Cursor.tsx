import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const RING_LERP_FACTOR = 0.12
const HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, .project-card'

/**
 * Custom cursor: an accent dot that follows the pointer plus a ring that
 * lags behind via requestAnimationFrame lerp. Carried over from the original
 * site, minus the particle trail (dropped for performance).
 *
 * Renders nothing on touch devices (`pointer: fine` check) and under reduced
 * motion — in those cases the native cursor stays untouched.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [finePointer] = useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  )

  const enabled = finePointer && !reducedMotion

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.body.classList.add('custom-cursor-active')

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let frameId = 0

    const onPointerMove = (event: PointerEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
    }

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target
      const hovering = target instanceof Element && target.closest(HOVER_SELECTOR) !== null
      document.body.classList.toggle('cursor-hover', hovering)
    }

    const onPointerDown = () => document.body.classList.add('cursor-clicking')
    const onPointerUp = () => document.body.classList.remove('cursor-clicking')

    const loop = () => {
      ringX += (mouseX - ringX) * RING_LERP_FACTOR
      ringY += (mouseY - ringY) * RING_LERP_FACTOR
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      frameId = requestAnimationFrame(loop)
    }
    frameId = requestAnimationFrame(loop)

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerover', onPointerOver, { passive: true })
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      document.body.classList.remove('custom-cursor-active', 'cursor-hover', 'cursor-clicking')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
