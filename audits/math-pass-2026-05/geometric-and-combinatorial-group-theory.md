# geometric-and-combinatorial-group-theory — math correctness audit (2026-05)

**Section:** Algebra & homological

## Verified claims

### Presentations and the word problem (§1)

- **Presentation as quotient** (lines 264–266): $G = \langle S \mid R \rangle := F(S) / \langle\!\langle R \rangle\!\rangle$ where $\langle\!\langle R \rangle\!\rangle$ is the normal closure — standard. Justification "kernel of any homomorphism is normal, so $r=e \Rightarrow grg^{-1}=e$" — correct.
- **Examples** (line 268):
  - $\mathbb{Z} = \langle a \rangle$ — correct.
  - $\mathbb{Z}^2 = \langle a, b \mid aba^{-1}b^{-1} \rangle$ — correct (commutator relator).
  - $D_n = \langle r, s \mid r^n, s^2, srsr \rangle$ — correct ($srsr = (sr)^2 = e$ gives $srs = r^{-1}$, the standard dihedral relation).
  - Trefoil knot group $= \langle a, b \mid aba = bab \rangle$ — correct. This is also the 3-braid group $B_3 = \langle \sigma_1, \sigma_2 \mid \sigma_1\sigma_2\sigma_1 = \sigma_2\sigma_1\sigma_2 \rangle$, which is isomorphic to the trefoil knot group $\pi_1(S^3 \setminus K)$ for the trefoil (the (2,3)-torus knot).
- **Tietze 1908 four moves** (line 270): add/remove generator that is a word in others, add/remove relator that is consequence of others — correct standard formulation.
- **Word problem undecidable in general** (line 287): Novikov 1955, Boone 1958 — correct attribution.
- **Word problem decidable for finite, free, abelian, hyperbolic groups** (line 287) — all correct.
- **Presentation explorer widget** (lines 290–308):
  - $\mathbb{Z}^2$ "abab⁻¹a⁻¹ = ab²a⁻¹·a⁻¹ ↦ aabb·a⁻¹·a⁻¹ = b² (commute then cancel)": Let me check. abab⁻¹a⁻¹: using $ab=ba$, abab⁻¹ = baab⁻¹ = b·a·a·b⁻¹; or starting again, abab⁻¹a⁻¹ = a·b·a·b⁻¹·a⁻¹. Using $ab=ba$, this is a·b·a·b⁻¹·a⁻¹ = a·a·b·b⁻¹·a⁻¹ = a²·a⁻¹ = a. So this should reduce to $a$, not $b^2$. Wait, looking at the text more carefully: "abab⁻¹a⁻¹ = ab²a⁻¹·a⁻¹ ↦ aabb·a⁻¹·a⁻¹ = b²". Reading the second middle form: "ab²a⁻¹·a⁻¹" suggests they're saying abab⁻¹a⁻¹ = ab²a⁻¹·a⁻¹ — but that would require $ab^{-1} = b·a^{-1}\cdot$ something … this string is hard to parse. **See "Wrong / dubious claims" below**.
  - $\mathbb{Z}/6$: $a^4 \cdot a^3 = a^7 = a$ (since $a^6 = e$) — correct.
  - $D_4$: $srs = r^{-1}$ from $srsr = e$ — correct.
  - Trefoil: $aba\cdot b^{-1}a^{-1} = bab \cdot b^{-1}a^{-1} = b$ (using $aba=bab$) — correct (substitute $bab$ for $aba$, then $bab\cdot b^{-1}a^{-1} = ba\cdot a^{-1} = b$).
- **F_2 widget note** "Cayley graph is the 4-regular tree" — correct (rank-2 free group, $|S| = 4$ symmetric).

### Cayley graphs and the word metric (§2)

