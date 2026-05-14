# several-complex-variables — math correctness audit (2026-05)

**Section:** Analysis

## Verified claims

### Hartogs phenomenon (§1)

- **Hartogs extension theorem (1906)** (line 275): on a domain $\Omega\subset\mathbb{C}^n$, $n\ge 2$, with $K\subset\Omega$ compact and $\Omega\setminus K$ connected, every holomorphic $f$ on $\Omega\setminus K$ extends uniquely to $\Omega$ — correct standard statement.
- **Hartogs figure** (line 278): $H_r = \{|z_1|<1, r<|z_2|<1\}\cup\{r<|z_1|<1, |z_2|<1\}$ — correct standard "polydisk shell" presentation.
- **Slice-Laurent argument** (line 279): for fixed $z_1$ with $|z_1|<r$, $f(z_1,\cdot)$ is defined on $r<|z_2|<1$ with Laurent $\sum c_k(z_1)z_2^k$; the negative-power coefficients are holomorphic in $z_1$ on $|z_1|<1$ (analytic dependence of Cauchy integrals on a parameter) and identically vanish on $r<|z_1|<1$ (where the inner integral can be deformed); identity principle then forces them to vanish everywhere — correct.
- **Reinhardt domain via $\log|\Omega|$** (line 336): a Reinhardt $\Omega$ is determined by its image in $\mathbb{R}^n$ under coordinate-wise $\log|\cdot|$; **log-convex hull = holomorphically convex hull**; Reinhardt is non-Hartogs iff log-image is convex — correct (this is the Reinhardt-domain envelope-of-holomorphy theorem).
- **Hartogs widget readouts** (line 328): inner 4-volume $r^4$, shell $1-r^4$, $\partial K$ Bochner–Martinelli measure $\sim r^3$ — geometrically right (real-dim 4 polydisk inner block with side $r$, real-3 boundary).

### PSH and the Levi form (§2)

- **Definition via complex-line restrictions** (line 362): USC $u$ with $\zeta\mapsto u(a+\zeta b)$ subharmonic on every complex line — standard.
- **$C^2$ characterization via complex Hessian** (line 365): $u$ PSH $\iff [\partial^2 u/\partial z_j\partial\bar z_k]\ge 0$ Hermitian psd — correct.
- **PSH ⇒ subharmonic but not conversely** (line 366): $\Delta u = 4\sum u_{j\bar j} = 4\,\mathrm{tr}$ of complex Hessian, so trace $\ge 0$ is the weaker subharmonic condition — correct.
- **Examples** (lines 369–373): $\log|f|$ PSH (with Lelong-number current at zeros); $|z|^2$ has Hessian = identity (strictly PSH); $\log\sum|f_j|^2$ PSH — all correct standard examples.
- **Levi form** (line 376): $\partial\bar\partial\rho|_p$ restricted to $T^{1,0}_p\partial\Omega$, independent of choice of defining function (rescaling $\rho\to e^h\rho$ multiplies the restricted form by $e^h>0$ on the tangent) — correct.
- **Levi widget** (lines 396–443): toy $\rho(z)=|z|^2-1+a|z_2|^2$; the eigenvalues of the complex Hessian on the natural diagonal basis are $1$ and $1+a$; sign-flip at $a=-1$ — arithmetic correct as a toy.

### $\bar\partial$-equation and Hörmander (§3)

- **$d=\partial+\bar\partial$ split, holomorphy = $\ker\bar\partial$** (line 467) — correct.
- **One-variable $\bar\partial$ via Cauchy–Pompeiu** (line 471) — correct.
- **Hörmander's $L^2$ estimate** (lines 473–477): on pseudoconvex $\Omega$ with strictly PSH weight $\varphi$, $\bar\partial$-closed $(0,1)$-form $\alpha$ admits $u$ with $\bar\partial u=\alpha$ and $\int|u|^2 e^{-\varphi}\le \int|\alpha|^2_{i\partial\bar\partial\varphi}e^{-\varphi}$ — correct standard statement (Hörmander 1965).
- **Strict PSH = non-degenerate metric on $(0,1)$-forms** (line 479) — correct.
- **Ohsawa–Takegoshi extension** (line 485) — correct mention.
- **Hörmander widget readout, ratio $1/c$** (line 533): with $\varphi=c|z|^2$, $i\partial\bar\partial\varphi=c\cdot\text{std}$, dual on $(0,1)$-forms scales as $1/c$, so $|\alpha|^2_{i\partial\bar\partial\varphi}=(1/c)|\alpha|^2_{\text{std}}$, giving Hörmander ratio $1/c$ — correct.
- **Bochner–Kodaira–Nakano identity sketch** (line 553): proof reduces to integration-by-parts identity from BKN, generalizes to bundles and $\bar\partial$-Neumann (Kohn–Hörmander) — correct.

