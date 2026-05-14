# convex-optimization — pedagogical audit (2026-05)

**Section:** Control theory & optimization
**Compared against:** combinatorial-optimization, mathematical-finance

## Summary
A polished, voice-consistent page that already lands close to the canonical category-theory tone and matches the section peers in chrome and macros. The only meaningful gap is jargon-density in the second half (§5–§7), where post-2010 first-order-method vocabulary (ISTA, FISTA, Polyak averaging, Nemirovski–Yudin, $\ell_1$-regularised regression, Lipschitz gradient) lands without first-touch glossing.

## Findings
### Notation drift
- Cosmetic, low priority. The target uses `\mathrm{sign}` (line 410: `$\mathrm{sign}(x)+x/2$`; line 734: `$y_i=\mathrm{sign}(\langle v_i, r\rangle)$`) while combinatorial-optimization uses the operator form `\operatorname{sign}` (line 1199: `$\operatorname{sign}(r\cdot v_i)$`). Both pages introduce the same Goemans–Williamson rounding rule with different spellings of the same operator.
- Cosmetic. The target uses `\mathrm{epi}`, `\mathrm{dom}`, `\mathrm{prox}`, `\mathrm{int}`, `\mathrm{diag}`, `\mathrm{sign}` (six instances) where combinatorial-optimization reaches for `\operatorname{conv}`, `\operatorname{cap}`, `\operatorname{sign}`. Pick one convention; `\operatorname{...}` matches the page's own preamble macros (`\Hom`, `\tr`, `\ind`, all defined as `\operatorname{...}`) and is the canonical choice on category-theory.html.
- Minor. `$\arg\min$` appears bare (line 861, 1020) rather than as `\operatorname*{arg\,min}` or via a macro; harmless under KaTeX defaults but mismatches house style if there's any preference. Not seen in either reference.
- Indicator-of-set notation drifts inside the target: line 269 uses `$\mathrm{epi}\,f$` style for "epigraph of $f$" but lines 281/283 use `$\mathbb{1}_C(x)$` for the indicator. This is fine standalone, but `\mathbb{1}` is not introduced anywhere — readers may parse the bold-1 as a typo.

### Undefined jargon
- High priority. Section 5 (`#gradient-proximal`) opens with "smooth convex $f$ with $L$-Lipschitz gradient" (line 851) — neither "smooth" in the convex-analysis sense nor "Lipschitz gradient" has a forward definition or a callback. The widget caption then references the "condition number $\kappa=L/\mu$" without prior discussion of $\mu$ as the strong-convexity parameter (it is introduced two lines earlier as `$f-\tfrac{\mu}{2}\|x\|^2$ still convex`, but the symbol overload with the §6 barrier parameter $\mu$ is going to confuse). Quote: "the condition number $\kappa=L/\mu$ controls the rate."
- High priority. "Nemirovski–Yudin lower bound" (line 857) is dropped without explanation: "matching the Nemirovski–Yudin lower bound for first-order methods on smooth convex problems." A reader without the background sees a name and moves on. One sentence ("they prove no first-order method can do better than $1/k^2$") would close the gap.
- Medium priority. ISTA and FISTA are introduced parenthetically with no expansion: "is the **proximal gradient method** (ISTA); accelerating it with Nesterov momentum gives FISTA, the workhorse of large-scale $\ell_1$-regularised regression" (line 864). Acronyms-on-first-use is an outlier vs. the reference pages, which expand every acronym (cf. mathematical-finance line 1113 introducing "implied volatility $\sigma_{\mathrm{imp}}$" with the symbol explicitly attached, and combinatorial-optimization line 908 introducing "**integer linear program** (ILP)" only after the long form).
- Medium priority. "$\ell_1$-regularised regression" (line 864) — the $\ell_1$ norm is never introduced; it just appears. Combinatorial-optimization avoids this trap by always using `$\|x\|_1$` directly when needed.
- Medium priority. "Polyak averaging" (line 1009) is named as if known: "with step $\alpha_k=O(1/\sqrt{k})$ and Polyak averaging $\bar x_T = \tfrac{1}{T}\sum x_k$". The formula is given so it's recoverable, but the named-after-Polyak label adds nothing without a half-sentence explaining the role of the average.
- Medium priority. "self-concordance" appears in the §6 heading and is then defined four sentences later (line 902: `$|\phi'''(x)| \le 2\,\phi''(x)^{3/2}$`); in between, the reader sees a bullet list of barriers labelled by "Self-concordance parameter $\nu = n$" before $\nu$ has been introduced. Reorder the definition before the parameter list.
- Low priority. "Polyak" / "Nemirovski–Yudin" / "Csiszár–Sanov" (in §8 Connections) are surname pile-ups characteristic of optimization survey writing; the reference pages tolerate the same pile-ups in their Connections sections, so the §8 instances are within house norms.

