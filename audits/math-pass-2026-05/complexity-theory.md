# complexity-theory — math correctness audit (2026-05)

**Section:** Logic & Foundations

## Verified claims

### Section 1 — Time complexity and big-O

- **DTIME definition** (line 269): $\mathrm{DTIME}(f(n)) = \{L : \exists M\text{ deciding }L\text{ with }t_M(x)\le f(|x|)\}$ — standard multitape definition.
- **Big-O** (line 273): $f=O(g)$ iff $\exists c>0,n_0$ with $f(n)\le c\,g(n)$ for $n\ge n_0$ — correct.
- **Big-Omega** (line 274): $f=\Omega(g)$ iff $g=O(f)$ — correct.
- **Big-Theta** (line 275): $f=\Theta(g)$ iff $f=O(g)$ and $f=\Omega(g)$ — correct.
- **Little-o** (line 276): $f=o(g)$ iff $f(n)/g(n)\to 0$ — correct (assumes $g(n)\ne 0$ eventually, standard).
- **$\mathsf{P}=\bigcup_k\mathrm{DTIME}(n^k)$** (line 279): correct.
- **$\mathsf{EXP}=\bigcup_k\mathrm{DTIME}(2^{n^k})$** (line 279): standard "EXPTIME" definition; matches Sipser/Arora–Barak convention. (Distinct from $\mathsf{E}=\bigcup_c\mathrm{DTIME}(2^{cn})$, which the page does not introduce.)
- **Polynomial $n^d$ on log-log is a line of slope $d$** (line 281, widget readout line 411): correct — $\log f = d\log n$.
- **Exponential off-chart on log-log**: at $n=2^k$, $\log_2(2^n)=n=2^k$ which grows exponentially in the $x$-axis variable $k$, so the curve is upward-curving with slope $\to\infty$. The widget plots $\log_2(2^n)$ as `Math.pow(2, k)` (line 324), capped by `YMAX=80` — consistent with the on-axis "log scale" labeling.

### Section 2 — P and NP

- **Verifier characterization of NP** (line 430): $L\in\mathsf{NP}\iff\exists V\in\mathsf{P},\,p$ with $x\in L\iff\exists w,|w|\le p(|x|),V(x,w)=1$ — correct standard definition.
- **$\mathsf{NP}=\bigcup_k\mathrm{NTIME}(n^k)$ equivalence** (line 447): correct — the accepting branch is the witness, and the witness drives a deterministic accepting branch.
- **$\mathsf{P}\subseteq\mathsf{NP}$** (line 445): trivial, correct.
- **CLIQUE verifier checks $\binom{k}{2}$ edges** (line 440): correct edge-count for an undirected $k$-clique.
- **HAM-CYC verifier** (line 439): "check edges + visit each vertex once" — correct (the ordering is a Hamiltonian cycle iff consecutive vertices are adjacent and every vertex appears exactly once).
- **SUBSET-SUM verifier** (line 441): "add and compare" against target $t$ — correct.
- **SAT formula in widget** (line 514): $\varphi=(x_1\lor x_2\lor\lnot x_3)\land(\lnot x_1\lor x_2\lor x_4)\land(x_1\lor\lnot x_2\lor x_3)\land(\lnot x_2\lor\lnot x_3\lor\lnot x_4)$ — well-formed 3-CNF, satisfiable (e.g. $w=1100$).
- **Per-clause evaluation** (lines 486–487): clause-as-OR-of-literals semantics is correctly implemented (`c.some([i,neg] => neg ? !w[i] : w[i])`).
- **"Bad witness" button**: $w=(0,0,1,1)$ falsifies $C_1=(x_1\lor x_2\lor\lnot x_3)$ (all three literals are 0). Correctly labeled.

### Section 3 — Cook–Levin

