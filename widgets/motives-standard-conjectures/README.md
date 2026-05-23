# motives-standard-conjectures

Status browser for Grothendieck's standard conjectures, introduced on
`motives.html` §8. Bespoke semantic module — each item's status and explanation
live in params.

See [../README.md](../README.md) for the registry contract.

## What it does

A clickable list of items — the Lefschetz (B), Künneth (C), and Hodge-standard
(I) conjectures, the num=hom bridge (D), and the unconditional results around
them (Jannsen semisimplicity, mixed Tate motives over $\mathbb{Z}$, Voevodsky's
$\mathsf{DM}$). Each is badged **known** / **partial** / **open**; clicking shows
its statement and what is known. The takeaway: the conjectures are open in
general, yet a surprising amount is established unconditionally.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `items` | array | Each: `id`, `name`, `statement` (one line), `status` (`known`/`partial`/`open`), `reason` (shown on click). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/motives.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
