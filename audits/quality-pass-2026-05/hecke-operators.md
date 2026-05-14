# hecke-operators — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** modular-forms, automorphic-forms-adelic

## Summary
Tightly written advanced page that hews closely to section conventions and category-theory's house style; widget coverage is excellent (every numbered section has at least one toy) and notation is uniform with both peers. The only real weaknesses are a small batch of advanced terms used before any callback (most notably "spectral theorem" / "spectral decomposition" naming the §1 widget before that vocabulary is earned), and one widget id (`w-motive`) whose name does not reflect what it shows.

## Findings
### Notation drift
- `\mathbb{Z}` vs `\Z`: page is uniform on `\mathbb{Z}`, `\mathbb{F}_p`, `\mathbb{C}`, `\mathbb{Q}`; matches modular-forms (e.g. line 198 `\mathbb{Z}\omega_1+\mathbb{Z}\omega_2`) and automorphic-forms-adelic (e.g. line 271 `\mathbb{Z}_p`) verbatim. No drift.
- `\mathrm{SL}_2(\mathbb{Z})` is used everywhere (e.g. lines 260, 504, 947); matches modular-forms (line 218 `\mathrm{SL}_2(\mathbb{Z})`) and automorphic-forms-adelic (line 380). Consistent.
- `\mathrm{Frob}_p` (line 1071) — automorphic-forms-adelic does not name Frobenius elements directly, so no collision; modular-forms also avoids the name. The macro block declares no `\Frob`, so `\mathrm{Frob}_p` here is the page-internal convention. Cosmetic — if a future revision adds `\Frob` as a macro, prefer it. (Cosmetic.)
- `\ell`-adic spelling: lines 1068 `\ell`-adic, 840 readout text uses Unicode "ℓ-adic". Minor cosmetic mismatch within the page (LaTeX in prose, Unicode in widget readout); modular-forms §8 uses `\ell` (line 1124) consistently. Recommend keeping LaTeX `\ell` in widget readout strings where they are rendered as plain text — though since readouts are non-KaTeX, the Unicode character is the practical choice. No action needed.
- `\mathbb{T}_k` for the Hecke algebra (line 684, 1124) — symbol introduced inline at first use ("$\mathbb{T}_k = \langle T_1, T_2, \ldots \rangle$"). Not used by either ref, so no drift. ok.
- `\rho_f \colon \Gal(\overline{\mathbb{Q}}/\mathbb{Q}) \to \mathrm{GL}_2(\overline{\mathbb{Q}}_\ell)` (line 1069) uses the macro `\Gal` defined in the local KaTeX header — matches automorphic-forms-adelic's expansion convention. Consistent.
- `\langle T_p f, g \rangle` notation (line 1034) for inner products matches modular-forms (line 1155) verbatim. ok.