### Pseudoconvexity / domain of holomorphy (§4)

- **Cartan–Thullen: domain of holomorphy = holomorphically convex** (line 575): for every compact $K\subset\Omega$, $\widehat K_\Omega$ is compact in $\Omega$ — correct standard.
- **Levi pseudoconvex (smooth case)** (line 581): Levi form psd everywhere on $\partial\Omega$, intrinsic — correct.
- **PSH-exhaustion definition without smoothness** (line 583) — correct.
- **Levi's problem (Oka 1942 / Bremermann–Norguet 1954 / Grauert)** (line 585): pseudoconvex ⇔ domain of holomorphy — correct attribution.
- **Diederich–Fornæss exponent $\eta(\Omega)\in(0,1]$** (line 592): $-(-r)^\eta$ PSH for some $\eta\in(0,1]$; strictly pseudoconvex ⇒ $\eta=1$ (since $r$ itself is then PSH on a neighbourhood); worm domains have $\eta<1$ — correct (the original Diederich–Fornæss 1977 theorem).
- **Bergman / Szegő kernel asymptotics on strictly psc domains** (line 590): Fefferman 1974 (Bergman), Boutet de Monvel–Sjöstrand 1976 (Szegő) — correct attribution.
- **Property table** (lines 596–604): ball strictly psc with $\eta=1$ ✓, polydisk weakly (corners) ✓, worm has $\eta<1$ and breaks global $\bar\partial$-Neumann regularity ✓ (Christ 1996), Hartogs figure not psc ✓.

### Stein manifolds (§5)

- **Stein definition (Stein 1951)** (line 619): three axioms — holomorphically convex, holomorphically separable, holomorphic local coordinates — correct.
- **Grauert equivalence: smooth strictly PSH exhaustion** (line 625) — correct.
- **Remmert–Bishop–Narasimhan embedding** (line 625): Stein ⇔ closed embedded submanifold of some $\mathbb{C}^N$ — correct.
- **Stein ↔ affine slogan** (lines 628–633): closed in $\mathbb{C}^N$ vs closed in $\mathbb{A}^N$; functions separate / coordinatize; Theorem B vs Serre vanishing — correct analogy.
- **Cartan A and B (1953)** (lines 637–639): for coherent $\mathcal{F}$ on Stein $X$, A says $H^0(X,\mathcal{F})$ generates every stalk as $\mathcal{O}_{X,x}$-module; B says $H^q(X,\mathcal{F})=0$ for $q\ge 1$ — correct.
- **Examples / non-examples** (line 635): $\mathbb{C}^n$, every domain of holomorphy, every open Riemann surface (Behnke–Stein 1949), complement of a hypersurface in a Stein manifold all Stein ✓; $\mathbb{CP}^n$ and Hopf surfaces not Stein (compact ⇒ only constant holomorphic functions ⇒ point separation fails) ✓.
- **Cartan B proof outline** (lines 645–649): exhaustion + Hörmander on $X_c$ + Runge approximation + limit — correct standard scheme.

### Cousin problems (§6)

- **First Cousin = Mittag-Leffler analog** (line 747): cocycle $f_i-f_j\in\mathcal{O}(U_i\cap U_j)$, solvability ⇔ $H^1(\Omega,\mathcal{O})=0$ — correct.
- **First Cousin theorem on Stein** (line 749): solvable on Stein by Theorem B — correct.
- **One-variable Mittag-Leffler / Behnke–Stein** (line 751): $H^1(\Omega,\mathcal{O})=0$ for every open $\Omega\subset\mathbb{C}$ — correct.
- **Second Cousin via $\mathcal{O}^\times$ and exponential exact sequence** (lines 754–759) — correct standard derivation.
- **$\mathrm{Pic}(\Omega)\cong H^2(\Omega,\mathbb{Z})$ on Stein** (line 761) — correct (immediate from Theorem B applied to $H^1$ and $H^2$ in the long exact sequence).
- **Quiz: $\mathrm{Pic}(\mathbb{C}^n)=0$ via contractibility** (lines 261–275) — correct.

### Quiz bank cross-checks

