# Math correctness audit — `klein-gordon-equation.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

---

## §1 From E²=p²+m² to a wave operator (lines 265–337)
- **Verified.** Quantization rules $E\mapsto i\hbar\partial_t,\ \vec p\mapsto -i\hbar\vec\nabla$ applied to $E^2-|\vec p|^2c^2=m^2c^4$ giving $-\hbar^2\partial_t^2\phi=-\hbar^2c^2\nabla^2\phi+m^2c^4\phi$ ✓. Natural-units collapse to $(\Box+m^2)\phi=0$ with $\Box=\partial_t^2-\nabla^2$ ✓ (this is the **mostly-minus** $(+,-,-,-)$ convention). Second-order-in-time vs first-order Schrödinger explanation correct ✓. Dirac square-root remark correct ✓.
- **Wrong/dubious.** Line 276 calls $\Box=\partial_t^2-\nabla^2$ "mostly-plus convention $\partial^\mu\partial_\mu$ on a scalar". This is backwards: with $\eta=\mathrm{diag}(-,+,+,+)$ (mostly-plus), $\partial^\mu\partial_\mu=-\partial_t^2+\nabla^2$. The signature labelling here is inverted; what's written is mostly-minus.

## §2 The Klein-Gordon equation (lines 339–445)
- **Verified.** Lorentz/translation invariance, free-field framing ✓. Standard-model role bullets (Higgs, spin-0 mesons, Lorenz-gauge $\Box A^\mu=0$) ✓. Compton wavelength $1/m$ in natural units ✓ (this is the reduced Compton wavelength; the conventional Compton wavelength is $h/(mc)=2\pi/m$, but the page is consistent with itself and quiz `kg-equation` Q3). **§2 widget**: numerical packet $\phi(0,x)\sim e^{-(x-x_0)^2/2\sigma^2}\cos(k_0x)$ propagated by $\int A(k)e^{i(kx-\omega t)}dk$ with $\omega=\sqrt{k^2+m^2}$ — group-velocity dispersion $v_g=k/\sqrt{k^2+m^2}$ produces the expected spreading; massless limit non-dispersive ✓.
- **Wrong/dubious.** Line 342 declares mostly-plus signature and writes $\Box\equiv\eta^{\mu\nu}\partial_\mu\partial_\nu=-\partial_t^2+\nabla^2$ — algebraically correct **but** the equation $(\Box+m^2)\phi=0$ with this $\Box$ gives $-\partial_t^2\phi+\nabla^2\phi+m^2\phi=0$, opposite to what §1 derived. Line 344's parenthetical "the equation is unchanged either way, since only $\Box+m^2=0$ matters" is **wrong**: flipping the $\Box$ sign convention flips the relative sign of $m^2$. The conventional fix is either (i) write $(-\Box+m^2)\phi=0$ in mostly-plus, or (ii) define $\Box\equiv\eta^{\mu\nu}\partial_\mu\partial_\nu$ (which already changes sign with the metric) and write the equation as $(\Box-m^2)\phi=0$ in mostly-plus / $(\Box+m^2)\phi=0$ in mostly-minus. As written, §1 ($\Box=+\partial_t^2-\nabla^2$, mostly-minus) and §2 ($\Box=-\partial_t^2+\nabla^2$, mostly-plus) do not agree on the sign in front of $m^2$.

## §3 Plane-wave solutions and the dispersion relation (lines 447–567)
- **Verified.** Ansatz $e^{-i(Et-\vec p\cdot\vec x)}$, derivative diagonal action, $E^2=|\vec p|^2+m^2$ ✓. Two branches $E_\pm=\pm\sqrt{p^2+m^2}$ ✓. Non-rel expansion $E\approx m+|\vec p|^2/(2m)$ ✓. Phase velocity $v_\phi=E/|\vec p|>1$ for massive modes; group velocity $v_g=|\vec p|/E<1$ with $v_\phi v_g=1$ ✓. **§3 widget**: hyperbolae plotted with consistent $E_\text{axis}/p_\text{axis}$ scales so light cone $|E|=|p|$ is a true asymptote ✓; mass-gap markers at $\pm m$ ✓; tangent slope = group velocity rendered on positive branch ✓; readout protects $v_\phi$ divergence at $p\to 0$ ✓.
- **Wrong/dubious.** None.

## §4 Negative-energy solutions and antiparticles (lines 569–650)
- **Verified.** Two-dimensional initial-data argument from second-order PDE ✓. Negative-energy plane wave $\phi_-(x)=e^{-i(-E)t+i\vec p\cdot\vec x}=e^{+i(Et-\vec p\cdot\vec x)}$ is the conjugate of a positive-energy plane wave with reversed momentum ✓. Stückelberg–Feynman reinterpretation: positive-energy antiparticle, opposite charge, spectrum bounded by $+m$ ✓. Real-field ⇒ self-conjugate species (e.g. $\pi^0$); complex field ⇒ $U(1)$ distinguishes pair ✓. **§4 widget**: cyan/pink mass shells + arrow flipping between $(+E,+p_x)$ and $(-E,-p_x)$ — both readings consistent with the on-shell hyperboloid ✓.
- **Wrong/dubious.** None.

