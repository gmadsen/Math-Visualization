# wavelets — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** harmonic-analysis-fourier, functional-analysis

## Summary
Wavelets is a strong, mostly polished page that mirrors the Analysis-section voice well: numbered sections, worked widgets in every section, clear cross-callbacks. The main soft spot is rapid-fire signal-processing jargon in §3, §6, §7 — terms like "QMF", "minimum-phase", "Bezout's identity", "FIR", "linear-phase", "Calderón–Zygmund" land before they're defined. A few notation choices (the hand-wave Heisenberg constant, $\mathrm{db}N$, ad-hoc unicode `²ψ̃`) drift slightly from the conventions set in the two reference pages.

## Findings
### Notation drift
- Heisenberg constant — wavelets §5 writes `$\Delta x\,\Delta\xi\gtrsim 1$` (line 413), a hand-wave with no constant. harmonic-analysis-fourier §5 sets the precise value `$\sigma_x\,\sigma_\xi\;\ge\;\frac{1}{4\pi}$` (line 743). **Semantic drift, high priority** — a reader who jumps Heisenberg → wavelets gets a different bound. Settle on $1/(4\pi)$ (or at minimum cite the precise statement and convention) per the Analysis-section reference.
- Filter-name typography — wavelets uses `$\mathrm{db}N$`, `$\mathrm{db}1$`, etc. (line 344). harmonic-analysis-fourier prefers `$\mathrm{sinc}$` for the analogous code-name function (line 454). The convention is consistent but underdocumented; one quick "we'll write $\mathrm{db}N$ for the order-$N$ Daubechies wavelet" sentence would match the reference style.
- Subscript convention for analysis vs synthesis — wavelets puts the tilde on the *analysis* object (`$\tilde\phi$, $\tilde\psi$, $\tilde h$`, line 682+), then the §8 readout text uses unicode `ψ̃` and `h̃[n]` (lines 796, 803) instead of LaTeX. Cosmetic drift, low priority — but inside SVG `<text>` the `ψ̃` glyph composability is fragile across fonts; consider keeping LaTeX strings or precomposed glyphs.
- "MRA" abbreviation — wavelets defines `<em>multiresolution analysis</em> (MRA)` once at line 264 and then uses MRA freely (lines 266, 301, 682). harmonic-analysis-fourier and functional-analysis do not lean on bracket-acronyms in the same way (cf. "Carleson", "Plancherel", "Riesz" written out). Cosmetic, but reads slightly more textbook-y than the two references.

