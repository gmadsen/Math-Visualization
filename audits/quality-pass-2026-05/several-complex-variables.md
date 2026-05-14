# several-complex-variables — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** complex-analysis, advanced-complex-analysis

## Summary
The page is well-pitched and tracks the conventions of `complex-analysis.html` and the SCV stub in `advanced-complex-analysis.html` closely (Hartogs widget is essentially the same SVG); the main issues are (a) a head-block double-injection of six scripts + two stylesheets, (b) one self-contradicting paragraph in §6 that breaks the confident voice, (c) a handful of late-introduced terms (Bochner–Martinelli, Lelong, worm domain, Oka principle, SYZ, Catlin) used before or without definition, and (d) §4 lacking any interactive computation while every other numbered section has one.

## Findings
### Notation drift
- Target uses bare `\mathrm{Spec}` (line 630) and `\mathrm{Pic}` (lines 761, 763) although the page's own KaTeX loader (lines 22–29) registers `\Spec` as `\operatorname{Spec}`. Sibling `complex-analysis.html` consistently picks `\operatorname{Res}` (line 737), `\mathrm{Aut}` (line 835), `\mathrm{Im}` (line 837) — i.e. it doesn't use the `\Spec` macro either, so this is internal drift inside the target rather than cross-page drift. Cosmetic.
- Target writes the disk as `\mathbb{D}^2` (line 279) and the polydisk as `\mathbb{D}^n` (line 600). `complex-analysis.html` uses `\mathbb{D}` consistently (lines 673, 678, 835). Consistent across the analysis section.
- Target switches between `\Omega\subset\mathbb{C}^n` (lines 275, 473, 575, …) and `\Omega\subseteq\mathbb{C}` (line 573). The `⊆` vs `⊂` mix matches `complex-analysis.html`'s own usage (e.g. line 374 `U\subseteq\mathbb{C}` vs line 437 `\mathbb{C}\setminus\{0\}`). Cosmetic.
- Target uses `\mathcal{O}` for the structure sheaf and `\mathcal{O}^\times` for its units — consistent with `advanced-complex-analysis.html` line 1083 `e^{-\phi}`. (Note: target uses `\varphi` for the Hörmander weight, line 473; advanced uses `\phi`, line 1083. Minor cosmetic drift between the two SCV passages.)
- Target writes `\widehat K_\Omega` (line 576) for the holomorphic hull. Not introduced anywhere else in the section, internally consistent.

### Undefined jargon
- "Bochner–Martinelli boundary measure" appears in the §1 widget readout (line 328: `Bochner–Martinelli boundary measure on ∂K scales ∼ r³`) without ever being defined or callback-linked on the page.
- "Lelong number" is dropped parenthetically in the PSH examples (line 370: `at zeros it picks up a positive current (Lelong number)`) without definition or link.
- "Bergman / Szegő kernels" cited in §4 (line 590: `the Bergman / Szegő kernels admit explicit asymptotic expansions`) — Bergman has a defined section in `advanced-complex-analysis.html#bergman` but the target offers no callback, and Szegő is unmentioned elsewhere in the corpus.
- "Worm domain" used twice (lines 594, 601) and even appears in the §4 table as an example, but is only described as "Diederich–Fornæss's original counterexample" — readers who don't know it are left with no picture of *what* a worm domain is geometrically.
- `\bar\partial`-Neumann problem is named in §3 (line 553), §4 (line 590) and §7 (line 839) but never defined inside the page; a callback to `advanced-complex-analysis.html#scv` (which sketches it) would close the loop and is missing.
- "Oka principle" appears in §6 (line 824) and §7 (line 839) without a one-line statement.
- "Stein factorization", "SYZ fibrations", "Catlin's subelliptic estimates" all appear in the Connections paragraph (line 839) as bare names. Consistent with the corpus's "Connections gestures outward" pattern, but heavier than the equivalent paragraph in `advanced-complex-analysis.html` line 1180 which at least gestures at what each thing does.
- "Cartan–Thullen" is the attribution for the holomorphic-convexity equivalence in §4 (line 575) — minor; the theorem named after them isn't stated, just credited.

