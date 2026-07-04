import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  STAR_LAYERS,
  STARFIELD_INNER_RADIUS,
  STARFIELD_OUTER_RADIUS,
  type StarLayerConfig,
} from './constants'

/**
 * Random points uniformly distributed in a spherical shell around the scene.
 * Computed once per mount (memoised) — never regenerated on re-render.
 */
function createStarPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const radius =
      STARFIELD_INNER_RADIUS + Math.random() * (STARFIELD_OUTER_RADIUS - STARFIELD_INNER_RADIUS)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)
  }
  return positions
}

interface StarLayerProps {
  config: StarLayerConfig
  paused: boolean
}

function StarLayer({ config, paused }: StarLayerProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(createStarPositions(config.count), 3))
    return g
  }, [config])

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: config.size,
        color: config.color,
        opacity: config.opacity,
        transparent: true,
        sizeAttenuation: true,
        depthWrite: false,
      }),
    [config],
  )

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useFrame((_, delta) => {
    if (!paused && pointsRef.current) {
      pointsRef.current.rotation.y += config.rotationSpeed * delta
    }
  })

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
}

interface StarfieldProps {
  paused: boolean
}

/**
 * Three point-cloud layers rotating at different speeds — the WebGL equivalent
 * of the reference component's multi-speed box-shadow star layers (parallax depth),
 * living inside the same scene as the globe instead of a DOM div behind the canvas.
 */
export default function Starfield({ paused }: StarfieldProps) {
  return (
    <group>
      {STAR_LAYERS.map((config, index) => (
        <StarLayer key={index} config={config} paused={paused} />
      ))}
    </group>
  )
}
