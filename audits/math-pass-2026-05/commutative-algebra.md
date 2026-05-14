# commutative-algebra — math correctness audit (2026-05)

**Section:** Algebra & homological
**Audited:** 2026-05-14 (read-only)
**Sources audited:** `commutative-algebra.html`, `quizzes/commutative-algebra.json`
**Severity overall:** **minor errors** — one wrong quiz answer (associated-prime count for a monomial quotient), one quiz where a multi-select silently excludes valid options, one body-text "but a different ring" comparison whose interpretation is mathematically inconsistent. The Hilbert-basis / Nullstellensatz / localization / going-up / Krull-dimension / Dedekind / Koszul material is essentially flawless.

---

## Summary

| # | Locus | Severity | One-line |
|---|---|---|---|
| 1 | §13 hard quiz `noetherian-hilbert-ca` Q3 (lines 432–438) | **major** | "$A=k[x,y,z]/(x^2,xy,yz,z^2)$ has 1 associated prime" — actually has **2** ($(x,z)$ minimal and $(x,y,z)$ embedded). The accompanying explanation also misnames the minimal prime as $(x,y,z)$. |
| 2 | §4 hard quiz `nilradical-jacobson-ca` Q2 multi-select (lines 261–275) | minor | Asks "for which rings $\mathrm{nil}(A)=\mathrm{Jac}(A)$"; lists $\mathbb{Z}$ and $k[x]$ as options but marks them wrong, then the explanation admits both satisfy the property (both intersections equal $(0)$). The answer-key vs explanation are self-contradictory. |
| 3 | §7 line 1455 body | minor | Calls $k[x,y]/(x^2,xy,y^2)$ "a different ring" from "$k[\epsilon]/(\epsilon^2)\times_k k[\epsilon]/(\epsilon^2)$". Under the natural ring-fiber-product reading the two are *isomorphic* (both have basis $1,\epsilon_1,\epsilon_2$ with $\epsilon_i^2=\epsilon_1\epsilon_2=0$). Under the tensor-product reading, the lengths differ (4 vs 3), so calling them "same length" is wrong. Either reading breaks the comparison. |
| 4 | §10 line 1723 body | minor | "free $\Rightarrow$ projective $\Rightarrow$ flat $\Rightarrow$ torsion-free" — the implication "flat $\Rightarrow$ torsion-free" is standard for **domains** but the page does not restrict to domains here. Over $\mathbb{Z}/6$ the module $\mathbb{Z}/6$ is flat over itself but has nonzero zero-divisors; the statement only makes sense if "torsion-free" is read in the domain sense. |
| 5 | §13 line 2272 body | cosmetic / wording | "the height of a prime is its length as a chain ending there; the coheight (dimension of the closure) complements it to $\dim A$ in nice cases (catenary rings)." The relation $\mathrm{ht}(\mathfrak p)+\dim(A/\mathfrak p)=\dim A$ holds for all primes only in *equidimensional* universally catenary rings (e.g. f.g. domains over a field, or $\mathbb{Z}$); plain "catenary" is too weak (catenary only guarantees that any two saturated chains between the same endpoints have the same length). Minor over-promise. |

Everything else verified correct, including all numeric quiz answers other than #1 above, all worked examples in the Spec / radical / lattice widgets, all Krull-dimension and transcendence-degree table entries, the Cayley–Hamilton derivation of Nakayama, the Jacobian-criterion characterization of singular points, the integrality checker (including the rings-of-integers comments for $\mathbb{Z}[\sqrt{-5}]$, $\mathbb{Z}[\sqrt[3]{2}]$, $\mathbb{Z}[i]$, $\mathbb{Z}[\phi]$), the Koszul construction and depth/regular-sequence equivalence, and the DVR / Dedekind characterizations.

---

## Detailed findings

### 1. Major — wrong associated-prime count for $A=k[x,y,z]/(x^2,xy,yz,z^2)$

**Location.** `quizzes/commutative-algebra.json` lines 432–438, hard-tier of `noetherian-hilbert-ca`.

**Claim.** "How many associated primes does $A$ have as an $A$-module of itself? Answer: 1." Explanation: "The only minimal prime containing $(x^2,xy,yz,z^2)$ is the nilradical's associated prime $(x,y,z)$".

