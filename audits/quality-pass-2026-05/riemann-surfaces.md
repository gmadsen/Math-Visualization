# riemann-surfaces — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** differential-geometry, algebraic-topology

## Summary
Voice, structure, and KaTeX usage are well aligned with both reference peers and `category-theory.html`. The main drift is cosmetic: a mix of `\mathrm{...}` and `\operatorname{...}` for named operators where the page already loads `\Hom`/`\Spec`/etc. macros but never uses them, plus a handful of advanced terms (Hodge, Serre duality, Picard, sheaf cohomology, Abel–Jacobi) that surface in §7 without prior on-page grounding.

## Findings
### Notation drift
- `\mathrm{SL}_2(\mathbb{Z})`, `\mathrm{Im}\,\tau`, `\mathrm{Pic}`, `\mathrm{Div}`, `\mathrm{ord}_P`, `\mathrm{PSL}_2(\mathbb{R})`, `\mathrm{Mod}(S)` (lines 460, 969, 1115, 1091, 1101) — the page declares `\Hom`/`\Spec`/`\Gal`/`\tr`/`\ad`/`\ind` as `\operatorname{...}` macros (lines 37–43) but for these other named operators uses `\mathrm{...}`. `algebraic-topology.html` line 787 uses `\operatorname{im}\partial`, and category-theory leans on `\operatorname{...}` style. Cosmetic but inconsistent with the page's own header.
- `\smallsetminus` for set-difference (lines 648, 821, 824) — the references use `\setminus` (e.g. differential-geometry, algebraic-topology). `\smallsetminus` is fine KaTeX but stylistically isolated to this page within the section.
- `K - D` vs `K-D` spacing inside `\ell(K-D)` (line 1221) and the table (line 1245) — minor, but the rest of the page favors no spaces around binary minus inside short expressions.
- Stylized Unicode `−` (U+2212) used in JS readouts (e.g. lines 413, 779, 783, 821, 1245) interleaved with ASCII `-` elsewhere (line 1086 `genus ≥2 → H/Γ`). Both peers also mix; low priority.

### Undefined jargon
- "Hodge" appears as a bare table cell at line 291 ("complex-analytic (Hodge)") in §1 — first appearance, no gloss, no callback. Defined-ish in §7 ("Hodge / de Rham content", line 1278) but never actually defined.
- "Teichmüller's theorem" / `(6g-6)` / "Teichmüller dim" (lines 277, 999, 1290) — used in §1 and §5 with no definition or callback. Differential-geometry by contrast keeps to elementary surface theory and defers Teichmüller.
- "Fuchsian group" (line 1091) — first occurrence inside a parenthetical-feeling em-dash, no gloss beyond "deck group $\Gamma\subset\mathrm{PSL}_2(\mathbb{R})$"; algebraic-topology callback at line 612 explains deck-group/Galois analogy that could be reused.
- "Picard group" (line 1115) — introduced as "(Picard group)" parenthetical on first mention; OK but slightly thin.
- "Serre duality" (line 1281) — stated cold in §7 with no on-page motivation; also "Abel–Jacobi maps", "period lattice", "Hodge bundle" (lines 1278, 1284) all surface in the closing section without setup.
- "$\Gamma(2)$ action" (line 821) — single mention; readers without modular-forms background have no anchor.
- "monodromy" (line 657) is bolded on first use and elaborated in §3 ("Monodromy, more seriously") — handled correctly; included here as a positive contrast.

### Tone mismatches
- §1's table/blurb ("every single complex-analytic number is a function of the topological invariant $g$ alone", line 297) and the §7 outro ("a single object with three faces", line 1302) match the conversational-but-precise voice of the references — no mismatch.
- The $\ell(D)$ widget readout text (lines 1170, 1180–1187) is dense and partly cryptic ("$\ell(D) \in \{0,1\}$ (depends on whether $D$ is principal)") for a reader meeting Riemann–Roch for the first time; differential-geometry's worked examples in `Theorema Egregium` give more verbal scaffolding.
- §6's last paragraph (line 1245) about row-2 of the table runs ~120 words in one breath, with two parentheticals and a self-correcting "(that's Abel's theorem again …)". Slightly over-casual / digressive compared to the cleaner expository rhythm in algebraic-topology §3 (universal-cover proof).

### Missing worked examples
- §7 Connections (line 1272 ff.) is pure prose — no widget, no toy. Both references end with summary sections too, but algebraic-topology §7 still grounds itself in $H^*(T^2)$ and $H^*(\mathbb{CP}^n)$ ring computations; differential-geometry §11 is also prose but is explicitly framed as "Coda — what's next" (line 2308). The riemann-surfaces §7 heading ("Connections") doesn't signal "no widget here", so a reader scrolls expecting the §1–§6 rhythm to continue.
- Section grade table:

| section | status |
|---|---|
| 1. What is a Riemann surface? | ok (no widget but heavily tabulated) |
| 2. Sphere and torus | ok (two widgets + lattice-visualizer) |
| 3. Branched covers | ok (interactive cover/monodromy widget) |
| 4. Riemann–Hurwitz and genus | ok (calculator widget with presets) |
| 5. Uniformization | ok (trichotomy cards + small lattice toy) |
| 6. Divisors and Riemann–Roch | ok (place-points widget + worked elliptic table) |
| 7. Connections | missing-example (prose-only outro) |

### KaTeX macros / formatting
- Header macro block (lines 36–43) is the canonical six (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) — matches both references and category-theory exactly. Good.
- The page never invokes its own `\Hom` macro in the body, even though `H^0(X, \mathcal{O}(D))` and `\dim_\mathbb{C} H^0(X,\Omega^1)` constructions naturally invite hom-set framing — minor, no required change.
- No page-local macro additions; no re-defined delimiters; only the standard four (`$…$`, `$$…$$`, `\(…\)`, `\[…\]`) are configured. Clean.
- Helper block at lines 191–243 (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) matches the canonical 2D template from category-theory verbatim.
- Widget chrome (`.widget` / `.hd` / `.ttl` / `.hint` / `.readout` / `.row` / `.note` / `.ok` / `.bad`) is used consistently across all six widgets — no ad-hoc classes.
- Color tokens are `var(--*)` throughout SVG paint attrs (yellow/blue/green/pink/violet/cyan); one `fill:'#101722'` literal in three card SVGs (lines 1008, 1060, 1136) — minor, color-vars audit territory, not pedagogy.

## Severity
minor polish
