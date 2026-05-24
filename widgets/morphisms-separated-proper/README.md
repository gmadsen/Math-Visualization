# morphisms-separated-proper

Bespoke widget for `morphisms-fiber-products.html` (§8 *Separated and proper morphisms*,
concept `separated-proper-morphisms`). It makes separatedness (diagonal closed) and properness
(valuative criterion) concrete by running one-parameter limits on three model spaces. Single
module, not part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

Buttons pick a target — the affine line $\mathbb{A}^1$ (**separated, not proper**), the
projective line $\mathbb{P}^1$ (**separated and proper**), and the **line with doubled origin**
(**not separated**) — and a slider runs a one-parameter family (a parameter $t$ heading to a
limit). The widget shows the limit behaviour:

- $\mathbb{P}^1$: every one-parameter limit exists and is **unique** (a family $t\mapsto 1/t$
  limits to $\infty$) — proper.
- $\mathbb{A}^1$: a family escaping to $\infty$ has **no** limit — separated but not proper.
- doubled-origin line: a family approaching $0$ has **two** limits, the two origins — not
  separated.

The readout defines **separated** via the diagonal $\Delta_f\colon X\to X\times_S X$ being a
closed immersion (the scheme analog of Hausdorff: the diagonal closed in the product), exhibits
the doubled-origin line as the prototype whose diagonal fails to close at $(0_{\mathrm L},
0_{\mathrm R})$, and defines **proper** as separated $+$ finite type $+$ universally closed,
captured by the **valuative criterion** (limits along a DVR / punctured disk exist, uniquely).

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-t`/`-btns` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The three model spaces and the one-parameter family are fixed inside the renderer; the buttons
pick the space and the slider runs the parameter $t$.

## Usage

Add a `widget` block plus its `widget-script` block to `content/morphisms-fiber-products.json`:

```json
{ "type": "widget",        "slug": "morphisms-separated-proper", "params": { "widgetId": "w-sepprop", "title": "Separated vs proper: the diagonal and the valuative criterion", "hint": "run t toward a limit on A¹, P¹, and the doubled-origin line" } },
{ "type": "widget-script", "ref": "w-sepprop" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain.