## §5 Conserved current and the probability problem (lines 652–776)
- **Verified.** $j^\mu=i(\phi^*\partial^\mu\phi-\phi\partial^\mu\phi^*)$, $\partial_\mu j^\mu=0$ ✓. $j^0$ not positive-definite ✓. For $\phi=Ae^{-i(Et-px)}+Be^{+i(Et-px)}$: pure term $j^0\supset 2E(|A|^2-|B|^2)$ verified by direct expansion (with $\phi^*\partial_t\phi$ pure piece $=-iE|A|^2+iE|B|^2$, then $j^0=-2\mathrm{Im}(\phi^*\partial_t\phi)$ gives $2E(|A|^2-|B|^2)$) ✓; oscillatory cross-terms ✓. QFT resolution as charge current (particle minus antiparticle, weighted by $U(1)$) ✓. **§5 widget**: superposes a $+E$ mode at $p_+=1$ with a $-E$ mode at $p_-=-0.4$, $m=1$ at $t=0$. Direct verification: $j^0=-2(\phi_\text{re}\partial_t\phi_\text{im}-\phi_\text{im}\partial_t\phi_\text{re})$ matches $-2\mathrm{Im}(\phi^*\partial_t\phi)$ with the right sign; the negative-energy branch enters with $E_-<0$ correctly inserted into $\partial_t\phi$ ✓. Pink shading flags negative-$j^0$ regions.
- **Wrong/dubious.** None.

## §6 Non-relativistic limit (lines 778–878)
- **Verified.** Phase factorization $\phi=e^{-imc^2t/\hbar}\psi$ ✓. Drop $\hbar^2\partial_t^2\psi$ in non-rel regime ✓. Final result $i\hbar\partial_t\psi=-\frac{\hbar^2}{2m}\nabla^2\psi$ ✓. Negative-energy decoupling argument (counter-rotating phase oscillates at $\sim 2mc^2/\hbar$) ✓. Pionic-atom / Higgs-propagator / FRW-inflaton applications ✓. **§6 widget**: $E_\text{KG}/m=\sqrt{1+(p/m)^2}-1$ vs $E_\text{Schr}/m=\tfrac12(p/m)^2$ ✓; merge at low $p/m$, deviate as $p/m\to 1$.
- **Wrong/dubious.** Line 787 displays $2imc^2\,\partial_t\psi=-\hbar^2c^2\nabla^2\psi-\hbar^2\partial_t^2\psi$ — **missing a factor of $\hbar$ on the LHS**. The correct intermediate equation (after substituting $\phi=e^{-imc^2t/\hbar}\psi$ into $-\hbar^2\partial_t^2\phi+\hbar^2c^2\nabla^2\phi-m^2c^4\phi=0$ and cancelling the rest-energy terms) is $2imc^2\hbar\,\partial_t\psi=-\hbar^2c^2\nabla^2\psi+\hbar^2\partial_t^2\psi$ (or, equivalently, after moving the $\partial_t^2$ term, $2imc^2\hbar\,\partial_t\psi+\hbar^2\partial_t^2\psi=-\hbar^2c^2\nabla^2\psi$ — the page also has the **sign of $\hbar^2\partial_t^2\psi$ flipped** vs the conventional derivation). Dimensional check confirms: $[2imc^2\partial_t\psi]=$ energy·frequency·$\psi$, while $[\hbar^2c^2\nabla^2\psi]=$ energy²·$\psi$ — units mismatch by one factor of $\hbar$. The next line ("divide by $2mc^2$") then somehow yields the dimensionally correct $i\hbar\partial_t\psi=-\frac{\hbar^2}{2m}\nabla^2\psi$, so the typo is confined to the displayed intermediate equation; the boxed final result is correct.

## §7 Connections (lines 880–896)
- **Verified.** Schrödinger / wave-equation / gauge-theory / Riemann-surface bullets are accurate. The "two sheets of a Riemann surface" framing for $E=\pm\sqrt{p^2+m^2}$ ✓.

---

# Quiz bank — `quizzes/klein-gordon-equation.json`

