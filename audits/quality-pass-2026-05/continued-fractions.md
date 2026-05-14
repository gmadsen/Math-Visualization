# continued-fractions — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** dirichlet-unit-theorem, quadratic-forms-genus-theory

## Summary
The page is well-paced, voice-aligned with both peers, and every numbered section has a concrete widget with a worked toy. A handful of low-priority polish items: one undefined term ("comeagre"), one section (§5 Markoff) and the §6 widget that produces text-only readouts where the peers used a more concrete computation, and a missing cross-page callback to `dirichlet-unit-theorem#pell` from §1 (a bidirectional reference exists in the reverse direction).

## Findings
### Notation drift
- `\mathrm{GL}_2(\mathbb{Z})` at line 398/419 of target vs. `\mathrm{GL}_2^+(\mathbb{Z})` at line 315 of `quadratic-forms-genus-theory.html` and `\mathrm{GL}_r(\mathbb{Z})` at line 381 of `dirichlet-unit-theorem.html`. All three use `\mathrm{GL}` (not `\operatorname{GL}`); consistent. _Cosmetic only._
- `\mathbb{Z}`, `\mathbb{Q}`, `\mathbb{R}`, `\mathbb{C}` used consistently across all three (no `\Z`/`\Q` shorthands). _OK._
- Continued-fraction bracket notation `[a_0;\,a_1,a_2,\ldots]` used in target (line 267) matches the same notation used in the `dirichlet-unit-theorem.html` Pell section (line 497, e.g. `[1;\overline{2}]`). _OK._
- Liouville section uses `\sum_{k=1}^\infty 10^{-k!}` (line 534) and the widget readout uses unicode `β` and `q^β` rather than KaTeX. The peers use the same unicode-in-readout convention (`O_K^×`, `μ_K`, etc. in their `out.textContent`), so this is a consistent house pattern. _OK._
- Target uses `\overline{\mathbb{Q}}` (line 842, 852) for the algebraic closure — neither peer needs this notation, no drift, but worth noting for future audits. _OK._

### Undefined jargon
- "comeagre" appears at line 539 ("They form a comeagre but Lebesgue-null set in $\mathbb{R}$") with no definition or callback. Neither `point-set-topology` nor `descriptive-set-theory` is callbacked here. The reader is expected to know the Baire-category sense; one parenthetical or a dropped reference would close the gap.
- "fundamental discriminant" is implicit in §5 ("$\sqrt{9-4/m^2}$ from Markoff number $m$") but the term itself is not used; not a real issue.
- "GL_2(\mathbb{Z})-equivalent" at line 398 is used in passing for "having the same continued-fraction tail". The peer `quadratic-forms-genus-theory.html` line 315 uses "properly equivalent" with a one-line gloss. The CF page doesn't gloss `\mathrm{GL}_2(\mathbb{Z})`-equivalence — a half-sentence ("i.e. with the same continued-fraction tail past some index") would make it self-contained.
- "$S$-units" mentioned at line 858 and "$S$-integral points" at line 920, with no inline gloss; `dirichlet-unit-theorem#s-units` is callbacked from §6 implicitly via the `aside.callback` to `algebraic-number-theory`, but a direct `dirichlet-unit-theorem#s-units` callback would be the obvious target. _Minor._

### Tone mismatches
- Voice is consistent with both peers — second-person occasionally ("Pick a real $\alpha$" line 266, "Try $\pi$, $\sqrt{2}$, $e$, or the golden ratio" line 276), historical anchoring (Liouville 1844, Hurwitz 1891, Roth 1955, Markoff 1879), and "punchline" / "the headline" framing matches `dirichlet-unit-theorem.html` ("The residue is the headline" line 431).
- §4 has a near-textbook moment at lines 612–613: the table of theorems (Liouville, Thue, Siegel, Dyson, Gelfond, Roth, Schmidt, Baker) is dense and lacks a sentence connecting it to the surrounding narrative. The peer `dirichlet-unit-theorem.html` uses a similar table at line 323 but immediately continues with a "Step 1 / Step 2" proof sketch. _Minor cosmetic — the table is excellent; just a one-sentence intro lead-in would smooth it._
- §5 uses "the structure gets wilder" (line 764) which is fine and matches the conversational register.

### Missing worked examples
- §5 (Markoff) has the `w-mk` "Markoff tree explorer" widget which is interactive (Vieta-jump buttons), but the worked-example burden is mostly carried by the static `table.plain` of Markoff triples (lines 752–759). The widget computes correctly, so this is fine — but unlike `dirichlet-unit-theorem`'s §3 ("Worked examples" subhead with $\mathbb{Q}$, $\mathbb{Q}(i)$, $\mathbb{Q}(\sqrt 2)$, $\mathbb{Q}(\sqrt[3]{2})$), the target never narrates "let's do (1,2,5) by hand" — a one-paragraph trace of one Vieta jump would mirror the peer's pedagogical rhythm.
- §6 (`w-pa` "Roth at multiple places") is a text-only readout widget — selecting a place set $S$ updates a paragraph but no formula is *evaluated* and no number is computed. Both peers always pair widget controls with a numeric or algebraic readout (Pell solver, regulator value, class group multiplication table, etc.). The §6 widget feels like the weakest interactive on the page; a small concrete table of $|\alpha-p/q|_v$ at chosen $v\in S$ for one toy $\alpha$ would lift it.
- §6 has no closing prose connecting Schmidt's subspace theorem back to the §1 worked computation — fine, but the connection-section essentially does this work, so acceptable.

### KaTeX macros / formatting
- Helper macros in `<head>` (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) are byte-identical to both peers. _OK._
- No locally-defined `\newcommand` or `\def`. _OK._
- Helper `<script>` block at top of `<body>` (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is byte-identical to `dirichlet-unit-theorem.html` (lines 187–239 vs. 187–239). _OK._
- Widget chrome uses `.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad / .small / .pill` — all standard, no ad-hoc classes introduced. _OK._
- One small TOC quirk: the `<a>` text in the auto-generated top-nav contains a literal `$\sqrt{5}$` (line 244) and `$p$-adic` (line 248). The peers do the same (`dirichlet-unit-theorem` toc-auto line 245 has `$R_K$`); this is a known house pattern that KaTeX renders inside `nav.toc` because of `auto-render`. _OK._
- §6 widget hint at line 863 contains `$\prod_{v\in S}\min(1,|\alpha-p/q|_v)<H(p/q)^{-2-\varepsilon}$` — a fairly heavy formula in a `.hint`. Peers tend to keep `.hint` short prose ("type a non-square $d$ (1–200) and watch the algorithm"). _Cosmetic._
- Missing `<aside class="callback">` on §5 (Markoff). The section ends with `<div class="quiz" data-concept="cf-markoff"></div>` immediately closed by `</section>` (line 786–787). §5 references the Markoff equation, Vieta jumps, and Frobenius unicity — none of which has an obvious cross-topic prereq, so the omission is plausibly intentional, but worth a `node scripts/audit-callbacks.mjs` check.
- §1 callback list (lines 302–309) points to `galois.html` twice (`#field-extensions` and `#galois`) plus `algebraic-number-theory.html#examples`. The Pell connection in `dirichlet-unit-theorem#pell` is referenced via the `backlinks` block (line 315) but not via the forward `callback` — a curious asymmetry. _Minor._

## Severity
minor polish
