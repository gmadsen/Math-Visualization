# gauge-theory — pedagogical audit (2026-05)

**Section:** Mathematical physics
**Compared against:** quantum-field-theory, string-theory

## Summary
The page is mathematically rigorous, well-paced, and every numbered section ships a working widget — pedagogically it is in strong shape. The most important issues are mechanical hygiene rather than voice or notation: the head and four section bodies carry duplicate-callback / duplicate-stylesheet blocks that the auto-injectors did not deduplicate, and a handful of jargon items (Hodge star, Maurer–Cartan tail, second Chern character) are used a beat before they are defined.

## Findings
### Notation drift
- Hyphen vs en-dash for proper-noun compounds: gauge-theory uses ASCII hyphens throughout (`Yang-Mills`, `Chern-Simons`, `Seiberg-Witten`, `Belavin-Polyakov-Schwartz-Tyupkin`, `Atiyah-Singer`, `Atiyah-Segal`, `Aharonov-Bohm`, `Maurer-Cartan`, `Kirby-Siebenmann`, `Faddeev-Popov`); string-theory uses Unicode en-dashes (`Calabi–Yau`, `Strominger–Yau–Zaslow`, `Picard–Fuchs`, `Neveu–Schwarz`, `Majorana–Weyl`, `Kapustin–Witten`, `Kac–Moody`). QFT mostly hyphenates too. Cosmetic, but cross-section consistency would prefer en-dashes for two-name theorems/objects per typographic norm — settle one direction. Low priority.
- Holonomy notation: gauge-theory uses `\mathrm{Hol}_A(\gamma; p_0)` (line 542); QFT does not use holonomy and string-theory only references it indirectly. Internally consistent — no action.
- Bundles / Lie-algebra notation matches across all three (`\mathfrak{g}`, `\mathbb{R}^4`, `\mathbb{Z}`, `\mathrm{Ad}`, `\mathrm{Hol}`, `\tr`) — no drift from category-theory's macro set. The shared head macros (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) are identical to category-theory's; gauge-theory uses `\tr` consistently rather than re-introducing `\operatorname{tr}` inline.

### Undefined jargon
- "Hodge star $*\colon\Omega^k\to\Omega^{4-k}$" appears at §4 line 632 with no prior introduction or callback — the reader is expected to know it. Differential-forms.html exists; a one-line callback ("see Hodge star on `differential-forms.html#hodge`") would close the gap. Medium priority.
- "Maurer-Cartan tail" §3 line 540 — the term is dropped without definition; previous text only calls $g^{-1}dg$ "the inhomogeneous tail." Either drop the proper noun or gloss it ("the Maurer–Cartan form $g^{-1}dg$ on $G$"). Low–medium.
- "Second Chern character" §5 line 732 — used to motivate the transgression formula; defined nowhere on this page and only cross-linked to characteristic-classes via callback. A parenthetical "(the 4-form $\tr(F\wedge F)/(8\pi^2)$)" would suffice. Medium.
- "Frobenius-integrable" §2 line 396 — used in passing to describe the role of curvature; reader unfamiliar with Frobenius's theorem will not extract the intended meaning. Low.
- "Spin$^c$ structure" §7 line 1055 — defined inline ("always exists when $X$ is simply-connected and almost-complex; classified by $H^2(X;\mathbb{Z})$"), so this is OK.
- "Uhlenbeck compactification" §7 line 1053 — defined inline ("allowing instantons to bubble off at points"). OK.
- "BPST instanton" §4 line 644 — full surname expansion in parentheses. Good model — apply the same treatment to "Atiyah-Segal axiomatization" §5 line 744 (currently bare).

### Tone mismatches
- _None._ Voice is consistent: the conversational-but-precise register of category-theory is maintained throughout (e.g. line 274 "make the Lie algebra $\mathfrak{g}$ visible inside $TP$"; line 1043 "Dimension 4 is uniquely strange"). Comparable to QFT and string-theory in register. The §8 "Connections" outro is appropriately reflective rather than sales-y.

### Missing worked examples
- _None._ All seven numbered concept sections (§1–§7) ship a widget with sliders / clickable diagrams / Monte Carlo evolution: U(1) horizontal lift, abelian curvature density, U(1) Wilson loop, BPST profile, Chern-Simons knot/Jones, 2D U(1) Metropolis, SW basic-class table. §8 is a connections-outro by design (matches QFT and string-theory) and correctly carries no quiz.

### KaTeX macros / formatting
- Macro set in head (lines 22–29) is verbatim identical to category-theory.html / QFT / string-theory — no locally-introduced shorthands. Good.
- Delimiters: only the four standard `$…$` `$$…$$` `\(…\)` `\[…\]` are used; no ad-hoc.
- Helper-block (lines 195–243) is a verbatim copy of category-theory's `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` block. Good.
- Widget chrome conforms to the standard `.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad` vocabulary; no ad-hoc classes spotted.
- High-priority hygiene issue (semantic, not cosmetic): four sections emit a manual `<aside class="callback">` immediately followed by an auto-fenced duplicate of the same block: §1 (lines 303–309 then 311–319), §2 (432–437 then 439–445), §5 (762–767 then 769–775), §7 (1096–1101 then 1103–1109). Reader sees "See also" twice in a row. `grep -c 'class="callback"'` returns 8 for gauge-theory vs 1 for QFT and 6 for string-theory — string-theory has the same bug less severely; QFT is clean. Likely caused by a hand-authored callback that was later re-injected by `audit-callbacks.mjs --fix` without removing the original. Should be repaired by deleting the manual blocks (the auto fences own the content).
- Head-block hygiene (low priority, not unique to gauge-theory): `print.css` and `theme-light.css` are loaded twice (lines 171–172 and 177–178). The display-prefs CSS rules are duplicated inside the topic `<style>` block (lines 154–160) and again inside the auto-fenced section (162–168). String-theory and QFT show the same pattern, so this is an injector / scaffold artefact rather than a per-page authoring issue.

## Severity
minor polish — strong content; recommend a callback-deduplication pass plus a few one-line jargon glosses.
