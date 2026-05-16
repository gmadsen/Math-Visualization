# schemes — math correctness audit (2026-05)

**Section:** Algebraic geometry

## Verified claims

### Spec(R), Zariski topology, residue fields

- **Definition** (line 221): "points are prime ideals of $R$"; topology via $V(I)$; "scheme = locally ring-isomorphic to $\Spec R$" — standard, correct.
- **Three motivations** (lines 224–226): (i) ring-to-field hom has prime kernel; (ii) $V(I)=\{\mathfrak p:I\subseteq\mathfrak p\}$ is closed; (iii) $\kappa(\mathfrak p)=\operatorname{Frac}(R/\mathfrak p)$ — all correct.
- **Zariski closure / specialization** (line 855): $\overline{\{\mathfrak p\}}=V(\mathfrak p)$, $\mathfrak p\leadsto\mathfrak q\iff\mathfrak p\subseteq\mathfrak q$ — correct.
- **Residue field formula** (line 1358): $\kappa(\mathfrak p)=\operatorname{Frac}(R/\mathfrak p)=R_{\mathfrak p}/\mathfrak p R_{\mathfrak p}$ — correct.
- **Residue field examples on $\mathbb Z[x]$** (line 1359): $\kappa((p,x-a))=\mathbb F_p$, $\kappa((0))=\mathbb Q(x)$, $\kappa((p))=\mathbb F_p(x)$ — all correct ($\mathbb Z[x]/(p,x-a)\cong\mathbb F_p$; $\mathbb Z[x]/(p)\cong\mathbb F_p[x]$).

### Spec ℤ (§2)

- Primes are $(0)$ and $(p)$; residue fields $\mathbb F_p$ and $\mathbb Q$; $n\bmod p$ is the value of $n$ at $(p)$ — correct.
- "$n$ vanishes at primes dividing $n$, with multiplicity = exponent" (line 260) — correct (the order of $n$ in the DVR $\mathbb Z_{(p)}$ is $v_p(n)$).
- Closure of $(0)$ = all of $\Spec\mathbb Z$ — correct.

### Spec k[x] (§3)

- Primes of $k[x]$ are $(0)$ and $(f)$ for $f$ monic irreducible — correct (PID).
- Over $\mathbb R$ irreducibles are linear or quadratic with negative discriminant; closed point of $\Spec\mathbb R[x]$ corresponding to such a quadratic has residue field $\mathbb C$ and "groups a conjugate pair" (lines 398, 431) — correct.
- Over $\mathbb F_p$ "closed point may have residue field $\mathbb F_{p^d}$" — correct (degree-$d$ irreducible gives $\mathbb F_{p^d}$).
- Widget: roots of $p(x)$ via Durand–Kerner; clustering for multiplicities; over $\mathbb F_q$ only degree-1 primes are drawn (with disclaimer at line 566) — correct and honestly disclaimed.

### Spec k[x,y] (§4)

- Three tiers: maximal ideals $(x-a,y-b)$ as closed points; height-one $(f)$ for irreducible $f$ as curves; $(0)$ as 2-d generic point (lines 653–656) — correct (this is the prime spectrum of a 2-dim regular UFD).
- Residue fields in §4 widget readout (lines 822–827): closed point κ = $k$; curve generic point κ = $\operatorname{Frac}(k[x,y]/(f))$; 2-dim generic κ = $k(x,y)$ — all correct.

### Specialization & Krull dimension (§5, §13)

- Specialization poset edges $(0)\to (\text{height-1})\to(\text{maximal})$ (lines 889–896) drawn correctly.
- Heuristic "smaller ideal ⇒ bigger point", "dim = longest specialization chain" (line 864) — correct.
- Parabola–circle intersection: $\alpha^2+\alpha^4=1$ (line 886) — correct (substitute $y=x^2$ into $x^2+y^2=1$).
- $\dim\Spec k=0$, $\dim\Spec\mathbb Z=1$, $\dim\Spec k[x_1,\ldots,x_n]=n$, $\dim\Spec\mathbb Z[x_1,\ldots,x_n]=n+1$, $\dim\mathbb P^n_k=n$ (lines 1507–1511) — all correct.
- $\dim X=\sup_x\dim\mathcal O_{X,x}$ for finite-dimensional $X$ (line 1504) — correct.

### Fat points & nilpotents (§6)

