# representation-theory — math correctness audit (2026-05)

**Section:** Algebra & homological

## Verified claims

### §1 Definitions
- **Rep as homomorphism** (line 297–299): $\rho\colon G\to\mathrm{GL}(V)$ with $\rho(gh)=\rho(g)\rho(h)$, $\rho(e)=\mathrm{id}$ — standard.
- **Group algebra $\mathbb{C}[G]$** (line 302) and equivalence with module category — standard.
- **Intertwiner / equivariant map** definition (line 305) — standard.
- **Why $\mathbb{C}$**: $\mathbb{C}$ algebraically closed + char doesn't divide $|G|$ for finite $G$ — correct.

### §2 Examples
- **Sign rep** (line 351): only $1$-dim reps of $S_n$ are trivial and sign — correct (since $S_n^{\mathrm{ab}} = \{\pm 1\}$).
- **Regular rep decomposition** $\mathbb{C}[G] = \bigoplus_\lambda (\dim V_\lambda) V_\lambda$ — correct; $|G| = \sum_\lambda (\dim V_\lambda)^2$ is Burnside's identity. Verified.
- **Standard rep** (line 362): $(n-1)$-dim, irreducible iff $G$ is $2$-transitive — correct. Identification as $V_{(2,1)}$ for $S_3$, $V_{(3,1)}$ for $S_4$ — correct.
- **$C_n$ irreps** (line 365): all $1$-dim, $\chi_k(g) = \zeta_n^k$, $\widehat{C_n}\cong C_n$, $\mathbb{C}[C_n] \cong \mathbb{C}^n$ as algebra (DFT) — correct.
- **$D_n$ classification of irreps** (line 367–370): for $k = 1, \ldots, \lfloor(n-1)/2\rfloor$ a $2$-dim irrep with the rotation matrix $R(2\pi k/n)$ and reflection $\mathrm{diag}(1,-1)$ — correct. $1$-dim characters: trivial, sign for any $n$, plus two more iff $n$ even — correct (abelianization $D_n^{\mathrm{ab}} = D_n / [D_n,D_n] = D_n/\langle r^2\rangle$ is $C_2\times C_2$ if $n$ even, $C_2$ if $n$ odd). Counts $(n+6)/2$ even, $(n+3)/2$ odd — verified.
- **$Q_8$ matrices** (line 374): verified $i^2=j^2=k^2=-I$, $ij=k$, $jk=i$, $ki=j$, $ijk=-I$. Correct quaternion presentation.
- **Tensor / dual / direct sum** as functorial constructions — standard.

### §3 Tensor and dual
- **Character of tensor / sum / dual**: $\chi_{V\otimes W} = \chi_V \chi_W$, $\chi_{V\oplus W} = \chi_V + \chi_W$, $\chi_{V^*}(g) = \overline{\chi_V(g)} = \chi_V(g^{-1})$ — all correct (the conjugate identity uses unit-circle eigenvalues, valid for finite $G$ or unitarized rep).
- **$\mathrm{Hom}(V,W) \cong V^* \otimes W$ with $G$-action $(g\cdot T)(v) = \sigma(g) T(\rho(g^{-1})v)$** — standard.
- **$\dim\mathrm{Hom}_G(V,W) = \langle\chi_V,\chi_W\rangle$** — correct (Schur applied to averaged map, $\dim$ of fixed subspace).
- **$S^2 V \oplus \Lambda^2 V = V\otimes V$** with $\chi_{S^2}(g) = \tfrac12(\chi(g)^2 + \chi(g^2))$, $\chi_{\Lambda^2}(g) = \tfrac12(\chi(g)^2 - \chi(g^2))$ — correct.
- **Rigidity → Tannaka–Krein** (line 402): a fiber functor $\mathbf{Rep}(G)\to\mathbf{Vect}$ recovers $G$ — correct in the affine-group-scheme sense; pedagogically presented for finite $G$.

