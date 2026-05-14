# derived-categories — math correctness audit (2026-05)

**Section:** Algebra & homological

## Verified claims

### Homotopy category $K(\mathcal{A})$ (§1)

- **Chain-complex / chain-map / chain-homotopy definitions** (lines 272–274). Cohomological grading, $d \circ d = 0$, $H^n = \ker d^n / \mathrm{im}\,d^{n-1}$, $f - g = ds + sd$ — standard.
- **Homotopic maps induce equal maps on cohomology** (line 274) — correct.
- **$K(\mathcal{A}) = \mathrm{Ch}(\mathcal{A}) / (\simeq) = \mathrm{Ch}(\mathcal{A})[\text{nullhomotopic}^{-1}]$** (line 276) — correct: localizing at nullhomotopic maps is the same as quotienting by chain homotopy because the difference of homotopic maps is a coboundary, hence zero on $H^n$, but more strongly is a sum $ds + sd$ which becomes zero once these "nullhomotopic" maps are inverted (forced equal to zero).
- **Shift $X[1]^n = X^{n+1}$, $d_{X[1]} = -d_X$** (line 278) — correct standard sign convention.
- **Worked example: $X = (k \xrightarrow{1} k)$ in degrees $0,1$, $\mathrm{id}_X \simeq 0$ via $s = 1$ in degree $1$** (line 351). Verified: $s^1 = 1: X^1 \to X^0$, all other $s^n = 0$. At degree 0: $(ds + sd)^0 = d^{-1}s^0 + s^1 d^0 = 0 + 1\cdot 1 = 1 = \mathrm{id}^0 - 0$. At degree 1: $(ds+sd)^1 = d^0 s^1 + s^2 d^1 = 1\cdot 1 + 0 = 1 = \mathrm{id}^1 - 0$. So $X \cong 0$ in $K(\mathcal{A})$. ✓
- **Chain-homotopy widget readouts** (lines 329–337): each readout describes the map's source/target, the chain-map condition $d \circ f^n = f^{n+1} \circ d$, and the homotopy relation $f^n - g^n = d \circ s^n + s^{n+1} \circ d$. All correct. Note: the homotopy relation in the readout is written $f^n - g^n = d \circ s^n + s^{n+1} \circ d$ — using cohomological grading where $s^n: X^n \to Y^{n-1}$, so $d \circ s^n: X^n \to Y^n$ and $s^{n+1} \circ d: X^n \to Y^n$. Type-checks. ✓

### Quasi-isomorphisms and localization (§2)

- **Quasi-iso definition** (line 376) — correct.
- **Counterexample $(\mathbb{Z} \xrightarrow{2} \mathbb{Z}) \to \mathbb{Z}/2[1]$ via reduction mod 2 is a qis but not a $K$-iso** (line 378). Verified: $H^0$ of source is 0 ($\times 2$ injective), $H^1$ is $\mathbb{Z}/2$ (cokernel); target has $H^0 = 0$, $H^1 = \mathbb{Z}/2$. The induced map on $H^1$ is the identity. Yet no chain-map back exists (any candidate would need to factor a surjection onto $\mathbb{Z}$ through $\mathbb{Z}/2$). ✓
- **Ore conditions in $K(\mathcal{A})$ + Ore-calculus localization $D(\mathcal{A}) := K(\mathcal{A})[\mathrm{qis}^{-1}]$** (lines 380, 444–450) — standard. The calculus-of-fractions construction does work for quasi-isomorphisms in $K(\mathcal{A})$.
- **Universal property of $D(\mathcal{A})$** (line 382, 446) — correct.
- **qis-scrubber widget steps 1–5** (lines 394–417): cohomology of $X = (\mathbb{Z}\xrightarrow{2}\mathbb{Z})$ is $H^0 = 0, H^1 = \mathbb{Z}/2$. Cohomology of $Y = (0 \to \mathbb{Z}/2)$ is $H^0 = 0, H^1 = \mathbb{Z}/2$. The induced map $H^1(f)$ is identity of $\mathbb{Z}/2$. All correct.

### Derived category $D(\mathcal{A})$ (§3)

