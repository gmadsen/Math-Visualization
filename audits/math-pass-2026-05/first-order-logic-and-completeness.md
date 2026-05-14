# first-order-logic-and-completeness — math correctness audit (2026-05)

**Section:** Logic & Foundations

## Verified claims

- **Syntax (§1).** Definition of first-order language as triple of constant/function/relation symbols with arities, plus equality, connectives, quantifiers; standard. The two example languages $\mathcal{L}_{\mathrm{ar}}=\{0,1,+,\cdot,<\}$ and $\mathcal{L}_{\mathrm{gp}}=\{e,\cdot,{}^{-1}\}$ are correctly classified by arity (constants vs binary vs unary). Free/bound variable distinction in $\forall x\,(P(x)\to Q(x,y))$ ($x$ bound, $y$ free) is correct.
- **Tarski semantics (§2).** Each row of the satisfaction table (atomic, equality, $\neg$, $\land$, $\forall$, $\exists$) matches the standard recursion, including the $s[x\mapsto a]$ assignment update. Definitions of "satisfiable", "$T\models\varphi$" are correct.
- **Hilbert calculus (§3).** Axioms (K), (S), (N) are the standard Frege-style propositional axioms: K = $\varphi\to(\psi\to\varphi)$, S = $(\varphi\to(\psi\to\chi))\to((\varphi\to\psi)\to(\varphi\to\chi))$, contraposition $(\neg\psi\to\neg\varphi)\to(\varphi\to\psi)$. Universal-instantiation axiom $(\forall I)\;\forall x\,\varphi\to\varphi[x:=t]$ with the side condition "$t$ free for $x$" is correctly stated. Modus ponens and the side condition on generalisation ($x$ not free in any premise) are both correctly stated.
- **Soundness.** Statement $\Gamma\vdash\varphi\Rightarrow\Gamma\models\varphi$ and the proof sketch (induction on proof length) are standard.
- **Deduction theorem.** Statement and the side condition on generalisations binding free variables of $\varphi$ are correctly stated.
- **Completeness theorem (§4).** Statement $\Gamma\vdash\varphi\iff\Gamma\models\varphi$ with the corollary "consistent iff has a model" is correct. Henkin's three-step recipe is correct: (i) witness expansion preserves consistency because any inconsistency uses finitely many witnesses, dischargeable in turn; (ii) Lindenbaum extension to maximal consistency works because for each $\varphi_n$ at least one of $T_n\cup\{\varphi_n\}$, $T_n\cup\{\neg\varphi_n\}$ is consistent; (iii) term model on closed-terms-modulo-provable-equality with the Truth Lemma is the standard construction.
- **Compactness theorem (§5).** Statement (satisfiable iff every finite subset is satisfiable) is correct, as is the proof via completeness + finiteness of formal proofs.
- **Compactness corollaries.**
  - Non-standard model construction: $\mathrm{Th}(\mathbb{N})\cup\{c\ne\overline{n}:n\in\mathbb{N}\}$ has every finite subset satisfied by interpreting $c$ as a sufficiently large natural; compactness gives the model. Correct.
  - "Arbitrarily large finite models $\Rightarrow$ infinite model" via $\sigma_n$ = "at least $n$ distinct elements". Correct.
  - ACF$_0$/ACF$_p$ transfer principle: a sentence true in every ACF of characteristic 0 holds in every ACF of sufficiently large prime characteristic. Correct.
  - "Class of well-orderings not first-order axiomatisable": correct standard application of compactness (add $c_0>c_1>c_2>\dots$).
- **Downward Löwenheim–Skolem.** Statement (countable language + satisfiable $\Rightarrow$ countable model; more generally, model of cardinality $\kappa$ for any $\kappa\ge|T|+\aleph_0$ when an infinite model exists) is correct.
- **Upward Löwenheim–Skolem.** Statement (infinite model + $\kappa\ge|T|+\aleph_0\Rightarrow$ model of cardinality $\kappa$) is correct.
- **Skolem's paradox (§6).** ZFC being countable in a countable language, downward LS giving a countable model $M$, and "uncountable in $M$" meaning "no bijection $\mathbb{N}^M\to\mathbb{R}^M$ inside $M$" — all standard. The "absoluteness fails for cardinality" framing is correct.
- **Decidability (§7).** "Complete + recursively axiomatised $\Rightarrow$ decidable" via proof enumeration: correct.
- **QE statement.** "Every formula equivalent to quantifier-free formula in same free variables" is the standard definition.
- **DLO QE concrete examples in widget.**
  - $\exists y\,(x_1<y\land y<x_2)\equiv x_1<x_2$: correct (density without endpoints).
  - $\exists y\,(y<x_1)\equiv\top$: correct (no minimum in DLO without endpoints).
  - $\exists y\,(x_1<y)\equiv\top$: correct (no maximum).
  - $\exists y\,(x_1<y\land y<x_2\land x_3<y)\equiv (x_1<x_2)\land(x_3<x_2)$: correct (witness exists iff $\max(x_1,x_3)<x_2$, which is $x_1<x_2\land x_3<x_2$).
  - $\exists y\,(y=x_1)\equiv\top$: correct (take $y:=x_1$; nonempty domain).
