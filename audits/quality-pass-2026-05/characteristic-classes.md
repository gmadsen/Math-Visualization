# characteristic-classes — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** algebraic-topology, k-theory

## Summary
A strong, well-paced page: ten numbered sections, every section §1–§9 carries its own widget, notation matches the section peers almost everywhere. The only real friction is occasional jargon-before-definition (Čech cohomology in §1; Steenrod squares / obstruction theory in the §6 transition; Stiefel manifold in §9), one widget readout that mislabels an equivariant weight, and a slightly heavier UK-spelling tilt than the rest of the section.

## Findings
### Notation drift
- _Cup product, field symbols, `\widetilde`, `\mathrm{ch}`, `\mathrm{Td}`, `\mathrm{Pic}`, `\mathcal{O}(d)`, `\Sigma`, classifying spaces $BU(n)/BO(n)$ all match `algebraic-topology.html` and `k-theory.html` exactly._ The shared macro block (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) is byte-identical to both peers.
- (cosmetic) Spelling: characteristic-classes uses 12 instances of UK forms (`localisation`, `trivialisation`, `normalisation`, `colour`) versus 3 in `k-theory.html` (only `localisation`, `Localisation`) and 0 in `algebraic-topology.html` / `category-theory.html`. The page is internally consistent but stands out within the section. Worth flagging only if the corpus moves toward one spelling — not blocking.
- (cosmetic) §10 outro uses a numbered `<h2>10. Connections` heading, while `k-theory.html` uses an unnumbered `<h2>Connections</h2>` for the same role. The numbered form is slightly more consistent with the rest of the page; either survives. Not a defect.

### Undefined jargon
- (high) §1, line 266 introduces "Čech 1-cohomology with values in $GL_n$" in the second paragraph after "vector bundle" — no callback, no inline gloss. A reader who only knows singular cohomology has nowhere to land. `algebraic-topology.html` introduces vocabulary (`H_n`, `\pi_1`) explicitly with a one-sentence intuition every time. Suggested fix: half-sentence parenthetical ("…a Čech 1-cocycle, i.e. an assignment of $g_{\alpha\beta}$ to each pairwise overlap satisfying the triangle compatibility above") or a callback to a future section / sister topic.
- (high) §6 opening sentence (line 500): "Up to here the construction has been topological — Stiefel–Whitney via Steenrod squares, Chern via $\mathbb{CP}^\infty$, Euler via obstruction theory." Both **Steenrod squares** and **obstruction theory** appear here for the first time in the page, and §2 (Stiefel–Whitney) actually defines the classes axiomatically — not "via Steenrod squares". So the retrospective sentence introduces two new technical terms while also slightly misdescribing what §2 did. Reword as "Up to here the construction has been topological — characterized by axioms (§2, §3) and obstruction-theoretic for Euler (§5)."
- (medium) §6, line 502: "$\mathrm{Ad}$-invariant polynomial $P\colon \mathfrak{u}(n)\to\mathbb{C}$" uses the Lie-algebra notation $\mathfrak{u}(n)$ and the adjoint representation $\mathrm{Ad}$ without a callback to `lie-groups.html` or `lie-algebras.html`. Compare §9, which does set up its Lie-group context ("compact Lie group $G$ acts on $X$") and links to `lie-groups.html` in its `See also`. Add a callback or a one-line gloss.
- (medium) §6, line 506 introduces "transgression form $\mathrm{TP}$" for the first time on the page, in the body of a `note` block, with no further reference. Reader doesn't need it to follow the sentence, but the symbol is opaque — either drop the explicit name (just "an explicit form") or add "(the Chern–Simons / transgression form, see Chern–Weil literature)".
- (medium) §9, line 648: "Stiefel manifold for $G = U(n)$" — first and only appearance of "Stiefel manifold" on the page. A one-clause gloss ("the space of orthonormal $n$-frames in $\mathbb{C}^\infty$") would close it.
- (low) §8, line 614: "heat-kernel asymptotics" appears in the `Why $\tanh$?` note with no callback. The note is intentionally a flavor aside, so this is acceptable, but a `(see atiyah-singer-index-theorem)` link would help.
- (low) Hero `<p class="sub">` (line 259) mentions "translate the curvature of a connection into integers" before §6 defines either; the §1 §1 callback is to "tangent bundle" only. Acceptable as scene-setting; flagging because the same thing in §1 (Čech cohomology) is more disruptive.

