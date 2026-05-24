# cohomology-stiefel-whitney-rpn

Bespoke widget for `cohomology-and-duality.html` (§6 *Characteristic classes preview*, concept
`cd-characteristic-preview`). It makes the section's headline application of the cup product —
the **Whitney sum formula** — concrete by computing the Stiefel–Whitney classes of $\mathbb{RP}^n$.
Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

The tangent bundle satisfies $T\mathbb{RP}^n\oplus\varepsilon^1 \cong (n{+}1)\,\gamma$
($\gamma$ = tautological line bundle, total class $1+a$), so the Whitney sum formula —
$w(\xi\oplus\eta)=w(\xi)\smile w(\eta)$ — gives, in
$H^\ast(\mathbb{RP}^n;\mathbb{Z}/2)=\mathbb{Z}/2[a]/(a^{n+1})$,

$$w(T\mathbb{RP}^n) = (1+a)^{n+1}, \qquad w_i = \binom{n+1}{i}\bmod 2.$$

A slider sets $n$. The widget draws **Pascal's triangle mod 2** (the Sierpiński pattern) up to
row $n{+}1$, highlights that row, and boxes its first $n{+}1$ entries — the surviving classes
$w_0,\dots,w_n$ — with the $a^{n+1}$ entry crossed out by the truncation. It prints the total
class $w(T\mathbb{RP}^n)$ explicitly and reads off the consequences:

- **Orientable** iff $w_1=(n{+}1)\bmod 2=0$ iff $n$ is **odd**.
- Total class **trivial** (a necessary condition for parallelizability / stable triviality)
  iff $n{+}1$ is a **power of 2** — recovering that $\mathbb{RP}^1,\mathbb{RP}^3,\mathbb{RP}^7$
  are the parallelizable ones.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-n` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The computation (binomial coefficients mod 2 via Lucas' theorem) is fixed inside the renderer;
the slider only sets $n$.

## Usage

Add a `widget` block plus its `widget-script` block to `content/cohomology-and-duality.json`:

```json
{ "type": "widget",        "slug": "cohomology-stiefel-whitney-rpn", "params": { "widgetId": "w-cd-sw", "title": "Stiefel–Whitney classes of ℝPⁿ via the Whitney sum formula", "hint": "slide n; w(TℝPⁿ) = (1+a)ⁿ⁺¹, so wᵢ = C(n+1,i) mod 2" } },
{ "type": "widget-script", "ref": "w-cd-sw" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain (including the byte-identical round-trip gate).
