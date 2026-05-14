# maass-forms — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** modular-forms, automorphic-forms-adelic

## Summary
Strong page overall: well-paced, six widgets (one per section), faithful house chrome, and prose that reliably narrates each formula. Main drift is cosmetic — the upper half-plane is written `\mathbb{H}` throughout, departing from the `\mathcal{H}` convention used in modular-forms (the canonical neighbour) — plus consistent British spellings that read out-of-key with the rest of the section.

## Findings
### Notation drift
- Upper half-plane: maass-forms uses `\mathbb{H}` (15 occurrences, e.g. line 244 toc, line 260 sub, line 322 `L^2(\Gamma\backslash\mathbb{H})`); modular-forms uses `\mathcal{H}` consistently (line 217 sub, line 268 `\mathcal{H} = \{\tau \in \mathbb{C} : \mathrm{Im}\,\tau > 0\}`). automorphic-forms-adelic uses `\mathbb{H}` only once (line 493 in passing) and otherwise reserves `\mathcal{H}` for the Hecke algebra. Recommend: settle on `\mathcal{H}` for the upper half-plane to match modular-forms, the prerequisite spine link advertised in maass-forms' own hero. **Semantic drift**: `\mathcal{H}` is overloaded with the spherical Hecke algebra in automorphic-forms-adelic — readers crossing over may briefly misparse, but the convention should still anchor on the prereq page (modular-forms).
- `\Im` vs `\mathrm{Im}`: maass-forms uses bare `\Im` (line 286 widget title `$\Im(z)^s$`, line 411 `(\Im\gamma z)^s`); modular-forms uses `\mathrm{Im}` (line 225, 268, 842). Same for `\Re` vs `\mathrm{Re}`. Cosmetic.
- Hyperbolic measure: maass-forms writes `\mathrm{d}\mu = y^{-2}\,\mathrm{d}x\,\mathrm{d}y` with upright `\mathrm{d}` (line 324); modular-forms uses italic `dx\,dy` (line 1155 `y^{k-2}\,dx\,dy`); automorphic-forms-adelic uses italic `dx` throughout (line 500). Cosmetic but visible.
- "Cusp form" defined twice with different framings — line 331 ("$L^2$ Maass forms whose constant Fourier coefficient at every cusp is zero") vs the analogous adelic incarnation in automorphic-forms-adelic line 498 (vanishing of unipotent constant term). Both are right; consider an explicit `\langle T \rangle`-orbit analogue when the reader will later cross over to the adelic page.

### Undefined jargon
- "tempered" — line 301 introduces "tempered regime" inside the widget caption with no definition, gloss, or callback. The term has a precise meaning (unitary representation theory) that beginners hitting Maass forms first will not know. First offending sentence: *"above it, $r$ is real and we are in the 'tempered' regime; below it, $r$ becomes imaginary and we cross into exceptional territory."*
- "principal series" — appears in the §7 Connections paragraph (line 557, *"representation theory (the principal series of $\mathrm{PSL}_2(\mathbb{R})$)"*) without a glossary callback or prereq aside. The term is never defined on-page and there's no link. (Lower priority — appears only in the closing connections section.)
- "functoriality" — used three times before any definition or callback (line 380 table header `Sym^4 functoriality`; line 402 *"closely tied to functoriality on $\mathrm{GL}_2$"*; line 557 *"slow-grinding $\mathrm{Sym}^k$-functoriality program"*). automorphic-forms-adelic devotes its §9 to the topic. Recommend: a single inline link from §3 to `automorphic-forms-adelic.html#functoriality`.
- "Speh representations" — line 339, *"the Speh representations are the famous $\mathrm{GL}_4$ example"* — name-dropped with no definition, no link, no follow-up. The reader who doesn't already know is left dangling.
- "Whittaker model" — used as widget title on line 496 (*"$K$-Bessel decay and the Whittaker model"*); the term appears nowhere else on-page and is never defined. automorphic-forms-adelic has the full treatment in §6. Recommend: callback aside, or rename the widget to "$K$-Bessel decay and the Fourier–Whittaker mode" so it ties back to the §5 Fourier–Whittaker expansion paragraph.
- "Hecke eigenform" — line 469 introduces it parenthetically (*"joint eigenfunction of all the Hecke operators $T_p$ on the modular surface"*) which is fine in isolation, but `T_p` itself is not defined on this page; readers without modular-forms.html prior exposure are guessing. A `<aside class="callback">` to `modular-forms.html#qexp` (where `T_p` is unpacked) would close the gap.
- "Kloosterman-sum estimate" — line 371 (*"Selberg himself proved $\lambda_1\ge 3/16$ via a Kloosterman-sum estimate"*) — used for flavour, no definition expected, but no link either. Lower priority.

