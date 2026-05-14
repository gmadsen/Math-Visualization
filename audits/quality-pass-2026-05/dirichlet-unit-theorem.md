# dirichlet-unit-theorem — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** algebraic-number-theory, continued-fractions

## Summary
A polished, tightly written page that already lives close to category-theory.html's pedagogy bar — every section has a worked widget, the numbered headings parallel the references, and the proof-then-example rhythm matches algebraic-number-theory.html. Findings are minor copy-edits and a handful of outward-looking name-drops in §4 and §6 that go beyond the v1 "definition + example + widget" contract.

## Findings
### Notation drift
- `\mathrm{Re}(s)>1` at §4 (`zeta_K(s)` definition) versus `\operatorname{Re}` style elsewhere; the page already declares `\operatorname{...}` macros (`\Hom`, `\Gal`, `\tr`, `\ad`, `\ind`) at the top of `<head>`, so `\mathrm{Re}` is the only operator-name in the body that opts out. Cosmetic; recommend `\operatorname{Re}`.
- `\mathrm{GL}_r(\mathbb{Z})` at §3 ("Independence of choices") vs `\mathrm{GL}_2(\mathbb{Z})` in continued-fractions.html ("excluding $\varphi$ and its $\mathrm{GL}_2(\mathbb{Z})$-orbit") — these match; flagged only to confirm consistency.
- `\Lambda_K` for the unit lattice in §3 is introduced and then not reused outside that section's note; algebraic-number-theory.html instead writes `\ell(\mathcal{O}_K^\times)` longhand. Both pages remain readable, but `\Lambda_K` would benefit from one re-use in §4 (it would tighten "$R_K$ is the multiplicative lattice covolume — the volume of $H/\Lambda_K$").
- The norm map appears as `N(\mathfrak{a})`, `N(\alpha)`, `N(\varepsilon)`, and once `N_{K/\mathbb{Q}}(u)` (§1) — the latter is the only fully-decorated form. algebraic-number-theory.html sticks to the bare `N(...)`. Recommend dropping the `_{K/\mathbb{Q}}` subscript in §1 to align, since it is never reused.
- Roots of unity: `\mu_K` is used throughout, matching algebraic-number-theory.html; `w_K=|\mu_K|` is introduced in §4. Consistent.

### Undefined jargon
- §1 hero references "$\zeta_K$" inside the page-level subtitle before any definition; the formula appears in §4. Acceptable as a teaser since this is the `<p class="sub">` and it is conventional to advertise.
- §2 "Step 2, full rank, via Minkowski" uses "ideal class equivalence" and "ideal classes" before the page itself defines them, with no inline gloss. The `<aside class="callback">` to `algebraic-number-theory.html#minkowski` follows the section, so a reader who has done the prereq is fine, but a one-clause inline tooltip ("two ideals are equivalent if they differ by a principal ideal — see callback") would smooth the jump.
- §4 invokes "BSD", "Bloch–Kato", and "Iwasawa main conjecture" in a single sentence with no callback. The Connections section at the bottom links each one, but the §4 prose drops them as nouns 100+ lines before the reader sees the link list. Compare to algebraic-number-theory.html's §7 which name-drops "Mordell–Weil" once and immediately wraps it in an inline-link `<a data-auto-inline-link="1">` with a tooltip blurb.
- §4 uses "central point" and "arithmetic motive" without definition. These are standard Bloch–Kato vocabulary, but the page should either gloss them or downgrade them to "leading term" / "L-function attached to motivic data".
- §6 mentions "Jacobian" and "torus" inside the Siegel bullet with no inline gloss; readers landing on the page from `pathway.html` may not have the Jacobian under their belt.
- §6 final paragraph: "Baker-style linear forms in logarithms (Baker, Győry)" — two names appear with no callback; a brief gloss ("effective lower bounds for $|\beta_1\log\alpha_1+\cdots|$") would land it.

