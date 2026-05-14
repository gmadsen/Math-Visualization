# p-adic-numbers — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** algebraic-number-theory, adeles-and-ideles

## Summary
Strong, image-driven pedagogy with consistent voice; the page is on-template for tone, widget chrome, and notation. Two surgical issues stand out: a malformed local KaTeX macro block in the head and three late sections that ship as pure prose without a worked widget.

## Findings
### Notation drift
- Galois group rendering is inconsistent. p-adic-numbers uses `\mathrm{Gal}(\mathbb{Q}_p^{ab}/\mathbb{Q}_p)` at section 9 (line 1003) and `G_\mathbb{Q}` / `\mathrm{GL}_n` at section 11 (line 1117). adeles-and-ideles uses the registered macro `\Gal{...}` (line 555) which renders as `\operatorname{Gal}`. Same loader exposes `\Gal` here too — prefer it for consistency. Cosmetic, low priority.
- Tate–Shafarevich symbol: section 10 (line 1029) renders the group as `\text{Ш}(E/\mathbb{Q})` directly, bypassing the (broken) `\Sha` macro defined in the head. Reference pages do not refer to Sha; fine in isolation, but the local macro deserves a fix or removal — see KaTeX section.
- Maximal-abelian decoration drift: this page writes `\mathbb{Q}_p^{ab}` (italic `ab`) at line 1003; adeles-and-ideles writes `\mathbb{Q}^{\mathrm{ab}}` (upright) at line 555. Settle on `\mathrm{ab}` to match the sibling.
- Place index notation: this page uses `|x|_v` with `v` ranging over `\infty` and primes (line 320); adeles-and-ideles uses `v_\infty`, `v_p` consistently as named places (line 268). Both pages are coherent internally; the cross-page reader will see two visual conventions for "same thing." Cosmetic.

### Undefined jargon
- "DVR" appears in section 4 prose ("complete DVR with residue field $\mathbb{F}_p$", line 562) without expansion, definition, or callback. First-time number-theory reader will not parse it. The same acronym is also used in algebraic-number-theory.html section 3 ("every localization $R_\mathfrak{p}$ at a nonzero prime is a DVR", line 517) but that page builds it via the surrounding Dedekind-domain definition box; here it appears bare.
- "uniformizer" first surfaces in section 6's "Structure summary" note (line 722, "uniformizer $p$") with no definition; it is properly defined later in section 9 ("Two invariants control everything: the … uniformizer", line 995). Forward-reference jargon.
- "$\ell$-adic Galois representations" listed in section 11's "Why care" bullets (line 1117) introduces `G_\mathbb{Q}` and `\mathrm{GL}_n(\mathbb{Q}_\ell)` without ever having defined the absolute Galois group or motivating $\ell$ vs $p$. The bullet works as a gesture toward downstream pages but quotes a formula whose objects the reader has not met.
- "Brauer–Severi varieties" and "Tate–Shafarevich group" appear in section 10 (line 1029) with no callback or one-line gloss. The bullet at section 11 partially repeats the gesture. Either gloss inline or callback to elliptic-curves / class-field-theory.
- "Hecke character" / "Hecke $L$-function" terminology not used here, but the bullet at section 11 ("$p$-adic $L$-functions") drops the phrase without context. Low priority — it is explicitly under "Why care" pointers.

### Tone mismatches
- Sections 1–7 sit comfortably in the canonical voice (conversational gloss + worked widget + a "Take-away" or `note` box). Sections 8–11 shift into a denser, textbook-leaning register: section 9 "Extensions of $\mathbb{Q}_p$ and ramification" is a wall of definitions ($e$, $f$, $\pi$, $L^{ur}$, tame/wild, Krasner) with no widget, no toy, no narration aside. Compare with the parallel definition burst in algebraic-number-theory section 4, which is followed by an interactive `w-ram` factorization widget.
- Section 8 "Newton polygons" similarly lectures from definition → theorem → worked example → corollary in unbroken prose. The worked example is well-chosen but reads as an in-line solved problem rather than as a poke-able toy. Reference pages reliably break such walls with a widget.
- Section 11 "Why care" devolves to a four-bullet list of forward references; this is a fine close, but it is the one part of the page that loses the "one image at a center" promise made in the hero.

### Missing worked examples
- **Section 8 (Newton polygons):** no widget. Adding a `Newton polygon plotter` (input: coefficient-valuation list; output: lower hull + slope/length readout naming root valuations) would mirror the gesture of W1/W4. High value.
- **Section 9 (Extensions of $\mathbb{Q}_p$ and ramification):** no widget. The $e f = n$ identity, tame/wild cases for $\mathbb{Q}_p(\sqrt{p})$ vs $\mathbb{Q}_p(\zeta_{p^n})$, or a small Eisenstein-polynomial → ramification-type explorer is the obvious gesture. Compare algebraic-number-theory `w-ram`.
- **Section 11 (Why care):** no widget, no quiz. Reference pages also use a closing prose-only section, so this is on-template — flag only as "no toy" rather than "missing example."
- Section 10 has the W7 "Local solvability check" widget, which is good; the brute-force window (`x>200`, `y>200`) is small but functional.

### KaTeX macros / formatting
- **Helper macro block is malformed (semantic, high priority).** Lines 26–53 of the auto-render loader contain two `macros:` keys in the same options object. The first (lines 37–39) reads `macros:{ '\Sha':'\text{Ш}' }` with single backslashes — both `\S` and `\t` are JS string escapes (`\S` is not special so survives; `\t` becomes a tab). The second `macros:` (lines 41–48) overrides the first entirely, so `\Sha` is silently undefined. The page sidesteps this by writing `\text{Ш}` directly at line 1029, but the dead block should be removed and either: (a) added to the second block as `'\\Sha':'\\text{Ш}'`, or (b) deleted outright since `\text{Ш}` is used inline.
- **Macros declared but unused.** `\Spec`, `\Hom`, `\tr`, `\ad`, `\ind` are inherited from the canonical loader but the page uses none of them — fine, just noting (matches the reference pages, which also inherit the bundle).
- **Local `\mathrm{Gal}` instead of `\Gal`.** Line 1003 uses `\mathrm{Gal}(...)` while the page-level `\Gal` macro is registered. Cosmetic; pick one.
- **HTML entities inside math.** TOC line 294 uses `local&ndash;global&nbsp;(Hasse)&nbsp;principle` (en-dash and nbsp inside the auto-injected TOC label) — that is the auto-injector's choice, harmless. Body uses `Brauer&ndash;Severi`, `Tate&ndash;Shafarevich` (lines 1029, 1031) — matches house style for en-dash names.
- Helper `<script>` block at top of `<body>` (lines 190–281) matches `category-theory.html` verbatim modulo comment stripping; the small number-theory helpers (`isPrime`, `vpInt`, `vpRat`, `gcd`, `modpow`, `digitsOfInt`, `digitsOfRatInZp`) are page-specific extensions consistent with adeles-and-ideles' analogous local helpers. No drift.
- Widget chrome (`.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad`) is used consistently across all seven inline widgets (W1–W7) plus the two registry widgets (`MVModularArithmeticClock`, `MVInlineCodeCell`). No ad-hoc classes.

## Severity
minor polish (one semantic KaTeX bug in the head + three section-level "no toy" gaps; everything else cosmetic)
