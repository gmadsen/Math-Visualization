# smooth-manifolds.md — math-pass

## Verified claims (sections)

- **§1 Atlas / charts.** Topological-vs-smooth manifold definitions correct (Hausdorff, second-countable, locally Euclidean; smooth = transition maps are $C^\infty$ diffeomorphisms). Stereographic transition $\varphi_S\circ\varphi_N^{-1}(u,v)=(u,v)/(u^2+v^2)$ verified by direct computation. Exotic-$\mathbb{R}^4$ aside is correct.
- **§2 Examples.** Matrix group dimensions all correct: $\mathrm{SL}_n(\mathbb{R})\,n^2{-}1$, $\mathrm{O}(n)$ and $\mathrm{SO}(n)\,n(n{-}1)/2$, $\mathrm{U}(n)\,n^2$, $\mathrm{SU}(n)\,n^2{-}1$. $\mathrm{Gr}(k,n)$ dim $k(n{-}k)$ correct.
- **§3 Differential.** Coordinate-rep / Jacobian / chain rule all correct. Rank-widget Jacobians and zero loci verified: $(xy,x{+}y)\Rightarrow\det=y{-}x$; $(x^2,y^2)\Rightarrow\det=4xy$.
- **§4 Tangent space.** All three definitions and the curve $\to$ derivation correspondence are correct. $\gamma_3'(0)=(\sec^2 0,0,2\tan 0\sec^2 0)=(1,0,0)$ verified.
- **§5/§6 Bundle, fields, flows.** $TM$ as $2n$-manifold, transition $(x,v)\mapsto(y(x),D(y\circ x^{-1})v)$, Picard–Lindelöf, group law $\Phi_{s+t}=\Phi_s\circ\Phi_t$, completeness, infinitesimal generator — all standard and correct. Blow-up ODE $x(t)=x_0/(1{-}x_0 t)$ verified. Hairy-ball / Poincaré–Hopf invocation ($\chi(S^2){=}2$) correct.
- **§7 Lie bracket.** Coordinate formula $[X,Y]^k=X^i\partial_i Y^k-Y^i\partial_i X^k$ correct. $X{=}\partial_x,Y{=}x\partial_y\Rightarrow[X,Y]{=}\partial_y$ verified. Flow displacement formula $\Phi^{-Y}_t\Phi^{-X}_t\Phi^Y_t\Phi^X_t(p)=p+t^2[X,Y]_p+O(t^3)$ correct (widget endpoint $(0,t^2)$ matches predicted $t^2\partial_y$ exactly).
- **§8 Submersions/embeddings.** Constant-rank classification and regular-value theorem correct. $\mathrm{O}(n)=F^{-1}(I)$, $\mathrm{SL}_n=\det^{-1}(1)$, $S^n=\|\cdot\|^{-2}(1)$ all genuinely cut out by regular values. Sard, Whitney embedding ($\mathbb{R}^{2n}$) and immersion ($\mathbb{R}^{2n-1}$) correct. Easy Whitney $\hookrightarrow\mathbb{R}^{2n+1}$ via partitions of unity correct.
- **§9 Partitions of unity.** Definition (locally finite, $\sum=1$, supports in cover) and existence on paracompact manifolds correct. Bump $e^{-1/(1-\|x\|^2)}$ standard.
- **§10 Orientation.** Three formulations equivalent. $\mathbb{RP}^n$ orientable iff $n$ odd (antipodal degree $(-1)^{n+1}$) correct. Oriented double covers $\mathbb{RP}^2\to S^2$, Möbius$\to$cylinder, Klein$\to$torus all correct. Gradient of $z$ on $S^2$ as $\cos\phi\cdot e_\phi$ verified by tangential projection.

## Wrong / dubious claims (with file:line)

- **`smooth-manifolds.html:492`** — "the (maximal) ideals of $C^\infty(M)$ are in bijection with points of $M$." This holds for **compact** $M$ only. Non-compact $M$ has additional maximal ideals (e.g. ideals containing $C^\infty_c(M)$ that are not point-evaluations). Restrict to "for compact $M$" or to "kernels of $\mathbb R$-algebra homomorphisms $C^\infty(M)\to\mathbb R$".

## Underspecified or unverifiable claims

- **§1, line 312** "Everything generalises to $C^k$ … with minor care." For finite $k$, Definition C (derivations) yields an *infinite-dimensional* space, not $T_pM$ — the equivalence breaks unless $k{=}\infty$. Worth a footnote.
- **§7, line 1210** Parenthetical "(Frobenius)" for simultaneous straightening of commuting fields — this is the *flow-box* / canonical-form theorem, a corollary of (or sometimes attributed to) Frobenius rather than the integrability theorem proper. Minor attribution slip.
- **Cross-section refs off by one**: lines 473, 494, 517 say "§7" but mean §8 (immersions/submersions/regular values). Line 1724 says "bracket from §6" but bracket is §7.
- **Coverage gaps** (not errors): Frobenius integrability theorem, tubular-neighbourhood theorem, and inverse/implicit function theorem on manifolds are not stated (only mentioned).

## Severity

**Minor.** One genuinely incorrect math claim (maximal ideals on non-compact $M$, line 492); one attribution slip; four off-by-one section references. All worked computations verified correct.
