# convex-geometry.md — math-correctness audit

Pages reviewed: `convex-geometry.html`, `quizzes/convex-geometry.json`.
Note: Carathéodory / Helly / Radon are NOT covered by this topic; nothing to audit there. Sections cover support functions, Minkowski sum & mixed volumes, Brunn-Minkowski, polytopes (f-vector), John ellipsoid, polar duality / Mahler, Dvoretzky.

## Verified claims

- **§1 Support function & body recovery.** $h_K(u)=\sup_{x\in K}\langle u,x\rangle$, positive 1-homogeneous + subadditive, $K=\bigcap_{u\in S^{n-1}}\{x:\langle u,x\rangle\le h_K(u)\}$. Quiz Q3 numeric $h_{[-1,1]^2}(\pi/4)=\sqrt 2\approx 1.414$ ✓.
- **§2 Mixed volumes & Steiner.** Volume polynomial $\mathrm{vol}(\sum\lambda_i K_i)=\sum V(K_{i_1},\ldots,K_{i_n})\lambda_{i_1}\cdots\lambda_{i_n}$, Steiner $\mathrm{vol}(K+\varepsilon B)=\sum\binom{n}{k}\varepsilon^k W_k(K)$ with $W_1(K)=\mathrm{surf}(K)/n$ and $W_n=\mathrm{vol}(B)$ — convention-consistent ✓. Quiz: rectangle Minkowski sum $[0,3]\times[0,4]$, vol 12 ✓.
- **§3 Brunn-Minkowski.** Inequality, equality iff homothetic, Prékopa-Leindler form, isoperimetric corollary $\mathrm{surf}(K)\ge n\omega_n^{1/n}\mathrm{vol}(K)^{(n-1)/n}$ — sharp constant verified by ball substitution ✓.
- **§4 Polytopes.** Minkowski-Weyl ✓, Euler $\sum(-1)^i f_i=1-(-1)^n$ ✓, simple/simplicial definitions ✓, polar swaps them ✓. Curated f-vectors all correct: tet (4,6,4), cube (8,12,6), oct (6,12,8), dodec (20,30,12), icos (12,30,20), 4-simplex (5,10,10,5), 4-cube (16,32,24,8). McMullen 1970 attribution for upper-bound theorem ✓.
- **§5 John ellipsoid.** $E\subseteq K\subseteq\sqrt n\,E$ for symmetric, $\subseteq nE$ for general; cube/cross-polytope/simplex saturating cases ✓. John optimality (contact-frame condition) stated correctly ✓. Widget data: square (1,1,√2), hex (√3/2,√3/2,2/√3), eq.triangle side √3 (1/2,1/2,2), 2:1 rectangle (1,1/2,√2), cross-polytope (1/√2,1/√2,√2) all reverify by hand ✓.
- **§6 Polar duality.** Bipolar, polar table (ball self-polar; cube↔cross-polytope; simplex self-polar centred; hexagon→hexagon rot 30°; $\ell^p\leftrightarrow\ell^q$, $1/p+1/q=1$) ✓. Mahler symmetric bound $4^n/n!$ ✓ ($n{=}2$ gives 8); cube×cross-polytope = 8 ✓. Mahler nonsymmetric bound $(n+1)^{n+1}/(n!)^2$ ✓ ($n{=}2$ gives 27/4=6.75). Centred regular triangle saturates 27/4 — recomputed by hand: side $\sqrt 3$, area $\tfrac{3\sqrt3}{4}$, polar area $3\sqrt3$, product $27/4$ ✓. Mahler attribution: $n{=}2$ Mahler 1939 ✓, $n{=}3$ Iriyeh-Shibata 2020 ✓.
- **§7 Dvoretzky.** $k\ge c\varepsilon^2\log n$ (Milman 1971), sharpness via cube/cross-polytope, concentration-of-measure proof engine ✓.
- Quizzes: cg-convex-bodies, cg-minkowski-sum, cg-brunn-minkowski, cg-polytopes, cg-polar-duality, cg-dvoretzky — all answers verified.

## Wrong / dubious claims

- **§5 line "Banach-Mazur compactum has diameter at most √n" (convex-geometry.html:779).** John gives radius (around $\ell^2_n$) $\le\sqrt n$ for symmetric bodies; the multiplicative diameter is then $\le n$ (triangle inequality $d(K,L)\le d(K,B)d(B,L)$). Either say "radius $\le\sqrt n$" or "diameter $\le n$" — the page conflates them.
- **Quiz cg-john-ellipsoid Q3 (quizzes/convex-geometry.json:189).** Same conflation: "compactum…of finite diameter — $\le n$ in general, $\le\sqrt n$ for symmetric bodies." The $\sqrt n$ is the John radius bound, not diameter; symmetric diameter is $\le n$, general is $\le n^2$.
- **§6 Bourgain slicing constant (convex-geometry.html:891) and Quiz cg-polar-duality Q3 explanation (quizzes/convex-geometry.json:233).** "Best known: $c=\Omega(1/\log n)$ (Klartag, 2024)" is outdated/imprecise. Klartag-Lehec (2022) proved $L_K=O(\sqrt{\log n})$, giving $c=\Omega(1/\sqrt{\log n})$; Klartag (2023) further improved to $O((\log n)^{1/4})$. The slicing/isotropic-constant story is now essentially resolved up to polylog. Either cite Klartag-Lehec 2022 with $1/\sqrt{\log n}$, or note the conjecture is bounded-isotropic-constant proven.

## Underspecified or unverifiable claims

- **§5 John condition (convex-geometry.html:773-774)** lists both $\sum c_i u_i u_i^\top=I$ AND $\sum c_i u_i=0$ without flagging that the second equation is the condition for the **non-symmetric** version (general convex body). For centrally symmetric K the contact set is $\pm$-symmetric so $\sum c_i u_i=0$ is automatic and only the first equation is needed. As written it's not wrong, but a reader applying it to "centrally symmetric K" will wonder where the second equation comes from.
- **§4 polar swaps simple↔simplicial (convex-geometry.html:670, 747).** The note's parenthetical "$n$-polytope $\Leftrightarrow$ ($n{-}1$)-simplex facet, etc." is slightly garbled English — readable but not a clean statement.
- **§3 Prékopa-Leindler implication (convex-geometry.html:521-523).** "one recovers Brunn-Minkowski via $\log$-concavity of $t\mapsto\mathrm{vol}((1-t)A+tB)^{1/n}$" — true that PL gives the multiplicative form $\mathrm{vol}((1-t)A+tB)\ge\mathrm{vol}(A)^{1-t}\mathrm{vol}(B)^t$ directly; the additive $1/n$ form needs a homogenisation trick (apply to scaled bodies and AM-GM). The sentence elides the step.

## Severity

**Minor.** All worked examples and computational widgets check out (square/hex/triangle/rectangle/cross-polytope John data; cube×cross-polytope Mahler = 8; centred-triangle Mahler = 27/4; f-vectors of all listed regular and 4-polytopes; rectangle Minkowski sum). The two real defects are the radius/diameter conflation in §5 and the Bourgain-slicing currency in §6 — both are pedagogically misleading but neither falsifies the surrounding theorem. Recommend a one-line edit on each.