### Tone mismatches
- Mostly aligned. The hero (`#convex-sets-functions` opening) uses the canonical "the local-to-global miracle is that…" / "duality reads the problem from both sides at once" voice that matches category-theory's "A disciplined way to say…".
- One minor drift in §5 (`#gradient-proximal`): the closing sentence "Nesterov-style methods 'remember' past directions and ride them" (line 857) reaches for an informal flourish that's slightly broader than the rest of the page. Combinatorial-optimization's analogous "smoothed-analysis result of Spielman–Teng (2004) explains why simplex is empirically fast — random perturbations smooth the worst case to polynomial" (line 279) keeps the same colloquial register but stays inside the technical frame. Not a fix-required item.
- §7 ends with "the magic that powers modern machine learning" (line 1011, formatted as standalone bold "**independent of dimension** $n$ — the magic that powers modern machine learning"). This is one notch more rhetorical than the reference pages allow — mathematical-finance's strongest punchline is the boxed Merton fraction and a low-key parenthetical, "useful for sanity-checking quotes in your head" (line 296).
- The convex-optimization §1 epigraph widget caption switches to inline `*any*` for emphasis (`*any* slope in $[-1,1]$ supports`, line 304), which renders as literal asterisks in HTML — the reference pages consistently use `<em>…</em>` tags. Cosmetic but visible.

### Missing worked examples
- _None._ Every numbered `<h2>` from §1 through §7 carries at least one widget; §3 has two (KKT geometry plus the Slater proof scrubber). §8 Connections is link-only, matching both reference pages' §8.

### KaTeX macros / formatting
- The KaTeX macro preamble in `<head>` is byte-identical to the references (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`). No new macros were defined locally, which is correct house style.
- All four delimiter pairs (`$…$`, `$$…$$`, `\(…\)`, `\[…\]`) are used; no ad-hoc delimiters introduced.
- Helper `<script>` block (lines 188–240) is a verbatim copy of the canonical 2D helper from category-theory.html (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`). The page does not load the 3D helper, which is correct — there are no rotatable 3D widgets.
- Widget chrome is consistent across all seven widgets: each uses `.widget` / `.hd` / `.ttl` / `.hint` / `.row` / `.readout` / `.note small`. No ad-hoc CSS classes.
- One non-fatal markup pattern: the §5 `MVInlineCodeCell.init` widget (line 866 onward) is the only widget in the corpus subset that defers its title and hint into the JS init call rather than declaring them in HTML `<div class="hd">`. That is intentional — it's how `widget-inline-code-cell.js` is designed — and it is correctly accompanied by `<script src="./js/widget-inline-code-cell.js"></script>` in `<head>` (line 180). Worth noting because the reference pages don't use this widget, so a reader spot-checking widget chrome in source might mistake it for a missing header.
- The KaTeX-select shim is loaded (`./js/katex-select.js`, line 178), and §1's `<select id="cv-epi-fn">` legitimately contains LaTeX in `<option>` labels (lines 297–301), so the shim is required and correctly wired.

## Severity
minor polish
