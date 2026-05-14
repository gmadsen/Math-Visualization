# upper-half-plane-hyperbolic — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** modular-forms, hecke-operators

## Summary
Voice, widget rhythm, and KaTeX macros are well-aligned with the section peers; the one semantic drift worth fixing is the symbol used for the upper half-plane itself (`\mathbb{H}` here, `\mathcal{H}` everywhere downstream), and a handful of stale forward-pointers ("forthcoming", "Wave 1/2") that contradict the now-published `modular-forms.html`.

## Findings
### Notation drift
- **High priority — semantic.** Target writes the upper half-plane as `$\mathbb{H}$` throughout (TOC line 204, h2 line 228, definitions lines 230/263/513/516/519/etc.); both peers exclusively use `$\mathcal{H}$` (`modular-forms.html` lines 199, 217, 265, 268, 421, 434–435, 561, 838, 842; `hecke-operators.html` lines 330, 947). A reader following the cross-page link "the upper half-plane" from `modular-forms.html#sl2z` lands on a page where the symbol they just learned (`\mathcal{H}`) does not appear at all. Recommend: settle on `\mathcal{H}` site-wide for the half-plane, freeing `\mathbb{H}` for the quaternions / horosphere boundary use it traditionally carries.
- **Medium priority — semantic clash.** Target uses bare `$F$` for the fundamental domain ("$F = \{\,z\in\mathbb{H}:\ldots\}$" line 1096; widget title line 1100); modular-forms uses calligraphic `$\mathcal{F}$` (line 435). Same pedagogical object, two glyphs across adjacent pages.
- **Low priority — cosmetic.** Target writes the lattice variable as `$z = x+iy$` and prefers `$z, w$` for points; the modular-forms peer immediately switches to `$\tau$`. Switching halfway through the section in §8 ("$z \mapsto z+1$" line 1097 next to the discussion of `$\tau$`-quotients in §9) creates a small reader-tax. Not a defect but worth noting if a unified pass is done.
- **Low priority.** Coordinate-part operators are written `$\mathrm{Im}(z)$`, `$\mathrm{Re}\,z$` (lines 384, 514–516, 1096) — peers do the same (`modular-forms` line 268, 435, 844). Consistent; flagged only to confirm no drift.

### Undefined jargon
- "**properly discontinuous**" appears in §8 line 1092 with an in-line gloss ("every point has a neighborhood only finitely many of whose translates meet it") — handled fine.
- "**orbifold**" line 1092 ("non-compact orbifold of finite hyperbolic area $\pi/3$") is dropped without definition, gloss, or callback to `riemann-surfaces.html`. First-time reader of the section won't know whether this is jargon they should chase.
- "**symmetric space**" and "**Bargmann's discrete, principal, and complementary series**" line 1273 in §9 sit inside a forward-pointer bullet without a definition. Acceptable in a closing "where this leads" list, but neither has a callback link, unlike the surrounding `<a href="./lie-groups.html">` mention.
- "**Fuchsian group**" (line 1270) is glossed in-line ("torsion-free discrete $\Gamma \subset \mathrm{PSL}_2(\mathbb{R})$") — handled fine.
- "**ideal triangle**" (§6 line 799) is introduced and immediately defined in parentheses — handled fine.

### Tone mismatches
- **§2 line 265 — voice break.** The sentence "(Euclidean steps get cheaper in hyperbolic terms? no — *more expensive per Euclidean unit*? let's be careful)." reads as an author-thinking-aloud aside. The peers never do this; both `modular-forms` and `hecke-operators` keep an even, declarative voice even when motivating choices. Pedagogically it is also unsettling — the reader is told the explanation is unreliable mid-stream. Recommend: rewrite as a single confident clause ("Concretely: a horizontal Euclidean segment from $(0,y)$ to $(L,y)$ has hyperbolic length $L/y$, so equal Euclidean steps cost more hyperbolic length the closer to the real axis you are.").
- **§9 line 1276 — meta-leakage.** "Related Wave 1 pages (coming / here): `quadratic-reciprocity.html`, `sums-of-squares.html`, ..." exposes internal authoring jargon ("Wave 1") to the reader. Peers never reference wave numbers; they either link plainly or omit. Same issue at line 1269 ("Wave 2") and line 1114 ("forthcoming") — see "Stale forward-pointers" below.
- Otherwise the page's tone matches the section: conversational-but-precise, with motivation paragraphs followed by display formulas, and theorem boxes for the punch lines.

