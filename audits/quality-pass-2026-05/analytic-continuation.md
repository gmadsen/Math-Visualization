# analytic-continuation — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** dirichlet-series-euler-products, zeta-values

## Summary
A strong, narratively-driven page whose voice and worked-widget cadence sit comfortably alongside its section peers; the only material drifts are a few notation inconsistencies (raw-Unicode in widget readouts vs LaTeX in prose) and two minor deviations in the page-global helper block.

## Findings
### Notation drift
- `\mathrm{Re}` is used throughout the target (line 881 `\mathrm{Re}s>1`, lines 887, 889, 910), matching `dirichlet-series-euler-products.html` (line 266 `\mathrm{Re}\,s`). `zeta-values.html` instead writes `\operatorname{Re}(s)` (lines 591, 727, 731). Cosmetic section-level drift between the peer pages, not introduced here; recommend the section settle on `\mathrm{Re}\,s` to match the older Dirichlet page that this one explicitly cross-links.
- Spacing inconsistency with peer: target writes `\mathrm{Re}s>1` (no thin space, line 881), where dirichlet uses `\mathrm{Re}\,s > 1` (line 365). Cosmetic.
- Completion-symbol drift: target uses `\xi(s)` for the completed zeta (lines 258, 903–910), matching `zeta-values.html` (line 721 `\xi(s)`). The neighboring `dirichlet-series-euler-products.html` calls the same object `\Lambda(s)` (line 843). The target follows zeta-values (good — tighter pairing), but a reader bouncing between `analytic-continuation#zeta` and `dirichlet#cont` will see two different names for the same completed function with no reconciliation. Semantic-leaning: worth one half-sentence ("this is the same `\Lambda` of the Dirichlet page").
- Widget readouts and SVG text labels in the target lapse into raw Unicode where the prose uses LaTeX. e.g. line 612 readout: `'On C\\{0} we have π₁=ℤ; log is ℤ-sheeted.'` — prose at line 502 writes `\mathbb{C}^*`, `\pi_1`, `\mathbb{Z}`. Lines 725 (`f(ℝ)⊂ℝ`), 1052–1070 (`ζ(s) = Σ 1/n^s`, `Γ(s/2)`, `ξ(s)=ξ(1−s)`) have the same lapse. Peers do this too inside readouts (acceptable house style), but the target also emits `C\{0}` rather than `C\setminus{0}` or `ℂ*` — minor cosmetic inconsistency between `\mathbb{C}^*` (prose) and `C\{0}` (widget).
- Identifier mismatch with `concepts/analytic-continuation.json`: concept id `monodromy-theorem` is prereq'd on `fundamental-group`, but the section-3 callback links to `algebraic-topology.html#pi1` (correct) while the same `algebraic-topology.html#pi1` link appears twice in the section-2 callback (lines 403–404 — duplicate `Paths and homotopy` href, one of which should be `#paths` only). Likely an `audit-callbacks --fix` artifact; cosmetic at most.

### Undefined jargon
- "stalk" appears in §3 prose (line 502: "each homotopy class of loops acts on the stalk at $p$") with no definition or callback. Neither peer defines it either, so this isn't a peer-drift, but for a reader arriving from §1–2 the term is dropped without anchor. Low-cost fix: parenthetical "(the set of germs at $p$)" pointing back to §1.
- "monodromy representation" (§3, line 502) is used a sentence after "monodromy" is introduced and is essentially self-defining in context — borderline OK, but a reader might benefit from "i.e. a homomorphism `\pi_1(U)\to \mathrm{Aut}(\text{stalk})`".
- "amplitwists" name-dropped in §7 coda (line 1092) with no in-page definition and not introduced earlier; it's a Needham-ism. The link to `complex-analysis.html` carries the explanation, so this is fine as a forward reference, but flag for a one-word substitution if a non-Needham reader is the target.
- "completion level $k$" (§7, line 1094) appears once with no expansion — what `k` means for an `L`-function is not defined here or at the linked target. Minor.

