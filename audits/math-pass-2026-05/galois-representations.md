# Math-correctness audit — `galois-representations.html`

## Verified claims

**§1 Absolute Galois group.** $G_\mathbb{Q} = \varprojlim \Gal(K/\mathbb{Q})$ as a profinite group with Krull topology (compact, Hausdorff, totally disconnected). Decomposition/inertia subgroups, $\Frob_p$ generating $D_p/I_p$ at unramified $p$, conjugacy-class ambiguity from embedding choice — all stated correctly.

**§2 Definition.** $\rho: G_\mathbb{Q}\to\mathrm{GL}_n(K)$ continuous; the three coefficient regimes ($\mathbb{C}$ Artin / $\bar{\mathbb{Q}}_\ell$ ℓ-adic / $\bar{\mathbb{F}}_\ell$ mod-ℓ) and continuity subtlety (ℓ-adic image need not be finite) are correct.

**§3 Examples.** Cyclotomic character $\chi: G_\mathbb{Q}\to\mathbb{Z}_\ell^\times$ with $\chi(\Frob_p)=p$ for $p\ne\ell$, Dirichlet characters as 1-d Artin reps via $G_\mathbb{Q}\twoheadrightarrow(\mathbb{Z}/N)^\times$, "every 1-d Artin rep arises this way" (CFT for $\mathbb{Q}$): correct. $G_\mathbb{Q}^{ab}\cong\hat{\mathbb{Z}}^\times$ in Widget 1: correct (Kronecker–Weber).

**§4 Tate module.** $E[\ell^n]\cong(\mathbb{Z}/\ell^n)^2$, $T_\ell E\cong\mathbb{Z}_\ell^2$, $\rho_{E,\ell}:G_\mathbb{Q}\to\mathrm{GL}_2(\mathbb{Z}_\ell)$. Determinant-is-cyclotomic-character via Weil pairing $\bigwedge^2 T_\ell E\cong\mathbb{Z}_\ell(1)$: correct.

**§5 Hasse.** char poly $t^2-a_p t+p$, $a_p=p+1-\#\tilde E(\mathbb{F}_p)$, $|a_p|\le 2\sqrt p$, $|\alpha|=|\beta|=\sqrt p$: correct. Cremona labels in Widget 6 (`y²=x³−x` cond. 32 CM; `y²+y=x³−x²` cond. 11; `y²=x³−43x+166` cond. 26 — disc factors as $2^{19}\cdot 13$, consistent): correct.

**§6 L-factor.** $L_p(E,s)=\det(1-\rho_{E,\ell}(\Frob_p)p^{-s})^{-1}=1/(1-a_p p^{-s}+p^{1-2s})$, Euler product convergence Re(s)>3/2: correct. Bad-prime factor $1/(1-a_p p^{-s})$ with $a_p\in\{-1,0,1\}$ (split mult / additive / non-split mult): correct.

**§7 Modular forms.** Eichler–Shimura/Deligne 2-d $\rho_{f,\lambda}$, unramified outside $N\ell$, $\tr=a_p(f)$, $\det=\varepsilon(p)p^{k-1}$: correct. $f_{11}$ q-expansion ($a_2=-2,a_3=-1,a_5=1,a_7=-2,a_{13}=4,…$, LMFDB 11.2.a.a): correct. Ramanujan $\tau(p)$ values for $p=2,3,5,7,11,13$: correct. $E_4$ "eigenvalues" $1+p^3$ ($a_2=9,a_3=28,…$): correct in the un-multiplied normalization.

**§8 Semisimplification.** Brauer–Nesbitt + Chebotarev rigidity: correct.

**§9 Inertia/conductor.** $I_p$ definition, unramified ⇔ $\rho(I_p)=1$, Artin conductor exponent $f_p=\dim V-\dim V^{I_p}+\text{wild}$, $f_p=1$ multiplicative / $f_p\ge 2$ additive: correct.

## Wrong / dubious claims

- **`galois-representations.html:598`** — "For $\rho_{E,\ell}$ from an elliptic curve, a theorem of Serre guarantees irreducibility for all but finitely many $\ell$." False as stated: Serre's open-image theorem requires $E$ to be **non-CM**. For CM curves, $\rho_{E,\ell}$ is reducible at every prime $\ell$ that splits in the CM field (it becomes a sum of two characters of $G_K$ induced up). The page itself ships a CM example (`y²=x³−x`, Widget 6 option A), so the unqualified claim contradicts the corpus. Fix: insert "non-CM" before "elliptic curve."
- **`galois-representations.html:1240`** (Widget 7 readout, disc=0 branch) — labels the repeated-root case "supersingular in char p." Wrong: supersingular reduction means $a_p\equiv 0\pmod p$, which for $p\ge 5$ forces $a_p=0$ and gives disc $=-4p<0$ (purely imaginary eigenvalues $\pm i\sqrt p$), not disc $=0$. The disc=0 case ($a_p^2=4p$) has no integer solutions for prime $p$ anyway (since $4p$ is not a perfect square), so the branch is unreachable for valid slider inputs — but the labeling is still mathematically backward.

## Underspecified or unverifiable claims

- **`galois-representations.html:289`** — "$\Frob_p$ is well-defined as a conjugacy class in $G_\mathbb{Q}/I_p$." The notation $G_\mathbb{Q}/I_p$ is loose: $I_p$ is not normal in $G_\mathbb{Q}$, so the quotient isn't a group. The usual statement is that $\Frob_p$ is a well-defined conjugacy class in $G_\mathbb{Q}^{\mathrm{unr}\text{ at }p}=G_\mathbb{Q}/\langle I_p\rangle$ (normal closure) or, equivalently, in $\Gal(K/\mathbb{Q})$ for any unramified-at-$p$ finite quotient. Pedagogically OK but technically informal.
- **`galois-representations.html:720`** (Widget 2 mod-ℓ note) — "Serre's conjecture: every odd, irreducible, 2-d mod-ℓ representation is modular." Should be "odd, absolutely irreducible" for the standard statement (and Khare–Wintenberger's theorem). Minor.
- **`galois-representations.html:406`** — "odd irreducible Artin representations (Khare–Wintenberger theorem)" is a category error: K–W concerns mod-ℓ residual reps, not complex Artin reps. The corresponding Artin-rep statement is the Langlands–Tunnell + Khare–Wintenberger + automorphy-lifting chain that makes odd 2-d Artin reps modular (the Khare–Wintenberger theorem proves Serre's conjecture). The attribution is loose.

## Severity

**Minor.** One real math error (CM caveat at `:598`) and one unreachable-but-mislabeled widget branch (`:1240`); rest of the corpus, including the Hasse bounds, $L$-factor formulas, Tate module determinant, and all numeric data (Cremona conductors, $f_{11}$ $a_p$, Ramanujan $\tau$, $E_4$ Eisenstein eigenvalues), checks out.
