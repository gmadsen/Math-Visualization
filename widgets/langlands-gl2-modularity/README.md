# langlands-gl2-modularity

Bespoke widget for `langlands-program.html` (§6 *Modularity: the proven $\GL_2$ case*, concept
`gl2-modularity`). Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

The Modularity Theorem made arithmetic. Buttons pick an elliptic curve $E/\mathbb{Q}$ of **prime
conductor** $N$ — `11a`, `19a`, `37a` — and the widget builds the bridge between its two avatars:

- **Arithmetic-geometry side.** For each good prime $p$ it counts the points of $E$ over the prime
  field $\mathbb{F}_p$ **live in the browser** and reports $a_p(E) = p + 1 - \#E(\mathbb{F}_p)$.
- **Automorphic side.** It reads the coefficient $a_p(f)$ off the $q$-expansion of the weight-2
  newform $f \in S_2(\Gamma_0(N))$ attached to $E$ (coefficients from LMFDB — labels `11.2.a.a`,
  `19.2.a.a`, `37.2.a.a`).

The two columns are two **independent** computations, and a ✓ on every row shows they agree prime
after prime — which is exactly $L(E,s) = L(f,s)$, the Modularity Theorem (Wiles 1995 semistable;
Breuil–Conrad–Diamond–Taylor 2001 in general). The readout frames it as the $n=2$ case of global
Langlands: the Tate-module Galois representation $\rho_{E,\ell}\colon G_{\mathbb{Q}} \to
\mathrm{GL}_2(\mathbb{Q}_\ell)$ matches the cuspidal automorphic representation $\pi_f$ of
$\mathrm{GL}_2(\mathbb{A}_{\mathbb{Q}})$. The conductor prime $p = N$ (bad multiplicative reduction)
is omitted from the point-counting table. (Rendered with plain `F_p`, `G_Q`, `GL_2`, `A_Q` since
blackboard $\mathbb{F}$/$\mathbb{A}$ and the $\overline{\mathbb{Q}}$ overline are astral / combining
glyphs.)

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`. All curve and
newform data is internal to the widget.

## Usage

```json
{ "type": "widget",        "slug": "langlands-gl2-modularity", "params": { "widgetId": "w-modularity", "title": "Modularity: a_p(E) = a_p(f), prime by prime", "hint": "pick a curve — point-count the left column, read the newform off the right" } },
{ "type": "widget-script", "ref": "w-modularity" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