### Tone mismatches
- High-priority: §6 line 819 contradicts itself in the middle of a sentence:
  `Take Ω = ℂ²\{(0,0)} — not Stein, since one can show H¹(Ω,𝒪) ≠ 0 in dimension 2 (actually the punctured ℂ² is Stein for n ≥ 2 by Hartogs, but the Hopf bundle on ℂ²\{0} as a model survives transfer).`
  This reads as the author starting an example, realising it's wrong, and patching with a parenthetical instead of rewriting. Confident voice breaks here. Semantic — a reader will be confused about whether `ℂ²\{0}` is or isn't Stein. (It is Stein, by Hartogs, contrary to the lead clause.)
- Medium-priority: §7 Connections is one 200-word paragraph wall (line 839) followed by a bulleted list. Compare to `complex-analysis.html` which has no Connections section, and `advanced-complex-analysis.html` line 1180 which is similarly long but breaks slightly more. Acceptable but on the dense side.
- Low-priority: the §1 prose is conversational and matches `category-theory.html` voice well ("Pass to ℂⁿ with n ≥ 2 and the third case empties out. *There are no isolated singularities at all.*"). Tone is good through §1–§5; only §6's worm passage and the bare-noun-soup of §7 stick out.

### Missing worked examples
- §4 (Domains of holomorphy and Levi pseudoconvexity) has no widget and no concrete computation — only definitions, a table, and prose. Every other numbered section (§1 Hartogs figure, §2 Levi form explorer, §3 Hörmander cost, §5 Cartan B walk-through, §6 Cousin obstruction) carries an interactive. A small "compute the Levi form on the ball, polydisk, and worm" calculator, or even a static side-by-side eigenvalue table, would close the gap. (The §2 Levi widget is upstream of §4 but doesn't substitute — §4 is where pseudoconvex / strictly pseudoconvex / non-pseudoconvex get classified and a witness widget would land hardest there.)
- §6's widget uses `f₁/f₂ = z^d` on `ℂℙ¹×ℂ*` per the title, but the actual SVG draws two abstract ellipses with no projective-line / annulus geometry — it's a topology-of-the-cocycle picture, not a divisor picture. The widget title (`Cousin obstructions on ℂℙ¹×ℂ*`) over-promises relative to what it shows.

### KaTeX macros / formatting
- No new macros are defined locally; target relies on the standard six (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) that match `complex-analysis.html` and `advanced-complex-analysis.html` byte-for-byte.
- Delimiters used are the canonical `$…$` and `$$…$$`. No invented delimiters.
- §1 widget readout (line 328) and others mix unicode glyphs (`r⁴`, `≈`, `−`, `∼`, `ℂ²`) into text-content strings. This matches `advanced-complex-analysis.html#scv` widget (line 1157), so it's house-style for in-readout text — fine.
- §6 widget readout (line 803) uses curly-quote glyphs (`'zero'`, `'infinity'`) inside the SVG header text — the apostrophes are typographic singles (`‘’`), consistent with the rest of the corpus.

## Helper-block / widget-chrome hygiene
- Top-of-`<body>` 2D helper script (lines 195–247) is the verbatim `category-theory.html` version (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`). `complex-analysis.html` ships a slightly extended variant with an `if(label!=null)` guard in `drawNode` and a `C` complex-arithmetic helper appended (lines 232–257), but the target doesn't need those and the canonical category-theory copy is appropriate.
- High-priority hygiene bug: the `<head>` block double-loads six scripts and two stylesheets. Lines 165–172 (`breadcrumb.js`, `glossary-popover.js`, `theme-toggle.js`, `concepts/bundle.js`, `topic-hotkeys.js`, `topic-lineage.js`, plus `print.css` and `theme-light.css`) are unfenced, then lines 173–183 reload exactly the same eight resources inside the `<!-- breadcrumb-head-auto-begin -->` … `<!-- breadcrumb-head-auto-end -->` fence. Either the manual copy at 165–172 should be deleted or the auto-injector ran twice in a row before the unfenced version was removed. `complex-analysis.html` has only the fenced copy (lines 10–20). Worth flagging — duplicate `concepts/bundle.js` is the most expensive of the eight.
- Widget chrome is correct everywhere: `.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.note`, `.ok` all used as documented. No ad-hoc widget classes.
- Color tokens: SVG fill/stroke attrs use `var(--bg)`, `var(--cyan)`, `var(--pink)`, `var(--mute)`, `var(--ink)`, `var(--yellow)`, `var(--violet)`, `var(--green)` — no hex literals leaked into widget code. Clean.
- `<svg>` elements all carry `viewBox` and a `<title>` child for a11y. Clean.

## Severity
minor polish (the head-block duplicate and the §6 self-contradicting paragraph are the two real items; everything else is touch-up)
