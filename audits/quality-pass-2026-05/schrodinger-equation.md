# schrodinger-equation — pedagogical audit (2026-05)

**Section:** Mathematical physics
**Compared against:** hamiltonians-classical-mechanics, klein-gordon-equation

## Summary
The page is well-paced, generously narrated, and every numbered section ships a working widget. Two real defects need attention: a duplicated "See also" callback in §1 (renders twice back-to-back) and a malformed `\mathrm rev` macro that mis-renders the revival-time subscript. Beyond that, mostly minor polish — a latent helper-block typo, a few notation drifts against the sibling Hamiltonians page, and a handful of jargon namechecks lacking callbacks.

## Findings
### Notation drift
- `\mathrm{SO}(4)` at `schrodinger-equation.html:748` (hydrogen hidden symmetry) vs bare `SO(4)` at `hamiltonians-classical-mechanics.html:943` (Kepler hidden symmetry — same group, same example). Same physics, two different LaTeX conventions on adjacent pages. **Semantic-adjacent**: pick one. Recommend `\mathrm{SO}(4)` (matches the page-level macros' `\operatorname{}`-style spirit and renders upright).
- The page mixes `H` for Hamiltonian and `H^2` for the Sobolev space in the same paragraph (`schrodinger-equation.html:267`: `H = -\frac{\hbar^2}{2m}\Delta + V(x)` then "natural domain (Sobolev space $H^2$ for nice $V$)"). Not strictly drift against references — Hamiltonians uses $H$ for the Hamiltonian only — but the local overload is a stumbling stone. Cosmetic.
- Widget id naming is inconsistent across the three peers: schrodinger uses generic `w-figure-stationary` / `w-figure-ho`, hamiltonians uses descriptive `w-phase-space-cell-phase-space` / `w-kam-tori-integrable`, klein-gordon uses short `kg-deriv` / `kg-wave`. Cosmetic only (no rendering effect), but the three conventions could be aligned.
- `\mathcal{D}q` (path-integral measure, `schrodinger-equation.html:970`) is not used elsewhere on the page or by the sibling references; standard for QFT, fine to keep, but flagged for completeness.

### Undefined jargon
- "Sobolev space $H^2$ for nice $V$" (`schrodinger-equation.html:267`) — appears in §1 with no callback to `sobolev-spaces-distributions.html` or to `partial-differential-equations.html#sobolev`, and Sobolev never returns. Either link it or strip the parenthetical.
- "S-matrix" (`schrodinger-equation.html:840`): "equivalently, unitarity of the S-matrix — gives $|T|^2+|R|^2=1$". Term is used as if defined; nothing on the page defines or links it.
- "Wiener integral over Brownian paths" (`schrodinger-equation.html:971`) — drops two pieces of measure-theoretic vocabulary mid-aside with no link to `measure-theory.html`, `stochastic-processes-and-martingales.html`, or `stochastic-calculus.html` despite all three existing.
- "BCS theory" (`schrodinger-equation.html:1077`, Connections) — namechecked without context. Acceptable as connective tissue but worth a parenthetical gloss ("Cooper-pair condensation in superconductors").
- "$n_r$" (radial quantum number) appears inside the principal-quantum-number formula `n = n_r + \ell + 1` at `schrodinger-equation.html:746` without ever being introduced. Reader sees three quantum numbers ($n$, $n_r$, $\ell$) in one equation with only two of them named.
- Compare with klein-gordon, which spells out "on-shell" inline at first use (`klein-gordon-equation.html:268`: "on-shell" = physical states satisfying this constraint…). Schrodinger could lean on the same parenthetical-gloss device for the items above.

### Tone mismatches
- _None significant._ Tone matches the canonical template well: conversational openers ("Strip away the physics and Schrödinger evolution is a *structure theorem*"), direct second-person addresses to the reader inside hints ("Slide $t$; the Gaussian's width grows…"), worked-example-driven exposition. The hamiltonians page is slightly drier and more proof-listy; klein-gordon is slightly more bullet-heavy in §6; schrodinger sits comfortably in the middle, closest to category-theory's voice.

### Missing worked examples
- _None._ Every numbered section §1–§6 has at least one interactive widget; §1 has two (free packet spreading + infinite-well revival). The Connections section (§7, unnumbered) has no widget but per house convention an outro is the right place for a list of links.

### KaTeX macros / formatting
- **Real bug:** `T_{\mathrm rev}` at `schrodinger-equation.html:372` and `:375` — `\mathrm` without braces only romanizes the next single token, so KaTeX renders `T_{r}ev` (upright `r`, italic `ev`) rather than `T_{\rm rev}`. Should be `T_{\mathrm{rev}}` (compare the correctly-braced `V_\mathrm{eff}` at `:746` for the right pattern).
- **Real bug:** Duplicate `<aside class="callback">` in §1. A hand-placed callback at `schrodinger-equation.html:345-352` is followed by an identical auto-injected callback at `:355-362` inside `<!-- callback-auto-begin -->` / `<!-- callback-auto-end -->` fences. Renders as two stacked "See also" boxes. Strip the hand-placed one (the auto-injector owns this block per `AGENTS.md` callback-idempotency note).
- The page declares the standard macro set (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) but uses none of them — these are the defaults shared with all topics, so just inert. Not a defect.
- Delimiters used are exclusively `$…$` and `$$…$$`. No invented delimiters.

## Helper-block / widget-chrome hygiene
- **Latent typo:** `drawNode` at `schrodinger-equation.html:234` reads `svg.appendChild(SVG('circle',{cx,cy:y,r,...}))`. The function signature on `:232` is `drawNode(svg, x, y, label, opts={})`, so `cx` is undefined in scope (no local `cx` variable). The reference page has `{cx:x,cy:y,r,...}` at `hamiltonians-classical-mechanics.html:234`. Latent only because no widget on this page actually calls `drawNode` — but the helper block is meant to be a verbatim copy from `category-theory.html` and this is a one-character drift. (`category-theory.html:234` uses `cx:x` correctly inside its own `drawNode`.)
- All widgets use the canonical chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`). No ad-hoc classes. The `<svg><title>…</title></svg>` accessibility pattern is present on every figure.

## Severity
minor polish (with two real render bugs to fix: `\mathrm rev` braces and the duplicated §1 callback)