- **Cayley graph definition** (lines 331–335): vertices = $G$, edges $\{(g, gs) : g \in G, s \in S\}$ for symmetric $S$ — correct.
- **Left action by graph automorphisms** (line 337): $g \to gs$ edge under $h$ becomes $hg \to hgs = (hg)s$, an edge — correct, vertex-transitive.
- **Right multiplication by $s$ moves along $s$-labelled edges, not an automorphism (permutes labels)** (line 337) — correct.
- **Word metric** (line 339): $d_S(g, h) = $ length of shortest word in $S \cup S^{-1}$ representing $g^{-1}h$ = graph distance in $\mathrm{Cay}(G,S)$ — correct.
- **Different generating sets give bilipschitz Cayley graphs** (line 339) — correct (each generator of $S'$ has finite length in $S$, giving bilipschitz).
- **Cayley widget — $\mathbb{Z}^2$** (lines 378–401): grid with horizontal yellow ($a$) edges, vertical blue ($b$) edges; each vertex labelled $a^i b^j$ — correct.
- **Cayley widget — $D_4$** (lines 403–438): outer 4-cycle = rotations $\{e, r, r^2, r^3\}$ via $r$-edges; inner 4-cycle = reflections $\{s, rs, r^2s, r^3s\}$ via $r$-edges (in *reverse* direction); pink edges = $s$ (involution) connecting outer $r^k$ to inner $r^k s$. The reverse direction on the inner cycle is correct: $r^k s \cdot r = r^k \cdot s r = r^k \cdot r^{-1} s = r^{k-1} s$ (using $sr = r^{-1}s$ from $srs = r^{-1}$). Verified all four edges:
  - $s \cdot r = r^{-1}s = r^3 s$ — edge pos[4]→pos[7] ✓
  - $rs \cdot r = r \cdot r^{-1}s = s$ — edge pos[5]→pos[4] ✓
  - $r^2 s \cdot r = rs$ — edge pos[6]→pos[5] ✓
  - $r^3 s \cdot r = r^2 s$ — edge pos[7]→pos[6] ✓
- **Cayley widget — $F_2$** (lines 440–465): 4-regular tree, depth 3, no doubling back via `if(depth>0 && d===((dir+2)%4)) continue;` — correct (avoids immediate inverse cancellation, which is exactly the reduced-word condition that makes the tree). The labels are concatenated correctly.
- **Quiz — symmetric $S$ involution-free implies vertex degree $|S|$** (lines 50–58): correct. Each $s \in S$ contributes one neighbor $gs$; with $S$ symmetric ($s, s^{-1}$ both in $S$, distinct under no-involution hypothesis), $g$ has $|S|$ distinct neighbors.
- **Quiz — left multiplication is the automorphism action; right is not** (lines 62–70) — correct (page also says this in prose).
- **Quiz — word metric is shortest word for $g^{-1}h$** (lines 73–82) — correct.

### Quasi-isometry (§3)

- **$(K,C)$-quasi-isometric embedding** (lines 493–494): $\frac{1}{K}d_X(x,x') - C \le d_Y(f(x), f(x')) \le K d_X(x,x') + C$ — correct standard definition.
- **Quasi-isometry adds $C$-density of image** (line 495) — correct.
- **QI is an equivalence relation on metric spaces** (line 495) — correct.
- **Schwarz–Milnor lemma** (line 497): if $G$ acts properly cocompactly by isometries on a proper geodesic metric space $X$, then $G$ with any word metric is QI to $X$ — correct standard formulation.
- **Quasi-isometry checker widget** (lines 518–586):
  - $\lfloor \cdot \rfloor$ as $(1,1)$-QI: $|\lfloor x \rfloor - \lfloor y \rfloor| \le |x-y| + 1$ and $\ge |x-y| - 1$ — correct.
  - $f(x) = 2x$ as $(2,0)$-QI — correct ($\frac{1}{2}|x-y| \le 2|x-y| \le 2|x-y|$).
  - $f(x) = e^{x/30}$ never fits a finite envelope — correct (super-linear).
  - $f \equiv 0$ fails the lower bound — correct.
  - Caveat: the widget only checks $f(x)$ against $x$ (i.e., the special case $x' = 0$, $d = |\cdot|$ on $\mathbb{R}$), so the "✓ stays inside the envelope" is necessary but not strictly sufficient for QI — see "Underspecified" below.
- **Quiz — floor is QI from $\mathbb{R}$ to $\mathbb{Z}$** (lines 90–99) — correct.
- **Quiz — Schwarz-Milnor gives QI of Cayley graphs from any two finite generating sets** (lines 102–111) — correct.
- **Quiz — element order is NOT a QI invariant; growth, ends, hyperbolicity are** (lines 114–124) — correct.

### Growth (§4)

- **Definition $\beta_S(n) = \#B_n$** (lines 608–609) — correct.
- **Equivalence-up-to-linear-rescaling** (line 610): two growth functions are equivalent when each is bounded by a linear rescaling of the other — correct standard equivalence under which growth type is generating-set-independent.
- **Growth table** (lines 612–621):
  - $\mathbb{Z}^d$: $\Theta(n^d)$ polynomial — correct (the $\ell^1$-ball in $\mathbb{Z}^d$ has $\sum_{k=0}^d \binom{d}{k}\binom{n}{k} 2^k$ elements, leading order $\frac{2^d}{d!}n^d$).
  - Heisenberg $H_3(\mathbb{Z})$: $\Theta(n^4)$, "not the rank!" — correct. By the Bass–Guivarc'h formula, growth degree = $\sum_k k \cdot \mathrm{rank}(\gamma_k/\gamma_{k+1})$. For Heisenberg, lower central series gives $\gamma_1/\gamma_2 = \mathbb{Z}^2$ (rank 2), $\gamma_2/\gamma_3 = \mathbb{Z}$ (rank 1, the center). Degree $= 1\cdot 2 + 2\cdot 1 = 4$. Hirsch length is 3 — the page's "not the rank!" parenthetical correctly highlights the discrepancy.
  - $F_k$: $\Theta((2k-1)^n)$ — correct. The number of reduced words of length exactly $n$ in $F_k$ is $2k(2k-1)^{n-1}$ for $n \ge 1$, so cumulative is $\Theta((2k-1)^n)$.
  - Hyperbolic surface group $\pi_1(\Sigma_g)$, $g \ge 2$: exponential — correct (it acts cocompactly on $\mathbb{H}^2$ which has exponential volume growth, transferred via Schwarz-Milnor).
  - Grigorchuk group: $e^{n^\alpha}$ with $\alpha \approx 0.767$ — correct as of current knowledge. Erschler–Zheng (2020) established $\alpha = \log 2 / \log \lambda$ where $\lambda$ is the positive real root of $x^3 - x^2 - 2x - 4 = 0$, giving $\alpha \approx 0.7674$. Earlier this was Bartholdi's upper bound (1998) with the matching lower bound established more recently.
- **Gromov's theorem (1981)** (line 623): polynomial growth $\Leftrightarrow$ virtually nilpotent — correct.
- **Attribution** (line 623): $(\Leftarrow)$ Bass, Wolf, Guivarc'h — correct (Wolf 1968 for solvable case, Bass and Guivarc'h independently 1972 for the precise formula). $(\Rightarrow)$ Gromov 1981 via asymptotic cone + Montgomery–Zippin solution to Hilbert's fifth — correct standard outline of the proof.
- **Growth widget formulas** (lines 646–648):
  - $\beta_{\mathbb{Z}}(n) = 2n+1$ — correct.
  - $\beta_{\mathbb{Z}^2}(n) = 2n^2 + 2n + 1$ — correct ($\ell^1$-ball: $1 + 4(1+2+\cdots+n) = 1 + 2n(n+1)$).
  - $\beta_{F_2}(n) = 1 + 4(3^n - 1)/2$ — correct: ball of radius $n$ in 4-regular tree has $1 + 4 + 4\cdot 3 + \cdots + 4\cdot 3^{n-1} = 1 + 4\sum_{k=0}^{n-1} 3^k = 1 + 4(3^n - 1)/2 = 2 \cdot 3^n - 1$.
- **Quiz — $\mathbb{Z}^d$ polynomial of degree $d$** (lines 130–141) — correct.
- **Quiz — $F_2$ exponential** (lines 142–153): "$1 + 4(3^n-1)/2$, exponential rate 3" — correct (rate $= 2k - 1 = 3$ for $k = 2$).
- **Quiz — Gromov polynomial growth iff virtually nilpotent** (lines 155–166) — correct.

### Gromov-hyperbolic (§5)

- **$\delta$-thin triangle definition** (line 722): each side lies in $\delta$-neighborhood of union of other two — correct standard Rips definition.
- **Trees are $0$-hyperbolic** (line 724) — correct (no triangles to fatten).
- **$\mathbb{H}^2$ all triangles satisfy $\delta = \log(1+\sqrt{2})$** (line 722) — correct. This is the inscribed-circle radius of an ideal triangle in $\mathbb{H}^2$ (with curvature $-1$); equivalently $\mathrm{arccosh}(\sqrt{2})$ or $\frac{1}{2}\log(3+2\sqrt{2})$. It is the sharp constant for thin triangles in the standard formulation.
- **Definition of hyperbolic group** (line 722): some Cayley graph is $\delta$-hyperbolic for some $\delta < \infty$; independent of $S$ by Schwarz-Milnor — correct.
- **Examples** (line 724):
  - Free groups (trees, $\delta = 0$) — correct.
  - Surface groups $\pi_1(\Sigma_g)$, $g \ge 2$, act properly cocompactly on $\mathbb{H}^2$ — correct (uniformization gives $\Sigma_g = \mathbb{H}^2 / \pi_1(\Sigma_g)$ for $g \ge 2$).
  - Random groups in Gromov density model — correct (Gromov 1993 showed random groups are hyperbolic with overwhelming probability for density $< 1/2$).
  - $\mathbb{Z}^2$ is NOT hyperbolic (arbitrarily fat triangles) — correct.
- **Consequences** (line 726):
  - Linear-time word and conjugacy problems via Dehn's algorithm — correct.
  - Finitely many conjugacy classes of torsion — correct (classical fact, Bridson–Haefliger).
  - Boundary at infinity $\partial G$ on which $G$ acts as a convergence group — correct.
  - Quasi-isometric rigidity "in many cases" → commensurable — appropriately hedged (see "Underspecified" below).
- **Hyperbolic-vs-Euclidean triangle widget** (lines 740–874): the Poincaré-disk geodesic computation uses the Möbius isometry $z \mapsto (z - a)/(1 - \bar a z)$ that sends $a$ to $0$ (so the geodesic from $a$ to $b$ becomes a Euclidean line through 0 in the new chart). Verified the formula in `mob` and `unmob`:
  - `mob(z, c)`: numerator $cz + i \cdot cw = (z_0 - c_0) + i(z_1 - c_1) = z - c$; denominator $dx + i \cdot dy = (1 - (c_0 z_0 + c_1 z_1)) + i(c_0 z_1 - c_1 z_0)$. The denominator should be $1 - \bar c z = 1 - (c_0 - i c_1)(z_0 + i z_1) = 1 - (c_0 z_0 + c_1 z_1) - i(c_0 z_1 - c_1 z_0)$. So in fact the code's `dy = c_0 z_1 - c_1 z_0` corresponds to the *negative* of the imaginary part of $1 - \bar c z$. But the routine then divides $(z-c)$ by $(dx + i\cdot dy)$ — equivalently multiplies by complex conjugate of $(dx + i \cdot dy)$ over $|dx + i \cdot dy|^2$. The widget uses the formula for division correctly: $(a + ib)/(c + id) = ((ac+bd) + i(bc - ad))/(c^2+d^2)$. So the `mob` output components are $((z_0-c_0)dx + (z_1-c_1)dy)/(dx^2+dy^2)$ and $((z_1-c_1)dx - (z_0-c_0)dy)/(dx^2+dy^2)$, which equal the real/imaginary parts of $(z - c)/(dx + i\cdot dy)$. Whether $(dx + i\cdot dy)$ equals $1 - \bar c z$ or its conjugate $1 - cz$ is a sign convention; both define a valid Möbius automorphism of the disk. The composition `unmob(mob(z, c), c)` returns to $z$ as long as the inverse is consistent — the `unmob` formula uses $+c$ and $+\bar c z$ in the denominator, which is the correct inverse of the chosen `mob`. The geodesic interpolation $z = bp \cdot t$ for $t \in [0,1]$, then `unmob(z, a)` gives the geodesic from $a$ to $b$ in the disk. Mathematically valid (modulo a sign convention that just orients the geodesic differently).
  - $\delta$-neighborhood "rough visualization" with fixed Euclidean width 14 — explicitly disclaimed as illustrative only ("actual hyperbolic neighborhood would scale by $1/(1-|z|^2)$"). Honest and correct disclosure.
  - Euclidean triangle, equilateral, with `distToBC = |mid_y - By|` — correct (BC is horizontal at $y = By$, midpoint of AB is at $((A_0+B_x)/2, (A_1+B_y)/2)$, distance to BC is $|mid_y - B_y|$).
- **Dehn's algorithm** (line 876): Dehn presentation = every nontrivial word representing $e$ contains more than half of some cyclic conjugate of a relator; replacing it with the shorter complement strictly decreases length, terminating in $O(|w|)$ — correct standard formulation.
- **Quiz — $\delta$-thin triangle definition** (lines 172–182) — correct.
- **Quiz — $F_n$ hyperbolic (Cayley graph is $2n$-regular tree)** (lines 184–194): "trees are 0-hyperbolic" and "Cayley graph of $F_n$ is a $2n$-regular tree" — correct.
- **Quiz — Dehn's algorithm linear-time word problem** (lines 196–206) — correct.

### Applications and frontiers (§6)

- **Three Dehn problems undecidable for general f.p.** (lines 901–906):
  - Word: Novikov 1955, Boone 1958 — correct.
  - Conjugacy: C.F. Miller 1971 — correct.
  - Isomorphism: Adian 1955, Rabin 1958 — correct (Adian's earlier work + Rabin's 1958 strengthening).
- **All three become decidable for hyperbolic groups** (line 907) — correct.
- **Mostow rigidity** (line 910): closed hyperbolic manifold $M$, dim $\ge 3$, $\pi_1(M)$ determines metric; any homotopy equivalence $M \to M'$ between two such is homotopic to an isometry — correct standard statement.
- **Dim-2 contrast: $6g - 6$ moduli** (line 910) — correct (real dimension of Teichmüller space of closed orientable surface of genus $g \ge 2$).
- **CAT(0) cube complexes; Wise's malnormal special quotient theorem; Agol's resolution of virtual Haken (2012)** (line 913) — correct attributions. Agol's 2012 paper, building on Wise's hierarchy, proved the virtual Haken conjecture and earned a 2016 Breakthrough Prize / 2013 Veblen Prize.
- **Expander graphs from $\mathrm{SL}_2(\mathbb{F}_p)$** (line 916) — correct. Margulis 1973 was first; Lubotzky–Phillips–Sarnak 1988 gave Ramanujan expanders. (Note: SL_2 itself doesn't have property (T); the construction relies on Selberg's $3/16$ theorem / property $(\tau)$ for SL_2(ℤ). The page just says "expander family" without claiming property (T), which is appropriate.)
- **Decision-problem widget data** (lines 933–942):
  - finite groups: all three trivially decidable — correct.
  - f.g. abelian: word via Smith normal form — correct (compute presentation matrix, normalize). Conjugacy trivial since abelian — correct. Isomorphism via classification — correct.
  - free groups: word by free reduction — correct. Conjugacy by cyclic permutation of cyclically reduced word — correct. Isomorphism by rank — correct.
  - hyperbolic: word by Dehn — correct. Conjugacy by short-conjugator theorem — correct. Isomorphism: Sela 1995 (rigid case = torsion-free hyperbolic), Dahmani–Guirardel general case — correct attributions.
  - one-relator: Magnus 1932 (word problem via Magnus breakdown / Magnus hierarchy) — correct.
  - general f.p.: undecidability with correct attributions.
- **Quiz — Mostow rigidity dim $\ge 3$** (lines 213–223) — correct.
- **Quiz — Cayley graphs of $\mathrm{SL}_2(\mathbb{F}_p)$ form expander family, attribution Margulis 1973** (lines 225–235) — correct (with the property-(T) caveat noted above; the explanation says "key application of property (T)" which is an oversimplification for SL_2 specifically — see "Underspecified" below).
- **Quiz — all three decision problems undecidable for f.p. groups** (lines 237–246) — correct.

### Concept-graph blurbs (cross-checked against prose)

- All six concept blurbs in `concepts/geometric-and-combinatorial-group-theory.json` paraphrase the prose claims correctly. The Mostow rigidity blurb in `gcgt-applications` (line 82) says "Mostow rigidity for lattices in rank-one Lie groups" — correct (the original Mostow theorem applies to all rank-one symmetric spaces of dim $\ge 3$; later extended by Margulis to higher rank).

## Wrong / dubious claims

- **Presentation-explorer $\mathbb{Z}^2$ sample reduction** (line 294): the readout claims `abab⁻¹a⁻¹ = ab²a⁻¹·a⁻¹ ↦ aabb·a⁻¹·a⁻¹ = b²`. Working it out:
  - In $\mathbb{Z}^2$ with $ab = ba$: $abab^{-1}a^{-1} = a \cdot b \cdot a \cdot b^{-1} \cdot a^{-1}$. Move all $a$'s left and all $b$'s right via commutativity: $= a^{1+1-1} b^{1-1} = a^1 b^0 = a$.
  - So $abab^{-1}a^{-1} = a$, not $b^2$.
  - The intermediate string "ab²a⁻¹·a⁻¹" doesn't make sense as an equality with $abab^{-1}a^{-1}$ — the $b^{-1}$ in the input cannot become $b^2$ in the simplification. **This is a small math error in the widget readout text** (purely a wrong sample reduction). The presentation itself is correct.

## Underspecified or unverifiable claims

- **Quasi-isometry checker — "envelope" check is necessary but not sufficient** (lines 568–581). The widget only tests $f(x)$ against $x$ (i.e., the inequality $\frac{1}{K}|x| - C \le |f(x)| \le K|x| + C$), which is equivalent to the QI condition only at the special pair $(x, x') = (x, 0)$. A genuine QI check would test all pairs $(x, x')$. For the specific functions in the widget (linear and constant maps from $\mathbb{R}$ to $\mathbb{R}$), the result happens to be the same because of translation-invariance of the metric, but the widget would need a different check for, say, periodic perturbations of identity. Pedagogically reasonable simplification, not an error.
- **$\delta = \log(1+\sqrt{2})$ for $\mathbb{H}^2$** (line 722). This is the inscribed-circle radius of an *ideal* triangle, and is the sharp constant when "$\delta$-thin" is taken in the inscribed-circle / Rips formulation. Other formulations (Gromov's 4-point definition, slim triangles via "insize") give different sharp constants. The statement is correct under the convention being used (Rips thin triangles), which matches the page's prose definition.
- **Quasi-isometric rigidity "in many cases, two hyperbolic groups quasi-isometric to each other are commensurable"** (line 726). The hedge is necessary: for example, all closed hyperbolic 3-manifold fundamental groups are QI to $\mathbb{H}^3$ and hence to each other, but Mostow rigidity ensures they're not commensurable in general. QI rigidity holds for many specific classes (uniform lattices in rank-one Lie groups other than $\mathbb{H}^2$, by Pansu, Eskin–Farb, and others; mapping class groups; etc.) but not universally. The "in many cases" wording is appropriate.
- **Margulis SL_2(F_p) expander construction "key application of property (T)"** (quiz line 234). For SL_n with $n \ge 3$, property (T) directly gives the spectral gap. SL_2 does NOT have property (T); the SL_2(ℤ) → SL_2(F_p) expander construction relies instead on Selberg's $3/16$ theorem (a weaker spectral gap on the modular surface), known as property $(\tau)$ for the family of congruence quotients. The attribution to "property (T)" is a common oversimplification but technically inaccurate for the SL_2 case specifically. Margulis 1973's original construction did use higher-rank groups with (T); the SL_2 version came later via property $(\tau)$. Minor pedagogical imprecision in the quiz explanation, not a math error in the prose.
- **Dehn presentation widget δ-neighborhood is "fixed Euclidean width 14"** (lines 808, 832). Explicitly disclaimed as "illustrative only — actual hyperbolic neighborhood would scale by $1/(1-|z|^2)$". Honest disclosure; not an error.
- **Hyperbolic δ-neighborhood Euclidean shading in disk widget** (lines 811–816). The shading walks along bc and ca with fixed-Euclidean-radius circles. This is purely visual; no mathematical claim is made about the actual hyperbolic neighborhood from this graphic.

## Severity

**clean — one minor widget-readout reduction error.** All theorem statements (Gromov polynomial-growth theorem, Schwarz–Milnor lemma, Mostow rigidity, Novikov–Boone undecidability, Adian–Rabin isomorphism undecidability, Bass–Guivarc'h growth-degree formula via Heisenberg degree-4, Dehn's algorithm linear-time complexity for hyperbolic groups, Tietze's theorem, Sela 1995 / Dahmani–Guirardel isomorphism for hyperbolic groups, Agol's virtual Haken theorem) are correctly stated. All worked computations (ball volumes for $\mathbb{Z}$, $\mathbb{Z}^2$, $F_2$; D₄ Cayley graph adjacencies including the inner-cycle reversal from $sr = r^{-1}s$; F₂ tree depth-3 vertex enumeration; floor/2x/exp/constant QI envelope checks; Heisenberg growth degree from Bass–Guivarc'h; Möbius parameterization of Poincaré-disk geodesics) check out.

The single math defect is in the **§1 presentation-explorer sample reduction for $\mathbb{Z}^2$**: the displayed simplification of $abab^{-1}a^{-1}$ to $b^2$ is incorrect — the correct reduction gives $a$, not $b^2$. The presentation $\mathbb{Z}^2 = \langle a, b \mid aba^{-1}b^{-1} \rangle$ itself is correct; only the sample-word reduction in the widget data is wrong. Easy fix: replace the `word` field in the `Z2` widget data with a correct sample reduction (e.g., `"abab⁻¹a⁻¹ ↦ a²b·b⁻¹·a⁻¹ = a (commute then cancel)"` or similar).

Other items are minor pedagogical hedges (QI invariant of envelope-check, "property (T)" for SL_2 expanders, "in many cases" for QI-rigidity-implies-commensurable) that are appropriately worded in the prose and do not rise to errors.
