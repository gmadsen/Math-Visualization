# harmonic-functions — math correctness audit (2026-05)

**Section:** Analysis

## Verified claims

### Laplace equation (§1)

- **Definition** $\Delta u = \sum \partial_{x_i}^2 u = 0$ for $C^2$ $u\colon\Omega\subseteq\mathbb{R}^n\to\mathbb{R}$ — standard.
- **Re/Im of holomorphic ⇒ harmonic** (line 289): differentiating CR equations $u_x=v_y$, $u_y=-v_x$ once more gives $u_{xx} = v_{yx}$, $u_{yy} = -v_{xy}$, sum $=0$ — correct.
- **Harmonic conjugate exists, unique up to constant on simply connected $\Omega$** (line 289) — correct.
- **Examples** (line 291): linear, $\mathrm{Re}\, z^n$/$\mathrm{Im}\, z^n$ ($\mathrm{Re}\,z^2 = x^2-y^2$, $\mathrm{Im}\,z^2 = 2xy$, $\mathrm{Re}\,z^3 = x^3-3xy^2$), $\log|z|$ on punctured plane, $\arg z$ on slit domains — all correct.
- **Heatmap widget Laplacians** (lines 316–322): $\Delta(x^2+y^2)=4$, $\Delta(x^2-y^2)=0$, $\Delta(2xy)=0$, $\Delta(x^2y)=2y$, $\Delta(e^x\cos y)=0$, $\Delta(\tfrac12\log(x^2+y^2))=0$ off origin, $\Delta(x^3-3xy^2)=0$ — all correct.

### Mean value property + converse (§2)

- **MVP statement** (line 423): $u(x_0) = \frac{1}{|\partial B|}\int_{\partial B} u\,dS = \frac{1}{|B|}\int_B u\,dV$ — correct (sphere and ball averages agree for harmonic $u$).
- **Proof via $\overline u'(r) = \tfrac{r}{n}\overline{\Delta u}(r)$** (line 425) — correct (Evans' standard calculation: $\frac{d}{dr}\fint_{\partial B(x_0,r)} u\,dS = \frac{r}{n}\fint_{B(x_0,r)} \Delta u\,dV$).
- **Koebe converse** (line 426): continuous $u$ with MVP at every admissible ball ⇒ harmonic and $C^\infty$ — correct.
- **Real analyticity of harmonic functions** (line 429) — correct.

### Maximum principle (§3)

- **Weak MP** (line 573): $\max_{\overline\Omega} u = \max_{\partial\Omega} u$, $\min$ analog — correct.
- **Strong MP** (line 574): interior sup ⇒ $u$ constant on the connected component — correct standard form.
- **Dirichlet uniqueness** (line 577): apply weak MP to $\pm(u_1-u_2)$ — correct.

### Poisson kernel on the disk (§4)

- **Solution formula** (line 721): $u(re^{i\theta}) = \frac{1}{2\pi}\int_0^{2\pi} P_r(\theta-\varphi)g(\varphi)\,d\varphi$ with $P_r(\theta) = (1-r^2)/(1-2r\cos\theta+r^2)$ — correct.
- **Positivity** (line 723): $1-2r\cos\theta+r^2 = |1-re^{i\theta}|^2 > 0$ — correct.
- **Mass one** (line 724): $\frac{1}{2\pi}\int P_r = 1$ — correct (use Fourier series $P_r(\theta) = \sum_n r^{|n|} e^{in\theta}$, $n=0$ term gives $2\pi$).
- **Approximate identity / concentration as $r\to 1^-$** — correct.
- **MVP recovered as $r=0$** (line 730): $u(0) = \frac{1}{2\pi}\int g$ since $P_0 \equiv 1$ — correct.
- **Boundary recovery dichotomy** (lines 728–729): continuous $g$ ⇒ uniform convergence; $L^p$ $g$ ⇒ a.e. radial limits (Fatou) — correct.
- **Widget convolution computation** (lines 762–771): correctly implements $u = (1/2\pi)\int P_r(\theta-\varphi)g(\varphi)\,d\varphi$ via 360-point Riemann sum, factor $1/N \approx 1/(2\pi) \cdot d\varphi$ — correct.

