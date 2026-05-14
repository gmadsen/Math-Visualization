# Math correctness audit — `random-walks-and-mixing.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

Note on user's focus list: Polya recurrence, random transpositions, top-to-random,
strong stationary times, and the discrete Cheeger inequality are *not stated* on
this page. Cheeger is invoked by name only; hypercube mixing and Bayer–Diaconis
riffle are quoted as one-line facts. So this audit covers what the page actually
claims, with a closing note on what is absent vs. what the focus list expected.

---

## §1 Markov chains and transition matrices (lines 260–360)

- **Verified.** Memoryless / time-homogeneous definition; row-stochastic $P$, $\sum_y P_{xy}=1$; Chapman–Kolmogorov $P^{m+n}=P^m P^n$; $n$-step law $(P^n)_{xy}$; continuous-time aside $P_t=e^{tQ}$ with generator $Q$. All correct. SRW $P_{xy}=\mathbf{1}[xy\in E]/d_x$; widget on 4-node graph with edges $\{AB,BC,CD,DA,BD\}$ gives degrees $[2,3,2,3]$, $\pi\propto d$, displayed correctly.
- **Wrong/dubious.** None.
- **Severity.** None.

## §2 Stationary distributions (lines 361–477)

- **Verified.** $\pi P=\pi$; existence on finite $S$ via Perron–Frobenius / Brouwer; ergodic theorem for finite irreducible aperiodic $P$ ($P^n\to\Pi$, every row $=\pi$). Detailed balance $\pi_i P_{ij}=\pi_j P_{ji}$ summed over $i$ gives stationarity ✓. Reducibility: two closed classes ⇒ one-parameter family of convex combinations ✓. Power-animator widget computes $\pi$ for $P=[[.6,.3,.1],[.2,.5,.3],[.3,.2,.5]]$ by power iteration; $P$ is irreducible aperiodic, convergence valid.
- **Wrong/dubious.** None.
- **Severity.** None.

## §3 Mixing time (lines 478–636)

- **Verified.**
  - $\|\mu-\nu\|_{\mathrm{TV}}=\tfrac12\sum|\mu(x)-\nu(x)|=\sup_A|\mu(A)-\nu(A)|$, metric, $\in[0,1]$, monotone under any kernel (data processing). Correct.
  - $d(t)=\max_x\|P^t(x,\cdot)-\pi\|_{\mathrm{TV}}$, $t_{\mathrm{mix}}(\varepsilon)=\min\{t:d(t)\le\varepsilon\}$, default $\varepsilon=1/4$. Correct.
  - **Submultiplicativity** $d(s+t)\le 2 d(s)d(t)$ (Levin–Peres Lemma 4.12 via $\bar d$, where $d\le\bar d\le 2d$ and $\bar d$ is multiplicative). Correct.
  - Consequence $d(k\,t_{\mathrm{mix}})\le 2^{-k}$: from $d(t_{\mathrm{mix}})\le 1/4$, $\bar d(t_{\mathrm{mix}})\le 2\cdot 1/4=1/2$, so $d(k t_{\mathrm{mix}})\le \bar d^k\le 2^{-k}$. Hence $t_{\mathrm{mix}}(\varepsilon)\le\lceil\log_2(1/\varepsilon)\rceil t_{\mathrm{mix}}$. Correct.
  - TV widget computes $d(t)$ exactly for the lazy walk $P=(I+D^{-1}A)/2$ on $C_8$, $K_6$, dumbbell. Lazy walk is aperiodic, $\pi_i\propto d_i$. Numerics correct.

## §4 Spectral gap and rapid mixing (lines 637–795)

