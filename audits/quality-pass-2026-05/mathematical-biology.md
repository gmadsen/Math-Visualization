# mathematical-biology — pedagogical audit (2026-05)

**Section:** Probability & statistics
**Compared against:** stochastic-processes-and-martingales, probability-theory

## Summary
The page is well-structured, on-tone with the section, and every numbered section ships a substantive widget. A handful of small notation/jargon polish items remain but nothing is materially broken; the closing section also drops the canonical "Connections" `<h2>` numbering used by the two references.

## Findings
### Notation drift
- Distribution naming: target writes `$\mathrm{Binomial}(2N, k/(2N))$` (line 269) and `$\mathrm{Exp}(\binom{k}{2}))$` (line 654). probability-theory uses unstyled `\text{Uniform}[0,1]`, `\text{Exp}(1)` (lines 498, 631) for distribution names. Cosmetic; pick `\text{}` per probability-theory or document the `\mathrm{}` choice. Low priority.
- Probability symbol `$\mathbb{P}_k[\text{fix}]$` with square brackets (line 280) and `$\mathbb{P}_p[\text{fix at }1]$` (line 550) vs. probability-theory's near-uniform `$\mathbb{P}(...)`/`$\mathbb{E}[...]` convention (e.g. line 275, 386). Two pages can disagree on whether `\mathbb{P}` takes parens or brackets, but the target itself flips between `\mathbb{P}[...]` (line 280, 433, 550) and `\mathbb{P}(\dots)` is never used — internally consistent, but mismatched against the section peers' use of parens around event arguments. Low priority.
- Generator notation `$\mathcal{L}$` on line 548 — fine, but not previously introduced; stochastic-processes uses `\langle M\rangle` and `[W]_t` with explicit naming, the target should at least say "infinitesimal generator $\mathcal{L}$" once before deploying it (it does so on the same line, OK).
- Center spelling: target uses both "centre" (line 825, 1005, 1142) and "center" never; consistent within the page but probability-theory uses "centre of mass" once (line 854). Cosmetic, no action needed.

### Undefined jargon
- "ESS" appears in the widget small-text caption ("a stable interior fixed point that's an ESS", line 1005) and in the post-game readout (line 1109) before the abbreviation is unpacked in the trailing `.note` ("evolutionary stable strategies (ESS)", line 1142). High priority: a reader scanning the widget meets the acronym cold. Move the unpacking up, or expand inline at first use.
- "hawk-dove-retaliator" appears as a button label and in the same caption (line 1000, 1005) with no prose explanation of what hawks/doves/retaliators do; the payoff matrix is in code-only at line 1014. The widget caption could absorb a single sentence: "hawk-dove-retaliator pits aggressive, peaceful, and conditional strategies; payoff matrix below."
- "Tajima's $D$", "site-frequency spectrum", "$F_{ST}$", and "ABC" all appear in the §4 `.ok` callout (line 796) without definitions or callbacks. They are explicitly billed as forward references ("the engine of modern population genetics"), so this reads as breadcrumbs rather than load-bearing jargon — acceptable as flavor, but a "see computational-molecular-biology" pointer would tighten it.
- "ancestral recombination graph", "background selection", "genetic draft" appear in the Connections paragraph (line 1264) with no link or sketch; same caveat as above — flavor-only, low priority.
- "Haldane–Muller's principle" (line 1168): named theorem stated cleanly with the formula, OK; minor — readers may not know who Haldane or Muller are (the page gives Haldane elsewhere as 'Haldane's classic' on line 443, but Muller is a fresh name).

### Tone mismatches
- The page is on-tone overall: conversational asides ("variation bleeds out", line 282; "a juggernaut in a population of $10^6$", line 628; "selection's strongest effect is at low frequency", line 455) match probability-theory's voice ("posteriors on rare conditions are dominated by the false-positive rate", PT line 395) and stochastic-processes ("none of the three sufficient conditions hold", SP line 559).
- One slightly textbook-flat passage: §5 hero paragraph (lines 817–821) reads as straight history then straight derivation with minimal narrative scaffolding — compare stochastic-processes §3 (line 547+) which interleaves theorem statement with motivation. Low priority.
- Hero `<p class="sub">` (line 261) ends with "ecology and evolutionary game theory are on the back half" — implies a sequel page that doesn't seem to exist in the section roadmap (per AGENTS.md §5). Either reword to "covered below in §5–§7" or drop. Cosmetic but confusing on first read.

### Missing worked examples
- §7 (Mutation–selection balance) has its widget and the Haldane–Muller derivation, OK.
- §8 (Connections) is unnumbered in the prose but TOC labels it "8" (line 250). probability-theory's closing connections section is `<section id="outro">` and uses a same-style bullet list; stochastic-processes also has `<h2>7. Connections</h2>`. Target uses bare `<h2>Connections</h2>` (line 1262) with no numeral, breaking the §1–§7 pattern. Low priority — cosmetic but a paper-cut on TOC consistency.
- All seven content sections have at least one interactive widget. No section is "pure definition with no toy". Strong showing here.

### KaTeX macros / formatting
- The page declares the standard six-macro block (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) at lines 22–29, identical to probability-theory and stochastic-processes — none are used on the page (verified via grep). No new local macros introduced; no re-invented delimiters. OK.
- Helper script block at lines 187–239 is byte-identical to category-theory's helper (`diff` returns empty). OK.
- Widget chrome uniformly correct: every widget uses `<div class="widget">` + `.hd / .ttl / .hint / .row / .readout / .small`, and notes use `.note / .ok / .bad`. No ad-hoc classes spotted.
- One stylistic micro-issue: the §3 Kimura formula uses `\partial_p^2` and `\partial_p` (line 548) while the same page already used `\partial_t` (line 550) — fine, but worth noting that the section peers' Brownian/Itô treatments tend to write `\frac{\partial^2}{\partial p^2}` for clarity in display math. Cosmetic.
- Two SVG-text math labels use plain Unicode rather than KaTeX (e.g. `'allele frequency p_n'` line 380, `'σ = 2Ns = '+...` line 617, `'q̂'` and `'×'` in readouts). This matches the stochastic-processes / probability-theory practice in `.readout`/SVG text — KaTeX is restricted to HTML prose, not SVG `<text>` — so no action needed. Documenting only.

## Severity
minor polish