### Harnack inequality (§5)

- **General-$n$ Harnack** (line 888): $\frac{R-r}{R+r}\!\left(\frac{R}{R+r}\right)^{\!n-2}\!u(0) \le u(x) \le \frac{R+r}{R-r}\!\left(\frac{R}{R-r}\right)^{\!n-2}\!u(0)$. Simplifies to the standard $\frac{R^{n-2}(R-r)}{(R+r)^{n-1}} u(0) \le u(x) \le \frac{R^{n-2}(R+r)}{(R-r)^{n-1}} u(0)$ — correct.
- **Two-dimensional collapse** $\frac{R-r}{R+r} u(0) \le u(x) \le \frac{R+r}{R-r} u(0)$ (line 890) — correct ($n-2 = 0$ kills the extra factor).
- **Liouville for harmonic** (line 895): positive harmonic on $\mathbb{R}^n$ ⇒ constant; pinch via $R\to\infty$ — correct (this is the right hypothesis; bounded-below works equally well).
- **Widget bounds** (line 1015): readout uses $(1-r)/(1+r)$ and $(1+r)/(1-r)$ multiplied by $u(0)$ for the disk $R=1$, $n=2$ case — correct.

### Subharmonic / Perron (§6)

- **Subharmonic ⇔ $v(x) \le$ ball average** (line 1028) — correct standard equivalence (under USC).
- **Examples** (lines 1030–1032): $\log|f|$ subharmonic for holomorphic $f$ (Jensen) ✓; convex function of a harmonic function is subharmonic ✓; finite max of subharmonics is subharmonic ✓.
- **Subharmonic max principle** $\sup_{\overline\Omega} v = \sup_{\partial\Omega} v$ (line 1033) — correct.
- **Perron family + sup definition** (lines 1037–1039) — correct standard.
- **Harmonic-lifting proof sketch** (line 1041): replace $v$ by Poisson integral on a small ball, get larger element, conclude $u$ equals its own Poisson integral on every small ball — correct standard outline.
- **Barrier definition + regularity** (line 1042) — correct.
- **Lebesgue spine** (line 1044): $\mathbb{R}^3$ inward thin spike ⇒ tip has no barrier — classical, correct.

### Quiz claims

- **hf-laplace-equation v1**: $u=x^2-y^2$ harmonic, others non- ✓; $\Delta(\log(x^2+y^2)) = 0$ off origin ($f = \log r$, radial Laplacian $f_{rr} + (1/r)f_r = -1/r^2 + 1/r^2 = 0$) ✓; both $\mathrm{Re}\,f$ and $\mathrm{Im}\,f$ harmonic for holomorphic $f$ ✓.
- **hf-mean-value-property**: MVP statement ✓; average of $x^2-y^2$ on $|z|=2$ is $u(0,0)=0$ (also direct: $4\cos 2\theta$ integrates to $0$) ✓; MVP ⇔ harmonic and $C^\infty$ ✓.
- **hf-maximum-principle**: max on boundary unless constant ✓; uniqueness from $\pm w$ MP ✓; $u(e^{i\theta}) = 3 + 5\cos\theta$ ⇒ $u(0) = 3$ via MVP (since $\int 5\cos\theta\,d\theta = 0$) ✓; harmonic extension is $u(z) = 3 + 5\,\mathrm{Re}\,z$ ✓.
- **hf-poisson-kernel**: positive, mass one ✓; $\cos 2\theta$ extends to $r^2\cos 2\theta$ ⇒ at $r=1/2,\theta=0$ value $1/4$ ✓ (Poisson integral acts on $e^{in\theta}$ as multiplication by $r^{|n|}$); Fatou theorem statement ✓.
- **hf-harnack-inequality**: $u(0)=1$, $r=R/2$, upper bound $\frac{R+r}{R-r} = 3$ ✓; positive harmonic on $\mathbb{R}^n$ constant ✓; Harnack fails without positivity (sign change makes multiplicative bound vacuous) ✓.
- **hf-subharmonic**: $\Delta v \ge 0$ ⇔ submean ✓; Perron sup definition ✓; sub-MP ✓.

