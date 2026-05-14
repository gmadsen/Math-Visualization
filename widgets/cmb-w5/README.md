# cmb-w5

Cmb w5 widget — scaffolded stub. Replace this paragraph with a short
description of what the widget does, which topic page first introduced it, and
whether it's a bespoke module or part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

TODO(cmb-w5): one paragraph describing the interaction. What does the reader
click / drag / toggle, and what updates in response?

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required
fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

TODO(cmb-w5): extend this table as you add params to `schema.json`.

## Usage

Embed the widget by adding two blocks to `content/<topic>.json`:

```json
{ "type": "widget",        "slug": "cmb-w5", "params": { "widgetId": "w-cmb-w5", "title": "Cmb w5" } },
{ "type": "widget-script", "slug": "cmb-w5", "params": { "widgetId": "w-cmb-w5", "title": "Cmb w5" } }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the
params against this widget's schema, and `node scripts/rebuild.mjs` for the
full chain (including the byte-identical round-trip gate).
