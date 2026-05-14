# complex-analysis — math correctness audit (2026-05)

**Section:** Analysis

## Verified claims

### Complex numbers / Riemann sphere / Möbius (§§1–3)

- **Modulus, polar form, multiplication rule** (§1, lines 303–306): $z = x+iy = re^{i\theta}$, $(r_1 e^{i\theta_1})(r_2 e^{i\theta_2}) = r_1 r_2 e^{i(\theta_1+\theta_2)}$, $z^{-1} = \bar z/|z|^2$ — all standard.
- **Stereographic projection** (§2): "place sphere of radius $\tfrac12$ tangent to plane at the origin and project from north pole" — valid variant; the chordal-metric Riemann sphere of radius $1/2$ is one of two standard conventions. Conformality and "circles ↔ circles or lines" both correct.
- **Möbius group $\cong \mathrm{PGL}_2(\mathbb{C})$** (§3, line 338) — correct.
- **Spherical-rotation subgroup formula** (§3, line 340): $T(z) = \dfrac{az - \bar c}{cz + \bar a}$ with $|a|^2 + |c|^2 = 1$, identified with $\mathrm{SU}(2)/\{\pm 1\} \cong \mathrm{SO}(3)$ — correct (matches the standard form $(\alpha z + \beta)/(-\bar\beta z + \bar\alpha)$ via $\alpha = a$, $\beta = -\bar c$; constraint $|\alpha|^2+|\beta|^2 = |a|^2+|c|^2 = 1$).
- **Three-points-determine-a-Möbius** (§3 note, line 341) — correct; equivalent to Möbius group acting simply 3-transitively on $\hat{\mathbb{C}}$.
- **Cross-ratio formula** (§3, line 343): $[z_1,z_2;z_3,z_4] = \dfrac{(z_1-z_3)(z_2-z_4)}{(z_1-z_4)(z_2-z_3)}$ — one of the standard conventions; cross-ratio invariance under Möbius is standard.
- **"Cross-ratio is real iff four points concyclic"** (§3, line 344) — correct (with the convention "circle through ∞" = line).
- **Möbius widget Cayley preset** (line 935): $(a,b,c,d) = (1,-i,1,i)$ encodes $T(z) = (z-i)/(z+i)$, the standard UHP→𝔻 Cayley map — correct.
- **Möbius widget `inv` preset**: $(0,1,1,0)$ encodes $T(z) = 1/z$, $\det = -1$ — correct.

### Amplitwist / Cauchy–Riemann / holomorphy (§§4–6)

- **Definition of $f'(z_0)$ via complex limit** (§4, line 375; §6, line 435) — standard.
- **Amplitwist** (§4 note): a holomorphic map acts on infinitesimal vectors as rotation by $\arg f'(z_0)$ and scaling by $|f'(z_0)|$ — correct.
- **Cauchy–Riemann derivation from "Jacobian commutes with $i$"** (§5, lines 414–419): $u_x = v_y$, $u_y = -v_x$, $f'(z_0) = u_x + iv_x = v_y - iu_y$ — all correct (the second form follows from CR substitution).
- **Examples list** (§6, line 437): polynomials/$e^z$/$\sin z$/$\cos z$ entire; $1/z$ holomorphic on $\mathbb{C}\setminus\{0\}$; principal $\log z$ holomorphic on $\mathbb{C}\setminus(-\infty,0]$; $\bar z$, $|z|^2$, $\Re z$ smooth as $\mathbb{R}^2 \to \mathbb{R}^2$ but fail CR — correct.
- **Amplitwist widget** (lines 1051–1131): for `z²` returns $f'(z) = 2z$; for `z³` returns $3z^2$; for `1/z` returns $-1/z^2$; for `eᶻ` and `sin z` derivatives match. All `f` and `df` pairs correct. The `conj` entry returns no derivative and labels itself "not complex-differentiable" — correct.

### Domain coloring (§7)

- **Hue = arg, lightness ∝ log|f|** convention with $n$-fold winds at zeros/poles of order $n$ — correct standard description.

