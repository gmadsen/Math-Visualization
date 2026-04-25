# input-form

Shared widget module absorbing the **input-calculator** (31 widgets) and
**input-plot** (13 widgets) families — ~44 widgets across ~25 topics in the
[widget-families audit](../../audits/widget-families.md). The chrome is
uniform: a header, a single `.row` of labeled `<input type="number">` or
`<input type="text">` fields plus one action `<button>`, an optional `<svg>`
canvas (input-plot variant), and a `<div class="readout">` output slot. The
per-widget computation logic — which varies from gcd to Sylow counts to
four-squares decomposition — is passed through as a `bodyScript` artifact
string that `renderScript` drops inside the canonical IIFE envelope.

See [../README.md](../README.md) for the registry contract.

## What it does

A typed-entry calculator: the reader fills in one or more number / text
inputs, clicks the action button (or presses Enter if the `bodyScript`
wires it), and the IIFE writes the result into the `.readout` div. When
the optional `svgId` block is present, the widget also renders an `<svg>`
canvas (drawn and updated by the `bodyScript`) — the "input-plot" variant.

Branch dispatch is driven by the presence of `svgId`:

- `svgId` absent → pure input-calculator (no SVG canvas).
- `svgId` present → input-plot variant; an `<svg>` is rendered **before**
  the `.row`.

## Params

See [`schema.json`](./schema.json) for the authoritative JSON Schema. Top-level
fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">`. |
| `title` | string | Display title inside `.hd > .ttl`. |
| `hint` | string (optional) | Short hint inside `.hd > .hint`. |
| `inputs` | array of input records (see below) | Ordered fields inside the single `.row`. |
| `button` | `{ id, text }` | The action button that triggers the compute. |
| `readoutId` | string | DOM id for the `<div class="readout">`. |
| `readoutPrefix` | string (optional) | Seed HTML inside the readout at markup time. |
| `svgId` | string (optional) | DOM id for the `<svg>` canvas. Presence activates the input-plot branch. |
| `viewBox` | string (required iff `svgId`) | Raw `viewBox=` attribute value. |
| `svgWidthAttr` | string (optional) | Raw `width=` attr for the `<svg>`. |
| `svgHeightAttr` | string (optional) | Raw `height=` attr for the `<svg>`. |
| `svgStyleAttr` | string (optional) | Raw `style=` attr for the `<svg>`. |
| `bodyScript` | string | ARTIFACT. Verbatim IIFE body (everything between `(function(){\n` and `\n})();`). |

Each entry of `inputs` is:

| field | type | purpose |
|---|---|---|
| `id` | string | DOM id for this `<input>`. |
| `type` | `"number"` \| `"text"` | Input type. |
| `label` | string (optional) | Leading `<label for=id>…</label>` rendered before this input. Omit to suppress. |
| `value` | string (optional) | Raw `value=` attribute. |
| `min`, `max`, `step` | string (optional) | Raw `min=` / `max=` / `step=` attrs. |
| `placeholder` | string (optional) | Raw `placeholder=` attr. |
| `style` | string (optional) | Raw inline `style=` attr (e.g. `"width:4em"`). |
| `trailingLabel` | `{ for, text }` (optional) | A `<label for=…>…</label>` rendered AFTER this input, inside the same `.row`. Used e.g. for the `×` separator in `w-desc` on `sums-of-squares`. |

Attribute emission order inside each `<input>` is fixed
(`type`, `id`, `value`, `min`, `max`, `step`, `placeholder`, `style`) so that
absorbed widgets byte-match the legacy hand-written source.

## The `bodyScript` artifact

`renderScript` emits exactly the envelope

```
<script>
(function(){
<bodyScript>
})();
</script>
```

so `bodyScript` is the entire IIFE body — typically `const go = …`,
`function render() { … }`, `go.addEventListener('click', render); render();`.
The string is byte-preserved (no re-indentation); a portable React / SSR
consumer can ignore it and re-implement the computation from the structured
`inputs` / `button` / `readoutId` / optional `svg*` fields.

## Usage

In `content/<topic>.json`, emit two paired blocks (ordering follows the
original source — `widget-script` may appear anywhere after `widget` in the
same section, not necessarily immediately adjacent):

```json
{ "type": "widget", "id": "w-twosq", "slug": "input-form",
  "params": {
    "widgetId": "w-twosq",
    "title": "Two-squares checker",
    "hint": "enter $n\\le 10\\,000$",
    "inputs": [
      { "id": "ts-n", "type": "number", "label": "$n =$",
        "value": "325", "min": "1", "max": "10000", "style": "width:7em" }
    ],
    "button": { "id": "ts-go", "text": "check" },
    "readoutId": "ts-out",
    "bodyScript": "  function factor(n){ … }\n  …\n  render();"
  } },
{ "type": "widget-script", "forWidget": "w-twosq", "slug": "input-form",
  "params": { /* same params as above */ } }
```

Validate with `node scripts/rebuild.mjs --only widget-params`, and gate on
byte-identical round-trip with the full `node scripts/rebuild.mjs` chain
(`test-roundtrip.mjs`).
