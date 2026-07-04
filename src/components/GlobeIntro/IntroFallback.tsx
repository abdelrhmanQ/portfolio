/**
 * Lightweight loading state shown while the lazy-loaded 3D bundle
 * (three / react-three-fiber / drei) is being fetched. Pure CSS — no 3D cost.
 */
export default function IntroFallback() {
  return (
    <div className="globe-intro globe-intro--fallback" aria-label="Loading">
      <div className="intro-fallback__orb" aria-hidden="true" />
      <p className="intro-fallback__label">loading…</p>
    </div>
  )
}
