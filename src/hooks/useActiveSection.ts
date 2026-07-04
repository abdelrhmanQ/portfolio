import { useEffect, useState } from 'react'

const VISIBILITY_THRESHOLD = 0.4

/**
 * Observes the given section ids and returns the id of the section currently
 * dominating the viewport. Used by the navbar to highlight the active link.
 */
export function useActiveSection(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { threshold: VISIBILITY_THRESHOLD },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}
