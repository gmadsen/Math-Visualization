# group-schemes — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** schemes, etale-cohomology

## Summary
Strong page overall: every numbered section has a worked widget plus a `<div class="note">` "Worked example" callout, the helper block matches `category-theory.html` verbatim, and KaTeX macros use the canonical `\Spec`/`\Hom`/`\Gal` set. Main drift is internal: étale-subscript notation switches between three forms across prose, SVG strings, and widget JS, and several heavyweight terms (Frobenius, Hilbert 90, Cartier duality, Maschke, Dieudonné) appear without a first-use definition or callback.

## Findings
### Notation drift
- **Étale subscript (semantic, high priority)**: prose uses `\mathrm{\acute{e}t}` (e.g. `H^1_{\mathrm{\acute{e}t}}` at line 785, `G^{\mathrm{\acute{e}t}}` at line 644), but widget readout strings and counterexample-explorer `latex` fields use literal Unicode `ét`: `H^1_{ét}` (lines 800, 805, 806, 811, 822, 828, 833) and `G^{ét}` (lines 663, 665, 667, 669, 671, 673). Meanwhile `etale-cohomology.html` consistently uses `\text{ét}` (e.g. `H^i_{\text{ét}}` at lines 341, 343, 345, 690, 696). Three pages would benefit from a single convention; per `etale-cohomology.html` precedent, `\text{ét}` is the established choice in the section. 14 literal-Unicode occurrences total.
- **Frobenius operator (cosmetic)**: group-schemes uses `\mathrm{Frob}` (lines 423, 671); `etale-cohomology.html` uses `\operatorname{Frob}_q` (lines 690, 696). Both render similarly but the rest of the corpus's macro convention (`\Spec`, `\Hom`, etc. all `\operatorname`) suggests `\operatorname{Frob}` is the house form.
- **`\Spec` argument spacing (cosmetic)**: group-schemes uniformly writes `\Spec\,k`, `\Spec\,A` with a thin-space (e.g. lines 420–423, 505); `etale-cohomology.html` uses bare `\Spec k` and `\Spec B` (line 232, 236); `schemes.html` uses `\Spec(R)` and `\Spec\mathbb{Z}` (lines 221, 258). Three styles in three pages — pick one.

### Undefined jargon
- **"Hilbert 90"** appears in prose (line 789, "Hilbert 90 says this agrees with $H^1$ in the Zariski topology") and again in the torsor-cases widget (lines 814, 838) before it is defined or linked. No prereq callback to `class-field-theory.html` or `galois-cohomology-and-brauer.html` where it lives.
- **"Cartier duality"** appears at line 647 ("Cartier-style components … Cartier duality swaps connected and étale") with no definition or callback. First-time readers parsing the connected/étale decomposition cannot evaluate the parenthetical.
- **"Maschke fails"** at line 910 ("characteristic $p$ where Maschke fails") in §7 — fine in a wrap-up section, but the §7 backlinks to representation-theory don't carry the term as an anchor.
- **"Dieudonné theory" / "SGA 3 setting"** at line 916 — both are open-frontier name-drops in the small-text footer; arguably acceptable as forward pointers, but neither has even a brief gloss.
- **"$\mathrm{QCoh}(BG)$"** at line 910 (representation-theory blurb) introduces classifying-stack notation $BG$ and quasi-coherent sheaves on it without definition. Stacks are referenced obliquely but never expanded.
- **"perfect field"** at line 643 — used as a hypothesis without a one-line gloss; readers coming from §1–§3 (which only mention fields generically) hit this term cold at the start of §4.

### Tone mismatches
- **§1 opening leans dry-textbook**: the page opens with three back-to-back definitional paragraphs (lines 274–284) before the first interactive cue at line 286. `category-theory.html` and `schemes.html` both lead with motivation/problem framing before the formal definition (e.g. schemes.html opens with "three problems nag at you" and pill-tagged motivating problems). Group-schemes by contrast launches straight into "A **group scheme** over a base scheme $S$ is …".
- **§4 paragraph 1 is a wall of formulas with terse narration**: line 645 packs short-exact-sequence + canonical splitting + Cartier proof sketch into one paragraph ending with "concretely, $G^{\mathrm{\acute{e}t}}$ is recovered as $\Spec(\mathcal{O}(G)_{\mathrm{red}}/\text{nilpotents at non-identity components})$" — that informal "$\text{stuff}$" placeholder mid-formula is a tone slip not seen on the reference pages.
- **Hero subtitle is just a symbol list**: `$\mathbb{G}_a, \mathbb{G}_m, \mu_n, \alpha_p$: group objects in schemes, Hopf algebras, and torsors.` (line 269). Compare schemes.html ("every commutative ring is a space, and every space is made of rings glued together") and etale-cohomology.html ("Grothendieck's replacement for singular cohomology in characteristic $p$. …"). Both lead with a one-sentence motivating idea before listing topics. Group-schemes leads with the symbol list.

### Missing worked examples
- _None._ Every numbered §1–§6 has both a widget and at least one inline `note` callout; §7 is a "Connections" wrap-up with `<h3>` outbound links and no quiz placeholder, which mirrors the epilogue style elsewhere in the corpus and is consistent with intent.

### KaTeX macros / formatting
- **`\acute{e}` workaround instead of `\text{ét}`**: `\mathrm{\acute{e}t}` is non-standard inside the corpus — KaTeX renders it (no error), but `\text{ét}` (used by etale-cohomology) is shorter, native-Unicode-clean, and renders identically. Consider standardising.
- **Local-only macros not used**: page declares `\tr`, `\ad`, `\ind` in the loader (lines 26–28) but only `\tr` is used (lines 722, 757). Harmless but suggests a copy-pasted macro list rather than a curated one — same as the references, so this is a corpus-wide cosmetic issue, not group-schemes-specific.
- **Plain `<p style="text-align:center">$…$</p>` instead of `$$…$$`**: lines 644, 718, 788, 790 use centred-paragraph inline math instead of display math. Both render but display-math (`$$`) is the convention in `category-theory.html` (search for `$$` blocks) and `etale-cohomology.html` (line 345, 475, 479, 690, 923, 935). Cosmetic but inconsistent.
- **Helper-block / widget-chrome hygiene**: top-of-body helper script (lines 191–242) is a verbatim match against `category-theory.html`. All widgets use the standard `.widget`/`.hd`/`.ttl`/`.hint`/`.row`/`.readout`/`.note` chrome. SVGs include `<title>` elements (lines 296, 578, 655). No ad-hoc classes detected. Color tokens via `var(--…)` throughout the SVG `svgInner` strings (no hex literals).

## Severity
minor polish
