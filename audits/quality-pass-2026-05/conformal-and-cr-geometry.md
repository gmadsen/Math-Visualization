# conformal-and-cr-geometry — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** several-complex-variables, complex-analysis

## Summary
A strong, pedagogically dense page that mostly hits the canonical voice; main issues are one wrong cross-reference (`§6` should be `§2`), a couple of widget-readout escapes that leak raw `$…$` source, and a handful of late-defined abbreviations (LCF, Q, Schouten/Webster torsion). Notation is consistent with the SCV / complex-analysis siblings.

## Findings
### Notation drift
- `\mathbb{C}^{n+1}`, `\mathbb{R}`, `\mathbb{H}^n`, `\mathrm{Im}`, `\mathrm{grad}`, `\mathrm{Ric}` all match the conventions used in `several-complex-variables.html` (e.g. `\mathbb{C}^n`, `\mathrm{Spec}`, `\partial\bar\partial`) and `complex-analysis.html` (`\hat{\mathbb{C}}`). No `\Z` vs `\mathbb{Z}` style drift.
- Levi form notation is `\mathcal{L}_\theta(X,\bar Y)` here vs `\partial\bar\partial\rho|_p` (matrix) on SCV §2/§4. Both pages explicitly identify the two as the same object on a real hypersurface (target line 855), so this is intentional cross-page bridging, not drift.
- The macro block at the top (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) is byte-identical to SCV/CA — none of these macros are actually exercised in the page body, but the boilerplate matches.

### Undefined jargon
- Cosmetic / ordering: "non-LCF" appears in the Yamabe-scrubber widget caption (line 547, "Step 3 — Aubin's test functions (n ≥ 6, non-LCF)") and in the readout for Step 4 (line 553, "or LCF ⇒") **before** the abbreviation is expanded in the body bullet at line 604 ("locally conformally flat"). A reader who scrolls the widget before reading the prose hits an undefined acronym.
- Semantic name-drops (acceptable but worth noting): "Schouten tensor" (line 635), "Tanaka-Webster torsion" (line 948), and "Fefferman–Graham ambient construction" (line 1028) are each glossed in a single phrase but have no anchor or callback. Comparable to SCV's "Bochner–Martinelli" / "Diederich–Fornæss" name-drops, so consistent with the section's voice — flag only if a follow-up hardening pass is planned.
- "$Q$" in §3 widget Step 4 ("the conformal Green's function" + "$G_p^{4/(n-2)} g$") and the term "homogeneous dimension" in §7 — `Q = 2n+2` is defined inline at line 971, but in the dictionary widget row (line 990) "homogeneous dim. $Q=2n+2$" appears in the readout above the prose definition for users who jump directly to §7. Minor.

### Tone mismatches
- `<p class="sub">` opener "Riemannian geometry, but you only get to keep angles." matches the conversational-but-precise hero voice of SCV ("isolated singularities are forbidden, the Riemann mapping theorem fails…") and CA's Needham flavor.
- §7 closing `<div class="ok">` "The bigger picture" runs ~150 words and packs in parabolic-geometry, Cartan, $G/P$, Fefferman-Graham, ambient Kähler, and AdS/CFT in one paragraph. This is a slogan-box that effectively becomes a mini-essay; SCV's `class="ok"` slogan boxes are 1–2 sentences ("Convexity in $\log$-coordinates of a Reinhardt domain $\Leftrightarrow$ no Hartogs extension."). Consider trimming or moving the meta-discussion into the Connections section.
- §7 GJMS-button widget labels `k=1`, `k=2`, `k=3`, `k=k` — the last button reads as a tautology; the "general k" intent is opaque. CA / SCV use descriptive control labels (`r`, `eccentricity e`, `tilt parameter a`).

### Missing worked examples
- Every numbered §1–§7 carries an interactive widget (conformal stretch, weight calibration, Yamabe scrubber, GJMS family stepper, Heisenberg multiplication, Levi-eigenvalue ellipsoid, Riemannian↔CR dictionary). No section is pure-definition.
- §4 (Q-curvature) is the lightest on **computation** — the GJMS widget visualises weights but does not actually evaluate $\int Q\,dV$ or $\chi(M)$ on a concrete 4-manifold (e.g. $S^4$, $\mathbb{CP}^2$). The Chern–Gauss–Bonnet identity at line 718 is stated but not exercised. Optional polish, not a gap.

### KaTeX macros / formatting
- No locally-introduced macros beyond the shared header — clean.
- Mixed display delimiters: page uses `$$…$$` consistently (matches SCV/CA). One `\(…\)` / `\[…\]` is not used.
- **Widget readout escape (semantic)**: in the Riemannian↔CR dictionary script (line 1019), `out.textContent = '${rows[active].l}  ⟷  ${rows[active].r}\n\n${rows[active].m.replace(...)}'` writes the `.l` and `.r` strings (e.g. `'$\\Delta_g$ (Laplacian)'`) verbatim into a `.readout` div. Because the readout is populated on click — after KaTeX's auto-render pass — the user sees the literal characters `$\Delta_g$ (Laplacian)`. The `.m` field is partially de-LaTeXed by an ad-hoc `.replace()` chain, but the chain is incomplete and brittle (e.g. it keeps subscript braces, drops `\mathrm{...}` only when lowercase). Recommend either (a) write Unicode pre-substituted strings in `rows[]` and skip the chain, or (b) call `katex.renderToString` on each field and write to `.innerHTML`.
- **Cross-page reference error (semantic)**: line 855 says "the Levi form on a real hypersurface is exactly what we used in **§6** of [Several complex variables](./several-complex-variables.html#psh)". The link anchor `#psh` is correct, but `#psh` is **§2** of the SCV page, not §6 (which is "Cousin problems"). Either change "§6" to "§2" or drop the section number.

### Helper-block / widget-chrome hygiene
- Top-of-body `<script>` helper block (lines 195–244) is verbatim against `category-theory.html` modulo three inline comments stripped — fine.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.note`, `.ok`) used consistently; no ad-hoc classes introduced.
- Color usage in widgets uses tokens (`var(--cyan)`, `var(--yellow)`, `var(--pink)`, `var(--green)`, `var(--violet)`); no raw hex literals in widget SVG paint attrs.
- Every widget SVG has a `<title>` element — accessibility hygiene matches SCV.
- Every numbered section ends with a `<div class="quiz" data-concept="ccr-…">` placeholder, the `MVQuiz.init('conformal-and-cr-geometry')` IIFE is in place, and the `← Notebook` backlink + sidetoc scaffold are present.
- `widget-diagram-editor.js` is loaded in `<head>` but not actually used by any element in the page body — same dead-load pattern as SCV / category-theory, so cosmetic, not target-specific.

## Severity
minor polish