### Contour integrals & Cauchy's theorem (§§8–9)

- **Contour integral definition** (§8, line 484) — standard.
- **Real 1-form decomposition** (§8, line 485): $f\,dz = (u\,dx - v\,dy) + i(v\,dx + u\,dy)$ — correct expansion.
- **Closedness ⇔ Cauchy–Riemann** (§8, line 486): the real part has $d = -(u_y+v_x)\,dx\wedge dy$, vanishing iff $u_y = -v_x$; the imaginary part has $d = (u_x - v_y)\,dx\wedge dy$, vanishing iff $u_x = v_y$ — both calculations correct.
- **"$\overline{f}$ is curl-free and divergence-free"** (§8 note): with $\overline f = (u, -v)$, $\mathrm{div} = u_x - v_y = 0$ and $\mathrm{curl} = -v_x - u_y = 0$ under CR — correct.
- **Cauchy's theorem on star-shaped domains** (§9, line 529) — correct standard formulation.
- **Antiderivative-of-holomorphic-on-star-shaped construction** (§9, line 530); Stokes / $df \wedge dz = f'(z) \, dz\wedge dz = 0$ — both correct.
- **Goursat (drop $C^1$)** (§9, line 531) — correct.

### Cauchy integral formula and analyticity (§§10–11)

- **CIF** (§10, line 552): $f(a) = \dfrac{1}{2\pi i}\oint \dfrac{f(z)}{z-a}\,dz$ — correct.
- **CIF for derivatives** (§10, line 554): $f^{(n)}(a) = \dfrac{n!}{2\pi i}\oint \dfrac{f(z)}{(z-a)^{n+1}}\,dz$ — correct.
- **Analyticity = holomorphy** (§11, line 573): geometric-series expansion of $1/(z-a)$ on $|z-z_0|=r$ for $|a-z_0|<r$, exchanging sum/integral, $c_n = f^{(n)}(z_0)/n!$ — standard derivation, correct.
- **Radius of convergence = distance to nearest singularity** (§11, line 574) — correct.
- **Taylor widget for $1/(1-z)$**: $c_n = 1/(1-z_0)^{n+1}$ correctly computed (lines 1404–1411); radius-of-convergence circle equals distance to singularity at $z=1$ — correct.

### Liouville / FTA (§§12–13)

- **Liouville's theorem** (§12, line 603): bounded entire ⇒ constant — correct.
- **Liouville proof via CIF for $f'$ on circle of radius $r$** (line 605): $|f'(z_0)| \le M/r$ — correct standard estimate ($\sup |f| \le M$ on the circle, $|z-z_0|=r$ gives $|(z-z_0)^2|=r^2$, perimeter $2\pi r$).
- **Sharper Liouville** (§12 note, line 608): $|f| \le A + B|z|^k$ for $|z|$ large ⇒ $f$ a polynomial of degree $\le k$ — correct (CIF estimate on $f^{(k+1)}$ vanishes as $r \to \infty$).
- **FTA via Liouville** (§13, line 621) — correct.
- **Geometric/winding-number FTA proof** (§13 note, line 622) — correct sketch (winding of $p$ on $|z|=R$ tends to $n$ for large $R$; on $|z|=0$ winding is $0$; continuity forces an intermediate zero).

### Maximum modulus / Morera / Open mapping / Schwarz (§§14–16)

