# moonshine.html — math correctness pass

## Verified claims

**Section 1 (j-invariant).** All Fourier coefficients $c_{-1},\dots,c_{10}$ in the widget table match OEIS A000521 exactly. Asymptotic $c_n \sim e^{4\pi\sqrt n}/(\sqrt 2\, n^{3/4})$ is the leading Hardy–Ramanujan–Rademacher term and at $n=10$ is within 1 % of the true value.

**Section 2 (Monster).** $|\mathbb{M}| = 2^{46}3^{20}5^9 7^6 11^2 13^3\cdot 17\cdot 19\cdot 23\cdot 29\cdot 31\cdot 41\cdot 47\cdot 59\cdot 71$ expands to exactly $808\,017\,424\,794\,512\,875\,886\,459\,904\,961\,710\,757\,005\,754\,368\,000\,000\,000 \approx 8.08\times 10^{53}$. Griess-algebra dim 196884, faithful-irrep dim 196883, $194$ irreps/conjugacy classes, dimensions of $V_2,\dots,V_6$ all standard. Fischer/Livingstone/Thorne character-table priority correct.

**Section 3 (McKay).** $c_1 = 196884 = 196883 + 1$, $c_2 = 21493760 = 21296876 + 196883 + 1$, $c_3 = 864299970 = 842609326 + 21296876 + 2\cdot 196883 + 2$ all arithmetically check.

**Section 4 (Thompson).** Head q-coefficients of $T_{1A}, T_{2A}, T_{2B}, T_{3A}, T_{5A}$ all match the standard Hauptmoduln for $\mathrm{SL}_2(\mathbb{Z}), \Gamma_0(2)+, \Gamma_0(2), \Gamma_0(3)+, \Gamma_0(5)+$. The 2A check $\chi_2(2A)=4371$, $\mathrm{tr}(2A|V^\natural_1)=1+4371=4372$ is the textbook computation. Ogg's 15 supersingular primes match the 15 prime divisors of $|\mathbb{M}|$. The count "171 genus-zero groups" (Cummins–Gannon) is correct.

**Section 5 (Borcherds).** Denominator identity $p^{-1}\prod_{m>0,n\in\mathbb{Z}}(1-p^mq^n)^{c(mn)} = J(p)-J(q)$ stated correctly. FLM 1988 attribution, Goddard–Thorn no-ghost, generalized Kac–Moody framing, 1992 proof and 1998 Fields medal are all correct.

**Section 7 (genus-zero).** Riemann–Hurwitz formula for $g(X_0(N))$ correct. Spot-checked genus tables for $X_0(N)$ at $N=11,14,15,17,19,21,22,23,24,25,27,32,36,49$ all standard. Fricke involution $\bigl(\begin{smallmatrix}0&-1\\N&0\end{smallmatrix}\bigr)$ and Atkin–Lehner extension $\Gamma_0(N)+$ are correctly defined.

**Sections 8–9 (VOA / generalized).** Standard VOA axioms (state-to-operator, locality, Virasoro), Zhu's modularity theorem, Norton 1984 / Carnahan 2010–2021, twisted-module construction, $24$th-root-of-unity cocycle, Leech-lattice theta series weight-12 — all consistent with the literature.

## Wrong / dubious claims

- **`moonshine.html:480` — McKay decomposition $V^\natural_4$ multiplicities** `[2,3,2,1,1]` (i.e. $2V_1+3V_2+2V_3+V_4+V_5$) sums to $19{,}424{,}543{,}805$; the widget claims this equals $c_4 = 20{,}245{,}856{,}256$. Off by $821{,}312{,}451$. The widget will literally print "match? NO". A multiplicity vector that does sum to $c_4$ is `[3,3,1,2,1]` ($3V_1+3V_2+V_3+2V_4+V_5$); that or another correct decomposition needs to replace the current one.
- **`moonshine.html:481` — McKay decomposition $V^\natural_5$ multiplicities** `[4,5,3,2,1,1]` sums to $39{,}648{,}906{,}302$, vastly short of $c_5 = 333{,}202{,}640{,}600$. The shortfall is exactly $293{,}553{,}734{,}298 = \dim V_7$, i.e. the decomposition must include $V_7$ at multiplicity $\ge 1$; e.g. `[4,5,3,2,1,1,1,0,0]` works. Widget will print "match? NO".
- **`moonshine.html:909` — Faber polynomial $\Phi_4$ sign error.** File says $\Phi_4(X) = X^4 - 4c(1)X^2 - 4c(2)X - 2c(1)^2 - 4c(3)$. Direct expansion of $J^4$ shows the constant must be $+2c(1)^2 - 4c(3)$, not $-2c(1)^2 - 4c(3)$. With the file's coefficients $\Phi_4(J)$ has a nonzero $q^0$ term $-155{,}053{,}237{,}824$, contradicting "$\Phi_n(J) = q^{-n}+O(q)$".
- **`moonshine.html:927` — Faber polynomial $\Phi_5$ constant.** File says $\Phi_5(X) = X^5 - 5c(1)X^3 - 5c(2)X^2 + (5c(1)^2 - 5c(3))X + (5c(1)c(2) - 5c(4))$. The $X^3, X^2, X$ coefficients are correct; the constant is wrong. The correct constant is larger by $17{,}008{,}093{,}200{,}384$ (involves additional $c(1)^a c(2)^b$ cross-terms that the displayed expression omits).

