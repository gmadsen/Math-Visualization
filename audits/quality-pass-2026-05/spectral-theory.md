# spectral-theory — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** functional-analysis, operator-algebras

## Summary
Solid, tightly-aligned page: helper block, KaTeX macros, widget chrome, and core notation match the section peers verbatim, and every numbered section ships with a working interactive widget. Findings are minor — a handful of undefined terms (resolvent, compact resolvent, Karamata/Pleijel/Mercer), three sections without "See also" callbacks despite obvious peer anchors, and a couple of `\mathbb` vs Unicode inconsistencies inside readouts.

## Findings
### Notation drift
- `\mathcal{K}(H)` in spectral-theory §6 ("The compacts $\mathcal{K}(H)$ form a closed two-sided $*$-ideal") and §7 vs plain `K(H)` in operator-algebras (`<tr><td>$K(H)$</td>`, line 366; also lines 1260, 1363, 1779). spectral-theory matches functional-analysis. Cosmetic — recommend operator-algebras adopt `\mathcal{K}(H)` for cross-page uniformity, but spectral-theory itself is fine.
- Body uses `\ell^2(\mathbb{Z})`, `L^2[0,1]`, `\mathbb{R}` (math mode); widget readouts and SVG labels use Unicode `ℓ²(ℤ)`, `L²[-1,1]`, `ℝ` (e.g. §1 readout "Bilateral shift S on ℓ²(ℤ)", §5 "Σ c_n e^{-λ_n t}"). Functional-analysis and operator-algebras do the same — call it consistent house style, not drift, but worth noting if you ever decide to tighten.
- `\mathrm{Ran}`, `\mathrm{Dom}`, `\mathrm{coker}` used in §2 and §6 — matches functional-analysis §7 (line 1206: `\mathrm{coker}`). Consistent.
- `\operatorname{tr}` used everywhere even though the page declares `\tr` macro (line 26). All three pages have the same dead macro; fixing requires touching every page or removing the macro. Cosmetic.

### Undefined jargon
- "Liouville for the resolvent" (§1, end of opening paragraph: "Three theorems anchor the picture: ... (Liouville for the resolvent)"). The word "resolvent" is used parenthetically here but never defined on this page; functional-analysis defines `\rho(T)` as "the resolvent set" at line 1186 but no callback ferries the reader there.
- "compact resolvent" appears in §5 readout ("Dirichlet Laplacian -d²/dx² on [0,1] is unbounded but self-adjoint with compact resolvent") and again in §8 prose ("the spectrum is a discrete sequence ... (compact resolvent)") with no in-page definition. Reader has to infer from context.
- "Karamata" Tauberian theorem named in §8 with no expansion — minor, but a one-clause gloss would help non-analysts.
- "Pleijel showed that you also hear the perimeter" / "Mercer-type series" (§3) — drop in without setup. The Mercer reference in particular is opaque to readers who haven't met integral-operator spectral theory before.
- "essential range g(x)" — written into the §1 SVG label `σ(M_g) = essential range g(x)`; "essential range" is a measure-theoretic term unfamiliar at this stage and not defined on this page.
- "quasi-nilpotent" introduced in the §1 Volterra readout without a sentence of explanation; reader can guess from "spectral radius = 0" but it's a leap.

### Tone mismatches
- §6 opens with "The miracle, due to Riesz, Schauder, and Fredholm, is that for $\lambda\ne 0$ ..." — fine as a tone hook, but the immediately following `<div class="ok">` Fredholm-alternative box piles four bullets of dense conditions on top of each other before any worked instance lands. Reference §7 of functional-analysis intersperses prose between the bullets; spectral-theory's box reads as a textbook lemma dump.
- §7's Schatten paragraph ("Compact operators come with a finer filtration. ...") is a wall of formulas and ideal-inclusion chains with very little narration between $\mathcal{S}_p$, Hilbert–Schmidt, trace-class, Hölder for Schatten, Schatten duality, predual. Functional-analysis §7's "Trace-class and Hilbert–Schmidt" subsection covers the same ground in a fraction of the density and would be a better pacing model. Consider breaking the Schatten exposition into a short motivating paragraph, the two named ideals, then duality — currently they're a single block.
- §1 readouts switch person and register mid-string ("Bilateral shift S on ℓ²(ℤ): unitary operator. σ(S) = {λ : |λ|=1}, all continuous. No eigenvalues — geometric sequences λⁿ are not in ℓ²."). Fine, but the others ("Multiplication by g(x)=x ... self-adjoint. σ(M_g) = [-1, 1] continuous.") read as terse bullet lists rather than the conversational explanation references typically use in their readouts.

