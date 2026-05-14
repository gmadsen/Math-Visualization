# modular-forms — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** upper-half-plane-hyperbolic, hecke-operators

## Summary
The page reads well overall — the prose has the conversational-but-precise voice the section establishes — but a handful of semantic notation slips (most notably `\mathcal{H}` vs `\mathbb{H}` and an undeclared `\Gamma` in the Petersson integral) and a fully widget-less section 9 are worth fixing before merge.

## Findings

### Notation drift
- The upper half-plane is `\mathbb{H}` throughout `upper-half-plane-hyperbolic.html` (e.g. `<h2>1. $\mathbb{H}$, the upper half-plane</h2>`) and `\mathcal{H}` throughout this page (hero sub: `Functions on $\mathcal{H}$ that transform...`). Hecke-operators uses `\mathcal{H}` too, so the references disagree — but the disagreement should be flagged in the modular-forms-and-L-functions arc. Settle on one symbol corpus-wide; `\mathcal{H}` is the more common convention in the modular-forms literature, but the prereq page sets `\mathbb{H}`. Semantic, low-to-medium severity.
- **Internal inconsistency (semantic, high severity).** Section 9 line 1155 abruptly switches to `\mathbb{H}`: `\int_{\Gamma\backslash \mathbb{H}} f(\tau)\,\overline{g(\tau)}\,...` while every other formula on the page (and the surrounding prose at line 1154) uses `\mathcal{H}`. Cosmetic-looking but two different macro choices for the same set in the same section is a reader trip-hazard.
- Same line: `\Gamma\backslash \mathbb{H}` introduces an unbound `\Gamma`. The page is exclusively about `\mathrm{SL}_2(\mathbb{Z})` (level 1); `\Gamma` is never declared as shorthand. Use `\mathrm{SL}_2(\mathbb{Z})\backslash\mathcal{H}` to match the rest of the page, or introduce `\Gamma` once with `:= \mathrm{SL}_2(\mathbb{Z})`. hecke-operators line 947 uses the explicit `\mathrm{SL}_2(\mathbb{Z}) \backslash \mathcal{H}` form.
- One backlink (line 421) renders the full half-plane via `\Gamma_0(N) \backslash \mathbb{H}`, again the rival convention. Cosmetic since the backlink is auto-injected, but it lands inside the page so readers see the mismatch.
- "Widget N" headers (lines 278, 439, 575, 715, 842, 965, 1063) prefix every widget title — neither hecke-operators (titles like "The spectral decomposition of $M_k$") nor category-theory (the canonical "Composition explorer") nor most of upper-half-plane uses this style. (Upper-half-plane does use `W1`, `W2`, ... but the modular-forms `Widget 1 ·` form matches no peer.) Cosmetic.

### Undefined jargon
- "automorphy factor" appears at the section-4 widget chrome (line 575 hint and line 588 `aria-label`) before the page ever uses the word in prose; the only prior reference is "weight-$k$ factor $(c\tau+d)^k$" in the same widget title. First-time readers without prior modular-forms exposure won't connect the two. Add a one-liner in the prose directly above the widget: `the factor $(c\tau+d)^k$ — called the` ***`automorphy factor`*** `— ...`.
- "newform" appears in the closing note of section 9 (line 1167: `for a weight-$2$ newform attached to an elliptic curve $E/\mathbb{Q}$`). The page has not introduced the new/old decomposition (which only makes sense at level $N>1$, never set on this page). Either drop "newform" for "Hecke eigenform" here or footnote that at level 1 every eigenform is a newform.
- "level $N$" / `(n,N)=1` appears at line 1163 inside the Petersson section: `Hecke operators $T_n$ with $(n,N)=1$ are self-adjoint`. The page has not defined level $N$; the entire setup has been level 1 (so $N=1$ and the coprimality is vacuous). Either say "for level-1 forms (the case here) every $T_n$ is self-adjoint" or strike the `(n,N)=1` qualifier.
- "Ramanujan's congruence" (line 710 table cell: `the $691$ in the denominator is the reason for Ramanujan's congruence`) is name-dropped without statement — the reader has no way to recover what `$\tau(n) \equiv \sigma_{11}(n) \pmod{691}$` means from context. Either state it in one line or strike the reference.
- "Eichler–Shimura" / "Taniyama" appear in the hero prerequisites note (line 218) before any `q`-expansion-of-eigenforms machinery has been built. Borderline — they're flagged as forward pointers — but a first-time reader stares at them with no anchor. Acceptable as advanced-tease.

