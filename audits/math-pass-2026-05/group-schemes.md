# Math correctness audit — `group-schemes.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.

## Verified claims (sections)

### §1 Definition (lines 272–391)
- Group object characterization in $\mathbf{Sch}_S$ via $(m, e, \iota)$ and the four diagrams. Correct.
- Functor-of-points equivalence: $G$ a group scheme iff $h_G(T) = \Hom_S(T,G)$ lands in $\mathbf{Grp}$ naturally. Correct (Yoneda).
- Concrete dictionary: $\mathbb{G}_m(T)=\Gamma(T,\mathcal O_T)^\times$, $\mathbb{G}_a(T)=\Gamma(T,\mathcal O_T)$, $\mathrm{GL}_n(T) = \mathrm{GL}_n(\Gamma(T,\mathcal O_T))$, $\mu_n(T) = \{f^n=1\}$. All correct.
- Worked example $\mathrm{GL}_n/\mathbb{Z}$ with $\det\in\mathcal O^\times$ argument — correct.

### §2 Examples (lines 415–501)
- $\mathbb{G}_a = \Spec k[t]$, $\Delta(t)=t\otimes 1+1\otimes t$. Correct.
- $\mathbb{G}_m = \Spec k[t,t^{-1}]$, $\Delta(t)=t\otimes t$. Correct.
- $\mu_n = \Spec k[t]/(t^n-1)$, $\Delta(t)=t\otimes t$. Closed immersion $\mu_n\hookrightarrow\mathbb{G}_m$ as $\ker[n]$. Correct.
- $\alpha_p = \Spec k[t]/(t^p) = \ker(\mathrm{Frob}\colon\mathbb{G}_a\to\mathbb{G}_a)$ in char $p$. Correct.
- Étale/non-étale split: $\mu_n$ étale of order $n$ when $n\in k^\times$; in char $p$ with $p\mid n$, $t^n-1=(t-1)^p\cdot$… (specifically $\mu_p$: $t^p-1=(t-1)^p$). Correct, and matches the worked example over $\bar{\mathbb{F}_2}/\bar{\mathbb{F}_5}$.

### §3 Hopf algebra dictionary (lines 503–639)
- $\Spec\colon\mathbf{CAlg}_k^{\mathrm{op}}\xrightarrow{\sim}\mathbf{AffSch}_k$ anti-equivalence; affine group schemes ↔ commutative Hopf algebras. Correct.
- Coassociativity, counit law, antipode equation $\mu\circ(\mathrm{id}\otimes S)\circ\Delta = \eta\circ\epsilon$. Correct.
- Per-example $\Delta,\epsilon,S$ values for $\mathbb{G}_a, \mathbb{G}_m, \mu_n, \alpha_p$ in the table widget (lines 585–590) all correct, including $S(t)=t^{n-1}$ for $\mu_n$.
- "Cocommutative Hopf ↔ commutative group scheme" — correct.

### §4 Étale/connected decomposition (lines 641–712)
- SES $1\to G^\circ\to G\to G^{\text{ét}}\to 1$ for finite group schemes; canonical splitting over a perfect field. Correct (Cartier).
- Char 0 ⇒ all finite group schemes étale; $\mathbf{FCGS}_\mathbb{Q}$ = finite groups w/ continuous Galois action. Correct.
- $\mu_p$ vs $\alpha_p$ both connected of order $p$ in char $p$, both with one $\bar k$-point, but non-isomorphic Hopf algebras. Correct.
- Per-node decompositions in widget (lines 661–673) all correct, including the $\mu_{pn}=\mu_p\times\mu_n$ split when $\gcd(n,p)=1$.

### §5 Lie algebra (lines 715–776)
- $\mathrm{Lie}(G):=\ker(G(k[\epsilon])\to G(k))$. Correct.
- $\mathrm{Lie}(G)\cong T_e G$ as vector space. Correct.
- $\mathrm{Lie}(\mathrm{GL}_n)=\mathfrak{gl}_n$, dim $n^2$, via $I+\epsilon X$ with $\det = 1+\epsilon\,\tr(X)\in k[\epsilon]^\times$. Correct.
- $\mathrm{Lie}(\mathrm{SL}_n)=\mathfrak{sl}_n$ (trace 0), dim $n^2-1$. Correct.
- $\mathrm{Lie}(\mathbb{G}_m)=\mathrm{Lie}(\mathbb{G}_a)=k$, abelian. Correct.
- "$\dim\mathrm{Lie}(G)$ can exceed $\dim G$ at non-smooth points; that excess measures non-smoothness." Correct.