- **Cook 1971 / Levin 1973 attribution** (line 583): historically correct.
- **Tableau encoding** (lines 585–593): rows = time steps $0,\ldots,T(n)$, columns = tape cells $1,\ldots,T(n)$, variables $z_{i,j,s}$ for "cell $j$ at time $i$ holds $s$", clauses for uniqueness / initialisation / $2\times 3$ window-respects-$\delta$ / acceptance — standard Sipser-style encoding.
- **Polynomial CNF size** (line 594): each constraint is a constant-size clause, total $\mathrm{poly}(T(n))=\mathrm{poly}(n)$ — correct.
- **Tableau widget trace** (lines 625–630): rows $(q_0,1)\,1\,\_\ldots$ → $1\,(q_1,1)\,\_\ldots$ → $1\,1\,(q_1,\_)\ldots$ → $1\,1\,\_\,(q_A,\_)\ldots$ is a consistent right-stepping head trace (head moved right each step, transitioned $q_0\to q_1\to q_1\to q_A$, wrote symbols to the cell it left). Tape contents and head positions are consistent across each transition.

### Section 4 — Karp reductions

- **Karp many-one reduction definition** (line 581): polynomial-time computable $f$ with $x\in A\iff f(x)\in L$ — correct.
- **NP-hard / NP-complete distinction** (line 581): NP-hard = every $A\in\mathsf{NP}$ reduces to $L$; NP-complete = NP-hard + $L\in\mathsf{NP}$ — correct.
- **Transitivity of $\le_p$** (line 738): $g\circ f$ poly-time when both are — correct.
- **Karp 1972, 21 problems** (line 729): historically correct.
- **3-SAT $\le_p$ CLIQUE** (line 734): one vertex per literal-occurrence, edges between literals in different clauses unless they are negations — correct standard reduction; a satisfying assignment ↔ an $m$-clique (one literal per clause, mutually consistent).
- **CLIQUE $\le_p$ INDEPENDENT-SET** (line 735): clique in $G$ ↔ independent set in $\bar G$ of the same size — correct, and the "trivially $\le_p$ in the other direction" remark is correct.
- **SAT → 3-SAT widget reduction** (line 765): $(\ell_1\lor\ell_2\lor\ell_3\lor\ell_4)\equiv(\ell_1\lor\ell_2\lor y)\land(\bar y\lor\ell_3\lor\ell_4)$ — verified both directions: if LHS true, set $y$ depending on which literal satisfies; if RHS satisfied, then for either value of $y$ at least one $\ell_i$ must be true.
- **IS $\le_p$ VC** (line 769): $S$ independent ↔ $V\setminus S$ is a vertex cover, so IND-SET$(G,k)$ = VERT-COVER$(G,|V|-k)$ — correct.
- **3-SAT $\le_p$ HAM-CYC** (line 770) and **3-SAT $\le_p$ SUBSET-SUM** (line 771): standard Sipser/Garey–Johnson reductions, sketches are correct.
- **3-SAT $\le_p$ 3-COL** (line 767): "palette" triangle T,F,B + clause gadgets forcing a true-coloured literal — standard, correct (full reduction also includes a variable-triangle gadget per $x_i$, which the gloss elides).

### Section 5 — Space complexity and PSPACE

- **DSPACE/NSPACE counting cells excluding read-only input** (line 844): correct convention enabling sublinear classes.
- **Inclusion chain $\mathsf{L}\subseteq\mathsf{NL}\subseteq\mathsf{P}\subseteq\mathsf{NP}\subseteq\mathsf{PSPACE}\subseteq\mathsf{EXP}$** (line 846): all known.
  - $\mathsf{NL}\subseteq\mathsf{P}$: an NL machine has $2^{O(\log n)}=\mathrm{poly}(n)$ configurations, search the configuration graph in poly time.
  - $\mathsf{P}\subseteq\mathsf{PSPACE}$: trivial.
  - $\mathsf{NP}\subseteq\mathsf{PSPACE}$: enumerate witnesses (line 848).
  - $\mathsf{PSPACE}\subseteq\mathsf{EXP}$: poly-space machine has $2^{\mathrm{poly}(n)}$ configurations.
