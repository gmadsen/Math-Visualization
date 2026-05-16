# Math-correctness audit — `spectral-graph-theory.html`

## Verified claims

**§1 Adjacency / Laplacian basics.** `L = D − A` definition, symmetry, PSD with energy form `f^T L f = ½ Σ_{{i,j}∈E}(f(i)−f(j))²`, kernel contains **1**, spectrum `0 = λ_1 ≤ … ≤ λ_n` — all standard and stated correctly (lines 318–331).

**§1 spectra table — partial (line 338–340).**
- `K_n` Laplacian `{0, n^(n−1)}` and adjacency `{n−1, (−1)^(n−1)}`: correct (`L = nI − J`, `A = J − I`).
- `C_n` Laplacian `2−2cos(2πk/n)` and adjacency `2cos(2πk/n)` for `k=0,…,n−1`: correct (circulant DFT eigenvectors).
- `P_n` Laplacian `2−2cos(πk/n)`, `k=0,…,n−1`: correct.

**§2 Kernel = #components.** Theorem statement and proof via the energy form (lines 545–547) are correct and standard.

**§3 Algebraic-connectivity table (lines 677–681).** All four computable rows verified: `K_n → n`, `C_n → 2−2cos(2π/n)`, `P_n → 2−2cos(π/n)`, star `S_n` on `n+1` vertices → `1` (Laplacian spectrum is `{0, 1^(n−1), n+1}`). Ramanujan lower bound `λ_2(L) ≥ d − 2√(d−1)` for `d`-regular Ramanujan: correct (this is `d − λ_2(A)` with `λ_2(A) ≤ 2√(d−1)`).

**§4 Cheeger.** Edge-expansion definition (line 820), NP-hardness, and the `d`-regular form `λ_2/2 ≤ h(G) ≤ √(2 d λ_2)` (line 826) are the correct Alon–Milman form for the **combinatorial** `L` on `d`-regular graphs. Continuous Cheeger reference `λ_2(−Δ) ≥ h(M)²/4` is the correct 1970 Cheeger original.

**§5 Random walks / normalised Laplacian.** `P = D⁻¹A`, `ℒ = I − D^{−1/2} A D^{−1/2}`, similarity `P ~ I − ℒ`, eigenvalues `1 − ν_k ∈ [−1,1]`, stationary `π_i = d_i/(2|E|)`, mixing-time bound `t_mix(ε) ≤ (1/γ) log(1/(π_min ε))`: all correct standard statements.

**§6 Bipartite criterion.** `ν_n = 2` iff bipartite (for connected `G`), eigenvector `D^{1/2}1_L − D^{1/2}1_R`: correct. Alon–Boppana lower bound `liminf λ_2(A) ≥ 2√(d−1)` and Ramanujan defn `|λ_2(A)| ≤ 2√(d−1)`: correct.

**§7 Spectral clustering.** Shi–Malik / Ng–Jordan–Weiss algorithm and the perturbation-from-disconnected-components heuristic are stated faithfully.

## Wrong / dubious claims

- **Path-`P_n` adjacency index range (line 340).** Table cell reads `2 cos(πk/(n+1))` with `k = 0,…,n−1` (range inherited from the same row's L cell). The correct index range is `k = 1,…,n`; at `k=0` the formula gives `2`, which is **not** an eigenvalue of `A(P_n)`. The eigenvalue *set* is right; the displayed index range is off by one. Suggested fix: split the cell so the path-adjacency row carries its own `k = 1,…,n`.

## Underspecified or unverifiable claims

- **Sweep-cut approximation factor (line 839).** "Within a factor `√(2d/λ_2)` of optimal." This is the constant that comes out of the Cheeger upper bound chain `h ≤ √(2d λ_2) ≤ √(2d/λ_2) · h` (using `h ≥ λ_2/2`), so `h_sweep ≤ √(2d/λ_2) · h(G)` is defensible — but the page gives no derivation and the precise constant depends on which Cheeger form one uses. Mild — phrase as "an `O(√(d/λ_2))`-approximation" or cite Mihail / Chung.
- **LPS construction (line 1152).** Statement attributes Ramanujan-graph construction to Cayley graphs of `PGL_2(F_p)`. LPS actually constructs them as quotients of Cayley graphs on `PGL_2(F_q)` / `PSL_2(F_q)` by a congruence subgroup, with the choice of `PGL` vs `PSL` depending on a Legendre-symbol condition. Minor simplification; not wrong but elides a real subtlety.
- **`§3 Courant–Fischer display (line 669).`** Cosmetic: writes `\frac{1}{1}\sum…(f(i)−f(j))²` — the `1/1` is a residual editing artifact (likely meant `½` or just removed). The statement is still correct because `f^T L f = ½ Σ(f(i)−f(j))²` and the constraint set is correct, but the rendered fraction is jarring.

## Severity

**Minor.** All major theorems (Cheeger, Alon–Boppana, Fiedler, kernel-counts-components, bipartite criterion, mixing) are stated and attributed correctly. The only outright error is a one-cell index-range slip on `P_n`'s adjacency eigenvalues; the rest is small phrasing/formatting (the `\frac{1}{1}` typo at line 669, the LPS group-choice elision, the implicit Cheeger-constant in §4's sweep-cut paragraph). Notably absent topics: spanning-tree count via Matrix-Tree (`(1/n)∏λ_i^≠0`), `K_{n,m}` spectrum, friendship theorem, EKR — these are not claimed on this page, so no claims to check.
