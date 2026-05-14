# heegaard-floer — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** khovanov-homology, surgery-theory

## Summary
Strong, well-paced page that holds its own next to its two section peers in voice, structure, and widget cadence; the substantive issues are concentrated in widget-side notation drift (`̂HF` glyph, raw `Spin-c`, manual ASCII fall-backs of LaTeX) and a few first-use-without-callback terms (`monotonicity`, `Maslov`, `spectral sequence`). The HTML `<title>` tag also lowercases "floer" inconsistently with peers.

## Findings
### Notation drift
- HTML `<title>` is `Heegaard floer` (line 6) — peers use `Khovanov homology` and `Surgery theory` capitalised. Cosmetic but visible in the browser tab.
- `\widehat{HF}` (LaTeX, prose) vs `̂HF` (literal U+0302 combining circumflex + ASCII) inside widget readouts/SVG labels: e.g. line 703 `̂HF`, line 798 `̂HFK`, lines 919/933 `̂HF(Y)`, `̂HF(Y₀)`. Peers handle the same problem better — `khovanov-homology.html` writes plain `Kh` in widget text and reserves `\widehat{·}` for KaTeX-rendered prose. The combining-mark trick renders inconsistently across fonts; semantic drift because the widget-side label can shear off from the prose's `\widehat{HF}`. **Recommendation:** use `HFhat` / `CFhat` or the unicode `Ĥ` (U+0124) as a single glyph, or just omit the hat in widget text and disambiguate in the readout.
- `\mathrm{Spin}^c` (KaTeX prose, e.g. line 387, 454) vs `Spin-c` / `Spin^c` (raw ASCII in widget chrome and SVG `<title>`, lines 467, 473, 857, 858, 862). Same conceptual object, three different surface forms inside one page. surgery-theory.html avoids this by not putting `Spin^c` inside widget readouts at all.
- The §6 widget readout strips LaTeX with a hand-written ad-hoc replacement table (line 958-961: `'\\setminus':'\\','\\nu':'ν','\\partial':'∂',…`). This is fragile and produces output that drifts from the prose convention — e.g. `\\setminus` becomes a literal backslash. khovanov-homology and surgery-theory keep the readout text fully ASCII-from-the-start so this layer doesn't exist.
- Lens-space matrix at line 275 uses `\bullet` placeholders inside `SL_2(\Z)`: `\begin{pmatrix}p&\bullet\\q&\bullet\end{pmatrix}\in\mathrm{SL}_2(\mathbb{Z})`. The `•` reads as a typo on first scan. khovanov-homology never leaves a placeholder in a displayed matrix — it either gives the determined entries or replaces with `\ast`/`*`.

### Undefined jargon
- "monotonicity" appears at line 331 inside the §2 "miracle" note — *"Under suitable monotonicity / orientability hypotheses"* — without definition or callback. First-time reader has nothing to click.
- "Maslov" appears at line 412 — *"a homological grading $M$ (Maslov)"* — used as if a known label; it is not defined here and there is no callback to symplectic-manifolds where Maslov index lives. khovanov-homology by contrast spells out every grading shift it introduces.
- "spectral sequence" first appears in §4 callback chrome (line 411 region) and again in §7's defining display formula for $\tau(K)$ at line 522 — *"survives the spectral sequence to $\widehat{HF}(S^3)$"* — used as the load-bearing definitional notion of the section's headline invariant, with no prior definition or callback. Peers do not use spectral sequences as definitional load-bearers without setup.
- "Bar-Natan deformation" — not in this page (good, only in khovanov), no concern. "Whitney trick" — not used in this page; no concern.
- "rational-homology cobordism" appears in the hero (line 261) before any discussion of homology cobordism elsewhere; no callback. Resolved in §5 indirectly but the hero word lands cold.

### Tone mismatches
- Hero `sub` (line 261) at 5+ comma clauses with `out drops a powerful family of invariants…` reads slightly more breathless than peer heroes (compare khovanov's `Lift the Jones polynomial from a Laurent polynomial to a bigraded chain complex` — short declaratives). Cosmetic.
- §3 "flavors" table (lines 375-383) is dense and pure-definition; the surrounding prose narrates well, but the table itself has no worked toy. The §3 widget that follows is "click a node, read a description" — informative but not a *computation* you can poke. Compare khovanov-homology §2 widget (`Bigrading viewer` with actual rank-per-cell numbers) and surgery-theory §6 widget (`$\Theta_n$ slider with $|\Theta_n|$`). Voice is fine; the *gesture* of the §3 widget is closer to "click a glossary" than "compute a number."
- §6 widget (proof-scrubber for the surgery exact triangle) is well-paced, but its readout text is the fragile LaTeX-strip discussed above; tonal effect is "the page glitched" rather than the deliberate prose voice.

### Missing worked examples
- §1 has a worked widget (`Heegaard splittings · genus selector`) — ok.
- §2 has the toy cylinder Floer widget — ok.
- §3 (`Heegaard Floer homology and its variants`) — widget is a *static graph of the four flavors with click-for-description*. No actual computation, no rank read, no `\widehat{HF}(L(p,q)) = \mathbb{F}_2^p` example. **Drift vs khovanov**: khovanov-homology §2 ships actual rank cells. **Recommendation:** add a small rank table for $\widehat{HF}$ on $S^3$, $S^1\times S^2$, $L(5,1)$ — the exact cases the §1 widget already enumerates — so §3 actually computes something.
- §5 (`d-invariant`) — has a working scrub-$p$ widget. ok.
- §6 (surgery exact triangle) — proof-scrubber is conceptual stepping; no exactness verification on a chosen example. Acceptable but thinner than khovanov's §3 (which juxtaposes Kh table and Jones polynomial side-by-side).
- §7 (`tau invariant`) — has a real knot-table widget. ok.
- §8 (`Connections`) — by convention no widget. ok.

### KaTeX macros / formatting
- The page declares the standard six macros (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) verbatim from the template — no Heegaard-Floer-specific macros (`\HF`, `\HFK`, `\Spinc`, `\Tor`) are introduced. Given how many times `\widehat{HF}`, `\widehat{HFK}`, `\mathrm{Spin}^c`, `\mathbb{F}_2`, `\mathbb{T}_\alpha`, `\mathbb{T}_\beta` recur, defining macros (`\HFhat`, `\HFKhat`, `\Spinc`, `\F`, `\Ta`, `\Tb`) would (a) shorten source markedly and (b) make the widget-side `̂HF` ASCII workaround unnecessary if the same macro is reused. Neither peer defines page-local macros either, so this is a uniform-improvement suggestion, not drift.
- `\mathbb{F}_2` is used throughout; never abbreviated — consistent.
- `\mathbb{Z}/2` (line 327) vs no other `\mathbb{Z}/n` form needed; consistent.
- Widget readouts repeatedly mix unicode math glyphs (`α, β, ∂, ⊗, ℝ, ℚ, ̂, ℤ`) where peers stay ASCII. Not a KaTeX failure (the readouts aren't run through KaTeX), but the visual asymmetry between *prose says* `\mathbb{Q}` *and readout says* `ℚ` is mild semantic drift.
- No invented delimiters — `$…$` and `$$…$$` only. Helper block at top of `<body>` matches `category-theory.html` verbatim (spot-checked `$, $$, SVG, ensureArrow, drawArrow, drawNode`). No ad-hoc widget chrome classes — `.widget / .hd / .ttl / .hint / .readout / .row / .note / .small / .pill` all standard.

## Severity
minor polish