### Missing worked examples
- Every numbered `<h2>` has at least one widget; section 9 ("Why this page exists") is the natural exception (it is a closing "where this goes" list, paralleling §7 of `hecke-operators` which is similarly widget-free).
- §1 ("$\mathbb{H}$, the upper half-plane") is light: the section's only interactive content is a `<div class="quiz">`, no widget. The lone `note` block previews modular forms but does not invite the reader to poke at $\mathbb{H}$ itself before the metric arrives. Modular-forms §1 (lattices) and Hecke §1 ("Among all modular forms…") both ship an interactive widget. Consider promoting the planar picture from W1 to a teaser here, or adding a one-knob "open vs closed half-plane" toggle.

### KaTeX macros / formatting
- All math uses approved delimiters (`$…$`, `$$…$$`); no invented ones.
- Macro block (lines 36–43) is a verbatim copy of the canonical set (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`); identical to peers — no local re-definitions.
- `\operatorname{arcosh}` at line 384 is fine (not a defined KaTeX symbol; `\operatorname` is the right escape hatch). No drift.
- `$\partial\mathbb{H}$` (lines 266, 382, 651, 799) — clean usage; suggest mirroring the `\mathcal{H}` switch above to `$\partial\mathcal{H}$`.
- Widget header convention drift (cosmetic): target uses `W1 · …`, `W2 · …` (lines 269, 387, 523, …); both peers use `Widget 1 · …`, `Widget 2 · …`. Different abbreviation, same chrome — but it does mean a reader scanning the section's widget index would see two different naming schemes for adjacent pages.

### Stale forward-pointers (worth a small follow-up)
- Line 1114: "The full theory picks up in `<code>modular-forms.html</code>` (forthcoming)." — `modular-forms.html` is now live; the parenthetical is wrong. Replace with a normal `<a href="./modular-forms.html">`.
- Line 1269: "*Forward pointer: `<code>modular-forms.html</code>` (Wave 2).*" — same fix.
- Line 1276: the "Related Wave 1 pages (coming / here)" sentence references `quadratic-reciprocity.html`, `sums-of-squares.html`, `projective-plane.html`, `p-adic-numbers.html` — since most/all of these are now published, consider promoting them to plain inline links.

### Helper-block / widget-chrome hygiene
- Top-of-body helper script (lines 184–200) defines `$`, `$$`, `SVG`, `ensureArrow` — this matches the canonical `category-theory.html` 2D helper (and `modular-forms.html` uses the shorter `$`/`$$`/`SVG` slice; `hecke-operators.html` mirrors the target by including `ensureArrow` + `drawArrow` + `drawNode`). No deviation.
- All seven widgets (`#w-metric`, `#w-geod`, `#w-sl2r`, `#w-iso`, `#w-tri`, `#w-disk`, `#w-tile`) use the standard `.widget / .hd / .ttl / .hint / .readout / .row / .small` chrome — no ad-hoc class names introduced.
- SVG titles are present on every widget (`<title>W1 · Hyperbolic ruler</title>`, etc.) — good for `audit-accessibility.mjs`.
- Color tokens: spot-checked widget code uses `var(--bg)`, `var(--line)`, `var(--pink)`, `var(--yellow)`, `var(--blue)`, `var(--cyan)`, `var(--mute)`. The W7 tile widget at lines 1216–1217 hardcodes `'rgba(255,216,102,0.18)'` and `'rgba(88,196,221,0.10)'` for fills — these are alpha-modulated palette colors and `color-mix()` would be the cleaner mechanism, but this is a minor pattern that the existing `color-vars.mjs` audit does not currently flag. Low priority.

## Severity
minor polish
