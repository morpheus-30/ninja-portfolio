/**
 * Authored SVG textures, inlined as data URIs.
 *
 * These are the grain and structure of each world — paper fibre for the scroll,
 * a Bayer dither and phosphor grid for the cabinet. Generating them here keeps
 * them resolution-independent and adds no network requests.
 */

const svgUrl = (svg) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}")`;

/** Washi fibre: fractal noise, desaturated, used at low opacity over ink. */
export const paperGrain = svgUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
    <filter id="g" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" seed="7"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="180" height="180" filter="url(#g)" opacity="0.55"/>
  </svg>
`);

/** Coarser, directional fibre so the paper reads as pressed sheet, not static. */
export const paperFibre = svgUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
    <filter id="f">
      <feTurbulence type="fractalNoise" baseFrequency="0.02 0.6" numOctaves="3" seed="19"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="240" height="240" filter="url(#f)" opacity="0.4"/>
  </svg>
`);

/**
 * Hanko seal. Deliberately abstract concentric strokes rather than imitation
 * kanji — a wrong glyph would read as a mistake to anyone who can read it.
 */
export const sealStamp = svgUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"
       stroke="%23b91c1c" stroke-width="4">
    <rect x="6" y="6" width="88" height="88" rx="10"/>
    <path d="M26 30h48M26 50h48M26 70h48" stroke-width="7" stroke-linecap="square"/>
    <path d="M50 22v56" stroke-width="7" stroke-linecap="square"/>
  </svg>
`);

/** 4x4 Bayer dither — the honest way to shade a low-bit display. */
export const bayerDither = svgUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" shape-rendering="crispEdges">
    <rect width="4" height="4" fill="%23000" opacity="0"/>
    <rect x="0" y="0" width="1" height="1" fill="%23fff" opacity="0.09"/>
    <rect x="2" y="1" width="1" height="1" fill="%23fff" opacity="0.09"/>
    <rect x="1" y="2" width="1" height="1" fill="%23fff" opacity="0.06"/>
    <rect x="3" y="3" width="1" height="1" fill="%23fff" opacity="0.06"/>
  </svg>
`);

/** Phosphor triad mask: the RGB stripe an aperture-grille CRT actually shows. */
export const phosphorGrid = svgUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" width="3" height="3" shape-rendering="crispEdges">
    <rect x="0" width="1" height="3" fill="%23ff0040" opacity="0.16"/>
    <rect x="1" width="1" height="3" fill="%2300ff88" opacity="0.13"/>
    <rect x="2" width="1" height="3" fill="%230080ff" opacity="0.16"/>
  </svg>
`);