**Verification.** First, $\sqrt{(x^2,xy,yz,z^2)}=(x,z)$, not $(x,y,z)$: $x^2\in I\Rightarrow x\in\sqrt I$ and $z^2\in I\Rightarrow z\in\sqrt I$, but no power of $y$ alone lies in $I$ (the only $y$-only monomials reachable are zero). So the unique minimal prime over $I$ is $(x,z)$ — already a misstatement in the explanation.

Second, count associated primes via the colon-ideal characterization $\mathrm{Ass}(A)=\{(I:f)/I : f\not\in I\text{ and }(I:f)\text{ prime}\}$:

A monomial $k$-basis of $A$ is $\{1,x,z,xz,y,y^2,y^3,\dots\}$ (so $A$ is in particular not Artinian; it has Krull dimension $1$ via $A/(x,z)\cong k[y]$).

- Take $f=y$. Then $(I:y)=\{r\in k[x,y,z]:ry\in I\}$. We have $xy,yz\in I$, and no $y^k$ alone lies in $I$, so $(I:y)=(x,z)$. This is a prime ⇒ $(x,z)\in\mathrm{Ass}(A)$.
- Take $f=xz$. The image $\overline{xz}\in A$ is nonzero (it is a basis element). Compute $(I:xz)$: $x\cdot xz=x^2z\in(x^2)\subseteq I$, $y\cdot xz=xyz\in(xy)\subseteq I$, $z\cdot xz=xz^2\in(z^2)\subseteq I$, but $1\cdot xz=xz\not\in I$ and no nonzero element of the residue $A/(x,y,z)\cong k$ kills $\overline{xz}$. So $(I:xz)=(x,y,z)$, the maximal ideal — also a prime ⇒ $(x,y,z)\in\mathrm{Ass}(A)$.

So $\mathrm{Ass}(A)=\{(x,z),(x,y,z)\}$ has **size 2**, with $(x,y,z)$ an embedded prime. The correct numeric answer is 2, not 1.

