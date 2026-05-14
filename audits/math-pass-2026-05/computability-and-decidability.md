# Math correctness audit — `computability-and-decidability.html`

**Section:** Logic & Foundations
**Audited:** 2026-05-14 (read-only)
**Sources audited:** `computability-and-decidability.html`, `concepts/computability-and-decidability.json`, `quizzes/computability-and-decidability.json`
**Severity overall:** **major errors** — one widget convention bug (Turing-machine increment) + one overstated robustness claim + one missing soundness hypothesis on the first incompleteness theorem statement.

---

## Summary

| # | Locus | Severity | One-line |
|---|---|---|---|
| 1 | §1 TM widget — input labels & TM design | **major** | TM treats inputs MSB-first, but option labels claim LSB-first; results inconsistent with labels. |
| 2 | §1 robustness `<div class="ok">` | **major** | "Multitape, two-counter, …, nondeterministic … all simulate one another with at most polynomial overhead" — false for two-counter (exponential, Minsky) and for NDTM→DTM (exponential / open). |
| 3 | §6 first-incompleteness statement | minor | Stated for "consistent + r.e. axiomatised" but the conclusion (a *true* Σ₁ sentence is unprovable) requires Σ₁-soundness / 1-consistency, not bare consistency. |
| 4 | §6 second-incompleteness scope | minor | "from Con(T) one can derive…" needs T to verify the Hilbert–Bernays–Löb derivability conditions (PA/IΣ₁-strong). The text places second-incompleteness over "T ⊇ Q", which is too weak for the standard derivation. |
| 5 | §5 reduction widget edge H→EMP | minor | "(after one negation, also a reduction)" parenthetical conflates many-one reductions with decidability-preserving reductions; ≤ₘ does not mix with complement so loosely. |
| 6 | §1 TM widget — `q1,_` transition uses move `S` | minor | Move alphabet declared `{L,R}` in the prose; the widget transition table introduces an undeclared `S` (stay) move on `q1,_ → 1,S,qH`. Inconsistent with the model definition given two paragraphs earlier. |
| 7 | §3 diagonal-table widget JS | cosmetic | Dead loop `if((!halts[i][i]) !== (!halts[i][i]))` (always false). Not math; flag during code review. |

Everything else verified correct: Post's theorem (line 731), Rice's theorem statement and proof sketch (line 845), the Π₂⁰-completeness of TM-equivalence and totality (lines 759–760), the recursion-scheme widget (predecessor / add / μy.[y²≥n]), the Diophantine reduction citation (Matiyasevich), the H→EMPTY / H→TOTAL / EMP→EQ constructions, the Σ₁ form of the halting predicate, the Rosser refinement claim, all numeric quiz answers, and all classification claims in the §4 Venn widget.

---

## Detailed findings

### 1. Major — TM increment widget convention contradicts its labels (§1, lines 281–340)

**Claim under audit.** The widget exposes a TM that "increments a binary number written least-significant-bit-first" (prose, line 275) and labels its dropdown options accordingly:

```
<option value="110">110 (= 3, LSB-first)</option>
<option value="111">111 (= 7, LSB-first)</option>
<option value="0111">0111 (= 14)</option>
<option value="1111">1111 (= 15, carries off the end)</option>
```

**Trace.** The transition table (line 317) is

```
q0,0 -> 0,R,q0   ; q0,1 -> 1,R,q0    ; q0,_ -> _,L,q1
q1,0 -> 1,L,q2   ; q1,1 -> 0,L,q1    ; q1,_ -> 1,S,qH    (carry-out off the LEFT end)
q2,0 -> 0,L,q2   ; q2,1 -> 1,L,q2    ; q2,_ -> _,R,qH
```

