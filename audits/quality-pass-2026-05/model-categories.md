# model-categories — pedagogical audit (2026-05)

**Section:** Algebra & homological
**Compared against:** category-theory, derived-categories

## Summary
Model-categories is in strong shape — six numbered sections each carry a substantive interactive widget, the prose has the conversational-but-precise voice the corpus aims for, and the worked counterexamples in the readouts are notably good. The only clearly-actionable item is a notation drift: model-categories uses `\mathbf{Top}`, `\mathbf{sSet}` while category-theory uses `\mathsf{Top}`, `\mathsf{Set}` for the same kinds of objects.

## Findings
### Notation drift
- Category names: model-categories writes `$\mathbf{Top}$` / `$\mathbf{sSet}$` (e.g. `<section id="examples">`, `§5` bullet list), while category-theory uses `$\mathsf{Top}$`, `$\mathsf{Set}$`, `$\mathsf{Grp}$` (`<section id="cat">` examples table). Derived-categories side-steps both with `\mathrm{Mod}\,R`, `\mathrm{Ab}`, `\mathrm{Ch}(\mathcal{A})`. Three pages, three font conventions for category names. Cosmetic but visible — consider standardising on `\mathsf{…}` per category-theory's lead since it is the de facto style anchor.
- Pushout-product symbol: §5 uses raw `\Box` (`$i\Box j$`) in prose and the `<title>`, but the KaTeX header defines a `\boxslash` macro mapped to `\mathbin{\square}` that is never invoked. Either drop the unused macro or switch the prose to `i\boxslash j`.
- Standard tex-symbol slip in widget readouts: `mc-lift-out` prints the literal Unicode character `⫛` in `'C_W ⫛ F'` and `'C ⫛ F_W'` (lines 311, 313). That glyph (U+2ADB) is not the lifting-property symbol — the conventional ASCII rendering is `⊠` or `⫽` or just `LLP` / `RLP`. Low priority but the readout is plain text so users see the literal codepoint.
- `\mathrm{Sing}` vs `\Sing`: derived-categories doesn't use it; category-theory doesn't use it; model-categories writes `\mathrm{Sing}` consistently — fine, just flag that no shared macro exists for it across the section.

### Undefined jargon
- `Bousfield localization` and `transferred model structures` (§6 final paragraph) appear in a list of "old computations" without any prior callback, definition, or hyperlink. First-time encounter for the reader. Either gloss in one half-sentence or drop.
- `combinatorial simplicial model category`, `cofibrantly generated`, `SM7 / pushout-product axiom for the simplicial action` (§6, item 2 — Dugger's theorem) all surface in a single sentence. "Cofibrantly generated" is reasonable in context, but `SM7` is dropped without expansion (it is Quillen's compatibility axiom for simplicial enrichment); a one-line gloss would help.
- `presentable $(\infty,1)$-category` (§6 again) — the page links to `infinity-categories.html#quasi-category` but `presentable` is a separate notion not anchored anywhere on this page. A `(presentability is the $\infty$-version of locally presentable; see …)` aside would close the gap.
- `compactly generated topological spaces` (§2, opening of `<h3>Topological spaces (Quillen)</h3>`) appears in the very first sentence with no gloss. One-clause definition or callback would be kinder for an intermediate reader.

### Tone mismatches
- §5 paragraph "The deeper consequence — Schwede–Shipley's monoid axiom — lifts the model structure to monoid objects: $E_\infty$-rings, structured ring spectra, simplicial monoids, and dgas all arise as monoids…" reads as a name-drop list (five proper nouns in one sentence, none defined or linked). Compare derived-categories §7 which mentions Bondal–Orlov, Mukai, Orlov but each gets a sentence of context. Trim the list or unpack one.
- §6 closing paragraph ("The bridge runs both ways…") is dense with unhyperlinked technical phrases (`straightening–unstraightening equivalence`, `accessible reflective sub-$\infty$-categories`). Tonally this leans toward dry survey voice rather than the worked-example-heavy register of §1–§4. Either prune or add a single concrete example.
- Otherwise voice is well-matched to peers — uses second-person prompts in widget hints ("toggle whether $i$ or $p$ is trivial"), and the §1 explanation that "Two of the three classes pin the structure down" has the right "here is why this is overdetermined" texture that category-theory uses throughout.

### Missing worked examples
- _None._ All six numbered sections (§1–§6) ship a substantive interactive widget. §1's lifting calculus widget even includes a non-trivial counterexample (the degree-2 self-map of $S^1$) that exceeds peer norms.

### KaTeX macros / formatting
- `\boxslash` macro is defined in the loader (line 29) but never invoked. Either delete it or use it in §5 where `\Box` currently does the job.
- `\Ho` macro is defined in the loader but is unique to this page's loader (category-theory and derived-categories define neither). Locally consistent and used cleanly (`\Ho(\mathcal{M})`). Mild drift but acceptable — alternatively expand to `\operatorname{Ho}` per the section's `\operatorname{…}` convention.
- §3 uses `\mathbb{L}L`, `\mathbb{R}R` for derived functors. Derived-categories writes `RF`, `LF` plainly (no blackboard); category-theory has no analogue. The blackboard convention is standard in homotopy-theory texts so this is a defensible local choice — flag it only as a notation that does not match derived-categories.html, where a reader meeting `RF` there and `\mathbb{R}R` here may briefly stumble.
- `\mathbb 1` (no braces) at line 792 in the unit-axiom paragraph. Works in KaTeX but inconsistent with the rest of the page using `\mathbb{Z}`, `\mathbb{Q}` with braces. Cosmetic.
- §6 KaTeX: `N_\Delta(\mathcal{M}^{cf})` — the `cf` superscript is in upright text but rendered as italic by the default math mode. Peers tend to write `\mathcal{M}^{\mathrm{cf}}` for two-letter superscripts; this is a one-character polish.

## Severity
minor polish
