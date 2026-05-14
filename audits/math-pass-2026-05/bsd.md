# Math-correctness audit — bsd.html

Scope: every mathematical assertion. Pedagogy ignored.

## Verified claims

**Mordell–Weil (§1).** Statement, dates, decomposition $E(\mathbb{Q}) \cong \mathbb{Z}^r \oplus E(\mathbb{Q})_{\text{tors}}$, Mazur 1977 list (15 groups: $\mathbb{Z}/n$, $n \le 10$ or $n=12$; $\mathbb{Z}/2 \oplus \mathbb{Z}/2n$, $n \le 4$), discriminant $\Delta = -16(4A^3+27B^2)$, doubling formula, weak MW + descent sketch — all standard and correct.

**Worked rationals on rank-1 curves.** $P=(3,5)$ on $y^2=x^3-2$: $27-2=25=5^2$ ✓; widget's BigInt chord-tangent law produces correct rational iterates; "denominators of $x(nP)$ are perfect squares" is the standard EDS fact ✓. $P=(0,1)$ on $y^2=x^3-x+1$ doubles to $(1/4,-7/8)$ ✓. Heights satisfy $\hat h(nP)=n^2\hat h(P)$ ✓.

**Point-counting (§2).** Hasse $|a_p|\le 2\sqrt p$ ✓; $N_p = p+1-a_p$ ✓; brute-force counting via Euler's criterion is correct; original BSD heuristic $\Pi(X) \sim c(\log X)^r$ is the historical statement ✓.

**BSD weak (§3).** $\operatorname{ord}_{s=1} L(E,s) = \operatorname{rank} E(\mathbb{Q})$ ✓. Modularity (Wiles + BCDT) gives entire continuation and $\Lambda(E,s)=\pm\Lambda(E,2-s)$ ✓. Hasse–Weil Euler product formula and $\operatorname{Re}(s)>3/2$ convergence ✓.

**BSD strong (§3, §5).** Formula $\lim L(E,s)/(s-1)^r = \Omega \cdot R \cdot |\Sha| \cdot \prod c_p / |E(\mathbb{Q})_{\text{tors}}|^2$ ✓ (with the standard "real period" caveat that $\Omega$ depends on connectedness of $E(\mathbb{R})$ — see § Underspecified).

**Cremona examples (§3 zoo).** 11a1 (rank 0, $\mathbb{Z}/5$, $L(E,1)\!\approx\!0.2538$), 37a1 (first rank 1, gen $(0,0)$, $L'\!\approx\!0.3059$), 389a1 (first rank 2, gens $(0,0),(1,0)$, $L''/2!\!\approx\!0.7594$), 5077a1 (first rank 3, Buhler–Gross–Zagier 1985, $L'''/3!\!\approx\!1.7318$), 27a1 (CM by $\mathbb{Z}[\omega]$, rank 0, $\mathbb{Z}/3$), 14a1 (rank 0, $\mathbb{Z}/6$) — all match LMFDB.

**Néron–Tate (§4).** Tate-limit definition, polarization $\langle P,Q\rangle = \tfrac12(\hat h(P+Q)-\hat h(P)-\hat h(Q))$, regulator as Gram det, $R=1$ for $r=0$ — all standard ✓.

**Tate–Shafarevich (§5).** $n$-descent sequence, Selmer–Sha quotient $\Sha[n]=\mathrm{Sel}_n / (E(\mathbb{Q})/nE(\mathbb{Q}))$, torsor characterization, $c_p=[E(\mathbb{Q}_p):E_0(\mathbb{Q}_p)]$, Cassels–Tate squareness for finite $\Sha$, Kolyvagin (analytic rank $\le 1$ ⇒ finite $\Sha$ + rank equality), Gross–Zagier 1986 ✓.

## Wrong / dubious claims

- **bsd.html:407** — "doubling $P=(0,1)$ … gives $(1/4, -7/8), (72/49, 611/343), \ldots$". The point $(72/49, 611/343)$ is not on $y^2 = x^3 - x + 1$ at all: $y^2 = 373321/117649$ vs $x^3-x+1 = 318025/117649$. Also $3P = 2P+P = (56, 419)$ and $4P = 2(2P) = (-223/784, 24655/21952)$ — neither equals the printed pair. The "$\ldots$" iterate is fabricated.
- **bsd.html:294 (widget data, curve `f`)** — `y² = x³ − 82x ... gen=[-9,24]`. Off the curve: $(-9)^3 - 82(-9) = 9 \ne 24^2 = 576$. The actual integer points on $y^2=x^3-82x$ near $x=-9$ are $(-9,\pm 3)$, $(-8,\pm 12)$, $(-1,\pm 9)$, $(18,\pm 66)$. Either the curve coefficient is wrong (e.g. $-145$ would put $(-9,24)$ on it: $-729+1305=576$) or the generator is wrong.
- **bsd.html:1368** — "for the modular congruent-number curve $y^2=x^3-25x$, $N=32$". Conductor of $y^2=x^3-n^2x$ for odd squarefree $n$ is $32 n^2$; for $n=5$ this is $800$, not $32$. ($N=32$ is the conductor of $y^2=x^3-x$, the $n=1$ curve.) The downstream BSD numerics ($\Omega\approx 2.621$, $R\approx 0.2529$, $L'(E,1)\approx 0.331$) are then attached to a misidentified conductor; the numerical values themselves are plausible for the correct curve but are not independently verified here.

## Underspecified or unverifiable claims

- **bsd.html:867, :1302** — "$\Omega$ is the real period". Convention-dependent: some sources define $\Omega$ as $\int_{E(\mathbb{R})} |\omega|$, which equals the real period of the Néron differential times the number of components of $E(\mathbb{R})$ (1 or 2). The formula as written is correct under one convention; the page never fixes which. Minor.
- **bsd.html:1276** — "no one knows a provable algorithm to compute $\hat h(P)$ to arbitrary precision starting from the Weierstrass coefficients alone". Slightly misleading: Silverman's algorithm via local height decomposition + archimedean theta series is provable and yields any prescribed precision. The user probably means "no closed form"; restating as such would be cleaner. Minor.
- **bsd.html:1305** — "a rigorous unconditional $|\Sha|$ exists only in very special cases". True in the strict sense but underplays modern results: for analytic rank $\le 1$ Kolyvagin gives finiteness and divisibility statements; full $|\Sha|$ is now unconditionally known for many small-conductor rank-0 curves (Cremona–Stein–Stoll). Minor.
- **bsd.html — abelian varieties.** Page restricts to elliptic curves. Title and pedagogy are consistent; no false generalization to abelian varieties is made. Nothing to flag.

## Severity

**Moderate.** Three concrete arithmetic errors in worked-example data: a fabricated rational iterate (line 407), an off-curve generator (line 294), and a wrong conductor (line 1368). All three are visible to a careful reader and undermine the "click-and-verify" promise of the worked examples. The conceptual content (BSD weak/strong, MW, Néron–Tate, Sha, Cremona zoo) is otherwise solid.
