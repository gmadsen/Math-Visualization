# motives-tate-twist

Bespoke widget for `motives.html` (§4 *The Tate twist $\mathbb{Q}(n)$*, concept `tate-twist`).
It shows the Tate twist $\mathbb{Q}(n)$ **as a motive, through every realization** — one twist,
many incarnations. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

The Lefschetz motive $\mathbb{L}=h^2(\mathbb{P}^1)$; the Tate motive $\mathbb{Q}(1):=\mathbb{L}^{-1}$;
$\mathbb{Q}(n):=\mathbb{Q}(1)^{\otimes n}$. A slider sets $n$, and the widget tabulates the
incarnation of $\mathbb{Q}(n)$ in each realization:

| realization | $\mathbb{Q}(n)$ |
|---|---|
| Betti | $(2\pi i)^n\cdot\mathbb{Q}$ — weight $-2n$, Hodge type $(-n,-n)$ |
| de Rham | $\mathbb{Q}$, Hodge filtration jumps at $-n$ |
| $\ell$-adic | $\mathbb{Q}_\ell(n)=\chi_{\mathrm{cyc}}^{\,n}$ |
| crystalline | $\varphi$-module, $\varphi=\times p^{-n}$, Newton slope $-n$ |
| point-count | the measure sends $\mathbb{L}\mapsto q$, so geom. Frobenius eigenvalue $q^{-n}$ |

A weight number-line places $\mathbb{Q}(n)$ at $-2n$, the unit $\mathbb{Q}(0)$ at $0$, and
$\mathbb{L}=\mathbb{Q}(-1)$ at $+2$ — each twist shifts the weight by $-2$. (The Lefschetz motive
is rendered as plain `L` in the SVG/readout, since the blackboard $\mathbb{L}$ is an
astral-plane glyph.)

The readout covers the Lefschetz/Tate motives, the realization incarnations, and the role of
$\mathbb{Q}(n)$ in normalizing weights and shifting $L$-functions.

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`.

## Usage

```json
{ "type": "widget",        "slug": "motives-tate-twist", "params": { "widgetId": "w-mtate", "title": "The Tate twist ℚ(n): one twist, every realization's incarnation", "hint": "slide n; ℚ(n) = L⁻ⁿ has weight −2n and Frobenius eigenvalue q⁻ⁿ" } },
{ "type": "widget-script", "ref": "w-mtate" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