- $\Spec\mathbb C[x]/(x^n)$ has the same underlying space (single point $(x)$) but length $n$ (line 999) — correct.
- "$D_n\to X$ = point of $X$ + $(n{-}1)$-jet of a curve through it" (line 1000) — correct (e.g., $D_2$-points are tangent vectors).
- $\Spec\mathbb C[x,y]/(x^2,xy,y^2)$ = full 2-dim tangent space, length 3 (line 1016) — correct (basis $1,x,y$).
- $\Spec\mathbb C[x,y]/(x^2,y)$ = length-2 arrow in $x$-direction (lines 1016, 1455) — correct (basis $1,x$).
- Widget readout (line 1139) labels truncation coefficients as $p(0),p'(0),p''(0)/2!$ — correct (the $i$-th coeff of the Taylor series is $p^{(i)}(0)/i!$).

### Gluing / ℙ¹ (§7)

- $\mathbb P^1$ from $\Spec k[x]\sqcup\Spec k[y]$ glued along $\Spec k[x,x^{-1}]\cong\Spec k[y,y^{-1}]$ via $y=1/x$ (line 1152) — correct.
- Widget: stereographic from north pole, $x=\tan(\varphi/2)$ with $\varphi=\theta+\pi/2$; verifies $\varphi=0\Rightarrow x=0$, $\varphi=\pi\Rightarrow\infty$, $\varphi=\pm\pi/2\Rightarrow\pm 1$ (lines 1265–1278) — derivation checks out, and `x*y` should be $1$ on the overlap (line 1321) — correct.

### Generic points (§8)

- In $\Spec\mathbb Z[x]$: closure of $(x)$ = $V((x))$ corresponds to $\Spec\mathbb Z[x]/(x)=\Spec\mathbb Z$, the "$x=0$ axis" (line 1350) — correct. $(0)$ has closure all of $\Spec\mathbb Z[x]$ — correct ($\mathbb Z[x]$ is a domain).
- Generic-point philosophy (line 1351): smooth/reduced/irreducible at the generic point ⇒ on a dense open — correct (these are constructible-locus statements).

### Locally ringed spaces (§10)

- Stalk on $\Spec R$ at $\mathfrak p$ is $R_{\mathfrak p}$, local with maximal ideal $\mathfrak p R_{\mathfrak p}$ (line 1386) — correct.
- "Scheme = locally ringed space locally isomorphic to $\Spec$ of a ring" — correct standard invariant definition.
- Locality of stalk maps (line 1387) — correct; without it $\Spec$ wouldn't be fully faithful into LRS.
- "$\Spec$ is a fully faithful contravariant functor $\mathsf{CRing}\to\mathsf{LRS}$" (line 1387) — correct (this is the equivalence $\mathsf{Aff}^{\mathrm{op}}\simeq\mathsf{CRing}$ at the LRS level).

### Proj (§11)

- $\operatorname{Proj}S$ = homogeneous primes not containing the irrelevant ideal $S_+=\bigoplus_{d>0}S_d$ (line 1401) — correct.
- $D_+(f)\cong\Spec(S_f)_0$ for homogeneous $f$ of positive degree (line 1401) — correct.
- $\operatorname{Proj}k[x_0,\ldots,x_n]\cong\mathbb P^n_k$ via $D_+(x_i)\cong\Spec k[x_0/x_i,\ldots,x_n/x_i]$ (line 1402) — correct.
- "Every projective scheme = $\operatorname{Proj}S$ for some graded ring; conversely any f.g. graded $k$-algebra ⇒ projective scheme" (line 1403) — correct (the standard definition of "projective" is "admits a closed immersion into some $\mathbb P^n$", equivalently $\operatorname{Proj}$ of a finitely generated graded algebra in degrees $\ge 0$).

### Closed subschemes (§12)

