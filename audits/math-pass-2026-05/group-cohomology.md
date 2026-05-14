# group-cohomology — math correctness audit (2026-05)

**Section:** Algebra & homological

## Verified claims

### §1 Bar resolution and $H^n(G,M)$

- **Definition** (line 263): $H^n(G,-) = R^n(-)^G$. Standard. ✓
- **Bar resolution** (line 272): $\cdots \to \mathbb{Z}[G]^{\otimes 3} \to \mathbb{Z}[G]^{\otimes 2} \to \mathbb{Z}[G] \to \mathbb{Z} \to 0$ with augmentation $\varepsilon$. ✓
- **Differential on bar generators** (line 276): $d[g_1|\dots|g_n] = g_1[g_2|\dots] + \sum_{i=1}^{n-1}(-1)^i[\dots|g_i g_{i+1}|\dots] + (-1)^n[g_1|\dots|g_{n-1}]$. ✓ Standard.
- **Cochain coboundary formula** (line 280): $(d\varphi)(g_1,\dots,g_{n+1}) = g_1\varphi(g_2,\dots,g_{n+1}) + \sum_{i=1}^n (-1)^i \varphi(\dots,g_i g_{i+1},\dots) + (-1)^{n+1}\varphi(g_1,\dots,g_n)$. ✓ Specialization to $n=1$: $g_1\varphi(g_2) - \varphi(g_1g_2) + \varphi(g_1)$. ✓ Specialization to $n=2$: $g_1\varphi(g_2,g_3) - \varphi(g_1g_2,g_3) + \varphi(g_1,g_2g_3) - \varphi(g_1,g_2)$. ✓
- **Coboundary calculator widget** (lines 284–311): cocycle test for degree 0/1/2 implemented correctly with the correct sign conventions; correctly diagnoses coboundary status by exhaustive search over a small range. (One UX limitation flagged in nits.)
- **Quiz `bar-resolution` q1** (line 9): $H^n(G,M) = R^n(-)^G(M) = \mathrm{Ext}^n_{\mathbb{Z}[G]}(\mathbb{Z}, M)$. ✓
- **Quiz q2** (line 21): degree-1 coboundary $g_1\varphi(g_2) - \varphi(g_1g_2) + \varphi(g_1)$. ✓
- **Quiz q3** (line 33, multi-select): independence of resolution, functoriality in both arguments, and Ext identification — all true; resolution-dependence is correctly excluded. ✓

### §2 $H^0(G,M) = M^G$

- **$H^0$ identification** (line 334): $M^G = \{m : g\cdot m = m \forall g\}$, equal to $\ker(d^0)$ where $(dm)(g) = g\cdot m - m$. ✓
- **Left exactness of $(-)^G$** (line 337–342): standard left-exact sequence and the LES extension via $\delta$. ✓
- **Fixed-points calculator widget** (lines 345–361): for $G = C_n$ acting on $\mathbb{Z}/m$ by $\sigma\cdot x = kx$, computes $|M^G| = \gcd(k-1, m)$. Verified: $\ker(\cdot(k-1)$ on $\mathbb{Z}/m) = \{x : (k-1)x \equiv 0\bmod m\}$ has order $\gcd(k-1, m)$. The order check `aᵐ ≡ 1 (mod m)` is correct (warning displayed if not). The hint claims trivial action ($k=1$) gives $M^G = M$ ✓ and sign action ($k=-1$) gives 2-torsion ✓.
- **Quiz `h0-fixed-points` q1** (line 53): $G = C_4$ acting on $\mathbb{Z}/12$ by $\sigma\cdot x = 5x$. Action well-defined since $5^2 = 25 \equiv 1 \bmod 12$. $M^G = \{x : 4x \equiv 0 \bmod 12\} = \{0, 3, 6, 9\}$, $|M^G| = \gcd(4, 12) = 4$. ✓
- **Quiz q2** (line 60): $(-)^G$ left-exact but not right-exact; the obstruction lives in $H^1$. ✓
- **Quiz q3** (line 72): trivial action $\Rightarrow M^G = M$. ✓

