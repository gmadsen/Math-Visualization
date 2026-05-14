# crystalline-cohomology — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** etale-cohomology, algebraic-de-rham-cohomology

## Summary
A strong, voice-consistent page that lands the $\ell=p$ motivation cleanly and ships seven worked widgets — pedagogically on par with its peers. A handful of mid-priority drifts: bare-`dR` subscript while the rest of the page goes to `\mathrm{cris}`; "Tannakian" and "Hodge polygon" used before they're defined; §6 leans into Fontaine-machinery prose with thinner narration than §1–§5; and §7 (Connections) is the only numbered section without a worked example or quiz placeholder.

## Findings

### Notation drift
- Subscripts on the same kind of cohomology aren't uniform within the page: `H^*_{dR}(X/W)` appears in prose at §1 (line 270, line 332) but the parallel crystalline subscript is `\mathrm{cris}` (e.g. line 272: `H^*_{\mathrm{cris}}(X_0/W)`). algebraic-de-rham-cohomology.html uses bare `H^n_{dR}` throughout, so the inconsistency is internal to crystalline-cohomology — pick one (`\mathrm{dR}` and `\mathrm{cris}`, both upright) for the page. Low-medium priority — the rendered output is legible but visually mismatched.
- `H^i_{\text{ét}}` (line 266, line 318, line 813) versus `H^i_{\mathrm{cris}}` — the former uses `\text{ét}` and the latter `\mathrm{cris}`. etale-cohomology.html uses `\text{ét}` (14 occurrences), so `\text{ét}` is the corpus convention; pairing it with `\mathrm{cris}` is fine but worth a passing comment that the inconsistency is intentional.
- Frobenius operator name: etale-cohomology.html writes `\operatorname{Frob}_q` (line 690) and `F_q` (line 477); crystalline-cohomology.html writes `\mathrm{Frob}_q` once (line 584) and otherwise `\varphi`. Cosmetic — `\operatorname{Frob}` is the catalog macro, prefer it for the one Frob occurrence in §4 to match etale-cohomology's display formula.
- Period rings appear as `B_{\mathrm{cris}}, B_{\mathrm{dR}}, B_{\mathrm{HT}}, B_{\mathrm{st}}` in math contexts (lines 759, 766–772, 830) but as `B_HT, B_cris, B_dR` in the §6 Fontaine-functors widget readout (lines 803–805). Readout text is ASCII-only by widget convention so this is acceptable, but the data dictionary `D_HT(V) = (V ⊗_{ℚ_p} B_HT)^{G_K}` could move to KaTeX-rendered display via `\$` interpolation as etale-cohomology's readouts sometimes do.
- `\Spec` is used (page-local macro from the KaTeX header, e.g. line 511, line 431) but `Spf` (formal spectrum) appears only in plain SVG text (lines 468, 472) — not a math-mode macro. Either widen the header macro list with `\Spf` or live with the inconsistency. Low priority.

### Undefined jargon
- **"Tannakian"** appears at §5 line 658 — `The category $\mathrm{F\text{-}Isoc}(k)$ is $\mathbb{Q}_p$-linear Tannakian` — without definition, gloss, or callback. Reappears in §7 line 840 (`the full Tannakian picture (a single motivic Galois group …)`). Neither etale-cohomology nor algebraic-de-rham-cohomology introduces the term. Add a one-line gloss ("a $\otimes$-category equivalent to representations of an affine group scheme") or strip it.
- **"Hodge polygon"** is named at §5 line 664 (`There is also a Hodge polygon, built from the Hodge numbers …`) and referenced again at line 666 in Mazur's inequality — but the definition ("in degree $i$, the slope $p$ has multiplicity $h^{p,i-p}$") is condensed into a single dependent clause inside the same paragraph that introduces it. Worked-widget §5 visualizes it but the legend ("Hodge polygon", line 729) doesn't expand. A brief stand-alone sentence ("the Hodge polygon of $H^i$ has segment of slope $p$ and length $h^{p,i-p}$") would carry the definition.
- **"Frobenius-kernel pathology"** is used three times (line 266, line 268, line 318) before the reader sees what it is. The §1 prose explains the symptom ("$H^1_{\text{ét}}(\mathbb{A}^1_k,\mathbb{Z}/p)$ is already infinite-dimensional") but never names the underlying object (the kernel of $F\colon \mathbb{G}_a \to \mathbb{G}_a$). Could be a one-line aside.
- **"good reduction"** appears at §6 line 777 (`$X/K$ smooth proper with good reduction $X_0/k$`) and again line 813 — no callback to elliptic-curves or singular-cubics-reduction where the term lives. Add a `<aside class="callback">` link.
- **"Selmer-side companions"** at §7 line 836 — likely fine for a §7 capstone-tone closing, but readers landing on the page from a §6 deep-link won't have any anchor for the term.