### Tone mismatches
- §4's last paragraph ("The class number formula is the prototype …") is the longest pure-prose stretch on the page and reads more like an L-functions encyclopedia entry than the rest of the page. It packs three name-drops (BSD, Bloch–Kato, Iwasawa) into one sentence after no narrative buildup. category-theory.html and algebraic-number-theory.html both keep their broad "this generalises to" passages tighter and pin them with a "see also" link.
- §6 "$S$-unit equation theorem (Mahler 1933, Evertse)" then "Siegel's theorem … Faltings's theorem (Mordell), in the original Vojta–Bombieri proof" — five proper-noun theorems in one bullet list. The reference pages distribute their name-drops more sparsely (continued-fractions.html spends a whole section on Markoff before invoking Lagrange spectrum). Consider trimming to Siegel + one parenthetical for Faltings, and pushing the Vojta/Bombieri colour to the Connections section.
- The §3 worked-example trio ("$K=\mathbb{Q}$ … $K=\mathbb{Q}(i)$ … $K=\mathbb{Q}(\sqrt{2})$ …") is the page's strongest pedagogical beat and matches the reference voice well — not a finding, called out as the model for §6 to imitate.
- §5 "Pell verification: ${r.x}² − ${d}·${r.y}² = ${verify}" inside the widget readout uses Unicode superscript `²`; algebraic-number-theory.html and continued-fractions.html consistently use `^2` or KaTeX in readouts. Cosmetic but inconsistent across the corpus.

### Missing worked examples
- Every §1–§6 section has a widget — coverage matches algebraic-number-theory.html. §7 ("Connections") has none, which is the house convention.
- §4 (analytic class number formula) has the imaginary-quadratic widget but the §4 prose mentions the totally-real case ("$\zeta_K$"; "every arithmetic L-function") without giving even one real-quadratic numerical instance. A second worked check ("$K=\mathbb{Q}(\sqrt{2})$: $h=R=1$, $w=2$, $\Delta=8$, residue $= 2^2 R / (w \sqrt 8) = \log(1+\sqrt 2)/\sqrt 2 \approx 0.6232$ …") would balance the section. Not a missing-example flag — the existing `<div class="ok">` already gives two checks — just a soft recommendation.
- §6 ($S$-units): the widget covers $\mathbb{Z}[1/N]$ (the $K=\mathbb{Q}$ case). A non-trivial $K\ne\mathbb{Q}$ worked example in prose ("$K=\mathbb{Q}(i)$ with $S=\{\infty,(1+i)\}$") would justify the "higher analogue" framing. Mild gap.

### KaTeX macros / formatting
- Helper-block (top of `<body>`, lines 187–239) is a verbatim copy of category-theory.html / algebraic-number-theory.html — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all match line-for-line. Clean.
- KaTeX macro block (lines 22–29) is the standard six-macro header (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`). No bespoke macros invented locally — better than several other pages that mint single-page macros.
- `<div class="widget">` chrome and `.hd / .ttl / .hint / .row / .readout / .note / .ok / .bad` usage matches the reference pages exactly. No ad-hoc classes.
- `<title>` element is present on every `<svg>` (good for accessibility; matches house pattern).
- §5 table for `√d` continued fractions uses `[1;\overline{2}]` notation — consistent with the same notation in continued-fractions.html §1.
- Boxed display in §4 (`$$\boxed{\;\mathrm{Res}_{s=1}\zeta_K(s) \;=\;\ldots\;}$$`) is a one-off use of `\boxed` not seen in either reference. Cosmetic; consider removing the `\boxed` for stylistic alignment with the references' display equations (which simply sit centred).
- §5 Pell-solver widget hint "type a non-square $d$ (1–200)" — the `<input>` `min="2"`, so the hint range "1–200" is misleading by one. Trivial.
- Connections list (§7) uses an outbound link to `./computational-number-theory.html#class-group` — confirmed file exists.

## Severity
minor polish
