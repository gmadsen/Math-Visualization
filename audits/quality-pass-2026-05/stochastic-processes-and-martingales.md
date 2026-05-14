# stochastic-processes-and-martingales — pedagogical audit (2026-05)

**Section:** Probability & statistics
**Compared against:** probability-theory, stochastic-calculus

## Summary
The page is in strong shape: notation, voice, and widget cadence all align with the section peers, and every numbered section ships with a poke-able simulator that mirrors the worked example in prose. The only items worth a second pass are a handful of jargon-before-definition pinches (UI, L¹, predictable quadratic variation), a Brownian-letter mismatch with the sibling stochastic-calculus page, and one misplaced `<footer>` tag.

## Findings
### Notation drift
- Brownian motion letter: target uses `W_t` throughout §6 ("the canonical example is **Brownian motion** $W_t$", line 972), matching probability-theory §12, but stochastic-calculus uses `B_t` consistently ("$dX_t=b_t\,dt+\sigma_t\,dB_t$"). The cross-page callbacks make this collision visible — clicking from target §6 into stochastic-calculus §1 the reader switches alphabets mid-flow. Low-priority cosmetic; pick one (or call out the equivalence).
- Quadratic-variation bracket: target uses both `\langle M\rangle_n` for predictable QV (line 690) and `[W]_t` for optional/path QV (line 695, 977, 982) within a few paragraphs. This is the standard probabilist distinction (predictable vs. observed compensator) but the page never names the difference. probability-theory and stochastic-calculus both use `[W]_t`/`[B]_t` only, so a one-sentence "in continuous time these agree" gloss would prevent the reader assuming they're typos for the same object.
- `\mathcal{F}_n^X` on target line 272 vs the rest of the page using `\mathcal{F}_n` for the natural filtration without the superscript-X — the superscript appears once and is then dropped. Cosmetic.

### Undefined jargon
- "UI martingale" appears in §2 (line 420): _"Every UI martingale is of this form for some terminal $Z=M_\infty$"_, but **uniform integrability** is only defined four sections later in §5 (line 824). First-time readers hit an undefined acronym mid-bullet. Either spell out "uniformly-integrable" with a forward pointer, or move the definition.
- "$L^1$ process" / "square-integrable" appear from §2 onward (line 413: _"An adapted, $L^1$ process $(M_n)_{n\ge 0}$"_) without a callback. probability-theory has the same drift, so a measure-theory callback at first use would be appreciated rather than treated as a defect.
- "predictable quadratic variation" is **bolded as a definition** in the §4 note (line 689) — but the same page has already used the bare phrase "quadratic variation" in §1's hero subtitle (line 264: _"quadratic variation $[W]_t=t$"_) and §3 implicitly via $S_n^2-n$. The hero/§4 definition gap is one section too long.
- "local martingale" appears once in the BDG note (line 985: _"For any continuous local martingale $M$"_) without definition or callback. Localization is a non-trivial concept; either drop the modifier (state BDG for true martingales first) or add a parenthetical "(allows blow-up at infinity, see stochastic-calculus)".

### Tone mismatches
- _None._ The voice — declarative theorem statements, immediate worked example, then poke-able widget — matches both peers. The hero paragraph (line 264) is a single ~70-word sentence and packs a lot in, but stochastic-calculus's hero is similarly dense, so this is a section convention.

### Missing worked examples
- _None._ Every numbered section §1–§6 has both a labelled `<strong>Worked example:</strong>` paragraph and a paired widget. §7 ("Connections") is the outro and intentionally widget-free, matching both peers' §7.

### KaTeX macros / formatting
- Only the six house macros (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) are declared, none of them used in target body — no novel macros introduced. Clean.
- Helper block at lines 188–243 deviates cosmetically from stochastic-calculus's verbatim version: target uses `"`-quoted SVG attribute strings where the reference uses `'`-quoted strings, and drops two comment lines (`// draw an arrow marker def…`, `// curved arrow…`, `// shorten endpoints`). Functionally identical, but AGENTS.md says "Copy verbatim from category-theory.html" and category-theory uses single quotes — drift is from the reference template, not toward it.
- Misplaced `<footer>` at line 1168: the page-bottom footer is rendered _inside_ `<section id="continuous-martingales">` (§6), before §7 ("Connections") even opens. It should sit after `</main>` like in both references. Visible bug — the footer renders in the middle of the page on long screens.
- `<ol>` directly inside `<p>` at lines 549–555 (Doob's three optional-stopping conditions) and `<ul>` inside `<p>` at lines 974–979 (Brownian martingales bullets): invalid block-in-inline HTML. Browsers auto-close the `<p>` so it renders fine, but the patterns appear in probability-theory too — corpus-level pattern, not target-specific drift.
- §2 line 420 has `\,UI\,` set as a bare word in math mode within `\mathbb{E}[\mathbb{E}[Z\mid\mathcal{F}_{n+1}]\mid\mathcal{F}_n]` discussion; "UI" reads as the product of variables U and I in math context. Lift "UI" out of any math fragment.

## Severity
minor polish
