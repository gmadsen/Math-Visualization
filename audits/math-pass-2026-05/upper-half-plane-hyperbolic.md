# Math-correctness audit · upper-half-plane-hyperbolic.html

## Verified claims (sections)

- **§1 H definition.** $\mathbb{H} = \{x+iy : y>0\}$, diffeomorphic to $\mathbb{R}^2$, constant curvature $-1$ once equipped with the Poincaré metric. Standard.
- **§2 Metric.** $ds^2 = (dx^2+dy^2)/y^2$. Horizontal-segment length $L/y$ ✓; real axis at infinite distance via $\int_\epsilon^1 dy/y = -\log\epsilon \to \infty$ ✓; $\partial\mathbb{H} = \mathbb{R}\cup\{\infty\}$ ✓.
- **§3 Geodesics.** Vertical half-lines + Euclidean semicircles centred on $\mathbb{R}$, both meeting $\partial\mathbb{H}$ orthogonally. ✓
- **§3 Distance formula.** $d(z,w) = \operatorname{arcosh}\!\big(1 + |z-w|^2/(2\,\mathrm{Im}\,z\,\mathrm{Im}\,w)\big)$. Standard.
- **§4 SL₂(ℝ) action.** $g\cdot z = (az+b)/(cz+d)$, $\mathrm{Im}(g\cdot z) = \mathrm{Im}(z)/|cz+d|^2$ ✓. Transitivity ✓. $\mathrm{Stab}(i) = \mathrm{SO}(2)$ via $[[\cos\theta,-\sin\theta],[\sin\theta,\cos\theta]]$ — direct check g·i = i forces $a=d$, $b=-c$, with $a^2+c^2=1$. ✓ Identification $\mathbb{H} \cong \mathrm{SL}_2(\mathbb{R})/\mathrm{SO}(2)$ ✓; kernel $\pm I$ ✓.
- **§5 Trichotomy.** Conjugacy in $\mathrm{PSL}_2(\mathbb{R})$ controlled by $|\tr g|$; fixed-point quadratic $cz^2+(d-a)z-b=0$ with discriminant $(d-a)^2+4bc = (a+d)^2-4(ad-bc) = \tr^2-4$. ✓ All three rows of the table (elliptic / parabolic / hyperbolic) match the standard classification.
- **§5 Widget matrices.** Elliptic $\begin{pmatrix}c&-s\\s&c\end{pmatrix}$ fixes $i$, trace $2\cos\theta$. Parabolic $\begin{pmatrix}1&u\\0&1\end{pmatrix}$ acts $z\mapsto z+u$, trace 2, fixed point $\infty$. Hyperbolic $\mathrm{diag}(e^u,e^{-u})$ acts $z\mapsto e^{2u}z$, trace $2\cosh u$, axis = positive imaginary line between fixed points $0,\infty$. All correct.
- **§6 Gauss–Bonnet.** $\operatorname{area}(\Delta) = \pi-(\alpha+\beta+\gamma)$; ideal-triangle area $\pi$; impossibility of similarity scaling. ✓
- **§7 Disk model.** $ds^2 = 4|dz|^2/(1-|z|^2)^2$ — standard curvature-$-1$ Poincaré-disk metric ✓. Cayley $\Phi(z) = (z-i)/(z+i)$ sends $\mathbb{H}\to\mathbb{D}$, $i\mapsto 0$, $\mathbb{R}\cup\{\infty\}\to S^1$, biholomorphic isometry ✓. Conformal factor: hyperbolic-unit object at radius $|z|$ has Euclidean size $\sim(1-|z|^2)/2$ ✓.
- **§8 SL₂(ℤ).** Properly discontinuous ✓; standard fundamental domain $F = \{|\mathrm{Re}\,z|\le1/2,\ |z|\ge1\}$ ✓; generators $T:z\mapsto z+1$, $S:z\mapsto -1/z$ ✓; quotient is non-compact orbifold of area $\pi/3$ (computable via Gauss–Bonnet on $F$ thought of as the union of two ideal triangles minus the elliptic-orbifold corrections — standard result) ✓.
- **§8 Modular forms.** Weight-$k$ transformation $f((az+b)/(cz+d)) = (cz+d)^k f(z)$ ✓.
- **§9 Big-picture pointers.** $\mathcal{M}_{1,1} = \mathrm{SL}_2(\mathbb{Z})\backslash\mathbb{H}$ ✓; uniformization for genus $\ge 2$ via Fuchsian groups ✓; $\mathrm{PSL}_2(\mathbb{R})$ as smallest non-compact simple Lie group ✓; Bargmann discrete/principal/complementary series ✓.

