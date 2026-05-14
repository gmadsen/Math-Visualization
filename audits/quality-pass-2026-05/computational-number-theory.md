# computational-number-theory — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** mathematics-and-cryptography, algebraic-number-theory

## Summary
Tone, voice, and worked-example density are on par with both peers; the page is clearly written and every numbered section has at least one widget. The real defects are mechanical: blackboard-bold notation drifts away from the section convention (`\mathbb F_p` unbraced vs the peers' `\mathbb{F}_p`), several callback asides are duplicated by the auto-injector, and several anchor targets in callbacks and the Connections list don't exist on the destination pages.

## Findings
### Notation drift
- `\mathbb F_p`, `\mathbb F_2`, `\mathbb Z`, `\mathcal O_K`, `\mathfrak p` (unbraced single-letter argument) are used throughout CNT (e.g. line 319 `$\mathbb F_2$-linear`, line 429 `$E/\mathbb F_p$`, line 461 `$\mathcal I(\mathcal O_K)$`, line 468 `$\mathfrak p$`). Both peers use the braced form: ANT line 538 `$\mathbb{F}_p$`, line 522 `$\mathcal{O}_K$`, line 507 `$\mathfrak{p}_1$`; crypto line 318 `$\mathbb{Z}/n$`, line 586 `$\mathbb{F}_p$`. Settle on the braced form for cross-page consistency. (Cosmetic but pervasive — high-frequency drift.)
- `\mathrm{Cl}(K)` in CNT line 461 vs ANT's `\mathrm{Cl}(\mathcal{O}_K)` (line 529, 720). Same operator, different argument convention. Pick one — `\mathrm{Cl}(\mathcal{O}_K)` is the ANT standard the section is built on.
- CNT introduces `P(\mathcal O_K)` (line 461) for principal ideals; ANT writes `\mathcal{P}_K` (line 529). Symbol drift on the same object across two pages in the same section.
- CNT writes `\mathcal I(\mathcal O_K)` (line 461) for fractional ideals; ANT writes `\mathcal{I}_K` (line 529). Same drift pattern.

### Undefined jargon
- "Smith normal form" appears at section 6 line 470 and inside the widget hint at line 476/479 with no definition or callback. Neither peer page defines it; the closest concept lives on a different topic (commutative algebra), so a one-line gloss in the prose ("the unique diagonal form `diag(d_1|d_2|...)` of an integer matrix under unimodular row/column ops") would prevent a reader from bouncing.
- "Hecke $L$-functions" is name-dropped in the GRH parenthetical at line 465 ("generalized Riemann hypothesis for Hecke $L$-functions of $K$ holds") with no definition or callback. The reader who needs Buchmann is the reader who hasn't met Hecke yet. Either drop the qualifier ("under GRH") or add a one-clause gloss.
- "Carmichael numbers" at line 268 are immediately defined ("pass Fermat for every base coprime to $n$") — fine, just noting the contrast model.
- `L_n[\alpha,c]` notation: defined in a `.note` at line 321, but used twice (lines 303, 319) before that note. Move the definition above the first use, or at minimum make the first use reference the note explicitly.
- "subexponential" is used at line 303 and again at line 465 without ever being unpacked beyond the `L_n` formula. A half-sentence ("between polynomial and exponential — see the L-notation note below") would tighten the first appearance.

### Tone mismatches
- _None._ Voice tracks the peer pages: conversational ("the trouble:", "the trick:", "Primality is in P. Factoring is conjecturally not."), short paragraphs, second-person framings ("How do you decide whether a 1024-bit integer is prime?"). Matches both ANT and crypto comfortably.

### Missing worked examples
- Section 4 (Modular arithmetic algorithms) has three subsections — Fast modular exponentiation, Tonelli–Shanks, CRT — but only the first gets a widget. Tonelli–Shanks and CRT are pure prose. Either fold them into the square-and-multiply widget (e.g. add a "compute square root mod p" or "CRT-glue residues" mode) or split section 4 into two numbered sections so the orphaned subsections are not advertised by an h3 they can't pay off.
- Otherwise per-section coverage is fine: §1 Miller–Rabin, §2 Pollard ρ, §3 LLL, §5 Schoof CRT, §6 Buchmann SNF.

### KaTeX macros / formatting
- KaTeX macro block (lines 22–29) is byte-identical to the peer pages. No new local macros introduced. Good.
- Helper `<script>` block at top of `<body>` (lines 187–239) is byte-identical to category-theory.html. Good.
- Widget chrome uses `<div class="ttl">` (matches ANT and category-theory.html). The crypto reference uses `<span class="ttl">` — that is the outlier, not CNT.
- **Duplicate callback asides** (high priority): section 3 (LLL) has a hand-authored `<aside class="callback">` at line 362 immediately followed by the auto-injected one at line 370 that re-includes the same lattice-based-cryptography link plus extras. Same pattern in section 6 (class-group): hand-authored aside at line 486 followed by auto-injected at line 495, both linking to `#class-group-units` and `#prime-ideals`. This produces two stacked "See also" boxes per section. Remove the hand-authored asides; the auto-injector is the source of truth and `audit-callbacks.mjs --fix` will keep it current. (Editing is on the JSON side per AGENTS.md, not the HTML.)
- **Broken anchors in hand-authored callbacks** (high priority — silent 404):
  - `./algebraic-number-theory.html#prime-ideals` (line 489) — no such id on ANT; the prime-ideal section is `#ramification`.
  - `./algebraic-number-theory.html#class-group-units` (line 490) — no such id; ANT uses `#class` (class group) and `#units` (Dirichlet unit theorem).
  - `./mathematics-and-cryptography.html#elliptic-curve` (line 514, Connections list) — actual id is `#ecc`.
  - `./complexity-theory.html#p-and-np` (line 516) — actual id on that page is `#p-np`.
  These are silent 404s by AGENTS.md's anchor-contract terminology. Worth a focused fix-pass.

## Severity
minor polish (mechanical fixes — notation-brace pass, dedupe two callback asides, fix four broken anchors, gloss "Smith normal form"; pedagogy and structure are sound)
