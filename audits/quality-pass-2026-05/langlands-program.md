# langlands-program — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** automorphic-forms-adelic, modularity-and-flt

## Summary
The page is a strong, well-written narrative survey but is essentially a textbook chapter, not a notebook page: it contains **zero interactive widgets** across 8 numbered sections, where both peers ship 9 each. Notation and prose discipline are mostly fine, but several technical terms (Frobenius-semisimple Weil-Deligne reps, Tate modules, Hodge-Tate weights, D-modules on $\mathrm{Bun}_G$) appear once with no callback or definition.

## Findings
### Notation drift
- The hero SVG (lines 282–296) uses Unicode/plain-text math (`ρ : Gal(Q̄/Q) → GL_n(Q_ℓ)`, `π = ⊗_v π_v`, `H` for the upper half-plane in `automorphic-forms-adelic`). Both peers use full KaTeX inside SVG `<text>` only when unavoidable; the rest of langlands-program correctly switches to `\Gal(\overline{\mathbb{Q}}/\mathbb{Q})`, `\GL_n(\mathbb{Q}_\ell)`, `\mathbb{A}_\mathbb{Q}`. The mixed register is jarring — recommend KaTeX `<foreignObject>` blocks or rewriting prose to keep the hero diagram purely typographic.
- `\GL`, `\SL`, `\PGL`, `\Sp`, `\Sym`, `\Frob` are defined as `\mathrm{...}` in the local macro block (langlands-program.html:24–28); `automorphic-forms-adelic.html` writes the same constructs as `\mathrm{GL}_2`, `\mathrm{SL}_2(\mathbb{Z})` inline without a macro. Cosmetic — both render identically — but the canonical category-theory convention is `\operatorname{...}` for named operators and bare `\mathrm{...}` for group symbols, and `\Gal`/`\Hom`/`\Aut` are `\operatorname{...}` here while `\GL`/`\SL`/`\PGL`/`\Sp` are `\mathrm{...}`. The split is internally inconsistent.
- `\Frob` used inline (line 308 `\rho(\Frob_p)`); peers and `category-theory.html` do not introduce a `\Frob` macro and write `\mathrm{Frob}_p` directly. Low priority.
- `\Ind` and `\Res` macros are declared (lines 32–33) but **never used in the body** — dead macros. Either remove or use them where `\mathrm{Ind}_B^G` appears in `automorphic-forms-adelic.html:991`.
- Hero subtitle and SVG describe automorphic reps "of $\GL_n(\mathbb{A}_\mathbb{Q})$" sometimes and just "of $\mathrm{GL}_n$" other times (line 267 vs SVG line 293). Settle on one.

### Undefined jargon
- Line 267 (hero) introduces "Tannakian framework" with no definition. Re-appears in the §7 note (line 499) as "Tannakian fundamental group" still without definition. The Langlands page is a reasonable place to gloss it inline ("a category-theoretic packaging of representations as a fibre functor") or callback to a peer; right now it functions as a name-drop bookend.
- §3 (line 379) says "Frobenius-semisimple Weil-Deligne representations of $W_{\mathbb{Q}_v}$ … with a monodromy operator $N$ encoding ramification" then immediately uses $\rho(\sigma) N \rho(\sigma)^{-1} = q^{|\sigma|} N$ (line 383) where $q$ and $|\sigma|$ are not introduced. A reader who hasn't seen this before cannot reconstruct what $|\sigma|$ means (the absolute value on the Weil group?).
- §3 (line 383): "smooth admissible reps" — undefined. Peer `automorphic-forms-adelic.html` does the same but offsets it with explicit conditions (K-finite, $\mathfrak{z}$-finite, moderate growth). Here the term lands with zero scaffold.
- §3 (line 383): "supercuspidal, principal, and Steinberg pieces" — three named representation classes appear in a parenthetical with no definition or callback.
- §4 (line 401): "almost everywhere de Rham" — `de Rham` for $\ell$-adic Galois reps is a serious technical condition (Fontaine theory) used as a casual qualifier.
- §4 (line 402): "integral Hodge-Tate weights" — never defined; peer pages don't either, but they don't depend on the term.
- §6 (line 464): "$\ell$-adic Tate modules" used in a load-bearing sentence with no callback to a Tate-module section. Modular peer (`modularity-and-flt`) gives it more setup.
- §6 (line 468): "Mazur deformation rings, Taylor-Wiles patching, the $R = T$ identity between universal deformation rings and Hecke algebras" — a parenthetical wall of named technology that `modularity-and-flt.html` actually has a `#deformation` and `#rt` section to define. A `<aside class="callback">` to those sections would land this gracefully; right now the prose reads as name-soup.
- §7 (line 488): "${}^L H$" / "${}^L G$" notation for Langlands dual groups appears with no glossary or hover. Peer `automorphic-forms-adelic.html` has §9 "Functoriality and the $L$-group" doing this work, but the target page never points at it.
- §7 (line 499): "$L_F^{\mathrm{geom}}$" — superscript convention introduced inline and never used again.
- §8 (line 522): "$\ell$-adic local systems on $C$ to D-modules on $\mathrm{Bun}_G(C)$" — D-modules and $\mathrm{Bun}_G$ both undefined; for a capstone summary this is acceptable, but a callback to motives / sheaves pages would soften the cliff.