### §3 $H^1$, crossed homomorphisms, Hilbert 90

- **1-cocycle definition** (line 376): $\varphi(gh) = \varphi(g) + g\cdot\varphi(h)$. ✓
- **1-coboundary** (line 378): $\varphi(g) = g\cdot m - m$. ✓
- **$H^1 = \mathrm{Hom}(G, M)$ for trivial action** (line 382). ✓
- **Hilbert 90 (cyclic form)** (line 384–386): for cyclic $L/K$ with $G = \langle\sigma\rangle$, $H^1(G, L^\times) = 1$; equivalently $N_{L/K}(\beta) = 1 \iff \beta = \sigma(\alpha)/\alpha$. ✓ Standard.
- **Hilbert 90 in non-abelian / étale form** (line 412): $H^1(G, GL_n(L)) = 1$ for $L/K$ Galois; étale-cohomology version $H^1_{\text{ét}}(\mathrm{Spec}\,K, \mathbb{G}_m) = 0$. ✓
- **Quiz `h1-crossed-homs` q1** (line 89): cocycle identity $\varphi(gh) = \varphi(g) + g\cdot\varphi(h)$. ✓
- **Quiz q2** (line 101): Hilbert 90 statement form. ✓

### §4 $H^2$ classifies extensions

- **Extension definition** (line 435): $1 \to A \to E \to G \to 1$ with $G$ acting on abelian $A$. ✓
- **Section, cocycle measuring failure to be a homomorphism** (line 439–441): $s(g)s(h) = c(g,h)s(gh)$, with $c$ a 2-cocycle by associativity, and changing section changes $c$ by a coboundary. ✓
- **Theorem: extensions $\leftrightarrow H^2(G, A)$, splittings $\leftrightarrow 0$** (line 443–445). ✓ Standard.
- **Brauer reincarnation** $\mathrm{Br}(k) = H^2(\mathrm{Gal}, \bar k^\times)$ (line 459). ✓
- **H^2 widget classification of $C_2$-by-$C_2$ extensions** (lines 447–457): $H^2(C_2, \mathbb{Z}/2) = \mathbb{Z}/2$ and the two classes are $V_4$ (split) vs $C_4$ (nonsplit). ✓ The output text body (lines 952–961) correctly explains $s(\sigma)^2 = c(\sigma,\sigma)\cdot s(\sigma^2) = a\cdot s(e) = a \ne e$ for the nontrivial cocycle. (The inline page note on line 456 is muddled — see "Wrong / dubious".)
- **Quiz `h2-extensions` q1** (line 131): $H^2(G, A)$ classifies extensions. ✓
- **Quiz q2** (line 143): split extensions $\leftrightarrow$ trivial class. ✓
- **Quiz q3** (line 155): $H^2(C_2, \mathbb{Z}/2) = \mathbb{Z}/2$, classes are $V_4$ and $C_4$. By the periodic resolution: trivial action, $N = 1+1 = 2$ which acts as $0$ on $\mathbb{Z}/2$, so $N(M) = 0$ and $H^2 = M^G/N(M) = (\mathbb{Z}/2)/0 = \mathbb{Z}/2$. ✓

### §5 Cyclic groups, periodicity, Tate cohomology

