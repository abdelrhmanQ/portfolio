import { type ReactNode } from 'react'
import { motion, useReducedMotion, type MotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SpotlightProps extends MotionProps {
  className?: string
}

/** One drifting light beam. Position/colour come from CSS (theme tokens). */
function Spotlight({ className, ...props }: SpotlightProps) {
  return <motion.div aria-hidden="true" className={cn('spotlight', className)} {...props} />
}

/** Shared transition shape — long, mirrored, eased drifts (no linear motion). */
const drift = (duration: number, delay = 0) => ({
  duration,
  ease: 'easeInOut' as const,
  repeat: Infinity,
  repeatType: 'mirror' as const,
  delay,
})

interface SpotlightBackgroundProps {
  children: ReactNode
  className?: string
}

/**
 * Animated spotlight backdrop: three slow-drifting light beams in the theme's
 * accent colours (blue / violet / cyan), sitting in a fixed layer behind the
 * content. Because the site's panels use backdrop-filter, the moving light is
 * refracted through the glass — which is the whole point.
 *
 * Under prefers-reduced-motion the beams render static (no drift).
 * The overlay is pointer-events: none and purely decorative (aria-hidden).
 */
export default function SpotlightBackground({ children, className }: SpotlightBackgroundProps) {
  const reducedMotion = useReducedMotion()

  return (
    <div className={cn('spotlight-container', className)}>
      <div className="spotlight-overlay" aria-hidden="true">
        <Spotlight
          className="spotlight--blue"
          initial={{ x: '-50%', y: '-50%', rotate: 0 }}
          {...(!reducedMotion && {
            animate: {
              x: ['-50%', '-30%', '-70%', '-50%'],
              y: ['-50%', '-70%', '-30%', '-50%'],
              rotate: [0, 15, -15, 0],
            },
            transition: drift(14),
          })}
        />
        <Spotlight
          className="spotlight--violet"
          initial={{ x: '0%', y: '0%', rotate: -20 }}
          {...(!reducedMotion && {
            animate: {
              x: ['0%', '20%', '-20%', '0%'],
              y: ['0%', '30%', '10%', '0%'],
              rotate: [-20, 0, 20, -20],
            },
            transition: drift(17, 3),
          })}
        />
        <Spotlight
          className="spotlight--cyan"
          initial={{ x: '0%', y: '0%', rotate: 10 }}
          {...(!reducedMotion && {
            animate: {
              x: ['0%', '-30%', '10%', '0%'],
              y: ['0%', '-20%', '20%', '0%'],
              rotate: [10, -10, 25, 10],
            },
            transition: drift(20, 5),
          })}
        />
      </div>

      <div className="spotlight-content">{children}</div>
    </div>
  )
}
