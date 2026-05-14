# Math correctness audit — `fixed-point-theorems.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

---

## §1 Banach contraction principle (lines 265–301)
- **Verified.**
  - Statement: complete $(X,d)$, $f:X\to X$ with $d(f(x),f(y))\le L\,d(x,y)$, $L<1$ ⇒ unique fp; iteration $x_{n+1}=f(x_n)$ Cauchy with bound $d(x_n,x_*)\le\tfrac{L^n}{1-L}d(x_0,x_1)$. ✓
  - Counterexample: $f(x)=x+e^{-x}$ on $\mathbb{R}$ has $f'(x)=1-e^{-x}\in(0,1)$ but $\sup f'=1$; $f(x)>x$ everywhere ⇒ no fp. ✓
  - Picard widget maps `half`, `quart` (linear contractions, fixed points $2$ and $4$) ✓; cos fp ≈ 0.7390851332 (Dottie number) ✓.
- **Wrong/dubious.**
  - Picard widget label "$f(x)=\cos(x)$ ($L\approx 0.84$ near fp)": the actual local Lipschitz constant near the fp is $|\sin(0.7391)|\approx 0.673$, not $0.84$. The 0.84 looks like $\sin(1)$ — a global bound on a small interval, not a "near fp" constant. Also, on the widget's own slider domain $x_0\in[-3,6]$ the map is not a contraction at all (since $|\sin x|=1$ at $x=\pm\pi/2$); cos iteration converges from anywhere only by the post-first-step funnelling into a contracting interval, not by Banach on $\mathbb{R}$. Wording slip.
- **Underspecified.** None.
- **Severity.** Minor.

## §2 Brouwer fixed-point theorem (lines 303–336)
- **Verified.**
  - Continuous $f:D^n\to D^n$ has fp; equivalent form for non-empty compact convex $\subset\mathbb{R}^n$. ✓
  - Failure on $S^1$ (antipode) and on open ball (translation toward boundary). ✓
  - No-retraction proof via $H_{n-1}(D^n)=0$ vs $H_{n-1}(S^{n-1})=\mathbb{Z}$ ⇒ retraction-identity contradiction. ✓
  - Widget: ray construction $r(x)$ on the disk; quadratic intersection of ray with $\partial D$ algebraically correct.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §3 Schauder fixed-point theorem (lines 338–364)
