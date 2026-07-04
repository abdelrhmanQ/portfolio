import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  CODE_TEXTURE_FONT_SIZE,
  CODE_TEXTURE_HEIGHT,
  CODE_TEXTURE_LINE_HEIGHT,
  CODE_TEXTURE_WIDTH,
  GLOBE_AXIAL_TILT,
  GLOBE_RADIUS,
  GLOBE_ROTATION_SPEED,
  GLOBE_SEGMENTS,
} from './constants'

/** Token pool the planet's surface is written with. Colours match theme.css. */
const CODE_TOKENS: { text: string; color: string }[] = [
  // keywords — violet (--accent-2)
  { text: 'const', color: '#a78bfa' },
  { text: 'await', color: '#a78bfa' },
  { text: 'return', color: '#a78bfa' },
  { text: 'async', color: '#a78bfa' },
  { text: 'export', color: '#a78bfa' },
  { text: '=>', color: '#a78bfa' },
  // strings — cyan (--accent-3)
  { text: '"Abdelrahman Khaled"', color: '#22d3ee' },
  { text: '"Full Stack Developer"', color: '#22d3ee' },
  { text: '"front-end"', color: '#22d3ee' },
  { text: '"back-end"', color: '#22d3ee' },
  { text: '"MongoDB"', color: '#22d3ee' },
  // identifiers / calls — blue (--accent)
  { text: 'developer', color: '#4f9eff' },
  { text: 'fetch("/api/projects")', color: '#4f9eff' },
  { text: 'app.listen(3000)', color: '#4f9eff' },
  { text: 'useState()', color: '#4f9eff' },
  { text: 'db.connect()', color: '#4f9eff' },
  { text: 'render()', color: '#4f9eff' },
  // numbers — warm amber, a counterpoint to the cool palette
  { text: '3000', color: '#fbbf24' },
  { text: '200', color: '#fbbf24' },
  { text: '0.16', color: '#fbbf24' },
  { text: 'true', color: '#fbbf24' },
  // structure / punctuation — dim
  { text: '{', color: '#5d6a94' },
  { text: '}', color: '#5d6a94' },
  { text: '();', color: '#5d6a94' },
  { text: '[...]', color: '#5d6a94' },
  { text: '&&', color: '#5d6a94' },
  { text: '01101', color: '#5d6a94' },
  { text: '/* craft */', color: '#5d6a94' },
  { text: 'available:', color: '#5d6a94' },
]

const TOKEN_GAP_PX = 14
const BRIGHT_LINE_CHANCE = 0.16 // some rows glow brighter, like an active editor line
const BRIGHT_LINE_GLOW_PX = 9
/** Vertical gradient stops for the planet surface — deep indigo, not flat black. */
const SURFACE_GRADIENT: [number, string][] = [
  [0, '#0c1330'],
  [0.5, '#070c1e'],
  [1, '#0b1028'],
]

/**
 * Paints an equirectangular canvas full of randomly assembled code tokens and
 * wraps it as a THREE.CanvasTexture — a planet made of code instead of terrain.
 * Runs once per mount; no image download involved.
 */
function createCodeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = CODE_TEXTURE_WIDTH
  canvas.height = CODE_TEXTURE_HEIGHT
  const ctx = canvas.getContext('2d')!

  // Deep-indigo vertical gradient instead of flat black — gives the sphere
  // tonal depth once it's lit and wrapped
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  for (const [stop, color] of SURFACE_GRADIENT) gradient.addColorStop(stop, color)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.font = `${CODE_TEXTURE_FONT_SIZE}px "Space Mono", monospace`
  ctx.textBaseline = 'top'

  for (let y = 0; y < canvas.height; y += CODE_TEXTURE_LINE_HEIGHT) {
    const brightLine = Math.random() < BRIGHT_LINE_CHANCE
    if (brightLine) {
      // faint highlight bar behind the row, like the active line in an editor
      ctx.globalAlpha = 0.05
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, y - 3, canvas.width, CODE_TEXTURE_LINE_HEIGHT)
    }
    // random negative start so line seams don't align vertically
    let x = -Math.floor(Math.random() * 120)
    while (x < canvas.width) {
      const token = CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)]
      ctx.fillStyle = token.color
      if (brightLine) {
        ctx.globalAlpha = 1
        ctx.shadowColor = token.color
        ctx.shadowBlur = BRIGHT_LINE_GLOW_PX
      } else {
        ctx.globalAlpha = 0.6 + Math.random() * 0.25
        ctx.shadowBlur = 0
      }
      ctx.fillText(token.text, x, y)
      x += ctx.measureText(token.text).width + TOKEN_GAP_PX
    }
  }
  ctx.globalAlpha = 1
  ctx.shadowBlur = 0

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  texture.wrapS = THREE.RepeatWrapping
  return texture
}

interface CodeGlobeProps {
  /** When true (reduced motion) the ambient spin is frozen. */
  paused: boolean
}

/**
 * The planet: a sphere wrapped in procedurally generated glowing code.
 * The texture doubles as an emissive map so the "code" stays readable on the
 * night side. Rotation runs on the R3F frame loop (rAF-driven).
 */
export default function CodeGlobe({ paused }: CodeGlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useMemo(createCodeTexture, [])

  // The canvas texture is created manually, so dispose it manually too.
  useEffect(() => () => texture.dispose(), [texture])

  useFrame((_, delta) => {
    if (!paused && meshRef.current) {
      meshRef.current.rotation.y += GLOBE_ROTATION_SPEED * delta
    }
  })

  return (
    <mesh ref={meshRef} rotation={[GLOBE_AXIAL_TILT, 0, 0]}>
      <sphereGeometry args={[GLOBE_RADIUS, GLOBE_SEGMENTS, GLOBE_SEGMENTS]} />
      <meshStandardMaterial
        map={texture}
        emissive="#ffffff"
        emissiveMap={texture}
        emissiveIntensity={0.55}
        roughness={0.85}
        metalness={0.1}
      />
    </mesh>
  )
}
