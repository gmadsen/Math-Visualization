# infinity-topoi — math-correctness audit (2026-05)

**Section:** Higher categories & toposes
**Files audited:** `infinity-topoi.html`, `concepts/infinity-topoi.json`, `quizzes/infinity-topoi.json`
**Scope:** every formal claim in §§1–7 — definitions of $\mathcal{P}(C)$, $\infty$-topos via accessible left-exact localization, $\infty$-Giraud axioms, geometric morphisms, hypercompletion / internal Whitehead / Postnikov-tower convergence, internal HoTT semantics + universe / object classifier / univalence, étale $\infty$-topos of a scheme + $\Spec\,\mathbb{Z}$ Galois data; HTT citations checked against Lurie's actual numbering; the case-explorer hypotheses in §5; every quiz question + explanation; concept-graph blurbs. Per the audit prompt: (i) ∞-topos definition (presentable + Giraud); (ii) univalence in any ∞-topos; (iii) hypercompletion / truncation tower; (iv) specific ∞-topoi (sheaves on a site, étale, condensed); (v) $\Omega$-spectrum object definition; (vi) ∞-categorical Grothendieck topology; (vii) Postnikov tower convergence claims.

## Severity

**Minor errors with two distinct factual mistakes about the canonical non-hypercomplete example, plus several citation imprecisions and one likely-wrong attribution.** No errors in the central definitional content: HTT 6.1.0.4 / 6.1.0.6 are stated correctly, the $\infty$-Giraud axioms and their relation to the 1-Giraud axioms are accurate, the universal property of $\mathcal{P}(C)$ as free cocompletion is correct, the geometric-morphism setup ($f^* \dashv f_*$ with $f^*$ left exact) is right, the universe / object-classifier story (HTT 6.1.6.7) is accurately stated, and the univalence-as-theorem-not-axiom interpretation is the standard one. The defects are: (a) the canonical "non-hypercomplete" example $\Spec(\prod_n k_n)$ is mis-described as having "infinite Krull dimension" — its Krull dimension is in fact $0$ (every prime corresponds to an ultrafilter on $\mathbb{N}$ and is maximal); the genuine pathology is *infinite cohomological dimension* / unbounded covering dimension; (b) the corresponding sweeping prose claim "infinite Krull dimension … pathologies arise from unbounded-Postnikov-tower behavior" conflates Krull dimension with cohomological dimension; (c) the §6 sandbox attributes the resolution of the Brunerie number $n=2$ to "Brunerie/Ladelle" — "Ladelle" is not a recognized collaborator on this work; the formal Agda computation is Brunerie–Ljungström–Mörtberg (2022); (d) the "Lurie–Galois reconstruction theorem" is cited as "HTT 7.3 + Galois", but HTT §7.3 is the proper-base-change material; the étale-homotopy-type reconstruction is in Hoyois's shape paper / Lurie's SAG, not HTT; (e) the §4 "Lurie convention" claim that 2-cells in $\infty\mathsf{Topoi}$ are nat-trans of $f^*$'s is correct but the prose "composition of geometric morphisms is given by composing $f^*$'s contravariantly with the data flow" is muddled — composition is contravariant in the $f^*$'s but the "data flow" wording is confusing; (f) several minor HTT-numbering imprecisions (7.2.1.12 / 7.2.1.14, 5.2.2, 6.2.1.5) are close-but-not-exact pointers — flagged as citation slips; (g) the descriptions of the local étale ∞-topos at the closed point $(p) \in \Spec\,\mathbb{Z}$ as $B\widehat{\mathbb{Z}}$ silently identify the residue-field étale topos with the strict-henselization étale topos, which is *not* the same data (the latter sees inertia, not just residue Galois); (h) one small over-statement in §1: "$\mathcal{P}(C)$ is locally cartesian closed" is true but is asserted as if it were the trivial part of "presentable + cocomplete," whereas it is actually a genuinely structural fact (G4) that $\mathcal{P}(C)$ does satisfy.

---

## Verified (correct as written)

### §1. $\mathcal{P}(C)$ — presheaf $\infty$-topoi

1. **Definition $\mathcal{P}(C) := \mathrm{Fun}(C^{\mathrm{op}}, \mathcal{S})$** (line 278). Standard.
2. **$\mathcal{S}$ = Kan complexes / animae / homotopy types** (line 278). All three names are in current use; Lurie HTT writes $\mathcal{S}$, the Clausen–Scholze lectures use "anima", classical literature uses "spaces" or "Kan complexes." Correct identification.
3. **Difference from 1-presheaf topos $\widehat{C}$** (line 278): "instead of a set of sections one gets a space of sections, with all higher homotopies recorded." Correct — and the embedding of the 1-piece is via 0-truncation $\tau_{\leq 0}$, mentioned correctly in quiz.
4. **HTT 5.1.5 — free cocompletion** (line 280). The actual theorem is HTT Theorem 5.1.5.6: "$\mathcal{P}(C)$ is the free cocompletion of $C$ in $\widehat{\mathrm{Cat}}_\infty$." Citation is to the correct subsection; the universal-property statement
$$\mathrm{Fun}^L(\mathcal{P}(C), \mathcal{D}) \xrightarrow{\,\simeq\,} \mathrm{Fun}(C, \mathcal{D})$$
is verbatim from Lurie. ✓
5. **Density / colimit-of-representables formula** (line 282): $\widetilde F(X) = \mathrm{colim}_{(c,x) \in C/X} F(c)$. This is the higher density theorem (HTT 5.1.5.3 / Lemma 5.1.5.3); correct.
6. **$\mathcal{P}(*) \simeq \mathcal{S}$** (line 284). Trivial — $\mathrm{Fun}(*^{\mathrm{op}}, \mathcal{S}) = \mathrm{Fun}(*, \mathcal{S}) = \mathcal{S}$ ✓.
7. **$\mathcal{P}(\Delta) = \mathrm{sSet}_\infty$ (simplicial spaces) and $|-|$ is the unique colimit-preserving extension of $\Delta \to \mathcal{S}, [n] \mapsto *$** (line 284). Correct — geometric realization is precisely the left Kan extension along the constant functor at the point, computed via colimit.
8. **$\mathcal{P}(C)$ is presentable and has all $\infty$-(co)limits** (line 286). Standard (HTT 5.5.3.6 etc.).
9. **"every other $\infty$-topos arises as a left-exact localization of some $\mathcal{P}(C)$"** (line 286). This is the content of HTT 6.1.0.4 (the definition itself) plus the Giraud-direction characterization (HTT 6.1.0.6). Correct.

