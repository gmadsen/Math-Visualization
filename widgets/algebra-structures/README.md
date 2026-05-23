# algebra-structures

Group → ring → field hierarchy explorer, introduced on `algebra.html` §1 (*One,
two, three operations*). Bespoke semantic module — the classifications are
intrinsic; params carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Six set buttons — $\mathbb N$, $\mathbb Z$, $\mathbb Z/5$, $\mathbb Z/6$,
$\mathbb Q$, $M_2(\mathbb R)$ — and for each, three ✓/✗ rows show how far up the
tower it climbs: abelian **group** under $+$? **ring**? **field**? each with a
one-line reason. $\mathbb N$ fails at the group level (no inverses); $\mathbb Z$
and $M_2(\mathbb R)$ are rings but not fields ($\mathbb Z$: only $\pm1$
invertible; $M_2$: noncommutative + singular matrices); $\mathbb Z/6$ is a ring
with zero divisors; $\mathbb Z/5$ and $\mathbb Q$ are fields. Reinforces the §1
framing that each structure is a tier of axioms relaxing/adding to the last.
Finite-field notation written `F_5`/`F_{pⁿ}` (plain) to stay BMP-safe.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out` and the six set-button ids. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to `content/algebra.json`,
then `node scripts/rebuild.mjs --only widget-params` and
`node scripts/rebuild.mjs`.
