# bsd — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** L-functions, modularity-and-flt

## Summary
The page is mostly polished, with strong narrative voice and dense interactive widgets per section. One semantic-grade defect: the `\Sha` macro is silently dropped at runtime by a duplicate-key bug in the KaTeX `renderMathInElement` call, which means every `$\Sha$` on the page falls back to KaTeX's "unknown command" handling. That is a regression of the issue #29 fix and is the only must-address finding.

## Findings
### Notation drift
- Semantic, KaTeX bug: `bsd.html:36–47` declares the `macros:` key twice in the same object literal — first `'\\Sha':'\\text{Ш}'`, then a six-entry block `'\\Spec':'\\operatorname{Spec}', …`. JS keeps only the last value, so `\Sha` is undefined at render time. Every `$\Sha$` and `$\Sha(E/\mathbb{Q})$` (lines 869, 870, 1148, 1295, 1300, 1301, 1303, 1304, 1307 (4×), 1370 (2×), 1372) renders as raw `\Sha` or with `throwOnError:false` swallowing it silently. `L-functions.html:36–44` and `modularity-and-flt.html:36–44` use a single `macros` block, so they avoid the bug; bsd is the only page that re-declares the key. (This is the same defect the 2026-04-22 changelog row claims to have fixed — it has regressed, likely because the `\Sha` entry was added back in a separate object instead of merged.)
- Cosmetic: `\operatorname{ord}` and `\operatorname{rank}` in `bsd.html#bsd-rank-equality` (line 864) and `\operatorname{rank}` in line 690 vs `\mathrm{ord}` and `\mathrm{rank}` in `L-functions.html#modularity` (line 1124) and `L-functions.html#special-values` (line 1227). category-theory.html uses `\operatorname{Hom}` / `\Hom`, so bsd's `\operatorname{}` form is the canonical one — recommend L-functions normalize to `\operatorname{}`, not the reverse.
- Cosmetic: bsd Section 1 prose writes the canonical height as `\hat h(P)` (line 270, 411, 614) but the same widget's readout (line 1199 label "ĥ(P₁)") uses Unicode `ĥ`. Internally consistent within widget chrome convention, but worth noting the prose ↔ readout split.
- Cosmetic: bsd uses `\mathrm{Sel}_n(E)` (line 1297, 1300) for the Selmer group; the rest of the page (and the readouts at lines 1342, 1352–1354) use plain `Sel_n`. Pick one; `\operatorname{Sel}` would match the rest of the macro convention.

### Undefined jargon
- "BCDT" (line 862) — first use, no expansion; the abbreviation Breuil–Conrad–Diamond–Taylor never appears on the page. modularity-and-flt.html spells it out at line 531 ("Breuil–Conrad–Diamond–Taylor 2001, general"). Recommend expansion or a parenthetical on first use.
- "newform" (line 862, in the §3 modularity-import sentence) used before being defined. The L-functions reference defines it at §4 ("a weight-$k$ cusp form that is also a simultaneous eigenform for all the Hecke operators"). bsd has no callback to L-functions.html#modular at the point of first use, only an end-of-section one to L-functions.html#modularity. A single inline link at first use would close the gap.
- "Heegner point" (line 1149) — first use is in a known-result bullet, with no parenthetical explanation and no callback to complex-multiplication.html (the backlink at line 1170 mentions Heegner numbers but is bottom-of-section, not adjacent to the first use).
- "$n$-descent" (line 1295, h2 paragraph) — quoted in scare quotes only at line 1307 ("\"$n$-descent\" machinery"); the prose elsewhere uses it as a known term. modularity-and-flt.html does not use the phrase, so there is no in-corpus precedent to lean on. A one-line gloss ("computing the kernel of multiplication by $n$ via Galois cohomology") would help.
- "principal homogeneous space (torsor)" (line 1301) is defined parenthetically — good. Worth flagging as the only properly-introduced advanced term; the others above could follow the same pattern.

### Tone mismatches
- Hero subtitle (line 256) is on-brand and conversational ("a million-dollar conjecture born on EDSAC printouts"). Matches the L-functions hero ("four costumes, one object") and modularity-and-flt's "Three ideas, one proof."
- §1 (Mordell–Weil) and §2 (Point-counting) read in the canonical "narrate → formula → widget → caveat" rhythm. Good.
- §3 has one wall-of-formulas moment: lines 860–870 deliver the Hasse–Weil $L$ definition, modularity import, weak BSD, and the refined formula in four consecutive blocks with only a one-line bridge between them. Compare with L-functions §3 which paces the same density across multiple paragraphs with a worked $a_p$ table between formulas. Not severe — bsd has earned the speed by §3 — but a 1–2 sentence orientation before the refined-BSD `<div class="note">` would help.
- §5 closer (lines 1370–1372) drops into telegraphic mode: "$R$ quantifies the *rational* points you see; $\Sha$ quantifies the rational points you don't see but locally 'should.'" Excellent voice. No drift.

### Missing worked examples
- All five sections have at least one widget. Coverage is dense — §3 alone has four widgets (BSD L-function zero, Leading-coefficient microscope, Rank-vs-L curve zoo, plus the `<div class="quiz">`). No section is pure-definition.
- §4 (Regulator) has only one widget and would benefit from a worked numerical example with the congruent-number curve $y^2 = x^3 - 25x$ that already appears in §5 prose (line 1370): plugging $\hat h(P_1) \approx 0.2529$, $\Omega \approx 2.621$ into the regulator widget would let the reader cross-check the refined-BSD formula numerically without leaving the page. Currently those numbers appear only in §5 narration.

### KaTeX macros / formatting
- `\Sha` is the local custom macro (line 37); see Notation drift above for the bug.
- All other macros are inherited from the canonical block (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) — match L-functions and modularity-and-flt verbatim. No reinvented delimiters; only `$…$` and `$$…$$` are used.
- `<title>` text inside SVG widgets at lines 424 and 1318 contains raw `$y^2 = x^3 - 2$` and "Selmer / Ш bookkeeping" — KaTeX does not render `<title>` (browser tooltip text), so those dollar signs leak as literal text in the accessibility name. Same pattern exists in L-functions and modularity-and-flt widget titles, so it is a corpus-wide convention rather than a bsd-specific drift; flagging only because the audit asks about KaTeX hygiene.
- Helper block at `bsd.html:188–237` is byte-identical to the category-theory.html template (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`). No deviations.
- Widget chrome uniformly uses `.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad / .small / .pill`. No ad-hoc classes introduced.

## Severity
minor polish (one semantic KaTeX-macro regression worth fixing now; the rest are cosmetic notation/tone polish)

---
*Reminder: the orchestrator runs `node scripts/rebuild.mjs` after any content changes — including any fix to the duplicate `macros:` key, which lives in `content/bsd.json`'s leading `raw` block.*
