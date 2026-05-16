# Math correctness audit — `information-theory.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

---

## §1 Shannon entropy (lines 267–385)

- **Verified.**
  - $H(X) = -\sum_i p_i\log p_i$ with $0\log 0 = 0$; bits/nats/dits via base. Correct.
  - Three pinning facts: $H\ge 0$ (= iff point mass), $H\le\log n$ (= iff uniform), concavity in $p$. All correct.
  - Binary $h(p) = -p\log_2 p - (1-p)\log_2(1-p)$, peak $h(1/2)=1$, symmetric, vanishes at endpoints. Correct.
  - Shannon's axiomatic uniqueness (continuity + monotonicity on uniform + additivity) → $H$ unique up to log base. Standard; correct.
  - Widget: `binEnt(p)` implements $-p\log_2 p - (1-p)\log_2(1-p)$ correctly.
- **Wrong/dubious.** None.
- **Severity.** None.

## §2 Mutual information (lines 386–498)

- **Verified.**
  - $H(X|Y) = \sum_y p_Y(y) H(X|Y=y) = -\sum_{x,y} p_{XY}\log(p_{XY}/p_Y)$. Correct.
  - $I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X) = H(X)+H(Y)-H(X,Y) = D(p_{XY}\|p_X p_Y)$. All correct, symmetric, $\ge 0$, $=0$ iff independent.
  - DPI: $X\to Y\to Z$ Markov $\Rightarrow I(X;Z)\le I(X;Y)$. Correct.
  - Venn widget: clamps $I\le\min(H(X),H(Y))$ (correct since $I\le H(X)$); area $\propto$ entropy via $r=\sqrt{H}\cdot\text{scale}$ ✓.
- **Wrong/dubious.** None.
- **Severity.** None.

## §3 KL divergence (lines 499–628)

- **Verified.**
  - $D(p\|q) = \sum p_i\log(p_i/q_i)$, conventions $0\log 0 = 0$, $p_i>0\wedge q_i=0\Rightarrow D=\infty$. Correct.
  - Gibbs $D\ge 0$, $=0$ iff $p=q$, via Jensen on concave $\log$. Asymmetry, no triangle. Correct.
  - Sanov rate $\asymp\exp(-n\inf_{\nu\in A}D(\nu\|\mu))$. Correct.
  - Widget readout: $D(p\|\text{uniform}) = \log 3 - H(p)$ — derivation $\sum p_i\log(p_i/(1/3)) = -H(p)+\log 3$ ✓.
- **Underspecified.** Sanov exponent in the box uses $\exp(-n\cdot D)$ but $D$ on the page is defined in bits ($\log_2$); strictly the natural-log Sanov needs $D$ in nats (or use $2^{-nD_{\text{bits}}}$). The "$\asymp$" absorbs the constant, so the statement is correct up to the unit convention.
- **Severity.** None.

## §4 Source coding (lines 629–787)

- **Verified.**
  - Prefix-free + Kraft $\sum 2^{-\ell_i}\le 1$ characterisation. Correct.
  - Source-coding theorem: $E[\ell]\ge H(X)$, codes with $E[\ell]<H+1$, block coding gives $H+1/n$. Correct.
  - Huffman algorithm description (greedy merge of two least-probable). Correct; produces optimal prefix code.
  - AEP boxed: typical set size $\approx 2^{nH}$, each $\approx 2^{-nH}$. Correct.
  - Huffman widget: builds tree, computes $H(X)$ and $E[\ell]$; for $(1/2,1/4,1/8,1/8)$ gives $H=1.75$ and code $\{0,10,110,111\}$ length 1.75 — matches Shannon bound exactly (dyadic source).
- **Wrong/dubious.** None.
- **Severity.** None.

## §5 Channel coding — BSC (lines 788–898)

- **Verified.**
  - $C = \max_{p_X} I(X;Y)$ for DMC. Correct.
  - Noisy-channel theorem sharp threshold ($R<C$ achievable, $R>C$ unachievable). Correct.
  - BSC kernel + derivation: $H(Y|X) = h(p)$ (independent of input $X$); uniform input ⇒ $H(Y) = 1$; $C = 1 - h(p)$. Each step correct. Symmetry $C(p)=C(1-p)$ via bit-flip relabelling ✓.
  - Widget readout matches $C = 1-h(p)$.
- **Wrong/dubious.** None.
- **Underspecified.** Page covers only BSC. User-flagged BEC ($C=1-\varepsilon$) and AWGN Gaussian channel ($C=\frac{1}{2}\log_2(1+P/N)$) are absent — gap, not error.
- **Severity.** None.

## §6 Rate–distortion (lines 899–1017)