- **Morera's theorem** (§14, line 633): converse to Cauchy via vanishing on every triangle — correct standard.
- **Maximum modulus** (§14, line 634): non-constant holomorphic with interior $|f|$-max ⇒ constant; sup on boundary for compact domains — correct.
- **Open mapping (one-line statement)** (§14, line 635) — correct.
- **Open mapping theorem proof** (§15, line 657): pick $r$ with $\overline{D(z_0,r)}\subset U$ and $f \ne w_0$ on $\partial D$; $\delta = \min |f-w_0| > 0$; for $|w-w_0|<\delta$, Rouché on $f-w_0$ vs $f-w$ (since $|w-w_0|<\delta\le|f-w_0|$) gives same zero count, hence $\ge 1$ ⇒ $D(w_0,\delta)\subset f(U)$ — correct.
- **Local biholomorphism criterion** (§15, line 661): $f'(z_0)\ne 0$ ⇒ local biholo near $z_0$ — correct (holomorphic inverse function theorem; the simple-zero count makes the map locally injective).
- **Maximum-modulus reproof from open mapping** (§15, line 662) — correct.
- **Schwarz lemma** (§16, line 673): $f:\mathbb{D}\to\mathbb{D}$, $f(0)=0$ ⇒ $|f(z)| \le |z|$ and $|f'(0)| \le 1$, with rigidity — correct.
- **Proof via $g(z) = f(z)/z$** (§16, line 674): removable singularity; $|g| \le 1/r$ on $|z|=r$ extended by max-modulus, then $r\to 1$ gives $|g|\le 1$ everywhere — correct.
- **Schwarz–Pick** (§16, line 677): $\left|\dfrac{f(z)-f(w)}{1-\overline{f(w)}f(z)}\right| \le \left|\dfrac{z-w}{1-\bar w z}\right|$ — correct standard statement.
- **Hyperbolic non-expansion / Möbius equality forces automorphism** (§16, line 678) — correct.

### Laurent series / Singularity classification (§§17–18)

- **Laurent expansion existence and uniqueness on annulus** (§17, line 694) — correct.
- **Laurent coefficient formula** (§17, line 696): $c_n = \dfrac{1}{2\pi i}\oint \dfrac{f}{(z-z_0)^{n+1}}dz$ for any contour radius $r \in (r_1, r_2)$ — correct.
- **Worked example $f = 1/(z(z-1))$ around $0$** (§17, lines 698–701):
  - Partial fractions $f = -1/z - 1/(1-z)$ — correct.
  - On $0 < |z| < 1$: $f = -1/z - \sum_{n\ge 0} z^n$ — correct.
  - On $|z| > 1$: $1/(1-z) = -(1/z)\sum_{n\ge 0} z^{-n} = -\sum z^{-n-1}$, so $f = -1/z + \sum_{n\ge 0} z^{-n-1} = \sum_{n\ge 2} z^{-n}$ — correct (the $-1/z$ and $+z^{-1}$ from $n=0$ in the sum cancel).
- **Worked example $e^{1/z}$** (§17, line 703): $\sum_{n\ge 0} 1/(n!\,z^n)$, residue $c_{-1} = 1$ — correct.
- **Casorati–Weierstrass and Picard at essential singularities** (§18, line 721) — correct.
- **Worked example $\sin z/z$ removable** (§18, line 722): $\sin z = z - z^3/6 + z^5/120 - \cdots$ ⇒ $\sin z/z = 1 - z^2/6 + z^4/120 - \cdots$, no negative powers — correct.
- **Worked example $1/(z^3 - z^2) = 1/(z^2(z-1))$ at $z=0$** (§18, line 722): leading behaviour $\sim -1/z^2$, pole of order 2 — correct.
- **Pole-vs-zero duality** (§18, line 723): pole of order $k$ at $z_0$ for $f$ ⇔ zero of order $k$ at $z_0$ for $1/f$ — correct.

### Residue theorem (§19)