### Undefined jargon
- **§1 hero, line 255:** "the simultaneous eigenvectors are the *eigenforms*: the arithmetic atoms whose **Fourier coefficients are Galois-theoretic**." The phrase "Galois-theoretic" is a teaser, but acceptable in a hero. Not flagged.
- **§1, line 269:** "by the **spectral theorem** $M_k$ has an orthogonal basis of simultaneous eigenvectors". "Spectral theorem" is name-dropped before the inner product that licenses it (the Petersson product is §6, five sections later). For a graduate-level page this is on the edge of acceptable — but the widget at line 273 is also titled "**The spectral decomposition** of $M_k$" before any spectral structure has been introduced, and shows only a bar chart of dimensions, not a spectral decomposition. Recommend either renaming the widget to "Dimensions of $M_k$" or adding a one-line forward-reference: "(see §6 for the inner product that makes 'spectral' meaningful)".
- **§1, line 271:** "two-dimensional **Galois representation**" used cold. There is a forward reference at line 1072 to galois.html, but the §1 use has no inline gloss and no callback aside. modular-forms's parallel passage (line 1124) at least labels it "$2$-dimensional $\ell$-adic representation of $\Gal(\overline{\mathbb{Q}}/\mathbb{Q})$" — i.e. the gloss is in the same sentence. Recommend a parenthetical at line 271: "(an $\ell$-adic group homomorphism $\Gal(\overline{\mathbb{Q}}/\mathbb{Q}) \to \mathrm{GL}_2$, defined later — see §7)".
- **§2, line 504:** "right coset decomposition of $\mathrm{SL}_2(\mathbb{Z})\, \mathrm{diag}(1,p)\, \mathrm{SL}_2(\mathbb{Z})$" — the term "double coset" is implied by the syntax but never named here, and is then named in §4 (line 736) as if for the first time. Reorder cue rather than missing definition. Minor.
- **§4, line 736:** "the product of two double cosets is commutative by the **Satake isomorphism** (abstractly: because $\mathrm{GL}_2$ modulo its center is "almost" a symmetric space)." Satake is name-dropped; there is a backlink aside two lines later pointing to automorphic-forms-adelic#satake, so the cross-reference exists. Acceptable.
- **§6, line 943:** "we need the Hecke operators to be *normal* — and in fact they are self-adjoint". "Normal" (operator-theory sense) is used cold and not defined; a reader who has not internalised the spectral theorem may take it as colloquial. Recommend a parenthetical: "*normal* (commute with their adjoints)". Minor.
- **§6, line 1037:** "**Atkin–Lehner** operators" introduced cold in a parenthetical aside. Acceptable as a name-drop in a forward-pointing aside; no callback exists in the corpus yet so a callback aside would be premature.
- **§7, line 1072:** "modularity / reciprocity principle" used as a label without unpacking — but this section is explicitly titled "Where this goes" and frames itself as forward-looking, so the looser standard applies.
- **§7, line 1088:** "**Weil conjectures** for products of modular curves" — name-drop without callback. There is no `weil-conjectures.html`-style target in the corpus to link to; acceptable as forward-pointing flavour.
- **§7, line 1083:** "the **motivic** / $\ell$-adic $L$-function" — "motivic" name-dropped once. Forward-looking, acceptable.

### Tone mismatches
- Hero (line 255) is on-tone — single sentence motivating the construction, parallel to modular-forms's hero (line 217) and category-theory's hero (line 269).
- §1 voice ("So the question is: …" then a `<div class="note">` with the question, then the answer in narrative form) matches the conversational-but-precise rhythm of category-theory §1 and modular-forms §4 well.
- §2 mathematical exposition is dense (lines 330–344 are five back-to-back display equations / displays-in-notes) but each is buffered by a sentence of motivation — acceptable for an advanced page.
- §3 (q-expansion derivation, lines 529–541) reads as a clean computation with appropriate prose connectors ("The "$p\tau$" term produces …", "Combining:") — matches the worked-derivation cadence of modular-forms §6 (the $\Delta$-as-quotient calculation).
- §5 "huge reduction" sentence (line 784: "infinitely many integers are encoded by one integer per prime") is a good Brilliant-style narrative beat — matches automorphic-forms-adelic §6's "the new-form" framing.
- §7 final paragraphs (lines 1088–1093) drift into list-of-pointers mode rather than narrative — three bullets each naming a deep theorem (Ramanujan, Modularity, Functional equation) with one sentence of gloss. This is appropriate for a "where this goes" coda and matches the closing rhythm of automorphic-forms-adelic §9 (functoriality bullets).
- No instances of dry textbook voice or over-casual / meme tone detected.

