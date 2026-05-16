# Math-correctness pass — `elliptic-curves.html`

## Verified claims

- **§1 Definition / discriminant.** Short Weierstrass over char ≠ 2,3, point at infinity $[0:1:0]$, discriminant $\Delta = -16(4a^3+27b^2)$, smooth ↔ $\Delta\ne 0$, two real components when $\Delta>0$ vs one when $\Delta<0$. All correct.
- **§2 Group law.** Chord-tangent recipe, slope formulas $\lambda=(y_2-y_1)/(x_2-x_1)$ and doubling $\lambda=(3x_1^2+a)/(2y_1)$, $x_3=\lambda^2-x_1-x_2$, $y_3=\lambda(x_1-x_3)-y_1$, identity $O$, inverse $-(x,y)=(x,-y)$. All standard and correct. Riemann–Roch / $\operatorname{Pic}^0$ associativity sketch is standard.
- **§2 Multiplication-by-$n$.** $\deg[n]=n^2$, $E[n]\cong(\mathbb{Z}/n)^2$ for $\operatorname{char}(k)\nmid n$. Correct.
- **§3 Hasse bound.** $|a_p|\le 2\sqrt p$, Frobenius eigenvalues $\alpha,\bar\alpha$ with $\alpha\bar\alpha=p$, $|\alpha|=\sqrt p$. Correct (Hasse 1933).
- **§3 Counts** verified by recomputation: $\#E(\mathbb{F}_5)=8$ for $y^2=x^3-x$ (structure $\mathbb{Z}/2\oplus\mathbb{Z}/4$, confirmed); $\#E(\mathbb{F}_7)=12$ for $y^2=x^3+1$, $a_7=-4$ (CM by $\mathbb{Z}[\omega]$, $7\equiv 1\pmod 3$ ⇒ split — correct); $\#E(\mathbb{F}_{11})=12$, $a_{11}=0$ (supersingular, $11\equiv 2\pmod 3$ — correct).
- **§4 j-invariant formula** $j=1728\cdot 4a^3/(4a^3+27b^2)=-1728(4a)^3/\Delta$. Correct. Twists for $j\ne 0,1728$ classified by $k^\times/(k^\times)^2$, correct.
- **§4 Special j-values:** $j=0\Leftrightarrow $ extra automorphism of order 6 via $(x,y)\mapsto(\omega x,-y)$; $j=1728\Leftrightarrow$ order-4 automorphism $(x,y)\mapsto(-x,iy)$. Correct.
- **§5 Uniformization.** $\wp$ series, $(\wp')^2=4\wp^3-g_2\wp-g_3$, $g_2=60\sum\lambda^{-4}$, $g_3=140\sum\lambda^{-6}$. Substitution to $a=-g_2/4$, $b=-g_3/4$. $j(\tau)=1728g_2^3/(g_2^3-27g_3^2)$. $q$-expansion $j=q^{-1}+744+196884q+21493760q^2+\cdots$. $j((1+\sqrt{-163})/2)=-640320^3$. All standard and correct.
- **§6 Mordell–Weil & Mazur.** Mordell 1922, Weil 1928. $E(K)\cong E(K)_{\text{tors}}\oplus\mathbb{Z}^r$. Mazur table (15 groups: $\mathbb{Z}/n$ for $n\in\{1..10,12\}$, $\mathbb{Z}/2\oplus\mathbb{Z}/2n$ for $n\in\{1,2,3,4\}$). Correct.
- **§6 BSD.** $\operatorname{ord}_{s=1}L(E,s)=r$; known for analytic rank $\le 1$ via Kolyvagin + Gross–Zagier. Correct.
- **§6 Rank record** $\ge 29$ (Elkies, 2024). Correct.
- **§6 Cremona 37a1** ($y^2+y=x^3-x$, rank 1, trivial torsion, generator $(0,0)$). Correct.

## Wrong / dubious claims

- **CM table line 970** — `y² = x³ − 15x + 22` is listed with $j=-3375$, CM by $\mathbb{Q}(\sqrt{-7})$. Direct computation gives $j(-15,22)=54000$, which is the singular modulus for discriminant $-12$ (CM by the non-maximal order $\mathbb{Z}[\sqrt{-3}]$ inside $\mathbb{Q}(\sqrt{-3})$). The correct short-Weierstrass model with $j=-3375$ (CM by $\mathbb{Q}(\sqrt{-7})$) is `y² = x³ − 35x + 98`. Both the equation and the CM field are wrong.
- **CM table line 971** — `y² = x³ − 595x + 5586` with claimed $j=-32768$, CM by $\mathbb{Q}(\sqrt{-11})$. Direct computation gives $j=255^3=16581375$, which is the singular modulus for discriminant $-28$ (CM by $\mathbb{Z}[\sqrt{-7}]$). The correct short-Weierstrass models for $j=-32768$ exist (e.g. derived from Cremona 121b1 $y^2+y=x^3-x^2-7x+10$); $(-595,5586)$ is not one of them.
- **j-calculator buttons line 985–986** — both labels are wrong:
  - `data-ab="-15,22"` labeled "$j=-3375$" actually produces $j=54000$.
  - `data-ab="-35,98"` labeled "$j=-32768$" actually produces $j=-3375$.
  Clicking the buttons therefore prints a $j$ that doesn't match the label — directly observable in the readout.
- **Rank/torsion gallery note line 1346** — "Mazur's theorem: 10 is the largest cyclic torsion order possible over Q." Wrong: Mazur allows $\mathbb{Z}/12$, so 12 is the largest cyclic order (11 is excluded; the cyclic orders are $1,\dots,10,12$). The page's own Mazur table at line 1304 lists 12 correctly, so this contradicts itself.
- **Bremner–Cassels generator line 1364–1365** — claimed $x(P)=612776083187947368101/78841535860683900210$ for the rank-1 generator on $y^2=x^3+877x$. Plugging this $x$ into the curve does **not** yield a square; it is not a point on $E(\mathbb{Q})$. The correct generator (Silverman GTM 106 Ex. VIII.10) has
  $$x(P)=\frac{375494528127162193105504069942092792346201}{6215987776871505425463220780697238044100},$$
  whose numerator and denominator are both perfect squares of the matching $y$ component (verified). The page's number is corrupted.
- **§3 line 940** — "the 2-part of $E(\mathbb{F}_5)$ is $(\mathbb{Z}/2)^2$." The 2-Sylow of an order-8 abelian group is the whole group, so the 2-part is $\mathbb{Z}/2\oplus\mathbb{Z}/4$, not $(\mathbb{Z}/2)^2$. The 2-**torsion** $E[2](\mathbb{F}_5)$ is $(\mathbb{Z}/2)^2$. Confusing "2-part" with "2-torsion" — minor wording bug.

## Underspecified or unverifiable claims

- §3 "Lattice → curve" widget (line 1242): "convergence is algebraic (order $1/r^2$ for $g_2$)". The classical Eisenstein series $\sum\lambda^{-4}$ is conditionally convergent; the symmetric truncation $|m|,|n|\le N$ does converge but the rate isn't quite the elementary $1/r^2$ claim. Not wrong enough to flag, but loosely stated.
- §3 line 945 "supersingular curves have nontrivial endomorphism rings (orders in quaternion algebras)". Strictly: ordinary curves also have nontrivial $\operatorname{End}$ in characteristic $p$; the distinguishing feature is that supersingular endomorphism rings are *non-commutative* maximal orders in quaternion algebras. Phrasing is loose but defensible.
- The curve `y² + 7xy = x³ + 16x` is asserted to have torsion $\mathbb{Z}/10$ (line 1346). Plausible (Mazur's $\mathbb{Z}/10$ is realized e.g. by Cremona 66c1 family) but not independently verified here.

## Severity

**Moderate.** Two table rows and two button labels in §4 give wrong $j$-values and wrong CM fields; one widget shows a wrong "generator" for the 877 example; one Mazur footnote contradicts the table immediately above it. None of the foundational definitions/theorems are wrong, but the concrete CM table and rank gallery are the parts a reader would copy down — and they're the parts that don't survive a calculator. Recommend fixing the four CM/j entries (table + buttons), the Mazur note, the 877 generator string, and the "2-part" wording before the next release.
