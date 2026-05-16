# p-adic-numbers.html — math correctness audit (2026-05-14)

## Verified claims

- **§1 p-adic absolute value & valuation** (309–313). Definition of $v_p$ on $\mathbb{Z}$, extension to $\mathbb{Q}^\times$ by $v_p(a/b)=v_p(a)-v_p(b)$, $v_p(0)=\infty$, $|x|_p=p^{-v_p(x)}$. Standard.
- **§1 Ostrowski's theorem** (315). Correctly states uniqueness up to equivalence: one Archimedean place + one $|\cdot|_p$ per prime, exhaustive.
- **§1 Product formula** (317–319). $\prod_v |x|_v = 1$ on $\mathbb{Q}^\times$ — correct as stated.
- **§2 Ultrametric** (415–425). Strong triangle inequality, the "strong equality" $|x+y|_p=\max$ when $|x|_p\ne|y|_p$, every-point-is-center, clopen balls, total disconnectedness — all correct.
- **§3 p-adic expansions** (479–482). Uniqueness with digits $\in\{0,\dots,p-1\}$, terminates iff non-negative integer, eventually periodic iff rational with $\gcd(b,p)=1$, carries propagate toward higher powers of $p$. Standard.
- **§3 Worked claim** (529). $-1=\sum_{i\ge 0}(p-1)p^i$ via $(p-1)\sum p^i=-1$ in $|\cdot|_p$. Correct ($4+4\cdot 5+4\cdot 5^2+\cdots = -1$ in $\mathbb{Z}_5$).
- **§4 Inverse-limit definition** (548–560). $\mathbb{Z}_p=\varprojlim \mathbb{Z}/p^n$, compatible-tower description, compact-Hausdorff-totally-disconnected = Cantor set, complete DVR with residue field $\mathbb{F}_p$. Correct.
- **§5 Tree / metric identity** (589–591). $|x-y|_p=p^{-n} \iff x\equiv y\pmod{p^n}$ and $\not\equiv\pmod{p^{n+1}}$. Correct.
- **§6 $\mathbb{Q}_p$ structure** (713–720). Completion definition, Laurent expansion $\sum_{i\ge N} a_i p^i$ with $N=v_p(x)$, $\mathbb{Z}_p=\{|x|_p\le 1\}$, $\mathbb{Z}_p^\times=\{|x|_p=1\}$, $\mathbb{Q}_p^\times\cong p^\mathbb{Z}\times\mathbb{Z}_p^\times$. Correct.
- **§6 Series facts** (863). $\sum p^n=1/(1-p)$ in $\mathbb{Q}_p$ and $\sum n!$ converges in every $\mathbb{Q}_p$ since $v_p(n!)\to\infty$ (Legendre formula). Correct.
- **§7 Hensel I + Newton iteration** (868–872). Hypotheses correct; quadratic-convergence index $f(x_{n+1})\equiv 0\pmod{p^{2n+2}}$ matches the standard $f(x_n)\equiv 0\pmod{p^{n+1}} \Rightarrow f(x_{n+1})\equiv 0\pmod{p^{2(n+1)}}$.
- **§7 $\sqrt 2$ in $\mathbb{Z}_7$** (874). $3^2=9\equiv 2\pmod 7$, $f'(3)=6\not\equiv 0\pmod 7$. Correct.
- **§8 Newton-polygon theorem** (964–966). Lower convex hull, slopes $-m_j$ encode root valuations $m_j$, lengths $\ell_j$ count multiplicity. Standard form.
- **§8 Worked example $x^3-x-p$** (968). Coefficients $(-p,-1,0,1)$ → vertices $(0,1),(1,0),(3,0)$; slopes $-1$ (length 1) and $0$ (length 2); reduction $x(x-1)(x+1)$ supplies the two unit roots. Correct.
- **§8 Eisenstein corollary** (970). Single segment slope $-1/n$ ⇒ root valuations $1/n\notin\mathbb{Z}$ ⇒ irreducibility. Correct.
- **§9 $efg$/uniformizer/residue field** (993–995). Unique extension of $|\cdot|_p$, $ef=[L:\mathbb{Q}_p]$, max-unramified $L^{ur}$ of degree $f$, totally-ramified $L/L^{ur}$ of degree $e$ with Eisenstein uniformizer. Correct.
- **§9 Tame/wild + cyclotomic** (997). $\mathbb{Q}_p(\zeta_{p^n})/\mathbb{Q}_p$ totally ramified degree $p^{n-1}(p-1)$, wildly ramified for $n\ge 2$. Correct.
- **§9 Krasner's lemma** (999). Standard form and the Eisenstein-perturbation corollary. Correct.
- **§10 Hasse–Minkowski** (1025) and **Selmer cubic** $3x^3+4y^3+5z^3=0$ (1027). Both standard.

## Wrong / dubious claims

- **`p-adic-numbers.html:1085–1087`** — W7 widget concludes "*by Hasse–Minkowski a global $\mathbb{Q}$-solution exists*" from a single mod-$p^3$ search at *one* user-chosen prime plus $\mathbb{R}$. HM requires solvability at **every** completion (all primes plus $\infty$); checking one prime is neither necessary nor sufficient. The conclusion line should be hedged ("consistent at this place" / "would need every prime") rather than asserting a global existence statement.
- **`p-adic-numbers.html:420`** — spelling: "isoceles" → "isosceles". Trivial.

## Underspecified or unverifiable claims

- **§7 Quadratic-convergence sentence** (872) cites "Taylor-expansion argument" without writing $f(x_{n+1})=f(x_n)+f'(x_n)\Delta+O(\Delta^2)$; statement is correct but the user has to take the bound on faith.
- **§9 Tame ramification** (997) — "governed by characters of $\mu_e\subset\mathbb{F}_{p^f}^\times$" is correct only when $e\mid p^f-1$ (which is automatic for *totally* tame extensions of the maximal unramified subfield); the wording elides this. Math is right; phrasing leaves the reader to fill in.
- **§10 W7 search range** — `if(y>200) break; if(x>200) break;` short-circuits the nested loop well before $p^3$ for $p\ge 7$ (e.g. $p=7\Rightarrow p^3=343$). False negatives possible at moderate primes; conclusion logic then over-claims an obstruction.

## Topics not covered

p-adic exponential/logarithm convergence radii, Witt vectors, and Teichmüller lifts are absent — flag if the curriculum expects them here, otherwise out of scope.

## Severity

**Minor.** All headline mathematical statements (Ostrowski, ultrametric, $\mathbb{Q}_p$ structure, Hensel, Newton polygon, Krasner, Hasse–Minkowski) are correctly stated. The single substantive issue is the W7 widget overclaiming a Hasse–Minkowski conclusion from a one-prime check (and its 200-cell loop cap that can spuriously report obstructions); that is a widget-conclusion phrasing bug rather than a wrong theorem.
