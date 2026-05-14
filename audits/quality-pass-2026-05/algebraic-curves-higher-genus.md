# algebraic-curves-higher-genus — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** elliptic-curves, moduli-spaces

## Summary
A strong, dense page that lands its core arc (Riemann–Roch → canonical embedding → hyperelliptic → $\mathcal{M}_g$) with five interactive widgets and tight cross-page callbacks. Drift is mostly cosmetic notation (`\mathrm{Pic}` vs. `\operatorname{Pic}`), with one mild jargon-before-definition slip in the hero summary.

## Findings

### Notation drift
- `\mathrm{Pic}(C)`, `\mathrm{Jac}(C)`, `\mathrm{Div}(C)`, `\mathrm{AJ}`, `\mathrm{Sym}^d` (target lines 427–431, 909) versus `\operatorname{Pic}^0(E)` and `\operatorname{Aut}(E)` in elliptic-curves.html (lines 387, 390, 959, 1030) and `\operatorname{Aut}(C)` in moduli-spaces.html (lines 324–326, 464, 508). Both pages adopt the page-local macro `\Hom = \operatorname{Hom}` so `\operatorname{...}` is the established house convention; switching to `\mathrm{...}` for the new operators is a low-priority cosmetic drift but is genuinely cross-page-inconsistent (`\mathrm{Pic}` here at line 427 vs. `\operatorname{Pic}^0(E)` in the linked elliptic-curves page at line 387).
- `\mathrm{Princ}(C)` (target line 427) for the principal-divisors subgroup is freshly introduced and not echoed elsewhere; either `\operatorname{Princ}(C)` or simply naming it inline ("the subgroup of principal divisors") would match house style.
- `\mathrm{Im}\,\tau` (target line 446) versus the standard `\operatorname{Im}` family. Cosmetic.
- `\Gal(C/\mathbb{P}^1) = \mathbb{Z}/2$ (target line 633) uses the page macro correctly, matching elliptic-curves's `\Gal(\bar k/k)` (line 959). No drift here, but worth noting as a positive consistency.
- "$\mathcal{M}_{1,1}$" is used in both moduli-spaces (everywhere) and the target table (line 785). Anchor-link target uses `\mathcal{M}_g` in TOC label (line 250) rendered as KaTeX inside a TOC `<a>`, mirroring the elliptic-curves and moduli-spaces convention. Consistent.

### Undefined jargon
- "$\theta$-divisor pathologies" (target line 278, hero of §1) appears before the $\theta$-divisor is named again at line 431 ("a principal polarization (the $\theta$-divisor)"). The hero sentence asks the reader to remember a term that hasn't been introduced and isn't a prereq callback. Mild — a parenthetical "(the principal polarization on the Jacobian; defined in §2)" or simply dropping `$\theta$-divisor pathologies` from the preview list would fix it.
- "Hodge class $\lambda$" (line 909) is named once with no gloss; the surrounding sentence assumes the reader knows the tautological-ring convention. Low priority — this is the closing aside of §6, after the reader has earned context.
- "Petri's theorem in low genus" (line 565) is stated in passing in the §4 list of low-genus canonical models without a gloss; the callback at line 621 names it again under Brill–Noether but the in-text use at 565 has no defining clause.

### Tone mismatches
- The page's voice is generally on-key with category-theory.html — second-person nudges ("Everything below is the catalogue…", "two visceral consequences"). One mild stretch: the §1 hero paragraph (line 278) is two sentences long and cycles through five technical terms ($j$-invariant, $\theta$-divisor, Weierstrass, hyperelliptic, $\mathcal{M}_g$) before any of them have been introduced. Reads more like a textbook abstract than the conversational openings used in elliptic-curves §1 ("Informally, an *elliptic curve*…") and moduli-spaces §1 ("Informally, a **moduli problem** asks…").
- The §3 worked-example paragraph (line 524) opens "**Worked example:**" then dives into Weierstrass gap sequences without re-anchoring the reader; would benefit from one transition sentence. Minor.

### Missing worked examples
_None._ Every numbered §1–§6 ships with at least one widget plus an inline computation. §7 ("Connections") is intentionally narrative and matches the closing-section pattern of category-theory.html and elliptic-curves.html (§7 outro both there and here is link-roll, not widget).

### KaTeX macros / formatting
- Helper-block contents (target lines 189–241) are byte-identical to category-theory.html / elliptic-curves.html (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`); good.
- KaTeX delimiter set in the loader (lines 14–20) matches house convention exactly.
- Macro list (lines 22–29) is the standard six-entry block (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`); no locally-introduced macros. The page uses the house macros where available (`\Gal` at line 633) but reaches for `\mathrm{Pic}`, `\mathrm{Jac}`, `\mathrm{Div}`, `\mathrm{Sym}` rather than `\operatorname{...}` — see Notation drift.
- Widget chrome (`.widget / .hd / .ttl / .hint / .readout / .row / .small`) is used consistently across all five interactives; no ad-hoc class names spotted.
- SVGs include `viewBox` and `<title>` (lines 294, 646, 799) — a11y baseline met.
- One small inconsistency: the §2 lattice widget (lines 433–444) and §3/§4 proof-scrubbers (lines 484, 568) use the registry-backed `MVLatticeVisualizer` / `MVProofScrubber` runtimes, while §1 / §5 / §6 hand-roll their own SVG widgets. That's fine and matches the pattern in elliptic-curves (which mixes hand-rolled SVG and `MVLatticeVisualizer`), but the hand-rolled widgets do not wrap in `<div class="widget">` with `.hd / .ttl / .hint` as crisply as the helper does — actually they do (e.g. lines 292–306, 644–653, 797–806), so this is a non-issue. Recheck confirms chrome is uniform.

## Severity
minor polish

---
_Orchestrator: run `node scripts/rebuild.mjs` after any content changes._
