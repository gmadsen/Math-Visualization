# commutative-algebra — pedagogical audit (2026-05)

**Section:** Algebra & homological
**Compared against:** algebra, homological

## Summary
A strong, well-paced graduate page: 16 numbered sections, 14 interactive widgets, voice and chrome closely match the canonical template. The main issues are notation drift in the radical operators (`\mathrm{nil}`, `\mathrm{Jac}`, `\mathrm{Frac}`, `\mathrm{Tor}`, `\mathrm{Art}`) and two sections without worked widgets (§9 Completion, §14 DVRs/Dedekind, §16 Koszul).

## Findings
### Notation drift
- **Radicals split between `\mathrm{Nil}` and `\mathrm{nil}` within one page.** `commutative-algebra.html#ideals` line 395 writes `\mathrm{Nil}(A)=\bigcap\mathfrak{p}` but §4 (`#radicals`) line 713 writes `\mathrm{nil}(A) = \bigcap_\mathfrak{p}` (lowercase). High-priority — same operator, two spellings on the same page.
- **`\mathrm{Tor}` / `\mathrm{Jac}` / `\mathrm{Nil}` / `\mathrm{Frac}` / `\mathrm{Art}` should be `\operatorname{…}`.** Cf. `homological.html#exact` uses `\operatorname{Ext}^1`, `\operatorname{coker}`, `\operatorname{im}` consistently, and the page-level macro list defines `\Hom = \operatorname{Hom}`. `commutative-algebra.html#radicals` (713–714), `#flat` (1728: `\mathrm{Tor}_1^\mathbb{Z}`), `#localize` (1546: `\mathrm{Frac}`), `#artinian-local` (1457: `\mathrm{Art}_k`, `\mathrm{Def}_{X_0}`), `#dim` (2251: `\sqrt{Q_i}` is fine, but `#trdeg` 2509 has `\mathrm{tr.deg}_k`). `\operatorname{…}` produces correct spacing in formulas like `\mathrm{Jac}(A) \subseteq` whereas `\mathrm{}` does not. Medium priority — purely cosmetic but visible.
- **`\mathrm{im}` vs `\operatorname{im}`.** §5 line 1204 writes `\ker g = \mathrm{im}\,f`; `homological.html#complexes` line 395 writes `\operatorname{im}\partial_{n+1}\subseteq\ker\partial_n`. Medium priority.
- **Inline `\Z` / `\F_p` macros not used.** Page consistently uses `\mathbb{Z}`, `\mathbb{F}_p` longhand — matches `algebra.html` and `homological.html`. No drift here.

### Undefined jargon
- **"catenary rings"** appears in §13 (`#dim`) line 2272 ("complements it to $\dim A$ in nice cases (catenary rings)") with no definition or callback — first and only use. Low–medium priority; reads as drive-by jargon. Either define in one parenthetical or strike.
- **"upper-semicontinuity"** is used in §15 line 2532 ("special fibres can only jump up (upper-semicontinuity)") without explanation. Acceptable for a graduate audience but the parenthetical adds no information for a reader who didn't know the term.
- **"complete intersection"** in §16 line 2585 ("when that subscheme is a complete intersection") — first occurrence, undefined. The Koszul section is the natural place to define it; consider one-line gloss.
- **"perfect" / "$M$-regular sequence" / "$\mathrm{depth}_I(M)$"** in §16 line 2584 are introduced and used in the same sentence without prior setup. Acceptable for a capstone-flavored final section but jargon density is the highest on the page.

### Tone mismatches
- **§9 Completion** (lines 1689–1715) shifts to a denser, textbook-style register: three bulleted "structural payoffs" (Faithful flatness / Krull intersection / Hensel) listed as named results without the conversational framing the rest of the page uses. Compare `algebra.html` §15 or `homological.html` §3 which both narrate. Low priority — section is short and clear.
- **§14 DVR/Dedekind** (lines 2470–2494) and **§16 Koszul** (2569–2588) read more "reference-card" than "tour": they enumerate definitions/canonical examples in `<div class="ok">` blocks rather than walking the reader through. The earlier §1–§13 are noticeably more conversational ("two pictures to keep side by side", "a clean example worth carrying around"). The contrast feels like §9, §14, §16 were appended later and weren't revoiced. Medium priority.
- **§15 closing paragraph** (line 2563, "The pattern running through these twelve sections…") says "twelve sections" but the page now has sixteen — stale wrap-up paragraph from before §13/§14/§16 backfill. The wrap-up also sits inside `<section id="trdeg">` and is followed by §16, so structurally it lands awkwardly. High priority — visible factual error.

### Missing worked examples
- **§9 Completion** has no widget. A "completion explorer" (e.g. show partial sums in $\mathbb{Z}_p$ for $p=2,3,5$, or successive truncations of a power series) would match the §1–§13 rhythm.
- **§14 DVRs and Dedekind domains** has no widget. A "DVR / Dedekind classifier" — pick a 1-dim ring (`\mathbb{Z}`, `k[t]`, `\mathbb{Z}[i]`, `\mathbb{Z}[\sqrt{-5}]`, `k[t^2,t^3]`) and report Noetherian / integrally closed / dim 1 / verdict — would mirror the existing `#radicals` and `#integral` widgets exactly.
- **§16 Koszul complex** has no widget. Could re-use a stepper to build $K_\bullet(x,y) \to k[x,y]/(x,y)$ explicitly in degrees 0/1/2.

### KaTeX macros / formatting
- **No invented delimiters or local macros.** The `<head>` macro list (lines 22–29) is identical to the canonical set (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`); no page-local additions.
- **Page-global helper block omits `drawArrow` / `drawNode` / `ensureArrow`.** Lines 184–325 contain `$`, `$$`, `SVG`, plus topic-specific helpers (`gcd`, `polyMul`, `factorIrreducible`, etc.) but not the canonical 2D arrow helpers from `category-theory.html`. None of the page's widgets use arrows, so it's not load-bearing — but if a future widget needs an arrow it must add the helpers. Low priority; mention only.
- **`\mathrm{Sub}` / `\mathrm{Stab}` style names.** §11 line 2090–2097 readout uses `T_p V(f)` plain ASCII inside the JS string template — matches the conversational widget output and isn't drift.
- **Widget chrome is fully canonical.** All 14 widgets use `.widget / .hd / .ttl / .hint / .row / .readout / .note / .ok / .bad / .pill / .small`. No ad-hoc classes detected.

## Severity
minor polish (notation unification + revoice §9/§14/§16 + fix the "twelve sections" wrap-up + add widgets to §9, §14, §16 if time permits)
