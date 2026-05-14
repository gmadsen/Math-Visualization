# Math correctness pass — `continued-fractions.html`

Scope: page is about CF + Diophantine approximation (Hurwitz, Liouville, Roth, Markoff, Schmidt). Pell / `e = [2;1,2,1,1,4,...]` are not discussed on this page; not in scope.

## Verified claims

### §1 Convergents
- Recurrence `p_n = a_n p_{n-1} + p_{n-2}`, `q_n = a_n q_{n-1} + q_{n-2}` with `p_{-1}=1, p_0=a_0`, `q_{-1}=0, q_0=1` — correct (line 269-270).
- Determinant identity `p_n q_{n-1} - p_{n-1} q_n = (-1)^{n-1}` — correct (line 271).
- Tail formula `α - p_n/q_n = (-1)^n / (q_n(q_{n+1} + q_n β_{n+2}))` with `β_{n+2} ∈ [0,1)` — correct: equivalent to standard `α - p_n/q_n = (-1)^n / (q_n(α_{n+1} q_n + q_{n-1}))` with `α_{n+1} = a_{n+1} + β_{n+2}` (line 271).
- Best approximation of the second kind: `|qα - p| > |q_n α - p_n|` for `0 < q < q_{n+1}`, `p/q ≠ p_n/q_n` — correct (line 274).
- `π = [3;7,15,1,292,1,1,…]`, `a_4 = 292` explains `355/113` — correct (line 276).
- Lagrange (1770): periodic ⟺ real quadratic irrational; `√2 = [1;\overline{2}]`, `√3 = [1;\overline{1,2}]`, `φ = [\overline{1}]` — all correct (line 297).
- `φ` convergents are `F_{n+1}/F_n`; `q_n²|φ - p_n/q_n| → 1/√5` — correct (lines 299, 397).

### §2 Hurwitz
- Hurwitz (1891): infinitely many `p/q` with `|α - p/q| < 1/(√5 q²)`; `√5` sharp, extremal at `φ` — correct (line 392-394).
- Limit `q_n / (q_{n+1} + q_n β_{n+2}) → 1/(φ + 1/φ) = 1/√5` — correct: for `φ`, all `a_i = 1` so `q_{n+1}/q_n → φ` and `β → 1/φ`, giving `1/(φ + 1/φ) = 1/√5` since `φ + 1/φ = φ + (φ-1) = 2φ - 1 = √5` (line 397).
- Worst-approximable irrationals are GL₂(ℤ)-orbit of `φ` (= "noble numbers", tail eventually all 1s) — correct (line 398).

### §3 Liouville
- Liouville inequality `|α - p/q| > C/q^d` for algebraic α of degree d — correct (line 525-526). Two-line proof correct.
- Liouville constant `L = Σ 10^{-k!}`; `|L - L_n| < 2·10^{-(n+1)!} = 2 q_n^{-(n+1)}` with `q_n = 10^{n!}` — correct: `10^{-(n+1)!} = 10^{-(n+1)·n!} = (10^{n!})^{-(n+1)} = q_n^{-(n+1)}` (line 535-536).
- Liouville numbers are comeagre and Lebesgue-null — correct (line 539).

### §4 Roth
- Roth (1955), Fields Medal 1958, exponent `2 + ε` sharp on upper side — correct (lines 608, 612).
- Liouville `d`, Thue `d/2 + 1 + ε`, Siegel `2√d`, Dyson/Gelfond `√(2d)`, Roth `2 + ε`, Schmidt 1972, Baker effective — exponents and dates standard (lines 614-625).
- Ineffectiveness: bound on number, not size, of exceptions — correct (line 627).

### §5 Markoff
- Markoff equation `x² + y² + z² = 3xyz`, Vieta jump `(x,y,z) ↦ (x,y, 3xy - z)` — correct (line 745-747).
- Lagrange values `√(9 - 4/m²)` for m = 1, 2, 5, 13, 29 verified arithmetically: m=5 → √(221/25)=√221/5; m=13 → √(1517/169)=√1517/13; m=29 → √(7565/841)=√7565/29 (line 752-758).
- Markoff (1879): spectrum below 3 is `{√(9 - 4/m²)}`, accumulating at 3 — correct (line 762).
- Hall's ray (Marshall Hall, 1947): spectrum contains a half-line — correct (line 764).
- Frobenius unicity conjecture (1913), still open — correct (line 766).

### §6 p-adic Roth & Schmidt
- Mahler–Ridout `p`-adic Roth — correct (line 844-846).
- S-unit / product form of Roth — correct (line 848-850).
- Schmidt subspace theorem (1972), n=2 case reduces to Roth — correct (lines 852-856).
- Applications listed (S-unit equations, Mordell–Lang for tori) — correct (line 858).

## Wrong / dubious claims

- **continued-fractions.html:764 — Freiman's constant value.** The page states "Freiman (1975) at μ = 2.221···". The actual Freiman constant (the start of Hall's ray in the Lagrange spectrum, equivalently the supremum of the gaps in the spectrum) is **F ≈ 4.52782956616...**, with closed form `F = (2221564096 + 283748·√462) / 491993569`. The "2.221" appears to be the leading digits of the numerator `2221564096`, mistaken for the value itself. The Lagrange spectrum is contained in `[√5, ∞] ⊂ [2.236, ∞)`, so a value `μ = 2.221 < √5 ≈ 2.236` is also internally inconsistent with §5's own definition. Fix: `μ ≈ 4.5278…`.

## Underspecified or unverifiable claims

- **continued-fractions.html:419 — "GL₂(ℤ)-equivalent to φ"**. Standard usage; the equivalence is via `α ~ (aα+b)/(cα+d)` for `[[a,b],[c,d]] ∈ GL₂(ℤ)`. Fine for an advanced page but undefined in-text.
- **continued-fractions.html:620 — Dyson/Gelfond exponent `√(2d)`**. Some sources state Dyson's exponent as `√(2d) + 1`; the page gives `√(2d)`. Both appear in the literature with different conventions; not wrong, just ambiguous.
- **continued-fractions.html:623 — Baker "d - κ(d) for explicit κ"**. Effective Roth-type bounds via Baker's linear-forms-in-logs are real, but the table cell is too compressed to verify a specific κ. Acceptable as a pointer.
- **continued-fractions.html:766 — "simple proof-of-concept of the unicity conjecture"** in the widget description: the widget displays triples but does not prove the unicity conjecture (which is open). The phrasing misleads slightly, but is pedagogy not math; flagged for completeness.

## Severity

**Minor.** One factual error (Freiman constant value, line 764) which is also internally inconsistent with the page's own spectrum definition. All core CF/Hurwitz/Liouville/Roth/Markoff/Schmidt content checks out. Fix is a single-number correction.
