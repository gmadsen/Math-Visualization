# Math correctness audit — `etale-fundamental-group.html`

## Verified claims (sections)

- **§1 Finite étale.** Finite + flat + unramified ⇔ finite + smooth rel-dim 0 ✓ (SGA 1 / Stacks 02GI). $f_*\mathcal{O}_Y$ locally free rank $n$, geometric fibers split as $n$ copies of residue field ✓. Kummer cover $s^n = t$ on $\mathbb{G}_{m,k}$ for $\mathrm{char}(k)\nmid n$: étale of degree $n$, fibers are $\mu_n$-torsors ✓; failure for $n=p$ in char $p$ (purely inseparable) ✓.
- **§2 Fiber functor.** $F_{\bar x}(Y) = Y_{\bar x}(\Omega)$, finite-set valued, faithful, exact ✓. Galois-category axioms (SGA 1, V) correctly invoked. $|F_{\bar x}(\Spec\,L)| = [L:\mathbb{Q}]$ via primitive element ✓.
- **§3 Definition + topology.** $\pi_1^{\text{ét}} := \mathrm{Aut}(F_{\bar x})$, profinite (closed subgroup of $\prod_Y \mathrm{Sym}(F_{\bar x}(Y))$) ✓. Grothendieck equivalence $\mathrm{F\acute{E}t}/X \simeq \pi_1^{\text{ét}}\text{-FinSet}$, connected ↔ transitive ↔ open subgroup, Galois ↔ open normal ✓. Universal cover only as pro-object ✓.
- **§4 Spec of a field.** $\pi_1^{\text{ét}}(\Spec\,k) = \Gal(k^{\text{sep}}/k)$ ✓; structure theorem for finite étale $k$-algebras ✓; classical Galois correspondence recovered ✓; $\Spec\,\mathbb{R}$: $\mathbb{Z}/2$ ✓.
- **§5 Frobenius / $\mathbb{F}_q$.** $\pi_1^{\text{ét}}(\Spec\,\mathbb{F}_q) = \hat{\mathbb{Z}} = \prod_\ell \mathbb{Z}_\ell$ ✓; connected degree-$n$ cover = $\Spec\,\mathbb{F}_{q^n}$, Frob acts as $n$-cycle ✓.
- **§6 Comparison.** $\pi_1^{\text{ét}}(X,\bar x) = \widehat{\pi_1^{\text{top}}(X(\mathbb{C}),x)}$ via Riemann existence ✓; $\pi_1^{\text{ét}}(\mathbb{G}_{m,\mathbb{C}}) = \hat{\mathbb{Z}}$ ✓; $\pi_1^{\text{ét}}(\mathbb{A}^1_{\mathbb{F}_p}) \ne 1$ via Artin–Schreier ✓.
- **Quiz spot-the-error.** $d(s^p) = ps^{p-1}ds = 0$ in char $p$, so $\Omega^1$ is free rank 1, not zero ✓. `frobenius-and-pi1` numerics: $\gcd(4,12)=4$ orbits of length 3 ✓; generators of $\mathbb{Z}/6$ are $\{1,5\}$ ✓. `comparison-topological` matching ($\mathbb{A}^1, \mathbb{P}^1$ trivial; $\mathbb{G}_m \to \hat{\mathbb{Z}}$; $E \to \hat{\mathbb{Z}}^2$) ✓.

## Wrong / dubious claims (with file:line)

- **etale-fundamental-group.html:683** — "the finite étale covers [of $E_{\mathbb{C}}$] are the $n^2$-fold ones $[n]\colon E\to E$." Misleading: those are only the *characteristic* covers ($n\hat{\mathbb{Z}}^2 \subset \hat{\mathbb{Z}}^2$). Finite étale covers correspond to **all** finite-index subgroups of $\hat{\mathbb{Z}}^2$; connected covers include cyclic isogenies $E/\langle P\rangle$ ($P$ an $n$-torsion point) of degree $n$, not $n^2$. Cover degree = subgroup index, not always a square.
- **quizzes/etale-fundamental-group.json:387** (`comparison-topological` hard MCQ explain) — "without [properness], $\mathbb{A}^1$ acquires more covers under $\overline{\mathbb{Q}} \hookrightarrow \mathbb{C}$ via transcendental extensions." **Wrong**: $\pi_1^{\text{ét}}(\mathbb{A}^1_{\overline{\mathbb{Q}}}) = \pi_1^{\text{ét}}(\mathbb{A}^1_{\mathbb{C}}) = 1$ (Lefschetz principle, char 0). MCQ answer correct, but cited counterexample doesn't exhibit failure. Real failures of base change live in positive characteristic.

## Underspecified or unverifiable claims

- **etale-fundamental-group.html:560** — "[separable and algebraic closures] agree in char 0 and for perfect fields." Redundant (char 0 ⇒ perfect), not wrong.
- **etale-fundamental-group.html:486** — "$\pi_1^{\text{ét}}$ embeds into the inverse limit $\varprojlim_Y \mathrm{Sym}(F_{\bar x}(Y))$." Not literally an inverse system over $\mathrm{F\acute{E}t}/X$; rigorous form uses cofiltered system of *Galois* covers via $\mathrm{Aut}(Y/X)$. Following paragraph (closed subgroup of product) is the rigorous form.
- **etale-fundamental-group.html:780** — Mochizuki–Tamagawa anabelian remark is a name-drop; Tamagawa (affine hyperbolic / finite fields) and Mochizuki (hyperbolic / sub-$p$-adic) not distinguished.
- **§6** — Tame vs wild quotient mentioned ("tame quotients in char $p$") but never defined.
- **Asked-after items absent.** Page does not cover $\pi_1^{\text{ét}}(\mathbb{P}^1\setminus\{0,1,\infty\})$ over $\mathbb{C}/\mathbb{F}_p/\mathbb{Q}$, nor Fermat curves. Scope is $\mathbb{G}_m, E, \mathbb{P}^1, \mathbb{A}^1, \Spec\,k$. Absence, not error.

## Severity

**Minor.** Core math (definitions, Grothendieck equivalence, $\Spec\,k$ specialization, $\hat{\mathbb{Z}}$ for $\mathbb{F}_q$, Riemann existence, Artin–Schreier in char $p$) correct and well-pitched. Two real defects: (a) line 683's misleading "$E_{\mathbb{C}}$ covers are the $n^2$-fold $[n]$" omits non-characteristic isogenies and gives the wrong degree set; (b) the broken char-0 counterexample in the `comparison-topological` hard MCQ explanation. Neither misleads on substance; both should be tightened on a content pass.