### §6 Torsors and $H^1$ (lines 778–893)
- Torsor definition via free-and-transitive map $G\times_S P\to P\times_X P$ and étale-local triviality. Correct.
- $H^1_{\text{ét}}(\Spec k, G) = H^1(\Gal(\bar k/k), G(\bar k))$ for smooth commutative $G$. Correct.
- $\mathrm{Pic}(X)=H^1_{\text{ét}}(X,\mathbb{G}_m)$ via Hilbert 90. Correct.
- Kummer SES $1\to\mu_n\to\mathbb{G}_m\xrightarrow{[n]}\mathbb{G}_m\to 1$ → long exact sequence with $H^1(X,\mu_n)$ sitting between units mod $n$-th powers and $\mathrm{Pic}(X)[n]$. Correct (assumes $n$ invertible on $X$ — see Underspecified).
- Case widget (lines 808–864): all four cases evaluated correctly, including $H^1(\Spec\mathbb{Q},\mu_n)=\mathbb{Q}^\times/(\mathbb{Q}^\times)^n$, $\mathrm{Pic}(\mathbb{P}^1)=\mathbb{Z}$, finite-étale-$G$/$\Spec k$ ↔ Galois cohomology.

## Wrong / dubious claims

- **`group-schemes.html:906`** — "the Lie algebra of a group scheme is the **cotangent** space at the identity." **Wrong**. $\mathrm{Lie}(G)=T_e G$, the **tangent** space. The cotangent space is $\mathfrak{m}_e/\mathfrak{m}_e^2$, the dual. The page itself states the correct version at line 720 ("$\mathrm{Lie}(G)=T_e G$, the Zariski tangent space at the identity"). Outro contradicts the body.

- **`group-schemes.html:647`** — "Cartier-style components $G^{\circ,\circ}, G^{\circ,\mathrm{ét}}, G^{\mathrm{ét},\circ}, G^{\mathrm{ét},\mathrm{ét}}$ (the last two equal in the commutative case because Cartier duality swaps connected and étale)." **Dubious / misleading.** Cartier duality on a commutative finite group scheme exchanges the connected and étale parts (i.e. swaps $G^{\circ,\text{ét}}$ with $G^{\text{ét},\circ}$ as Cartier duals), but this does not make them isomorphic as group schemes — generally they are *distinct* pieces, dual to each other. The four-piece refinement is a real decomposition with four (possibly non-isomorphic) factors; conflating "swapped under duality" with "equal" is a category error.

- **`group-schemes.html:649`** — "a connected (infinitesimal) one has Lie algebra equal to its dimension." **Confused.** For a *finite* infinitesimal group scheme, the underlying scheme has dimension 0 (Krull); what the author presumably means is $\dim_k\mathrm{Lie}(G)$ equals the embedding/tangent dimension at the identity, which can be positive. As stated this reads as $\dim\mathrm{Lie}(G)=\dim G=0$, which is wrong (e.g. $\mathrm{Lie}(\mu_p)=\mathrm{Lie}(\alpha_p)=k$ is 1-dimensional but $\mu_p,\alpha_p$ are 0-dimensional schemes).

- **`group-schemes.html:718`** — "Let $k[\epsilon] := k[\epsilon]/\epsilon^2$" is self-referential. Should read $k[\epsilon] := k[t]/(t^2)$ (corrected in the proof scrubber at line 737, which uses $k[t]/(t^2)$).

- **`group-schemes.html:720`** — "for $g \in G(k[\epsilon][\epsilon'])$ ... and $h \in G(k[\epsilon'])$" mixes rings: $h$ should also live in the two-variable ring $k[\epsilon,\epsilon']/(\epsilon^2,\epsilon'^2)$ for the commutator to be defined. As written the multiplication $g h g^{-1} h^{-1}$ doesn't type-check.

## Underspecified or unverifiable claims

- **§2/§6 Kummer sequence** — exactness of $1\to\mu_n\to\mathbb{G}_m\xrightarrow{[n]}\mathbb{G}_m\to 1$ requires $n$ invertible on $X$ (or work in the fppf topology). Page never states the hypothesis; standard but worth noting.
- **§4 line 645** — "$G^{\text{ét}}$ recovered as $\Spec$ of the largest separable subalgebra of $\mathcal{O}(G)$" — true for $G$ finite over a perfect field; the perfect-field hypothesis is given a few lines earlier but the construction would fail over imperfect fields.
- **§6 line 791** — "$H^1_{\text{ét}}(X,G)$ classifies $G$-Galois covers" for finite étale $G$ — correct; reader may want the $G$ acting freely caveat.
- **User-list items not actually claimed in the page**: Cartier dual identity $\mu_n^* = \mathbb{Z}/n$ is *not* explicitly stated (only Cartier duality is named in passing at line 647); Tannakian formalism is not mentioned; Verschiebung is not mentioned; abelian schemes are not discussed. Nothing to verify or refute on those topics — they are absent.

## Severity

**Moderate.** One outright math error in the Connections section (cotangent vs tangent, line 906) directly contradicts the body. The Cartier-quadrant claim (line 647) is misleading enough to confuse a reader who knows the framework. The "Lie algebra equal to its dimension" line (649) is confused phrasing about an infinitesimal group scheme. The dual-numbers self-reference (718) and ring-mismatch in the bracket construction (720) are typos / sloppiness rather than conceptual errors but should be cleaned up. The widget content (axiom diagrams, Hopf table, decomposition graph, torsor cases, Lie scrubber) is uniformly correct.