- Closed subscheme of $\Spec R$ ↔ ideal $I\subseteq R$; underlying space $V(I)=V(\sqrt I)$; ring $R/I$ remembers $I$ exactly (line 1416) — correct.
- Reduced subscheme = $\Spec(R/\sqrt I)$ (line 1418) — correct.
- "$\Spec R$ irreducible iff nilradical is prime iff $R$ has unique minimal prime" (line 1419) — correct (nilradical = $\bigcap$ minimal primes).
- Minimal primes ↔ irreducible components, $\Spec R=\bigcup V(\mathfrak p_i)$ (line 1419) — correct (standard for Noetherian / general primary decomposition).
- $k[x,y]/(xy)$: minimal primes $(x),(y)$, two axes meeting at $(x,y)$ (line 1420) — correct.
- $k[x,y]/(x^2,y)$: radical $(x,y)$, single reduced point but length 2 (line 1420) — correct.
- Widget panels (lines 1449–1473): $(x,y)$ length 1 reduced; $(x^2,y)$ length 2 ($1,x$); $(x^2,xy,y^2)$ length 3 ($1,x,y$); $(xy)$ two reduced components — all correct.
- "$T_pX=\Hom_k(\mathfrak m/\mathfrak m^2,k)$" (line 1427) — correct (Zariski tangent space).

### Fibers (§14)

- $X_y = X\times_Y\Spec\kappa(y) = \Spec(B\otimes_A\kappa(y))$ when $X=\Spec B,Y=\Spec A$ (line 1532) — correct.
- $\Spec\mathbb Z[x]\to\Spec\mathbb Z$: fiber over $(p)$ is $\Spec\mathbb F_p[x]=\mathbb A^1_{\mathbb F_p}$; over $(0)$ is $\Spec\mathbb Q[x]=\mathbb A^1_{\mathbb Q}$ (lines 1534–1535) — correct (since $\mathbb Z[x]\otimes_{\mathbb Z}\mathbb F_p=\mathbb F_p[x]$ and $\mathbb Z[x]\otimes_{\mathbb Z}\mathbb Q=\mathbb Q[x]$).

## Wrong / dubious claims

- **None of substance.** Every formula, prime-ideal computation, residue-field identification, dimension claim, and widget-rendered example checks out against standard references (Hartshorne, Vakil's *Foundations*).

## Underspecified or unverifiable claims

- **"Geometric points over an algebraically closed field correspond to maximal ideals with residue field $k$"** (line 1360). True for finitely-generated $k$-algebras over an algebraically closed $k$ (Nullstellensatz). For general rings, a $k$-valued point $R\to k$ has prime (not necessarily maximal) kernel; $k$-points correspond to maximal ideals whose residue field embeds into $k$. The page elides "finite type" — standard introductory shorthand.
- **Section 5 widget node `(x − α, y − α²)`** (lines 886–887). The label "(one real point, $\alpha^2+\alpha^4=1$)" is mathematically correct, but the diagram only renders 2 of the 4 intersection points (the two real ones); the disclaimer is implicit. Not a math error — the widget says "draw a tractable subset" at line 876.
- **"Properties at the generic point hold on a dense open"** (line 1351) lists smooth, reduced, irreducible. Smoothness and reducedness do propagate to a dense open under standard finiteness hypotheses (e.g., for finite-type schemes over a field); "irreducibility" holds at the generic point of an irreducible scheme tautologically, and the propagation phrasing is informal. Standard introductory shorthand.
- **Coverage gap vs. audit prompt.** The page does *not* discuss: $\Spec(R)$ for $R$ a DVR explicitly (the fact that it has exactly two points — closed point + generic point — and the "$\Spec(\text{DVR})$ = arc joining special and generic" picture); morphism = ring-hom-in-opposite-direction is implicit in §10 (locally ringed, $\Spec$ contravariant) but never stated as a clean dictionary; $S$-schemes / schemes-over-a-base; the properties separated / proper / finite / flat / smooth / étale; the functor-of-points perspective ($X(R)=\Hom_{\mathsf{Sch}}(\Spec R,X)$). These are absent rather than wrong. The structure sheaf $\mathcal O_X$ is named in §10 but its construction (gluing localizations $R_f$ on basic opens $D(f)$) is not given.

## Severity

**clean.** No mathematical errors. Every prime-ideal description, residue field, fiber computation, dimension assertion, and widget computation is correct. Two minor scope annotations (Nullstellensatz-flavored "$k$-points = maximal ideals" applies in finite-type setting; "properties at generic point spread to dense open" needs finiteness hypotheses) are standard introductory elisions, not errors. The audit prompt's coverage list (DVR, structure sheaf construction, S-schemes, separated/proper/finite/flat/smooth/étale, functor of points) is mostly absent from the page; that's a content-scope finding, not a correctness one — flagging it under "underspecified" so the gap is visible.
