# tropical-geometry.html — math-correctness audit

## Verified claims

**Tropical semiring (§1).** $a \oplus b = \min(a,b)$, $a \otimes b = a+b$ on $\mathbb{R}\cup\{\infty\}$; distributivity $a + \min(b,c) = \min(a+b,a+c)$; identities $\infty$ and $0$; no additive inverses. All correct. Imre Simon attribution and the "tropical = honoring his São Paulo origin" naming story are accurate.

**Tropical polynomials and corner locus (§1).** $f(x) = \min_i(a_i + ix)$ is a piecewise-linear concave function (lower envelope of affines) with integer slopes. Corner locus = points where the min is attained twice. Correct. The widget's three corner equations and validity ranges are correctly derived.

**Tropical line $\min(x,y,c)$ (§2).** Vertex at $(c,c)$, three rays in directions $(1,0), (0,1), (-1,-1)$. Correct (the SVG-coord encoding `[1,0],[0,-1],[-1,1]` is the y-flipped equivalent).

**Balancing condition (§2).** $\sum_e w_e u_e = 0$ with primitive $u_e$ and positive integer $w_e$. Correct statement. Newton-polygon duality (rays ↔ boundary edges, vertices ↔ subdivision regions) is the standard Kapranov / Mikhalkin duality.

**Bieri–Groves (§3).** Pure-dimensional polyhedral complex of dimension $\dim X$. ✓ Tropicalization formula $\mathrm{trop}(\sum c_\alpha z^\alpha) = \min_\alpha(v(c_\alpha) + \alpha\cdot x)$. ✓

**Bézout via mixed volume (§4).** $|C_1 \cap C_2| = \mathrm{MV}(\mathrm{Newt}(f_1), \mathrm{Newt}(f_2))$ with $\mathrm{MV}(\Delta_{d_1},\Delta_{d_2}) = d_1 d_2$ recovers classical Bézout. ✓ (under normalized-MV convention)

**Tropical genus, canonical divisor, Riemann–Roch (§5).** $g(\Gamma) = |E|-|V|+1$, $K_\Gamma(v) = \deg(v)-2$ (so $\deg K = 2g-2$), and Baker–Norine $r(D) - r(K-D) = \deg D - g + 1$. All correct. Specialization inequality direction (algebraic rank ≤ tropical rank) ✓. Chip-firing widget: theta, 3-banana, dumbbell all genus 2; $K_4$ genus 3. ✓

**Mikhalkin counts (§6).** Number of points $3d-1+g$ for plane curves of degree $d$, geometric genus $g$. ✓ $N_1=1, N_2=1, N_3=12, N_4=620, N_5=87304, N_6=26312976$ all correct (Kontsevich).

**Tropical moduli dimension (§5).** $\dim M^{\mathrm{trop}}_{g,n} = 3g-3+n$, Berkovich-skeleton interpretation. ✓

## Wrong / dubious claims

- **`tropical-geometry.html:471` (conic widget).** The "tropical conic" example data is mathematically broken: vertex A's outgoing edges sum to $(1,0)$ (not $\mathbf{0}$), vertex B's to $(-1,0)$. Only C balances. The widget's own balancing checker will flag the conic as unbalanced, contradicting the surrounding pedagogy. Also the description "3 trivalent vertices, 6 unbounded rays, 3 internal edges" is wrong on two counts: each listed vertex has **4** incident edges (2 internal + 2 rays), and a generic smooth tropical conic dual to the standard unit-triangle subdivision of $\Delta_2$ has **4** trivalent vertices (one per small triangle), not 3.

- **`tropical-geometry.html:480` (triple-vertex widget, "weight-3 ray").** Direction `[-2,0]` is declared with weight 1, but $(-2,0)$ is **not primitive** (gcd 2). The balancing condition requires primitive $u_e$. Either the direction should be $(-1,0)$ with weight 2, or the example needs restating.

- **`tropical-geometry.html:711` (Bernstein–Kushnirenko statement).** "$n!\,\mathrm{MV}(\mathrm{Newt}(f_1),\ldots,\mathrm{Newt}(f_n))$" is inconsistent with the preceding `MV(Δ_{d_1}, Δ_{d_2}) = d_1 d_2`. Under the normalized convention (used by line 710), BKK reads $\#\mathrm{solutions} = \mathrm{MV}$ (no $n!$). Under the "geometric" convention, $\mathrm{MV}(\Delta_d, \Delta_d) = d^2/2$ and you need the $n!$. Pick one convention; as written the two formulas use different ones.

- **`tropical-geometry.html:1042` (Mikhalkin multiplicity).** $\mu(T) = \prod_v \det(u_1, u_2)$ — should be $|\det(u_1,u_2)|$. Without absolute value the count is sign-dependent and can be negative.

- **`tropical-geometry.html:1113` (Hopfield–Tank attribution).** "Hopfield-Tank min-plus networks turn convex optimization into matrix products." Hopfield–Tank (1985) are continuous-time analog neural networks for combinatorial optimization; they are not min-plus / tropical. The min-plus formulation of shortest-path / DP is Bellman / Floyd–Warshall. **Misattribution.**

- **`tropical-geometry.html:1114` ("Tomas Klimpel").** No such author. The intended reference is Baldwin & Klemperer ("Understanding preferences", Econometrica 2019). Drop the spurious name.

## Underspecified or unverifiable claims

- **`tropical-geometry.html:489` (`bad` widget, direction `[0,0]`).** $(0,0)$ is not a valid edge direction at all (no notion of "primitive" applies). The pedagogy is fine — it's labeled as illegal — but the textual description "three rays sum to (1,1) ≠ 0" is computed treating $(0,0)$ as a contribution of zero, so the imbalance comes from the other two rays summing to $(1,1)$. A more honest unbalanced example would use a real direction.

- **§5 stable-tropical-curve definition.** "Every vertex of valence ≤ 2 is removed (or has a positive genus weight)" is a one-line gloss of vertex-weighted stable graphs (Caporaso); fine for a notebook but the precise condition is $2g(v) - 2 + \mathrm{val}(v) > 0$. Not wrong, just compressed.

- **§3 "every tropical curve lifts."** Lifting is known unconditionally only in the smooth (trivalent, weight-1) case (Mikhalkin / Speyer). General lifting is open and is exactly the open problem flagged in §7. The §3 sentence ("every tropical curve *lifts* to an algebraic curve over some sufficiently large field") overstates current knowledge; it should say "smooth tropical curves lift" or qualify with "in genus zero."

## Severity

**Moderate.** The conic widget data is mathematically wrong (would visibly fail its own balance check), the Bernstein–Kushnirenko formula has a factor-of-$n!$ inconsistency, and there are two attribution errors (Hopfield–Tank, "Tomas Klimpel"). The non-primitive direction in the triple-vertex widget and the missing absolute value on Mikhalkin multiplicity are minor but should be fixed. Core theory (semiring, Baker–Norine, $N_d$ values, dimensions) is solid.
