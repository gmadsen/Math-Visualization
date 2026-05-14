# coding-theory — pedagogical audit (2026-05)

**Section:** Combinatorics & graph theory
**Compared against:** expanders, designs

## Summary
Coding-theory.html is a strong, well-paced page: every numbered section ships a working widget, the chrome and helper block are verbatim from the canonical template, and the prose voice matches its section peers. A handful of name-dropped notions (polar/fountain codes, Gilbert–Varshamov, Plotkin/Griesmer/LP bounds, Reed–Muller) are referenced before — or without ever being — defined, and the operator-name macro convention drifts from `\operatorname{...}` toward `\mathrm{...}` more than the references do.

## Findings
### Notation drift
- Coding-theory introduces `\mathrm{ev}` (line 580, evaluation map), `\mathrm{lcm}` (line 757), and `\mathrm{atanh}` (line 875) for what are operator-name-shaped objects. Reference convention leans toward `\operatorname{}` for genuine operators (e.g. expanders.html line 525 `\operatorname{vol}`) while reserving `\mathrm{...}` for class names (e.g. designs.html `\mathrm{PG}`, `\mathrm{AG}`, `\mathrm{MOLS}`, `\mathrm{rank}`). Recommend: `\operatorname{lcm}`, `\operatorname{ev}`, `\operatorname{atanh}`. Cosmetic.
- TOC entry for §5 contains `&amp;mdash;` (line 247) — double-encoded; renders as the literal text `&mdash;`. Compare to designs/expanders TOCs which use plain `&` for & and unicode `—` for em-dash. Cosmetic but visible to readers.
- "Hamming bound" vs "sphere-packing bound" vs "Hamming / sphere-packing bound" all appear (§1 note line 342 and §1 paragraph line 340 and §3 line 458). The page treats them as synonyms, which is correct, but readers meeting "Hamming bound" alone in §3 may not connect it to the §1 introduction. Low-priority cosmetic.
- $\Lambda_{24}$ is named as "the Leech lattice" in §7, then in §1 of Connections as "good LDPC codes have Tanner graphs that are good expanders" — no Leech notation drift, just noting the page is internally consistent on lattice symbols.

### Undefined jargon
- §1 note (line 342): "the Plotkin, Hamming, Griesmer, and Linear-Programming (LP) bounds" — Plotkin, Griesmer, and LP are name-dropped and never defined or revisited. Hamming is later defined (§3). Quote: "Singleton is one ceiling; the Plotkin, Hamming, Griesmer, and Linear-Programming (LP) bounds carve away more."
- §4 note (line 734): introduces the "Gilbert–Varshamov bound" as the thing AG codes beat for `q ≥ 49`, but never says what GV is. Quote: "AG codes beat the Gilbert–Varshamov bound for $q\ge 49$." The page would benefit from a half-sentence gloss ("the random-coding lower bound on achievable $(R,\delta)$").
- §2 (line 436): name-drops "the binary Reed–Muller code $\mathrm{RM}(1,m)$ at the right parameters" with no definition. Then §5 line 862 mentions "Reed–Muller and Berlekamp–Massey-Solomon refinements" — second usage with the same lack of grounding.
- §4 (line 583): three decoders named in one sentence — "Berlekamp–Massey, Berlekamp–Welch, and Guruswami–Sudan all exploit the polynomial structure" — no per-decoder hint at which problem each solves. A one-clause gloss apiece would help.
- §6 conclusion (line 981) and §8 Connections (line 1125): "polar codes" used as a contrast term ("alongside polar codes for control"; "LDPC and polar codes approach"). Polar codes are never defined on the page. Quote: "5G NR data channels (3GPP 2018; alongside polar codes for control)."
- §6 note (line 981): "fountain" codes appear in a parenthetical taxonomy with zero context. Quote: "Random / pseudorandom codes (LDPC, polar, fountain) approach capacity."
- §7 last paragraph (line 1106): "Hamming codes give the $D_n$ lattices" — `$D_n$` is mentioned but the lattice family is not introduced; readers without root-system background will not place it.
- §8 (line 1122): "Panteleev–Kalachev recently broke through the $\sqrt n$ distance barrier" — what `√n` distance barrier? The phrase assumes the reader knows the prior best for quantum LDPC was `Θ(√n)`. A four-word parenthetical would close the gap.

### Tone mismatches
- _None significant._ Voice is conversational-but-precise, matching expanders and designs. Idioms like "pick by gesture, not by aesthetics" (§6 note) and "the syndrome **points at** the error" (§3) are in-house. The §6 belief-propagation step list is slightly formula-dense but the surrounding prose orients it adequately.

### Missing worked examples
- _None._ Every numbered §1–§7 ships an interactive widget; §8 (Connections) is appropriately a pure outro per the convention shared with expanders.html and designs.html.

### KaTeX macros / formatting
- No locally defined macros — macro block (lines 22–29) is verbatim from the template. Good.
- Standard delimiters only (`$…$`, `$$…$$`); no invented delimiters.
- `\mathrm{atanh}` (§6 line 875) is the most idiomatically off — KaTeX renders it correctly but the canonical operator-name spelling is `\operatorname{atanh}` (or wrap as `\mathrm{atanh}` only if the kerning matters). See "Notation drift" above.
- `\Lambda_{24}` and `\lambda_1(\Lambda)` in §7 cohabit happily; no conflict.
- `\mathrm{Co}_1` (§7 line 1003) is fine — class name, matches `\mathrm{PG}`-style usage in designs.

## Severity
minor polish
