# three-body-launcher

The **launch** gesture: press anywhere to place a massless test particle in
the planar circular restricted three-body problem (rotating frame), drag to
stretch a velocity arrow, release to launch. The trajectory is RK4-integrated
with the Coriolis terms,

$$\ddot x = 2\dot y + x - \frac{(1-\mu)(x+\mu)}{r_1^3} - \frac{\mu(x-1+\mu)}{r_2^3},\qquad
\ddot y = -2\dot x + y - \frac{(1-\mu)\,y}{r_1^3} - \frac{\mu\, y}{r_2^3},$$

and drawn in one stroke. The five Lagrange points are marked — the collinear
L1/L2/L3 found by bisection on the on-axis acceleration at init, L4/L5 placed
exactly at $(\tfrac12-\mu,\pm\tfrac{\sqrt3}{2})$. The readout reports the
launch state, its Jacobi constant $C = x^2{+}y^2 + 2(1-\mu)/r_1 + 2\mu/r_2 -
v^2$, and the outcome: crash into a primary, escape from the window, or still
orbiting at $t = 24$. Previous trajectories fade to ghosts. The boot state
(and the **↺ Tadpole at L4** button) launches a small offset from L4 at rest —
a tadpole orbit, stable because the default $\mu = 0.012$ is below the Routh
limit.

jsdom-safe: `getScreenCTM`/`createSVGPoint` only inside pointer handlers; the
boot trajectory is integrated deterministically at init. No `Math.random`,
no rAF.

## Params

| param | type | required | description |
|---|---|---|---|
| `widgetId` | string | ✓ | outer `<div class="widget">` id |
| `svgId` | string | ✓ | `<svg>` id |
| `outputId` | string | ✓ | `.readout` id |
| `title` | string | ✓ | header title |
| `hint` | string | | header hint (HTML + KaTeX) |
| `svgTitle` | string | | accessible `<title>`; defaults to `title` |
| `mu` | number | | mass ratio of the smaller primary (default 0.012) |
| `bootSeed` | number[4] | | boot `[x, y, vx, vy]`; default = L4 + 0.02 offset at rest |
| `viewBox` | string | | default `0 0 640 520` |
| `svgWidth` / `svgHeight` | number | | default 640 / 520 |

## Home

- `three-body-problem.html` §restricted — the rotating frame as a landscape
  with five stationary points; Coriolis as the stabilizer of L4/L5.
