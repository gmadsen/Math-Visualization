# probabilistic-method — pedagogical audit (2026-05)

**Section:** Combinatorics & graph theory
**Compared against:** extremal-combinatorics, expanders

## Summary
The page is in strong shape — voice, helper block, KaTeX macros, widget chrome, and notation all conform to the canonical template and to the section peers. A small handful of polish items (a stray markdown `*lemma*`, a few terms used before they are defined, one dry list-style passage) are the only drift worth touching.

## Findings
### Notation drift
- _Cosmetic only._ `\mathbb{P}` is used 16× in this page and 0× in `extremal-combinatorics.html` / `expanders.html`, but those references simply have very few probability statements; on the actual probability pages (`probability-theory.html` 46× , `large-deviations.html` 8× ) `\mathbb{P}` is the corpus convention, so this is consistent rather than drift.
- The "extremal" sibling writes the central inequality as `$\binom{n}{k} \cdot 2^{1 - \binom{k}{2}}$` (extremal-combinatorics.html#ramsey, line 655) while this page writes the *same* inequality as `$\binom{n}{k}\,2^{1-\binom{k}{2}}$` (probabilistic-method.html#ramsey, line 400). Functionally identical; thin-space vs `\cdot` is a stylistic micro-drift, not worth correcting.
- `\#` for "number of" appears in `\mathbb{E}[\#\{k\text{-independent sets}\}]` (line 516) and `\mathbb{E}[\#\text{bad sub-structures}]` (line 637). Neither reference uses `\#`; extremal prefers `\mathrm{ex}(n,H)` or just words. This is fine here but mildly inconsistent across the page itself: §3 uses `\#\{…\}` (set-of-things style), §4 uses `\#\text{…}` (verbal style). Pick one form.

### Undefined jargon
- "a.a.s." appears at §6 line 890 ("`X = 0` asymptotically almost surely (a.a.s.)") with the gloss inline — fine. But "with high probability" is used at §3 line 527 ("`α(G) < n^{1−θ/2}` with high probability") and "w.h.p." never gets the same parenthetical anywhere; minor, since the phrase is self-explanatory.
- §7 line 1052 introduces "configuration functions" inside the Talagrand note — quoted with scare-marks, defined only by gloss ("random variables that depend on independent inputs in a Lipschitz, certifiable way"). The term *certifiable* is the load-bearing one and is not unpacked. A reader who hasn't seen Talagrand will still get the gist, but won't be able to apply the inequality.
- §3 line 522 leans on "girth" without a one-line gloss. Extremal's analogous arc (§4 Ramsey) carefully restates "monochromatic", "$2$-edge-coloring" etc. The fix is one parenthetical: *(girth = length of the shortest cycle)*.
- §5 line 765 calls events **locally independent** in bold without defining the phrase before invoking it; the next sentence quietly equates it with "each `A_i` is independent of all but a few others". Reorder: define first, then bold-tag.

### Tone mismatches
- §7 lines 1032–1041 is a five-row reference table of inequalities followed by one short narration paragraph (line 1043). Compared to extremal's §4 (Ramsey numbers) where each row of the values table gets a sentence of context, the concentration table reads as a cheat-sheet drop-in. Not wrong, but a closer match to peer pacing would interleave one toy example per row, or at least name the typical use-case after each row (Markov: "barely useful, but everywhere"; Chernoff: "the workhorse for sums of Bernoullis"; Azuma: "for graph statistics revealed step-by-step"). Currently §7's prose-to-formula ratio is the lowest on the page.
- §8 line 1157 contains `*lemma*` — literal asterisks, not italics. HTML does not process markdown emphasis. Should be `<em>lemma</em>`. (This is also semantic: the sentence reads as if italics were intended for emphasis on "lemma", but the asterisks are visible.)
- The voice elsewhere is excellent — second-person nudges ("Drag the slider, redraw a few times", "You don't have to find that point", "no algorithm here") match the canonical category-theory / extremal cadence.

### Missing worked examples
- §8 (Connections) is intentionally outro / link-out, no widget needed — matches the pattern in extremal-combinatorics.html#outro and expanders.html#connections.
- All other numbered `<h2>` sections (1–7) carry a worked widget. No gap here.
- The §7 Concentration widget shows tail-bound bars for Markov / Chebyshev / Hoeffding / true tail, but the table introduces Chernoff and Azuma without a corresponding lane. A reader who reads §7 top-down and then drives the widget will look for "Chernoff" and "Azuma" rows and find Hoeffding instead. Either add a Chernoff row to the widget readout or rephrase the table caption to flag that Hoeffding subsumes Chernoff for the Bernoulli case.

### KaTeX macros / formatting
- Helper block at top of `<body>` (lines 187–239) and the head-level `macros:{…}` block (lines 22–29) are byte-identical to category-theory.html — verified by direct comparison. Helper-block hygiene: clean.
- No locally-defined macros beyond the six house ones (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`); none are even invoked on this page (the page's notation is operator-style, not macro-style). Clean.
- Widget chrome verified: every interactive uses `<div class="widget"><div class="hd"><div class="ttl">…</div><div class="hint">…</div></div>` plus `.row` / `.readout`. SVG nodes carry `viewBox` and `<title>`. No ad-hoc classes.
- One micro-issue: §6 line 906 writes `$X_T \to \mathrm{Pois}(c^3/6)$` with `\mathrm{Pois}`, while the readout at line 1016 (JS string template) writes `Pois((np)³/6)` in plain text. Cosmetic — JS readouts can't run KaTeX easily — but if the page introduces `\mathrm{Pois}` in math, the readout's plain `Pois` won't visually match. Standard pattern, ignore.

## Severity
minor polish
