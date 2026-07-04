import { useEffect, useState } from 'react'
import { useActiveSection } from '@/hooks/useActiveSection'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#home', label: 'Home', id: 'home' },
  { href: '#projects', label: 'Projects', id: 'projects' },
  { href: '#about', label: 'About', id: 'about' },
  { href: '#contact', label: 'Contact', id: 'contact' },
]

const SECTION_IDS = NAV_LINKS.map((link) => link.id)
const SCROLLED_THRESHOLD_PX = 40

/** Fixed glass navbar with active-section highlight and a full-screen mobile menu. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeId = useActiveSection(SECTION_IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLLED_THRESHOLD_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.classList.toggle('no-scroll', mobileOpen)
    return () => document.body.classList.remove('no-scroll')
  }, [mobileOpen])

  // Close the menu if the viewport grows past the mobile breakpoint
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 769px)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false)
    }
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  return (
    <>
      <nav id="navbar" className={cn(scrolled && 'scrolled')}>
        <div className="container nav-inner">
          <a href="#home" className="nav-logo">
            AK<span>.</span>
          </a>

          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a href={link.href} className={cn(activeId === link.id && 'active')}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={cn('hamburger', mobileOpen && 'open')}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={cn('nav-mobile', mobileOpen && 'open')}>
        {NAV_LINKS.map((link) => (
          <a key={link.id} href={link.href} onClick={() => setMobileOpen(false)}>
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}
