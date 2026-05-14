# complex-analysis — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** real-analysis, measure-theory

## Summary
The page is content-rich, well-paced, and the canonical Needham framing works. The single biggest issue is **stale `§N` cross-references** throughout the back half: sections were renumbered after Open Mapping (§15) was inserted, but the inline `(§N)` pointers in §16, §17, §18, §24 still target the old numbers. This is high-priority — readers click from "the residue theorem (§18)" and land on "Classification of singularities" instead.

## Findings

### Notation drift
- **High-priority, semantic.** Residue operator is written *both* ways within ~5 lines: `\operatorname{Res}(f,z_0)` in §19 lines 737–739 vs. `2\pi i \sum\mathrm{Res}` in §19 line 741. Pick one — `\operatorname{Res}` matches the page's own header macros (`\operatorname{Hom}`, `\operatorname{tr}`, etc.) and is the convention you'd want in a `\Res` macro if added.
- **Medium.** Matrix groups are uniformly written `\mathrm{PGL}_2`, `\mathrm{PSL}_2(\mathbb{R})`, `\mathrm{PSU}(1,1)`, `\mathrm{SO}(3)`, `\mathrm{SU}(2)` (§3, §23) — but the related `modular-forms.html` writes `\mathrm{SL}_2(\mathbb{Z})`, `\mathrm{PSL}_2(\mathbb{Z})` (consistent), and `upper-half-plane-hyperbolic.html` follows suit. So `\mathrm{...}` is the de facto house style for matrix groups even though category-theory.html prefers `\operatorname{...}` for everything else. Cosmetic only — flag it for whoever introduces a `\PSL` macro later.
- **Medium, cross-page semantic.** complex-analysis writes the upper half-plane as `\mathbb{H} = \{z : \mathrm{Im}\,z > 0\}` (§23 line 837). modular-forms.html and upper-half-plane-hyperbolic.html use `\mathcal{H}` for the same object. Same letter, different glyph — a reader bouncing between the two pages will think they are different sets.
- **Low.** `\mathrm{Im}\,z` (§23 line 837) vs `\Re z` (§6 line 437). Settle on either `\mathrm{Im}/\mathrm{Re}` or `\Im/\Re` consistently; real-analysis and measure-theory don't use either, so no peer convention to anchor to.
- **Low.** `\mathrm{Aut}(\mathbb{D})` (§16 line 678 and §23 line 835) — fine and consistent within the page; just file under "candidate macro."
- **Low.** "neighbourhood" (§17, §18, §19) and "neighborhood" (§15 §16) co-exist. real-analysis uses "neighborhood"; measure-theory uses "neighbourhood." Pick one per page — the page is currently mixed.

### Undefined jargon
- **High, semantic — broken cross-refs masquerading as undefined terms.** The Schwarz proof in §16 line 674 says `f(z)/z` "removes the apparent singularity (§17)" — but §17 is *Laurent series*, not removable singularities (which is §18). The reader is sent to the wrong page.
- §17 line 697: "and §17 reads off the type of singularity" — self-reference; should point to §18.
- §17 line 704: "drives §18, the residue theorem" — residue theorem is §19.
- §17 line 703: "an essential singularity (§17)" — should be §18.
- §18 line 718: "The Laurent expansion (§16) sees three" — Laurent series is §17.
- §18 line 722: "the Laurent series … from §16" — should be §17.
- §18 line 723: "lets §19 count poles and zeros … in the argument principle" — argument principle is §20.
- §18 line 724: "the residue theorem (§18) needs" — residue theorem is §19.
- §16 line 678: "Riemann mapping theorem (§24)" — Riemann mapping is §25; "classification of $\mathrm{Aut}(\mathbb{D})$" pointer is OK.
- **Medium.** "Fatou set" and "Julia set" appear once at §24 line 852 with one-clause definitions (`largest open set on which the iterates of a rational map form a normal family`) but neither has a callback or anchor; first use is also the only use.
- **Low.** "Schottky bound" appears once at §24 line 852 as a name with no definition or pointer; readers without prior exposure will not know what it bounds.
- **Low.** "monodromy" (§27 line 902) defined inline ("that increment is the *monodromy*"), good. "Fuchsian group" appears immediately after with no gloss.
- **Low.** §3 line 340 introduces `\mathrm{SU}(2)/\{\pm 1\}` parenthetically without telling readers this is the same as `\mathrm{SO}(3)` mentioned three words earlier — readers who don't know the spin double cover will read it as a new claim.

