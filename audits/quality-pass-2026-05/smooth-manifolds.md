# smooth-manifolds — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** differential-geometry, differential-forms

## Summary
Strong page overall — eleven well-paced sections, each with a working widget, and the three-equivalent-definitions §4 is exemplary. Two real defects: a cluster of broken internal section cross-references (pointing readers to §6/§7 when the content lives in §7/§8), and small but consistent notation drift against the section's other two pages (`\mathbb{RP}^n` vs `\mathbb{R}P^n`, `\mathrm{SO}(n)` vs `SO(n)`, `\coprod` vs `\bigsqcup`).

## Findings
### Notation drift
- `\mathbb{RP}^n` / `\mathbb{CP}^n` (smooth-manifolds:456, 1606, 1612) vs `\mathbb{R}P^n` / `\mathbb{C}P^n` (differential-geometry:2261, 2263). Semantic drift — same object, two house renderings. Recommend settling on `\mathbb{RP}^n` (the more common modern form) corpus-wide; the smooth-manifolds rendering is the one to keep.
- Lie-group families styled `\mathrm{SO}(n)`, `\mathrm{O}(n)`, `\mathrm{GL}_n(\mathbb{R})`, `\mathrm{SU}(n)` (smooth-manifolds:466–470) vs upright `SO(n)`, `GL_n(\mathbb{R})`, `SU(n)` (differential-geometry:2262). Cosmetic, but readers landing from differential-geometry will see two different typesettings of "the same" group.
- `TM = \coprod_{p\in M} T_pM` (smooth-manifolds:814) vs `TM = \bigsqcup_{p\in M} T_pM` (differential-geometry:2257). Both denote disjoint union; pick one — `\bigsqcup` is more common in modern geometry texts and is what differential-geometry already uses.
- Internal inconsistency: smooth-manifolds itself oscillates between `\partial_i` (line 657, 1183) and `\frac{\partial}{\partial x^i}` (line 658, 823) within consecutive paragraphs. differential-forms is uniform on `\frac{\partial}{\partial x^i}`. Cosmetic.
- Smooth-manifolds uses `\mathfrak{X}(M)` for vector fields (line 824, 997, 1181). Neither reference page ever introduces a notation for the space of vector fields, so this is an untranslated dialect rather than drift, but worth noting if a future "global notation" pass happens.

### Undefined jargon
- "parallel-transport[ed]" — used in the Möbius-band widget caption (smooth-manifolds:1595, "A frame (green + violet arrows) is parallel-transported once around") and in the script comment (1624). Parallel transport is a connection-dependent notion that the page does not introduce; it appears for the first time in the §10 widget chrome that is asking the reader to understand what's being shown. The widget's actual mechanism (rotate-by-θ/2 around the strip) is geometrically unambiguous, but the *word* lands cold. Either reword ("a frame transported continuously around") or add a one-line gloss. This is the most pedagogically expensive jargon hit on the page.
- "distributions" / "integral manifolds of distributions" — smooth-manifolds:1364, "useful for integral manifolds of distributions". Not defined anywhere on the page; readers without background in Frobenius theory bounce.
- "foliations" — smooth-manifolds:1210 ("Non-commuting fields generate higher-dimensional foliations"). Used as the punchline of the Lie-bracket §7 note without prior introduction.
- "Frobenius" — same line 1210 ("…simultaneously (Frobenius)"). A bare attribution; no explanation of what theorem is being credited.
- "densities" — smooth-manifolds:1614 ("integration of forms still makes sense on *densities* — see the differential-forms page"). The differential-forms page does *not* in fact define densities; this dangling pointer goes nowhere. (Verified: no `densit` match in differential-forms.html.)
- "second countability gives partitions of unity" (smooth-manifolds:286) — partitions of unity are forward-referenced in §1 but only defined in §9. Acceptable as a teaser, but consider adding "(see §9)".

### Tone mismatches
- The hero deck and §1–§4 set a conversational, second-person-when-useful voice that matches category-theory.html's house style ("we will not touch such wonders", "enough tangent planes for a career"). This carries through most of the page.
- §2 "Examples" reads as a formula table dump. Five subsections in a row, no widget, no "try this" gesture, no narration between examples — closer to Lee's textbook than to differential-geometry.html which interleaves examples with widgets at every step. Drier than the surrounding tone.
- §11 "Connections to the rest of the notebook" is solid and matches differential-geometry.html's §11 "Coda" perfectly. No issue.
- Compared to differential-forms' frequent "**Picture.**" and "**Slogan.**" callouts inside `note` blocks, smooth-manifolds is more austere — no slogan-lines, fewer mnemonics. Not a defect, but a stylistic gap if the reviewer wants to harmonise voice across the section.

### Missing worked examples
- §2 "Examples" has no widget and no toy. Every other numbered §1–§10 has at least one. Section is pure prose-plus-table. A minimal sketch — e.g. an interactive RP^n / Grassmannian visualiser, or even a static SVG showing the affine-chart cover of RP^2 — would close this gap.
- §3 "Smooth maps and diffeomorphisms" has the rank widget, which is good, but the pushforward `df_p` is never given a concrete numerical example or a worked computation in any chart. The widget shows rank patterns; it does not let the reader watch a tangent vector get pushed forward. A "pick a chart, pick a vector v, see (df_p)(v)" toy would match the §4 "three curves, one tangent vector" widget's level of concreteness.
- §11 has no widget by design (it is the outro), so no flag.

### KaTeX macros / formatting
- No locally-defined macros in the page beyond the standard six (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) shared with differential-geometry and differential-forms. Clean.
- All four supported delimiters (`$…$`, `$$…$$`, `\(…\)`, `\[…\]`) present and used appropriately; no exotic delimiters.
- Helper block at lines 194–250 is verbatim from the canonical category-theory.html template *plus* an added local `fmt(x, p=3)` helper (lines 244–249) used for readout formatting. Per AGENTS.md "Don't rewrite the helper block in a new style — copy from `category-theory.html`", the addition is a mild deviation. Other pages keep their formatters scoped inside the widget IIFE; consider doing the same here, or accepting `fmt` as a de-facto standard helper and porting it to the canonical template.
- Widget title elements use `<span class="ttl">…</span>` (line 295 et al.) where category-theory.html and differential-geometry.html both use `<div class="ttl">…</div>`. differential-forms.html also uses `span`, so smooth-manifolds is consistent with one peer and inconsistent with the canonical. Cosmetic; CSS handles both.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.note`, `.ok`, `.bad`) is otherwise correctly used throughout — no ad-hoc classes.
- Section cross-reference bugs (semantic drift, not formatting):
  - Line 473: "section 7 explains why preimages of regular values are manifolds" — regular-value content is in §8 ("Immersions, submersions, embeddings"), not §7 ("The Lie bracket").
  - Line 494: `<li><strong>Embeddings, immersions, submersions</strong>: see §7.</li>` — same; should be §8.
  - Line 517: "the constant-rank theorem, which powers §7" — should be §8.
  - Line 1031: "Lie bracket $[X,Y]$ — the subject of §7" — *correct*; this one's fine.
  - Line 1724: "Lie algebra under the bracket from §6" — Lie bracket is in §7, not §6 (§6 is "Integral curves and flows"). Off by one in the other direction.
  These four off-by-one references across §2/§3/§5/§11 suggest the page was renumbered at some point and the prose pointers weren't reflowed. High-priority, semantic.

## Severity
minor polish (with the exception of the four broken §-pointers, which are silent navigation bugs and should be patched on the next content pass)