### Tone mismatches
- The page mostly hits the section voice well. Two passages drift toward dry textbook register without recovery:
  - Section 4 line 567: `If $k$ is *odd* the transformation law applied to $-I$ ... forces $f = (-1)^k f$, so $f \equiv 0$.` is a single dense computational sentence without the "and here's why you should care" follow-up the references give (compare hecke-operators line 268-271, which explicitly narrates why the spectral structure matters before computing).
  - Section 7 ring-structure paragraph (lines 1050-1052): `Collecting all weights, $M_* = \bigoplus_k M_k$ is a graded $\mathbb{C}$-algebra. ... $M_*(\mathrm{SL}_2(\mathbb{Z})) = \mathbb{C}[E_4, E_6]$` arrives without the "this is the punchline of the chapter" build-up the canonical category-theory.html provides for similarly central theorems.
- No over-casual / meme-tone slippage detected. Worth noting that the references both employ second person occasionally (`watch the bar...`, `slide $v_1, v_2$ and watch...`) — modular-forms also does this in widget hints (line 232 `drag v₁ and v₂`), so consistent.

### Missing worked examples
- **Section 9 (Petersson) has no widget** (line 1153 onward; only a `<div class="quiz">` and a `<aside class="related">` close it). Compare hecke-operators §6 which has the `Petersson integral on the fundamental domain` widget showing the hyperbolic-measure dot density. The dimension/identity-verification rhythm of every prior section breaks here. A small toy — even a static SVG of the fundamental domain with `y^{k-2}` density shading — would restore the page's pedagogical rhythm. High priority.
- Sections 3, 6, 7 each have a widget but no `<div class="quiz">` placeholder. (Section 3 has the tile toy; section 6 the j-heat-strip; section 7 the dimension bars.) AGENTS.md's rule is one quiz per *concept*, not per `<h2>`, so this is not strictly required — but the modular-forms concept graph likely covers fundamental domain / j-invariant / dimension formula as separate concepts that deserve their own gates. Verify against `concepts/modular-forms.json`. Medium.

### KaTeX macros / formatting
- The page's macro list (lines 38-45) defines `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind` — identical to upper-half-plane and hecke-operators. No drift. `\Gal` is used at line 1124; the others are not invoked on this page (could prune for parsimony but harmless).
- No locally-defined macros, no novel delimiters. KaTeX usage is canonical.
- Widget chrome uses `<span class="ttl">` / `<span class="hint">` (e.g. line 278); the canonical category-theory.html and hecke-operators both use `<div class="ttl">` / `<div class="hint">`. Both render via the shared CSS, but the inconsistency is real (modular-forms has 15 ttl uses split across asides and widget headers, vs. category-theory's 27 all-`<div>`). Cosmetic.
- **Helper-block hygiene (medium severity).** The 2D helper block at lines 186-194 of modular-forms only defines `$`, `$$`, `SVG` — it omits `ensureArrow`, `drawArrow`, `drawNode` that AGENTS.md says to copy verbatim from `category-theory.html`. The omission is invisible because no widget on this page calls those helpers (each builds raw SVG arrows itself), but it deviates from the house convention. Both references have the full helper block (upper-half-plane has `ensureArrow`, hecke-operators has all three). Copy the canonical block for consistency even if currently unused.

## Severity
minor polish (one high-severity item — section 9 lacks a widget; one semantic notation slip in section 9; rest is cosmetic and jargon-callback hygiene)