- **Periodic free resolution** (line 482): $\cdots \xrightarrow{N} \mathbb{Z}[G] \xrightarrow{\sigma-1} \mathbb{Z}[G] \xrightarrow{N} \mathbb{Z}[G] \xrightarrow{\sigma-1} \mathbb{Z}[G] \xrightarrow{\varepsilon} \mathbb{Z} \to 0$. ✓ Verified exactness: $\ker\varepsilon = (\sigma-1)\mathbb{Z}[G]$ (augmentation ideal), $\ker(\sigma-1) = N\cdot\mathbb{Z}[G]$, $\ker N = (\sigma-1)\mathbb{Z}[G]$. ✓
- **Cohomology table** (line 486–493): $H^0 = M^G$, $H^{2k\geq 2} = M^G/N(M)$, $H^{2k+1\geq 1} = \ker N/(\sigma-1)M$. ✓ Verified by dualizing: cochain complex is $M \xrightarrow{\sigma-1} M \xrightarrow{N} M \xrightarrow{\sigma-1} M \xrightarrow{N} \cdots$ and reading off cohomology.
- **Periodicity with period 2** for $n\geq 1$ (line 495). ✓
- **Tate cohomology + Herbrand** (line 497): $\hat H^{-1} = {}_NM/(\sigma-1)M$, splice $\hat H^0$ to $\hat H^{-1}$. Multiplicativity on SES + triviality on finite modules. ✓ Standard.
- **Periodic table widget computation** (lines 499–513, code 975–1015): for $C_m$ acting on $\mathbb{Z}/k$ by $\cdot a$, computes $|M^G| = \gcd(a-1, k)$, $|N(M)| = k/\gcd(N, k)$, $|\ker N| = \gcd(N, k)$, $|(\sigma-1)M| = k/\gcd(a-1, k)$, and assembles $|H^{\text{even}}| = \gcd(a-1,k)\gcd(N,k)/k$ and $|H^{\text{odd}}|$ symmetrically. All formulas verified algebraically. The widget output is correct; only the small note below it (line 512) misclaims trivial-action odd cohomology — see "Wrong / dubious".
- **Quiz `cyclic-periodic-tate` q1** (line 173): even/odd formulas. ✓
- **Quiz q2** (line 184): $H^2(C_3, \mathbb{Z}/6) = \mathbb{Z}/3$ for trivial action. Verified: $M^G = \mathbb{Z}/6$, $N = 3$ on $\mathbb{Z}/6$, $N(M) = 3\mathbb{Z}/6 = \{0,3\}$, quotient has order 3. ✓
- **Quiz q3** (line 191): Herbrand quotient is multiplicative on SES and trivial on finite modules. ✓ Standard.

### §6 Inflation–restriction and Lyndon–Hochschild–Serre

- **Restriction $\mathrm{res}^G_H: H^n(G,M) \to H^n(H,M)$** (line 523). ✓
- **Inflation $\mathrm{inf}: H^n(G/H, M^H) \to H^n(G, M)$** (line 524). ✓
- **5-term inflation–restriction** (line 528): $0 \to H^1(G/H, M^H) \xrightarrow{\inf} H^1(G, M) \xrightarrow{\res} H^1(H, M)^{G/H} \to H^2(G/H, M^H) \to H^2(G, M)$. ✓ Standard.
- **LHS spectral sequence** (line 532): $E_2^{p,q} = H^p(G/H, H^q(H, M)) \Rightarrow H^{p+q}(G, M)$. ✓ Standard.
- **LHS widget hand-curated entries** (lines 1024–1059):
  - **C2C2 / F_2** (V_4 split, trivial action): $E_2^{p,q} = \mathbb{F}_2$ everywhere; abuts to $H^*(V_4, \mathbb{F}_2) = \mathbb{F}_2[x_1, x_2]$ with two degree-1 generators. Degenerate (split with trivial action). ✓
  - **C2C4 / F_2** (nonsplit cyclic): $E_2 = \mathbb{F}_2$ everywhere but a nontrivial $d_2$ kills classes; abuts to $H^*(C_4, \mathbb{F}_2) = \Lambda(x) \otimes \mathbb{F}_2[y]$ with $\deg x = 1$, $\deg y = 2$. ✓ Standard.
  - **C3S3 / F_2**: $H^q(C_3, \mathbb{F}_2) = 0$ for $q \geq 1$ (3 invertible in $\mathbb{F}_2$); spectral sequence collapses on row $q=0$, $H^*(S_3, \mathbb{F}_2) = H^*(C_2, \mathbb{F}_2) = \mathbb{F}_2$ in every degree. ✓
  - **C2C2 / F_3**, **C2C4 / F_3**: both factors invertible, $E_2$ concentrated at $(0,0)$. ✓
  - **C3S3 / F_3**: handled wrong on column 0 — see "Wrong / dubious".