- **Universal property + roof construction** (lines 444–450) — standard.
- **$D^+, D^-, D^b$ definitions** (lines 453–457) — standard.
- **$\Hom_{D(\mathrm{Mod}\,R)}(M[0], N[i]) \cong \mathrm{Ext}^i_R(M, N)$** (line 459) — correct.
- **Roof widget** (lines 461–505): "$f \circ s^{-1}$" represents the morphism in $D$, with $s$ the qis. Correct.

### Triangulated structure (§4)

- **Mapping cone formula $\mathrm{Cone}(f)^n = X^{n+1} \oplus Y^n$ with differential $\bigl(\begin{smallmatrix}-d_X & 0 \\ f & d_Y\end{smallmatrix}\bigr)$** (line 525). Verified: this matrix has $d^2 = \begin{pmatrix}d_X^2 & 0 \\ -fd_X + d_Y f & d_Y^2\end{pmatrix} = 0$ using $d_X^2 = d_Y^2 = 0$ and the chain-map relation $d_Y f = f d_X$. ✓
- **Rotation axiom TR3** (line 527): rotated triangle $Y \xrightarrow{v} Z \xrightarrow{w} X[1] \xrightarrow{-u[1]} Y[1]$ — the sign $-u[1]$ on the rotated map is correct (Verdier convention).
- **SES → distinguished triangle $A \to B \to C \to A[1]$** (line 527) — correct, with the connecting map representing the extension class in $\mathrm{Ext}^1(C, A) = \Hom_D(C, A[1])$.
- **Long exact cohomology sequence** (line 530) — correct standard form.
- **Cone unique only up to non-canonical iso, hence $D(\mathcal{A})$ not abelian** (line 533) — correct.
- **Triangle widget readouts** (lines 568–574): $v: y \mapsto (0, y)$ into $\mathrm{Cone}(u)^n = X^{n+1} \oplus Y^n$ ✓; $w: (x, y) \mapsto x$ projecting onto $X[1]$ ✓; $H^n(w)$ is the connecting map of the LES ✓.

### Derived functors $RF, LF$ (§5)

