# singular-cubics-reduction — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** elliptic-curves, bezout

## Summary
Voice, KaTeX delimiter usage, and notation are tightly aligned with `elliptic-curves.html` and `bezout.html` — this page reads as a direct continuation of the elliptic-curves arc. Two real polish items: section 8 has no widget (definitions only), and a small cluster of named-but-undefined arithmetic terms (Néron model, ℓ-adic Galois representation, j-invariant, Cremona label) shows up in side notes without callbacks.

## Findings
### Notation drift
- `\mathrm{Frob}_p` at line 830 ("swapped by the Frobenius $\mathrm{Frob}_p$") — neither `elliptic-curves.html` nor `bezout.html` uses an explicit Frobenius symbol; `elliptic-curves.html` line 781 prefers prose ("eigenvalue of Frobenius"). Cosmetic — but the same page's macro block defines `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind` and could have introduced `\Frob` if the symbol was wanted in multiple places.
- `C_{\mathrm{node}}` and `C_{\mathrm{cusp}}` (lines 324, 328) use `\mathrm{}` for multi-letter subscripts, while elliptic-curves favors plain prose labels ("the nodal cubic"). Low priority — `C^{\mathrm{sm}}` for the smooth locus is reused consistently throughout, so internally coherent.
- The page mixes `\bmod`/`\pmod p` (line 686 readout, line 537 prose) with prose "modulo $p$" (line 525). Both forms appear in elliptic-curves and bezout — no drift, just noting it for eyes-on consistency.
- Display readouts use Unicode math glyphs ("Δ", "α", "𝔾ₘ", "𝔾ₐ", "Ẽ", "↦") inside `out.textContent` (lines 286, 496, 501, 813, 919-928). Reference pages keep their readouts ASCII-only (`elliptic-curves.html` line 322: `'Delta = -16(4a^3 + 27 b^2) = '`). Cosmetic; pleasant but a divergence.

### Undefined jargon
- "$j$-invariant $0$" appears at line 1084 in the worked example with no on-page definition or `<a>`/callback to `elliptic-curves.html#j` (which does define it). First offending sentence: "The curve has $j$-invariant $0$, and an analysis at each bad prime shows…". This is the strongest case — the term is load-bearing for the example that follows.
- "$\ell$-adic Galois representation" (line 1080) — first and only mention; a quiet inline gloss like "see p-adic-numbers" or a `<a>` to a future page would help. Today the reader meets the phrase in a list item with no scaffolding.
- "Néron model" appears three times (lines 519, 1056, 1068) as the rigorous justification for the multiplicative/additive vocabulary, but is never even glossed (e.g. "the smooth group-scheme model over $\mathbb{Z}_p$"). The reader can survive without it, but it is invoked as authority three separate times.
- "weight-$2$ cuspidal eigenform" and "local Hecke eigenvalues" (line 1058) appear in a forward-reference note with no callback link. `modular-forms.html` is referenced two paragraphs later in section 8 — wiring the link into the note would make the bridge concrete.
- "Cremona label 11a1" (line 1089) is dropped without explanation. Mild — a parenthetical "(LMFDB shorthand for an elliptic curve)" would suffice.
- "tangent cone" appears as the `<h3>` title at line 766 ("How to tell node from cusp from the tangent cone") and the prose immediately under it talks about "lowest-order terms" without ever using or defining the phrase "tangent cone." The header term is jargon the body never picks up.

### Tone mismatches
- Section 8 ("Minimal Weierstrass models and the conductor") slips into textbook density: three consecutive `<div class="note">` / `<div class="ok">` blocks (lines 1068, 1076) deliver definition–theorem–corollary with no widget or interactive moment to break the rhythm. By contrast `elliptic-curves.html` § 6 (Mordell) keeps the same density of formal statement but punctuates with concrete examples; `bezout.html` § 7 keeps a worked numeric example in every subsection.
- Hero subtitle uses scare-quotes ("group law") and a slightly more colloquial register ("the first glimpse of a local $L$-factor") than the references — this is fine and on-template, but the rest of the page is more formal than the hero promises. Minor voice mismatch within the page itself.
- The "looks cuspidal" / "node forming" / "cusp forming at origin" readouts (lines 296, 932) are nicely conversational. The body prose, especially in §§4–6, is comparatively dry — the gap between widget voice and prose voice is wider than on `elliptic-curves.html`.

### Missing worked examples
- **§ 8 Minimal Weierstrass models and the conductor** has zero `class="widget"` blocks. It is pure exposition + one numeric worked example ($y^2 = x^3 + 1$). A "conductor calculator" widget — pick from the drop-down list and read off $f_p$ for each bad prime — would parallel the existing `w-fibration` and `w-dtable` widgets and give the reader something to poke. Per AGENTS.md ("every numbered `<h2>` section should have at least one concrete computation or widget"), this is a real gap.
- The short statement at line 519 (multiplicative ↔ $\mathbb{G}_m$, additive ↔ $\mathbb{G}_a$) is asserted but the parametrization of the cuspidal smooth locus by $(t^2, t^3)$ → $\mathbb{G}_a$ never gets a worked group-law instance the way `elliptic-curves.html` § 2 demonstrates chord-and-tangent on a sample $P + Q$. The `w-param` widget shows the parametrized point sweeping but does not animate addition $t_1 + t_2 \mapsto $ point on the curve. Adding a "pick $t_1, t_2$, see $t_1 \cdot t_2$ on the nodal curve" interaction would tighten the analogy with elliptic-curves.

### KaTeX macros / formatting
- The page's macro block (lines 22–29) is byte-identical to elliptic-curves and bezout — no local re-invention. Good.
- No new macros introduced; everything uses standard KaTeX. Good.
- One inline-style escape: line 537 uses `i.e.\ an elliptic curve` (escaped space after `i.e.`) which renders fine but is unusual — `elliptic-curves.html` does the same (line 1058) so this is in-house style, not drift.
- Helper `<script>` block at top of `<body>` (lines 185–193) defines only `$`, `$$`, `SVG` — it omits `ensureArrow`, `drawArrow`, `drawNode` that `elliptic-curves.html` (lines 195–238) and `category-theory.html` (lines 195–238) include verbatim. The page does not use those helpers, so nothing is broken, but AGENTS.md says "Copy verbatim from category-theory.html (2D)" — this is a deviation from the conventional helper boilerplate. Either (a) restore the full block for consistency, or (b) note in a comment that the trimmed block is intentional.
- `<svg>` tag pattern (e.g. line 239) puts the `<title>` element correctly inside the SVG and includes `viewBox` — chrome hygiene clean.
- All widgets use the standard `.widget` / `.hd` / `.ttl` / `.hint` / `.row` / `.readout` / `.note` / `.ok` chrome — no ad-hoc classes spotted.
- Backlink block at line 641 sits inside the `<section id="reduction">` body just before the quiz placeholder, with three `<aside class="related">` items including two self-references (`./singular-cubics-reduction.html#badtypes`, `./singular-cubics-reduction.html#counting`). Self-referential backlinks read oddly; this is auto-generated but worth flagging the human-visible result.

## Severity
minor polish
