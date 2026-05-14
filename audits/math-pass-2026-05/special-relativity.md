# special-relativity — math correctness audit (2026-05)

**Section:** Mathematical physics

## Verified claims

### Postulates and velocity addition (§1)
- $c \approx 2.998\times 10^8$ m/s (line 270) — correct.
- Galilean violation: a $u=c$ pulse would give $u'=c-v\ne c$ (line 278) — correct.
- Velocity-addition widget formula `(u+v)/(1+uv)` with $c=1$ (line 337) — correct, matches Einstein composition.
- Quiz: $(0.8c, 0.6c) \to 1.4/1.48 \approx 0.946 \approx 0.95\,c$ (lines 34–38) — correct.

### Lorentz transformations (§2)
- Standard boost $t'=\gamma(t-vx/c^2)$, $x'=\gamma(x-vt)$, $y'=y$, $z'=z$ (line 378) — correct.
- $\gamma = 1/\sqrt{1-\beta^2}$ (line 382) — correct; Galilean limit recovered as $\beta\to 0$ — correct.
- Composition $v_3=(v_1+v_2)/(1+v_1v_2/c^2)$ (line 388) — correct.
- Quiz: $\gamma(\beta=0.6) = 1/\sqrt{0.64} = 1.25$ (line 63) — correct.
- Boost widget axis directions: $t'$-axis $\propto(\beta,1)$ from $x'=0\Rightarrow x=vt$; $x'$-axis $\propto(1,\beta)$ from $t'=0\Rightarrow t=vx/c^2$ (lines 422–427) — correct.

### Minkowski metric and intervals (§3)
- $\Delta s^2 = -c^2\Delta t^2+\Delta x^2+\Delta y^2+\Delta z^2$, $\eta=\mathrm{diag}(-,+,+,+)$ (lines 461, 465) — correct mostly-plus signature.
- Lorentz group as $\eta_{\mu\nu}\Lambda^\mu{}_\rho\Lambda^\nu{}_\sigma=\eta_{\rho\sigma}$ defining $\mathrm{O}(1,3)$ (line 469) — correct.
- Interval-sign classification (timelike $<0$, null $=0$, spacelike $>0$) and proper time $\Delta\tau=\sqrt{-\Delta s^2}/c$ (lines 473–476) — correct in mostly-plus.
- Cone widget readout uses $\Delta s^2=\Delta x^2-(c\Delta t)^2$ (line 534) — same numerical value as the page formula in the 1+1D slice; sign convention consistent (timelike gives negative).
- $\mathrm{SO}^+(1,3)$ characterization $\det\Lambda=+1$, $\Lambda^0{}_0>0$ (line 540) — correct.
- Quiz: $\Delta s^2$ for $(c\Delta t, \Delta x)=(5,3)$ is $-25+9=-16$, timelike (line 97) — correct.
- Quiz: spacelike $\Leftrightarrow$ exists frame with $\Delta t'=0$ (line 110) — correct.

### Time dilation, length contraction (§4)
- $\Delta t=\gamma\Delta\tau$, $\gamma\ge 1$ (line 566) — correct.
- $L=L_0/\gamma$, transverse unchanged (line 572) — correct.
- Reciprocity claim (line 576) — correct.
- Quiz: $\beta=0.99,\gamma\approx 7.09$, dilated lifetime $\approx 15.6\,\mu\text{s}$ from $2.2\,\mu\text{s}$ (line 146) — correct: $7.09\times 2.2 = 15.598$.
- Quiz: rod with $\gamma=2$ has $L=0.5\,\text{m}$ (line 153) — correct.

### Energy-momentum (§5)
- $p^\mu = m\,dx^\mu/d\tau = (\gamma mc,\gamma m\vec v)=(E/c,\vec p)$ (line 642) — correct.
- $\eta_{\mu\nu}p^\mu p^\nu=-E^2/c^2+|\vec p|^2=-m^2c^2$ (line 646) — correct.
- $E^2 = |\vec p|^2c^2+m^2c^4$ (line 650) — correct.
- Rest energy $E=mc^2$, photon $E=|\vec p|c$ for $m=0$ (line 656) — correct.
- Newtonian limit $E\approx mc^2+\tfrac12 mv^2+O(v^4/c^2)$ (line 654) — correct (Taylor of $\gamma$).
- Quiz: $E/(mc^2)=\gamma=1.25$ at $\beta=0.6$ (line 184) — correct.

