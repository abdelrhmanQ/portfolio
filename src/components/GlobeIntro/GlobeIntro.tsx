import { useCallback, useEffect, useRef, useState } from 'react'
import GlobeScene from './GlobeScene'
import CosmicOverlay from '@/components/ui/cosmic-overlay'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'
import { FADE_DURATION_MS } from './constants'

export type IntroPhase = 'idle' | 'zooming' | 'transitioning' | 'done'

interface GlobeIntroProps {
  /** Fired when the cross-fade begins — the parent should mount the portfolio beneath. */
  onTransitionStart: () => void
  /** Fired when the overlay has fully faded out — safe to unmount this component. */
  onEnter: () => void
}

/**
 * Full-screen 3D earth entry screen with an internal state machine:
 * idle → zooming → transitioning → done.
 *
 * - Click / tap / Enter / Space starts the camera dolly into the globe.
 * - Mid-zoom the overlay starts fading (cross-fade with the portfolio below).
 * - Reduced motion or the "Skip intro" button bypasses the zoom and fades directly.
 */
export default function GlobeIntro({ onTransitionStart, onEnter }: GlobeIntroProps) {
  const [phase, setPhase] = useState<IntroPhase>('idle')
  const reducedMotion = usePrefersReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const finishedRef = useRef(false)

  // Focus the intro so Enter/Space work immediately (keyboard users are never trapped).
  useEffect(() => {
    rootRef.current?.focus()
  }, [])

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    setPhase('done')
    onEnter()
  }, [onEnter])

  const beginTransition = useCallback(() => {
    setPhase((current) =>
      current === 'transitioning' || current === 'done' ? current : 'transitioning',
    )
    onTransitionStart()
  }, [onTransitionStart])

  const activate = useCallback(() => {
    if (phase !== 'idle') return
    if (reducedMotion) {
      beginTransition() // skip the zoom, fade directly
    } else {
      setPhase('zooming')
    }
  }, [phase, reducedMotion, beginTransition])

  // Safety net: if the CSS transitionend never fires (tab hidden, etc.), finish anyway.
  useEffect(() => {
    if (phase !== 'transitioning') return
    const timeoutId = window.setTimeout(finish, FADE_DURATION_MS + 200)
    return () => window.clearTimeout(timeoutId)
  }, [phase, finish])

  const leaving = phase === 'transitioning' || phase === 'done'

  return (
    <div
      ref={rootRef}
      className={cn('globe-intro', leaving && 'globe-intro--leaving')}
      role="button"
      tabIndex={0}
      aria-label="Enter the portfolio"
      onClick={activate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          activate()
        }
      }}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget && event.propertyName === 'opacity') finish()
      }}
    >
      <GlobeScene phase={phase} reducedMotion={reducedMotion} onZoomFadePoint={beginTransition} />
      <CosmicOverlay
        title="Abdelrahman Khaled"
        subtitle="Full Stack Developer"
        hint="Click, tap, or press Enter to begin"
        hidden={phase !== 'idle'}
      />
      <button
        type="button"
        className="globe-intro__skip"
        onClick={(event) => {
          event.stopPropagation()
          beginTransition()
        }}
      >
        Skip intro
      </button>
    </div>
  )
}
