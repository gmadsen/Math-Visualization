# k-theory — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** characteristic-classes, atiyah-singer-index-theorem

## Summary
k-theory.html is well-aligned with its two section peers in voice, KaTeX, and helper-block conventions; the prose cleanly motivates each construction and every numbered section ships with a working widget. The primary issues are minor: a duplicated CSS `<link>` pair in the head, two technical terms used in the hero before they are defined, and one widget readout that uses Unicode mathematical characters in the static fallback while the surrounding readouts mostly use plain ASCII.

## Findings

### Notation drift
- `\mathrm{Hom}` macro: KaTeX header defines `\Hom` → `\operatorname{Hom}`, but k-theory never uses `\Hom`. Not a drift per se — k-theory simply has no Hom-sets to render. References use it sparingly too. No action.
- `K^0(X)` (topological, superscript) vs `K_0(R)` / `K_n(R)` (algebraic, subscript): k-theory uses both correctly and explicitly switches at §2 ("Grothendieck group of an exact category" introduces $K_0(\mathcal{C})$). The convention matches atiyah-singer's use of $K^0(T^*M)$ at `#topological`. No drift.
- `\widehat A` vs `\hat A`: k-theory writes `$\widehat A$-genus` in the §6 readout (`-\tfrac{1}{24}\langle p_1(TM),[M]\rangle=-\sigma(M)/8` followed by "the $\widehat A$-genus"); atiyah-singer §5 anchor is `#dirac` and TOC label uses `$\hat A$-genus`. Both are valid KaTeX renderings of the same symbol but inconsistent across sibling pages. Cosmetic drift; recommend `\widehat` for the wider-hat glyph since the symbol is wide.
- `\mathcal{O}(d)` (script O for line bundles) is consistent across all three pages.
- `\mathrm{ch}` vs `\operatorname{ch}`: all three pages consistently use `\mathrm{ch}`; consistent. Likewise `\mathrm{Td}`. No drift.
- `\ind` macro (defined in head as `\operatorname{ind}`) is consistently used across k-theory, atiyah-singer, characteristic-classes. Good.
- `\mathbb{Z}` is used everywhere — no `\Z` shortcut sneaks in. Good.

### Undefined jargon
- Hero §0 (`<p class="sub">`): "generalised cohomology theory whose values are stable equivalence classes" — "stable equivalence" is used before the §1 prose explains what stabilisation means. Reasonable in a hero blurb but worth a brief parenthetical.
- Hero §0: "Quillen's $+$-construction extends it from rings to a full hierarchy of higher invariants" — the `+`-construction is a non-trivial homotopy operation introduced only in §5. The hero name-drops it without context. Consider phrasing like "Quillen's homotopical construction extends..." in the hero, with the technical name reserved for §5 where it is unpacked.
- §1 paragraph 1: "the failure is genuine on $S^7$, for instance" — references the existence of stably-but-not-unstably-equivalent bundles on $S^7$ without naming the example (the tangent bundle / parallelisability quirks of $S^7$). Not a hard jargon violation, but the parenthetical is opaque to a first-time reader.
- §3 paragraph 2: "for a finite CW complex these admit a Mayer–Vietoris exact hexagon" — "exact hexagon" is the cyclic 6-term exact sequence specific to a $\mathbb{Z}/2$-graded theory. Used once with no callback or footnote. Consider linking to algebraic-topology or briefly noting "the 6-term cyclic sequence forced by $K^{n+2}\cong K^n$".
- §3 last bullet: "the surprise that ultimately drove Adams to settle the Hopf invariant one problem" — "Hopf invariant one" is referenced without definition. This is a flavour-aside, not load-bearing, so acceptable.
- §5 second paragraph: "$X\mapsto X^+$ is a homotopy modification that abelianises $\pi_1$ by killing a perfect normal subgroup" — "perfect normal subgroup" appears here cold. The follow-up `<div class="ok">` block on Whitehead's lemma partially rescues this by identifying $E(R)$ as the commutator subgroup, but the word "perfect" is never tied to $[G,G]=G$. Minor.
- §6 paragraph 2: "the localisation sequence $\cdots\to K_n(\mathbb{F}_p)\to K_n(\mathbb{Z}_p)\to K_n(\mathbb{Q}_p)\to\cdots$" — "localisation sequence" used without prior definition or callback. The Connections list at the end mentions it but the term first appears in §6 without scaffolding.

### Tone mismatches
- Overall voice matches the section peers — conversational headers, "the deep theorem of complex K-theory, due to Bott (1959)…" mirrors atiyah-singer's "The Dirac operator is the cleanest setting for…". Good.
- §1 parenthetical "(this is 'stable but not unstable equivalence' — the failure is genuine on $S^7$, for instance)" is in the same self-aware register as characteristic-classes §1 ("…we will recover the latter from $c_1$"). Good.
- §5 third sentence after the table: "Quillen's elegance" appears at the top of §2 and the same admiring register continues — consistent with characteristic-classes' "Chern–Weil gives a direct differential-geometric construction" tone. Good.
- §6 hero phrase "K-theory's two cardinal applications come from its two faces — topological and algebraic" is in the "name the two sides" register both references favour. Good.
- No formulas-without-narration walls; every display equation in k-theory is bracketed by prose describing what it computes.

