# langlands-local-classification

Local Langlands classification browser for $\mathrm{GL}_2(\mathbb{Q}_p)$,
introduced on `langlands-program.html` §3. Complements the §1 *global*
reciprocity dictionary with the prime-by-prime *local* correspondence. Bespoke
semantic module — each row's two sides and explanation live in params.

See [../README.md](../README.md) for the registry contract.

## What it does

A clickable classification: each row is a representation type of
$\mathrm{GL}_2(\mathbb{Q}_p)$ (unramified / ramified principal series,
Steinberg, supercuspidal), shown next to its matching Weil–Deligne
representation and conductor exponent, colour-coded by family. Clicking a row
explains its arithmetic meaning — in particular how the monodromy operator $N$
detects the Steinberg case and how supercuspidals correspond to irreducible
Weil–Deligne representations.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `rows` | array | Each: `id`, `autoType`, `wdRep`, `conductor`, `kind` (`principal`/`steinberg`/`supercuspidal`), `detail` (shown on click). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/langlands-program.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
