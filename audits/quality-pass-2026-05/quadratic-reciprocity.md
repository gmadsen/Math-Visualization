# quadratic-reciprocity — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** algebraic-number-theory, frobenius-and-reciprocity

## Summary
A strong, well-paced page that hews very closely to the house style and to its peers' notation. The structure (motivating question → group → symbol → supplements → Gauss's lemma → reciprocity → engine → generalisation → why-it-matters) is exemplary; widgets are concrete and varied (clock, grid colouring, Gauss-lemma visualiser, sign-pattern table, step-by-step calculator, periodicity strip, live JS cell). Minor polish only — a couple of forward references to "Frobenius / abelian extension / cyclotomic" appear before the page-ending bridge actually explains them, and the "forthcoming" footnote in §9 has been overtaken by reality.

## Findings

### Notation drift
- _None._ `$\mathbb{Z}$`, `$\mathbb{Q}$`, `$\mathbb{F}_p$`, `\Gal`, `\mathrm{Frob}_p`, and `$(\mathbb{Z}/p)^\times$` all match the conventions in algebraic-number-theory and frobenius-and-reciprocity verbatim. The shared `\Gal`/`\Hom` macros from `category-theory.html` are inherited without re-definition.
- (Cosmetic, low priority) §3 uses both `\left(\frac{a}{p}\right)` (display, line 426) and `\left(\tfrac{a}{p}\right)` (inline, lines 432, 511, 663) — both peers do the same thing in inline vs display contexts, so this is house-typical, not drift.

### Undefined jargon
- "the prototype of every reciprocity law that follows, from Artin to Langlands." (hero sub, line 307) — *Artin* and *Langlands* are name-drops in the tagline. Frobenius-and-reciprocity does the same (its sub names "the Langlands program"), so this is consistent peer-style; flag only as low-priority "names before content."
- "exactly the failure mode that primality rules out." (§2, line 392) — uses the modular-clock widget with `n=6` "and pick a non-unit such as $a=2$, and watch the orbit collapse." The phrase *non-unit* is used before the page has formally defined `unit` in `\mathbb{Z}/n` (it has only mentioned that every nonzero residue mod prime $p$ is a unit). Minor; readers familiar with the prereq blurb on `multiplicative-group-mod-p` will recover.
- "Dirichlet character modulo $4|a|$" (§8, line 1000) — *Dirichlet character* and *characters of ray class groups* are introduced for the first and only time on the page, used in the closing paragraph of §8 with no in-page definition. The link is to `dirichlet-series-euler-products.html`, which is fine, but a half-sentence parenthetical (e.g. "a homomorphism $(\mathbb{Z}/N)^\times\to\mathbb{C}^\times$") would smooth the landing.
- "cyclotomic field $\mathbb{Q}(\zeta_{4a})$" and "abelian Galois group" (§9, lines 1010–1012) — these are the Frobenius bridge, and they appear with no in-page glossing. Acceptable in a "where to read next" closing section, but the term *abelian extension* is bolded as the keyword, suggesting a weight it does not earn here. The reader is expected to bounce to galois.html / frobenius-and-reciprocity.html.

### Tone mismatches
- _None significant._ Voice matches both peers — second-person occasional ("Try it.", "Try it yourself", "Visualise it on a circular dial."), worked mini-examples after each definition, the same conversational-but-precise register as algebraic-number-theory's "tragedy" section and frobenius-and-reciprocity's "abelian miracle" / "non-abelian case" headings.
- (Low priority) §9 line 1019 — `<em>Sums of squares</em> (forthcoming <code>sums-of-squares.html</code>) — Fermat's theorem on $p = x^2+y^2$ is $\left(\tfrac{-1}{p}\right) = +1$.` The "forthcoming" hedge appears for three pages (sums-of-squares, p-adic-numbers, frobenius-and-reciprocity); at least frobenius-and-reciprocity now exists in the corpus, so the parenthetical reads as stale. Cosmetic.

### Missing worked examples
- _None._ Every numbered `<h2>` section has at least one widget or a fully worked algebraic example. Specifically:
  - §1 Squares-mod-$p$ grid widget.
  - §2 Modular-arithmetic clock widget (`MVModularArithmeticClock`).
  - §3 Multiplicativity worked via cyclic generator + Euler-criterion worked widget (square-and-multiply readout).
  - §4 Both supplementary laws have explicit `\bmod 4` and `\bmod 8` cases plus a one-line proof of the first.
  - §5 Gauss-lemma visualiser with axis + shaded upper half + per-$j$ residue dots.
  - §6 Sign-pattern table widget over prime pairs.
  - §7 Step-by-step Legendre/Jacobi calculator + periodicity strip widget + live JS code cell.
  - §8 Worked Jacobi caveat $(2/15) = +1$ but $2$ not a square mod $15$, plus full reciprocity-law triple.
  - §9 Closing narrative; bridge to Frobenius is qualitative but no widget needed.

### KaTeX macros / formatting
- Macro block (lines 38–45) is the verbatim repo-standard set: `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`. No locally invented macros. Page reaches for `\mathrm{Frob}` directly rather than defining a `\Frob` shorthand — same as frobenius-and-reciprocity.html.
- Helper-block at top of `<body>` (lines 197–283) is the verbatim 2D copy from category-theory.html (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) plus a clearly-marked `/* number-theory helpers (shared by widgets) */` extension defining `mod`, `modPow`, `isPrime`, `legendre`, `jacobi`. Extension is appropriate (peers ship similar topic-local helpers — frobenius-and-reciprocity has a much larger polynomial-arithmetic block in the same slot).
- Widget chrome: every interactive uses `<div class="widget">` + `<div class="hd"><div class="ttl">…</div><div class="hint">…</div></div>` + `.row` + `.readout`, identical to peers. No ad-hoc classes.
- Local CSS additions (lines 127–136): `.chip`, `.chip.qr`, `.chip.nonqr`, `.chip.neg`, `.chip.pos`, `.cell`, `.grid-wrap`. These define hex backgrounds (`#3d3418`, `#5a4a1e`, `#1a1f2b`, `#2a1a18`, `#4a2820`, `#1a2418`, `#2a4a20`) inline rather than via `var(--…)`. Non-critical (the chips' foregrounds use `var(--yellow)`, `var(--mute)`, `var(--pink)`, `var(--green)` correctly), but `node scripts/color-vars.mjs` will likely flag these. Low priority.
- Live-cell wiring: §7 loads `MVCodeCell` (line 944, gated on `window.MVCodeCell`); the `<script src="./js/widget-code-cell.js">` is wired in `<head>` line 20. Good.
- Modular-clock widget: §2 loads `MVModularArithmeticClock` (line 396, gated on the global). `<script src="./js/widget-modular-arithmetic-clock.js">` is wired in `<head>` line 21. Good.
- Display-prefs / breadcrumb / changelog auto-fences are present and intact.
- One small inconsistency: `<script src="./js/sidetoc.js">` lives at line 190, *after* the `<style>` block, whereas category-theory.html groups it with the other `./js/*` imports near the top of `<head>` (line 181). Both load orders work; cosmetic only.

## Severity
minor polish
