# computability-and-decidability — pedagogical audit (2026-05)

**Section:** Logic & Foundations
**Compared against:** first-order-logic-and-completeness, complexity-theory

## Summary
Strong, well-paced page that matches both peers in voice, structure, and widget cadence. The only meaningful issue is an arithmetical-hierarchy notation flip between §4 and §6 (`\Sigma_1^0` vs `\Sigma_1` for the same idea); everything else is cosmetic.

## Findings

### Notation drift
- **`\Sigma_1^0` (§4 line 729) vs `\Sigma_1` (§6 lines 950, 954, 988, 989, 992) for r.e. predicates.** Same notion, two notations on the same page. Either pick `\Sigma_1^0` (with the lightface superscript-zero) consistently when the arithmetical hierarchy is the framing — as §4 does for `\Pi_2^0` — or drop the superscript everywhere. Suggest standardising on `\Sigma_1^0` / `\Pi_2^0` in §4 and §6, since §4 already commits to the superscripted form for $\Pi_2^0$.
- **§6 widget readout collapses `\Sigma_1` → `Σ₁` but not `\Sigma_1^0`** (line 1030: `.replace(/\\Sigma_1/g,'Σ₁')`). If §6 is renormalised to `\Sigma_1^0`, the readout substitution will need to be widened — currently a latent rendering inconsistency if anyone touches that string.
- **§3 line 594 `H = {⟨M, w⟩ : M halts on input w}` vs §6 line 952 `\mathrm{Halt}(\ulcorner M\urcorner, \ulcorner w\urcorner)`.** Two different notations for the same predicate (angle brackets vs Quine corners) introduced without explicit cross-reference. Not a bug — both are standard — but a one-clause callback ("the halting predicate from §3, now in arithmetic dress") would tie them together.
- All three pages agree on `\mathrm{…}` for fixed-name operators (matches `complexity-theory.html` `\mathrm{DTIME}`, `\mathrm{NSPACE}`, etc.); no drift versus peers there.

### Undefined jargon
- **"many-one degree structure"** appears in the §0 plan note (line 262) but no section actually unpacks degrees — §5 only defines `\le_m`. Either drop "degree structure" from the plan or add a sentence in §5 mentioning that `\equiv_m` cuts r.e. sets into m-degrees with $H$ at the top.
- **"$T$-predicate"** (§4 line 729: "Kleene's $T$-predicate") is name-dropped without a sentence saying what it does. Two-line gloss would help: it's the primitive-recursive predicate that says "$y$ codes a halting computation of TM $e$ on input $x$".
- **"dovetail"** used in §4 (line 731 Post's-theorem proof) and §5 (line 880 Matiyasevich edge text). The §4 use does have an inline gloss; the second is bare. Minor.
- **"recursively axiomatised"** appears in §6 (lines 948, 954) — fine for grad audience and consistent with peer's usage in `first-order-logic-and-completeness.html#decidable`, no fix needed.

### Tone mismatches
- _None._ Voice is conversational-precise, in line with peers. Mini-proofs are sketched in `<div class="ok">`/`<div class="bad">` boxes, body prose has the same "Once you accept X, the natural meta-question is …" cadence as `complexity-theory.html`. Hero subtitle phrasing ("six concepts that fence off the reachable from the unreachable") is a direct echo of complexity-theory's "six concepts that carve the feasible from the infeasible" — intentionally parallel and good.

### Missing worked examples
- _None._ Every numbered section has a working widget: TM increment (§1), recursion-scheme tracer (§2), diagonal table (§3), recursive/r.e. Venn (§4), reduction graph (§5), Gödel encoding tower (§6). Coverage is at least as dense as the peers'.

### KaTeX macros / formatting
- **Unused macro carry-over.** Head declares `\Spec, \Gal, \Hom, \tr, \ad, \ind` (lines 23–28) but none are referenced in this page. These are inherited from the shared head; not wrong, but worth noting that the head block isn't trimmed per topic — same situation in both peers, so this is a corpus-wide convention rather than a target-specific issue.
- **`</p></div>` pattern in §0 plan note** (line 262 ends with `…</p></div>`) — a stray `</p>` inside a `<div class="note">` whose body started without `<p>`. Both peers do the same in their plan notes (`complexity-theory.html` line 262, `first-order-logic-and-completeness.html` line 262), so this is house style; cosmetic only.
- **Ad-hoc unicode in option labels.** §2 widget select uses `$\mathrm{pred}(n)$`, `$\mathrm{add}(m,n)$` in `<option>` labels (lines 471–473), and §1 uses non-LaTeX option text. Page correctly loads `js/katex-select.js` (line 178) so the popup will render — verified, no fix needed.
- No KaTeX macro is locally redefined; no novel delimiter style. `\le_m`, `\ulcorner/\urcorner`, `\mathsf{Q}` all standard and consistent with peer usage.

## Severity
minor polish

