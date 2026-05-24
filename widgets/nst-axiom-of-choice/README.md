# nst-axiom-of-choice

Bespoke module for **naive-set-theory** §5 (The axiom of choice — intuition).
Russell's shoes-versus-socks picture of where AC is and isn't needed.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

A family of non-empty pairs $A_i$ is drawn as a row of bins plus one dashed bin
standing for the infinitely many remaining pairs. A slider sets how many finite
pairs are shown; a mode toggle switches between **shoes** and **socks**.

- **Shoes** are distinguishable (left/right), so "pick the left one" is an
  explicit formula — pressing the button applies it to *every* pair at once,
  including the infinite bin. A choice function defined by a rule: **no AC
  needed**.
- **Socks** are indistinguishable, so no rule exists. You can still choose by
  hand from each finite bin (click a sock), but the infinite family can never be
  exhausted. **AC** is exactly the assertion that a choice function
  $f$ with $f(i)\in A_i$ exists anyway (equivalently $\prod_i A_i\neq\varnothing$).

The readout connects this to AC's independence from ZF (Gödel/Cohen) and its
equivalents (Zorn's lemma, well-ordering, every vector space has a basis) and
consequences (Tychonoff, Banach–Tarski).

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "nst-axiom-of-choice", "params": { "widgetId": "w-nst-choice", "title": "Shoes, socks, and the axiom of choice" } },
{ "type": "widget-script", "ref": "w-nst-choice" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
