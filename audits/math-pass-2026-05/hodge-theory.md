# Math correctness audit — `hodge-theory.html`

Scope: lines 261–571 (prose + diamond SVG). Pedagogy untouched.

## Verified claims (sections)

- §2 Hodge decomposition statement for compact Kähler X (l.302–306): canonical form, $H^{p,q}=H^q(X,\Omega^p_X)$, conjugation symmetry $\overline{H^{p,q}}=H^{q,p}$ all stated correctly.
- §2 Hodge symmetry $h^{p,q}=h^{q,p}$ + Serre/Poincaré $h^{p,q}=h^{d-p,d-q}$ (l.350): correct.
- §2 Surface diamond: three independent numbers $h^{1,0}=q$, $h^{2,0}=p_g$, $h^{1,1}$ (l.350): correct (the four off-axis entries collapse to one via the two symmetries).
- §3 Hodge filtration $F^p=\bigoplus_{p'\ge p}H^{p',n-p'}$ (l.369), recovery $H^n=F^p\oplus\overline{F^{n-p+1}}$ (l.373): correct.
- §3 Hodge-to-de-Rham SS $E_1^{p,q}=H^q(X,\Omega^p)\Rightarrow H^{p+q}_{dR}$ degenerates at $E_1$ for smooth projective $X/\mathbb{C}$ (l.379–381): correct, including $\mathrm{gr}^p_F H^n_{dR}=H^{n-p}(X,\Omega^p)$.
- §4 Pure $\mathbb{Q}$-HS of weight $n$ definition + filtered equivalence (l.408–412): correct.
- §4 Tate twist $\mathbb{Q}(1)$ has weight $-2$, type $(-1,-1)$, Hodge realization $2\pi i\cdot\mathbb{Q}\subset\mathbb{C}$ (l.414): correct.
- §4 Polarisation a $(-1)^n$-symmetric form, polarisable pure HS form a semisimple category (l.416): correct.
- §5 Definition of MHS via $W_\bullet$ on $V_\mathbb{Q}$ + $F^\bullet$ on $V_\mathbb{C}$ with pure graded pieces (l.441–447); $\MHS_\mathbb{Q}$ abelian, Tannakian, not semisimple (l.469): correct.
- §5 Deligne's existence theorem for canonical functorial MHS on $H^n$ of any complex variety (l.467): correct.
- §6 Hodge-conjecture statement, $\Hdg^p(X)=H^{2p}(X;\mathbb{Q})\cap H^{p,p}$, image of cycle-class map (l.482–490): correct.
- §6 Lefschetz $(1,1)$ theorem: integral $(1,1)$-class = divisor class (l.492): correct.
- §6 Atiyah-Hirzebruch / Totaro counterexamples to **integral** HC (l.492): correct.
- §7 Period domain for weight-1 dim $2g$ polarised = Siegel $\mathfrak{H}_g$ (l.522): correct.
- §7 Higher-weight period domains generically non-Hermitian-symmetric (l.522): correct.
- §7 Griffiths transversality $\nabla F^p\subset F^{p-1}\otimes\Omega^1_S$ (l.524): correct.
- §7 K3 period domain is 20-dim, generic local-iso / Torelli (l.526): correct (transcendental lattice rank 22, minus 2 for polarisation degree of freedom over the period domain itself).
- §9 Mirror symmetry $h^{p,q}(X)=h^{d-p,q}(X^\vee)$ (l.568, 570): correct.

## Wrong / dubious claims (with file:line)

- **`hodge-theory.html:439`** — "$H^1(\mathbb{C}^*;\mathbb{Q})\cong\mathbb{Q}$, but neither weight-0 nor weight-1 fits — the answer is 'extension of weight 2 by weight 0'." Wrong: $H^1(\mathbb{C}^*)$ is **pure of weight 2** (it is the Tate Hodge structure $\mathbb{Q}(-1)$), not a nontrivial extension. The standard motivating example for nontriviality of the weight filtration is $H^1$ of a singular curve (e.g. nodal cubic: extension of $\mathbb{Q}(0)$ by something) or $H^1$ of an open curve like an elliptic curve minus a point (extension of $\mathbb{Q}(-1)$ by $H^1$ of the smooth compactification). Suggested fix: keep $\mathbb{C}^*$ but state the MHS is pure of weight 2 (= $\mathbb{Q}(-1)$), and use a different example for the genuine extension story.
- **`hodge-theory.html:492`** — "Known for abelian varieties of dimension ≤ 4 (André, Deligne for general absolute Hodge classes)." Conflates two distinct results. (a) Deligne 1982 proved every Hodge class on an abelian variety is **absolutely Hodge** — this is weaker than algebraic, so it does **not** prove HC for abelian varieties. (b) HC for abelian varieties is known unconditionally only in low dimensions / special families (e.g. Tankeev, Ribet, Moonen–Zarhin in dim ≤ 3 and select dim-4 cases), not for all abelian varieties of dim ≤ 4. Suggested fix: split into "Deligne 1982: Hodge ⇒ absolutely Hodge on abelian varieties" and "HC known for abelian varieties of dim ≤ 3 and various dim-4 cases."

## Underspecified or unverifiable claims

- **`hodge-theory.html:526`** — "period map for elliptic curves … recovers the classical *j*-line via the Weierstrass *℘*-function": loose. The period map gives the modular $j$-invariant via $\tau=\omega_2/\omega_1$ then $j(\tau)$; the ℘-function is what realises the curve from $\tau$, not what computes $j$. Phrasing reads as "℘ recovers $j$" which is backward.
- **`hodge-theory.html:526`** — "Torelli theorem for K3s" stated as "generically a local isomorphism": global Torelli for K3 (Pjateckiĭ-Šapiro–Šafarevič) is stronger — the period map is injective on isomorphism classes of marked K3s (and surjective onto the period domain by Todorov / Looijenga / etc.). "Generically a local isomorphism" understates.
- **Hodge index theorem**: not mentioned anywhere on the page despite being one of the named Kähler-package theorems. Polarisation is invoked at l.416 but the signature consequence ($(+,-,\ldots,-)$ on $H^{1,1}_\mathrm{prim}$ of a surface) is absent.
- **Specific Hodge diamonds for curves / K3 / abelian surfaces**: the page only renders a generic surface diamond with placeholder symbols ($q$, $p_g$, $h^{1,1}$); no worked diamond for curves (1; g, g; 1), K3 (1;0,0;1,20,1;0,0;1), or abelian surfaces (1;2,2;1,4,1;2,2;1) is given. Not "wrong" — just missing per the audit prompt.

## Severity

**Minor.** One genuinely incorrect example (the $\mathbb{C}^*$ MHS at l.439) and one imprecise attribution about HC for abelian varieties (l.492); the rest of the mathematical content is accurate. Both fixable with localised prose edits, no diagram surgery.