### §4 Maschke
- **Maschke's theorem** (line 433): finite $G$ + $\mathrm{char}(k)\nmid |G|$ ⇒ every fin-dim rep is direct sum of irreducibles. Correct.
- **Averaging-projector proof** (line 435–437): standard $\pi(v) = (1/|G|)\sum_g \rho(g)\pi_0(\rho(g^{-1})v)$. Verified equivariance.
- **Unitarization proof** (line 439–441): average a Hermitian form. Standard.
- **Failure example** $C_p$ over $\mathbb{F}_p$ via the Jordan block (line 443) — correct.
- **Compact-group generalization via Haar** (line 445) — correct outline.
- **Maschke widget** (line 449): the matrix $M_{ii} = \mathrm{count}(i)/|G|$, $M_{ij}=0$ off-diagonal, derives from $P_g E_{00} P_g^{-1}$. Verified equivariance numerically; trace = #points in orbit of $e_1$ divided by stabilizer size, agreeing with rank.

### §5 Schur's lemma
- **Statement** (line 481–489): standard. Proof via $\ker / \mathrm{im}$ subreps + algebraic-closure eigenvalue.
- **$\mathrm{End}_G(V) = k$ for irreducible $V$** — correct over alg-closed $k$. Real-form variant ($\mathbb{R}, \mathbb{C}, \mathbb{H}$ from Frobenius–Schur) — correct.
- **Commutant = $\prod_\lambda M_{m_\lambda}(k)$**, $\dim\mathrm{End}_G(V) = \sum m_\lambda^2$ — standard.
- **Abelian group ⇒ all irreps $1$-dim** — correct via Schur.
- **Central character**: $Z(G)$ acts by scalars on any irrep — correct.
- **Projector formula** $P_\lambda = (\dim V_\lambda / |G|) \sum_g \overline{\chi_\lambda(g)} \rho(g)$ — correct (isotypic projector).

### §6 Characters and orthogonality
- **Class function definition + inner product** (line 544): $\langle f_1,f_2\rangle = (1/|G|)\sum_g f_1(g)\overline{f_2(g)}$ — correct.
- **First orthogonality (rows)** $\langle\chi_\lambda,\chi_\mu\rangle = \delta_{\lambda\mu}$ — correct; proof sketch via averaging operator + Schur is standard.
- **Number of irreps = number of conjugacy classes** — correct corollary.
- **Second orthogonality (columns)**: $\sum_\lambda \chi_\lambda(g_1)\overline{\chi_\lambda(g_2)} = |C_G(g_1)|$ if $g_1\sim g_2$, else $0$ — correct.
- **Decomposition formula** $V = \bigoplus_\lambda \langle\chi_V,\chi_\lambda\rangle V_\lambda$ — correct.
- **Irreducibility iff $\langle\chi_V,\chi_V\rangle = 1$**, $V\cong W$ iff $\chi_V = \chi_W$ — standard.

### §7 Character tables
- **$S_3$ table**: $\mathbf{1} = (1,1,1)$, $\varepsilon = (1,-1,1)$, $V = (2,0,-1)$. Verified $\langle\chi_V,\chi_V\rangle = (4 + 0 + 2)/6 = 1$.
- **$S_4$ table** (data lines 1106–1111): dims $1,1,2,3,3$, sum of squares $24 = |S_4|$. Spot-checked all entries against standard table; $V_{(3,1)} = (3,1,-1,0,-1)$ matches (perm rep − triv); $V_{(2,1,1)} = V_{(3,1)} \otimes \varepsilon = (3,-1,-1,0,1)$ ✓; $V_{(2,2)} = (2,0,2,-1,0)$ matches the $2$-dim rep factoring through $S_4/V_4 \cong S_3$.
- **$A_4$ table**: $1$-dim characters $1, \omega, \omega^2$ on $(123)$ class, conjugates on $(132)$. $V_3 = (3,-1,0,0)$. Verified $\langle V_3, V_3\rangle = (9 + 3·1 + 0 + 0)/12 = 1$. Sum of dim$^2 = 1+1+1+9 = 12$ ✓.
- **$A_5$ table** (data lines 1140–1146): classes (sizes $1,15,20,12,12$). Verified
  - $\langle V_3, V_3\rangle = (9 + 15 + 0 + 12\varphi^2 + 12(1{-}\varphi)^2)/60$. Using $\varphi^2 = \varphi+1$ and $(1{-}\varphi)^2 = 2-\varphi$, sum $= 3$. Total $(9+15+36)/60 = 1$ ✓.
  - $\langle V_3, V_3'\rangle = (9 + 15 + 24\varphi(1-\varphi))/60$, with $\varphi(1-\varphi) = -1$, giving $(24-24)/60 = 0$ ✓.
  - $V_4 = (4,0,1,-1,-1)$, $V_5 = (5,1,-1,0,0)$ both verified $\langle V_i,V_i\rangle = 1$. Cross-orthogonality $\langle V_3,V_5\rangle = 0$, $\langle V_4,V_5\rangle = 0$, $\langle V_3,V_4\rangle = 0$ all verified.
  - Sum of dim$^2 = 1+9+9+16+25 = 60$ ✓.