### Missing worked examples
- All seven sections ship with at least one widget. §1, §2, §3, §4, §5, §6 each have one widget; §7 is "Connections" (links only, no widget — same pattern as characteristic-classes §10 and atiyah-singer §7). Good.
- §3 (Bott periodicity) widget is a static periodicity table for $\pi_n(U)$ vs $\pi_n(O)$ — interactive via the slider but doesn't exercise the *Bott class* $\beta\in\widetilde K^0(S^2)$ directly. A small computation widget that builds $\beta^k\in\widetilde K^0(S^{2k})$ would tie the sliding number more concretely to the K-theory side. Not blocking — the homotopy-group table is a fair stand-in.
- §5 widget is a four-button table of low K-groups; this is good but mostly read-only. A peer like characteristic-classes §3 (clutching map widget for $\mathcal{O}(d)$) gives the user a dial to spin. A `K_2(\mathbb{Z}/n)` or Steinberg-relation toy would push §5 closer to the section's interactive baseline. Minor polish.
- §6 (Applications) covers two distinct applications — index theorem and $K_*(\mathcal{O}_F)$ — but the widget only illustrates the first (three operators with their analytic and topological indices). Borel's rank-$K_n(\mathcal{O}_F)$ table is given as a `$$\begin{cases}...\end{cases}$$` formula but no widget lets the reader vary $r_1, r_2$ and watch the ranks update. Worth considering.

### KaTeX macros / formatting
- Helper macros block at top of head matches references verbatim (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`). No new local macros introduced. Good.
- All four delimiter pairs (`$…$`, `$$…$$`, `\(…\)`, `\[…\]`) are configured identically to references. Good.
- §3 readout text: `$\pi_2(U)=0$` — uses `$…$` inline, will render via auto-render. Good. JavaScript fallback in `bp-readout` then writes `π_${n}(${group}) = ${v}` to `.textContent`, so the live update uses Unicode π and subscript-style underscore (no KaTeX). This pattern matches what atiyah-singer does in `ix-readout` ("D_λ = -i ∂_θ + λ on S¹") — no drift.
- §1 widget readout fallback uses Unicode glyphs `[E₊] − [E₋]` set via `.textContent`, so KaTeX won't run on it; same with the §2 readout `[ℤ/n] = [ℤ] − [ℤ] = 0`. Consistent with the live-update approach in the references; readers see the Unicode while the static initial readout (set in HTML) renders KaTeX. Good.
- Hero `<p class="sub">` uses `$2$-periodic` and `$8$-periodic`: parses as inline math but produces just the digits — slightly noisy KaTeX usage. References do similar (e.g. atiyah-singer hero says "An elliptic operator $D$"). Acceptable.
- §3 readout sets `KO⁰=ℤ, KO¹=ℤ/2, KO²=ℤ/2, KO³=0, KO⁴=ℤ, KO⁵=KO⁶=KO⁷=0` as a fallback string — consistent Unicode pattern.
- Boxed equation in §6: `$$\boxed{\;\ind(D)\;=\;\bigl\langle\,\mathrm{ch}([\sigma(D)])\smile\mathrm{Td}(TM\otimes\mathbb{C}),\,[T^*M]\,\bigr\rangle.\;}$$` — identical to atiyah-singer's `#statement` boxed formula (verbatim same KaTeX). Excellent cross-page consistency.

### Helper-block / widget-chrome hygiene (extras)
- Top-of-body 2D helper block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) matches category-theory.html verbatim — uses single quotes for the namespace string, which matches characteristic-classes (atiyah-singer uses double quotes; the *function code* otherwise identical). k-theory adopted the canonical single-quote variant. Good.
- `<head>` has a duplicated pair of CSS `<link>` tags: `./css/print.css` and `./css/theme-light.css` appear at lines 165–166 (outside the breadcrumb-head-auto fence) **and again** at lines 171–172 (inside the fence). Reference pages have these two links only inside the breadcrumb-head-auto fence. Cosmetic but flagged because it indicates the auto-injector ran on a page that already had hand-rolled link tags. Not blocking; would be cleaned up by re-running `inject-breadcrumb --fix` after deleting the pre-fence pair, or simply patched in `content/k-theory.json`.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.readout`, `.row`, `.note`, `.ok`, `.bad`) is used uniformly across all six widgets. No ad-hoc classes. Good.
- Every SVG carries a `<title>` (a11y); every range/select pair has a `<label for=>`. Matches the audit-accessibility expectations.
- The §1 callback `<aside class="callback">` and `<aside class="related">` blocks are present and well-fenced with the auto-begin/end markers — auto-injectors will keep behaving idempotently.

## Severity
minor polish
