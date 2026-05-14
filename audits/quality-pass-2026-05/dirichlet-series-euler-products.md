# dirichlet-series-euler-products — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** analytic-continuation, L-functions

## Summary
A strong, well-paced page that closely matches the section's voice and notation; the most material defects are a section-numbering bug in the final `<h2>` and an in-page collision of the `\Lambda` symbol between the completed zeta and the von Mangoldt function. Everything else is minor polish.

## Findings
### Notation drift
- **Semantic collision (high priority):** `\Lambda` is used for the *completed zeta function* in §5–§6 (`$\Lambda(s) = \pi^{-s/2}\Gamma(s/2)\zeta(s)$`, `$\Lambda(s,\chi)=W(\chi)\Lambda(1-s,\overline{\chi})$`) and then re-used silently for the *von Mangoldt arithmetic function* in §7 (`$D(s)=\zeta'(s)/\zeta(s)=-\sum \Lambda(n) n^{-s}$`, `$\sum_{n<x}\Lambda(n)\sim x$`). Two different objects, same symbol, no warning. Recommend either renaming the §7 occurrence to `\Lambda_{\!vM}(n)` / a sentence acknowledging the overload, or note the collision inline.
- **Cross-page collision (lower priority):** target's "completed zeta" is `$\Lambda(s)=\pi^{-s/2}\Gamma(s/2)\zeta(s)$` (has poles at $s=0,1$); `analytic-continuation.html#zeta` calls *its* entire completion `$\xi(s):=\frac12 s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)$`. Both pages use the same name `$\Lambda$ / $\xi$` for "completed zeta" but the symbols denote different (pole-removed vs. not) functions. `L-functions.html` matches the target convention `$\Lambda$`. Worth one sentence in §5 calling out that the entire-function variant is sometimes denoted `$\xi$` (which the cross-page link to analytic-continuation will surface).
- **`\mathrm{Re}\,s` typography:** target consistently uses `\mathrm{Re}\,s` with the thin space (matches `L-functions.html`); `analytic-continuation.html` writes `\mathrm{Re}s` without the space. Target is on the better side of the cosmetic drift — flag for the analytic-continuation page, not this one.
- `\mathcal{M}[f](s)` for Mellin (target §6) is introduced inline before use and is fine, but neither reference ever names the operator: both write the integral. Cosmetic-only — keeping the `\mathcal{M}` notation is reasonable since §6 then re-uses it.

### Undefined jargon
- "Hecke eigenform" appears in §9 as a forward-pointer ("When $f$ is a Hecke eigenform, $L(f,s)$ has an Euler product"). Not defined; acceptable because §9 is the explicit "what comes next" coda and the surrounding sentence frames it as a preview.
- "von Mangoldt $\Lambda(n)$" in §7 is used without naming it as the von Mangoldt function or pointing the reader anywhere; combined with the symbol collision above, a reader unfamiliar with `$\Lambda(n)$` will think this is the same object as §5's completed zeta.
- "Chebyshev's bias" in the §8 widget caption ("Chebyshev's bias: $\pi(x;4,3)$ tends to *slightly* lead $\pi(x;4,1)$ for small $x$") — name dropped without explanation. One short clause ("a systematic bias toward non-residues") would close the loop.
- "abscissa of conditional convergence $\sigma_c$" mentioned once in §1 ("Conditional convergence has its own abscissa $\sigma_c \le \sigma_a$, and $\sigma_a-\sigma_c\le 1$") and never used again. Either expand briefly or drop, since the rest of the page lives in the absolute-convergence regime.

### Tone mismatches
- _None._ Voice matches `analytic-continuation.html` and `L-functions.html` throughout: conversational ("Here is the miracle.", "That is the entire proof.", "private universe"), with worked computations interleaved. No textbook-wall passages, no over-casual passages.

### Missing worked examples
- §9 "What comes next" has no widget — but this matches the peer pattern (`analytic-continuation.html#coda` and `L-functions.html#special-values` are similarly widget-free coda sections). Not a defect.
- All other numbered sections (1–8) ship at least one widget; §3, §4, §8 ship two widgets each. Coverage is in line with the peers.

### KaTeX macros / formatting
- **Section-numbering bug (high priority):** the final `<h2>` reads `<h2>7. What comes next</h2>` (target line 1346) but the TOC at the top of the file lists it as "9 What comes next." It also collides with the existing `<h2>7. Perron's formula …</h2>` (line 1074). The hero/TOC numbering and the in-section heading disagree.
- No locally-defined KaTeX macros beyond the page's standard head block (`\Spec, \Gal, \Hom, \tr, \ad, \ind`), none of which this page actually invokes — same head block as both references, fine.
- `<a href="#zeta">2&nbsp;The&nbsp;prototype:&nbsp;Riemann's&nbsp;$\zeta(s)$</a>` in the TOC has `$…$` inside an anchor tag; KaTeX auto-render handles it the same way both reference pages do, so this is a house pattern not a drift.
- Helper `<script>` block at top of `<body>` (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is verbatim against `category-theory.html` / `L-functions.html`. No drift.
- Widget chrome uses `.widget / .hd / .ttl / .hint / .row / .readout / .small / .note / .ok / .bad` exclusively — no ad-hoc classes.
- Color tokens used throughout SVG fills (`var(--yellow)`, `var(--green)`, `var(--cyan)`, `var(--pink)`, `var(--violet)`); a handful of literal `rgba(...)` fills in §1 (`rgba(131,193,103,0.18)` etc.) are translucent overlays of the standard palette — same pattern as `analytic-continuation.html`'s `var(--blue)` / `var(--yellow)` rect fills with `fill-opacity` attributes, but using `rgba()` directly is a minor color-token drift. `node scripts/color-vars.mjs` would be the deciding voice.

## Severity
minor polish (with the §9 heading number and the §7 von-Mangoldt `\Lambda` collision being the two genuinely actionable items).