## Wrong / dubious claims

None. The mathematics across §§1–6 — Laplacian definition, harmonic conjugates, MVP and Koebe converse, weak/strong maximum principle and Dirichlet uniqueness, Poisson kernel formula and its three properties, $L^p$/$L^1$ Fatou recovery, Harnack inequality (in general $n$ and the 2D collapse), harmonic Liouville via Harnack pinch, subharmonic equivalence and Perron's harmonic-lifting construction with the Lebesgue-spine counterexample — checks out. All quiz numerical answers (logarithm Laplacian, MVP averages, Harnack ratio, Poisson eigenfunction) are correct.

## Underspecified or unverifiable claims

- **§5 "one-line proof" display** (line 892): the inline expression `$P_{r/R}(\theta) \cdot 1/R^{n-2} \le \text{Poisson kernel}(x,y) \le \text{(upper)}$` is impressionistic — the 2D Poisson kernel notation $P_{r/R}$ is being repurposed as a stand-in for the $n$-dimensional kernel and the upper bound is literally elided as `(upper)`. The general-dimension formula on line 888 is the actual content; this line is a heuristic gesture. Not a math error, but the placeholder is unusual for the rest of the corpus.

- **`hf-poisson-kernel` blurb** (concepts/harmonic-functions.json line 52): "$L^p$-a.e. by Fatou's theorem" is loose. The classical Fatou theorem applies for $g \in L^1$ (or even a complex Borel measure); the $L^p$ qualifier is redundant since $L^p \subset L^1$ on a finite measure space. Quiz Q3 correctly says $L^1$. Wording, not math.

- **§6 widget "subharmonic paraboloid" $v_k(z) = g(\theta_k) - M|z - e^{i\theta_k}|^2$** (line 1086): claimed "subharmonic on disk by max of linear functions" in the comment. In fact $-|z-w|^2$ has $\Delta = -4 < 0$ pointwise, so it is **superharmonic**, not subharmonic — the comment is wrong. The widget still pedagogically illustrates Perron-style climbing because the family's pointwise max, evaluated at boundary points, agrees with $g$ at $\theta_k$. The internal comment explanation is misleading but the visualization isn't a math claim of the prose; flagged as a code-comment defect rather than a prose error.

## Severity

**clean (one comment-only nit).** The prose mathematics — MVP and Koebe converse, weak/strong MP, the disk Poisson kernel and its three structural properties, the dichotomy of boundary recovery (uniform vs Fatou a.e.), the Harnack inequality in general dimension and its 2D collapse, the harmonic Liouville pinch, the subharmonic characterisation, and the Perron sup-of-subharmonics construction with the Lebesgue-spine pathology — is all correctly stated. Every quiz numerical answer (Δ of $\log r^2$, circular average of $x^2-y^2$, $u(0)$ from $3+5\cos\theta$ boundary, Poisson value of $\cos 2\theta$ at $r=1/2$, Harnack upper bound 3) checks out. The only defect is the §6 widget's internal `// candidate v(z) = ... subharmonic` comment misclassifying $-|z-w|^2$ as subharmonic — it is superharmonic ($\Delta = -4$). The widget's behaviour and pedagogical role are unaffected; only the code comment is wrong. The §5 heuristic line ($P_{r/R}\cdot R^{-(n-2)} \le$ Poisson kernel $\le$ "(upper)") is sketchy bookkeeping rather than a math claim.
