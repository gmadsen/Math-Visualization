# geometric-and-combinatorial-group-theory — pedagogical audit (2026-05)

**Section:** Algebra & homological
**Compared against:** algebra, lie-algebras

## Summary
Strong page overall — pacing, motivation, and worked widgets are on par with `lie-algebras` and `algebra`. Two semantic issues stand out: (a) §5 ships **two** `<aside class="callback">` blocks (one hand-written, one auto-injected) so the same "See also" appears twice; same problem in §6. (b) The §5 hyperbolic widget mixes a real Poincaré-disk geodesic with a *Euclidean*-radius "δ-neighborhood" and the readout admits this is "illustrative only" — pedagogically misleading at the very moment the section is defining δ-thinness.

## Findings
### Notation drift
- `\mathrm{Cay}(G,S)` (§2) — peers in this section don't define a Cayley operator macro, but `category-theory.html` and `lie-algebras` consistently use `\operatorname{...}` for named operators (e.g. `\operatorname{ob}`, `\operatorname{Spec}`). `\mathrm{Cay}` works but is one notch off-house; `\operatorname{Cay}` matches the precedent.
- Inverse notation drifts within a single page: prose / KaTeX use `S^{-1}` and `S^{\pm 1}` (§§1–2), but the §2 widget readout uses Unicode `a⁻¹`, `b⁻¹` and the §4 readout writes `2(3ⁿ−1)` with a Unicode minus. `lie-algebras` keeps everything inside KaTeX even in readouts (`fmtVec` emits ASCII `-`). Cosmetic, but the Unicode superscripts collide with the KaTeX-rendered `S^{\pm 1}` two paragraphs up.
- §1 introduces normal closure as `\langle\!\langle R \rangle\!\rangle`. `algebra.html` uses plain `\langle R \rangle^{G}` / "normal closure" prose. Either is fine; the double-bracket convention isn't introduced anywhere else in the corpus and isn't glossed.
- §4 mixes `\Theta(n^d)` (Knuth notation) with the Unicode `~` in the legend (`"ℤ ~ 2n+1"`). Pick one; `lie-algebras`' bracket-table widget commits fully to one convention per readout.
- `D_n` vs `D_4` vs `D₄` — math mode in prose (`D_n`, `D_4`), Unicode subscript in widget options/readouts (`D₄`, `Q₈`). `algebra.html` does the same Unicode-in-`<option>` thing, so this is house-consistent — but `algebra.html` then defers to `katex-select.js` for option rendering; the LaTeX-in-`<option>` entries here (`$\mathbb{Z}$`, `$F_2$`, etc. in the §1 select) require `katex-select.js` to render correctly. The script *is* loaded in `<head>`; flag only as a thing to verify visually.

### Undefined jargon
- §3 "$\ell^p$-cohomology" appears in the list of QI invariants with no definition, callback, or even a hand-wave. Surface jargon — drop it or one-line gloss it.
- §3 "asymptotic dimension" — same list, same problem. Single-clause gloss would suffice ("a coarse analogue of covering dimension").
- §5 "convergence group" appears in scare quotes with no definition or callback ("$G$ acts as a 'convergence group'"). The scare quotes signal the author knows it's load-bearing jargon; resolve them.
- §5 "commensurable" used in the QI-rigidity sentence with no definition. Peers (`algebra.html`) define `[G:H]` and "finite index" but not "commensurable".
- §6 "automatic" groups appear bare in "(one-relator, residually finite f.p., automatic)". No callback, no gloss.
- §6 "malnormal special quotient theorem" — name-dropped without even a sentence on what "special" means here. Compare `lie-algebras`' careful one-sentence gloss for every name (Engel, Lie, Cartan).
- §6 "virtual Haken conjecture" — same; name-dropped at "Fields Medal territory" without a sentence on what it asserts.
- §6 "Cheeger constant" used in the expander definition without gloss. The callback to `spectral-graph-theory.html#adjacency-and-laplacian` exists but the audit pattern in `lie-algebras` is to gloss-then-link, not link-only.
- §1 "Tietze (1908)" — the four moves are referenced as "add/remove a generator … add/remove a relator" but the *equivalence* "two finite presentations of the same group are connected by a sequence of four elementary moves" is asserted without saying *which* four (the prose lists effectively two pairs). Minor — half a sentence fix.