- **Quiz `inflation-restriction-lhs` q1** (line 207): 5-term inf-res sequence. ✓
- **Quiz q2** (line 220): LHS $E_2$-page formula. ✓
- **Quiz q3** (line 232): LHS collapses on row $q=0$ when $|H|$ is invertible in $M$. ✓ Reason: $\cdot|H|$ both annihilates $H^{\geq 1}(H, -)$ via $\mathrm{cor}\circ\mathrm{res}$ and is invertible on $M$, forcing $H^{\geq 1}(H, M) = 0$.

### §7 Galois cohomology and Brauer

- **Continuous Galois cohomology** $H^n(k, M) = H^n_{\mathrm{cts}}(G_k, M)$ (line 568). ✓
- **Hilbert 90 (Galois form)** (line 571): $H^1(k, \bar k^\times) = 1$, equivalently $H^1_{\text{ét}}(\mathrm{Spec}\,k, \mathbb{G}_m) = 0$. ✓
- **Kummer LES → Kummer iso** (lines 574–577): $H^1(k, \mu_n) = k^\times/(k^\times)^n$ via $1 \to \mu_n(k) \to k^\times \xrightarrow{n} k^\times \to H^1(k, \mu_n) \to 0$, using $H^1(k, \bar k^\times) = 0$. ✓
- **$\mathrm{Br}(k) := H^2(k, \bar k^\times)$** (line 581). ✓ classifies CSAs up to Morita.
- **Brauer cheat sheet widget**:
  - $\mathrm{Br}(\bar k) = 0$. ✓
  - $\mathrm{Br}(\mathbb{F}_q) = 0$ ("Wedderburn"). ✓
  - $\mathrm{Br}(\mathbb{Q}_p) = \mathbb{Q}/\mathbb{Z}$ via local invariant. ✓
  - $\mathrm{Br}(\mathbb{R}) = \mathbb{Z}/2$ generated by $\mathbb{H}$, with inv: matrix algebras $\mapsto 0$, $\mathbb{H} \mapsto 1/2$. ✓
  - $\mathrm{Br}(\mathbb{Q})$ in Hasse–Brauer–Noether SES $0 \to \mathrm{Br}(k) \to \bigoplus_v \mathrm{Br}(k_v) \to \mathbb{Q}/\mathbb{Z} \to 0$. ✓
- **Quiz `galois-cohomology-brauer` q1** (line 249): $\mathrm{Br}(k) = H^2(k, \bar k^\times)$. ✓
- **Quiz q2** (line 261): Kummer iso $H^1(k, \mu_n) = k^\times/(k^\times)^n$. ✓
- **Quiz q3** (line 273): $\mathrm{Br}(\mathbb{R}) = \mathbb{Z}/2$ generated by $\mathbb{H}$. ✓

### §8 Connections (outro)

- $H^*(G, M) = H^*(BG; M)$ for discrete $G$. ✓
- LHS as algebraic shadow of fibre sequence $BN \to BG \to BQ$. ✓
- Schur multipliers $= H_2(G, \mathbb{Z})$. ✓
- Selmer / Kolyvagin name-checks — standard.

## Wrong / dubious claims

### Wrong

