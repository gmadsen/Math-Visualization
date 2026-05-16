# Math-correctness audit: `coding-theory.html`

Reviewer date: 2026-05-14. Scope: every mathematical claim, including widget code paths.

## Verified claims (sections)

**§1 Distance & Singleton bound.** Definition of $d_H$, the detect/correct counts ($\le d-1$ / $\le \lfloor (d-1)/2\rfloor$), Singleton $d \le n-k+1$, and the puncturing argument are stated correctly. The widget's `vol(n,t)` computes $V_2(n,t)=\sum_{i=0}^t \binom{n}{i}$ correctly via the recurrence $\binom{n}{i+1}=\binom{n}{i}(n-i)/(i+1)$, and the Hamming bound display $|C|\le 2^n/V_2(n,t)$ is correct.

**§2 Linear codes.** $G=[I_k\mid A] \Rightarrow H=[-A^\top \mid I_{n-k}]$ is correct. Min-distance = min-weight = smallest number of $H$-columns that are linearly dependent — all correct. Syndrome $s=Hy^\top=He^\top$ and coset-leader decoding stated correctly. The widget's `H = [[1,0,1,1,0,0],[1,1,0,0,1,0],[0,1,1,0,0,1]]` has rank 3 (verified row-by-row) so it really is a $[6,3]$ code.

**§3 Hamming.** Family $[2^m-1,2^m-1-m,3]$ correct; $d=3$ argument (any two columns of $H$ independent, three can sum to $0$) correct; "perfect" claim with $2^k(1+n)\le 2^n$ correct; the index-binary trick correct. The $[7,4]$ widget's parity equations
$y_0=y_2\oplus y_4\oplus y_6$, $y_1=y_2\oplus y_5\oplus y_6$, $y_3=y_4\oplus y_5\oplus y_6$
match the rows of $H$ whose supports are $\{i:\text{bit}_j(i)=1\}$ for $j=0,1,2$ on positions $1..7$. Syndrome reads off as the binary index of the flipped bit — verified.

**§4 Reed–Solomon.** Definition via evaluation map, distance $d=n-k+1$, MDS, erasure-channel claim — all standard and correct. Voyager $[255,223,33]$: $n-k+1 = 33$ ✓; the 1986 RS upload (for Uranus encounter) is historically accurate. RM(1,m) self-dual "at the right parameters" — the hedge is fair (RM($r,m$) self-dual iff $2r+1=m$).

**§5 BCH.** Cyclic = ideal in $\mathbb{F}_q[x]/(x^n-1)$ ✓. BCH construction with $g(x)=\mathrm{lcm}(m_{\beta^1},\dots,m_{\beta^{\delta-1}})$ ✓. BCH bound $d\ge\delta$ ✓. Vandermonde-style proof sketch correct. RS as the no-extension case ($q^m=q$, so $m=1$ and minimal polynomials are linear) ✓. The widget computes cyclotomic cosets mod 15 over $\mathbb{F}_2$ correctly: $\{0\},\{1,2,4,8\},\{3,6,12,9\},\{5,10\},\{7,14,13,11\}$ — all five orbits of $i\mapsto 2i$ confirmed.

**§6 LDPC.** Tanner-graph definition correct; LLR sum-product update $L_{c\to v}=2\,\mathrm{atanh}\big(\prod_{v'\ne v}\tanh(L_{v'\to c}/2)\big)$ is the correct hyperbolic-tangent form of the check-node update. The widget's $H$ matrix is genuinely $(3,6)$-regular: every row sums to 6, every column to 3 (all 12 cols verified). Standards claims (DVB-S2 2003, WiFi, 5G NR data) accurate.

