# advanced-complex-analysis — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** complex-analysis, several-complex-variables

## Summary
A strong, tightly-themed sequel page that mirrors the conversational-but-precise tone of the section peers and uses the standard widget chrome correctly. The drift is almost entirely cosmetic (a few notation inconsistencies with the SCV peer and one helper-block divergence); two sections under-deliver on the "every section has a worked toy" rule.

## Findings

### Notation drift
- Polydisk uses two glyphs in the same paragraph cluster: `\mathbb{D}^2` in §13 prose ("a polydisk $\mathbb{D}^2$ minus a smaller inner closed polydisk") vs the unicode `𝔻²` in the widget header `Hartogs figure in ℂ²: 2D schematic of the polydisk slice`. The SCV reference standardizes on `\mathbb{D}^2` / `\u{1D53B}²` and reuses the same widget — but mixes its own delimiters less. Cosmetic.
- `\Omega \subset \mathbb{C}` vs `\subseteq` is inconsistent in §13: "every $\Omega\subseteq\mathbb{C}$ is" in the table row, but `\subset\mathbb{C}^n` everywhere else. The SCV peer is consistent: `\subset\mathbb{C}^n`. Cosmetic.
- `\hat{\mathbb{C}}` is introduced unannounced in §10 ("$f$ omits at most two values from $\hat{\mathbb{C}}$"); `complex-analysis.html` defines it carefully in §2. A one-clause gloss "the Riemann sphere $\hat{\mathbb{C}} = \mathbb{C}\cup\{\infty\}$" would match the section-peer treatment. Low priority.
- "Quasiconformal" has $\partial_z, \partial_{\bar z}$ used distributionally in §12 ("first distributional partial derivatives are locally $L^2$") — fine — but the SCV reference and `complex-analysis.html` write the Cauchy-Riemann operator as `\partial_{\bar z}` consistently throughout. The target also uses `\bar\partial f` in §13 — a convention switch (form vs partial) within the same page. Mild but semantic: `\bar\partial` is a $(0,1)$-form, `\partial_{\bar z}f` is its component. Worth a one-sentence reconciliation when both first appear.
- Levi form: the target in §13 says "the Levi form of $\partial\Omega$ (the complex-Hessian of a defining function, restricted to the holomorphic tangent directions $T^{1,0}\partial\Omega$)" which is correct, but does not write `\partial\bar\partial\rho` — the SCV peer §2 explicitly identifies the Levi form as `\partial\bar\partial\rho|_p` restricted to `T^{1,0}_p\partial\Omega`. Symbol drift across two pages discussing the same object.
- The Beurling transform is denoted `\mathcal{T}` in §12 but most of the corpus and the SCV peer reach for `\mathcal{B}` for Beurling-class operators. Low priority — the symbol is local to the paragraph that introduces it.

### Undefined jargon
- "Plurisubharmonic exhaustion" is used in §13 ("$\Omega$ admits a plurisubharmonic exhaustion $\rho:\Omega\to\mathbb{R}$, $\rho\to+\infty$ at $\partial\Omega$") with PSH glossed parenthetically only later. The SCV peer §2 has a full `<div class="note">` definition before use. Since this page is a graduate sequel, a one-sentence inline gloss is sufficient — a callback to `several-complex-variables.html#psh` would be even better and is currently absent from the §13 callback aside.
- "Stolz cone" appears in §8 Fatou's theorem ("$\Gamma_\theta$ is any Stolz cone with vertex at $e^{i\theta}$") with no definition; the next paragraph alludes to "a cone of fixed aperture pointing into the disk" but does not explicitly tie it to the term. Quote: _"$\Gamma_\theta$ is any Stolz cone with vertex at $e^{i\theta}$"_.
- "Pluriharmonic" is used in §11 ("the extra factors $\log\phi'(z) + \log\overline{\phi'(w)}$ are pluriharmonic") and parenthetically explained as "in one complex variable, simply harmonic" — acceptable, but the term is stronger than its appearance suggests in higher dimensions and could use a callback.
- "Beurling transform" is named but not defined ("the Beurling transform $\mathcal{T}: L^p \to L^p$ (a singular integral operator that intertwines $\partial_z$ and $\partial_{\bar z}$)"). The parenthetical is enough for orientation; flagged only because no callback to `harmonic-analysis-fourier.html` or `microlocal-analysis.html` is offered.
- "$T^{1,0}\partial\Omega$" in §13 is used without prior introduction of the holomorphic-tangent decomposition. The SCV peer at least bookends it with a Levi-form definition; here it lands cold.

