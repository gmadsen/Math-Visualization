# quadratic-forms-genus-theory.html — math correctness audit

## Verified claims (sections)

**§1 Binary forms.** Discriminant $D=b^2-4ac$ (correct convention). Sign analysis (D<0 + a>0 ⇒ positive-definite; D>0 ⇒ indefinite) is standard. Completing-the-square identity $4af = (2ax+by)^2 - Dy^2$ is correct. Primitivity = gcd(a,b,c)=1, preserved under equivalence — correct.

**§2 Reduction.** Inequalities $|b|\le a\le c$ with tie-break $b\ge 0$ when $|b|=a$ or $a=c$ are the standard Gauss form. Stated values $h(-4)=1$, $h(-23)=3$, $h(-163)=1$ all correct (last is the largest Heegner number). The widget enumerator (`reducedForms`) correctly applies these inequalities; spot-checked output for D=-23 yields (1,1,6),(2,1,3),(2,-1,3) — correct.

**§3 Form class group.** Dirichlet composition / abelian group structure / principal form formulas correct: `x²−(D/4)y²` for 4|D, `x²+xy−((D−1)/4)y²` for D≡1 mod 4 (note: −(D−1)/4 = (1−D)/4 > 0 for D<0; for D=−23 this gives x²+xy+6y² ✓). Inverse class is (a,−b,c) — correct. Minkowski bound $a\le\sqrt{|D|/3}$ derives correctly from $4ac=b^2−D$ with $a\le c$.

**§4 Genus theory.** Genus character $\chi_p([f])=(m/p)$ for m represented by f with gcd(m,D)=1, well-defined on classes — correct. Number of genera $=2^{t-1}$, image of $\Phi$ is the index-2 subgroup with character-product $+1$ — correct. Principal genus $=\ker\Phi=\mathrm{Cl}(D)^2$ — correct. Number of ambiguous classes $=2^{t-1}$ matching genus count, one ambiguous class per genus — Gauss's classical statement, correct.

**§5 Forms ↔ ideals.** Restriction to fundamental discriminant explicitly stated — correct (the bijection requires this). Ring-of-integers description $\mathbb{Z}[(1+\sqrt{D})/2]$ vs $\mathbb{Z}[\sqrt{D}]$ correct. Ideal $\mathfrak{a}=a\mathbb{Z}+((-b+\sqrt{D})/2)\mathbb{Z}$ formula and isomorphism $\mathrm{Cl}(D)\cong\mathrm{Cl}(K)$ correct. Genus field characterization $\mathrm{Gal}(K^{\mathrm{gen}}/K)\cong\mathrm{Cl}(D)/\mathrm{Cl}(D)^2$ correct. Norm $N(\mathfrak{a})=a$ (leading coefficient) correct.

**Quiz banks.** Most v1 and hard-tier numerics check out: $h(-4)=1$, $h(-20)=2$ (forms (1,0,5),(2,2,3)), $h(-23)=3$, t=2 for D=-20 ⇒ 2 genera. Discriminant arithmetic answers all correct.

## Wrong / dubious claims (with file:line)

- **quadratic-forms-genus-theory.html:419** — Reduction step 1 prose says swapping `a↔c` and negating `b` "replaces $f(x,y)$ by $f(y,x)$." This is wrong: $f(y,x)=cx^2+bxy+ay^2$, which gives $(c,b,a)$, no sign change on $b$. The correct substitution producing $(c,-b,a)$ is $(x,y)\mapsto(y,-x)$ (matrix $[[0,1],[-1,0]]\in\mathrm{SL}_2$). The code does the right transformation; only the prose justification is wrong.
- **quizzes/quadratic-forms-genus-theory.json:128–138** — Hard quiz "reduction-theory" Q3 marks option B ($x^2+2xy+2y^2$) as the unique correct counterexample, but option A ($x^2-3xy+3y^2$) is *also* a valid counterexample to "$a\le c$ ⇒ reduced": $a=1, c=3, |b|=3>a$ — exactly the same failure mode. The explanation's hand-wave that option A "requires further case analysis" is incorrect; there is no tie ($|b|=3$ vs $a=1$, not vs $c$). Two answers are correct, one accepted. Moderate quiz-design flaw.
- **quadratic-forms-genus-theory.html:533** — "Brauer–Siegel … roughly $h(D)\sim\sqrt{|D|}$ on average." Brauer–Siegel is not an average statement; it gives $\log(h(D)R(D))\sim\tfrac12\log|D|$, i.e. $h(D)=|D|^{1/2+o(1)}$ for individual fundamental D (with the regulator factor; for imaginary quadratic R=1). The "on average" qualifier is slightly misleading but the leading exponent is right.

## Underspecified or unverifiable claims

- **quadratic-forms-genus-theory.html:315** — "$\mathrm{GL}_2^+(\mathbb{Z})$ (determinant $+1$)" is a non-standard but unambiguous spelling of $\mathrm{SL}_2(\mathbb{Z})$. Not wrong, but $\mathrm{GL}_2^+$ usually denotes determinant >0 over $\mathbb{R}$; over $\mathbb{Z}$ this is exactly $\mathrm{SL}_2(\mathbb{Z})$, which would be clearer.
- **quadratic-forms-genus-theory.html:640** — "$t$ is the number of prime discriminant divisors of $D$ (odd primes $p\mid D$ plus corrections for the factor of $4$ or $8$ at $2$)." Vague: the precise statement is that $t$ counts the prime discriminants in the factorization of D as a product of pairwise-coprime prime discriminants (1, −4, ±8, ±p* for odd p|D). The page never makes this fully precise but the worked D=−20 example (t=2 from {−4,5}) is consistent.
- **Topics not covered.** The page does not discuss Hasse–Minkowski, Witt's theorem, the 1/2/3/4-square theorems, or the specific D=−31 example. Nothing to verify or refute on those — they are out of scope for this topic file.

## Severity

**minor** — One factually wrong prose sentence (§2 step 1 substitution), one quiz with two valid answers but only one accepted, and one slightly imprecise framing of Brauer–Siegel. No incorrect numerical claims, no broken theorems, no false isomorphisms. Core content (reduction theory, class groups, genus theory, ideal correspondence) is mathematically sound.
