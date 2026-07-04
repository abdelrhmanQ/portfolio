import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface CosmicOverlayProps {
  title: string
  subtitle: string
  hint?: string
  /** Fades the overlay out (during zoom) without unmounting it. */
  hidden?: boolean
}

/**
 * DOM layer sitting over the globe canvas: soft horizon glow at the bottom of
 * the viewport plus a staggered per-word title reveal — adapted from the
 * "cosmic parallax" reference component. The star layers themselves live in
 * the WebGL scene (see GlobeIntro/Starfield), so this only carries what DOM
 * does best: text and gradient glows. Pointer-events are disabled so clicks
 * fall through to the intro's enter handler.
 */
export default function CosmicOverlay({ title, subtitle, hint, hidden = false }: CosmicOverlayProps) {
  const words = useMemo(() => title.split(' '), [title])

  return (
    <div className={cn('cosmic-overlay', hidden && 'cosmic-overlay--hidden')} aria-hidden={hidden}>
      <div className="cosmic-overlay__horizon" aria-hidden="true" />
      <div className="cosmic-overlay__content">
        <h1 className="cosmic-overlay__title">
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="cosmic-overlay__word"
              style={{ animationDelay: `${0.4 + index * 0.12}s` }}
            >
              {word}
            </span>
          ))}
        </h1>
        <p className="cosmic-overlay__subtitle">{subtitle}</p>
        {hint ? <p className="cosmic-overlay__hint">{hint}</p> : null}
      </div>
    </div>
  )
}