### Tone mismatches
- The page hits the house tone overall — second-person occasional ("Try it: the contour widget…" §19 line 741), conversational glosses ("the main miracle" §10 line 555), and worked-example asides match category-theory.html.
- **Minor.** §13 (FTA) is a one-paragraph Liouville-corollary plus a `note` and a quiz — no widget, no visualization of the winding-number proof. The geometric proof would be a *natural* place for a small "watch the winding number change as $R$ shrinks" toy. Compare measure-theory §1 which gets the Riemann-vs-Lebesgue widget for the analogous "single motivating example."
- **Minor.** §25 (Riemann mapping) is a two-paragraph stub. real-analysis's §11 (Baire) and measure-theory's §11 (Radon–Nikodym) both spend more on a flagship theorem.
- **Minor.** §22 last paragraph drops "non-constructive" and "extremal problem (maximize $|f'(z_0)|$ among holomorphic injections)" without unpacking; this is the formula that connects §24 (normal families) to §25 — worth one extra sentence.
- The hero subtitle "A Needham-flavored tour" is fine, but "Needham" is then namedropped again in §4 ("Needham's word"). Real-analysis's hero is a plain prose blurb; measure-theory's is "From the failure of the Riemann integral…" — both anchor to *what gets done*, not to whose textbook it follows. Consider rewording §4 amplitwist note to "We borrow Needham's word: …" or just drop the attribution and keep the geometric definition.

### Missing worked examples
- **§5 Cauchy–Riemann.** States the equations and the Jacobian-commutes-with-`i` fact, then jumps to the next section. No verification on a concrete `f` (e.g. check `z^2`, `\bar z`). real-analysis §3 always exhibits at least one explicit derivative; this section should too.
- **§13 FTA.** Pure prose plus the geometric note. A "winding-number-of-`p(z)` as `|z|` varies" mini-widget would make the geometric proof tactile. (See "Tone" above.)
- **§14 Maximum modulus.** Three theorems stated back-to-back (Morera, Max-modulus, Open mapping) with no example; §15 then redoes Open mapping with a proof. Consider a concrete "show `|e^z|` on the unit disk" or "find max of `|z^2 + z|` on the disk" sketch.
- **§23 Disk automorphisms.** Gives the formula and the Cayley transform but never instantiates one — e.g. "the automorphism sending `0 \to 1/2` is `z \mapsto (z + 1/2)/(1 + z/2)`." The §22 conformal-map widget already covers Cayley; a one-line example here would close the gap.
- **§25 Riemann mapping theorem.** No concrete map exhibited (e.g. half-plane → disk via Cayley, or strip → disk via `\tan`). The §22 widget gallery has these — at least cross-link.
- **§26 Harmonic functions.** No example of a harmonic function (e.g. `u = x^2 - y^2 = \Re(z^2)`, `u = \log|z|`, `u(x,y) = \arg z`) and no boundary-value problem worked. The §22 widget could be reused with a "watch level curves of `u` and `v`" overlay.
- **§27 Analytic continuation.** Mentions `\sqrt z`, `\log z`, monodromy by `2\pi i` — no widget showing the multi-sheeted structure or a continuation along a path. This is one of the most visual concepts in the subject; missing an interactive here is a real gap relative to measure-theory's coverage of the Cantor set / Hausdorff dimension.

### KaTeX macros / formatting
- **High, semantic.** `\operatorname{Res}` vs `\mathrm{Res}` (already noted under Notation drift) — these *render differently* in KaTeX (`\operatorname` adds a thin space after, `\mathrm` does not).
- **Medium.** No page-local macros are defined (the head only lists the cross-page set: `\Spec, \Gal, \Hom, \tr, \ad, \ind`). Given how often `\mathrm{Aut}`, `\mathrm{Res}`, `\mathrm{Im}`, `\mathrm{Re}`, `\mathrm{PSL}`, `\mathrm{PSU}` appear, defining `\Res`, `\Aut`, etc. in the page's macro block would (a) eliminate the `\mathrm`/`\operatorname` drift and (b) match the pattern category-theory.html sets (the head macro list *is* the canonical place for per-page sugar).
- **Low.** §3 line 340 uses `(i.e.\ $\mathrm{SU}(2)/\{\pm 1\}$)` and §9 line 531 uses `the $C^1$ hypothesis` — both fine but inconsistent with §17 line 703 `$f$ <em>hits</em>` style. Not a real issue; just noting.
- **Helper-block hygiene.** The top-of-body 2D helpers diverge from category-theory.html in two harmless ways: (i) `drawArrow` defaults `pad1 ?? 0, pad2 ?? 4` instead of canonical `?? 14, ?? 16`; (ii) `drawNode` wraps the label-text creation in `if(label!=null)` (a strict improvement over the canonical version, which would crash on null labels). Neither is a problem but both mean the block is no longer "verbatim copy" — if you ever regenerate from category-theory you will lose the null-safety. The page additionally appends a domain-specific `const C = { add, sub, mul, … }` complex-arithmetic helper, which is appropriate and clearly labeled `// complex arithmetic helpers shared across widgets`.
- **Widget-chrome hygiene.** All seven widgets use `.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad` correctly; no ad-hoc classes. `<title>` elements are present on every SVG. No `viewBox` regressions.

## Severity
needs rework — primarily because of the back-half `§N` cross-reference rot (eight broken pointers in four sections, several pointing readers to the *wrong topic*), plus the `\operatorname{Res}` / `\mathrm{Res}` collision in the same section. The rest is polish — missing examples in §5/§13/§23/§25/§26/§27 are real but lower-priority gaps.
