# forcing-and-independence — pedagogical audit (2026-05)

**Section:** Logic & Foundations
**Compared against:** zfc-and-ordinals, naive-set-theory

## Summary
Strong, well-paced page — seven sections, five live widgets, the "build a generic filter step by step" widget is a standout illustration of an idea that usually arrives only as prose. Main drift items are minor cosmetic notation inconsistencies (unbraced `\mathbb P/\mathcal D`, single line of `\mathbb{P}` in §7) and a cluster of named theorems / objects (Suslin tree, Aronszajn tree, Whitehead group, $\diamondsuit$, $\Delta$-system, Easton, GCH) that get name-dropped in §6 without a one-line gloss.

## Findings

### Notation drift
- `\mathbb P` and `\mathcal D` are unbraced throughout the body (e.g. §1 line 269 `(\mathbb P,\le)`; §6 line 953 `\mathcal D` in MA), but a single occurrence in §7 line 1062 is braced as `\mathbb{P}`. Pick one. Both peers (`zfc-and-ordinals`, `naive-set-theory`) are themselves split (`\mathbb R` vs `\mathbb{R}`), so the corpus has no settled convention — flagging only the in-page inconsistency.
- `CH` notation is mixed but defensibly so: plain `CH` in prose, `\mathrm{CH}` in display math (line 712 `M[G]\models\neg\mathrm{CH}`, line 855 result row). `zfc-and-ordinals#ch` matches this. Consistent across both pages — no action.
- Operator naming: `\operatorname{Fn}` (line 705) and `\operatorname{cf}` (line 841) follow house convention; `\Vdash` is a built-in KaTeX macro. No drift here.
- The `data-concept` for §6 quiz placeholder is `forcing-applications` (line 965) but the section `<h2>` is "Other independence results **and Martin's axiom**" — the concept entry in `concepts/forcing-and-independence.json` is also titled "Other independence results" without the MA bit. Cosmetic; concept blurb does mention MA so harmless. Tag for a sweep but not blocking.

