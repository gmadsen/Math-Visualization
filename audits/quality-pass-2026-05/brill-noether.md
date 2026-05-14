# brill-noether — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** algebraic-curves-higher-genus, moduli-spaces

## Summary
A dense and well-engineered topic page that delivers seven bespoke widgets (linear-series sweep, RR floor explorer, $\rho$-grid, $W^r_d$ filtration, Schubert-step scrubber, Petri-map dim diagram, limit-series chain) and lands the full Kempf–Petri–Eisenbud–Harris arc. Drift from the section peers is mostly cosmetic notation (`\Pic` vs. `\operatorname{Pic}`, plus a few `\mathrm{...}` / `\operatorname{...}` mixes), one hero paragraph that is far heavier than the peer convention, and a couple of jargon callbacks that fire before the term is glossed locally.

## Findings

### Notation drift
- Target macro `\Pic = \operatorname{Pic}` is defined locally in the KaTeX loader at brill-noether.html line 26 and used everywhere (e.g. line 565 "$\dim\Pic^d(C)$", line 695 "$L\in\Pic^d(C)$"). algebraic-curves-higher-genus.html does *not* define this macro and writes `\mathrm{Pic}(C)` (line 427) and `\mathrm{Pic}^0(C)` (line 429). Cross-page-inconsistent rendering: same object, three spellings. Settle on one — the brill-noether `\Pic` macro matches the page's own `\Hom`/`\Spec`/`\Gal` `\operatorname{...}` family and is the cleaner convention. Low priority but visible.
- `\Pic^d` (target, all sections) vs. `\mathrm{Pic}^d` (algebraic-curves-higher-genus.html line 429). Same drift, called out separately because it is the most-repeated symbol on the target page.
- `\mathrm{div}(s)` (target line 274) and `\mathrm{div}(f)` (algebraic-curves-higher-genus.html line 427) are consistent across the two pages — no drift, worth noting positively.
- `\Pic(\overline{\mathcal{M}}_g)\otimes\mathbb{Q}` (target line 1067) uses the macro; `\Pic\otimes\mathbb{Q}` (algebraic-curves-higher-genus.html line 909, in the same Brill–Noether-divisor context) uses `\mathrm{Pic}`. Same lexical drift in the most cross-linked sentence pair on the two pages.
- `\operatorname{rk}\gamma` (target line 703) and `\operatorname{coker}\mu_0` (target line 945) use `\operatorname{...}` ad-hoc; consistent with house style, no drift, but the page would benefit from local macros if these recur.
- `J(C)` (target line 1179) versus `\mathrm{Jac}(C)` (algebraic-curves-higher-genus.html line 431) for the Jacobian. Both spellings appear in the literature, but within a single notebook it is worth picking one — `\mathrm{Jac}` is established on the prereq page and would aid reader carry-over.

### Undefined jargon
- "**Porteous-type expected codimension**" (target line 565, §3) — Porteous is invoked as a brand name to derive $\rho$ before any in-text gloss; the formula it invokes is then re-stated correctly, but a parenthetical "(Porteous formula: a generic linear map between rank-$a$ and rank-$b$ bundles has rank-$\le c$ locus of expected codimension $(a-c)(b-c)$)" would let the reader follow without an external lookup. Same term reappears at line 703 ("by Macaulay/Porteous") and line 874 ("Macaulay/Porteous formula") — in §5 it is finally implicit-defined in the scrubber readout, but the §3 first use is naked.
- "**determinantal variety**" (target line 699, §4) — appears in bold as if a definition, but the gloss ("the locus where the rank of a universal evaluation map of bundles drops") that follows is hand-wavy and never reduces to the matrix-of-minors picture; the reader who has not seen determinantal loci has to wait until line 816 for the next pass. Mild — fixable with one sentence.
- "**Schubert calculus / Chern-class computation**" (target line 841, §5) — first time on the page that Schubert calculus is named outside of the widget caption (where it was already used at the §5 widget hint, line 850, "Schubert-calculus weight"). The reader is expected to take "Schubert-style polynomial" / "Schubert class" on trust. Cross-page callback to `intersection-theory-chow.html#schubert` lives in §8 (line 1181), but the in-text use in §5 has no callback.
- "**limit linear series**" (target line 949, §6) is referenced ("re-proved more cleanly by Eisenbud–Harris using limit linear series (next section)") but the §7 definition (line 1073) is a single sentence — a reader pointed back from §6 finds a thin defining clause. Acceptable on re-read, slightly under-served on first pass.
- "**flag curve**" (target line 1085 widget caption) is used without a defining clause in the small-text caption; a reader who jumps to the widget before reading the §7 prose meets the term cold. Minor.
- "**Mercat's conjecture**" (target line 1184) is named in the closing-frontier paragraph with no gloss — fair for a "frontier" mention, lowest priority.

