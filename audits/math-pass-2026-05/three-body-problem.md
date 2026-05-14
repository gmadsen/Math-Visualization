# three-body-problem.html — math-correctness pass

## Verified claims (sections)

- **§1 Newton's equations.** Gravitational n-body EOM (line 267) and Hamiltonian (line 270) are correct. 18-dim phase space, ten classical integrals (E, P, R, L), Bruns 1887 non-existence of new algebraic integrals — all standard.
- **§2 Restricted 3-body.** Effective potential $U_{\rm eff} = -\tfrac12\Omega^2(x^2+y^2) - Gm_1/r_1 - Gm_2/r_2$ (line 475) correct. Routh threshold $\frac{m_1}{m_2} > \frac{25+3\sqrt{69}}{2} \approx 24.96$ (line 478) verified: $\sqrt{69}\approx 8.30662 \Rightarrow (25 + 24.9199)/2 = 24.96$. Sun-Jupiter ratio 1047, Earth-Moon 81.3, Sun-Earth 3.33×10⁵ all correct. $L_4 = (\tfrac12-\mu, \tfrac{\sqrt3}2)$ (line 517) is correct in canonical units.
- **§2 widget code.** `Ueff` (line 528) and `dU` (line 513) correctly normalize $\Omega=1$ and use $(x+\mu)/|x+\mu|^3 = \mathrm{sgn}/(x+\mu)^2$ — equivalent to the signed-distance form. L1/L2/L3 bisection brackets correct.
- **§3 Special solutions.** Lagrange (1772) equilateral, Euler (1767) collinear with quintic in masses, Chenciner–Montgomery (2000) figure-eight via action minimisation (after Moore 1993 numerical) — all correctly attributed. Equilateral angular velocity $\omega^2 = 3Gm/a^3$ (lines 313, 673) verified: distance-to-COM $r = a/\sqrt{3}$, two-body force sum on one mass $\sqrt{3}\,Gm^2/a^2$ ⟹ $\omega^2 = 3Gm/a^3$.
- **§3 figure-eight ICs.** $(x_1,y_1)=(0.97000436, -0.24308753)$, velocities $(0.93240737, 0.86473146)/2$ are the canonical Chenciner–Montgomery values; relabeling between prose ("body 2 at origin") and code (body 3 at origin) is internally consistent.
- **§4 Smale horseshoe.** Conjugacy $(\Lambda, f) \cong (\{0,1\}^{\mathbb{Z}}, \sigma)$ (line 765), the consequences (countable periodics, dense orbit, sensitive deps, positive entropy) — standard.
- **§5 KAM.** Diophantine condition $|k\cdot\omega|\ge\gamma/|k|^\tau$ with $\tau > n-1$ (line 854), full-measure complement, super-convergent Newton iteration, $n=2$ tori topologically enclose chaos on the 3-dim energy surface (line 857) — all correct attributions and statements.
- **§6 Applications.** Sun-Earth $\mu = m_E/(m_S+m_E) \approx 3.0\times 10^{-6}$ (lines 995, 1065) correct. Koon–Lo–Marsden–Ross interplanetary transport network (line 972) and Genesis (2001) attribution correct. Wisdom / Murray–Holman resonance-overlap criteria correct.

## Wrong / dubious claims (with file:line)

- **`three-body-problem.html:1064`** — readout label calls a 150° libration a "tadpole orbit". Tadpole-vs-horseshoe boundary in CR3BP is at libration amplitude ~83°; orbits with libration much beyond that are horseshoe orbits. The advertised "tadpole libration ~150°" is mislabeled; it would be a horseshoe.
- **`three-body-problem.html:986`** — "Real spacecraft halo orbits (e.g. JWST's around Sun–Earth $L_2$) have amplitudes ~10⁵ km". JWST's halo has out-of-plane amplitude $A_z \approx 2.5\times 10^5$ km and in-plane semi-major axis ~8×10⁵ km. "~10⁵ km" understates by roughly an order of magnitude on the dominant axis; "~10⁶ km" or "few×10⁵ km" would be accurate.
- **`three-body-problem.html:270`** — "in the planar problem it reduces to $4$". Planar 3-body has 12-dim phase space minus 6 integrals (COM 2, momentum 2, energy 1, $L_z$ 1) = 6, then quotient by SO(2) and time-translation → 4. The claim is right under the "after symmetry reduction" reading but the prose only credits Galilean reduction. Minor under-specification.
- **`three-body-problem.html:974`** — "Trappist-1's $8\!:\!5\!:\!3\!:\!2\!:\!3\!:\!4\!:\!3$ Laplace chain" is unusual notation. The published period ratios (Luger et al. 2017) for b:c:d:e:f:g:h are 24:15:9:6:4:3:2, with consecutive ratios close to 8:5, 5:3, 3:2, 3:2, 4:3, 3:2 — six ratios for seven planets, not seven. The seven-number string conflates planet labels with ratios.

## Underspecified or unverifiable claims

- **§4 Painlevé conjecture** — listed in audit scope but absent from the topic. Topic does not claim it; Xia's 1992 5-body construction (and Saari–Xia for n=4 still partial) is missing context but not a wrong statement.
- **`three-body-problem.html:967`** — "$\sim 10^4$ Trojan asteroids" librating in Sun–Jupiter $L_4/L_5$. Known catalog as of 2025 is ~13,500 (combined L4+L5), so the order-of-magnitude is fine; OK as written.
- **`three-body-problem.html:963`** — JWST "passive shading from sun, earth, moon" via $L_2$ geometry is an informal pop-sci compression. Sunshield does the shading; $L_2$ provides constant geometry, not the shade itself. Borderline acceptable as informal table prose.

## Severity

**Minor.** No wrong equations or wrong threshold constants; the Routh value, equilateral $\omega^2 = 3G/a^3$, KAM Diophantine statement, Chenciner–Montgomery ICs, Sun–Earth $\mu$, and Smale horseshoe conjugacy are all correct. The defects are: one mislabeled orbit family in a widget readout (tadpole vs horseshoe at 150°), one off-by-an-order-of-magnitude on JWST halo amplitude, one ambiguous-notation Trappist resonance string, and one under-specified planar-reduction count.
