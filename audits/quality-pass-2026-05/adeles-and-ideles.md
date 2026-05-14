# adeles-and-ideles — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** p-adic-numbers, class-field-theory

## Summary
Solid page that hews closely to section conventions on macros, widget chrome, and helper blocks; notation drift is minor and the only material weakness is a cluster of undefined jargon in section 5 (Tate's thesis sketch).

## Findings
### Notation drift
- Frobenius spelling: class-field-theory uses `\operatorname{Frob}` 6× and `\mathrm{Frob}` once; this page does not invoke Frobenius (the Artin map is mentioned only as a `Gal(...)` target), so no actual collision — but if a future revision does name Frobenius elements, prefer `\operatorname{Frob}` to match the CFT page. (Cosmetic.)
- `\Gal` vs `\operatorname{Gal}`: this page uses the macro `\Gal` 3× (e.g. §3 Artin map note, line 555: `\Gal(\mathbb{Q}^{\mathrm{ab}}/\mathbb{Q})`), which matches the macro defined in the local KaTeX header and matches both refs (p-adic-numbers and class-field-theory both define and use `\Gal`). Consistent — no action.
- `\mathbb{Z}` vs `\Z`: page is uniform on `\mathbb{Z}` / `\mathbb{Z}_p` / `\hat{\mathbb{Z}}`; matches both refs. No drift.
- `\mathbf{1}_{\mathbb{Z}_p}` for the indicator function (§5, line 743) vs the more common `\chi_{\mathbb{Z}_p}` or `\mathbb{1}_{\mathbb{Z}_p}`. Refs do not use indicator notation, so no drift to flag — but pin the page-internal convention if a second indicator gets added later. (Cosmetic.)
- `\hat{\mathbb{Z}}` (this page) vs `\widehat{\mathbb{Z}}` (class-field-theory §5, line 907). Both pages render fine and agree on meaning, but the visual spacing differs. Recommend `\widehat{\mathbb{Z}}` (CFT spelling) for the wider hat over `\mathbb{Z}` — small cosmetic drift, semantic match.

### Undefined jargon
- **Section 5, line 740:** "reproves the analytic continuation and functional equation of all **Hecke $L$-functions**" — "Hecke $L$-function" is used cold as a motivator before any definition or callback. The term recurs at line 761 ("any Hecke $L$-function $L(s, \chi)$ by inserting a Hecke character $\chi$") with `Hecke character` also undefined. Neither is in the §3 callback list nor wired via a `<aside class="callback">` to dirichlet-series-euler-products or modular-forms. By contrast p-adic-numbers's §11 "Why care" labels every advanced term with a forward link. Recommend either (a) inline-define "a Hecke character is a continuous character of $C_\mathbb{Q}$" before §5 uses it, or (b) add a `See also` callback to dirichlet-series-euler-products / L-functions before the first occurrence.
- **Section 5, line 743:** "Choose a **Schwartz–Bruhat function** $f = f_\infty \otimes \bigotimes_p f_p$" — first-use bold-tagged but never defined; the example that follows (Gaussian × indicator) implicitly conveys the idea but a reader who hasn't met the term cannot tell what general object the example specialises. Recommend a one-line gloss: "a function on $\mathbb{A}_\mathbb{Q}$ that is Schwartz at $\infty$ and locally constant of compact support at every $p$".
- **Section 5, line 745:** "**Haar measure**" is used cold inside the integral definition. p-adic-numbers and class-field-theory don't introduce it either, so there's no callback target inside the section yet — but a one-clause gloss ("the translation-invariant measure on the locally compact group $\mathbb{A}_\mathbb{Q}^\times$") would lower the cliff.
- **Section 5, line 764 (note):** "Hecke **Grössencharacters**" appears once in a forward-looking note; readable as flavor text but nominally undefined. Acceptable to leave as forward-only mention if "Hecke character" earlier is gloss-defined.
- **Section 3, line 549:** "totally-disconnected" used in passing — fine for an intermediate-level page, but worth noting that p-adic-numbers introduces "totally disconnected" only after the ultrametric section justifies it. Minor.

### Tone mismatches
- The hero (`<p class="sub">`) is on-tone — single sentence motivating the construction, matches CFT and p-adic-numbers's openers.
- §1–§4 maintain the conversational-but-precise voice (e.g. §2 "The naïve product … is too large: it is *not* locally compact. The fix is …" — exactly the kind of motivation-then-fix beat used in p-adic-numbers §1 "On the rationals … we are used to one measure of size … But a prime $p$ secretly supplies another one.").
- §5 (Tate's thesis) drifts noticeably toward dry textbook voice: three back-to-back display equations (lines 750–753) with terse connector prose ("Each local integral is easy to compute: …", "Therefore …"). For a "sketch" section this is acceptable, but the contrast with §1–§4 is sharp; a single sentence between the local Gamma factor and the local Euler factor would soften it (e.g. "and at each finite place the integral collapses to a geometric series").
- §5 closing note (line 764, "Why is this better than Riemann's original proof?") is excellent — the kind of meta-commentary that p-adic-numbers's §11 does well — but it sits under a `<div class="note">` rather than being the opening hook of §5. Consider promoting it.

### Missing worked examples
- **§3 idèle class group:** has the idèlic norm calculator (computes $\prod_v |q|_v$), which is the natural toy. ok.
- **§5 Tate's thesis:** has the Local Euler factor visualizer (slider over $\sigma$). The widget computes $\pi^{-\sigma/2}\Gamma(\sigma/2) \prod (1-p^{-\sigma})^{-1}$ but **does not visualize the functional equation** — the headline result of the section. A version that toggles between $\sigma$ and $1-\sigma$ and shows $\xi(\sigma) = \xi(1-\sigma)$ numerically would close this gap. Currently a reader leaves §5 with a working Euler-product picture but no concrete encounter with the functional equation that the section frames as Tate's payoff. Lower-priority but the most impactful single addition.
- **Coda (`#coda`):** intentionally short, no widget, no quiz placeholder. Marked with `·` rather than a number in the TOC, signalling its non-section status — consistent with how class-field-theory §9 is also a wrap-up and CFT does have a widget there. Not a defect, but if a small "places of $K$ counter" widget for a number field $K = \mathbb{Q}(\sqrt{d})$ existed, it would round out the generalization.

### KaTeX macros / formatting
- Macro set (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) is a verbatim copy of the standard number-theory macro block (matches p-adic-numbers exactly). No locally-invented macros. ok.
- Delimiters: `$…$`, `$$…$$`, `\(…\)`, `\[…\]` configured in the loader — matches AGENTS.md house convention. ok.
- One stylistic note: §3 (line 555) writes `\twoheadrightarrow\; \Gal(\mathbb{Q}^{\mathrm{ab}}/\mathbb{Q})` — matches CFT line 904 (`\twoheadrightarrow\; \Gal(K^{\mathrm{ab}}/K)`). Consistent.
- Helper block at top of `<body>` (lines 188–239) is a verbatim copy of the standard 2D helper (`$, $$, SVG, ensureArrow, drawArrow, drawNode`) — spot-checked against p-adic-numbers lines 191–238 and matches except for `pad1` defaults (this page uses `0`, p-adic uses `14`); same source as category-theory.html. ok.
- Widget chrome: every widget uses `<div class="widget"> / <div class="hd"> / <div class="ttl"> / <div class="hint">` plus `.readout / .row / .note / .ok`. No ad-hoc classes. ok.
- All five `<svg>` elements have `viewBox` and a `<title>` child for a11y. ok.
- KaTeX in `<select>` options: page does not use LaTeX inside `<option>` labels (CRT widget §4 uses plain digit options, Tate widget §5 uses a `<input type="range">`), so the `js/katex-select.js` loader is harmless overhead but not load-bearing. No action.

## Severity
minor polish
