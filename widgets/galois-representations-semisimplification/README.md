# galois-representations-semisimplification

Bespoke widget for `galois-representations.html` (§8 *Irreducibility and semisimplification*,
concept `semisimple-decomposition`). It shows why **Frobenius traces see only the
semisimplification**, on a 2×2 upper-triangular representation. Single module, not part of a
shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

The widget displays $\rho(\mathrm{Frob}_p)=\begin{pmatrix}a&b\\0&a\end{pmatrix}$ with a fixed
**repeated** eigenvalue $a$ and a slider for the off-diagonal extension class $b$. The line
$\langle e_1\rangle$ is always Galois-stable, so $\rho$ is **reducible** for every $b$; for
$b\neq 0$ it is a non-trivial **Jordan block** whose *only* invariant line is $\langle e_1\rangle$,
so there is no invariant complement and $\rho$ is **indecomposable** — not semisimple. It is
semisimple only at $b=0$, where it is the scalar $a\cdot I=$ its semisimplification
$\rho^{\mathrm{ss}}=\operatorname{diag}(a,a)$.

The repeated eigenvalue is deliberate: it makes the single on-screen matrix genuinely
non-diagonalizable for $b\neq 0$. (With *distinct* eigenvalues a single matrix is always
diagonalizable, and non-semisimplicity is only visible at the level of the whole homomorphism
$g\mapsto\rho(g)$ — the readout notes that distinct-character case too.) The trace $2a$ and
determinant $a^2$ are independent of $b$, so the non-semisimple $\rho$ and its
semisimplification have **identical** Frobenius traces.

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

The repeated diagonal value $a$ is fixed inside the renderer; the slider only moves the
off-diagonal $b\in[-4,4]$.

## Usage

Add a `widget` block plus its `widget-script` block to `content/galois-representations.json`:

```json
{ "type": "widget",        "slug": "galois-representations-semisimplification", "params": { "widgetId": "w-ssrep", "title": "Semisimplification: Frobenius traces don't see the off-diagonal", "hint": "slide the extension b; trace and det are unchanged, so ρ and ρˢˢ are trace-equal" } },
{ "type": "widget-script", "ref": "w-ssrep" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain.