### Tone mismatches
- §1 worked well — second-person never quite arrives, but the "Two definitional choices deserve attention" framing is in voice. §6 paragraph at line 524–526 (the trace formula display equation) drops into formula-without-narration: a half-page formula `$$ \sum_{j\ge 0} h(r_j) + \frac{1}{4\pi}\!\int … = \frac{\mathrm{vol}(\Gamma\backslash\mathbb{H})}{4\pi}\!\int r\tanh(\pi r)\,h(r)\,\mathrm{d}r + \!\!\!\sum_{\{\gamma\}\,\mathrm{hyp}}\!\!… + \cdots$$` followed by a single dense sentence unpacking it. Compare modular-forms §9 Petersson, where each equation gets a sentence per sub-claim. Recommend: split the trace-formula identity into spectral-side and geometric-side displays, narrate each.
- The §7 "Connections" paragraph (line 557) is one 200-word block touching analysis, NT, rep theory, expanders, QUE. Reads like a reference-list paragraph rather than a closing tour. modular-forms ends with itemised "Where this page ends" bullets (line 1126–1133); automorphic-forms-adelic uses "Why this matters" notes. Prefer the bullet form.
- British spellings: `parameteris` (lines 277, 288), `parameterisation` (line 301), `centre` (line 280), `generalised` (line 418), `normalisation` (line 466), `stabiliser` (line 410). modular-forms is consistently American (`normalization`, `parametrize`, `diagonalizable`, `center`); automorphic-forms-adelic is mixed-British (`generalisation`, `normalisation`, `programme`). The corpus has no enforced spelling rule but in-section consistency is uneven — flag for awareness, not blocking.

### Missing worked examples
- §3 Selberg's eigenvalue conjecture has the progress-bar widget, but no worked computation. The numerator-denominator `975/4096` on Kim–Sarnak is asserted; one paragraph showing how `\mathrm{Sym}^4 \to \lambda_1 \ge 1 - (k/(k+1))^2` (or any concrete derivation step) would give the reader a toy to chew on. Currently every detail of the bound is "by author X via method Y" — no derivation.
- §6 trace formula contains the Weyl-law widget but no worked example of *applying* the trace formula to derive the Weyl law from the schematic identity. The reader sees the identity and the consequence but not the bridge ("choose $h$ to be a bump function localised near eigenvalue $T$" is stated abstractly at line 529 but never carried through). For comparison, modular-forms §5 walks `E_4`'s `q`-expansion through the actual $\sigma_3(n)$ formula and lists numerical Fourier coefficients.
- §5 has the table of Ramanujan bounds and the Bessel widget, but no concrete `a_f(n)` numerical example for any specific Maass cusp form (analogous to modular-forms' `\tau(2)=-24, \tau(3)=252, …` line at 832). Even a citation of `a_f(2), a_f(3)` for the lowest eigenvalue Maass form would make the abstraction concrete.

### KaTeX macros / formatting
- Macro list (lines 22–28: `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) is byte-identical to modular-forms and automorphic-forms-adelic — no drift. None of those macros are actually invoked in the maass-forms page body, but that's the corpus-wide standard list and the consistency is correct.
- No locally-defined macros, no nonstandard delimiters detected.
- `\mathfrak{a}` for cusp labels (lines 334–339) — standard KaTeX, used exactly as in scholarly literature; no issue.
- The trace-formula display (line 525) inlines `\!\!` and `\!\!\!` spacing tweaks repeatedly to fit the very wide identity. On narrow viewports this wraps poorly. Suggest splitting into multiple aligned displays via `\begin{aligned}` or two separate `$$…$$` blocks.

## Severity
minor polish