### Missing worked examples
- §1 widget `w-motive`: bar chart of $\dim M_k$ for $k = 4..26$. Not interactive (no controls), but informative. Title "spectral decomposition of $M_k$" overpromises — see jargon flag above. Acceptable as a static figure since §2's `w-sub` is fully interactive immediately after.
- §2 widget `w-sub`: lattice + sublattice visualizer with $p$-button and $\tau$-sliders. Concrete, interactive. ok.
- §3 widget `w-qact`: Fourier coefficient bar chart for $\Delta$ vs $E_4$ with $p, k, $ form selectors. Excellent — directly exhibits the eigenform property. ok.
- §4 widgets: `w-commute` is a static commutative square diagram (no interactivity); the section also has the `<h3>Why does T_m T_n = T_n T_m?</h3>` proof sketch, but no separate computational widget for the multiplicative or recursive relations. The recursion check happens later in §5's `w-mult`. Borderline acceptable — if `w-commute` had a "set $m, n$" control that drew the diagonal $T_{mn}$ arrow only when $\gcd(m,n)=1$, it would actively teach the multiplicativity hypothesis.
- §5 widgets: `w-eig` (Deligne-bound bar chart for $\tau(p)$) is static; `w-mult` (interactive $\tau(m)\tau(n) = \tau(mn)$ checker) is fully interactive and excellent. Two widgets in one section, the second one interactive — strong coverage.
- §6 widget `w-pet`: hyperbolic-measure-weighted dot picture of the fundamental domain. Visually informative but not interactive (no controls). Section is otherwise computation-heavy; the static figure suffices given the abstract integral being defined.
- §7 widget `w-euler`: Euler factor curve for $\Delta$ at selectable prime $p$, with discriminant / Ramanujan-bound readout. Excellent payoff for the "where this goes" section.
- Overall: every numbered section has a widget, three of seven are interactive, two more allow a $p$ / form selector (so really five of seven). Stronger coverage than typical — no missing-example flag, but `w-commute` and `w-pet` could promote from static to interactive in a polish pass.

### KaTeX macros / formatting
- Macro set (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) is a verbatim copy of the standard number-theory macro block (matches modular-forms lines 38–45 and automorphic-forms-adelic exactly). No locally-invented macros. ok.
- Delimiters: `$…$`, `$$…$$`, `\(…\)`, `\[…\]` configured in the loader — matches AGENTS.md house convention. ok.
- Helper block at top of `<body>` (lines 185–234: `$, $$, SVG, ensureArrow, drawArrow, drawNode`) is a verbatim copy of the canonical 2D helper from category-theory.html (lines 188–238) and matches automorphic-forms-adelic (lines 187–238) byte-for-byte. ok. (modular-forms has a stripped version with only `$, $$, SVG`, lines 187–193, because it uses `MVLatticeVisualizer` for its arrow-bearing widget — different but acceptable choice.)
- Widget chrome: every widget uses `<div class="widget"> / <div class="hd"> / <div class="ttl"> / <div class="hint">` plus `.readout / .row / .note / .ok / .pill`. No ad-hoc classes. The `.pbtn` class for the prime buttons in §2 is a widget-internal selector, not a CSS-defined chrome class — fine. ok.
- All seven `<svg>` elements have `viewBox` and a `<title>` child for a11y; the `<title>` text is the same as the widget `.ttl`. ok.
- KaTeX in `<select>` options: §3's `w-qact` `<option>` labels include "Δ (cusp, weight 12)" and "E_4 (Eisenstein, weight 4)" — Greek `Δ` and underscored `E_4` are plain Unicode / ASCII, not LaTeX-source, so `js/katex-select.js` is loaded (line 23) but not strictly required for these labels. §7's `w-euler` options are bare digits. No LaTeX leakage in the native popup. ok.
- One minor cosmetic: §4 widget readout (line 731) writes `T_{mn}` with the LaTeX subscript, but that string is plain text in the readout (not KaTeX-rendered), so it displays as "T_{mn}" with the braces. Same convention is used in `w-sub` readout (line 497: `p^{k-1}`). All peers do the same in their widget readouts (e.g. modular-forms `w-id` line 1107 displays `E4^3 - E6^2`). Stylistic convention across the section, not drift.
- `<style>` block defines the standard six-color palette (`--yellow --blue --green --pink --violet --cyan`) — `--orange` is absent (this page predates PR #83's seven-color palette migration). Matches modular-forms and automorphic-forms-adelic, both of which also predate the orange addition. Not a defect for this page; no widget here uses orange.

## Severity
minor polish
