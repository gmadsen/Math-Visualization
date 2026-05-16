# Math-correctness audit — `matroid-theory.html`

## Verified claims

**§1 Independence axioms (lines 266–272).** (I1) `∅ ∈ ℐ`, (I2) hereditary, (I3) augmentation/exchange — the standard Whitney 1935 formulation. The two motivating examples (vector matroid via Steinitz, graphic matroid via the forest-component-count argument on line 278) are stated correctly. The widget's `runCheck` correctly tests all three axioms by brute force.

**§2 Bases & rank (lines 421–435).** Basis = max independent; all bases equicardinal (corollary of I3); rank function `r(S) = max{|I| : I ⊆ S, I ∈ ℐ}`. Basis-exchange axiom (symmetric "swap one in, one out") and rank-axiom system (R1) `0 ≤ r(S) ≤ |S|`, (R2) monotone, (R3) submodular `r(S∪T) + r(S∩T) ≤ r(S) + r(T)` are the standard cryptomorphic equivalents. The integer-rank reconstruction `ℐ = {S : r(S) = |S|}` is correct.

**§3 Examples (lines 583–605).** `U_{r,n}` independent ↔ `|S| ≤ r`, `r(S) = min(|S|, r)` — correct. `M(K_4)` has 16 spanning trees (Cayley `n^(n−2) = 4² = 16`) — correct. Graphic-matroid rank `|V| − c` — correct. The `M(K_4)` vector-realisation via differences `e_i − e_j` of basis vectors (line 607) is the standard `A_3`-root construction; resulting matroid is regular (representable over every field) — correct. Tutte's binary excluded-minor characterisation (`M` binary ⇔ `U_{2,4}` not a minor) attributed to Tutte 1958 — correct. Vámos matroid on 8 elements is the smallest non-representable — correct.

**§4 Closure & flats (lines 725–740).** Closure `cl(S) = {e : r(S∪e) = r(S)}`; flat = closed set; (C1)–(C4) closure axioms with Mac Lane–Steinitz (C4) as the matroid content — correct, and (C1)–(C4) characterise matroids. Geometric-lattice properties (graded by rank, atomistic for simple matroids, semimodular `r(F∨G) + r(F∧G) ≤ r(F) + r(G)`) and Birkhoff 1935 correspondence with simple matroids — correct.

**§4 widget — flats of `M(K_4)`.** Programmatic enumeration is correct: 1 rank-0 flat (`∅`), 6 rank-1 flats (singletons), 7 rank-2 flats (4 triangles + 3 perfect matchings of `K_4`), 1 rank-3 flat (`E`).

**§5 Duality (lines 854–866).** `B(M*) = {E\B : B ∈ B(M)}`, involutive, dual rank `r_{M*}(S) = |S| − r(M) + r(E\S)`, `r(M) + r(M*) = |E|` — all standard and correct. `U_{r,n}* = U_{n−r,n}` (so `U_{2,4}` self-dual, `r(M)+r(M*)=4=|E|` checked in widget) — correct. Whitney 1932 planarity criterion: `G` planar ⇔ `M(G)*` is graphic, with `M(G)* = M(G*)` for the planar dual — correct.

**§5 widget — `K_4 − e`.** 4 vertices, 5 edges, rank 3, 8 spanning trees — correct (each edge of `K_4` lies in `16·3/6 = 8` spanning trees, so `K_4` minus an edge has `16−8=8`).

**§6 Greedy (lines 1003–1016).** Algorithm pseudocode and Kruskal-as-graphic-greedy identification — correct. Rado–Edmonds theorem (greedy optimal for every weight ⇔ matroid) attributed to Rado 1957 / Edmonds 1971 — correct. Matroid intersection in P (Edmonds 1970), bipartite matching = (partition ∩ partition), three-matroid intersection NP-hard — all correct.

**§7 Tutte polynomial (lines 1171–1197).** Corank–nullity defn `T_M(x,y) = Σ_S (x−1)^{r(E)−r(S)}(y−1)^{|S|−r(S)}`, integrality / non-negativity (Tutte 1947), deletion–contraction with loop/coloop boundary cases `T_M = y·T_{M\e}` (loop), `T_M = x·T_{M/e}` (coloop) — all correct. Specialisations table:
- `T_M(1,1) = #bases`, `T_M(2,1) = #independent sets`, `T_M(1,2) = #spanning sets`, `T_M(2,2) = 2^{|E|}` — all correct.
- Chromatic `P_G(k) = (−1)^{r(M)} k^{c(G)} T_{M(G)}(1−k, 0)` — correct (standard Whitney/Tutte formula).
- Flow polynomial `(−1)^{|E|−r(M)} T_{M(G)}(0, 1−k)` — correct.
- Duality `T_M(x,y) = T_{M*}(y,x)`, Whitney rank polynomial `R_M(u,v) = T_M(u+1,v+1)` — correct.

**§7 widget arithmetic.** Tutte coefficients computed correctly by direct subset sum; `c(G) = |V| − r` recovery for the chromatic specialisation — correct.

## Wrong / dubious claims

- **Stale code comment (line 408).** The "load broken example" comment says *"hereditary holds, but exchange fails"*, but the loaded family `{∅,{a},{b},{c},{d},{a,b},{a,b,c}}` actually fails **(I2) hereditary** (`{a,c} ⊂ {a,b,c}` is missing). The widget's runtime output correctly reports the (I2) failure, so the user-visible claim is right; only the source comment is wrong. Cosmetic.

## Underspecified or unverifiable claims

- **§4 atomistic phrasing (line 740).** "Rank-1 flats … are the singletons or 'points'." Strictly true only after restricting to simple matroids (no loops, no parallel elements), which the immediately following clause does. Borderline — reads as if "singletons" applies in general. Mild rewording would help.
- **§3 transversal row (line 603).** Citing "König's theorem" as the example column for transversal matroids is loose — Hall's marriage theorem (mentioned line 595) is the correct existence theorem; König relates max bipartite matching to min vertex cover, which is adjacent but not the rank computation. Not wrong, just loose.
- **§6 Rado–Edmonds proof sketch (line 1014).** "Apply (I3) to extend `I_{<i}` from `J_{<i+1}` … you discover `w(e_{i_t}) ≥ w(e_{j_t})` for every `t`." This is a correct sketch of the standard exchange-chain argument, but the indexing is compressed enough that a reader reconstructing it has to fill gaps. Pedagogical, not mathematical.

## Severity

**Clean.** No mathematical errors. The Whitney 1935 / Tutte 1958 / Edmonds 1970–71 / Rado 1957 / Birkhoff 1935 attributions check out, all axiom systems and cryptomorphisms are stated correctly, the Tutte specialisations and signs are right, the duality formulas and the `U_{r,n}* = U_{n−r,n}` / planarity / graphic-regular facts are all correct. The widgets compute their reported values from first principles and agree with the prose. Only blemish is a single stale `// hereditary holds` source-code comment in the `axioms-bad` button (line 408) that contradicts what the family actually does — invisible to readers.
