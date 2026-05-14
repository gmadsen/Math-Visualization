# frobenius-and-reciprocity — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** quadratic-reciprocity, class-field-theory

## Summary
The page is well-structured and stylistically aligned with the two references; voice, KaTeX delimiters, helper block, and widget chrome are all consistent. Two real issues: a cosmetic Frobenius-notation split with class-field-theory, and a definition-free §5 (decomposition/inertia) that is the only section without a worked toy.

## Findings
### Notation drift
- `\mathrm{Frob}_\mathfrak{P}` / `\mathrm{Frob}_p` throughout `frobenius-and-reciprocity.html` (e.g. §4 "the unique element $\mathrm{Frob}_\mathfrak{P} \in G$") versus `\operatorname{Frob}_\mathfrak{P}` / `\operatorname{Frob}_\mathfrak{p}` in `class-field-theory.html` §4 ("the canonical generator, the **Frobenius** $\operatorname{Frob}_\mathfrak{P}$"). Both render similarly but a common page-level macro `\Frob` would lock this; cosmetic, low priority.
- `quadratic-reciprocity.html` §9 also uses `\mathrm{Frob}_p`, so target is consistent with QR but drifts from CFT. Settle on one — `\operatorname{Frob}` matches the existing `\operatorname{Spec}/\Gal/\Hom` macro family already in the head.
- Target uses `\overline{\mathbb{Q}}` (§1, §9); CFT uses `\overline{K}` for the analogue. Different scopes ($\mathbb{Q}$-only vs. arbitrary number field) so this is appropriate, not drift.
- `\mathrm{GL}_n` is used consistently across all three; no drift.

### Undefined jargon
- §2 widget caption "cycle shape of Frobenius" appears as the `hint` of `Factor f(x) bmod p` before Frobenius is defined in §4. The §1 note does pre-tease ("the Frobenius element"), so this is borderline rather than a hard violation, but a forward-pointer like "(formal definition in §4)" would tighten it.
- §2's second widget (`#w-frob-mult-clock`) hint "cycle structure of $a \mapsto x \cdot a$ in $(\mathbb{Z}/5)^\times$ matches the Frobenius cycle pattern" conflates two unrelated objects: the multiplication-by-$x$ permutation on $(\mathbb{Z}/5)^\times$ is not the same combinatorial datum as Frobenius cycle shape on roots of a polynomial. Reader will be misled into thinking this widget visualizes Frobenius. Semantic, medium priority.
- §8 "the principal binary quadratic form $x^2+xy+6y^2$" is used without callback to `quadratic-forms-genus-theory.html` (which owns `binary-forms-basics`). Add a `<aside class="callback">` link.
- §9 mentions "étale cohomology of a variety $X/\mathbb{Q}$" and "$\mathbb{Q}_\ell$" without callback; acceptable for a forward-looking "where this leads" section.

### Tone mismatches
- §5 ("Decomposition and inertia groups") is the densest paragraph block on the page — orbit–stabiliser, residue field, kernel, short exact sequence all crammed into two paragraphs with one `.ok` summary and no widget. Compared to QR §5 (Gauss's lemma) which has a dedicated visualizer, the contrast is sharp. Voice is fine; rhythm is the problem (formulas-without-narration wall).
- Otherwise tone matches both references well — conversational scaffolding, second-person occasionally ("Try the widget", "Visualise it"), and clear stakes-setting in the hero.

### Missing worked examples
- §5 "Decomposition and inertia groups" has no widget and no concrete numerical example (e.g. tracking $D(\mathfrak{P})$ and $I(\mathfrak{P})$ for a specific prime in $\mathbb{Q}(\sqrt[3]{2})$ or $\mathbb{Q}(\zeta_8)$). The two reference pages each give every numbered §2+ section a toy. High priority — this is the one structural gap.
- §7's "Cyclotomic Galois group" widget could double as a §5 example if a "show inertia" toggle were added at $p \mid N$, but currently §5 stands alone.

### KaTeX macros / formatting
- No unusual macros invented; head-block macro list `\Spec, \Gal, \Hom, \tr, \ad, \ind` is identical across all three pages.
- Standard delimiters `$…$`, `$$…$$` only; no re-invented brackets.
- §4 inline `(\mathcal{O}_K/\mathfrak{P}_i : \mathbb{F}_p)` (§3) uses `[…:…]` correctly; §5 uses `\Gal\!\left(…\right)` with explicit `\!` spacing tweak — fine.
- Page does not use code fences, glossary popovers, or any of the more recent infrastructure beyond what the references use; no surface for accidental innovation.

## Severity
minor polish (cosmetic Frobenius-notation drift; mid-priority §2 widget caption + §5 missing-example gap)