- **Savitch (1970)** (line 850): $\mathrm{NSPACE}(f)\subseteq\mathrm{DSPACE}(f^2)$ for $f(n)\ge\log n$ — correct, including the corollary $\mathsf{PSPACE}=\mathsf{NPSPACE}$.
- **Configuration count $2^{O(f)}$** (line 852): correct ($|Q|\cdot f\cdot|\Sigma|^f$ for an $f$-space machine).
- **Recursive midpoint argument** (line 852): depth $O(f)$, per-level $O(f)$, total $O(f^2)$ — correct.
- **TQBF as canonical PSPACE-complete problem** (line 854): correct (Stockmeyer–Meyer 1973).
- **Two-player polynomial-length games reduce to TQBF** (line 854): true for generalised geography (Schaefer 1978, Lichtenstein–Sipser 1980), generalised hex (Reisch 1981), generalised Reversi/Othello (Iwata–Kasai 1994). All have polynomial-length plays (in board size), so all reduce to TQBF.
- **Savitch widget readout** (lines 935–941): `Reach(C_start, C_accept, 2^k)` recurses on `Reach(_, C_mid, 2^(k-1))` and `Reach(C_mid, _, 2^(k-1))`; depth $k+1$ and per-level $O(f)$ space giving $O(f^2)$ total — correct presentation of the algorithm.

### Section 6 — Hierarchy theorems

- **Time hierarchy (Hartmanis–Stearns 1965)** (line 956): if $f,g$ time-constructible and $f(n)\log f(n)=o(g(n))$, then $\mathrm{DTIME}(f)\subsetneq\mathrm{DTIME}(g)$ — correct (the standard statement requires only $g$ time-constructible plus $f$ at least $n\log n$-ish; assuming both is harmless).
- **Diagonalisation sketch** (line 958): $D$ simulates $M$ on $\langle M\rangle$ for $g(n)$ steps with universal-TM overhead $\log f$, flipping the result; if $L(D)\in\mathrm{DTIME}(f)$ some $M_0$ deciding it disagrees with $D$ on $\langle M_0\rangle$ — standard, correct.
- **Space hierarchy** (line 960): $f,g$ space-constructible with $f=o(g)$ gives $\mathrm{DSPACE}(f)\subsetneq\mathrm{DSPACE}(g)$, no log factor — correct (universal simulation in space has constant overhead).
- **$\mathsf{P}\subsetneq\mathrm{DTIME}(2^n)\subseteq\mathsf{EXP}$** (line 965): for each fixed $k$, $n^k\log(n^k)=k\,n^k\log n=o(2^n)$, so $\mathrm{DTIME}(n^k)\subsetneq\mathrm{DTIME}(2^n)$. Taking the union: $\mathsf{P}=\bigcup_k\mathrm{DTIME}(n^k)$ is contained in $\mathrm{DTIME}(2^n)$ (each $n^k=O(2^n)$), and the inclusion is strict (otherwise $\mathrm{DTIME}(2^n)\subseteq\mathrm{DTIME}(n^k)$ for some $k$, contradicting hierarchy). Argument is correct.
- **$\mathsf{L}\subsetneq\mathsf{PSPACE}$** (line 966): space hierarchy with $f=\log n$, $g=n$ gives $\mathrm{DSPACE}(\log n)\subsetneq\mathrm{DSPACE}(n)\subseteq\mathsf{PSPACE}$ — correct.
- **$\mathsf{NL}\subsetneq\mathsf{NPSPACE}=\mathsf{PSPACE}$** (line 967): NL ⊆ DSPACE($\log^2 n$) by Savitch, and DSPACE($\log^2 n$) ⊊ DSPACE($n$) ⊆ PSPACE by hierarchy — correct chain.
- **Hierarchy diagonal widget** (lines 989–1073): $D$'s row is $\lnot$diagonal, so $D$ disagrees with each $M_i$ at $\langle M_i\rangle$. Annotation "$D$ runs in $g=4f$ time" matches the slider-driven gap factor — pedagogically simplified but conceptually right.

