# random-matrix-theory — pedagogical audit (2026-05)

**Section:** Probability & statistics
**Compared against:** probability-theory, high-dimensional-geometry

## Summary
A strong, ambitious page with seven concrete widgets and section-level "See also" callbacks; the main pedagogical drift is that several technical objects (free probability state, determinantal point processes, Painlevé II, GRH, monodromy) arrive without the defined-on-page or callback scaffolding the other Probability-and-statistics pages provide, and the page omits the literal `<strong>Worked example:</strong>` paragraphs that probability-theory uses 10+ times. Notation is internally consistent and matches peer conventions; the macro pool is the section-shared `\Spec/\Hom/\tr/...` set.

## Findings
### Notation drift
- Convergence-in-law symbol drifts from peer convention. RMT uses `\Rightarrow` (line 500: `$\mu_N\Rightarrow\rho_{\mathrm{sc}}$`; line 877: `$\xi_N\Rightarrow F_\beta$`) while probability-theory uses `\xrightarrow{d}` (line 1295: `$\xrightarrow{d}\mathcal{N}(0,1)$`). Both are standard, but a reader bouncing between #wigner and probability-theory#clt on the same topic sees two different arrows for "convergence in distribution." Low-priority cosmetic drift; recommend `\xrightarrow{d}` for the same-section consistency or one inline gloss the first time `\Rightarrow` appears.
- `\mathbf{1}_{[a,b]}` (line 488, 682) vs probability-theory's `\mathbf{1}_{A_n}` (line 1132) — same convention, no drift. Confirmed consistent.
- `\mathbb{R}, \mathbb{C}, \mathbb{H}, \mathbb{Q}, \mathbb{P}, \mathbb{E}` all used in their `\mathbb{...}` form, matching probability-theory and high-dimensional-geometry. No `\R`/`\Z` shorthand drift.
- `\mathrm{sc}`, `\mathrm{Ai}`, `\mathrm{USp}`, `\mathrm{Sym}^2`, `\mathrm{II}_1`, `\mathrm{Free}(F_n)` are ad-hoc operator names typed inline; peer pages do the same with `\mathrm{Ent}_\gamma`, `\mathrm{med}\,f`, `\mathrm{Var}` — consistent.
- `\tr` macro (line 26 of head, used at 494, 1060) is the section-shared `\operatorname{tr}` macro; matches the head block in both reference pages. No drift.

### Undefined jargon
- "GRH" lands without expansion at #katz-sarnak. Line 1430: "computing the pair correlation function of the non-trivial zeros of $\zeta(s)$ under GRH". GRH (Generalised / Generalized Riemann Hypothesis) is never expanded on this page and there's no callback to a page that defines it. High-priority: a one-clause gloss ("under GRH (the Generalised Riemann Hypothesis)") or a callback link is the minimum.
- "tracial $\ast$-algebra" appears in an `<h3>` (line 1058) before the body explains what tracial or `$\ast$-algebra` mean. The next paragraph (line 1060) introduces "$\ast$-algebra equipped with a state $\tau$" but the word "tracial" itself never gets the half-sentence "($\tau(ab)=\tau(ba)$)" gloss that would orient a reader who doesn't already know operator algebras. Medium priority — there's an operator-algebras callback at section end, but the heading itself uses the term cold.
- "determinantal point process" appears at line 1203 before any structural definition: "form, after rescaling by the mean spacing, a determinantal point process with the sine kernel." DPP is a real technical concept (a point process whose correlation functions are determinants of a kernel); the sentence treats it as common vocabulary. The sine-kernel formula immediately following defines the kernel but not the point-process structure. Medium priority — one parenthetical "(its $k$-point correlation functions are $\det[K(x_i,x_j)]$)" would close the gap.
- "Painlevé II" appears in bold at line 881 with the ODE definition, but "Hastings–McLeod solution" lands the sentence before the ODE is shown — readers learn the named-solution before they see the equation it solves. Minor reordering would help.
- "Fredholm-determinant identity" (line 877) is technical vocabulary used as descriptor, not defined. Acceptable for an advanced page, but probability-theory's CLT section glosses every analogous term ("Lindeberg's condition", "Berry-Esseen") with a one-clause expansion.
- "monodromy group" / "Frobenius conjugacy class" / "Deligne–Katz theorem" arrive in one dense paragraph (line 1455) at #katz-sarnak. None of these has a callback or in-line gloss; the audience has to take them on faith. The connections list at the end does not bridge them either. High-priority for a section that wants to be the bridge to L-functions.
- Hero subtitle: "Free probability supplies the noncommutative calculus" uses "noncommutative calculus" as a term of art before any setup. Low priority — hero copy traditionally previews vocabulary, but the phrase is more opaque than peer hero subtitles.

