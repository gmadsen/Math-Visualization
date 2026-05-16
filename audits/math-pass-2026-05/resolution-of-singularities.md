# Math pass — `resolution-of-singularities.html`

## Verified claims

**Section 1 (Singular vs smooth).** Jacobian criterion as `rank J(p) = n − dim X` and `T_p X = ker J(p)` is correct. Tangent cone definition via lowest-degree forms is correct. Prose example "node $f = y^2 - x^2 - x^3$ has tangent cone $(y-x)(y+x)$" and "cusp $y^2 - x^3$ has cone $y^2 = 0$" are correct.

**Section 2 (Blow-up).** Definition of $\mathrm{Bl}_0\mathbb{A}^n \subset \mathbb{A}^n \times \mathbb{P}^{n-1}$ via incidence is correct. Universal property (pullback of $\mathcal{I}_Z$ becomes locally principal/Cartier) and $\mathrm{Proj} \bigoplus \mathcal{I}_Z^n$ description are standard. Cusp resolved in one blow-up: correct.

**Section 3 (Hironaka).** Year 1964, char-0 hypothesis, smooth-centres-in-singular-locus formulation, Hilbert–Samuel descent, and Bierstone–Milman / Włodarczyk / Kołlár functorial reformulations all check out. Char-$p$ status: Abhyankar (surfaces), Cossart–Piltant (threefolds), open in dim ≥ 4 — accurate.

**Section 4 (Curves).** Normalisation = integral closure in function field, three constructions (normalisation / iterated blow-up / Newton–Puiseux) coincide for curves, cusp parametrised $t \mapsto (t^2, t^3)$, normalisation separates the two analytic branches at a node — all correct.

**Section 5 (ADE surfaces).** Du Val equations all standard:
- $A_n: x^2+y^2+z^{n+1}$, $\Gamma$ cyclic order $n+1$ ✓
- $D_n: x^2+y^2z+z^{n-1}$, binary dihedral order $4(n-2)$ ✓ (D_4 → order 8 = Q_8 ✓)
- $E_6: x^2+y^3+z^4$, binary tetrahedral order 24, 7 irreps (1²+1²+1²+2²+2²+2²+3² = 24 ✓)
- $E_7: x^2+y^3+yz^3$, binary octahedral order 48, 8 irreps ✓
- $E_8: x^2+y^3+z^5$, binary icosahedral order 120, 9 irreps (1²+2²+2²+3²+3²+4²+4²+5²+6² = 120 ✓)

Exceptional divisor = chain/tree of $(-2)$-curves with dual graph the named Dynkin diagram. Widget node counts (A_4: 4, D_5: 5, E_6: 6, E_7: 7, E_8: 8) and branch positions (E_6 off middle, E_7/E_8 off third) match standard Dynkin diagrams. McKay correspondence statement (non-trivial irreps ↔ vertices, trivial irrep = affine root dropped) correct.

**Section 6 (Applications).** MMP starting from smooth model, motivic integration over arc spaces with crepant change-of-variables, Włodarczyk / AKMW weak factorisation, log resolution producing SNC pair, de Jong's alterations as char-$p$ substitute — all standard and correct.

## Wrong / dubious claims

**Major: cusp/node widget mislabels y² = x² as a cusp** — `resolution-of-singularities.html:315-318`, `:330`, `:273` (widget hint).
The widget plots $f = y^2 - x^2 - ax^3$ but at $a=0$ this is $y^2 = x^2$, which is a **node** (two crossing lines), not a cusp. The widget displays the "cusp" label and the readout asserts `Tangent cone: y² = 0 (doubled line) — cusp`, which is false: the tangent cone of $y^2 - x^2$ is $(y-x)(y+x) = 0$, two lines. The widget hint at line 273 ("$y^2 = x^2 + a x^3$ deforms cusp ($a=0$) to node-like") inverts reality — $a=0$ is already a node, and adding $ax^3$ keeps the tangent cone unchanged. Note this contradicts the surrounding prose at line 270 which correctly classifies $y^2 - x^2 - x^3$ as a node. Fix: either change the equation to $y^2 = x^3 + ax^2$ (cusp at $a=0$, splits into node for $a > 0$ as the lowest-degree term acquires an $x^2$ component) or relabel the existing widget honestly.

**Minor: blow-up factorisation off by a factor of x** — `resolution-of-singularities.html:448`.
Reads "y² = x³ becomes m²·x² = x³, i.e. x(m² − x) = 0". The correct factorisation is $x^2(x - m^2) = 0$ (or equivalently $x^2(m^2 - x) = 0$ up to sign): one factor of $x$ is missing. The exceptional divisor $\{x=0\}$ appears with multiplicity 2 in the total transform. The downstream claim about the strict transform $m^2 = x$ being smooth and transverse to $E$ at $m=0$ is correct.

**Minor: "smooth" label for $a < 0$** — `resolution-of-singularities.html:317`.
The widget labels $a = -0.5$ as `smooth (isolated tangent point)`, but $f = y^2 - x^2 + 0.5x^3$ still has lowest-degree term $y^2 - x^2$, so the origin is still a node over $\mathbb{C}$. The readout (`:332`) does eventually concede "over ℂ still a node", but the on-canvas label remains misleading.

## Underspecified or unverifiable claims

- "Crepant resolutions" appear in the Connections list (line 795) without a definition on this page; readers are not told what `crepant = π^*K_X = K_{\tilde X}` means. Not wrong, just unanchored.
- Section 6 calls the MMP outcome a "minimal or canonical model" without flagging the technical distinction between minimal models (nef $K$) and canonical models (ample $K$, of general type). Acceptable for a survey but elides standard subtlety.
- Tacnode commentary "First blow-up does not separate them; need a second blow-up" (`:631`) is technically correct (one blow-up turns $y^2=x^4$ into a node $m^2=x^2$, second blow-up resolves), but the phrasing reads as if the first blow-up does nothing. A precise statement would say the first blow-up reduces the tacnode to a node.
- "Bertini-type genericity" failure as the source of char-$p$ obstruction (`:483`) is a defensible one-line summary but elides the actual technical issue (e.g. wild ramification, transversality of strict transform under blow-up of singular centres).

## Severity

**Moderate.** Section 5 (ADE) and the high-level Hironaka prose are math-clean and quizable. The Section 1 widget has a load-bearing labelling bug (`y^2 = x^2` is a node, not a cusp) that contradicts the section's own correct prose, and Section 2's blow-up factorisation drops a power of $x$. Both are visible to any reader who reads the readout text alongside the prose. Quizzes themselves are correct. Fixing the widget equation/labels and the missing $x$ factor would clear the page to clean.