The carry walks **left**, and the carry-out is written to the **left** of the previous LSB position. That is the algorithm for numbers stored **MSB-first** (LSB on the right, increment from the right). Trace `0111` (head starts on first cell of input):
- q0 walks right past `0,1,1,1` to the blank → q1.
- q1 reads `1` three times, writing `0` each time (positions of the original `111`), still in q1.
- q1 reads `0` (the original leftmost cell) → writes `1`, transitions to q2.
- q2 walks left to a blank, halts.

Final tape over the original input footprint reads `1 0 0 0` (left-to-right). Under the dropdown's stated **LSB-first** convention (leftmost = ones place), this represents `1·1 + 0·2 + 0·4 + 0·8 = 1`, not `15`. Under **MSB-first** (rightmost = ones place), it represents `8 + 0 + 0 + 0 = 8 = 7+1`, which is the correct increment of the MSB-first reading `0111 = 7`.

Likewise the option `110 (= 3, LSB-first)` is wrong on its own terms — `110` LSB-first is `0·1 + 1·2 + 1·4 = 6`, not `3`. The label `= 3` is the MSB-first reading.

**Impact.** Either the labels (and the surrounding prose "least-significant-bit-first") or the TM design (which is MSB-first) is wrong. The simplest fix is to relabel as MSB-first (since standard textbook TM increments are written that way). The widget readout will then agree with the labels.

**Status:** *Major.* The page presents a worked Turing-machine example whose stated semantics disagree with the displayed result.

---

### 2. Major — overstated robustness claim (§1, line 273)

> "Multitape, two-counter, two-stack, RAM, and nondeterministic TMs all simulate one another with at most polynomial overhead. The class of *computable functions* is the same."

The second sentence is correct (all listed models are Turing-equivalent for computability). The first is wrong on two counts:

- **Two-counter machines (Minsky 1961).** Two-counter machines simulate Turing machines, but the standard simulation is **exponential**: a TM tape of `n` cells in alphabet of size `k` is encoded as a single integer `~k^n`, which the counter machine then manipulates. There is no known polynomial simulation; in fact 2-counter machines cannot simulate TMs in polynomial time on natural inputs because the counters can only be incremented/decremented by 1 per step.
- **NDTM ↔ DTM.** NDTMs DO simulate one another polynomially in the deterministic→nondeterministic direction (trivially), but the reverse — DTM simulating NDTM with polynomial overhead — is precisely the **P = NP** question and is widely believed false. The best known deterministic simulation of an NDTM is exponential time.

The other items (multitape ↔ single-tape with O(n²) overhead, RAM ↔ TM polynomial) are correct.

**Status:** *Major.* This is one of the most-reused factoids in the section and is presented in an `<div class="ok">` (definitive) callout. Suggest dropping "two-counter" from the polynomial-equivalence list and qualifying NDTMs as "computability-equivalent (the time overhead in the deterministic direction is the open P vs NP question)".

---

### 3. Minor — first incompleteness theorem misses soundness hypothesis (§6, line 954)

> "**First incompleteness theorem.** If $T$ is consistent and recursively axiomatised, $T$ is incomplete: there is a true $\Sigma_1$ sentence (about halting) that $T$ neither proves nor refutes."

The conclusion "a **true** Σ₁ sentence is unprovable in T" requires T to be **Σ₁-sound** (equivalently 1-consistent), not merely consistent. Bare consistency is enough only for Rosser's variant, whose unprovable sentence is Π₁ (not Σ₁).

The "halting bridge" argument that immediately follows ("if T proved every true halting fact and refuted every false one, we could decide halting") implicitly assumes soundness for both directions of the proof-search decider — exactly the missing hypothesis.

The Rosser callout at line 958 acknowledges that ω-consistency is needed for Gödel's *original* proof, but the theorem statement above it conflates the two regimes and over-claims under "consistent" alone.

**Suggested fix:** state as "If T is sound (or just Σ₁-sound) and recursively axiomatised, …" or add "assuming T is sound" as an italicised hypothesis. Alternatively, weaken the conclusion to "there is a sentence that T neither proves nor refutes" (without the "true Σ₁" descriptor) — that statement does follow from consistency via Rosser.