- **Quiz `h1-crossed-homs` q3** (lines 113–124): claims $\alpha = 1 + \beta = (8+4i)/5$ "(or any nonzero scalar multiple)" satisfies $\sigma(\alpha)/\alpha = \beta = (3+4i)/5$. **The advertised witness gives $\sigma(\alpha)/\alpha = \bar\beta = \beta^{-1}$, not $\beta$.**
  - Verify: $\alpha = 8 + 4i$, $\sigma(\alpha) = 8 - 4i$. Then $\sigma(\alpha)/\alpha = (8-4i)/(8+4i) = (8-4i)^2/[(8+4i)(8-4i)] = (64 - 64i - 16)/80 = (48 - 64i)/80 = 3/5 - 4i/5 = \bar\beta$.
  - Algebraically: for $|\beta| = 1$, $\bar\beta = \beta^{-1}$, and $\sigma(1+\beta)/(1+\beta) = (1+\bar\beta)/(1+\beta) = (1 + \beta^{-1})/(1+\beta) = ((\beta+1)/\beta)/(1+\beta) = 1/\beta = \beta^{-1}$.
  - **Correct witness**: $\alpha = 1 + \bar\beta = 1 + \beta^{-1} = (8 - 4i)/5$, or equivalently $\alpha = -2 + i$ (a scalar multiple). Verify $\alpha = -2+i$: $\sigma(\alpha)/\alpha = (-2-i)/(-2+i) = (-2-i)^2/5 = (4 + 4i - 1)/5 = (3+4i)/5 = \beta$. ✓
  - The explanation field itself acknowledges the inversion (line 122–123): "$\sigma(1+\beta)/(1+\beta)=(1+\beta^{-1})/(1+\beta)=\beta^{-1}$, so adjust to $\alpha=\beta(1+\beta)$ if you want $\beta$ rather than $\beta^{-1}$." But $\alpha = \beta(1+\beta)$ also doesn't give $\beta$: $\sigma(\beta(1+\beta))/(\beta(1+\beta)) = \beta^{-1}(1+\beta^{-1})/(\beta(1+\beta)) = \beta^{-1}\cdot((\beta+1)/\beta)/(\beta(1+\beta)) = \beta^{-3}$. So the suggested fix is also wrong.
  - **None of the four answer choices is actually correct** under the page's own convention $\beta = \sigma(\alpha)/\alpha$. The right witness ($\alpha = 1+\bar\beta$ or any scalar multiple) is not among the choices.

- **H^1 widget §3 (`#h90-out`)** (lines 856–903): the widget verifies $\sigma(\alpha)/\alpha = \beta$ with $\alpha = c\cdot(1+\beta) = (c+a) + bi$. As above, this gives $\bar\beta$, not $\beta$. The numerical comparison `Math.abs(lhsIm-rhsIm)<1e-9` then fails because `lhsIm = -b/c` and `rhsIm = +b/c`. **The widget displays "Mismatch (numerical)" for every Pythagorean β with $b \ne 0$** (i.e., $\beta = (3+4i)/5$, $(5+12i)/13$, $(8+15i)/17$, and $\beta = i$). Only the special-case branch for $\beta = -1$ (which uses $\alpha = i$) actually produces a "verified" output.
  - Fix: replace `aRe = c+a, aIm = b` with `aRe = c+a, aIm = -b` (i.e., use $\alpha = c(1 + \bar\beta) = (c+a) - bi$), and adjust the displayed formulas; OR keep the formula and report $\sigma(\alpha)/\alpha = \beta^{-1}$ honestly.

- **Hilbert 90 proof sketch in prose** (lines 388–390): claims the construction $\alpha = \sum_{i=0}^{n-1} \beta\cdot\sigma\beta\cdots\sigma^{i-1}\beta\cdot\sigma^i(c)$ gives $\sigma(\alpha) = \beta^{-1}\alpha$. This identity itself is correct, but **it gives $\sigma(\alpha)/\alpha = \beta^{-1}$, not $\beta$**, contradicting the theorem statement immediately above ("$\beta = \sigma(\alpha)/\alpha$" on line 386). To match the stated theorem one needs to invert: take $\alpha' = \alpha^{-1}$ (or equivalently start the sum with $\beta^{-1}$ in place of $\beta$), giving $\sigma(\alpha')/\alpha' = \beta$. As written, the proof concludes the wrong direction.

- **H^2 widget inline note** (line 456): "$s(\sigma)^2 = c(\sigma,\sigma)\cdot s(\sigma^2) = 1\cdot e \ne e$ in $C_4$ but $s(\sigma)^2 =$ (nontrivial element of $A$) $\ne e$." The middle clause "$1\cdot e \ne e$" is internally contradictory ($1\cdot e = e$). The intended statement (matching the widget body output on line 953) is "$c(\sigma, \sigma) = a$ (the nontrivial element of $A$), so $s(\sigma)^2 = a\cdot s(e) = a \ne e$." The inline-note `1` was probably meant to be `a` and got mistyped or mis-formatted.

