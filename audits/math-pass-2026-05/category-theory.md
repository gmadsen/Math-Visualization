# category-theory — math correctness audit (2026-05)

**Section:** Algebra & homological

## Verified claims

### Definitions and basic structure (§1)

- **Category axioms** (lines 274–280): class of objects, $\Hom$-sets, associative composition, two-sided identities — standard Eilenberg–Mac Lane formulation.
- **Set / Grp / Ab / Ring / Top / Vect_k / Sch as categories** (lines 287–294): all correct standard examples; Ring is specified as commutative, unital with $1$-preserving morphisms (matches the Sch row, since $\Spec$ uses commutative rings).
- **Poset as a category** (line 299): $\Hom(x,y)$ singleton iff $x\le y$, else empty; composition forced by transitivity, identity by reflexivity — correct.
- **One-object category $\mathcal{B}G$ for a group $G$** (line 301): $\Hom(\ast,\ast)=G$, composition = group multiplication; functor $\mathcal{B}G\to\mathsf{Set}$ = $G$-set; functor $\mathcal{B}G\to\mathsf{Vect}_k$ = $k$-representation — all correct.
- **Monoid as one-object category; groupoid = invertible-only** (line 303) — standard, correct.
- **Composition table for the 3-object category $\{A\xrightarrow{f}B\xrightarrow{g}C, h=g\circ f\}$** (lines 354–360): all 10 entries (3 identities + 6 left/right-unit cases + the single non-trivial composite $g\circ f=h$) are correct, and the composability check `left.src !== right.tgt` correctly rejects non-composable pairs.
- **Isomorphism = morphism with two-sided inverse** (line 456): correct; specializes to bijection in Set, homeomorphism in Top, group iso in Grp — standard.
- **Opposite category** (line 458): $\Hom_{\mathcal{C}^{\mathrm{op}}}(A,B)=\Hom_{\mathcal{C}}(B,A)$ — correct.

### Functors (§2)

- **Functor laws** (line 466): $F(g\circ f)=F(g)\circ F(f)$, $F(\mathrm{id}_A)=\mathrm{id}_{F(A)}$ — correct.
- **Contravariant functor** (line 467): equivalent to a covariant functor $\mathcal{C}^{\mathrm{op}}\to\mathcal{D}$, satisfies $F(g\circ f)=F(f)\circ F(g)$ — correct.
- **Forgetful $U:\mathsf{Grp}\to\mathsf{Set}$ is faithful but not full** (line 471) — correct (e.g., the unique $\mathbb{Z}/2 \to \mathbb{Z}/2$ that is the identity on the underlying set is the identity homomorphism, but full would require all set-functions to lift, which fails).
- **Free $F:\mathsf{Set}\to\mathsf{Grp}$ is left-adjoint to $U$** (line 472) — correct.
- **$\pi_1: \mathsf{Top}_*\to\mathsf{Grp}$ is a functor** (line 473) — correct; functoriality is what proves $S^1$ is not contractible (pullback contradiction with $\pi_1(S^1)=\mathbb{Z}\ne 0$).
- **Hom-functors** (line 474): $\Hom(A,-)$ covariant; $\Hom(-,A)$ contravariant — correct.
- **Abelianization $\mathsf{Grp}\to\mathsf{Ab}$ left-adjoint to inclusion** (line 475) — correct.
- **$\Spec: \mathsf{CRing}\to\mathsf{Sch}$ contravariant** (line 476) — correct.
- **Walking-arrow category $\mathbf{2}$** (line 479): a functor $\mathbf{2}\to\mathcal{D}$ is exactly a morphism in $\mathcal{D}$; functor out of the span shape gives pullback data — correct.

### Natural transformations (§3)

