# analytic-number-theory — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** additive-number-theory, algebraic-number-theory

## Summary
A dense, well-illustrated tour of PNT, $\zeta$, sieves, Bombieri–Vinogradov, the circle method, and Erdős–Selberg, with eleven worked widgets and a strong section spine. Drift from peers is mostly cosmetic notation (`\mathrm{Re}` vs. `\operatorname{Re}`; `\mathrm{Li}` is local-only) plus a handful of jargon-before-definition slips and one over-cramped worked-example slot in §4.

## Findings
### Notation drift
- **`\mathrm{Re}` (target) vs. `\operatorname{Re}` (additive-number-theory).** Target uses `\mathrm{Re}\,s`, `\mathrm{Re}\,\rho`, `\mathrm{Re}\log\zeta` repeatedly (lines 314, 321, 353–358); additive-number-theory uses `\operatorname{Re}(s)` (line 2178, 2288) and `\operatorname{Im}(s)` (line 2380). Cosmetic but the two appear within the same Number-theory section. Recommend `\operatorname{Re}` to match the section convention; or define `\Re` once via the loader's `macros` block.
- **`\mathrm{Li}(x)` is target-only.** Defined locally in target line 272 and reused as `\mathrm{Li}(x)` everywhere; not referenced in either peer. Cosmetic — but since `\Li` is not in the head-block macros, prefer `\operatorname{Li}` (matches the Spec/Gal/Hom convention already loaded).
- **`\mathbb{Z}/q` (no parentheses) vs. peers' `\mathbb{Z}/n\mathbb{Z}` form.** Target line 397: `(\mathbb{Z}/q)^\times`; additive-number-theory line 1487 uses the explicit `(\mathbb{Z}/p^h\mathbb{Z})^s`. Cosmetic; the abbreviated form is fine but inconsistent within the section.
- **`\mathbf{1}[…]` (Iverson bracket) vs. `\mathbf 1_{…}` (subscript).** Target uses both: `\mathbf{1}[n\equiv a\pmod q]` (line 398) and `\mathbf 1_{m=0}` (line 524) and `\mathbf 1_{mk \le x}` (line 730). Pick one form per page. Additive-number-theory uses `[m=0]` (line 1235) — yet a third convention. Cosmetic but worth fixing within the target.
- **`\Lambda` is overloaded (semantic, low-priority).** In target it always means von Mangoldt's function; algebraic-number-theory uses `\Lambda` for an abstract lattice (line 870). Both are standard; no fix needed but worth a one-clause gloss when `\Lambda(n)` first appears in §2 (currently introduced via a `\begin{cases}` formula without naming it as "von Mangoldt's function" until two sentences later — see Jargon below).

### Undefined jargon
- **"Perron's formula"** linked as a callback at §2 line 317 ("Apply Perron's formula to $-\zeta'/\zeta$") with no inline reminder of what it does. The link is to a different page; a half-sentence parenthetical ("a Mellin-style contour-integral representation of partial sums of a Dirichlet series") would make the section self-readable.
- **"Hadamard product expansion"** (§3 line 363) appears once as a black-box prerequisite to the zero-free-region sharpening, with no callback or aside. Reader has no way to know whether it's defined elsewhere.
- **"Vaughan-type identity"** (§6 line 491) and **"Vaughan-style identity"** (§10 line 730) are both used without definition. The phrase appears twice without ever being unpacked, even though it carries a load-bearing role in the BV derivation.
- **"Abel summation"** (§9 line 670) appears in the Selberg sketch with no callback to the partial-summation identity it names.
- **"singular series $\mathfrak{S}(N)$"** (§7 line 528) is named in passing but never defined; the reader sees `$\mathfrak{S}(N) > 0$ on odd $N$` without knowing it is the product of local densities. Additive-number-theory line 1487 actually defines exactly this object — a callback there would close the gap.
- **"primitive characters $\chi$ mod $q$"** (§10 line 722) — "primitive" is technical (vs. induced) and used without definition. The earlier §4 introduces $\chi$ but never the primitive/imprimitive split that the large sieve depends on.
- **"$\Lambda$" introduced as a `\begin{cases}` formula** at §2 line 316 before being named "von Mangoldt" in the next sentence (line 317). Reorder so the name precedes the formula, mirroring how additive-number-theory introduces $r_k(n)$ (line 275: name and formula together).