### Section 7 — Connections

- **IP=PSPACE attribution** (line 1103): Shamir 1990 — correct (with LFKN 1990 for coNP ⊆ IP).
- **PCP / Khot, Dinur attribution** (line 1103): Dinur 2007 (combinatorial proof of PCP), Khot 2002 (Unique Games Conjecture and downstream hardness-of-approximation results) — correct.
- **Fine-grained complexity (SETH, $k$-SUM, 3-SUM hardness)** (line 1105): correct standard listing.
- **GCT / Mulmuley–Sohoni permanent-vs-determinant via representation theory** (line 1105): correct attribution.

### Quizzes (`quizzes/complexity-theory.json`)

- **`cx-time-complexity` Q1**: Big-O ∃c, n₀ formulation — correct as in §1.
- **`cx-time-complexity` Q2**: ordering $\log n \ll n \ll n\log n \ll n^2 \ll 2^n$ — correct.
- **`cx-time-complexity` Q3**: $T(n)=3n^2+50n+100$, smallest non-negative integer $k$ with $T=O(n^k)$ is $k=2$ — correct (k=0 fails since $T\to\infty$; k=1 fails since $T(n)/n\to\infty$; k=2 works).
- **`cx-p-and-np` Q1–Q3**: verifier definition; $\mathsf{P}\subseteq\mathsf{NP}$ as the only currently-known inclusion among the four; $\mathsf{P}=\mathsf{NP}\Rightarrow$ every NP-complete in P — all correct.
- **`cx-np-completeness` Q1–Q3**: Cook–Levin assertion, NP-hardness definition (correctly notes TQBF is NP-hard but probably not in NP), poly-time SAT $\Rightarrow\mathsf{P}=\mathsf{NP}$ — all correct.
- **`cx-reductions` Q1–Q3**: Karp reduction definition, transitivity (3-SAT $\le_p$ IND-SET via composition), PRIMALITY $\notin$ Karp's 21 (PRIMES ∈ P by AKS 2002, Agrawal–Kayal–Saxena) — all correct.
- **`cx-space-complexity` Q1**: Savitch statement — correct.
- **`cx-space-complexity` Q2**: $\mathsf{L}\subseteq\mathsf{NL}\subseteq\mathsf{P}\subseteq\mathsf{NP}\subseteq\mathsf{PSPACE}\subseteq\mathsf{EXP}$ all known; explanation correctly identifies $\mathsf{L}\subsetneq\mathsf{PSPACE}$ and $\mathsf{P}\subsetneq\mathsf{EXP}$ as the only known strict inclusions in the chain (NL ⊊ PSPACE is also known, derivable as in §6, but not flagged — minor omission, not an error).
- **`cx-space-complexity` Q3**: TQBF is PSPACE-complete; SAT NP-complete; PRIMALITY in P; reachability NL-complete — all correct.
- **`cx-hierarchy-theorems` Q1**: time hierarchy implies $\mathsf{P}\subsetneq\mathsf{EXP}$ — correct (sketched above).
- **`cx-hierarchy-theorems` Q2**: time-constructibility lets the diagonal machine count its own steps — correct conceptual answer.
- **`cx-hierarchy-theorems` Q3**: space hierarchy has no log factor because universal simulation in space is constant overhead — correct.

## Wrong / dubious claims

