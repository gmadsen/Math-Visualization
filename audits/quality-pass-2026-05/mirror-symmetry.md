# mirror-symmetry — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** calabi-yau-manifolds, donaldson-thomas-and-gw-invariants

## Summary
Strong page, well-structured around the canonical CdGP / quintic story with good widget variety; the only meaningful issues are a handful of jargon terms (BPS counts, virtual fundamental class, brane data, $A_\infty$) used before they're defined and the lack of `<title>` accessibility nodes on every SVG (both references include them).

## Findings
### Notation drift
- Target uses the page's `\Hom` macro at L463 (`\Hom_{\mathrm{Fuk}}`) and L495 (`\Hom(T^3_b, U(1))`) but writes `\dim \Hom^*(\mathcal{O}_x, \mathcal{O}_x)` later in the same section (L471) — consistent with both references' `\operatorname{Hom}` resolution, low priority.
- `\check T^3_b` (L495, L508) and Y-axis label `T̆^3_b` (L1086 in widget JS, with breve) drift between the LaTeX `\check` accent and a precomposed Unicode breve `T̆` in the SVG — same object rendered two ways. Low priority but a reader will notice the visual mismatch.
- Target uses `\widetilde{ … / (\mathbb{Z}/5)^3 }` (L322) for the Greene–Plesser orbifold quotient. References don't show a competing notation here — fine.
- All three pages agree on `\mathbb{Z}`, `\mathbb{Q}`, `\mathbb{P}^n`, `\overline{\mathcal{M}}_{g,n}(X,\beta)`, `c_1(X)`, `H^{p,q}` — no semantic drift on the shared algebraic-geometry vocabulary.
- Target's `D^b\mathrm{Coh}(X) \cong D^\pi \mathrm{Fuk}(Y)` (L459) matches calabi-yau-manifolds' `D^b \mathrm{Coh}(X) \simeq D^\pi \mathrm{Fuk}(Y)` (L850) up to `\cong` vs `\simeq` — cosmetic, both common in the literature, no action needed.

### Undefined jargon
- "BPS counts $n_\beta$" appears in the §3 widget note at L382 ("the integer-valued *BPS counts* $n_\beta$ extract the curve count via $\sum_\beta N_\beta q^\beta = …$") with a formula but no narrative gloss; the donaldson-thomas reference treats this carefully under "Gopakumar–Vafa integrality conjecture" (L788–794). A one-sentence "the BPS counts $n_\beta$ are integer Gopakumar–Vafa invariants extracted from the rational $N_\beta$" would close the gap.
- "virtual fundamental class" used at L370 ("the integral of $1$ over the virtual fundamental class is a number") is the first appearance and is never expanded — calabi-yau-manifolds doesn't define it either, but donaldson-thomas-and-gw-invariants devotes §2 to it. A parenthetical pointer to `donaldson-thomas-and-gw-invariants.html#virtual-class` would help.
- "brane data (orientation, spin structure, grading, local system)" at L461 enumerates four prerequisite concepts in passing; the page never uses any of them again. Either trim the parenthetical or add a one-line gloss for the lay reader.
- "$A_\infty$-categories" at L461 ("triangulated (or more precisely $A_\infty$-) categories") is dropped in passing with no callback. Low priority.
- "monodromy around the conifold and large-volume points" (L430, widget note) introduces "conifold" before the §4 prose first uses it (L417 mentions Picard–Fuchs but the conifold radius only surfaces in widget code at L859). The widget readout at L855 ("Series diverges past the conifold radius") also presupposes the term. Define "conifold point" once before the periods widget.
- "rigid CYs" (L292) is bolded as if a term-of-art; the immediately following clause ("with $h^{2,1} = 0$ have no complex-structure deformations") does the work, so this is borderline — flagging for awareness only.

### Tone mismatches
- Generally on-tone — conversational ("string theorists do at night" register matches Calabi–Yau's hero), worked examples present, second-person addressed via widgets. No drift into dry textbook voice.
- §3 (`A-model: Gromov–Witten invariants`) leans formula-heavy in its first ~100 lines: three displayed equations (L364, L368, L372) and the BPS-counts formula (L382) without a connecting "let's unpack what this means" sentence. References buffer their displayed equations with more narration (calabi-yau-manifolds §4 walks the reader between each display). Add 1–2 prose bridges in §3.
- "five lines of physics-flavoured calculus" (L347) is a nice concrete claim; no issue.

### Missing worked examples
- Every numbered §1–§6 has at least one widget. §7 "Connections" is link-only by template (the references both follow the same pattern), so not a miss.
- §5 "Homological mirror symmetry" widget (`hms-svg`, L465–469) is the only widget on the page that doesn't drive a visible computation — it's a static correspondence table with click-for-text. Consistent with the abstract content, but the readout text is the entire payoff. Low priority; a small "compute Euler pairing" toy would be nice but not mandatory.
- §2 "Quintic prediction" CdGP table is the page's marquee worked example and well-executed — no gap.

### KaTeX macros / formatting
- Macros block (L22–29) is the standard 6-macro set used across the corpus (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`); identical to calabi-yau-manifolds and donaldson-thomas. No new macros invented locally.
- Delimiters: target uses `$…$`, `$$…$$`, `\(…\)`, `\[…\]` only — matches AGENTS.md house rule.
- `\widetilde{…}` (L322) is standard KaTeX. `\check\pi` and `\check T^3_b` (L495) are standard. No re-invented delimiters.
- Numerical formatting `2{,}875` etc. is consistent with calabi-yau-manifolds' L778 — good.
- `\tfrac` used inside display math at L387 (`\tfrac{609{,}250}{8}`) — fine, both references use `\tfrac` similarly.
- Helper block (L187–239) is byte-identical to category-theory.html — verified via diff.

### Helper-block / widget-chrome hygiene
- All six widgets use the canonical `<div class="widget"> > <div class="hd"><div class="ttl">…</div><div class="hint">…</div></div>` chrome. `.row`, `.readout`, `.note` used correctly. No ad-hoc classes.
- `<h2>Connections</h2>` (L537) breaks numbering — references either omit the number consistently (calabi-yau-manifolds also drops it for "Connections") so this matches house style.
- **Accessibility gap**: every `<svg>` widget in the target lacks a `<title>` child element. Both references include `<title>` on every widget SVG (e.g. calabi-yau-manifolds L281 `<title>Adjunction formula visualizer…</title>`, donaldson-thomas L291 `<title>Hilbert scheme limits</title>`). Target SVGs at L287, L381, L428, L467, L504 all have `aria-label` only. Per `node scripts/audit-accessibility.mjs`/`fix-a11y.mjs --fix` conventions in AGENTS.md, both should be present. Medium priority — `fix-a11y --fix` will idempotently backfill.
- All standard scaffolding present: top-nav backlink, sidetoc scaffold, `MVQuiz.init('mirror-symmetry')` footer, callbacks, backlinks, changelog.

## Severity
minor polish

---
*Reminder: orchestrator should run `node scripts/rebuild.mjs` after any content changes.*
