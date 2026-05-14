# quadratic-forms-genus-theory — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** quadratic-reciprocity, algebraic-number-theory

## Summary
The page is structurally healthy and notationally consistent with both Number-theory peers (`\mathbb{Z}`, `\mathrm{Cl}`, `\Gal`, `\mathcal{O}_K`, `\mathfrak{p}/\mathfrak{a}` all match). Section 5 leans on heavyweight class-field-theory vocabulary (Frobenius, Artin isomorphism, Hilbert class field, fractional ideal) faster than the references do, and a handful of terms ("fundamental discriminant", "prime discriminant divisors") are used before they are defined.

## Findings
### Notation drift
- _None significant._ `\mathrm{Cl}(D)` matches `\mathrm{Cl}(\mathcal{O}_K)` in algebraic-number-theory.html:530; `\Gal(H/K)` matches the `\Gal` macro defined in the same KaTeX header across all three files; `\mathbb{Z}, \mathbb{Q}, \mathcal{O}_K, \mathfrak{p}, \mathfrak{a}` are uniform.
- Cosmetic only: target uses `\xrightarrow{\;\sim\;}` at line 759 for the `\mathrm{Cl}(D) \to \mathrm{Cl}(K)` isomorphism; algebraic-number-theory.html prefers prose ("canonical isomorphism") and bare `=` / `:=`. Not a drift, just a stylistic divergence — leave as-is.

### Undefined jargon
- High priority. "fundamental discriminant" first appears at line 470 ("a chosen fundamental discriminant $D < 0$") and again at line 754, but the page never defines the term. Reference `algebraic-number-theory.html` defines `\Delta_K` carefully (line 285ff) but does not use this exact phrase either; a one-line gloss ("a discriminant of an imaginary quadratic field that is not a non-trivial square multiple of another such discriminant") would close the gap.
- High priority. Line 640: "$t$ is the number of *prime discriminant* divisors of $D$ (odd primes $p \mid D$ plus corrections for the factor of $4$ or $8$ at $2$)." The "corrections" hand-wave is exactly the spot the reader would want pinned down, and "prime discriminant" is not defined elsewhere.
- Medium. Section 5 line 776 introduces "Frobenius in $\Gal(H/K)$" with no in-page definition and no callback; reference `algebraic-number-theory.html:1335` defines `\mathrm{Frob}_\mathfrak{p}` explicitly and quadratic-reciprocity.html:1010 also unpacks it. Either add a one-sentence parenthetical or extend the existing callback to also point at `algebraic-number-theory.html#outro` / `frobenius-and-reciprocity.html`.
- Medium. Section 5 line 842 says "Artin isomorphism (restricted to $K$)" with zero context. A reader at this depth should at least see a callback to `class-field-theory.html` for the term.
- Low. "fractional ideal" at line 846 is used without definition; the existing callback to `algebraic-number-theory.html#ramification` covers ideal factorization but not the fractional-ideal language — point also at `#dedekind` (which contains the definition at line 528).

### Tone mismatches
- Section 4 reads slightly drier and more textbook than Sections 1–2 of the same page or §5–6 of `quadratic-reciprocity.html`. Lines 638–642 deliver three formal homomorphisms in two paragraphs with no "let us peek at $D=-15$ first" framing, even though the genus-partition widget (which would supply that intuition) is parked *below* the callback asides at line 667 — out of the natural reading flow. Reorder so the widget sits between the prose and the callback, mirroring §1 / §2 / §3.
- Section 5 has the densest "formula-then-formula" wall on the page (lines 754–761): three displayed equations and four heavyweight terms before the worked example arrives at line 773. The reference `quadratic-reciprocity.html` §6 (the reciprocity-law section) is similarly dense but breaks it up with an ad-hoc widget; here we wait until "Primes represented by the principal form" for the first concrete poke.

### Missing worked examples
- Section 3 (form class group) relies entirely on the $D = -23$ visualizer for $\mathbb{Z}/3\mathbb{Z}$. A second small example showing a non-cyclic class group (e.g. $D=-20$ has $\mathrm{Cl}\cong\mathbb{Z}/2\mathbb{Z}$, $D=-84$ is $(\mathbb{Z}/2)^2$) — even just a sentence — would calibrate the reader's intuition that "$\mathrm{Cl}(D)$ is abelian" includes products of cyclic groups, not just $\mathbb{Z}/n\mathbb{Z}$.
- Section 4 (genus theory) defines $\Phi$ abstractly but never works the smallest case ($D=-15$, $h=2$, $t=2$, two genera each with one form) in prose. The widget computes it, but there is no narrated "for $D=-15$, $|D|=3\cdot 5$, so $t=2$ and we expect $2^{t-1}=2$ genera; here they are." A 3-line worked computation before the widget would mirror §3's "$D=-23$ has three reduced forms" setup.

### KaTeX macros / formatting
- No new local macros are introduced — target uses only the standard six `\Spec, \Gal, \Hom, \tr, \ad, \ind` that are shared with both reference files. Good.
- Delimiter usage is clean: `$…$`, `$$…$$` only; no `\(…\)` or `\[…\]` reinventions.
- Two ad-hoc CSS classes in `<style>` use raw hex backgrounds rather than palette tokens: `.genus-0 { background:#1a2030 }`, `.genus-1 { background:#2a1830 }`, `.genus-2 { background:#1a2818 }`, `.genus-3 { background:#2a1818 }` (lines 158–161). These mirror the pattern of `.chip.qr` / `.chip.neg` in quadratic-reciprocity.html (lines 130–132), which uses the same hex-tinted-background-plus-token-border idiom — so this is consistent with section style, not a real violation. Leave as-is unless `color-vars.mjs` flags them.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.note`, `.ok`) all match the canonical category-theory.html template. No ad-hoc widget classes; `.form-chip` and `.genus-chip` are content chips, not chrome.

## Severity
minor polish