- **Periodic table widget note** (line 512): "Trivial action ($a=1$): $H^{2k}(C_m,\mathbb{Z}/k)=\mathbb{Z}/\gcd(m,k)$, $H^{2k+1}=0$." The first half is correct; the second half is **wrong**. For trivial action, $H^1(C_m, \mathbb{Z}/k) = \mathrm{Hom}(C_m, \mathbb{Z}/k) = \mathbb{Z}/\gcd(m, k)$, the same as $H^{\text{even}}$. The widget code itself returns `Hodd = gcd(m,k)` correctly (and the displayed output for the default $m=3, k=6, a=1$ shows $H^{\text{odd}} = \mathbb{Z}/3 \ne 0$), but the descriptive text under the widget contradicts what the widget computes. ($H^{\text{odd}} = 0$ for trivial action only when $\gcd(m,k) = 1$.)

- **LHS widget — C3S3 / F_3 case** (lines 1043–1049): widget code returns `'F₃' if p===0 else '0'` for every $q$. This is **wrong on rows $q$ where the induced $C_2$-action on $H^q(C_3, \mathbb{F}_3)$ is by sign**. Spelled out:
  - $H^*(C_3, \mathbb{F}_3) = \Lambda(\alpha) \otimes \mathbb{F}_3[\beta]$ with $\deg\alpha = 1$, $\deg\beta = 2$.
  - $C_2 = N_{S_3}(C_3)/C_3$ acts on $C_3$ by inversion, so on $\alpha$ by $-1$. By Bockstein-equivariance, on $\beta = \delta\alpha$ also by $-1$. So $C_2$ acts on $\alpha^a \beta^b$ by $(-1)^{a+b}$.
  - Then $E_2^{0, q} = (H^q(C_3, \mathbb{F}_3))^{C_2}$. By degrees $a + 2b$:
    - $q=0$: $1$, sign $+1$, fixed. $E_2^{0,0} = \mathbb{F}_3$. ✓
    - $q=1$: $\alpha$, sign $-1$, $(\mathbb{F}_3)^{\sigma\cdot x = -x} = \ker(\cdot(-2)) = 0$. $E_2^{0,1} = 0$. (Widget says $\mathbb{F}_3$.)
    - $q=2$: $\beta$, sign $-1$. $E_2^{0,2} = 0$. (Widget says $\mathbb{F}_3$.)
    - $q=3$: $\alpha\beta$, sign $+1$. $E_2^{0,3} = \mathbb{F}_3$. ✓
  - $E_2^{p\geq 1, q} = 0$ for all $q$ (since $|C_2| = 2$ is invertible in $\mathbb{F}_3$). ✓
  - The abutment is $H^*(S_3, \mathbb{F}_3)$, which is well-known to be nonzero only in degrees $0, 3, 4, 7, 8, \ldots$ (period-4 pattern 1,0,0,1,1,0,0,1,…), generated as $\mathbb{F}_3[\beta^2] \otimes \Lambda(\alpha\beta)$. The widget's column-0-everywhere-$\mathbb{F}_3$ would (incorrectly) yield $H^n(S_3, \mathbb{F}_3) = \mathbb{F}_3$ for every $n$.
  - The accompanying commentary string (line 1101) says "$H^p(S_3, F_3) = H^p(C_3, F_3)^{C_2}$ — fixed points of sign-acting $C_2$ on $F_3[y]\otimes\Lambda(x)$", which describes the correct answer; but the widget table itself does not take fixed points and prints $\mathbb{F}_3$ where the entry is $0$.

### Dubious / underspecified