- **SAT verifier widget — "try a satisfying witness" button (line 568)** sets $w=(1,1,1,1)$. But on the embedded formula $\varphi$, clause $C_4=(\lnot x_2\lor\lnot x_3\lor\lnot x_4)$ evaluates to $0\lor 0\lor 0 = 0$ under this witness, so $\varphi(1,1,1,1)=\mathrm{false}$. **The button labeled "try a satisfying witness" produces a non-satisfying witness and the widget will display $V(\varphi,w)=0$ with $C_4$ unsatisfied** — directly contradicting the button label and breaking the pedagogical demonstration that "the instance is satisfiable iff some witness lights up all clauses" (line 449). A genuine satisfying assignment is, e.g., $w=(1,1,0,0)$: $C_1{:}\,x_1{=}1$, $C_2{:}\,x_2{=}1$, $C_3{:}\,x_1{=}1$, $C_4{:}\,\lnot x_3{=}1$. Suggested fix: change line 568 to `w=[true,true,false,false]` (or any actually-satisfying assignment).

- **"Computability is the limit theory: $\mathrm{TIME}(\infty) = $ recursive"** (line 1091). Slightly informal but defensible: the recursive (decidable) sets are precisely $\bigcup_f\mathrm{DTIME}(f)$ over computable $f:\mathbb{N}\to\mathbb{N}$. The notation $\mathrm{TIME}(\infty)$ is non-standard and could mislead; "$\bigcup_f \mathrm{DTIME}(f)$ over all computable $f$" would be cleaner. Not wrong, just imprecise notation.

## Underspecified or unverifiable claims

- **NP definition writes $p\in\mathbb{Z}[x]$** (line 430). The polynomial-witness-length bound is implicitly required to map non-negative integers to non-negative integers (positive on $\mathbb{N}$). $\mathbb{Z}[x]$ literally permits negative coefficients/values, but the standard convention is that "polynomial bound" means an eventually positive polynomial. Mild notational sloppiness; not a real error.

- **Cook–Levin tableau widget transition between row 0 and row 1** (line 626 → line 627). The trace assumes a transition $\delta(q_0, 1) = (q_1, 1, R)$ (write `1`, move right). The widget never states the transition table $\delta$ explicitly, so a reader cannot independently verify that "this is what $M$ does." This is a presentational gap; the tableau is still internally consistent.

- **"Two-player games with polynomial-length play (geography, Reversi, generalised hex) reduce to TQBF"** (line 854). The qualifier "polynomial-length play" is essential — generalised chess and generalised checkers (with their full move-history rules) are EXPTIME-complete, not PSPACE-complete, because plays can be exponentially long. The page correctly restricts to polynomial-length games but doesn't flag the contrast with the EXPTIME-complete games. Pedagogically thin, not wrong.

- **Time hierarchy theorem statement** (line 956). The stated condition "$f, g$ are time-constructible and $f(n)\log f(n) = o(g(n))$" is sufficient for $\mathrm{DTIME}(f)\subsetneq\mathrm{DTIME}(g)$ but slightly stronger than the canonical Sipser statement, which requires only $g$ time-constructible (and $f$ at least roughly $n\log n$). The version given is correct, just not tight on hypotheses.

- **Karp graph widget edge "TSAT → SS"** (line 771): the digit-encoding of subset-sum hardness usually constructs *base-4* (or larger) digits to prevent carries; the gloss "weights are large numbers whose digit-sum at each position counts truth/clause-satisfaction" omits the no-carry condition. Conceptually right, technically incomplete.

## Severity

**One real error + several minor imprecisions.** The SAT verifier widget's "try a satisfying witness" button is a definite math bug: the chosen assignment $(1,1,1,1)$ does not satisfy the embedded formula because of clause $C_4=(\lnot x_2\lor\lnot x_3\lor\lnot x_4)$. The widget will display "rejected" when a user clicks the button intended to demonstrate acceptance, undermining the section's central pedagogical point. Everything else in the prose, widgets, and quiz banks checks out (definitions, attributions, inclusion chains, hierarchy theorems, Cook–Levin, Karp web sketches, Savitch, TQBF, AKS).