---

### 4. Minor — second incompleteness theorem placed over Q rather than PA (§6, line 960)

> "The **second incompleteness theorem** formalises the first inside $T$: from $\mathrm{Con}(T)$ one can derive (within $T$) the unprovability of the Gödel sentence $G$ …"

Earlier at line 948 the page fixes T as "extending Robinson arithmetic Q". The second incompleteness theorem in its standard form requires T to verify the **Hilbert–Bernays–Löb derivability conditions** (D1: $T \vdash \varphi \Rightarrow T \vdash \mathrm{Prov}_T(\ulcorner\varphi\urcorner)$; D2: $T \vdash \mathrm{Prov}_T(\ulcorner\varphi\to\psi\urcorner) \to (\mathrm{Prov}_T(\ulcorner\varphi\urcorner)\to\mathrm{Prov}_T(\ulcorner\psi\urcorner))$; D3: $T \vdash \mathrm{Prov}_T(\ulcorner\varphi\urcorner)\to\mathrm{Prov}_T(\ulcorner\mathrm{Prov}_T(\ulcorner\varphi\urcorner)\urcorner)$). Q is too weak for D3 — verification of D3 needs at least IΣ₁ / PA. So second-incompleteness over T = Q in the literal sense fails (Q does not prove Con(Q) is consistent with Q for trivial reasons of weakness, but the Hilbert–Bernays argument is not available there).

This is a routine textbook caveat and the page would be cleaner with a parenthetical "(needs T at least as strong as PA / IΣ₁)" attached to the second theorem.

---

### 5. Minor — H→EMPTY reduction parenthetical (§5, line 876)

> "So $\langle M,w\rangle\in H \iff \langle M_w\rangle\notin\mathrm{EMPTY}$ — a reduction from $H$ to $\mathrm{EMPTY}$ (after one negation, also a reduction)."

The construction yields $H \le_m \overline{\mathrm{EMPTY}}$ (= NONEMPTY), not directly $H \le_m \mathrm{EMPTY}$. Many-one reductions are *not* invertible under complement of either side — what is true is

$$A \le_m B \iff \overline A \le_m \overline B,$$

so the same `f` reduces $\overline H \le_m \mathrm{EMPTY}$. EMPTY's undecidability follows because if EMPTY were decidable then $\overline{\mathrm{EMPTY}}$ would be decidable and hence H would be decidable — but that's a *decidability* argument, not a clean "(after one negation, also a reduction)".

**Suggested fix:** "(EMPTY itself is undecidable: a decider for EMPTY would, by complementing, decide NONEMPTY and hence H.)"

---

### 6. Minor — undeclared `S` (stay) move in TM widget (§1, line 327)

The model definition at line 269 declares the move alphabet as `{L, R}`:

$$\delta\colon Q\times \Gamma \to Q\times\Gamma\times\{L,R\}$$

The widget's transition table (line 327) uses

```
'q1,_': ['1','S','qH'],   // ran off the left end -> write a new leading 1
```

i.e. an `S` (stay-in-place) move that the model does not include. The widget's `step()` function silently treats `'S'` as a no-op for head movement, which works, but the TM as given is not consistent with the formal definition stated two paragraphs earlier. Either include `S` in the move alphabet (a common variant) or rewrite the carry-off transition as `(_, R, qH)` after first writing.

---

### 7. Cosmetic — dead/incorrect comparison in diagonal widget JS (line 703)

```js
let mismatch = -1;
for(let i=0;i<N;i++){ if((!halts[i][i]) !== (!halts[i][i])) {} }
```

`(!x) !== (!x)` is identically false, so the loop body never executes and `mismatch` is unused. This is a code-review item, not a math error; the rendered readout still says the right thing. Flag for a future code-cleanup pass.

---

## Items verified correct (spot list)

