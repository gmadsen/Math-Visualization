# calabi-yau-manifolds — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** mirror-symmetry, kahler-geometry

## Summary
The page is interactive, well-structured, and matches house chrome / palette / helpers. Two real issues: a section-internal jargon ramp in §4 (Gromov–Witten / prepotential used before either is glossed) and a notation drift on projective space against the section sibling kahler-geometry. Everything else is minor polish.

## Findings
### Notation drift
- Projective space: target uses `\mathbb{P}^n` throughout (§1 widget caption "Why degree $n+1$ in $\mathbb{P}^n$?"; §3 `quartic in $\mathbb{P}^3$`; §3 `\subset \mathbb{P}^4`). kahler-geometry uses `\mathbb{CP}^n` throughout (§2 Fubini–Study `$\mathbb{CP}^1$`; §5 examples `quartic in $\mathbb{CP}^3$`; §6 `blow-up of $\mathbb{CP}^2$`). mirror-symmetry sides with the target (`\mathbb{P}^4`). Drift is semantic-adjacent (same object) but cosmetically inconsistent across the sibling pair and against the canonical category-theory convention of `\mathbb{C}`/`\mathbb{R}`-style blackboard ambient spaces. Recommend pick one and align — leaning `\mathbb{P}^n` since two of three pages already use it.
- `\mathrm{Coh}` and `\mathrm{Fuk}`: target writes `D^b \mathrm{Coh}(X) \simeq D^\pi \mathrm{Fuk}(Y)` inline at §5 line 850 with `\mathrm{}`; mirror-symmetry §5 boxes the same equation with `D^b\mathrm{Coh}(X) \cong D^\pi \mathrm{Fuk}(Y)` and uses `\Hom_{\mathrm{Fuk}}` (registered macro). Cosmetic — `\simeq` vs `\cong` for the equivalence is also worth picking one.
- `\mathrm{SU}(n)`/`\mathrm{U}(n)` in target §1 is consistent within the page; kahler-geometry uses bare `U(n) \subset O(2n)` (no `\mathrm{}`). Cosmetic, but the target is strictly better.

### Undefined jargon
- "prepotential" (§4 line 646: *"its four solutions encode the prepotential of the mirror $A$-model — the genus-$0$ Gromov–Witten generating function of the original quintic"*). Term is never defined; the appositive only renames it. Same word reappears at §5 line 776 *"computed the prepotential of the mirror quintic from periods…"*. mirror-symmetry §3 spends a whole section building up to a generating function but also leaves "prepotential" unsaid; the word effectively only lives on this page and lacks a definition or a callback.
- "Gromov–Witten" appears as body prose for the first time at §4 line 646 in the gloss above; no preceding definition or callback. mirror-symmetry by contrast devotes §3 ("A-model: Gromov–Witten invariants") to building $N_\beta = \int_{[\overline{\mathcal{M}}_{0,0}(X,\beta)]^{\mathrm{vir}}} 1$ before relying on the term. A one-line explainer or a `<aside class="callback">` to `mirror-symmetry.html#gw` would close it.
- "$A$-model" / "$B$-model" surface in §4 line 646 ("prepotential of the mirror $A$-model") with no setup; they get a table in §5 but the §4 reference is upstream of that table.
- "perfect obstruction theory" / "virtual fundamental class" / "MNOP" / "stable-pairs / curve-counting correspondence" pile up in §6 "Donaldson–Thomas invariants" sub-paragraph (line 869) inside one sentence. None is defined or callback-glossed; for a §6 "applications" paragraph this is dense even by the section's standards.
- "maximally-unipotent boundary point" (§6 line 872) and "Leray spectral sequence" (same line) drop in without context; the prior pages do not define them either.
- "F-theory" appears in the §7 Connections paragraph (line 983) without gloss; reasonable for a closing paragraph but worth a one-clause definition.

### Tone mismatches
- Hero subtitle *"…and what string theorists do at night"* (line 260) is the only place the page reaches for the meme/casual register; it is a couple of clicks looser than mirror-symmetry's hero (*"Two Calabi–Yau 3-folds, one duality: a swap of Hodge numbers…"*) or kahler-geometry's hero (*"Three categories of geometry — Riemannian, complex, and symplectic — fuse into one…"*). Not wrong — the rest of the page is fine — but it is the one outlier.
- §6 ("String compactifications, DT, SYZ") is three sub-`<h3>` paragraphs of dense prose between two widgets (at top of section: none; at bottom: SYZ widget). Compared to kahler-geometry §5–6 where every theorem statement is set off in `<div class="ok">` / `<div class="note">` callouts, the target's §6 reads as a textbook wall. Adding one `<div class="note">` framing the DT–GW / MNOP correspondence would match house rhythm.
- §6 sub-section "Donaldson–Thomas invariants" packs definition, MNOP statement, and mirror-symmetry corollary into a single sentence (line 869). The peers favor short, parsable sentences; this one runs long.

### Missing worked examples
- §6 "String compactifications, DT, SYZ" has only one widget (the SYZ torus fibration), and it sits at the end. The "String theory" sub-section and the "Donaldson–Thomas" sub-section have no toy of any kind — no slider that picks an MNOP exponent, no interactive that draws the IIA/IIB compactification picture. Given the scaffolder rule "every numbered `<h2>` should have at least one worked widget," §6 technically passes (one widget for three sub-headings) but is the thinnest section by interactive density.
- §5 "Mirror symmetry: swapping the diamond" has the Mirror swap widget but no explicit worked computation — e.g. no inline check that $\chi(\text{quintic}) = 2(1-101) = -200$ matches the mirror's $+200$, even though the readout shows it. mirror-symmetry §2 sets the bar with the CdGP curve-count table widget; the target's §5 widget is a less-information-dense cousin.
- §3 "Examples" leans on a `<pre>`-formatted ASCII Hodge diamond for K3 (lines 542–548) rather than reusing the §2 widget's K3 button — this works, but it duplicates content that the §2 explorer already shows interactively.

### KaTeX macros / formatting
- No new local `\newcommand` or non-standard macros — page uses only the shared registered macros (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) plus standard KaTeX. Clean.
- Display equations are styled as `<p style="text-align:center">` with inline `$…$` (e.g. §4 lines 636, 640, 644; §5 line 762, 778) rather than `$$…$$`. mirror-symmetry uses `$$…$$` natively for the same role (e.g. line 268 boxed equation, line 364 Cauchy–Riemann). The hand-rolled centered paragraphs render identically but bypass the standard display-equation path; cosmetic.
- §3 uses a `<pre>` block with raw ASCII Hodge diamond (lines 542–548) styled inline with `font-family:ui-monospace`. Functional, but it is the only place in the three pages where layout is escaped to ASCII rather than handed to KaTeX or the SVG.
- Orphan stale comment: lines 995–1003 contain a second copy of the "Connections outro — pedagogy reviewer's templated closure pattern" comment block, but no `<section>` follows it (the actual `#connections` section is at lines 980–992, just above). Stale duplicate scaffolder marker; harmless but tidies cleanly by deleting lines 995–1003.

## Severity
minor polish