- **$Q_8$ table**: same as $D_4$. Verified sum of dim$^2 = 8$, $V_2 = (2,-2,0,0,0)$ has $\langle V_2,V_2\rangle = 1$.
- **$D_4$ table** (data lines 1149–1166): classes $\{e\}, \{r^2\}, \{r,r^3\}, \{s,sr^2\}, \{sr,sr^3\}$ — correct decomposition. $1$-dim characters orthogonal — verified $\langle\chi_1,\chi_2\rangle=0$, $\langle\chi_2,\chi_3\rangle=0$.
- **$D_5$ table** (data lines 1168–1183): $V_1 = (2, 2\cos(2\pi/5), 2\cos(4\pi/5), 0)$, $V_2 = (2, 2\cos(4\pi/5), 2\cos(8\pi/5), 0)$. Note $2\cos(8\pi/5) = 2\cos(2\pi/5)$, an unusual but not-incorrect way to write the entry.
- **$D_6$ table** (data lines 1185–1204): six classes $e, r^3, \{r,r^5\}, \{r^2,r^4\}, $ two reflection types. Six irreps. Verified $V_1 = (2,-2,1,-1,0,0)$ via $\chi_{V_k}(r^j) = 2\cos(2\pi jk/6)$ with $k=1$: $r\to 2\cos(\pi/3) = 1$, $r^2\to 2\cos(2\pi/3) = -1$, $r^3 \to -2$ ✓. Same check for $V_2$ ✓.
- **$D_4 \cong Q_8$ at the character-table level** (line 624): correct — same table, nonisomorphic groups.
- **$\mathbf{C}_n$ tables (programmatic, $n \le 6$)**: $\chi_k(g^j) = e^{2\pi i k j / n}$ — correct.
- **$D_4$ widget perm-rep entry** (line 1433, `[4,0,2,0,0]`): see "Wrong / dubious claims" — class-order glitch.

### §8 Decomposing reps
- **Permutation rep $\chi_{\mathrm{perm}}(g) = \#\mathrm{fix}(g)$** — correct.
- **$S_3$ perm rep $(3,1,0) = \mathbf{1} + V$** — verified $\langle, \mathbf{1}\rangle = 1$, $\langle, V\rangle = 1$, $\langle, \varepsilon\rangle = 0$.
- **$\chi_{\mathrm{reg}}(g) = |G|\delta_{g,e}$** — correct.
- **$V\otimes V$ for $S_3 = \mathbf{1}\oplus\varepsilon\oplus V$** — verified character $(4,0,1)$, all three multiplicities $= 1$.
- **$S^2 V \oplus \Lambda^2 V$ for $S_3$**: $S^2 V = \mathbf{1} \oplus V$, $\Lambda^2 V = \varepsilon$ — verified by computing $\chi_V(g^2) = (2,2,-1)$ and $\chi_{S^2}=(3,1,0)$, $\chi_{\Lambda^2}=(1,-1,1) = \varepsilon$.
- **Molien series** $\sum_d (\dim S^d V^*{}^G) t^d = (1/|G|)\sum_g 1/\det(1-t\rho(g))$ — correct.
- **Permutation-rep decompositions** in widget (lines 1429–1435): verified $S_4: (4,2,0,1,0) = \mathbf{1} \oplus V_{(3,1)}$ (chars on classes match standard table); $A_4: (4,0,1,1) = \mathbf{1} \oplus V_3$ verified; $A_5: (5,1,2,0,0)$ — fix counts: $e\to 5$, $(12)(34)\to 1$ (fixes $5$), $(123)\to 2$ (fixes $4,5$), $5$-cycles fix $0$ — verified. $D_5: (5,0,0,1)$ via fix counts ✓. $D_6: (6,0,0,0,0,2)$ ✓ (the $\mathrm{chi}=2$ class is the $3$ vertex-axis reflections).