### Tone mismatches
- The page mostly matches the conversational-but-precise voice of `category-theory.html` and the peers. A few drifts toward textbook-without-narration:
  - Section 7 (`#katz-sarnak`) ends in a single very long `.ok` callout (line 1575) that piles seven proper names ("Özlük–Snyder, Rubinstein, Iwaniec–Luo–Sarnak, Soundararajan, ...") and four partial-result statements into one paragraph. probability-theory and high-dimensional-geometry break similar density across multiple `<p>` blocks with `<strong>` lead-ins. Medium priority.
  - The `.note` at line 282 uses "eigenvalues hate being close" which is the right register for this notebook; good. Then "GSE eigenvalues push hardest" (line 457) — also good. No over-casual or meme drift detected.
  - Section 5's R-transform paragraph (line 1072–1080) is dense formula-text. Compare to probability-theory #gen-fun, which alternates each formula with a one-sentence "what this means" gloss. The R-transform definition would benefit from one such gloss.

### Missing worked examples
- Every numbered section has a widget — that part of the brief is satisfied. But probability-theory uses 10+ explicit `<p><strong>Worked example: …</strong></p>` paragraphs (lines 281, 393, 498, 631, 854, 1004, 1132, 1173, 1306, 1455, 1639, 1684) and high-dimensional-geometry threads numerical illustrations through prose. random-matrix-theory has **zero** literal worked-example paragraphs. The widgets carry the load, but a reader who hides widgets via the `📖` display preference (a documented affordance) loses every concrete computation. Suggested low-friction additions, one per section:
  - #ensembles: a worked $N=2$ joint density evaluated explicitly to make $\beta=1,2,4$ concrete numerically.
  - #wigner: $k=2$ moment computation showing $C_1=1$ pop out, then $k=4$ giving $C_2=2$.
  - #mp: numeric value of $a,b$ at $c=0.5$ and $c=2$.
  - #tracy-widom: a quoted numerical value of $F_2(0)$ or $\mathbb{P}(\xi_N>0)$ for orientation.
  - #free-probability: a worked $r_1=r_2=1$ free convolution returning radius $\sqrt 2$, plus contrast with classical $1+1=2$ width if uniformly distributed.
  - #universality: numeric $m_4\to 2$ check is implicit in the widget readout but never quoted in prose.
  - #katz-sarnak: a worked plug-in of the first three $\zeta$-zeros against the rescaled $W(x)$.
- Severity: medium. The widgets compensate for sighted, JS-enabled readers but not for the documented widget-hide reader mode.

### KaTeX macros / formatting
- `G_\mu^{\langle-1\rangle}` (lines 1074, 1076) uses angle-bracket superscript for "compositional inverse." This is an unusual notation that does not appear in probability-theory, high-dimensional-geometry, or the canonical category-theory.html. Standard alternatives are `G_\mu^{-1}` (with a one-clause "(compositional inverse)" gloss) or `G_\mu^{\langle -1\rangle}` only if the angle-bracket convention is itself introduced. Low/medium priority — render is fine, but the notation is opaque on first encounter.
- `\boxplus` and `\boxminus`-class symbols: `\boxplus` is used at lines 1076–1078, 1094, 1175 and is standard KaTeX; no issue.
- `\det\bigl(\mathbf{1}-\mathcal{K}_{\mathrm{Ai}}\bigr)\big|_{[s,\infty)}` (line 879) — restricted-determinant notation `\big|_{[s,\infty)}` for "kernel restricted to" is unusual and slightly ambiguous (looks like an evaluation bar). A reader familiar with operator-theory restriction will parse it; others may misread. Low priority.
- Local macro pool in the head (lines 22–29) is the section-shared set `\Spec, \Gal, \Hom, \tr, \ad, \ind` — identical to probability-theory and high-dimensional-geometry. No new locally-defined macros, no re-invented delimiters. Helper block (lines 187–239) is the verbatim 2D template from category-theory.html — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all present and unchanged.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.readout`, `.row`, `.note`, `.ok`, `.bad`, `.small`) is uniformly used — no ad-hoc classes detected. Color tokens are `var(--…)` throughout widget code; spot-checked at lines 377, 414, 423, 818, 819 etc. — no raw hex inside widgets.

## Severity
minor polish
