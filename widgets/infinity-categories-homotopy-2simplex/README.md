# infinity-categories-homotopy-2simplex

Bespoke static SVG diagram of a 2-simplex $\Delta^2$ exhibiting a homotopy $f \circ g \simeq h$ between 1-morphisms, used in infinity-categories.html §2 (#homotopy-category). No driving script.

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
{ "type": "widget", "slug": "infinity-categories-homotopy-2simplex", "params": { "widgetId": "...", "bodyMarkup": "..." } }
```
