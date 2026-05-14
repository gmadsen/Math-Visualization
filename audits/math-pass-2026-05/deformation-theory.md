# deformation-theory.html — math correctness pass

## Verified claims (sections)

- **§1.** Flat-lift definition over $D = k[\epsilon]/(\epsilon^2)$ standard. $xy - \epsilon$ regular in $k[x,y,\epsilon]/(\epsilon^2)$ (annihilator check). Smooth-affine $H^1(X_0, T_{X_0}) = 0$ ✓.
- **§2.** Čech derivation cocycle construction standard. $T_{\mathbb{P}^1} = \mathcal{O}(2)$, $H^1 = 0$; $H^1(\mathbb{P}^n, T_{\mathbb{P}^n}) = 0$ via Euler; $T_E = \mathcal{O}_E$, $h^1 = 1$ (line 367); $\dim H^1(C, T_C) = 3g-3$ for $g \ge 2$ ✓.
- **§3.** Tower-of-Artinian-truncations correct. $H^2 = 0 \Rightarrow$ formal smoothness ✓. $\dim C = 1 \Rightarrow H^{\ge 2} = 0$ (Grothendieck) ✓. BTT/Ran for CY3 stated correctly: $H^2(X, T_X) \cong H^2(X, \Omega^2)$ generically nonzero, obstruction map vanishes.
- **§4.** $\mathrm{Art}_k$, functor definition, (H1)–(H3), hull theorem (line 541) correct.
- **§5.** Simplicial polynomial resolution + $\Omega^1_{P_\bullet} \otimes_{P_\bullet} \mathcal{O}_X$ ✓. Smooth $L = \Omega^1[0]$ ✓; l.c.i. $\mathcal{H}^0 = \Omega^1$, $\mathcal{H}^{-1} = I/I^2$ ✓; transitivity triangle ✓; $\Def(D) = \Ext^1(L, \mathcal{O})$, obstruction $\Ext^2$ ✓.
- **§6.** $\deg T_C = 2-2g$, $\chi(T_C) = 3 - 3g$, Serre duality $H^1(C, T_C) \cong H^0(C, \Omega^{\otimes 2})^\vee$ dim $3g-3$ ✓. $g=4$ canonical curve as $(2,3)$ ci in $\mathbb{P}^3$ with trigonal/general split by quadric type ✓. Boundary $g=0,1$ ✓.

## Wrong / dubious claims (with file:line)

- **:317** — Step 5: "node $\dim H^1 = 1$" for $X_0 = \Spec k[x,y]/(xy)$. But $X_0$ is **affine**, so $H^1(X_0, T_{X_0}) = 0$ for any coherent sheaf. Right invariant is $T^1 = \Ext^1(\Omega^1, \mathcal{O}) = k$. §1 conflates $T^1$ and $H^1(T)$; equality only in smooth case.
- **:538** — "(H4) The map in (H1) is bijective for arbitrary $A$." Standard (H4): $F(A' \times_A A') \to F(A') \times_{F(A)} F(A')$ bijective when $A' \to A$ is a small extension (diagonal-pullback). "Arbitrary $A$" too strong.
- **:874** — "First-order deformations are $\Hom(\Omega^1, T_X)$." Correct: $\Ext^1(\Omega^1, \mathcal{O})$. Since $T_X = \Hom(\Omega^1, \mathcal{O})$, formula reads $\Hom(\Omega^1, \Hom(\Omega^1, \mathcal{O}))$ — wrong object.
- **:633** — Fat point $\Spec k[x]/(x^2)$: $\mathcal{H}^{-1} = (x^2)/(x^4)$ called "1-dimensional." As $k$-vector space it's 2-dim (basis $x^2, x^3$); rank 1 only as $\mathcal{O}_{X_0}$-module. Also $I/I^2$ computes $L_{X_0/\mathbb{A}^1}$, not $L_{X_0/k}$ — silently switches base.

## Underspecified or unverifiable claims

- **§1:281** — Smoothness hypothesis attached, then immediately used for a singular node.
- **Kodaira–Spencer** — Never named, despite §2's Čech class *being* the KS class.
- **Bockstein** — Not mentioned; §3's lifting tower is morally a Bockstein sequence.
- **§3:443** — "Mukai-style non-reduced moduli" hand-wavy; no concrete example.
- **§6:818** — Readout writes "$H^2 = 0$" for all $g$. Vacuous for $g=0,1$.

## Severity

**Moderate.** §1 smooth-vs-singular conflation (node $H^1$) and §7 garbled $\Hom(\Omega^1, T_X)$ are real errors. (H4) misstatement propagates wrong intuition about pro-representability. Major formulas ($3g-3$, Euler vanishings, BTT, $\Ext$ interpretation) all correct. Fixes: rewrite §1 step 5 + line 281 to use $T^1$ vs $H^1(T)$ correctly; restate (H4) as diagonal small-extension form; replace line 874 with $\Ext^1(\Omega^1, \mathcal{O})$; clarify §5 fat-point rank vs $k$-dim; optionally name Kodaira–Spencer.
