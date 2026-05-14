# langlands-program.html — math-correctness audit

## Verified claims (sections)

- §1 Two-column picture: arithmetic-side $n$-dim Galois reps vs analytic-side automorphic reps of $\GL_n(\mathbb{A})$, with $L(\rho,s) = L(\pi,s)$ — correct framing.
- §1 Unramified Euler factor $L_p(\rho,s) = \det(I_n - \rho(\Frob_p)p^{-s})^{-1}$ — correct.
- §2 L-function of $\rho$ with inertia-invariants $V_\ell^{I_p}$ at ramified primes; Godement–Jacquet construction on the automorphic side; functional equation $\Lambda(s) = \varepsilon\,\Lambda(1-s)$; strong multiplicity one (Jacquet–Shalika) — all correct.
- §3 Local Langlands proven for $\GL_n / \mathbb{Q}_p$ (Harris–Taylor, Henniart 2001); archimedean case = Langlands classification (1973 IAS preprint) — correct.
- §3 Bernstein–Zelevinsky classification (supercuspidal / principal series / Steinberg) — correct.
- §4 $n=1$ = CFT; $n=2$ over $\mathbb{Q}$ for elliptic curves = modularity (Wiles + Taylor–Wiles + BCDT) — correct attributions and dates.
- §5 Artin abelian L = Hecke L for the corresponding character — correct prototype.
- §6 Conductor $N$ of $E$ = level of $f$, weight $2$, $\Gamma_0(N)$ — correct. $R = T$ language and Mazur deformation rings — correct.
- §6 Khare–Wintenberger 2009 = Serre's conjecture (odd, irreducible, $\bar\rho \to \GL_2(\mathbb{F}_\ell)$) — correct.
- §7 Arthur–Clozel cyclic base change; Arthur 2013 endoscopic classification for classical groups — correct.
- §7 $L_F^{\mathrm{ab}} = $ idèle class group — correct.
- §7 Newton–Thorne $\Sym^k$ for all $k$ in the modular case — correct (2020/21).

## Wrong / dubious claims (with file:line)

- **langlands-program.html:378** Weil–Deligne relation `ρ(σ) N ρ(σ)^{-1} = q^{|σ|} N`. Standard normalization (Tate, *Number-Theoretic Background*) is `q^{-n(σ)} N` where $n(\sigma)$ is the power of geometric Frobenius — i.e. monodromy has weight $-1$. Sign of the exponent is wrong (or the convention is non-standard and unstated).
- **langlands-program.html:396** "$\rho\colon \Gal(\overline{\mathbb{Q}}/\mathbb{Q}) \to \GL_n(\mathbb{Q}_\ell)$" — should land in $\GL_n(\overline{\mathbb{Q}_\ell})$ (or a finite extension). Continuous irreducible $\ell$-adic reps generally do not have $\mathbb{Q}_\ell$-coefficients.
- **langlands-program.html:397** "almost everywhere de Rham" — de Rham is a condition at the place(s) above $\ell$, not "almost everywhere". Should read "de Rham at $\ell$" (with "unramified almost everywhere" the separate condition).
- **langlands-program.html:405** "modularity of most 2-dimensional Galois representations of regular weight (Khare–Wintenberger for Serre's conjecture)". Khare–Wintenberger proves Serre's conjecture (mod $\ell$); characteristic-zero "regular weight" modularity in dim 2 is the work of Calegari–Geraghty / Allen–Calegari–Caraiani–Gee–Helm–Le Hung–Newton–Scholze–Taylor–Thorne ("ten-author paper"), not Khare–Wintenberger directly.
- **langlands-program.html:406** "$\Sym^k$ … known up to $k=4$ (Kim–Shahidi)". Stale: Newton–Thorne (cited correctly at §7) extended this to all $k$ for modular forms in 2020. The two sections contradict each other.
- **langlands-program.html:517** "(Drinfeld, Beilinson, Mukai)" — **Mukai is wrong**. Geometric Langlands attributions are Drinfeld (function-field $\GL_2$ via shtukas), Laumon, Beilinson–Drinfeld, Frenkel–Gaitsgory–Vilonen, and the 2024 Gaitsgory et al. proof. Mukai is unrelated (Fourier–Mukai is a separate construction occasionally invoked, not foundational).
- **langlands-program.html:517** "$\ell$-adic local systems on $C$ to D-modules on $\mathrm{Bun}_G(C)$" — mixes two settings. Function-field geometric Langlands uses $\ell$-adic sheaves on both sides; the de Rham (over $\mathbb{C}$) version uses flat $G^\vee$-bundles ↔ D-modules on $\mathrm{Bun}_G$. As written this is incoherent.
- **langlands-program.html:517** "fully proven for $\GL_2$ (Drinfeld)" — Drinfeld's $\GL_2$ result is the *classical* Langlands correspondence for function fields (via shtukas), not "geometric Langlands" in the Beilinson–Drinfeld sense. Geometric Langlands for $\GL_n$ over $\mathbb{C}$ is Frenkel–Gaitsgory–Vilonen (2002+); the full geometric Langlands conjecture was settled in 2024 by Gaitsgory and collaborators.
- **langlands-program.html:519** "GRH for L-functions of automorphic forms is part of the Langlands package." False — GRH is a *separate* analytic conjecture stated in Langlands-compatible language; the program does not predict or imply it.
- **langlands-program.html:263** "would unify class field theory, Artin reciprocity, modularity, and the Riemann hypothesis under a single Tannakian framework." Same overclaim — RH/GRH is not a Langlands consequence.

## Underspecified or unverifiable claims

- **L-group never defined.** §7 (line 483) introduces "Langlands dual groups ${}^L H \to {}^L G$" without defining ${}^L G = \widehat{G}(\mathbb{C}) \rtimes \Gal(\overline F/F)$, the dual root datum construction, or the role of the Galois action. Reader cannot reconstruct functoriality from the page.
- **Trace-formula approach (Arthur) absent.** The Arthur–Selberg trace formula and stable trace formula are mentioned only obliquely via "endoscopic transfer"; no section explains how the trace formula realises functoriality or proves classification theorems.
- **§5 Pontryagin-dual claim** (line 428) elides the connected-component quotient: $\Gal^{\mathrm{ab}} \cong \pi_0(\mathbb{A}^\times/\mathbb{Q}^\times)^\wedge$ rather than the literal Pontryagin dual of $\mathbb{A}^\times/\mathbb{Q}^\times$. Acceptable as a slogan but technically loose.
- **§4 "geometric" condition** (line 396) — "cuts of cohomology of varieties" is awkward/typo; presumably "cut out from cohomology" or "Fontaine–Mazur geometric".
- **§7 Sym^k status** (line 487) "extended in the modular case (Newton-Thorne 2020 for all $k$)" — clarify "all $k$" applies to symmetric power *L-functions* / automorphy; the statement is a theorem about automorphic representations attached to non-CM holomorphic newforms.

## Severity

**Moderate.** Two clear factual errors that need fixing (Mukai mis-attribution at §8; GRH-as-Langlands-package at §8 status callout and hero), one stale claim contradicted later in the same page (§4 Sym^k cap), one likely sign error in a foundational formula (§3 W–D relation), plus several precision issues (coefficient field, de Rham locus, Khare–Wintenberger framing, geometric Langlands setting). High-level architecture (philosophy, CFT-as-$n=1$, modularity-as-$n=2$, functoriality slogan, dual group) is largely correct.
