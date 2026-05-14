# grothendieck-topologies-sites — pedagogical audit (2026-05)

**Section:** Higher categories & toposes
**Compared against:** elementary-topos-theory, infinity-topoi

## Summary
Strong, well-paced page that hews closely to category-theory.html voice and matches infinity-topoi on the key notational choices ($\mathsf{Set}$, $\widehat{C}$, $\Hom$ macro, "you have already met …" framing). Only real soft spot is §5: the Giraud-axiom widget is a static decorative SVG with no interactivity, and the section quietly leans on $\Omega$ / Lawvere–Tierney terminology that is never defined on this page.

## Findings

### Notation drift
- **Set notation vs. ETT (semantic — but target is on the right side):** target uses `\mathsf{Set}` (`$\mathsf{Set}$`, `$G\text{-}\mathsf{Set}$`) consistently with category-theory.html and infinity-topoi.html; `elementary-topos-theory.html` is the in-section outlier using `\mathbf{Set}` / `\mathbf{Ab}` / `\mathbf{Top}`. **No action needed on the target** — flag is for ETT.
- **Hat vs. widehat (cosmetic):** target writes the presheaf topos as `\widehat{C}` (e.g. line 271, "presheaf topos $\widehat{C} = [C^{\mathrm{op}}, \mathsf{Set}]$"); ETT writes `\hat{C}` everywhere (e.g. ETT line 571 `\hat{C} = [C^{\mathrm{op}}, \mathbf{Set}]`); infinity-topoi uses both (`\widehat{C}` in its prose, `\hat{C}` only inside the inherited callback). Target matches infinity-topoi's preference. Cosmetic only — but worth noting that the "Used in" backlink at target line 286 still says `\hat{C}` (auto-injected from ETT's title).
- **Inline `\mathrm{…}` for ad-hoc operators (cosmetic):** target line 667 has `\mathrm{Match}(S, F)` and line 667 again `\mathrm{colim}` / `\mathrm{dom}`. House style is `\operatorname{…}` for unknown operator names (the page's `\Hom`, `\Spec`, `\Gal` macros all expand to `\operatorname{…}`). Drift is internal — `\mathrm{Sub}`, `\mathrm{Sh}`, `\mathrm{Open}`, `\mathrm{Zar}`, `\mathrm{ét}` all use `\mathrm`, matching ETT and infinity-topoi. Recommend leaving multi-letter subscripts as `\mathrm{}` (they match peers) but switching the one-off `\mathrm{Match}` to `\operatorname{Match}`.

### Undefined jargon
- **"sober"** appears at §5 (line 764, "when $X$ is sober") with no gloss and no callback. The same term in infinity-topoi.html line 420 lives inside a widget step where it's incidental; here it's prose. A 6-word parenthetical ("sober — points = irreducible closed subsets") would close it.
- **`$\Omega$` / "subobject classifier"** is used in §5 line 763 ("a subobject classifier $\Omega$") and line 765 ("Lawvere–Tierney topologies $j\colon \Omega \to \Omega$") but never defined on this page. The "See also" box at line 768 does link to `elementary-topos-theory.html#definition`, which is the right callback — but the prose uses $\Omega$ as if the reader has already opened the link. ETT defines $\Omega$ in its §1–§2; one-line gloss here ("$\Omega$, the truth-value object that classifies subobjects — see ETT §2") would let the page stand alone.
- **"Lawvere–Tierney topology $j\colon \Omega \to \Omega$"** (§5 line 765): named, equation given, but the modal-operator interpretation is unstated. Acceptable as a name-drop given the immediately-following gloss "geometric embedding," but a half-sentence on what $j$ does ("an idempotent inflationary endomap of $\Omega$") would help.
- **"étale fundamental group $\pi_1^{\mathrm{ét}}(X)$"** (§6 line 818): used as the punchline of the functoriality story but never set up. Reasonable to leave as a forward reference if there's an etale-cohomology callback (there is, at line 826). Borderline.
- **"formally smooth + locally of finite presentation + unramified"** (§3 line 553) and **"faithfully flat and quasi-compact"** (§3 line 554): glossed parenthetically as definitions of étale / fpqc, which is fine for the audience level — but no callback to schemes.html or a morphisms-of-schemes page. Compare to infinity-topoi.html §7 which leans on the same vocabulary and links to it.

### Tone mismatches
- _None._ The voice is conversational-but-precise throughout, second-person openings ("If you have already met …", "Scrub through to see how …"), worked-example framing ("The cleanest sanity check is …", "Two extreme cases anchor the picture"). Matches category-theory.html cadence; lighter than ETT's slightly heavier exposition; closer to infinity-topoi.html's pace.

### Missing worked examples
- **§5 ($\mathrm{Sh}(C, J)$ as a topos).** The widget at line 785 (`#w-giraud`) is a *static* decorative SVG — six text labels around a violet circle, no controls, no readout, no interactivity. Compare to ETT §3's `MVProofScrubber` axiom-by-axiom widget and infinity-topoi.html §3's interactive Giraud-axioms scrubber. A scrubber walking through Giraud (i)–(vi) on a concrete topos (`\mathsf{Set}`, or a presheaf topos on the walking arrow) would parallel infinity-topoi.html §3 directly and keep the "every numbered section has a toy you can poke" invariant.
- **§6 (geometric morphisms from morphisms of sites).** The widget at line 836 is interactive (clickable arrows) but the readouts are pure text — no concrete sheaf is pushed forward / pulled back, no example computed. Section's last sentence promises "trace what $f^*$ and $f_*$ do to a specific sheaf on the target" but the widget never does that. Either trim the promise or add one worked $f_*$/f^*$ pair (e.g. constant sheaf $\mathbb{Z}$ on $X_{\mathrm{Zar}} \hookrightarrow X_{\mathrm{ét}}$).

### KaTeX macros / formatting
- Helper-block at top of `<body>` (lines 187–239) is verbatim copy of category-theory.html — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all match. ✓
- Macro block (lines 22–29) matches ETT and infinity-topoi exactly: `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`. No locally-invented macros. ✓
- Widget chrome (`.widget` / `.hd` / `.ttl` / `.hint` / `.row` / `.readout` / `.note`) used consistently; no ad-hoc classes. ✓
- One typographic nit: the inline `\mathrm{Match}(S, F)` at line 667 should be `\operatorname{Match}(S, F)` to match how the page treats multi-letter operators via the `\Hom`/`\Spec` macros (both expand to `\operatorname{…}` and produce the correct surrounding spacing).

## Severity
minor polish
