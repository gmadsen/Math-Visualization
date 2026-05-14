# representation-theory — pedagogical audit (2026-05)

**Section:** Algebra & homological
**Compared against:** algebra, lie-algebras

## Summary
A long, dense, high-quality page with 14 widgets and broad coverage from finite-group basics to Peter–Weyl. Main pedagogical drag is internal notation inconsistency (`\Hom` macro defined but `\mathrm{*}` used everywhere else for standard operators), an unused `\ad` macro on a page that talks about adjoint reps, a noticeable jargon-before-definition slip in §2 ("rigid symmetric monoidal", "Tannakian"), and broken section numbering (`8 / 8.1 / 8.2 / 9 …`).

## Findings

### Notation drift
- **Operator macros are defined but only `\Hom` is used.** The header defines `\tr`, `\ad`, `\ind`, `\Hom`, `\Spec`, `\Gal` — but the body writes `\mathrm{Ind}_H^G`, `\mathrm{Res}^G_H`, `\mathrm{GL}`, `\mathrm{End}_G`, `\mathrm{CF}`, `\mathrm{sgn}`, `\mathrm{Stab}`, `\mathrm{diag}`, `\mathrm{id}`, `\mathrm{im}`, `\mathrm{char}`, `\mathrm{fix}`, `\mathrm{Sym}^n`, `\mathrm{reg}`, `\mathrm{perm}`, `\mathrm{span}`, `\mathrm{triv}` everywhere (e.g. line 298 `\mathrm{GL}(V)`, line 743–746 `\mathrm{Res}^G_H` / `\mathrm{Ind}_H^G`). Per category-theory.html (which uses `\Hom`, `\operatorname{ob}`, `\mathrm{id}`) and AGENTS.md, these multi-letter operators want `\operatorname{...}` or matching macros — not raw `\mathrm`. **High priority** (semantic: Hom is rendered with operator spacing, Res/Ind aren't, so adjacent `\Hom_G(\mathrm{Ind}_H^G W, V)` at line 755 has visibly inconsistent spacing).
- **`\ad` is defined in the macro block but `representation-theory.html` never uses it.** lie-algebras.html uses `\ad` consistently (e.g. line 378 `\ad(x)`); rep-theory says "adjoint representation" only in prose. Cosmetic, but the macros block is dead weight here.
- **`\Hom` partially adopted.** Line 392, 393, 394, 505, 508, 1005 use `\Hom`; line 38 macro definition matches. Good — but line 755 mixes `\Hom_G(\mathrm{Ind}…)` so the operator-spacing inconsistency is most visible there.
- **`\mathrm{tr}` vs `\tr`.** Line 540 writes `\tr\,\rho(g)` (uses macro). lie-algebras.html line 281 also uses `\tr`. Consistent — good.
- **`\mathrm{Hom}` not actually present**, but `\Hom_\mathbb{C}` (line 389) vs `\Hom(V,\mathbb{C})` (line 377) — fine, both via macro. Cosmetic only.
- **Two competing `Rep` notations.** Body uses `\mathbf{Rep}(G)` (line 377, 402, 743) and `\mathbf{Rep}_\mathbb{C}(G)` (line 303). Pick one; minor.

### Undefined jargon
- **§2 "rigid symmetric monoidal category" + "Tannakian reconstruction"** (line 377) appears before §3, which is the section that introduces tensor/dual/rigidity. First-time reader hits two heavy categorical terms with no definition or callback. The very next sentence promises "the next section develops this carefully," which is honest but the terms still leak into prose unexplained. **High priority** — would cleanly fix by deferring the sentence to §3, or rephrasing to "…has the structure of a category with tensor products; we develop this in §3."
- **§3 "fiber functor"** (line 402) appears in scare-quotes but is never defined; there's no callback to `category-theory.html#fun` or similar. Reader has to take it on faith.
- **§3 "Tannaka–Krein reconstruction"** (line 402) — same, used once and dropped.
- **§6 "Newton's identities"** (line 572) cited without statement or link. Minor; the surrounding sentence is parenthetical.
- **§8 "plethystic $S^d$"** (line 680) — unusual term, used once, undefined. Minor (parenthetical).
- **§8.1 "Mackey tells us…"** (line 687) — first mention of Mackey, not yet defined; "(§8)" cross-reference points at decomposition section, not at a Mackey statement. Minor — the sentence works as motivation but a reader chasing the reference will find no payoff.
- **§11 "BGG resolution", "Verma modules"** (line 949) — name-dropped at the end of a list of "you can read more about". Acceptable in a "go further" list, but the same script then has the live JS spit "infinite-dimensional Verma module" into a widget readout (line 1991, 1994) for the user-facing case `λ` non-integer — and that surfaces "Verma" in interactive output without ever defining it.

### Tone mismatches
- **Density spike at §3 vs the lighter §1, §2.** Hero and §1–2 read in the canonical category-theory voice (second person, mini-examples, "Why complex numbers? Two reasons."). §3 jumps straight into "rigid symmetric monoidal category — the launching pad for Tannakian reconstruction" without a hand-hold. The previous two pages of voice would write "before we go monoidal: here's the punchline in two sentences."
- **Section numbering glitch breaks the rhythm.** §8 → §8.1 → §8.2 → §9 (lines 651/685/713/739) — the TOC also reflects this (`9 1. Orbits…`, `10 2. The regular representation…`). algebra.html and lie-algebras.html both use clean monotone integer numbering; category-theory.html does too. Cosmetic but reads like a draft seam.
- **§11 closes with a textbook recommendation.** "Read Humphreys's *Introduction to Lie Algebras and Representation Theory* to see it play out" (line 949). The notebook house tone gestures forward via callbacks/related-asides, not third-party reading lists; algebra.html and lie-algebras.html never do this. Minor but jarring.
- **§12 capstone "Takeaway" `.ok` block** (line 979) is excellent, matches the canonical voice. Keep.

### Missing worked examples
- **§6 (Characters and orthogonality) has no widget.** All neighboring sections do (5 has Schur intertwiner widget, 7 has the character-table explorer). §6 is the analytic core of the page — the inner-product `<χ,χ>` formula, first/second orthogonality, decomposition formula — and gets only static prose. A small "compute `<χ_V, χ_W>`" widget specifically for §6 (rather than the §5 Schur widget) would mirror category-theory.html's per-section discipline. **High priority.**
- **§4 (Maschke) widget action is one-button.** `w-maschke` (line 449) just has "average over $G$" as a button with no slider/parameter to vary. The averaging proof has a dependency on `\pi_0` choice and group; the widget hardwires `\mathrm{span}(e_1)` as the target. Compare lie-algebras.html `derived-series` widget which lets you pick three different algebras AND step. Minor.
- **§11 (Highest-weight vectors) has a widget but no concrete computation in prose.** The proof sketch quotes `EF^k v = k(\lambda - k + 1)F^{k-1}v` (line 861) but never works out a small case (e.g. `λ=3`, walk through `v, Fv, F²v, F³v`). The §12 capstone repeats the same algebra concretely; §11 could use the small case to motivate.
- **§13 (Peter–Weyl) is a "Preview" by self-declaration**, so the widget-light feel is consistent with that label. No action needed.

### KaTeX macros / formatting
- **`\Spec` and `\Gal` macros are dead code.** Defined at line 23–24, never used in this page's body. Cosmetic — but suggests the macro block was copy-pasted from another topic without pruning. Same is true of lie-algebras.html (also defines `\Spec` / `\Gal`, never uses), so this is corpus-wide inertia, not a local bug.
- **`\mathrm{*}` for multi-letter operators is the systemic issue** (see Notation drift). Switch the corpus-wide pattern to `\operatorname{Ind}`, `\operatorname{Res}`, `\operatorname{GL}`, `\operatorname{End}`, `\operatorname{CF}`, `\operatorname{Stab}`, `\operatorname{sgn}`, `\operatorname{im}` — or define matching macros — to get consistent operator-spacing. category-theory.html line 277 uses `\Hom_{\mathcal{C}}(A,B)` (macro form) and line 276 uses `\operatorname{ob}` literally; the rep-theory page has half-applied this convention.
- **Mixed `\mathfrak{sl}_2` vs `sl_2` ASCII in widget readouts.** JS-driven readouts (line 530–533, 577 etc) emit raw `sl_2`, `b2`, `g^(0)`, `n_3` strings into `.readout` divs; KaTeX never re-renders these because they sit outside `$…$`. Compare the §8.1 widget — `c.name.replace(/\$/g,'')` (line 1572) actively strips dollar signs from labels before display. Result: the rendered widget output looks ASCII-flat next to the lush prose. Cosmetic; affects multiple widgets.
- **`{\mathrm{Stab}\}\\\\times` raw escape** in `s4-pairs` config string (line 1540) — `out` displays a literal `S_2\\times S_2` because the surrounding code paths don't re-render. Same family as the previous bullet.

## Severity
minor polish — long page is well-structured and pedagogically strong; the high-priority items are §6 missing widget, §2 jargon leak, the systemic `\mathrm` vs `\operatorname` (`\Hom`) inconsistency, and the §8 / §8.1 / §8.2 numbering seam.
