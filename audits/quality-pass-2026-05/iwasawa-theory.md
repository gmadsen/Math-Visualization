# iwasawa-theory — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** class-field-theory, galois-representations

## Summary
Strong page overall: tone, helper block, KaTeX delimiters, widget chrome, and seven well-paced sections each carrying a real interactive widget. Two concrete defects worth fixing (undefined `\Sha` macro that will fail to render; duplicate auto/manual callback asides), plus a handful of minor polish items around forward references to specialist jargon (`GU(2,2)`, "residual reducibility", `\Omega_E`, "Galois deformation").

## Findings
### Notation drift
- _Cosmetic._ `\mathrm{Sel}_{p^\infty}` (iwasawa §6, line 809) vs. `\operatorname{Cl}` (iwasawa §3, line 501) — the page mixes `\mathrm{...}` and `\operatorname{...}` for named operators. References use `\operatorname{...}` everywhere (galois-reps even bakes `\Frob` into a macro, but uses `\mathrm{Frob}` inline at line 288, so this drift is shared). Recommend: `\operatorname{Sel}` for consistency with `\operatorname{Cl}`, `\operatorname{char}`, `\operatorname{rank}` already in use.
- _Cosmetic._ Bare `B_n`, `B_{n,\chi^{-1}\omega}` (lines 605, 755) follow the standard "Bernoulli number" convention used in the rest of the corpus — no drift, just noting that the symbol is introduced inside a Kummer-congruence box without prior "let $B_n$ denote the $n$-th Bernoulli number" gloss; first-pass readers may need to chase the link.
- _None semantic._ `\mathbb{Z}`, `\mathbb{Q}`, `\mathbb{Z}_p` are written long-form throughout, matching both class-field-theory and galois-representations. No `\Z` / `\Q` shortcut drift.

### Undefined jargon
- "Selmer groups" appears in the hero subtitle (line 260) before it's defined at line 809 in §6. This is a hero-level forward reference, so low severity, but consider a parenthetical "(introduced in §6)" or dropping it from the hero.
- "residual reducibility" (line 752, §5) used without definition in the strategy paragraph — first-time reader has no anchor for what "residually reducible" means; references to deformation theory aren't linked. Recommend a brief gloss or callback to galois-representations.
- `\mathrm{GU}(2,2)` (line 824, §6) appears as the group on which Skinner–Urban congruences live, with no expansion of "GU" (general unitary) and no callback. A reader who doesn't already know unitary group conventions hits a wall.
- `\Omega_E` (line 818, §6) appears in `L(E,\chi,1)/(\Omega_E\cdot\text{periods})` with no introduction — `\Omega_E` is the real period of $E$, but the page treats it as known.
- "Galois deformation" / "deformation rings" (lines 752, 931) are referenced as known machinery; no callback to the modularity-and-flt page where they're treated. Recommend an explicit `<aside class="callback">` link.
- "CM" (lines 822, widget at 836) — first technical use is "CM by $\mathcal{O}_K$" with no expansion of "complex multiplication"; a beginner toggling the widget's "non-CM" option needs to know what they're toggling. One sentence at line 822 fixes it.

### Tone mismatches
- _None significant._ The page hits the conversational-but-precise register well: "the entire point" (line 704), "by design" (line 398), "has migrated far beyond its 1959 origin" (line 923) are exactly the voice category-theory.html and class-field-theory.html use.
- Minor: §6 line 752 "threads through modular forms: cusp forms whose Galois representations have *residual reducibility* let one congruence Eisenstein series" — this sentence is grammatically broken ("let one congruence Eisenstein series"; missing verb, likely intended "let one **congruence** Eisenstein series **with** cusp forms"). Reads as a typo, not a tone drift.

### Missing worked examples
- _None._ All six numbered sections (1–6) carry a widget; §7 "Connections" is a closing summary with no widget, matching the convention in galois-representations §9 and class-field-theory's wrap-up sections.
- §5 (main conjecture) widget is symbolic ("two ideals, one identity") rather than a concrete computation — it asserts equality after-the-fact rather than driving the user through a verification. Compare class-field-theory §3's "Hilbert class field tower" widget which actually computes `H` for selected `K`. Not blocking, but the §5 widget is the weakest of the six in giving a reader something to "poke."

### KaTeX macros / formatting
- **High priority.** `\Sha` is used at lines 828 and 829 but is **not** defined in the page's `macros: { ... }` block (lines 22–29). Every other repo page that uses `\Sha` (`bsd.html`, `latex-cheatsheet.html`, `pathway.html`, `mindmap.html`, `history.html`, `search.html`, `tags.html`, `tours.html`) defines `'\\Sha':'\\text{Ш}'` in its macros. With `throwOnError:false` the symbol will render as a red error badge or as the literal string. Add the macro.
- **Medium.** `\doteq` (lines 755, 828) is standard KaTeX and renders fine — flagging only because it's the page's only inequality-style relation and isn't visually explained ("equal up to a unit" is left to context). A one-line gloss at first use would help.
- **Medium (cosmetic but visible).** Duplicate callback asides: §1 has `<aside class="callback">` at lines 363–369 and again (auto-injected fenced) at 371–378; §2 at 475–480 and 482–488; §3 at 570–575 and 577–583; §4 at 706–712 and 714–721; §6 at 903–908 and 910–916. These render twice on the page. The auto-fenced version is the canonical one (`<!-- callback-auto-begin -->`), so the unfenced manual copies should be removed from `content/iwasawa-theory.json`. Result: 10 callback blocks vs. 4–5 in the references.
- **Low.** `\xrightarrow{\,\sim\,}` (line 395) is fine KaTeX; `;\xrightarrow{,\sim,};` spacing-control idiom doesn't appear elsewhere in the two references but is unobjectionable.
- _No new local macros introduced beyond the standard six (`\Spec, \Gal, \Hom, \tr, \ad, \ind`)._ Macro block is byte-identical to class-field-theory.html and galois-representations.html.
- _Helper block (lines 187–239)_ is verbatim copy of the canonical 2D `$ / $$ / SVG / ensureArrow / drawArrow / drawNode` helpers. No drift.
- _Widget chrome._ All six widgets use `.widget / .hd / .ttl / .hint / .row / .readout` correctly; no ad-hoc classes. `.note` (violet) and `.ok` (green) callouts used appropriately for "definitions" vs. "theorems."

## Severity
minor polish (one real KaTeX bug — undefined `\Sha`; one cleanup — duplicate callback asides; small stack of forward-reference glosses)