- **Section 7 Kummer 4-term sequence display** (line 584): writes "$0 \to \mathrm{Br}(k)[n] \to H^2(k, \mu_n) \to \mathrm{Br}(k) \xrightarrow{n} \mathrm{Br}(k)$". This is not a coherent exact sequence as displayed — exactness at $H^2(k, \mu_n)$ would force $\mathrm{Br}(k)[n] = 0$ (kernel of an injection), contradicting the conclusion immediately below ("$H^2(k, \mu_n) = \mathrm{Br}(k)[n]$ recovers the $n$-torsion"). The intended fragment of the Kummer LES, after invoking Hilbert 90 ($H^1(k, \bar k^\times) = 0$), is just $0 \to H^2(k, \mu_n) \to \mathrm{Br}(k) \xrightarrow{n} \mathrm{Br}(k)$, from which $H^2(k, \mu_n) = \mathrm{Br}(k)[n]$. The conclusion is right; the displayed sequence has a redundant $\mathrm{Br}(k)[n]\to H^2(k,\mu_n)$ leg that breaks exactness.

- **Bar widget degree-2 cocycle test scope** (lines 794–805): the inner triple loop has `if(sample>=4 && (a!=='σ' || b!=='σ' || c!=='σ')) continue;`, which skips both the printout AND the cocycle check `if(v!==0) isCoc=false` for triples beyond the first 4 + (σ,σ,σ). A 2-cochain that fails the cocycle identity only at, say, $(σ^2, σ^2, σ^2)$ would still be reported as "a 2-cocycle." Pedagogical-display limitation rather than a math error per se, but worth flagging because the verdict "→ φ is a 2-cocycle" can be wrong on a 2-cochain that fails cocyclicity outside the sampled triples.

### Minor nits (non-errors)

- Norm-element notation: page uses both $N(M)$ and $N\cdot M$ for the image of $N: M \to M$ — interchangeably. Standard.
- Quiz `h1-crossed-homs` q3 hint and explain are identical text (lines 122–123); minor polish.
- Periodic table widget displays the Herbrand quotient as a decimal `(Heven/Hodd).toFixed(4)` even though it's an integer ratio. Cosmetic.
- The §6 widget commentary for C3S3/F_3 (line 1101) correctly describes the answer ("fixed points of sign-acting $C_2$") even though the displayed table does not match — pedagogically the prose is a useful corrective, but the table needs to agree.

## Severity

**Three substantive math errors:**

1. **Quiz `h1-crossed-homs` q3 (Hilbert 90 witness)**: the offered correct answer $\alpha = 1+\beta$ produces $\bar\beta = \beta^{-1}$, not $\beta$. None of the four answer choices yields the right $\alpha$. The right answer is $\alpha = 1 + \bar\beta$ (or any scalar multiple, e.g. $\alpha = -2 + i$). The same off-by-inversion bug propagates into the §3 widget (every Pythagorean $\beta$ with $b \ne 0$ shows "Mismatch") and into the prose proof sketch (concludes $\sigma(\alpha)/\alpha = \beta^{-1}$ but the theorem statement says $\beta$).

2. **Periodic table widget descriptive note (line 512)**: claims $H^{\text{odd}} = 0$ for trivial action, contradicting both the formula $H^1(C_m, \mathbb{Z}/k) = \mathrm{Hom}(C_m, \mathbb{Z}/k) = \mathbb{Z}/\gcd(m, k)$ and the widget's own correct numerical output. The widget code is fine; only the explanatory text is wrong.

3. **LHS widget C3S3/F_3 case (lines 1043–1049)**: returns $\mathbb{F}_3$ on column 0 for every $q$, missing the residual $C_2$ sign action on odd-degree generators $\alpha, \alpha\beta^2, \ldots$ and on $\beta, \beta^3, \ldots$. Should return $0$ at $E_2^{0, q}$ for $q \in \{1, 2, 5, 6, \ldots\}$ (the entries where $C_2$ acts by $-1$). The accompanying prose commentary string describes the correct answer but the table doesn't reflect it; abutment from the displayed page incorrectly suggests $H^n(S_3, \mathbb{F}_3) = \mathbb{F}_3$ for every $n$ (true value is nonzero only on degrees $0, 3, 4, 7, 8, \ldots$).

