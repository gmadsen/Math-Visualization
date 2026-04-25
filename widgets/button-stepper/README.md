# button-stepper

Shared renderer for the `button-stepper-svg` (45 widgets) and
`button-stepper-text` (~2 widgets) families — widgets with an SVG (or
HTML-only) host plus one or more `<button>` elements wired to step / reset /
next / prev / custom actions, with zero range sliders and zero selects.
Proof-of-concept migrates three widgets from `point-set-topology.html`
(`w-top`, `w-comp`, `w-sep`); subsequent passes will absorb more topics from
the 28 that contain this family.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Assembles the button-stepper chrome (widget wrapper, `.hd` header, SVG host,
labelled button rows, readout panel) from a structured `layout` array, then
wraps a bespoke driving IIFE captured verbatim in the `bodyScript` artifact.
Portable consumers can drive the UI from `buttons` + `layout` + optional
`steps` / `stepCount` alone; `bodyScript` exists only so the vanilla-HTML
frontend's round-trip stays byte-identical.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title in the `.hd` header and default `<svg><title>` text. |
| `hint`     | string (optional) | Short hint rendered next to the title. |
| `svgId`, `viewBox`, `readoutId` | string (optional) | Convenience mirrors for portable consumers; vanilla renderer reads geometry from `layout`. |
| `buttons`  | `[{id?, label, dataAttr?, className?, action?}]` (optional) | Flat list of every button with an action intent. |
| `stepCount` | integer ≥ 1 (optional) | Linear-stepper state size. |
| `steps`    | `[object]` (optional) | Named-state sequence (opaque shape). |
| `sectionComment` | string (optional) | Text inserted as `/* <here> */` between `<script>` and the IIFE open. |
| `bodyScript` | string | **ARTIFACT.** Verbatim JS body inside `(function(){ … })()`. |
| `layout`   | `[layoutBlock]` | Ordered inner-widget blocks (see below). |

### `layoutBlock` kinds

- `{ kind: "svg", id, viewBox, width, height, titleText? }` — renders
  `<svg id="…" viewBox="…" width="…" height="…"><title>…</title></svg>`.
  `titleText` defaults to the widget's `title`.
- `{ kind: "row", id?, label?, buttons?: [...] }` — renders a
  `<div class="row">` with optional label + buttons each on their own line;
  collapses to `<div class="row" id="…"></div>` when only `id` is set.
- `{ kind: "readout", id, content? }` — renders
  `<div class="readout" id="…">{content}</div>`.
- `{ kind: "raw", html }` — escape hatch; emits `  {html}` verbatim.

### `button`

`{ id?, label, dataAttr?: {name, value}, className?, action? }` — at least
one of `id` / `dataAttr` should be present so click-handlers can target
the button. Attribute emission order: `id`, `dataAttr`, `class`.

## Usage

Embed the widget with a paired block-pair in `content/<topic>.json`:

```json
{ "type": "widget",        "slug": "button-stepper", "id": "w-my", "params": { "widgetId": "w-my", "title": "…", "layout": [ … ], "bodyScript": "…" } },
{ "type": "widget-script", "slug": "button-stepper", "forWidget": "w-my", "params": { "widgetId": "w-my", "title": "…", "layout": [ … ], "bodyScript": "…" } }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate
the params against this widget's schema, and `node scripts/rebuild.mjs`
for the full chain (including the byte-identical round-trip gate).
