# stacks.md — math-correctness audit

## Verified claims (sections)

- **§1 Recap.** Failure of representability for elliptic-curve moduli via the universal `[-1]` automorphism plus extra `μ_4` at `j=1728` and `μ_6` at `j=0` — correct.
- **§2 Groupoids.** `π_0` collapse loses `Aut(x)` — standard.
- **§3 Fibered categories.** Pseudo-functor ↔ category fibered in groupoids equivalence — correct.
- **§4 Descent.** Two-axiom stack definition (Isom is a sheaf; descent data on cocycle glue uniquely) matches Stacks Project tag 026F. Étale/fppf as the working topologies — correct.
- **§5 BG.** Defined as torsors-groupoid; trivial-torsor `Aut = G`; `H¹(F_q, Z/n)` count via continuous `Hom(Ẑ, Z/n) = Z/n` — correct. Widget data table (line ≈537–547): `Z/2,Z/3,S_3` over `F_q` give 2/3/3 classes; over `R` give 2/1/2 — all correct (S_3 over `F_q` count = 3 conjugacy classes; over `R` = 2 since `Hom(Z/2,S_3)/conj` has trivial + transposition). For non-abelian `G` over `R`, `Aut(P_{nontriv}) = Z/2` is the centralizer of the chosen transposition — correct.
- **§6 Quotient stacks.** `[X/G](T)` definition; recovery `[pt/G] = BG`, `[X/{e}] = X`; free action ⇒ `[X/G] ≃ X/G`; stabiliser at orbit = `Stab_G(x)`; action groupoid `G × X ⇒ X` with source/target — all correct. Local model `[A¹/μ_3]` near `j=0` and `[A¹/μ_2]` near `j=1728` — correct (residual after the generic `μ_2` quotient).
- **§7 DM stacks.** Definition (representable, quasi-compact, unramified diagonal + étale atlas); equivalent to `Aut`-schemes finite & unramified — matches Stacks Project tag 026I.
- **§8 DM vs Artin.** Slogan `DM ⇔ Artin with dim Aut = 0` — correct. Examples `Bμ_n` (DM), `B𝔾_m` (Artin only), `Bun_n(C)` (Artin only) — correct.
- **§9 M_{1,1}.** Aut at `j=1728` = `μ_4` (CM by `Z[i]`); at `j=0` = `μ_6` (CM by `Z[ζ_3]`) — correct over chars ≠ 2,3. Failure of DM in char 2,3 due to non-reduced Aut schemes — correct (e.g. `Aut(supersingular E)` of length 24 in char 2). Working over `Z[1/6]` is the standard cleanup.
- **§10 Coarse moduli.** Keel–Mori statement (finite type DM, finite inertia, locally Noetherian) is the standard form (Conrad/Keel–Mori). Universal property + bijection on geometric points — correct. `M_{1,1}` coarse = `A¹_j`, `BG` coarse = `Spec k` — correct.
- **Quizzes (groupoids/BG/quotient/DM/coarse).** Numerics on torsor counts (`H¹(F_q, Z/3)=3`, `H¹(R, Z/2)=2`, `H¹(alg.cl., Z/5)=1`), action of `μ_n` on `A¹` stabiliser at `0` of order `n`, `Bun_n` dim `n²(g-1)`, dimension formula `dim(𝒳) = dim(U) − rel.dim` — all correct. Inertia of `BG` = `[G/G]` (conjugation) — correct.

## Wrong / dubious claims (with file:line)

- **`stacks.html:828` and `quizzes/stacks.json:314,349`.** "Integer Chow ring of `M_{1,1}` is `Z[t]/(12t)`" is imprecise. `Pic(M_{1,1}) = CH¹(M_{1,1}) = Z/12` (Mumford 1965) is right, but `M_{1,1}` is 1-dimensional so `CH^k = 0` for `k ≥ 2`. The presentation `Z[t]/(12t)` (with `deg t = 1`) admits non-zero `t², t³, …`; the correct relation is `Z[t]/(12t, t²)` or just stating `CH* = Z ⊕ Z/12·λ`. Quiz "hard" entry at line 349 attributes `12λ = 0` partly to "the `μ_2` automorphism at every point and the `μ_6` at `j=0`" — the actual derivation (Mumford) involves the discriminant divisor `Δ = 12λ`, not a direct counting; the heuristic is OK but not a proof. Severity: **minor**.

- **`stacks.html:828`.** "the map `π` is *not* a gerbe quotient in general — the fiber of `π` over a stacky point is a classifying stack `B Aut`". The fiber statement is correct, but the phrasing "not a gerbe quotient in general" is awkward; `π` is in fact a (residual) gerbe over its stacky locus and an iso elsewhere. Severity: **minor** (terminology).

## Underspecified or unverifiable claims

- **`stacks.html:717`.** "`Y(N) → M_{1,1}` étale, Galois group `GL_2(Z/N)/{±1}`". The `/{±1}` quotient is correct as the deck group of the cover *to the stack*, because `[-1] ∈ Aut(E)` exhibits `(E, β)` and `(E, -β)` as isomorphic in `M_{1,1}`. Some references quote the deck group as `GL_2(Z/N)` (acting on `Y(N)` as a scheme) — both are defensible depending on whether you mean "automorphisms of the scheme over the stack" or "elements of `GL_2(Z/N)` acting on level structures". Worth a one-line clarification but not wrong. Severity: **minor**.

- **`quizzes/stacks.json:66`.** Hard quiz claiming "isotrivial elliptic surface over `P¹` ... non-trivial via twisting by `μ_2`" as a counterexample to *sheafness* of the naive set-functor. The example is real (Kodaira-style isotrivial families) and does demonstrate non-representability; calling it a failure of the sheaf condition specifically is fine but somewhat collapsed. Severity: **minor**.

- **`stacks.html:503`.** "For `R` a field, the set of iso classes is `H¹(Spec R, G)`". For non-abelian `G`, `H¹` is only a pointed set; the page later (line 567 widget readout) clarifies this. Restating up front would prevent confusion. Severity: **minor**.

## Severity

**clean / minor.** All major mathematical claims (definitions, examples, computations, BG cohomology counts, M_{1,1} stacky points, Keel–Mori, DM-vs-Artin separation, dimension formula) are correct. The only real imprecision is the Chow-ring presentation `Z[t]/(12t)` (missing `t² = 0`), and a couple of phrasings (gerbe terminology, deck-group convention for `Y(N)`) that could use a clause. No factual errors warranting a fix beyond polish.
