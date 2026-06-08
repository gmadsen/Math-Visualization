# functional-equation-mirror

Bespoke **"drag-reflect"** widget for **Riemann's functional equation**
$\xi(s) = \xi(1-s)$. First home: `analytic-continuation §zeta` (§6 "The Riemann
zeta functional equation"), beside the `button-stepper` that derives the
completion. Not part of a shared family — the math (the completed Riemann zeta)
is specific, so the renderer is self-contained.

## What it does

The reader drags a point $s = \sigma + it$ across the complex plane. The widget
draws the **functional-equation partner** $1-s$ — the point reflection of $s$
through the centre $(\tfrac12, 0)$ — and evaluates the **completed zeta**

$$\xi(s) = \tfrac12\, s(s-1)\,\pi^{-s/2}\,\Gamma(s/2)\,\zeta(s)$$

at *both* points, displaying that they are **equal** wherever you drag. The
critical line $\mathrm{Re}\,s = \tfrac12$ is the mirror axis (yellow), drawn
inside the shaded **critical strip**; the first **nontrivial zeros** are ringed
on it (pink). Drag $s$ onto the line near a ring and $|\xi(s)| \to 0$.

## The math (honest, no lookup tables)

$\xi$ is computed for **any** complex $s$ from the everywhere-convergent,
manifestly $s \leftrightarrow 1-s$ symmetric integral derived on the page itself:

$$\xi(s) = \tfrac12 + \tfrac12\, s(s-1) \int_1^\infty \frac{\theta(x)-1}{2}\,
\bigl(x^{s/2-1} + x^{(1-s)/2-1}\bigr)\,dx,$$

where $\theta(x)-1 = 2\sum_{n\ge 1} e^{-\pi n^2 x}$ is the Jacobi theta tail
(super-exponential decay, ~8 terms suffice for $x \ge 1$). The integral is
evaluated by **Simpson quadrature in complex arithmetic** (`N=360`, upper limit
`X=18`). The leading $\tfrac12$ is the algebraically-cancelled $-1/(s(1-s))$ pole,
so $\xi$ is entire and the form is pole-free (e.g. $\xi(0)=\xi(1)=\tfrac12$). The
symmetry $\xi(s)=\xi(1-s)$ holds to machine precision because the integrand is
symmetric by construction; the form reproduces $\xi(2)=\pi/6$, $\xi(\tfrac12)\approx
0.49712$, and the first zero at $\tfrac12 + 14.1347i$.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | string | required — DOM ids + title |
| `hint` / `svgTitle` | string | optional hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | — | SVG geometry (default `0 0 440 600` / 440 / 600) |
| `sigma0` / `sigma1` / `t0` / `t1` | number | plane bounds (default $[-1.5,2.5]\times[-15,15]$) |
| `sigmaInit` / `tInit` | number | initial puck position (default $0.8 + 6i$) |
| `zeros` | number[] | imaginary parts of zeros to ring on the line (default first three) |
| `resetLabel` | string | reset-button label |

## Usage

```json
{ "type": "widget", "slug": "functional-equation-mirror", "params": {
  "widgetId": "w-fem", "svgId": "fem-svg", "outputId": "fem-out",
  "title": "Riemann's functional equation: drag s, mirror at 1−s"
} },
{ "type": "widget-script", "ref": "w-fem" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (full byte-identical round-trip).

## Authoring notes

- jsdom-safe: `createSVGPoint`/`getScreenCTM` run only inside the pointer
  handlers; the static plane + heatmap are built once, only the puck + partner +
  readout redraw on drag.
- Colour tokens only: `var(--cyan)` critical strip, `var(--yellow)` critical line
  + puck, `var(--green)` partner $1-s$, `var(--pink)` zeros, `var(--mute)`/`var(--ink)`
  axes + center.
- The static plane does **no** $\xi$ evaluation; each drag does exactly two (s and
  1−s, ~0.1 ms each), so dragging is instant and the jsdom/CI hydration is cheap.
