# Math-correctness audit — morphisms-fiber-products.html

Scope: every mathematical assertion. Pedagogy ignored.

## Verified claims

**§1 Morphism of schemes definition.** Pair $(f,f^{\#})$ with $f^{\#}\colon\mathcal{O}_Y\to f_*\mathcal{O}_X$ a sheaf map whose stalks are local ring maps ✓; full subcategory of locally ringed spaces ✓; $f^{\#}_x(\mathfrak{m}_y)\subseteq\mathfrak{m}_x$ is the right form of locality ✓. The DVR ramification picture $t_y\mapsto u\,t_x^e$ with $e\geq 1$, and "$e$ = ramification index" ✓.

**§2 Affine anti-equivalence.** $\Hom_{\mathsf{Sch}}(\Spec B,\Spec A)=\Hom_{\mathsf{Ring}}(A,B)$ ✓; $\varphi^{-1}$ of a prime is a prime ✓; the localization stalk map $A_{\varphi^{-1}\mathfrak{q}}\to B_\mathfrak{q}$ is automatically local ✓.

**§2 Spec-of-ring-map widget.** ZtoZi splitting: $5=(2+i)(2-i)$, $13=(2+3i)(2-3i)$ ✓; inert at $3,7,11$ with residue field $\mathbb{F}_{p^2}$ ✓; ramified at $2$ via $(1+i)^2 = 2i$ (unit·2) ✓. ZxtoZi: $(2,x+1)\subset\mathbb{Z}[x]$ contains $x^2+1\equiv(x+1)^2\pmod 2$, corresponds to $(1+i)\in\mathbb{Z}[i]$ ✓; $(5,x\mp 2)$ correspond to $(2\pm i)$ ✓; $(3,x^2+1)$ has residue field $\mathbb{F}_9$ ✓.

**§3 Immersions.** Open: $\Spec A_f\hookrightarrow\Spec A$, image $D(f)$ ✓. Closed: $i^{\#}$ surjective, ideal sheaf $\mathcal{I}=\ker i^{\#}$ ✓. Locally closed = closed∘open ✓. The two ideals $(x)$ vs $(x^2)$ in $k[x]$ give same support, different schemes ✓.

**§4 Fiber product.** Universal property correct ✓; affine case $\Spec(A\otimes_R B)$ ✓; symmetry, associativity, unit, immersion-stability ✓; underlying-set is generally larger than topological fibered set ✓; $\mathbb{F}_4\otimes_{\mathbb{F}_2}\mathbb{F}_4\cong\mathbb{F}_4\times\mathbb{F}_4$ ✓ (over $\mathbb{F}_4$, $\beta^2+\beta+1=(\beta-\alpha)(\beta-\alpha^2)$).

**§4 Tensor widget.** $\mathbb{Z}/4\otimes_\mathbb{Z}\mathbb{Z}/6=\mathbb{Z}/\gcd(4,6)=\mathbb{Z}/2$ ✓; $\mathbb{Q}(\sqrt 2)\otimes_\mathbb{Q}\mathbb{Q}(\sqrt 2)\cong\mathbb{Q}(\sqrt 2)\times\mathbb{Q}(\sqrt 2)$ ✓; $\mathbb{C}\otimes_\mathbb{R}\mathbb{C}\cong\mathbb{C}\times\mathbb{C}$ ✓.

**§5 Base-change.** Functoriality, $(X\times_S Y)_{S'} = X_{S'}\times_{S'} Y_{S'}$ ✓; complexification $\mathbb{R}[x,y]/(x^2+y^2-1)\otimes_\mathbb{R}\mathbb{C}\cong\mathbb{C}[u,u^{-1}]=\mathbb{G}_{m,\mathbb{C}}$ via $u=x+iy,v=x-iy$ ✓; properties stable under base change list (closed/open immersion, surjectivity, flatness, smoothness) ✓.

**§6 Fibers.** $X_y=X\times_Y\Spec\kappa(y)=\Spec(B\otimes_A\kappa(\mathfrak{p}))=\Spec(B_\mathfrak{p}/\mathfrak{p}B_\mathfrak{p})$ ✓ (with $B_\mathfrak{p}:=B\otimes_A A_\mathfrak{p}$); ZitoZ widget data — ramified at 2, inert at 3,7,11, split at 5,13, fiber at 2 is $\Spec\mathbb{F}_2[t]/(t^2)$ ✓.

**§7 Capstone $x^2-a$.** Discriminant $\Delta=4a_0$ ✓; over $\mathbb{Q}$: square→split, nonsquare→inert, $0$→fat ✓; over $\mathbb{F}_p$ ($p$ odd): QR→split, NQR→inert, $p\mid a_0$→fat ✓; over $\mathbb{F}_2$: always $(x+\sqrt{a_0})^2$, wildly ramified ✓; finite flat of degree 2 (basis $\{1,x\}$) ✓; étale away from $V(4a)$ ✓; total space $\cong\mathbb{A}^1_\mathbb{Z}$ via $a=x^2$ ✓; $df=2x\,dx$ vanishes at $x=0$ ✓; ring of integers of $\mathbb{Q}(\sqrt n)$ is $\mathbb{Z}[\sqrt n]$ when $n\not\equiv 1\pmod 4$ ✓; geometric vs scheme-theoretic fiber distinction ✓.

**§8 Separated + proper.** $\Delta_f\colon X\to X\times_S X$ always a locally closed immersion ✓; separated ⇔ $\Delta_f$ closed ✓; affine morphisms are separated (multiplication $A\otimes_R A\twoheadrightarrow A$) ✓; proper = separated + finite type + universally closed ✓; valuative criterion (DVR + unique lift) for proper ✓; $\mathbb{P}^n_k\to\Spec k$ proper, $\mathbb{A}^n_k\to\Spec k$ not (counterexample $1/t$) ✓; doubled-origin line non-separated ✓.

## Wrong / dubious claims

- **morphisms-fiber-products.html:1046** — Discriminant of $y^2=x^3+x$ written "$-4\cdot(-1)^3-27\cdot 0^2 = 4$". The equation is $y^2=x^3+x$, so in $y^2=x^3+ax+b$ we have $a=+1$, not $-1$; the simplified discriminant is $-4(1)^3 - 27\cdot 0 = -4$ (or with the standard $-16$ factor, $-64$). The conclusion (bad reduction at $p=2$) is right because $-4$ is divisible by $2$, but the displayed arithmetic uses the wrong sign on $a$.

- **morphisms-fiber-products.html:296** — The line "the stalk map is $k[t]_{(t)}\to k(t)$ which is not local" conflates the ring map $\varphi\colon A\to B$ with the stalk map of the associated morphism. For $\varphi\colon k[t]_{(t)}\hookrightarrow k(t)$ and $\mathfrak q=(0)\in\Spec k(t)$ with $\varphi^{-1}\mathfrak q=(0)$, the stalk map is $A_{(0)}\to B_{(0)} = k(t)\to k(t)$ (the identity), which IS local. The non-local thing is the original ring map, not the stalk map. The downstream conclusion ("this defines a valid morphism of schemes") is correct, but the bridge ("vacuous because target is generic") is right only after this conceptual fix.

## Underspecified or unverifiable claims

- **morphisms-fiber-products.html:922** — "V(4) is the fat point 4·(2), V(6) is 2·(2)·3·(3)." Notation is unclear. $V(4)=\Spec\mathbb{Z}/4$ has length 2 at the prime $(2)$; $V(6)=\Spec\mathbb{Z}/6$ has length 1 at $(2)$ and length 1 at $(3)$. Writing "4·(2)" suggests length 4 and "2·(2)·3·(3)" is opaque. The end-result $\gcd(2,1)=1$ at prime 2, giving reduced point $V(2)$, is correct.

- **morphisms-fiber-products.html:640** — "$X\setminus\{(0,0)\}$ is a union of two affine opens given by inverting $x$ and $y$." $D(x)\cup D(y) = X\setminus V(x,y) = X\setminus\{(0,0)\}$ ✓, but the gloss "smooth" needs $\mathrm{char}\,\mathbb{Q}\neq 2,3$ — fine here since we're over $\mathbb{Q}$. Acceptable.

- **morphisms-fiber-products.html:1761** — The "$p=2$ with $n\equiv 2,3\pmod 4$" ramification clause for $\mathbb{Q}(\sqrt n)$ assumes $n$ squarefree (stated) and $n\not\equiv 1\pmod 4$ (the case the sentence is in). Correct as restricted, though a reader pivoting to the $n\equiv 1\pmod 4$ case where $\mathbb{Z}[(1+\sqrt n)/2]$ is the ring of integers would need the separate $n\bmod 8$ analysis at $p=2$. Out of scope; the page restricts cleanly.

- **morphisms-fiber-products.html:1130–1136** — The "cuspto" widget overloads the symbol $p$ as both a fixed integer (in $x^2-p^2$) and as a prime of $\mathbb Z$. Mathematically the worked instance ($p=3$, mod 3) is correct, but the symbol clash is a readability hazard, not a math error.

- **morphisms-fiber-products.html:1791–1798** — The stability table lists "fiber" as a column but only writes "yes" for separated and proper without saying what "fiber" means in that column (presumably "stable on fibers", i.e., taking a fiber of a separated/proper morphism over a point of the base produces a separated/proper morphism over $\Spec\kappa$). Underspecified column header; entries are right under the natural reading.

## Severity

**Minor.** One sign error in an elliptic-curve discriminant computation (line 1046) where the conclusion is correct but the displayed arithmetic uses $a=-1$ instead of $a=+1$. One conceptual slip in the §1 ramification motivation (line 296) conflating "ring map" with "stalk-of-morphism map" — the worked example still ends up with a valid morphism of schemes, but the explanation as written would mislead a careful reader. Everything substantive — affine anti-equivalence, immersions, fiber products, base change, the $x^2-a$ capstone (split/inert/ramified, char 2 wildness, étale locus, finite-flat-degree-2, Dedekind link), separated/proper definitions, valuative criterion — is correct.
