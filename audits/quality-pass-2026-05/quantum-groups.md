# quantum-groups — pedagogical audit (2026-05)

**Section:** Algebra & homological
**Compared against:** lie-algebras, representation-theory

## Summary
Strong page overall — six numbered sections, each with an interactive widget, conversational hero, and clean Hopf/Yang–Baxter narrative. Main issue is a cluster of undefined jargon in §5 and §6 (qtr, qdim, ribbon, framing, Casimir element, type-1, bar involution, Boltzmann weights), plus a consistent `\mathbb C` / `\mathfrak g` brace-dropping notation drift relative to peers.

## Findings

### Notation drift
- `\mathbb C` (no braces) used throughout target — e.g. line 415 `q\in\mathbb C`, line 692 `n\in\mathbb Z_{\ge 0}`, line 760 `\mathbb Z[q,q^{-1}]`. Peers consistently brace: representation-theory.html line 297 `\mathbb{C}`, line 302 `\mathbb{C}[G]`; lie-algebras.html line 272 `\mathbb{C}`. **Cosmetic** but corpus-wide inconsistency.
- `\mathfrak g` (no braces) at lines 255, 276, 539, 540, 542, 760, 789, 938, 941, 1001 vs `\mathfrak{g}` in lie-algebras.html line 272 and `\mathfrak{sl}_2(\mathbb{C})` in representation-theory.html line 280. Same brace-dropping pattern — pick one.
- `\Delta^{op}` (line 540) renders `op` in italics; should be `\Delta^{\mathrm{op}}` or `\Delta^{\operatorname{op}}` — peers use upright op-style decorations (e.g. representation-theory.html `\mathrm{char}`, `\mathrm{sgn}`, `\mathrm{id}`).
- `\Hom` macro is defined in the loader (line 25) but never invoked on this page; representation-theory.html uses `\Hom(V,W)` extensively (lines 377, 392, 393). Target instead writes `\mathrm{Rep}(\ldots)`, `\mathrm{Bun}_G`, `\mathrm{Conf}_n`, `\mathrm{Kh}^{\bullet,\bullet}` — should prefer `\operatorname{...}` for upright multi-letter operators.
- `\rightsquigarrow` (line 425) is unusual; peers use `\to` for limit arrows. Cosmetic.

### Undefined jargon
- "**rigid duality**" (§5, line 793 — "Cup / cap ↦ evaluation / coevaluation on $V\otimes V^*$ (rigid duality)") used as if defined; rigidity is mentioned in callback to representation-theory.html#tensor-dual but not summarized in-line.
- "**ribbon element $\theta$**" (§5, line 794) appears with zero unpacking — first sentence to introduce ribbon structure on $U_q(\mathfrak g)$.
- "**framing twist**" (§5, line 794) — undefined; reader has to know what a framed tangle's framing twist means.
- "**qtr**" / "**qdim**" appear only in widget readouts (lines 854, 875, 906) — `F(unknot) = qdim(V) = [n+1]_q`, `F(Hopf) = (qtr ⊗ qtr)(R₂₁ R₁₂)` — quantum trace and quantum dimension are never introduced in prose.
- "**type-1**" modules (§4, line 692 — "finite-dimensional *type-1* $U_q(\mathfrak{sl}_2)$-modules") — italicized as if a defined term but only "$q$ generic, i.e. $q$ not a root of unity" is unpacked; the sign-twist that distinguishes type 1 from types $-1, \pm i$ is left implicit.
- "**Casimir element**" (§6, line 938 — "$\Omega = \sum_a x_a\otimes x^a$ is the Casimir element") used without explaining the dual basis $x^a$ or what makes $\Omega$ Casimir; first appearance on the page.
- "**bar involution**" (§4, line 762 — "$\overline q = q^{-1}$ fixes each basis element") and "**bar-invariant**" introduced in same bullet without prior mention.
- "**spectral $R$-matrix $R(z/w)$**" (§6, line 930) — the dependence on a spectral parameter is introduced in passing.
- "**Boltzmann weights**" (§6, line 933) — used without unpacking for readers without statistical-mechanics background.
- "**Grothendieck group**" (§6, line 941) appears bare in categorification paragraph.
- "**evaluation map**" (§6, line 930 — "$V(z) = V\otimes\mathbb C[z,z^{-1}]$") — terminology used before unpacking.

### Tone mismatches
- Tone is generally well-aligned with peers — conversational hero, "by abstract nonsense" (line 271) matches representation-theory's "the crown jewel of the theory" register.
- §6 ("Affine, KZ, and categorification") drifts toward dense survey: 4 sub-headings cover affine quantum groups, six-vertex, KZ/Drinfeld–Kohno, and KLR categorification in roughly 4 paragraphs. Compare lie-algebras §6 (classification) which similarly compresses A-G but offsets density with the Dynkin gallery widget. The application-map widget in qg §6 is more of a navigation node than a poke-able toy.
- §5 list-of-functor-data ("Crossing ↦ braiding…, Cup/cap ↦ evaluation/coevaluation…, Framing twist ↦ ribbon element θ") reads as encyclopedic bullet dump without the surrounding intuition that peers maintain.

### Missing worked examples
- §5 (Reshetikhin–Turaev) has the widget but no in-prose worked computation. The widget readouts state "$V(3_1) = -q^{-4} + q^{-3} + q^{-1}$" without showing the trace-of-three-$R$'s computation. A 5-line worked Hopf-link evaluation in prose (insert $R$, take quantum trace, get $q^2 + q^{-2}$) would mirror representation-theory's worked Maschke averaging proof.
- §6 has zero worked example for the KZ ↔ $R$-matrix correspondence. A toy $n=3$ KZ monodromy or even a stated formula relating $\hbar$ and $q$ in a single concrete example would help.
- §3 (R-matrix) shows the explicit $4\times 4$ matrix for $V_1\otimes V_1$ but never verifies the YBE on it numerically; the YBE braid widget is geometric, not algebraic — a checked entry-by-entry computation in a `.note` or `.ok` block would close the loop.

### KaTeX macros / formatting
- `\Delta^{op}` should be `\Delta^{\mathrm{op}}` (line 540).
- `\widehat\otimes` (line 539) is rare on the corpus; not actually wrong, but "completed tensor product" is undefined in-line.
- `\Hom` macro defined but never used on this page — code-smell since macros should be either consistently invoked or omitted.
- `R_{ij}` notation in prose vs `R₁₂`/`R₂₃` Unicode subscripts in widget readouts (lines 670, 875). Pick one.
- `\mathrm{Rep}\bigl(U_q(\mathfrak g)\bigr)` (line 789) and `\mathrm{Bun}_G`, `\mathrm{Conf}_n`, `\mathrm{Kh}^{\bullet,\bullet}` should use `\operatorname{}` to match the page's loader-defined operator style and gain proper spacing.

### Helper-block / widget-chrome hygiene
- **Duplicate callback in §1**: a manual `<aside class="callback">` at lines 389–395 is followed immediately by an auto-injected callback at lines 397–404 (inside the `<!-- callback-auto-begin -->` fences) with identical content. The manual one is a leftover the orchestrator should strip; otherwise readers see "See also" twice.
- Helper block (lines 186–233) is verbatim from category-theory.html — clean.
- Widget chrome (.widget / .hd / .ttl / .hint / .row / .readout) used consistently — clean.
- Widget readouts mix Unicode (⊗, ⊕, ²) with KaTeX-source-style (`q^n`, `[n]_q`) text — same pattern as peers, not a defect.

## Severity
minor polish — duplicate-callback hygiene and undefined §5/§6 jargon are the two real items; everything else is cosmetic notation drift.