- **Naturality square** (line 629): $\eta_B\circ F(f)=G(f)\circ\eta_A$ — correct.
- **$\mathrm{ev}_V: V\to V^{**}$ is natural in $V$** (lines 633–636): the equation $\mathrm{ev}_W\circ f = f^{**}\circ\mathrm{ev}_V$ expresses naturality of $\mathrm{ev}: \mathrm{id}\Rightarrow(-)^{**}$ — correct.
- **No natural iso $\mathrm{id}\Rightarrow(-)^*$** (line 636): correct in the strong sense — $(-)^*$ is contravariant whereas $\mathrm{id}$ is covariant, so a natural transformation between them would require choosing variance; even on finite-dimensional spaces no natural iso exists. (The hard-tier quiz q at line 110 phrases the same point as a contravariance/variance mismatch — also correct.)
- **Naturality square widget** (lines 753–763): with $F=\Hom(X,-)$, $G=\Hom(Y,-)$, $\eta=u^*$ and $u(y)=x_1$:
  - blue route at $\varphi$: $f(\varphi(x_1))$ via $F(f)$ then $\eta_B$ — correctly computed as `fphi[0] = f[phi[0]]`.
  - pink route at $\varphi$: $f(\varphi(x_1))$ via $\eta_A$ then $G(f)$ — correctly computed as `f[leftIdx]` with `leftIdx = phi[0]`.
  - Always agree, as naturality demands. The widget's "agree" check is sound.
- **Functor category $[\mathcal{C},\mathcal{D}]$** (line 849): standard, correct.

### Yoneda (§4 and §10)

- **Representable functor** $h_X = \Hom_{\mathcal{C}}(-,X) : \mathcal{C}^{\mathrm{op}}\to\mathsf{Set}$ (line 857): on objects $h_X(C)=\Hom(C,X)$, on $g:C'\to C$ in $\mathcal{C}$, $h_X(g):\Hom(C,X)\to\Hom(C',X)$, $\varphi\mapsto\varphi\circ g$ — correct (this is the standard contravariant-functor formulation, where the morphism $g$ is in $\mathcal{C}$ and the resulting map of hom-sets is reversed).
- **Yoneda lemma (contravariant)** (line 860): $\Phi:\mathrm{Nat}(h_X, F)\xrightarrow{\cong}F(X)$, $\eta\mapsto\eta_X(\mathrm{id}_X)$, with inverse $x\mapsto(\varphi\mapsto F(\varphi)(x))$, natural in $X$ and $F$ — correct standard statement (also restated in §10).
- **Three consequences of Yoneda** (lines 866–868):
  1. Yoneda embedding $h_{(-)}:\mathcal{C}\hookrightarrow\mathsf{Fun}(\mathcal{C}^{\mathrm{op}},\mathsf{Set})$ is fully faithful, with $\mathrm{Nat}(h_X,h_Y)\cong\Hom(X,Y)$ from $F=h_Y$ — correct.
  2. $X\cong Y$ iff $h_X\cong h_Y$ — correct (forward: functorial; reverse: by full faithfulness).
  3. Representability $F\cong h_X$ uniquely determines $X$ — correct.
- **Proof of Yoneda's bijectivity** (§10, lines 1986–1989): the injectivity argument uses naturality of $\eta$ at $\varphi=\mathrm{id}_X\circ\varphi$ to recover $\eta_C(\varphi)=F(\varphi)(\eta_X(\mathrm{id}_X))$; surjectivity defines $\eta^x_C(\varphi)=F(\varphi)(x)$ and verifies $\Phi(\eta^x)=F(\mathrm{id}_X)(x)=x$ via $F(\mathrm{id}_X)=\mathrm{id}_{F(X)}$. Both arguments are standard and correct.
- **Yoneda widget (poset $\bot<M<\top$)** (lines 914–999): $h_X(C)=\{\bullet\}$ if $C\le X$, empty otherwise — correct (downward-closed indicator of $X$). For each $C\le X$, the natural-transformation component sends the unique arrow $C\to X$ to the appropriate restriction $F(X)\to F(C)$, computed by composing the chain of restrictions `rho21`, `rho10` over the steps from $X$ down to $C$ — correct.
- **Section-10 widget recap** (lines 2036–2049): same restriction-chain logic; the "Yoneda dictionary" output matches the lemma.

