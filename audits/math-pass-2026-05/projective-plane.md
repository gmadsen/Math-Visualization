# Math correctness audit — `projective-plane.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.

---

## Verified claims (sections)

- **§1 Where parallel lines meet.** Affine + line at infinity = projective is the standard intuitive setup; no math content beyond motivation.
- **§2 Definition of $\mathbb{P}^2(K)$ (lines 357–372).** Quotient $(K^3\setminus 0)/{\sim}$, equivalent "lines through origin" picture, "line = 2-d subspace = $aX+bY+cZ=0$", and the unique-line / unique-meet incidence claims (1-d subspaces span unique 2-d; two 2-d subspaces of $K^3$ meet in unique 1-d) are all standard and correct.
- **§3 Affine charts (lines 458–479).** Three charts $U_X, U_Y, U_Z$ and the bijections $\varphi_*$ are correct; transition map $\varphi_Z\circ\varphi_Y^{-1}\colon (u,w)\mapsto(u/w, 1/w)$ checks out from $[u:1:w]\mapsto[u/w:1/w:1]$.
- **§4 Line at infinity (lines 562–572).** Limit derivation $[x_0/t+a : y_0/t+b : 1/t]\to[a:b:0]$ correct. $|\mathbb{P}^2(\mathbb{F}_q)| = q^2+q+1$ correct. $\mathbb{P}^2 = \mathbb{A}^2 \sqcup \ell_\infty$ correct.
- **§5 Homogenization (lines 652–668).** Recipe $F(X,Y,Z) = Z^d f(X/Z,Y/Z)$ correct. Table verified line-by-line: line $ax+by+c$ → infinity point $[b:-a:0]$ (direction perp to gradient) ✓; $y-x^2$ → $YZ-X^2$, $Z=0\Rightarrow X=0\Rightarrow [0:1:0]$ ✓; $x^2+y^2-1$ → $X^2+Y^2-Z^2$, infinity points $[1:\pm i:0]$ over $\mathbb{C}$, none over $\mathbb{R}$ ✓; $y^2-x^3-1$ → $Y^2Z-X^3-Z^3$, $Z=0\Rightarrow X=0\Rightarrow [0:1:0]$ ✓.
- **§6 PGL₃ (lines 787–805).** $\dim\mathrm{PGL}_3 = 9-1 = 8$ ✓. Fundamental-theorem bullets (line by 2 pts; smooth conic by 5 general pts; cubic by 9 general pts; PGL₃ simply transitive on ordered 4-tuples in general position) all standard and correct.
- **§7 Duality (lines 893–898).** Pairing $aX_0+bY_0+cZ_0=0$ correct, symmetric. Pascal ↔ Brianchon dual pair correct. Fano plane: $|\mathbb{P}^2(\mathbb{F}_2)|=7$ points and 7 lines ✓.
- **§8 Cross-ratio (lines 902–907).** Formula $(a-c)(b-d)/[(a-d)(b-c)]$ standard ✓; example $[0,1;2,3]=4/3$ ✓; PGL₂ invariance ✓; $V_4$-stabilizer with 6-element orbit $\{\lambda,1-\lambda,1/\lambda,1/(1-\lambda),\lambda/(\lambda-1),(\lambda-1)/\lambda\}$ ✓; $j(\lambda)=256(\lambda^2-\lambda+1)^3/[\lambda^2(\lambda-1)^2]$ matches the standard $j$-invariant of the Legendre form ✓; harmonic conjugate $\lambda=-1$ ✓.
- **§9 Why projective (lines 920–938).** Bézout statement (degrees $m,n$ → $mn$ points over $\bar K$) correct. Smooth plane cubic has 9 inflection points (Hessian-cubic intersection $3\cdot 3$) correct. Long Weierstrass form $Y^2Z+a_1XYZ+a_3YZ^2 = X^3+a_2X^2Z+a_4XZ^2+a_6Z^3$ correct.
- **§10 Higher dim (lines 1032–1045).** $\mathbb{RP}^2$ as Möbius band ⌣ disk, non-orientable, no embedding in $\mathbb{R}^3$ ✓. $H^*(\mathbb{CP}^2;\mathbb{Z})=\mathbb{Z}[h]/(h^3)$ ✓. Cell decomposition $\mathbb{P}^n=\mathbb{A}^n\sqcup\cdots\sqcup\mathbb{A}^0$ and Poincaré polynomial $1+t^2+\cdots+t^{2n}$ for $\mathbb{CP}^n$ ✓.