### Tone mismatches
- _Voice generally matches the section: precise, concrete, occasional second-person motion ("you can verify by hand for $n=1,2$"), worked mini-examples in `note`/`ok` blocks, and the same `chi(S^2) = 2`-style tangible payoffs the references use._ §5 and §7 are particularly well-paced.
- (low) §6, line 502–504 are dense: the curvature definition, the Ad-invariant polynomial, the $i/2\pi$ normalisation and the integrality lattice all land in two paragraphs with no widget breath between them. Compare `k-theory.html` §4 (Chern character) which spaces a definition, two structural compatibilities as bullets, an `Atiyah–Hirzebruch` aside, and a worked $\mathcal{O}(d)$ on $\mathbb{CP}^n$ before its widget. Consider splitting §6 into a definition paragraph and a normalisation paragraph, or moving the lattice-integrality sentence into a follow-up `note`.
- (low) §10 (Connections) is pure prose with no `note`/`ok`/widget — fine for an outro, matches `k-theory.html`'s `Connections` style, but it ends with a `<p class="small">"Open frontiers: …"` one-liner that reads more like a TODO list than the deliberate `frontier is broad…` paragraph k-theory uses. Cosmetic.

### Missing worked examples
- _Sections 1–9 each have an interactive widget, several with multi-state pickers (§2 four-surface picker, §4 three-rank picker, §5 three-field picker, §6 four-surface curvature picker, §7 four-bundle picker, §8 four-manifold picker)._ Pedagogical density is strong.
- (note) §10 (`outro`) has neither widget nor `quiz` placeholder, which matches the references' outro convention; not a defect, just consistent.
- (low) §1's widget (`Möbius vs cylinder`) hides one of its two states behind a manual toggle — the cylinder is shown by default and Möbius is the click. The readout textually mentions $w_1$, but a reader who never clicks the toggle never sees the Möbius lift. Consider opening on the Möbius side (the more interesting case) or splitting the two into side-by-side panels — the §2 widget already shows four surfaces side-by-side, so the gesture exists.

### KaTeX macros / formatting
- _Macro block is byte-identical with the two references; no locally introduced macros. `\smile`, `\widetilde`, `\mathrm{...}`, `\colon`, `\mathbb{...}`, `\langle\cdot,[M]\rangle` evaluation pairings all match peers._
- _Delimiters `$…$`, `$$…$$` only — no `\(…\)` / `\[…\]` mixing. Helper block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is verbatim from the canonical template._
- (semantic, high) §9 widget readout (`#loc-readout` and the SVG label at line 1436): the SVG labels each fixed point with `weight t_i^n`, but the equivariant weight at $p_i$ is `t_i`; the *integrand* in the localisation sum is `t_i^n / \prod_{j\ne i}(t_j-t_i)` because we are integrating $c_1^n$. Calling the weight itself `t_i^n` conflates the per-point datum with the cohomology class being integrated. Quick fix: change `wt.textContent = "weight t_"+i+"^"+n;` to `wt.textContent = "weight t_"+i;` and add a separate display of the integrand somewhere (e.g. relabel the formula at the bottom which already has it correct).
- (low) §9 readout sentence in the n=1 case writes `\frac{t_0}{t_1-t_0} + \frac{t_1}{t_0-t_1} = 1` — this evaluates to $1$ only after recognizing it as $\frac{t_0 - t_1}{t_1 - t_0} = -1$, not $+1$; the correct identity for $\int c_1 = 1$ on $\mathbb{CP}^1$ is $\frac{t_0}{t_1 - t_0} + \frac{t_1}{t_0 - t_1} = \frac{t_0 - t_1}{t_1 - t_0} = -1$. The integrand is actually $t_i^n$ with $n=1$, i.e. the localisation produces $\int c_1 = -1$ (sign depends on orientation convention). Worth a sanity-check pass with a textbook before claiming the displayed identity equals 1; this is a semantic, not cosmetic, drift.

## Helper-block / widget-chrome hygiene
- _Top-of-`<body>` helper block (lines 186–235) is verbatim from `category-theory.html`._ All widgets use `.widget`, `.hd > .ttl/.hint`, `.row`, `.readout`, `.note`, `.ok` chrome — no ad-hoc classes introduced.
- All SVGs include `viewBox` and `<title>` accessibility text. Color tokens (`var(--blue)`, `var(--yellow)`, etc.) are used throughout the inline scripts; one helper function `curvColor()` in §6 hard-codes RGB triples (`[125,224,214]` cyan, `[131,193,103]` green, `[255,216,102]` yellow, `[224,122,95]` pink) for the colorbar gradient. These match the `:root` palette so the result is correct, but the `color-vars.mjs` audit will see them as raw values that won't follow theme swaps in light mode. Low-priority follow-up: read the four CSS vars at startup via `getComputedStyle` and reuse, or accept the dark-mode-only colorbar as a known limitation.

## Severity
minor polish

---
*Reminder to orchestrator: run `node scripts/rebuild.mjs` after any content changes.*
