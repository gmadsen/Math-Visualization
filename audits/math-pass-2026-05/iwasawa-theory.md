# iwasawa-theory.html — math-correctness pass

## Verified claims

**§1 Cyclotomic Z_p-extension**
- Tower $K = K_0 \subset K_1 \subset \cdots$ with $\Gal(K_n/K) \cong \mathbb{Z}/p^n$ and $\Gamma = \Gal(K_\infty/K) \cong \mathbb{Z}_p$ — correct (line 267–268).
- $\Gal(\mathbb{Q}(\zeta_{p^\infty})/\mathbb{Q}) \cong \mathbb{Z}_p^\times$ — standard (line 271).
- For odd $p$, splitting $\mathbb{Z}_p^\times \cong \mathbb{Z}/(p-1) \times \mathbb{Z}_p$ and the cyclotomic $\mathbb{Z}_p$-extension as fixed field of torsion — correct (line 272).
- $p=2$ case: $\mathbb{Q}_\infty = \mathbb{Q}(\zeta_{2^\infty})^+$ — correct ($\mathbb{Z}_2^\times \cong \{\pm 1\} \times (1+4\mathbb{Z}_2)$, fixed field of $\{\pm 1\}$ is the totally real subfield).
- Iwasawa growth formula $|A_n| = p^{\mu p^n + \lambda n + \nu}$ with $\mu, \lambda \ge 0$ integers, $\nu \in \mathbb{Z}$, holds for $n \gg 0$ — correct (line 275).
- Number of independent $\mathbb{Z}_p$-extensions of $K$ is $r_2(K) + 1 + \delta$ with Leopoldt defect $\delta$, conjecturally $0$ — correct (line 361).

**§2 Iwasawa algebra**
- $\Lambda = \mathbb{Z}_p[[\Gamma]] = \varprojlim \mathbb{Z}_p[\Gamma/\Gamma^{p^n}]$ — correct (line 383).
- Serre identification $\gamma \mapsto 1+T$ giving $\Lambda \cong \mathbb{Z}_p[[T]]$, regular local Noetherian, Krull dim 2, max ideal $(p,T)$ — correct (line 387–388).
- Weierstrass preparation $f = p^\mu \cdot u(T) \cdot P(T)$ with $u \in \Lambda^\times$ and $P$ distinguished — correct (line 390).
- Structure theorem (pseudo-isomorphism to $\Lambda^r \oplus \bigoplus \Lambda/(p^{a_i}) \oplus \bigoplus \Lambda/(f_j^{m_j})$) — correct (line 393–394).
- Characteristic ideal $\big(p^{\sum a_i} \prod f_j^{m_j}\big)$ defined for torsion modules — correct.

**§3 Class groups along the tower**
- $X_\infty = \varprojlim A_n$ via norm maps; $\Lambda$-action by continuity — correct.
- Iwasawa (1959): $X_\infty$ finitely generated as $\Lambda$-module — correct.
- Ferrero–Washington (1979): $\mu = 0$ for cyclotomic $\mathbb{Z}_p$-extension of any abelian number field — correct.
- Coinvariants computation: $|\Lambda/(p^a, T^{p^n}-1)| = p^{a p^n}$ — correct (the ideal $(1+T)^{p^n}-1$ also gives degree-$p^n$ polynomial; same count).
- Each $\Lambda/(f^m)$ summand with $f$ distinguished of degree $d$ contributes $dm \cdot n$ to $\log_p|A_n|$ eventually — correct (standard Iwasawa lemma).
- $\Gamma$-coinvariants $X_\infty/(\gamma-1)X_\infty \to A_0 = A$ — correct (with bounded error in general, exact for cyclotomic case under standard hypotheses).

**§4 p-adic L-functions**
- Kubota–Leopoldt interpolation $L_p(1-n,\chi) = (1 - \chi\omega^{-n}(p) p^{n-1}) L(1-n, \chi\omega^{-n})$ — correct (line 576).
- Teichmüller character $\omega: (\mathbb{Z}/p)^\times \to \mathbb{Z}_p^\times$ as unique character lifting identity on residues — correct.
- Kummer congruence: for $n \equiv m \pmod{(p-1)p^{k-1}}$ and $(p-1) \nmid n$, $(1-p^{n-1})\zeta(1-n)/n \equiv (1-p^{m-1})\zeta(1-m)/m \pmod{p^k}$ — correct (line 582).
- $\zeta(1-n) = -B_n/n$ — correct.
- Mahler-theorem packaging $L_p(s,\chi) = L_p(\chi, \langle\kappa\rangle^s - 1)$ via Iwasawa power series in $\Lambda \otimes \mathbb{Q}_p$ — correct (line 681).
- Bernoulli table values at $n=2..30$ — spot-checked $B_{12} = -691/2730$, $B_{16} = -3617/510$ — correct.

