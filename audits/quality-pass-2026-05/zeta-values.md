# zeta-values — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** analytic-continuation, L-functions

## Summary
Strong, story-driven page with five solid widgets (§1–5) and well-paced historical hooks; the principal weaknesses are notational drift on `Re(s)` versus the section peers, two fully widget-less sections (§6–7) that pivot to dense expert prose, and a couple of jargon hits in those tail sections without callbacks.

## Findings
### Notation drift
- `Re(s)` macro: zeta-values uses `\operatorname{Re}(s)` consistently (e.g. line 591 `$\operatorname{Re}(s)>1$`, line 727 `$0\le\operatorname{Re}(s)\le 1$`), while L-functions uses `\mathrm{Re}\,s` (e.g. line 265 `$\mathrm{Re}\,s > \sigma_0$`, line 335 `$\mathrm{Re}\,s = 1/2$`) and analytic-continuation uses `\mathrm{Re}s` (line 881 `$\mathrm{Re}s>1$`, line 910 `$0<\mathrm{Re}s<1$`). All three differ; semantic drift on a shared object across the same section. Pick one — `\mathrm{Re}\,s` matches the closer peer L-functions; `\operatorname{Re}` is also fine if standardized.
- Critical-strip notation: zeta-values writes `$\operatorname{Re}(s)=\tfrac{1}{2}$` (line 727), L-functions writes `$\mathrm{Re}\,s = 1/2$` (line 335). Same idea, different visual grammar (`\tfrac` vs `1/2`, parens vs comma-thin-space).
- Top-nav backlink reads `← Index` (line 236), but every other peer in the section — analytic-continuation:240, L-functions:236, and the canonical category-theory:241 — reads `← Notebook`. AGENTS.md § "Page scaffolding" prescribes `← Notebook` exactly. Cosmetic but house-convention drift.
- Apéry-series readout uses ASCII `Apery` (line 541, 523 comment) where the prose uses `Apéry` with the accent (lines 492, 496, 498, 504, 515). Cosmetic; consistent diacritics in user-visible readouts would match the page's own prose.
- Bernoulli formula in the §4 readout prints `−B_${n+1}/${n+1}` (line 643) using ASCII unicode minus and a Markdown-style underscore index — fine for monospace `<readout>`, but the prose-side formula uses TeX `B_{n+1}` (line 595). Not drift, just worth noting the readout is intentionally ASCII.

### Undefined jargon
- "Archimedean place" appears in §5 (line 719: "absorbs the gamma factor encoding the Archimedean place") with no in-page definition or callback. The page is `data-level="intermediate"`; analytic-continuation and L-functions both avoid this term unless followed by a gloss. Either drop "encoding the Archimedean place" or add a tiny parenthetical ("the gamma factor at the prime-at-infinity").
- "Beilinson's regulator", "Deligne cohomology class", "Beilinson's conjecture" all introduced in one §7 sentence (line 951) with no definition or callback aside. The §7 callback block (lines 957–964) points to `dirichlet-series-euler-products`, `heights-arithmetic-geometry`, and `L-functions#continuation`, none of which cover these K-theory/regulator notions. First offending sentence: "Deninger reframed it through Beilinson's regulator: $T^n$ is a real cycle on $V=\{P=0\}$, $\log|P|$ extends to a Deligne cohomology class…".
- "BSD" used unexpanded at the end of §7 line 951 ("framework as BSD"). RH is spelled out in §5 first (line 737) before being abbreviated in §6 line 915; BSD never gets the same courtesy. Add the expansion or link to `bsd.html` from the §7 callback list.
- "Drinfeld-associator coefficients" (§6 line 915) used in a `.note` aside without prior definition or callback. Cosmetic in a marginal note, but flag-worthy for an intermediate reader.
- "motivic $\pi_1$ of $\mathbb{P}^1\setminus\{0,1,\infty\}$" (§6 line 915) — same context, similar issue. The note is doing a lot of expert-name-dropping in two lines.

### Tone mismatches
- Sections 1–5 nail the "conversational-but-precise" voice (e.g. §1: "the twenty-seven-year-old Euler stunned the mathematical world", §3: "Apéry's 1978 bombshell"). This is good and on-brand with category-theory's tone.
- Section 6 ("Multiple zeta values") shifts to dense, formula-and-claim prose: definitions of MZV / depth / weight / stuffle / shuffle / double-shuffle / Zagier-conjecture / Hoffman / Brown / Goncharov / Terasoma / motives all in roughly 30 lines (881–915), with no widget to slow the pace and no historical hook. Compared with analytic-continuation §6, which walks Riemann's derivation in three numbered steps with a stepper widget, the contrast is jarring.
- Section 7 has the same problem: Smyth → Boyd → Deninger → Beilinson → "Mahler measure is a height; the height is a regulator; the regulator is a special $L$-value" arrives in two paragraphs. Memorable line, but it's the only narration glue holding a wall of named conjectures together.
- §6 closing note (line 915, "Why this matters") veers toward over-confident pop-math ("after RH, the most accessible-looking transcendence question in number theory") — fine in moderation, but coming on top of the dense paragraph above it reads as compensation for absent worked examples.

### Missing worked examples
- **§6 Multiple zeta values** has zero widgets and one quiz placeholder. Per AGENTS.md house convention "Numbered `<h2>` sections each with a worked widget" this is a gap. A small interactive that lets the reader: pick weight w∈{3,4,5,6}, see the dimension prediction d_w from Zagier's recursion, and tabulate the depth-1/depth-2 numerical MZV values up to that weight, would unblock the section.
- **§7 Zeta values and Mahler measure** also has zero widgets. A natural toy: a numerical $m(P)$ integrator for low-degree two-variable polynomials (1+x+y, 1+x+y+z, 1+x+y+xy) showing the integral's value approaching $\frac{3\sqrt{3}}{4\pi}L(\chi_{-3},2)$ or $\frac{7}{2\pi^2}\zeta(3)$ as a sample-count slider increases.
- §1–§5 each have a working widget; the back-half drop-off is visible to readers (AGENTS.md/PLAN.md "every major concept has a toy you can poke").

### KaTeX macros / formatting
- KaTeX macro block (lines 22–29) is identical across all three pages: `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`. None of those macros are actually used on zeta-values — harmless boilerplate, no new macros invented.
- Helper `<script>` block at top of body (lines 185–234) matches L-functions verbatim and is functionally equivalent to category-theory; analytic-continuation defaults `pad1=0, pad2=4` instead of 14/16 (line 210) — the per-page `drawArrow` defaults already vary across the corpus, so this is not a zeta-values issue.
- No ad-hoc widget chrome: every widget uses `.widget / .hd / .ttl / .hint / .readout / .row / .small` per house convention.
- Mixed unicode-vs-TeX in `.small` captions: e.g. line 397 `$k^{-2n}$` in TeX but the inline SVG `text` label `k⁻²ⁿ` (line 448) uses Unicode superscripts. Both render fine; cosmetic only.
- Trailing `<!-- callback-auto-end --><div class="quiz" …>` on the same line at §7 (line 965) — minor formatting nit, the auto-injector did this; matches what other pages do, no action needed.

## Severity
minor polish
