# Math correctness audit — `wavelets.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

---

## §1 Multiresolution analysis (lines 261–296)
- **Verified.** Mallat MRA axioms (nesting $V_j\subset V_{j+1}$, density $\overline{\bigcup V_j}=L^2$, separation $\bigcap V_j=\{0\}$, dyadic dilation $f(x)\in V_j\iff f(2x)\in V_{j+1}$, scaling-function ON basis of $V_0$) — all standard. $L^2(\mathbb{R})=\bigoplus_j W_j$ with $W_j=V_{j+1}\ominus V_j$ ✓. ON basis $\psi_{j,k}=2^{j/2}\psi(2^j x-k)$ ✓. **§1 widget**: Haar projection of $e^{-(x-0.5)^2/0.05}$ at scale $2^{-j}$, $\|f-P_j f\|_2\to 0$ as $j\to\infty$ ✓.
- **Wrong/dubious.** None.
- **Severity.** None.

## §2 Haar wavelet (lines 298–336)
- **Verified.** $\phi=\chi_{[0,1)}$, $\psi=\chi_{[0,1/2)}-\chi_{[1/2,1)}$ ✓. ON basis $\{\psi_{j,k}\}$ of $L^2(\mathbb{R})$ ✓ (Haar 1909). One vanishing moment: $\int\psi=0$ but $\int x\psi=-1/4\neq 0$ ✓. **§2 widget**: support $[k/2^j,(k+1)/2^j]$, amplitude $\pm 2^{j/2}$ ✓; coefficient computed by midpoint quadrature.
- **Wrong/dubious.** None.
- **Severity.** None.

## §3 Daubechies wavelets (lines 339–374)
- **Verified.** Refinement equation $\phi(x)=\sqrt 2\sum_n h_n\phi(2x-n)$ ✓. $\mathrm{db}N$ has $2N$ taps, $\operatorname{supp}\psi=[0,2N-1]$, $N$ vanishing moments ✓ (Daubechies 1988). QMF identity $|m_0(\xi)|^2+|m_0(\xi+1/2)|^2=1$ with $m_0(\xi)=\frac{1}{\sqrt2}\sum h_n e^{-2\pi in\xi}$ ✓ (using cycle-frequency convention, period 1; the $1/2$ shift = π in angular convention). Spectral-factorisation polynomial $P(y)=\sum_{k=0}^{N-1}\binom{N-1+k}{k}y^k$ ✓.
- **§3 widget**: db1–db4 filter coefficients verified bit-for-bit against $(1\pm\sqrt 3)/(4\sqrt 2),\ (3\pm\sqrt 3)/(4\sqrt 2)$ for db2; sum$=\sqrt 2$, $\sum h_n^2=1$ ✓. Hölder-regularity values db2≈0.55, db3≈1.09, db4≈1.62 match Daubechies' analytic values ✓. Cascade algorithm for $\phi$ via iterated upsample-and-convolve, mirror filter $g_n=(-1)^n h_{L-1-n}$ ✓.
- **Wrong/dubious.** None.
- **Severity.** None.

## §4 Discrete wavelet transform (lines 377–405)
- **Verified.** Mallat pyramid: $a_j[k]=\sum_n h[n-2k]a_{j+1}[n]$, $d_j[k]=\sum_n g[n-2k]a_{j+1}[n]$ ✓. After $\log_2 n$ levels: $1$ scalar plus $n-1$ details ✓. Cost $L\cdot n + Ln/2 + \cdots = 2Ln=O(n)$ ✓ — strictly better than FFT's $O(n\log n)$. Inverse: upsample, dual-filter convolve, sum; for orthonormal wavelets the dual filters are time-reversed analysis filters ✓. **§4 widget**: orthonormal Haar step $A=(a+b)/\sqrt 2,\ D=(a-b)/\sqrt 2$; energy preservation $\|a\|^2+\|d\|^2=\|\text{prev}\|^2$ ✓ (Parseval).
- **Wrong/dubious.** None.
- **Severity.** None.

## §5 Time–frequency localisation (lines 408–440)
- **Verified.** Wavelet atom: $\Delta x\sim 2^{-j}$, $\Delta\xi\sim 2^j$ ✓. Vanishing-moment decay $|\langle f,\psi_{j,k}\rangle|=O(2^{-j(N+1/2)})$ for $f\in C^N$ near $2^{-j}k$ — Taylor remainder $\cdot 2^{-jN}\cdot$ support-width $2^{-j}\cdot$ amplitude $2^{j/2}$ ✓. **§5 widget**: dyadic tiling at scale $j$ has $2^j$ tiles of width $2^{-j}$ in time and bandwidth $\sim 2^j$ ✓; Gabor uniform tiling for contrast.
- **Underspecified.** "Saturating the Heisenberg inequality $\Delta x\,\Delta\xi\gtrsim 1$" is loose for the Haar atom specifically — Haar has discontinuities, so $\hat\psi(\xi)\sim 1/|\xi|$ and frequency variance $\int\xi^2|\hat\psi|^2$ is infinite. The "$\gtrsim$" reads as order-of-magnitude only, which is defensible; tight saturation is a Meyer / smooth-Daubechies property, not a Haar one. Pedagogical shorthand.
- **Severity.** None.