- **Verified.**
  - Reversibility ⇒ $P$ self-adjoint on $\ell^2(\pi)$ with $\langle f,g\rangle_\pi=\sum\pi_i f_i g_i$. Real spectrum $1=\lambda_1>\lambda_2\ge\cdots\ge\lambda_n\ge -1$ (strict $\lambda_1>\lambda_2$ needs irreducibility; understood). Correct.
  - $\gamma=1-\lambda_2$ relaxation gap; $\gamma_*=1-\max(|\lambda_2|,|\lambda_n|)$ absolute gap. Correct.
  - **Upper bound** $t_{\mathrm{mix}}(\varepsilon)\le \frac{1}{\gamma_*}\log\frac{1}{\pi_{\min}\varepsilon}$ — Levin–Peres Thm 12.3. Correct.
  - Spectral-decay sketch: expand $p$ in $P$-eigenbasis (orthonormal in $\langle\cdot,\cdot\rangle_\pi$); component along $\pi$ preserved, others contract by $\lambda_k$; Cauchy–Schwarz to TV. Correct standard sketch.
  - $\lambda_2\to 1$ ⇔ near-disconnection (Cheeger); $\lambda_n\to -1$ ⇔ near-bipartite parity. Correct.
  - Eigenvalue-inspector widget: builds symmetric $D^{-1/2}P D^{1/2}=(I+D^{-1/2}A D^{-1/2})/2$ similar to lazy $P$; Jacobi eigensolver on the symmetric form. Sound numerics. Spot checks: $K_6$ lazy walk has $\lambda_2 = (1+(-1/5))/2 = 0.4$ (since $K_n$ adjacency has eigenvalues $n-1$ once and $-1$ with mult $n-1$, normalised gives $1$ and $-1/(n-1)$); for $K_6$ lazy gap $\gamma=0.6$. Cycle $C_n$ lazy walk: $\lambda_k=(1+\cos(2\pi k/n))/2$; $C_8$ gives $\lambda_2=(1+\cos(\pi/4))/2\approx 0.854$. Both arithmetically agreeable with the widget output.

- **Wrong/dubious.**
  - **Lower bound (line 645) is incorrect.** The page asserts
    $$\frac{\gamma_*}{2}\log\frac{1}{2\varepsilon}\;\le\;t_{\mathrm{mix}}(\varepsilon).$$
    The standard lower bound (Levin–Peres Thm 12.4 / Aldous–Fill 4.32) is
    $$t_{\mathrm{mix}}(\varepsilon)\;\ge\;\Big(\frac{1}{\gamma_*}-1\Big)\log\frac{1}{2\varepsilon}\;=\;(t_{\mathrm{rel}}-1)\log\frac{1}{2\varepsilon}.$$
    The page's form has $\gamma_*$ in the *numerator* of a *lower* bound. As $\gamma_*\to 0$ (slow mixing) the page's bound $\to 0$, predicting **no** lower bound — the wrong direction. Correct form puts the *relaxation time* $1/\gamma_*$ in the numerator: small gap ⇒ relaxation time large ⇒ mixing slow. The bracket pair "spectral mixing-time bound" needs the lower bound rewritten as $(1/\gamma_* - 1)\log(1/(2\varepsilon))$ (or, equivalently, $\frac{\lambda_*}{\gamma_*}\log(1/(2\varepsilon))$ with $\lambda_*=\max(|\lambda_2|,|\lambda_n|)$).

- **Underspecified.** The "log" base in the upper bound is unspecified; convention is $\ln$ (Levin–Peres). The quiz numeric (60) confirms ln is intended.
- **Severity.** **Moderate.** A flagship displayed inequality is wrong; the upper bound is correct, but the lower bound has the sign/role of $\gamma_*$ flipped.

## §5 Coupling for upper bounds on mixing (lines 796–897)

- **Verified.**
  - Coupling definition (joint with marginals $\mu,\nu$); product is a coupling; $\|\mu-\nu\|_{\mathrm{TV}}=\inf_{\text{coupling}}\mathbb P(X\ne Y)$ (Strassen / maximal coupling). Correct.
  - **Coupling inequality** $\|\mathcal L(X_t)-\mathcal L(Y_t)\|_{\mathrm{TV}}\le\mathbb P(\tau>t)$ for a Markovian coupling with meeting time $\tau$. Correct.
  - **Lazy hypercube** $\{0,1\}^n$: pick coordinate uniformly + randomise bit; couple two copies with shared coordinate + shared new bit. Once every coordinate is touched, $X_t=Y_t$. Coupon-collector ⇒ meeting time $\sim n\log n$ ⇒ $t_{\mathrm{mix}}=O(n\log n)$. Aldous's $\frac{1}{2}n\log n+O(n)$ cutoff cited correctly.
  - **Top-in-at-random** $n\log n$ via coupon-collector applied to the position of the original bottom card (Aldous–Diaconis 1986). Correct in spirit.
  - **Bayer–Diaconis** riffle: $\frac{3}{2}\log_2 n$ shuffles, $n=52$ giving $\approx 8.55$. Correct.

