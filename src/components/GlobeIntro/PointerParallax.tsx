import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Max tilt of the whole globe group toward the pointer, in radians. */
const MAX_PARALLAX_RAD = 0.07
/** Damping half-life factor — higher = quicker follow, lower = floatier. */
const DAMP_LAMBDA = 3

interface PointerParallaxProps {
  /** Disables the effect (reduced motion) — children render static. */
  disabled: boolean
  children: ReactNode
}

/**
 * Gently tilts its children toward the pointer using frame-rate-independent
 * damping (THREE.MathUtils.damp). R3F tracks the normalized pointer for us,
 * so no mousemove listener is needed — the read happens inside the existing
 * frame loop, costing nothing extra.
 */
export default function PointerParallax({ disabled, children }: PointerParallaxProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ pointer }, delta) => {
    const group = groupRef.current
    if (!group || disabled) return
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      pointer.x * MAX_PARALLAX_RAD,
      DAMP_LAMBDA,
      delta,
    )
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      -pointer.y * MAX_PARALLAX_RAD,
      DAMP_LAMBDA,
      delta,
    )
  })

  return <group ref={groupRef}>{children}</group>
}