- **Residue formulae** (§19, line 738): simple-pole residue $= \lim_{z\to z_0}(z-z_0)f(z)$; order-$k$ pole residue $= \dfrac{1}{(k-1)!}\lim \dfrac{d^{k-1}}{dz^{k-1}}((z-z_0)^k f)$ — both correct standard.
- **Residue theorem statement** (§19, line 739) — correct.
- **Worked $\int_{-\infty}^\infty dx/(x^2+1) = \pi$** (§19, line 740): pole at $z=i$ inside UHP semicircle, residue $1/(2i)$; integral $= 2\pi i \cdot 1/(2i) = \pi$ — correct.
- **$\int_{-\infty}^\infty e^{ix}/(x^2+1)\,dx = \pi/e$** (§19, line 740): residue at $i$ of $e^{iz}/(z^2+1)$ is $e^{-1}/(2i)$, integral $= \pi/e$ — correct.
- **Contour widget residues** (lines 1232–1276):
  - $1/(z^2+1)$ at $\pm i$: $1/(2i) = -i/2$ at $i$, $-i/2 \cdot (-1) = i/2$ at $-i$ — encoded as `[0,-0.5]` and `[0,0.5]` ✓.
  - $e^{iz}/(z^2+1)$ at $i$: $e^{-1}/(2i) = -ie^{-1}/2$ — encoded as `[0, -Math.exp(-1)/2]` ✓; at $-i$: $e/(-2i) = ie/2$ — encoded as `[0, Math.exp(1)/2]` ✓. The `f` evaluation `C.exp([(-z[1]),z[0]])` correctly computes $e^{iz}$ for $z=x+iy$ as $e^{-y}(\cos x + i\sin x)$ ✓.
  - $1/(z(z-1)(z+2))$: residues $-1/2, 1/3, 1/6$ at $0, 1, -2$ ✓.
  - $z/(z^2-1)$: residues $1/2$ at both $\pm 1$ ✓ (limits give $1/(1+1) = 1/2$ and $-1/(-2) = 1/2$).
  - $1/(z^2+2z+2) = 1/((z+1-i)(z+1+i))$: residues $1/(2i) = -i/2$ at $-1+i$, $-i/2 \cdot (-1) = i/2$ at $-1-i$ ✓.
  - Polygon orientation function correctly identifies CCW = positive (the shoelace-style sum it computes integrates $\int 2y\,dx$ around the loop, which is $-2A$, so `s < 0` ⇔ CCW ⇔ return $+1$).

### Argument principle / Rouché (§§20–21)

- **Logarithmic-derivative residues** (§20, line 754): at zero of order $m$, $f'/f \sim m/(z-a)$, residue $m$; at pole of order $n$, $f'/f \sim -n/(z-b)$, residue $-n$ — correct.
- **Argument principle formula** $\frac{1}{2\pi i}\oint f'/f = Z - P$ (§20, line 755) — correct.
- **Geometric meaning via $d(\log f) = d\log|f| + i\,d\arg f$** (§20, line 757): real part exact (vanishes around closed loop); imaginary part contributes $2\pi$ × winding — correct.
- **Argument-principle widget winding-number computation** (lines 1542–1551): integrates $\Delta\arg$ along image path with $\pm\pi$ wraparound, divides by $2\pi$ — standard implementation, correct.
- **Rouché's theorem statement** (§21, line 792) — correct standard form ($|f-g| < |f|$ ⇒ same zero count).
- **FTA via Rouché** (§21, line 793): on $|z|=R$ large, $|p - z^n| \le CR^{n-1} < R^n = |z^n|$ — correct.
- **Worked $z^4 - 6z + 3$** (§21, line 794):
  - On $|z|=2$: $|{-6z+3}| \le 6\cdot 2 + 3 = 15 < 16 = |z^4|$, so all four zeros lie in $|z|<2$ — correct.
  - On $|z|=1$: $|z^4|=1 < |{-6z+3}|$ where $|-6z+3| \ge ||6z|-|3|| = 6-3 = 3$, so exactly one zero in $|z|<1$ (matching the zero count of the linear $-6z+3$, namely the root $z=1/2$) — correct.
  - Three zeros in annulus $1<|z|<2$ — correct.

### Conformal maps / Disk automorphisms / Riemann mapping / Normal families (§§22–25)

