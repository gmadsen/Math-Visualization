# quaternions-octonions-and-division-algebras — math correctness audit (2026-05)

**Section:** Algebra & homological

## Verified claims

### Quaternions $\mathbb{H}$ (§1)

- **Hamilton's relations** (line 262): $i^2 = j^2 = k^2 = ijk = -1$ — standard. The page correctly derives $ij = k$, $jk = i$, $ki = j$ and the reversed $ji = -k$, $kj = -i$, $ik = -j$ (line 263).
- **Conjugate** $\overline{q} = a - bi - cj - dk$ (line 263) — standard.
- **Norm** $|q|^2 = q\overline{q} = a^2 + b^2 + c^2 + d^2$ (line 264) — correct (since $q\bar q$ is a real, computed by direct expansion).
- **Inverse** $q^{-1} = \overline q / |q|^2$ for $q \ne 0$ (line 265) — correct, follows from $q\bar q = |q|^2$.
- **$\mathbb{H}$ is associative non-commutative division algebra** — standard.
- **Quaternion-multiplication formula in widget code** (lines 300-306):
  - real: $ae - bf - cg - dh$ ✓
  - $i$: $af + be + ch - dg$ ✓ (cross-checked via $ij=k, jk=i, ki=j, kj=-i, ik=-j$)
  - $j$: $ag - bh + ce + df$ ✓
  - $k$: $ah + bg - cf + de$ ✓
- **Bracket of pure imaginaries equals twice the cross product** $[u,v]=uv-vu = 2(u\times v)$ (line 344): correct. For pure imaginary $u, v \in \mathrm{Im}\,\mathbb{H}$, the standard identity $uv = -\langle u,v\rangle + u\times v$ gives $uv - vu = 2(u\times v)$.

### Unit quaternions and $\mathrm{SU}(2)\to\mathrm{SO}(3)$ (§2)

- **Unit quaternions $\cong S^3$** (line 366): standard, $\{(a,b,c,d) : a^2+b^2+c^2+d^2 = 1\} = S^3 \subset \mathbb{R}^4$.
- **$\mathrm{Sp}(1) \cong \mathrm{SU}(2)$ via $a+bi+cj+dk \mapsto \begin{pmatrix} a+bi & c+di \\ -c+di & a-bi\end{pmatrix}$** (line 366): correct standard embedding. Spot-checked the four basis elements:
  - $1 \mapsto I_2$, $i \mapsto \mathrm{diag}(i,-i)$, $j \mapsto \begin{pmatrix}0 & 1 \\ -1 & 0\end{pmatrix}$, $k \mapsto \begin{pmatrix} 0 & i \\ i & 0\end{pmatrix}$.
  - $ij = k$ verified by matrix multiplication; $i^2 = j^2 = k^2 = -I_2$ verified.
  - The matrix has form $\begin{pmatrix}\alpha & \beta \\ -\bar\beta & \bar\alpha\end{pmatrix}$ with $\alpha = a+bi, \beta = c+di$, $|\alpha|^2 + |\beta|^2 = a^2+b^2+c^2+d^2 = |q|^2$. Standard $\mathrm{SU}(2)$ parametrization for unit $q$.
- **Lie algebra $\mathrm{Im}\,\mathbb{H}\cong\mathfrak{su}(2)\cong\mathfrak{so}(3)$** with bracket = quaternion commutator (line 366): correct up to standard normalization (the bracket $[u,v]=uv-vu = 2(u\times v)$ matches the cross-product Lie algebra structure of $\mathfrak{so}(3)$ up to a factor of 2, which is just a basis-rescaling).
- **Conjugation map** $\rho_q: v \mapsto qvq^{-1} = qv\bar q$ (line 368): for $|q|=1$, $q^{-1} = \bar q$, correct.
- **Half-angle formula** $q = \cos(\theta/2) + \sin(\theta/2)\hat n$ rotates by full angle $\theta$ about $\hat n$ (line 369): standard, the source of the double cover. The proof is direct: write $q = \cos(\theta/2) + \sin(\theta/2)\hat n$, use $\hat n^2 = -1$, expand $qvq^{-1}$ using Rodrigues-like formula in quaternion form.
- **Double cover** $\ker \rho = \{\pm 1\}$ and $\mathrm{SO}(3) \cong \mathrm{Sp}(1)/\{\pm 1\} \cong \mathbb{RP}^3$ (line 369): correct (an element of $S^3$ commuting with all of $\mathrm{Im}\,\mathbb{H}$ must lie in the centre $\mathbb{R} \cap S^3 = \{\pm 1\}$).
- **Rotation widget code** (lines 407-419): computes $qvq^{-1}$ where $v = (0, v_x, v_y, v_z)$. Verified by direct expansion against the multiplication formula:
  - Computes $t = q\cdot v$ correctly (real part $t_0 = -bv_x - cv_y - dv_z$, etc.).
  - Then computes $t \cdot \bar q$ where $\bar q = (a, -b, -c, -d)$, extracting only the imaginary part.
  - All four output components $r_1, r_2, r_3$ match the standard $qvq^{-1}$ rotation formula.