## §6 Applications (lines 443–473)
- **Verified.** JPEG2000 uses CDF 9/7 biorthogonal DWT (lossy) and CDF 5/3 (lossless) ✓. Donoho–Johnstone soft threshold $\hat c=\operatorname{sgn}(c)(|c|-\lambda)_+$ with universal $\lambda=\sigma\sqrt{2\log n}$ ✓; orthogonality of DWT preserves white-Gaussian noise structure ✓; asymptotic minimaxity over Besov balls ✓. Beylkin–Coifman–Rokhlin CZ-matrix decay $|\langle T\psi_{j,k},\psi_{j',k'}\rangle|\lesssim 2^{-(N+1)|j-j'|}(1+|2^j k-2^{j'}k'|)^{-N-1}$ — standard form (variants with $N+1/2$ also appear in the literature; both are correct for ON wavelets with $N$ vanishing moments) ✓. **§6 denoiser widget**: full Haar DWT, soft threshold all detail levels, inverse DWT, RMS report; universal-threshold formula matches code ✓.
- **Wrong/dubious.** None.
- **Severity.** None.

## §7 Lifting scheme (lines 476–674)
- **Verified.** Forward step: $d_n=s_n^{(o)}-P(s^{(e)})_n$, $a_n=s_n^{(e)}+U(d)_n$; inverse $s^{(e)}=a-U(d)$, $s^{(o)}=d+P(s^{(e)})$ ✓ (triangular, automatically invertible). Haar from lazy + predict $P(s^{(e)})_n=s_n^{(e)}$ + update $U(d)_n=d_n/2$ gives $a_n=(s_{2n}+s_{2n+1})/2$, $d_n=s_{2n+1}-s_{2n}$ ✓; $\sqrt 2$-rescaling recovers orthonormal Haar ✓. JPEG2000 5/3 lossless lifting $d_n=s_{2n+1}-\lfloor(s_{2n}+s_{2n+2})/2\rfloor$, $a_n=s_{2n}+\lfloor(d_{n-1}+d_n+2)/4\rfloor$ — matches the JPEG2000 standard ✓. Daubechies–Sweldens factorization (every FIR PR pair = lifting steps) ✓. Cubic-Lagrange weights $(-1,9,9,-1)/16$ for midpoint interpolation in the CDF 9/7 predictor ✓. **§7 widget** signal $(4,8,3,5,9,1,6,2)$: evens $(4,3,9,6)$, odds $(8,5,1,2)$, $d=(4,2,-8,-4)$, $a=(6,4,5,4)$ — verified.
- **Wrong/dubious.** None.
- **Severity.** None.

## §8 Biorthogonal wavelets / CDF 9/7 (lines 677–817)
- **Verified.** Daubechies' theorem: only orthogonal compactly-supported real symmetric wavelet is Haar ✓. Biorthogonality $\langle\tilde\phi(\cdot-k),\phi(\cdot-\ell)\rangle=\delta_{k\ell}$ etc. ✓. PR identity $m_0\overline{\tilde m_0}+(\xi\to\xi+1/2)=1$ ✓. CDF 9/7 (Cohen–Daubechies–Feauveau 1992): analysis low-pass length 9, synthesis length 7; both symmetric (linear-phase); $\tilde N=N=4$ vanishing moments each ✓ — JPEG2000 lossy + FBI fingerprint codec ✓. Lifting form has 4 lifting steps + scaling ✓. **§8 widget** filter values: db4 matches Daubechies' db4 to high precision ✓. CDF 9/7 page values are exactly $\sqrt 2\cdot$ (standard JPEG2000 unit-sum CDF 9/7 coefficients) — sum $=\sqrt 2$, internally consistent with the page's $\sqrt 2$-normalised db4 ✓. CDF 5/3 page values $\tilde h=(-1/8,1/4,3/4,1/4,-1/8),\ h=(1/4,1/2,1/4)$: both symmetric, both sum to 1, biorthogonality $\sum_n\tilde h[n]h[n-2k]=\frac12\delta_{k,0}$ — this is the "sum-to-1" CDF 5/3 normalisation (PyWavelets `bior2.2` convention; pairs with the rescaled synthesis $h=(1/2,1,1/2)$ for unit biorthogonality). The page is upfront that it just "plots the filter taps as listed"; the visualised stems are the standard tabulated CDF 5/3 values ✓.
- **Wrong/dubious.** None.
- **Severity.** None.

