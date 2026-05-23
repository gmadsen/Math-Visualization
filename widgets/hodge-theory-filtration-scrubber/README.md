# hodge-theory-filtration-scrubber

Scrubber for the Hodge filtration, introduced on `hodge-theory.html` §3. Lets
the reader see the abstract definition $F^p H^n = \bigoplus_{p'\ge p}H^{p',n-p'}$
as a concrete split of the degree-$n$ summands. Bespoke semantic module — each
variety carries a square Hodge matrix; the complex dimension is derived as
`h.length - 1`.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a variety and a cohomological degree $n$ (slider), then scrub the threshold
$p$. The summands $H^{p',n-p'}$ of $H^n$ are drawn as a row of boxes; those with
$p'\ge p$ (inside $F^p$) light up yellow, the rest form the complementary half —
which is exactly $\overline{F^{n-p+1}}$. The readout reports $\dim F^p$, the
decreasing chain $F^0\supseteq\cdots\supseteq F^n\supseteq 0$, and the recovery
relation $H^n = F^p \oplus \overline{F^{n-p+1}}$ with a dimension check.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-deg/-p/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `varieties` | array | Each: `id`, `label` (plain text), `h` (square Hodge matrix `h[p][q]`; `d = h.length-1`). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/hodge-theory.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
