# deformation-theory-schlessinger-diagram

Bespoke static SVG diagram of Schlessinger's axioms (H1)–(H4) for a deformation functor $F: \mathrm{Art}_k \to \mathrm{Set}$, used in deformation-theory.html §4 (#deformation-functor). No driving script.

Bespoke passthrough entry — `renderMarkup` returns `params.bodyMarkup`
verbatim and `renderScript` returns `params.bodyScript` verbatim
(empty string if absent). The widget body is irreducibly idiosyncratic
(closures, scoped helpers, page-global library hooks), so its bytes are
carried as ARTIFACT params rather than reconstructed from data. A
portable React / Three.js consumer would discard these artifacts and
render from its own model.

See [../README.md](../README.md) for the registry contract.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id of the widget host element. Must match the id baked into `bodyMarkup`. |
| `bodyMarkup` | string (artifact) | Verbatim host `<div class="widget" id="...">…</div>` bytes. |
| `bodyScript` | string (artifact, optional) | Absent — this widget has no driving IIFE. |

## Usage

Embed by adding a single block to the relevant `content/<topic>.json`:

```json
{ "type": "widget", "slug": "deformation-theory-schlessinger-diagram", "params": { "widgetId": "...", "bodyMarkup": "..." } }
```
