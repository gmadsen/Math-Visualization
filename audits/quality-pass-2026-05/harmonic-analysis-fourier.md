# harmonic-analysis-fourier — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** measure-theory, wavelets

## Summary
A polished, well-paced page: notation is consistent with both Analysis peers, tone is conversational and worked-example-driven through §§1–3, 5, 7, and the helper block / widget chrome are clean. Main gap is widget coverage in the back half (§§4, 6, 8 are widget-free) and a handful of cosmetic mathrm/operatorname drifts versus wavelets.

## Findings
### Notation drift
- `\mathrm{sgn}(\xi)` (line 701, p.v. table) versus wavelets' `\operatorname{sgn}(c)` (wavelets line 454). Cosmetic — both render the same — but `\operatorname{}` is the convention reached for elsewhere in this page (`\operatorname{supp}` is used in wavelets, and `\Hom`/`\Spec` macros expand to `\operatorname{}`).
- `\mathrm{p.v.}\,1/x` and `\mathrm{cts}` and `\mathrm{loc}` (lines 701, 1004, 693) are page-local; neither reference uses these. Acceptable since they are conventional in the subject, but worth noting they are introduced without macro support.
- `\Hom_{\mathrm{cts}}(G,\, U(1))` (line 1004) uses the global `\Hom` macro correctly — matches `category-theory.html`'s usage. Good.
- `\mathbb{R}`, `\mathbb{Z}`, `\mathbb{T}`, `L^p(\mathbb{R})`, `\mathcal{F}`, `\mathcal{S}`, `\hat f` are used uniformly throughout and match measure-theory's blackboard-bold / mathcal conventions exactly. No drift.

### Undefined jargon
- `\mathrm{db}N` "Daubechies" naming is not in this page (good — it is a wavelets-side term), but **"Hermite polynomials"** appears once at §7 line 877 ("translates, dilates, and Hermite polynomials, this seeds an orthonormal basis") with no definition or callback. Low priority — Hermite polynomials are graduate background — but a one-clause aside or a `<a href>` to the analysis encyclopedia would close the loop.
- **"Carleson theorem"** (line 298) and **"Kolmogorov constructed an $f\in L^1$"** are mentioned as named results without elaboration. This is intentional historical name-dropping in the conversational style — measure-theory does the same with "Vitali" and "Carathéodory" — so not actually a jargon issue, just flagging that a reader who hasn't met the names sees them go by.
- **"Cohen–Daubechies–Feauveau"** is *not* in this page (good).
- §8 introduces "compact-open topology" (line 1005) without a callback — but the section is explicitly tagged `(teaser)`, so this is acceptable scoping.
- §4 §6 §7 use `\mathcal{S}'$ (tempered distributions), `H^s` Sobolev space, "Calderón–Zygmund" — wait, "Calderón–Zygmund" only appears in wavelets, not here. Sobolev `H^s` (line 708) is one-line introduced at the end of §4 with the explicit defining set; that's fine.

### Tone mismatches
- Generally on-template: conversational openings ("You cannot simultaneously concentrate $f$ and $\hat f$" §5 l.730; "Pick a function and watch the partial sum" §1 l.277; "Think of $|f(x)|^2$ as a position density" §5 l.741) match wavelets' "A Fourier basis spreads a localised event" style and measure-theory's "we want a class $\mathcal{L}$" voice.
- §2 "The big four properties" table (lines 433-443) is a 6-row table presented without narration — slightly drier than measure-theory's parallel "operations on measurable functions" treatment which interleaves prose. Low priority; the post-table sentence l.444 ("the engine that turns linear constant-coefficient PDEs into algebraic equations") rescues it.
- §4 Schwartz section (lines 679–725) is the closest the page comes to a textbook-voice wall: theorem box, then a 5-row distributions table, then duality definition. No widget, no toy. Compared to wavelets §6 Applications (which interleaves three vignettes with a denoiser widget) this feels denser.

### Missing worked examples
- **§4 Schwartz space and tempered distributions** has no widget. The natural toy would be: a slider controlling a Gaussian with a polynomial prefactor, showing decay vs polynomial blow-up; or a "click a row of the distributions table to see its action" interaction. Compared to wavelets §3 Daubechies (which has a four-button family selector despite being conceptually similar), §4 is a notable gap.
- **§6 Poisson summation** has no widget. The theta-function modular transformation $\theta(1/t)=\sqrt t\,\theta(t)$ (line 848) is screaming for a slider showing both sides of the identity, or a Shannon–Nyquist aliasing visualization for the sampling-theorem subsection. Compared to measure-theory §10 Fubini (which has a worked counterexample widget) or wavelets §4 DWT (with the pyramid stepper), this is the most-felt gap.
- **§8 Pontryagin duality** has no widget — but is explicitly tagged `(teaser)` in the section title, and the worked content is a 6-row LCA table. Acceptable as scoped.
- §§1, 2, 3, 5, 7 each have a working widget. So the page is 5/8 widget-covered, with §§4, 6, 8 lagging.

### KaTeX macros / formatting
- KaTeX macro block (lines 22–28) is byte-identical to measure-theory and wavelets. No locally-introduced macros — `\hat`, `\widehat`, `\mathcal`, `\mathbb`, `\mathrm`, `\mathbf`, `\partial`, `\sigma`, `\xi`, `\delta`, `\Lambda`, `\varphi`, `\varepsilon` are all standard KaTeX. `\Hom` resolves via the global macro. Good.
- `$\widehat{x} = \tfrac{1}{-2\pi i}\delta'$` (line 700) — minor: the convention elsewhere in the page is `\hat f` (no braces), but `\widehat` is used here for the wide-hat over a multi-character expression. Both are needed and used appropriately; no actual drift.
- Helper `<script>` block (lines 187–239): `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all match the canonical category-theory.html block. The only diff vs measure-theory is three preserved one-line code comments ("// draw an arrow marker def once per svg (idempotent)" etc.) — semantically identical, well within tolerance.
- Widget chrome: every interactive (`#w-fs`, `#w-ft`, `#w-conv`, `#w-unc`, `#w-heat`) uses `<div class="widget">` + `.hd / .ttl / .hint`, `.row`, `.readout`, plus standard `<svg viewBox=… ><title>…</title></svg>`. No ad-hoc classes. Standard `.note` / `.ok` callouts used appropriately.
- Readouts that interpolate math via JS `textContent` use Unicode/ASCII fallbacks ("σ_x = …", "hat f(0)", "ξ = ±…"). KaTeX cannot render after-load `textContent` writes, so this is the corpus norm — measure-theory does the same ("(μ⊗ν)(A×B) = …"). Not drift.

## Severity
minor polish — primary action item is adding widgets to §4 Schwartz and §6 Poisson; everything else is cosmetic.
