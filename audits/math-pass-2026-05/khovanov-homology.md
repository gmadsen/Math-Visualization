# khovanov-homology — math correctness audit (2026-05)

**Section:** Geometry & topology

## Verified claims

### §1 Cube of resolutions
- 0-/1-resolution descriptions and the cube $\{0,1\}^n$ indexing complete smoothings (lines 268–272). ✓
- Edges flip a single bit; adjacent vertices differ by a saddle (merge / split) — diagram in $\mathbf{Cob}^2$ (line 274). ✓
- Cube widget circle counts (lines 549–555):
  - twisted unknot R1: $0\to 1$ circle, $1\to 2$ circles. ✓
  - positive Hopf: $00,11\to 2$ circles, $10,01\to 1$. ✓ (Seifert smoothing of $T(2,2)$.)
  - right trefoil: $000\to 2$, weight-1 vertices $\to 1$, weight-2 $\to 2$, $111\to 3$. ✓
- Edge count formula $n\cdot 2^{n-1}$ in widget header (line 618). ✓

### §2 Frobenius algebra and chain complex
- $A=\mathbb Z[X]/(X^2)$, $\deg(1)=+1,\deg(X)=-1$ (line 309). ✓
- Multiplication $m(1\otimes a)=a$, $m(X\otimes X)=0$; comult $\Delta(1)=1\otimes X+X\otimes 1$, $\Delta(X)=X\otimes X$; unit/counit with $\varepsilon(X)=1,\varepsilon(1)=0$ (lines 311–313). ✓ Standard Khovanov choice.
- Per-vertex module $V_\alpha = A^{\otimes k_\alpha}\{|\alpha|\}$ (line 316). ✓
- Edge differential = $m$ on merges, $\Delta\otimes\mathrm{id}$ on splits, signed by $(-1)^{\sigma(e)}$ to make squares anticommute (line 316). ✓
- Global shifts $C^{i,j}(D)=\bigoplus_{|\alpha|=i+n_-}(V_\alpha)_j\{n_+-2n_-\}$ with $i$-shift $-n_-$ and $j$-shift $n_+-2n_-$ (line 319). ✓ Standard.
- R1 invariance / writhe shift rationale (line 338). ✓

### §3 Decategorification
- $\widehat V_L(q)=\sum(-1)^iq^j\dim Kh^{i,j}(L)=(q+q^{-1})V_L(q^2)$ with $V_{\text{unknot}}=1$ (line 363). ✓
- $Kh(\text{unknot})\cong A$ with classes in $(0,1)$ and $(0,-1)$ (line 364). ✓
- Reidemeister-invariance proof outline + functoriality up to overall sign (Bar-Natan) (lines 366, 368). ✓
- Right vs left trefoil distinguished by $Kh$ tables, not just by $q\mapsto q^{-1}$ (line 384). ✓

### §4 Lee deformation / Rasmussen
- $A_{Lee}=\mathbb Q[X]/(X^2-1)\cong\mathbb Q\oplus\mathbb Q$ via $X\mapsto\pm 1$ (line 407). ✓
- $Kh_{Lee}(K)\cong\mathbb Q^2$ for any knot, with canonical generators $\mathfrak s_o$ from oriented Seifert smoothings (line 409). ✓
- $s(K)\in 2\mathbb Z$, additive under connected sum, $|s(K)|\le 2g_4(K)$ (lines 412–415). ✓
- $s(T(p,q))=(p-1)(q-1)$, $g_4(T(p,q))=(p-1)(q-1)/2$ for $p,q>0$ (line 435; widget data). ✓ Computed values for $T(2,3),(2,5),(2,7),(3,4),(3,5),(4,5)$ all correct.
- Signature values (line 776–783): $\sigma(T(2,2k+1))=-2k$ ✓; $\sigma(T(3,4))=-6$, $\sigma(T(3,5))=-8$, $\sigma(T(4,5))=-12$ ✓ (in the convention $\sigma(\text{right trefoil})=-2$).

### §5 Foams / sl_n
- Theta foam evaluation skew-symmetric $(a-b)(a-c)(b-c)$ (line 830). ✓
- Closed sphere of colour $k$ in $sl_n$ foams $=$ $q$-binomial $\binom{n}{k}_q$ (line 832, 867). ✓
- Matrix-factorisation model with potential $W(x)=x^{n+1}$ (line 452). ✓ Khovanov–Rozansky.
- Triply-graded HOMFLY-PT homology, specialisation to $KR_n$, Gorsky–Negut–Rasmussen colored conjecture (line 454). ✓

### §6 Detection results (line 493)
- Kronheimer–Mrowka unknot detection via spectral sequence to instanton; Baldwin–Sivek trefoil & Hopf detection; Baldwin–Dowlin–Lobb–Sivek figure-eight. ✓ Attributions correct.
- Kh distinguishes Conway / Kinoshita–Terasaka pair (line 899). ✓ (Famous: same Alexander, different $Kh$.)

