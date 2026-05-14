# positivity-and-ample-line-bundles — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** intersection-theory-chow, mmp-and-birational-geometry

## Summary
Page is in strong shape: voice matches the section peers, every numbered `<h2>` ships a widget, and notation lines up cleanly with both references. A handful of forward-referenced terms (`\partial\bar\partial`, "Chern class", "klt", "$N^1(X)_\mathbb{R}$") are used before a callback or definition lands.

## Findings
### Notation drift
- `\mathbb{Z}`, `\mathbb{R}`, `\mathbb{P}^n`, `\mathcal{O}(D)`, `\mathrm{Pic}`, `\overline{NE}(X)`, `\mathrm{div}`, `\mathrm{ord}` all match intersection-theory-chow and mmp-and-birational-geometry verbatim — no semantic drift.
- Cosmetic: target uses `\mathrm{div}`, `\mathrm{ord}`, `\mathrm{Amp}`, `\mathrm{Nef}`, `\mathrm{Big}`, `\mathrm{int}` directly rather than via the loader's `\operatorname{…}` family; intersection-theory-chow uses the same `\mathrm{…}` style (e.g. `\mathrm{rat}`, `\mathrm{length}`, `\mathrm{Tor}`), so this is consistent across the section. No action.
- Cosmetic: in `<h2>` 3 the spacing `N^1(X) /\!\equiv` (line "$N^1(X) = \mathrm{Pic}(X) /\!\equiv$") is the only place a kerned `\!` appears on the page; readable but visually tight.
- Widget SVG text drops back to plain ASCII (`P^1`, `O(d)`, `H^0`, `K_X`, `Ω^1`, `φ`, `⊗`) — both peers do the same, so this is house style for `text` nodes. No drift.

### Undefined jargon
- Hero subtitle: "a convex cone in $N^1(X)_\mathbb{R}$" appears before §3 introduces $N^1(X)$ as the Néron–Severi group. Acceptable as a teaser, but a one-clause gloss would soften the cold open.
- §5 first widget: "$\Theta(L, h) = -\partial\bar\partial \log h \in A^{1,1}(X)$" introduces Dolbeault operators and the space of $(1,1)$-forms with no callback. For an "advanced" page this is plausibly OK, but neither operator is named earlier on the page or hyperlinked to a host topic.
- §5 last paragraph ("…some integral Kähler class can be realized as the Chern class of a holomorphic line bundle") uses **Chern class** for the first and only time without a link to intersection-theory-chow §5, which owns the definition.
- §6 Kawamata–Viehweg note: "(allowing klt singularities downstream)" mentions **klt** before any definition; mmp-and-birational-geometry §5 owns the term, but there is no "See also" callback in this section pointing there.
- §4 prose "the $K_X$-negative extremal rays of $\overline{NE}(X)$ admit geometric contractions" — `extremal ray` appears here for the first time on the page; defined more carefully on the MMP page §2 (linked via the `Used in` block but not via a forward callback).

### Tone mismatches
- Voice is consistent with peers: conversational asides ("what goes up must come down" in §1; "the killer feature in algebraic geometry" in §6) match the intersection-theory-chow chattier register without sliding into casual.
- §6 paragraph "Why is this so much more useful than Kodaira?" rhetorical question hits the right Brilliant-style cadence.
- Minor: §5 widget verdict ("Cohomology table disagrees with Kodaira here — please report this as a bug.") leaks debug-author voice into the user-facing readout. Either trust the math or remove the failsafe message.
- §6 widget readout reuses unicode `≥`/`✓`/`✗` glyphs in the readout `<text>` node — peers do the same (mmp's MFS readout uses `→`), no drift.

### Missing worked examples
- All six numbered sections (§1–§6) carry an interactive widget; §7 "Connections" is a pure outro and matches the peer pattern (intersection-theory-chow §7 and mmp-and-birational-geometry §7 also skip widgets).
- §5 ("Kodaira embedding") is the most definition-heavy section; the widget shows the rational normal curve embedding but does not let the reader poke the Kähler/Riemann-form criterion that the prose centres on. A toy where the reader picks lattice parameters and sees whether a Riemann form exists would close the gap, but absence is not a gap of category — there is a widget present.
- §3 widget on `\mathbb{P}^1 \times \mathbb{P}^1` is intentionally the degenerate "first quadrant" example; the prose flags this. A second example (e.g. Hirzebruch $\mathbb{F}_1$ ample cone with the $-1$-curve constraint) would let the reader see a non-degenerate ample cone, but this is enhancement, not a missing-example flag.

### KaTeX macros / formatting
- Loader macros (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) are the cargo-culted six; none are actually invoked on the page (and the same is true of intersection-theory-chow and mmp-and-birational-geometry — all three pages carry the same boilerplate). Cosmetic only.
- Delimiters used are exactly `$…$` and `$$…$$`; no `\(…\)` or `\[…\]` re-inventions. Matches house convention.
- Helper block at top of `<body>` (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is a verbatim copy of the category-theory.html block.
- Widget chrome uses `.widget`, `.hd`, `.ttl`, `.hint`, `.readout`, `.row`, `.note`, `.pill` throughout — no ad-hoc classes detected.
- All seven `<svg>` widgets carry `viewBox` and a `<title>` sibling.
- §6 Kodaira-vanishing widget readout assembles "K_X ⊗ L = O(-' + (n+1) + ' + ' + d + ') = O(' + k + ')" — the intermediate form leaks raw arithmetic ("O(-3 + 1) = O(-2)"). Cosmetic; readers will parse it.

## Severity
minor polish

