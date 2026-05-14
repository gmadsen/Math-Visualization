# real-analysis — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** measure-theory, complex-analysis

## Summary
Strong, dense page (18 sections, every one with a worked widget), notation matches peers, voice is consistent with category-theory's "conversational-but-precise" template. One genuine bug: a paragraph in §8 has lost its KaTeX delimiters and renders as raw text. Higher-priority polish item is that §§12–18 lean heavily on measure-theoretic vocabulary that is never callback-linked from the section where it is first invoked.

## Findings
### Notation drift
- _None of consequence._ Real-analysis uses `\mathbb{R}` (braced) uniformly (~46 hits); complex-analysis matches; measure-theory has 2 strays at lines 618–619 (`\mathbb R` unbraced) — the drift is *theirs*, not the target's. `\Hom`, `\mathrm{BV}`, `\mathrm{AC}`, `\mathrm{supp}`, `\mathrm{loc}`, `\mathrm{int}` follow the macro-block conventions used elsewhere.
- Cosmetic: `\operatorname{vol}` at line 1046 is the only inline use of `\operatorname` on this page (everywhere else is `\mathrm{...}`). Either is fine, but pick one for "operator-style names" within the page.

### Undefined jargon
- **High-impact (semantic):** §13 (`bump-functions`, line 1849) introduces `$f\in L^1_{\mathrm{loc}}(\mathbb{R})$` and "$f_\varepsilon \to f$ in $L^p$" with no inline definition or callback to measure-theory#integral. The hero blurb's general "see measure theory" pointer is too distant for a reader who jumped here.
- **High-impact:** §15 (line 2244) and §16 (line 2267 theorem statement) use `$f' \in L^1[a,b]$` and "almost everywhere" / "Lebesgue sense" without callbacks. The §16 Lebesgue FTC theorem in particular hinges on `L^1` and "a.e." — both first introduced casually.
- §16 also uses "singular continuous measure", "atomless", "absolutely continuous" measures, "$\mu \ll \lambda$", and "Radon–Nikodym" in a single note (line 2404) with only a generic "Bridge to measure theory" link — none defined.
- §18 (line 2560) introduces "weak-$L^1$ bound" without prior $L^p$ definition; the same paragraph mentions "Hardy–Littlewood maximal function" in passing, defined only by its formula.
- §11 (line 1598) calls out "uniform boundedness, open mapping, closed graph" via a hyperlink to functional analysis — that one is fine because it explicitly defers.
- Lower-impact: "Lebesgue measure zero" first appears at §5, line 877, before any treatment of measure (used as a black-box adjective). The §5 Bridge note (line 885) does flag the forward dependency; consider making 877 a callback so the unfamiliar reader is rerouted.

### Tone mismatches
- Voice is otherwise consistent with category-theory and complex-analysis (third-person + occasional "one can", lots of "the proof is …", interleaved Bridge notes).
- Two minor over-formal phrasings: §15 note "the poster child for BV failure" is fine; §9 line 1458 "this chicanery" is the most colorful word on the page and reads slightly off-key in a sequence of straight definition-theorem-note paragraphs. Cosmetic.

### Missing worked examples
- _None._ All 18 numbered sections carry at least one widget (`#w-sqrt2`, `#w-eps`, `#w-mvt`, `#w-unif`, `#w-riem`, `#w-grad`, `#w-jac`, `#w-ift` + `#w-saddle-pitchfork`, `#w-ratio`, `#w-pseries`, `#w-baire`, `#w-ftc`, `#w-bump`, `#w-arz`, `#w-bv`, `#w-cantor`, `#w-vitali`, `#w-ldt`).

### KaTeX macros / formatting
- **Bug — semantic, high priority.** `real-analysis.html:1281` (in §8, between the IFT widget and the registry-backed sublevel-set widget): the paragraph reads literally
  `<p>The sublevel set ({(x,y): g_a(x,y)le 0}) is a complementary view ... As a parameter (a) sweeps ...</p>`
  KaTeX delimiters and the `\le` macro have been stripped. Should be `$\{(x,y): g_a(x,y)\le 0\}$` and `$a$`. Renders as raw parentheses + literal `le 0` in the browser.
- No locally redefined macros on the page. The macro block at lines 38–45 is identical to peers.
- Helper `<script>` block (lines 187–236) is byte-identical to measure-theory's; verified via `diff`.
- All widget chrome uses `.widget / .hd / .ttl / .hint / .row / .readout / .note` — no ad-hoc classes.

## Severity
minor polish (one real KaTeX bug at §8 line 1281 + measure-theoretic jargon used pre-definition in §§13–18 deserves callback asides; everything else is style-coherent)
