# variational-methods — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** partial-differential-equations, sobolev-spaces-distributions

## Summary
The page is a strong, voice-consistent contribution that aligns well with both Analysis peers — same head/macro block, same widget chrome, six well-motivated worked widgets, one per numbered section. A handful of minor polish items (one undefined-jargon callback, one missing `<aside class="callback">` cross-page link to functional-analysis, one stylistic word in the hero) are the only items worth touching.

## Findings

### Notation drift
- _None of substance._ The page uses the same `\mathbb{R}`, `\Delta`, `H^1_0`, `W^{k,p}` conventions as both peers; gradient/divergence/$\nabla\cdot$ in §6 matches the divergence form used in `sobolev-spaces-distributions.html#variational`.
- Cosmetic: variational-methods uses `\langle J'(u),h\rangle` for the duality pairing (correct house style), matching `sobolev-spaces-distributions.html`'s `\langle T,\phi\rangle` — consistent.
- Cosmetic: `tfrac` mixed with `frac` (e.g. `\tfrac12\int|\nabla u|^2` vs `\frac{1}{4\pi\,|x|}` in the references) — both peers do the same thing, no drift.

### Undefined jargon
- §3 "Direct method": "**Banach–Alaoglu**" is invoked in the reflexivity bullet without a one-clause gloss and without a See-also link. Both peers tend to gloss imported theorems inline (e.g. PDE §6 names Lax–Milgram as "a generalisation of the Riesz representation theorem" right where it lands). Recommend: append "(weak-* compactness of bounded sets in a reflexive space)" or link to functional-analysis.
- §4 "Mountain-pass": "**Palais–Smale**" is named in the (PS) bullet of the boxed theorem statement. The very next paragraph defines what it does ("plays the role of compactness for non-coercive functionals"), so the gap is one paragraph — borderline acceptable, but a brief in-bullet gloss ("compactness substitute, defined below") would smooth it.
- §6 hero table mentions "**$H = 0$ (mean curvature)**", "**$\tau(\phi) = 0$ (tension field)**" without a callback to a definition. The terms `H` and `\tau(\phi)` appear in the table cells with parenthetical labels but no see-also targets to riemannian-geometry — comparable PDE/Sobolev tables provide more context cells, but the parenthetical name is arguably enough for an applications survey table.

### Tone mismatches
- Hero `<p class="sub">` line "the saddle-point **yoga** of mountain-pass and Morse theory" is a step more colloquial than either peer's hero (PDE: "smooths out, or travels along characteristics"; Sobolev: "the natural workshop for PDE"). Not wrong — category-theory.html is conversational — but "yoga" is the only meme-adjacent word in the page; consider "the saddle-point geometry of mountain-pass and Morse theory" or similar.
- §2 cross-head: "Beltrami **identity**" appears in passing without being stated as an equation; readers who haven't seen the trick (the standard $L - y'\partial_{y'}L = C$ when $L$ is $x$-independent) may stall. Peers tend to either state the result on the spot or skip it; the current half-mention is the worst of both.
- Otherwise the voice is the same calm-precise register as the peers: numbered worked examples, "the picture" / "why X" subheadings, framed boxed key formulas.

### Missing worked examples
- _None._ All six numbered sections (§§1–6) have a widget plus prose worked example (Dirichlet variation, brachistochrone race, weakly-convergent zigzag sequence, mountain-pass landscape, isoperimetric defect tracker, sphere geodesic). §7 "Connections" is the outro and correctly carries no widget — same pattern as the peers' final "Connections" sections.

### KaTeX macros / formatting
- Helper `<script>` block (lines 187–239) is a verbatim copy of category-theory.html — no drift.
- KaTeX loader macro set (lines 22–29) is byte-identical to both peers.
- No locally-defined macros; no non-house delimiters introduced.
- §4's boxed mountain-pass statement uses `<div class="note small">` to host an `<ul>` with `<li>$(MP_1)$ ... </li>` bullets containing inline math — renders correctly under the configured KaTeX delimiters and matches the inline-math-in-a-bullet pattern used by `sobolev-spaces-distributions.html` §4 bullets.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.readout`, `.row`, `.note`) is used throughout exactly as in both peers; no ad-hoc classes.
- §4 mountain-pass widget: contour palette is hand-rolled hex strings (`"#0e1518"`, `"#13201f"`, ...) inside a JS array used as `fill:` for grid cells — these are hex literals inside SVG markup at the widget-script layer, which the `color-vars.mjs` audit may flag. Severity: cosmetic; the palette is a heatmap (not a theme accent) so a `var()` swap isn't a clean substitute. Consider adding a `<style>`-level CSS variable or an explicit comment "intentional non-token gradient" if the audit complains.
- §1 widget readout uses raw `ε` (lowercase epsilon) characters in the readout string ("ε = 0.30") — consistent with how PDE §1 widget prints `b² − ac` with raw unicode in the readout. Standard for `.readout` panels in this corpus.

## Severity
minor polish
