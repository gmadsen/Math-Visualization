# type-theory-and-hott — math correctness audit (2026-05)

**Section:** Logic & Foundations

## Verified claims

### §1. Judgments and contexts
- **Four basic judgment forms** (lines 273–276): $\Gamma\vdash A\,\mathsf{type}$, $\Gamma\vdash a:A$, $\Gamma\vdash A\equiv B\,\mathsf{type}$, $\Gamma\vdash a\equiv b:A$ — standard Martin-Löf type theory presentation, correct (matches HoTT Book App. A.2 and Martin-Löf 1984).
- **Context as a dependent telescope** (line 280): $(x_1:A_1,\,x_2:A_2(x_1),\,\ldots)$ with each $A_i$ well-typed in the previous context, distinct variables — standard, correct.
- **`Γ ctx` derivable by recursion** (line 280): correct (the "context formation" judgment is typically given by two rules, $\cdot\,\mathsf{ctx}$ and $\Gamma\vdash A\,\mathsf{type} \;\Rightarrow\; \Gamma,x{:}A\,\mathsf{ctx}$).
- **Type-checking decidable in nice cases** (line 282): correct — MLTT with decidable definitional equality (e.g. without Streicher's K but with $\eta$-rules) has decidable type-checking; this is what proof assistants exploit.
- **Every well-typed term reduces** (line 282): correct for pure MLTT (strong normalization, Martin-Löf 1971/Tait/Girard tradition). Note: HoTT *with univalence asserted as an axiom* loses canonicity for closed terms of inductive types, which is why cubical type theory was developed — the page covers this honestly in §6 ("cubical type theory with computational univalence").

### §2. Π and Σ types
- **Π/Σ rules table** (lines 442–444):
  - **Intro Π**: $\lambda x.b(x)$ where $b(x):B(x)$ — correct.
  - **Intro Σ**: $(a,b)$ where $a:A$, $b:B(a)$ — correct.
  - **Elim Π**: $f(a):B(a)$ — correct.
  - **Elim Σ**: $\mathrm{pr}_1(p):A$, $\mathrm{pr}_2(p):B(\mathrm{pr}_1\,p)$ — correct (this is the strong/Martin-Löf Σ-elim; cf. dependent eliminator $\mathsf{ind}_\Sigma$).
  - **Comp Π**: $(\lambda x.b)(a)\equiv b[a/x]$ — β-rule, correct.
  - **Comp Σ**: $\mathrm{pr}_1(a,b)\equiv a$, $\mathrm{pr}_2(a,b)\equiv b$ — correct.
- **Non-dependent collapse** (line 450): $\Pi_{x:A} B \equiv A\to B$ when $x$ not free in $B$; $\Sigma_{x:A} B \equiv A\times B$ likewise — correct.
- **Curry–Howard slogan** (line 452): $\forall\!\leftrightarrow\!\Pi$, $\exists\!\leftrightarrow\!\Sigma$, $\Rightarrow\!\leftrightarrow\!\to$, $\wedge\!\leftrightarrow\!\times$, $\vee\!\leftrightarrow\!+$, $\neg P\!\leftrightarrow\!P\to\bot$ — all correct as the constructive Curry–Howard table (Howard 1980; for $\exists\leftrightarrow\Sigma$ this is the *strong/constructive* existential; "mere existence" requires propositional truncation, see below).
- **λ-reduction stepper redex chains** (lines 507–512):
  - $(\lambda x.\lambda y.x)\,a\,b \to (\lambda y.a)\,b \to a$ — K combinator, correct.
  - $(\lambda x.\lambda y.y)\,a\,b \to (\lambda y.y)\,b \to b$ — KI, correct.
  - $(\lambda f.\lambda x.f(f\,x))\,g\,a \to (\lambda x.g(g\,x))\,a \to g(g\,a)$ — Church numeral 2 applied to $g$ at $a$, correct.
  - $(\lambda x.x\,x)(\lambda x.x\,x) \to (\lambda x.x\,x)(\lambda x.x\,x)$ — Ω self-replicates, correct (Curry's combinator).
- **"Ω is NOT typable in simply-typed λ-calculus"** (line 586): correct. Typing $\lambda x.x\,x$ would require $x:T$ and $x:T\to S$ simultaneously, hence $T = T\to S$, which has no STLC solution (no recursive types). Equally untypable in pure MLTT.

### §3. Identity types
- **Constructor `refl_a : Id_A(a,a)`** (line 606) — standard, correct.
- **J-rule informal description** (line 608): "to define a function out of $\mathsf{Id}_A(a,b)$ for arbitrary $a,b$, suffices to specify what it does on $\mathsf{refl}_a$" — correct informal statement of path induction (HoTT Book §1.12).
- **Derivable from J** (lines 610–613):
  - Concatenation $p\cdot q : \mathsf{Id}_A(a,c)$ when $p:\mathsf{Id}_A(a,b)$, $q:\mathsf{Id}_A(b,c)$ — derivable, correct.
  - Inversion $p^{-1}:\mathsf{Id}_A(b,a)$ — derivable, correct.
  - $\mathsf{ap}_f:\mathsf{Id}_A(a,b)\to\mathsf{Id}_B(f(a),f(b))$ for $f:A\to B$ — derivable, correct.
  - Transport $p_*(u):P(b)$ for $P:A\to\mathsf{Type}$ and $u:P(a)$ — derivable, correct.
- **Path-space picture** (line 616): $A$ as space, $a,b$ as points, $p$ as path, $\mathsf{refl}_a$ as constant path, concatenation/inversion/$\mathsf{ap}_f$ as their topological analogs — correct (this is the homotopy interpretation, made precise by Awodey–Warren 2009 and the simplicial model).

### §4. The univalence axiom
- **Canonical map `idtoeqv : (A=B) → (A≃B)`** (line 770): defined via path induction (transport along $p$ is an equivalence with explicit inverse via $p^{-1}$) — correct construction.
- **Univalence axiom** (line 772): $\mathsf{ua}: (A=B)\simeq (A\simeq B)$ — Voevodsky's formulation, correct (HoTT Book §2.10).
- **Equivalence ⇒ identification** (line 776): immediate consequence — correct.
- **Transport across equivalence** (line 777): correct (this is the practical "transferring theorems" use of univalence).
- **Univalence contradicts axiom K** (line 778): correct. The two equivalences $\mathsf{id},\mathsf{swap}:\mathbb{B}\simeq\mathbb{B}$ yield two distinct elements $\mathsf{ua}(\mathsf{id}) = \mathsf{refl}_\mathbb{B}$ and $\mathsf{ua}(\mathsf{swap}) \ne \mathsf{refl}_\mathbb{B}$ in $\mathsf{Id}_\mathcal{U}(\mathbb{B},\mathbb{B})$ — refuting UIP/K (HoTT Book §3.1.9).
- **Univalence implies function extensionality** (line 779): correct — Voevodsky's theorem (HoTT Book §4.9). Funext: $(\Pi\,x.\,f(x)=g(x))\to f=g$.
- **Univalence widget readouts** (lines 858–869):
  - "ua(id) is itself the reflexive identification refl_B" — correct (idtoeqv ∘ ua = id and idtoeqv(refl) = id-equiv, so ua(id-equiv) = refl).
  - "ua(swap) ≠ refl_B in the universe" — correct (otherwise idtoeqv would land back at the identity equivalence, contradicting that it's an equivalence).

### §5. Higher inductive types
- **Circle as HIT** (line 885): $S^1$ generated by $\mathsf{base}:S^1$ and $\mathsf{loop}:\mathsf{Id}_{S^1}(\mathsf{base},\mathsf{base})$ — standard, correct (HoTT Book §6.4).
- **$\pi_1(S^1)\simeq\mathbb{Z}$ inside HoTT** (line 887, 975–976): correct, attributed to Licata–Shulman (the joint formalisation paper "Calculating the fundamental group of the circle in homotopy type theory", LICS 2013, building on Shulman 2011's earlier proof).
- **HIT examples table** (lines 891–897):
  - **Interval $I$**: $0,1:I$, $\mathsf{seg}:\mathsf{Id}(0,1)$ — correct (HoTT Book §6.3).
  - **Suspension $\Sigma A$**: $\mathsf{N},\mathsf{S}$ + $\mathsf{merid}:A\to\mathsf{Id}(\mathsf{N},\mathsf{S})$ — correct (HoTT Book §6.5).
  - **Pushout $B\sqcup_A C$**: injections + path identifying the two copies along $A$ — correct (HoTT Book §6.8).
  - **Set quotient $A/{\sim}$**: $[\cdot]$, $\mathsf{eq}$, plus a 0-truncation — correct (HoTT Book §6.10; the truncation makes the quotient a set rather than a higher type with auto-generated coherences).
- **HIT recursion principle** (line 900): "to map $S^1\to X$, give a point $x:X$ and a loop $\ell:\mathsf{Id}(x,x)$" — correct (this is the recursion form of the $S^1$-elimination rule).
- **Circle widget winding-number readout** (lines 957–977): $\mathsf{loop}^n$ corresponds to $n\in\mathbb{Z}$ under the iso $\Omega(S^1)\simeq\mathbb{Z}$; $n=0$ is $\mathsf{refl}_{\mathsf{base}}$ — correct.

### §6. Models of HoTT
- **Voevodsky simplicial model interpretation table** (lines 994–999):
  - Types ↦ Kan complexes — correct (Kapulkin–Lumsdaine 2012/2018, "The simplicial model of univalent foundations").
  - Dependent types ↦ Kan fibrations — correct.
  - Σ ↦ total space — correct.
  - Π ↦ "space of sections (fibred mapping space)" — correct (the right adjoint to pullback along the fibration).
  - Identity types ↦ path object $A^I$ — correct (this is the standard path-object construction in any Quillen model category).
  - Universe ↦ univalent universe classifying small Kan fibrations — correct (the technical heart of Kapulkin–Lumsdaine).
- **Reason univalence holds in the model** (line 1002): "the path space of the universe at $(A,B)$ matches the space of equivalences $A\simeq B$" — correct, this is the right justification.
- **HITs in the model** (line 1002): "$S^1$ in the model is a Kan complex weakly equivalent to the topological circle" — correct (the simplicial circle $\Delta^1/\partial\Delta^1$, fibrantly replaced).
- **Model proves consistency** (line 1004): "any contradiction in HoTT would yield a contradiction in the simplicial-set model (and hence in ZFC + inaccessibles)" — correct, with the implicit caveat that the model uses Grothendieck universes and so requires inaccessibles for the universe(s).
- **Other models / cubical** (line 1004): "cubical, Bezem–Coquand, Orton–Pitts" + "cubical type theory with computational univalence" — historically and mathematically correct (Bezem–Coquand–Huber 2014, "A model of type theory in cubical sets"; Cohen–Coquand–Huber–Mörtberg 2018, "Cubical type theory: a constructive interpretation of the univalence axiom"; Orton–Pitts 2016 "Axioms for modelling cubical type theory in a topos").
- **Type ↦ ∞-groupoid widget readout** (lines 1103–1113):
  - 0-cells: terms of $A$ (points) — correct.
  - 1-cells: $\mathsf{Id}_A(a,b)$ (paths) — correct.
  - 2-cells: identifications between identifications — correct.
  - 3-cells and higher — correct (the "tower" terminology).

### §7. Connections (commentary; no math claims requiring verification beyond the names of proof assistants and the formalisation projects mentioned).

## Wrong / dubious claims

- **MINOR — Path-space widget says "a = b (definitionally)" when endpoints visually coincide** (line 720). The widget code at line 757 (`path-coincide` button) sets `B.x = A.x; B.y = A.y` so the two named points $a$ and $b$ have the same screen coordinates. The readout then declares "a = b (definitionally), so $\mathsf{Id}_A(a, b)$ is inhabited by $\mathsf{refl}_a$." Strictly, two terms $a,b:A$ being definitionally equal requires a derivation $\Gamma\vdash a\equiv b:A$ — visual coincidence in a widget illustrating *propositional* identification is not the same thing. The cleaner statement when the widget displays $a$ and $b$ at the same point is "the path becomes a loop at $a$, exhibited by $\mathsf{refl}_a$" — not that they are definitionally equal. This is a common but incorrect conflation of definitional and propositional equality in a section that *introduces* the identity type precisely to distinguish them. Suggested fix: replace "(definitionally)" with "(when both endpoints coincide)" or "(in this picture)".

- **MINOR — Concept blurb for `tt-models` ascribes univalence in the simplicial model to the wrong reason** (`concepts/type-theory-and-hott.json` line 77): "univalence holds because equivalence of Kan complexes coincides with weak equivalence". The Whitehead-style theorem that homotopy equivalences of Kan complexes are weak equivalences is true but is *not* the reason univalence holds in the simplicial model. Univalence holds because Kapulkin–Lumsdaine constructed a *fibrant univalent universe* whose path space at $(A,B)$ matches the space of equivalences $A\simeq B$ — exactly what the page itself states correctly at line 1002. Suggested fix: rewrite the blurb's last clause to "univalence holds because the universe of small Kan fibrations is itself fibrant and the path space at $(A,B)$ coincides with the space of equivalences $A\simeq B$".

- **MINOR — Section 4 "use case" description is muddled** (line 782): "If $A$ is the type of finite groups and $B$ the type of bijections of $A$ with itself, univalence says proving a property of finite groups up to isomorphism really does prove it 'on the nose' — no boilerplate to transport along a chosen isomorphism." The "transport up to isomorphism" intuition is the right takeaway, but the antecedent is garbled: "bijections of $A$ with itself" with $A$ being a *type of finite groups* describes self-equivalences of the universe of finite groups, which is not the relevant object. The intended statement is that for any two isomorphic finite groups $G,H:\mathsf{FinGrp}$, univalence (combined with the structure identity principle for groups) yields an identification $G=H$, so any property invariant under isomorphism transports automatically. Suggested fix: "If $G,H$ are isomorphic finite groups, univalence (plus the SIP for groups) gives an identification $G=H$ in the type of finite groups — any property of $G$ that doesn't peek at the carrier set transports to $H$ for free, with no manual rewriting along the chosen iso."

- **MINOR — Univalence widget legend mismatch** (line 784, widget at lines 786–795): the prose says "two finite types that happen to be equivalent (a 2-element type and the booleans)", but both columns of the widget are explicitly labelled "B (left)" and "B (right)" — i.e. two copies of $\mathbb{B}$, not a 2-element type and $\mathbb{B}$. The mathematical content (two distinct equivalences $\mathbb{B}\to\mathbb{B}$ yielding two distinct identifications $\mathbb{B}=\mathbb{B}$) is correct; the prose framing is just inaccurate to what the widget actually displays. Suggested fix: rewrite as "two copies of the boolean type and the two distinct equivalences $\mathbb{B}\simeq\mathbb{B}$ between them" (or alternatively, change one panel's label to a generic 2-element type like $\{\bullet,\circ\}$ to match the prose).

- **MINOR — Notation `Id_{Id_A}(p, q)` in the ∞-groupoid widget readout** (line 1105). Strictly, $\mathsf{Id}_A$ takes two arguments; the 2-cell type is $\mathsf{Id}_{\mathsf{Id}_A(a,b)}(p,q)$, where $p,q:\mathsf{Id}_A(a,b)$. The abbreviation $\mathsf{Id}_{\mathsf{Id}_A}$ drops the endpoints and is technically ambiguous. Cosmetic.

## Underspecified or unverifiable claims

- **$S^2$ HIT generators** (line 893): $\mathsf{base}:S^2$, $\mathsf{surf}:\mathsf{Id}_{\Omega(S^2)}(\mathsf{refl},\mathsf{refl})$. This presentation is *correct in spirit* but presupposes the loop-space type $\Omega(S^2):=\mathsf{Id}_{S^2}(\mathsf{base},\mathsf{base})$ as a sub-expression of the very type one is defining $S^2$ to be — a circular-looking but standard convention since the elimination rule of $S^2$ is given mutually with its formation. The HoTT Book (§6.4) phrases the analogous $S^2$ definition as $\mathsf{base}:S^2$ together with $\mathsf{surf}:\mathsf{refl}_{\mathsf{base}} = \mathsf{refl}_{\mathsf{base}}$ where the equality is taken in $\mathsf{base}=\mathsf{base}$. Reads cleanly to a HoTT-fluent reader; flagged for completeness.

- **"$\exists \leftrightarrow \Sigma$" in the Curry–Howard slogan** (line 452). This is the *strong* constructive existential ("I can produce a witness"). HoTT distinguishes this from *mere existence* $\exists' x.\, P(x) := \|\Sigma_{x:A} P(x)\|$ using propositional (-1)-truncation: e.g. "there exists an irrational $a^b$ with $a,b$ irrational" is true classically and provable as $\|\Sigma\|$ but the witness is not always extractable from a $\Sigma$-term. The slogan is harmlessly correct as written for the constructive correspondence but the propositional-truncation refinement is not mentioned anywhere on the page. Worth a sentence in §2 or §5 (where truncation is mentioned in passing in the set-quotient row).

- **Decidability of definitional vs propositional equality** (implicit throughout). The page never directly discusses the distinction — definitional equality $\equiv$ is decidable in standard MLTT (with appropriate normalization), whereas propositional equality $\mathsf{Id}_A(a,b)$ is *not* decidable in general (e.g. equality of functions $\mathbb{N}\to\mathbb{N}$). This is a foundational point that the page elides. Not an error, but a substantive omission: the audit prompt explicitly asked to verify any decidability claims; the only one the page makes ("type-checking decidable in nice cases", line 282) is correct.

- **"It contradicts Streicher's axiom K"** (line 778). Attributed to Streicher; the K-axiom was actually first formulated by Hofmann–Streicher 1994 ("The groupoid model refutes uniqueness of identity proofs"). Attribution to Streicher alone is colloquial but standard. Cosmetic.

- **Tag/widget prose mentioning "synthetic homotopy theory" and "modal HoTT and shape theory" and "cohesive type theory"** (line 1144). These are all real research programs (Shulman, Schreiber et al.), correctly described in passing as "open frontiers". No specific theorem is asserted; nothing to verify.

- **π_n(S^n) and Hopf fibration** (audit prompt focus). Neither is claimed on this page — the only homotopy-group computation stated is $\pi_1(S^1)\simeq\mathbb{Z}$, which is correct and correctly attributed. The page does *not* claim $\pi_n(S^n) = \mathbb{Z}$ or compute the Hopf fibration's contribution to $\pi_3(S^2)$, so there is nothing to flag in those directions.

## Severity

**minor errors** — no formula on the page is mathematically wrong. The four flagged items are: (i) the path-space widget's "(definitionally)" wording conflates definitional with propositional equality in the very section that introduces $\mathsf{Id}$ to distinguish them; (ii) the `tt-models` concept blurb gives the wrong proximate reason for univalence holding in the simplicial model (the page itself states the right reason at line 1002, so it's an internal inconsistency); (iii) the §4 "use case" prose for univalence is garbled (correct intuition, mis-stated antecedent); (iv) the univalence widget's prose claims "a 2-element type and the booleans" but both panels actually display $\mathbb{B}$. Plus a notation cosmetic in the ∞-groupoid widget (`Id_{Id_A}` drops endpoint indices). Everything load-bearing — the four judgment forms, Π/Σ rules, β-reduction chains, J-rule and derived operations, univalence and its consequences, the HIT examples and the Licata–Shulman attribution, the simplicial-model interpretation table — checks out cleanly.
