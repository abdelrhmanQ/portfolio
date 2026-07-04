import { Canvas } from '@react-three/fiber'
import CodeGlobe from './CodeGlobe'
import PointerParallax from './PointerParallax'
import Atmosphere from './Atmosphere'
import Starfield from './Starfield'
import CameraRig from './CameraRig'
import { CAMERA_FOV, CAMERA_START_Z } from './constants'
import type { IntroPhase } from './GlobeIntro'

interface GlobeSceneProps {
  phase: IntroPhase
  reducedMotion: boolean
  onZoomFadePoint: () => void
}

/**
 * The full react-three-fiber scene: starfield + code globe + atmosphere + camera rig.
 * One coherent 3D scene — the stars live in the same canvas as the globe.
 * R3F disposes declaratively-created objects when the canvas unmounts; manually
 * created resources (canvas texture, shader material, star buffers) have their own cleanups.
 */
export default function GlobeScene({ phase, reducedMotion, onZoomFadePoint }: GlobeSceneProps) {
  return (
    <Canvas
      className="globe-intro__canvas"
      camera={{ position: [0, 0, CAMERA_START_Z], fov: CAMERA_FOV }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 2, 4]} intensity={2.4} color="#fff3e0" />
      <Starfield paused={reducedMotion} />
      <PointerParallax disabled={reducedMotion}>
        <CodeGlobe paused={reducedMotion} />
        <Atmosphere />
      </PointerParallax>
      <CameraRig phase={phase} onZoomFadePoint={onZoomFadePoint} />
    </Canvas>
  )
}
