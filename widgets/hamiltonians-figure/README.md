# hamiltonians-figure

Shared figure shape for the 6 widgets on the `hamiltonians-classical-mechanics` topic. Replaces the per-widget bespoke slugs (`hamiltonians-canonical-transform`, `hamiltonians-conserved-quantity`, `hamiltonians-flow-portrait`, `hamiltonians-kam-tori`, `hamiltonians-kepler-orbits`, `hamiltonians-phase-space-cell`).

The shared chrome — header + SVG host + readout, with control rows on either side of the SVG — is fully structured. Only `bodyScript` (per-widget physics: integrators, draw routines, event handlers) remains an artifact.

## Layout

```
<div class="widget" id="widgetId">
  <div class="hd">
    <div class="ttl">title</div>
    <div class="hint">hint</div>           # optional
  </div>
  <div class="row">…preRows[0]…</div>      # 0+ rows
  <svg id=… viewBox=… …></svg>
  <div class="row">…postRows[0]…</div>     # 0+ rows
  <div class="readout" id=…>output.initial</div>
</div>
```

## Params

| Field | Required | Notes |
|---|---|---|
| `widgetId` | yes | DOM id for the outer `<div class="widget">`. |
| `title` | yes | Header title; HTML-escaped. |
| `hint` | no | Header hint; HTML-escaped. |
| `svg` | yes | `{ id, viewBox, width, height, ariaLabel }`. |
| `output` | yes | `{ id, initial }`. `initial` may carry KaTeX delimiters. |
| `preRows` | no, defaults `[]` | Control rows rendered before the SVG. |
| `postRows` | no, defaults `[]` | Control rows rendered after the SVG. |
| `sectionComment` | no | ARTIFACT. `/* ... */` banner inserted at the top of the IIFE. |
| `bodyScript` | yes | ARTIFACT. JS body inside `(function(){ … })();`. |

### Row shape

```jsonc
{
  "controls": [ /* one or more control objects */ ],
  "trailing": "<span class=\"small\">…</span>"   // optional inline HTML appended to the row
}
```

### Control kinds

```jsonc
// pick — <label> + <select> with options
{ "kind": "pick", "id": "…", "label": "…", "options": [
  { "value": "…", "label": "…", "selected": true,
    "trailing": " "  /* ARTIFACT: stray bytes after attrs in <option> */ }
]}

// slider — <label> + <input type="range">
{ "kind": "slider", "id": "…", "label": "…", "min": 0, "max": 100, "value": 40 }

// button — <button> only (no label element)
{ "kind": "button", "id": "…", "label": "…" }
```

Controls in one `controls[]` array share a single `<div class="row">` and render in order.

**Escaping rule:** `title` and `hint` (top-level header fields) are HTML-escaped; everything else — `output.initial`, all control `label` fields, `pickControl.options[].label`, `row.trailing` — is emitted verbatim so KaTeX delimiters survive.

**Note on per-row arity.** The original per-widget schemas enforced specific control counts (e.g. `conserved-quantity` required exactly two `pick`s; `kepler-orbits` required exactly two sliders). Those constraints don't survive the unification — `controls[]` is just `minItems: 1`. Authors should keep an eye on visual layout when changing the control count on an existing widget.

## Why a shared slug

Per `widgets/README.md` § "Structured vs. artifact-style adoption", artifact-style is the legitimate default for a one-off widget. The 6 hamiltonians widgets crossed the "family emerges" threshold: identical chrome, identical header pattern, identical IIFE wrapping, with only the input controls and the inner physics differing. Collapsing them into one slug + one renderer turns the chrome into shared documentation and shrinks the registry footprint from 6 directories to 1.