### §1 widget (proof-scrubber `w-presheaf-universal-property`)

10. **Step 3 ∞-Yoneda lemma**: "$\mathrm{Map}_{\mathcal{P}(C)}(j(c), F) \simeq F(c)$ as spaces" (line 327). Correct (HTT 5.1.3.1 and the discussion around it).
11. **Step 4 density**: "canonical map $\mathrm{colim}_{(c, x) \in C/F}\, j(c) \to F$ is an equivalence" (line 332). Correct (HTT 5.1.5.3).
12. **Step 5 universal property** (line 337). Verbatim form of HTT 5.1.5.6.
13. **Step 6 $\mathcal{P}(*) \simeq \mathcal{S}$** (line 342). Correct.
14. **Step 7 "$\mathcal{P}(C)$ is the prototype $\infty$-topos: every other $\infty$-topos is an accessible left-exact localization"** (line 347). Correct (definition, HTT 6.1.0.4).

### §1 quiz claims

15. **Q1 mcq: $\mathcal{P}(*) \simeq \mathcal{S}$** (lines 9–18). Correct, with the right ancillary remark that $\mathrm{sSet}$ is a *model* whose localization is $\mathcal{S}$.
16. **Q2 mcq: $\mathcal{P}(C)$ as free cocompletion, not free completion (= $\mathrm{Ind}(C)$)** (lines 21–32). Correct distinction. $\mathrm{Ind}$ is the free filtered cocompletion / equivalently the free completion in a precise sense — this minor pedagogical point is correctly handled.
17. **Q3 multi-select: presentable, density, prototype $\infty$-topos, but $\mathcal{P}(C) \not\simeq \widehat{C}$** (lines 34–46). Answer set $[0,1,2]$ correct. Note: the explanation says "$\widehat{C}$ is the 1-truncated piece $\tau_{\leq 0}\mathcal{P}(C)$" — this is correct (after restricting to a 1-categorical $C$).

### §2. $\infty$-topos via accessible left-exact localization

18. **HTT 6.1.0.4 cited as the definition** (line 373). Correct citation; the definition itself ("accessible left-exact localization of $\mathcal{P}(C)$") is verbatim.
19. **Lex localization preserves finite $\infty$-limits (terminal, products, pullbacks, homotopy fibers)** (line 375). Correct unfolding.
20. **1-categorical Giraud parallel via sheafification $a_J$** (line 377). Standard.
21. **Inverted class $S$ = covering monomorphisms in $\widehat{C}$** (line 379). Correct under the standard 1-site → ∞-site sheafification recipe.
22. **Descent as totalization $\mathrm{Tot}(F(U_\bullet))$** (line 381). Correct — the $\infty$-categorical descent condition is the limit over the Čech simplicial diagram, computed as a totalization. The 1-categorical equalizer is the truncation of this at level 1.
23. **Accessibility = $L$ accessible $\Leftrightarrow$ $\mathcal{X}$ presentable** (line 383). Correct.
24. **HTT 5.5.4.15 cited for the small-object argument** (Step 4 of widget, line 435). HTT 5.5.4.15 is in the "Reflective subcategories of presentable categories" subsection, cited for the existence of the localization functor via small-object argument. Correct subsection pointer.
25. **HTT 6.2.1.5 cited for "localizing at monos gives lex localization"** (Step 5 of widget, line 440). HTT §6.2.1 is "Topological Localizations." Proposition 6.2.1.5 (or in the surrounding numbering) is the statement that topological localizations (= localizations at monomorphisms) are lex. Correct subsection.
26. **Step 7 widget claim: "$\tau_{\leq 0}: \mathrm{Sh}_\infty(C,J) \to \mathrm{Sh}(C,J)$ recovers the 1-topos"** (line 451). Correct (and conceptually the bridge from ∞ to 1).

### §2 quiz claims

27. **Q1 multi-select: which are $\infty$-topoi** (lines 53–63). Answer $[0,1]$ correct — $\mathcal{S}$ and $\mathcal{P}(C)$ are; $\mathrm{Mod}_R$ and $D(\mathcal{A})$ are stable, hence not ∞-topoi (biproduct ⇒ coproducts not disjoint). Explanation accurate.
28. **Q2 mcq: extra ingredient is $L$ left exact** (lines 65–76). Correct. The ancillary remarks "left adjoint preserves colimits automatically; right adjoints/conservativity are wrong directions" are accurate.
29. **Q3 mcq: descent = $\mathrm{Tot}(F(U_\bullet))$, not equalizer** (lines 78–89). Correct.
30. **Hard Q1 mcq: $\tau_{\leq 0}\mathcal{X} = \mathrm{Sh}(X; \mathsf{Set})$** (lines 94–104). Correct.
31. **Hard Q2 spot-the-error: "left adjoints preserve limits" is the wrong step** (lines 106–119). Correct identification — right adjoints preserve limits, left adjoints preserve colimits. The point that left-exactness for $L$ is genuinely an extra axiom (not automatic from being a left adjoint) is accurate.

### §3. $\infty$-Giraud axioms