- **Wrong/dubious.**
  - **Cycle-coupling widget (lines 824–894) is mathematically broken — the chains never meet.** The "common-step coupling" code is: with prob $1/2$ both stay, else both move in the *same* uniformly-random direction. Under this rule the circular gap $(Y-X)\bmod n$ is preserved at *every* step (lazy step preserves it; common $\pm 1$ shift preserves it modulo $n$). So $\tau=\infty$ a.s. and the walkers literally never merge. The readout text on no-meet says "common-direction coupling preserves circular gap with prob $1/2$", which is wrong (it preserves it with prob 1).
  - The standard coupling that gives the cycle-mixing bound is the **mirror / opposite-direction coupling**: each step, one of the two walkers updates lazily (or both update with opposite signs), so the gap performs a lazy random walk on $\{0,\ldots,\lfloor n/2\rfloor\}$ absorbed at $0$. Under that coupling $\mathbb E[\tau]=\Theta(n^2)$, giving the correct $t_{\mathrm{mix}}=\Theta(n^2)$ for SRW on $C_n$. The widget should implement that, not the same-direction one.

- **Underspecified.** The page does not state Aldous's $n\log n$ result is also a *lower* bound (cutoff). Mild.
- **Severity.** **Moderate** for the widget (it claims to demonstrate coupling; under its own dynamics the chains never meet, so the displayed "met at $t=\ldots$" branch is unreachable on most runs and the meeting-time intuition is contradicted by the demo).

## §6 Markov-chain Monte Carlo (lines 898–1034)

- **Verified.**
  - Metropolis–Hastings acceptance $\alpha(x,y)=\min(1,\pi(y)q(x|y)/(\pi(x)q(y|x)))$. Detailed balance $\pi(x)q(y|x)\alpha(x,y)=\pi(y)q(x|y)\alpha(y,x)$ holds by inspection (one side is $\pi(y)q(x|y)$, the other is $\pi(x)q(y|x)$, after the min flip). Symmetric proposal reduction to $\min(1,\pi(y)/\pi(x))$ correct.
  - "$t_{\mathrm{mix}}$ steps yield ≈1 effectively independent draw" is the standard heuristic via geometric ergodicity / asymptotic variance scales as $t_{\mathrm{rel}}$. Pedagogically fine.
  - MH widget targets $\tfrac12 N(-2,0.6^2)+\tfrac12 N(2,0.6^2)$, symmetric Gaussian proposal with width $\sigma$, $\alpha=\min(1,\pi(y)/\pi(x))$. Numerically correct.

- **Wrong/dubious.** None.
- **Severity.** None.

## §7 Connections (lines 1035–1057)

- **Verified.** Standard cross-references (martingales / OST, spectral graph theory $\lambda_2(L)$ / Cheeger / expanders / Ramanujan, MCMC variants Glauber/Gibbs, spectral-independence breakthroughs for Ising/hard-core, HDX, quantum walks). All correct attributions.

---

## Quiz bank `quizzes/random-walks-and-mixing.json`

### `rw-markov-chains` — 3 v1
- **Verified.** Row-stochastic axiom ✓; $(P^2)_{12}=0.5\cdot 0.5+0.5\cdot 0.75=0.625$ ✓; Markov property = past⊥future|present ✓.

### `rw-stationary-distribution` — 3 v1
- **Verified.** $\pi P=\pi$ (left action) ✓; $\pi_1=1/3$ for $P=[[.6,.4],[.2,.8]]$ via $0.6\pi_1+0.2(1-\pi_1)=\pi_1$ ✓; reducible chain with two closed classes has a one-parameter family of stationaries ✓ (answer index 2 corresponds to "infinitely many" — choice text matches).

### `rw-mixing-time` — 3 v1
- **Verified.** TV definition ✓; $\|\mu-\nu\|_{\mathrm{TV}}=\tfrac12(0.3+0.3)=0.3$ ✓; $t_{\mathrm{mix}}(\varepsilon)$ definition ✓.

### `rw-spectral-gap` — 3 v1
- **Verified.** Absolute gap definition ✓; numeric $1/0.1\cdot\ln(1/(0.01\cdot 0.25))=10\cdot\ln 400\approx 10\cdot 5.991\approx 59.9$, rounds to 60 ✓ (uses ln). Slow-mixing interpretation ✓.