- **scv-hartogs Q3 multi-select** (line 41): "Hartogs figure is not a domain of holomorphy" ✓ (envelope = bidisk); "Hartogs figure is not pseudoconvex" ✓.
- **scv-psh Q2** (line 65): $\log|z_1|$ PSH on $\mathbb{C}^n\setminus\{0\}$ as pullback of one-variable subharmonic ✓; $|z_1|^2-|z_2|^2$ Hessian eigenvalues $\pm 1$ ✓; $-|z|^2$ plurisuperharmonic ✓; $\mathrm{Re}(z_1\bar z_2)$ has off-diagonal complex Hessian $\bigl(\begin{smallmatrix}0&1/2\\1/2&0\end{smallmatrix}\bigr)$ with eigenvalues $\pm 1/2$ ✓.
- **scv-psh Q3 matching** (lines 84–93): under the implementation convention `answer[i]` = left-index paired with `right[i]`: right[0]=polydisk→left[1]=Weakly ✓, right[1]=ball→left[0]=Strict ✓, right[2]=Hartogs→left[2]=Not ✓.
- **scv-dbar Q2 numeric** $C=0.25$ (line 116): with $\varphi=4|z|^2$, dual metric scales as $1/4$, Hörmander ratio $1/c=1/4$ ✓.
- **scv-stein Q2 multi-select** (line 198): $\mathbb{C}^n$, polydisk, every open Riemann surface Stein ✓; $\mathbb{CP}^2$, Hopf surface not (compact) ✓.

## Wrong / dubious claims

- **§6 self-contradicting parenthetical on $\mathbb{C}^2\setminus\{0\}$** (line 819). The text reads: *"Take $\Omega=\mathbb{C}^2\setminus\{(0,0)\}$ — not Stein, since one can show $H^1(\Omega,\mathcal{O})\ne 0$ in dimension $2$ (actually the punctured $\mathbb{C}^2$ **is** Stein for $n\ge 2$ by Hartogs, but the Hopf bundle on $\mathbb{C}^2\setminus\{0\}$ as a model survives transfer)."* The first half is correct (and is the fact actually used); the parenthetical is **the opposite of true**. By Hartogs's extension theorem, every holomorphic function on $\mathbb{C}^n\setminus\{0\}$ ($n\ge 2$) extends to all of $\mathbb{C}^n$, so $\mathcal{O}(\mathbb{C}^n\setminus\{0\})=\mathcal{O}(\mathbb{C}^n)$ — these functions cannot be a domain of holomorphy and the space is **not** Stein. (Standard: $H^1(\mathbb{C}^n\setminus\{0\},\mathcal{O})$ is a non-zero infinite-dimensional space; Theorem B fails.) The parenthetical should be deleted; the surrounding sentence is otherwise correct. **Severity: outright math error in a parenthetical, contradicting the quiz answer that says compact complex manifolds with constant-only $\mathcal{O}$ are non-Stein and contradicting the page's own §1 development.**

- **§4 polydisk Levi-form characterization** (line 600, table). The table says of the polydisk: "Levi form vanishes on edges". On the smooth faces of $\mathbb{D}^n$ (the open $(2n-1)$-faces $\{|z_j|=1, |z_k|<1\text{ for }k\ne j\}$), the defining function is $\rho_j=|z_j|^2-1$; $\partial\bar\partial\rho_j$ has a single non-zero entry in slot $(j,j)$, but the complex tangent $T^{1,0}\partial\Omega$ is the orthogonal complement of $\partial\rho_j$ which **excludes** the $z_j$-direction. The Levi form is therefore **identically zero** on the smooth faces — not "vanishes on edges". The polydisk is the canonical example of a pseudoconvex domain whose Levi form is identically zero, so calling it "Levi form vanishes on the edges" gets the geometry backwards. **Severity: misleading rephrasing of a structural fact.** Same issue mirrored verbatim in `quizzes/several-complex-variables.json` line 85 ("polydisk — Levi form vanishes on the edge components but is $\ge 0$"). The Levi form vanishes on the *whole smooth boundary*; the corners (edges) are non-smooth so Levi form isn't even defined there.

- **§6 widget label "$\mathbb{CP}^1\times\mathbb{C}^*$"** (line 766). The widget header advertises the toy as $\mathbb{CP}^1\times\mathbb{C}^*$, but every visualization element ($U_1$ near $0$, $U_2$ near $\infty$, overlap an annulus, $f_1/f_2=z^d$, class in $H^2(\Omega,\mathbb{Z})=\mathbb{Z}$ identified with degree) is the Picard-of-$\mathbb{CP}^1$ picture. $\mathrm{Pic}(\mathbb{CP}^1\times\mathbb{C}^*)\cong\mathrm{Pic}(\mathbb{CP}^1)\oplus\mathrm{Pic}(\mathbb{C}^*)=\mathbb{Z}\oplus 0=\mathbb{Z}$, so the answer is the same in either case — but the title's space-of-arguments doesn't match the picture, and $\mathbb{C}^*$ is itself Stein so it's a strange factor to add. **Severity: cosmetic mislabel; underlying math correct.** Either drop the $\times\mathbb{C}^*$ or visualize the cylinder factor.

