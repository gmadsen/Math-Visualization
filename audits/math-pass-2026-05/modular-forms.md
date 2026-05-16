# Math correctness audit — `modular-forms.html`

## Verified claims

**§2 SL_2(Z) and generators (lines 264–275).** Definition correct; PSL_2(Z) action correct; $S$, $T$ generators correct; relations $S^2=-I$, $(ST)^3=-I$ in SL_2(Z) and $S^2=1$, $(ST)^3=1$ in PSL_2(Z) correct.

**§3 Fundamental domain (lines 432–556).** Region $\{|\mathrm{Re}\,\tau|\le 1/2,\ |\tau|\ge 1\}$ correct; hyperbolic area $\pi/3$ correct; stabilizer orders at $i$ (order 2) and $\rho=e^{2\pi i/3}$ (order 3) correct (in PSL_2(Z)); cusp stabilizer $\langle T\rangle$ correct; $X(1)$ has genus 0 correct.

**§4 Modular form definition (lines 559–571).** Transformation law, holomorphy at cusp, $-I$ argument forcing odd $k$ trivial, $T$-invariance giving Fourier expansion in $q=e^{2\pi i\tau}$ — all correct. Geometric reading as section of $(T^*\mathcal{H})^{\otimes k/2}$ correct.

**§5 E_k Fourier coefficients (lines 700–712).** Constants $-2k/B_k$ verified: $B_4=-1/30\Rightarrow 240$; $B_6=1/42\Rightarrow -504$; $B_8=-1/30\Rightarrow 480$; $B_{10}=5/66\Rightarrow -264$; $B_{12}=-691/2730\Rightarrow 65520/691$. All Fourier coefficients in the table match $-(2k/B_k)\sigma_{k-1}(n)$:
- E_4: 240·(1, 9, 28, 73, 126, …) = 240, 2160, 6720, 17520, 30240 ✓
- E_6: −504·(1, 33, 244, 1057, 3126, …) = −504, −16632, −122976, −532728, −1575504 ✓
- E_8: 480·(1, 129, 2188, 16513, …) = 480, 61920, 1050240, 7926240 ✓
- E_10: −264·σ_9(2)=−264·513 = −135432 ✓

**§6 Δ and j (lines 829–838).** $\Delta=(E_4^3-E_6^2)/1728$, weight 12, simple zero at cusp, no zeros on $\mathcal{H}$ — all correct. Product expansion $q\prod(1-q^n)^{24}$ correct. τ values 1, −24, 252 correct. $j=E_4^3/\Delta$ has weight 0, simple pole at cusp ✓. q-expansion $1/q+744+196884q+21493760q^2+\cdots$ correct (next term 864299970q^3 used in widget — also correct). Bijection $\mathcal{H}/\mathrm{SL}_2(\mathbb{Z})\to\mathbb{C}$ and $X(1)\cong\mathbb{P}^1$ standard. Monster connection 196884 = 196883 + 1 correct.

**§7 Dimension formula (lines 977–1052).** `dimMk` implements $\lfloor k/12\rfloor + 1$ except $\lfloor k/12\rfloor$ when $k\equiv 2\pmod{12}$ — standard Serre formula. Specific dims (k=0,2,4,6,8,10,12) → (1,0,1,1,1,1,2) verified. Bullet list of dim-1 weights {0,4,6,8,10,14} and basis elements (incl. $E_8=E_4^2$, $E_{10}=E_4 E_6$, $E_{14}=E_4^2 E_6$) correct. $\dim M_{12}=2$ basis $\{E_{12},\Delta\}$ correct. Structure theorem $M_*=\mathbb{C}[E_4,E_6]$ and $S_k\cong M_{k-12}$ via $\Delta$-multiplication correct.

**§8 Identity widget (lines 1062–1115).** Coefficient arrays for E_4, E_6, Δ verified against OEIS (A004009, A013973, A000594). Polynomial identity $E_4^3-E_6^2=1728\Delta$ correct.