### `rw-coupling-method` — 3 v1
- **Verified.** Coupling inequality ✓; $n\ln n$ for $n=10$ is $10\cdot 2.303=23.03$ ✓ (rounds to 23). Strassen / optimal-coupling tightness ✓.
- **Underspecified.** Q2's hint sentence "the standard coupling … gives mixing in time $\sim\tfrac12 n\log n$" conflates the *coupling-derived upper bound* (which gives $n\log n + O(n)$ from coupon collector) with the *true mixing time* / Aldous cutoff at $\tfrac12 n\log n$. The standard coupon-collector coupling itself only gets $n\log n + O(n)$; the cutoff sharpening uses different methods. Pedagogical imprecision, doesn't affect the numeric answer.

### `rw-applications-mcmc` — 3 v1 + 1 numeric
- **Verified.** MH acceptance formula ✓; mixing-time-as-cost interpretation ✓; $\pi(2)/\pi(0)=e^{-2}/e^0=e^{-2}\approx 0.1353$, rounds to 0.135 ✓ (symmetric Gaussian proposal, $q$-ratio $=1$, so $\alpha=\min(1,e^{-2})=e^{-2}$).

---

## Concept graph `concepts/random-walks-and-mixing.json`

- **Verified.** All 6 concepts have anchors matching the `<section id="…">` values (markov, stationary, mixing, spectral, coupling, mcmc). Prereqs reasonable.
- **Wrong/dubious.**
  - Concept blurb for `rw-spectral-gap` (line 52): only the *upper* spectral bound is quoted ("$t_{\mathrm{mix}}(\varepsilon)\le\frac{1}{1-\lambda_2}\log\frac{1}{\pi_{\min}\varepsilon}$ … and a matching lower bound up to constants"). Strictly the lower bound is in terms of $1/\gamma_*$, not $1/(1-\lambda_2)$, and the matching constant requires bounding $|\lambda_n|$ as well — minor.

---

## Topics in the focus list that the page does NOT cover

The user's focus included Polya recurrence (transient $d\ge 3$, recurrent $d\le 2$), the
discrete Cheeger inequality, random-transposition mixing, top-to-random, strong
stationary times. Of these:

- **Polya recurrence:** not mentioned. The page is finite-state-only.
- **Discrete Cheeger inequality:** invoked by name only ("Cheeger's inequality is the rigorous version"), no formula stated. Nothing to verify.
- **Random transpositions:** not mentioned (Diaconis–Shahshahani $\tfrac12 n\log n$ would fit §5 but is absent).
- **Top-to-random:** mentioned as one sentence ("top-in-at-random shuffles … coupon collector again"). The implied $n\log n$ mixing time is correct (Aldous–Diaconis), but no derivation given.
- **Strong stationary times:** not mentioned at all. The hypercube and top-to-random examples are presented as coupling arguments; in fact the cleanest analyses use SSTs (the time at which every coordinate has been touched is a strong stationary time for the hypercube, the time the original bottom card reaches the top is one for top-to-random).

These are *gaps in coverage*, not errors — the page is shorter than the focus list. Calling them out so the caller knows the audit cannot speak to them.

---

## Summary

| Section | Severity | Notes |
|---|---|---|
| §1–§3 | none | Markov / stationary / TV / mixing-time foundations all correct |
| §4 spectral | **moderate** | Stated lower bound $\frac{\gamma_*}{2}\log\frac{1}{2\varepsilon}\le t_{\mathrm{mix}}$ is wrong direction in $\gamma_*$; should be $(1/\gamma_*-1)\log(1/(2\varepsilon))$ |
| §5 coupling | **moderate** | Cycle-coupling widget uses common-direction lazy step under which gap is preserved with prob 1 — the chains never meet, contradicting the displayed coupling intuition. Mirror coupling needed. |
| §6 MCMC | none | MH acceptance, detailed-balance, widget all correct |
| `rw-coupling-method` Q2 hint | trivial | Conflates coupling upper bound with cutoff value $\tfrac12 n\log n$; numeric answer unaffected |
| `rw-spectral-gap` blurb | trivial | Lower bound is in $1/\gamma_*$ not $1/(1-\lambda_2)$ |
| Coverage gaps | n/a | Polya recurrence, discrete Cheeger formula, random transpositions, strong stationary times: not on this page |

**Overall severity: moderate.** Two genuine errors: a sign-direction flip in the
spectral lower bound (a flagship displayed inequality), and a coupling widget
whose rule preserves the gap deterministically so the chains never merge. Both
are correctable with one-line fixes. Everything else — submultiplicativity,
ergodic theorem, MH acceptance, hypercube/coupon-collector heuristic, eigenvalue
numerics — checks out.