- **§3 Hörmander quiz "ordering"** (lines 121–137). The five steps are the canonical Hörmander argument and the listed order $[1,2,3,0,4]$ is correct. Step (4) labelled "Solve $\bar\partial u=\alpha$ as the orthogonal projection of $0$ onto $\bar\partial^*\circ$ closed range" is awkwardly worded — the standard phrasing is *the minimal-norm solution is the projection of any solution onto $\ker\bar\partial^\perp = \overline{\mathrm{im}\,\bar\partial^*}$*. Mathematically defensible but unclear; not an error.

## Underspecified or unverifiable claims

- **§3 "polynomials are dense in holomorphic functions on a pseudoconvex domain in suitable weighted $L^2$ spaces"** (line 486) is true but glosses over the qualifier: density is for the weighted $L^2(\Omega, e^{-\varphi}\,dV)\cap\mathcal{O}(\Omega)$ space and depends on $\Omega$ being a Runge domain in the appropriate sense. The page's framing is fine but loose.

- **§4 "Diederich–Fornæss exponent $\eta(\Omega)\in(0,1]$"** (line 592): the standard 1977 result actually shows $\eta\in(0,1)$ in general and $=1$ for strictly pseudoconvex; some references restrict to $(0,1)$ and treat the strictly-pseudoconvex case separately. The page's $(0,1]$ is fine if one allows the strictly-pseudoconvex degenerate case.

- **§5 Theorem B proof "step 3"** ("every Čech cocycle is the $\bar\partial$-coboundary of a controllable function", line 649) elides Dolbeault: $H^q(X,\mathcal{O})\cong H^{0,q}_{\bar\partial}(X)$ via the Dolbeault isomorphism, and Hörmander surjectivity is what kills the right side. Sketch is qualitatively right.

- **§4 Bergman/Szegő mention** (line 590) is a single sentence; the topic is otherwise unaddressed (kernels, reproducing-kernel structure, Fefferman expansion explicit form). Not in error — just minimal coverage given the page's promised scope.

- **Hopf-surface Picard story in §6** (line 819): the assertion that Hopf surface has $H^2(X,\mathbb{Z})=0$ but $\mathrm{Pic}(X)\ne 0$ via the non-vanishing $H^1(X,\mathcal{O})$ piece is correct (primary Hopf surface: $X\cong S^1\times S^3$ topologically, $H^2=0$; $H^1(X,\mathcal{O})\cong\mathbb{C}$; long exact sequence gives non-trivial Picard). The page sentence is correct but compressed.

## Severity

**bugs.** Two real defects plus one mislabel:

1. **§6 line 819 parenthetical** — claims punctured $\mathbb{C}^n$ ($n\ge 2$) "is Stein by Hartogs", which is the direct opposite of the truth (Hartogs *prevents* it from being Stein). The non-parenthetical claim immediately before is correct. Fix: delete the parenthetical "(actually the punctured $\mathbb{C}^2$ is Stein for $n\ge 2$ by Hartogs, but the Hopf bundle on $\mathbb{C}^2\setminus\{0\}$ as a model survives transfer)" and replace with a sentence pointing to the Hopf surface as the cleanest non-Stein example.

2. **§4 table line 600 + quizzes line 85** — polydisk Levi form description "vanishes on the edges" is wrong; it vanishes identically on the smooth boundary faces (edges/corners are non-smooth, not where vanishing happens). Fix: change to "Levi form is identically zero on each smooth face" both in the HTML table and the matching-quiz right-hand label.

3. **§6 widget line 766** — title "Cousin obstructions on $\mathbb{CP}^1\times\mathbb{C}^*$" doesn't match the one-factor visualization. Drop the $\times\mathbb{C}^*$ or pick a different toy.

The §1 Hartogs prose and slice-Laurent argument, §2 PSH definition / complex Hessian / Levi form invariance, §3 Hörmander statement and weight-curvature arithmetic ($1/c$ ratio, $C=1/4$ quiz), §4 Levi problem attribution and Diederich–Fornæss summary, §5 Stein definition / Cartan A and B / Behnke–Stein / Remmert–Bishop–Narasimhan, §6 first and second Cousin reductions to $H^1(\Omega,\mathcal{O})$ and $H^2(\Omega,\mathbb{Z})$ via the exponential exact sequence, and the quiz computations across all six concept slots ($\log|z_1|$ PSH, complex Hessian eigenvalues, $C=1/4$, $\mathrm{Pic}(\mathbb{C}^n)=0$) all check out.
