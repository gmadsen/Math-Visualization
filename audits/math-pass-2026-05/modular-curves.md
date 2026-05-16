# Math-correctness audit — `modular-curves.html`

## Verified claims (sections)

- **§1 cusps & index.** $[\mathrm{SL}_2(\mathbb{Z}):\Gamma_0(N)] = N\prod_{p\mid N}(1+1/p)$ correct; for prime $N$, index $= N+1$, two cusps $\{0,\infty\}$, coset reps $\{I, ST^k : k=0,\dots,N-1\}$ all standard. Widget 1 hard-codes index $N+1$ (correct since menu is restricted to primes).
- **§2 moduli.** Bijection $Y_0(N)(\mathbb{C}) \leftrightarrow \{(E,C)\}$, lattice $\Lambda_\tau = \mathbb{Z}+\mathbb{Z}\tau$, subgroup $C_\tau = \langle 1/N\rangle$, descent through $\Gamma_0(N)$ all correct. Widget 2's geometry of order-$N$ subgroup is right.
- **§3 Hecke $T_p$.** $p+1$ summands, $E[p]\cong(\mathbb{Z}/p)^2$, formula $T_p(\sum a_n q^n) = \sum(a_{pn}+p^{k-1}a_{n/p})q^n$ all standard.
- **§4 Eichler–Shimura.** $H^0(X_0(N),\Omega^1)\cong S_2(\Gamma_0(N))$ and $\dim S_2 = g(X_0(N)) = \dim J_0(N)$. Widget 4 data $(N,g,\text{newforms})$ for $N\in\{11,14,15,17,23,37\}$ all match LMFDB.
- **§5 genus.** Riemann–Hurwitz formula correct including $\nu_2,\nu_3,\nu_\infty$ formulas. Widget 5 table $\mathrm{TBL}[N]$ for $N=1$–$50$ verified entry-by-entry against the formula. Approximation $g(X_0(N))\approx (N+1)/12$ for prime $N\ge 17$ correct.
- **§6 cusps.** $\nu_\infty(N)=\sum_{d\mid N}\varphi(\gcd(d,N/d))$ correct; widget 6 cusp counts for $N\in\{6,12,15,30,36\}$ verified $(4,6,4,8,12)$. Q-rationality criterion `gcd(d, N/d) ∈ {1,2}` correct (Ogg).
- **§7 Atkin–Lehner.** $|W_N|=2^{\omega(N)}$, composition $w_d w_{d'}=w_{d''}$ with $d''=dd'/\gcd(d,d')^2$, sign of FE $\varepsilon = -\varepsilon_N(f)$ for weight 2 (matches Diamond–Shurman 5.10.2). Widget 7 data $(g, \dim S_2^{\text{new}}, \dim S_2^{\text{old}})$ for $N\in\{11,22,33,37,55,66,77\}$ all match LMFDB. Moduli interpretation $w_N(E,C) = (E/C, E[N]/C)$ correct. $X_0(11)/w_{11}$ has genus 0 — correct.
- **§8 Heegner.** Heegner hypothesis = every $p\mid N$ splits in $\mathcal{O}_D$, count $= h(D)\cdot 2^{\omega(N)}$, defined over $H_D$ with $\mathrm{Gal}(H_D/K)\cong\mathrm{Cl}(\mathcal{O}_D)$, Gross–Zagier (1986), Kolyvagin rank-1 BSD — all standard. Class numbers $h(-3)=h(-4)=h(-7)=h(-8)=h(-11)=h(-19)=h(-43)=1$, $h(-15)=2$, $h(-23)=3$ correct.
- **§9 Mazur.** 11 cyclic + 4 product = 15 groups exactly. Eisenstein ideal $I=\ker(\mathbb{T}\twoheadrightarrow\mathbb{Z},\,T_p\mapsto 1+p)$ correct. Genus table $G_1$ for $X_1(N)$, $N=1$–$23$ matches Diamond–Shurman.

## Wrong / dubious claims (with file:line)

- **modular-curves.html:1511** — Widget 9 example for $\mathbb{Z}/5$: `E: y² + y = x³ − x; P = (0,0) order 5` is **wrong**. That equation is Cremona 37a1 (rank 1, **trivial torsion**). The intended curve is 11a3: `y² + y = x³ − x²` (the curve $X_1(11)$, with $E(\mathbb{Q})_\text{tors}=\mathbb{Z}/5$).
- **modular-curves.html:1515** — Widget 9 example for $\mathbb{Z}/12$: `E: y² = x³ − 4x; E(ℚ)_tors ≅ ℤ/12 not direct, but ℤ/2 ⊕ ℤ/6 occurs at level 30` is **wrong and garbled**. The curve $y^2=x^3-4x$ has $E(\mathbb{Q})_\text{tors}=\mathbb{Z}/2\oplus\mathbb{Z}/2$ (3 two-torsion points $(0,0),(\pm2,0)$), not $\mathbb{Z}/12$. A correct $\mathbb{Z}/12$ example is needed (e.g. Cremona 90c1 or one of the 50.b family).
- **modular-curves.html:1361–1366** — Widget 8 `legendre(a, p)` returns `+1` for $p=2$ regardless of $a$, because `e=(p-1)/2=0` and `pow(a,0,2)=1`. The Kronecker symbol at 2 actually depends on $D \bmod 8$ ($+1$ if $D\equiv 1\pmod 8$, $-1$ if $D\equiv 5\pmod 8$). For $N=14$ (so $p=2\mid N$) and $D\in\{-3,-11,-19\}$ (all $\equiv 5\pmod 8$), the widget falsely reports the Heegner hypothesis as satisfied. The widget tooltip says “Heegner hypothesis ✓” when the truth is the prime 2 is inert.
- **modular-curves.html:1015** — Cusp parametrization is written `(d, a) : d∣N, a ∈ (ℤ/gcd(d,N/d))^× / {±1}`. The `/{±1}` is inconsistent with the (correct) count `ν∞ = Σ φ(gcd(d, N/d))` immediately following. Standard parametrization (no `/{±1}` modulo) gives the count; the modulo-$\pm 1$ would halve it for `gcd > 2`.

## Underspecified or unverifiable claims

- **modular-curves.html:1512–1513** — Widget 9 examples for $\mathbb{Z}/7$ (`y² + xy = x³ − x² − 2x − 1`) and $\mathbb{Z}/10$ (`y² + xy = x³ − 45x + 81; LMFDB 66.c1`) not directly verified here; LMFDB 66.c1 is not the standard reference for a $\mathbb{Z}/10$-torsion curve and the equation/label pair is suspect.
- **modular-curves.html:1482** — Statement that $X_1(N)(\mathbb{Q})$ contains only cusps for $N\in\{11,13,14,15,16,17,18,21\}$ is incomplete (omits $N=19,20,22,\dots$); the parenthetical "and a finite check for the remaining higher $N$" only loosely covers it.
- **modular-curves.html:836–837** — "Eichler–Shimura associates to $f$ a quotient abelian variety $A_f \subseteq J_0(N)$": $A_f$ is naturally a *quotient* of $J_0(N)$ (by the annihilator ideal); the $\subseteq$ symbol is loose but standard up to isogeny.
- **modular-curves.html:859** — Section 5 is titled "Genus formulas for $X_0(N)$, $X_1(N)$, $X(N)$" but the prose only states the $X_0(N)$ formula; $X_1(N)$ and $X(N)$ formulas appear only implicitly via widget tables.

## Severity

**Moderate.** Three concrete errors: the $\mathbb{Z}/5$ example (wrong equation), the $\mathbb{Z}/12$ example (wrong group entirely), and the Heegner-hypothesis $p=2$ bug (silently wrong UI for $N=14$). The cusp-parametrization `/{±1}` and Section 5 title are minor cosmetic issues. The high-level math (genus formulas, Hecke, Atkin–Lehner, Eichler–Shimura, Mazur, Heegner/Gross–Zagier) is correct and the $g$/cusp/$\dim S_2^{\text{new}}$ tables verified entry-by-entry.