### Tone mismatches
- Voice is consistent with peers throughout — conversational-precise, second person used sparingly ("After the dust settles", "an exercise in careful bookkeeping"), short worked computations woven into prose. No drifts into dry-textbook or meme tone.
- §6 step-3 caption is dense to the point of opacity for a first reader: line 898's display equation lands with "After the dust settles (an exercise in careful bookkeeping)" as the only narration of where the `−1/(s(1−s))` term came from. Peer dirichlet (lines 848–852) is similarly terse but at least labels the move ("Split the integral at $x=1$, apply $\theta(1/x) = \sqrt x\, \theta(x)$ to the $[0,1]$ half"). Recommend one-sentence breadcrumb between "Split the integral at $x=1$" and the displayed formula.
- §7 closing line "Analytic continuation is not a trick — it is the organizing mechanism of modern number theory." (line 1097) is a touch grand for the Brilliant-style register; both peer codas are quieter (zeta-values §6 transitions sober-ly into MZVs; dirichlet §9 is a literal "what comes next" list). Stylistic, not a bug.

### Missing worked examples
- §4 (Schwarz reflection) has a worked widget but the surrounding prose lacks a numeric "compute me" moment — the widget shows `f(z)=z^3+0.3z` but the text never picks a specific `z` and walks through `f(z), f(\bar z), \overline{f(z)}` by hand. Peers consistently pair widget with one in-prose mini-computation. Minor.
- §5 (natural boundaries) discusses Ostrowski + the lacunary widget but never carries out a partial-sum bound for, say, `F(0.99)` in prose. The widget's readout fills that gap interactively — acceptable.
- All other numbered sections have a definitional move plus a paired widget plus, for §6, a four-step button-stepper. No empty definition-only sections.

### KaTeX macros / formatting
- Local KaTeX `macros:` block at the head (lines 36–43) declares `\Spec, \Gal, \Hom, \tr, \ad, \ind` — identical character-for-character to the peers' loaders. None of the six are actually used on this page (the page deals with `\zeta, \xi, \Gamma, \theta, \log` only); harmless but dead.
- KaTeX delimiters limited to `$…$`, `$$…$$`, `\(…\)`, `\[…\]` — canonical. No invented delimiters.
- No `\newcommand` / `\def` smuggled into the body; `\sqrt z` appears (e.g. line 502, 851, 896) as bare-arg — terse but legal LaTeX. No `\mathbb` re-aliasing (`\Z`, `\C`, `\R` not introduced); the target uses fully-qualified `\mathbb{Z}`, `\mathbb{C}` consistent with both peers.
- Inline number-line text uses `\to`, `\mapsto`, `\bar z` — all standard.

## Helper-block / widget-chrome hygiene
- Page-global helper at lines 187–238 deviates from the canonical (`category-theory.html`) helper in two places:
  - `drawArrow` defaults: target line 210 sets `pad1 ?? 0, pad2 ?? 4`, where canonical/category-theory and the section-peer `dirichlet-series-euler-products.html` (line 207) set `pad1 ?? 14, pad2 ?? 16`. Visible consequence: arrows on this page draw flush to the source point unless callers override `pad1`. Low-impact since the page rarely calls `drawArrow` (no `drawArrow` callsites found), but still a verbatim-copy violation.
  - `drawNode` wraps the label in `if(label!=null){…}` (lines 232–236) where canonical writes the label unconditionally. Functionally an extension (allows label-less nodes), not a regression, but again breaks the "copy verbatim" rule from `AGENTS.md` § "Page-global helpers".
- All widgets (§§1–6) use `.widget / .hd / .ttl / .hint / .readout / .row / .small / .note / .ok` chrome correctly. No ad-hoc class names. SVG `viewBox` present on every chart, `<title>` element present on every `<svg>` (verified via inline `title` children at e.g. lines 286, 390, 506, 640, 750, 916).
- Concept-quiz placeholders pair with concept ids in `concepts/analytic-continuation.json`: §1→`power-series-radius-analytic`, §2→`continuation-along-path`, §3→`monodromy-theorem`, §4→`schwarz-reflection`, §6→`zeta-functional-equation` — five concepts, five quiz divs. §5 (natural boundaries) and §7 (coda) intentionally have no quiz, which is consistent with peer treatment of "flavor" sections.

## Severity
minor polish

---
_Note to orchestrator: run `node scripts/rebuild.mjs` after any content changes._
