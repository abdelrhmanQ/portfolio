import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Pointing from '@/components/sections/Pointing'
import Projects from '@/components/sections/Projects'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'
import Cursor from '@/components/Cursor/Cursor'
import IntroFallback from '@/components/GlobeIntro/IntroFallback'
import SpotlightBackground from '@/components/ui/spotlight-background'

// Lazy-loaded so three.js / react-three-fiber never weigh down the initial bundle.
const GlobeIntro = lazy(() => import('@/components/GlobeIntro/GlobeIntro'))

/**
 * 'intro'    → globe only, portfolio not mounted
 * 'entering' → cross-fade: portfolio mounted beneath the fading intro overlay
 * 'entered'  → intro unmounted (all Three.js resources released), portfolio only
 */
type AppPhase = 'intro' | 'entering' | 'entered'

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('intro')

  const handleTransitionStart = useCallback(() => {
    setPhase((current) => (current === 'intro' ? 'entering' : current))
  }, [])

  const handleEnter = useCallback(() => setPhase('entered'), [])

  // No scrolling while the full-screen intro is up.
  useEffect(() => {
    document.body.classList.toggle('no-scroll', phase === 'intro')
    return () => document.body.classList.remove('no-scroll')
  }, [phase])

  return (
    <>
      <Cursor />

      {phase !== 'entered' && (
        <Suspense fallback={<IntroFallback />}>
          <GlobeIntro onTransitionStart={handleTransitionStart} onEnter={handleEnter} />
        </Suspense>
      )}

      {phase !== 'intro' && (
        <div className="site">
          <SpotlightBackground>
            <Navbar />
            <main>
              <Hero />
              <Pointing />
              <Projects />
              <About />
              <Contact />
            </main>
            <Footer />
          </SpotlightBackground>
        </div>
      )}
    </>
  )
}