- **Verified.**
  - $R(D)=\min_{p_{\hat X|X}: E[d]\le D} I(X;\hat X)$. Correct.
  - $R$ convex non-increasing in $D$; $R(0)=H(X)$ in lossless limit (when finite). Correct.
  - Gaussian source SE distortion: $R(D)=\tfrac{1}{2}\log_2(\sigma^2/D)$ on $(0,\sigma^2]$, $=0$ for $D\ge\sigma^2$. Standard (Cover–Thomas 13.3.2). Correct.
  - "Gaussian maximises $R(D)$ at fixed variance" — Cover–Thomas 13.3.3, correct.
  - Widget plots curve correctly; readout $R(\sigma^2/2)=0.5$, $R(\sigma^2/4)=1$, $R(\sigma^2/8)=1.5$ ✓.
- **Wrong/dubious.** None.
- **Severity.** None.

## §7 AEP (lines 1018–1051)

- **Verified.**
  - $Y_i = -\log_2 p(X_i)$ i.i.d., $E[Y_i] = H(X)$, WLLN ⇒ $-\tfrac{1}{n}\log_2 p(X^n)\xrightarrow{P} H(X)$. Correct.
  - Typical set $A_\varepsilon^{(n)}$ definition. Correct.
  - Three properties: $\Pr(A_\varepsilon^{(n)})\to 1$; $|A|\le 2^{n(H+\varepsilon)}$; $|A|\ge (1-\varepsilon)2^{n(H-\varepsilon)}$. Correct (Cover–Thomas 3.1.2).
  - Bernoulli(1/4) example: $H=h(1/4)\approx 0.8113$; $2^{100}\approx 1.27\times 10^{30}$ ✓; $|A|\approx 2^{81.13}\approx 2.6\times 10^{24}$ — page says $\approx 2.5\times 10^{24}$, within rounding ✓; fraction $2^{-18.87}\approx 1/4.86\times 10^5$ — page says "one part in $5\times 10^5$" ✓.
  - Equipartition factor $2^{2n\varepsilon}$ for ratio of typical-sequence probabilities: $2^{-n(H-\varepsilon)}/2^{-n(H+\varepsilon)} = 2^{2n\varepsilon}$ ✓.
  - Source coding overhead $\lceil n(H+\varepsilon)\rceil + 1$ bits achievable. Correct.
- **Wrong/dubious.**
  - **"exactly-50-ones" called "individually probable or impossible" (line 1038).** For Bernoulli(1/4), the binomial mode is at 25, not 50. A single sequence with 50 ones has probability $(1/4)^{50}(3/4)^{50}\approx 2^{-120.75}$ — extremely rare individually, not "probable". The grouped phrase "all-zeros [probable for Bernoulli(1/4)? actually $(3/4)^{100}\approx 3\times 10^{-13}$, also rare], all-ones [vanishingly rare], exactly-50-ones [rare]" doesn't quite parse either. The intent — these atypical sets are individually negligible in aggregate mass — is right; the adjective "probable" is misapplied to any single sequence in this example.
- **Underspecified.**
  - Jointly-typical decoding line says "rate below $I(X;Y)$ ⇒ unique with prob → 1" — strictly that gives achievability for the chosen input distribution; capacity then optimises over $p_X$. Page elides "for the maximising input law".
- **Severity.** **Trivial.** Pedagogical loose phrasing only; no broken theorem.

## §8 Fisher information & Cramér–Rao (lines 1052–1086)

- **Verified.**
  - Score $U_\theta = \partial_\theta\log p_\theta$; mean-zero $E_\theta[U_\theta]=0$ via $\partial_\theta\int p_\theta\,dx = 0$. Correct.
  - $I(\theta) = \mathrm{Var}(U_\theta) = E[U_\theta^2] = -E[\partial_\theta^2\log p_\theta]$ — second equality from a second IBP under regularity. Correct.
  - Local KL: $D(p_\theta\|p_{\theta+\delta}) = \tfrac{1}{2}I(\theta)\delta^2 + o(\delta^2)$. Correct (Fisher–Rao metric).
  - C–R: $\mathrm{Var}_\theta(\hat\theta)\ge 1/I(\theta)$ for unbiased $\hat\theta$. Proof: $\mathrm{Cov}(\hat\theta,U_\theta) = \partial_\theta E[\hat\theta] = 1$, then C–S $1\le\mathrm{Var}(\hat\theta)I(\theta)$. Correct.
  - Fisher additivity for i.i.d., $I_n=nI$, bound $\sigma^2/n$. Correct.
  - Gaussian example: $\log p = -\tfrac{1}{2}\log(2\pi\sigma^2) - (x-\theta)^2/(2\sigma^2)$, score $(X-\theta)/\sigma^2$, $I=E[(X-\theta)^2]/\sigma^4 = 1/\sigma^2$ ✓; $\mathrm{Var}(\bar X_n) = \sigma^2/n$ attains the bound ✓.
  - MLE asymptotic normality $\sqrt n(\hat\theta_{\text{MLE}}-\theta)\Rightarrow N(0,1/I)$. Correct under regularity.
  - De Bruijn: $\partial_t h(X+\sqrt t Z) = \tfrac{1}{2}J(X+\sqrt t Z)$, $Z\sim N(0,1)$. Correct (Cover–Thomas 17.7.2).
  - Caveats (biased estimators can beat $1/I$, regularity assumed). Correct.
