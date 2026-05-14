# abelian-varieties — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** elliptic-curves, algebraic-curves-higher-genus

## Summary
The page is dense, well-paced, and consistently uses the section's "definition box → widget → consequences" rhythm. Most issues are minor: a sprinkling of cosmetic notation drift (`\mathrm{Pic}` vs reference `\operatorname{Pic}`, `\operatorname{Im}` vs `\mathrm{Im}` in higher-genus), an unused `\Hom` macro, a few terms used before definition (most notably "p.p.a.v." and "$\mathfrak{H}_2$" / Siegel upper half-space appearing in §1's widget readout before §2 introduces them), and a stylistic monoculture in the widgets (four of six are clickable-row tables).

## Findings

### Notation drift
- `\mathrm{Pic}` everywhere in `abelian-varieties` (e.g. `$\mathrm{Pic}^0(A)$` line 365, `$\mathrm{Jac}(C)=\mathrm{Pic}^0(C)$` line 571). `algebraic-curves-higher-genus` matches (`$\mathrm{Pic}(C)$` line 427), but `elliptic-curves` uses `\operatorname{Pic}` (`$\operatorname{Pic}^0(E)$` line 387, line 390). Cosmetic; settle on one — `\operatorname{Pic}` matches the Spec/Hom macro convention that's already in the loader.
- `\mathrm{Hom}` in `abelian-varieties` (`$\mathrm{Hom}(A,B)\otimes\mathbb{Z}_\ell$` line 543, line 753) even though the page declares the macro `'\\Hom':'\\operatorname{Hom}'` (line 25). Use `\Hom` to honor the macro the page already defines and to match `elliptic-curves`/`algebraic-curves-higher-genus`'s `\operatorname{...}`-everywhere convention. Semantic: identical output, but a maintainer reading the source sees an inconsistency.
- `\operatorname{Im}` in `abelian-varieties` (line 292, 295, 298, 340, 372, 374) versus `\mathrm{Im}` in `algebraic-curves-higher-genus` (`$|\det(\mathrm{Im}\,\tau)|$` line 446). Both pages discuss the same Siegel upper half-space `\Im(τ)` — pick one.
- `\mathrm{Frob}_q` in `abelian-varieties` (line 463, 544) but `\operatorname{Frob}` is the natural fit if you've already standardized on `\operatorname{...}` for operators.
- Tate-module subscript: `T_\ell A` here vs `T_\ell E` in `elliptic-curves` line 781 — that's just object-name difference, not drift; flagging only because §3 then writes `$V_\ell A=T_\ell A\otimes\mathbb{Q}_\ell$` (line 544) which a reader cross-paging from `elliptic-curves` will recognize as the same object.

### Undefined jargon
- "**Siegel upper half-space** $\mathfrak{H}_2$" appears in §1's widget readout ("period matrix lies in $\\mathfrak{H}_2$", line 328) and the §1 closing paragraph ("in <em>Siegel upper half-space</em> $\mathfrak{H}_2$", line 340), but Siegel upper half-space is properly motivated only in §4 (line 578 — `$\tau\in\mathfrak{H}_g$ the Siegel upper half-space`). Either define on first appearance in §1 or forward-link.
- "**Riemann form** / Riemann's bilinear relations" used in §1 prose ("a positive Riemann form — is the subject of §2", line 274) and the widget hint ("Riemann bilinear relations control projectivity", line 279) before being characterized. §2 introduces Hermitian forms and rationality but never uses the phrase "Riemann form" — the reader who clicks §1's widget sees "Riemann's bilinear relations" with no in-page anchor.
- "**p.p.a.v.**" first appears at line 584 ("distinguishes Jacobians among all p.p.a.v.'s") with no expansion — the abbreviation is then used 8+ times. The full phrase "principally polarized abelian variety" does appear earlier (e.g. line 340, 374), but the abbreviation is never defined; a reader scrolling sees "p.p.a.v." cold.
- "**Néron–Severi group**" introduced as `$\mathrm{NS}(A)$` (line 368) with the parenthetical "Néron–Severi group, is finitely generated and counts polarisation classes" — adequate, but "first Chern class" in the same sentence (line 365) is used as a term of art with no callback or gloss; readers without algebraic-topology priming may stall.
- "**Newton-polygon classification (ordinary, supersingular, etc.)**" in §3 (line 454) is mentioned and then waved off ("a story we leave to deformation theory") — fine as a punt, but the §7 Connections para then mentions "Newton stratification of $\mathcal{A}_g$" (line 840) as if the reader knows what it is.
- "**selmer-style finite-ramification arguments**" in §6 (line 745), lowercased — Selmer is a proper noun and the term is otherwise undefined on this page; a casual reader meets it twice (also "Iwasawa-theoretic Euler systems" line 840) without scaffolding.

