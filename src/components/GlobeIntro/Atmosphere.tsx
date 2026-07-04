import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { ATMOSPHERE_COLOR, ATMOSPHERE_SCALE, GLOBE_RADIUS } from './constants'

const VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Classic rim-glow: back faces of a slightly larger sphere, additive-blended.
// The opaque earth occludes the centre, leaving only the halo at the silhouette.
const FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vNormal;
  uniform vec3 uColor;
  void main() {
    float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
    gl_FragColor = vec4(uColor, 1.0) * max(intensity, 0.0) * 0.85;
  }
`

/** Soft blue halo around the earth, consistent with the Liquid Glass accent colour. */
export default function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: { uColor: { value: new THREE.Color(ATMOSPHERE_COLOR) } },
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    [],
  )

  useEffect(() => () => material.dispose(), [material])

  return (
    <mesh scale={ATMOSPHERE_SCALE} material={material}>
      <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
    </mesh>
  )
}
