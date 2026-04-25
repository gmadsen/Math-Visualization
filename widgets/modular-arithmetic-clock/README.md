# modular-arithmetic-clock

Visualizes arithmetic in $\mathbb{Z}/n$ on a circular dial of $n$ equally
spaced points labelled $0, 1, \dots, n-1$. The widget emits an empty host
div; the page-global library
[`js/widget-modular-arithmetic-clock.js`](../../js/widget-modular-arithmetic-clock.js)
builds chrome (header, sliders, SVG dial, readout) at runtime via
`MVModularArithmeticClock.init('#widgetId', config)`.

Two interaction modes selected by `kind`:

- **`addition`** — sliders for $a$ and $b$. The dial draws an arrow from
  $0$ to $a$ (color A), then a second arrow from $a$ to $(a+b) \bmod n$
  (color B), and highlights the result. Readout: $a + b \equiv (a+b) \bmod
  n \pmod n$.
- **`multiplication`** — sliders for the multiplier $a$ and the modulus
  $n$. The dial draws the map $k \mapsto (k \cdot a) \bmod n$ as a bundle
  of arrows, distinguishing the unit case ($\gcd(a,n)=1$, every cycle has
  length $\operatorname{ord}_n(a)$) from the zero-divisor case. Readout:
  $\times\, a \pmod n$ — $\gcd(a,n) = \dots$, cycle length $\dots$.

## When to reach for it

- A first encounter with $\mathbb{Z}/n$ on a number-theory or
  group-theory page — the dial is the canonical mental picture.
- Pages introducing **units and zero divisors** modulo $n$: the
  multiplication mode visually separates "every point hit" (unit) from
  "the image collapses onto a subgroup" (zero divisor).
- Cyclic-group order / generator discussions — the cycle length appears
  directly in the readout.

If you need a generic plot, prefer `parametric-plot`. If you need a
multi-step proof walkthrough rather than a free-play knob, use
`proof-scrubber`.

## Params

See [`schema.json`](./schema.json) for the authoritative definition.

| field      | required | type / shape                                                     |
|------------|----------|------------------------------------------------------------------|
| `widgetId` | yes      | DOM id for the host `<div class="widget">`.                      |
| `title`    | yes      | Header title.                                                    |
| `hint`     | no       | Header hint.                                                     |
| `viewBox`  | no       | SVG viewBox for the dial (default `'0 0 320 320'`).              |
| `kind`     | yes      | `'addition'` \| `'multiplication'`.                              |
| `params`   | no       | Initial slider values; library defaults fill any omitted keys.   |

### Per-kind knobs

| kind             | sliders          | initial knobs            | what's drawn                                                                |
|------------------|------------------|--------------------------|------------------------------------------------------------------------------|
| `addition`       | `n`, `a`, `b`     | `{ n, a, b }`             | Two chained arrows $0 \to a \to (a+b) \bmod n$; result vertex highlighted.  |
| `multiplication` | `n`, `a`          | `{ n, a }`                | All arrows $k \to (k \cdot a) \bmod n$; cycles colored; gcd readout.       |

`b` is ignored when `kind = 'multiplication'`.

## Alternate frontends

A React / SSR consumer can ignore `renderScript` entirely and reimplement
the dial from `kind + params` alone — the geometry is "n equally spaced
points on a unit circle" and the arrows are pure modular-arithmetic
output. The library is one possible renderer, not the spec.

## Example

A canonical addition-mode instance lives at [`example.json`](./example.json)
(`n = 12`, `a = 5`, `b = 4` — the classic clock-arithmetic vignette) and
is the test fixture in `scripts/test-widget-renderers.mjs`.