## Underspecified or unverifiable claims

- **`moonshine.html:817` — "first instance is $c(4) = \tfrac{1}{2}(c(1)^2 + c(2))\cdot 2 - c(2)\cdot c(1)/c(1) + \dots$"**  is presented as an equation but the right-hand side simplifies to $c(1)^2 + c(2) - c(2) = c(1)^2 = 38{,}763{,}309{,}456$, which is $\ne c(4) = 20{,}245{,}856{,}256$. The trailing "$+ \dots$" is doing all the work; as written the formula is misleading rather than wrong, but a reader trying to verify will fail.
- **`moonshine.html:874` — "level-2 replication: $c(3) = c(1)^2 - 2c(2) + 2c(1)$"** Numerically $c(1)^2 - 2c(2) + 2c(1) = 38{,}763{,}309{,}456 - 42{,}987{,}520 + 393{,}768 = 38{,}720{,}715{,}704 \ne c(3) = 864{,}299{,}970$. The widget readout calls this a "rearrangement" so it may be intended only schematically, but no caveat is shown to the reader.
- **`moonshine.html:889–893` — widget readout for $N=3$** says "c(3) = c(1) c(2) - c(1) c(2) ... = 0 -- this instance is degenerate" and then mid-sentence pivots to "$c(5) = c(0) c(5) + c(1) \cdot c(4) + 0$". As displayed this is salad: $c(5) = 333{,}202{,}640{,}600$ but $c(1)\cdot c(4) = 196884 \cdot 20245856256 \approx 3.99\times 10^{15} \ne c(5)$. The "level-2 replication" identity needs to either be stated correctly or removed from the readout.
- **`moonshine.html:1196` — 2A,2B twisted series head "$q^{-1/2} + 0\,q^{1/2} + \dots$"** with grading $1/2$. Order of 2A is 2, so a 2A-twisted module has grading $\frac12\mathbb{Z}$; the head exponent and vanishing-trace claim are plausible but I cannot independently confirm against published $Z(2A,2B;\tau)$ tables. Same caveat for the 3A,3A and 3A,e entries on lines 1199–1209: the leading exponents and signs are heuristic, not cross-checked.
- **`moonshine.html:874–893`** Mahler "level-2 replication identity" $c(2N+1)=\sum_r c(N-r)c(N+r+1) - c(N)c(N+1)$ does not match any standard form I can locate; classical Mahler/Borcherds replication has products $c_a \cdot c_b$ with $a+b\approx 2N+1$ but with different combinatorial weights. Suspicious as written.

## Severity

**Moderate.** Two widgets (3 and 6) contain numerical/symbolic identities that fail their own arithmetic checks — a reader who clicks into the widgets sees `match? NO` (widget 3, $n=4,5$) and a Faber expansion that does not actually expand $J^n$ to $q^{-n}+O(q)$ (widget 6, $\Phi_4,\Phi_5$). The narrative-level statements in §§1–5, 7–9 (Monster order, McKay observation up to $c_3$, Thompson series heads, Conway–Norton conjecture, Borcherds proof architecture, Ogg's coincidence, VOA axioms, generalized moonshine) are all clean; the bugs are localized to the worked-decomposition tables and the Faber-polynomial widget. No fundamental theorem is misstated; the bad bits are computational errors a careful pass would catch.
