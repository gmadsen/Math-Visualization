# Math-correctness audit — bezout.html

Scope: every mathematical assertion. Pedagogy ignored.

## Verified claims

**Bézout statement (§5).** Over algebraically closed $k$, $C,D\subset\mathbb{P}^2$ of degrees $d,e$ with no common component meet in $de$ points counted with multiplicity ✓. The three hypotheses correctly mirror the three refinements (closure, projectivize, multiplicity).

**Intersection multiplicity definition (§3).** $I_P(f,g)=\dim_k\mathcal{O}_{P}/(f,g)$ ✓; the three axioms (transversality, bilinearity in factors, row-reduction invariance) characterize $I_P$ uniquely ✓; the formal-properties table on lines 690–700 (symmetry, ideal-invariance, finite-iff-isolated, smooth-with-distinct-tangents iff $I=1$) ✓.

**Worked multiplicities I verified by direct computation:** $I_O(y, y-x^2)=2$; $I_O(y, y^2-x^3)=3$; $I_O(x, y^2-x^3)=2$; $I_O(y, y+x^2)=2$; $I_O(y-x^2, y+x^2)=2$; $I_O(y^2-x^3, x^2-y^3)=4$ (parametrize cusp $(t^2,t^3)$, substitute $x^2-y^3 = t^4-t^9$, order 4) ✓; $I_O(y-x^2, x^2-y^3)=2$ ✓.

**Homogenization examples (§2 widget).** $y-x^2$ → $YZ-X^2$, double zero at $[0:1:0]$ ✓; $x^2+y^2-1$ → circular points $[1:\pm i:0]$ ✓; $y^2-x^3-1$ → $Y^2Z-X^3-Z^3$, triple zero at $[0:1:0]$ (flex at infinity) ✓.

**Resultant facts (§4).** $\mathrm{Res}(f,g)=0 \Leftrightarrow$ common root in $\bar k$ ✓; for projective curves with no common component, $\deg \mathrm{Res}_Y(F,G) = de$ in $(X,Z)$ ✓; resultant-based proof of Bézout is correctly sketched.

**Cubic-line widget arithmetic (§6).** Sum of $x$-roots formula $x_R = m^2 - x_P - x_Q$ (and $m^2 - 2x_P$ for the doubling case) for line $y=mx+c$ on $y^2=x^3-x+1$ ✓ (cubic in $x$ is $x^3 - m^2 x^2 - (1+2mc)x + (1-c^2)$, Vieta gives $\sum x_i = m^2$).

**Cayley–Bacharach (§7).** Classical 9-point form ✓; dimension count $\binom{5}{2}-1=9$ ✓; nine flexes form $(\mathbb{Z}/3)^2$ ✓; generalization "two curves of degree $d$ meet in $d^2$ points; degree $2d-3$ curve through $d^2-1$ forces the last" ✓ (the standard Eisenbud–Green–Harris statement, which more generally uses degrees $d,e$ and $d+e-3$).

**Pascal's theorem (§6).** Hexagon inscribed in any conic; three opposite-side intersections are collinear (Pascal line) ✓; Pascal published "Essay pour les coniques" 1640, age 16 (born June 1623) ✓.

**Higher-dim Bézout (§8).** Statement for $n$ hypersurfaces in $\mathbb{P}^n$ with length-multiplicities summing to $\prod d_i$ ✓; $A^*(\mathbb{P}^n)=\mathbb{Z}[H]/(H^{n+1})$ ✓; three quadrics in $\mathbb{P}^3$ meet in $8$ points ✓; proper-intersection caveat correctly highlighted.

**Applications (§9).** $|E[n]|=n^2$ over $\bar k$ (char $\nmid n$) ✓; deformation invariance / Chow $[C]\cdot[D]=de\cdot[\text{pt}]$ ✓.

## Wrong / dubious claims

- **bezout.html:467** — `'y-x|y2-x3': {I:1, note:'…transversally at origin (and at (1,1)).'}`. The line $y=x$ through the cusp $y^2=x^3$ has $I_O = 2$, not $1$. Direct: $(y-x, y^2-x^3) = (y-x, x^2-x^3) = (y-x, x^2)$ in $\mathcal{O}_O$ (since $1-x$ is a unit), basis $\{1,x\}$, $\dim=2$. Geometrically, any line through a singular point of multiplicity $m$ has $I_P \ge m$; the cusp has $\mathrm{mult}_O=2$, so no line through it can have $I=1$. The "transverse at origin" wording is also conceptually wrong — there is no transverse intersection with a singular point.
- **bezout.html:468** — `'y-x2|y2-x3': {I:4, note:'parabola vs. cusp: a rare quartic contact at origin.'}`. Correct value is $I_O=3$. Parametrize cusp by $(t^2,t^3)$ and substitute into $y-x^2$: $t^3 - t^4 = t^3(1-t)$, order $3$ at $t=0$. Equivalently, $(y-x^2, y^2-x^3) = (y-x^2, x^4-x^3) = (y-x^2, x^3)$ locally; basis $\{1, x, x^2\}$, $\dim=3$.
- **bezout.html:612** — Example D note "1·3 + ... = 6 total" is muddled. Bézout count for the projective closures of $y^3=x$ (degree 3) and $y=x^2$ (degree 2) is $3\cdot 2=6$, not $1\cdot 3$. The numerical value 6 is right; the factorization is not.

## Underspecified or unverifiable claims

- **bezout.html:603–605 (resultant example C).** "$x=0$ appears with multiplicity 2 in the resultant, reflecting $I_P=2$." Local statement is correct ($I_O(y^2-x, y^2+x)=2$), but Bézout for these two conics is $2\cdot 2=4$; the missing 2 lives at $[1:0:0]$, where both curves pass through with shared tangent and contribute another $I=2$. The widget never mentions this, which can leave a careful reader thinking the resultant accounts for all intersections.
- **bezout.html:1041.** "Eight points impose eight linear conditions" — only generically. The statement of Cayley–Bacharach being a tautology assumes the eight points are in *general position* (no six on a conic, no three collinear under the appropriate sub-case); the page handles this implicitly via the "transversely in nine distinct points" hypothesis on line 1039 but the dimension-count paragraph does not re-state the genericity. Minor.
- **bezout.html:1098.** "$|E[n]|=n^2$ over $\bar{\mathbb{Q}}$" — true for $\gcd(n, \mathrm{char}\, k)=1$; in characteristic $p$ this fails for $n$ divisible by $p$ (supersingular: $E[p]$ trivial; ordinary: $E[p]=\mathbb{Z}/p$). Page is implicitly char 0, but the claim isn't qualified. Minor.
- **Plücker formulas** (degree, class, dual curve) — the audit prompt asks about these, but the page does not discuss them. Coverage gap, not an error.

## Severity

**Minor.** Two off-by-one intersection-multiplicity entries in the §3 lookup table (lines 467, 468) — both are visible in the interactive widget output and contradict the algorithm the same section just taught (substitute the smooth-curve equation, read order of vanishing). The conceptual scaffolding (definition, axioms, theorem statement, Cayley–Bacharach, higher-dim Bézout, Chow-ring formulation) is otherwise solid, and the worked examples I spot-checked outside those two table rows all came out right.
