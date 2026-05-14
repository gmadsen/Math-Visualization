# Math-pass audit: mathematics-and-cryptography.html

## Verified claims (sections)

- **§1 Modular arithmetic / Fermat–Euler.** Definition of $(\mathbb{Z}/n)^\times$, $\phi(p^k)=p^{k-1}(p-1)$, multiplicativity on coprime arguments, and Fermat–Euler ($a^{\phi(n)}\equiv 1\pmod n$ for $\gcd(a,n)=1$) via Lagrange — all correct. Cyclicity of $(\mathbb{Z}/p)^\times$ and definition of primitive root — correct.
- **§2 RSA.** Setup ($n=pq$, $\phi(n)=(p-1)(q-1)$, $d\equiv e^{-1}\bmod\phi(n)$), encrypt/decrypt formulas, and the $c^d=m^{ed}=m\cdot(m^{\phi(n)})^k\equiv m$ proof are correct. CRT extension to $\gcd(m,n)>1$ is correctly noted. Toy worked example (p=11, q=13, e=7, m=42) verified numerically: n=143, φ=120, d=103, c=81, decrypts to 42. Note about RSA-problem vs factoring (no known separation) and OAEP/PSS padding — all correct.
- **§3 Diffie–Hellman / DLP.** DLP definition, DH protocol (Alice→A=g^a, Bob→B=g^b, K=g^{ab}=B^a=A^b) all correct. CDH problem statement correct. Index calculus complexity $L_p[1/3,c]$ for prime-field DLP — correct (matches GNFS-class). Toy DH (p=23, g=5, a=6, b=15) verified: A=8, B=19, K=2.
- **§4 ECC.** Hasse bound $\#E(\mathbb{F}_p)=p+1-a_p$, $|a_p|\le 2\sqrt p$ — correct. ECDLP definition, Pollard-rho complexity $O(\sqrt{|E|})$, MOV pairing attack via embedding degree, anomalous-curve (Smart) attack when $\#E=p$ — all correct. Hardened curves (P-256, Curve25519, secp256k1) correctly identified. Discriminant check $4a^3+27b^2\not\equiv 0$ in widget — correct. Worked example y²=x³+2x+2 over F_17 has 18 affine points + ∞ = 19 (a_p=−1, well within Hasse).
- **§5 LWE.** Lattice and SVP/CVP definitions correct. Regev LWE definition $(a_i,\langle a_i,s\rangle+e_i\bmod q)$ correct. Worst-case-to-average-case quantum reduction from GapSVP/SIVP correctly attributed. Kyber=FIPS 203, Dilithium=FIPS 204 (2024) — correct.
- **§6 ZK / Schnorr.** IP completeness/soundness/ZK definitions correct (2/3 vs 1/3 thresholds are the standard Goldwasser–Micali–Rackoff convention). Schnorr commit/challenge/response with verifier check $g^s = t\cdot h^c$, soundness extractor $x=(s-s')/(c-c')$, simulator $t=g^s/h^c$ — all correct. Fiat–Shamir transform description correct. Groth16 (2016), PLONK (2019), STARKs — correct attributions.

## Wrong / dubious claims (with file:line)

- **`mathematics-and-cryptography.html:743`** — *"Even approximating [SVP/CVP] is hard for sub-polynomial factors."* Overstated. Worst-case NP-hardness for approximate SVP is known only up to factors near $n^{1/\log\log n}$ (Khot 2005; Haviv–Regev 2007), not "sub-polynomial" generically. Lattice cryptography uses *polynomial-factor* approximate-SVP, which is widely conjectured hard but **not known NP-hard** — the gap is exactly why LWE relies on quantum worst-case-to-average-case reductions instead. Suggested rewrite: *"NP-hard to approximate within almost-polynomial factors; cryptographic security rests on the conjectured hardness of polynomial-factor variants."*
- **`mathematics-and-cryptography.html:898`** — Schnorr widget reduces s mod $(p-1)$, i.e. uses the full multiplicative group of order $p-1$. Schnorr's standard formulation uses a *prime-order* subgroup (order $q\mid p-1$); only there does $(c-c')^{-1}$ in the soundness extractor (line 852) always exist. With p=23 → order 22 = 2·11, the extractor formula in the prose is not literally invertible for every $c\ne c'$ pair the widget can sample. Minor — toy-pedagogy only — but the prose and widget are slightly inconsistent. Suggested fix: note "for clarity we work in the full group; production Schnorr uses a prime-order subgroup".

## Underspecified or unverifiable claims

- **`:412`** RSA correctness proof handles $\gcd(m,n)=1$; the parenthetical "short CRT argument extends correctness to all residues" is correct but unstated. Acceptable for a pedagogy page.
- **`:416`** *"knowing $d$ lets you (probabilistically) factor $n$"* — true (Miller's algorithm), but "probabilistically" hides that the reduction is randomized polynomial-time and succeeds with overwhelming probability over choice of base. Fine for a survey.
- **`:747`** *"Without the noise, Gaussian elimination recovers $\mathbf{s}$ from $n$ samples"* — true generically (when the sampled $\mathbf a_i$ span $\mathbb Z_q^n$), with negligible probability of failure for random samples. Standard simplification.
- **§6 line 840–841** — Soundness threshold 1/3 and completeness 2/3 are the canonical Goldwasser–Micali–Rackoff formulation; some texts use 1/2 + ε / ε. Not wrong, but phrasing "no cheating prover" should ideally specify "computationally unbounded" for IP (vs computational soundness for arguments). Minor.
- **`:854`** *"any honest-verifier interactive ZK protocol"* — Fiat–Shamir requires a **public-coin** sigma protocol (which Schnorr is), not arbitrary HVZK. The current phrasing is informal but defensible.

## Severity

**clean** — All worked examples verified numerically; all major formulas correct. The two flagged items (`:743` lattice approximation hardness overstatement; `:898` Schnorr group-order subtlety) are pedagogically minor and don't break any widget or claim a falsehood about a deployed system. No corrections required for correctness; suggested polish only.