### Tone mismatches
- Overall voice is more textbook-survey than the conversational-but-precise template `category-theory.html` sets. Sentences like "The Langlands philosophy is that *arithmetic rigidity = analytic flexibility*; they are two views of the same underlying object, and L-functions are the testable shadow." (line 312) are good in voice but exceptional — most paragraphs read as graduate-textbook compression with no second-person address and no "let's compute" beats.
- The §4 "Known cases." block (lines 407–412) is structurally a status-report bulleted list with parenthetical citations; peers avoid this register by interleaving examples (e.g. `modularity-and-flt`'s curve `11a1` walkthrough, line 538–541).
- §3 status paragraph (line 385) is a Wikipedia-style citation chain ("Harris-Taylor, Henniart, 2001 … Langlands, 1973"). `automorphic-forms-adelic` uses similar attributions (e.g. Casselman, Atkin–Lehner) but inside paragraphs that also do mathematical work.
- The capstone `<aside class="bad">` (line 524) is a pure status block — appropriate for the role but again no narrative beat to follow it.

### Missing worked examples
- **All 8 numbered sections lack any widget.** The repo convention (AGENTS.md "every major concept has a toy you can poke") and the section peers both honor this — `automorphic-forms-adelic` ships restricted-product tester, strong-approximation stepper, three-conditions diagram, dictionary translator, Satake explorer, conductor ladder, local-factor builder, Eisenstein scrubber, and a functoriality piece. `modularity-and-flt` ships Frey explorer, conductor calculator, modularity correspondence table, trace mismatch meter, contradiction chain, level-lowering simulator, Ribet stepper, deformation-ring sketches, and an R=T diagram. The langlands-program page has only a single static decorative SVG (the two-column picture, line 275).
- §1 cries out for a clickable two-column diagram (Galois rep → automorphic rep with L-function readout) — currently a static SVG.
- §2 (L-functions bridge) — no Euler-product builder; `automorphic-forms-adelic` already has one (lines 884–893) that could be reused or schema-mirrored.
- §3 (Local Langlands) — no example: should at least walk an unramified principal series → Satake-parameter pair, or display the (simple) bijection at $n=1$.
- §5 (CFT as Langlands for $\GL_1$) — no concrete Hecke-character ↔ Galois-character example. A toggle between $\chi(\mathfrak{a}) = N(\mathfrak{a})^s$ and the matching Galois character would land the prototype.
- §6 (Modularity) — no `(E, f)` row-by-row table; the peer `modularity-and-flt.html` literally has this widget (`Widget 2 · Modularity correspondence`, lines 543–614) and it could be embedded or callback-linked.
- §7 (Functoriality) — no symmetric-power lifting toy or base-change diagram; peer `automorphic-forms-adelic.html` §9 has Satake-parameter functoriality which would adapt.
- §8 (capstone) — a "name a famous L-function, see which side it lives on" picker would unify the section.

### KaTeX macros / formatting
- `\Ind`, `\Res` declared but unused (lines 32–33) — dead code, recommend either delete or use somewhere in §3/§7.
- `\Sp`, `\PGL` declared but unused — same.
- `\Sym`, `\Frob` used; OK to keep.
- `\GL`, `\SL` used heavily; OK to keep, but as noted the `\mathrm{...}` vs `\operatorname{...}` choice diverges from house mixing.
- The hero SVG renders `Q̄`, `→`, `⊗_v`, `Q_ℓ` as raw Unicode (lines 286, 294) rather than KaTeX. With `auto-render` configured for the body, these never get typeset, so the visual quality drops compared to the rest of the page. Either move to `<foreignObject>` with KaTeX, or accept Unicode and use it consistently in the prose surrounding it.
- §5 line 433 uses `\widehat{\mathbb{A}_\mathbb{Q}^\times / \mathbb{Q}^\times}` followed by `\widehat{}` standalone in prose — KaTeX renders the bare `\widehat{}` as an empty hat. Recommend writing "(where $\,\widehat{\phantom{X}}\,$ is the Pontryagin dual…)" or just "(where the hat denotes Pontryagin dual…)".
- TOC (line 248) uses `&nbsp;` between number and title; consistent with peers — fine.

## Severity
needs rework — the zero-widget posture is a hard miss against the section template; jargon density without callbacks is a polish issue downstream of that.
