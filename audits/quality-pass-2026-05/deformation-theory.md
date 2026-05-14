# deformation-theory — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** moduli-spaces, algebraic-curves-higher-genus

## Summary
The page is dense, well-staged, and pedagogically generous: every numbered section has a worked example plus an interactive widget, and the §1 → §2 → §3 → §5 arc (Čech bijection → obstructions → cotangent complex) lands cleanly. Notation and chrome match the section peers; the main polish targets are a handful of Schlessinger-flavored terms used before they are defined and a couple of micro-inconsistencies in the hero subtitle and abbreviation usage.

## Findings

### Notation drift
- Hero subtitle (line 268) writes `$H^1(T)$, $H^2(T)$` with bare `T`, while the entire body uses the fully-subscripted `H^1(X_0, T_{X_0})` (e.g. line 275). Cosmetic, but the subtitle is the first formula a reader meets — align with body.
- §1 introduces the notation `T^1_{X_0}` ("denoted $\mathrm{Def}_{X_0}(D)$, or simply $T^1_{X_0}$", line 275) and then never uses it again — sections 2–6 only use `\mathrm{Def}_{X_0}(D)`. Either drop the alias or thread `T^1` through at least once more (Sernesi-style usage would call obstructions `T^2`).
- §2 uses both `\check H^1` (line 363) and `H^1(X_0, T_{X_0})` interchangeably without ever reminding the reader they coincide for paracompact / good covers. moduli-spaces and algebraic-curves-higher-genus default to `H^1` throughout. Low priority but worth a one-sentence parenthetical at first appearance of `\check H^1`.
- §4 mid-formula reads `$\Hom_k\text{-alg}(R, A)$` (line 543) — the `_k\text{-alg}` subscript is awkward; algebraic-curves-higher-genus and moduli-spaces use `\Hom_{k\text{-alg}}` or `\operatorname{Hom}_{\mathrm{Alg}_k}` style. Cosmetic.
- §5 displays `\mathcal{H}om(\Omega^1_{X_0/k}, \mathcal{O}_{X_0})` (line 617) — the unsubscripted `\mathcal{H}om` is fine, but appears nowhere else on the page; first usage benefits from "(sheaf $\mathcal{H}om$)" gloss.
- Cotangent complex notation: §5 alternates `L_{X/Y}` (definition) and `L_{X_0/k}` (worked example, line 631) without flagging that `Y = \Spec\,k` is the default. Consistent with refs but worth one connecting sentence.