**§5 Main conjecture**
- Statement char$_\Lambda(X_\infty(\chi)) = (L_p(\chi^{-1}\omega, T))$ for odd $\chi$ — correct (standard convention; the twist by $\omega$ lines up parities) (line 715).
- Mazur–Wiles (1984) for abelian over $\mathbb{Q}$, Wiles (1990) for totally real — correct attributions.
- Strategy via Eisenstein congruences with cusp forms producing unramified extensions — correct historical sketch.
- Herbrand's theorem and Ribet converse — correct (line 726).

**§6 Elliptic Iwasawa & BSD**
- Selmer group definition via $\ker(H^1(K_n, E[p^\infty]) \to \prod_v H^1(K_{n,v}, E))$ — correct (line 779).
- $X_E = (\varinjlim \mathrm{Sel}_{p^\infty})^\vee$ Pontryagin dual carries $\Lambda$-action — correct.
- Mazur control theorem (1972) for good ordinary $p$ — correct.
- Coates–Wiles (1977): CM by $\mathcal{O}_K$ imag. quad. of class number 1 + $L(E,1) \ne 0$ ⇒ $E(\mathbb{Q})$ finite; class-number-1 hypothesis later removed by Arthaud / Coates–Goldstein / Rubin — correct.
- Kato Euler system gives char$_\Lambda(X_E) \mid (L_p(E,T))$ for modular $E/\mathbb{Q}$ — correct.
- Skinner–Urban (2014) via $\mathrm{GU}(2,2)$ Eisenstein congruences for converse divisibility — correct.
- Rubin (1991) CM main conjecture — correct.
- Widget logic for "what's proved": CM/non-CM × ord/ss/mult × analytic rank — all branches consistent with the literature.

## Wrong / dubious claims

**§3 line 490 — Λ-torsionness of $X_\infty$ misattributed.** The page says
> "$X_\infty$ is also $\Lambda$-torsion is conjectural in general; it follows for abelian $K/\mathbb{Q}$ from Ferrero–Washington (1979) plus Iwasawa's class-number bounds, and was proved for totally real $K$ by Wiles (1990)."

For the **cyclotomic** $\mathbb{Z}_p$-extension of *any* number field $K$, $X_\infty$ being $\Lambda$-torsion is an unconditional theorem of Iwasawa (proof via the ramified-prime-counting argument; no need for Ferrero–Washington or Wiles). What is conjectural is (a) torsionness for non-cyclotomic $\mathbb{Z}_p$-extensions (Greenberg's generalized conjecture), and (b) the vanishing $\mu = 0$ for non-abelian base fields. The page conflates "$X_\infty$ torsion" with "$\mu = 0$" or with non-cyclotomic settings. Wiles 1990 proved the *main conjecture* for totally real fields, which presupposes torsionness; the underlying torsionness for the cyclotomic tower is not what Wiles supplied.

## Underspecified or unverifiable claims

- §5 line 724–726 specialization "Send $T \to 0$ ... $\#A_0(\chi) \doteq L_p(0, \chi^{-1}\omega) \doteq -\tfrac{1}{n} B_{n,\chi^{-1}\omega}$ at the appropriate twist" — the symbol $\doteq$ and "appropriate twist" are unspecified; the page is using $\doteq$ to hide a $p$-adic-unit ambiguity and an index relabeling. Morally correct but a careful reader cannot reconstruct the precise formula.
- §6 widget message "Kato in the supersingular case requires Pollack/Sprung ± L_p" — Kato's Euler system itself works in the supersingular case; what fails is the relation to a single $L_p$, which is why Pollack–Sprung's $\pm$-decomposition is needed. The widget phrasing elides this distinction but is not strictly wrong.
- §4 line 681 "Iwasawa power series $L_p(\chi, T) \in \Lambda \otimes \mathbb{Q}_p$" — for $\chi$ of conductor coprime to $p$ and non-trivial, $L_p(\chi, T) \in \Lambda$ (no tensoring needed); the $\otimes \mathbb{Q}_p$ is needed for the trivial character (the pole at $s=1$). The page over-generalizes by always tensoring, which is harmless but imprecise.

## Severity

**Minor.** One genuine misattribution (§3, $\Lambda$-torsionness of $X_\infty$ for cyclotomic tower is unconditional, not requiring FW or Wiles), plus two precision issues in §4/§6 widget commentary. No widget computation is mathematically wrong; all major theorems (Kubota–Leopoldt, Mazur–Wiles, Wiles, Mazur control, Coates–Wiles, Kato, Skinner–Urban, Rubin, Ferrero–Washington) are stated correctly with correct attributions and dates. Bernoulli table is accurate. Structure theorem and Λ-algebra setup are textbook-correct.