### §8.1 Orbits and stabilizers
- **Burnside's lemma identification** $\langle\chi_X,\mathbf{1}\rangle = \#\mathrm{orbits}(X) = (1/|G|)\sum_g \#\mathrm{Fix}(g)$ — correct.

### §8.2 Regular representation
- **$\chi_{\mathrm{reg}}(g) = |G|\delta_{g,e}$** justified correctly via "only identity fixes any basis element."
- **$\langle\chi_{\mathrm{reg}}, \chi_\lambda\rangle = \dim V_\lambda$** — verified.
- **$S_3$ regular $= \mathrm{triv} \oplus \mathrm{sgn} \oplus 2\cdot V_{\mathrm{std}}$**, dimensions $1+1+4 = 6$ ✓.

### §9 Induction / restriction / Frobenius
- **$\mathrm{Ind}_H^G W = \mathbb{C}[G]\otimes_{\mathbb{C}[H]} W$** — standard definition.
- **Coset-rep formula and the action by permuting cosets** (line 747) — standard.
- **$\dim\mathrm{Ind}_H^G W = [G:H] \cdot \dim W$** — correct.
- **Frobenius character formula** $\chi_{\mathrm{Ind} W}(g) = (1/|H|)\sum_{x\in G,\, x^{-1}gx\in H} \chi(x^{-1}gx)$ — standard.
- **Frobenius reciprocity** $\mathrm{Hom}_G(\mathrm{Ind}_H^G W, V) \cong \mathrm{Hom}_H(W, \mathrm{Res}^G_H V)$ — correct (standard adjunction).
- **$C_3 \le S_3$ example** (line 758–762): verified $\mathrm{Res}_{C_3} V_{(2,1)}$ has character $(2,-1,-1)$ on $C_3$, decomposing as $\chi_1 \oplus \chi_2$ in $C_3$. By Frobenius, $\mathrm{Ind}_{C_3}^{S_3} \chi_k = V_{(2,1)}$ for $k=1,2$. For $k=0$: $\mathrm{Ind} \mathbf{1} = \mathbf{1} \oplus \varepsilon$ — verified via $\mathrm{Res} \varepsilon|_{C_3}$ being trivial (sign of any $3$-cycle is $+1$).
- **$\mathrm{Ind}_H^G \mathbf{1} \cong \mathbb{C}[G/H]$** — standard.
- **$A_4 \le S_4$ note (line 1954)**: $\mathrm{Ind}_{A_4}^{S_4} \mathbf{1} = \mathbf{1} \oplus \varepsilon$ — verified by Frobenius.
- **$S_3 \le S_4$ note (line 1955)**: $\mathrm{Ind}_{S_3}^{S_4} \mathbf{1} = \mathbf{1} \oplus V_{(3,1)}$ — verified (standard perm rep on $4$ points).
- **$C_3 \le S_3$ note** (line 1949): $\mathrm{Ind}_{C_3}^{S_3} \chi_\omega = V_{(2,1)}$ — verified above.