### Causality and simultaneity (§6)
- Future-cone preservation by $\mathrm{SO}^+(1,3)$ (line 743) — correct.
- Simultaneity-widget computation $t'_A=-\gamma\beta\,x_A$ at $t_A=0$ (line 793, code at 794) — correct: with $A=(0,-80)$, $t'_A=80\gamma\beta$.
- Tachyonic-antitelephone construction (line 807) and quiz ordering (line 228) — logically correct.
- Quiz: $\Delta t' = -\gamma vL/c^2$ for two spacelike events at $\Delta t=0$, separation $L$ (line 242) — correct from $t'=\gamma(t-vx/c^2)$.

### Connections (§7)
- $\mathrm{SO}^+(1,3)$ double-covered by $\mathrm{SL}(2,\mathbb{C})$ (line 826) — correct.
- Free-particle Lagrangian $L=-mc^2\sqrt{1-\beta^2}$ (line 824) — correct.
- $\mathrm{Spin}(3)\cong\mathrm{SU}(2)$ as universal cover of $\mathrm{SO}(3)$, identified with unit quaternions (line 826) — correct.

## Wrong / dubious claims

- **None of substance.** No incorrect formulas, no incorrect numerical computations, no incorrect derivations.

## Underspecified or unverifiable claims

- **Muon "tens of microseconds … travel ~10 km"** (line 568). With $\gamma\sim 30$ and proper lifetime $2.2\,\mu\text{s}$, dilated lifetime is $\sim 66\,\mu\text{s}$, and at $v\approx c$ that gives $\sim 20\,\text{km}$, not 10 km. The "~10 km" figure is conservative — likely the depth at which most muons originate plus an exponential-decay accounting — but the page conflates one e-folding with the dilated lifetime. Reads as an order-of-magnitude estimate, not an error.
- **"$\Lambda$ flips spatial parity ($\det\Lambda=\pm 1$)"** (line 540). The parenthetical conflates two facts: $\eta$-preservation forces $\det\Lambda=\pm 1$, and the sign tracks $P\cdot T$ rather than $P$ alone. The four-component description that follows is correct; the parenthetical is loose wording, not an error.
- **Cone-widget "lightlike" tolerance** (line 510): `Math.abs(inner) < 60` is a pixel-space threshold for the visual classification, not a physical claim. Drag near the cone and the band of "near-null" tagging is wider than for a true mathematical $\Delta s^2=0$. UI choice, not a math issue.
- **Twin paradox, ladder paradox, Compton scattering** — not covered on this page. The audit prompt listed them as focus areas, but they are out-of-scope for this topic page (the paradoxes appear nowhere; Compton scattering is photon-scattering content owned by a hypothetical future page).
- **Lorentz invariants** — the page covers only the two principal ones (interval $\Delta s^2$, mass-shell $-m^2c^2$). It does not discuss $F_{\mu\nu}F^{\mu\nu}$ or $\epsilon^{\mu\nu\rho\sigma}F_{\mu\nu}F_{\rho\sigma}$ (electromagnetic invariants). Not in scope for an introductory SR page.

## Severity

**clean.** Every formula on the page (Lorentz boost, $\gamma$, velocity addition, spacetime interval, $\eta$, $\mathrm{O}(1,3)$ defining condition, time dilation, length contraction, 4-momentum, mass shell, $E^2=p^2c^2+m^2c^4$, Newtonian Taylor expansion, $\mathrm{SO}^+(1,3)$ classification, $\mathrm{SL}(2,\mathbb{C})$ double cover, free Lagrangian) is correct. Every numerical example in the prose and quiz bank checks out: $\gamma(0.6)=1.25$, $(0.8\oplus 0.6)c\approx 0.946c$, muon $\gamma=7.09\Rightarrow 15.6\,\mu\text{s}$, $\Delta s^2(5,3)=-16$, $L_0=1\,\text{m},\gamma=2\Rightarrow L=0.5\,\text{m}$, $E/(mc^2)=1.25$ at $\beta=0.6$. Widget computations (Einstein composition, $\gamma$-curve, axis-tilt directions, simultaneity-slice $t'$ at sample events) match their stated formulas.

The only items worth surfacing are minor scope/wording notes:
- the muon "~10 km" sentence is loose but qualitatively right;
- the parenthetical $\det\Lambda=\pm 1$ phrasing for parity is loose but the formal classification that follows is correct;
- the cone widget's "lightlike" pixel tolerance is a UI band, not a math claim.

None rises to an error.