- **Configuration triple** (state, tape, head) — line 271 and quiz `comp-turing-machines` Q1.
- **Multitape O(n²) simulation** — quiz `comp-turing-machines` Q2 ("quadratic overhead, but still computable").
- **Transition-function size 4×3 = 12** — quiz `comp-turing-machines` Q3.
- **Partial-recursive class generators** (zero, S, projections; composition, primitive recursion, μ) — line 447–460. The note that PR is total and that adding μ gives partiality and matches Turing-computability is correct.
- **Ackermann is total, computable, not primitive-recursive** — line 462. Correct.
- **Predecessor / addition / μy.[y²≥n]** widget traces — lines 491–525. All three computations check out arithmetically; `Math.ceil(Math.sqrt(n))` equals the least y with y²≥n for nonnegative integer n.
- **Halting problem statement & proof** — lines 593–603. Standard.
- **r.e. ⟺ Σ₁⁰ ⟺ "TM halts exactly on inputs in A" ⟺ "range of partial computable function" ⟺ Kleene T-predicate witness ∃y T(e,x,y)** — line 729. All four characterisations are equivalent and correctly listed.
- **Post's theorem** (A recursive iff A and ℕ\A are r.e.) — line 731.
- **H is r.e., not recursive; ̄H is not r.e.** — line 733. Correct.
- **§4 Venn classifications:**
  - finite, primes, DFA-emptiness — recursive ✓
  - H, TM-nonemptiness — r.e. \ recursive ✓ (Rice for nonemptiness)
  - $\overline H$, TM-emptiness — co-r.e. \ recursive ✓
  - TM-equivalence — Π₂⁰ (in fact Π₂⁰-complete) ✓
  - Totality — Π₂⁰ (in fact Π₂⁰-complete) ✓
- **Many-one reduction definition** (line 841): correct. (Implicit "total computable" — standard convention.)
- **Rice's theorem** (line 845) and its proof sketch via the `M'` construction running M on w then M₀ on x: textbook-standard. ✓
- **§5 reduction edges** — H→EMPTY (modulo §5 caveat above), H→TOTAL, EMPTY→EQ, H→PCP (Post 1946), H→HILBERT-10 (Matiyasevich 1970): all correct.
- **Σ₁ form of Halt predicate** — line 952. Correct (inner predicate is Δ₀ / primitive recursive).
- **Rosser's refinement** — line 958. Correctly attributes consistency-strength relaxation.
- **Quiz `comp-recursive-functions` Q3** — f(0)=2, f(n+1)=f(n)+3, f(4) = 14. ✓
- **Quiz `comp-rec-vs-re` Q1** — Post characterisation. ✓
- **Quiz `comp-undecidability` Q3** — H ≤ₘ B ⟹ B undecidable; nothing sharper deducible. ✓
- **Quiz `comp-godel-incompleteness` Q3** — second-incompleteness statement (correct as stated for "T extending enough arithmetic"; this is more careful than the body text at line 948–960).

---

## Recommendations (priority order)

1. **(major)** Fix the TM-increment widget — relabel options as MSB-first (or rewrite the TM to actually be LSB-first by walking right after finding the start). The current widget produces values inconsistent with its own labels.
2. **(major)** Trim the polynomial-equivalence list at line 273: drop two-counter machines, qualify NDTMs.
3. **(minor)** Add a soundness (or Σ₁-soundness / 1-consistency) hypothesis to the first-incompleteness statement at line 954, OR weaken the conclusion to drop "true Σ₁".
4. **(minor)** Add "(needs T at least IΣ₁ / PA-strong)" parenthetical to the second-incompleteness paragraph at line 960.
5. **(minor)** Rewrite the H→EMPTY reduction parenthetical at line 876 to make the complement step explicit as a decidability argument rather than a many-one reduction.
6. **(minor)** Either add `S` to the formal move alphabet at line 269 or replace the `S` move at line 327.
7. **(cosmetic)** Delete the dead `mismatch` loop at line 703.