- **Spinor signature** $q$ returns to $1$ at $\theta = 4\pi$, not $2\pi$ (line 475): correct (at $\theta = 2\pi$ we have $q = -1$, the same rotation as $1$ but a different spinor).

### Cayley–Dickson tower (§3)

- **Doubling formula** $(a,b)(c,d) = (ac - d^*b,\ da + bc^*)$ with $(a,b)^* = (a^*, -b)$ (lines 489-490): correct standard convention (matches Schafer / Baez).
  - Verified anti-multiplicativity of $*$: $((a,b)(c,d))^* = (c,d)^* (a,b)^*$ holds at every level (computed directly).
  - Verified $\mathbb{R}\to\mathbb{C}$ doubling: $(0,1)(0,1) = (-1,0)$, so $i^2 = -1$. ✓
  - Verified $\mathbb{C}\to\mathbb{H}$ doubling: setting $1=(1,0), I=(i,0), J=(0,1), K=(0,i)$, computed $J^2 = -1$, $IJ = K$, $JI = -K$, $K^2 = -1$, $I^2 = -1$ — all match quaternion relations. ✓
- **Property-loss progression** (lines 506-510, table at 567-573): each doubling loses one structure, in the order self-conjugation → commutativity → associativity → division. All correct.
- **Dimension doubling** $1 \to 2 \to 4 \to 8 \to 16 \to 32 \dots$ (quiz answer 32 for the 5th iteration, line 96 of quiz JSON): correct ($2^5 = 32$).

### Octonions $\mathbb{O}$ (§4)