## §Connections decay widget (lines 820–989)
- **Verified.** Haar has $M=1$ vanishing moment ⇒ achievable slope of $\log_2|d_{j,k}|$ vs $j$ is $\min(\alpha+1/2, M+1/2)=\min(\alpha+1/2, 1.5)$ ✓; widget caps the predicted slope at $1.5$ for the smooth-bump case and flags the saturation in the readout — exactly the right pedagogy and exactly the right cap. Step at $1/\pi$ (off all dyadic grids) ⇒ slope $1/2$ ✓; Lipschitz kink ⇒ slope $3/2$ ✓ (matches the Haar limit, hence the "lin" default).
- **Severity.** None.

---

# Quiz bank — `quizzes/wavelets.json`

- **`w-multiresolution`**: Q1 ✓ (finite-dimensionality is the non-axiom; $\dim V_0=\aleph_0$). Q2 ✓ ($W_0$ = span of integer translates of $\psi$). Q3 ✓ ($\int\chi_{[0,1)}=1$).
- **`w-haar-wavelet`**: Q1 ✓ ($\int_0^{1/2}x-\int_{1/2}^1 x = 1/8-3/8=-1/4$). Q2 ✓ (Haar is discontinuous — the false claim). Q3 ✓ (1 vanishing moment).
- **`w-daubechies`**: Q1 ✓ ($\int x^k\psi=0,\ k<N$). Q2 ✓ ($\operatorname{supp}=[0,2N-1]$). Q3 ✓ (QMF $\Leftrightarrow$ ON integer translates via Poisson + refinement).
- **`w-discrete-transform`**: Q1 ✓ ($(8-2)/\sqrt 2 = 3\sqrt 2 \approx 4.243$, matches widget convention $D[k]=(a_{2k}-a_{2k+1})/\sqrt 2$). Q2 ✓ ($O(n)$). Q3 ✓ (upsample + dual filter + sum).
- **`w-wavelet-vs-fourier`**: Q1 ✓ ($\Delta x\sim 2^{-j},\Delta\xi\sim 2^j$). Q2 ✓ (singularities — Fourier shines on stationary/bandlimited). Q3 ✓ ($O(2^{-j(N+1/2)})$).
- **`w-lifting-scheme`**: Q1 ✓ ($a_1=4+\tfrac12(2)=5$). Q2 ordering ✓ (split → predict → update → output). Q3 ✓ (lifting does NOT diagonalise CZ — only nearly).
- **`w-biorthogonal`**: Q1 ✓ (linear phase via symmetry, Haar exception). Q2 multi-select ✓ — correctly excludes "ON basis" and "Parseval equality" (Riesz-basis norm equivalence only). Q3 ✓ (analysis moments → compression, synthesis moments → reconstruction smoothness; CDF 9/7 picks $\tilde N=N=4$).
- **`w-applications`**: Q1 ✓ (block artefacts $\to$ smooth degradation). Q2 ✓ (orthogonal change of basis for white noise). Q3 ✓ (BCR sparsity, not exact diagonalisation).

---

## Severity summary

**Major:** None.

**Minor:** None.

**Wording / pedagogical:**
- §5 "saturates the Heisenberg inequality $\Delta x\,\Delta\xi\gtrsim 1$" applied to all $\psi_{j,k}$. Strictly, Haar has infinite frequency variance (jump discontinuities ⇒ $\hat\psi\sim 1/|\xi|$); only smooth wavelets (Meyer, smooth Daubechies) saturate Heisenberg in the proper $L^2$ variance sense. The "$\gtrsim$" disclaims tightness, so the statement reads correctly as an order-of-magnitude claim. Nothing to fix.

**Patterns / corpus notes:**
- Mathematical exposition is unusually tight throughout — definitions, theorems, asymptotics, filter coefficients, biorthogonality conditions all standard and bit-for-bit accurate where numerics appear. The CDF 9/7 and db1–db4 coefficients verified against canonical sources. The smoothness-vs-vanishing-moments saturation widget correctly caps the Haar slope at $M+1/2=1.5$ and flags the cap — a level of pedagogical precision rare in this corpus.
- Meyer wavelet not covered on this page (audit prompt mentioned it but page scope is Haar / Daubechies / CDF only). Not a gap — the page's scope is consistent with its title and applications focus.
- Three sign / normalisation conventions handled cleanly: (1) cycle-frequency vs angular-frequency in QMF, (2) $\sqrt 2$-normalised vs unit-sum filter coefficients in CDF 9/7, (3) JPEG2000 5/3 lossless integer lifting form. All three are standard choices and the page is internally consistent.
- All 24 v1 quiz questions verified correct. No answer-key bugs — contrast with most other audits in this batch where answer-key inversion was the dominant failure mode.
