# recurrence-plotter

Iterates a single-variable recurrence `x_{n+1} = f(x_n)` (or two-term
`x_{n+1} = f(x_n, x_{n-1})`) and shows the trajectory plus, for one-term
cases, a cobweb diagram on the `y = x` line. The widget emits an empty host
div; the page-global library
[`js/widget-recurrence-plotter.js`](../../js/widget-recurrence-plotter.js)
builds chrome (header, sliders, SVG, readout) at runtime via
`MVRecurrencePlotter.init('#widgetId', config)`.

## When to reach for it

Use `recurrence-plotter` for pages that visualize iteration / dynamical
systems — logistic-map period doubling on a real-analysis or chaos page,
Newton iteration converging to a root on a numerical-methods page,
Fibonacci-style two-term recurrences on a generating-functions page.

The recurrence rule is selected from a curated whitelist (`kind`) — the
widget never evaluates user-typed expressions.

## Params

See [`schema.json`](./schema.json) for the authoritative definition.

| field        | required | type / shape                                                    |
|--------------|----------|-----------------------------------------------------------------|
| `widgetId`   | yes      | DOM id for the host `<div class="widget">`.                     |
| `title`      | yes      | Header title.                                                   |
| `hint`       | no       | Header hint.                                                    |
| `viewBox`    | no       | SVG viewBox (default `'0 0 480 220'`).                          |
| `kind`       | yes      | `'logistic'` \| `'quadratic'` \| `'linear-2term'`.              |
| `params`     | no       | Initial knob values; library defaults fill any omitted keys.    |

### Kinds

| kind            | recurrence                            | sliders     | initial knobs                       |
|-----------------|---------------------------------------|-------------|-------------------------------------|
| `logistic`      | `x_{n+1} = r·x_n·(1 − x_n)`            | `r`, `x₀`    | `{ r, x0, n }`                       |
| `quadratic`     | `x_{n+1} = a·x_n² + c`                 | `a`, `c`, `x₀` | `{ a, c, x0, n }`                  |
| `linear-2term`  | `x_{n+1} = a·x_n + b·x_{n-1}`          | `a`, `b`     | `{ a, b, x0, x1, n }`                |

New kinds are added in `js/widget-recurrence-plotter.js`'s `KINDS` table
and listed in this widget's schema enum.

## Alternate frontends

A React / SSR frontend can ignore `renderScript` and reimplement the
iteration from `kind + params` alone — the iteration code is fully data
when read alongside the library's `KINDS` catalog (which doubles as a
spec).

## Example

A canonical logistic-map instance lives at [`example.json`](./example.json)
and is the test fixture in `scripts/test-widget-renderers.mjs`.
