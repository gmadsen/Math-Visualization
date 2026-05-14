# expanders — pedagogical audit (2026-05)

**Section:** Combinatorics & graph theory
**Compared against:** spectral-graph-theory, probabilistic-method

## Summary
Strong page: every numbered section has a worked widget, the prose carries category-theory's "say-the-slogan-then-prove-it" voice, and the cross-page callbacks chain neatly into spectral-graph-theory and random-walks-and-mixing. The only meaningful issues are (1) a small but real cluster of CSS-syntax bugs in the canonical style block where `var(--foo)` got wrapped in stray quotes, breaking link/hover/active styling silently, and (2) inconsistent use of `\mathrm{}` around group-name macros (`SL_2(\mathbb{Z})` vs `\mathrm{PGL}_2(\mathbb{F}_q)`) within a single paragraph.

## Findings

### Notation drift
- **High priority — internal inconsistency on group names.** §4 (`#construction`) writes `$SL_2(\mathbb{Z})$` and `$SL_3(\mathbb{Z})$` (no `\mathrm`) on lines 684, 686, then `$\mathrm{PGL}_2(\mathbb{F}_q)$` and `$\mathrm{PSL}_2$` with `\mathrm` on line 689 — same paragraph block, different convention. The peer (`spectral-graph-theory.html#bipartite-expanders`, line 1152) uses `$\mathrm{PGL}_2(\mathbb{F}_p)$`, and the matching concept-graph blurb (`concepts/expanders.json:80`) also uses `$\mathrm{PGL}_2(\mathbb{F}_p)$`. Pick one — `\mathrm{SL}_2(\mathbb{Z})` etc. — and apply uniformly.
- **Cosmetic — subscript prime field.** §4 line 689 introduces `$\mathbb{F}_q$` (with `q` distinct from the prime `p`) where the LPS field index is `q`. Spectral-graph-theory.html:1152 uses `$\mathbb{F}_p$` (single-prime telling). Both are defensible (LPS is genuinely indexed by two primes), but the expanders page never re-mentions `q` after defining it, so a reader skimming `\mathrm{PGL}_2(\mathbb{F}_q)` may briefly mis-remember the spectral-graph-theory page's `\mathbb{F}_p`. Consider one sentence anchoring "we use `q` for the field, `p` for the degree" — or align to `\mathbb{F}_p` if the two-prime distinction is not used downstream.
- **Cosmetic — Laplacian symbol.** §3 uses `$\mathcal{L}$` for the normalized Laplacian; spectral-graph-theory.html uses both `$L = D-A$` (combinatorial) and `$\mathcal{L} = D^{-1/2} L D^{-1/2}$` (normalized). Expanders.html never explicitly distinguishes, just opens with `$\mathcal{L} = I - \widehat A$` — fine internally but a reader bouncing between the two pages briefly wonders whether `$\mathcal{L}$` here means the same thing as on spectral-graph-theory.html. One half-sentence would close the gap.

### Undefined jargon
- **"Cayley graph"** is used on line 689 (`$(p+1)$-regular Cayley graph`) without a prior definition or callback on the page. The reader is expected to know it. Spectral-graph-theory mentions it once (line 1145) also without defining, so the cross-page corpus assumes it. Low priority but a one-line gloss ("the graph whose vertices are group elements and whose edges are right-multiplication by a generating set") would let the page stand alone.
- **"Fiedler vector / Fiedler eigenvector"** is used in §3 widget caption ("slide threshold on the Fiedler vector") and prose ("threshold the Fiedler eigenvector $u_2$") before any in-page definition. The cross-page callback to `spectral-graph-theory.html#fiedler` is in §3 but only as a "See also" *after* the widget. A parenthetical "(the eigenvector for $\lambda_2(\mathcal{L})$, also called the algebraic connectivity)" inline would unblock the widget hint.
- **"Kazhdan property (T)"** appears bolded on line 686 with no in-page elaboration and no callback (representation-theory.html is referenced elsewhere). The reader is told this is "the lower bound" without seeing why — just a name. Either trim ("…uniform in $n$ via deep group-theoretic input from $SL_3(\mathbb{Z})$") or add one sentence sketch.
- **"universal cover" / "spectral measure of the infinite tree"** §6 line 910 introduces both as the proof of Alon–Boppana. Universal cover is a topology concept that gets no callback to algebraic-topology.html; spectral measure isn't on a graph-theory page anywhere. Both are load-bearing for understanding why $2\sqrt{d-1}$ is special. A "See also" link to algebraic-topology covering spaces would fit the house pattern.
- **"w.h.p."** on line 785 (Reingold paragraph) is shorthand never spelled out on the page. Probabilistic-method.html spells "asymptotically almost surely (a.a.s.)" before using `a.a.s.` — same courtesy here.
- **"PCP theorem"** is namedropped in spectral-graph-theory.html:1145 but expanders.html doesn't reference it at all despite being a major application; not a defect, just noted that the cross-page menu of applications is asymmetric.

