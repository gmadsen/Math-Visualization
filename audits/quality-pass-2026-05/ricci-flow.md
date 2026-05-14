# ricci-flow — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** riemannian-geometry, differential-geometry

## Summary
A tightly written 6-section walkthrough of Hamilton's program with six purposeful interactive widgets and a strong narrative arc from the heat-equation analogy through to geometrisation. The main pedagogical gaps are a notation collision with the section's anchor page on `\operatorname{Ric}` vs `\mathrm{Ric}`, a duplicated "See also" callback in §1, and a high-jargon §6 that names JSJ / Seifert / incompressible tori / graph manifolds without callbacks or mini-glosses.

## Findings
### Notation drift
- Ricci tensor: target uses `\mathrm{Ric}` throughout (lines 269, 323, 325, 343, 410, 502); `riemannian-geometry.html#ricci` uses `\operatorname{Ric}` exclusively (lines 1893–1907). **Semantic-leaning drift, high priority** — this is the section's central object and the target callback at line 436 explicitly points the reader at the peer page where the same symbol appears typeset slightly differently. Settle on `\operatorname{Ric}` to match the anchor page, and consider adding `'\\Ric':'\\operatorname{Ric}'` to the page-local KaTeX macros block (lines 22–29) so the convention is enforced once.
- Inconsistent within the target: §1 line 266 writes the equation as `\partial_t g_{ij} = -2\,R_{ij}(g)` (bare `R_{ij}`), then line 323 restates the same equation as `\partial_t g = -2\,\mathrm{Ric}(g)`. Reader has to recognize "$R_{ij}$ is the Ricci tensor" (stated at line 267) and silently translate. Pick one form and use it from §1.
- `\mathrm{Rm}` for the full Riemann tensor appears at lines 325, 368, 395, 701 with no introduction — first use is inside the maximal-existence theorem statement. `riemannian-geometry.html#curvature` (line 1167+) writes the Riemann tensor as `R^\ell_{ijk}` / `R_{ijk\ell}` and never uses `|\mathrm{Rm}|`. Either gloss `\mathrm{Rm}` on first appearance ("the full Riemann curvature tensor") or switch to `|R|` with the same note.
- `\widetilde{SL_2\mathbb{R}}` at line 523 is a malformed-looking grouping (italic `SL_2` running into `\mathbb{R}` inside a tilde). Riemannian-geometry doesn't use this glyph, but the conventional rendering is `\widetilde{SL_2(\mathbb{R})}` or `\widetilde{\mathrm{SL}}_2(\mathbb{R})`. Cosmetic.
- `\mathrm{vol}\,B(x,r)` (line 395) vs `\operatorname{Vol}` / `d\mathrm{vol}_g` in `riemannian-geometry.html` line 1905, 1923. Three different vol-shaped tokens across the section. Cosmetic, but the `\operatorname{Vol}` form is the most defensible.

### Undefined jargon
- "ancient solution" first appears in §3 prose at line 393 ("…subconverges … to a Ricci flow $g_\infty$ defined on $(-\infty,0]$ — an **ancient solution**") with the definition immediately fused into the sentence. Acceptable, but the term then echoes through "ancient limits" in the same paragraph and through a backlink at line 359 ("Singularity formation and ancient solutions") with no anchor or callback.
- "noncollapsing" used in line 393 *one paragraph before* Perelman's $\kappa$-noncollapsing theorem defines it (line 395). Mild inversion — readers see "a noncollapsing hypothesis" before they know what it is. Swap the order, or add "(defined below)" to the first reference.
- "Cheeger–Gromov compactness" / "pointed Cheeger–Gromov sense" (line 393) — no callback, no parenthetical gloss, and there is no Cheeger–Gromov page to link to. First sentence of the supporting paragraph for the rescaling argument; reader without prior exposure stalls.
- §6 jargon cluster (high priority): "incompressible tori" (lines 516, 522, 525), "graph manifold" (line 519), "Seifert-fibred" (line 519), "JSJ decomposition" (lines 522, 525), "prime decomposition" (line 522). All five terms appear in a single paragraph + the "Geometrisation" callout box, none defined, no callbacks (`./algebraic-topology.html#…` or `./point-set-topology.html#…` would be the obvious targets if anchors exist). The riemannian-geometry §11 outro avoids this trap by linking out to lie-groups / differential-forms / algebraic-topology pages with one-sentence motivations; replicate that pattern here.
- "homotopy 3-sphere" at line 909 (widget caption) and "fake 3-sphere" in the SVG `<title>` (line 511) used without defining "homotopy sphere". Mild, but it's a load-bearing term for the Poincaré-conjecture story.
- "Kähler–Ricci soliton on $\mathbb{CP}^2\#\overline{\mathbb{CP}^2}$" (line 421 widget caption, repeated at line 429 with "Koiso/Cao") — connect-sum notation `\#` and bar notation $\overline{\mathbb{CP}^2}$ for the orientation-reversed copy are used without gloss. Riemannian-geometry never deploys this notation, so this is the page where it's introduced.

