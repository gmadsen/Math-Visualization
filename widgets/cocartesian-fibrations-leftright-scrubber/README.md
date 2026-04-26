# cocartesian-fibrations-leftright-scrubber

Proof-scrubber walkthrough contrasting left vs right fibrations of simplicial sets. Used in cocartesian-fibrations.html §1.

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
| `bodyMarkup` | string (artifact) | Verbatim host `<div class="widget" id="...">` bytes. |
| `bodyScript` | string (artifact) | Verbatim driving script bytes, including leading newline + `<script>` and trailing `</script>`. |

## Usage

Embed by adding two blocks (or one, when there is no script) to the relevant `content/<topic>.json`:

```json
{ "type": "widget",        "slug": "cocartesian-fibrations-leftright-scrubber", "params": { "widgetId": "...", "bodyMarkup": "...", "bodyScript": "..." } },
{ "type": "widget-script", "slug": "cocartesian-fibrations-leftright-scrubber", "params": { "widgetId": "...", "bodyMarkup": "...", "bodyScript": "..." } }
```
