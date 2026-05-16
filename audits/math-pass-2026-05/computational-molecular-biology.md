# computational-molecular-biology — math correctness pass (2026-05)

Page: `computational-molecular-biology.html`. Spot-checked all formulas, recurrences, and worked numerics in §§ 1–7.

## Verified claims

- **§1 Sequence alignment.** NW recurrence and boundary conditions $H_{i,0}=-ig$, $H_{0,j}=-jg$ are standard; Smith–Waterman variant (clamp to 0, answer at $\max_{i,j}H_{ij}$) correct. Traceback length is at most $n+m$, so $O(n+m)$ extra time after fill is right. Worked example `GATTACA` vs `GCATGCU` with match $+1$ / mismatch $-1$ / gap $-1$ verified to score $0$ by independent DP. Affine gap form $g(k)=\alpha+\beta(k-1)$ and Gotoh's three-layer recurrence ($M, I_x, I_y$) are correct. BLOSUM62 log-odds form $s(a,b)=\tfrac{1}{\lambda}\log(p_{ab}/(q_a q_b))$ and diagonal range $\{4,\dots,11\}$ verified against the published matrix.
- **§2 BWT / FM-index.** LF formula $\mathrm{LF}(i) = C[L[i]] + \mathrm{rank}_{L[i]}(i)$ with $\mathrm{rank}_c(i)$ counting $c$ in $L[0..i)$ and $C[c]$ counting strictly-less-than-$c$ characters is the standard Ferragina–Manzini definition. Backward search at $\Theta(m)$ per query is correct. Widget's `C[c] = F.indexOf(c)` is consistent (first-occurrence index in sorted $F$ equals count of strictly smaller letters).
- **§3 HMM.** Viterbi $\delta_t(z)=\max_{z'}\delta_{t-1}(z')\,a_{z'z}\,e_z(x_t)$, forward/backward $\alpha_t,\beta_t$, and Baum–Welch (E-step = forward–backward, M-step = closed-form re-estimation) all standard. $\Theta(TK^2)$ complexity correct. Widget log-emissions $\log(\text{eH or 1−eH})/2)$ correctly implement the prescribed split-emission model.
- **§4 Phylogeny.** Felsenstein pruning recurrence and root marginalisation $\sum_s \pi(s)L_{\mathrm{root}}(s)$ are correct. Jukes–Cantor transition probs $P_{ii}(t)=\tfrac14+\tfrac34 e^{-4t/3}$, $P_{ij}(t)=\tfrac14-\tfrac14 e^{-4t/3}$ checked: $P_{ii}+3P_{ij}=1$. JC distance $d=-\tfrac34\ln(1-\tfrac43 p)$ is the standard inversion. NJ statistical consistency, ML topology search NP-hardness, and BHV CAT(0) cubical structure are correct attributions. Widget's `combine()` correctly implements $\sum_t P_{st}(\ell)L_{\text{child}}(t)$.
- **§5 Coalescent.** $T_k\sim \mathrm{Exp}(\binom{k}{2}/(2N_e))$ (diploid, in generations) and $\mathbb{E}[T_{\mathrm{MRCA}}]=\sum_{k=2}^n 2/(k(k-1)) = 2(1-1/n)$ in units of $2N_e$ generations verified numerically. Mutation count $S\mid\ell\sim\mathrm{Poisson}(\mu\ell)$, $\mathbb{E}[\xi_i]=\theta/i$ (unfolded SFS, infinite-sites neutral), Watterson $\hat\theta_W=S/H_{n-1}$, and Tajima $D$ sign interpretation all correct.
- **§6 RNA.** Nussinov recurrence and $O(n^3)/O(n^2)$ complexity correct. McCaskill partition $Z=\sum_S e^{-E(S)/RT}$ and pair-probability $P_{ij}=Z^{-1}\sum_{S\ni(i,j)}e^{-E(S)/RT}$ correct. Pseudoknot NP-hardness (Akutsu/Lyngsø–Pedersen) correct. Watson–Crick + GU wobble pair set correct.
- **§7 Protein contacts.** Potts model $P\propto\exp(\sum h_i(x_i)+\sum_{i<j}J_{ij}(x_i,x_j))$ correct. Frobenius-norm scoring of $J_{ij}$ standard. MI vs DCA chain-artefact intuition correct.

## Wrong / dubious claims

- **`computational-molecular-biology.html:403`** — "Naive substring search is $O(n+m)$ per query." Wrong: naive (compare-shift) is $O(nm)$; the $O(n+m)$ figure is KMP / Boyer–Moore, not naive. Either replace "naive" with "linear-time string matching" or change the bound to $O(nm)$.
- **`computational-molecular-biology.html:663`** — HKY row "$5$ free" parameters. Standard count is 4 (κ plus 3 free base frequencies, with overall rate normalised). Some textbooks count the overall rate to get 5; with the rate-1 normalisation the page implicitly uses elsewhere (branch lengths in expected substitutions per site), 4 is the right number. Mild — convention-dependent.

## Underspecified or unverifiable claims

- **§4 prompt mentions Tamura–Nei**, but the page's substitution-model table lists JC / K2P / HKY only. Not an error — just a coverage gap relative to the audit prompt.
- **§5 Tajima $D$**: denominator written as "$\mathrm{sd}$"; the actual variance estimator (Tajima 1989, eqs. 31–37) is omitted. Acceptable shorthand at the abstraction level used.
- **§7 numerics** ("typical globular protein has $\sim 4L$ contacts", "top-$L$ DCA $\sim 60{-}80\%$") are order-of-magnitude figures consistent with the literature; not precisely verifiable as stated.

## Severity

**Minor.** One genuine technical error (naive-substring complexity at line 403) and one convention-dependent slip (HKY parameter count at line 663). Every recurrence, transition matrix, and worked numeric checked against an independent computation matches.
