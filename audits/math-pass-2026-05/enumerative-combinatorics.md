# Math correctness audit — `enumerative-combinatorics.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.

## Verified claims

### §1 Binomials, multinomials, stars-and-bars (lines 263–296)
- $\binom{n}{k} = n!/(k!(n-k)!)$, symmetry, falling-factorial form, Pascal's recurrence — all standard.
- Multinomial formula and MISSISSIPPI count: $11!/(1!\,4!\,4!\,2!) = 34650$ — verified (1+4+4+2=11; 39916800/1152=34650).
- Stars-and-bars: weak compositions of $n$ into $r$ parts = $\binom{n+r-1}{r-1}$. Example $n{=}4, r{=}3 \Rightarrow \binom{6}{2}=15$ ✓.
- Pascal-triangle widget `binom(n,k)` is the correct multiplicative recurrence with `Math.round` to absorb FP drift.

### §2 Inclusion–exclusion (lines 393–412)
- Both forms of PIE stated correctly (standard convention $\bigcap_{i\in\emptyset}A_i = U$).
- One-line proof via $(1-1)^{|T(x)|}$ — correct.
- Derangement derivation $D_n = n!\sum_{k=0}^n (-1)^k/k!$, limit $1/e$, sequence $0,1,2,9,44,265$ ✓ (OEIS A000166).
- Venn widget region formulas $|A\text{ only}| = |A| - |A\cap B| - |A\cap C| + |A\cap B\cap C|$, $|AB\text{ only}| = |A\cap B| - |A\cap B\cap C|$ — correct.

### §3 Generating functions / Catalan (lines 493–518)
- OGF/EGF definitions, Catalan recurrence $C_{n+1}=\sum C_k C_{n-k}$, functional equation $C(x)-1 = x\,C(x)^2$, closed form $C(x)=(1-\sqrt{1-4x})/(2x)$, $C_n = \frac{1}{n+1}\binom{2n}{n}$ — all standard and correct.
- Sequence $1,1,2,5,14,42$ ✓ (OEIS A000108).

### §4 Permutation statistics (lines 642–665)
- $q$-factorial identity $\sum_\sigma q^{\inv(\sigma)} = [n]_q! = \prod (1-q^k)/(1-q)$ — correct.
- Worpitzky $x^n = \sum_k \langle{n\atop k}\rangle \binom{x+k}{n}$ — correct standard form.
- Signless Stirling-1st-kind identity: $x(x{+}1)\cdots(x{+}n{-}1) = \sum c(n,k)\,x^k$ (rising factorial), $\sum_k c(n,k) = n!$ — correct.
- Widget's `inversions`, `descents`, `cycles` functions match definitions.

### §5 Partitions (lines 788–829)
- $p(n)$ values $1,1,2,3,5,7,11,15$ ✓ (OEIS A000041).
- Hardy–Ramanujan asymptotic $p(n) \sim \frac{1}{4n\sqrt{3}}e^{\pi\sqrt{2n/3}}$ — correct (matches A000041 documentation).
- Euler product $\sum p(n)q^n = \prod 1/(1-q^k)$ — correct.
- Conjugation bijection — correct.
- Rogers–Ramanujan first identity (parts differ by ≥2 ↔ parts $\equiv \pm 1 \pmod 5$); Garsia–Milne (1981) bijective proof attribution — correct.

### §6 Bijections (lines 943–978)
- Dyck-path / triangulation Catalan equality — correct.
- RSK; restricted to $S_n$ giving $n! = \sum_{\lambda\vdash n}(f^\lambda)^2$; Schensted theorem on longest increasing subsequence — all correct.
- Catalan-bijection widget: `dyckWords(3)=5`, `dyckWords(4)=14` ✓; `dyckToTriangulation` split logic (with the documented `i <= w.length` fix) is sound.

## Wrong / dubious claims

### Fibonacci coefficient extractor — off by one for $n \ge 2$ (line 557)
Function `fib(n)`:
```js
function fib(n){ if(n<=0) return 0; let a=1, b=1; for(let i=2;i<=n;i++){ const c=a+b; a=b; b=c; } return n===1?1:b; }
```
The widget series $x/(1-x-x^2) = \sum F_n x^n$ is labelled "$F_1=F_2=1$", so coefficients should be $0,1,1,2,3,5,8,13,21,34,55$ (A000045). The function returns $0,1,2,3,5,8,13,21,34,55,89$ — i.e. `fib(2)=2`, `fib(3)=3`, … each shifted up by one index. The widget claims $[x^2]\,x/(1{-}x{-}x^2) = 2$ but the true value is $1$. Every Fibonacci readout for $n\ge 2$ is wrong.
Fix: `if(n<=1) return n;` then return `b` for $n\ge 2$ (or initialize `a=0, b=1`).
**Severity: moderate** — wrong numeric output in a labelled "Fibonacci" coefficient cell.

### `rectangle()` button mislabelled (lines 889–901)
`rectangle(5)=[3,2]`, `rectangle(7)=[4,3]` are not rectangles. The button is documented as a preset to "rectangle", but for $n\in\{5,7\}$ (and in spirit $n\in\{8\}$ which returns 4+4, fine) the partition is not rectangular. The choices $[2,2], [3,3], [4,4], [3,3,3], [5,5]$ are rectangles. The "rectangle for any n" framing is loose rather than mathematically false; pedagogically it's a UI mislabel rather than a math error.
**Severity: minor** — cosmetic mislabel only; the partition is still a valid Young diagram.

### Default permutation input (line 671)
`value="3 1 4 1 5 9 2 6"` is not a permutation (1 appears twice; missing 7, 8); the widget loads displaying "Not a valid permutation". Not a wrong mathematical claim but the on-load state shows an error, hiding the worked example. Probably an unintentional digits-of-π reference rather than a permutation.
**Severity: minor** — UX, not math.

## Underspecified or unverifiable claims

- "there are at least 200 known Catalan-counted families" (line 947): Stanley's *Catalan Numbers* (2015) catalogues 214; the order-of-magnitude is right, the exact figure isn't pinned down.
- The Catalan widget's polygon-vertex layout uses `angle = -π/2 + 2πk/N + π` (line 1083). The +π duplicates the −π/2 rotation; the comment "place vertex 0 at the bottom-right and 1 at the bottom-left so the base edge 0..1 is at the bottom" suggests the intent. Not a math error but the comment-vs-code pairing is slightly off (the math output — diagonals — is correct regardless of polygon rotation).
- "Generating-function methods (Wilf's "snake oil", saturation)" (line 1155): "saturation" is non-standard terminology in this context — could mean "saturation of WZ-style hypergeometric identities" or be a slip for "summation". Reader-facing verbiage, not a wrong claim.

## Severity

**Minor.** One genuine numerical bug (Fibonacci off-by-one in §3 widget) is the only mathematical error; all prose claims, formulas, named identities (Catalan, Pascal, multinomial, stars-and-bars, PIE, derangements, Worpitzky, Stirling, Hardy–Ramanujan, Euler product, Rogers–Ramanujan, RSK, hook-length-adjacent identity $n! = \sum (f^\lambda)^2$) are correct. The §1, §2, §4, §5, §6 prose passes cleanly; §3 widget needs the `fib` fix.