**§7 Lattices.** Lattice / $\lambda_1$ / packing radius $\lambda_1/2$ / center density $\delta=(\lambda_1/2)^n/\det\Lambda$ all standard. $E_8$: $\delta=1/16$ verified ($\lambda_1=\sqrt 2$, $\det=1$, $(\sqrt 2/2)^8=1/16$); kissing 240 ✓; Viazovska 2016 ✓. Leech kissing $196{,}560$ ✓; CKMRV 2017 ✓; $\mathrm{Aut}(\Lambda_{24})/\{\pm 1\}=\mathrm{Co}_1$ ✓. 2D maximum density $\pi/(2\sqrt 3)\approx 0.9069$ ✓ (Thue 1910). Extended Hamming $[8,4,4]\to E_8$ via Construction A ✓.

## Wrong / dubious claims (with file:line)

- **`coding-theory.html:1087` — "Hamming codes give the $D_n$ lattices."** This is incorrect. Construction A applied to the $[n,n-1,2]$ single-parity-check code (not the Hamming code) gives $D_n=\{x\in\mathbb Z^n:\sum x_i\equiv 0\bmod 2\}$. The Hamming code family $[2^m-1,2^m-1-m,3]$ gives a different lattice (related to $E_8$ at $m=3$ via the *extended* Hamming code, as the next clause correctly notes). Suggested fix: replace with "single-parity-check codes give the $D_n$ lattices."

- **`coding-theory.html:984` — "Leech lattice $\Lambda_{24}$ is optimal (Cohn–Kumar–Miller–Radchenko–Viazovska, 2017)."** The optimal-sphere-packing result for $\Lambda_{24}$ is the 2017 paper by Cohn, Kumar, Miller, Radchenko, Viazovska — correct attribution. (Verified — keeping this here only because earlier audits sometimes muddle the year/authors.)

- **`coding-theory.html:734` — "AG codes beat the Gilbert–Varshamov bound for $q\ge 49$."** The Tsfasman–Vlăduţ–Zink theorem requires $q$ to be a *square* with $\sqrt q\ge 7$, i.e. $q\in\{49,64,81,121,\dots\}$ subject to being a prime power square. Saying "$q\ge 49$" without the square restriction overgeneralises (e.g. $q=53$ does not satisfy TVZ). Minor imprecision.

## Underspecified or unverifiable claims

- **`coding-theory.html:878` — "within $\sim 0.0045$ dB of Shannon capacity for well-designed irregular LDPC ensembles."** Matches Chung–Forney–Richardson–Urbanke (2001) for rate-1/2 binary-input AWGN; the page does not specify rate or channel, so the figure is reasonable but ensemble-dependent.

- **`coding-theory.html:1087` — "extended Hamming $[8,4,4]$ gives $E_8$; the binary Golay $[24,12,8]$ gives a scaled Leech lattice (after a final $\mathbb{Z}/2$ twist)."** The $E_8$ part is exactly Construction A. The Leech-from-Golay description is a hand-wave for what is properly Construction B (or twisted Construction A) plus a "glue vector." Not wrong, but readers will not find the construction self-contained.

- **`coding-theory.html:862` — "Reed–Muller and Berlekamp–Massey-Solomon refinements live here."** "Berlekamp–Massey-Solomon" is non-standard nomenclature; the algorithm is Berlekamp–Massey (and is unrelated to a "Solomon" coauthor in this context). Likely a stray hyphen — see `quizzes/coding-theory.json` for whether the typo propagates.

- **`coding-theory.html:1103` — "Panteleev–Kalachev recently broke through the $\sqrt n$ distance barrier."** Refers to the 2022 quantum LDPC construction achieving $\Theta(n)$ distance; "recently" is fine for a 2026 page but unsourced.

## Severity

**Minor.** One genuine error (Hamming-codes-give-$D_n$ is wrong; should be single-parity-check codes), one over-broad statement (TVZ requires $q$ a square), one stylistic typo ("Berlekamp–Massey-Solomon"). All worked widgets, parity equations, cyclotomic cosets, and the $(3,6)$-regular $H$ check out arithmetically. No claim affects pedagogical correctness of the interactive elements.
