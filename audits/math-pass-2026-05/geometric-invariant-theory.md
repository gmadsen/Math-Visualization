# geometric-invariant-theory — math correctness audit (2026-05)

**Section:** Algebraic geometry

## Verified claims

- **§1 Invariants & finiteness:** $R^G$ definition (267); $k[\mathbf x]^{\mathfrak S_n}=k[e_1,\ldots,e_n]$ (276, quiz 9); $\mathbb Z/n$ on $k[x]$ gives $k[x^n]$ (277, quiz 21); Hilbert finiteness for reductive $G$ (286); Nagata 1959 ↔ Hilbert 14 (288, quiz 36). Symmetric-polynomial widget transform `n[sigma[i]]+=t[i]` correct.
- **§2 Reductivity:** definition + table of examples (441, 446–453) all correct (Borels non-reductive). Reynolds projection (458, quiz 64), finite-average and Haar formulas (463). Widget orbits: $\mathbb G_m$ orbit $(e^t,1,e^{-t})$ (530); $\mathbb G_a$ Jordan exp matrix $(1,t,t^2/2;0,1,t;0,0,1)$ (533); $\ker N=\mathbb C\cdot e_1$ as unique invariant line — all correct.
- **§3 GIT quotient:** $\operatorname{Spec}R^G$ identifies orbits with intersecting closures (642–644); $\mathbb G_m$ on $\mathbb A^2$ weights $(1,-1)$ → $k[xy]$ → $\mathbb A^1$ (644); projective $\operatorname{Proj}\bigoplus H^0(L^{\otimes n})^G$ (656, quiz 117); 4-tier stability table (665–668) and matching quiz (92–110) consistent. $\mathrm{SL}_2$ on $(\mathbb P^1)^4$ stable/ss/unstable thresholds (684, widget 715–722, quiz 134) and general $>n/2$-multiplicity criterion correct. Cross-ratio formula (733) standard.
- **§4 Hilbert–Mumford:** $\mu(x,\lambda)=\min\{w:x_w\ne0\}$, ss ⇔ $\mu\le 0$ ∀ $\lambda$, stable ⇔ strict (864, 870, quiz 167). Binary form weight $2i-n$ on $x^iy^{n-i}$ under $\operatorname{diag}(t,t^{-1})$ (876, quiz 151); $f=x^3y$ ⇒ $\mu=2$ (quiz 156). Multiplicity criterion ss ⇔ no root $>n/2$, stable ⇔ $<n/2$ (880) — Mumford GIT Prop 4.1.
- **§5 Kempf–Ness:** moment map; MW-reduction dim $\dim X-2\dim K$ (1015, 1019); KN theorem statements (1026–1031); $\Phi_x(g)=\log\|g\cdot\tilde x\|^2$ geodesically convex, grad $-2\mu$ (1033, 1148). Widget: $\mu=\tfrac12(|v|^2-1)$ for $\mathbb C^\times$ on $\mathbb C^2$ at level 1, $\mu^{-1}(0)=S^3$, quotient $\mathbb P^1$ (1044). Quiz q2 correct.
- **§6 VGIT:** $G$-ample cone, locally constant ss-locus, Thaddeus / Dolgachev–Hu wall–chamber decomposition (1173, 1175, quiz 248). Widget weights $(\alpha,\alpha,1-\alpha,1-\alpha)$ totaling 2, ss ⇔ max cluster $\le 1$ (1196, 1242–1245); wall at $\alpha=\tfrac12$ — correct.
- **§7 Moduli:** tricanonical $|3K_C|:C\hookrightarrow\mathbb P^{5g-6}$ with $h^0(3K_C)=5g-5$ by RR; $\overline M_g=H^{ss}/\!/\mathrm{PGL}_{5g-5}$ (1335–1337) — Mumford 1965, correct. King: character $g\mapsto\prod\det(g_i)^{\theta_i}$, $\theta$-(s)stab = GIT-(s)stab (1347, quiz 295). Kronecker $K_2$ widget: subreps $(0,\mathbb C)$ always; $(\mathbb C,0)$ iff $a_1=a_2=0$; $\theta\cdot\dim$ values $\mp\theta_1$ — correct internally (1376, 1393–1396).

## Wrong / dubious claims

- **`geometric-invariant-theory.html:1351` — Narasimhan–Seshadri:** "*polystable* degree-0 bundles … identifies with the space of *irreducible* unitary representations $\pi_1(C)\to U(n)$." The NS bijection pairs **stable ↔ irreducible** and **polystable ↔ semisimple** unitary (direct sums of irreducibles). The page conflates the halves. **Fix:** swap "polystable…irreducible" to "stable…irreducible" or "polystable…semisimple."

## Underspecified or unverifiable claims

- **King sign convention** (1347, widget 1376–1404): page uses $\theta\cdot\dim W\le0$ for subreps; King 1994 uses $\ge 0$. Internally consistent; worth flagging.
- **HM widget verdict** (961–963): tests only the diagonal 1-PS and its swap, not all $\mathrm{SL}_2$-conjugates. The "for this 1-PS (and its swap)" hedge is critical context.
- **§5 quiz q3 (a)** (210): Kähler structure on $X/\!/G$ holds on the smooth (stable) locus; strictly semistable strata generally introduce singularities. Implicit qualifier; not an error.

## Severity

**clean** (one minor wording correction at line 1351). All worked examples and theorem statements (Hilbert finiteness, Hilbert–Mumford, Kempf–Ness, Thaddeus–Dolgachev–Hu, Mumford $\overline M_g$, King) check out.
