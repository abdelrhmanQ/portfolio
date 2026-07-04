import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const VISIBILITY_THRESHOLD = 0.1

interface RevealProps {
  children: ReactNode
  /** Stagger delay in ms, e.g. index * 130 for grid children. */
  delay?: number
  className?: string
}

/**
 * Fade-and-rise entrance when the element scrolls into view.
 * Observes once, then disconnects. Reduced motion is handled in CSS
 * (the transition is removed and content is simply visible).
 */
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: VISIBILITY_THRESHOLD },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('reveal', visible && 'reveal--visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
