# Math-correctness audit — combinatorial-optimization

Audited: `combinatorial-optimization.html` (1361 lines, 7 widgets, 7 concepts).
Scope: math-correctness only — pedagogy, prose tone, and ergonomics out of scope.

## Verified claims

- **§1 Fundamental theorem of LP** (line 273) — finite optimum attained at a vertex of $P$. Correct.
- **§1 Klee–Minty (1972) + Spielman–Teng (2004)** (line 279) — dates and statements correct.
- **§1 Polytope widget** (lines 295–407) — feasibility test, vertex enumeration via pairwise intersection, indifference-line plot all consistent. CCW sort about centroid is fine for a convex polygon.
- **§2 Toy LP** (lines 472–479) — primal max $4x_1+3x_2$ s.t. $2x_1+x_2\le 8,\ x_1+2x_2\le 7$. Verified $x^*=(3,2)$ gives obj $=18$, both constraints tight; $y^*=(5/3,2/3)$ satisfies $2y_1+y_2=4$, $y_1+2y_2=3$, $b^\top y=18$. Strong duality holds with gap zero — widget correctly displays this.
- **§2 Strong duality (von Neumann, 1947)** (line 435) — date and statement correct; "convex programs can have positive duality gap in general" caveat is accurate.
- **§2 Min–max table** (lines 439–447) — König–Egerváry, max-flow / min-cut (Ford–Fulkerson / Menger), von Neumann minimax, Menger edge form: all correctly attributed and stated.
- **§3 Max-flow / min-cut** (line 573) — Ford–Fulkerson 1956 attribution and theorem statement correct.
- **§3 Edmonds–Karp $O(|V||E|^2)$** (line 579) — bound and "first strongly-polynomial max-flow" claim correct.
- **§3 Flow widget post-fix (commit c9b166a6)** — verified `augment()` and `minCut()` now use `p.dir<0` per-step (not the broken `r.dir!==undefined && p.dir<0` conjunction). Reverse-edge augmentations now subtract correctly. `minCut()` cap-trip surfaces a loud warning and returns early instead of silently asserting optimality. `flowVal()` correctly sums `s`-outgoing flow (no `s`-incoming edges in the fixed graph). Cut-edge enumeration $\{e : u\in S, v\in T\}$ is the standard min-cut definition. **Fix is sound.**
- **§4 Berge's lemma + König–Egerváry** (lines 738–740) — correctly stated; bipartite-matching reduction to unit-capacity max-flow correctly described.
- **§4 Hungarian algorithm $O(n^3)$ (Kuhn, 1955)** (line 742) — modern $O(n^3)$ implementation; date attribution standard.
- **§4 Edmonds blossom (1965)** (line 744) — correct.
- **§5 Hoffman–Kruskal (1956)** (line 936) — TU implies integer vertices statement is the correct theorem.
- **§5 TU examples** (lines 939–943) — bipartite incidence, signed network incidence, consecutive-ones / interval matrices: all standard TU classes. Ghouila-Houri characterisation (line 945) correctly stated as a row-subset $\pm 1$ sign condition.
- **§5 TU widget audit** — odd cycle $C_3$ incidence has $\det=\pm 2$ (verified: $\det\begin{pmatrix}1&1&0\\1&0&1\\0&1&1\end{pmatrix}=-2$); generic $\pm 1$ matrix has $\det=\pm 4$. Correct witnesses.
- **§6 Edmonds matching polytope** (lines 1089–1091) — degree + odd-set inequalities $\sum_{e\subseteq S} x_e \le (|S|-1)/2$ for odd $S$. For $|S|=5$ this gives $2 = \lfloor 5/2\rfloor$. Correct.
- **§6 Grötschel–Lovász–Schrijver 1981** (line 1093) — separation $\Leftrightarrow$ optimization; date and statement correct.
- **§6 Khachiyan 1979** (line 1093) — ellipsoid for LP; correct.
- **§6 $C_5$ relaxation widget** — fractional $x_e=1/2$ on each of 5 edges, $\sum x_e=5/2$, integer max matching $=2$. Verified.
- **§7 Vertex-cover 2-approx + Khot–Regev 2008 UGC tightness** (line 1219) — argument correct (every edge has an endpoint $\ge 1/2$, cost at most doubles); UGC-tightness attribution correct.
- **§7 Set cover $H_n$, Johnson 1974, Raghavan–Thompson 1987** (line 1221) — dates and approximation ratio correct.
- **§7 Goemans–Williamson, $\alpha_{GW}\approx 0.878567$** (line 1223) — value correct ($\min_{\theta\in(0,\pi)} \frac{2\theta}{\pi(1-\cos\theta)}\approx 0.87856$). UGC-tightness for max-cut also correct.
- **§7 vertex-cover instances** — triangle LP $=3/2$, IP $=2$; $C_4$ bipartite LP $=$ IP $=2$; 5-cycle ("Petersen fragment") LP $=5/2$, IP $=3$. All numerically correct.

## Wrong / dubious claims

- **`combinatorial-optimization.html:1262`** — instance is labeled `petersen: ... 'Petersen graph fragment'` but the actual graph rendered is just a 5-cycle (edges `1-2, 2-3, 3-4, 4-5, 5-1`). Petersen's defining feature is the 5-cycle plus inner pentagram plus matching (10 vertices, 3-regular). Calling a bare $C_5$ a "Petersen fragment" is loose — $C_5$ is a subgraph of Petersen, but so is every short cycle. The numerical claims (LP $=5/2$, IP $=3$) are correct *for $C_5$*, not for Petersen itself (Petersen's vertex cover is 6, max matching 5). **Severity: minor** — labeling/pedagogy, not a math error.
- **`combinatorial-optimization.html:932`** — "the reduction from 3-SAT through subset-sum is one of Karp's original 21." Karp's 21 lists 0-1 INTEGER PROGRAMMING directly (reduced from SAT-style covering, not via SUBSET-SUM/KNAPSACK which is a separate entry). The phrase "through subset-sum" misroutes the reduction chain. **Severity: minor** — historical-reduction wording, not a math error.

## Underspecified or unverifiable claims

- **§3 LP-duality framing of max-flow / min-cut** (line 575) — "the constraint matrix (incidence + capacity) is totally unimodular." This is true for the *node-arc* formulation's incidence block, but the capacity-bound block adds an identity, and the augmented system $\begin{pmatrix}B\\I\end{pmatrix}$ is TU iff $B$ is — which the page doesn't explain. Defensible but compressed. Not wrong.
- **§7 SDP rounding probability** (line 1223) — "the probability $(u,v)$ is cut is $\theta(u,v)/\pi$." This is the correct unit-vector projection probability under a Gaussian hyperplane; standard but stated without derivation. Not wrong.
- The page **does not cover** transportation, assignment beyond the Hungarian one-liner, knapsack, TSP, interior-point methods, or submodular optimization in any depth. None are claimed to be covered, so this is a scope choice rather than an error.

## Severity

**Clean** with two minor labeling/historical nits (Petersen-fragment misnomer at line 1262; Karp-21 reduction phrasing at line 932). No math errors, no incorrect attributions, no widget computations that disagree with the prose. The c9b166a6 patch to `augment()` / `minCut()` / `showCover()` is mathematically sound and correctly addresses the silent reverse-edge bug.