- **$RF(X^\bullet) = F(I^\bullet)$ via injective resolution** (line 614) — correct.
- **$\mathrm{Ext}^i_R(M, N) = \Hom_{D(\mathrm{Mod}\,R)}(M[0], N[i])$** (line 619) — correct.
- **Composition theorem $R(G \circ F) \cong RG \circ RF$ when $F$ sends injectives to $G$-acyclics** (line 620) — correct (Grothendieck's spectral-sequence framework).
- **Tor convention $H^{-i}(M \otimes^L N) = \mathrm{Tor}_i^R(M, N)$** (line 623) — correct (cohomological grading places derived tensor in non-positive degrees).
- **RF widget computation** (lines 636–660): for $F = \Hom(\mathbb{Z}/2, -)$ and $X = \mathbb{Z}$:
  - Injective resolution $0 \to \mathbb{Z} \to \mathbb{Q} \to \mathbb{Q}/\mathbb{Z} \to 0$ ✓ ($\mathbb{Q}, \mathbb{Q}/\mathbb{Z}$ are divisible hence injective in $\mathrm{Ab}$).
  - $F(\mathbb{Q}) = \Hom(\mathbb{Z}/2, \mathbb{Q}) = 0$ ✓ (no torsion → torsion-free).
  - $F(\mathbb{Q}/\mathbb{Z}) = \Hom(\mathbb{Z}/2, \mathbb{Q}/\mathbb{Z}) \cong \mathbb{Z}/2$ ✓ (picks out the order-2 element $1/2 + \mathbb{Z}$).
  - $RF(\mathbb{Z}) = (0 \to \mathbb{Z}/2)$ in degrees $0, 1$ ✓.
  - $\mathrm{Ext}^1(\mathbb{Z}/2, \mathbb{Z}) = \mathbb{Z}/2$ ✓.

### $t$-structures and hearts (§6)

- **$t$-structure axioms (inclusion / orthogonality / truncation)** (lines 692–697) — standard.
- **Heart $\heartsuit = \mathcal{T}^{\le 0} \cap \mathcal{T}^{\ge 0}$ is abelian** (line 699) — Beilinson–Bernstein–Deligne theorem, correct.
- **$H^0 = \tau_{\le 0} \tau_{\ge 0}$ is cohomological** (line 699) — correct.
- **Standard $t$-structure on $D(\mathcal{A})$**: $D^{\le 0}$ = cohomology in non-positive degrees, $D^{\ge 0}$ = cohomology in non-negative degrees (line 701) — standard.
- **Good truncation $\tau_{\le 0}(X) = (\dots \to X^{-1} \to \ker d^0 \to 0)$** (line 701) — correct (this is the canonical truncation, replacing $X^0$ with $\ker d^0$ and zeroing out positive degrees, so that cohomology is preserved in non-positive degrees and killed in positive).
- **$\mathcal{A} \hookrightarrow D(\mathcal{A})$, $M \mapsto M[0]$ is an equivalence onto the standard heart** (line 701) — correct.
- **Perverse $t$-structure on $D^b_c(X)$ has heart = perverse sheaves, distinct from $\mathrm{Sh}_c(X)$** (line 703) — correct (BBD, "engine of intersection cohomology and Riemann–Hilbert").
- **t-struct widget readouts** (lines 736–739) — correctly describe $D^{\le 0}, D^{\ge 0}$, the heart, and truncation $\tau_{\ge 1}$.

### $D^b(\mathrm{Coh}\,X)$ and Fourier–Mukai (§7)

- **$\Hom_{D^b}(\mathcal{E}, \mathcal{F}[i]) = \mathrm{Ext}^i(\mathcal{E}, \mathcal{F})$** (line 767) — correct.
- **Serre duality in $D^b$**: $\Hom_{D^b}(\mathcal{E}, \mathcal{F}) \cong \Hom_{D^b}(\mathcal{F}, \mathcal{E} \otimes \omega_X[\dim X])^\vee$ (line 767). Correct standard form. (For smooth projective $X$, $\omega_X[\dim X]$ is the dualizing complex, and Serre duality reads as Grothendieck–Verdier duality applied to the structure morphism $X \to \mathrm{pt}$.)
- **Bondal–Orlov reconstruction** (line 769): if $\omega_X$ or $\omega_X^{-1}$ is ample, then $X \cong Y$ iff $D^b(\mathrm{Coh}\,X) \simeq D^b(\mathrm{Coh}\,Y)$. Correct (Bondal–Orlov 2001).
- **Failure for Calabi–Yau / abelian varieties** (line 769) — correct.
- **Fourier–Mukai transform $\Phi_{\mathcal{P}}(\mathcal{E}) = R\pi_{Y,*}(\pi_X^*\mathcal{E} \otimes^L \mathcal{P})$** (line 772). Correct. Note: $\pi_X$ is flat (a projection from a product is flat), so $L\pi_X^* = \pi_X^*$ and the simpler notation is justified. ✓
- **Mukai's example with abelian variety + Poincaré bundle** (line 773): $\Phi_{\mathcal{P}}: D^b(X) \xrightarrow{\sim} D^b(\hat X)$ is an equivalence. Correct (Mukai 1981, the prototype derived equivalence between non-isomorphic varieties).
- **Orlov's representability theorem** (line 775): every fully-faithful triangulated functor $D^b(\mathrm{Coh}\,X) \to D^b(\mathrm{Coh}\,Y)$ between smooth projective varieties is of FM type for a unique kernel. Correct (Orlov 1997, with later refinements; the modern statement holds in this generality).

### Quiz banks (cross-checked)

- **`homotopy-category-K`** Q1 (chain-homotopy formula $f - g = ds + sd$): correct.
- **`homotopy-category-K`** Q2 (multi-select on consequences of $f \simeq g$): $H^n(f) = H^n(g)$ ✓; $[f] = [g]$ in $K$ ✓; same set-image is wrong; differ-by-iso is wrong. Answer (0, 2) correct.
- **`homotopy-category-K`** Q3 (spot the error in nullhomotopic ⇒ zero on cohomology): step 4 wrong because $s(x)$ need not be a cocycle — the actual conclusion is $f(x) = d(s(x))$ is a coboundary, hence zero in $H^n$. Correct identification.
- **`quasi-isomorphisms`** Q1 (which is a qis): option (b) $(\mathbb{Z}\xrightarrow{2}\mathbb{Z}) \to \mathbb{Z}/2[1]$ is the prototype. Verified via cohomology computation. Correct.
- **`quasi-isomorphisms`** Q2 (ordering of the localization construction): $K(\mathcal{A}) \to \text{check Ore} \to \text{define roofs} \to \text{universal property}$. Standard, correct.
- **`quasi-isomorphisms`** Q3 (qis ≠ iso in $K$): correct.
- **`quasi-isomorphisms`** hard Q1 (Ore-conditions identification): the impostor is "$H^n(s)$ injective" — correctly noted as a consequence, not an axiom of Ore conditions.
- **`quasi-isomorphisms`** hard Q2 (two qis need not be equal in $K$): step 2 is wrong (two isomorphisms can be different); $\mathrm{id}$ vs $-\mathrm{id}$ on $\mathbb{Z}[0]$ verifies. Correct.
- **`derived-category`** Q1 (Hom in $D$ recovers Ext): correct.
- **`derived-category`** Q2 ($D^b = D^+ \cap D^-$): correct.
- **`derived-category`** Q3 (matching subcategories to roles): all four matchings correct ($RF$ → $D^+$, $LF$ → $D^-$, bounded cohomology → $D^b$, heart → $\mathcal{A}$ via $M[0]$).
- **`derived-category`** hard Q1 ($\Hom_D(k, k[i])$ for $R = k[x]/(x^2)$): the periodic free resolution $\dots \to R \xrightarrow{x} R \xrightarrow{x} R \to k$ has differential $\times x$. Apply $\Hom_R(-, k)$ where $x$ acts trivially on $k$: differentials become 0. So $\mathrm{Ext}^i_R(k, k) = k$ for every $i \ge 0$. Correct (the prototypical "non-reduced ring has Koszul-dual with infinitely many degrees" calculation).
- **`triangulated-structure`** Q1 (mapping-cone formula): correct.
- **`triangulated-structure`** Q2 (axioms of triangulated cat): the trap is "uniqueness up to canonical iso functorially" — false because the cone is unique only up to non-canonical iso. Correct identification.
- **`triangulated-structure`** Q3 (SES ⇒ triangle with nontrivial $\delta$): correct.
- **`triangulated-structure`** hard Q1 ($\mathrm{Cone}(\mathbb{Z} \xrightarrow{n} \mathbb{Z})$): the cone has $\mathbb{Z}$ in degrees $-1, 0$ with differential $\times n$; cohomology is $\mathbb{Z}/n$ in degree 0. Correct.
- **`derived-functors-triangulated`** Q1 (when does $RF$ exist): enough injectives + additivity (left exactness for compatibility in degree 0). Correct.
- **`derived-functors-triangulated`** Q2 ($\mathrm{Ext}^1_{\mathbb{Z}}(\mathbb{Z}/6, \mathbb{Z}/4) = \mathbb{Z}/2$, order 2): verified via $\mathbb{Z}/m \to \mathbb{Z}/n$ formula, $\gcd(6,4) = 2$. Correct.
- **`derived-functors-triangulated`** Q3 (spot-the-error in $R\Gamma(\mathbb{P}^1, \mathcal{O}(-2))$ Čech computation): step 2 wrong — $\Gamma(U_i, \mathcal{O}(-2))$ on an affine chart is a free module on a generator, not zero. Correct identification. The correct values $H^0 = 0, H^1 = k$ via Serre duality with $\mathcal{O}_{\mathbb{P}^1}$ are right ($\omega_{\mathbb{P}^1} = \mathcal{O}(-2)$, so $H^1(\mathcal{O}(-2))^\vee = H^0(\mathcal{O}(0)) = k$).
- **`derived-functors-triangulated`** hard Q1 (composition of derived functors): the acyclicity hypothesis $F$(injectives) being $G$-acyclic is the standard sufficient condition. Correct.
- **`derived-functors-triangulated`** hard Q2 ($\mathrm{Tor}_2^{\mathbb{Z}}(\mathbb{Z}/4, \mathbb{Z}/6) = 0$): $\mathbb{Z}$ is a PID so $\mathrm{pd}_{\mathbb{Z}} \le 1$ for every module. Correct.
- **`t-structures`** Q1 (heart of standard $t$-structure ≃ $\mathcal{A}$): correct.
- **`t-structures`** Q2 (truncation triangle): "concentrated in $D^{\le 0}, D^{\ge 1}$, unique up to unique iso" is correct. Splitting condition $\Hom(\tau_{\ge 1}X, \tau_{\le 0}X[1]) = 0$ is the Yoneda/Ext criterion — correct.
- **`t-structures`** Q3 (multi-select on $t$-structures): heart abelian, $H^0$ cohomological, hearts can differ for different $t$-structures. The trap "every triangulated cat has a unique $t$-structure" is false. Correct identification.
- **`examples-D-Coh`** Q1 (Bondal–Orlov ⇒ ample $\omega_X^{\pm 1}$): correct.
- **`examples-D-Coh`** Q2 (FM transform formula): correct.
- **`examples-D-Coh`** Q3 (Mukai ↔ abelian variety + Poincaré bundle): correct.

## Wrong / dubious claims

### Major

- **§5 RF widget step 6 LES is wrong** (line 663). Applying $RF = R\Hom(\mathbb{Z}/2, -)$ to the SES $0 \to \mathbb{Z} \xrightarrow{2} \mathbb{Z} \to \mathbb{Z}/2 \to 0$ produces the long exact sequence
  $$0 \to \mathrm{Hom}(\mathbb{Z}/2, \mathbb{Z}) \to \mathrm{Hom}(\mathbb{Z}/2, \mathbb{Z}) \to \mathrm{Hom}(\mathbb{Z}/2, \mathbb{Z}/2) \to \mathrm{Ext}^1(\mathbb{Z}/2, \mathbb{Z}) \to \mathrm{Ext}^1(\mathbb{Z}/2, \mathbb{Z}) \to \mathrm{Ext}^1(\mathbb{Z}/2, \mathbb{Z}/2) \to 0$$
  $$= 0 \to 0 \to 0 \to \mathbb{Z}/2 \to \mathbb{Z}/2 \to \mathbb{Z}/2 \to \mathbb{Z}/2 \to 0$$
  
  The widget displays "0 → 0 → 0 → ℤ/2 → 0 → ℤ/2 → ℤ/2 → 0", missing one ℤ/2 (replaced by 0). Specifically:
  - position 3 (Hom(ℤ/2, ℤ/2)) and position 5 (Ext^1(ℤ/2, ℤ)): the displayed sequence has one of these wrongly as 0. Inspecting: the displayed sequence has position 3 as ℤ/2, position 4 as 0, position 5 as ℤ/2. But position 4 (which is Ext^1(ℤ/2, ℤ) — first occurrence) should be ℤ/2, not 0.
  
  Either way, one ℤ/2 is missing. The correct LES has four consecutive ℤ/2 terms in the middle (Hom(ℤ/2,ℤ/2), Ext^1(ℤ/2,ℤ), Ext^1(ℤ/2,ℤ), Ext^1(ℤ/2,ℤ/2)), not three with a 0 sandwiched in.

### Minor

- **§2 qis-scrubber widget step 6 SVG typo** (line 422). The body text says correctly "Need $g^1 \circ \pi = \mathrm{id}_{\mathbb{Z}}$ in degree 1" — the requirement for $g \circ f = \mathrm{id}_X$ at degree 1. The SVG inside the same step says "Need $g^1: \mathbb{Z}/2 \to \mathbb{Z}$ with $\pi \circ g^1 = \mathrm{id}_{\mathbb{Z}}$." Two errors here: the composition order is reversed AND the target should be $\mathrm{id}_{\mathbb{Z}/2}$ (since $\pi \circ g^1: \mathbb{Z}/2 \to \mathbb{Z}/2$, never $\mathbb{Z} \to \mathbb{Z}$). The argument that follows ("g¹ factors via |ℤ/2| = 2") is the right argument for the body's $g^1 \circ \pi = \mathrm{id}_{\mathbb{Z}}$, not the SVG's reversed form.

- **§7 Mukai's inverse formula is missing $(-1)^*_X$** (line 773). The page claims "$\Phi_{\mathcal{P}}^{-1} = \Phi_{\mathcal{P}^\vee}[\dim X]$." Mukai's theorem actually gives $\Phi_{\mathcal{P}^\vee} \circ \Phi_{\mathcal{P}} \cong (-1_X)^*[-g]$ (and dually on the $\hat X$ side), where $(-1_X): X \to X$ is the inverse-element involution and $g = \dim X$. So the inverse functor is $\Phi_{\mathcal{P}}^{-1} \cong (-1_X)^* \circ \Phi_{\mathcal{P}^\vee}[g]$ — the involution $(-1_X)^*$ is needed and is omitted. (This is a delicate point that some textbooks elide.)

- **§1 worked example wording "strictly only a quasi-iso to 0"** (line 351). The example shows $\mathrm{id}_X \simeq 0$ via an explicit $s$, which means $X \cong 0$ in $K(\mathcal{A})$ (not merely qis-to-0 in $D$). Calling this "strictly only a quasi-iso to 0, this is one of the rare cases where homotopy already does the job" is self-contradictory: the worked computation is exactly the case where homotopy *is* enough, and the conclusion $X \cong 0$ in $K$ is genuine isomorphism, not weakly a quasi-iso. Wording is confused.

- **§1 worked example arithmetic ordering "$ds + sd = 0 \cdot 1 + 1 \cdot 1 = 1$ in degree 1"** (line 351). The correct breakdown is $(ds)^1 = d^0 \circ s^1 = 1 \cdot 1 = 1$ and $(sd)^1 = s^2 \circ d^1 = 0$ (since $s^2 = 0$). The text writes the two terms in the reversed order ($0 \cdot 1$ first, then $1 \cdot 1$), which suggests the user is reading "ds" as $s$-then-$d$ in the algebraic-grading sense, contradicting the cohomological-grading definition the page uses elsewhere. Final value 1 is right, but the intermediate factorization is inconsistent with the convention.

- **§5 notation "$L \otimes^L_R$"** (line 623). Using the variable letter $L$ as the first argument of $\otimes^L$ is confusing because $L$ is also the standard symbol for left-derived. Reads as if $L$ is being derived against itself. A cleaner choice would be "$- \otimes^L_R -$" or "$M \otimes^L_R N$." Stylistic, not a math error.

## Underspecified or unverifiable claims

- **§5 derived tensor "$L \otimes^L_R: D^-(\mathrm{Mod}\,R) \to D^-(\mathrm{Mod}\,R)$"** (line 623). The derived tensor is a bifunctor $D^-(\mathrm{Mod}\,R) \times D^-(\mathrm{Mod}\,R) \to D^-(\mathrm{Mod}\,R)$ for commutative $R$. The page treats it as a unary functor — the first argument is held fixed. For non-commutative $R$, the source/target categories differ (left vs right modules). The page's treatment is the standard introductory shorthand and works as written for commutative $R$.

- **§3 "$D^+$ is the natural target of right derived functors" / "$D^-$ ... left derived functors"** (lines 454–455). The page elides that one needs the additional hypothesis "$\mathcal{A}$ has enough injectives" for $RF$ on $D^+$ (and dually). This is mentioned in §5 but not in the §3 list. Pedagogically minor — not a math error.

- **§4 "every morphism extends to a distinguished triangle"** (quiz `triangulated-structure` Q2 option 0, line 213). Strictly this is the TR1 axiom (existence of a triangle with a given first arrow). Correct.

## Severity

**minor errors** (with one item right at the major/minor border).

The §5 RF widget step-6 LES contains a definite arithmetic error (one $\mathbb{Z}/2$ in the long exact sequence is shown as 0). It is contained inside an SVG illustration in a final summary panel of a six-step scrubber, so a careful reader sees the right computations in the preceding steps; the impact is localized but the displayed LES is mathematically wrong. I am calling this borderline-major because it is a wrong arithmetic claim presented as a green ✓ summary, and a learner cross-checking with their own computation will be confused. Recommend fix: change to "0 → 0 → 0 → ℤ/2 → ℤ/2 → ℤ/2 → ℤ/2 → 0".

The §2 qis-scrubber step-6 SVG has a "$\pi \circ g^1$ vs $g^1 \circ \pi$" typo and a wrong target (ℤ vs ℤ/2). The body text in the same step has it right. Easy fix.

The §7 Mukai inverse formula misses the $(-1)^*_X$ involution. This is a known delicate point that many standard texts also gloss over, but the page states it as a clean equality without caveat.

Two minor wording issues (§1 worked example: "strictly only a quasi-iso to 0" is self-contradictory given the explicit homotopy that's just been written; "$0 \cdot 1 + 1 \cdot 1$" arithmetic ordering inconsistent with the cohomological-grading convention).

All other content — the cone formula and its $d^2 = 0$ verification, the SES → triangle correspondence, the truncation formulas, the heart equivalence, all of the Ext computations across the v1 and hard quiz tiers, the Bondal–Orlov / Orlov representability statements, the FM transform definition — is mathematically correct.
