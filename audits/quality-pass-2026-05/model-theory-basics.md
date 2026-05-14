# model-theory-basics — pedagogical audit (2026-05)

**Section:** Logic & Foundations
**Compared against:** first-order-logic-and-completeness, naive-set-theory

## Summary
Strong page overall: tone, KaTeX usage, and widget chrome match the FOL peer almost exactly, and each section ships a real worked widget. The only real issues are (a) an erroneous "Floer homology" callback at the end of §6 and (b) two technical terms ("elementary extension", "quantifier rank") used in earlier prose before they are defined.

## Findings
### Notation drift
- _None._ The page uses `\mathfrak{A}`, `\mathfrak{B}`, `\mathbb{Q}`, `\mathbb{R}`, `\mathrm{Th}`, `\sigma_{\mathrm{gp}}`, `\models`, `\equiv` exactly as `first-order-logic-and-completeness.html` does. The target talks about "signatures $\sigma$" while FOL uses "languages $\mathcal{L}$" — a deliberate convention shift that the §1 prose explicitly flags ("(or *language*) $\sigma$"), so this is not drift.

### Undefined jargon
- **"quantifier rank"** appears in the hero-adjacent intro paragraph ("a single sentence of low quantifier rank", line 262) but is not defined until the EF-theorem statement in §5 (parenthetical at line 1004). A reader landing in §1–4 has no anchor for the phrase. Either drop it from the §0 prose or move the definition forward.
- **"elementary extension"** is used three times in §4 (lines 843, 847, 851 — "in this or any elementary extension", "every type is realised in some elementary extension") but the term is never defined on this page, and the FOL prereq page also doesn't define it (`grep` returns zero hits there). A one-sentence parenthetical — "an extension $\mathfrak{A}\subseteq\mathfrak{A}'$ such that all $\sigma$-sentences with parameters from $A$ have the same truth value in both" — would close the gap.
- **"model-complete"** appears in the `mt-applications-to-algebra` blurb but never in the §6 page body, which talks only about "complete" theories. Mild blurb-vs-page mismatch; not user-facing on the topic page itself but worth noting for the concept-graph side.

### Tone mismatches
- _None._ Voice is the canonical conversational-precise register: hero ends with "By the end you'll know why…", §6 closes with "There is no analytic or topological input." The §6 thunderclap callout matches the cadence of category-theory.html's mini-essay style.

### Missing worked examples
- _None significant._ All six numbered sections ship an interactive widget (signature explorer, equivalence prober, back-and-forth animation, type space, EF game, Ax–Grothendieck transfer). The Ax–Grothendieck widget is closer to a "scrubber over a static proof outline" than a true toy to poke, but it matches the FOL page's Henkin-construction widget pattern, so it is consistent with section practice.

### KaTeX macros / formatting
- No locally-defined macros; relies on the canonical `\Hom`/`\Spec`/`\Gal`/`\tr`/`\ad`/`\ind` set, none of which it uses (so the macro block is effectively unused but harmless and identical to peers).
- `\mathrm{Th}(\mathfrak{A})` (line 516) — FOL uses `\mathrm{Th}(\mathbb{N})` (line 1005). Consistent. A future cleanup could promote `\Th` into the shared macro block since both pages reach for it, but that's a corpus-wide concern, not a model-theory issue.
- Subscript convention `\mathrm{ACF}_p`, `\mathrm{ACF}_0`: written as `ACF$_p$` (HTML subscript on `_p`, lines 520, 1213, 1217, 1262) rather than `$\mathrm{ACF}_p$`. FOL also mixes `\mathrm{Th}(\mathbb{N})` (KaTeX) with bare `ACF` (line 257 of the hero). Cosmetic but the in-KaTeX form would render more uniformly.

### Helper-block / widget-chrome hygiene
- 2D helper block (lines 187–239) is byte-identical to the FOL helper. `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all present.
- Widget chrome uses `.widget`, `.hd`, `.ttl`, `.hint`, `.readout`, `.row`, `.note`, `.ok`, `.bad` consistently. No ad-hoc classes.
- All six widget SVGs include `viewBox` and a `<title>` element.

### Other (semantic, high priority)
- **Erroneous "See also" callback at end of §6** (line 1243): `<a href="./symplectic-manifolds.html#floer">Floer homology — a preview</a>`. This is auto-generated from the `mt-applications-to-algebra` concept's prereq list, which contains `sm-floer-homology-preview`. Floer homology has no plausible relationship to the §6 material (ACF, Lefschetz, Ax–Grothendieck). The fix is in `concepts/model-theory-basics.json`: drop `sm-floer-homology-preview` from the `mt-applications-to-algebra` prereqs, then `audit-callbacks.mjs --fix` will regenerate the callback block without it. **This will mislead any reader who clicks through.**

## Severity
minor polish — except the spurious Floer callback, which is a semantic concept-graph bug worth fixing in the same pass.