### Undefined jargon
- §6 table (lines 944–948) and the §6 dependency widget (lines 977–1001) introduce **Suslin tree / Suslin hypothesis (SH)**, **Whitehead problem / Whitehead group**, **$\diamondsuit$ (Jensen's diamond)**, **Aronszajn tree**, **iterated forcing**, **Borel determinacy / pointclass**, **Laver preparation**, all without defining any of them. The §6 hero paragraph also mentions "Suslin, Whitehead" as the rhetorical hook (line 260 hero sub) — fine for the sub, but by the time `<table class="plain">` lists "Solovay–Tennenbaum iterated forcing" and "Jensen's $\diamondsuit$ in $L$" the reader needs at least a one-line gloss per row. Compare zfc-and-ordinals §7, which name-drops the large-cardinal tier-list but at least says what each tier *means* in the widget readout.
- §4 "$\Delta$-system argument on the finite supports" (line 710) — `\Delta`-system lemma is invoked twice (line 710 and line 809 result row) without statement. The forcing argument actually works fine without it for the reader's intuition; a one-line "(every uncountable family of finite sets contains an uncountable subfamily with common pairwise intersection)" parenthetical would suffice.
- §5 "**Easton's theorem**" (note at line 841) and "Easton (1970)" (widget readout line 927) — name-dropped but never glossed. Closest peer treatment: zfc-and-ordinals doesn't name Easton at all. One-line summary ("ZFC pins down only König-style cofinality constraints; the rest of the continuum function $\alpha\mapsto 2^{\aleph_\alpha}$ on regular cardinals is freely arrangeable") would land it.
- §5 "**GCH**" (note at line 859 widget data, "$L\models$ GCH") — first appearance, never expanded. zfc-and-ordinals#ch *does* mention "GCH" but also doesn't define it. The forcing peer §7 line 998 widget readout *does* spell it out: "generalized continuum hypothesis: 2^ℵ_α = ℵ_{α+1}". Promote that gloss to first prose mention.
- §1 "**ccc** preserves cardinals" (line 289) — `ccc` is defined inline two clauses earlier ("every antichain is countable"), so this one is *fine*. Flagging here only because §4 line 710 reintroduces it as if for the first time ("$\mathbb P$ has the **countable chain condition (ccc)**"). Pick first or second introduction; don't do both.
- §2 widget readout uses "M-generic", "upward closure of the chain", "Cohen real over M" — all defined in the surrounding prose, so this is good.
- §6 outro paragraph "**proper-forcing axioms (PFA, MM)**" and "**inner-model program (Mitchell, Steel)**" (line 1068 small-text frontiers paragraph) — that's the explicit "open frontiers" footer, where namedrops are conventionally allowed. Mirrors zfc-and-ordinals' equivalent. No action.

### Tone mismatches
- Voice and pacing match `zfc-and-ordinals` very closely — same conversational hero, same numbered sections with widget per concept, same use of `<div class="ok">` / `<div class="note">` / `<div class="bad">`. No drift.
- §6 "**The big picture**" note (line 963: "the set-theoretic universe is not a single object — it is a multiverse, and forcing is the device that lets us hop between members") is on-voice — better than the equivalent peer outros, in fact.
- §6 prose-then-table-then-widget rhythm is denser than the §1–§5 rhythm (which is prose-then-widget-then-`.ok`-box). Not wrong, just slightly different. Could be intentional given §6 is a survey rather than a build.
- §3 widget intro line 588 says "**lets you flip a condition $p$**" but the widget actually has *buttons* for each of seven preset conditions, not a flippable thing. "select a condition" or "click a condition" would match the actual interaction. Compare §1 hint ("click a 'question' to highlight a dense set"), which is precise.

### Missing worked examples
- §5 ("Independence of CH") is structured as a 5-row proof table (lines 805–814) followed by the aleph-ladder widget. The table is excellent; the widget illustrates *where* the continuum can land but doesn't dramatize *why* `\operatorname{Fn}(\aleph_2\times\omega,2)` lands it at $\aleph_2$. A small "watch one of the $\aleph_2$ generics emerge" toy — even a static table of "$r_0, r_1, r_2, r_\omega, r_{\omega_1}, r_{\aleph_2}$" with rows showing the bits each one has pinned — would close the loop between §4's single Cohen real and §5's $\aleph_2$-many. Currently the reader has to take "$D_{\alpha\beta}$ is dense" (line 810) on faith.
- §6 ("Other independence results") has the dependency-graph widget, which is nice but is essentially a static name-graph with explanations. Given the section invokes 6+ named theorems, a "pick a question, see which forcing settles it" guided table (analogous to §1's button-driven dense-set highlighter) would make the survey interactive in the way §1–§4 are. Lower priority — survey sections legitimately lean more on prose.
- §3 ("Forcing relation and truth lemma") forcing-relation-table widget shows what a single condition forces about *atomic* formulas. The truth lemma covers all formulas; one extension that demonstrates the *recursion* (e.g. show that $p\Vdash\neg\varphi$ iff no extension forces $\varphi$, by toggling between two conditions) would let the reader feel the negation clause that the box-text (line 575) names but doesn't unpack. Not blocking — current widget is fine — but worth a follow-up.

### KaTeX macros / formatting
- No bespoke macros introduced. Page uses only the head-block standard set (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) and stock KaTeX (`\Vdash, \models, \aleph, \omega, \operatorname{Fn}, \operatorname{cf}, \mathbb, \mathcal`).
- Helper `<script>` block at lines 187–239 is byte-identical to `zfc-and-ordinals.html` — confirmed via `diff`. Clean.
- All five widgets use the standard `.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad` chrome. No ad-hoc classes.
- `js/katex-select.js` is loaded (line 178), needed because §5's `<select id="ch-target">` has options like `ℵ₂ (Cohen's original ¬CH model)` — Unicode aleph not LaTeX, but `js/katex-select.js` doesn't hurt and matches house convention. (One quibble: the option labels mix Unicode `ℵ₂` and LaTeX `ℵ_ω+1`; pick one. Currently uses Unicode in `<option>` but LaTeX in surrounding prose.)
- §6 widget readout (line 999, MA explanation) embeds a hard-coded `'…implies SH, settles many combinatorial questions.'` — relies on the reader having seen SH defined, which they have not (see §6 jargon item).
- All `<svg>` elements have `viewBox` and `<title>` — clean a11y.

## Severity
minor polish
