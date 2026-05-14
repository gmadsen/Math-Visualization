# arithmetic-statistics — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** analytic-number-theory, algebraic-number-theory

## Summary
The page is in good shape pedagogically — voice, widget rhythm, and helper-block hygiene match the section peers. Two genuine issues need attention: an undefined `\sha` macro that will leak as raw LaTeX in two places, and a mismatched closing tag at the end of section 6.

## Findings
### Notation drift
- **Discriminant notation drift (cosmetic).** `arithmetic-statistics` writes the discriminant as `$|\mathrm{disc}(K)|`/`\mathrm{disc}\,K$` (lines 238, 240, 242, 267); `algebraic-number-theory` consistently uses `$\Delta_K$` (lines 285, 287, 291, 293, 321, 329, 725). Since the target's section 1 explicitly hands off to algebraic-number-theory (`<a href="./algebraic-number-theory.html#discriminant">Discriminant of a number field</a>`), readers chasing the link will see the same object under two notations within seconds. Either pin to `\Delta_K` to match the link target, or add a one-line "we write $\mathrm{disc}\,K$ for $\Delta_K$" parenthetical at first use.
- **`\mathrm{rk}` mid-stream switch.** Section 3 writes `$\mathrm{rk}\,E(\mathbb{Q})$` (line 532), section 4 switches to `$\mathrm{rk}_\mathrm{an}=\mathrm{rk}_\mathrm{alg}$` (line 676), and the widget readouts in section 4 use plain `rank` in prose (line 666). Pick a single subscript convention (e.g. `\mathrm{rk}_{\mathrm{an}}` / `\mathrm{rk}_{\mathrm{alg}}` everywhere) and use plain `rank` only in widget-readout text.
- **No drift vs analytic-number-theory** on `\mathbb{Q}`/`\mathbb{Z}`/`\mathbb{F}_q`/`\mathcal{O}_K` — all three pages agree on `\mathbb{...}` and `\mathcal{O}_K`.

### Undefined jargon
- **`\sha` is used twice but never defined as a KaTeX macro.** Line 530: `$0\to E(\mathbb{Q})/\ell E(\mathbb{Q})\to\mathrm{Sel}_\ell(E)\to\sha(E)[\ell]\to 0$`; line 676: `…and $\sha$ is finite`. The page's macro block (lines 22–29) defines `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind` — no `\sha`. KaTeX has no native `\sha`; with `throwOnError:false` it will silently render as the literal text `\sha`. **High priority — this is a visible breakage**, not a stylistic preference. Fix by adding `'\\sha':'\\unicode{0x0428}'` or `'\\sha':'Ш'` to the macros block, or by writing it directly as `Ш` in the prose.
- **"Sha" in prose with no spell-out.** Even after the symbol renders, the term "Tate–Shafarevich group" is not defined or named anywhere on the page. Section 3 introduces `$\sha(E)[\ell]$` inside the Selmer exact sequence with zero gloss; a reader without BSD context will not know what to call this thing or that it measures local-to-global failure. Add a parenthetical "(the Tate–Shafarevich group $\sha(E)$, measuring local-to-global failure of the descent)" at first use, mirroring how `algebraic-number-theory` glosses every new symbol.
- **"Mordell–Weil rank" used before being unpacked.** Line 532 writes "$E(\mathbb{Q})$'s Mordell–Weil rank" — there is no prior sentence saying $E(\mathbb{Q})$ is finitely generated and its rank is the $\mathbb{Z}$-rank of the free part. The reader's-note callout to BSD softens this, but a one-clause inline definition would help.
- **"Selmer rank" vs "$|\mathrm{Sel}|$" used interchangeably.** Section 3 writes `\log_\ell|\mathrm{Sel}_\ell(E)|` (line 532) and then "If the $5$-Selmer rank were always $\ge 2$" (line 550) without defining "Selmer rank" as `\log_\ell |\mathrm{Sel}_\ell|`. Spell out the equivalence the first time.
- **"Hurwitz schemes / Hurwitz moduli spaces"** appear at line 393 and 786 with no definition. The reader's-note in the hero does not mention this; it is purely a consumer of `algebraic-geometry` / moduli vocabulary the reader may not own. A half-sentence ("…spaces parameterizing branched $G$-covers of the line") would discharge it.