- **Verified.**
  - Two equivalent forms: ($C$ closed convex, $T$ continuous, $T(C)$ relatively compact) and (compact $T$ on closed bounded convex). ✓
  - Riesz lemma ⇒ closed unit ball non-compact in infinite-dim Banach. ✓
  - **Kakutani's witness on $B_{\ell^2}$**: $T(x_1,x_2,\ldots)=(\sqrt{1-\|x\|^2},x_1,x_2,\ldots)$. Direct check: $\|Tx\|^2=(1-\|x\|^2)+\sum_n x_n^2=1$, so $T:B_{\ell^2}\to S_{\ell^2}\subset B_{\ell^2}$, continuous, fp-free. ✓
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §4 Lefschetz fixed-point theorem (lines 366–404)
- **Verified.**
  - $\Lambda(f)=\sum(-1)^k\,\tr(f_*|H_k(X;\mathbb{Q}))$, $\Lambda(f)\ne 0$ ⇒ fp; one-directional. $\Lambda(\mathrm{id})=\chi(X)$. ✓
  - Brouwer recovery: contractible ⇒ $\Lambda(f)=1\ne 0$. ✓
  - **Widget table** — Betti and trace rows checked:
    - $S^2$ antipode: degree on $H_2$ is $(-1)^{2+1}=-1$; row $[1,0,-1,0]$, $\Lambda=0$ ✓ (consistent with antipode-on-$S^2$ having no fps and $\Lambda=0$ being silent).
    - $T^2$ antipode $(x,y)\mapsto(-x,-y)$: action on $H_1=\mathbb{Z}^2$ is $-I$ (trace $-2$), on $H_2$ is $\det(-I)=+1$. Row $[1,-2,1,0]$, $\Lambda=4$ ✓ (antipode on $T^2$ has 4 fps — the 2-torsion).
    - $T^2$ identity: $\Lambda=1-2+1=0=\chi(T^2)$ ✓ (page's "fixes everything but $\Lambda=0$" example).
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §5 Kakutani fixed-point theorem (lines 406–435)
- **Verified.**
  - Set-valued $\varphi:C\rightrightarrows C$ on non-empty compact convex $C\subset\mathbb{R}^n$ with closed graph and non-empty closed convex values ⇒ $\exists x^*\in\varphi(x^*)$. ✓
  - Closed graph on compact codomain ≡ upper hemicontinuity. ✓
  - Nash via product correspondence: each $B_i(\sigma_{-i})$ is the (non-empty closed convex) face of player $i$'s simplex maximizing the linear-in-own-mixed-strategy payoff; product of compact convex is compact convex; closed graph from upper hemicontinuity of `argmax`. ✓
  - Widget: $\varphi(x)=\{0\}$ for $x<a$, $[0,1]$ at $a$, $\{1\}$ for $x>a$. Graph is the closed "Z-shape" (two horizontal rays joined by vertical interval); fp at $x^*=a$ since $a\in[0,1]=\varphi(a)$. ✓
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §6 Caristi's fixed-point theorem (lines 437–545)
- **Verified.**
  - Statement: complete $X$, lsc $\varphi:X\to[0,\infty)$, $d(x,Tx)\le\varphi(x)-\varphi(Tx)$ ⇒ fp; no continuity of $T$. ✓
  - Proof sketch: telescope $\sum d(x_k,x_{k+1})\le\varphi(x_0)<\infty$ ⇒ Cauchy ⇒ limit ⇒ lsc forces $d(x_*,Tx_*)=0$. ✓
  - Banach as Caristi corollary via $\varphi(x)=d(x,Tx)/(1-L)$: $\varphi(x)-\varphi(Tx)=\tfrac{1}{1-L}[d(x,Tx)-d(Tx,T^2x)]\ge\tfrac{1-L}{1-L}d(x,Tx)=d(x,Tx)$. ✓
  - Concrete non-contraction $T(x)=x-x^2/2$ on $[0,1]$: $T'(0)=1, T'(1)=0$; with $\varphi(x)=2x$, $\varphi(x)-\varphi(Tx)=x^2\ge x^2/2=|x-Tx|$. ✓ Range: $T(0)=0, T(1)=1/2$, so $T:[0,1]\to[0,1/2]\subset[0,1]$. ✓
  - Equivalence with Ekeland's variational principle. ✓
  - Widget formulas: $T(x)=x-x^2/2$, $\varphi(x)=2x$, displacement $=x^2/2$, drop $=x^2$, total $\sum$displacement $\le\varphi(x_0)$. ✓
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §7 KKM lemma (lines 547–820)
- **Verified.**
  - Statement: closed $C_0,\ldots,C_n\subseteq\Delta_n$ with $\mathrm{conv}\{v_i:i\in S\}\subseteq\bigcup_{i\in S}C_i$ ⇒ $\bigcap C_i\ne\emptyset$. ✓
  - Sperner odd-count lemma + parity proof + KKM ⇔ Sperner ⇔ Brouwer (mesh-shrinking + compactness) standard. ✓
  - **KKM ⇒ Brouwer construction**: $C_i=\{x:f(x)_i\le x_i\}$ closed by continuity; covering condition via $\sum_{i\in S}f(x)_i\le 1=\sum_{i\in S}x_i$ argument. ✓
  - **Closed-star widget**: $A_i=\{x_i\ge t_i\}$. Cover-condition for face $S$: an $x$ on face $\Delta_S$ has $x_i=0$ off $S$ and $\sum_{i\in S}x_i=1$; uncovered iff $x_i<t_i$ for all $i\in S$, requiring $\sum_{i\in S}t_i>1$. Tightest is $S=\{0,1,2\}$: cover holds iff $\sum t_i\le 1$. Intersection $\bigcap A_i=\{x:x_i\ge t_i\,\forall i\}$ non-empty iff $\sum t_i\le 1$. So in this formulation the two conditions coincide. ✓ (Page is careful to note this is special to the closed-star formulation.)
  - **Sperner widget**: rule "vertex on face $\Delta_S$ only gets labels in $S$" enforced by `pickLabel` restricting allowed labels to indices with positive coordinate; rainbow count is odd by Sperner. ✓
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §8 Applications (lines 822–850)
- **Verified.**
  - **Picard–Lindelöf**: $T(\varphi)(t)=x_0+\int_{t_0}^t f(s,\varphi(s))ds$ on $C([t_0-h,t_0+h])$ is a contraction for small $h$ when $f$ is Lipschitz in second argument. ✓
  - **IFT via Banach**: Newton-style $y\mapsto y-D_yF(x_0,y_0)^{-1}F(x,y)$ contracting on a small ball. ✓
  - **Markov stationary**: $\Delta=\{\pi\ge 0:\sum\pi_i=1\}$ compact convex, $\pi\mapsto\pi P$ continuous (in fact linear), Brouwer ⇒ $\pi^*$. ✓ (Existence only; uniqueness needs Perron–Frobenius / irreducibility.)
  - **Schauder for nonlinear elliptic**: compact solution operator (e.g. $L^{-1}$ on Hölder space) on a closed ball, existence without uniqueness. ✓
  - **Nash via Kakutani**: product best-response correspondence on product simplex. ✓
  - **Picard widget**: trapezoidal-rule integration of iterates; closed-form truths $x_0 e^t$ for $\dot x=x$ ✓ and $x_0 e^{t^2/2}$ for $\dot x=tx$ ✓.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

---

# Quiz bank — `quizzes/fixed-point-theorems.json`

## `fpt-banach`
- All 3 v1 ✓. Q2 ($x=\tfrac{1}{2}x+1\Rightarrow x=2$) ✓; Q3 ($f=x+e^{-x}$, $f'\to 1$, no $L<1$, no fp) ✓.

## `fpt-brouwer`
- All ✓. Q1 antipode on $S^1$ ✓; Q2 no-retraction ✓; Q3 constant map → 1 fp ✓.

## `fpt-schauder`
- All ✓. Riesz-lemma motivation, integral-operator + Arzelà–Ascoli, finite-dim approximation by convex hulls.

## `fpt-lefschetz`
- All ✓. Q1: $\Lambda(\mathrm{id}_{T^2})=1-2+1=0$ ✓; Q2 contractible ⇒ $\Lambda=1$ ✓; Q3 one-directional implication ✓.

## `fpt-kakutani`
- All ✓. Best-response set-valued, upper hemicontinuity ≡ closed graph (compact codomain).

## `fpt-caristi`
- All ✓.
  - q1 multi-select `[0,1,2]` (complete, lsc, $\varphi\ge 0$ — not continuity, not Lipschitz) ✓.
  - q2 $c=1/(1-L)=1/(2/3)=1.5$ ✓ for $L=1/3$.
  - q3 $T(x)=x-x^2/2$, $\varphi=2x$: $T'(0)=1$ kills Banach but Caristi inequality holds. ✓

## `fpt-kkm`
- All ✓.
  - q1 covering condition statement ✓.
  - **q2 matching `[2,0,1,3]`** — convention `answer[i]=j` ↔ left[i] matches right[j]:
    - left[0] KKM closed-cover → right[2] "Closed sets covering each face share a common point" ✓
    - left[1] Brouwer → right[0] "Continuous self-map of $\Delta_n$ has a fixed point" ✓
    - left[2] Sperner → right[1] "Fully-labelled small simplex … exists" ✓
    - left[3] Fan-KKM → right[3] "Set-valued generalisation underlying von Neumann minimax" ✓
  - q3 barycentric-sum argument for the cover condition ✓.

## `fpt-applications`
- All ✓. Picard–Lindelöf via Banach; Markov stationary via Brouwer (existence only); IFT via Banach.

---

## Severity summary

**Major:** None.

**Minor (1):**
- §1 Picard widget option label: cos's "$L\approx 0.84$ near fp" is wrong (true near-fp Lipschitz constant is $|\sin(0.7391)|\approx 0.673$); 0.84 is $\sin(1)$, a global bound on a small interval, not a near-fp constant. Additionally the cos branch is not a Banach contraction on the widget's slider domain $[-3,6]$ at all, since $|\sin|$ attains 1.

**Patterns / corpus notes:**
- The page is mathematically tight throughout. Theorem statements, proofs, the Caristi accounting derivation, the KKM ⇒ Brouwer construction, the Lefschetz Betti / trace tables (including the subtle antipode-on-$T^2$ getting trace $-2$ on $H_1$ and $+1$ on $H_2$), the Kakutani $B_{\ell^2}$ shift witness, and all quiz answer keys are correct.
- Notably the matching answer key (`fpt-kkm` q2) is correct here, against the corpus pattern of inverted matching keys flagged elsewhere (adjoint-hilbert, model-theory-basics, cluster-algebras).