### Tone mismatches
- §6 (`Period rings $B_{\mathrm{cris}}, B_{\mathrm{dR}}$ and Fontaine's comparison`) drifts toward dense-textbook voice for two consecutive paragraphs (lines 761–775). The chain `$\mathbb{Q}_p \subset B_{\mathrm{HT}} \subset B_{\mathrm{cris}} \subset B_{\mathrm{dR}}$` is presented as a fait accompli. By contrast etale-cohomology §4 narrates the Weil-conjectures package as W1/W2/W3 with green-callout breaks and a worked widget interleaved. The Fontaine widget at line 783 is welcome but it lands after the dense block, not interleaved.
- "puissances divisées" (line 354) is a delightful etymology aside in the conversational style; "Tannakian" two sections later is unsignalled — these set different tonal registers within the same page.
- §7 (`Connections`) is the only numbered `<h2>` that opens with a one-paragraph survey then becomes a bulleted link list. etale-cohomology has no Connections section (terminates at §5 Comparison theorems), and algebraic-de-rham §7 (Connections) is also a bulleted list — so this matches algebraic-de-rham, but neither matches category-theory.html's pattern of "every numbered section ends with a worked widget". Low priority — it's the closing roundup section by convention.

### Missing worked examples
- **§7 "Connections"** has no widget and no quiz placeholder. The other six sections each have at least one widget (some have two: §1 has the Weil-zoo selector, §2 has both the PD-valuation bar chart and the static thickening schematic). algebraic-de-rham-cohomology §7 is similarly bare, so this is a section-9-house pattern, not a unique miss — flagging for awareness only.
- §6 has the Fontaine-functors selector widget but no quiz placeholder appears until line 824 *after* the callback aside. The order is `<aside class="callback">` then `<div class="quiz">`, whereas every other section on the page puts the quiz immediately before the callback. Cosmetic, but noticed because it breaks the pattern set by §1–§5.

### KaTeX macros / formatting
- The page declares the standard six-macro pack (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) in the KaTeX `macros` block, identical to category-theory.html and the references — no rogue page-local macros introduced. Good.
- `\mathrm{F\text{-}Isoc}(k)` at line 658 is a one-off compound — works, but `\operatorname{F\text{-}Isoc}` would render with proper function-name spacing if this category name shows up again on a future page.
- `\mathrm{Frac}\,W` (line 658, line 321) is fine; matches `\mathrm{Frac}` usage elsewhere in the corpus.
- Display formula at line 766 packs four inclusions onto one line inside an `<div class="ok">` block. Reads correctly, but on narrow viewports it competes for horizontal room with the green border. Optional: switch to `$$ \mathbb{Q}_p \subset B_{\mathrm{HT}} \subset B_{\mathrm{cris}} \subset B_{\mathrm{dR}} $$` outside the callout.
- Helper `<script>` block at top of `<body>` (lines 187–239) is a verbatim match against category-theory.html — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all present and identical. No drift.
- Widget chrome (`<div class="widget">`, `.hd`, `.ttl`, `.hint`, `.readout`, `.row`) is consistent across all seven widgets — no ad-hoc classes.
- All seven widget SVGs include `<title>` elements (good for a11y) and `viewBox` attributes. No `viewBox` audit findings expected.

## Severity
minor polish
