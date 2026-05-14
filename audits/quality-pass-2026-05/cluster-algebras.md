# cluster-algebras — pedagogical audit (2026-05)

**Section:** Algebra & homological
**Compared against:** category-theory, representation-theory

## Summary
Strong page overall — confident voice, six concept sections each with a working SVG widget, and a hero paragraph that lands the "same combinatorics shows up everywhere" thesis. Two real issues: the page mixes Unicode subscripts (`x₁`, `μ₁`, `M₁`) with `\mathrm{...}` operator wrappers where peers use the page-defined `\Hom` macro plus `\operatorname{...}`, and a couple of `<aside class="callback">` blocks are duplicated (one hand-authored, one fence-injected) at sections 5 and 6. Both sit in the polish band, not in the rework band.

## Findings

### Notation drift
- Page defines macros `\Spec, \Gal, \Hom, \tr, \ad, \ind` (line 22-29) identically to category-theory and representation-theory, but never uses `\Hom` — the only Hom that appears is inside the prereq blurb. Peers use it heavily (e.g. `$\Hom_G(V,W)$` in representation-theory.html#schur). Inconsistency is small, but the macro is dead weight.
- `\mathrm{mod}\,kQ`, `\mathrm{Ext}^1`, `\mathrm{Gr}_e(M)`, `\mathrm{Gr}(2,n)`, `\mathrm{GL}_n` — all use `\mathrm{...}`. category-theory.html convention is `\operatorname{...}` for named operators (`\operatorname{ob}\mathcal{C}`) and the macros register makes `\Hom` resolve to `\operatorname{Hom}`. Recommend: `\operatorname{Ext}^1` and `\operatorname{Gr}` to match the operator/identifier distinction the rest of the corpus follows. (Cosmetic; spacing differs subtly between `\mathrm` and `\operatorname`.)
- Widget DOM text uses Unicode subscripts (`x₁`, `μ₁`, `M₁`, `S₃`, `P₂`) baked into `textContent`, while the surrounding prose uses KaTeX `x_1`, `\mu_1`, `S_3`. representation-theory.html stays inside `$...$` even for option labels (`$C_3$`). Recommend: emit KaTeX-compatible source in widget readouts and let auto-render parse them, or accept the Unicode style and do it consistently. Currently the bar-chart label `denom = x₁^${c.d1} · x₂^${c.d2}` mixes Unicode subscript with ASCII caret — visibly inconsistent with the LaTeX `x_1^{d_1}` form three lines above in prose.
- `D^b(\mathrm{mod}\,kQ)` (§5) vs the bare-text `D^b/τ^{-1}[1]` in §7 connections list — the second copy uses Unicode `τ` and ASCII `[1]` outside math mode. Match: keep both inside `$...$`.

### Undefined jargon
- "**categorification**" used at §5 line 855 (`The combinatorial recursion of mutation looked like an isolated trick until categorification caught up`) without a definition or callback. Peers either define jargon at first use or send to a glossary entry; this is the only term on the page that lands cold.
- "**Auslander–Reiten translation**" at §5 line 857: introduced as `Here $\tau$ is the Auslander–Reiten translation` — a one-line gloss only, no callback to representation-theory.html and no widget hint. The `<aside class="callback">` for §5 *does* link `representation-theory.html#def` (basic vocabulary) but AR theory is not actually covered there. Either add a sentence ("the AR translate sends an indecomposable to its near neighbour in the AR quiver") or relax the prereq language.
- "**$2$-Calabi–Yau**" — defined inline by formula but the geometric meaning ("a triangulated category whose Serre functor is shift by 2") is not stated. Acceptable for an "advanced" page but representation-theory.html is more verbose at the analogous moment.
- "**τ-tilting**" appears in the §5 heading and then vanishes from the body — no definition, no example, no widget. The TOC promises a topic the section does not deliver.
- "**Iyama–Yoshino exchange**", "**cluster-tilting object**", "**rigid object**" appear in the §5 dictionary table without prose definitions. The table is doing all the work; a short sentence after the table would help.

### Tone mismatches
- §6 final subsection ("Scattering diagrams and the rest") is a four-line name-dropping paragraph: BPS states, scattering amplitudes, Donaldson–Thomas, $\mathcal{N}=4$ super-Yang–Mills — none defined, none with a callback. The voice here drifts into survey-article cadence and is markedly less worked-through than the polygon and Plücker subsections that precede it. Either expand or trim to a single sentence.
- §7 "Connections" hero sentence is one giant 95-word sentence (`Twenty-five years on, the same recursive datum sits at the centre of: …`). representation-theory.html's preview section uses bulleted/short structure for the same task. Suggest splitting.
- §5 reads more textbook-dry than the rest of the page — the BMRRT dictionary table is presented declaratively with no "click here" handoff or worked toy. The AR-quiver widget that follows is good, but the prose preceding it does not narrate the move.

### Missing worked examples
- §5 ("Cluster categories and τ-tilting") — the AR-quiver widget is a hover-to-highlight visual, but there is no worked example computing a *single* Caldero–Chapoton evaluation. Given the table announces the formula `$\sum_e \chi(\mathrm{Gr}_e(M))\prod x_i^{...}$`, a "compute one CC for $M_1$ in type $A_2$" toy would close the loop.
- §6 "Bordered surfaces" is pure prose — no surface widget, no flip-on-an-annulus, no concrete lambda-length identity. The polygon model in §4 already handled the disc; the section advertises a generalization without showing one.
- §6 "Total positivity" is one paragraph and zero examples. A 2×2 totally positive matrix and the cluster chart for $\mathrm{GL}_2$ would fit in three lines.
- §7 "Connections" — by convention this section is allowed to be example-light (representation-theory.html's §15 "Preview: compact groups" is similar), so this is not a finding, just a note that the page actually closes lighter than the body.

### KaTeX macros / formatting
- The `macros:` block at line 22-29 is the canonical six-entry block (verbatim from category-theory and representation-theory). No invented delimiters, no new macros. Good.
- `\mathrm{Gr}(2,n)` should be `\operatorname{Gr}(2,n)` per the operator-name convention; currently this gives an italicised "Gr" with cramped spacing in `\mathrm{Gr}(2,n)` vs the upright operator KaTeX gives for `\operatorname{Gr}`. Same for `\mathrm{Ext}^1`, `\mathrm{End}`, `\mathrm{mod}`, `\mathrm{GL}_n`. (Peer category-theory uses `\operatorname{ob}\mathcal{C}`; representation-theory uses both — the corpus is mixed but `\operatorname` is the favoured form when the macros block is involved.)
- Line 790 (`cl-flip` widget readout): `out.textContent = ... 'That\'s mutation $\\mu_d$ at the cluster variable $x_{(...)}$\\n'`. `textContent` writes plain text and KaTeX auto-render runs once on load, so the `$\mu_d$` and `$x_{(...)}$` will render literally as `$\mu_d$` in the readout pane after a flip. Either (a) build the readout as `innerHTML` with a `renderMathInElement(out)` call after the assignment, or (b) drop the dollar signs and write `μ_d` / `x_(i,j)` like the other readouts in this file do. (Hygiene bug, not a notation bug per se.)

### Helper-block / widget-chrome hygiene
- Page-global helper script (lines 193–242) matches `category-theory.html` byte-for-byte except for two missing comment lines (`// draw an arrow marker def once per svg (idempotent)`, `// curved arrow between two pixel points, with optional label`, `// shorten endpoints`). Functionally identical; safe.
- Widget chrome is correct throughout: every interactive uses `<div class="widget"><div class="hd"><div class="ttl">...</div><div class="hint">...</div></div>` with `.row`, `.readout`, `.note` as appropriate. No ad-hoc class names introduced.
- **Duplicate callbacks (high priority).** Section 5 (lines 1000–1017) and section 6 (lines 1163–1183) each contain BOTH a hand-authored `<aside class="callback">` and a fence-injected `<!-- callback-auto-begin --> <aside class="callback"> ... <!-- callback-auto-end -->` with overlapping link sets. The hand-authored one is outside the auto-fence so `audit-callbacks.mjs --fix` will not strip it on re-run; readers see two "See also" panels back-to-back. Recommend: delete the hand-authored asides and let the injector own the block.
- §1 has a `<!-- backlinks-auto-begin -->` "Used in" aside whose only entry is `cluster-algebras.html#mutation` — i.e. the page links to its own next section as "used in". Cosmetically odd but a property of the injector seeing intra-page prereqs as edges; not a target-page bug.

## Severity
minor polish — duplicate callbacks and the §4 widget's `$...$`-in-`textContent` leak are concrete cleanups; the rest is voice/notation tightening.
