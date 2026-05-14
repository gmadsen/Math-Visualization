# morphisms-fiber-products — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** schemes, functor-of-points

## Summary
A strong, generally well-written page whose narrative voice, KaTeX usage, and helper-block scaffolding are well aligned with both reference peers; the capstone $x^2-a$ family is the single clearest worked example in the trio. Concrete pedagogy gaps: §5 (base change) and §8 (separated/proper) ship with no widget, the §8 stability table targets an undefined CSS class, and a few section-headline terms (étale, finite flat, valuative criterion) appear in prose before they are defined.

## Findings
### Notation drift
- `\mathsf{Sch}` / `\mathsf{Ring}` are used consistently across all three pages (target line 304, 349; functor-of-points line 268, 272; schemes uses `\Spec\mathbb{Z}` more freely without category names). No drift.
- `\mathfrak{p}`, `\mathfrak{q}`, `\mathfrak{m}`, `\kappa(\mathfrak{p}) = \operatorname{Frac}(R/\mathfrak{p})` match the schemes-page convention exactly (target line 1058 vs schemes line 226, 1358).
- `\mathbb{F}_p`, `\mathbb{Q}`, `\mathbb{Z}`, `\mathbb{A}^n_k`, `\mathbb{P}^n_k` consistent everywhere — no `\F`/`\Z`/`\Q` shorthands introduced.
- Cosmetic only: target uses `\Spec{}k[t]_{(t)}` (line 296) with the empty-group `{}` separator while functor-of-points and schemes write `\Spec\,\kappa(s)` or just `\Spec\mathbb{Z}`. Both render correctly; pick one across the three.
- Cosmetic: target alternates `f^{\#}` (line 287) and `i^{\#}` (line 621). The `\#` superscript is consistent with itself but worth noting that schemes.html uses `i^{\sharp}`-free prose (talking around the symbol). Not a drift, but the convention of "use `\#` for sheaf-pullback" is established only on this page.

### Undefined jargon
- §5 (base change): "Étale away from the branch locus" (line 1558) — *étale* is used in the running prose with no definition, no callback, and the `coda` (§9) explicitly admits "étale morphisms and the étale site" is one of the pages "that should exist but don't yet." The `Étale cohomology` link in the §1 backlinks aside is not a definition. Quote: "Away from $a=0$ and away from characteristic $2$, fibers are étale".
- §7: "Finite flat of degree $2$" (line 1557) and the §5 `note` on flatness (line 1040) both arrive before any definition of a *finite morphism*. Flatness gets a one-sentence inline gloss; "finite" is left unexplained.
- §8: the *valuative criterion of properness* is named (line 1783) and stated, but "discrete valuation ring" / "fraction field" appear without prior callback (no `<aside class="callback">` to `commutative-algebra.html` for DVRs).
- §1 forward-references the *functor of points* (line 314: "These form a set $X(k) = \Hom_{\mathsf{Sch}}(\Spec k, X)$. The functor $k\mapsto X(k)$ ... is called the *functor of points*") in passing; this is fine because there's a callback aside, but the cross-page link to `functor-of-points.html` should be in the inline prose, not only in the auto-injected backlinks.
- §8 mentions `quasi-projective scheme` (line 1777) without definition or callback; mild because the target audience is graduate.

### Tone mismatches
- §1 is unusually meandering vs the §1s of `schemes.html` ("Why schemes?" — three crisp problems and a pivot) and `functor-of-points.html` ("The reframe" — two-bullet posture summary). The target's §1 contains a long, almost stream-of-consciousness paragraph (line 296: "and the inclusion $k[t]_{(t)}\hookrightarrow \operatorname{Frac}(k[t]_{(t)})=k(t)$ followed by… wait, that lands in a different ring") whose mid-sentence "wait, that lands in a different ring" reads as a draft note left in. Fix: tighten to a single clean counterexample.
- §1 also has two `<div class="note">` blocks on locally ringed spaces back-to-back (line 304 and line 312) saying overlapping things — the second restates the first. The reference pages typically have one `note` per beat.
- Otherwise voice is well matched: second-person "Slide $a_0$ and pick a prime" (line 1298), house "Slogan." admonitions (line 873, 1803), and worked-example callouts mirror category-theory / schemes conventions.

### Missing worked examples
- **§5 Base change** (line 1017): zero widgets. Three good textual examples (complexification, reduction mod $p$, generic fiber) but no slider/poke. Compare to functor-of-points §9 ("Base change as pullback of functors") which also lacks a widget — but that page front-loads its functor widgets in §1–§5. Here the natural toy is "pick $S' \to S$ from a menu and watch $X \times_S S'$ recompute," which is essentially what the §7 capstone widget does — could be promoted/duplicated here.
- **§8 Separated and proper** (line 1764): zero widgets. The doubled-origin line begs for a clickable two-chart picture (it is *the* canonical visualization). Schemes §7 ("Gluing: building ℙ¹") uses exactly this pattern — could be cribbed.
- **§9 Coda** has no widget, but coda sections being prose-only is the corpus convention (cf. functor-of-points §7 preview, schemes §10 locally ringed spaces).
- All other sections have a widget; §7 has two (the family + the pullback square). Coverage is otherwise excellent.

### KaTeX macros / formatting
- Macro block (target lines 22–29) is byte-identical to the `Spec / Gal / Hom / tr / ad / ind` set in functor-of-points (lines 37–44) and the inline macros block in schemes (line 10). No new macros introduced. Good.
- KaTeX delimiters: `$…$`, `$$…$$`, `\(…\)`, `\[…\]` — standard configured set, no inventions.
- `<table class="plain">` is used at §8 line 1793 (the "stability properties" table) but **the `table.plain` CSS class is not defined in this page's `<style>` block.** It *is* defined in `functor-of-points.html` lines 123–125. The table will render with browser-default styling instead of the house grey/border-bottom look. Either inline the three CSS rules or convert to a `<ul>`.
- Section headings mix Markdown-style (`The base: $\Spec\mathbb{Z}[a]$`) with no issues; KaTeX renders cleanly inside `<h3>`.

## Severity
minor polish