### Limits and colimits (§5 and §11)

- **Diagram, cone, limit definitions** (lines 1011, 2141): a cone is a natural transformation $\Delta L\Rightarrow D$ from the constant diagram; the limit is the terminal cone — standard, correct. Dual statements for colimit (initial cocone) — correct.
- **Limit-as-representation** (line 2143): $\varprojlim D$ represents $A\mapsto\mathrm{Nat}(\Delta A, D)$ — correct.
- **Limit table** (lines 1015–1023):
  - empty diagram → terminal / initial — correct.
  - discrete two-object diagram → product / coproduct — correct.
  - parallel pair $\bullet\rightrightarrows\bullet$ → equalizer / coequalizer — correct.
  - cospan → pullback (limit only); span → pushout (colimit only) — correct.
- **Pullback in Set** (line 1027): $X\times_Z Y=\{(x,y)\in X\times Y : f(x)=g(y)\}$ — correct.
- **Pullback widget** (lines 1109–1221): enumerates all $(i,j)\in[n_X]\times[n_Y]$ with $f(i)=g(j)$ — correct. Fiber decomposition $|X\times_Z Y|=\sum_z |f^{-1}(z)|\cdot|g^{-1}(z)|$ at line 1220 — correct (the pullback of two surjections to $Z$ decomposes as a disjoint union over $z$ of $f^{-1}(z)\times g^{-1}(z)$).
- **Fiber product in Sch** (line 1029): $X\times_Z Y$ as the scheme whose $R$-points are pairs of $R$-points agreeing in $Z$ — correct (this is the functor-of-points characterization).
- **Pushout in Set** (line 2151): $A\sqcup_C B = (A\sqcup B)/\sim$ where $\sim$ is generated by $f(c)\sim g(c)$ for $c\in C$ — correct.
- **Pushout widget union-find** (lines 2225–2237): correctly identifies $f(i)$ in $A$ with $g(i)$ in $B$ for each $i\in C$ via union-find on the disjoint union — correct.

### Adjoint functors (§6 and §12)

- **Adjunction definition** (line 1250): natural iso $\Hom_{\mathcal{D}}(F(A),B)\cong\Hom_{\mathcal{C}}(A,G(B))$ — correct.
- **Unit/counit packaging with triangle identities** (line 1251, restated at 2345): $\eta:\mathrm{id}_{\mathcal{C}}\Rightarrow GF$, $\varepsilon:FG\Rightarrow\mathrm{id}_{\mathcal{D}}$, with $(\varepsilon F)\circ(F\eta)=\mathrm{id}_F$ and $(G\varepsilon)\circ(\eta G)=\mathrm{id}_G$ — correct standard formulation.
- **Adjunction zoo** (lines 1259–1264):
  - Free $\dashv$ forgetful for groups: $\Hom_{\mathsf{Grp}}(F(X),G)\cong\Hom_{\mathsf{Set}}(X,UG)$ — correct.
  - Abelianization $\dashv$ inclusion: $\Hom_{\mathsf{Ab}}(G^{\mathrm{ab}},A)\cong\Hom_{\mathsf{Grp}}(G,A)$ — correct.
  - Currying: $(-)\times A\dashv\Hom(A,-)$ in Set, $\Hom(X\times A,Y)\cong\Hom(X,\Hom(A,Y))$ — correct (cartesian closure of Set).
  - Tensor-hom: $(-)\otimes_R M\dashv\Hom_R(M,-)$ — correct (with the standard caveat that for non-commutative $R$, $M$ should be a bimodule, left implicit).
  - $\pi_0\dashv\mathrm{disc}$ on Top↔Set: continuous maps from $X$ to a discrete set $Y$ correspond to functions $\pi_0(X)\to Y$ — correct (this is the leftmost link in the chain $\pi_0\dashv\mathrm{disc}\dashv U\dashv\mathrm{codisc}$).
  - $\Gamma\dashv\Spec$ on Sch / CRing: $\Hom(X,\Spec R)\cong\Hom_{\mathsf{Ring}}(R,\mathcal{O}(X))$ — correct (this is the universal property characterizing $\Spec$; holds for arbitrary schemes $X$, not just affine, with $\mathcal{O}(X)=\Gamma(X,\mathcal{O}_X)$).
