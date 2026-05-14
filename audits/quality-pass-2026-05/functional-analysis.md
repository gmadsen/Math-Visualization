# functional-analysis — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** measure-theory, operator-algebras

## Summary
The page is in strong shape — voice, notation, and KaTeX usage match its Analysis peers closely. The one substantive gap is widget coverage: §§11, 13, 14, 15 (Riesz representation, weak topologies, Banach–Alaoglu, Krein–Milman) are pure prose, while measure-theory and operator-algebras carry a worked widget per concept-bearing section.

## Findings

### Notation drift
- _None of consequence._ `\mathbb{R}/\mathbb{C}/\mathbb{N}/\mathbb{Z}`, `\langle\cdot,\cdot\rangle`, `B(X,Y)`, `\sigma(T)`, `\sigma_p/\sigma_c/\sigma_r`, `\rho(T)` all match peers' usage.
- Minor cosmetic: `\mathrm{ran}`, `\mathrm{coker}`, `\mathrm{ext}`, `\mathrm{conv}`, `\mathrm{p.v.}`, `\mathrm{supp}` use `\mathrm{}` while peers (operator-algebras §5) use `\mathrm{ev}_x` similarly — uniform within the page, no action needed.

### Undefined jargon
- §1 cautionary note invokes **"Schauder basis"** and **"approximation property"** without defining either ("Enflo (1973) constructed a separable Banach space with no Schauder basis"). First mention; reader has nothing to anchor on.
- §3 examples table lists `(Tf)(x)=\int k(x,y)f(y)\,dy` as "Hilbert–Schmidt" — **Hilbert–Schmidt** is only defined four sections later (§7). Could forward-reference or gloss inline.
- §6 footer bullets reference **"Mazur's theorem"** and **"Banach isomorphism theorem"** as named results without statements; same in §12 ("Mazur" again). One inline gloss would help.
- §6 closing bullet drops **"Nikishin–Stein theory"** as a name with no follow-up. Either delete or one-clause gloss.
- §8 unbounded-operator paragraph cites **"Stone's theorem on one-parameter unitary groups"** and **"von Neumann's deficiency-index theory"** — both name-only, no callback. Stone reappears in §17 without definition either.
- **"Eberlein–Šmulian"** first appears in §10 in a parenthetical ("Eberlein–Šmulian on $X$ metrizable-weakly"); reused in §§12–14. Never gets its own one-line statement; would benefit from one (e.g. inside §12's `.ok` box).

### Tone mismatches
- _None._ Voice is conversational-but-precise throughout — "with a straight face" (§1), "the drama starts" (§1), "the destination" (§17) — and matches operator-algebras' register ("startlingly faithful invariant", "surprising every time"). measure-theory is slightly drier but compatible.

### Missing worked examples
- **§6 Big four theorems**: definition-and-statement only. measure-theory's structurally analogous §7 ("convergence theorems") has the DCT spike-vs-`sin(nx)/n` widget; operator-algebras's §3 has the spectrum widget. A small Hahn–Banach separation toy or a Baire-style "pointwise-bounded ⇒ uniform-bound" demo would parallel that pattern.
- **§11 Riesz representation**: no widget. The earlier projection widget in §2 partially compensates, but the Riesz-specific construction (`y = \overline{\ell(z)}z`) has no live computation.
- **§13 Weak / weak-\* topologies**: pure prose. Could host a "$x_n\rightharpoonup x$ vs $x_n\to x$" demo (e.g. ONB of $\ell^2$ converging weakly but not strongly to 0).
- **§14 Banach–Alaoglu**: no widget. A Helly-style "evaluate functionals at finitely many points" finite-dim picture would fit.
- **§15 Krein–Milman**: no widget. A 2D convex-hull-of-extreme-points toy is the obvious move.

### KaTeX macros / formatting
- _Clean._ No locally introduced macros; only the page-global `\Spec/\Hom/\tr/\ad/\ind` from the standard loader (most unused on this page). All delimiters are `$`/`$$`/`\(\)`/`\[\]`. No `throwOnError` red badges expected.
- `\operatorname{conv}` (§15) used with `\overline{\,}` is the right move; `\mathrm{ext}(K)` adjacent to it is the only mild inconsistency (would render the same; cosmetic).
- Widget readouts use Unicode `λ, σ, Σ, ‖·‖, ✔, ✗, ⇒, ↦` in plain-text JS strings rather than KaTeX, matching peers.

## Severity
minor polish (widget gaps in §§11, 13, 14, 15 are the only substantive item; jargon items are mostly one-line glosses).