- **Wrong/dubious.** None.
- **Severity.** None.

## §9 Connections (lines 1087–1109)

- **Verified.** Sanov ↔ source coding, Boltzmann ↔ Shannon in i.i.d., Han / Shearer inequalities, Cramér–Rao ↔ Fisher, Stein's lemma exponent = KL, Kolmogorov complexity ↔ Shannon entropy, capacity-achieving codes (RS/LDPC/polar). All correct sketches.
- **Severity.** None.

---

## Quiz bank `quizzes/information-theory.json`

- **§1 entropy:** $h(1/4)=0.5+0.75\log_2(4/3)\approx 0.8113$ ✓; uniform maximiser ✓; fair-coin $H=1$ ✓.
- **§2 mutual info:** false-identity Q3 (subtracting both conditionals double-counts) ✓; independence ⇔ $I=0$ ✓; DPI direction ✓.
- **§3 KL:** asymmetry (counterexample $D(p\|q)=\infty$, $D(q\|p)=1$ for $p=(1/2,1/2),q=(1,0)$) ✓; numeric $D=\tfrac12+\tfrac12\log_2(2/3)\approx 0.2075$ ✓; Sanov rate ✓.
- **§4 source coding:** Shannon bound description ✓; $H = 0.5+0.5+0.375+0.375 = 1.75$ ✓; AEP $\approx 2^{nH}$ ✓.
- **§5 channel:** $C(0)=1$ ✓; $C(1/2)=0$ ✓; sharp threshold ✓.
- **§6 rate-distortion:** min-form definition ✓; $R(\sigma^2)=0$ ✓; monotonicity argument ✓.
- **§7 AEP:** $-\tfrac{1}{n}\log p\to H$ in probability ✓; Bernoulli(1/4) entropy ✓; matching `[0,1,2,3]` straight-through ✓.
- **§8 Fisher / C–R:** $\sigma^2/n = 4/10 = 0.4$ ✓; $\mathrm{Var}\ge 1/I$ ✓; mean-zero score Q3 ($E[\partial_\theta\log p_\theta]=0$, so option 4 is the false one) ✓.

All 24 questions verified.

---

## Concept graph `concepts/information-theory.json`

- 8 concepts; anchor IDs (`entropy`, `mutual-info`, `kl-divergence`, `source-coding`, `channel-coding`, `rate-distortion`, `aep`, `fisher-cramer-rao`) all match `<section id>` values. Blurbs mathematically correct.

---

## Summary

| Section | Severity | Notes |
|---|---|---|
| §1–§6 | none | All formulas, theorems, and widget computations verified |
| §7 AEP | trivial | "Exactly-50-ones" prose calls a $2^{-120}$ event "probable"; phrasing only |
| §8 Fisher / C–R | none | Score, Fisher equivalences, C–R proof, Gaussian example all correct |
| §9 Connections | none | All cross-discipline statements correct |
| Quiz bank | none | All 24 questions and answer keys verified |
| Concept graph | none | Anchors and blurbs correct |

**Overall severity: clean.** No broken theorems, no algebra errors, no swapped signs. One mild pedagogical phrasing issue in §7. Everything Shannon/KL/MI/source/channel/RD/AEP/Fisher–C–R is correct.

**Coverage gaps relative to user focus list (not errors, scope):**
- **BEC** ($C=1-\varepsilon$) not present.
- **Gaussian (AWGN) channel capacity** $\tfrac12\log_2(1+P/N)$ not present.
- **Fano's inequality** $H(X|Y)\le 1 + P_e\log(|\mathcal X|-1)$ not stated.
- **Differential entropy** appears only as a name in the De Bruijn box; no defining formula $h(X)=-\int f\log f$, no $h(\mathcal N(0,\sigma^2)) = \tfrac12\log(2\pi e\sigma^2)$, no $h(\text{Unif}[a,b])=\log(b-a)$.

Adding these would round out the Cover–Thomas core; they are absent rather than wrong.