**One additional cosmetic-but-confusing issue:** the H^2 widget inline note (line 456) has a typo "$1\cdot e \ne e$" that contradicts itself; the widget's actual output text is correct.

**One sequence-display issue:** the Kummer 4-term display in §7 (line 584) is not a valid exact sequence as written, though the conclusion below it is correct.

Everything else is solid: the bar resolution and coboundary formulas, the cyclic-group periodic resolution and table, the H^0 fixed-points calculator, the H^2 extension theorem and the $C_4$ vs $V_4$ widget output, the inflation-restriction five-term sequence, the LHS spectral sequence formula, the LHS widget for the F_2-coefficient cases and the C2C2/F_3 and C2C4/F_3 cases, the Brauer cheat sheet (algebraically closed, finite, local, real, global), the Kummer iso, the Hasse–Brauer–Noether sequence, and the Schur multiplier / classifying-space / Ext identifications.

The page's framework is mathematically right; the bugs are localized to (i) Hilbert 90 witness inversion (quiz + widget + prose all consistent in the wrong direction), (ii) one half of a hint sentence under the periodic-table widget, and (iii) one widget case (C3S3/F_3) where the C_2-action's sign component was overlooked.

### Suggested fixes

- **Quiz `h1-crossed-homs` q3 + §3 widget + Hilbert 90 prose**: pick a convention and stick to it.
  - Option A (keep $\beta = \sigma(\alpha)/\alpha$): change the answer choice in q3 to $\alpha = (8 - 4i)/5$ (or scalar multiple, with the explanation noting $\alpha = 1 + \bar\beta$); update the widget to use $\alpha = c(1 + \bar\beta) = (c+a) - bi$; rewrite the prose proof to start the sum with $\sigma^i(\beta^{-1})$ in place of $\sigma^i(\beta)$, or to construct $\alpha^{-1}$ instead of $\alpha$.
  - Option B (let H90 produce $\beta^{-1}$): rewrite the theorem statement as "every norm-one $\beta$ has the form $\beta = \alpha/\sigma(\alpha)$" (the equivalent dual form) — then $\alpha = 1 + \beta$ does work.

- **Periodic table widget note (line 512)**: replace "$H^{2k+1}=0$" with "$H^{2k+1}(C_m,\mathbb{Z}/k)=\mathbb{Z}/\gcd(m,k)$ as well; both even and odd degrees agree under trivial action." Or qualify with "when $\gcd(m,k) = 1$" if the goal was to highlight the coprime-order vanishing.

- **LHS widget C3S3/F_3** (entryFor function, lines 1043–1049): replace
  ```
  if(extKey==='C3S3' && modKey==='F3'){
    if(p===0) return 'F₃';
    return '0';
  }
  ```
  with column-0 entries that take the $C_2$-action's sign into account: return $\mathbb{F}_3$ at $(0,0), (0,3), (0,4), (0,7), \ldots$ (degrees $a + 2b$ with $a + b$ even, where $a \in \{0,1\}$, $b \geq 0$) and $0$ elsewhere on column 0. With $Q_{\max} = 3$ that's $\mathbb{F}_3$ at $(0,0), (0,3)$ and $0$ at $(0,1), (0,2)$.

- **H^2 widget inline note (line 456)**: replace "$=1\cdot e\ne e$ in $C_4$ but $s(\sigma)^2=$ (nontrivial element of $A$) $\ne e$" with "$=a\cdot s(e)=a\ne e$, so $s(\sigma)$ has order 4 and $E\cong C_4$." (Match the widget's own output text on line 953.)

- **Kummer 4-term display (line 584)**: replace with the cleaner three-term fragment $0 \to H^2(k, \mu_n) \to \mathrm{Br}(k) \xrightarrow{n} \mathrm{Br}(k)$, then state the conclusion $H^2(k, \mu_n) = \mathrm{Br}(k)[n]$.