### §10 Young tableaux / $S_n$
- **Specht modules indexed by partitions $\lambda \vdash n$** — standard.
- **$\dim V_\lambda = f^\lambda = $ # SYT of shape $\lambda$** — correct.
- **Hook length formula** $f^\lambda = n! / \prod_c h(c)$ — Frame–Robinson–Thrall, correct.
- **Worked example $\lambda = (2,2) \vdash 4$**: hooks $\binom{3\,2}{2\,1}$, product $12$, $f^{(2,2)} = 24/12 = 2$ — verified.
- **$S_4$ partition dimensions** $(4)\!:\!1, (3,1)\!:\!3, (2,2)\!:\!2, (2,1,1)\!:\!3, (1^4)\!:\!1$ — verified each via hook product. Sum of squares $= 24 = 4!$ ✓.
- **Conjugate partition $V_{\lambda'} = V_\lambda \otimes \varepsilon$** — correct (ε twists Specht to its conjugate).
- **Young symmetrizer** $c_T = \sum_{p\in R_T} p \cdot \sum_{q\in C_T} \mathrm{sgn}(q) q$ generates $V_\lambda = \mathbb{C}[S_n]\cdot c_T$, with $c_T^2 = (n!/f^\lambda) c_T$ — correct.

### §11 Highest-weight machinery
- **Existence of HW vector** (line 855): diagonalize $H$, take maximal eigenvalue, $E$-image is zero by maximality — correct outline.
- **HW theorem** (line 857): irreducible + HW vector ⇒ $V = \mathrm{span}\{F^k v\}$ and $\lambda \in \mathbb{Z}_{\ge 0}$ — correct.
- **Identity $EF^k v = k(\lambda - k + 1) F^{k-1} v$** (line 861) — verified using $[E, F^k] = k F^{k-1}(H - k + 1)$.
- **Conclusion $\lambda = n$** from $0 = EF^{n+1} v = (n+1)(\lambda-n) F^n v$ — correct.
- **Generalization to semisimple $\mathfrak{g}$**: HW determined by dominant integral weight in $\Lambda^+$, generated by lowering operators — correct.
- **For $\mathfrak{sl}_2$: $\Phi^+ = \{2\}$, $\Lambda^+ = \mathbb{Z}_{\ge 0}$, $\dim V_n = n+1$** — correct.

### §12 sl_2 capstone
- **$\mathfrak{sl}_2$ basis $H, E, F$ with $[H,E]=2E$, $[H,F]=-2F$, $[E,F]=H$** — correct.
- **$E\colon V_k \to V_{k+2}$, $F\colon V_k \to V_{k-2}$** — correct (raising/lowering by $2$ in weight).
- **Classification: $V_n$ unique up to iso of dimension $n+1$, weights $n, n-2, \ldots, -n$** — correct.
- **Recursive formulas $H v_k = (\lambda - 2k) v_k$, $F v_k = (k+1) v_{k+1}$, $E v_k = (\lambda - k + 1) v_{k-1}$** with $v_k = F^k v / k!$ — verified.
- **Construction $V_n = \mathrm{Sym}^n(\mathbb{C}^2)$ with $H = x\partial_x - y\partial_y$, $E = x\partial_y$, $F = y\partial_x$** — correct.
- **Clebsch–Gordan $V_m \otimes V_n = V_{m+n} \oplus V_{m+n-2} \oplus \cdots \oplus V_{|m-n|}$** — correct.
- **$V_1 \otimes V_1 = V_2 \oplus V_0$** (singlet/triplet) — correct.
- **sl_2-triples in semisimple Lie algebras controlling representation theory** — correct outline.
- **Tensor decomposer widget**: greedy peeling of multiplicities matches Clebsch–Gordan; verified for $V_1\otimes V_1 = V_2\oplus V_0$ etc.

### §13 Peter–Weyl
- **Maschke / Schur / characters generalize for compact $G$ via Haar measure** — correct.
- **Matrix coefficients $\pi_{ij}(g) = \langle \pi(g) e_j, e_i\rangle$** — standard.
- **Peter–Weyl theorem: irreducible unitary reps are finite-dim; $\{\sqrt{\dim V_\pi}\,\pi_{ij}\}$ is a Hilbert basis for $L^2(G)$** — correct (Schur orthogonality $\int \pi_{ij}\overline{\pi'_{kl}} dg = (\dim V_\pi)^{-1}\delta_{\pi\pi'}\delta_{ik}\delta_{jl}$ gives the normalization).
- **$L^2(G) \cong \widehat\bigoplus_\pi V_\pi \otimes V_\pi^*$** — correct.
- **$\mathbb{T}$ example**: $\chi_n(\theta) = e^{2\pi i n\theta}$, recovers Fourier — correct.
- **$\mathrm{SU}(2)$ example**: $V_n = \mathrm{Sym}^n(\mathbb{C}^2)$, $\dim n+1$, multiplicity $n+1$ in left-regular — correct.
- **SU(2) characters $\chi_n(\theta) = \sin((n+1)\theta)/\sin\theta = U_n(\cos\theta)$** — correct (Weyl character formula = Chebyshev second-kind identity).
- **Weyl integration formula on widget readout**: $\int_0^\pi \chi_m \chi_n \cdot (2/\pi)\sin^2\theta\, d\theta = \delta_{mn}$ — correct (SU(2) characters are real-valued so no conjugate needed).
- **Plancherel preview** for locally compact groups (line 1050) — correct framing.

## Wrong / dubious claims

### Major

- **§12 line 933–934: $EF$ and $FE$ formulas are swapped.** The page writes
  $$EF\bigm|_{V_m} = \tfrac{(n-m)(n+m+2)}{4}\,\mathrm{id}, \qquad FE\bigm|_{V_m} = \tfrac{(n+m)(n-m+2)}{4}\,\mathrm{id},$$
  then claims "their difference is $H = m$." Direct computation from the proof's own normalization $v_k = F^k v / k!$, $E v_k = (\lambda-k+1)v_{k-1}$, $F v_k = (k+1)v_{k+1}$, on weight $m = n-2k$:
  - $EF\,v_k = E(k+1)v_{k+1} = (k+1)(n-k)\,v_k = \tfrac{(n-m+2)(n+m)}{4}v_k$,
  - $FE\,v_k = F(n-k+1)v_{k-1} = k(n-k+1)\,v_k = \tfrac{(n-m)(n+m+2)}{4}v_k$.

  So the page's labels are reversed: its "$EF$" is really $FE$, its "$FE$" is really $EF$. With the page's labels in place, "their difference" $EF - FE = -m$, not $+m = H$ — and the relation $[E,F] = EF - FE = H$ is violated.

  Sanity spot-check: on $V_2$ (highest weight $2$, $v_0$ at weight $m=2$), $EF\,v_0 = E(F v_0) = E v_1 = (2-1+1) v_0 = 2 v_0$, so $EF$ acts as $2$ on weight $2$. The page's formula $\tfrac{(n-m)(n+m+2)}{4} = \tfrac{0\cdot 6}{4} = 0$ on weight $2$ — wrong. The corrected formula $\tfrac{(n+m)(n-m+2)}{4} = \tfrac{4\cdot 2}{4} = 2$ — right.

  **Same swap is in the §12 weight-diagram widget**, lines 2069–2071:
  ```js
  const EFval = (n-p.w)*(n+p.w+2)/4;
  const FEval = (n+p.w)*(n-p.w+2)/4;
  out.textContent = `weight ${p.w}: EF acts by ${EFval}, FE acts by ${FEval},
                     H acts by ${p.w} = FE-EF = ${FEval-EFval} ✓`;
  ```
  The widget's printed identity "$H = FE - EF$" is the wrong sign — the standard sl_2 relation is $H = [E,F] = EF - FE$. The widget happens to match its own (wrong) prose, so the displayed "= ${p.w} ✓" looks consistent on screen, but a learner who imports the formulas elsewhere will get the bracket convention backwards. **Fix:** swap the two formula bodies (or swap the variable names) so that `EFval = (n+w)(n-w+2)/4` and `FEval = (n-w)(n+w+2)/4`, and change the printout to "H = EF - FE".

- **§9 widget note (line 1953): $\mathrm{Ind}_{V_4}^{S_4}\mathbf{1}$ decomposition.** The annotation reads
  > $\mathrm{Ind}_{V_4}^{S_4}\mathbf{1} = \mathbf{1} \oplus \varepsilon \oplus 2 V_{(3,1)} \oplus \ldots$

  Two problems: (1) **dimension count fails** — $1 + 1 + 2\cdot 3 = 8 \neq 6 = [S_4:V_4]$, so the formula cannot be a complete decomposition no matter how the "..." is interpreted. (2) The correct decomposition is the regular rep of $S_4/V_4 \cong S_3$ pulled back to $S_4$:
  $$\mathrm{Ind}_{V_4}^{S_4}\mathbf{1} = \mathbf{1} \oplus \varepsilon \oplus 2\,V_{(2,2)},$$
  with dimensions $1 + 1 + 2\cdot 2 = 6$ ✓. The $2$-dim $V_{(2,2)}$ (which factors through $S_4 \to S_3$) appears with multiplicity $2$, the regular-rep multiplicity of the $2$-dim irrep of $S_3$. **Fix:** replace `2V_{(3,1)}` with `2V_{(2,2)}` and drop the trailing "...".

### Minor

- **§7 line 612: "self-dual under tensoring with sign (special to $S_3$)".** The phrasing is misleading. $V \otimes \varepsilon = V$ for $S_3$ because the partition $(2,1)$ is self-conjugate, and the property "tensor with sign fixes the irrep" holds whenever $\lambda = \lambda'$. Self-conjugate partitions exist in every $S_n$ for $n \ge 3$ — e.g., $(2,2)$ for $S_4$, $(3,1,1)$ and $(2,2,1)$ for $S_5$. The phenomenon is "special to self-conjugate partitions," not "special to $S_3$." **Fix:** rewrite as "(self-dual under sign-tensor because $(2,1)$ is self-conjugate; this is the $\lambda = \lambda'$ case of the general identity)."

