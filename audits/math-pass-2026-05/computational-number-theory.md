# Math-correctness pass — `computational-number-theory.html`

Date: 2026-05-14. Pedagogy skipped; only mathematical claims verified.

## Verified claims

**Primality (§1, lines 263–298).**
- Trial division $O(\sqrt n)$, exponential in $\log n$: correct.
- Fermat: $a^{p-1}\equiv 1\pmod p$ for $\gcd(a,p)=1$: correct.
- Carmichael witness gap, $561 = 3\cdot 11\cdot 17$: correct (smallest Carmichael).
- Miller–Rabin decomposition $n-1 = 2^s d$ with the disjunction "$a^d\equiv 1$ OR $a^{2^r d}\equiv -1$ for some $0\le r<s$": correct standard formulation.
- Worked Miller–Rabin on $n=15,a=2$: $2^7=128\equiv 8\pmod{15}$ verified; $s=1$, no further square; $8\not\equiv\pm1$ → witness. Correct.
- AKS deterministic, polynomial in $\log n$: correct. Cited exponent $O((\log n)^{6+\epsilon})$ matches Lenstra–Pomerance 2005 improved analysis (original 2002 was $\tilde O((\log n)^{12})$).

**Factoring (§2, lines 300–331).**
- GNFS heuristic complexity $L_n[1/3,(64/9)^{1/3}]$, with $(64/9)^{1/3}\approx 1.923$: correct (Buhler–Lenstra–Pomerance constant).
- $L_n[\alpha,c]$ definition: correct.
- Pollard $\rho$ birthday-cycle in $O(\sqrt p)$ steps; Floyd cycle detection; $\gcd(x_i-x_j,n)$: correct.
- Worked $n=91$: $f(x)=x^2+1$, $x_0=2$ → $x_1=5$, $x_2=26$ verified; $\gcd(21,91)=7$, so $91=7\cdot 13$. Correct.
- Pollard $p-1$ requiring $p-1$ smooth: correct.
- Quadratic sieve $L_n[1/2,1]$: correct heuristic constant.
- Smooth-relation / $\mathbb F_2$-dependence / square-root / gcd recipe shared by QS and NFS: correct.

**LLL (§3, lines 334–384).**
- SVP NP-hard under randomized reductions: correct (Ajtai 1998).
- LLL $\|b_1\|\le 2^{(n-1)/2}\lambda_1(L)$ in polynomial time: correct (standard $\delta=3/4$ statement).
- Gram–Schmidt $\mu_{ij}=\langle b_i,b_j^*\rangle/\|b_j^*\|^2$: correct.
- Lovász condition $\|b_i^*\|^2 < (\delta-\mu_{i,i-1}^2)\|b_{i-1}^*\|^2$ with $\delta\in(1/4,1)$: correct (parameter range as in original LLL paper).
- Coppersmith: roots of $f\in\mathbb Z[x]$, $\deg d$, mod $N$, with $|x|<N^{1/d}$: correct.

**Modular arithmetic (§4, lines 386–423).**
- Square-and-multiply $O(\log k)$: correct.
- Worked $7^{13}\bmod 11 = 2$ verified ($7^2\equiv 5,7^4\equiv 3,7^8\equiv 9$; $9\cdot 3\cdot 7=189\equiv 2$). Correct.
- Tonelli–Shanks $p\equiv 3\pmod 4$ formula $r=a^{(p+1)/4}$ with derivation $r^2=a\cdot a^{(p-1)/2}\equiv a$: correct.
- General Tonelli–Shanks sketch ($p-1=2^s Q$, non-residue $z$, climb $2^s$-th roots of unity): correct.
- CRT example $x\equiv 2,3,2\pmod{3,5,7}$ → $x=23$ verified.
- Garner's algorithm $O(k^2)$ multiplies: correct.

**Schoof (§5, lines 426–453).**
- Hasse $\#E(\mathbb F_p)=p+1-t$, $|t|\le 2\sqrt p$: correct.
- CRT recovery once $\prod\ell > 4\sqrt p$: correct (window width is $4\sqrt p+1$; $\prod\ell>4\sqrt p$ suffices).
- $E[\ell]\cong(\mathbb Z/\ell)^2$ for $\ell\ne p$: correct (implicit assumption $\ell\ne p$; safe for "small primes" used).
- Frobenius characteristic equation $\phi_p^2-t\phi_p+p\equiv 0$ on $E[\ell]$: correct.
- SEA Elkies-prime speedup, kernel of degree-$\ell$ isogeny: correct.

**Class groups (§6, lines 455–505).**
- $\mathcal O_K^\times\cong\mu(K)\oplus\mathbb Z^{r_1+r_2-1}$ (Dirichlet): correct.
- Buchmann subexponential under GRH for Hecke $L$-functions; Bach bound $(\log|\Delta_K|)^2$ for factor-base generation: correct.
- $\mathbb Q(\sqrt{-5})$: $\mathcal O_K=\mathbb Z[\sqrt{-5}]$, $\mathrm{Cl}(K)\cong\mathbb Z/2$, $h=2$: correct.
- Factor-base relations $(2)=\mathfrak p_2^2$, $(3)=\mathfrak p_3\mathfrak p_3'$, $(1\pm\sqrt{-5})=\mathfrak p_2\mathfrak p_3^{(\prime)}$: correct.

## Wrong / dubious claims

None. The mathematical content is uniformly accurate.

## Underspecified or unverifiable claims

- **Line 282 (AKS exponent):** "$O((\log n)^{6+\epsilon})$" is correct under the Lenstra–Pomerance 2005 variant but the original AKS was $\tilde O((\log n)^{12})$. Page does not cite which variant; reader could be misled into thinking $6+\epsilon$ is the original bound. Minor.
- **Line 319 (QS "good up to ~120 digits"):** practical-domain claim; reasonable rule of thumb but not a theorem. Acceptable as engineering remark.
- **Line 409 (CRT-RSA "4× speedup"):** standard folklore; correct order of magnitude (theoretical $\approx 4\times$ from halving operand size, modulo overhead).
- **Topics in the audit prompt not covered by this page:** Euclidean algorithm + extended (Lamé bound), BPSW, baby-step giant-step / Pollard $\rho$ for DLP, index calculus, continued-fraction algorithm, and a worked RSA toy are not present in this topic file. They live elsewhere in the corpus (e.g. `mathematics-and-cryptography.html`) and are out of scope for verifying this page.

## Severity

**Clean.** All in-scope mathematical claims verified; no errors found. The only nit (AKS exponent without variant attribution) is informational, not an error.