### Tone mismatches
- The hero `<p class="sub">` (target line 264) is one paragraph of five sentences and ~110 words and introduces $\rho$, $W^r_d$, the Brill–Noether theorem, the names Kempf / Kleiman–Laksov, Petri's theorem, "general curve", and the relation to $\mathcal{M}_g$ — all before §1. Compare with moduli-spaces.html line 254, two sentences, no theorem names, and algebraic-curves-higher-genus.html line 268, one sentence ("Genus $g \ge 2$: Riemann–Roch, the canonical embedding, and $\mathcal{M}_g$"). The brill-noether hero reads like a textbook abstract; the section convention is a one- or two-sentence orientation.
- §5 line 837 opens "The classical existence statement was conjectured by Brill and Noether in the late 19th century and proved rigorously a century later" — voice slips into a textbook historical aside without a transition. The peers tend to put history inside the `<div class="ok">` theorem boxes (target itself uses that box at line 839, immediately following) or in the small-print caption. Minor.
- §4 line 699, "It has a natural *scheme* structure as a **determinantal variety**" — the italic-then-bold pivot is unusual emphasis cadence. Compare algebraic-curves-higher-genus.html line 427 which uses bold for the named object once. Cosmetic.
- §3 derivation paragraph (target line 565) is a pure formula-walk with no second-person voice and no concrete example before the table at line 673. The peer pages tend to place a worked toy *before* the table. (See "Missing worked examples" below.) Minor.

### Missing worked examples
- §1 *Special divisors and linear series* — has the `w-bn-linear-series` widget (a circle-as-stand-in-for-curve sweep), but no concrete worked $g^r_d$ on a *named* curve before §3's table. Consider adding a one-line "On the canonical $g^{g-1}_{2g-2}=|K|$, $V=H^0(C,K)$ and the map is the canonical embedding $\varphi_K\colon C\to\mathbb{P}^{g-1}$" example, since it is the running thread later in §6 and §8.
- §3 *Brill–Noether number $\rho$* — the table at line 673 lists four worked $(g,r,d)$ rows, but they appear *after* the $\rho$ derivation and the widget. The peer's pattern (algebraic-curves-higher-genus.html §3, line 524) is to spell out one numerical example *before* the abstract derivation. The widget's $g=6,r=1,d=4$ default is a reasonable fallback, but a "$g=4,r=1,d=3$: $\rho=4-2(2)=0$, every genus-4 curve is trigonal" inline aside before the widget would let the reader meet $\rho$ as a number first.
- §4 *$W^r_d(C)$* — definition + determinantal abstraction + widget + scheme-structure note, but no worked $W^1_3$ on a genus-4 curve (i.e. *which* line bundles). The widget's nested-ellipse picture is qualitative; the reader leaves with no concrete element of $W^r_d$ to point at.
- §5 *Brill–Noether theorem* — Schubert-step scrubber walks the Kempf proof but no numerical class computation. Very dense section; one explicit "$[W^r_d] = $..." for a single $(g,r,d)$ would convert a "trust me" passage into a verifiable one.
- §7 *Brill–Noether loci in $\mathcal{M}_g$* — the limit-linear-series widget shows a chain of four elliptic curves with hard-coded vanishing sequences `(0,5)`, `(1,4)`, `(2,3)`, `(2,4)` (target line 1094-97); there is no derivation in the prose of *why* those particular sequences satisfy compatibility. Reader has to take the widget on faith. A short worked Eisenbud–Harris compatibility check on those sequences would tighten the section.

### KaTeX macros / formatting
- Target loader (line 22-30) defines `\Pic` as a local macro on top of the standard six (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`). This is the only added macro versus `category-theory.html` and the two reference pages, and it is justified by usage — appears 30+ times. Recommend either (a) propagating `\Pic` to algebraic-curves-higher-genus.html and moduli-spaces.html for consistency, or (b) noting the local macro in the page-local loader comment so future readers/editors know it exists.
- Target uses `\mathcal{M}_g`, `\mathcal{M}^r_{g,d}`, `\overline{\mathcal{M}}_g` consistently with both peers — no drift.
- `<p style="text-align:center">$…$</p>` is used for centered display equations at lines 272, 409, 563, 697, 701, 943, 1065 instead of `$$…$$`. Both peers use `$$…$$` (algebraic-curves-higher-genus.html line 474, moduli-spaces.html line 261, 269, 301). The two delimiters render similarly, but `$$…$$` is the convention documented in `AGENTS.md` ("KaTeX delimiters: `$…$` inline, `$$…$$` display"). Cosmetic but cross-page-inconsistent and easy to fix.
- No unusual macro re-invention beyond `\Pic`; no third-party delimiter syntax. KaTeX usage otherwise clean.
- `g^r_d` notation is used in plain text (e.g. line 276 "**$g^r_d$**") and inside KaTeX (e.g. line 644 "$g^r_d$ exists"). Both peers use the same convention. No drift.

## Helper-block / widget-chrome hygiene (advisory, not in the requested categories)
- Helper `<script>` block (target lines 190-242) is a verbatim copy of the `category-theory.html` 2D helpers — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all match. Good.
- The `<head>` block has duplicate stylesheet/script tags (target lines 166-181: `theme-light.css` and `concepts/bundle.js` and `theme-toggle.js` each appear twice — once before the `breadcrumb-head-auto-begin` fence and once inside it). This is an injector idempotency miss, not a content issue. Re-running `node scripts/inject-breadcrumb.mjs --fix` (or the full `rebuild.mjs`) would deduplicate. Cosmetic, browser is forgiving.
- All seven widgets use the canonical `.widget / .hd / .ttl / .hint / .row / .readout / .small / .pill / .note / .ok / .bad` chrome with no ad-hoc classes. Good.
- All seven `<svg>` elements have `viewBox` and `<title>`. Good.

## Severity
minor polish — single high-priority item is the hero-paragraph trim; everything else is cosmetic notation drift, a couple of missing worked-example anchors, and two underspecified jargon first-uses (Porteous, determinantal variety).