- **Free group concretely** (lines 1271–1273): reduced words in $\{x_i^{\pm 1}\}$ with no adjacent cancellation; the universal extension formula $\tilde f(x_{i_1}^{\epsilon_1}\cdots x_{i_k}^{\epsilon_k})=f(x_{i_1})^{\epsilon_1}\cdots f(x_{i_k})^{\epsilon_k}$ — correct.
- **Free group widget** (lines 1379–1485): generates reduced words by avoiding immediate inverse-cancellation (`if(last!==null && last===-c) continue`) — correct. Evaluation `evalExt` recursively applies group multiplication with sign-aware inverse application — correct. Group implementations:
  - $\mathbb{Z}/n$: addition mod $n$, $\mathrm{inv}(a)=(n-a)\bmod n$ — correct.
  - $\mathbb{Z}$: integer addition, $\mathrm{inv}(a)=-a$ — correct.
  - $S_3$: permutations as one-line-notation arrays; `mult(a,b) = a.map((_,i)=>a[b[i]])` computes $(a\cdot b)(i)=a(b(i))$, function composition with $b$ applied first — standard convention, correct. `inv(a)` builds the inverse permutation by inverting the index map — correct.
  - $\mathbb{Z}/2\times\mathbb{Z}/2$: componentwise addition mod 2 — correct.
- **Triangle equation in §12 widget** (lines 2503–2511): for $f:A\to U(G)$ chosen by $f(x_i)=i\bmod n$, the check $U(\tilde f)\circ\eta_A(x_i)=f(x_i)$ verifies the universal extension agrees with the original $f$ on generators — correct, and this is one of the two triangle identities applied componentwise.
- **Counit description** (line 2354 etc.): $\varepsilon_G:FU(G)\to G$ is "evaluation of words" — correct (the unique homomorphism extending $\mathrm{id}_{U(G)}:U(G)\to U(G)$).
- **Universal-elements characterization** (line 1763): a representation $F\cong h_X$ corresponds by Yoneda to $u\in F(X)$ such that every $y\in F(C)$ is $F(\varphi)(u)$ for a unique $\varphi:C\to X$ — correct.

### Universal properties (§8)

- **Universal-property explorer table** (lines 1801–1832):
  - Product $A\times B$ represents $C\mapsto\Hom(C,A)\times\Hom(C,B)$, universal element = $(\pi_A,\pi_B)$ — correct.
  - Coproduct $A\sqcup B$ represents $C\mapsto\Hom(A,C)\times\Hom(B,C)$, universal element = $(\iota_A,\iota_B)$ — correct.
  - Free group $F(S)$ represents $G\mapsto\Hom_{\mathsf{Set}}(S,U(G))$, universal element = $\eta_S:S\to U(F(S))$ — correct.
  - Tensor product $M\otimes_R N$ represents $P\mapsto\mathrm{Bilin}_R(M\times N,P)$, universal element = canonical bilinear $\otimes:M\times N\to M\otimes N$ — correct.
  - Abelianization $G^{\mathrm{ab}}=G/[G,G]$ represents the restriction of $\Hom_{\mathsf{Grp}}(G,-)$ to abelian targets — correct.
- **Pullback-square diagram editor** (lines 1851–1908): declares the commutativity $\pi_A;f=\pi_B;g$ (i.e., $f\circ\pi_A=g\circ\pi_B$) — correct.

### Proof stepper (§7)