### Undefined jargon
- §2 line 361 uses "**locally complete intersection** with controlled singularities" parenthetically, then §5 abbreviates "l.c.i." (line 626) without defining the abbreviation. moduli-spaces and algebraic-curves-higher-genus do not use this abbreviation; spell it out at least the first time in §5.
- §3 first paragraph (line 437): "to extend a first-order lift over $D$ to a second-order lift over $k[t]/(t^3)$" — "second-order" is intuitive, but the term **Artinian truncation** (used later in widget caption line 477) is not defined anywhere in prose.
- §3 lines 441 and §4 line 538 use **pro-represented / pro-representable** before §4's bullet (H4) gives its operational meaning. The first occurrence is "pro-represented by a power-series ring $k[\![t_1, \ldots, t_d]\!]$" — readers without Schlessinger context need one sentence: "pro-represented = represented in the limit by a complete local ring."
- §3 line 443 mentions **Bogomolov–Tian–Todorov** and **Ran's $T^1$-lifting** as one-liners — fine as references, but the phrase "miraculous cancellation" begs a sentence on what cancels (no callback either).
- §4 line 532 introduces a **hull** via the surrounding axiom list, but the noun "hull" appears in the (H4) bullet (line 538: "When (H4) holds along with (H1)–(H3), $\mathrm{Def}_{X_0}$ is **pro-representable** by a complete local Noetherian $k$-algebra $R$") *before* the formal definition of "hull" three lines below. Reorder or forward-reference.
- §4 line 535 axiom (H1) uses "**small extension**" two paragraphs before the widget readout (line 575) explains "small extension = kernel a one-dimensional $k$-vector space". Move the gloss into the bullet itself.
- §4 line 541 uses **Quot-schemes** and **moduli of stable bundles** as exemplars without callback — both are reasonable for the audience but neither is a registered topic, so a one-line forward pointer or `<aside class="note">` would be kinder.
- §5 line 619 writes "**simplicial $\mathcal{O}_Y$-algebra resolution**" before the widget step 2 (line 654) explains the term ("simplicial = face/degeneracy maps in every direction"). Either move that gloss into the prose or add a callback to a future simplicial-sets-and-nerve link.
- §5 line 631 mentions **Illusie's two-volume *Complexe cotangent et déformations* (SLN 239 + 283)** — this is fine as a literature pointer, but appears mid-paragraph without warning.
- §6 line 700 introduces **canonical bundle** `$\Omega^1_C$` matter-of-factly; algebraic-curves-higher-genus has a callback to it from `#riemann-roch`, the deformation-theory page does not (the existing `<aside class="callback">` only links to `#riemann-roch`, which is appropriate but doesn't cover canonical-bundle as such).
- §7 outro line 886 mentions **dgla / $L_\infty$-algebra** for the first time on the page; acceptable in an outro/forward-pointers section, but "Maurer–Cartan locus" (line 888) is a second piece of new vocabulary in the same paragraph. Consider a one-sentence "(see derived-categories for what an $L_\infty$-algebra is)" callback.

### Tone mismatches
- Tone is overwhelmingly consistent with the section peers: second-person occasional ("Why is the dual-number axis the right 'tangent direction'?", line 277), conversational asides ("the proof-scrubber below is the bridge", line 279), and reading-list pointers ("Read Illusie's two-volume...once and the obstruction-theoretic fog clears", line 631) — all on-brand.
- §3 line 443 phrase "**a miraculous cancellation**" reads slightly more colloquial than the surrounding rigor; moduli-spaces uses "remarkably tidy" (line 262) and "stunning fact" (curves line 429), so the register fits — but "miraculous" without a sentence of explanation invites a "ok, but *why*?" from the reader.
- §4 line 528 "Grothendieck and Schlessinger formalised the data into a functor" is dry textbook voice for one sentence — the surrounding paragraphs have more authorial color (e.g. "Schlessinger's 1968 paper *Functors of Artin rings* identifies four conditions"). Minor.
- §6 line 713 ends with "the kind of geometric feature only made possible by knowing $\mathcal{M}_g$ is $9$-dimensional and smooth here" — strong, on-brand pedagogical landing. Good benchmark for the rest.

### Missing worked examples
- _None._ Every numbered section (1–6) has at least one worked example AND an interactive widget. §7 ("Connections") is correctly outro-style without one.

### KaTeX macros / formatting
- Macro block (lines 22–29) declares `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind` — identical to moduli-spaces (lines 36–43) and the page actually uses `\Spec` and `\Hom`. No unusual local macros are introduced.
- §2 line 365 inline `$\dim H^1(C, T_C) = 3g - 3$` and §6 line 704 display `\dim H^1(C, T_C) = -\chi(T_C) = 3g - 3` — consistent.
- §5 line 628 writes `\mathrm{Ext}^1_{\mathcal{O}_X}(L_{X/Y}, \mathcal{O}_X)` — uses `\mathrm{Ext}` rather than the also-allowed `\operatorname{Ext}`. Both refs use `\mathrm{}`-style for these; consistent.
- §6 readout (line 819) uses `&nbsp;|&nbsp;` separators inside a string that gets re-rendered by KaTeX — works, but the `|` reads as math context to a careless eye; a `<span class="small">` separator would be tidier. Cosmetic.
- §6 axes labels (lines 814–816) use plain unicode `−` (minus sign) for the readout text — fine, but the SVG label "y = 3g − 3" mixes it with `(g ≥ 2)` (`≥` unicode) inside `'font-size':11`, while the body uses `\ge` in KaTeX. Cosmetic; consistent within the widget.
- Schlessinger H1 axiom (line 535) inline uses `\mathrm{Def}(A' \times_A A'') \to \mathrm{Def}(A') \times_{\mathrm{Def}(A)} \mathrm{Def}(A'')` — long inline formula; the section peers prefer to break long inline expressions to display mode (`$$`). Readable but might wrap awkwardly at narrow widths.
- No re-invented delimiters or non-standard helpers. Helper block (lines 189–241) is a verbatim copy of the category-theory.html template (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`).
- Widget chrome consistently uses `.widget / .hd / .ttl / .hint / .readout / .row` — no ad-hoc classes; the only quasi-custom CSS classes are `.tg-pick`, `.ob-pick`, `.schless-pick`, all scoped via `id` to a single widget and used as click targets, which is the established pattern (cf. moduli-spaces' `.w2-btn`, `.w3-btn` etc.).

## Severity
minor polish
