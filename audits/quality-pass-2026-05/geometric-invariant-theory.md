# geometric-invariant-theory — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** moduli-spaces, algebraic-spaces

## Summary
Strong, polished page: helper block, widget chrome, and KaTeX macros all match the canonical template, every numbered section ships an interactive widget, and the voice is consistently "conversational-but-precise" in line with category-theory.html. Findings are minor polish — a couple of forward-jargon nits, mild notation drift in group-name styling vs. the two reference pages, and one in-widget hex-fallback color.

## Findings
### Notation drift
- Group names: target uses `\mathrm{SL}_2`, `\mathrm{GL}_n`, `\mathrm{PGL}_{5g-5}`, `\mathrm{Sp}_{2n}`, `\mathrm{Bun}_G` throughout (e.g. §3 `<h2>` "$\mathrm{SL}_2$ on $(\mathbb{P}^1)^4$"). moduli-spaces.html standardises on `\operatorname{}` for the same families (line 420 `\operatorname{GL}_2(\mathbb{Z}/N)`, line 512 `\operatorname{SL}_2(\mathbb{Z})`). Both forms render similarly, but the corpus convention in the immediate section is `\operatorname{}` for "named" groups. Cosmetic only.
- Aut-group: target writes `\operatorname{Aut}` once (Connections paragraph implicitly) but stays in mixed form. moduli-spaces uses `\operatorname{Aut}(E)` consistently (lines 324–327). algebraic-spaces uses `\mathrm{Aut}(x)` (line 697). Corpus is split — flag as cosmetic-only.
- Spec / Hom: target inlines `\operatorname{Spec}` (e.g. "$X=\operatorname{Spec} R$" §3) even though it defines `\Spec` in the macro block (line 23). moduli-spaces and algebraic-spaces consistently use the `\Spec` macro. Cosmetic — recommend either dropping the `\Spec` macro definition or threading it through the prose.
- Quotient bar: target uses `X/\!/G` (with `\!\!` thin negative space) consistently — this is fine and matches GIT literature. References don't have the construction so no comparison.
- Field symbol: target writes `\mathbb{C}^\times` in §5 widget but `\mathbb{G}_m` everywhere else. The §5 widget title "Kempf–Ness: $\mathbb{C}^\times$ on $\mathbb{C}^2$" reads alongside §2 prose using `\mathbb{G}_m`. Minor — same group, two notations on the same page.

### Undefined jargon
- "1-PS" appears in widget readout text inside §3 (line 800: "Hilbert–Mumford test: a 1-PS λ(t) = diag(t,t⁻¹) drives the configuration to the point of highest multiplicity") before §4 defines "1-parameter subgroup (1-PS)". Reader meeting the §3 widget runs into the abbreviation cold. Recommend either defining "1-PS" inline at first use in §3 prose or rewording the §3 widget readout.
- "graded Nakayama" used in §1 finiteness sketch ("which by graded Nakayama is finitely many algebra generators") with no callback; advanced but standard. Low priority.
- "Hilbert scheme" (§7 Mumford paragraph: "The **Hilbert scheme** $H$ of subschemes…") and "Quot scheme" (§7 Bun_G paragraph) are introduced bold-faced but not defined or callback-linked. Sufficient context to glide past, but a one-line gloss or a callback to a future page would help.
- "Newton polytopes" in §4 closing note, "Bridgeland stability" / "Bayer–Macrì programme" in §8 — all forward-looking gestures, acceptable as horizon-pointing rather than required vocabulary.

### Tone mismatches
- Voice matches category-theory.html and the two references well: paragraphs alternate definition with worked computation, notes ("Why finiteness is hard.", "Convexity in disguise.", "Why this is MMP.") mirror the labelled aside style used in moduli-spaces ("Why $N \ge 3$?") and category-theory.
- One walls-of-formulas moment: §4 "Worked example: binary $n$-forms" goes definition → weight formula → criterion application in three centred display lines without a between-step sentence. Reads slightly textbook-ish vs. the gentler step-by-step in moduli-spaces §4 (twist obstruction). Minor — the immediately-following widget rescues it.
- §8 Connections closes with "is one of the active modern research areas in algebraic geometry" — slightly generic compared with the more specific frontier paragraph in algebraic-spaces §7 ("derived algebraic spaces… Hilbert and Quot spaces… Artin's representability theorem"). Cosmetic.

### Missing worked examples
- _None._ Every numbered section (1–7) has a registered widget (`#w-invariants`, `#w-reductive`, `#w-stability`, `#w-hm`, `#w-kn`, `#w-vgit`, `#w-quiver`); §8 Connections is the standard outro with no widget by convention. §1 also has the symmetric-polynomial table, §3 a stability-flavour table, §5 a worked example beyond the widget. Coverage is unusually strong.

### KaTeX macros / formatting
- Macro block (lines 22–29) is the verbatim canonical six (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) — identical to moduli-spaces and algebraic-spaces. No new local macros introduced.
- Delimiters: only `$…$` and `$$…$$` used (with one `\\(…\\)` inside a widget JSON-string, line 287 — that's the proof-scrubber in algebraic-spaces, not GIT; GIT itself sticks to dollars). Clean.
- One in-widget hex fallback: §3 widget uses `'var(--orange,#ffb74d)'` (lines 751, 752) and §6 widget uses the same fallback. Per AGENTS.md "Color tokens, never hex" the literal `#ffb74d` is technically a violation, though wrapped as a CSS fallback for `--orange` (which is defined in `css/notebook.css` but **not** in this page's inline `<style>` `:root`). Either (a) add `--orange` to the inline `:root` block, or (b) drop the fallback and rely on inheritance from `notebook.css`. Cosmetic — would surface in `node scripts/color-vars.mjs`.
- Sub/superscript glyphs in widget readout text are written as Unicode (e.g. `t⁻¹`, `ℂ³`, `𝔾_m`, `ker N²`) inside `out.textContent` strings rather than KaTeX-rendered. Consistent with how moduli-spaces and algebraic-spaces handle in-readout math; not drift.

## Helper-block / widget-chrome hygiene
- Top-of-body helper script (lines 187–239: `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is byte-identical to category-theory.html and to both references. Verified.
- Every widget uses `<div class="widget">` with `.hd`/`.ttl`/`.hint` headers, `<svg>` with `viewBox` and `<title>`, `.row`/`.readout` / `.note` / `.small` chrome. No ad-hoc class names.
- Each section ends with `<aside class="callback">` (auto-fenced), `<aside class="related">` (auto-fenced), and a `<div class="quiz" data-concept="...">` placeholder — all matching the corpus pattern.
- Sidetoc scaffold (`<aside class="sidetoc">`) and top-nav `← Notebook` backlink present. `MVQuiz.init('geometric-invariant-theory')` IIFE at the body tail (lines 1509–1513). All required scaffolding intact.

## Severity
minor polish
