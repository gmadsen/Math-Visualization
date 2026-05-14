# high-dimensional-geometry — pedagogical audit (2026-05)

**Section:** Probability & statistics
**Compared against:** probability-theory, random-matrix-theory

## Summary
Strong, tight page: every numbered section has a working widget, the prose voice is concentrated-but-conversational, and notation matches the section peers. A handful of small drifts — operator-norm subscript style, an undefined "VC dimension"/"PAC", a possibly-misrouted callback in §5, and Talagrand's "convex distance" used before its set $A$ is motivated — are the only items worth addressing.

## Findings
### Notation drift
- `\|W\|_{op}` (line 886) renders the subscript as italic math letters `o`,`p`. Section peers use `\mathrm{...}` for multi-letter operator subscripts (rmt: `\rho_{\mathrm{sc}}`, `\mathcal{K}_{\mathrm{Ai}}`, `\mathrm{USp}`). Suggest `\|W\|_{\mathrm{op}}`. Cosmetic, but the `\mathrm` convention is uniform in rmt.
- `M_f = \mathrm{med}\,f` (line 266) and `\mathrm{med}\,f` (line 640) use `\mathrm{med}`; consistent within target. Probability-theory writes "median" only in prose, so no peer to match — fine. Cosmetic.
- Target uses `\varepsilon` everywhere (lines 375, 380, 487, 889). Probability-theory mixes `\varepsilon` and `\epsilon` (e.g. `\varepsilon` at line 1304); rmt uses `\epsilon` for indexing. Target is internally consistent — no action.
- Target writes Wigner operator norm with $n\times n$ in the same sentence the matrix is called $m\times n$ ("$\|W\|_{op}\le 2\sqrt n+O(1)$ for $n\times n$ Wigner"). Semantic drift inside one paragraph: $W$ was just defined as $m\times n$, then re-typed as $n\times n$ Wigner without warning. Recommend separating the sample-covariance bound from the Wigner bound, or relabeling.

### Undefined jargon
- "**VC dimension**" appears at line 888 ("hypothesis class $\mathcal{H}$ of VC dimension $d$") with no parenthetical, no definition, and no callback. First and only mention on the page.
- "**PAC**" — section header reads "Statistical learning (PAC)" (line 888) with no expansion. Probability-theory expands acronyms on first use (PMF, PDF, MGF, CDF). Spell out "Probably Approximately Correct" or drop the bracket.
- "**ERM**" / "empirical-risk minimiser $\hat h$" (line 888) and "$R_{\mathrm{emp}}$" / "$R$" appear in the displayed inequality without prior definition of empirical vs population risk.
- "**RIP**" is defined inline ("Restricted Isometry Property") then immediately abbreviated — fine, but the same paragraph then says "JL-type concentration … gives RIP with high probability"; "JL-type" is also undefined as an adjective (the section above is titled "Johnson–Lindenstrauss" so a reader can connect the dots, but it's a coined modifier).
- "**Grassmannian** $\mathrm{Gr}(k,n)$" (line 380) used inside Milman's proof sketch with no parenthetical gloss. Probability-theory's analog ("$\sigma$-algebra", line 277) gets a one-clause gloss; rmt's "$\ast$-algebra" (line 1060) gets "(think: matrices with…)". Suggest a half-sentence gloss here.
- "**convex distance** $d_T(x,A)$" (line 636) is *defined* by formula but the surrounding paragraph never says what role $A$ plays operationally before launching into the inequality. Compare probability-theory §1, which always sets up the working object in prose before stating the formal definition.
- "**Lebesgue decomposition**", "**Cantor distribution**" — not on this page; mentioned only to confirm probability-theory's habit of glossing-then-using is the local norm.

### Tone mismatches
- §6 Applications reads as a four-bullet textbook tour rather than an "exercise you can poke" — three of four paragraphs are pure exposition with no concrete numbers, only one (Marchenko–Pastur) has a widget. Probability-theory's analogous overview-section habit is to land each abstract paragraph with a worked example first; rmt does the same. Tone is dry-textbook here, not Brilliant-style.
- §7 Connections (line 1067) is a single dense paragraph cramming "structured high-dimensional models", "free probability", "Sturm–Lott–Villani", "overparametrised neural-network losses" without any glosses. Reads like research-program shop-talk; the rmt equivalent (§7 Katz–Sarnak) at least sets up "Montgomery's pair correlation" before name-checking heavy machinery.
- The "blessing of dimensionality" gloss (line 268) and "Hilbertian-already / non-Hilbertian-but-rescuable" coinage (line 382) hit the right conversational register; keep that voice as the model for §6 and §7.
- §5 closing paragraph "Sphere $\to$ Gauss limit" (line 766) is a beautifully compact transitional gloss — the kind of bridging the rest of the page could use more of.

### Missing worked examples
- §6 **Applications** has one widget (Marchenko–Pastur) covering one of four sub-topics; compressed sensing, PAC, and random tensors get formula-only treatment. Either trim to the MP application, or add toy demonstrations (e.g. an interactive RIP-check on a small Gaussian matrix, or a VC-bound calculator). Per AGENTS.md "every numbered $<h2>$ section should have at least one concrete computation or widget" — the section qualifies because of MP, but pedagogically each sub-claim is a separate concept.
- §7 **Connections** is purely prose + bulleted cross-links. Probability-theory and rmt both end with a similar-shaped section, so this matches local convention — flag as cosmetic.
- All other sections (§1–§5) have a widget plus a worked algebraic step, matching the house standard.

### KaTeX macros / formatting
- Helper-block at top of body (lines 187–239) is a verbatim copy of category-theory.html's 2D helper block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`). Conforms to AGENTS.md "Page-global helpers". OK.
- KaTeX macros in head (lines 22–29) match probability-theory and rmt verbatim (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`). No bespoke macros introduced. OK.
- Widget chrome consistently uses `.widget / .hd / .ttl / .hint / .row / .readout / .small / .note / .ok / .bad`; no ad-hoc classes. OK.
- §5 callback (line 870) lists "Functional analysis · Bounded operators and adjoints" as the only "See also". The Gaussian isoperimetric inequality has nothing to do with bounded operators on its surface; the callback was likely auto-generated from the `bounded-operators-fa` prereq in `concepts/high-dimensional-geometry.json` (line 38 of that JSON), but the prereq itself is suspect — log-Sobolev / Bobkov / Ornstein–Uhlenbeck would more naturally callback to harmonic analysis or Sobolev spaces, not bounded-operators. Flag for prereq review, not for the page itself.
- §1 callback duplicates a measure-theory link: "$L^p$ spaces" appears twice (lines 355 and 356), once as "measure theory · $L^p$ spaces" and once as "$L^p$ spaces" with a different anchor (`#lp-spaces` vs `#lp`). Likely an auto-callback merge artifact — only one should remain.
- All `$…$` / `$$…$$` delimiters; no invented delimiters. OK.

## Severity
minor polish