### Tone mismatches
- _None of substance._ The hero opens with the canonical 3B1B-style metaphor ("Sparse graphs that are nevertheless impossible to cut…"), §1 supplies the slogan ("$G$ has no 'narrow waist'"), and every section earns its proof with a concrete computation. Voice matches category-theory.html and spectral-graph-theory.html closely.
- Minor: §5 opens "Why does anyone care?" — punchier than the peers' typical lead-in but consistent with the conversational tone the style guide endorses; flag only as a thing to leave alone.

### Missing worked examples
- _None._ Every numbered `<h2>` (§1–§6) ships with a `<div class="widget">`: vertex-expansion explorer, spectrum-on-a-strip, Cheeger ratio sweep, zigzag schematic, mixing comparison, Ramanujan band check. The Connections section is unnumbered (per house convention). Coverage is at parity with spectral-graph-theory.html's eight-widget run.
- Note: §4 zigzag widget is a "schematic" (qualitative blob diagram), not a real eigenvalue computation. Compared to the actual Jacobi eigensolvers in §3 and §6, it's the weakest interactive on the page — but it's still a widget with sliders and matches the level of the worked example, so this is observation-only, not a defect.

### KaTeX macros / formatting
- **High priority — broken CSS quoting in the style block.** The `<style>` block has multiple instances of `'var(--foo)'` (single-quoted) where the canonical block uses bare `var(--foo)`:
  - Line 47: `a{color:'var(--blue)'}` — link color silently falls back.
  - Line 53: `h3{... color:'var(--yellow)'}` — yellow `<h3>` headings break.
  - Line 70: `button.active{... border-color:'var(--yellow)'}`
  - Line 88: `nav.toc a:hover{color:'var(--yellow)'}`
  - Line 102: `aside.sidetoc a:hover{color:'var(--ink)'}`
  - Line 103: `aside.sidetoc a.active{... border-left-color:'var(--yellow)'}`
  - Line 107: `.small{... color:'var(--mute)'}`
  These are not KaTeX issues but semantic CSS bugs (CSS values do not accept string-quoted `var()` calls; declarations are dropped). Spectral-graph-theory.html:47, 53, 70, 88, 102, 103, 107 has the bare `var()` form. Likely a global find-replace mishap that landed on this page only. **Fix priority: high** — this is the kind of drift that would survive a normal jsdom check but show up under the chrome-devtools eyeball.
- **Helper-block deviation — `drawNode` text color.** Line 233 sets `textColor='var(--ink)'`; the canonical helper block in spectral-graph-theory.html:233, probabilistic-method.html:233, and category-theory.html uses `textColor='#fff'`. The expanders page never calls `drawNode` from inline scripts (every widget builds its own circles), so this is dormant — but it counts as a verbatim-helper-block violation per AGENTS.md "page-global helpers — copy verbatim".
- KaTeX delimiters and macros are in line with canonical: only the standard `\Spec / \Gal / \Hom / \tr / \ad / \ind` macros from the loader; no locally-introduced shortcuts. `\widehat A`, `$\mathcal{L}$`, `$\mathbf{1}$`, `$\boxtimes$` are all standard KaTeX.
- Mixed math / unicode in widget readouts (line 1052: `λ₂`, `√(d−1)`, line 668: `λ₂(ℒ)`, line 510: `λ₁`, `λ₂`, `1−λ₂`). This matches the convention in spectral-graph-theory readouts (which also use `λ` glyphs in `<text>` rather than KaTeX), so no drift — noted only.

## Severity
minor polish