- **§3 line 389: "$\rho(g)$ has finite order and so eigenvalues on the unit circle".** True in the finite-group context the page is operating in, but the argument is not "finite order ⇒ unit circle" in general — it's "finite order ⇒ eigenvalues are roots of unity ⊆ unit circle." For compact non-finite $G$ the eigenvalues are still on the unit circle, but via unitarizability, not finite order. The page is correct for finite $G$ and acknowledges the compact-group lift later, so this is wording-level only.

- **§8 widget data line 1433: $D_4$ permutation rep on $4$ vertices entered as `chi:[4,0,2,0,0]`.** With the page's own class ordering $(e, r^2, \{r,r^3\}, \{s,sr^2\}, \{sr,sr^3\})$, the perm rep's character should be $(4, 0, 0, 2, 0)$:
  - $e$: fixes all $4$ vertices.
  - $r^2$ (180°): fixes $0$.
  - $\{r,r^3\}$ (90° / 270°): fix $0$.
  - $\{s,sr^2\}$: reflections through opposite-vertex axes — fix $2$ vertices each.
  - $\{sr,sr^3\}$: reflections through opposite-edge axes — fix $0$.

  As entered, the widget claims trace $2$ on the rotation class $\{r,r^3\}$, which is impossible. Decomposing the wrong character against the (correct) $D_4$ character table gives $\mathbf{1} \oplus \chi_1 \oplus V_2$; the correct character gives $\mathbf{1} \oplus \chi_2 \oplus V_2$. So the displayed decomposition for $D_4$'s permutation rep is wrong (right block-structure shape, wrong $1$-dim summand). **Fix:** change `chi:[4,0,2,0,0]` to `chi:[4,0,0,2,0]`.