- **Conformality criterion $f' \ne 0$** (§22, line 800) — correct.
- **Joukowski $J(z) = (z+1/z)/2$**: maps $|z|=1$ to $[-1,1]$ (traced twice) — correct ($J(e^{i\theta}) = \cos\theta$).
- **Schwarz–Christoffel formula** $f(z) = \int_0^z \prod (\zeta - x_k)^{\alpha_k - 1}d\zeta$ with $\pi\alpha_k$ as interior angles (§22, lines 805–806) — correct standard form.
- **Conformal-map widget captions**: `z²` "wraps angles double around origin" ✓ ($z^2$ doubles arg); `eᶻ` "horizontal lines → rays, vertical lines → circles" ✓ ($e^{x+iy} = e^x \cdot e^{iy}$); `log` "slit plane biholo to strip $-\pi < \Im < \pi$" ✓ (principal log); Möbius `(z-a)/(1-\bar a z)` "sends $a$ to $0$, preserves hyperbolic distances" ✓.
- **$\mathrm{Aut}(\mathbb{D}) = \{e^{i\theta}(z-a)/(1-\bar a z)\} \cong \mathrm{PSU}(1,1)$** (§23, line 835) — correct.
- **Poincaré metric on disk $ds^2 = 4|dz|^2/(1-|z|^2)^2$** (§23, line 836) — correct (constant curvature $-1$ normalization).
- **$\mathrm{Aut}(\mathbb{H}) = \mathrm{PSL}_2(\mathbb{R})$** (§23, line 837) — correct.
- **Montel's theorem** (§24, line 850): locally bounded ⇒ normal — correct standard.
- **Proof sketch via Cauchy estimate + Arzelà–Ascoli + Weierstrass-on-locally-uniform-limits** (§24, line 851) — correct outline.
- **Riemann mapping theorem** (§25, line 873): every simply connected proper open subset of $\mathbb{C}$ conformally equivalent to $\mathbb{D}$, unique under base-point + tangent-direction normalization — correct standard.

### Harmonic functions / Analytic continuation (§§26–27)

- **Harmonic real and imaginary parts of holomorphic** (§26, line 880): $\Delta u = 0$ — correct (consequence of CR, $u_{xx} = v_{yx}$, $u_{yy} = -v_{xy}$, sum $= 0$).
- **Harmonic conjugate exists on simply connected domain, unique up to real constant** (§26, line 880) — correct.
- **Subharmonic functions** (§26, line 896): submean inequality definition — correct standard.
- **Identity theorem** (§27, line 902) — correct.
- **Monodromy: $\log z$ around loop encircling $0$ adds $2\pi i$** (§27, line 902) — correct.

### Quiz bank claims (cross-checked against the prose)

- **Complex numbers v1**: $|3+4i| = 5$ ✓; $(1+i)(2-i) = 3+i$ ✓; $\arg(-1-i) = -3\pi/4$ ✓; $\zeta_6 = e^{i\pi/3} = 1/2 + i\sqrt 3/2$ ✓.
- **Complex numbers hard**: 4th roots of $-16$ sum to $0$ ✓ (the four roots are vertices of a square centred at origin).
- **Möbius v1**: $T(z) = (z-1)/(z+1)$ at $z=0$ gives $-1$ ✓; "3 points determine a Möbius" ✓.
- **Möbius hard, parabolic = single fixed point ⇔ $\mathrm{tr}^2 = 4$** ✓.
- **Amplitwist v1**: $f(z)=z^2$ at $z_0 = 1+i$: $f'(1+i) = 2(1+i) = 2+2i$, $|f'| = 2\sqrt 2$, $\arg f' = \pi/4$ ✓; $f(z) = z^3$ at $i$: $|f'(i)| = |3i^2| = 3$ ✓.
- **Amplitwist hard**: $f(z) = z^2 + iz$ at $z_0 = 1-i$: $f'(z_0) = 2(1-i)+i = 2-i$, $\arg = -\arctan(1/2) \approx -0.4636$ ✓; $z^n$ at $0$ multiplies angles by $n$ ✓.
- **Cauchy–Riemann v1**: entire functions among $\{z^2+1, e^z, |z|^2, \bar z, z^2+\bar z, \sin z\}$ are exactly $\{z^2+1, e^z, \sin z\}$ ✓; harmonic conjugate of $u=x^2-y^2$ with $v(0,0)=0$ is $v=2xy$ giving $f=z^2$ and $v(1,2)=4$ ✓; CR equations correctly stated ✓.
- **Cauchy–Riemann hard**: $f(z)=|z|^2$ has CR satisfied only at origin (since $u=x^2+y^2$ gives $u_x=2x, u_y=2y, v=0$); difference quotient at $0$ is $|h|^2/h = \bar h \to 0$, so $f'(0)$ exists; not holomorphic on a neighbourhood; not entire — all four claims correctly graded ✓; $u = e^x\cos y$ has $v = e^x \sin y$ giving $f(z) = e^z$, and $\Im f(\ln 2 + i\pi/2) = \Im(2i) = 2$ ✓.
- **Residue theorem v1**: $\mathrm{Res}(1/(z^2+1), i) = 1/(2i) = -i/2$ ✓; $\mathrm{Res}(1/(z^2(z-1)), 0) = (d/dz)(1/(z-1))|_{z=0} = -1/(0-1)^2 = -1$ ✓.
- **Residue theorem hard**: $\int_0^\infty dx/(1+x^4) = \pi/(2\sqrt 2) \approx 1.1107$ ✓ (the residue calculation in the explanation is sketchy but the answer is the standard textbook value); $\sin z/z^3$ at $0$: Laurent $z^{-2} - 1/6 + z^2/120 - \cdots$, pole of order 2, residue $0$ (coefficient of $z^{-1}$ vanishes by parity) ✓.
- **Open mapping v1**: open mapping theorem statement, argument-principle / Rouché as the engine, local-biholomorphism connection — all three correctly graded.