### Tone mismatches
- §6 (Phragmén-Lindelöf), the "Three-lines theorem and applications" sub-block, slips into dry textbook voice: a single dense paragraph that strings five names together (Hadamard three-lines, Riesz-Thorin, $L^{p_0}$, $L^{p_1}$, $L^{p_\theta}$) without the conversational "here's the punchline" framing the rest of the page maintains. The complex-analysis peer §16 (Schwarz lemma) handles a similar density with explicit "Schwarz–Pick. Removing the assumption…" — same density, more breath.
- §8 (Hardy spaces) "Why $H^p$ matters" is a five-claim run-on listing Beurling, Paley-Wiener, Calderón-Zygmund, the boundary trace, and the Fourier-coefficient characterization in one paragraph. The category-theory canon would split into a bullet list or a `<div class="note">`.
- §10 (Nevanlinna) "The witness is, again, the exponential." opening of §3 is a nice voice mirror; but §10 itself opens with "Picard's theorems are sharp _in count_…" and then immediately drops into formal $T(r,f)$ machinery without the Brilliant-flavored "let's see what fails first" beat. The complex-analysis peer's §12 ("in real analysis, $\sin x$ is bounded and nonconstant; over $\mathbb{C}$, no such function exists") is the model for that hook.
- §11 (Bergman) has a paragraph-final aside in parens — _"(Some texts use the normalization $K = (n+1)/(\pi(1-|z|^2)^{n+2})$ on the unit ball in $\mathbb{C}^n$, giving curvature $-2/(n+1)$; here we stick with…)"_ — which is more textbook-disclaimer than reader-friendly. Section peers tend to avoid the "some texts" hedge.

### Missing worked examples
- §4 (Weierstrass factorization) — pure definitions + sine product + Gamma identity, but no widget. The two derived computations are nice but not "a toy you can poke." Sectional grade per CLAUDE.md house rule: missing-example.
- §5 (Mittag-Leffler) — same: cotangent expansion is a worked computation in prose, but no interactive. missing-example.
- §6 (Phragmén-Lindelöf), §7 (Hadamard three-circles), §8 (Hardy spaces) — three back-to-back sections without widgets. The $M(2)\le 4$ worked example in §7 is the one that most cries out for an interactive: a slider on $r_2$ that draws the convex envelope $\log M$ and shows the bound saturated by $z^a$. Compare the SCV peer where every numbered section has a widget.
- §1 (overview) and §14 (connections) are deliberately narrative and rightly have no widget — fine.

### KaTeX macros / formatting
- The page declares the standard macro set (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) verbatim from `category-theory.html` — none of these are actually used here, which is harmless boilerplate matching the peer. No new macros invented locally.
- All math is delimited with the four canonical pairs (`$…$`, `$$…$$`, `\(…\)`, `\[…\]`) — no invented delimiters.
- `\operatorname{Re}` is used freely (e.g. `\operatorname{Re} z`) — matches `category-theory.html` convention. Good.
- One semantic stutter in the Bergman-kernel widget: SVG header text uses ASCII `π²` for `π²`, while the inline math uses `\pi^2`. Both render correctly; the SVG path is unavoidable since `<text>` doesn't run KaTeX. Cosmetic; matches the SCV peer's approach.
- The `<title>` elements on widget SVGs are present and descriptive (good for `audit-accessibility.mjs`), e.g. `<title>Nevanlinna characteristic T(r,f) as stacked m + N</title>`.

## Helper-block / widget-chrome hygiene
- Top-of-body 2D helper block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is byte-identical to the canonical block in `category-theory.html` — verified by spot-check of `drawArrow`'s `pad1`/`pad2` defaults, marker construction, and label-side math. Good.
- Unlike `complex-analysis.html`, the target does **not** include the `Cx` complex-arithmetic helper (`Cx.add`, `Cx.mul`, etc., lines ~239–258 of complex-analysis). This is fine — none of the target's widgets need it — but if Nevanlinna or Bergman ever grows true complex-arithmetic-heavy widgets, that block should be copied verbatim, not reinvented.
- Widget chrome uses `.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout` consistently. No ad-hoc classes.
- `.note` / `.ok` / `.bad` are used appropriately (theorem statements as `.note`; SCV peer reaches for `.ok` for slogans like "Convexity in log-coordinates of a Reinhardt domain ⇔ no Hartogs extension." Target uses only `.note` — slightly less visual variety than the peer, but not a defect).
- Color tokens: widget bodies use `var(--cyan)`, `var(--yellow)`, `var(--pink)`, `var(--violet)`, `var(--green)`, `var(--mute)`, `var(--ink)`, `var(--bg)` exclusively in SVG paint — no raw hex slipping in. The Bergman heatmap RGB interpolation is computed numerically from the cyan/yellow palette endpoints with an inline comment explaining the choice — this is the right pattern.

## Severity
minor polish