### Tone mismatches
- Voice is well-aligned with the section overall: declarative-but-conversational, clear "the wrinkle:" / "two threads come together" set-ups (lines 322, 495), and the heat-equation analogy is delivered the way category-theory.html sets up adjunctions. Comparable rhythm to riemannian-geometry's "the unique Levi-Civita connection it determines."
- §6 ("Poincaré conjecture and geometrisation") drifts toward dense-textbook voice in the second half (lines 516–525): five technical terms in two sentences, declarative case-list, no narration of "why this matters". Compare riemannian-geometry §11 which builds each cross-link with a one-sentence motivation. The §6 widget *caption* (line 513) does narrate well; the prose around it doesn't match.
- "Hamilton's compactness theorem (modelled on Cheeger–Gromov) says that under bounded curvature plus a noncollapsing hypothesis the family $g_k$ subconverges …" (line 393) — single 60-word sentence carrying three definitions and a parenthetical attribution. Break in two; this is the densest sentence on the page.
- Open-frontiers paragraph at line 543 ("4-D Ricci flow with surgery (singularity classification still open), Kähler–Ricci flow on Fano varieties (analytic minimal model program, Tian–Donaldson–Sun), …") is essentially a name-drop list. Riemannian-geometry's "Where to read next" `note` block (line 1967) is the house pattern for sign-offs; consider that form instead.

### Missing worked examples
- Every numbered §1–§6 has a widget — `w-flow-types`, `w-deturck`, `w-blowup`, `w-soliton`, `w-surgery`, `w-extinct`. Coverage is genuinely strong.
- §7 "Connections" has no widget or quiz; matches the riemannian-geometry §11 outro pattern, so not flagged.
- The DeTurck widget (`w-deturck`, lines 329–338) is a three-step button-stepper through three labelled boxes — informative but non-numerical. By §2's standards this is more diagram-than-toy. A closer-to-house-style add would be a tiny linearised-symbol calculation (pick a perturbation $h$ of a flat metric, show the principal symbol of $-2\mathrm{Ric}$ versus that of $-2\mathrm{Ric} + \mathcal{L}_W g$). Not blocking; current widget does carry the conceptual load.
- §6 widget `w-extinct` is a nice timeline scrub but its tree-of-pieces rendering is hard-coded to one schematic example (the surgeries happen at fixed times $t \in \{0.30, 0.55, 0.78, 0.92\}$). That's fine for the "what happens" intuition, but no parameter is exposed to vary. Acceptable; flagged as future polish.

### KaTeX macros / formatting
- Page-local KaTeX loader (lines 11–34) ships the canonical six macros (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) byte-identical to `riemannian-geometry.html` and `category-theory.html`. No page-local additions — which is also why `\Ric` is *not* a macro and `\mathrm{Ric}` had to be hand-typed. Adding `'\\Ric':'\\operatorname{Ric}'` here would be the cleanest fix for the §"Notation drift" item.
- Helper block at lines 187–239 is verbatim from `category-theory.html` modulo three comment lines (the `// draw an arrow marker def …` style comments are missing); functions `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all present and unmodified. Hygiene OK.
- Delimiters limited to `$…$` and `$$…$$`; no `\(…\)`/`\[…\]` invented variants.
- Widget chrome conformant on all six widgets: `.widget > .hd > .ttl/.hint`, `.row`, `.readout`, `.note`, `.ok`, `.bad` everywhere; no ad-hoc class names.
- Color tokens used throughout SVG paint attributes (131 `var(--…)` references). No raw hex literals inside widgets. Hygiene OK.
- **Hygiene defect (high priority)**: §1 contains a duplicated "See also" callback. The hand-written `<aside class="callback">` at lines 294–301 has the same three links as the auto-injected fenced block at lines 304–311 (`<!-- callback-auto-begin -->` … `<!-- callback-auto-end -->`). Reader sees the identical bullet list twice in a row immediately after the §1 widget. The `audit-callbacks.mjs --fix` injector won't dedupe a hand-written sibling; the hand-written `<aside>` should be removed (the auto-fenced block is the canonical one).
- TOC entry "7 Connections" (line 249) implies a numbered §7, but the `<h2>` at line 531 is the bare string `Connections` (unnumbered). Riemannian-geometry §11 reads `11. Connections to the rest of the notebook`; matching that would close the gap.
- `<h1>Ricci flow</h1>` at line 259 is bare; both reference pages use a `<topic> — <subtitle>` pattern (`Riemannian geometry — metrics, connections, curvature`). Cosmetic, in line with `audit-slug-flavored-titles` flavor.

## Severity
minor polish
