# bloch-sphere-drag

The **drag-state** gesture: drag anywhere on a (fixed-view, orthographic)
Bloch sphere to steer a qubit state — horizontal drag turns the azimuth
$\varphi$, vertical drag tilts the polar angle $\theta$ — while the readout
gives $|\psi\rangle = \cos(\theta/2)|0\rangle + e^{i\varphi}\sin(\theta/2)|1\rangle$
and the Born probabilities. Gate buttons **X / Z / H** act on the state as
sphere rotations ($\pi$ about $x$, $z$, and $(x{+}z)/\sqrt2$ respectively),
leaving a violet ghost at the previous state. At the poles the readout notes
that $\varphi$ is pure gauge.

jsdom-safe: `getScreenCTM`/`createSVGPoint` only inside pointer handlers; the
drag maps pointer *deltas* to $(\Delta\varphi, \Delta\theta)$, so there is no
front/back-hemisphere ambiguity. No `Math.random`, no rAF.

## Params

| param | type | required | description |
|---|---|---|---|
| `widgetId` | string | ✓ | outer `<div class="widget">` id |
| `svgId` | string | ✓ | `<svg>` id |
| `outputId` | string | ✓ | `.readout` id |
| `title` | string | ✓ | header title |
| `hint` | string | | header hint (HTML + KaTeX) |
| `svgTitle` | string | | accessible `<title>`; defaults to `title` |
| `initialTheta` | number | | boot θ in radians (default π/3) |
| `initialPhi` | number | | boot φ in radians (default π/4) |
| `viewBox` | string | | default `0 0 560 520` |
| `svgWidth` / `svgHeight` | number | | default 560 / 520 |

## Home

- `quantum-information.html` §qubits — the state as a thing you steer; gates
  as rigid motions of the sphere.