## Wrong / dubious claims

- **Möbius widget `elliptic` preset is mislabelled and has the wrong fixed points** (lines 937, 354). The preset is labelled "elliptic (fix $\pm i$)" in the dropdown, but the matrix $(a,b,c,d) = (e^{i\pi/4}, 0, 0, e^{-i\pi/4})$ encodes $T(z) = e^{i\pi/4} z / e^{-i\pi/4} = e^{i\pi/2} z = iz$. Fixed points of $iz = z$ are $z=0$ and $z=\infty$, NOT $\pm i$. ($T(i) = -1$ and $T(-i) = 1$, confirming $\pm i$ are not fixed.) An actual Möbius map fixing $\pm i$ would be a rotation conjugate by Cayley, e.g.~$T(z) = (z\cos\theta + \sin\theta)/(-z\sin\theta + \cos\theta)$. **Severity: factual mislabel of the preset.**

- **Conformal-map widget's `cayley` entry has the wrong direction** (lines 1602–1613). The dropdown label says "Cayley i(1−z)/(1+z): UHP→𝔻" and the caption says "the classical biholomorphism between upper half-plane and unit disk. The real axis maps to the unit circle." But the formula $z \mapsto i(1-z)/(1+z)$ actually maps $\mathbb{D} \to \mathbb{H}$, not the other way around. Verification: $z=0 \in \mathbb{D}$ maps to $w=i \in \mathbb{H}$ (interior of UHP); $z=i$ on $\partial\mathbb{D}$ maps to $w=1$ on the real axis (boundary of UHP); $z=1$ on $\partial\mathbb{D}$ maps to $w=0$ on the real axis. The map's `gridSrc` is `'uhp'` so the source-grid loop renders UHP coordinates, but feeding a UHP point like $z=i$ into the formula gives $w=1$ (real, lying on the boundary of the disk), not an interior disk point. The formula and label are inconsistent. The UHP→𝔻 Cayley is $z \mapsto (z-i)/(z+i)$ (which is what the §3 Möbius widget's `cayley` preset uses correctly). **Severity: real semantic bug — formula doesn't match the label, and the source-grid type doesn't match the formula's true domain.** The §23 prose's Cayley statement ($z \mapsto i(1-z)/(1+z)$ identifies disk with UHP) is correct in itself; only the conformal-gallery widget conflates direction.

- **Hard-tier cross-ratio quiz answer is wrong** (`quizzes/complex-analysis.json` line 128). Question: "If $(0,1;z,\infty) = 2$, what is $z$?" The accepted answer is choice index 0 ("$z = 1/2$"). With the cross-ratio convention stated in the same explanation ($(z_1,z_2;z_3,z_4) = (z_1-z_3)(z_2-z_4)/((z_1-z_4)(z_2-z_3))$), the limit $z_4\to\infty$ gives $(z_1-z_3)/(z_2-z_3) = (0-z)/(1-z) = -z/(1-z)$. Setting equal to $2$: $-z = 2(1-z) = 2 - 2z$, so $z = 2$. The correct answer is $z=2$, choice index 1. The explanation contains an arithmetic slip ("$z = 2 - 2z + z \Rightarrow z = 1/2$" — the algebra `−z = 2 − 2z` does not yield `z = 1/2`; it yields `z = 2`). **Severity: math error — the gradeable answer is wrong.**

- **Hard-tier Möbius matching answer arrays don't agree on convention** (`quizzes/complex-analysis.json` lines 84–172). The matching widget in `js/quiz.js` line 23 documents the convention as `answer[i] = index in left that pairs with right[i]` (and the renderer puts dropdowns on the right side). Under this convention:
  - **Q1 (fixed points)** has `answer = [3, 0, 1, 2]`. Right items are $\{z+1, 1/z, -1/z, 2z\}$; with `answer[i]` giving the left index, this would assign $z+1 \to \{i,-i\}$, $1/z \to \{0,\infty\}$, $-1/z \to \{\infty\}$, $2z \to \{1,-1\}$ — all wrong. The mathematically correct mapping under this convention is `[1, 2, 3, 0]` ($z+1$ parabolic at $\infty$, $1/z$ fixes $\pm 1$, $-1/z$ fixes $\pm i$, $2z$ fixes $\{0,\infty\}$).
  - **Q2 (geometric roles)** has `answer = [1, 2, 3, 0]`. Under the same convention this gives $z+1 \to$ translation, $1/z \to$ inversion, $rz \to$ dilation, $e^{i\theta}z \to$ rotation — all correct.
  
  So under the implementation's documented convention, Q1 is wrong and Q2 is right. Under the opposite convention ($answer[i]$ = right-index paired with left[i]), Q1 is right and Q2 is wrong. **Either way at least one of the two is wrong**; the file looks like the author authored Q1 with one convention and Q2 with the other. This is a runtime-grading bug that surfaces as a math error: with the implementation's convention, the Q1 mapping is incorrect mathematics about which Möbius transformation has which fixed points. **Severity: runtime grading error; one of the two answer arrays needs to be flipped.**

## Underspecified or unverifiable claims

- **§3 (iii)**: "On the sphere they are exactly the rigid rotations and reflections combined with dilations" is loosely worded. The full Möbius group on $\hat{\mathbb{C}}$ is much larger than the spherical-isometry subgroup — most loxodromic Möbius transformations don't preserve any spherical metric. The corrective half-sentence ("but if you restrict to the subgroup that preserves the spherical metric, you recover SO(3)…") salvages the meaning. The phrase as stated would benefit from rewording but isn't a math error per se when read with the corrective clause.

- **§22 Schwarz–Christoffel widget** (lines 1633–1648): the widget self-labels as "Schematic" and uses a hand-coded piecewise approximation rather than the actual SC integral. Not a math error — the formula in the prose (line 805) is the standard one; the widget just visualizes the qualitative behaviour without computing the integral.

- **§19 widget orientation handling**: the residue-sum readout includes an `orient` factor, so a clockwise polygon dragged in the widget reports the negated integral correctly. Not an error — just worth flagging that the displayed `∮ f dz` reflects the *traversed* orientation of the user's polygon.

- **Quiz "Re($z$) properties" hard** (`quizzes/complex-analysis.json` line 67): the question asks "Which property … fails for $f(z) = \mathrm{Re}(z)$?" with homogeneity flagged as the answer. Strictly speaking, sub-multiplicativity also fails (try $z = 1+i, w = 1-i$: $\mathrm{Re}(zw) = \mathrm{Re}(2) = 2 > 1 = 1 \cdot 1 = \mathrm{Re}(z)\mathrm{Re}(w)$) and positive-definiteness also fails ($f(i) = 0$ but $i \ne 0$). The explanation acknowledges positive-definiteness also fails. With three out of four "norm property" choices failing, the "single best counterexample" framing is loose; not a math error in the sense that the marked answer (homogeneity) is genuinely a property that fails, but the question is poorly disambiguated.

- **Many concept slots in `quizzes/complex-analysis.json` are pure TODO stubs** (riemann-sphere, holomorphic-function, domain-coloring, contour-integral, cauchy-theorem, cauchy-integral-formula, analyticity, liouville, fta, maximum-modulus, schwarz-lemma, laurent-series, singularity-classification, argument-principle, rouche, conformal-map, disk-automorphisms, normal-families, riemann-mapping, harmonic-functions, analytic-continuation — about 21 of 27 concepts). These are placeholder MCQs with answer index 0 and "TODO" prose; not math errors, but the topic's quiz coverage is largely unwired. Out of audit scope but worth surfacing.

## Severity

**bugs.** Three concrete defects:

1. **Möbius widget `elliptic` preset** (page line 937): labelled "fix $\pm i$" but actually computes $T(z) = iz$ which fixes $\{0, \infty\}$. Either re-label as "rotation by $\pi/2$ (fix $0,\infty$)" or substitute the actual elliptic-with-fixed-points-$\pm i$ matrix.

2. **Conformal-gallery `cayley` entry** (page lines 1602–1613): the formula $z \mapsto i(1-z)/(1+z)$ is the disk → UHP Cayley map, but the dropdown label and source-grid type say "UHP → 𝔻". Either flip the formula to $(z-i)/(z+i)$ or swap the `gridSrc` to `'disk'` and re-label the entry "Cayley (𝔻 → UHP)".

3. **Cross-ratio hard-tier quiz** (`quizzes/complex-analysis.json` line 128): with the convention stated in the explanation, the answer is $z=2$ (choice index 1), not $z=1/2$ (index 0). The explanation contains the arithmetic slip "$-z = 2 - 2z \Rightarrow z = 1/2$" instead of $z = 2$. Update both `answer` and the explanation.

4. **Möbius matching answer arrays use inconsistent conventions** between Q1 and Q2 (`quizzes/complex-analysis.json` lines 84–172). Under the impl convention (`js/quiz.js` line 23: `answer[i]` = left-index that pairs with `right[i]`), Q1's `[3, 0, 1, 2]` is wrong (correct: `[1, 2, 3, 0]`), Q2's `[1, 2, 3, 0]` is right. Either flip Q1 to `[1, 2, 3, 0]` (preferred fix) or swap conventions consistently (and verify against `matchingFeedback`).

The prose mathematics across §§1–27 is otherwise clean: Cauchy–Riemann, CIF (and its differentiated form), Liouville (with sharper polynomial-growth version), FTA, Morera, maximum modulus, open mapping (with full Rouché-based proof), Schwarz lemma (with proof), Schwarz–Pick, Laurent expansions on the worked examples ($1/(z(z-1))$ in both annuli, $e^{1/z}$, $\sin z/z$, $1/(z^3-z^2)$), the residue formulae for simple and order-$k$ poles, the residue theorem and the canonical $\int dx/(x^2+1) = \pi$ and $\int e^{ix}/(x^2+1) = \pi/e$ examples, the argument principle (via $f'/f$ residues and the geometric winding interpretation), Rouché (including the $z^4 - 6z + 3$ worked counts), the disk automorphism characterization, the Poincaré metric, $\mathrm{Aut}(\mathbb{H}) = \mathrm{PSL}_2(\mathbb{R})$, Montel's theorem and its Cauchy-estimate-Arzelà-Ascoli proof outline, the Riemann mapping theorem statement with normalization, harmonic conjugates and the Laplace equation, the identity theorem, and the monodromy of $\log z$ all check out. The worked Rouché bounds (4 zeros in $|z|<2$, 1 zero in $|z|<1$, hence 3 in the annulus) are arithmetically correct. The contour-integral widget's residue tables (5 functions, 8 residues total) are all correct. The argument-principle widget's numerical winding-number calculation correctly matches $Z - P$ for the 6 sample functions.
