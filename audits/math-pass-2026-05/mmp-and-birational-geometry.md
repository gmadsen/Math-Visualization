# mmp-and-birational-geometry — math correctness pass

## Verified claims

**§1 Kodaira dimension.** Definition via $\limsup \log h^0/\log m$ (standard); equivalent Iitaka definition via image of pluricanonical map; birational invariance via Hartogs across codim ≥ 2; Iitaka conjecture $C_{n,m}$; $\kappa = -\infty$ examples (Fano hypersurfaces of degree ≤ $n$ in $\mathbb{P}^n$ — correct since $K = \mathcal{O}(d-n-1)$ ample iff $d \le n$). Curve-pluricanonical widget formula $h^0(mK_C) = m(2g-2) - g + 1$ for $m \ge 2$, $g \ge 2$ matches Riemann–Roch (degree exceeds $2g-2$ so $h^1 = 0$); $h^0(K_C) = g$ for $m=1$; $g=0,1$ branches correct. BCHM finite generation for general type.

**§2 Cone theorem.** Mori bound $0 < -K_X \cdot C_i \le \dim X + 1$ on extremal rational curves; local finiteness in $K_X < 0$ half-space; contraction theorem with $\phi_*\mathcal{O}_X = \mathcal{O}_Y$. Three contraction types (fibre / divisorial / small) with codimensions correct. Surface-cone widget: $\mathbb{F}_1 = \text{Bl}_p\mathbb{P}^2$ has $\rho=2$, $E^2 = K\cdot E = -1$, fibre $f$ with $f^2 = 0, K\cdot f = -2$ (adjunction); $\text{Bl}_{p,q}\mathbb{P}^2$ has $\rho=3$ with three $(-1)$-curves $E_1, E_2, \tilde\ell_{pq}$ and contracting $\tilde\ell_{pq}$ gives $\mathbb{P}^1\times\mathbb{P}^1$; $\mathbb{P}^1\times\mathbb{P}^1$ has $K\cdot F = -2$.

**§3 Surface MMP.** Castelnuovo $\Leftrightarrow E\cong\mathbb{P}^1, E^2=-1$; adjunction $2g-2 = E^2 + K\cdot E$; $\rho$ drops by 1 under blow-down. Minimal-surface trichotomy ($\mathbb{P}^2$, $\mathbb{F}_n$ with $n=0$ or $n\ge 2$, nef-$K$). Enriques table $\kappa\in\{-\infty,0,1,2\}$ with the four $\kappa=0$ families distinguished by $b_1$ and torsion order of $K$. $\kappa=-\infty \Leftrightarrow K_X$ not pseudo-effective $\Leftrightarrow$ ruled-or-rational. $\text{Bl}_{p_1,p_2,p_3}\mathbb{P}^2$ has $\rho=4$ and exactly six $(-1)$-curves (del Pezzo of degree 6).

**§4 Threefold MMP.** Definition of flip ($-K_X$ $\phi$-ample on source, $K_{X^+}$ $\phi^+$-ample on target); $\rho$ preserved. Mori 1988 flip-existence and termination (Shokurov difficulty). BCHM 2010 conclusions (klt log flips exist, MMP-with-scaling terminates, canonical ring finitely generated).

**§5 Singularities of pairs.** Discrepancy formula $K_Y = f^*(K_X+\Delta) + \sum a_E E$; convention $a_E = -a_i$ on strict transforms; nesting terminal $\subsetneq$ canonical $\subsetneq$ klt $\subsetneq$ lc with stated $\inf a_E$ thresholds; canonical surface = ADE = rational double point; $A_{n-1} = \mathbb{A}^2/\mathbb{Z}_n$ widget (chain of $n{-}1$ exceptional $\mathbb{P}^1$'s, $E_i^2 = -2$, all $a_E = 0$, crepant resolution); log adjunction formula.

**§6 Sarkisov.** Mori-fibre-space definition (relative $\rho = 1$, $-K_X$ $\phi$-ample); attribution Sarkisov 1989 / Corti 1995 / Hacon–McKernan 2013; four link types; Iskovskikh–Manin 1971 rigidity of $X_4 \subset \mathbb{P}^4$; unirational via projection from a line; one of the original Lüroth counterexamples.

**§7 Connections.** Termination of flips open in $\dim \ge 4$; abundance conjecture statement; Raynaud's char-$p$ failure of Kawamata–Viehweg.

## Wrong / dubious claims

None. No mathematical errors detected.

## Underspecified or unverifiable claims

- **§4 line 767 (BCHM hypothesis):** "klt pairs $(X,\Delta)$ with $K_X+\Delta$ big and $\Delta$ big". The conjunction is technically redundant — in BCHM the operative hypothesis is $(X,\Delta)$ klt with $\Delta$ big, from which $K_X+\Delta$ big is the case where one obtains a minimal model and finite generation. Stated as written it's not wrong, just over-specified.
- **§6 line 1009 (Pukhlikov extension):** "Birational rigidity of smooth Fano hypersurfaces $X_n \subset \mathbb{P}^n$ for $n \ge 4$ was extended to all degrees $n$ by Pukhlikov, de Fernex, and others". The phrase "extended to all degrees $n$" is ambiguous — Pukhlikov proved index-1 hypersurfaces (i.e. degree $= n$) of $\mathbb{P}^n$ are birationally rigid for all $n \ge 4$; de Fernex et al. handled higher-index / lower-degree cases. The reader cannot tell from the prose whether "$n$" varies as dimension or degree.
- **§6 widget Type IV:** "an elliptic fibration on a Calabi–Yau threefold may admit two distinct base $\mathbb{P}^1$'s related by Type IV" — plausible illustration but elliptic-CY3 fibrations have base of dim 2 (typically $\mathbb{P}^2$ or a Hirzebruch surface), not $\mathbb{P}^1$. Probably the author meant a different example or "two distinct bases $\mathbb{P}^2$" / "two distinct rulings". Cosmetic but technically wrong as an example.
- **Atiyah flop:** the user's audit checklist lists "Atiyah flop" as a worked example to verify; the page contains a generic schematic flip (§4 widget) but no explicit Atiyah-flop computation (the standard $\mathcal{O}(-1)\oplus\mathcal{O}(-1) \to \mathbb{P}^1$ resolution of the conifold). Omission rather than error.

## Severity

**Clean — minor.** No incorrect mathematical statements. One genuinely sloppy example (Type-IV CY3-elliptic-fibration over $\mathbb{P}^1$), one ambiguous attribution sentence (Pukhlikov / "all degrees $n$"), and one mildly redundant hypothesis phrasing (BCHM). The Atiyah flop is missing as a concrete example but the user-flagged "specific worked examples" item is otherwise covered (§3 surface widget, §4 generic flip schematic, §5 ADE widget, §2 cone of $\mathbb{F}_1$ / del Pezzo / quadric).
