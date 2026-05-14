# mathematical-statistics — pedagogical audit (2026-05)

**Section:** Probability & statistics
**Compared against:** probability-theory, information-theory

## Summary
Pedagogically strong: every numbered section has a worked example plus an interactive widget, the JSON tone is conversational-but-precise, and the cross-section callbacks to probability-theory and information-theory are well placed. The one consistent semantic-level drift is the variance-operator notation: this page writes `\mathrm{Var}` while probability-theory writes `\text{Var}` — a low-stakes but corpus-wide inconsistency the reader will see if they tab between the two.

## Findings
### Notation drift
- **`\mathrm{Var}` vs `\text{Var}` (semantic, low-priority).** mathematical-statistics §1 writes `\mathrm{Var}_\theta(\hat\theta_n)` (line 301) and `\mathrm{MSE}_\theta(\hat\theta_n)`; probability-theory §5 writes `\text{Var}(X)` and `\text{Cov}(X,Y)` (lines 846, 848). information-theory §8 sides with the target — `\mathrm{Var}_\theta(U_\theta)` and `\mathrm{Cov}_\theta(\hat\theta, U_\theta)` (lines 1058, 1067). The target is consistent with information-theory; the outlier is probability-theory. Cosmetic in isolation, but a cross-tab reader sees three forms (`\mathrm{Var}`, `\text{Var}`, plain `Var(...)` in widget readouts).
- **Convergence-arrow probability label.** mathematical-statistics writes `\xrightarrow{p}` for convergence in probability (line 305); probability-theory's official "Modes of convergence" section uses `\xrightarrow{\mathbb{P}}` (lines 1114, 1164). Both pages mix forms — probability-theory uses bare `p` in its own §7 bullet but `\mathbb{P}` in §8. Recommend: settle on `\xrightarrow{\mathbb{P}}` per probability-theory's defining section, since `p` is overloaded with the binomial parameter elsewhere on the same page.
- **No custom KaTeX macros for the page's central operators.** The `macros:` block (lines 22–29) only declares `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind` — none of which are used. The page would benefit from defining `\Var`, `\Cov`, `\MSE` once and getting consistency for free, but adding macros is not required by house style. Cosmetic.

### Undefined jargon
- **"LRT" appears in §6 Wilks note before being abbreviated.** Line 929: "For the LRT statistic $\Lambda_n=\sup_{\Theta_0}L/\sup_\Theta L$…". §4 (Hypothesis testing) introduces "likelihood ratios" and writes `\Lambda(x)` (line 655) but never coins the abbreviation "LRT". A first-time reader of §6 has to back-infer. Fix: expand on first use ("the likelihood-ratio test (LRT) statistic") or, better, coin the abbreviation in §4's Neyman–Pearson note where the ratio is defined.
- **"complete" sufficient statistic in §3 Lehmann–Scheffé note (line 555).** The note hangs the unique-UMVU conclusion on completeness but never defines it ("if $T$ is also *complete*"). Probability-theory does not own this term either, so there is no callback target — recommend a one-line gloss inline ("complete = the only function of $T$ with mean zero is the zero function").
- **"regularity" in §2 (line 419) and §3 (line 547) without specifying which conditions.** The MLE-asymptotic-normality and CRLB hypotheses both invoke "regularity" without listing the standard requirements (interchange of $\partial_\theta$ and $\int$, support not depending on $\theta$, $C^2$ log-density). information-theory §8 (line 1075) at least lists them parenthetically ("differentiability, support not depending on $\theta$"). Match that style here.

### Tone mismatches
- _None._ The page reads as conversational-but-precise throughout. Section openers like "Estimation tells us where $\theta$ probably is; testing tells us whether $\theta$ is plausibly some specific value $\theta_0$" (§4) and "Frequentist statistics treats $\theta$ as a fixed unknown … Bayesian statistics flips this" (§5) match the category-theory voice template. Mini-narrations like "the statistical free lunch from accepting some bias" (§1) are right on tone with probability-theory's "Posteriors on rare conditions are dominated by the false-positive rate".

### Missing worked examples
- _None._ Every numbered §1–§6 has both an explicit "Worked example" paragraph and an interactive widget. §1 has bias–variance bars + sample-variance worked example; §2 has the Bernoulli log-likelihood widget + exponential-rate MLE; §3 has the CRLB envelope + Gaussian-mean CRLB; §4 has the Neyman–Pearson region widget + one-sample z-test; §5 has the Beta posterior widget + Beta(8,4) update; §6 has the Wilks $\chi^2_r$ widget + delta method on $p^2$. §7 (Connections) is the standard outro and is not expected to carry a widget — matches probability-theory and information-theory.

### KaTeX macros / formatting
- **Macros block is dead code (cosmetic).** Lines 22–29 declare `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind` (verbatim copy from probability-theory / category-theory). None are used. Probability-theory and information-theory carry the same dead block, so this is corpus-wide rather than topic-specific drift. Consider trimming to actually-used macros, or — better — add `\Var`, `\Cov`, `\MSE`, `\E`, `\Prob` and use them (would also fix the variance-operator drift above).
- **Mixed delimiters in widget readouts (cosmetic).** The widget-script `out.textContent` blocks freely use Unicode `θ̂`, `χ²`, `Λₙ`, `σ²` rather than KaTeX (lines 397, 503, 516, 631, 775, 909, 1033, 1042, 1050). probability-theory and information-theory do the same in their readouts (`X̄_N`, `H(X|Y)`). Consistent with section peers — flagging for completeness, not as drift.
- **Widget chrome and helper block: clean.** `.widget / .hd / .ttl / .hint / .row / .readout / .note` are used as documented; the top-of-body helper block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`, plus the page-specific `phi`, `Phi`, `logGamma`, `betaPdf` numerical helpers) is a verbatim copy of the canonical 2D template plus topic-appropriate analytic helpers. No ad-hoc class names.

## Severity
minor polish