- **Identity-uniqueness proof** (lines 1532–1559): $e\circ e' = e'$ (because $e$ is left-id at $A$, applied to $e':A\to A$) and $e\circ e' = e$ (because $e'$ is right-id, applied to $e:A\to A$); combine to get $e=e'$ — correct.
- **Initial-objects-unique-up-to-unique-iso** (lines 1562–1595): both $g\circ f$ and $\mathrm{id}_I$ are arrows $I\to I$, and initiality forces a unique such arrow, so $g\circ f=\mathrm{id}_I$. Symmetric: $f\circ g=\mathrm{id}_J$. Hence $f$ is iso, and uniqueness of $f:I\to J$ from initiality makes the iso canonical — correct.
- **Products-unique-up-to-unique-iso** (lines 1599–1648): unique $u:P\to Q$ with $\rho_i u=\pi_i$ from $Q$'s UP, unique $v:Q\to P$ with $\pi_i v=\rho_i$ from $P$'s UP; check $\pi_i(vu)=\pi_i$ and apply uniqueness in $P$'s UP to get $vu=\mathrm{id}_P$; symmetric for $uv=\mathrm{id}_Q$ — correct.

### Monoidal categories (§9)

- **Monoidal category data** (line 1918): $\otimes$, unit $I$, associator $\alpha$, left/right unitors $\lambda,\rho$, satisfying pentagon and triangle — correct.
- **Mac Lane's coherence theorem** (line 1919): every diagram built from $\alpha,\lambda,\rho,\mathrm{id}$ commutes — correct (and equivalent to the strictification statement).
- **Examples** (line 1921): $(\mathsf{Set},\times,\{*\})$, $(\mathsf{Vect}_k,\otimes_k,k)$, $(R\text{-Mod},\otimes_R,R)$, $(\mathsf{Top},\times,*)$, $(\mathsf{Ch}(R),\otimes,R[0])$, $(\mathrm{End}(\mathcal{C}),\circ,\mathrm{id})$ — all correct (with the standard convention that $R\text{-Mod}\otimes_R$ is monoidal for commutative $R$, and bimodule-flavored otherwise, left implicit).
- **Symmetric vs braided** (line 1921): symmetric requires $\sigma_{B,A}\circ\sigma_{A,B}=\mathrm{id}$ plus a hexagon; braided requires only the hexagons (so $\sigma^2\ne\mathrm{id}$ in general). Quantum-group representation categories as braided source of knot invariants — correct.
- **Monoid-object-in-monoidal-category dictionary** (lines 1957–1962):
  - $(\mathsf{Set},\times)$ → ordinary monoid — correct.
  - $(\mathsf{Ab},\otimes_{\mathbb{Z}})$ → ring — correct.
  - $(\mathsf{Vect}_k,\otimes_k)$ → $k$-algebra — correct.
  - $(R\text{-Mod},\otimes_R)$ → $R$-algebra — correct.
  - $(\mathsf{Top},\times)$ → topological monoid — correct.
  - $(\mathrm{End}(\mathcal{C}),\circ)$ → monad — correct.

### Monads and algebras (§13)

- **Monad axioms** (line 2525): $\mu\circ T\mu=\mu\circ\mu T$ (associativity), $\mu\circ T\eta=\mu\circ\eta T=\mathrm{id}_T$ (unit) — correct.
- **Monad from adjunction** (line 2525): $T=UF$, $\mu=U\varepsilon F$ — correct.
- **$T$-algebra axioms** (line 2528): $\alpha\circ\eta_A=\mathrm{id}_A$, $\alpha\circ T\alpha=\alpha\circ\mu_A$ — correct standard EM definition.
- **Eilenberg–Moore for free-monoid monad gives monoids; for free-group monad gives groups** (line 2528) — correct (both forgetful functors are monadic by Beck's theorem).
- **Kleisli category** (line 2531): same objects, $\Hom_{\mathcal{C}_T}(A,B)=\Hom_{\mathcal{C}}(A,T(B))$, composition $g\circ_K f=\mu_C\circ T(g)\circ f$ — correct.
- **Maybe-monad Kleisli composition** (lines 2666–2675): if $f(x)=\bot$ then composite is $\bot$, else $g(f(x))$ — correct (Maybe propagates failure).
- **List-monad Kleisli composition** (lines 2676–2683): for $f(x)=[y_1,\dots,y_k]$, composite is $[g(y_1)\cdots g(y_k)]$ flattened — correct ($\mu$ = concatenation).

### Kan extensions (§14)

- **Definitions** (line 2719): $\mathrm{Lan}_K F$ universal under natural-transformation extension; equivalently $\mathrm{Lan}_K\dashv(-)\circ K$ — correct.
- **Pointwise formula** (line 2722): $\mathrm{Lan}_K F(b)=\mathrm{colim}((K\downarrow b)\to\mathcal{A}\xrightarrow{F}\mathcal{C})$ for $\mathcal{C}$ cocomplete and $\mathcal{A}$ small — correct.
- **Limits/colimits as Kan extensions along $\mathcal{J}\to\mathbf{1}$** (line 2723) — correct.
- **Kan widget setup**: $\mathcal{A}=\{0,1\}$ discrete, $\mathcal{B}=0\to M\to 2$ poset, $K(0)=0$, $K(1)=2$, $F(0)=\{p,q\}$, $F(1)=\{r\}$.
  - **Lan computations** (lines 2806, 2833–2837):
    - $b=0$: $(K\downarrow 0)$ contains only $(0,\mathrm{id}_0)$ since there is no arrow $K(1)=2\to 0$ in $\mathcal{B}$; colimit $=F(0)=\{p,q\}$. ✓
    - $b=M$: $(K\downarrow M)$ contains only $(0, 0\to M)$; colimit $=F(0)=\{p,q\}$. ✓
    - $b=2$: $(K\downarrow 2)$ contains $(0, 0\to 2)$ and $(1, \mathrm{id}_2)$ as two separate objects (no morphisms between them since $\mathcal{A}$ is discrete); colimit over discrete two-object diagram = coproduct $F(0)\sqcup F(1)=\{p,q,r\}$. ✓
  - **Ran computations** (lines 2807, 2840–2844):
    - $b=0$: $(0\downarrow K)$ contains $(0,\mathrm{id}_0)$ and $(1, 0\to 2)$ (both arrows $0\to K(0)$ and $0\to K(1)$ exist); limit over discrete two-object = product $F(0)\times F(1)$, size $2\cdot 1=2$. ✓
    - $b=M$: only $(1, M\to 2)$ since no arrow $M\to 0$; limit $=F(1)=\{r\}$. ✓
    - $b=2$: only $(1,\mathrm{id}_2)$; limit $=F(1)=\{r\}$. ✓
- **Density theorem** (quiz line 716): every presheaf $F$ is canonically a colimit of representables, $F\cong\mathrm{colim}(\mathrm{el}(F)\to\mathcal{C}\xrightarrow{h_-}\mathsf{PSh}(\mathcal{C}))$ — correct (standard co-Yoneda / density).

### 2-categories (§15)

- **2-category structure** (line 2858): objects, 1-cells, 2-cells with vertical and horizontal composition, governed by interchange — correct.
- **$\mathsf{Cat}$ as the archetypal 2-category** — correct.
- **Vertical composition $\beta\cdot\alpha$ component-wise = $\beta_A\circ\alpha_A$** (line 2910) — correct.
- **Horizontal composition formula** (line 2932): for $\alpha:f\Rightarrow g$ on $A\to B$ and $\alpha':f'\Rightarrow g'$ on $B\to C$, the component $(\alpha*\alpha')_A:f'(f(A))\to g'(g(A))$ equals both
  - $g'(\alpha_A)\circ\alpha'_{f(A)}$ (apply $\alpha'$ at $f(A)$ first, then $g'$ to $\alpha_A$), and
  - $\alpha'_{g(A)}\circ f'(\alpha_A)$ (apply $f'$ to $\alpha_A$ first, then $\alpha'$ at $g(A)$).
  
  Both routes agree by naturality of $\alpha'$ applied to the morphism $\alpha_A:f(A)\to g(A)$ — this is the interchange / Godement law, correct.

### Enriched categories (§16)

- **Enriched-category axioms** (lines 2949–2952): hom-objects $\mathcal{C}(A,B)\in\mathcal{V}$, composition morphism in $\mathcal{V}$, identity $I\to\mathcal{C}(A,A)$, associativity / unit as commutative diagrams in $\mathcal{V}$ — correct.
- **Enriched-category dictionary** (lines 2959–2964):
  - $(\mathsf{Set},\times,*)$ → ordinary category — correct.
  - $(\mathsf{Ab},\otimes_{\mathbb{Z}},\mathbb{Z})$ → pre-additive (Ab-)category with bilinear composition — correct.
  - $(\mathsf{Cat},\times,\mathbf{1})$ → strict 2-category — correct.
  - $(\mathsf{Top},\times,*)$ → topologically enriched category — correct.
  - $([0,\infty],\ge,+,0)$ → metric space (Lawvere 1973) — correct.
- **Lawvere metric-space derivation** (lines 2967–2974):
  - Composition $\mathcal{C}(B,C)\otimes\mathcal{C}(A,B)\to\mathcal{C}(A,C)$ becomes $d(B,C)+d(A,B)\geq d(A,C)$ (since the monoidal product is $+$ and morphisms in $\mathcal{V}$ are reverse-inequalities) — i.e., the triangle inequality. ✓
  - Identity $I\to\mathcal{C}(A,A)$: $0\geq d(A,A)$, combined with $d\ge 0$, gives $d(A,A)=0$. ✓
  - Symmetry not required — correct (Lawvere's framework allows directed metrics).

### Quiz bank claims (cross-checked against the prose)

- **Hard-tier quiz** "no natural iso $\mathrm{id}\Rightarrow(-)^*$ because $(-)^*$ is contravariant" (line 110) — correct.
- **Hard-tier** "left adjoint may not reflect limits" example: $F:\mathsf{Set}\to\mathsf{Grp}$ free group, $F(X\times Y)\ne F(X)\times F(Y)$ in $\mathsf{Grp}$ (line 270) — correct (the free group on a 2-element set is the rank-2 free group, while $F(\{a\})\times F(\{b\})\cong\mathbb{Z}\times\mathbb{Z}$, which is rank-2 free abelian, very much smaller than $F_2$).
- **Hard-tier** Catalan numbers $C_3=5$ and $C_4=14$ for bracketings of 4- and 5-fold tensors (lines 317, 350) — correct: $C_3=\binom{6}{3}/4=20/4=5$, $C_4=\binom{8}{4}/5=70/5=14$.
- **Yoneda regular $S_3$-set** (line 428): $|S_3|=6$, and Yoneda gives $|\mathrm{Nat}(h_*,F)|=|F(*)|=6$ — correct.
- **Discrete-monad** (line 624): words in $\{a\}$ of length $\le 3$ are $\{\varepsilon, a, aa, aaa\}$, count 4 — correct.
- **Discrete-disc adjunction** (line 588): $|\Hom_{\mathsf{Top}}(D(X),Y)|=|U(Y)|^{|X|}=3^2=9$ — correct (every function from a discrete space is continuous).
- **Pullback fiber count** (line 475): $|X\times_Z Y|$ with the given $f,g$ has fiber over $0$ of size $2\cdot 1=2$ and fiber over $1$ of size $2\cdot 1=2$, total $4$ — correct.
- **Coequalizer collapse** (line 514): with $f(1)=x,g(1)=y$, $f(2)=y,g(2)=z$, $f(3)=z,g(3)=w$ in $B=\{x,y,z,w\}$, the relations $x\sim y\sim z\sim w$ collapse $B$ to one class — correct, count 1.
- **Triangle inequality bound** (line 880): $d(A,C)\le d(A,B)+d(B,C)=2+3=5$ — correct.

## Wrong / dubious claims

- **None of substance.** The page's mathematical content is technically clean throughout. Every formula, computation, and theorem statement I checked matches the standard formulation. The widget computations (Yoneda restrictions, pullback fiber decomposition, pushout union-find, Kleisli composition, Kan extension over the specific small example) are all correct.

## Underspecified or unverifiable claims

- **Tensor-Hom adjunction $(-)\otimes_R M\dashv\Hom_R(M,-)$** (line 1262). The page leaves implicit the bimodule conditions needed when $R$ is non-commutative. For $R$ commutative, the stated form is correct as written. For non-commutative $R$, $M$ would need to be a bimodule of appropriate types (e.g., $M$ an $(R,S)$-bimodule, then $-\otimes_R M : R\text{-Mod}\to S\text{-Mod}$, with $\Hom_S(M,-) : S\text{-Mod}\to R\text{-Mod}$ as right adjoint). The page's treatment is the standard introductory shorthand and not a math error per se.
- **Monoidal categories $(R\text{-Mod},\otimes_R,R)$** (line 1921, 1933). Same caveat: this is monoidal in the standard sense only when $R$ is commutative. For non-commutative $R$, one needs to work with $R$-bimodules and the monoidal structure changes. Standard textbook elision.
- **Counit surjectivity caveat** (line 2512). The widget readout says: "for $G$ abelian, $F(U(G))$ surjects onto $G$ via word-sum." In fact $\varepsilon_G$ is always surjective (every $g\in G$ is the image of the one-letter word $[g]$), regardless of whether $G$ is abelian. The "for $G$ abelian" qualifier is needlessly restrictive — the abelian case just allows describing the map computationally as "word-sum." Minor wording issue, not an error.
- **Section 4 widget pinning of $x$** (line 966). The widget uses `const x_idx = 0;` to display the natural transformation associated to the *first* element of $F(X)$. The Yoneda lemma asserts a bijection so all $|F(X)|$ choices of $x$ give distinct natural transformations; the widget shows only one of them per render and reports "$\mathrm{Nat}(h_X, F)\cong F(X)$" with the right cardinality count, which is honest, but the widget itself doesn't let you scrub through different $x$ values (the §10 widget remedies this). Not a math error — a UI choice that the §10 widget complements correctly.
- **Free-group widget reduced-word enumeration** (lines 1381–1401). The reducer only blocks immediate cancellation `last === -c` but does not enforce normal form across the whole word — fine because the generation is by extending only one letter at a time so global reducedness is preserved by induction. Not an error, just relies on the inductive argument being valid (it is).

## Severity

**clean.** No mathematical errors. All theorem statements (Yoneda lemma in both forms, adjunction definitions, triangle identities, monad/algebra axioms, Kan-extension pointwise formula, Mac Lane coherence, Lawvere's metric-space encoding, density theorem) are correct. All worked computations (composition table, naturality square, pullback in Set, pushout in Set, free-group universal extension on $\mathbb{Z}/n$ / $\mathbb{Z}$ / $S_3$ / $\mathbb{Z}/2\times\mathbb{Z}/2$, Kan extension over the discrete-into-poset example, Maybe and List Kleisli composition) check out. All adjunction examples are standard and correct. The (co)limit table matches the textbook list. The 2-category interchange formula has both routes spelled out and they agree. The enriched-category recoveries (ordinary, pre-additive, 2-category, topological, metric space) are all correct.

The only items worth surfacing are minor wording / scope annotations:
- the tensor-hom and $R$-Mod monoidal references implicitly assume commutative $R$ (standard);
- "for $G$ abelian, $\varepsilon_G$ surjects via word-sum" is needlessly restrictive (always surjective);

Neither rises to an error.
