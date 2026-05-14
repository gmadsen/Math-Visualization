# vertex-operator-algebras — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** moonshine, modular-curves

## Summary
The page is well-structured, the six widgets all have computational payloads, and the helper block / KaTeX macros / widget chrome match the section peers. Concrete polish needed: a duplicate `<aside class="callback">` in §1, a notation drift on `V^\natural` vs the moonshine peer's `V^{\natural}`, a few UK spellings against the corpus's US default, and a cluster of physics/CFT jargon (OPE, Goddard–Thorn, Verlinde, Casimir, fusion rules, geometric Satake, modular tensor category) introduced without definitions or callbacks.

## Findings
### Notation drift
- `V^\natural` (unbraced) is used 13× throughout vertex-operator-algebras (e.g. §3 line 514 `c = 24` for the moonshine module $V^\natural$; §5 table line 625; §5 widget line 632), while moonshine uses `V^{\natural}` (braced) 17× consistently (§3 line 444, §4 line 540, §5 line 652). Both render the same, but the paired pages should pick one form. Recommend the braced moonshine form since it dominates by count and avoids the next-token-attaches-to-superscript trap (e.g. `V^\natural_n` is a parser landmine even when KaTeX tolerates it).
- `\mathrm{ch}` is hand-spelled inline at line 538 / 624 / 595 etc. Moonshine uses `\chi_V(\tau)` at line 1111. Both are fine, but pick a convention for "graded character of a VOA" — the page mixes `\mathrm{ch}_M` and `\chi` style across §4 and the §6 zoo widget (which prints "Character: ch = 1/eta(tau)" in plain text).
- `\mathrm{Vir}(p,q)` is introduced inline (line 595 and §6 widget option) without a `\Vir` macro and without prior context — the symbol has not appeared anywhere on the page before. moonshine spells out "Virasoro" rather than abbreviating.
- UK/US spelling drift inside the topic: "generalised" at line 681 immediately precedes a callback that says "generalized Kac–Moody and replication" at line 687; "axiomatise" at §6 line 704. moonshine is consistently US ("generalized" 12 hits); modular-curves has none. Pick US to match the corpus.
- `2D` vs `2d` vs "two-dimensional" — line 255 hero says "two-dimensional"; line 704 says "2D CFT"; line 1113 of moonshine says "$2$d conformal field theory". Cosmetic, but the §6 opening switches forms within a single page.

