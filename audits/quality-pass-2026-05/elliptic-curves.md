# elliptic-curves — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** bezout, singular-cubics-reduction

## Summary
A strong, ambitious page that earns the "four faces" framing it sets up: each section ships a real interactive widget, and the prose voice is largely on-tone with the section peers. The main pedagogical drag is undefined-jargon front-loading in §3–§4 (CM, supersingular, Tate module, Selmer group, Pic^0, twists) where named objects appear without even a one-clause gloss; secondary drift is a `\bar k` vs `\overline{k}` cosmetic split with bezout, and §7 ("Connections") going wholly link-list with no demonstration.

## Findings

### Notation drift
- `\bar k` throughout elliptic-curves (e.g. line 272 "three distinct roots (over $\bar k$)") vs `\overline{k}` in bezout (e.g. line 309 "Counting intersections means counting solutions in $\overline{k}^{\,2}$"). singular-cubics-reduction sides with elliptic-curves (`\bar k`). Cosmetic — pick one and apply across the AG section. Recommend `\overline{k}` since bezout is the entry-point page.
- elliptic-curves writes `\bar E / \mathbb{F}_p` (line 773) and `\tilde E_p` is the convention in singular-cubics-reduction (line 526). Same object, two glyphs in pages that explicitly cross-reference each other; semantic mild-drift.
- `\#E(\mathbb{F}_p)` (elliptic-curves §3, line 774) vs `|\tilde E(\mathbb{F}_p)|` (singular-cubics-reduction §7, line 859). Both are standard but inconsistent in adjacent pages of the same arc. Pick one.
- elliptic-curves uses `\mathrm{tors}` inside `E(K)_{\text{tors}}` (line 1289) via `\text{}`, while the surrounding pages don't introduce torsion subscripts; minor, just flag if a section-wide subscript convention is wanted.

### Undefined jargon
- "**CM**" first appears at §3 line 941: "Here the curve has CM by $\mathbb{Z}[\omega]$ and $p = 7$ is split." No prior definition, no callback, no parenthetical. Same paragraph (line 942) uses "supersingular-like symptom for CM curves" before §3 has actually defined supersingular either. Even just "(complex multiplication — the endomorphism ring is larger than $\mathbb{Z}$; defined in §5)" would close the loop.
- "**supersingular** locus" / "**ordinary** locus" introduced in §3 line 945 with definitional in-line parenthetical ($a_p = 0$ in characteristic $p$) but the prose then says "supersingular curves have nontrivial endomorphism rings (orders in quaternion algebras)" — "endomorphism ring" is being assumed, and "orders in quaternion algebras" is dropped without comment. First-time reader cannot land here.
- "**Tate module**" appears in §3 line 781 ("$\alpha$ is the eigenvalue of Frobenius on the Tate module $T_\ell E$") with no definition; the actual definition arrives only in §7 line 1391, four sections later. Either forward-reference explicitly ("Tate module — defined in §7") or move the definition forward.
- "$\operatorname{Pic}^0(E)$" introduced in §2 line 387 in the associativity discussion, then explained one paragraph later in the divisor-theoretic note — that is fine, but the *first* sentence containing it ("the map $E \to \operatorname{Pic}^0(E)$ … is a bijection") still hits a reader without warning. A two-word "(the Picard group of degree-zero divisor classes)" inline gloss would help.
- "**twists**" / "$H^1(\Gal(\bar k / k), \operatorname{Aut}(E))$" in §4 line 959 — Galois cohomology dropped onto a reader with no callback. Even bezout's much harder material ("local ring", "ideal", "elimination theory") is consistently glossed in-prose. Compare bezout §3 line 380 which spends a sentence defining $\mathcal{O}_{\mathbb{A}^2,P}$ before using it.
- "**Selmer group**" §6 line 1297 — appears mid-paragraph as "The cokernel is the *Selmer group*, a subtle finite-dimensional $\mathbb{F}_n$-vector space" — for a reader who has never seen Galois cohomology this is the entire definition. Acceptable as sketch, but a sentence saying *what* the Selmer group obstructs (lifting local solubility to global) would carry the reader.
- "**Néron–Tate height**" / "$\hat h$" §6 line 1297 — quadratic-form-modulo-torsion is a one-clause description of an already heavy object; either drop the construction-detail or add the standard parenthetical "(canonical height; sums of local contributions)".
- "**$j = \infty$ corresponds to the nodal cubic at the cusp of the stack**" (§4 line 962) uses "stack" / "cusp of the stack" / "Deligne–Mumford" all in one parenthetical with no scaffolding. The reader who knows this doesn't need the page; the reader who doesn't can't decode it. Compare singular-cubics-reduction §1 line 215 which introduces $\mathbb{G}_m$ / $\mathbb{G}_a$ in the hero with the "multiplicative group" / "additive group" gloss attached.