**§8 Hecke operators (lines 1118–1122).** Formula $(T_p f)(\tau)=\sum(a_{pn}+p^{k-1}a_{n/p})q^n$ correct (standard). Eigenvalue of $T_p$ on $\Delta$ equals $\tau(p)$ correct (since $S_{12}$ is one-dimensional). Multiplicativity and recursion $\tau(p^{r+1})=\tau(p)\tau(p^r)-p^{11}\tau(p^{r-1})$ correct (weight 12 ⇒ $p^{k-1}=p^{11}$).

**§9 Petersson inner product (lines 1152–1167).** Integrand $f\bar g\,y^{k-2}\,dx\,dy$ correct ($|f|^2 y^k$ invariant times invariant measure $y^{-2}dx\,dy$). Cusp-form decay $|f|\ll e^{-2\pi y}$ correct, convergence argument correct. Self-adjointness of $T_n$ for $(n,N)=1$ and resulting orthogonal eigenform basis correct. $M_k=S_k\oplus E_k$ (Petersson-orthogonal direct sum) correct.

## Wrong / dubious claims

**modular-forms.html:693 — Eisenstein series normalization.** The page writes
$$E_k(\tau)=\tfrac12\sum_{(m,n)\ne(0,0)}(m\tau+n)^{-k}$$
and then asserts (line 700) the "standard normalization where the constant term is 1." With the displayed prefactor $1/2$, the constant term as $\mathrm{Im}\,\tau\to\infty$ is $\frac12\cdot 2\zeta(k)=\zeta(k)$, not 1. The normalized $E_k$ with constant term 1 needs prefactor $1/(2\zeta(k))$, equivalently $E_k = G_k/(2\zeta(k))$ where $G_k$ is the unnormalized Eisenstein series. The Fourier table that follows (line 706+) does correspond to the normalized $E_k$, so the table is fine but the displayed formula is off by a factor of $\zeta(k)$. The parenthetical "(half is for normalization — $(m,n)$ and $(-m,-n)$ give the same term)" is also slightly muddled: the factor of $1/2$ folds in the $\pm$-pair redundancy, but that gives unnormalized $G_k/2$, not the constant-term-1 form.

## Underspecified or unverifiable claims

- Line 697 sketches the transformation argument as "a direct computation"; the substitution shown ($m(\gamma\tau)+n=(c\tau+d)^{-1}(m'\tau+n')$) is misstated — the standard manipulation is $m\gamma\tau+n=(c\tau+d)^{-1}((ma+nc)\tau+(mb+nd))$, i.e. the prefactor is $(c\tau+d)^{-1}$ outside, but the relabeled indices come from $(m,n)\mapsto(m,n)\gamma$, not $\gamma^{-1}$. The end result $E_k(\gamma\tau)=(c\tau+d)^k E_k(\tau)$ is correct; the index-substitution direction stated is sloppy but not load-bearing.
- Higher-level forms ($\Gamma_0(N)$, $\Gamma_1(N)$) are mentioned only as forward pointers in §8's "Where this page ends" (lines 1126–1133) — no specific claims to verify.
- Petersson "near the cusp $|f|\ll e^{-2\pi y}$" is the leading-order decay; finer statement is $f=O(e^{-2\pi y})$ uniformly in $x$. Stated correctly but informally.

## Severity

**Minor.** One genuine normalization slip (Eisenstein-series prefactor missing $1/\zeta(k)$, line 693) and one sloppy-but-non-load-bearing index substitution (line 697). Every numerical claim, every dimension, every q-expansion coefficient, the Hecke recursion, and the Petersson invariance argument check out. Fix the prefactor to $1/(2\zeta(k))$ (or change the surrounding prose to call $G_k$ unnormalized and switch to $E_k = G_k/(2\zeta(k))$ before stating the q-expansion) and the page is clean.