## Wrong / dubious claims (with file:line)

- **upper-half-plane-hyperbolic.html:352** (W1 readout). `hypLen = (40 / (H-padT-padB) * (yMax-yMin)) / yy` converts a 40-pixel **horizontal** bar to coord units using the **vertical** scale. Plot is non-square: x-scale = $520/6 \approx 86.7$ px/unit, y-scale = $300/4.9 \approx 61.2$ px/unit. A horizontal 40 px bar is $40/86.7 \approx 0.46$ coord units, not the $40 \cdot 4.9/300 \approx 0.65$ the script uses. Reported hyperbolic length is off by $\approx 1.42\times$. The verbal claim "ds = Δx/y" is correct; the numeric Δx is wrong. Fix: divide by `plotW/(xMax-xMin)` instead of `plotH/(yMax-yMin)`.
- **upper-half-plane-hyperbolic.html:265** (§2 prose). The author's parenthetical hedge — "Euclidean steps get cheaper in hyperbolic terms? no — more expensive per Euclidean unit? let's be careful" — is editorial scaffolding that survived to publication. The substantive claims that follow are correct, but the visible self-correction is sloppy and momentarily misleading.

## Underspecified or unverifiable claims

- **Worked examples promised in audit prompt are absent.** No prose computation of $d(i,2i) = \log 2$ (page derives only the general formula). No derivation of $\operatorname{area}(F) = \pi/3$ — the value is asserted in §8 line 1092 as "non-compact orbifold of finite hyperbolic area $\pi/3$" without working.
- **§4 line 515**: "the scale factor $1/|cz+d|^2$ on Euclidean lengths exactly cancels the change in $1/y$" — true (Möbius derivative is $1/(cz+d)^2$, modulus squared $1/|cz+d|^2$, and $\mathrm{Im}(g\cdot z) = \mathrm{Im}(z)/|cz+d|^2$ so $|dz|/\mathrm{Im}(z)$ is preserved) but the page hand-waves rather than computing.
- **§5 widget hyperbolic case** advertises "translation along the geodesic" without giving the translation distance ($2|u| = \log\lambda$ where $\lambda = e^{2u}$) — fine for a survey page, but the user-facing parameter "u" is unlabelled in this respect.
- **§7 line 963**: "Both models sit inside a common family called the Klein/projective and hyperboloid models; all are isometric" — true but unsourced; reader has to take it on faith.
- **W4 elliptic mode** uses `θ ∈ [0.05π, 1.5π]`. Range up to $1.5\pi$ is fine since the period is $2\pi$, but $\theta = \pi$ gives $-I$ (identity in $\mathrm{PSL}_2$); not wrong, just unremarked.

## Severity

**Minor.** All stated theorems and formulae are mathematically correct. The single concrete bug (W1's horizontal-bar conversion using the y-scale at line 352) gives wrong numbers in an interactive readout — visible to anyone who sanity-checks against the displayed grid — but the verbal formula adjacent to it is right and the rest of the page is solid. Recommend: (1) fix the W1 px→coord conversion; (2) excise the editorial fumble at line 265; (3) optionally add a worked $d(i,2i)$ and a one-line Gauss–Bonnet derivation of $\operatorname{area}(F) = \pi/3$ to deliver on the section's promise.
