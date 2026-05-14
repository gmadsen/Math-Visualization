# algebraic-topology — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** point-set-topology, homotopy-theory

## Summary
The page is largely on-voice and notation-aligned with both peers; the main pedagogical gaps are structural (sections 6 and 7 carry no concept/quiz placeholder, and three §1–§2 concepts collapse onto one anchor) plus a non-canonical helper block at top of `<body>`. Cosmetic drift only on a few pieces of name-dropped jargon.

## Findings
### Notation drift
- `_None._` Blackboard-bold sets are uniformly `\mathbb{Z}`, `\mathbb{R}`, `\mathbb{Q}`, `\mathbb{RP}^n`, `\mathbb{CP}^n` across the three pages (e.g. `algebraic-topology.html:307` `\mathbb{Z}` matches `homotopy-theory.html:281` and `point-set-topology.html:273`); the local `\Hom` macro at line 1250 is the same one declared in the canonical loader (`algebraic-topology.html:41`); `\mathrm{pt}` for the one-point space matches `homotopy-theory.html:356, 423, 596`; `\operatorname{im}`, `\ker` are spelled out the same way as in homotopy-theory.

### Undefined jargon
- "H-space" appears in §2 prose (`algebraic-topology.html:339` — *"true for any H-space, any product…"*) with no definition or callback. Neither `H-space` nor a clarifying parenthetical is given before this use.
- "CW dimension" appears in the same sentence (`:339` — *"any space of dimension ≥ 2 in the sense of CW dimension"*) before "CW-complex" itself is even mentioned (first occurrence is §6 `:1112`, then §7 `:1222`). CW complexes are never defined on the page; homotopy-theory.html similarly assumes CW comfort, but only after the reader's-note prereq disclaimer at `:263` — algebraic-topology has no analogous disclaimer.
- "deck-transformation group" / "deck group" used in §3 (`:532`) before any general definition; only the §4 callback (`:587`) implicitly defines it via the Galois correspondence.
- "Galois category" name-dropped at the end of the §4 connection note (`:612`) with no prereq link or follow-up — point-set-topology.html and homotopy-theory.html both prefer to sketch even off-roadmap pointers in 1–2 sentences (e.g. homotopy `:631` chromatic filtration gloss).

### Tone mismatches
- _None._ "Gelatinous continuous thing" (`:262`), "gloriously non-abelian" (`:339`), "painfully hard to compute … abelianized cousin" (`:783`) match the conversational-but-precise voice in homotopy-theory ("merciful", "notoriously erratic", "hopeless for now" at `:337, 456, 522`) and point-set ("workhorses", "hopeless" at `:650, 838`).

### Missing worked examples
- §6 (Mayer–Vietoris) and §7 (Euler characteristic & cohomology) each carry a widget and worked derivation but **no `<div class="quiz" data-concept="…">` placeholder** — the page has 7 numbered sections but `concepts/algebraic-topology.json` only registers 6 ids (`paths, simply-connected, fundamental-group, universal-cover-of-circle, covering-spaces, singular-homology`), so the page violates the AGENTS "every concept ends with a short quiz" pedagogy convention for these two sections. point-set-topology and homotopy-theory both place a quiz at every numbered `<h2>`.
- Three concepts (`paths`, `simply-connected`, `fundamental-group`) all share `anchor: "pi1"` in `concepts/algebraic-topology.json` — the §1 subsections `#paths` and `#simply-connected` exist as `<h3 id=…>` (`:264, 276`) but the graph never points at them, so deep links from pathway/sidetoc collapse three concepts onto one section header. Worth either splitting the anchors or merging the concepts.

### KaTeX macros / formatting
- The page-global `<script>` block at top of `<body>` (`:188-237`) **omits the canonical 2D helpers `ensureArrow`, `drawArrow`, `drawNode`** that `category-theory.html:196-238`, `point-set-topology.html:195-235`, and `homotopy-theory.html:196-238` all carry verbatim. Instead it adds widget-specific scaffolding (`Q`, `qAdd`, `qSub`, `qMul`, `qDiv`, `qIsZero`, `rankQ`, `matMul`, `gcd`, `mod`) used only by the §5 simplicial widget. Per AGENTS "Page-global helpers": *"Copy verbatim from category-theory.html (2D) … do not rewrite."*
- The §4 covering-spaces widget script defines a **local `drawNode(x,y,depth,incoming,len)`** at `:745` whose signature collides with the canonical `drawNode(svg,x,y,label,opts)` — harmless today because the canonical helper is missing here, but a footgun if the helper block is ever restored.
- Display-formula bodies inside `<p style="text-align:center">…$…$…</p>` (e.g. `:303, 786, 788, 1089, 1223`) are inline-mode KaTeX rather than `$$…$$` display-mode. point-set-topology and homotopy-theory consistently use `$$…$$` for set-off equations (e.g. point-set `:283, 287`; homotopy `:417, 461, 584`). Cosmetic but visible: subscripts/limits render smaller than the surrounding peer pages.

## Severity
minor polish
