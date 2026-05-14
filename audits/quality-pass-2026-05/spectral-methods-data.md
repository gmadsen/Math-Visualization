# spectral-methods-data — pedagogical audit (2026-05)

**Section:** Probability & statistics
**Compared against:** random-matrix-theory, high-dimensional-geometry

## Summary
Solid, conversational, register-matched draft with seven worked widgets and a clean Connections section; voice and chrome are on-spec. The drift items are mostly cosmetic (transpose glyph, display-math fence choice, JL letter conventions) plus a small handful of jargon name-drops worth a word of glue.

## Findings

### Notation drift
- Transpose glyph: spectral-methods uses `V^{T}`, `\tilde X V_{:,1:k}` (line 354, line 500) throughout, while random-matrix-theory uses `XX^\top` (line 678, MP section). Both pages share the canonical macro block, so neither is "wrong" — but a single page's section-peer reads `^\top` and the cross-pollinated reader will notice. Cosmetic; pick one and apply to both.
- JL "number of points" letter: spectral-methods §6 writes `k \ge 8\log n / \varepsilon^{2}` with `n` = point count (lines 1076, 1091, 1142), but the linked high-dimensional-geometry §3 uses `N` for point count and reserves `n` for ambient dimension (line 479). The cross-page link `./high-dimensional-geometry.html#hdg-johnson-lindenstrauss` (line 1080) lands the reader on a page with the same lemma in flipped letters — semantic drift, worth a one-line "we use $n$ for points; high-dim uses $N$" parenthetical or just relabel to match.
- Projection-matrix glyph: spectral-methods uses `\Pi` for the JL projector (line 1078); high-dim-geometry uses `\Phi` (line 479). Cosmetic, but combined with the `n`/`N` swap, the cross-page transition reads as a different object.
- Centring vector: spectral-methods writes `\tilde X = X - \mathbf{1}\bar x^{T}` (line 498) — careful and explicit. RMT uses no analogue. No drift, just noting that `\bar x` is well-defined on first use.

### Undefined jargon
- "Krylov methods (Lanczos, ARPACK)" in §1 note (line 471) — first mention with no callback, no in-page definition. Either drop the parenthetical or add a one-line gloss ("Krylov methods build the answer from $\{Av, A^2v, \dots\}$ and avoid storing $A$").
- "Perron–Frobenius applies" (§5, line 927) — used as a load-bearing justification ("so Perron–Frobenius applies and the stationary distribution is unique"). The reader who doesn't know this theorem can't see why the conclusion follows. Compare RMT's habit of unpacking eponymous results inline. A one-clause gloss ("the Perron–Frobenius theorem: a positive irreducible aperiodic stochastic matrix has a unique positive eigenvector at eigenvalue $1$") would close the gap.
- "spectral sweep cut" (§4, line 796) — named but not defined; the reader can guess but the term is load-bearing for "constant-factor approximation algorithm for sparsest cut." Either define in one line or drop the name.
- "leverage-score sampling" (§7, line 1197) — *is* explained one sentence later, so this passes the "before-or-callback" test, but the explanation reads as a hedge ("leverage scores are diagonal entries of a projection onto the dominant subspace"). Worth tightening to a single declarative sentence.
- "Fiedler vector" (§3, line 631), "stochastic block model" (§4, line 809), "Marchenko–Pastur distribution" (§2, line 613, with cross-page link), "Eckart–Young" (introduced §1, called back §2): all cleanly handled.

### Tone mismatches
- Voice is consistently the right register — see "five spectral moves that turn $n\times n$ problems into $k\times k$ ones" (sub), "Two warnings that real practitioners learn the hard way" (line 609), "the engineering miracle that made PageRank ship" (line 931). Matches RMT and high-dim-geometry.
- §6 first paragraph (lines 1063–1072) gets dense fast: an algorithm enumeration, an error bound, and a why-it-works paragraph stacked back-to-back with no widget between. RMT and high-dim-geom typically interleave one motivating sentence per equation. Minor; widget recovers the pace.
- §7 (Nyström) opens cold ("The last spectral move is for kernel methods. Given a positive semidefinite kernel $K$..."). Compare RMT §3's "Wigner matrices model Hamiltonians. Sample covariance matrices are the statistician's bread and butter." A one-sentence motivation hook ("Why would you ever store a million-by-million kernel matrix?") would warm the section.
- §8 Connections (line 1326) opens with a strong meta-paragraph — well-paced, matches the pattern of the references.

### Missing worked examples
- _None._ Every numbered §1–§7 has a poke-able widget; §8 Connections is link-list only, matching the references' pattern.

### KaTeX macros / formatting
- KaTeX macro block at lines 22–29 is byte-identical to category-theory.html / RMT / high-dim-geometry. No new macros introduced, no `\Z` / `\hom` / `\R` re-inventions. Clean.
- Display-math fence inconsistency: spectral-methods uses `<p style="text-align:center">$ ... $</p>` (single-`$`, inline mode) for what are visually displayed equations (lines 352, 362, 625, 788, 794, 925, 1078, etc.). RMT and high-dim-geometry use `$$ ... $$` (true display mode) — see RMT line 280, high-dim line 480. The inline-with-CSS-centring approach renders smaller spacing around `\sum` / `\frac` and produces a different visual rhythm. Worth converting to `$$...$$` for parity with the section peers; this is the single biggest cosmetic drift.
- `\operatorname{rank}` (line 354), `\operatorname{ker}` (line 356), `\operatorname{vol}` (line 788), `\operatorname{diag}` (line 623), `\operatorname{range}` (line 356), `\operatorname{nnz}` (line 471), `\operatorname{tr}` (not used) — all standard KaTeX, all consistent with category-theory.html style of preferring `\operatorname{}` to `\mathrm{}`.
- Two unicode-in-readout cases worth noting: `‖A − A_k‖²_F` in `out.textContent` (line 456) and `λ_4 − λ_3` (line 899) use unicode minus and unicode subscripts. These are inside a `.readout` `<pre>` block, not inside `$…$`, so KaTeX never sees them — pragmatic and matches RMT's identical pattern in its `out.textContent` strings. Not a drift.

## Severity
minor polish

