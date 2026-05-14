# surgery-theory — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** cobordism, algebraic-topology

## Summary
Solid, well-paced page: KaTeX usage is conservative, every numbered section has a worked widget, and the geometric/algebraic split signposted in the reader's-note is delivered cleanly. The main pedagogical gap is §4 (surgery exact sequence), which front-loads four overlapping pieces of jargon (`\mathcal{S}(X)`, `\mathcal{N}(X)`, `L_n`, `\sigma`) without first showing the reader what one of them looks like in a small example — and a handful of widget-readout strings emit raw-ASCII math (`Wh(Z/n)`, `Omega_*^O`, `pi_*(MO)`) instead of KaTeX, matching the corpus-wide habit flagged in the cobordism audit.

## Findings

### Notation drift
- **Cosmetic, `O`-superscript style.** The cobordism peer writes `\Omega_*^{O}` (braced) consistently in §1–§3; surgery-theory mostly avoids `\Omega_*^O` and reaches for `\Theta_n` (line 499, 506-510, 523, 529) which is fine, but the §6 connections paragraph mentions "the bordism-ring perspective" without using either notation, so the link to cobordism's `\Omega_*^{SO}` is unstated. Recommend a parenthetical `(\Theta_n \subset \Omega_n^{SO})` when `\Theta_n` is introduced at line 499.
- **Cosmetic, `\mathrm{Wh}` is undeclared.** `\mathrm{Wh}` appears 9× in §3 and §6 (lines 370–406, 554) but is not in the loader macro list (lines 22–29). Cobordism uses the same convention at line 517; consistent corpus-wide, but the surgery page is the natural home to add `'\\Wh':'\\operatorname{Wh}'` to the macro block since it's the most-used here. Same observation for `\mathrm{bP}` (lines 499, 509, 510, 514) — used as if standard but not declared.
- **Cosmetic, `\widetilde` vs `\tilde`.** `\widetilde W`, `\widetilde M`, `\widetilde X` (lines 372, 467) is fine for tall arguments, but `\tilde\gamma` is the algebraic-topology house style (lines 309, 532 in algebraic-topology.html). Different objects, no semantic clash; flagging only because both forms appear in the corpus and a future pass could pick one for tilde'd manifolds vs tilde'd paths.
- **Semantic, `\mathring{D}^{n-k}` at line 277 vs cobordism's `\mathrm{int}\,\varphi(...)` at line 495.** The two pages use different glyphs for "open interior of a disk" in the surgery formula. `\mathring{}` is a perfectly legible LaTeX convention for "open" but the cobordism peer reaches for `\mathrm{int}` and the two formulas are otherwise the same surgery move. Worth aligning if a future pass touches both — pick one.

### Undefined jargon
- **"normal map" / "degree-1 normal map"** at line 419 (`\mathcal{N}(X)` bullet) is used as if defined, but the page never explains what a normal map *is* (a map of manifolds with a bundle map of stable normal bundles covering it). The phrase appears again at line 467 ("A normal map $f\colon M\to X$…") without a callback. First-time readers will be guessing.
- **"plumbing"** at line 424 is bolded as if being defined ("…is by **plumbing**: take a quadratic form's worth of new manifold pieces, glue them onto $X\times[0,1]$") — but this is a sketch, not a definition, and "quadratic form's worth of new manifold pieces" presupposes the plumbing construction (form gives intersection data → use it to glue handles). Same word reappears at line 499 in `bP_{n+1}` ("plumbing-boundary" spheres) without a back-reference. A one-line "plumbing builds a 4k-manifold from a graph labelled by intersection numbers" gloss would close the loop.
- **"stably free $\mathbb{Z}\pi$-modules"** at line 420 — "stably free" is technical and not defined; cobordism peer uses "stably trivial" once and the audit flagged it there too. Same fix: parenthetical or callback.
- **"formation"** at line 420 ("Quadratic forms (in even $n$) or formations (odd $n$)") and line 460 ("self-equivalence of quadratic refinement") and widget readout at line 735 ("Odd-dim formation"). Wall's notion of a formation is jargon you cannot bluff; either define inline or cite.
- **"$G/O$" and "$G/\mathrm{Top}$"** at line 419 — Sullivan's classifying spaces appear with no gloss. Even one parenthetical ("the homotopy fibre of $BO\to BG$") would orient the reader.
- **"Casson handles"** at line 336 (sidebar `<aside class="note">`) — invoked as if known. The cobordism peer's analogous Whitney-trick aside (line 511) does the same thing, but here it lands one section earlier than the dim-4 narrative payoff in §6, so a reader meets the term cold.
- **"degree-1 normal map" + "normal cobordism"** double-bind in §4 — both phrases appear inside the same `\mathcal{N}(X)` bullet (line 419) before either is unpacked.
- **"assembly maps in the Farrell–Jones conjecture"** at line 548 — the Connections paragraph leaves this as a name-drop with no link or gloss. Acceptable in a "connections" outro per house style, but worth a sentence-level pointer.

