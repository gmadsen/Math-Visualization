# operator-algebras — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** functional-analysis, harmonic-analysis-fourier

## Summary
The page is in very good shape — sixteen well-paced sections, eleven distinct widgets, the noncommutative-torus and state-simplex toys are exemplary, and the closing Gelfand-vs-Spec table is one of the strongest cross-section bridges in the corpus. Findings are minor polish: a couple of weak/missing widgets in late sections, one quiz placeholder duplicated content with §13, and a handful of small notation parity items vs. the section peers.

## Findings

### Notation drift
- _Macros block is byte-identical_ to `functional-analysis.html` and `harmonic-analysis-fourier.html` (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`). Same `\mathbb{C}`, `\mathbb{R}`, `\mathbb{T}`, `\mathbb{Z}` conventions. No semantic drift.
- §10 uses `$\mathrm{I}_n$, $\mathrm{II}_1$, $\mathrm{III}$` for type labels, but inline prose elsewhere on the same page writes "II$_1$ factor" and "type III$_1$" with bare ASCII (e.g. lines 1446, 1448, 1536). Cosmetic but inconsistent within one section. Pick one — prefer the `\mathrm{I}_n` form throughout.
- §13 (state space) uses `$\partial_e S(A)$` for extreme-point set; `functional-analysis.html#krein-milman` uses `$\mathrm{ext}(K)$` for the same concept (line 2099). Both are common; `\partial_e` here is fine but worth a one-word gloss ("extreme boundary $\partial_e$") since the peer page introduces a different symbol for the same idea.
- `\mathrm{ev}_x` is used uniformly across §5, §6, §7, §13, §16 — good consistency. `\mathrm{conv}` (§13, line 1610) sits next to `\operatorname{conv}` in `functional-analysis.html#krein-milman` (line 2101). Cosmetic; the canonical split (per `category-theory.md`) is `\operatorname` for multi-letter ops, `\mathrm` only for fixed semantic decorations like `\mathrm{id}`, `\mathrm{op}`, `\mathrm{ev}`. `\mathrm{conv}` is on the wrong side of that line.

### Undefined jargon
- §2 cast-of-examples table introduces `$C^*_r(G), C^*(G)$` ("group $C^*$-algebras") with no inline definition; the term is then re-used in §8 (with definition: "$C^*(G)$ for a locally compact group $G$") and §15 ("$C^*_r(G)$ is nuclear iff …"). The first appearance has no callback. Either drop from §2 or add a half-sentence: "(group $C^*$-algebras — defined in §8)".
- §2 cast table also lists the **Calkin algebra** $B(H)/K(H)$ before the prose has named or motivated it. Defined later in §8. Same fix: forward-callback or one-line gloss.
- §4 mentions **"Borel calculus on von Neumann algebras"** in the bullet list, but von Neumann algebras don't appear until §9. Either reorder ("…available in the *Borel* calculus on von Neumann algebras (§9)") or defer.
- §9 prose uses **SOT / WOT** ("$\overline{M}^{\text{SOT}}=\overline{M}^{\text{WOT}}=M''$") without expanding the abbreviations. Strong/weak operator topology is referenced but not defined. The cross-page callback to `functional-analysis.html#weak` covers weak-* topology generally, but SOT/WOT specifically should at least be spelled out parenthetically on first use.
- §10 introduces **"hyperfinite II$_1$ factor $\mathcal R$"** with the parenthetical construction `$(\bigotimes_{n\ge 1} M_2(\mathbb{C}))''$` but the term *hyperfinite* is never defined; reused in §15 ("$L(G)$ is hyperfinite") still without definition.
- §15 introduces **"completely positive maps"** in the nuclearity paragraph with no definition or callback; this is the first appearance on the page. One-sentence inline definition recommended.
- §15 introduces **"point-norm"** convergence in the nuclearity definition with no gloss.

### Tone mismatches
- Voice is consistent with `functional-analysis.html` and `harmonic-analysis-fourier.html` throughout — same conversational-but-precise register, same use of "Strip $C(X)$ down to its bones" / "every time" rhetorical lifts. No drift to dry textbook or meme tone.
- §12 (Positive elements) is the lone full-text section with no widget and no h3 subheadings — one wall of two paragraphs followed straight by the quiz. Compare to §11, §13, §15 (which break with subheads + widget). The content also redundantly redefines "state" before §13 redefines it again with the same wording (lines 1589 and 1608 are near-duplicates). Consolidate: §12 should focus on the positive cone and Löwner order (and ideally get a widget showing the cone in $M_2(\mathbb{C})_{\mathrm{sa}}$), and let §13 own states.
- §16 §-heading "*The user's aside, made precise*" — meta-phrase that leaks the authoring context (a real user's question presumably prompted it). Should be rewritten to read as a standalone lead, e.g. "Both Gelfand and Grothendieck recover a 'geometric object'…" — the next sentence already does this perfectly.
- §16 closing "Reading order" `<ol>` is a useful study-plan list but its placement *after* a widget and "Where to read more" reads as an afterthought; in `functional-analysis.html` and `harmonic-analysis-fourier.html`, closing matter is the "See also" callback alone. Either elevate this list (it's good content) or trim.

### Missing worked examples
- **§12 Positive elements** — pure definition + state-introduction with no widget. A toy showing the positive cone $A_+\subset M_2(\mathbb{C})_{\mathrm{sa}}$ as a 3D cone (eigenvalue conditions $\lambda_1,\lambda_2 \ge 0$) would be high-value and would distinguish §12 from §13.
- **§16 widget (`#w-cmp` "Spectra compared")** has only two static modes and no interactive computation — buttons toggle between two pre-baked SVG layouts. Compare with §8's noncommutative-torus widget which actually computes rational-approximation status of θ. Consider letting the user pick a small ring and see the prime spectrum computed live, or at minimum add hover-tooltips on the generic-point bar explaining what "dense" means.
- §10 "type lattice" widget is informative but read-only (button toggles between five card views). The peer toy in §11 (Murray–vN equivalence) is similarly card-driven but earns its keep with the slider showing fractional dimension. §10 could draw projection lattices live for $M_n$ at a chosen $n$.
- §15 (approximate units) widget uses `n=1..20` integer slider but the readout `‖e_n·f − f‖_∞ ≈ 6.7e-3` mixes ASCII norm bars and exponent notation in the readout panel even though the prose around it is full KaTeX. Cosmetic but jarring on a page that elsewhere is meticulous.

### KaTeX macros / formatting
- Macros block is the canonical six (`\Spec, \Gal, \Hom, \tr, \ad, \ind`); no locally-introduced macros. Helper `<script>` block at top of `<body>` matches `category-theory.html` verbatim — plus a useful `C = {add,sub,mul,…}` complex-arithmetic helper for the §3 spectrum widget (legitimate page-local addition; not a deviation from the helper contract).
- §1 line 332 reads `$f^* := \overline f$` — `\overline f` (no braces) renders fine for a single character but the page elsewhere uses `\overline{f}` (line 330 and §6 line 889 `\overline{\varphi(a)}`). Cosmetic consistency only.
- §2 line 364 writes `$A^*=\bar A^{\mathsf T}$` (`\bar A`, `\mathsf T`) for the matrix conjugate-transpose; `functional-analysis.html` uses `T^*` and `\overline{T}` patterns (no `\bar`). The `\mathsf T` for "transpose superscript" is unusual on this site — `category-theory.html` uses `\mathsf{Set}` etc. for category names. Prefer `A^* = \overline{A}^{\top}` or `A^* = \overline{A^{\mathsf T}}` (with full overline).
- §6 line 889 uses both `$\|\Gamma(a^*a)\|_\infty=\|\Gamma(a)\|_\infty^2$` *and* `$\|a^*a\|=\|a\|^2$` in the same sentence — fine, but check the spacing: `\|a^*a\|` (no thin-space between $a^*$ and $a$) is the convention used throughout, including the `$C^*$-identity`, so this is consistent — flag as confirmation, not drift.
- §8 noncommutative-torus widget uses raw Unicode `≇` and `θ` in the readout strings (`A_θ ≇ C(X)`); peer pages embed math in KaTeX-rendered display blocks rather than mixed-Unicode readouts. The readout panel is monospace-text by design, so this is acceptable, but note: the widget *title* uses `$A_\theta$` (KaTeX) while the readout uses `A_θ` (Unicode) — pick one or document the split.
- §13 widget hint `pick $p_1$, $p_2$; watch $p_3=1-p_1-p_2$` — the inline-`$` works inside `<span class="small">` (line 1619) but the page convention elsewhere puts widget metadata in the `.hint` attribute of the `.hd` block. Minor.
- §15 line 1781 has an HTML entity `&amp;` inside `<strong>Nuclearity &amp; amenability.</strong>` — correct rendering of "Nuclearity & amenability". Verified, no issue.

## Severity
minor polish (key action items: §12 needs subheads + widget and dedupe with §13; §16 widget should compute live or be downgraded to static figure; spell out SOT/WOT/hyperfinite/CP-map/point-norm on first use).