### Tone mismatches
- §6 "Fields Medal territory." — single drive-by sentence fragment, casual register. Peers don't editorialize (`lie-algebras` says "exceptional — only finitely many" not "Fields Medal stuff"). Either delete or convert to a substantive clause ("Agol's resolution earned the 2016 Breakthrough Prize, etc.").
- §3 "Quasi-isometry is brutal — it forgets element order, individual generators, and any local structure" — the word "brutal" is hotter than peer voice. `lie-algebras` would say "Quasi-isometry is a coarse equivalence: it discards element order, generator labels, and local structure." Cosmetic.
- §4 "F₂ blasts off, polynomials look flat by comparison" (widget readout) — fine in a readout, but coupled with "brutal" and "Fields Medal territory" the page reads slightly more glib than peers.
- §5 "in stark contrast to dim 2 where surfaces of fixed genus form a 6g−6-dimensional moduli space" — drops `\dim 2`/`\mathrm{dim}\,2` mid-sentence with no formatting (`dim 2` as plain text); should be `\dim 2` or "dimension 2".
- The §1 Cayley readout strings render Unicode middle-dots (`·`) and Unicode superscripts as primary content. Peers tend to push such expressions into KaTeX inside readouts when feasible.

### Missing worked examples
- §6 "Applications and frontiers" has six headed sub-themes (decision problems, Mostow rigidity, CAT(0) cube complexes, expander graphs) but only one widget — the decision-problem table — which is essentially a *re-statement* of the bulleted list above it (same six classes, same three columns). The widget adds no information the prose didn't.
- §6 "Mostow rigidity" deserves a worked example (e.g. show the 2D vs 3D contrast on a single concrete surface — even a static figure). As-is it's pure assertion.
- §6 "CAT(0) cube complexes" has zero illustration — given the page is built around *visual* group theory, the absence of even a small cube-complex SVG here is the most conspicuous gap on the page.
- §1 widget has 6 group choices but the "sample reduction" is a single canned string per group with no user input — closer to a glossary card than the interactive reductions in `algebra.html`'s Cayley table or `lie-algebras`' bracket-table inspector. A free-text word entry that returns reduced form would be the natural upgrade.
- §5 widget — see Summary; the δ-neighborhood is drawn in *pixel* (Euclidean) radius even in the Poincaré-disk mode, which the readout itself flags as wrong. Either fix the visualization (rescale by `1/(1-|z|^2)`) or replace it with a static side-by-side image. Right now it teaches the wrong intuition for the disk model.

### KaTeX macros / formatting
- The macro block at top declares `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind` — none are used on the page (this is the boilerplate `lie-algebras` block, copied verbatim). Harmless but suggests no audit was done on per-page macro needs. A custom `\Cay` and `\dist` (or `\wordmetric`) would actually save keystrokes here.
- §1 normal closure `\langle\!\langle R \rangle\!\rangle` uses negative spacing inside angle brackets — renders fine but the more standard typesetting in modern textbooks is `\langle\langle R \rangle\rangle` without `\!`. Cosmetic.
- §2 readout: `"a^${i} b^${j}".replace(/\^1\b/g,"")` — the carets are *not* KaTeX (these are inserted into raw text labels), so `a^2 b^3` renders as literal `a^2 b^3` in vertex labels. Either run the readouts through KaTeX or use Unicode superscripts as the §1 readout already does. Inconsistency between two adjacent widgets.
- §6 readout: `"isomorphism problem: " + d.iso` — the colon alignment relies on monospace font (which is fine — `.readout` is `ui-monospace`), but two of three keys are 18 chars and one is 19, so the alignment drifts by one column. Trivial.
- The hyperbolic-triangle SVG embeds `viewBox="-200 -160 400 320"` — fine. No `aria-label`, but `<title>` is present, matching peer convention.
- §5 §6 each contain a stale hand-authored `<aside class="callback">` *plus* the auto-injected one inside `<!-- callback-auto-begin -->` fences. The auto-injected block in §5 even duplicates the `Fundamental group` link (anchors `#fundamental-group` and `#pi1`). This is a `audit-callbacks --fix` invariant violation — the hand-written aside should be removed so the auto-managed one is the single source. **High-priority fix; not just cosmetic — it doubles a navigation block and signals stale content.**

## Severity
minor polish (with one high-priority callback-duplication fix in §§5–6 and one semantic widget-correctness issue in §5)