### Fig-8 widget data
- §3 widget ranks for figure-eight: $(\pm 2,\pm 5),(\pm 1,\pm 1),(0,\pm 1)$ each rank 1 (line 715). ✓ $\chi_q=q^{-5}+q^5=(q+q^{-1})V_{4_1}(q^2)$ verified directly.

## Wrong / dubious claims

- **Right trefoil rational Khovanov has a spurious generator at $(3,7)$.** §2 widget data (line 644) lists `"3,9":1, "2,7":0, "3,7":1` for the right trefoil, and §3 widget data (line 713) lists `[3,7,1]`. The standard rational Khovanov of $3_1$ (right) has rank 4 with generators at $(0,1),(0,3),(2,5),(3,9)$ only; the $(3,7)$ slot carries $\mathbb Z/2$ torsion integrally and is **0 over $\mathbb Q$**. With the spurious cell, $\chi_q = q+q^3+q^5-q^7-q^9$ no longer equals $(q+q^{-1})V_{3_1}(q^2)=q+q^3+q^5-q^9$. Same error mirrored for the left trefoil at line 646 (`"-3,-7":1`) and line 714.
- **Trefoil-r `khrank` display string has a sign typo.** Line 713: `"q + q^3 + q^5 - q^9 + q^7"`. Even with the (incorrect) data above, the $(3,7)$ contribution carries sign $(-1)^3=-1$, so the display should read `- q^7`, not `+ q^7`. Both the data and the display string are inconsistent with each other and with the correct Jones polynomial.
- **Bar-Natan ↦ Lee specialisation is mis-stated.** Line 407: "$A_{BN}=\mathbb Z[X,h]/(X^2-hX)$, recovering Khovanov at $h=0$ and Lee at $h\to\text{(generic)}$ over $\mathbb Q$." Lee's algebra is $X^2=1$, not $X^2=hX$ for any $h$ — Lee lives in the **two-parameter** universal Frobenius family $\mathbb Z[X,h,t]/(X^2-hX-t)$ at $(h,t)=(0,1)$. Bar-Natan with $h$ generic gives $X^2=hX$, which is a different (also semisimple) deformation; setting $h$ generic does not recover Lee.
- **Trefoil-r Jones polynomial sign convention is internally inconsistent with the listed Kh data.** Line 713 sets jones $= -q^4+q^3+q$ but the listed Kh table (even after dropping the spurious $(3,7)$) gives $\chi_q=q+q^3+q^5-q^9$, which factors as $(q+q^{-1})(q^2+q^6-q^8)$, i.e. $V(q^2)=q^2+q^6-q^8$, hence $V(q)=q+q^3-q^4$. The page's `jones` string $-q^4+q^3+q$ matches this up to ordering, but the parallel `hopf-pos` entry ($-q^{5/2}-q^{1/2}$) carries an overall sign opposite to the positive $\chi_q=1+q^2+q^4+q^6$ implied by its Kh ranks. Convention drift between entries.
- **Fig-8 `khrank` display string is sloppy** (line 715): `"q^{-5}+q^{-3}+...+q^5 (symmetric)"`. The actual graded Euler characteristic of $4_1$ Khovanov is $q^{-5}+q^5$ after cancellation, not a full symmetric polynomial in odd powers.

## Underspecified or unverifiable claims

- "Bar-Natan deformation is the universal one over $\mathbb Z$" (line 407). Universal-among-what is unstated; Khovanov's universal Frobenius algebra is two-parameter $\mathbb Z[X,h,t]/(X^2-hX-t)$. Even charitably the sentence as written is misleading (see Wrong/dubious above).
- "[Kh] has rank 2 (over $\mathbb{Q}$) iff $K$ is the unknot" (line 493). Kronheimer–Mrowka prove rank-2 detection over $\mathbb Z$ via reduced Khovanov; the rational/unreduced framing here is informal but morally correct.
- "Y-junction relation = Reidemeister IV" (line 831). Reidemeister IV is the move sliding a strand past a trivalent vertex in oriented/web diagrammatics; phrasing is fine for an exhibit but isn't a precise algebraic relation.
- §4 widget: $s(K)$ defined as average of $q_{\min}$ and $q_{\max}$ of $\mathfrak s_K+\mathfrak s_{\overline K}$ (line 412) is one of several equivalent formulations; the equivalence to "the unique $s$ with $\mathfrak s_K\pm\mathfrak s_{\overline K}$ in filtration $s\pm 1$" is left implicit.

## Severity

**Moderate.** The page is conceptually accurate on the cube, Frobenius structure, bigrading, decategorification identity, Lee/Rasmussen, and detection landscape. Two concrete numerical bugs in the headline computations need fixing: (a) the spurious $(3,7)$ rational generator for both trefoils in the §2 and §3 widget data (and its companion sign typo in the displayed `khrank` string), and (b) the mis-statement that Lee lives in the one-parameter Bar-Natan family. The trefoil error is exactly the kind of thing the page is designed to teach, so it should be fixed before this is shipped as a worked example. No structural rewrites needed.
