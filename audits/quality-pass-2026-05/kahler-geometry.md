# kahler-geometry — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** differential-geometry, riemannian-geometry

## Summary
The page is well-structured, uses the standard helper block and widget chrome, and has a worked widget per concept section. Drift is concentrated in two places: the closing `<h2>` lacks the section number that both peers and the page's own TOC use, and several heavy concepts (primitive cohomology, Hodge–Riemann relations, K-polystability, Chern–Weil) appear with no in-page definition.

## Findings
### Notation drift
- `\mathrm{Ric}` in kahler `#calabi-yau` line 673, 768, 786 vs. `\operatorname{Ric}` in riemannian `#ricci` lines 1893–1907. Differential-geometry also uses `\mathrm{Ric}` (line 2296), so this is a split convention across the section, but two pages (kahler + diff-geom) currently disagree with the more notation-strict riemannian-geometry. Cosmetic, but worth pinning to one form across the three pages.
- `J^2 = -\mathrm{id}` (kahler line 266) — `\mathrm{id}` is the form used in category-theory.html for identity morphisms (lines 279, 466), so this is in line with house style; flagging only because the page never defines a local macro for it. Low priority.
- TOC entry uses "Hermitian metric and the Kähler form" (line 244), heading uses the same — consistent. Concept JSON title is "Hermitian metric and the Kähler form" — consistent. No issue here.

### Undefined jargon
- "Dolbeault cohomology $H^{p,q}_{\bar\partial}(M)$" first appears at §1 line 276 in the integrability note before any prose introduces what Dolbeault cohomology is or what $\bar\partial^*$ does. The reader sees the symbol cold. Low priority — the surrounding sentence telegraphs that it is "well-defined" given $\bar\partial^2 = 0$, so a reader who hasn't met it can infer the gist; but no callback to a page that defines it.
- "primitive cohomology" §4 line 586: defined formally as $\ker L^{k+1}$, but the geometric meaning (highest-weight vectors of the $\mathfrak{sl}_2$ representation) is left implicit despite the preceding sentence setting up exactly that representation theory.
- "Hodge–Riemann bilinear relations" §4 line 590: name-dropped with "polarise every primitive Hodge structure" — neither "Hodge–Riemann" nor "polarise" nor "Hodge structure" is defined or callback-linked. This is the densest jargon-per-line spot in the page.
- "Chern–Weil" §5 line 674: invoked as the justification for $[\rho] = 2\pi c_1(M)$ without naming what kind of construction it is. Reference pages do name when they use a heavy import (Bishop–Gromov is unpacked in riemannian §8/§9). Compare "Chern–Weil then identifies it with a topological invariant" — a reader who doesn't know Chern–Weil cannot recognize what step is being deferred.
- "K-polystable" / "test configuration" / "Donaldson–Futaki invariant" §6 line 782: defined informally inline ("roughly, every test configuration … has non-negative invariant") but every term in the definition is itself undefined. This is the deepest jargon stack on the page; saying "roughly" is honest but the section ends with no widget that lets the reader poke at any of it.
- "reductive automorphism group" §6 line 780 — flagged in passing without a definition.

### Tone mismatches
- Voice is consistent with both peers — declarative, second-person occasional ("the road map of this page" / "Now layer a metric on top" line 364 mirrors riemannian-geometry's "We now drop the ambient space" line 271). No drift to dry textbook or over-casual.
- The §6 "One picture" note ("Its existence is 'obvious' (homogeneity)") uses scare-quotes in a way that lands well, matches category-theory's voice. Fine.
- Minor: §3 opens with "transforms into a torrent of identities" which is slightly more rhetorical than peers; not a problem, just noting.

### Missing worked examples
- §7 "Connections" has no widget. This is in line with riemannian-geometry §11 and differential-geometry §11 — both are pure outro sections. Not a defect.
- §6 "Kähler–Einstein and K-stability" widget (`w-ke`) is a sign-chart with three coloured bands; it does not let the reader exercise K-stability itself. The widget illustrates only the trichotomy `c_1 < 0 / = 0 / > 0`, which the table on line 771 already gives. The deepest concept on the page (test configurations / Donaldson–Futaki invariant) has no toy. By comparison, riemannian-geometry §6 (`w-tri`) lets the reader actually drag triangle vertices on a sphere/flat/hyperbolic disk and watch the angle excess. Recommend: either keep the sign-chart but add a second widget that toy-models a destabilising test configuration (e.g., a one-parameter degeneration with sign of DF invariant readout), or upgrade `w-ke` to step through 1d examples (e.g., projective bundles where K-stability is computable).

### KaTeX macros / formatting
- Macro block at lines 22–29 is the standard six (`\Spec \Gal \Hom \tr \ad \ind`) — identical to differential-geometry, riemannian-geometry, and category-theory. No re-invention.
- No unusual delimiters; only `$…$`, `$$…$$`, and the standard `\(…\)` / `\[…\]` are configured.
- §7 closing heading is `<h2>Connections</h2>` (line 849) without the leading "7.", but the TOC entry on line 249 reads "7 Connections". Both reference peers number the closing section: riemannian "11. Connections to the rest of the notebook", differential-geometry "11. Coda — what's next". Recommend: rename to `<h2>7. Connections</h2>` so the rendered heading matches the TOC label and the rest of the page.
- Helper block at lines 187–239 is verbatim from category-theory (matches function bodies for `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`). No drift. `drawArrow`/`drawNode` are defined but unused inside the page — fine, they cost nothing.
- All five widgets use the canonical `<div class="widget"> · .hd · .ttl · .hint · .row · .readout` chrome and accent colors via `var(--…)` tokens. No ad-hoc classes, no hex literals.
- Widget SVGs all carry `viewBox` and `<title>` — accessibility hygiene is clean.

## Severity
minor polish