(This is the same kind of phenomenon as the body's §13 example $(x^2,xy)=(x)\cap(x,y)^2$, which was correctly described as having an embedded component — the quiz simply miscounts.)

**Fix.** Change the answer to `2`; rewrite the explanation along the lines of "$\sqrt I=(x,z)$ is the minimal prime, and $\mathrm{Ann}(\overline{xz})=(x,y,z)$ supplies an embedded prime; primary decomposition has shape $I=Q_1\cap Q_2$ with $\sqrt{Q_1}=(x,z)$, $\sqrt{Q_2}=(x,y,z)$".

### 2. Minor — multi-select with self-contradictory key for nil = Jac

**Location.** `quizzes/commutative-algebra.json` lines 261–275, hard-tier of `nilradical-jacobson-ca`.

**Claim.** "Select all rings $A$ for which $\mathrm{nil}(A)=\mathrm{Jac}(A)$." Options: (A) Any Artinian ring; (B) $\mathbb{Z}$; (C) $k[x]$; (D) Any Jacobson ring (e.g. f.g. $k$-algebra). Marked answer: A and D only.

**Verification.** The property $\mathrm{nil}(A)=\mathrm{Jac}(A)$ holds for $\mathbb{Z}$ ($\mathrm{nil}=(0)$ since $\mathbb{Z}$ is a domain; $\mathrm{Jac}=\bigcap_p(p)=(0)$ since $\mathbb{Z}$ has infinitely many primes) and for $k[x]$ (same argument with primes $(p)$ for $p$ irreducible monic). The explanation actually concedes this verbatim: "For $\mathbb{Z}$: $\mathrm{nil}=(0)$, $\mathrm{Jac}=\bigcap(p)=(0)$ — equal!" and "$k[x]$: ... actually these are both $(0)$ for one-dimensional Jacobson domains". So options B and C also satisfy the stated property; the answer key marking them as wrong contradicts its own explanation.

**Fix.** Either expand the answer to all four (since each of $\mathbb{Z}$, $k[x]$ is a Jacobson ring and option D already entails them); or rephrase the question to "Select the most general families …", reserving "Any Artinian", "Any Jacobson"; or replace the distractors B, C with rings that genuinely fail (e.g. $\mathbb{Z}_{(p)}$, $k[[t]]$).

### 3. Minor — fat-point comparison breaks under either reading of "$\times_k$"

**Location.** §7 line 1455 (body of "Artinian local rings"):

> $k[x,y]/(x^2,xy,y^2)$ — same length as $k[\epsilon]/(\epsilon^2)\times_k k[\epsilon]/(\epsilon^2)$ but a different ring, distinguishing tangent directions.

**Verification.** Two natural readings of "$\times_k$":

- *Ring fiber product over $k$* (pullback of rings, both factors quotient by $\epsilon$ to $k$). Elements are pairs $(a+b\epsilon_1,a+b'\epsilon_2)$ with the constant terms forced equal; basis $\{1,\epsilon_1,\epsilon_2\}$, $\epsilon_i^2=\epsilon_1\epsilon_2=0$. Length 3, and **isomorphic** to $k[x,y]/(x^2,xy,y^2)$ via $x\mapsto\epsilon_1,y\mapsto\epsilon_2$. So "different ring" is wrong.
- *Tensor product over $k$* (the standard meaning of $\times_k$ in scheme-theoretic shorthand, since $\Spec(A)\times_{\Spec k}\Spec(B)=\Spec(A\otimes_k B)$). Then $k[\epsilon]/(\epsilon^2)\otimes_k k[\epsilon]/(\epsilon^2)=k[\epsilon_1,\epsilon_2]/(\epsilon_1^2,\epsilon_2^2)$, basis $\{1,\epsilon_1,\epsilon_2,\epsilon_1\epsilon_2\}$, **length 4** — so "same length" is wrong.

In one reading the rings are equal; in the other the lengths differ. The intended contrast — a fat point $k[x,y]/(x,y)^2$ that looks like a "thickened pair of dual-number copies" but isn't a product of dual-number rings — never lands cleanly.

The widget's tooltip on the same ring (lines 1496–1497) avoids this comparison and instead correctly says "NOT isomorphic to $k[\epsilon]/(\epsilon^2)$ — extra tangent direction" (different lengths, different rings — fine). The body text is the one that misfires.

**Fix.** Drop the "$\times_k$" parenthetical and compare directly to the dual numbers: "length 3 like $k[\epsilon]/(\epsilon^3)$ but with a 2-dimensional Zariski tangent space — distinguished by embedding dimension, not length."

### 4. Minor — "flat ⇒ torsion-free" needs a domain hypothesis

**Location.** §10 line 1723.

> free $\Rightarrow$ projective $\Rightarrow$ flat $\Rightarrow$ torsion-free,
> and over a PID the last implication reverses, so over $\mathbb{Z}$: flat = torsion-free.

**Verification.** "Torsion-free" is only a standard well-defined notion over an integral domain; over a non-domain "$M$ is torsion-free" is sometimes taken to mean "no nonzero element of $M$ is killed by a non-zero-divisor of $A$", and even then "flat ⇒ torsion-free" can fail to make literal sense (e.g. $A=\mathbb{Z}/6=\mathbb{Z}/2\times\mathbb{Z}/3$ is flat over itself, but has zero divisors and the notion of "torsion-free" is awkward). In practice the chain is taught with the implicit "over a domain" qualifier on the last arrow.

**Fix.** Add "over an integral domain $A$" or restructure as "free ⇒ projective ⇒ flat; over a domain, flat ⇒ torsion-free; over a PID the last implication reverses".

### 5. Minor — "catenary" overstates the height-coheight identity

**Location.** §13 line 2272.

> the height of a prime is its length as a chain ending there; the coheight (dimension of the closure) complements it to $\dim A$ in nice cases (catenary rings).

**Verification.** The identity $\mathrm{ht}(\mathfrak p)+\dim(A/\mathfrak p)=\dim A$ for *every* prime $\mathfrak p$ is the property of being **equidimensional and catenary** (equivalently, *equicodimensional* in some references). Catenary alone says only that any two saturated chains between fixed endpoints have the same length. A Noetherian local ring can be catenary without all minimal primes having the same dimension, in which case the identity fails for primes lying above a low-dimensional component.

For the rings the page actually surveys (f.g. domains over a field, $\mathbb{Z}$, polynomial rings) the equality does hold, because they are universally catenary equidimensional domains. So the message is right *in the examples being shown*; the over-promise is theoretical.

**Fix.** Replace "(catenary rings)" with "(in equidimensional catenary rings, e.g. f.g. domains over a field)".

---

## Verified claims (samples)

A non-exhaustive list of claims that were checked and found correct:

### §1–2 — Spec, primes, maximals
- $\Spec(\mathbb{Z})$ description; closed points $(p)$ with residue $\mathbb{F}_p$, generic point $(0)$ — correct.
- $\Spec(k[x,y])$ heights: $(0)$ height 0, $(f)$ irred. height 1, $(x-a,y-b)$ height 2 (max under Nullstellensatz when $k=\overline k$) — correct.
- $\mathbb{Z}/12$ has only primes $(2),(3)$ — correct.
- "ideals of $\mathbb{Z}/n$ correspond to divisors $d|n$ via $(d)$; primes are $(p)$ for $p|n$, all maximal (Artinian)" — correct.

### §3 — Zariski topology
- $V(I)=\{\mathfrak p:I\subseteq\mathfrak p\}$, closed sets; $D(f)\cong\Spec(A_f)$ — correct.
- $\Spec$ always quasi-compact and $T_0$ but rarely Hausdorff — correct.
- $A=A_1\times A_2\iff\Spec(A)$ disconnected — correct.
- Irreducible components ↔ minimal primes — correct.
- Widget data: $V((6))=\{(2),(3)\}$ in Spec(ℤ), $D(10)=\{(0),(3),(7)\}$, $D(6)$ in Spec(ℤ/30) = $\{(5)\}$, $V((x))$ and $V((y))$ in Spec($k[x,y]/(xy(x-1))$) — all checked correct (containments verified by hand).

### §4 — Radicals
- Definitions of nilradical and Jacobson radical — correct.
- $\mathrm{nil}(A)\subseteq\mathrm{Jac}(A)$ always; equality on Jacobson rings — correct.
- $\mathbb{Z}/72$ nil = Jac = $(6)$; $\mathbb{Z}_{(p)}$ nil = $(0)$ but Jac = $(p)$ — correct.
- $k[x,y]/(x^2)$ has unique minimal prime $(x)$, maximals $(x,y-a)$ for $a\in k$ (under $k=\overline k$) — correct.
- $k[x,y]/(x^2,y^2)$ has unique prime $(x,y)$ — correct.

### §5 — Modules and tensor products
- $\mathbb{Z}/m\otimes_\mathbb{Z}\mathbb{Z}/n=\mathbb{Z}/\gcd(m,n)$ — correct (cyclic of order dividing both $m$ and $n$, generated by $1\otimes 1$ which has order exactly $\gcd$).
- $A/I\otimes_A A/J\cong A/(I+J)$ — correct.
- $\mathbb{Z}/n\otimes_\mathbb{Z}\mathbb{Q}=0$, $\mathbb{Z}\otimes_\mathbb{Z}\mathbb{Z}/n=\mathbb{Z}/n$ — correct.
- $0\to\mathbb{Z}/2\to\mathbb{Z}/6\to\mathbb{Z}/3\to 0$ splits because $\gcd(2,3)=1$, giving $\mathbb{Z}/6\cong\mathbb{Z}/2\oplus\mathbb{Z}/3$ — correct.
- Widget tensor formula (preset $\mathbb{Z}/12\otimes\mathbb{Z}/18=\mathbb{Z}/6$, etc.) — correct.

### §6 — Noetherian / Hilbert basis
- ACC ⇔ every ideal f.g. ⇔ every nonempty set of ideals has a maximal — correct.
- Hilbert basis ($A$ Noeth ⇒ $A[x]$ Noeth) and the $k[x_1,x_2,\dots]$ counterexample — correct.
- Submodule / quotient / extension of Noetherian preserve Noetherian — correct.
- $C(\mathbb{R})$ non-Noetherian — correct (chain of vanishing-at-$[n,\infty)$ ideals, etc.).
- Quiz: $(x^5,x^3y,y^7)$ has 3 minimal monomial generators (no one divides another) — correct.

### §7 — Artinian local rings
- Akizuki–Hopkins (Artinian ⇔ Noeth + dim 0) — correct.
- Finite-product structure $A\cong\prod A_{\mathfrak m_i}$ for Artinian — correct.
- $\mathfrak m^n=0$ in any Artinian local ring — correct (Nakayama on the descending chain).
- $\dim_k k[x_1,\dots,x_d]/(x_1,\dots,x_d)^n=\binom{n+d-1}{d}$ — correct ($n=3,d=2\Rightarrow 6$, basis $1,x,y,x^2,xy,y^2$).
- $k[\epsilon]/(\epsilon^n)$ length $n$, embedding dim 1 — correct.
- $k[x,y]/(x^2,xy,y^2)$ length 3, embedding dim 2 — correct (basis $1,x,y$; $\mathfrak m^2=0$).

### §8 — Localization
- Definition with the $t$-equivalence (handles zero-divisors) — correct.
- $A_f$ inverts powers of $f$, $\Spec(A_f)=D(f)$ — correct.
- $A_\mathfrak p$ has unique max ideal $\mathfrak pA_\mathfrak p$, residue field $\mathrm{Frac}(A/\mathfrak p)$ — correct.
- "Primes of $S^{-1}A$ = primes of $A$ disjoint from $S$" — correct.
- $\mathbb{Z}_{(p)}$ has residue field $\mathbb{F}_p$; $\mathbb{Z}[1/p]$ has Spec $=\Spec(\mathbb{Z})\setminus\{(p)\}$ — correct.
- Widget: $(\mathbb{Z}/12)[1/2]\cong\mathbb{Z}/3$ (kills the 4-part) and $(\mathbb{Z}/12)_{(2)}\cong\mathbb{Z}/4$ (kills the 3-part) — both verified via the CRT decomposition $\mathbb{Z}/12\cong\mathbb{Z}/4\times\mathbb{Z}/3$.

### §9 — Completion
- $\hat R_I=\varprojlim R/I^n$ — correct.
- $\mathbb{Z}\to\mathbb{Z}_p$ for $I=(p)$, $k[x]\to k[\![x]\!]$ for $I=(x)$ — correct.
- $\hat R$ faithfully flat over $R$ for $(R,\mathfrak m)$ Noetherian local — correct.
- Krull intersection $\bigcap\mathfrak m^n=0$ in Noetherian local rings — correct (the page correctly restricts to "Noetherian local"; this is where the Jacobson-radical hypothesis on the ideal is automatic).
- Hensel's lemma (coprime factorizations lift) and Cohen's structure theorem ($\hat R\cong k[\![x_1,\dots,x_d]\!]/(\dots)$ in the equicharacteristic case) — correctly stated.

### §10 — Flatness
- $M$ flat ⇔ tensor preserves injections ⇔ $\mathrm{Tor}_1^A(M,-)=0$ — correct.
- "Canonical failure" computation $\mathrm{Tor}_1^\mathbb{Z}(\mathbb{Z}/n,\mathbb{Z}/n)=\mathbb{Z}/n$ — correct (resolve $\mathbb{Z}/n$ by $0\to\mathbb{Z}\xrightarrow{n}\mathbb{Z}\to\mathbb{Z}/n\to 0$ and tensor with $\mathbb{Z}/n$).
- Local flatness criterion: f.g. $M$ over Noeth $A$ is flat iff $M_\mathfrak p$ is free for all primes — correct.
- Widget: tensoring with $\mathbb{Q}$ kills torsion; $\mathbb{Z}[1/2]$ is flat as a localization of $\mathbb{Z}$ — correct.
- Quiz hard Q3: $(x,y)\subset k[x,y]$ is torsion-free but not flat ($\mathrm{Tor}_1^{k[x,y]}((x,y),k)=k\ne 0$ via the long exact sequence from $0\to(x,y)\to k[x,y]\to k\to 0$) — correct.

### §11 — Nakayama
- Standard statement and corollary about generators ↔ images in $M/\mathfrak mM$ — correct.
- $\mathfrak m/\mathfrak m^2$ as cotangent space; $\dim_k\mathfrak m/\mathfrak m^2\ge\dim A$ with equality ⇔ regular — correct.
- Cayley–Hamilton proof of Nakayama — correct.
- Determinantal extension $\phi(M)\subseteq\mathfrak aM\Rightarrow\phi$ satisfies a monic polynomial with non-leading coefficients in $\mathfrak a$ — correct.
- Tangent-widget Jacobian computations:
  - $y^2-x^3-x^2$: $\nabla=(-3x^2-2x,2y)$, vanishes at origin, on curve ⇒ singular (node).
  - $y^2-x^3$: $\nabla=(-3x^2,2y)$, vanishes at origin ⇒ singular (cusp).
  - $y^2-x^3-1$: $\nabla=(-3x^2,2y)$, vanishes only at $(0,0)$, but $f(0,0)=-1\ne 0$ ⇒ smooth everywhere.
  - $x^2+y^2-1$: $\nabla=(2x,2y)$, vanishes only at origin which is off the curve ⇒ smooth.
  - $x^2-y^2=(x-y)(x+y)$: $\nabla=(2x,-2y)$, vanishes at origin which is on curve ⇒ singular (node).
  - $xy$: $\nabla=(y,x)$, vanishes at origin which is on curve ⇒ singular.

### §12 — Integral extensions / Noether normalization
- Definition of integral element; integral closure is a subring; integral extension = every element integral — correct.
- Lying over, going-up, incomparability — correct (textbook trio).
- $\dim A=\dim B$ for $A\subseteq B$ integral — correct (going-up + incomparability).
- Noether normalization statement ($d=\dim B=\mathrm{tr.deg}_k\mathrm{Frac}(B)$) — correct.
- Nullstellensatz proof sketch via normalization — correct.
- $k[x,y]/(y^2-x^3-x)$ degree-2 integral over $k[x]$, branched at roots of $x^3+x$ — correct.
- Integrality checker:
  - $\sqrt{-5}$ integral via $t^2+5$; ring of integers of $\mathbb{Q}(\sqrt{-5})$ is $\mathbb{Z}[\sqrt{-5}]$ (since $-5\equiv 3\pmod 4$) — correct.
  - $\sqrt[3]{2}$ integral via $t^3-2$; ring of integers of $\mathbb{Q}(\sqrt[3]{2})$ is $\mathbb{Z}[\sqrt[3]{2}]$ — correct (a standard reference: Marcus, *Number Fields*, §2 Exercise 41).
  - $1/2$ not integral by rational-root theorem — correct.
  - $i$: integral via $t^2+1$, ring of integers of $\mathbb{Q}(i)$ is $\mathbb{Z}[i]$ — correct.
  - $\phi=(1+\sqrt 5)/2$: $\phi^2=\phi+1$ via $((1+\sqrt 5)/2)^2=(6+2\sqrt 5)/4=(3+\sqrt 5)/2=1+\phi$; ring of integers of $\mathbb{Q}(\sqrt 5)$ is $\mathbb{Z}[\phi]$ (since $5\equiv 1\pmod 4$) — correct.
  - $y$ with $y^2=x^3+x$: integral over $k[x]$ via $t^2-(x^3+x)$ — correct.

### §13 — Krull dimension / primary decomposition
- $\dim\mathbb{Z}=1$, $\dim k=0$, $\dim k[x_1,\dots,x_n]=n$, $\dim\mathbb{Z}[x]=2$, $\dim A[x]=\dim A+1$ for Noetherian $A$ — correct.
- $\dim A/I$ = longest chain of primes of $A$ containing $I$ — correct.
- $\dim k[x,y]/(xy)=1$ — correct (two coordinate lines, longest chain (generic point of one line) ⊂ (origin)).
- Primary decomposition: every ideal in a Noetherian ring is a finite intersection of primary ideals; associated primes intrinsic — correct (Lasker–Noether).
- $(xy)=(x)\cap(y)$ — correct.
- $(x^2,xy)=(x)\cap(x,y)^2$ — verified by hand: an element of $(x)$ has form $xg$, and $xg\in(x^2,xy,y^2)$ requires the linear part $a\cdot x$ (where $g=a+\dots$) to vanish modulo $(x^2,xy,y^2)$, forcing $a=0$, i.e. $g\in(x,y)$. Two associated primes: $(x)$ minimal and $(x,y)$ embedded. (Notably: this is exactly the embedded-prime phenomenon that the §13 hard quiz Q3 above misses.)
- Krull-dimension widget: all 8 ring presets have correct dim and reasonable Hasse data.

### §14 — DVR / Dedekind
- Three equivalent characterizations of DVR (local PID; Noeth local domain with principal max; integrally closed Noeth local dim 1) — correct.
- Valuation $v(x)=n$ with $x=u\pi^n$ — correct.
- Dedekind = Noeth integral domain, dim 1, integrally closed; equivalent to unique factorization of nonzero proper ideals into primes — correct.
- "Localization at any nonzero prime gives a DVR" — correct.
- Examples ($\mathbb{Z}$, $\mathcal O_K$, $k[t]$, $k[\![t]\!]$, local ring at smooth point of curve) — correct.
- "On a complete smooth projective curve only constants are global regular" — correct ($H^0(X,\mathcal O_X)=k$).
- Class group $=$ fractional ideals / principal — correct.

### §15 — Transcendence degree
- All maximal alg-indep subsets have same size (Steinitz exchange) — correct.
- Bridge theorem $\dim B=\mathrm{tr.deg}_k\mathrm{Frac}(B)$ for f.g. domain over field — correct.
- $\dim(V\cap W)\ge\dim V+\dim W-n$ for irreducible affine varieties in $\mathbb A^n$ — correct (Krull principal ideal theorem applied componentwise).
- Generic fiber dim $=\dim X-\dim Y$ for dominant morphisms; upper-semicontinuity — correct.
- Widget table (k[x,y]/(xy-1) hyperbola dim 1; sphere dim 2; elliptic curve dim 1; etc.) — all correct.
- Birational ↔ isomorphic function fields over $k$ — correct.

### §16 — Koszul complex
- $K_\bullet(a_1,\dots,a_n)=\Lambda^\bullet R^n$, $K_k=R^{\binom{n}{k}}$, differential $d(e_{i_1}\wedge\dots\wedge e_{i_k})=\sum(-1)^{j-1}a_{i_j}e_{i_1}\wedge\dots\widehat{e_{i_j}}\dots\wedge e_{i_k}$ — correct.
- $d^2=0$ from commutativity $a_ia_j=a_ja_i$ — correct.
- Regular sequence ⇔ acyclicity in positive degrees, $H_0=R/(a_1,\dots,a_n)$ — correct.
- $\mathrm{depth}_I(M)=\min\{i:H^i(K^\bullet(\mathbf a;M))\ne 0\}$ for any generating sequence of $I$ — correct.
- "Resolves structure sheaf of complete intersection cut out by $(a_1,\dots,a_n)$" — correct.

---

## Underspecified or unverifiable claims

- **§4 widget tooltip "k[x,y]/(x²) maximals: (x, y−a) for a∈k"** assumes $k$ algebraically closed (otherwise there are also maximal ideals coming from non-rational points, e.g. $(x, y^2+1)$ when $k=\mathbb R$). Implicit and standard; not strictly an error.
- **§6 hard quiz Q2 "non-discrete rank-1 valuation ring"** is given as an example of a non-Noetherian ring with ACC on f.g. ideals. The claim is delicate: in a rank-1 valuation ring with value group a dense subgroup of $\mathbb R$, *principal* ideals are totally ordered by valuation, so any ascending chain of *principal* ideals stabilizes iff the corresponding sequence of valuations is bounded below (which is forced by living inside the valuation ring); but ACC on *finitely generated* ideals as stated requires every f.g. ideal to be principal, which holds in any valuation ring (Bezout property). So the claim "ACC on f.g. ideals" is right *because every f.g. ideal is principal and the principal-ideal poset is well-ordered downward from $V$ down to $(0)$ in rank 1*. Subtle, but the answer is defensible.
- **§13 hard quiz Q1 (twisted cubic) dim = 1** — the ideal $(xz-y^2,yz-x^3,z^2-x^2y)$ is the standard ideal for the twisted cubic in $\mathbb A^3$ parametrized by $t\mapsto(t,t^2,t^3)$, and the curve has dimension 1. Verified.
- **§7 widget data ($k[x,y]/(x,y)^3$ length 6 with basis $1,x,y,x^2,xy,y^2$)** — correct via the combinatorial monomial count, but only matches the displayed length annotation for $n=3$; the formula is general.

## Severity

**minor errors** — one wrong numeric quiz answer (associated-prime count, with confused explanation), one self-contradictory multi-select quiz key, one body-text comparison whose mathematical content collapses under either standard interpretation of the symbol used, and two minor wording over-promises ("flat ⇒ torsion-free" needing a domain hypothesis; "catenary" needing equidimensionality for the height/coheight identity). The substantive theorem statements (Hilbert basis, Nullstellensatz, lying-over / going-up / incomparability, Akizuki–Hopkins, Krull intersection, Hensel, Cohen structure, the Koszul regular-sequence ⇔ acyclicity equivalence, the bridge theorem $\dim=\mathrm{tr.deg}$, DVR / Dedekind characterizations) are all correctly stated, and the widgets (lattice, Spec, Zariski, radical, tensor, localization, Krull-dim Hasse, transcendence-degree table, integrality checker, Jacobian/tangent computer) all compute and label correctly.
