# svg-illustration

A **static** widget: an SVG figure inside standard `.widget` chrome with no
driving script and no interactive controls. Think "3Blue1Brown diagram
embedded in the page" — pure visual decoration of a concept that does not
react to input.

The motive for giving these a registry entry is not rendering logic — there
is almost none — but **metadata and portability**:

- `meta.family = "svg-illustration"` lets `scripts/stats-coverage.mjs` and
  the widget-family audits count them as their own class, rather than
  mixing them in with interactive widgets.
- `meta.dimension = "2d"`, `meta.gesture = "static"`, `meta.role =
  "illustration"` describe the widget precisely enough that an alternate
  frontend (React, presentation mode, print bundle) can pick an appropriate
  rendering strategy for illustrations versus interactive toys.
- The parameter surface (`widgetId`, `svgId`, `viewBox`, `title`, `hint`,
  `svgInner`, `caption?`, `footer?`) is small enough that a non-HTML
  consumer can reconstruct the figure without pattern-matching raw HTML
  bytes.

Some corpus widgets classified as `static-svg` leave the SVG body empty at
authoring time (`<svg …><title>…</title></svg>`) and rely on a **sibling
`widget-script` block** to paint nodes and arrows at load time. Those scripts
sit next to the widget in `content/<topic>.json` and are rendered verbatim
by `scripts/render-topic.mjs`; this widget does not interfere with them.
`renderScript(params)` always returns the empty string.

## Chrome produced by `renderMarkup`

```
<div class="widget" id="{widgetId}">
  <div class="hd"><div class="ttl">{title}</div><div class="hint">{hint}</div></div>
  <svg id="{svgId}" viewBox="{viewBox}" width="{W}" height="{H}"><title>{title}</title>{svgInner}</svg>
  {caption?}
  {footer?}
</div>
```

`W` / `H` are parsed out of `viewBox`; the schema restricts the viewBox to
the `0 0 W H` shape every corpus candidate uses. If `hint` is omitted the
`.hint` slot collapses to an empty div — every absorbed widget supplies one.

## Params (see `schema.json`)

| field | purpose | kind |
| --- | --- | --- |
| `widgetId`, `svgId` | DOM ids on the widget wrapper and inner `<svg>` | fundamental |
| `viewBox` | `viewBox` attribute on the `<svg>`. Restricted to `0 0 W H` — `width` and `height` attributes are derived. | fundamental |
| `title` | Widget title. Rendered both in the `.ttl` header and in the SVG's inner `<title>` element (for accessibility). | fundamental |
| `hint` | Short line rendered in the `.hint` slot of the header. Optional. | fundamental |
| `svgInner` | Raw inner HTML of the `<svg>`, excluding the `<title>` (which the renderer emits from `title`). Usually the empty string — populated by a sibling `widget-script` block at load time. | artifact |
| `caption` | After-SVG block #1. Either `{ kind: "small", content }` → `<div class="small">…</div>`, or `{ kind: "readout", id?, style?, content? }` → `<div class="readout" …>…</div>`. | fundamental |
| `footer`  | After-SVG block #2 (same shape as `caption`). | fundamental |

Both `caption` and `footer` render raw HTML for `content`; the schema
documents `style` on the readout variant as an artifact because the
absorbed widgets sometimes set bespoke inline styling (`font-size:.85rem`)
that the shared CSS doesn't cover.

## Byte-identity

Every absorbed widget round-trips byte-identical to its original inline
source under `node scripts/render-topic.mjs <topic> | diff - <topic>.html`
(and so under the `roundtrip` step of `scripts/rebuild.mjs`).
