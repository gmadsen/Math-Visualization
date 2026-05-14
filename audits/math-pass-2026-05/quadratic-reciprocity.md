# quadratic-reciprocity.html — math-correctness audit

## Verified claims (sections)

- **§1 The question.** "Half of nonzero residues are QRs" via 2-to-1 squaring map with kernel $\{\pm1\}$ — correct. "$5$ is QR mod $p$ depends only on $p\bmod 4a$" — correct (special case of QR + supplements).
- **§2 Mult. group.** $|(\mathbb{Z}/p)^\times|=p-1$, cyclic, primitive root claim — correct. Quiz: $3$ is primitive root mod $7$ with cycle $3,2,6,4,5,1$ — verified; $4$ has order $3$ — verified.
- **§3 Legendre.** Definition, multiplicativity (proved via cyclic-group parity argument), Euler's criterion + proof — all correct. JS `legendre(a,p)` matches Euler's criterion.
- **§4 Supplementary.** First supplement $(-1/p)=(-1)^{(p-1)/2}$ — correct. Second supplement $(2/p)=(-1)^{(p^2-1)/8}$ with cases $p\equiv\pm1$ vs $\pm3\pmod 8$ — correct.
- **§5 Gauss's lemma.** Statement $(a/p)=(-1)^\mu$, proof sketch via reflection $r\mapsto p-r$ and factorial cancellation — correct.
- **§6 Reciprocity law.** Statement $(p/q)(q/p)=(-1)^{(p-1)/2\cdot(q-1)/2}$ with "both $\equiv 3\pmod 4$" sign-flip case — correct. Eisenstein lemma sketch: $(q/p)=(-1)^{T(p,q)}$ with $T(p,q)+T(q,p)=\frac{p-1}{2}\cdot\frac{q-1}{2}$ — verified numerically for several $(p,q)$.
- **§7 Engine.** Step-by-step JS reduction agrees with `legendre()` (Euler's criterion) on the example inputs and across spot tests $(11/23)=-1$, $(7/11)=-1$, $(30/53)=-1$, $(3/13)=+1$, $(2/17)=+1$.
- **§8 Jacobi.** Definition $\prod(a/p_i)^{e_i}$, caveat with $(2/15)=+1$ but $2$ non-square mod $15$ — verified. Reciprocity for odd coprime $m,n$ + identity $(mn-1)/2\equiv (m-1)/2+(n-1)/2\pmod 2$ — verified.
- **§9 Why it matters.** Frobenius/cyclotomic embedding $\mathbb{Q}(\sqrt a)\subset\mathbb{Q}(\zeta_{4a})$ explanation — standard and correct (Kronecker–Weber for real-quadratic case).
- **Quiz numerics.** All spot-checked values verified: $3^6\equiv 1\pmod{13}$ (=$56\cdot 13+1$); reciprocity computation $(11/23)=-1$; Gauss-lemma counts for $p=11,a=2$ ($\mu=3$) and $p=13,a=5$ ($\mu=3$); $(30/53)=(-1)^3=-1$; $(-2/p)$ for $p\equiv 7\pmod 8$ equals $-1$.
- **Gauss-sum proof outline (quiz hard).** $g^2=(-1)^{(p-1)/2}p=p^\ast$ and the $g^{q-1}$ comparison — standard and correct.

## Wrong / dubious claims (with file:line)

- **`quadratic-reciprocity.html:523`** — The page asserts that the count of $\{2,4,\ldots,p-1\}$ landing in the upper half "turns out to be $\lfloor p/4\rfloor$." This is wrong for $p\equiv 3\pmod 4$. Direct enumeration:
  - $p=11$: $\mu=3$, $\lfloor 11/4\rfloor=2$.
  - $p=19$: $\mu=5$, $\lfloor 19/4\rfloor=4$.
  - $p=23$: $\mu=6$, $\lfloor 23/4\rfloor=5$.
  - $p=31$: $\mu=8$, $\lfloor 31/4\rfloor=7$.

  The correct closed form is $\mu=\lfloor p/4\rfloor$ for $p\equiv 1\pmod 4$ and $\mu=\lfloor p/4\rfloor+1=\lceil p/4\rceil$ for $p\equiv 3\pmod 4$. Both have parity matching $(p^2-1)/8$, so the supplementary law itself is correct, but the stated count is off-by-one half the time. Suggested fix: "the count is $\lfloor (p+1)/4\rfloor$" (which works in both residue classes and gives the same parity).

## Underspecified or unverifiable claims

- **`quadratic-reciprocity.html:676`** — "the diagonal misses all lattice points when $p\ne q$." Strictly: the diagonal $y=(q/p)x$ on $1\le x\le (p-1)/2$ misses lattice points iff $\gcd(p,q)=1$, not merely $p\ne q$. For distinct primes the two are equivalent so the substantive claim is correct, but the phrasing is loose.
- **`quadratic-reciprocity.html:392`** — "switch $n$ to a composite like $n=6$ and pick a non-unit such as $a=2$, and watch the orbit collapse" describes widget behavior; the modular-arithmetic-clock widget params hard-code $n=7$, so the prose suggests interaction the widget may or may not expose. Non-mathematical, just a UX/prose alignment risk.
- **`quadratic-reciprocity.html:1010`** — "ramification of $K/\mathbb{Q}$ is supported on primes dividing $4a$" is correct for $K=\mathbb{Q}(\sqrt a)$ with $a$ squarefree, but the prose doesn't restrict $a$ to squarefree; for $a$ with square factors the discriminant still divides $4a$, so the conclusion stands, just under-stated.

## Severity

**Minor.** One genuine numerical error (the $\lfloor p/4\rfloor$ count formula at line 523 is wrong for half the primes), but it sits inside an aside and the supplementary law it's meant to motivate is itself stated correctly. All theorem statements, proofs, definitions, Jacobi caveat, Eisenstein lemma, Gauss-sum sketch, and every spot-checked numerical computation in the page and the quiz bank are correct. Recommend a one-line edit to fix the count formula.
