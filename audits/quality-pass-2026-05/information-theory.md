# information-theory — pedagogical audit (2026-05)

**Section:** Probability & statistics
**Compared against:** probability-theory, mathematical-statistics

## Summary
Content is strong, voice matches the section's "Brilliant + 3B1B" register, and §1–§6 each ship a working widget with Worked-example narration. Two real issues drag it down: a structural bug (`<footer>` orphaned mid-page after §6) and two late sections (§7 AEP, §8 Fisher) that have no widget while the peer pages give every numbered section a toy.

## Findings

### Notation drift
- `\mathcal{N}` (braced) at line 908 / 915 / 1069 vs `\mathcal N` (unbraced) at lines 1071, 1073; `\mathcal X` (unbraced) at 1026, 1034, 1055. probability-theory.html and mathematical-statistics.html consistently brace (`\mathcal{F}`, `\mathcal{N}`, `\mathcal{B}(\mathbb{R})`). Cosmetic but noticeable inside the same paragraph (line 1071 has both `\mathcal{N}` and `\mathcal N`).
- Convergence arrow drifts within §7–§8: §7 uses `\xrightarrow{\,\mathbb{P}\,}` (1022), §8 final paragraph uses `\Rightarrow` (1071) for what is the same convergence-in-distribution arrow. probability-theory uses `\xrightarrow{\mathbb{P}}` and `\xrightarrow{d}` (lines 1112–1120, 1295), mathematical-statistics uses `\xrightarrow{p}` and `\xrightarrow{d}` (305, 420, 923–934). Recommend: settle on `\xrightarrow{p}`/`\xrightarrow{d}` per peers, drop the bare `\Rightarrow`.
- `\Pr(...)` used once at line 1029 in §7 ("$\Pr(A_\varepsilon^{(n)}) \to 1$") but every other probability statement on the page uses `\mathbb{P}(\cdot)`. Both peers consistently use `\mathbb{P}`. Pick one.
- High-priority semantic collision: `h` is defined as binary entropy in §1 (`h(p) = -p\log_2 p - (1-p)\log_2(1-p)`, line 286) and re-used to denote *differential entropy* in §8's De Bruijn note (`h(X+\sqrt t Z)`, line 1073) without flagging the meaning change. Same letter, different functions, no warning. Either rename (`h_d`, `H_{\mathrm{diff}}`) or add an inline aside ("here $h$ denotes differential entropy, not the binary one of §1").
- `\dot=` for "exponential equality" (line 1034: `|A_\varepsilon^{(n)}| \;\dot=\; 2^{nH(X)}`) is introduced silently — neither peer uses it, no inline gloss. Either explain it on first use or replace with the explicit "$\frac{1}{n}\log|A| \to H(X)$".
- "$pmf$" at line 1021 lower-case vs "PMF" upper-case is used in probability-theory (lines 611–612). The §8 line 1055 then writes "(or pmfs)" parenthetically. Cosmetic but inconsistent with the rest of the section.

### Undefined jargon
- "differential entropy" appears for the first time at line 1073 inside the De Bruijn note, with no prior definition (no `h(X) = -\int f\log f$); §1 only treats discrete entropy. The §6 R(D) section already implicitly uses Gaussian rate–distortion that depends on differential entropy without saying so.
- "encoder–decoder pair" appears in §6 (line 904) before §5 has defined what an encoder or decoder is — §5 only defines a "discrete memoryless channel" and "block code". A one-line bridge ("an encoder maps a length-n source to a codeword; a decoder inverts; together they form an encoder–decoder pair") would close it.
- "block codes of length $n$" in §5 (line 795) is used in the statement of Shannon's noisy-channel theorem before being defined. Comes up again as "Block-coding $n$ symbols at a time" in §4 (line 636) but only retroactively.
- "jointly typical decoding" at the §7 closeout (line 1040) is given by name without unpacking what "jointly typical" means — a small unpack ("the pair $(x^n, y^n)$ lies near the joint-entropy shell of the joint distribution, in the sense of §7's typical-set definition applied to $p_{XY}$") would help.
- "Han, Shearer" inequalities at §9 line 1098 are namedropped with no gloss; "Stein's lemma" at line 1102 likewise. The peer §6 "Connections" / outro pages do the same name-drop trick, so this is borderline — consider one-line glosses if you want the §9 to read for newcomers.

### Tone mismatches
- Tone overall matches the peer voice — short conversational openings ("Conditioning shrinks uncertainty.", "If we are willing to tolerate some reconstruction error, how few bits per symbol suffice?") and worked-example anchors. No "dry textbook voice" or "over-casual / meme" drift detected.
- Minor: §9 "Open frontiers" (line 1108, `<p class="small">`) lists three keyword phrases ("5G/6G applications", "non-asymptotic / dispersion results", "information bottleneck") with no narration — a punch list rather than the conversational close that §9 of mathematical-statistics offers. Consider one connecting clause per item.

### Missing worked examples
- **§7 (Asymptotic equipartition property)** has no widget. The Bernoulli(1/4) worked example is good prose but the page would benefit from a toy that lets the reader sample $n$ from a non-uniform pmf, plot $-\frac{1}{n}\log_2 p(X^n)$ vs $n$, and watch it concentrate at $H(X)$. Both peers ship a widget per numbered section (mathematical-statistics §1–§6 all have widgets; probability-theory §1–§12 all have widgets).
- **§8 (Fisher information and Cramér–Rao bound)** has no widget. The peer page (mathematical-statistics §3) ships `w-cr` for exactly this content, so this section is bare relative to a near-identical sibling. A slider over $\theta$ with a Fisher-information curve, or a side-by-side log-likelihood-curvature visualisation, would be in scope.
- §9 (Connections) is correctly widget-free — matches the peer "Connections" / outro pattern.

### KaTeX macros / formatting
- **Structural bug (high priority).** Line 1015 has a stray `<footer>Part of the Interactive Mathematics Notebook · open in a browser, no server needed</footer>` *inside* `<section id="rate-distortion">`, after the §6 widget but before the `</section>` closer — and there is no closing `<footer>` at the end of the page. The footer was clearly left in place when sections §7–§9 were appended. Visually injects "Part of the Interactive Mathematics Notebook…" between the §6 R(D) widget and the §7 AEP heading. Both peer pages keep their single `<footer>` immediately before `</main>` (probability-theory:1815, category-theory:3060).
- The page declares the standard `\Spec, \Gal, \Hom, \tr, \ad, \ind` macros in the loader but uses none of them, identical to the peer pages — fine, they're the inherited boilerplate.
- No exotic or page-local macros invented; delimiters are the standard `$…$` / `$$…$$` set. No ad-hoc widget chrome — `.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.note` all match the house pattern.
- Helper block at top-of-body (lines 186–241) matches the peer copy verbatim plus three legitimate page-local helpers (`log2`, `xlogx`, `binEnt`). Correct pattern.
- One small KaTeX-ish sloppiness in display math: the §3 `D(p\,\|\,q)` notation uses `\,\|\,` thin-spacing throughout (lines 502, 506, 508, 538), while §6's note uses `R_X(D)` and `R_{\mathrm{Gauss}}(D)` for the same kind of object — fine, but the §6 line 903 writes the conditional kernel as `p_{\hat X\mid X}` without thin-space, mixing the conventions. Cosmetic.

## Severity
minor polish (one structural bug — orphan `<footer>` mid-page — plus two missing widgets in §7 and §8 that the peer template would expect; everything else is cosmetic notation drift).