### Tone mismatches
- **Section 4 widget caption breaks frame.** "small-height tables (Cremona) overrepresent high rank, and the average descends as $H$ grows" (line 690) is great, but the surrounding `avgRank(H)` model is a hand-tuned curve `0.5 + 0.6/sqrt(log H)`, not derived from anything; the caption presents it as if it were measured Cremona data. Either label the curve as a "schematic" / "toy model" (mirroring the candor of the analytic-number-theory PNT widget) or describe what the synthetic generator does. Cosmetic but reads as overclaiming.
- **Section 3 "the dazzling payoff" (line 550)** is a touch more breathless than the section-peer baseline (compare analytic-number-theory's measured "The result is Riemann's explicit formula"). Not wrong — the page voice does lean rhetorical — but it is a local high-water mark; consider toning to "the payoff" or "the consequence".
- **Take-aways present in §1 and §6 only.** Sections 2 (Cohen–Lenstra), 3 (Selmer), 4 (average rank), 5 (function fields) all end without a `<div class="ok">` synthesis even though the analytic-number-theory peer uses periodic synthesis blocks. The `<div class="note">` in §2 (line 507) is a technical aside, not the same gesture. Consider adding short take-aways to §3 and §4 to match the rhythm of §1 and §6.

### Missing worked examples
- **Section 5 (Function-field analogues) has a widget but no concrete computation in prose.** Compare §1 (closed-form constants $1/(3\zeta(3))$, $\approx 0.5601$ for $p=3$ CL probability), §2 (numerical CL values for $p=3$), §3 (numeric Selmer averages 3, 4, 7, 6). §5 is all conceptual prose ("normalized angles … become equidistributed") with no toy genus-2 curve carried through, no "for $\mathbb{F}_5$ and $g=2$ the eigenvalues live on…" example. The widget compensates partially but the prose feels thin.
- **Section 7 (Connections) is a pure link list.** This matches `algebraic-number-theory`'s outro and is fine; flagging only because the audit dimension asks about every `<h2>`.
- All six numbered sections do have at least one widget — registry adoption is fine.

### KaTeX macros / formatting
- **Local macro `\sha` used without being declared** — see Undefined jargon above. This is the only true KaTeX bug.
- **`\mathrm{Cl}` vs `\operatorname{Cl}`.** The target uses `\mathrm{Cl}` consistently (lines 373, 377). `algebraic-number-theory` also uses `\mathrm{Cl}(\mathcal{O}_K)` (lines 530, 722). Aligned.
- **Helper-block hygiene clean.** Lines 158–208 match `analytic-number-theory.html` lines 190–240 verbatim ($, $$, SVG, ensureArrow, drawArrow, drawNode). No deviations.
- **Widget chrome clean.** All five widgets (`w-cubic`, `w-cl`, `w-selmer`, `w-rank`, `w-katz`, `w-symmetry`) use `.widget / .hd / .ttl / .hint / .row / .readout / .small` — no ad-hoc classes. Color tokens (`var(--cyan)`, `var(--yellow)`, `var(--violet)`, `var(--green)`, `var(--pink)`) — no raw hex.
- **Mismatched closing tag (high priority — structural HTML bug).** Line 1046: `<div class="ok"><strong>Take-away.</strong> …Selmer / rank averages.</p>` — opens `<div>`, closes with `</p>`. The next sibling `<aside class="callback">` will end up nested inside the still-open `<div class="ok">`. Browsers will recover but the section-6 take-away block plus the See-also callback inherit `.ok` styling (green left border, green tint background) until the surrounding `<section>` closes. Compare §1 line 350 which correctly closes with `</div>`.

## Severity
minor polish (one structural HTML bug at line 1046, one undefined KaTeX macro `\sha` at lines 530 + 676, plus the discriminant-notation drift; everything else is cosmetic)