### Tone mismatches
- **Surgery-theory is more impersonal than its peers.** Zero second-person "you/your" appearances vs 1 in cobordism and 13 in category-theory. The hero sub and §1 prose are fine, but §4 in particular is delivered as a textbook bullet list ("$\mathcal{S}(X)$, the structure set — pairs $(N,h)$ where…") with no narrative entry. Compare cobordism §1's "is $M$ the boundary of something?" framing or algebraic-topology §1's "gelatinous continuous thing" voice. Consider rewriting the §4 bullets as four short paragraphs, each opening with the geometric question the term answers.
- **§5 jumps from definition table straight to Browder's theorem with one bridging paragraph.** Lines 452–469 give the periodicity table, then "Browder's surgery theorem" appears in a green `<div class="ok">` box. The intervening paragraph (line 467) is a single dense sentence introducing `\sigma(f)`, the kernel of `f_*`, mid-dimensional intersection forms, and quadratic refinement all at once. Consider splitting into two sentences or adding a worked mini-example (compute `\sigma` for `f\colon S^4\to S^4` of degree 1).
- **§3's two-paragraph derivation of `\mathrm{Wh}(\pi)`** (lines 370–372) is dense. The first paragraph defines Whitehead torsion, the second explains how the matrices assemble. Cobordism's analogous moment (Thom isomorphism in §3) gets a similar density flag in its own audit; same recommendation: one motivating sentence ("Why mod out by `\pm g`? Because those units come from trivial moves — relabelling generators.") would help.
- **Sidebar `.note` at line 336** ("Why dimension $\ge 5$") is excellent — exactly the conversational moment the page needs more of.

### Missing worked examples
- **§4 (surgery exact sequence) — definition-only.** The widget at lines 426–430 is a click-to-reveal term explorer (`Click any cell.`), not a computation. There is no in-prose example of the sequence acting on a specific `X` (e.g. `S^n` itself, where `\mathcal{S}(S^n) = \Theta_n` mod the smooth Poincaré answer; or `T^n`, where everything is computable). Compare cobordism §6's worked Frobenius-algebra classification or §4's `\sigma(\mathbb{CP}^2) = 1` computation. Even a one-paragraph "for `X = S^n` the sequence collapses to `0\to \Theta_n \to L_n \to 0`" would satisfy.
- **§5 (`L`-theory and Wall obstruction)** — has the periodicity table (lines 454–462) and the periodicity widget, but no worked computation of `\sigma` on a specific normal map. Rokhlin's theorem appears at line 471 as a corollary but not as a worked computation; a "compute the Arf invariant of the Kummer surface kernel" mini-example would anchor the abstraction.
- **§6 has the `\Theta_n` table + widget** — fine. §1, §2, §3 each have at least one in-prose computation.
- **Quiz placeholders are present in every section** — not flagged.

### KaTeX macros / formatting
- **Widget readouts emit raw-ASCII math, not KaTeX.** The §3 Whitehead widget data (lines 656–663) hard-codes strings like `'Wh(Z/5) ≅ Z'` and `'Wh(Z/8) ≅ Z'` into the readout element; same pattern in §4 SES widget (`'L_{n+1}'`, `'S(X)'`, `'N(X)'` at lines 682–685), §5 L-theory widget (line 767: `\`L_${cells[active].n}(Z) = ${cells[active].val}\``), and §6 `\Theta_n` widget (lines 779–791: `'Θ_3 = 0 (Perelman, …)'` etc., using the unicode Θ). Same corpus-wide habit flagged in cobordism's audit; consistent here, not a regression.
- **§2 widget readout pretends to strip `\\(...\\)` delimiters** (line 641: `out.textContent = st.label.replace(/\\\(([^)]*)\\\)/g,'$1');`) but the `stages[].label` strings are written with KaTeX `$..$` delimiters (e.g. `'Cancel one $(k,k{+}1)$ pair via Smale\'s lemma'` at line 612), so the regex never matches and the `$...$` shows up literally in the readout div. The other widgets use `.textContent` for readouts which is fine for ASCII fallback but means none of the math renders inside `<div class="readout">`. This is a real cosmetic bug in the §2 widget specifically.
- **No invented delimiters.** All math uses `$..$` / `$$..$$`; consistent with house style.
- **`\rightsquigarrow`** at line 277 is standard KaTeX; cobordism uses the same arrow at line 532 widget caption (`M ⇝ M'` as unicode). Fine.
- **`\mathcal{S}`, `\mathcal{N}`** (lines 414–424) are introduced cleanly with their meaning before being shorthanded; good.
- **Helper block (lines 194–245)** matches `category-theory.html` verbatim — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all present and identical.
- **Widget chrome** uses `.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.pill`, `.note`, `.ok`, `.bad` — all canonical, no ad-hoc class names spotted.
- **Color tokens** — all SVG paint attrs use `var(--yellow)`, `var(--cyan)`, `var(--violet)`, `var(--pink)`, `var(--green)`, `var(--mute)`, `var(--ink)`, `var(--panel)`, `var(--panel2)`, `var(--line)`. No raw hex spotted in widget bodies.
- **`<title>` elements present** on every SVG (lines 301, 345, 428, 475, 529) — accessibility-clean.
- **`MVQuiz.init('surgery-theory')`** present at lines 827–833; quiz placeholders match section ids.

## Severity
minor polish