32. **HTT 6.1.0.6 cited** (line 463). Correct citation. Lurie's actual statement collapses G1 and G4 into "presentable + colimits universal" + two more axioms; the page splits into four for clarity (G1 presentable, G4 universal colimits as separate). Both phrasings are common in the literature.
33. **G1 (Presentability)** (line 466). Correct definition (cocomplete + accessible + small set of $\kappa$-compact generators).
34. **G2 (Disjoint, pullback-stable coproducts)** (line 467). Correct — both the disjointness condition and the pullback-stability are needed; both are in HTT 6.1.0.6.
35. **G3 (Effective groupoid objects, $X_1 \xrightarrow{(d_0,d_1)} X_0 \times_{|X_\bullet|} X_0$ equivalence)** (line 468). Correct (HTT Definition 6.1.2.7 + 6.1.0.6).
36. **G4 (Universal colimits / locally cartesian closed)** (line 469). Correct equivalence — pullback preserves all colimits iff it has a right adjoint (by adjoint functor theorem, given presentability), iff each slice is cartesian closed.
37. **Comparison with 1-Giraud: equivalence relations → groupoid objects** (line 472). Correct — the homotopy-coherent generalization. The "higher coherences come for free in the Segal definition" remark is accurate.
38. **"Effectivity becomes the symmetric condition"** (line 472). Correct framing.
39. **Slogan about which axiom powers what HoTT operation** (line 474):
    - G4 (universal colimits) → $\Pi$-types via the right adjoint $f_*$ to pullback. ✓
    - G3 (effective groupoids) → quotients by equivalence. ✓
    - G2 (disjoint coproducts) → dependent sums on finite types. ✓
    - G1 → constructibility. ✓ (This last is more aesthetic than precise, but it's used in just that informal sense.)

### §3 widget (proof-scrubber `w-giraud-axioms`)

40. **Step 2 (G1 on $\mathcal{S}$)**: $\mathcal{S}$ is $\aleph_0$-presentable with generators $\{S^n\}_{n \geq 0}$ (line 503). Correct.
41. **Step 3 (G2)**: $X \times_{X \sqcup Y} Y = \emptyset$ in $\mathcal{S}$ (line 508). Correct.
42. **Step 4 (G3)**: action groupoid $X \times G^\bullet$ has colimit $X //\!/ G$, with Segal map $X \times G \xrightarrow{\sim} X \times_{X//G} X$ (line 513). Correct — this is the standard "free $G$-action ⇒ effective groupoid" example.
43. **Step 5 (G4)**: pullback commutes with colimits in $\mathcal{S}$, slice has internal hom (line 518). Correct.
44. **Step 6 (converse direction G1–G4 ⇒ ∞-topos)** (line 523). Sketch is faithful to Lurie's proof of HTT 6.1.0.6 (restricted Yoneda + show left adjoint is lex using G2+G3+G4).

### §3 quiz claims

45. **Q1 multi-select: all four are $\infty$-Giraud axioms** (lines 125–135). Correct.
46. **Q2 mcq: groupoid objects vs equivalence relations** (lines 137–148). Correct — the homotopy-coherent generalization.
47. **Q3 mcq: G4 powers $\Pi$-types** (lines 150–161). Correct — universal colimits = pullback has right adjoint = $f_*$ exists = $\Pi$-types.
48. **Hard Q1 multi-select: which 1-Giraud axioms lift verbatim vs require modification** (lines 166–176). All four answers are reasonable, though the verdict "G1, G2 lift verbatim, G3, G4 modify-into-coherent" is a defensible heuristic rather than a sharp theorem. The answer set $[0,1,2,3]$ is "all of them are accurate descriptions" — fine.
49. **Hard Q2 mcq: "$\infty$-topos minus G4 = $(\infty,1)$-pretopos"** (lines 178–189). The terminology is somewhat unsettled in the literature — the explanation correctly flags this. Defensible.

### §4. Geometric morphisms of $\infty$-topoi

50. **Geometric morphism = adjunction $f^* \dashv f_*$ with $f^*$ left exact** (line 549). Standard.
51. **Convention: $f$ "points the way of $f_*$"** (line 551). Standard.
52. **Étale geometric morphism $\mathcal{E}_{/X} \to \mathcal{E}$**: $f^* = X \times -$, plus further left adjoint $f_!$ (lines 556–557). Correct (HTT 6.3.5.1 etc.). Étale geometric morphisms are equivalent to objects of $\mathcal{E}$ — also correct (HTT 6.3.5.5).
53. **Surjective geometric morphism = $f^*$ conservative** (line 558). Standard definition (HTT 6.5.1.16).
54. **HTT 5.2.2 cited for ∞-adjunctions** (line 561). HTT §5.2 is "Adjoint Functors," subsection 5.2.2 is on the definition. Correct.
55. **Triangle identities are equivalences (not equalities), full coherence is simplicial** (line 561). Correct — this is precisely the difference between strict and homotopy-coherent adjunctions, treated in HTT §5.2.

### §4 widget (`w-geom-morph`)

56. **`fstar` description: left adjoint, left exact, étale case = $X \times -$** (line 586). Correct.
57. **`fstar_r` description: right adjoint, preserves finite limits + filtered colimits, generally not arbitrary colimits; for open inclusion is "extend by sections, sheafify"** (line 590). Correct.
58. **`eta`: $\eta\colon \mathrm{id}_\mathcal{E} \to f_* f^*$** (line 593). Correct direction.
59. **`eps`: $\varepsilon\colon f^* f_* \to \mathrm{id}_\mathcal{F}$** (line 597). Correct direction. "Equivalence iff $f$ is fully faithful as a geometric morphism — connected/local $\infty$-topos" is correct (this is the standard characterization of fully faithful right adjoints).
60. **`t1`, `t2`: triangle identities are *equivalences* in mapping spaces, not strict equalities** (line 600). Correct.

### §4 quiz claims

61. **Q1 mcq: $f^*$ is the left adjoint and is left exact** (lines 197–207). Correct.
62. **Q2 mcq: $f^*(*) = \mathrm{id}_X$ in the slice** (lines 210–220). Correct — $f^*$ preserves terminal (left exact); terminal of $\mathcal{E}_{/X}$ is the identity.
63. **Q3 multi-select: surjective ↔ conservative; étale ↔ object; 2-cells in $f^*$-direction; lex-accessible ⇒ geometric** (lines 222–232). All four standard. The fourth (HTT representability of geometric morphisms by lex-accessible functors) is HTT 6.3.1.7 / Proposition 6.3.1.16. Correct.

### §5. Hypercompletion and Whitehead's theorem

64. **Definition of $\infty$-connective** (line 688). Standard — every $\pi_n(f)$ is iso of homotopy sheaves.
65. **HTT 6.5.2 cited for hypercompletion** (line 686). Correct subsection.
66. **HTT 6.5.2.13 for "hypercompletion is itself an $\infty$-topos"** (line 692). Correct (the actual statement is around 6.5.2.12 / Proposition 6.5.2.13).
67. **Hypersheaves = sheaves satisfying descent for hypercovers** (line 692). Correct (HTT 6.5.3 / 6.5.4).
68. **Finite covering dimension ⇒ hypercomplete** (line 694). Correct (HTT 7.2.1.10 / 7.2.1.14 region — see U2 below).
69. **$\mathrm{Sh}_\infty^\wedge$ for locally Noetherian schemes of finite Krull dimension is hypercomplete and natural for $\ell$-adic** (line 694). Correct — this is the operative setup in derived étale theory.

### §5 first widget (proof-scrubber `w-whitehead-internal`)

70. **Step 1 classical Whitehead** (line 709). Standard statement.
71. **Step 2 internal Whitehead question** (line 714). Correct rephrasing using homotopy sheaves.
72. **Step 3 Postnikov tower convergence iff hypercomplete (HTT 6.5.2.16)** (line 719). Correct citation; HTT 6.5.2.16 (or Proposition 6.5.2.13 surroundings) is the convergence equivalence.
73. **Step 4 failure example: $K(\mathbb{Z}/2, \infty) := \prod_{n \geq 1} K(\mathbb{Z}/2, n)$** (line 724). The construction is standard for producing infinite-Postnikov-tower pathologies.
74. **Step 5 hypercompletion = lex localization at $\infty$-connective maps** (line 729). Correct.

### §5 case-explorer (`w-hyp-cases`)

75. **Hypotheses well-defined**: hypercomplete, finite cd / Krull, Postnikov converges, internal Whitehead. ✓
76. **Case $\mathcal{S}$ — all four pass** (lines 757–763). Correct.
77. **Case $\mathrm{Sh}_\infty(X)$ for $X$ finite-dim CW** (lines 768–774). All four pass; "HTT 7.2.1.12 / 7.2.1.14" cited for hypercompleteness — see U2 below for citation precision.
78. **Case $\mathrm{Sh}_\infty(X)^\wedge$ — hypercomplete by construction; finite-dim NOT required** (lines 779–784). Correct.
79. **Case $(\Spec\,\bar k)_{\mathrm{ét}}^\wedge \simeq \mathcal{S}$** (lines 800–806). Correct — algebraically (separably) closed field has trivial absolute Galois group, étale topos = $\mathcal{S}$.
80. **Case profinite $BG_{\mathrm{prof}}$ with $\mathrm{cd}_\ell = \infty$** (lines 811–817). Correct that this is the canonical class of non-hypercomplete examples for $\ell$-adic homotopy.

### §5 quiz claims

81. **Q1 mcq: hypercomplete ⇔ internal Whitehead** (lines 240–251). Correct definition.
82. **Q2 mcq: hypercompletion needed when base has infinite cohomological/Krull dim** (lines 253–264). The verdict is correct in spirit, but the conflation of Krull and cohomological dimension is the same conflation flagged below in W1/W2.
83. **Q3 mcq: $\pi_n$-iso means iso on homotopy *sheaves*, not on global sections** (lines 266–277). Correct.
84. **Hard Q1 mcq: hypercompletion = localization at $\infty$-connective maps** (lines 282–292). Correct.
85. **Hard Q2 spot-the-error: pointwise convergence ≠ ∞-categorical convergence** (lines 294–306). Correct identification — limits in sheaves are sheafifications of pointwise limits, and the discrepancy is exactly where hypercompleteness fails.

### §6. Internal logic — HoTT and $\infty$-topoi

86. **Dictionary table** (lines 843–853): Type ↔ object, term ↔ global section $* \to A$, identity type ↔ mapping space, dependent type = display map $B \to A$, $\Pi$ = pushforward $f_*$, $\Sigma$ = pushforward $f_!$ (= $f_!$ left adjoint to pullback in locally cartesian closed setting, often written as composition along the display map), univalent universe ↔ object classifier, HIT ↔ colimit. All correct under the standard interpretation.
87. **Object classifier $\mathcal{U}_\kappa$ classifies $\kappa$-small fibrations** (line 855, citing HTT 6.1.6). Correct citation (HTT Theorem 6.1.6.7 / 6.1.6.8). The "$\kappa$-small" gloss is in terms of fiber compactness — HTT actually defines "relatively $\kappa$-compact" morphisms in 6.1.6.4; the page's "fibers $\kappa$-compact" phrasing is the conventional shorthand and matches Lurie's intent for representable cases.
88. **Truncation tower $\Omega = \mathcal{U}_{\leq -1} \subset \mathcal{U}_{\leq 0} \subset \mathcal{U}_{\leq 1} \subset \cdots \subset \mathcal{U}$** (line 857–859). Correct.
89. **Univalence is automatic in any $\infty$-topos because $\mathcal{U}$ is built as a moduli object** (line 855). Correct interpretation — paths in a moduli space of types ARE equivalences of types, definitionally.
90. **Shulman 2019 "All $(\infty,1)$-toposes have strict univalent universes"** (line 861). Correct attribution; this is Shulman's "All $(\infty,1)$-toposes have strict univalent universes" (arXiv 1904.07004).
91. **Synthetic theorems translate to every $\infty$-topos** (line 861). Correct consequence of the coherence theorem.

### §6 widget (`w-univalent-universes` proof-scrubber)

92. **Step 1 1-topos $\Omega$ classifies subobjects** (line 887). Standard.
93. **Step 2 $\infty$-version: $\kappa$-small maps** (line 892). Correct.
94. **Step 3 object classifier exists (HTT 6.1.6.7)** (line 897). Correct.
95. **Step 4 univalence: $\mathrm{Map}_{\mathcal{U}_\kappa}(X, Y) \simeq \mathrm{Eq}(X, Y)$** (line 902). Correct statement of Voevodsky's univalence axiom.
96. **Step 5 truncation tower** (line 907). Correct.
97. **Step 6 dictionary: $\Sigma \leftrightarrow f_!$, $\Pi \leftrightarrow f_*$, identity ↔ path space, HIT ↔ colimit** (line 912). All correct.
98. **Step 7 Shulman coherence** (line 917). Correct attribution.

### §6 quiz claims

99. **Q1 mcq: object classifier $\mathcal{U}_\kappa$ classifies $\kappa$-small fibrations** (lines 314–323). Correct, with proper bottom-of-tower identification $\Omega = \mathcal{U}_{\leq -1}$.
100. **Q2 mcq: univalence $(X =_\mathcal{U} Y) \simeq (X \simeq Y)$** (lines 325–337). Correct.
101. **Q3 multi-select: HoTT/topos dictionary (Π↔$f_*$, Σ↔$f_!$, identity↔mapping space, HIT↔colimit)** (lines 339–351). All four correct.
102. **Hard Q1 mcq: $\Omega = \mathcal{U}_{\leq -1}$ in any $\infty$-topos** (lines 355–365). Correct.
103. **Hard Q2 mcq: Shulman coherence ⇒ HoTT theorems hold in every Grothendieck $\infty$-topos** (lines 368–378). Correct interpretation.

### §6 sandbox (`w-hott-sandbox`)

104. The toy-model JavaScript skeleton is illustrative, not a formal HoTT implementation; the type / Pi / Sigma / Id encodings are reasonable JS analogues. The "Brunerie's number = 2" claim is correct (modulo the attribution issue — see W3 below). The truncation-tower print-out matches §6 prose.

### §7. The étale $\infty$-topos of a scheme

105. **Definition of the small étale site $X_{\mathrm{ét}}$** (line 950). Standard.
106. **Classical 1-topos $\mathrm{Sh}_{\mathrm{ét}}(X)$ = sheaves of sets on $X_{\mathrm{ét}}$, the workhorse of étale cohomology** (line 950). Correct.
107. **$\infty$-version $\mathrm{Sh}_\infty(X_{\mathrm{ét}}, \mathcal{S})$, $0$-truncation recovers classical, hypercompletion is the home for $\ell$-adic** (line 952). Correct.
108. **Generic point $\eta = (0)$ with local data $\mathcal{O}_{X,\eta} = \mathbb{Q}$, strict henselization $= \bar{\mathbb{Q}}$, residue field $\kappa(\eta) = \mathbb{Q}$, Galois group $G_\mathbb{Q}$** (lines 980–986). All correct. Cardinality $|G_\mathbb{Q}| = 2^{\aleph_0}$ correct (Krasner: $G_\mathbb{Q}$ is a profinite group of cardinality continuum). $\mathrm{cd}\,\mathbb{Q} = \infty$ correct.
109. **Closed point $(p)$: $\mathcal{O}_{X,(p)} = \mathbb{Z}_{(p)}$, strict henselization $\mathbb{Z}_p^{\mathrm{sh}}$ with residue $\bar{\mathbb{F}}_p$, residue field $\mathbb{F}_p$, Galois group $G_{\mathbb{F}_p} = \widehat{\mathbb{Z}}$ generated by Frobenius $x \mapsto x^p$** (lines 998–1003 + closedTemplate function). All correct as facts about residue-field arithmetic. (The identification of $\mathrm{Sh}_\infty((\Spec\,\mathbb{F}_p)_{\mathrm{ét}})^\wedge$ with $B\widehat{\mathbb{Z}}$ as the local ∞-topos is correct for "local at the closed fibre"; see U3 for nuance.)
110. **$\mathrm{cd}\,\mathbb{F}_p = 1$ (only $H^0$ and $H^1$)** (line 1003). Correct — the absolute Galois group of $\mathbb{F}_p$ is $\widehat{\mathbb{Z}}$, which is procyclic, and procyclic profinite groups have cohomological dimension 1.

### §7 quiz claims

111. **Q1 mcq: shape of $\mathrm{Sh}_\infty((\Spec\,\mathbb{Z})_{\mathrm{ét}})^\wedge$** (lines 386–397). Correct picture — generic + closed points with their respective Galois data; correctly rejects the trivializations.
112. **Q2 mcq: hypercompletion needed for $\ell$-adic** (lines 399–409). Correct — the $\mathbb{Z}_\ell$ inverse-limit needs Postnikov convergence, hence hypercompleteness.
113. **Q3 multi-select: hypercomplete, $\tau_{\leq 0}$ recovers 1-topos, home for derived étale, Lurie–Galois reconstruction** (lines 412–422). The first three are clearly correct. The fourth (Lurie–Galois reconstruction up to profinite Galois twist) is correct as a statement, but the citation "HTT 7.3 + Galois" is misplaced — see W4.

### Concept-graph blurbs

114. **`presheaf-infty-topos` blurb**: "$\mathcal{P}(C) = \mathrm{Fun}(C^{\mathrm{op}}, \mathcal{S})$, free cocompletion, prototypical $\infty$-topos." Correct.
115. **`infty-topos-definition` blurb**: "accessible left-exact localization of $\mathcal{P}(C)$." Correct.
116. **`giraud-infty` blurb**: "presentability + descent for groupoid objects + universal disjoint coproducts." Slightly under-states (omits universal colimits / G4) but the main thrust is right.
117. **`geometric-morphisms-infty` blurb**: "$f^* \dashv f_*$ with $f^*$ left exact; étale ↔ open inclusion; surjective ↔ cover." Correct.
118. **`hypercompletion` blurb**: "Whitehead internal; most natural ones hypercomplete; pathologies from infinite Krull dimension." Same Krull-vs-cohomological-dim conflation as the prose (W1).
119. **`internal-logic-of-infty-topos` blurb**: "Internal type theory ML-style with univalent universes and HITs, modeled by $\mathcal{X}$ itself." Correct.
120. **`etale-infty-topos-of-scheme` blurb**: "$\infty$-refinement of $\mathrm{Sh}_{\mathrm{ét}}(X)$ keeps higher homotopical info; hypercompletion is the natural home for $\ell$-adic." Correct.

---

## Wrong claims

### W1. The non-hypercomplete example $\Spec(\prod_n k_n)$ does NOT have infinite Krull dimension.

**Locations:**
- Case-explorer entry, line 788: `latex: '\\mathrm{Sh}_\\infty(X_{\\mathrm{Zar}}), \\dim X = \\infty'`.
- Case-explorer text, line 789: "infinite Krull dimension — pathological."
- Case-explorer hypothesis "finite", line 792: "Krull dimension is infinite by construction (the spectrum has countably many isolated points)."

**Why it's wrong:** For $A = \prod_{n \in \mathbb{N}} k_n$ a countable product of fields, the prime spectrum $\Spec\,A$ has primes in bijection with ultrafilters on $\mathbb{N}$:
- Principal ultrafilter at $n$: kernel of projection $A \twoheadrightarrow k_n$, with quotient $k_n$ — *maximal* ideal.
- Free (non-principal) ultrafilter $\mathcal{U}$: kernel of projection $A \twoheadrightarrow A/\mathcal{U}$ to the ultraproduct $\prod_n k_n / \mathcal{U}$, also a field — also a *maximal* ideal.

Every prime is maximal, so the Krull dimension is $\dim A = 0$, not $\infty$. The spectrum is a Stone space (totally disconnected, compact, Hausdorff) — homeomorphic to $\beta\mathbb{N}$ when all $k_n$ are equal. There is *no chain* $\mathfrak{p}_0 \subsetneq \mathfrak{p}_1 \subsetneq \cdots$ of distinct primes.

**What is actually infinite:** The cohomological / covering dimension (as a topological space, $\Spec A$ has infinite Lebesgue covering dimension when there are infinitely many isolated points; equivalently, the covering-dimension hypothesis of HTT 7.2.1.10 fails). The non-hypercompleteness comes from this *topological* infiniteness, not Krull-dimension infiniteness.

**Why the example still works:** HTT 6.5.4.5 (and the surrounding examples) constructs a non-hypercomplete sheaf on a countably-infinite product of $\infty$-topoi (or on a Stone space with infinitely many points). The mechanism is that one can build an $\infty$-connective map exploiting the unbounded "depth" of cohomology of the topological space — and this is fundamentally a covering-dimension phenomenon, not a Krull-dimension one.

**Suggested fix:** In the case-explorer entry, change `\\dim X = \\infty` to a marker like `\\mathrm{cd}\\,X = \\infty` or `X \\text{ has infinite covering dim}`. In the text, change "infinite Krull dimension" to "infinite cohomological / covering dimension" and "spectrum has countably many isolated points" to "topological space has infinite covering dimension because of countably many isolated points." The "(HTT 6.5.4 — countable infinite-product example)" citation can stay; just describe what's actually pathological.

### W2. §5 prose (line 690): "infinite Krull dimension, or a profinite space with $\mathrm{cd}_\ell = \infty$" — same conflation.

**Location:** §5 prose paragraph at line 690.

**Why it's wrong:** "Infinite Krull dimension" and "infinite cohomological dimension" are *different conditions* and the page treats them as alternative descriptions of the same pathology. Krull dimension measures chains of primes in a ring; cohomological dimension measures the homological length of "cohomology supports." For an $\infty$-topos $\mathrm{Sh}_\infty(X)$ to fail hypercompleteness, the operative condition is unbounded covering / cohomological dimension — Krull is largely irrelevant. The example $\Spec(\prod_n k_n)$ from the case-explorer (W1) is in fact a *Krull-dimension-0* witness of cohomological-dimension-$\infty$ pathology.

**What is true:** For a Noetherian scheme $X$, *finite* Krull dimension does imply *finite* cohomological dimension for the étale topos with torsion coefficients (Artin's affine vanishing + cohomological dimension bounds), so "finite Krull dim ⇒ hypercomplete" is a correct *implication* in many cases. But the converse — that infinite Krull dim is what causes hypercompleteness failures — is wrong. The failure is keyed to cohomological dimension.

**Suggested fix:** Reword §5 prose as: "for a 'very high cohomological-dimension' base — informally, a topological space (or scheme) where covering dimension is unbounded; the ring-theoretic counterpart is bases where one cannot bound the depth of cohomology with finite-rank coefficients." Drop "infinite Krull dimension" or qualify it as "bases of unbounded étale cohomological dimension, e.g. via infinite Krull dimension *together with* bounded depth."

The same fix applies to:
- §5 prose at line 694: "(infinite Krull dimension; pro-finite covers of profinite groups with infinite virtual cohomological dimension; certain operadic completions)" — the first should be "infinite covering / étale cohomological dimension."
- `concepts/infinity-topoi.json` `hypercompletion` blurb: "pathological non-hypercomplete examples come from infinite Krull dimension" → "from infinite cohomological / covering dimension."
- §5 quiz Q2 mcq, lines 256–263: "When the base has infinite cohomological / Krull dimension" should drop "Krull" (or replace with "covering").

### W3. Brunerie number attribution: "Brunerie/Ladelle" is not a recognized collaboration.

**Location:** §6 sandbox `w-hott-sandbox`, prelude code comment at line 937, the line about `brunerieN = 2`: "Open problem 2014-2022; resolved n = 2 by Brunerie/Ladelle."

**Why it's wrong:** I cannot identify a researcher "Ladelle" working on the Brunerie-number computation. The actual history:
- Guillaume Brunerie's PhD thesis (2016, Université de Nice) reduced $\pi_4(S^3)$ to a single integer $n$ (the "Brunerie number") with $\pi_4(S^3) = \mathbb{Z}/n\mathbb{Z}$, and conjectured $n = \pm 2$ based on classical results.
- The fully constructive / formal computation that $n = 2$ was completed in:
  - Guillaume Brunerie, Axel Ljungström, Anders Mörtberg, "Synthetic Integral Cohomology in Cubical Agda" (2022, arXiv:2212.04182) and subsequent computer-checked Agda formalization.
- Other names sometimes cited in this circle: Mörtberg, Buchholtz, Ljungström, Cavallo, Awodey.

The likely intended attribution is "Brunerie/Ljungström/Mörtberg" or simply "Brunerie" (for the original synthetic argument).

**Suggested fix:** Replace "Brunerie/Ladelle" with "Brunerie (synthetic, 2016) — formal computer-checked computation Brunerie–Ljungström–Mörtberg (2022)" or simply "Brunerie."

### W4. "Lurie–Galois reconstruction theorem (HTT 7.3 + Galois)" is mis-cited.

**Locations:**
- §7 prose, line 956: "The Lurie–Galois reconstruction theorem (HTT 7.3 + Galois) says that for $X$ a Noetherian scheme of finite Krull dimension, $\mathrm{Sh}_\infty(X_{\mathrm{ét}})^\wedge$ encodes $X$ up to a profinite Galois twist."
- §7 quiz Q3 hard explanation, line 421: "Lurie's reconstruction (HTT 7.3 + Galois) recovers $X$ from $\mathrm{Sh}_\infty(X_{\mathrm{ét}})^\wedge$ up to Galois twist."

**Why it's wrong:** HTT §7.3 is "The Proper Base Change Theorem" — specifically, §7.3 covers *cohomology of $\infty$-topoi*, including proper base change for ∞-topoi (HTT Theorem 7.3.1.6 etc.). It does *not* contain an étale-homotopy-type reconstruction theorem.

The actual reference for "scheme determined up to profinite Galois twist by its étale ∞-topos" is:
- For schemes / shape: Marc Hoyois, "Higher Galois theory" (J. Pure Appl. Algebra, 2018, or the earlier "A note on étale homotopy type", arXiv:1402.6336 onwards).
- Lurie's treatment of the étale homotopy type via the *shape* of the étale ∞-topos is in Spectral Algebraic Geometry (SAG) §A or the "Galois extensions" discussion, not in HTT.
- The classical forerunner is Artin–Mazur's "Étale homotopy type" (LNM 100, 1969), which already gives the profinite-up-to-Galois reconstruction for étale homotopy types.

**Suggested fix:** Replace "(HTT 7.3 + Galois)" with "(Artin–Mazur étale homotopy + Hoyois shape; SAG)." Or simply drop the parenthetical citation if precision isn't needed at the page's level. The substance of the statement (étale ∞-topos determines scheme up to profinite Galois twist) is correct.

### W5. The (∞,2)-category prose: "composition of geometric morphisms is given by composing $f^*$'s contravariantly with the data flow" — muddled.

**Location:** §4 prose, line 553.

**Why it's wrong / muddled:** The intended statement is: composition of geometric morphisms $\mathcal{G} \xrightarrow{g} \mathcal{F} \xrightarrow{f} \mathcal{E}$ is given on inverse images by $(f \circ g)^* = g^* \circ f^*$ — the $f^*$'s compose in the *opposite* order of the geometric morphisms themselves, because $f^*$ goes the *other way* ($\mathcal{E} \to \mathcal{F}$ vs $f\colon \mathcal{F} \to \mathcal{E}$). The phrase "contravariantly with the data flow" is non-standard and suggests something different from what's meant. The original 1-categorical fact is just $(f \circ g)^* = g^* \circ f^*$, which is the natural functoriality of pullback; "contravariant" applies to the relation between $f$ and $f^*$, not to "data flow."

**Suggested fix:** Replace with "Composition of geometric morphisms $\mathcal{G} \xrightarrow{g} \mathcal{F} \xrightarrow{f} \mathcal{E}$ is defined on inverse images by $(f \circ g)^* = g^* \circ f^*$ — the $f^*$'s compose in the opposite order from the geometric morphisms themselves, because $f^* \colon \mathcal{E} \to \mathcal{F}$ goes against the geometric direction $f \colon \mathcal{F} \to \mathcal{E}$."

---

## Underspecified or convention-flagged claims

### U1. §1 prose (line 286): "$\mathcal{P}(C)$ is presentable, locally cartesian closed, has all $\infty$-(co)limits, and satisfies all the $\infty$-Giraud axioms (§3)."

The list "presentable, locally cartesian closed, has all (co)limits" reads as if local cartesian closure were free from presentability + cocomplete. It's not — local cartesian closure is precisely G4 (universal colimits), which is a substantive structural axiom. The page eventually proves $\mathcal{P}(C)$ is an $\infty$-topos (so satisfies G1–G4, including G4), but the list-of-properties phrasing buries the result. Suggested fix: rephrase as "$\mathcal{P}(C)$ is presentable and has all $\infty$-(co)limits — moreover, it satisfies *all* the $\infty$-Giraud axioms (G1–G4 in §3), including local cartesian closure, making it the prototype $\infty$-topos."

### U2. HTT citation imprecisions.

The page cites several HTT propositions by exact 4-place number. Most are within the correct subsection but may differ from Lurie's actual numbering by ±1 or so:

- **HTT 6.5.2.13** (line 692, hypercompletion is itself an $\infty$-topos). Correct subsection; the actual proposition labeling in HTT is around 6.5.2.12 / Proposition 6.5.2.13 and surroundings. Defensible.
- **HTT 6.5.2.16** (line 719, Postnikov-tower convergence ⇔ hypercomplete). The convergence equivalence is in 6.5.2 (Lemma 6.5.2.13 or Theorem 6.5.2.16, depending on edition). Defensible.
- **HTT 7.2.1.12 / 7.2.1.14** (line 769, finite covering dim ⇒ hypercomplete). The actual core theorem is **HTT Theorem 7.2.1.10** and its corollaries (7.2.1.12 is the local-of-finite-dim corollary, 7.2.1.14 is a related variant). Reasonable approximation.
- **HTT 6.1.6.7** (line 855, line 897 — object classifier representability). Correct.
- **HTT 5.5.4.15** (Step 4 widget, line 435). Correct subsection; the actual proposition is 5.5.4.15 / Theorem 5.5.4.15. Defensible.
- **HTT 6.2.1.5** (Step 5 widget, line 440 — topological localizations are lex). HTT 6.2.1 covers topological localizations; the exact result is around Proposition 6.2.1.5–6.2.1.6 ("a topological localization is left exact"). Defensible.
- **HTT 5.2.2** (line 561 — ∞-adjunctions). Correct subsection.
- **HTT 6.3.5** (line 557 — étale geometric morphisms ↔ objects). The exact result is HTT Theorem 6.3.5.5 or Remark 6.3.5.10. Reasonable.

These are all close enough that the reader can find the relevant material. None is wrong enough to correct as a math error, but the page would be improved by trimming "HTT 6.5.2.16" to "HTT 6.5.2" where the exact 4-place is uncertain.

### U3. "Local étale ∞-topos at the closed point $(p) \in \Spec\,\mathbb{Z}$" identified with $B\widehat{\mathbb{Z}}$.

**Location:** §7 widget, the `closedTemplate` function at lines 1008–1016, and the `'p'` info-block at lines 998–1003.

**The issue:** The page says the local étale ∞-topos at the closed point $(p)$ is $\mathrm{Sh}_\infty((\Spec\,\mathbb{F}_p)_{\mathrm{ét}})^\wedge \simeq B\widehat{\mathbb{Z}}$. There are two different "local ∞-topoi" that one could mean:

- **Stalk via the residue field** $\mathbb{F}_p$: the étale topos of $\Spec\,\mathbb{F}_p$ is $B G_{\mathbb{F}_p} = B\widehat{\mathbb{Z}}$. ✓
- **Stalk via the strict henselization** $\Spec\,\mathbb{Z}_p^{\mathrm{sh}}$: the étale topos of this is $B G_{\Spec\,\mathbb{Z}_p^{\mathrm{sh}}}$, where the absolute Galois group is the *inertia subgroup* of $G_{\mathbb{Q}_p}$ — *not* just $\widehat{\mathbb{Z}}$. The inertia is much larger; its tame quotient is $\widehat{\mathbb{Z}}(1)$ but the wild part $P$ is a pro-$p$ group of complicated structure.

The page conflates the two. The first (residue-field étale topos) is correct as stated, but the second (which the page might also be implicitly invoking with "strict henselization $\mathbb{Z}_p^{\mathrm{sh}}$ → residue $\bar{\mathbb{F}}_p$ → Galois group $\widehat{\mathbb{Z}}$") is muddled: $\mathbb{Z}_p^{\mathrm{sh}}$'s fraction field has Galois group = inertia of $\mathbb{Q}_p$, not $\widehat{\mathbb{Z}}$. The Galois group $\widehat{\mathbb{Z}} = \mathrm{Gal}(\bar{\mathbb{F}}_p/\mathbb{F}_p)$ is the residue-field Galois group.

**Suggested fix:** Disambiguate. Either:
- Say explicitly: "the local étale ∞-topos at the closed point, computed *via the residue field $\mathbb{F}_p$*, is $B\widehat{\mathbb{Z}}$. (The strict henselization $\Spec\,\mathbb{Z}_p^{\mathrm{sh}}$ has a more complicated étale ∞-topos that also sees the inertia of $\mathbb{Q}_p$.)"
- Or restrict the discussion to the residue field throughout and drop the strict-henselization mention.

### U4. "$K(\mathbb{Z}/2, \infty) := \prod_{n \geq 1} K(\mathbb{Z}/2, n)$" notation.

**Location:** Step 4 of §5 widget, line 724.

The notation "$K(\mathbb{Z}/2, \infty)$" is used informally and should be understood as a shorthand for the displayed product. In standard usage, "$K(\pi, \infty)$" sometimes means "the colimit $\mathrm{colim}_n K(\pi, n)$" (which is $\Omega^\infty \Sigma^\infty H\pi$ stably, or the associated $\Omega$-spectrum), and other times the product. The widget uses it as the product to construct a non-Postnikov-convergent example. Suggest a one-line clarification: "we abuse notation and write $K(\mathbb{Z}/2, \infty)$ for the product space $\prod_{n \geq 1} K(\mathbb{Z}/2, n)$ — distinct from the colimit / Eilenberg–MacLane spectrum interpretation."

### U5. The "Ω-spectrum object" topic from the audit prompt is not explicitly covered.

The audit prompt asks about "$\Omega$-spectrum object definition." The page does not define an $\Omega$-spectrum object explicitly. This is appropriate — $\Omega$-spectra are the *stable* refinement (objects of the stabilization $\mathrm{Sp}(\mathcal{X})$), and the page is squarely about the *unstable* ∞-topos $\mathcal{X}$. The page does discuss the truncation tower $\Omega = \mathcal{U}_{\leq -1} \subset \cdots \subset \mathcal{U}$, and the "Ω" in $\Omega$-spectrum is unrelated (loop space). Coverage gap relative to prompt, not a math error. (If the prompt actually meant the subobject classifier $\Omega$ — covered as $\mathcal{U}_{\leq -1}$, item 88 — then this is verified above.)

### U6. The "condensed" example from the audit prompt is not in the page.

The prompt asks about specific ∞-topoi including "condensed." The page does not discuss condensed mathematics; the only mention is in the §8 outro line 1093 ("condensed and pyknotic mathematics"). Coverage gap relative to prompt, but the page has a separate `condensed-mathematics.html` topic and a callback would be reasonable. Not a math error.

### U7. "Univalence axiom — automatic in any Grothendieck $\infty$-topos with universe $\mathcal{U}$" (line 855 + Q2 of §6 quiz, line 328).

The phrasing "automatic" is correct in spirit: the univalence axiom holds in any Grothendieck $\infty$-topos with the standard object-classifier interpretation. But the *theorem-not-axiom* phrasing should be slightly qualified: in the *type-theoretic semantics*, univalence is an axiom one assumes. What the page is saying is that this axiom is *valid* in any model coming from an ∞-topos — i.e., the interpretation makes the axiom true. So univalence is "a theorem about the model, but an axiom about the syntax." The page mostly handles this correctly, but a one-liner clarifying the model/syntax distinction would help. (The Shulman 2019 result is precisely about establishing this validity at the strict-coherent level.)

### U8. The §6 sandbox prelude code is illustrative JS, not formal HoTT.

The `Type`, `Pi`, `Sigma`, `Id` constructors in the sandbox are JavaScript skeletons — they don't implement type-checking, normalization, or any actual type theory. The "univalence test" `isUnivalent` is a placeholder that just compares "kinds." This is fine for a sandbox demo (no claim is made that this is real HoTT), but a reader might be confused. Worth a one-line caveat at the top of the snippet: "// This is a toy syntactic skeleton, not a real HoTT implementation."

---

## Coverage of the audit prompt's focus list

- **∞-topos definition (presentable + Giraud):** §2 + §3, items 18–49. Verified correct (modulo the cosmetic G1+G4 split, U1).
- **Univalence holding in any ∞-topos:** §6, items 89, 95, 100. Verified correct, with U7 minor clarification suggestion.
- **Hypercompletion (truncation tower):** §5, items 64–85. Verified correct, with W1+W2 the substantive corrections needed (Krull vs cohomological dimension).
- **Specific ∞-topoi:**
  - **Sheaves on a site:** §2, item 22 + Step 1–7 of widget `w-lex-localization`. Verified correct.
  - **Étale ∞-topos:** §7, items 105–113. Verified correct, with U3 disambiguation suggested.
  - **Condensed:** Not in page (U6) — coverage gap.
- **Ω-spectrum object definition:** Not in page (U5) — coverage gap if "Ω-spectrum" was meant; if "Ω = subobject classifier" was meant, covered (item 88).
- **∞-categorical Grothendieck topology:** §2 (specifically Step 3 of `w-lex-localization`, items 21–22). Verified correct.
- **Postnikov tower convergence claims:** §5 Step 3 of `w-whitehead-internal` (item 72). Verified correct (Postnikov convergence ⇔ hypercomplete).
