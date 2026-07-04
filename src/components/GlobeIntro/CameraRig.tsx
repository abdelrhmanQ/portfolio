import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CAMERA_END_Z, CAMERA_START_Z, ZOOM_DURATION_S, ZOOM_FADE_START } from './constants'
import type { IntroPhase } from './GlobeIntro'

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

interface CameraRigProps {
  phase: IntroPhase
  /** Fired once, mid-zoom, so the parent can start the cross-fade while the dolly finishes. */
  onZoomFadePoint: () => void
}

/**
 * Drives the "fly into the globe" camera dolly on the R3F frame loop.
 * Runs only after a zoom has started — the reduced-motion / skip path
 * (idle → transitioning) never moves the camera.
 */
export default function CameraRig({ phase, onZoomFadePoint }: CameraRigProps) {
  const progressRef = useRef(0)
  const fadeFiredRef = useRef(false)

  useFrame(({ camera }, delta) => {
    const zoomStarted = phase === 'zooming' || (phase !== 'idle' && progressRef.current > 0)
    if (!zoomStarted || progressRef.current >= 1) return

    progressRef.current = Math.min(progressRef.current + delta / ZOOM_DURATION_S, 1)
    const eased = easeInOutCubic(progressRef.current)
    camera.position.z = CAMERA_START_Z + (CAMERA_END_Z - CAMERA_START_Z) * eased

    if (!fadeFiredRef.current && progressRef.current >= ZOOM_FADE_START) {
      fadeFiredRef.current = true
      onZoomFadePoint()
    }
  })

  return null
}
