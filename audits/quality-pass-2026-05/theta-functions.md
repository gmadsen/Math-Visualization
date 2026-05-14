# theta-functions — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** modular-forms, hecke-operators

## Summary
Strong, well-paced page with worked widgets in every section and a tone closely matched to the section peers. Two real issues: an `\operatorname{Im}` vs `\mathrm{Im}` notation drift against both reference pages, and one dropped term ("metaplectic group") used without definition or callback. Otherwise minor polish only.

## Findings

### Notation drift
- `\operatorname{Im}\tau` used 7 times in `theta-functions.html` (e.g. line 262 `$\mathcal{H} = \{\tau \in \mathbb{C} : \operatorname{Im}\tau > 0\}$`, line 387 four occurrences). Both peers use `\mathrm{Im}` exclusively: `modular-forms.html:225` `$\mathrm{Im}(\omega_2/\omega_1) > 0$`, `hecke-operators.html:947` `$y = \mathrm{Im}(\tau) > 0$`. The reader who clicks "← Modular forms" sees the same operator typeset two different ways within one section. Recommend: align on `\mathrm{Im}` (peer-majority) since neither glyph is a defined macro in the shared head block. Semantic-equivalent, cosmetic-priority.
- All three pages agree on `\mathrm{SL}_2(\mathbb{Z})` and `\mathbb{Z}` / `\mathbb{C}` / `\mathcal{H}` — no drift to fix there.

### Undefined jargon
- "metaplectic group" appears in §3 (`theta-functions.html:522`) — `"transforms under a cover of $\mathrm{SL}_2(\mathbb{Z})$ called the metaplectic group"` — with no inline gloss and no `<aside class="callback">` link to `half-integral-weight-forms.html#metaplectic`. The "Used in" backlink at line 544 points outward to the metaplectic anchor on a different page, but that is the reverse direction (downstream consumers); a forward "See also" callback would close the loop. Quick fix: append `half-integral-weight-forms` to that section's `prereqs` so `audit-callbacks.mjs --fix` injects the cross-page See-also automatically. Semantic, medium priority.
- "Schwartz function" is used at line 516 with no gloss; this one is more borderline since "for a Schwartz function $f$ on $\mathbb{R}$" is followed immediately by the operative formula and then by the worked Gaussian, so a reader can squint past it. Cosmetic, low priority.
- "cusp form" appears at line 1050 ("the first cusp form of weight $12$") with no inline definition; there is, however, a `<a href="./modular-forms.html">modular forms</a>` link two lines later that resolves to a section discussing cusps. Acceptable as-is.
- "Conway group $\mathrm{Co}_1$, a sporadic simple group" (line 1196) is an aside in a `.note` and labeled as cultural color — fine, no fix needed.
- "Niemeier's classification" (line 1196) — same: it's name-checked in a sidebar note, not used as a load-bearing term.

### Tone mismatches
- _None._ The voice ("Half-integer exponent is not a typo", "Theta has a second life as an infinite product", "Why the integers? Because a lattice.") is the same conversational-but-precise register that `modular-forms.html` and `hecke-operators.html` use ("Among all modular forms, which are canonical?", "Two generators do all the work"). Heading flavor matches: `<h3>` mini-headings inside `<h2>` numbered sections, paragraph-with-formula rhythm, `.note` for asides.

### Missing worked examples
- _None._ Each numbered `<h2>` has at least one rendered widget: §1 `w-defplot` slider, §2 `w-qexp` bar chart, §3 `w-trans` numeric verifier, §4 `w-rk` calculator + bonus `w-sonify-rk`, §5 `w-jtp` truncation comparison, §6 `w-eta` τ comparison, §7 `w-lat` lattice picker + `w-theta-lattice` MVLatticeVisualizer. §8 (`forward`) is intentionally a roadmap and needs no widget.
- Side observation (not a finding, just for the orchestrator's notice): §4 (`sos`) and §7 (`lat`) have widgets but no `<div class="quiz">` placeholders, and the corresponding concept ids (`sums-of-squares-via-theta`, `lattice-theta-series`) do not appear in `concepts/theta-functions.json`. This is a concept-graph gap, not a pedagogy gap.

### KaTeX macros / formatting
- Macro block (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) is byte-identical to the peer pages — no local macros invented.
- `\Hom` is defined and never used on this page; harmless.
- Custom symbol `\Theta_L` and `\theta(\tau)` are written longhand without invoking a macro, which is correct (no peer page reaches for a `\theta` shorthand).
- One stylistic nit: the boxed identity at line 512 uses `$$\boxed{\;\theta(-1/\tau) \;=\; \sqrt{-i\tau}\, \theta(\tau)\;}$$` — neither peer uses `\boxed{}` for headline identities (modular-forms uses `<div class="ok">` blocks instead, e.g. line 838). Cosmetic. Leave or convert per author taste.
- Helper-block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) at lines 187–235 is byte-identical to the `category-theory.html` canonical version and matches `hecke-operators.html`. `modular-forms.html` ships only `$/$$/SVG` (no arrow helpers) since it has no diagrammatic widgets — that's a peer divergence, not a target issue.
- Widget chrome (`.widget / .hd / .ttl / .hint / .readout / .row / .small / .note`) all use the canonical classes; no ad-hoc class names spotted. The `.pbtn` class in `hecke-operators.html` is a peer-side ad-hoc, not present here.

## Severity
minor polish
