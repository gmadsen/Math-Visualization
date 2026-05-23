# algebra-ring-ideals

Ideals-of-$\mathbb Z$ classifier, introduced on `algebra.html` §7 (*Ideals and
quotient rings*). Bespoke semantic module — the arithmetic is intrinsic; params
carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

A slider $n$ (0–12) classifies the ideal $(n)\subseteq\mathbb Z$ and the
quotient $\mathbb Z/n$ with four ✓/✗ badges — is $(n)$ **prime**? **maximal**?
is $\mathbb Z/n$ an integral **domain**? a **field**? — plus a zero-divisor
witness $a\cdot b=n\equiv 0$ for composite $n$. It encodes the two key
equivalences $R/\mathfrak p$ domain $\iff\mathfrak p$ prime and
$R/\mathfrak m$ field $\iff\mathfrak m$ maximal: $(n)$ is maximal $\iff n$ prime
($\mathbb Z/p=\mathbb F_p$), $(n)$ is prime $\iff n=0$ or $n$ prime, and the
$\mathbb Z/6$-vs-$\mathbb Z/p$ contrast. Finite-field notation is written `F_n`
(plain) in SVG text to stay BMP-safe.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-n` (slider), `-nval` (pill), `-svg`, `-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to `content/algebra.json`,
then `node scripts/rebuild.mjs --only widget-params` and
`node scripts/rebuild.mjs`.