### Tone mismatches
- §1's "**Rigidity lemma + theorem of the cube**" green-box (line 268) is a wall: it states the rigidity lemma, declares commutativity, and dumps the full eight-term cube-relation tensor product into one sentence with no narration. Compare `elliptic-curves`'s gentler "Why the name?" `note` (line 277) or the chord-and-tangent reveal (line 362). The cube relation belongs either as its own display equation with a one-sentence "what this is buying you" gloss, or deferred entirely.
- §2 line 374 `<div class="note">` says "**Why $g\ge 2$ generically fails.**" — the title is a question, but the answer is delivered in lecture voice ("A random Hermitian form on $\mathbb{C}^g$ generically has irrational entries…"). The pedagogical second-person/conversational mode that `elliptic-curves` keeps (e.g. line 596 "The widget above lets you see…") is mostly absent here; the page reads as a graduate textbook condensation.
- §3 line 454: "a story we leave to deformation theory" is the only clearly-conversational aside in §3, surrounded by purely declarative prose. More such hand-offs would help — the page is consistently in third-person dry mode.
- §6 caps off with a paragraph that's mostly a name-list: "**Effective Mordell** … **Uniform Mordell** (Mazur conjectured…) **Lang's conjecture**" (line 822). It compresses three open problems into one sentence each; reads as encyclopedia rather than the reference pages' "here's why this matters" voice.

### Missing worked examples
- No section is missing a widget — all six numbered sections have one. However:
  - Four of six widgets (§2, §4, §5, §6) are clickable-row table widgets with the same gesture: pick a row, read the description. After the second one the form factor is repetitive. `elliptic-curves` and `algebraic-curves-higher-genus` mix in SVG-driven scrubbers, lattice visualizers, geometry plots, proof-scrubbers — consider swapping at least one table for an SVG widget (e.g. §4 Schottky gap could be a 2D scatter showing `dim M_g` vs `dim A_g` curves, or §5 reduction could draw the Néron $n$-gon and degenerate fibre).
  - §6's `w-fin` widget overlaps in flavor with `elliptic-curves` §6 — and the `g0`/`g1`/`g2plus` axis is occasionally degenerate ("doesn't apply", "doesn't exist") which feels like padding.
  - §3 (Tate modules) is the most narration-heavy stretch — "Three deep theorems pin the structure down further" (line 542) followed by Tate's isogeny conjecture, semisimplicity, and independence of $\ell$ in one paragraph — with no follow-on widget for these three. The Weil-polynomial widget covers Frobenius eigenvalues, but the three deep theorems get no toy.

### KaTeX macros / formatting
- `\Hom` macro is declared in the loader (line 25) but never used in the body (`\mathrm{Hom}` is used instead at lines 543, 753). Either delete the macro or use it. Same for `\tr`, `\ad`, `\ind` — these are inherited from a shared loader template and are never invoked on this page; not a bug, but worth pruning if the page wants a tight loader.
- `\Spec` is declared and used once correctly (line 266 `\Spec k`).
- §1 widget readout (line 328) embeds `\\mathfrak{H}_2` inside a JS-quoted string — fine, but the only KaTeX delimiter passed to the local `renderMathInElement` call is `{left:'$',right:'$',display:false}` (line 333). That's narrower than the page-global loader (which also handles `$$…$$`, `\(…\)`, `\[…\]`). Same pattern at lines 414, 535, 632, 699, 814. Consistent within the page, but the mod-table readout (line 414) uses only `$…$` while the Weil-polynomial readout (line 535) and finiteness-table readout (line 814) explicitly add `$$…$$`. Minor; harmonize across widgets if you want one rule.
- Helper-block `<script>` at top of `<body>` (lines 187–239) is byte-identical to `elliptic-curves` (verified by `diff`). Widget chrome (`.widget / .hd / .ttl / .hint / .readout / .row / .ok / .bad / .note`) is used consistently. Only ad-hoc inline styles found are `style="min-width:3em;display:inline-block"` on the readout `<span>`s in widget rows (lines 283–300, 480–488) — minor and reasonable for value-display sizing, but the same effect is achievable with a one-off class if you want to keep inline styles to zero.
- §4 widget table has an inconsistent `var(--cyan)` highlight (line 628) where §2's table uses `var(--yellow)` (line 410), §5 uses `var(--green)` (line 696). Cosmetic — three different accent colors across three near-identical widgets reads as accidental rather than intentional.

## Severity
minor polish