## Wrong / dubious claims (with file:line)

- **`projective-plane.html:984–1015` (Weierstrass U_Y-chart widget — equation is wrong).** Code at line 995 uses `f(u,t) = u*u*t - t*t*t - 1`, i.e. plots $u^2 t - t^3 = 1$. The correct dehomogenization of $Y^2Z = X^3 + Z^3$ at the standard rep $[u:1:t]$ (with $u = X/Y$, $t = Z/Y$) is $t = u^3 + t^3$. The wrong equation does not pass through $(0,0)$ (substitute: $0 - 0 = 1$, false), yet the widget annotates $(0,0)$ as the identity $O = [0:1:0]$ and the surrounding code comment (lines 989–991) asserts "the projective closure passes through (u,t)=(0,0) smoothly." With the correct equation $u^3 = t - t^3$, that smoothness claim is true ($\partial F/\partial t|_{(0,0)}=1\ne 0$, tangent line $t=0$); with the equation actually plotted, the green sample points cannot pass through the highlighted yellow origin. **The picture and the prose disagree.**
- **`projective-plane.html:548` (three-chart conic widget — wrong points labelled "missing").** Text says: "U_Y (Y=1): … The two missing points are where Y=0: [1:0:1] and [1:0:-1] are visible here, and [1:0:0] (the X-axis direction) is at infinity in this chart."
  - The points of the conic $X^2+Y^2=Z^2$ with $Y=0$ are $X^2=Z^2$, i.e. $[1:0:\pm 1]$. These have $Y=0$ and so are NOT in $U_Y$ — calling them "visible here" contradicts the chart's own definition.
  - $[1:0:0]$ is **not on the conic**: $1^2+0^2=0^2$ is false. Listing it as a point at infinity of the conic in this chart is a category error (it's a direction in the line-at-infinity of the chart, not a missing conic point). Same problem at **line 549** for the U_X chart: $[0:1:0]$ is not on $X^2+Y^2=Z^2$.
- **`projective-plane.html:804` ("XY = Z² (a parabola)").** Calling $XY=Z^2$ "a parabola" is loose: in the $U_Z$ chart it's $xy=1$ (hyperbola); in the $U_X$ or $U_Y$ chart it's $y=z^2$ (parabola). The conic itself is projectively a smooth conic ≅ $\mathbb{P}^1$. Defensible if the parenthetical refers to one specific dehomogenization, but the proximate claim "over $\bar K$ they are the same curve" makes the parenthetical labels misleading rather than illuminating.

## Underspecified or unverifiable claims

- **§6 conic-classifier widget (lines 854–884).** Over $\mathbb{R}$ the rank-3 case has two real classes (empty, $X^2+Y^2+Z^2=0$, vs. oval, $X^2+Y^2-Z^2=0$). The classifier labels both "smooth" and the comment at lines 866–868 explicitly punts on signature. Not wrong, just intentionally thin.
- **§3 transition-map prose (line 469).** The change-of-coordinates formula $(u,w)\mapsto(u/w, 1/w)$ is stated only for $U_Y\cap U_Z$; the other two pairs are left to the reader. Fine but not labelled as such.
- **§9(b) "send tangent line at $O$ to $Z=0$" (line 933).** Standard reduction to long Weierstrass form is correct; the existence of such a projective transformation is asserted without indication that it requires $\mathrm{char}\ne 2,3$ for the further reduction to short form $y^2=x^3+ax+b$ (not claimed here, so harmless).

## Severity

**Moderate.** One concrete widget bug that yields a picture inconsistent with its own annotation (Weierstrass U_Y chart, §9), plus a localized confusion in the three-chart conic blurbs (§3) that mislabels off-conic points as "missing" conic points and asserts non-conic points lie on it. The §1–§8 prose, the cross-ratio / $j$-invariant computations, and the §10 topology/cohomology summaries are clean. The `XY=Z^2` "parabola" parenthetical is minor.
