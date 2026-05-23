# schemes-spec

Prime-spectrum explorer for $\operatorname{Spec}\mathbb{Z}$, introduced on
`schemes.html` §1. Bespoke semantic module — the prime arithmetic is intrinsic;
params carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Draws $\operatorname{Spec}\mathbb{Z}$: a closed point $(p)$ for each prime, plus
the **generic point** $(0)$ (the diffuse violet mark). Slide an integer $n$ and
the widget highlights the Zariski-closed set $V(n)=\{(p):p\mid n\}$ — the primes
dividing $n$ — making concrete that closed sets are finite sets of closed points,
while $(0)$ lies in **no** $V(n)$ ($n\ge1$): its closure is all of
$\operatorname{Spec}\mathbb{Z}$, so it sits in every nonempty open set. That is
what "generic" means, and it is the payoff of Grothendieck's Ring ⟶ Space
reversal (with $n$ acting as a function whose value at $(p)$ is $n\bmod p$).

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-n/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/schemes.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
