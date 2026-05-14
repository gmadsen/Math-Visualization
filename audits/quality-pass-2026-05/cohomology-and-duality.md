# cohomology-and-duality — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** algebraic-topology, homotopy-theory

## Summary
A strong, well-paced page that closely matches the section's pedagogical voice and notation conventions. Six numbered sections each ship a worked example AND an interactive widget; the prose tone, "why bother / worked example / take-away" rhythm, and cross-page callbacks all align with the peers. Only minor cosmetic polish needed.

## Findings

### Notation drift
- `\Lambda_{\mathbb{Z}}[\alpha,\beta]` (cohomology-and-duality.html:288, 451) carries an explicit `_{\mathbb{Z}}` subscript, whereas algebraic-topology.html:1250 writes the same object as `\Lambda[\alpha,\beta]` and homotopy-theory.html:406 as `\Lambda[\alpha]`. Since the surrounding `H^*(-;\mathbb{Z})` already pins the coefficient ring, the subscript is redundant. Cosmetic; either flavor is mathematically clear, but the unsubscripted form is the section convention.
- `H^*_{\mathrm{dR}}` uses `\mathrm{}` (cohomology-and-duality.html:732, 739, 844) while the page elsewhere relies on the `\Hom`-style `\operatorname{}` macro convention seeded in the helper. Peer pages have no de Rham appearance, so there's no direct collision, but `\operatorname{dR}` would match the rest of the helper-defined operators on this same page. Cosmetic.
- `\mathrm{Tor}_1^{\mathbb{Z}}` (cohomology-and-duality.html:447) is fine and standard, just one of several places where a one-off `\mathrm{}` is used in lieu of an `\operatorname{}` (or a macro). Cosmetic.
- _No semantic drift._ `\mathbb{Z}/\mathbb{R}/\mathbb{Q}/\mathbb{C}` are written `\mathbb{...}` everywhere on all three pages (matching `category-theory.html` and the `:root` macros block); `\smile`, `\frown`, `\Hom` (via the shared macro), and `\Lambda` all carry the same meaning across the three files.

### Undefined jargon
- "exterior algebra" appears in §1 (cohomology-and-duality.html:289 and again at 452) without a one-line gloss the first time. Readers arriving from `algebraic-topology.html` have only seen "graded-commutative ring under the cup product" — a parenthetical "(degree-1 generators that anticommute and square to zero)" the first time would close the loop without slowing the page down.
- "$\delta$-functor" appears once in the de Rham proof sketch (cohomology-and-duality.html:737: "Both sides are $\delta$-functors satisfying the Eilenberg–Steenrod axioms…"). Neither peer defines it, the page itself never returns to the term, and there is no callback to a homological-algebra page that does. Reasonable inside a "Sketch of proof" aside, but a single qualifier ("a cohomology-like sequence functor") would make the aside readable to someone who hasn't internalized the term.
- "Local system" appears in §5 (cohomology-and-duality.html:883: "one needs cohomology with coefficients in a local system $\mathcal{H}^q(F)$") without a gloss or callback. Minor; the surrounding sentence makes it clear it's a coefficient system, but the term is technical.
- "Eilenberg–Steenrod axioms" is named at line 737 without expansion. The peers don't define it either, so this is a section-wide gap rather than a target-only issue, but a one-liner ("the four invariance axioms that pin down ordinary cohomology") would help.

### Tone mismatches
- _None significant._ The page matches the peer voice: conversational openings ("Three reasons. First…", "The clearest mental picture is a $(p,q)$-grid"), worked examples called out by name, and "Take-away" / "Slogan" closers in `.ok` boxes — exactly the rhythm of `algebraic-topology.html`'s §6–7 and `homotopy-theory.html`'s §3. The "Why spectral sequences feel hard" `.note` (cohomology-and-duality.html:992) is a particularly nice peer-aligned move.

### Missing worked examples
- _None._ Every numbered `<h2>` has both a worked example and an interactive widget:
  - §1 cup product → `H^*(T^2)` table widget.
  - §2 Mayer–Vietoris/Künneth → `H^*(\mathbb{CP}^n)` worked example + Künneth tensor-table widget.
  - §3 Poincaré duality → genus-$g$ surface table + palindromic-Betti widget.
  - §4 de Rham → $H^1_{\mathrm{dR}}(S^1)$ proof + integration-on-$S^1$ widget.
  - §5 spectral sequences → Hopf fibration example + page-by-page Serre SS widget.
  - §6 characteristic classes → tautological bundle on $\mathbb{CP}^n$ (no widget, but flagged as a "preview" section, which matches the peer pattern of lighter terminal sections).

### KaTeX macros / formatting
- Helper macros (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) at cohomology-and-duality.html:22–29 are byte-identical to the same block on algebraic-topology.html:38–45 and homotopy-theory.html:22–29. No locally invented macros.
- `\restriction` at cohomology-and-duality.html:277 is a standard KaTeX-supported function (not a custom macro); does not appear in either peer but is appropriate here for the front/back-face restriction in the cup product definition.
- Delimiters: `$…$`, `$$…$$`, and `\(…\)`/`\[…\]` are configured but the page only uses `$/$$`, matching peers.
- Helper `<script>` block at cohomology-and-duality.html:187–239 (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is byte-identical to the same block at category-theory.html:187–239 and homotopy-theory.html:187–239. Algebraic-topology has a different (extended) helper block including rational-arithmetic helpers (`Q`, `qAdd`, `rankQ`) — that's a peer-side extension, not a target-side deviation.
- Widget chrome: every widget uses `.widget / .hd / .ttl / .hint / .readout / .row / .small`, plus `.note / .ok / .bad` callouts. No ad-hoc classes detected.
- Inline `style="text-align:center"` on display-math `<p>` tags is a cosmetic departure from `$$…$$` blocks that the peers also use; both styles are present across the corpus, no action needed.

## Severity
minor polish