### Tone mismatches
- **§7 (circle method) drifts to formula-walls.** Lines 522–532 are five consecutive paragraphs of `<strong>Major arcs.</strong>` / `<strong>Minor arcs.</strong>` / Waring history with no widget interleaved, then a cramped widget at line 534. The peers (additive-number-theory §11–13 on the same circle method) use shorter paragraphs and break the major-arc / minor-arc story with `.note` and `.ok` callouts. Adding one `<div class="note">` for the major-arc / minor-arc dichotomy would warm the tone.
- **§10 (large sieve) is theorem-statement-heavy.** Three consecutive `<p><strong>Theorem.</strong></p>` blocks (lines 720, 726, 730) with little narration between, in contrast to algebraic-number-theory §3 (Dedekind domains) which interleaves "let us see why" prose between formal statements. Consider one transitional sentence between each.
- **§9 vs. peers — "Sketch." / "The bootstrap." / "Conclude PNT."** The headers are slightly clipped/code-comment-style. Peers use full-sentence bridge prose. Minor; the proof-scrubber widget compensates.
- **No `<div class="ok">` callouts anywhere.** Peers use `.ok` for headline theorems (additive-number-theory lines 376, 542, 548, 1492; algebraic-number-theory 524, 856, 1196). Target uses only `<strong>Theorem.</strong>` inline — a more bookish look that mismatches the section's theorem-as-payoff styling.

### Missing worked examples
- **§4 (Dirichlet's theorem) labels its prose "Worked example: orthogonality of characters"** (line 396) but the body is a 7-line derivation, not a numerical example. The widget below it (residue wheel) is genuinely concrete, so the prose label could either be relabeled "Sketch" or the widget brought up earlier. No PNT-style "compute this small case" instance like additive-number-theory's "$n=25$, divisors $1,5,25$" walkthrough (line 551).
- **§3 (zero-free regions) lacks a numeric anchor.** The 3+4+1 trig identity (line 356) is stated abstractly with no "evaluate at $\theta = \pi/2$" sanity check. Algebraic-number-theory has the same level of formality but always pins it to a concrete example (`$d=-1$ gives $\mathbb{Z}[i]$`, etc.).
- **§6 (Bombieri–Vinogradov) widget is non-quantitative.** The histogram shows distribution shape but the readout doesn't surface a single concrete `$\Sigma_q$ vs. $x/(\log x)^A$` pairing the way the §5 widget surfaces "exact 13 vs. truncated 17". Minor — the data is there in the readout text; it's the on-canvas annotation that's thin.
- **§8 (exponential sums) has only an inline-code-cell** — fine, but no static visualization of `e(\alpha n^k)` walking the unit circle. The peers use SVG widgets for analogous ideas. Cosmetic if the code cell is treated as the "toy".
- **§11 (Connections) has no widget**, which is fine for an outro section, but most peer outros at least include a `<table class="plain">` summary. Optional.

### KaTeX macros / formatting
- **No new macros are defined locally** (good; matches `category-theory.html` head block exactly). Lines 22–28 reuse only `\Spec, \Gal, \Hom, \tr, \ad, \ind`. Of those, `\Hom` is never used on this page (low-priority cleanup; widgets bundle is unaffected).
- **`\mathrm{Li}` is the only "shadow macro"** — used 6+ times without definition. Either lift to `\operatorname{Li}` or add `'\\Li':'\\operatorname{Li}'` to the macros block (head edit; coordinate with house style — `\Li` is not currently in any peer's macros).
- **Helper-block at top of `<body>` is verbatim** with `category-theory.html` (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all match — lines 189–240). No drift.
- **Widget chrome is conformant.** Every interactive uses `<div class="widget">` with `<div class="hd"><div class="ttl">…</div><div class="hint">…</div></div>` and standard `.readout`, `.row`, `.small` (spot-checks at lines 277, 323, 365, 405, 457, 493, 534, 638, 674, 732). No ad-hoc classes.
- **One sub-element style nit:** §1 uses `<span ... class="readout" style="min-width:120px;flex:0 0 auto">` for slider value display (line 283); §4 uses `<span id="dr-xv" class="small">` for the same role (line 422). Within one page, the slider-readout chrome should be picked once.
- **Delimiter usage is clean** — only `$…$` and `$$…$$` (no `\(…\)` / `\[…\]` re-invention). Matches `category-theory.html` convention.

## Severity
minor polish
