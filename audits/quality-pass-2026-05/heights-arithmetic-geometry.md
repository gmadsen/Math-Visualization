# heights-arithmetic-geometry — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** algebraic-number-theory, class-field-theory

## Summary
The page is well-structured (10 sections, all with widgets and quizzes), and notation is mostly consistent with the canonical macro set. The leading concrete issue is a cluster of broken KaTeX spaces (raw `;` where `\;` was intended) that visibly garble four display equations in §§8–9, plus a steep jargon ramp in §§7–10 that drops names without micro-glosses where the references would have done so.

## Findings
### Notation drift
- `\operatorname{Hom}` and `\operatorname{Gal}` typed out longhand at line 933 (`\operatorname{Hom}\bigl(\operatorname{Gal}(\bar K/L), E[2]\bigr)`) bypass the page's own `\Hom` / `\Gal` macros (head block lines 24–25); class-field-theory uses the `\Gal` macro consistently (e.g. line 321 `\Gal(\mathbb{Q}(\zeta_n)/\mathbb{Q})`). Cosmetic, but the inconsistency exists within the same page.
- `\mathrm{Pic}` (line 424–425) and `\mathrm{tors}` (525, 529, 548) use `\mathrm{...}` while `\operatorname{Spec}` (842, 844, 848) goes through the `\Spec` macro, and `\widehat{\mathrm{CH}}` (1200) mixes families. Cosmetic. References are themselves split (ANT uses `\mathrm{Cl}`, CFT uses `\operatorname{Cl}`), so this is a corpus-wide cosmetic inconsistency rather than a target-specific bug.
- Mostly-irrelevant-but-worth-noting: heights writes `\mathbb{Q}^*` (lines 274, 860) for the multiplicative group; ANT and CFT consistently write `K^\times` / `\mathbb{Q}^\times` (e.g. CFT 490 `\alpha\in K^\times`, ANT 529 `\alpha\in K^\times`). Semantic: the two are interchangeable in arithmetic, but readers coming from §§ on algebraic number theory will expect `\times`. Low priority.

### Undefined jargon
- "principally polarised" — line 784 introduces "moduli space of principally polarised abelian varieties" with no gloss; first use of "polarised" / "polarisation" on the page. The canonical reflex is a half-sentence parenthetical (cf. the parenthetical glosses ANT gives for "integral basis", "ramification index", etc.).
- "Hodge bundle" — line 863 ("computed against the Hodge bundle on the moduli space of abelian varieties") used once, never defined or callbacked. Same line drops "Fubini–Study metric" and "cubical metric supplied by the theta-function machinery" as if they are common knowledge.
- "Tate–Shafarevich obstructions" — line 959 ("which is where Tate–Shafarevich obstructions enter"); first and only mention, no callback to elliptic-curves or BSD.
- "Coleman–Chabauty" — appears twice (lines 797, 825) before any explanation; reader has no purchase on what method it refers to.
- "Pila–Wilkie", "Pila–Zannier", "André–Oort", "Shimura subvarieties", "CM points" — line 1198 stacks five specialist terms in one paragraph without micro-glosses; a reader who has just been promised "the simplest test case" (1179, roots of unity) is suddenly inside a research-program shopping list.
- "Bost–Soulé–Gillet 'arithmetic Hilbert–Samuel' formula" — line 1177; appears once, undefined; the scare-quotes hint the author knows it's exotic.
- "IUT" / "Mochizuki's contested IUT framework" — line 1162; abbreviation expanded only via the unfamiliar adjective "contested". Compare CFT's careful staging of "ray class group" before the phrase ever appears in a theorem statement.
- "Granville's $p$-adic refinement of abc" — line 1162; reader meets a named conjecture they have no anchor for.
- "$S$-unit equation" — line 987 introduces "$S$-unit equation $a+b=c$"; the term "$S$-unit" has not been defined and there is no callback (algebraic-number-theory has the unit theorem at #units).

### Tone mismatches
- §§9–10 close with "shopping-list paragraphs" that catalogue named programs (Mochizuki IUT, Kim non-abelian Chabauty, Dimitrov–Gao–Habegger, Kühne, Pila–Wilkie, Pila–Zannier, André–Oort, Bost–Soulé–Gillet) at a much higher density than the references' closing paragraphs. The rhythm shifts from worked-and-narrated to encyclopedic. ANT §8 ("Connections") and CFT §10 hit the same beat with shorter, warmer summaries.
- The Lehmer paragraph (line 662) reads naturally — "wide open", "spectacular", "wildly surprising" — that is the canonical voice. By contrast §10 opens "Northcott rules out infinite sets of bounded height. The opposite extreme … is the engine of arithmetic equidistribution. Three theorems organise the picture:" — clean but dryer; could use a one-line "what the reader will see in the widget" hook akin to §1's `H(3/4)=4, H(355/113)=355` opener.
- Minor: §6's "qualitative point counts as a function of $g$" widget reduces to a 4-row text lookup table (lines 814–830). Reads as documentation, not a toy to poke. The reference pages reserve this register for footnote-style asides, not the main interactive.

### Missing worked examples
- Every `<h2>` has a `.widget` — no section is widget-bare. Coverage is structurally fine.
- §6 (Mordell–Faltings) widget is the weakest: it is a discrete dropdown of four canned strings rather than a computation. Compare ANT's `w-ring` (lattice plot driven by $d$) or CFT's class-group enumerator. Calling this "missing" is a stretch — but it is the only widget on the page that does not reward poking.
- §7 (Arakelov) verifies the product formula via a single rational `a/b`. That is fine for the local–global decomposition gimmick, but the section also mentions Faltings height, Hodge bundle, theta-cubical metrics, none of which the widget touches; the example doesn't quite match the prose's reach. Low priority.

### KaTeX macros / formatting
- HIGH: lines 933, 937, 976, 986 contain raw `;` characters where `\;` (LaTeX thin space) was clearly intended. Examples: `E(K)/2E(K);\hookrightarrow;\operatorname{Hom}(...)` (line 933), `$$\hat h(P');=;\frac{1}{4}\hat h(P-Q_i);\le;\frac{1}{4}…` (937), `h_{K_X+D}(P);\le;\varepsilon\cdot h_A(P)…` (976), `h(t);\le;m_S(t,\{0,1,\infty\})…` (986). KaTeX renders these as literal semicolons, producing strings like "E(K)/2E(K);↪;Hom(...)" on screen. This is the most user-visible defect on the page and crosses two structurally important displays (the Kummer pairing and the Vojta inequality).
- Macro hygiene: page declares `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind` (lines 23–28) — same set as the two references, no new locally-introduced macros. Good. The bypassed-macro instances flagged above use `\operatorname{...}` longhand rather than re-defining anything, so this is consistency drift, not macro pollution.
- Helper-block / widget-chrome hygiene: top-of-`<body>` helper script (lines 188–241) is a verbatim copy of the canonical block — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all match. Widgets all use `.widget / .hd / .ttl / .hint / .row / .readout / .pill / .small / .note / .ok` chrome — no ad-hoc classes spotted. Quizzes carry `data-concept` attributes that match the toc. No deviations.

## Severity
minor polish (downgraded from "needs rework" only because the broken `\;` instances are a one-character-each fix; the jargon ramp in §§7–10 is the bigger qualitative issue but doesn't block publication)