### Undefined jargon
- "OPE" (operator product expansion) appears in widget 2's locality node desc text ("a finite-order pole on the diagonal — the OPE") at line 391 with no expansion of the acronym anywhere on the page.
- "Goddard uniqueness theorem" cited at §2 line 374 ("equivalent to locality + weak associativity (the Goddard uniqueness theorem)") with no definition or callback.
- "rational and $C_2$-cofinite" appears in §4 opener line 537 — the page concedes it is "technical jargon" but never defines either term and there is no callback to a page that does.
- "Casimir of the Virasoro vacuum representation" (§4 line 539) — Casimir element is undefined, no link to lie-algebras or representation-theory anchors.
- "Verlinde formula" (§4 line 545) and "fusion-rule data" / "fusion rules" (§4 line 545, §6 callback line 788) — both cited as the payoff of the $S$-matrix without any definition or callback. moonshine uses neither term.
- "Wess–Zumino–Witten model" appears in the §6 zoo widget readout for the affine Kac–Moody construction with no definition.
- "Goddard–Thorn no-ghost theorem" first appears in §5's dense closing paragraph (line 681) with one parenthetical clause and no callback. moonshine line 662 introduces the same theorem with a string-theory gloss inside a §5 layered-proof structure that is much easier to read.
- "geometric Satake" (§6 line 782, end of last paragraph) — referenced as if known.
- "modular tensor category" (§6 callback line 788) — name-drop without definition or link.
- "Hall divisor" / "Atkin–Lehner involution" — §6 doesn't introduce these but the page does freely use Γ₀(N), Γ₀(p)+, Hauptmodul before §5 — these are introduced in moonshine §1 and §4 but a VOA reader who hasn't read moonshine first sees `\Gamma_0(p)+` / "Hauptmodul" at §4–§5 without having met them. The hero `Prerequisites` note links to modular-forms but not to moonshine for these specific terms (the §5 callback to moonshine#borcherds does help retroactively).
- "graded VOA whose graded dimension is exactly $J(\tau)$" (§5 line 629) — "graded dimension" hasn't been defined at this point on the page; it is defined later in §6 via the zoo widget. Moonshine §3 introduces "graded dimension" explicitly before using it.

### Tone mismatches
- §5 closing paragraph (line 681) is one ~80-word sentence packing Monster Lie algebra, generalised Kac–Moody, rank-2 Lorentzian-lattice VOA, Goddard–Thorn no-ghost, denominator identity, recursion. Compare to moonshine §5, which breaks the same content into three labeled `<h3>` "Layer 1/2/3" sub-sections with one widget per layer. The VOA page punts the most interesting machinery to a single sentence, which reads as a textbook footnote rather than a 3Blue1Brown-style narration.
- §6 second paragraph (lines 706–708) introduces $\mathcal{D}_X$-modules, the chiral product diagram, $j_*j^*$, $\Delta_*$ in three lines without prose buildup. This is the "formulas-without-narration wall" the audit rubric calls out. The peer pages always prose-frame the first appearance of each object.
- Otherwise the tone matches peers — second-person imperatives in widget hints ("drag the slider…", "pick a Monster conjugacy class") and conversational prose in the body paragraphs.

### Missing worked examples
- All six sections have a widget. The weakest is **Widget 6 ("VOA construction zoo")**: it is a glossary picker — selecting an entry just shows static text describing input data, central charge, and a paragraph of detail. There is no computation, no slider, no "poke the toy" payoff. Compare to moonshine's Widget 4 (Thompson series with concrete trace tables that fall out of the choice) and modular-curves' Widget 5 (genus formula evaluating $g(X_0(N))$ live as $N$ slides). A first-pass upgrade: when "Affine Kac–Moody" is selected let the user enter $k$ and read off $c = k\dim\mathfrak g/(k+h^\vee)$ for several Lie types; when "Lattice VOA" is selected let them pick a known lattice and read $c$ off; when "Virasoro minimal model" is selected let them set $(p,q)$ and read off $c = 1 - 6(p-q)^2/(pq)$ for the Ising / tri-critical Ising / etc.
- §4 (Modular invariance) has Widget 4, which is a very nice $J(\tau)$ Fourier-head display, but it does not exercise Zhu's theorem itself — there is no $S$-matrix demo, no toy minimal-model character vector to apply $\tau \to -1/\tau$ to. The widget illustrates "the moonshine character is $J$"; the section's actual headline result (vector-valued modular form for `SL_2(Z)`) goes unwidget'd. Compare modular-curves §3 where the Hecke widget actually enumerates the $p+1$ summands.

### KaTeX macros / formatting
- **Duplicate callback in §1, lines 332–347.** A hand-authored `<aside class="callback">` (lines 332–338, no fence comments) is followed by an identical fenced auto-injected `<aside class="callback">` (lines 341–347, inside `<!-- callback-auto-begin -->` / `<!-- callback-auto-end -->`). Two visually identical "See also" boxes render back-to-back. The auto-injector's contract per AGENTS.md is that it owns the fenced one; the hand-authored one needs to be deleted from `content/vertex-operator-algebras.json`.
- KaTeX delimiter usage is conventional — `$…$` inline, `$$…$$` display, `\;` spacing, `\boxed{…}` once at §3 line 458 for the Virasoro relation. No invented delimiters.
- Macros: the page uses only the shared head macros (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`); no local `\newcommand`. `\mathfrak{g}`, `\mathfrak{m}`, `\mathcal{A}`, `\mathcal{D}_X` are all standard KaTeX. No new macros to flag.
- The §4 widget hint at line 548 contains `$\mathrm{ch}_{V^\natural}(\tau)$` — KaTeX renders fine, but `V^\natural_n` (unbraced superscript followed by subscript) at line 548 / 632 / 681 / 783 is exactly the kind of construction the braced moonshine form `V^{\natural}_n` was written to avoid.
- Widget 9 (`w-gen` button labels) in moonshine line 1156–1157 use `\\` escape inside JS strings for `\mathrm`, `\begin{psmallmatrix}` etc. This is unrelated to the VOA page but the VOA page does not have any such hand-rolled `<button>` LaTeX-via-JS pattern, so no concern.
- `\widehat{\mathfrak{g}}_k` (line 514, line 717) and `\frac{k\dim\mathfrak{g}}{k + h^\vee}` are fine; `h^\vee` (the dual Coxeter number) is used without any prior definition or callback — minor jargon-before-def but is conventional shorthand.

## Severity
minor polish