- **`kg-derivation`**: Q1 ✓ (`(\Box+m^2)\phi=0` with $\Box=\partial_t^2-\nabla^2$). Q2 spot-the-error ✓ (square-root form is not KG). Q3 ✓ (order from $E^2$ vs $E$).
- **`kg-equation`**: Q1 ✓ (spin-0 scalar). Q2 multi-select ✓ ([0,1,2]; electrons are Dirac). Q3 ✓ ($\lambda_C=1/m=2.0$ for $m=0.5$, reduced-Compton convention consistent with §2).
- **`kg-plane-waves`**: Q1 ✓ ($\sqrt{4+1}=2.2360\ldots$). Q2 ✓ ($v_\phi>c$, $v_g<c$, $v_\phi v_g=1$). Q3 ordering ✓ ([3,1,2,0]).
- **`kg-negative-energy`**: Q1 ✓ (second-order PDE ⇒ two-dim initial data). Q2 ✓ (Stückelberg reading: positive-energy antiparticle). Q3 multi-select ✓ ([0,1,3]; choice 2 wrongly claims branch is eliminated).
- **`kg-current`**: Q1 ✓ (conserved but not positive-definite). Q2 ✓ (QFT charge-current resolution). Q3 matching ✓ ([1,2,0]).
- **`kg-non-rel-limit`**: Q1 ordering ✓ ([1,2,0,3]). Q2 numeric ✓ ($\sqrt{1.04}-1\approx 0.019804$, $E_S=0.02$, rel.error $\approx 0.98\%\to 1.0\%$). Q3 multi-select ✓ ([0,1,3]).

All 18 v1 quiz questions verified correct. No answer-key inversions.

---

## Underspecified or unverifiable

- **Lagrangian density not given.** The page never writes $\mathcal{L}=\tfrac12(\partial\phi)^2-\tfrac12m^2\phi^2$ (real) or $|\partial\phi|^2-m^2|\phi|^2$ (complex). The Euler–Lagrange route to KG is omitted; only the canonical-quantization route is shown. Not wrong — just not covered.
- **Mass dimension of $\phi$.** $[\phi]=1$ in $d=4$ (so $[\partial\phi]^2$ in $\mathcal{L}$ has dimension 4 = density of action) is not stated. Out of scope as written.
- **Explicit mode expansion.** The page mentions "creation/annihilation operators $a_{\vec p},b_{\vec p}^\dagger$" but never writes $\phi(x)=\int\frac{d^3p}{(2\pi)^3}\frac{1}{\sqrt{2E_p}}(a_p e^{-ipx}+b_p^\dagger e^{+ipx})$. Deferred to the QFT page.
- **Stückelberg reinterpretation widget label** at line 626 reads "p^μ = (−E, −pₓ) ≡ antiparticle (+E, +pₓ) in reverse" — the equivalence is correct but compressed to the point of being hard to parse. Not wrong, just terse.

---

## Severity summary

**Major.** None.

**Moderate.**
- §1↔§2 **convention inconsistency** on $\Box$. §1 uses $\Box=+\partial_t^2-\nabla^2$ (mostly-minus, even though it's labeled "mostly-plus" on line 276). §2 declares mostly-plus signature with $\Box=-\partial_t^2+\nabla^2$, then claims "$(\Box+m^2)\phi=0$ is unchanged either way" — but with the §2 $\Box$, that boxed equation has the wrong sign on $m^2$ relative to §1's derivation. The fix is either to write $(-\Box+m^2)\phi=0$ in mostly-plus, or to keep the $\Box=\eta^{\mu\nu}\partial_\mu\partial_\nu$ definition in §2 but flip the boxed equation to $(\Box-m^2)\phi=0$ (and update Q1 of `kg-derivation` accordingly). The numerical widgets and downstream sections all use the §1 convention, so this is purely a labelling/notation bug, but it shows up twice in the same section.

**Minor.**
- Line 787: intermediate non-rel equation $2imc^2\,\partial_t\psi=-\hbar^2c^2\nabla^2\psi-\hbar^2\partial_t^2\psi$ is missing a factor of $\hbar$ on the LHS, and the sign in front of the $\hbar^2\partial_t^2\psi$ term is flipped relative to a clean derivation. The boxed final Schrödinger equation is correct, so the bug is confined to one display line.
- Line 346: $\lambda_C=\hbar/(mc)=1/m$ is the **reduced** Compton wavelength; conventional Compton wavelength is $h/(mc)=2\pi/m$. Page is internally consistent (matches `kg-equation` Q3 numeric answer 2.0 for $m=0.5$), but a one-word "reduced Compton wavelength" would prevent confusion.

**Wording / pedagogical.**
- "Mostly-plus convention $\partial^\mu\partial_\mu$ on a scalar" on line 276 is the inverse of standard usage and should read "mostly-minus" (or just be deleted, since the operator is shown explicitly).
- §4 widget label dense at line 626 — splitting the two readings onto two text lines would help.

**Patterns / corpus notes.**
- The signature-convention slip in §1–§2 is the kind of error that survives proofreading because each section is internally consistent and the widgets compute the right numbers. It only bites when a careful reader compares the two boxed equations directly.
- All numerical widgets verified against analytic formulas (dispersion hyperbola, group velocity, $j^0$ of two-mode superposition, KG-vs-Schrödinger kinetic-energy comparison). Quiz numerics also verified (Compton wavelength, $\sqrt{5}$ dispersion energy, ~1% kinetic-energy discrepancy at $p/m=0.2$).
- Stückelberg reinterpretation explained correctly and completely; rare in the corpus to see this paired with a direct demonstration that $j^0$ goes negative on a positive+negative superposition (§5 widget makes this concrete and matches the algebra).