- **§13 line 1029: $L^2(\mathrm{SU}(2)) = \bigoplus_{n\ge 0} V_n \otimes V_n^*$, with multiplicity $(n+1)$.** Mathematically correct, but the prose treats $\bigoplus$ as the Hilbert direct sum without flagging the closure. Since the §13 statement of Peter–Weyl just above uses $\widehat\bigoplus$, this notational inconsistency is just a typesetting nit; the math is right.

- **§5 Schur statement (line 481).** "Let $V$ and $W$ be irreducible representations" — the proof's appeal to "$T$ has an eigenvalue since $k$ is algebraically closed" needs $V$ to be finite-dimensional. The page's standing convention from §1 is finite-dim complex reps, so this is contextually fine; would be cleaner to repeat "finite-dim" in the lemma statement.

## Underspecified or unverifiable claims

- **§7 line 626 widget claim "Hover rows to see the inner product $\langle\chi_i,\chi_j\rangle$".** The widget code (line 1357) only computes $\langle\chi_i,\chi_i\rangle$ on row hover (it doesn't expose the cross-pair via hover; the cross-pair is via the bottom selector + button). Doesn't affect math correctness.

- **§13 SU(2) widget readout line 2227**: "L²(SU(2)) = ⊕ V_n ⊗ V_n*, with each V_n of dim n+1 appearing with multiplicity n+1." This is correct; the conditional `nMax+1>=1?'n+1':''` in the JavaScript is always-true rendering noise but emits the right text.

- **§12 "Existence of HW vector" (line 855)**: "diagonalize $H$, pick the largest real-part eigenvalue $\lambda$." The diagonalizability of $H$ on a finite-dim sl_2-rep is non-trivial (requires $H$ to act semisimply, which uses a Lie-algebra version of complete reducibility, e.g. via Jordan decomposition or Casimir). For an irreducible rep this is fine; for a general fin-dim rep, semisimplicity gives diagonalizability. Page is informal but not wrong.

## Severity

**major errors** (two: the swapped $EF$/$FE$ formulas in §12 prose + widget, and the broken $\mathrm{Ind}_{V_4}^{S_4}\mathbf{1}$ decomposition note in §9). The character tables for $S_3, S_4, A_4, A_5, D_4, D_5, D_6, Q_8, C_n$ all check out; Maschke, Schur, orthogonality, hook lengths, Frobenius reciprocity, Peter–Weyl, and the sl_2 classification are correctly stated. The two majors are formula-level: easy diff, no structural rework.
