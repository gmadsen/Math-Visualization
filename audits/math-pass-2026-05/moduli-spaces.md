# moduli-spaces — math correctness audit (2026-05)

**Section:** Algebraic geometry

## Verified claims

### j-invariant and short Weierstrass (§2)

- **Discriminant** $\Delta = -16(4a^3 + 27b^2)$ (line 300) — Silverman convention, correct.
- **j-invariant** $j(E) = 1728 \cdot 4a^3 / (4a^3 + 27b^2)$ (line 301) — correct (equivalent to $-1728(4a)^3/\Delta$).
- **Special models** $y^2=x^3+1 \Rightarrow j=0$ and $y^2=x^3+x \Rightarrow j=1728$ (line 324–325) — correct.
- **Aut groups** generic $\mathbb{Z}/2$ (just $[-1]$), $j=0 \Rightarrow \mathbb{Z}/6$ (gen by $(\omega x,-y)$, $\omega = e^{2\pi i/3}$), $j=1728 \Rightarrow \mathbb{Z}/4$ (gen by $(-x,iy)$) (lines 324–326) — both explicit automorphisms verify (preserve cubic, correct order).

### Fine vs. coarse (§3)

- **Fine moduli** = representable functor + universal family $\mathcal{E}\to M$ such that every family is a unique pullback (line 347) — standard.
- **Coarse moduli** = bijection on geometric $\bar k$-points + universal among NTs to schemes (line 350) — standard (Mumford GIT defn).
- **j-line is coarse but not fine for $\mathcal{M}_{1,1}$** (line 352) — correct.

### Twist obstruction (§4)

- **Quadratic-twist family** $E_2: y^2 = x^3 + t^6$ vs trivial $E_1: y^2 = x^3 + 1$ (line 383) — correct sextic-twist witness; $j = 0$ on every $t \ne 0$ fibre, with isomorphism $(x,y) \mapsto (t^2 x, t^3 y)$ requiring a global sixth root, obstruction in $H^1(\mathbb{A}^1\setminus\{0\}, \underline{\operatorname{Aut}}(E_1))$ (line 385).

### Level structure (§5)

- **Level-$N$ structure** = iso $(\mathbb{Z}/N)^2 \xrightarrow{\sim} E[N]$ (line 416) — standard.
- **$N \ge 3$ rigidity**: no non-trivial automorphism fixes a level-$N$ structure (line 418) — standard (Serre rigidity).
- **$N=2$ failure**: $[-1]$ acts as identity on $E[2]$ since $-P = P$ on 2-torsion; for $N=3$, $-1 \ne 1 \pmod 3$ so $[-1]$ is detected (line 434) — correct.
- **2-torsion of $y^2=x^3-x$** = $\{O, (-1,0), (0,0), (1,0)\}$ (line 884) — correct.

### Higher genus (§6)

