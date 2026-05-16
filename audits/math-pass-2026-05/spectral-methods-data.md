# Math correctness audit — `spectral-methods-data.html`

Page covers SVD/Eckart–Young, PCA, graph Laplacian, spectral clustering + Cheeger, PageRank, randomized SVD + JL, Nyström. **Does not cover t-SNE or UMAP** — absence is not an error, just noting scope.

## Verified claims

- **§1 SVD** (lines 350–356, 360–364): factorization $A = U\Sigma V^T$, derivation via eigendecomp of $A^TA$, $u_i = Av_i/\sigma_i$, range/kernel read-off, Eckart–Young Frobenius identity $\|A-A_k\|_F^2 = \sum_{i>k}\sigma_i^2$, operator-2-norm minimum $= \sigma_{k+1}$, complexity $O(\min(mn^2, m^2n))$ (line 471) — all correct.
- **§2 PCA** (lines 495–503): centering, SVD of $\tilde X$, principal directions $= v_1,\dots,v_k$, projection $\tilde X V_{:,1:k} = U_{:,1:k}\Sigma_{1:k}$, variance per component $\sigma_j^2/n$ (consistent with the page's $S=\tfrac1n \tilde X^T\tilde X$ convention) — correct.
- **§3 Laplacian** (lines 623–635): $L=D-A$ PSD, Dirichlet form $f^TLf = \sum w_{ij}(f_i-f_j)^2$, $\dim\ker L =$ #components, $L_{\mathrm{sym}}$ spectrum $\subseteq[0,2]$ with 2 hit iff bipartite component, $L_{\mathrm{rw}}$ similar to $L_{\mathrm{sym}}$ — all correct.
- **§4 Cheeger** (lines 792–796): $\lambda_2/2 \le h(G) \le \sqrt{2\lambda_2}$ for $L_{\mathrm{sym}}$, conductance definition with $\min(\mathrm{vol})$ denominator — correct. NJW algorithm steps including row-normalization onto $S^{k-1}$ — correct.
- **§5 PageRank** (lines 923–931): column-stochastic $P_{ij} = A_{ji}/d^{\mathrm{out}}_j$ with sink-uniform fix, fixed-point $r = \alpha Pr + (1-\alpha)\mathbf{1}/n$, Google matrix $G_\alpha$, irreducibility/aperiodicity → unique positive stationary by Perron–Frobenius, second eigenvalue of $G_\alpha$ at most $\alpha$ (Haveliwala–Kamvar 2003), $\sim 50$ iters for $10^{-6}$ at $\alpha=0.85$ — correct.
- **§6 Randomized SVD** (lines 1063–1072): HMT algorithm steps, expected Frobenius bound $\mathbb{E}\,\|A-QQ^TA\|_F^2 \le (1 + k/(p-1))\sum_{i>k}\sigma_i^2$ (HMT 2011 Thm 10.5) — correct.
- **§6 JL** (lines 1076–1080): $k\ge 8\log n/\varepsilon^2$, $\Pi$ with i.i.d. $\mathcal N(0,1/k)$ entries, success probability $\ge 1-1/n$ (in fact better via union bound), $k$ independent of $d$ — correct.
- **§7 Nyström** (lines 1187–1197): formula $\tilde K = K_{nm}K_{mm}^+ K_{nm}^T$, leverage-score sample complexity $m=O(k\log k/\varepsilon^2)$ — correct.

## Wrong / dubious claims

- **`spectral-methods-data.html:796`** — "the spectral sweep cut is a **constant-factor** approximation algorithm for sparsest cut." **Wrong.** The sweep produces a cut of conductance $\le \sqrt{2\lambda_2} \le 2\sqrt{h}$, so the approximation ratio is $O(1/\sqrt{h_{\mathrm{OPT}}})$ — a *quadratic* (not constant-factor) approximation. Constant-factor / $O(\log n)$ approximations require LP/SDP rounding (Leighton–Rao, ARV). Fix: replace with "quadratic approximation" or "$O(\sqrt{h_{\mathrm{OPT}}})$ approximation".
- **`spectral-methods-data.html:790`** — "drop the constraint that the partition vector be $\pm 1$" oversimplifies. For NCut the discrete indicator is volume-weighted ($f_i \in \{\sqrt{\mathrm{vol}(\bar S)/\mathrm{vol}(S)}, -\sqrt{\mathrm{vol}(S)/\mathrm{vol}(\bar S)}\}$), not $\pm 1$; the $\pm 1$ description fits RatioCut + unnormalized $L$, not normalized cut + $L_{\mathrm{sym}}$. Minor but the section is explicitly about $L_{\mathrm{sym}}$.

## Underspecified or unverifiable claims

- **`spectral-methods-data.html:364`** — "best one in any unitarily invariant norm" is **Mirsky's theorem** (1960) extending Eckart–Young (which is the Frobenius/2-norm case). Conventional to call the combined statement "Eckart–Young–Mirsky"; calling it just "Eckart–Young" is widespread and not wrong, but attribution-thin.
- **`spectral-methods-data.html:1195`** — Nyström extension formula $\tilde u_\ell = \tfrac{1}{\lambda_\ell}K_{nm}u_\ell^{(m)}$ is correct as the eigenvector of $\tilde K$, but the eigenvalues of $\tilde K$ recover those of $K$ only after an implicit $n/m$ scaling (or via the symmetric $K_{mm}^{1/2}$ formulation). Worth a clause.
- **`spectral-methods-data.html:835`** — widget JS computes $L_{\mathrm{sym}}$ but the surrounding section §3 prose introduces $L = D - A$ first; readout text "bottom eigenvectors of $L$" elsewhere conflates the two. Cosmetic.

## Severity

**Minor** — single moderate inaccuracy (sweep cut ≠ constant-factor) and one loose relaxation description; everything else (SVD, PCA, Cheeger constants, PageRank spectral gap, HMT bound, JL constants, Nyström formula) checks out.