- **DLO $\aleph_0$-categoricity.** "Exactly one countable model up to isomorphism, namely $(\mathbb{Q},<)$" — standard back-and-forth result, correct.
- **ACF QE.** Tarski/Robinson result: ACF$_p$ admits QE in the ring language; correct.
- **RCF.** Tarski–Seidenberg attribution and the QE-in-$\{0,1,+,\cdot,<\}$ statement are correct.
- **True arithmetic $\mathrm{Th}(\mathbb{N},+,\cdot,0,1)$ undecidable (Tarski).** Correct attribution (Tarski's undefinability of arithmetic truth, plus undecidability via Church/Gödel).
- **Quiz computations.**
  - fol-syntax Q1: free variables in $\forall x(P(x)\to\exists y\,R(x,y))\land Q(z)$ are exactly $\{z\}$. Correct.
  - fol-syntax Q2: depth-$\le 1$ terms from $\{c\}\cup\{f\}\cup\{x\}$: $\{c, x, f(c), f(x)\}$, count $4$. Correct.
  - fol-syntax Q3: only $\forall x\,\exists y\,(x+y=1)$ is well-formed; the others quantify over symbols or have no formula content. Correct.
  - fol-semantics Q1: in $(\mathbb{Z},+,0)$: $\forall x\,\exists y\,(x+y=0)$ is true ($y=-x$); $\forall x(x+x=0)$ false at $x=1$; $\exists x\forall y(x+y=y\land x\ne 0)$ would force $x=0$ (additive identity unique) so contradicts $x\ne 0$; $\forall x(x=0)$ false. Correct.
  - fol-semantics Q2: $R=\{(a,b),(b,c),(a,c)\}$ has $|R\cup R^{-1}|=6$ since $R\cap R^{-1}=\emptyset$. Correct.
  - fol-semantics Q3: standard Tarski clause for $\forall$. Correct.
  - fol-deduction Q1/Q2/Q3: induction-on-proof argument; restricted generalisation rule with side condition; MP takes 2 premises. All correct.
  - fol-completeness Q1/Q2/Q3: completeness statement; Henkin recipe; minimum-1-model. All correct.
  - fol-compactness Q1: finite-subset satisfiability. Correct.
  - fol-compactness Q2: "$c\ne\overline{n}$ for every $n$" is the right axiom set. Correct.
  - fol-compactness Q3: countable model $\Rightarrow$ $\aleph_0$, $n=0$. Correct.
  - fol-lowenheim-skolem Q1/Q2/Q3: downward LS statement; Skolem's paradox resolution; smallest cardinality $\aleph_0$. Correct.
  - fol-decidable-theories Q1/Q2: complete + r.e. $\Rightarrow$ decidable; ACF$_p$ admits QE. Correct.
  - fol-decidable-theories Q3: DLO has 1 countable model up to iso. Correct.

## Wrong / dubious claims

- **§7 table row, "$(\mathbb{Q}_p,+,\cdot)$" / Macintyre.** The "language" entry says "language of valued fields", which is misleading. Macintyre's QE result (1976) requires the *Macintyre language* $\mathcal{L}_{\mathrm{Mac}}=\{0,1,+,\cdot,P_n:n\ge 2\}$ where each $P_n$ is a unary predicate for "is a non-zero $n$-th power" (equivalently, the language of rings expanded by these power-residue predicates). The bare language of valued fields $\{0,1,+,\cdot,|\}$ (or with the valuation ring as predicate) does *not* admit QE for $\mathbb{Q}_p$ — additional power-residue predicates are essential. Suggested fix: change the language column to "ring language + $P_n$ predicates for $n$-th-power residues (Macintyre 1976)" or at minimum "language of valued fields *with $P_n$ predicates*". The "typical post-QE formula" column listing "polynomial inequalities, divisibility" is also slightly off — the right-hand atomic formulas after Macintyre QE are polynomial equations together with the $P_n$ predicates evaluated on polynomials; "divisibility" here likely conflates two things and should be replaced with "$P_n(f(\bar x))$ for polynomials $f$".

## Underspecified or unverifiable claims

- **§7 "Algorithm: replace bound quantifiers by polynomial Boolean conditions, layer by layer."** This is a hand-wave that conflates two separate steps: (a) the existence of a quantifier-free equivalent (the QE property) and (b) the constructive algorithm that produces it. The phrase "polynomial Boolean conditions" presumes a polynomial-flavored language, which is not generic — it's only meaningful for ACF/RCF. For DLO the eliminator gives Boolean combinations of order atoms, not polynomials. Not strictly *wrong*, but the level of abstraction is mismatched with the surrounding general definition of QE. Not a math error.
- **§4 Henkin step 1 ("witnesses").** The page asserts $T^*$ in $\mathcal{L}^*$ remains consistent. The standard Henkin construction iterates this witness step $\omega$ times (each new witness can produce new existential subformulas), so a single one-shot expansion is technically not enough; the construction is usually $T_n^*$ for $n<\omega$ followed by $T^*=\bigcup T_n^*$. The page elides this iteration, which is fine pedagogically but is a slight under-specification rather than an error.
- **Compactness widget step 1 visual.** With prefix containing only "PA axioms (placeholder)", the picture shows $c=0$ marked "forbidden" via a red X even though the clause $c\ne 0$ is not yet active. This is a widget rendering quirk (the code uses `forbidden = step-1` regardless of whether the active clause is the PA placeholder), not a stated math claim, but it slightly misrepresents the witness-selection logic.

## Severity

minor errors (one inaccurate language attribution for the $p$-adic QE row; rest of the page is mathematically clean).