### Missing worked examples
- Every numbered section has at least one widget; no section is pure definition. The §7 widget on `Σ n^{-αp}` is more abstract than the others — you slide α and p and watch a number turn green/pink — but it does illustrate the αp > 1 threshold concretely. Acceptable.
- §6 (compact-Fredholm) has the rank-truncation widget but never gives a concrete Fredholm-alternative computation despite the prose promising one ("The classical model: integral equations $\varphi(x) - \lambda\int_0^1 k(x,y)\varphi(y)\,dy = f(x)$"). A small sliding-λ demo on a known kernel where the alternative flips between "unique solution" and "consistency condition" would round out the section, but the existing widget is on-topic.

### KaTeX macros / formatting
- Macros block (lines 22–29) is verbatim identical to both references (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`). None of them are actually invoked in spectral-theory body — the page uses `\operatorname{tr}`, `\operatorname{ind}` longhand throughout (e.g. line 775 `\operatorname{ind}(T)`, line 858 `\operatorname{tr}(T)`). No drift, but a missed opportunity to use the declared macro.
- Delimiters all standard `$…$` / `$$…$$`; no invented brackets.
- KaTeX inside `<option>` not used — page has `<button>` and `<input type="range">` only, so the `js/katex-select.js` load (line 178) is technically unneeded but harmless.
- §3 widget title contains escaped quote `Eigenvalue expansion of the Green&#39;s-function kernel` — that's the mandatory `<title>` HTML escape and is fine; just flagging that the rendered KaTeX inside `$k(x,y)=\min(x,y)-xy$` will render correctly via auto-render.

## Helper-block / widget-chrome hygiene
- 2D helper block (lines 187–238: `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is byte-identical to functional-analysis lines 186–234. Verified.
- Every widget uses `<div class="widget">` with `.hd > .ttl + .hint`, `.row` for controls, `.readout` for the bottom panel, plus `<svg>` with `viewBox` and a `<title>` (a11y). No ad-hoc classes spotted.
- All five `<div class="quiz" data-concept="...">` placeholders are present at section ends; `data-concept` ids match the `concepts/spectral-theory.json` slugs (`st-bounded-operators-spectrum`, `st-self-adjoint-spectrum`, `st-spectral-theorem-compact`, `st-spectral-theorem-bounded`, `st-unbounded-operators`, `st-compact-fredholm`, `st-trace-class-hilbert-schmidt`, `st-weyl-laplacian`, `st-applications`). Footer `MVQuiz.init('spectral-theory')` IIFE present (line 1136).
- Top-nav `← Notebook` backlink and `<aside class="sidetoc">` scaffold both present.
- §5 (`unbounded`), §7 (`trace-class`), and §9 (`applications`) are missing a `<aside class="callback">` block despite obvious cross-page anchors:
  - §5 Stone's theorem → no callback to `lie-groups.html` (one-parameter unitary groups) or `harmonic-analysis.html` even though the topic explicitly invokes "Quantum dynamics, heat flow, and wave propagation."
  - §7 Schatten / predual / density matrix → no callback to `operator-algebras.html` (states, von Neumann predual) or `quantum-mechanics`/`statistical-mechanics`.
  - §9 (Applications) → no callback at all even though it explicitly cross-references quantum mechanics, PDE, and harmonic analysis.
  Run `node scripts/audit-callbacks.mjs --fix` after adding any cross-topic prereqs in `concepts/spectral-theory.json`; if the prereqs are already present and the callbacks just didn't render, that's an injector bug worth flagging.

## Severity
minor polish

---
*Reminder: orchestrator should run `node scripts/rebuild.mjs` after any content changes.*
