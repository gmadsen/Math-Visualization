# extremal-combinatorics.html — math-correctness audit

## Verified claims

**Turán's theorem (§1).** Statement `ex(n, K_{r+1}) = (1 − 1/r)·n²/2 − O(1)` and the extremal Turán graph `T(n,r)` (balanced complete r-partite, parts differ by ≤ 1) are correct (line 268). The implicit Mantel case `ex(n, K_3) = ⌊n²/4⌋` shown via `T(n,2)` in the table (line 399) is correct. Edge-count formula `e(T(n,r)) = C(n,2) − ΣC(|V_i|,2)` (line 273) is correct, as is the `r | n` simplification `(r−1)/r · n²/2`. Zykov-symmetrization proof sketch is the standard argument.

**Kővári–Sós–Turán (§2).** Bound `ex(n, K_{s,t}) ≤ ½(t−1)^{1/s}(n−s+1)·n^{1−1/s} + (s−1)/2 · n` (line 387) matches the canonical KST statement. Double-counting-cherries proof (line 391) is correct (Jensen on Σ C(deg(v),s) ≥ n·C(2m/n, s); each s-set ≤ t−1 common neighbours). Erdős–Rényi polarity construction giving `Θ(n^{3/2})` for `K_{2,2}`, Kollár–Rónyai–Szabó norm-graph for `K_{3,3}`, and the threshold `t ≥ (s−1)!+1` for the matching `n^{2−1/s}` lower bound are all correctly attributed (lines 401–403).

**Erdős–Stone–Simonovits (§3).** Statement `ex(n,H) = (1 − 1/(χ(H)−1))·n²/2 + o(n²)` and Turán density `π(H) = 1 − 1/(χ(H)−1)` (line 524) are correct, with correct dating (Erdős–Stone 1946, Erdős–Simonovits 1966).

**Ramsey (§4).** R(3,3)=6 (line 643), R(3,4)=9, R(3,5)=14, R(3,6)=18, R(4,4)=18 (line 644) all match Radziszowski's survey. Lower-bound construction via 5-cycle + complement and pigeonhole upper bound (line 652) are correct. Erdős's probabilistic lower bound `R(k,k) ≥ (1+o(1))·k/(e√2)·2^{k/2}` (line 655) is the Spencer-1975 form, correctly stated. Schur's theorem reduction `c({i,j}) := colour(|i−j|)` (line 658) is correct; monochromatic K_3 on a<b<c gives `(c−b)+(b−a)=(c−a)` same-coloured. Campos–Griffiths–Morris–Sahasrabudhe 2023 result `R(k,k) ≤ (4−ε)^k` (line 660) is correctly attributed. `R(3,ℓ) = Θ(ℓ²/log ℓ)` (Kim 1995) is correct.

**Sperner / LYM (§5).** `max antichain = C(n,⌊n/2⌋)` (line 798) and the odd-n caveat (both middle layers extremal) are correct. LYM inequality `Σ 1/C(n,|F|) ≤ 1` (line 803) and chain-counting proof (line 805) — `n!` chains, each F of size k lies on `k!(n−k)! = n!/C(n,k)` chains — correct. Bollobás set-pair: for `A_i ∩ B_i = ∅`, `A_i ∩ B_j ≠ ∅ (i≠j)`, `Σ 1/C(|A_i|+|B_i|, |A_i|) ≤ 1` (line 810) — correct.

**Triangle removal lemma + Szemerédi regularity (§6).** Standard statement (line 935) and tower bound `K(ε)` with Gowers's matching lower bound (1997) are correct.

## Wrong / dubious claims

**(line 645) `R(5,5) ≤ 46` — likely too tight.** Best published upper bound is **48** (Angeltveit–McKay 2017, "$R(5,5) \le 48$"). The Radziszowski "Small Ramsey Numbers" survey (current rev. 2024) lists `43 ≤ R(5,5) ≤ 48`, not 46. If the page intends a more recent bound it should cite it; otherwise change to 48.

**(line 646) `R(6,6) ≤ 161` — also too tight.** The standard cited upper bound (Radziszowski survey) is **165**; I'm not aware of a published 161 result. Either provide a citation or revert to `102 ≤ R(6,6) ≤ 165`.

**(line 941) Roth-via-removal "trivial triangles ($x=y=z$)" is mislabeled.** In the Ruzsa–Szemerédi/Solymosi tripartite construction, the edge-disjoint trivial triangles are NOT `x=y=z`. They are the triangles `(x, x+a, x+2a)` indexed by `(x, a) ∈ ℤ/N × A` — for any $a \in A$ each such triple satisfies all three edge conditions (`y−x=a`, `z−y=a`, `(z−x)/2=a`), giving `N·|A|` edge-disjoint triangles. The `x=y=z` set requires `0 ∈ A` and gives at most `N` degenerate triangles, not `|A|·N`. The count `|A|·N` is correct but the description is wrong.

## Underspecified or unverifiable claims

**(line 941) Roth construction needs $N$ odd / $\gcd(2,N)=1$.** The condition `(z−x)/2 ∈ A` requires 2 to be invertible in `ℤ/N`. Standard treatments assume $N$ prime or odd; the page omits this hypothesis.

**(line 948) "Roth, Szemerédi's theorem on long APs, the Green–Tao theorem on primes — all run on this loop."** Szemerédi's theorem on $k$-APs uses *hypergraph* regularity / removal (Gowers, Rödl–Skokan, Nagle–Rödl–Schacht–Skokan), not the graph regularity stated above. Green–Tao further uses a relative Szemerédi theorem. The claim is morally correct but conflates several distinct regularity frameworks.

## Out-of-scope topics requested by audit prompt

The prompt asks about the **sunflower lemma** and **Erdős–Ko–Rado** — neither appears on this page. The §5 title "Sperner's theorem & the LYM inequality" covers only antichain-size and the LYM/BLYM/Bollobás-set-pair complex. EKR (max intersecting `k`-family in `[n]` is `C(n−1,k−1)` for `n ≥ 2k`) and the sunflower lemma (Erdős–Rado 1960; bound recently improved by Alweiss–Lovett–Wu–Zhang 2020) are not discussed. Similarly, **hypergraph Turán problems** are not covered; only graph Turán.

## Severity

**minor.** The two Ramsey upper bounds (R(5,5)≤46 and R(6,6)≤161) are concrete numerical errors and should be fixed. The Roth "trivial triangles" mislabeling is a small expository error that doesn't break the argument's punchline. Everything else (Turán, KST, ESS, Sperner/LYM, removal lemma, regularity, R(3,3)=6, R(4,4)=18, Spencer's probabilistic bound, CGMS 2023) is correct.
