# cobordism — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** homotopy-theory, algebraic-topology

## Summary
Strong page overall: voice, KaTeX, widget chrome, and section rhythm match the section peers and the `category-theory.html` template. The only semantic drift worth fixing is the unannounced switch from `\mathrm{Cob}_d` to `\mathrm{Bord}_d^{fr}` inside §6, which leaves the reader uncertain whether the cobordism category and the cobordism-hypothesis category are the same object.

## Findings

### Notation drift
- **Semantic, in §6.** Section 6 introduces `\mathrm{Cob}_d` (lines 551, 552, 562, 572, 592) and then, without bridging, switches to `\mathrm{Bord}_d^{fr}` for the cobordism hypothesis (lines 597, 601). These are usually distinct objects (1-categorical vs `(\infty,d)`, oriented vs framed), but the page does not flag the change. Recommend a single sentence ("From here on we work with the framed `(\infty,d)`-categorical refinement, denoted `\mathrm{Bord}_d^{fr}`…") or reuse `\mathrm{Cob}_d` consistently.
- **Cosmetic, macro inconsistency.** Line 568 writes `\mathrm{Hom}_k(k,k) = k`, but the page declares `\\Hom` → `\operatorname{Hom}` in the loader (line 25) and homotopy-theory uses `\mathrm{Hom}` for the same purpose at line 542 — so the corpus is mixed, but within cobordism.html itself only this one site uses `\mathrm{Hom}`. Cheap to align with `\Hom_k`.
- **Cosmetic, Thom-spectra capitalization.** §3 outro lists "$MSO$ (oriented), $MU$ (complex), $MSpin$ (spin), $M\mathrm{String}$ (string)" (line 414) — `MSpin` is bare letters but `M\mathrm{String}` is wrapped in `\mathrm`. Pick one wrapper for the whole list.
- **Cosmetic, `O`-superscript style.** `\Omega_n^{O}` (with `{O}`) is used throughout §1–§3, but homotopy-theory's backlink references it as `\Omega_*^O` (no braces) at line 638. Both render the same; not actionable, but worth picking a house style if a future pass touches both.

### Undefined jargon
- **"stably trivial"** appears mid-§2 at line 342 ("$w(TS^2) = 1$ (the tangent bundle is stably trivial)") with no parenthetical or callback. First-time readers from the prereq path won't have this in hand; either parenthetical-define or add a callback to `characteristic-classes.html`.
- **"Steenrod algebra"** at line 398 ("Using mod-2 cohomology and the Steenrod algebra") — referenced as if known, no callback. Homotopy-theory mentions Steenrod squares once but as an aside in §3 (line 422), so a cobordism reader cannot rely on that. A one-line gloss or a callback to a defining page would help.
- **"transverse"** at line 395 ("the preimage $f^{-1}(BO(k))$, made transverse") — the word does load-bearing work in the reverse Pontryagin–Thom map, but the page never says what transversality means or cites where it's defined.
- **"Cerf-theoretic handle cancellation"** at line 509 — there is a callback to `morse-theory.html#cerf-theory`, which is good, but the inline phrasing reads as if "Cerf-theoretic" is already familiar; consider "(Cerf theory governs how Morse functions deform — see callback below)".
- **"Whitney trick"** is introduced inline at line 509 with a brief sketch ("sliding handles past each other in a $(p,q)$-disk pair") — that's adequate; not a flag, just noting it's the model the other items above could imitate.

### Tone mismatches
- The hero sub and §1–§3 prose match peer voice well (conversational-but-precise, with sharp setup like "is $M$ the boundary of something?").
- §5 opens cleanly ("So far we have used cobordism as an equivalence relation…"), but the surgery definition is delivered as three formula-blocks in quick succession (lines 493–499) without the intermediate narration the algebraic-topology peer uses in similar moments. Consider one bridging sentence between the embedding `\varphi` and the surgery formula explaining why removing `S^p\times D^q` and gluing in `D^{p+1}\times S^{q-1}` is the natural move (the boundaries match because `\partial(S^p\times D^q) = S^p\times S^{q-1} = \partial(D^{p+1}\times S^{q-1})`).
- §3's stretch from "Stabilising in $k$ … gives a class in $\pi_n(MO)$" (line 391) to the Thom isomorphism is dense; one motivating line ("Why a spectrum and not a single space? Because the construction lives at every $k$ simultaneously…") would lighten the wall.

### Missing worked examples
- _None._ Every numbered §1–§6 has a widget plus at least one in-prose worked example (low-dim cobordisms in §1, $\mathbb{RP}^2$ SW in §2, Thom-spectrum dimensions widget in §3, $\sigma(\mathbb{CP}^2)=1$ in §4, surgery widget + consequences list in §5, Frobenius-algebra classification in §6).

### KaTeX macros / formatting
- **§4 widget readout uses non-KaTeX bracketed text in SVG.** Lines 815–823 emit strings like `<L_${...}(p),[${d.name}]>` and `sigma(${d.name}) = ${d.sigCup}` directly into SVG `<text>` instead of as KaTeX. Same pattern as homotopy-theory's stable-homotopy widget, so this is a corpus-wide habit, not a local regression — flagging only because the readouts mix raw-ASCII math (`Omega_n^O`, `pi_*(MO)`, `RP^${n}`) with the KaTeX-rendered prose. If a later pass adds KaTeX-in-SVG, this would be a natural target.
- **No invented delimiters.** All math uses `$…$` / `$$…$$`; no `\begin{equation}`-style escapes.
- **`\mathrm{int}`, `\mathrm{Wh}`, `\mathrm{String}`, `\mathrm{Cob}`, `\mathrm{Bord}`, `\mathrm{Vect}`** — all conventional; none of these are in the loader macro list, but they're used the way the rest of the corpus uses `\mathrm{...}` for category names. Fine.
- **Helper block, widget chrome, color tokens, KaTeX-select loader.** All match the canonical template (helper block lines 187–239 verbatim against homotopy-theory; `js/katex-select.js` is loaded at line 178, which is required because §1, §4, §6 widgets all carry LaTeX-bearing `<option>` labels).
- **Quiz/callback ordering inside §4.** Lines 475–484 place the `<aside class="callback">` *before* the `<div class="quiz">`, while §1–§3 place callback *after* quiz. Cosmetic; the fenced auto-injectors will preserve whatever ordering exists.

## Severity
minor polish
