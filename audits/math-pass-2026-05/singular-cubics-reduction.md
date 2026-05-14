# Math audit — `singular-cubics-reduction.html` (2026-05-14)

## Verified claims

- **§1 discriminant.** $\Delta = -16(4a^3+27b^2)$, smoothness $\iff \Delta \ne 0$. Standard.
- **§2 nodal/cuspidal classification.** $y^2=x^3+x^2$: lowest-order $y^2-x^2=(y-x)(y+x)$, two tangents $y=\pm x$. $y^2=x^3$: lowest-order $y^2$, single tangent $y=0$ of multiplicity 2, parametrization $(t^2,t^3)$. Both correct; up-to-isomorphism dichotomy is standard.
- **§2 algebraic test.** Hessian-based node/cusp distinction is correctly stated for plane curves.
- **§3 group-law statements.** Smooth locus of nodal $\cong \mathbb G_m$, of cuspidal $\cong \mathbb G_a$. Standard.
- **§4 good/bad dichotomy.** Good iff $\Delta \not\equiv 0 \pmod p$; finitely many bad primes since $\Delta\in\mathbb Z$. Caveat about minimal models is correctly noted.
- **§6 split/non-split criterion.** Tangent slope $s=\sqrt{\alpha-\beta}$; split iff $\alpha-\beta$ is a square in $\mathbb F_p^\times$. Correct.
- **§6 lowest-order expansion.** $y^2=(x-\alpha)^2(x-\beta)$ translated to $y^2 -(\alpha-\beta)x^2 +\text{(higher)}$. Verified by substitution.
- **§6 non-split torus.** Norm-one elements of $\mathbb F_{p^2}^\times$ have order $p+1$. ✓
- **§7 point-count table.** Split mult $|\tilde E|=p$, $a_p=1$; non-split $|\tilde E|=p+2$, $a_p=-1$; additive $|\tilde E|=p+1$, $a_p=0$; good in Hasse interval. ✓
- **§7 Hasse bound.** $|a_p|\le 2\sqrt p$, attributed to Hasse 1933, generalised by Deligne. Standard.
- **§6 local L-factor table.** $(1-a_p p^{-s}+p^{1-2s})^{-1}$ good, $(1\mp p^{-s})^{-1}$ split/non-split, $1$ additive. Correct (sign convention $a_p=+1$ split, $-1$ non-split is the standard one matching their point counts).
- **§8 conductor exponents.** $f_p=1$ multiplicative, $f_p=2$ additive at $p\ne 2,3$, wild bound at $p=2,3$. Ogg/Néron correct.

## Wrong / dubious claims

- **§7 line 1053 — global $L$-function inverted.** Page writes
  $$L(E,s)=\prod_p L_p(E,s)^{-1}.$$
  But the box at line 833 already defines $L_p$ with the inverse baked in (e.g.\ $L_p=(1-a_p p^{-s}+p^{1-2s})^{-1}$). The global product should be $\prod_p L_p(E,s)$, not the inverse. **As written the formula gives $1/L(E,s)$.** *(file: singular-cubics-reduction.html, line 1053-1054.)*

- **§8 worked example — wrong conductor.** Lines 1084-1089 claim $E\colon y^2=x^3+1$ has $f_2=4$, $f_3=3$, $N(E)=2^4\cdot 3^3=432$. **The correct conductor is $N=36=2^2\cdot 3^2$** (Cremona 36a1 / LMFDB 36.a4); $f_2=2$, $f_3=2$. The page's "coincidence $N=|\Delta|$" is also therefore false. *(lines 1084-1089.)*

- **§8 Cremona label.** "smallest-conductor curve $y^2+y=x^3-x^2$ of Cremona label 11a1" — in current Cremona labeling this curve is **11a3**, not 11a1 (11a1 is the optimal curve $y^2+y=x^3-x^2-10x-20$). Same isogeny class, same conductor 11, but the label is incorrect. *(line 1089.)*

- **§3 line 426 — confused parametrization narrative.** For the nodal map $t\mapsto(t^2-1,\,t(t^2-1))$, the two preimages of the node are $t=\pm1$ (correctly stated), but the page then says "$t=0$ and $t=\infty$ give the two 'ends'". $t=0$ maps to the smooth point $(-1,0)$, not an "end". Also, "this map ... identifies $t$ with $1/t$" is wrong: the map is birational (no $t\leftrightarrow 1/t$ identification — e.g.\ $t=2\mapsto(3,6)$ vs $t=1/2\mapsto(-3/4,-3/8)$). The intended story (smooth locus $\cong\mathbb G_m$ with chord-tangent = multiplication) is right; the geometric description of the map is muddled. *(lines 425-428.)*

- **§3 line 436 — cuspidal parametrization muddled.** $(t^2,t^3)$ has $t=0$ as the cusp, so smooth locus corresponds to $t\ne 0$, not all of $\mathbb A^1$. The aside "the parameter $1/t$ makes the identification with $\mathbb G_a$ direct after removing infinity" is hand-wavy; the correct statement uses a different uniformizer (or works in projective coordinates) so the smooth locus literally becomes $\mathbb A^1$. The conclusion (smooth locus $\cong\mathbb G_a$) is correct; the explicit identification isn't. *(lines 434-436.)*

## Underspecified or unverifiable claims

- **§5 widget criterion (line 723-725).** "$a\equiv 0\pmod p$" used as cusp/node discriminator. Logically valid for the **short** Weierstrass form when $p\mid\Delta$ (since $a\equiv 0$ then forces $b\equiv 0$, hence cusp at origin), but the page hedges in §6 prose without explaining the implication. Mildly opaque, not wrong.
- **§4 fibration widget "add?" tag (line 580).** The hedge for $a\equiv 0,b\not\equiv 0$ at small $p$ is honest but undocumented. Effectively only triggers at $p=2,3$ where $\Delta\equiv 0$ for trivial reasons; users with no Tate-algorithm context will be puzzled.
- **§6 "outside of $p=2,3$, $f_p=2$" (line 748).** True, but the wild contribution at $p=2,3$ is gestured at without bounds (Ogg gives $f_2\le 8$, $f_3\le 5$). Acceptable for an introductory page.

## Severity

**Moderate.** Two unambiguous errors will mislead serious readers: (a) the global-$L$ formula is literally inverted, and (b) the worked-example conductor for $y^2=x^3+1$ is off by a factor of 12 ($36$ vs $432$) with $f_2$ and $f_3$ both wrong. The Cremona label is a minor cosmetic slip. The §3 parametrization narrative confuses the geometric picture but lands on the right conclusions. Everything else (group-law structure theorems, Hasse bound, point-count table, Euler-factor table, conductor-exponent rules) checks out.