### Tone mismatches
- §1's bullet "These four views are not isomorphic categories — they are four lenses on the same object" (line 288) is the kind of one-liner the section peers reach for; tone is fine.
- §3 line 945 "are the backbone of modern isogeny-based cryptography" lands as a casual aside in a paragraph that hasn't defined isogeny (first use in §5 line 1058). Reads like a forward-reference shrug rather than a payoff. bezout's analogue ("Bezout enables elliptic-curve arithmetic" §9) is more disciplined — every claim references a section.
- §4 line 1034 "the near-integer $e^{\pi\sqrt{163}} \approx 640320^3 + 744$ made famous by Ramanujan" is great pedagogy and exactly the conversational-but-precise voice category-theory.html sets — keep.
- §5 line 1242 widget caption "what matters is the *shape* of the resulting cubic" is the right narration discipline; the surrounding widget readout discloses its truncation parameters openly. Good.
- §6 line 1311 "the largest known rank over $\mathbb{Q}$ is $\ge 29$ (Elkies, 2024)" — concrete, dated, on tone.
- §7 (Connections) drifts into a textbook "Further reading" cadence with no demonstration; the four subsections are exposition + outbound link only. Compare bezout §9 "Applications and forward references" which still threads concrete claims (e.g., "$|E[n]| = n^2$ over $\overline{\mathbb{Q}}$") between the link spans. elliptic-curves §7 reads as a closing essay, not a closing demo.

### Missing worked examples
- §6 (Mordell's theorem) has the "Rank & torsion gallery" widget, which is essentially a curve-fact lookup table — not an interactive computation. It does carry the famous $y^2=x^3+877x$ generator out, which is concrete and good. But there is no widget where the reader can *exercise* the torsion classification (e.g., pick a small prime, see which Mazur-list group $E(\mathbb{F}_p)$ falls into, watch the residue stabilize across primes). Acceptable but thin compared to §3, which has a real point-counter.
- §7 (Connections) has no widget and no worked computation. The peer pages also use a connections/applications closer, but bezout §9 still embeds explicit Chow-ring computations in prose; elliptic-curves §7 has none. Adding even a tiny "Conductor lookup" or "Tate-module action on a small example" toy would balance the section grade.

### KaTeX macros / formatting
- All three pages declare an identical macro set in the renderer config (`\Spec, \Gal, \Hom, \tr, \ad, \ind`). elliptic-curves obeys the contract; no locally-defined macros appear. Good.
- `\operatorname{Pic}^0`, `\operatorname{Aut}`, `\operatorname{char}`, `\operatorname{Im}`, `\operatorname{ord}`, `\operatorname{SL}_2`, `\operatorname{GL}_2` are all spelled out via `\operatorname{}` rather than added as page macros — consistent with category-theory.html convention; flag only if you want a section-wide `\Pic` macro for terseness.
- §4 line 968 "Famous $j$-values" table mixes "$\mathbb{Z}[\omega]$, CM by $\mathbb{Q}(\sqrt{-3})$" in one cell and bare "CM by $\mathbb{Q}(\sqrt{-7})$" in another (no endomorphism ring named) — minor inconsistency in the column.
- Widget readouts in §1 ("Discriminant watch") and §3 ($E(\mathbb{F}_p)$ scatter) emit raw plaintext like "Delta = -16(4a^3 + 27 b^2)" and "|a_p| ≤ 2√p". Consistent with how bezout / singular-cubics-reduction render readouts — both use plaintext math in the `.readout` panes (`pre-wrap`, monospace). No drift.
- The §5 lattice widget uses a registry-backed `MVLatticeVisualizer` (line 1266), placed at the *end* of the section after the inline `<svg id="lat-svg">` widget — readers see two parallel "lattice → curve" toys back-to-back. Not a notation issue but the second widget's purpose isn't narrated, so it reads as redundant. Either narrate the difference or drop one.

## Severity
minor polish
