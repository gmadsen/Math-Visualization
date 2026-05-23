# advanced-complex-analysis-picard

Picard value-coverage explorer, used on `advanced-complex-analysis.html` §2
(Little Picard) and §3 (Great Picard). Bespoke semantic module — the function
eval and the value-coverage sampling are intrinsic (a `kind` enum); params carry
only the case menu. One slug serves both sections via two widget instances with
different function lists.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a function and a radius; the widget samples the domain — a disk $|z|\le R$
for entire functions, or a punctured disk $0<|z|\le r$ around an essential
singularity — and shades the values of the $w$-plane that get hit. **Little
Picard:** a non-constant entire function omits at most one value ($e^z$ misses
only $0$; $z^2$ and $\sin z$ miss nothing). **Great Picard:** near an essential
singularity $f$ takes every value, with at most one exception, infinitely often
($e^{1/z}$ misses only $0$ even on an arbitrarily small punctured disk;
$\sin(1/z)$ misses nothing). The omitted value, when present, is marked with a
pink ring over the dark hole in the coverage.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-r/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`ez`/`z2`/`sinz`/`einvz`/`sininvz`), `domain` (`disk`/`punctured`), optional `omit` (`{re,im}`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/advanced-complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
