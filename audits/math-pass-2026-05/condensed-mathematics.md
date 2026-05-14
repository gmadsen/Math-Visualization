# condensed-mathematics — math correctness audit (2026-05)

**Section:** Algebra & homological (capstone)

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.

## Verified claims

### §1 Condensed sets: sheaves on the pro-étale site of a point (lines 263–435)

- **Pro-étale site of a point** (line 268): objects = extremally disconnected profinite sets, morphisms = continuous maps, covers = finite jointly-surjective families — matches Scholze, *Lectures on Condensed Mathematics* §2 (the "small" pro-étale site of $*$).
- **Stonean = extr-disc profinite characterization** (line 268): "compact Hausdorff totally disconnected with closure of every open is open" — correct (equivalent to projectivity in CompHaus).
- **Sheaf condition reduces to descent over disjoint union** $X(S \sqcup T) = X(S) \times X(T)$ (line 270) — correct on the small extr-disc site (Scholze, Prop. 2.7): finite covers split because Stonean spaces are projective in CompHaus.
- **Underlying-condensed-set functor** $\underline T(S) := \mathrm{Cont}(S, T)$ (line 276) — standard.
- **Embedding of CGWH is fully faithful** (line 278) — correct (Scholze, Prop. 1.7 / Bhatt–Scholze).
- **Discrete sets ↔ locally constant sheaves; profinite sets ↔ representables** (line 278) — correct.
- **Surjection from extremally disconnected onto every profinite** (line 280): "Stone–Čech of the underlying discrete set works" — correct ($\beta(S^{\delta}) \to S$ is the standard cover).
- **$\mathrm{Cond}(\mathrm{Set})$ has all small (co)limits, is Cartesian closed, and is locally small modulo a universe choice** (line 280) — correct (Grothendieck-topos consequences plus the standard $\kappa$-condensed convention).
- **Widget describe()-table cases** (lines 327–372):
  - $S = *$: $\underline T(*) = T$ — correct.
  - $S = \{a,b\}$: $\underline T(\{a,b\}) = T \times T$ via descent — correct.
  - $\mathrm{Cont}(\mathrm{Cantor}, S^1)$ "locally constant on each component" — correct (Cantor totally disconnected, $S^1$ path-connected, every continuous map factors through $\pi_0(\mathrm{Cantor}) = \mathrm{Cantor}$ as a discrete-set object — the value is the locally-constant subset of $\mathrm{Maps}(\mathrm{Cantor}, S^1)$ but the page's wording "global structure is set-theoretic of cardinality $2^{\aleph_0}$" tracks the cardinality of locally-constant maps, which is correct since each is determined by a finite partition).
  - $\mathrm{Cont}(\mathrm{Cantor}, \mathbb Z_p)$: NOT all locally constant; the identity-like example $\mathbb Z_p \to \mathbb Z_p$ is the standard continuous-but-not-locally-constant probe — correct.
  - $\mathrm{Cont}(\mathrm{Cantor}, \mathbb R)$ via Stone–Weierstrass is uniform limits of step functions — correct.
  - $\mathrm{Cont}(\mathbb Z_p, S^1)$: "continuous *homomorphisms* form $\mathrm{Hom}_{\mathrm{cts}}(\mathbb Z_p, S^1) = \mu_{p^\infty}$, the Prüfer $p$-group, the Pontryagin dual of $\mathbb Z_p$" — correct.
  - $\mathrm{Cont}(\mathbb Z_p, \mathbb Z_p)$: Mahler basis $\binom{x}{n}$ — correct.

### §2 Condensed abelian groups (lines 437–586)

- **$\mathrm{Cond}(\mathrm{Ab})$ is abelian** (line 443): kernels, cokernels, images, coimages, snake/five lemma, LES — correct.
- **Topological Ab is quasi-abelian (Schneiders), not abelian** (line 447) — correct (Schneiders 1999).
- **Enough projectives via $\mathbb Z[S]$ for $S$ extr-disc; enough injectives via Tohoku-style Grothendieck-abelian argument** (line 444) — correct.
- **Banach / LCA / fdim-V embeddings** (line 449): full subcategories, $\mathrm{Ext}^*$ in $\mathrm{Cond}(\mathrm{Ab})$ recovers continuous group cohomology — correct.
- **Pontryagin duality at derived level: $M \mapsto \underline{\mathrm{Hom}}(M, \mathbb T)$ is exact in $\mathrm{Cond}(\mathrm{Ab})$** (line 449) — correct (Clausen–Scholze).
- **Snake-lemma widget cases**:
  - $0 \to \mathbb Z \to \mathbb Z \to \mathbb Z/n \to 0$ (line 474): exact in both Cond and TopAb — correct (all discrete).
  - $0 \to \mathbb Z_{\mathrm{disc}} \to \mathbb Z_p \to \mathbb Z_p/\mathbb Z \to 0$: TopAb broken because $\mathbb Z$ is dense in $\mathbb Z_p$, so topological cokernel collapses to $0$ while algebraic cokernel is $\mathbb Z_p/\mathbb Z$; coimage = $\mathbb Z_{\mathrm{disc}}$, image = $\overline{\mathbb Z} = \mathbb Z_p$, comparison non-iso — correct (this is the textbook non-strict morphism in TopAb).
  - $0 \to \mathbb Z \to \mathbb R \to \mathbb R/\mathbb Z = S^1 \to 0$: clean SES in both — correct ($\mathbb Z$ closed in $\mathbb R$, quotient is the circle).

### §3 Solid abelian groups (lines 588–746)

- **Definition pattern: $\alpha_S\colon \mathbb Z[S] \otimes M \to \mathrm{Maps}(S, M)$ iso for every profinite $S$** (lines 591–595) — heuristically correct (the precise Scholze definition is via $\mathrm{RHom}(\mathbb Z[S]^{\blacksquare}, -) \cong \mathrm{RHom}(\mathbb Z[S], -)$ from completed-vs-discrete free objects); see "Underspecified" below.
- **Solid examples** (lines 599–604):
  - Profinite abelian groups ($\mathbb Z_p$, $\widehat{\mathbb Z}$, finite, Galois groups) — correct.
  - $\mathbb Z[[x]]$, $\mathbb Z_p[[x]]$ — correct (sequential limits with surjective transitions).
  - Mittag-Leffler limits — correct closure axiom.
  - $\mathbb Q_p$, $\mathbb C_p$ — correct (solid as $\mathbb Z_p$-modules, hence as $\mathbb Z$-modules).
- **Non-solid examples** (lines 607–610): $\mathbb R$, complex Banach spaces — correct (archimedean obstruction).
- **Closed under all small (co)limits and extensions, carries solid tensor $\otimes^{\blacksquare}$, $D(\mathrm{Solid})$ is a tensor-triangulated home for completed/profinite homological algebra** (line 613) — correct (Clausen–Scholze §6–7).
- **Idempotence of solidification: $\mathbb Z_p \otimes^{\blacksquare} \mathbb Z_p = \mathbb Z_p$** (line 615) — correct.

### §4 Liquid $\mathbb R$-vector spaces (lines 748–896)

- **Cond(Vect_ℝ) is abelian but lacks a satisfactory tensor product** (line 751) — correct.
- **$p$-liquid via continuous structure map $\mu\colon \mathcal M_p(V) \to V$** (line 755) — correct (Scholze, *Lectures on Analytic Geometry*, Def. 6.4 in spirit).
- **$\mathrm{Liquid}_p(\mathbb R) \subset \mathrm{Cond}(\mathrm{Vect}_{\mathbb R})$ is a full abelian subcategory closed under (co)limits, kernels, cokernels, extensions** (line 760) — correct.
- **Liquid tensor $\otimes^{\liq}$ is symmetric monoidal and exact, derives correctly to $D(\mathrm{Liquid}_p(\mathbb R))$** (line 762) — correct.
- **Classical projective Banach tensor $\widehat\otimes_\pi$ is not exact** (line 765) — correct (well-known counterexamples; e.g., kernel of $\ell^1 \widehat\otimes_\pi \ell^\infty \to \mathcal L(\ell^1, \ell^\infty)^*$ via Pisier).
- **Quasi-abelian / bornological replacements as classical workaround** (line 765) — correct historical context.
- **$L^p$ spaces, $C(X, \mathbb R)$, locally convex TVS embed** (lines 770–774) — correct that they all sit inside, with the caveat below about "$L^p$ matches parameter $p$".

### §5 Liquid Tensor Experiment (lines 898–1034)

- **Statement: $\mathrm{Ext}^i_{\mathrm{Cond}(\mathbb R)}(M_{p'}(S), V) = 0$ for $i \ge 1$, $V$ being $p$-liquid, $0 < p' < p \le 1$** (line 903) — correct (this is the Clausen–Scholze "main theorem of liquid vector spaces").
- **Equivalent reformulation: $M_{p'}(S)$ is "compact-projective" relative to $p$-liquid $V$** (line 905) — correct.
- **Dec 5, 2020 challenge on Buzzard's Xena blog** (line 907 + widget MILESTONES[0]) — correct.
- **Commelin lead, with Topaz / Brasca / Massot / Testa / Nuccio / Buzzard / Mehta and others** (line 909) — correct.
- **Cultural significance: first time a leading mathematician used Lean to gain confidence in a result they personally doubted; mathlib infrastructure for condensed sets / $p$-summable measures / homological algebra became foundational** (line 911) — correct.

### §6 Applications (lines 1036–1159)

- **Six-functor formalism on solid analytic rings: proper-base-change, projection formula, Verdier duality** (line 1043) — correct (Clausen–Scholze).
- **Prismatic cohomology lives in $D(\mathrm{Solid}(\mathbb Z_p))$; integral comparison theorems become quasi-isos there** (line 1047) — correct.
- **Analytic stacks programme on top of analytic rings, generalising rigid + adic + formal under one umbrella** (line 1051) — correct (Clausen–Scholze 2023–2024 lectures).
- **Classical issue cell for `paff`, `disk`, `formal` cases in widget** — all correct restatements of Tate / Huber / Berkovich tradeoffs.

### Concept graph & quiz claims

- **`cm-condensed-sets` quiz**: pro-étale-site MCQ (line 16) correct; $\underline T(S)$ matching for $\mathbb R / \mathbb Z_p / S^1 / *$ probes (line 35) all correct, including $\mathrm{Cont}(\mathbb Z_p, S^1)$ → $\mu_{p^\infty}$ via Pontryagin. Multi-select on Cond(Set) properties (line 49): the four selected — small (co)limits, full faithfulness on CGWH, profinite representables, Cartesian closed — all correct; the rejected size claim is correctly identified as false.
- **`cm-condensed-abelian` quiz**: MCQ on coim ≠ im in TopAb (line 67) correct; ordering of "topos foundation → ab-group object → projective transport → derived functors" (line 93) correct.
- **`cm-solid-abelian` quiz**: $\mathbb R$ as the non-solid in the MCQ (line 111) correct; multi-select on $\mathrm{Solid}(\mathrm{Ab})$ structural properties (line 125) correct (rejecting only "every condensed Ab is solid").
- **`cm-liquid-tensor-experiment` quiz**: venue-of-announcement MCQ (line 207) correct; cultural-impact multi-select (line 235) correctly rejects the two overreaches (first algebraic-topology formalisation; disproof rather than proof).
- **`cm-applications` quiz**: prismatic in $D(\mathrm{Solid}(\mathbb Z_p))$ MCQ (line 253) correct; analytic-ring matching (line 272) all four pairs correct; programme multi-select (line 286) correctly excludes Riemann hypothesis as orthogonal lineage.

## Wrong / dubious claims

### Date error in LTE timeline (lines 909, 919, 953–954)

**The date of the inductive-heart "main theorem" milestone is given inconsistently across the page, and where the year is stated in prose / button it is off by a year.** Three places to fix:

- **Line 909 (prose):** "The main theorem (the inductive heart of the result) was discharged in **May 2022**" — should be **May 2021** (Commelin's first announcement was May 28, 2021; Scholze's "Half a year of LTE" blog post was June 5, 2021).
- **Line 919 (button label):** "May 2022 — main thm" — should be "May 2021 — main thm".
- **Line 952–954 (widget MILESTONES[3]):** the date field already correctly says `'May 28, 2021'`, so the button label and prose disagree with the milestone payload.

Downstream:

- **Concept blurb `cm-liquid-tensor-experiment`** (`concepts/condensed-mathematics.json` line 70): "finishing the main theorem in **mid-2022** and the full result in **2023**" — both wrong: main theorem mid-2021, full result July 2022, generalisations through 2023.
- **Quiz explain for ordering question** (`quizzes/condensed-mathematics.json` line 222): "(3) **May 2022** main inductive theorem" — wrong year, same fix.

### Solid–Cond adjunction described as "both adjoints" (line 613)

> "The inclusion $\mathrm{Solid} \hookrightarrow \mathrm{Cond}$ has both adjoints — solidification ${}^{\blacksquare}$ as a left adjoint, and the inclusion itself as a right adjoint."

This is a **wording self-contradiction**. The inclusion $\iota\colon \mathrm{Solid} \hookrightarrow \mathrm{Cond}$ is a *right* adjoint (to solidification), making Solid a *reflective* subcategory of Cond. There is one adjunction, not two. The phrase "the inclusion itself as a right adjoint" describes the same adjunction as "solidification as a left adjoint", not a second adjunction. The Solid → Cond inclusion is not known (and to my knowledge is not) coreflective, so saying it "has both adjoints" overstates by claiming a second adjoint that doesn't exist. Should read "is a reflective subcategory: solidification ${}^{\blacksquare}$ is left adjoint to the inclusion".

### "$p$ near zero is too strong (too few examples)" (line 777)

> "$1$-liquid is too weak (everything reasonable is $1$-liquid but the tensor product still misbehaves), $p$ near zero is too strong (too few examples). The sweet spot is some $p_0 < 1$"

The directional claim about small $p$ is the wrong way around in the standard convention. As $p$ shrinks toward $0$, the $p$-summable condition gets stricter, $\mathcal M_p$ shrinks, and admitting a structure map $\mathcal M_p(V) \to V$ becomes *easier* — so $p$-liquid becomes a *weaker* property, with *more* examples, not fewer. The "too few examples" framing is reversed. (The "$p$-liquid" property monotonically *strengthens* as $p$ approaches $1$ and the tensor structure breaks at $p = 1$; that is the genuine reason for the strict inequality.)

### "$\mathbb Q \hookrightarrow \mathbb R$ in TopAb: comparison bijective on points but not a homeomorphism" (line 447)

> "the inclusion $\mathbb Q \hookrightarrow \mathbb R$ as topological abelian groups has trivial kernel (so coimage is $\mathbb Q$ with the subspace topology) and dense image (so image is $\mathbb R$); the comparison is bijective on points but not a homeomorphism."

The map $\mathbb Q \to \mathbb R$ (the inclusion) is **injective but not surjective** on points, so it is *not* "bijective on points". The textbook example with the bijective-but-not-homeo wording is the identity from $\mathbb R$ with discrete topology to $\mathbb R$ with Euclidean topology, or the inclusion $\mathbb Z_{\mathrm{disc}} \to \mathbb Z_p$ (used correctly in the snake-lemma widget at lines 482–483). For the $\mathbb Q \hookrightarrow \mathbb R$ example to demonstrate non-strictness, the comparison is "injective with dense, non-closed image — non-iso", not "bijective non-homeo". Wording fix.

### "Banach spaces are $p$-liquid for $p$ smaller than but close to $1$" (line 770)

> "Banach spaces are $p$-liquid for $p$ smaller than but close to $1$;"

In Clausen–Scholze, real Banach spaces are $p$-liquid for *all* $0 < p \le 1$ (not just for $p$ "smaller than but close to 1"). The narrowing to "close to $1$" is unmotivated and contradicted by the LTE main theorem itself, which uses $p$-liquid Banach spaces in the full range $0 < p \le 1$.

### "$L^p$ spaces match the parameter $p$" (line 773)

> "$L^p$ spaces match the parameter $p$;"

This is at best imprecise, at worst incorrect. In the Clausen–Scholze framework, $L^p[0,1]$ for $1 \le p < \infty$ is a Banach space, hence $p'$-liquid for every $0 < p' \le 1$ — there is no "matching" of the Banach $L^p$ index to the $p$-liquid parameter (they live in different ranges and have different roles). The cleaner statement: $L^p$ embeds into $\mathrm{Liquid}_{p'}(\mathbb R)$ for every $p' \in (0,1]$, like every Banach space.

### Widget `qr` case in snake-lemma: "coimage R/Q (with one point set) does not match image R/Q" (line 495)

> "coimage R/Q (with one point set) does not match image R/Q (the whole indiscrete group)"

For the surjection $\mathbb R \to \mathbb R/\mathbb Q$, the coimage is $\mathbb R/\ker = \mathbb R/\mathbb Q$ with the quotient topology (which is the indiscrete topology, since $\mathbb Q$ is dense in $\mathbb R$). It is not "with one point set" — that phrasing seems to describe a Hausdorff-quotient construction where the closure of $\{0\}$ is collapsed, but in the categorical-cokernel formulation the coimage is the whole indiscrete $\mathbb R/\mathbb Q$, matching the image. The actual TopAb pathology in this SES is at the inclusion $\mathbb Q \hookrightarrow \mathbb R$ side (depending on whether one uses Hausdorff or non-Hausdorff cokernel conventions), not at the surjection. Wording is muddled.

## Underspecified or unverifiable claims

### Solidity comparison map (lines 591–595)

The page writes the solidity test as:

$$\alpha_S\colon \mathbb Z[S] \otimes M \to \mathrm{Maps}(S, M)$$

The standard Scholze definition (Lectures on Condensed Mathematics, §5) instead asks that the natural map $\mathbb Z[S] \to \mathbb Z[S]^{\blacksquare} := \varprojlim_i \mathbb Z[S_i]$ (where $S = \varprojlim_i S_i$) induces an isomorphism

$$\mathrm{RHom}(\mathbb Z[S]^{\blacksquare}, M) \xrightarrow{\sim} \mathrm{RHom}(\mathbb Z[S], M).$$

The page's $\alpha_S$ is a heuristic dual; the widget then quietly switches between completed and uncompleted $\mathbb Z[S]$ inside the same explanation (see e.g. lines 677–679 vs. 668: the Cantor branch invokes "Z[Cantor] (completed) tensor M" for solid $M$ and the un-completed "finite formal R-linear combinations" for non-solid $M = \mathbb R$). The notation glosses over the distinction that *is* the technical content of the solid definition. Not a math error per se, but the formulation will be hard to reconcile with any source.

### Solidity widget extra blurbs (lines 684–687)

The "extra" notes assert e.g. "$\mathbb Q_p$ is solid as a $\mathbb Z_p$-module (and a fortiori as a $\mathbb Z$-module). The completed tensor takes $\mathbb Z_p \otimes (\mathbb Q_p\text{ over }\mathbb Z_p) = \mathbb Q_p$ directly." The $\mathbb Z_p \otimes_{\mathbb Z_p} \mathbb Q_p = \mathbb Q_p$ identity is trivial; the *solid* tensor of $\mathbb Z_p$ with $\mathbb Q_p$ as condensed $\mathbb Z$-modules also gives $\mathbb Q_p$ but for less trivial reasons (and the page doesn't disambiguate). Heuristic explanation, hard to verify against the page's own setup.

### Repo creation date (line 942)

The widget MILESTONES[1] dates the repo + blueprint at "March 2021". The actual `leanprover-community/lean-liquid` repository was created in mid-December 2020, with the blueprint coming online in early 2021 (January–February). "March 2021" is plausibly when the blueprint became the public coordination tool, but the repo itself predates this. Minor historical imprecision, not a math claim.

### Prismatic cohomology attribution (line 1047)

> "Bhatt–Morrow–Scholze's *prismatic cohomology* $\mathrm{R}\Gamma_{\mathbb{\Delta}}(X/\mathbb Z_p)$ unifies étale, de Rham, and crystalline …"

Prismatic cohomology proper is the Bhatt–Scholze 2019 paper "Prisms and prismatic cohomology", not Bhatt–Morrow–Scholze. BMS published the integral $p$-adic Hodge / topological-Hochschild-homology line of work that prismatic cohomology eventually subsumed. Attribution slip; no impact on the comparison-theorem claim itself, which is correctly placed in $D(\mathrm{Solid}(\mathbb Z_p))$.

### Liquid quiz "discrete real vector spaces embed" (line 178)

The multi-select explain says "discrete as a degenerate case (the discrete topology is liquid for any $p$)". Discrete $\mathbb R$-vector spaces do embed into $\mathrm{Cond}(\mathrm{Vect}_{\mathbb R})$ as locally constant sheaves, and one can certainly equip them with a structure map $\mathcal M_p(V) \to V$ that factors through the canonical "evaluate at the identity" pairing — but the standard liquid theory tends to be stated for spaces with non-trivial topological / measure content, and "discrete is liquid by triviality" is more a degenerate-edge observation than a substantive embedding. Not wrong; underspecified.

## Severity

**Light.** The headline mathematical content — definitions of condensed set / abelian group / solid / liquid, the Liquid Tensor Experiment statement, the snake-lemma comparison between Cond and TopAb on the $\mathbb Z_{\mathrm{disc}} \to \mathbb Z_p$ example, the Pontryagin / six-functor / prismatic placements, all six concept blurbs, all 18 quiz questions — is correct.

The defects worth fixing are:

1. **Date inconsistency** (highest priority). The "main theorem" milestone is dated 2022 in the prose (line 909), 2022 in the button label (line 919), and 2021 in the milestone payload (line 953). It should be 2021 throughout. Same fix in the concept blurb (`concepts/condensed-mathematics.json` line 70: "main theorem in mid-2022 and the full result in 2023") and the quiz ordering explain (`quizzes/condensed-mathematics.json` line 222: "May 2022 main inductive theorem").
2. **"Both adjoints" wording for Solid ↪ Cond** (line 613) — single-adjunction reflective subcategory, not two adjunctions.
3. **Direction error on small $p$** (line 777) — small $p$ is a weaker condition with more examples, not stronger with fewer.
4. **Bijectivity wording in the $\mathbb Q \hookrightarrow \mathbb R$ TopAb pathology** (line 447) — should say "injective with non-closed dense image" rather than "bijective on points".
5. **Banach spaces are $p$-liquid for all $0 < p \le 1$** (line 770), not only "$p$ smaller than but close to 1".
6. **"$L^p$ spaces match the parameter $p$"** (line 773) is misleading — $L^p$ Banach spaces are $p'$-liquid for every $0 < p' \le 1$.
7. **Snake-lemma widget `qr` description of coimage** (line 495) — "with one point set" doesn't match the indiscrete-quotient computation actually being done.

None of these change the correctness of any theorem statement. (1) is a concrete factual error worth a quick patch; (2)–(7) are wording / scope adjustments.
