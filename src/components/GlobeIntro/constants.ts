/** All tuning knobs for the globe intro live here — no magic numbers in components. */

export const GLOBE_RADIUS = 1.8
export const GLOBE_SEGMENTS = 64
export const GLOBE_ROTATION_SPEED = 0.06 // radians per second (slow ambient spin)
export const GLOBE_AXIAL_TILT = 0.28 // radians, purely aesthetic

/* Procedural "code planet" texture (drawn on an offscreen canvas at mount) */
export const CODE_TEXTURE_WIDTH = 2048
export const CODE_TEXTURE_HEIGHT = 1024
export const CODE_TEXTURE_FONT_SIZE = 20
export const CODE_TEXTURE_LINE_HEIGHT = 26

export const ATMOSPHERE_SCALE = 1.12
export const ATMOSPHERE_COLOR = '#4f9eff' // matches --accent in theme.css

export const CAMERA_FOV = 42
export const CAMERA_START_Z = 7
export const CAMERA_END_Z = 2.15 // just above the surface → "flying in" feel
export const ZOOM_DURATION_S = 1.3
export const ZOOM_FADE_START = 0.5 // fraction of the zoom at which the cross-fade begins
export const FADE_DURATION_MS = 650

export interface StarLayerConfig {
  count: number
  size: number
  rotationSpeed: number // radians per second — different per layer = parallax depth
  color: string
  opacity: number
}

/** Three layers moving at different speeds recreate the reference's parallax depth. */
export const STAR_LAYERS: StarLayerConfig[] = [
  { count: 900, size: 0.055, rotationSpeed: 0.004, color: '#cfd8ff', opacity: 0.55 },
  { count: 350, size: 0.11, rotationSpeed: 0.008, color: '#e8eaf2', opacity: 0.75 },
  { count: 120, size: 0.2, rotationSpeed: 0.013, color: '#ffffff', opacity: 0.95 },
]

export const STARFIELD_INNER_RADIUS = 18
export const STARFIELD_OUTER_RADIUS = 46
