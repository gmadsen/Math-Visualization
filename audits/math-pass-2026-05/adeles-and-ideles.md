# Math correctness audit — `adeles-and-ideles.html`

## Verified claims

### §1 Places and local fields
- Ostrowski's theorem statement and the two place families are correct.
- $|x|_p = p^{-v_p(x)}$ definition; $\mathbb{Z}_p$ = closed unit ball, compact open subring of $\mathbb{Q}_p$ — correct.
- Product formula $\prod_v |q|_v = 1$ on $\mathbb{Q}^\times$. Worked example $|12|_\infty \cdot |12|_2 \cdot |12|_3 = 12 \cdot \tfrac14 \cdot \tfrac13 = 1$ checks out ($v_2(12)=2,\ v_3(12)=1$).

### §2 The adèle ring
- Restricted-product definition (`x_p ∈ ℤ_p` for cofinitely many $p$) and locally compact topology — correct.
- $\mathbb{Q} \hookrightarrow \mathbb{A}_\mathbb{Q}$ diagonal is well-defined, discrete, with compact quotient — all three are standard theorems.
- $\mathbb{A}_\mathbb{Q}^\infty \cong \hat{\mathbb{Z}} \otimes_\mathbb{Z} \mathbb{Q}$ — correct.

### §3 Idèles
- Idèle condition: $x_v \neq 0$ everywhere and $x_p \in \mathbb{Z}_p^\times$ cofinitely — correct.
- Idèle topology is strictly finer than the subspace topology — correct.
- Idèle norm $\|x\| = \prod_v |x_v|_v$ is a continuous map $\mathbb{A}_\mathbb{Q}^\times \to \mathbb{R}_{>0}$, trivial on $\mathbb{Q}^\times$ — correct.
- $C_\mathbb{Q} \cong \mathbb{R}_{>0} \times \hat{\mathbb{Z}}^\times$, so $C_\mathbb{Q}^0 \cong \mathbb{R}_{>0}$ and $C_\mathbb{Q}/C_\mathbb{Q}^0 \cong \hat{\mathbb{Z}}^\times$ — correct (uses strong approximation + $\mathbb{Q}_p^\times = p^{\mathbb{Z}} \times \mathbb{Z}_p^\times$).
- $C_\mathbb{Q}^1$ compact — correct.
- Artin map $C_\mathbb{Q} \twoheadrightarrow \mathrm{Gal}(\mathbb{Q}^{\mathrm{ab}}/\mathbb{Q})$ with kernel $C_\mathbb{Q}^0$ + Kronecker–Weber recovery — correct.

### §4 Strong approximation
- $\mathbb{Q}$ dense in $\mathbb{A}_\mathbb{Q}^\infty$ (omit one place) and $\mathbb{Z}$ dense in $\hat{\mathbb{Z}}$ — correct standard formulation.
- CRT-as-special-case framing — correct.

### §5 Tate's thesis
- Archimedean local zeta $\int_{\mathbb{R}^\times} e^{-\pi x^2} |x|^s\, d^\times x = \pi^{-s/2}\Gamma(s/2)$ — verified by $u = \pi x^2$ substitution.
- $p$-adic local zeta $Z_p = (1-p^{-s})^{-1}$ — correct.
- Global product yields $\pi^{-s/2}\Gamma(s/2)\zeta(s)$ — correct.
- Adelic Poisson summation $\sum_{q\in\mathbb{Q}} f(q) = \sum_{q\in\mathbb{Q}} \hat{f}(q)$ on $\mathbb{A}_\mathbb{Q}/\mathbb{Q}$ — correct.
- Functional equation $Z(f,s) = Z(\hat{f},1-s)$ — correct.

### Coda
- General number-field place description (finitely many archimedean from real/complex embeddings; one $v_\mathfrak{p}$ per prime ideal of $\mathcal{O}_K$) — correct.

## Wrong / dubious claims

- **`adeles-and-ideles.html:458`** (widget tooltip for $p=2$): `'ℤ₂ = {..., -2,-1,0,1,2,...} (2-adically)'`. This is misleading bordering on wrong. $\mathbb{Z}_2$ is the uncountable closed unit ball / inverse limit $\varprojlim \mathbb{Z}/2^n$, *not* the rational integers; $\mathbb{Z}$ is only a dense subring. The intended sentence is probably "$\mathbb{Z} \subset \mathbb{Z}_2$ densely" — but as written it equates $\mathbb{Z}_2$ with $\mathbb{Z}$, which contradicts the §2 prose.

## Underspecified or unverifiable claims

- **`:751`** "$\int_{\mathbb{Z}_p^\times \cup p\mathbb{Z}_p \cup \cdots}$" is a sloppy way to write the decomposition $\mathbb{Z}_p \setminus \{0\} = \bigsqcup_{n\ge 0} p^n \mathbb{Z}_p^\times$ (not $p\mathbb{Z}_p$, which already contains $p^2 \mathbb{Z}_p^\times$, etc.). Schematic but technically a nested-set typo.
- **`:754`** "(up to the factors $\tfrac12 s(s-1)$ that come from boundary terms at $x=0$ and $x=\infty$)" — the $\tfrac12 s(s-1)$ is the standard *entirety* normalization $\xi(s) = \tfrac12 s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)$; calling it a "boundary term" is unusual. The factor actually comes from removing the simple poles of $Z(f,s)$ at $s=0,1$ produced by the $f(0)$ and $\hat f(0)$ terms — those are boundary contributions in the split-at-$\|x\|=1$ argument, so the description is defensible but compressed.
- The user-requested topics **Hilbert symbol on idèles**, **explicit volume/measure normalisations on $\mathbb{A}_K$**, and the **archimedean compactness depending on $r_2 > 0$** in $C_K$ are not discussed on the page — nothing to verify.
- "Hecke character $\chi$ of $C_\mathbb{Q}$" (`:761`) is correct shorthand for "continuous quasi-character of the idèle class group", but the page doesn't define the term.

## Severity

**Minor.** All headline claims (product formula, restricted product, discreteness/cocompactness, idèle norm, $C_\mathbb{Q}^0 \cong \mathbb{R}_{>0}$, Tate's thesis local/global integrals, functional equation) are mathematically correct. The only outright defect is the widget tooltip at line 458 misidentifying $\mathbb{Z}_2$ with $\mathbb{Z}$; the §5 integral domain notation and the "$\tfrac12 s(s-1)$ boundary term" remark are imprecise but not wrong.
