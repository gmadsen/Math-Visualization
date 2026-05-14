# microlocal-analysis — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** sobolev-spaces-distributions, partial-differential-equations

## Summary
Strong, well-paced page with consistent voice and six interactive widgets that all carry good readouts; main risks are jargon density in §5 (FIO/Lagrangian) and a couple of named results dropped without definition (Egorov, limiting absorption, Quinto/Greenleaf-Uhlmann theorem).

## Findings
### Notation drift
- `\mathrm{WF}`, `\mathrm{singsupp}`, `\mathrm{Char}`, `\mathrm{Ell}` are typeset with `\mathrm{...}` throughout (e.g. line 266 `\mathrm{WF}(u)`); the page-loader macros include `\Hom`/`\Spec` as `\operatorname{...}` aliases. Cosmetic-only — both render identically — but `\operatorname{WF}` would match the house pattern set by category-theory.html and would auto-spaces correctly when juxtaposed with `(u)`.
- `\mathrm{ind}(P)` appears at line 720; the loader already defines `\ind` as `\operatorname{ind}`. Use the macro for consistency with other pages.
- Conormal bundle is written as `N*{x=0}` in the §1 widget readout (line 321) but `N*` never appears in the prose; readers see the symbol cold. Sobolev/PDE never need this notation, so introduce it in the prose paragraph that mentions the conormal bundle (line 274) before the widget surfaces it.
- Inline subscript convention drifts: `\partial_\xi^\beta` is written as `\partial^\beta_\xi` on line 453 but `\partial^\alpha_x \partial^\beta_\xi` on the same display equation. Cosmetic; pick one.
- `T^*\mathbb{R}^n\setminus 0` (page convention) vs `T^*M\setminus 0` (line 278) — fine since the latter is a deliberate manifold-version remark, but a one-line nod ("we drop the explicit $\mathbb{R}^n$ when generalising to a manifold") would help.

### Undefined jargon
- "Egorov's theorem, an FIO-conjugation statement" (line 455) — named in §2 before §5 introduces FIOs, with no definition. The parenthetical "an FIO-conjugation statement" is a label, not a definition; remove the name or defer it to §5.
- "limiting absorption principle" (line 941, §6) — first and only mention, no definition or callback.
- "Strichartz estimates", "dispersive bounds" (line 941) — dropped as keywords; fine as outward links if they linked anywhere, but they don't.
- "Quinto, Greenleaf-Uhlmann" (line 943) — name-dropped without saying which result is theirs. Either cite the theorem name ("microlocal limited-data theorem") cleanly or attribute one of them.
- "Calderón problem" (line 945) — defined in passing as "recover conductivity from boundary measurements", which is acceptable. "Dirichlet-to-Neumann map" in the same sentence is not defined.
- "Gevrey regularity" (line 1040, §7 outro) — named without definition. Acceptable in a survey "open frontiers" paragraph, but worth a one-line gloss.
- "FBI-Bargmann transforms / second microlocalization" (line 1040) — also outro-only, but bundled together in a way that suggests the reader should know both. A six-word gloss would help.

### Tone mismatches
- Generally matches the house "conversational-but-precise" voice well; uses "you" implicitly via imperative ("Pick a cutoff", "Three diagnostic examples set the geometry"). Good.
- §6 leans into a textbook-survey voice ("ships as a uniform language", "Three flagship arenas") and stacks three named applications back-to-back with bold headers but no widget breath between them until the Radon widget arrives. Compare PDE §1–§4 which interleave widget per concept. Consider promoting the scattering paragraph to a separate H3 or moving the Radon widget earlier.
- The §5 paragraph at line 821 is a 7-sentence wall containing the Lagrangian definition, the canonical-relation rule, the symplectomorphism specialisation, and the Radon set-valued caveat — this is the densest paragraph on the page. Sobolev §1 in comparison breaks up similar content into a definition block + a `<table class="plain">` + a callout. Consider splitting.
- §5 second bullet (line 827) is a single 9-line list item that pivots three times (FIO ↔ canonical transformation; evolution equations as FIOs; Maslov correction; WKB). Each of these is a substantial idea and deserves its own bullet.

### Missing worked examples
- Every numbered §1–§6 has a widget — coverage is excellent.
- §1 widget richly enumerates seven distributions including the corner case; §2 plots symbol decay curves; §3, §4 cover propagation and parametrix bootstrap; §5 covers canonical relations; §6 covers Radon visibility. No section is definition-only.
- §7 "Connections" is intentionally a survey/outro — no widget needed (matches PDE §7 and Sobolev convention).
- Minor: §4's "elliptic regularity theorem" deserves a single concrete worked instance ("for $-\Delta u = f$ on a smooth bounded domain, $f\in C^\infty\Rightarrow u\in C^\infty$" appears in the readout but not in the prose). Lift it into a `<div class="ok">` or note block.

### KaTeX macros / formatting
- Loader macro list (lines 22-29) is the standard 6-macro set verbatim — matches sobolev-spaces-distributions and PDE exactly. No bespoke macros. Good.
- Delimiters are the standard four (`$`, `$$`, `\(`, `\[`). Good.
- A handful of UTF-8 math symbols leak into widget readouts and `<option>` labels — `δ₀`, `ξ`, `θ`, `λ`, `χ`, `Ψ`, `≈`, `⊥`, `∈`, `→`, `⇒`. This is the established pattern for `.readout` text on this page (`.readout` is `font-family:ui-monospace`, not KaTeX-rendered) and it is fine; mentioning only because `<option>` labels (e.g. line 287 "δ₀ (point at origin)") are plain text, which is correct — no LaTeX inside `<option>` so `katex-select.js` is not strictly needed, but the loader is wired in (line 178) which is harmless.
- Helper block at lines 187-235 omits the two `// draw an arrow marker def once per svg (idempotent)` and `// curved arrow between two pixel points, with optional label` comments that appear in category-theory.html lines 195/204. Cosmetic-only; the function bodies are byte-identical and the `$, $$, SVG, ensureArrow, drawArrow, drawNode` API matches.
- Widget chrome (`.widget / .hd / .ttl / .hint / .readout / .row`) is used uniformly on all six widgets. No ad-hoc classes detected. Good.
- `.note / .ok / .bad` callout blocks are defined in `<style>` but never used in the page body — Sobolev uses `.note` heavily for worked computations ((a)/(b)/(c) at lines 433-445). Microlocal could lean on `.note`/`.ok` to pull out the elliptic-regularity statement and the three §1 examples.
- All six SVGs have `viewBox` and `<title>` elements. Good a11y.

## Severity
minor polish