- **$\mathbb{O} \cong \mathbb{R}^8$ with basis $\{1, e_1, \dots, e_7\}$** (line 586): standard.
- **Fano-plane encoding** (line 586-588): the 7 oriented lines list the 7 quaternion triples; on each oriented line $e_a \to e_b \to e_c$, $e_a e_b = e_c$, $e_b e_c = e_a$, $e_c e_a = e_b$, with reversal giving sign-flip — correct standard convention.
- **Each oriented line generates a copy of $\mathbb{H}$** (line 589): correct (the triple $\{1, e_a, e_b, e_c\}$ with these relations is exactly $\mathbb{H}$).
- **7 copies of $\mathbb{H}$ in $\mathbb{O}$** (quiz answer 7 for # quaternion subalgebras containing 1, line 138 of quiz JSON): correct, exactly 7 oriented Fano lines.
- **Alternative law** $x(xy) = (xx)y$ and $(yx)x = y(xx)$ (line 590): correct definition of alternativity.
- **Artin's theorem**: every two-generated subalgebra of an alternative algebra is associative (line 591): correct standard result.
- **Fano widget multiplication oracle** (lines 619-693): the 7 lines used are
  ```
  [e1,e2,e4], [e2,e3,e5], [e3,e1,e6], [e1,e5,e7], [e2,e6,e7], [e3,e4,e7], [e4,e5,e6]
  ```
  Each $e_i$ appears in exactly 3 lines (correct — Fano plane is a $(7_3, 7_3)$ configuration). Each pair $e_i, e_j$ ($i\ne j$) appears together in exactly one line — verified by enumeration. The orientation-handling code correctly returns positive sign when $b$ follows $a$ in the cyclic ordering and negative when reversed.

### Frobenius's theorem (§5)

- **Statement** (line 707): the only finite-dimensional associative division algebras over $\mathbb{R}$ are $\mathbb{R}, \mathbb{C}, \mathbb{H}$ — correct standard form.
- **Proof sketch** (line 708): the four key steps (minimal polynomial of degree $\leq 2$ since irreducible real polynomials are linear or quadratic; the orthogonal complement $V$ is Euclidean with $x^2 \le 0$ for $x \in V$; pairs of orthogonal anticommuting unit vectors generate $\mathbb{H}$; a third unit vector $w$ orthogonal to and anticommuting with $u, v$ forces $w = \pm uv$ by associativity, hence $\dim V \le 3$) — all standard and correct.
- **Sharpness** (line 759): dropping associativity admits $\mathbb{O}$ ✓; dropping division admits $\mathbb{R}\oplus\mathbb{R}$ (a 2-D commutative associative real algebra with zero divisors) ✓.

### Hurwitz's theorem (§6)

- **Composition algebra definition** (line 778-779): unital algebra with non-degenerate quadratic $N$ satisfying $N(xy) = N(x)N(y)$ — standard.
- **Statement: $\mathbb{R}, \mathbb{C}, \mathbb{H}, \mathbb{O}$, dimensions $1,2,4,8$** (line 780) — correct under the implicit positive-definiteness assumption (see "Underspecified" below for the split-form caveat).
- **Bott–Milnor / Kervaire (1958)** (line 781): the dimensions $n$ with a continuous bilinear product on $\mathbb{R}^n$ without zero divisors are exactly $1, 2, 4, 8$ — correct, both papers proved this independently in 1958. (See "Underspecified" below for the proof-method attribution.)
- **Euler's four-square identity** (line 783): the page writes
  $$(a^2+b^2+c^2+d^2)(e^2+f^2+g^2+h^2) = (ae-bf-cg-dh)^2 + (af+be+ch-dg)^2 + (ag-bh+ce+df)^2 + (ah+bg-cf+de)^2.$$
  Verified — this is exactly $|q|^2|q'|^2 = |qq'|^2$ for $q = a+bi+cj+dk$ and $q' = e+fi+gj+hk$, with the right-hand-side coefficients matching the multiplication formula at lines 300-306.
- **Eight-square identity (Degen 1818)** (line 784): correct historical attribution. The 8-square identity follows from norm-multiplicativity in $\mathbb{O}$.
- **No 9-square (or 16-square) identity**: correct (consequence of Hurwitz's theorem; the sedenions fail norm-multiplicativity).

### Connections (§7)

- **$1, 2, 4, 8$ phenomenon parametrises**:
  - parallelisable spheres $S^0, S^1, S^3, S^7$ (line 854): correct (Adams 1962).
  - Hopf fibrations $S^1 \to S^3 \to S^2$, $S^3 \to S^7 \to S^4$, $S^7 \to S^{15} \to S^8$ (line 854): correct standard list (complex / quaternionic / octonionic Hopf).
- **$G_2 = \operatorname{Aut}(\mathbb{O})$** (line 854): correct (the compact form of $G_2$ is the automorphism group of the octonions; due to Cartan).
- **$\operatorname{Br}(\mathbb{R}) = \mathbb{Z}/2$ with non-trivial class $[\mathbb{H}]$** (line 861): correct standard fact.
- **Brauer-group framing of Frobenius** (line 861): correct (the classification of central simple algebras over $\mathbb{R}$ has only $\mathbb{R}$ and $\mathbb{H}$, modulo Morita / matrix algebras).

### Quiz bank claims (cross-checked against prose)

- **`qoda-quaternions` Q2** $|q|^2$ for $q = 1+i+2j-2k$ is $1+1+4+4 = 10$ ✓.
- **`qoda-rotations` Q1** unit quaternions form $S^3$ ✓.
- **`qoda-rotations` Q2** kernel of $\mathrm{SU}(2)\to\mathrm{SO}(3)$ is $\{\pm 1\}\cong\mathbb{Z}/2$ ✓.
- **`qoda-rotations` Q3** half-angle quaternion gives full-angle rotation ✓.
- **`qoda-cayley-dickson` Q1** commutativity is what's lost at $\mathbb{C}\to\mathbb{H}$ ✓.
- **`qoda-cayley-dickson` Q2** 5th doubling has dimension $32 = 2^5$ ✓.
- **`qoda-cayley-dickson` Q3** $(0,1)(0,1) = (-1, 0)$ for $A=\mathbb{R}$ doubling ✓.
- **`qoda-octonions` Q1** alternativity is the key identity weaker than associativity ✓.
- **`qoda-octonions` Q2** $\dim_\mathbb{R}\mathbb{O} = 8$ ✓.
- **`qoda-octonions` Q3** 7 copies of $\mathbb{H}$ in $\mathbb{O}$ (one per Fano line) ✓.
- **`qoda-frobenius-theorem` Q1, Q2, Q3** all standard correct statements about Frobenius's classification.
- **`qoda-hurwitz-theorem` Q1, Q2, Q3** all correct statements (Q3: the four-square identity is the multiplicativity of the quaternion norm).

## Wrong / dubious claims

- **Sign error in dot-product formula via conjugation** (line 344). The page states:
  > "$u\overline v + v\overline u = -2\langle u,v\rangle$ recovers the dot product."
  
  This is **wrong by a sign**. For pure imaginary $u, v$, $\bar u = -u$ and $\bar v = -v$, so
  $$u\bar v + v\bar u = -uv - vu = -(uv + vu).$$
  Using $uv = -\langle u,v\rangle + u\times v$ and $vu = -\langle u,v\rangle - u\times v$, we get $uv + vu = -2\langle u,v\rangle$. Therefore
  $$u\bar v + v\bar u = +2\langle u,v\rangle,$$
  not $-2\langle u,v\rangle$.
  
  Spot-check with $u = v = i$: $i \cdot \bar i + i\cdot \bar i = i(-i) + i(-i) = 1 + 1 = 2$, and $\langle i, i\rangle = 1$, so $u\bar v + v\bar u = 2 = +2\langle u,v\rangle$, confirming the sign.
  
  This is consistent with the page's own line 264 ($|q|^2 = q\bar q = a^2+b^2+\dots$, which uses positive sign). The page's line 344 contradicts itself.
  
  Likely fix: either change to $u\bar v + v\bar u = +2\langle u,v\rangle$, or change to $uv + vu = -2\langle u,v\rangle$ (the unbarred version, which the page may have intended).

- **Wrong choice of non-associating triple** (line 589). The page writes:
  > "triples that *don't* lie on a common line associate badly: $e_1(e_2 e_4) \neq (e_1 e_2)e_4$ in general."
  
  But $\{e_1, e_2, e_4\}$ **does** lie on a common Fano line in the page's chosen labeling — it is line 1 of the widget's seven lines (`['e1','e2','e4']`). So this triple **does** associate, since all three indices generate a quaternion subalgebra together with $1$, and quaternions are associative.
  
  A correct example with the page's labeling: $\{e_1, e_2, e_3\}$ are not all on one line (e1+e2 are on line 1, e2+e3 are on line 2, e1+e3 are on line 3 — three different lines). Computing with the page's orientations: $e_1(e_2 e_3) = e_1 \cdot e_5 = e_7$ (line 4: e1→e5→e7), while $(e_1 e_2)e_3 = e_4 \cdot e_3 = -e_7$ (line 6: e3→e4→e7 means e3·e4=e7, so e4·e3=-e7). So $e_1(e_2 e_3) = e_7 \ne -e_7 = (e_1 e_2)e_3$, confirming non-associativity for this triple.
  
  Fix: replace "$e_1(e_2 e_4) \neq (e_1 e_2)e_4$" with "$e_1(e_2 e_3) \neq (e_1 e_2)e_3$" (or any other triple whose three indices are not on a common Fano line in the chosen labeling).

- **Quiz `qoda-quaternions` Q1 explanation has a muddled derivation** (line 12 of quiz JSON):
  > "Multiplying $ij=k$ on the left by $j^{-1}=-j$ and on the right by $i^{-1}=-i$ gives $ji=-k$."
  
  This step doesn't follow as stated: $j^{-1}(ij)i^{-1} = (-j)(ij)(-i)$ does not simplify to $ji$ via associativity. (E.g., $(-j)(ij)(-i) = (-j i)(j)(-i)$ doesn't reduce to $ji$ in any obvious way.)
  
  The correct one-line derivation: from $ij=k$, take quaternion conjugates: $\overline{ij} = \bar j \bar i = (-j)(-i) = ji$, and $\bar k = -k$, so $ji = -k$. The conclusion $ji = -k$ is correct; only the explanation's argument is broken. Pedagogical fix only — the answer (choice 1, "$-k$") is right.

## Underspecified or unverifiable claims

- **Hurwitz's theorem statement omits the positive-definiteness assumption** (line 779-780). The page defines a composition algebra as "unital algebra equipped with a non-degenerate quadratic form $N$" satisfying multiplicativity. Under this definition (non-degenerate but possibly indefinite), Hurwitz's classical result actually gives **seven** real composition algebras, not four: the four classical division algebras $\mathbb{R}, \mathbb{C}, \mathbb{H}, \mathbb{O}$ together with the three "split" forms — split-complex $\mathbb{R}\oplus\mathbb{R}$ (norm form $a^2 - b^2$), split-quaternions $M_2(\mathbb{R})$, and split-octonions. The page's statement "$\mathbb{R}, \mathbb{C}, \mathbb{H}, \mathbb{O}$ are the only ones" is correct only if the form is **positive-definite** (equivalently, if one restricts to division composition algebras). Hurwitz's 1898 paper indeed used positive-definite forms, so the page is faithful to the original — but a careful reader should see the qualifier. Standard textbook elision.

- **Bott–Milnor / Kervaire proof method** (line 781). The page says the dimensions $1,2,4,8$ result was "proved using the cohomology of real projective spaces." Strictly: Kervaire's 1958 proof used Steenrod operations on real projective spaces; Bott–Milnor's 1958 proof used K-theory and Bott periodicity (essentially $\widetilde{KO}(\mathbb{RP}^n)$ computations); Adams's later (1960) proof used secondary operations on stunted projective spaces. Calling it "cohomology of real projective spaces" is an oversimplification but conveys the right gestalt. Mild imprecision.

- **Frobenius proof's "$V = \{x : \tr(x) = 0,\ x^2 \le 0\}$"** (line 708). The condition $x^2 \le 0$ is automatically implied by $\tr(x) = 0$ in this setup (since the minimal polynomial $x^2 - \tau(x) x + \nu(x) = 0$ with $\tau(x) = 0$ gives $x^2 = -\nu(x)$, and $\nu(x) \ge 0$ in a division algebra), so the conjunction is redundant rather than wrong. Stylistic looseness.

- **Sedenion zero-divisor example** (line 833): "$\mathbb{S}$ has zero divisors: $(e_1+e_{10})(e_5-e_{14}) = 0$ in one basis." The "in one basis" hedge is correct — sedenion zero-divisor pairs depend on the chosen multiplication-table convention (different orderings of the Cayley–Dickson basis give different specific pairs). Without specifying the convention this exact identity is unverifiable, but the existence of such pairs (and the general form: differences and sums of pairs of basis elements that lie in non-associating triples) is standard. The most common textbook example, with the standard Cayley–Dickson labeling, is $(e_3 + e_{10})(e_6 - e_{15}) = 0$, but other conventions give other pairs.

- **The matrix realization $\mathbb{H} \hookrightarrow M_2(\mathbb{C})$** (line 263): the page says "sending $1, i, j, k$ to specific Pauli-like matrices" without giving the matrices. The actual matrices are given later in line 366 (the $\mathrm{SU}(2)$ embedding). Pedagogically a forward reference rather than an error.

## Severity

**near-clean with two real errors.**

Two substantive math errors to fix:

1. Line 344 sign error: "$u\bar v + v\bar u = -2\langle u,v\rangle$" should be either $+2\langle u,v\rangle$, or the formula should be the unbarred version "$uv + vu = -2\langle u,v\rangle$".
2. Line 589 wrong illustrative triple: "$e_1(e_2 e_4) \neq (e_1 e_2)e_4$" picks indices that lie on a common Fano line and therefore *do* associate. Replace with a triple whose three indices are not collinear in the labeling — e.g., $e_1(e_2 e_3) \neq (e_1 e_2)e_3$.

Beyond those, the topic is technically clean throughout. All theorem statements (Frobenius, Hurwitz, Artin, Cayley–Dickson construction, Bott–Milnor / Kervaire, $G_2 = \mathrm{Aut}(\mathbb{O})$, $\mathrm{Br}(\mathbb{R}) = \mathbb{Z}/2$) are correct. The quaternion-multiplication formula in the widget (lines 300-306) is verified term-by-term. The quaternion-conjugation rotation formula in the rotation widget (lines 407-419) is verified term-by-term against $qvq^{-1}$. The four-square identity (line 783) is verified to match the multiplication formula. The Cayley–Dickson formula (lines 489-490) is verified to be associativity-of-conjugate-anti-multiplicativity-consistent and to correctly produce $\mathbb{C}$ from $\mathbb{R}$ and $\mathbb{H}$ from $\mathbb{C}$. The Fano-plane encoding (lines 619-627) gives a valid $(7_3, 7_3)$ configuration with each pair on exactly one line. The $\mathrm{SU}(2)$ matrix embedding (line 366) is verified via direct matrix multiplication of the basis elements. All quiz answers are correct.

Two minor pedagogy items (not math errors): the `qoda-quaternions` Q1 explanation gives a broken derivation of $ji = -k$ (the conclusion is right, the argument doesn't work as written); and the Hurwitz statement implicitly assumes positive-definiteness (standard textbook elision).
