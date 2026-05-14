# khovanov-homology — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** knot-polynomials, algebraic-topology

## Summary
Strong, well-paced page with full widget coverage and a faithful copy of the canonical helper block. The main rough edges are an inconsistent treatment of `sl_n` (bare vs `\mathfrak{sl}_n`), a cluster of name-dropped jargon in §5–§6 that lands without callbacks or definitions, and some minor LaTeX hygiene around upright subscripts and the `T(p,q)` vs `T_{p,q}` torus notation.

## Findings

### Notation drift
- `$sl_n$` (bare, italic) at TOC line 247, h2 line 447, prose lines 450, 454, 469 ("fundamental representations of $sl_n$"), and Connections line 530 vs `$\mathfrak{sl}_n$` at line 448, 452, the §5 widget options (lines 461–464), and the small-print at line 469. knot-polynomials.html consistently writes `$\mathfrak{sl}_n$` (lines 474, 522–525). High priority — same symbol meaning two things on one page; settle on `\mathfrak{sl}_n` per knot-polynomials.
- `Kh` rendered as bare italic everywhere (`$Kh^{i,j}$`, `$Kh(K)$`); knot-polynomials.html §8 uses `\mathrm{Kh}` and even `H^{*,*}(L)` (lines 420, 589–593). Cosmetic but the upright `\mathrm{Kh}` reads better as a named functor.
- Torus-knot notation drifts inside the page itself: `$T(p,q)$` in §4 prose (line 435) and the Rasmussen widget options/data (lines 423–432, 776–783) but `$T_{p,q}$` in §6 application paragraphs (lines 489, 491). Pick one — the widget already commits to `T(p,q)`.
- Subscripts that should be upright text but render italic: `$A_{Lee}$` (lines 405, 407), `$Kh_{Lee}$` (lines 407, 409), `$A_{BN}$` (line 407). Should be `\mathrm{Lee}` / `\mathrm{BN}` to match the convention category-theory.html uses for named structures.
- `$g_4(K)$` (line 415) and `$g_4$` (line 435, widget verdict line 815) is fine, but the widget readout drops to ASCII `g_4` for cells the SVG renders directly — just be aware mixed-rendering (KaTeX outside, raw text inside SVG) is invisible to readers and matches the references' practice.

### Undefined jargon
- "categorified" / "categorification" lands in the hero (line 260, "categorical answer to") and again at the §3 title before §3 itself defines what graded Euler characteristic means in this context. Acceptable inside this page since §3 unpacks it, but the hero's "categorical answer" reads as in-jokey before the reader has any anchor.
- "Reshetikhin–Turaev invariant" at line 448 ("Reshetikhin–Turaev invariant for $U_q(\mathfrak{sl}_2)$ on the standard 2-dimensional representation") — first usage on this page, no callback, even though knot-polynomials.html §6 (`#quantum`) is exactly that definition and even appears in the §5 callback below as "Quantum invariants". Quote: "Khovanov homology categorifies the Jones polynomial — equivalently, the Reshetikhin–Turaev invariant for $U_q(\mathfrak{sl}_2)$…"
- "Bar-Natan's local moves" (line 368) — undefined and uncallback'd; same for "Bar-Natan deformation" (line 407).
- §5 line 450 introduces "Kuperberg-style spider relations", "matrix factorisations" (line 452), "Koszul-style 2-periodic complex" (line 452) in a single paragraph with no definitions and no callbacks — this is the densest jargon spike on the page.
- §6 first paragraph after the Milnor box (line 493) uses "spectral sequence" and "instanton homology" without callbacks; the Connections section finally points at gauge-theory.html, but §6 prose itself does not.
- §6 "Open frontiers" (line 497): "Heegaard Floer's link Floer homology", "Manolescu's pillar", "Seidel–Smith's symplectic Khovanov homology", "Abouzaid–Smith" all in two sentences, none defined.
- "$\mathfrak{s}_o$ … canonical class" (line 409) appears before the reader is told that a smoothing produces a chain element; the connection between "all-orientation-respecting smoothing" and "canonical class" is asserted, not shown.

### Tone mismatches
- Hero is dense even by this notebook's standards — three independent technical claims in one sentence ("cobordism functoriality, the Rasmussen invariant $s(K)$, slice-genus bounds, and a categorical answer…"). knot-polynomials.html's hero is one sentence of plain English. Trim or split.
- §5 (Foams) drops into textbook-encyclopaedia voice for ~3 paragraphs (lines 448–454): rapid name introduction with no second-person framing, no "you" or "we" address, no concrete computation in prose. By contrast §1–§4 keep "We will categorify…", "Now layer linear algebra…", "Lift the Jones polynomial…". §5 is the outlier.
- §6 "Open frontiers" reads as a literature ticker rather than narration. Compare to knot-polynomials.html §6 closing paragraph ("This is the grand unification…") which still narrates.
- Reader's note at line 263 ("a working command of … chain complexes and bigradings") is good practice and matches the algebraic-topology house voice; no issue.

### Missing worked examples
- Every numbered section has a widget. Coverage is uniform.
- §5 "Foams" widget is essentially a static gallery (`drawCircle`, `drawTheta`, `drawY`, `drawBubble`) with no parameter to vary; no actual computation happens. The other five widgets all let the reader pick a knot/link and see numbers update. §5 could use one concrete `\mathfrak{sl}_3` evaluation (e.g., a small theta-foam dot count) to match the rest of the page's compute-for-yourself rhythm.
- §6 "Detection scoreboard" is also reference-card style — six precomputed verdicts, no parameter you can manipulate. Acceptable since the section is by nature a results survey, but flag it as the second-thinnest interactive on the page.

### KaTeX macros / formatting
- No locally introduced macros; the page relies entirely on the global `\Hom`, `\Spec`, etc. defined in the loader. No drift.
- Helper `<script>` block (lines 187–239) is a verbatim copy of category-theory.html's. Spot-checked `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` — identical.
- All KaTeX delimiters used (`$…$`, `$$…$$`) are house-standard. No `\(…\)` or `\[…\]` reinventions.
- Widget chrome: every `.widget` uses `.hd > .ttl + .hint` and `.row` / `.readout` correctly. `.note` used once (line 338). No ad-hoc classes.
- SVG `<title>` present on every widget root (`#cube-svg`, `#cmx-svg`, `#je-svg`, `#ras-svg`, `#foam-svg`, `#app-svg`). All have `viewBox`.
- One LaTeX-in-`<option>` cluster at lines 282–284, 327–331, 376–380, 422–431, 461–464 — `js/katex-select.js` is loaded at line 178, so this is wired correctly.
- The `<details class="changelog">` (lines 943–950) carries a single placeholder row with `(#TBD)` — fine for an initial-version page; will be picked up on the next `inject-changelog-footer.mjs` run.

## Severity
minor polish