### Undefined jargon
- "QMF" appears at §3 line 358 — `"The QMF condition $|m_0(\xi)|^2 + ..."` — but the prose never expands "quadrature mirror filter" until §7 line 479 (where it appears in a rear-view "Until 1995 every wavelet construction was a Fourier-side affair: pick a quadrature mirror filter"). First-mention should expand the acronym in §3.
- "minimum-phase filter" at §3 line 358 — `"to extract a minimum-phase filter $h_n$"` — used once with no definition or callback. Reader is expected to know what "minimum-phase" rules out among spectral factorizations.
- "spectral-factor" at §3 line 358 — `"Daubechies's brilliant move: spectral-factor the polynomial $P(y)$"` — verb is used as if standard; not previously named. (Same sentence as previous bullet — §3 packs three undefined terms into one sentence.)
- "Bezout's identity" at §8 line 701 — `"the trigonometric polynomial $P(y)=...$ that solves Bezout's identity at the right order"`. Bezout-the-number-theory-fact and Bezout-the-polynomial-identity are different things; readers from the Analysis side won't necessarily know the polynomial version. Bullet at §7 line 499 also references "Bezout-like equations" with no definition.
- "FIR" at §7 line 499 — `"Daubechies–Sweldens proved every FIR wavelet filter pair factors into lifting steps"` — finite-impulse-response is signal-processing jargon, never expanded.
- "linear-phase" at §8 line 680 is *immediately* defined in the next clause ("it means the filter shifts every frequency by the same amount"), which is exemplary — flagging only because the §8 widget readout (line 749, 760, 800) drops the term repeatedly without that gloss attached.
- "Calderón–Zygmund operator" at §6 line 470 has parenthetical examples "(the Hilbert transform, the Riesz transforms, $-\Delta^{-1}$, ...)" but no definition of the *class*. The companion harmonic-analysis-fourier page does not host a definition either; consider a brief "(operators with kernels singular only on the diagonal, bounded on $L^2$)" gloss.
- "Besov balls" / "Besov spaces" at §6 line 454 and §9 line 823 — used twice with no callback; harmonic-analysis-fourier has no Besov section either, so a reader stuck on this term has nowhere to land. (Sobolev callback at §9 line 828 mentions Besov but doesn't define it.)
- "lazy wavelet" at §7 line 488 — `"Start with the <em>lazy wavelet</em> — the trivial split..."` — actually defined inline by the em-dash gloss. Good. Flag only as positive contrast with the §3 jargon dump.

### Tone mismatches
- §3 (Daubechies) has a single dense paragraph (line 358) that crams "QMF condition", "filter symbol", "spectral-factor", "minimum-phase filter", and "shortest possible support" into one breath. By the standard of harmonic-analysis-fourier §2 (which carefully sets up Fourier transform, then proves the four basic properties one by one with table) and functional-analysis §1 (definition → motivation → example pattern), this paragraph reads like a research-paper aside. Recommend: split into "the constraint" / "Daubechies' construction" sub-paragraphs with a sentence of motivation each.
- §7 line 479 — `"Until 1995 every wavelet construction was a Fourier-side affair"` — slight slangy edge ("affair") that doesn't quite match the conversational-but-precise voice of category-theory.html or the references. Mild; arguably charming.
- §6 line 446 — `"Wavelets are not just a theoretical curiosity. Three vignettes:"` — the framing "vignettes" is a touch glib for a graduate notebook; the reference pages prefer "applications" / "examples" with a slightly more reserved register. Cosmetic.
- §8 line 703 has a metaphor — `"exactly the way contravariant and covariant tensors split the work of an inner product into two compatible bases instead of one self-paired one"` — that drops a category-theory-flavored aside on a reader who came for signal processing. The two references use cross-domain analogies but always with a callback link. No callback to differential-geometry or any tensor page is provided. Recommend either a callback or trimming the analogy.

### Missing worked examples
- §3 (Daubechies) — has the cascade-approximation widget (`db-svg`), good coverage.
- §4 (DWT pyramid) — has `dwt-svg`, good coverage.
- §6 (Applications) — has the soft-threshold denoiser widget for the Donoho–Johnstone vignette, but the JPEG2000 (CDF 9/7) and Calderón–Zygmund vignettes have no widget or worked numerical example. The CZ vignette quotes the Beylkin–Coifman–Rokhlin decay rate as a formula with no number-instance; a small "$N=4$, $|j-j'|=2$ ⇒ entry decays as $\le 2^{-15}$" sanity check would match the reference style. The CDF 9/7 widget that *does* exist lives in §8, which is a different vignette — the reader of §6 has to scroll forward and back.
- §1 (MRA) — has the tower widget, good. Section text doesn't explicitly verify the MRA axioms on Haar; the verification gets folded into §2. A one-line "let's check: nesting holds because constants on coarser cells are constants on finer cells" would make §1 self-contained.

### KaTeX macros / formatting
- No new local macros are introduced — the loader macro list (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`, lines 23–28) is identical to harmonic-analysis-fourier and functional-analysis. Good.
- `\operatorname{supp}` (line 344), `\operatorname{sgn}` (line 454), `\operatorname{diag}` (line 492) all use the standard `\operatorname{...}` rather than redefining via macro — matches the reference convention.
- `$2^{-(N+1)|j-j'|}$` exponent at line 470 has nested primes/absolute values that render correctly but are eye-watering to scan; consider a `\cdot` or splitting the decay rate across two display lines for legibility.
- §8 widget readout (lines 802–804) builds a string with raw unicode `ψ̃` and `·`; same readout could use plain `\tilde\psi` if the readout path is wrapped in KaTeX rendering, but that's a separate refactor — flag only as cosmetic. The unicode also leaks into the `note` strings at lines 738, 749, 760 (`"h̃ = h"`).
- Helper-block at top of `<body>` (lines 187–235) is verbatim against the canonical 2D block from harmonic-analysis-fourier (lines 188–238) and category-theory.html — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all match.
- Widget chrome (`.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad`) is consistent throughout. No ad-hoc classes introduced. `.pill` at lines 391, 512 matches the convention used in harmonic-analysis-fourier.

## Severity
minor polish
