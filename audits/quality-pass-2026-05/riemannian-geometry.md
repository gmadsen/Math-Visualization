# riemannian-geometry — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** differential-geometry, smooth-manifolds

## Summary
A strong, well-organized intrinsic-geometry walkthrough with five solid interactive widgets and tight callbacks to the embedded-surface predecessor; voice and notation are largely consistent with the section peers. The main pedagogical gaps are a static §8 widget, a §10 with no widget at all, and a stray internal reference ("Bishop–Gromov volume comparison (§8)") that doesn't resolve.

## Findings
### Notation drift
- Levi-Civita Christoffel formula uses `g^{k\ell}` with `\ell` for summation index (`riemannian-geometry.html` line 476), while the same formula in `differential-geometry.html#riemann` (line 2282) uses `g^{kl}` with `l`. Cosmetic — both render fine — but worth picking one across the section. `\ell` is arguably the better choice and the target uses it consistently.
- `\operatorname{Ric}` (target line 1196, `\operatorname{Ric}_{ij}=R^k_{kij}`) vs `\mathrm{Ric}` (`differential-geometry.html` line 2287, `\mathrm{Ric}_{ij}`). Both render the same, but the convention differs. `category-theory.html` registers `\Hom`, `\tr`, `\ad` as `\operatorname{...}` macros, so the target's `\operatorname{Ric}` is closer to house style; `differential-geometry.html` is the outlier.
- Riemann tensor index order: target uses `R^\ell_{ijk}` and `R_{ijk\ell}` (line 1176, 1180); `differential-geometry.html` uses `R^l_{ijk}` and `R_{lijk}` (line 2287) — subscript permutation differs (`R_{lijk}` vs `R_{ijk\ell}`). Semantic drift, low priority but worth flagging — readers cross-checking the symmetry equations between the two pages will see different index slots in the lowered tensor.
- Sectional curvature definition uses `g(R(u,v)v,u)` over `g(u,u)g(v,v)-g(u,v)^2` (target line 1187), while `differential-geometry.html` (line 2292) just writes `K(\sigma) = g(R(u,v)v,u)` with the orthonormality assumption. Both correct; not a true drift, but the more general formula in target should probably callback to the simpler peer-page form.
- `\operatorname{Sym}^2 T^*M` (target line 275) is fine; no peer page uses it, so no drift to report.

### Undefined jargon
- `\mathfrak{X}(M)` for the space of smooth vector fields appears in `\nabla : \mathfrak{X}(M)\times\mathfrak{X}(M)\to\mathfrak{X}(M)` at line 464 with no inline gloss. `smooth-manifolds.html` introduces vector fields by name in §5 but never uses the `\mathfrak{X}` glyph either. First use here would benefit from a parenthetical "(the space of smooth vector fields on $M$)".
- "Hopf–Rinow theorem" stated at line 281 without a definition of *geodesically complete*. Acceptable as a forward-pointer if accompanied by "(defined in §4)" — currently it just lands and moves on.
- "warped product $I\times_f F$" appears in the §2 metric-examples table (line 313) with the line element but zero narration. Drop the row, or give it one sentence ("a one-dimensional base $I$ with fiber $F$ scaled by $f(t)$, as in FLRW cosmology") so the reader isn't left to reverse-engineer the notation from the formula.
- "space forms" introduced parenthetically in §6 (line 1307) — definition is implicit ("quotients by discrete isometry groups"). Tight, but a more category-theory-style worked example ("e.g. $\mathbb{R}^n/\mathbb{Z}^n$ is a flat space form") would help.
- "Bishop–Gromov volume comparison (§8)" cited at line 1899 — §8 actually treats Bonnet–Myers, Synge, Cartan–Hadamard, *not* Bishop–Gromov. **Semantic drift, high priority** — this is a broken intra-page forward reference. Either drop the parenthetical, or add a Bishop–Gromov box to §8.

### Tone mismatches
- Voice is overall well-aligned with the section: declarative-but-conversational, with set-up phrases like "There are infinitely many connections on a manifold. The metric $g$ picks out exactly one:" (line 468) and "The Christoffels are <em>not</em> tensorial" (line 483). Closely matches `differential-geometry.html`'s rhythm.
- Section 1's road-map list (`<ul>` at line 285–293) is the only place that drops to a slightly clipped lecture-syllabus tone ("&sect;3 — the unique Levi-Civita connection $\nabla$ it determines"). Compare `category-theory.html` §1, which avoids printed roadmaps in favour of letting the sidetoc speak. Minor.
- The "Where to read next" book recommendation note at the end (line 1967) is a pleasant touch consistent with house tone.
- No meme-ish or over-casual passages spotted.

### Missing worked examples
- **§8 Comparison theorems** — has a `<div class="widget">` (line 1817) but the SVG is purely decorative (three labelled icons, no controls, no readout). By the AGENTS.md "every numbered `<h2>` has at least one toy you can poke" standard this counts as missing-example. A natural fix: a Bonnet–Myers calculator (slider over `\kappa`, readout of the diameter bound `\pi/\sqrt{\kappa}`).
- **§10 Riemannian volume form and divergence** — pure prose with one quiz, no widget at all. The volume-element computation on $S^2$ (line 1926) is begging for a small interactive: pick a sphere radius / a region in $(\theta,\varphi)$ and watch $\int \sin\theta\,d\theta\,d\varphi$ accumulate.
- §11 outro is rightfully widget-free; not flagged.
- §1 intro has no widget either, but the "metric visualizer" lands immediately in §2 and the intro is doing scene-setting work — acceptable per `category-theory.html`'s pattern.

### KaTeX macros / formatting
- Helper block at top of `<body>` (lines 189–238) is byte-equivalent to `category-theory.html` — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all present and unmodified. KaTeX loader at lines 7–50 uses the canonical six-macro list (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) verbatim — no page-local additions, which is the correct posture.
- No inline LaTeX inside `<option>` elements that would need `js/katex-select.js` beyond what's already loaded (line 23 has it). Verified the `met-sel`, `geo-tabs` and `sec-sp` selects use plain text or LaTeX through the wired loader.
- Delimiters are limited to `$…$` and `$$…$$`; no `\(…\)` or `\[…\]` invented variants.
- Widget chrome is conformant: every interactive uses `.widget > .hd > .ttl/.hint`, `.row`, `.readout`, `.note`, `.ok`, `.bad` — no ad-hoc class names found (only standard `.more` inside auto-generated `aside.related`).
- Color tokens (`var(--blue)`, `var(--yellow)`, `var(--pink)`, `var(--violet)`, `var(--green)`, `var(--cyan)`, `var(--mute)`) used throughout SVG paint attributes; minor exception is the `rgba(...)` literals for low-opacity fills (e.g. `rgba(88,196,221,0.06)` for sphere disks at lines 649, 917, 1232) which mirror what the peer pages do, so not flagged.
- Quiz placement quirk: `<div class="quiz" data-concept="levi-civita-connection">` sits at line 817 *inside* §4 (geodesics), and `<div class="quiz" data-concept="riemann-curvature-tensor">` at line 1822 sits *inside* §8 (comparison). The `data-concept` lookup is by id not position, so this works, but a reader scrolling sees a §4 quiz that asks §3 questions. Cosmetic, but worth nudging on a future edit pass.

## Severity
minor polish
