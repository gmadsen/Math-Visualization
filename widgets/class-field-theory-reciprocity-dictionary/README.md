# class-field-theory-reciprocity-dictionary

Bespoke static-grid display used in `class-field-theory.html` §9 (`#beyond`)
— a two-column "reciprocity dictionary" pairing the arithmetic side
(Galois extensions / representations) with the analytic / automorphic side
(Hecke characters / automorphic forms) for both the abelian (CFT) and
non-abelian (Langlands) cases.

The widget has **no driving script** — it is a static figure rendered
entirely by the inline markup. The whole inner body is carried verbatim as
a `bodyMarkup` artifact so the byte-identical round-trip gate passes; a
portable React/Three.js consumer can parse the artifact into a
structured `{rows: [{lhs, rhs}], note}` shape at its leisure.

See [../README.md](../README.md) for the registry contract and the
bespoke-vs-shared distinction.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `bodyMarkup` | string (artifact) | Verbatim inner HTML for the widget body — the `.hd` header, the `.dict` grid, and the trailing `.small` footnote. Preserved byte-for-byte. |

## Usage

This widget has no driving script (`renderScript` returns `''`), so only a
single block is needed in `content/class-field-theory.json`:

```json
{ "type": "widget", "slug": "class-field-theory-reciprocity-dictionary", "params": { "widgetId": "w-dict", "bodyMarkup": "…" } }
```

No matching `widget-script` block is required.
