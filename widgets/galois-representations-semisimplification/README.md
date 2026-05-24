# galois-representations-semisimplification

Bespoke widget for `galois-representations.html` (§8 *Irreducibility and semisimplification*,
concept `semisimple-decomposition`). It shows why **Frobenius traces see only the
semisimplification**, on a 2×2 upper-triangular representation. Single module, not part of a
shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

The widget displays $\rho(\mathrm{Frob}_p)=\begin{pmatrix}a&b\\0&d\end{pmatrix}$ with fixed
character values $a,d$ and a slider for the off-diagonal extension class $b$. The line
$\langle e_1\rangle$ is always Galois-stable, so $\rho$ is **reducible** for every $b$; it is a
direct sum — **semisimple** — only when $b=0$, where it equals the semisimplification
$\rho^{\mathrm{ss}}=\operatorname{diag}(a,d)$. The trace $a+d$ and determinant $ad$ are
independent of $b$, so two representations with the same $a,d$ but different $b$ (one
semisimple, one not) have **identical** Frobenius traces.

The readout draws the consequence: traces are additive on short exact sequences, so
$\operatorname{tr}\rho(\mathrm{Frob}_p)=\operatorname{tr}\rho^{\mathrm{ss}}(\mathrm{Frob}_p)$;
by **Brauer–Nesbitt** $+$ **Chebotarev**, two semisimple $\ell$-adic representations of
$G_\mathbb{Q}$ are isomorphic iff their Frobenius traces agree on a density-one set of primes.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-b` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The diagonal values $a,d$ are fixed inside the renderer; the slider only moves the off-diagonal
$b$.

## Usage

Add a `widget` block plus its `widget-script` block to `content/galois-representations.json`:

```json
{ "type": "widget",        "slug": "galois-representations-semisimplification", "params": { "widgetId": "w-ssrep", "title": "Semisimplification: Frobenius traces don't see the off-diagonal", "hint": "slide the extension b; trace and det are unchanged, so ρ and ρˢˢ are trace-equal" } },
{ "type": "widget-script", "ref": "w-ssrep" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain.
