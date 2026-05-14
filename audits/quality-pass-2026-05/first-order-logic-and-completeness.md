# first-order-logic-and-completeness — pedagogical audit (2026-05)

**Section:** Logic & Foundations
**Compared against:** naive-set-theory, model-theory-basics

## Summary
The page is in strong shape — eight numbered sections, a worked widget in every concept section, and a Brilliant-style payoff arc (syntax → semantics → completeness → consequences). The single substantive issue is a sibling-page semantic notation drift: this page calls a first-order language `\mathcal{L}`, while `model-theory-basics.html` calls the same object `\sigma` (a "signature"). Everything else is minor polish.

## Findings
### Notation drift
- **Semantic, sibling-page:** `\mathcal{L}` (FOL, 9 occurrences, e.g. §1 "A first-order language $\mathcal{L}$ is a triple…") vs `\sigma` (model-theory-basics, 9 occurrences, e.g. §1 "A signature (or language) $\sigma$ is a list…"). Same notion, two symbols, no cross-bridge — a reader stepping from FOL into model theory has to re-key. Suggest one of: (a) add a parenthetical "(also called a signature; sometimes written $\sigma$)" in FOL §1, or (b) have model-theory-basics §1 echo back "(equivalently $\mathcal{L}$ in the FOL page)".
- **Cosmetic:** ad-hoc `(\mathrm{K})`, `(\mathrm{S})`, `(\mathrm{N})`, `(\forall\mathrm{I})` axiom-scheme labels in §3 use `\mathrm{}` for typesetting an opaque scheme name. Acceptable but unusual; `\text{}` or just plain ASCII would read the same and is more idiomatic for non-operator labels. Low priority.
- **Cosmetic:** §6 widget caption writes `R^M` (HTML), `\mathbb{R}^M` (display KaTeX), and `R^M` (SVG `<text>`) for the same object across the section (line 1172, line 1181 `<div class="hint">`, line 1216 SVG `lt2.textContent`). The SVG case is unavoidable (no KaTeX in `<text>`), but the inline-prose-vs-widget-hint mix could pick one form for consistency.

### Undefined jargon
- §7 line 1438 (Connections, "Computability and incompleteness"): "Decidable theories (**presburger**, dense linear orders) live one layer below." Presburger arithmetic has not appeared anywhere on the page and is not capitalized. Suggest "Presburger arithmetic, dense linear orders" with a 1-clause gloss, or drop it.
- §7 §1294 introduces "**recursively axiomatised**" inside the headline definition box (`<div class="ok">`) without prior definition; the next paragraph then uses "**recursively enumerable**" (line 904, in §4) — the page assumes both. A one-line gloss ("an algorithm can list the axioms") in the §7 box would land cleanly. Low priority since most readers will know.
- §7 line 1313: the `<div class="bad">` counter-example mentions "**Tarski's undefinability theorem**" with zero further context; for a Brilliant-style page this either deserves a sentence ("truth in arithmetic isn't itself arithmetically definable") or a callback link.

### Tone mismatches
_None._ The voice tracks both peers: conversational definition boxes, "the keystone is…" / "the headline theorem of first-order logic" framing, and worked widgets after every concept block. The §4 "Why this matters" note and §7 "thunderclap"-style §6 of model-theory-basics are stylistically aligned. The §1 "the austerity is exactly what makes the meta-theorems of §2–§7 possible" sentence is one of the better tone moments on the whole page.

### Missing worked examples
- §8 (Connections) is pure prose with no widget — but this is correct and matches what model-theory-basics does at the end of §6. Not a finding.
- Every numbered concept section §1–§7 has both a definition block and an interactive widget. No section is definition-only.
- Mild gap: the §3 modus-ponens widget is propositional only (the page acknowledges this in the lead-in), and the page never demonstrates a full first-order proof — even a 3-step example using `\forall I` or generalisation would close a small "I see soundness, I see completeness, but I never see an actual proof" loop. Low priority.

### KaTeX macros / formatting
- No locally-defined macros. The page uses only the six head-block macros (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) inherited verbatim from category-theory.html, and none of them are actually invoked here — the macro block is dead weight on this page but matches the corpus convention so leaving it is fine.
- All KaTeX delimiters are the four house-standard ones (`$…$`, `$$…$$`, `\(…\)`, `\[…\]`); no invented delimiters.
- Standard `\operatorname{Th}` would be cleaner than the bare `\mathrm{Th}` used at line 1005 (`\mathrm{Th}(\mathbb{N})`) and 1313 (`\mathrm{Th}(\mathbb{N},+,\cdot,0,1)`), since `Th(...)` is acting as an operator. naive-set-theory and model-theory-basics also use `\mathrm{Th}` (model-theory line 516), so this is corpus-wide rather than page-local — flagging for consistency, not as a regression.
- `\mathfrak{A}` for structures is consistent with model-theory-basics (both pages use `\mathfrak{A},\mathfrak{B}`); good cross-page agreement.

## Severity
minor polish