- **$\dim M_g$**: $0$ for $g=0$, $1$ for $g=1$, $3g-3$ for $g\ge 2$ (line 453) — correct.
- **$3g-3 = \dim H^1(C, T_C)$** is the deformation-space dimension for $g \ge 2$ (line 454) — correct (Riemann–Roch on $T_C = \Omega_C^{-1}$, deg $= 2-2g$, dim of obstruction space).
- **Stable curve definition** (lines 459–463): connected proper reduced at-worst-nodal of arithmetic genus $g$, every $\mathbb{P}^1$ component has $\ge 3$ special points, every $g=1$ component has $\ge 1$ — matches Deligne–Mumford 1969.
- **Equivalent formulation** $|\operatorname{Aut}(C, p_1,\dots,p_n)| < \infty$ (line 464) — correct.
- **W6 stable-curve gallery dim formula** (lines 992–995): the JS branches `g==0 → max(0, n-3)`, `g==1 → n`, `else → 3g-3+n`, all correct.
- **W6 (g,n)=(0,3) dim 0; (1,1) dim 1; (2,0) dim 3; (3,0) dim 6; (4,0) dim 9; (0,5) dim 2** — all correct.
- **Generic $g=3$ = smooth plane quartic** (line 912 widget) — correct (canonical embedding of non-hyperelliptic genus 3).
- **Generic $g=4$ = complete intersection of quadric + cubic in $\mathbb{P}^3$** (line 914 widget) — correct (canonical embedding for non-hyperelliptic genus 4).
- **Two genus-1 curves glued at one node, arithmetic genus 2** (line 916): consistent with $g_a = \sum g_i + b_1(\text{dual graph}) = 1+1+0 = 2$.
- **Self-node, geometric genus 1, arithmetic genus 2** (line 918) — correct ($g_a = g_{\text{geom}} + \#\text{nodes}$ for irreducible).

### Summary table (§7)

- **Fine / coarse / stack three-tier table** (lines 502–505) — correct. The remark that the j-line is the coarse space of $\overline{\mathcal{M}}_{1,1}$ with stacky points of order 6 at $j=0$ and order 4 at $j=1728$ (line 510) is consistent with the Aut groups above (the stacky orders are |Aut|/|generic Aut| $= 6/2 = 3$ on some conventions, but counting full Aut the page is using the convention that records the full automorphism group order — both conventions appear in the literature; the page's choice matches Deligne–Rapoport's labeling of $\overline{\mathcal{M}}_{1,1}$).

## Wrong / dubious claims

- **`moduli-spaces.html:453` — dimension formula $\dim M_{g,n} = \dim M_g + n$ is wrong for $g \in \{0,1\}$.** The formula gives $\dim M_{0,n} = n$ and $\dim M_{1,n} = 1+n$, but the correct values are $\dim M_{0,n} = n-3$ (for $n \ge 3$) and $\dim M_{1,n} = n$ (for $n \ge 1$). The W6 widget gallery on the same page uses the correct piecewise formula (lines 992–995) and reports $\dim M_{0,5} = 2 = 5-3$, directly contradicting the prose. Fix: replace with the standard piecewise expression `dim M_{g,n} = max(0, n-3)` for $g=0$, `n` for $g=1$, `3g-3+n` for $g \ge 2`.
- **`moduli-spaces.html:610` — "generic curve $y^2 = x^3 - x + 1$ … $j \approx 1259$".** Computed $j$ for $a=-1, b=1$: $j = 1728 \cdot 4(-1)^3 / (4(-1)^3 + 27 \cdot 1) = 1728 \cdot (-4)/23 \approx -300.52$. Off by a sign and roughly factor-4. The widget displays this label, so the user sees a wrong value. Fix the literal `'≈ 1259'` (the curve and Aut data are otherwise correct).
- **`moduli-spaces.html:910` — "A hyperelliptic SURFACE with six Weierstrass points".** Should read "hyperelliptic CURVE." Hyperelliptic surface is a different object (a complex surface with finite étale cover by an abelian surface, $b_1 = 2$, $c_1 = 0$). Every smooth genus-2 curve is hyperelliptic with $2g+2 = 6$ Weierstrass points — the count is right, the noun is wrong.
- **`moduli-spaces.html:527–532` (W1 widget JS) — j-line parametrization is incorrect.** The code sets `k = j/(1728 - j)`, `a = -3k`, `b = -2k`, but this gives a curve with j-invariant $1728k/(k-1) = 864j/(j-864)$, not $j$ as advertised. E.g. slider $j = 500$ shows a curve actually having $j \approx -1187$. Standard fix: `a = 3k, b = 2k` (or equivalently $a = -3j/(j-1728)$, $b = -2j/(j-1728)$). This is a widget bug, not a prose claim, but it directly affects user perception of the j-invariant.

## Underspecified or unverifiable claims

- **`moduli-spaces.html:420` — "finite étale … with Galois group $\operatorname{GL}_2(\mathbb{Z}/N)$."** Strictly: as a cover of the j-line (away from $j=0,1728$), the deck group of the geometrically connected components of $Y(N)$ is $\operatorname{SL}_2(\mathbb{Z}/N)/\{\pm 1\}$; over $\mathbb{Q}$ (with components permuted by Galois on $\det \in (\mathbb{Z}/N)^*$) one can speak of $\operatorname{GL}_2(\mathbb{Z}/N)/\{\pm 1\}$. The page's $\operatorname{GL}_2(\mathbb{Z}/N)$ omits the $\{\pm 1\}$ quotient. This is a common shorthand and not a hard error, but it's loose.
- **`moduli-spaces.html:450` — "$M_{0,n}$ and $M_{1,n}$ require care".** True, but undercommunicated given the (wrong) general formula immediately following.
- **W3 fine-vs-coarse diagram** treats $S$ and $M$ as visual nodes with arrows but conflates "$S \to M$ classifying map" with "$E/S$ family" arrows in a way that's stylized rather than precise. Not an error, just a schematic.

## Severity

**moderate.** Two prose-level math errors on the page itself: the dimension formula $\dim M_{g,n} = \dim M_g + n$ is wrong for $g \in \{0,1\}$ (the very small-$g$ examples readers most often encounter), and the W2 widget readout displays $j \approx 1259$ for $y^2 = x^3 - x + 1$ when the actual $j \approx -300.52$. There is also a substantive widget bug: W1's j-slider parametrization produces curves with the wrong j-invariant. The "hyperelliptic surface" wording is a one-word lapse. The Galois-group $\operatorname{GL}_2(\mathbb{Z}/N)$ statement is loose by $\{\pm 1\}$ but defensible. All higher-genus dimensions, special automorphism groups, deformation-theoretic dimension count, stable-curve definition, and arithmetic-genus calculations check out.
