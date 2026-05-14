# designs.html — math-correctness audit

## Verified claims

### § 1. BIBD identities and parameter table
- $bk = vr$ and $\lambda(v-1) = r(k-1)$ — standard double-counts. ✓
- All five rows of the parameter table check out: $(7,3,1)\!\to\!r{=}3,b{=}7$; $(9,3,1)\!\to\!r{=}4,b{=}12$; $(13,4,1)\!\to\!r{=}4,b{=}13$; $(11,5,2)\!\to\!r{=}5,b{=}11$ (biplane of order $k-\lambda=3$ ✓); $(25,5,1)\!\to\!r{=}6,b{=}30$. ✓
- Widget `w-bibd` calculator implements the identities correctly and gates on integrality.

### § 2. Fisher
- $NN^\top = (r-\lambda)I_v + \lambda J_v$ ✓.
- Spectrum: $rk$ (multiplicity 1) and $r-\lambda$ (multiplicity $v-1$); both $>0$ for non-trivial designs ✓. The identity $r+(v-1)\lambda = rk$ uses $r(k-1)=\lambda(v-1)$ correctly.
- Fisher rank proof and the symmetric-design ($b=v\Rightarrow r=k$, dual is a 2-design) characterisation ✓.
- Widget `w-fisher`: Fano blocks $\{0,1,2\},\{0,3,4\},\{0,5,6\},\{1,3,5\},\{1,4,6\},\{2,3,6\},\{2,4,5\}$ form a valid (7,3,1); AG(2,3) blocks form 4 parallel classes that exhaust all $\binom{9}{2}=36$ pairs once; biplane (7,4,2) blocks are complements of Fano lines ✓.

### § 3. Finite projective planes
- Plane of order $q$ ↔ symmetric 2-$(q^2{+}q{+}1, q{+}1, 1)$ ↔ $S(2,q{+}1,q^2{+}q{+}1)$ ✓.
- BRC for projective planes ($n\equiv 1,2\pmod 4 \Rightarrow n=a^2+b^2$) ✓.
- Killed orders 6, 14, 21, 22, 30, 33: all spot-check as $\equiv 1$ or $2\pmod 4$ and not sums of two squares ✓.
- $q=10$: $1^2+3^2=10$, BRC silent; Lam–Thiel–Swiercz 1989 computer-search disproof ✓.
- $q=12$: $12\equiv 0\pmod 4$, BRC inapplicable; smallest unresolved order ✓.
- Fano widget `w-fano` lines form a valid 2-(7,3,1).

### § 4. Latin squares / MOLS
- $\mathrm{MOLS}(n)\le n-1$ ✓. Complete-set ↔ projective plane of order $n$ ✓.
- Euler 1782 / Tarry 1900 / Bose–Shrikhande–Parker 1959 attribution and the "$n\ne 2,6$" conclusion ✓.
- $L_a(i,j)=i+aj\pmod p$ orthogonality argument (uniqueness via $a_2-a_1\in \mathbb{F}_p^\times$) ✓; widget `w-mols` enforces $a_1,a_2$ nonzero distinct ✓.

### § 5. Codes → designs
- Hamming $[7,4,3]$ parity-check matrix: columns are binary reps of 1–7 ✓; weight enumerator $A_0=A_7=1, A_3=A_4=7$ ✓.
- The seven listed weight-3 supports satisfy $i\oplus j\oplus k=0$ in $\mathbb{F}_2^3$ ✓; they form $S(2,3,7)$ ✓.
- Binary Golay $G_{23}$: perfect $[23,12,7]$, 253 weight-7 codewords, supports $=S(4,7,23)$ ✓.
- Extended $G_{24}$: $[24,12,8]$, 759 weight-8 supports $=S(5,8,24)$, $\mathrm{Aut}=M_{24}$ ✓.
- Assmus–Mattson 1969 statement matches the standard form ✓.

### § 6. Applications
- $S(2,3,n)$ existence iff $n\equiv 1,3\pmod 6$ (Kirkman 1847) ✓.
- Kirkman schoolgirl problem (15 girls, 5 triples × 7 days = 35 = $\binom{15}{2}/3$) ✓.
- Round-robin widget: odd $n$, $n$ rounds, each team idle once, total $n(n-1)/2$ matches ✓.
- Shamir secret-sharing description (degree-$(t-1)$ polynomial, Lagrange) ✓.

## Wrong / dubious claims

- **`designs.html:272`**: "These are necessary conditions but quite far from sufficient. They rule out, e.g., a $(7,3,2)$-design" — **WRONG**. For $(7,3,2)$: $r=\lambda(v-1)/(k-1)=2\cdot6/2=6$ and $b=vr/k=42/3=14$, both integers, so the necessary divisibility conditions are *satisfied*, not violated. Moreover a 2-(7,3,2) design exists (e.g. take two disjoint copies of the Fano plane). Replace with an example that actually fails divisibility, e.g. $(8,3,1)$ ($r=7/2\notin\mathbb{Z}$), or with a parameter set that passes divisibility yet is killed by BRC, e.g. $(43,7,1)$.

- **`designs.html:516`**: "This is an *orthogonal array* $\mathrm{OA}(N,k,n,2)$ … with $N$ as small as $\Theta(n^2\log k)$." Conflates orthogonal arrays with covering arrays. A strength-2 OA on $n$-symbol alphabet requires $N\ge n^2$ and exists with $N=n^2$ only for $k\le n+1$ (when a complete MOLS set exists). The $\Theta(n^2\log k)$ growth is for *covering* arrays $\mathrm{CA}(N;2,k,n)$, where any pair of columns merely *covers* every pair (not exactly $N/n^2$ times). Either change "orthogonal array" to "covering array" or drop the $\log k$ bound.

## Underspecified or unverifiable claims

- "around $80\%$ of bugs in production systems involve at most two parameters interacting" — folk claim citing Kuhn et al. (NIST). Numbers in the literature range 70–95% depending on study; "around 80%" is defensible but uncited.

## Severity

**Minor** — one outright incorrect example (the (7,3,2) BRC-vs-divisibility framing) and one OA-vs-CA conflation. Both are local sentence-level fixes; nothing in the widgets, tables, or main theorem statements is mathematically wrong.
