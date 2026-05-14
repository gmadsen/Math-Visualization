# intersection-theory-chow — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** sheaf-cohomology, bezout

## Summary
Strong, well-paced page with a worked widget per section and good cross-page callbacks; the main drift is a corpus-level inconsistency in spelling "Bezout/Bézout" and uniformly British "-ise" verb endings that diverge from both peer references, plus a pile-up of advanced terminology (Borel–Moore, Griffiths, Fulton–MacPherson bivariant, Cohen–Macaulay, Schubert cells) introduced without callbacks or callouts.

## Findings
### Notation drift
- **"Bezout" vs "Bézout"** (semantic — actually a name): hero subtitle line 267 (`"Chern classes, and Bezout generalized."`) and §7 outro (`<h3>Bezout as the model case</h3>` line 906; `Bezout's theorem` line 908) drop the accent, while the same file uses "Bézout" with accent in lines 276, 459, 534, 627, 712. `bezout.html` is uniformly accented (e.g. line 224 `<h1>Bézout's theorem</h1>`). Recommend: settle on "Bézout" everywhere per `bezout.html` convention.
- **British "-ise/-ising" vs American "-ize/-izing"** (cosmetic but pervasive): target uses `globalises` (920), `internalise` (339), `characterised` (482), `parametrising` (912), `specialising` (844 ×2), `generalises` (893), `globalise` (308). Neither `bezout.html` nor `sheaf-cohomology.html` contains a single "-ise/-ising" form; both pages avoid the construction or use American forms (`generalize`, `globalize`). Recommend: align with the corpus default (American spellings).
- **`\Spec\, k` vs `\Spec k` micro-inconsistency** (cosmetic): target uses `\Spec\, k` (482, 844, 856), all with the explicit thin space; references generally write `\Spec\,k` (no space after comma) — minor and the macro itself is shared, so no semantic drift.
- `A^*(X)` codimension grading vs `A_*(X)` dimension grading is used consistently within the page and matches Fulton's convention; no internal drift.

### Undefined jargon
- **"Borel–Moore homology"** appears in §2 line 340 (`H_{2*}^{\mathrm{BM}}(X(\mathbb{C}); \mathbb{Z})`) with no gloss and no callback to a topic that defines it. First use is also only use; reader meets `\mathrm{BM}` superscript without explanation.
- **"Griffiths' results on the Fano threefold"** (§2 line 340) — a name-drop that requires the reader to know what a Fano threefold is and which Griffiths theorem is meant; no callback.
- **"operational Chow groups" and "the bivariant theory of Fulton–MacPherson"** (§3 line 483) appear in one sentence as escape hatches for the singular case; both are technical and undefined. By contrast, `bezout.html` line 537 carefully glosses "local ring … is exactly the ring you need…" before invoking it.
- **"Cohen–Macaulay"** (§3 line 484, "When $Y, Z$ are Cohen–Macaulay…") appears with no definition or callback. `sheaf-cohomology.html` similarly uses CM but only in the §9 Grothendieck-duality aside, after the reader has been carried through the simpler cases.
- **"Schubert cells" / "schubert-like classes"** (§4 lines 627–628). The §4 prose says `'pile up "schubert-like" classes'` (lowercase, in scare quotes) and then in the proof paragraph names the affine cell decomposition "Schubert cells" — first use without definition or callback to a Grassmannian/flag-variety page.
- **"Quillen's affine bundle lemma"** (§4 line 628) — invoked by name without a one-liner of what it says. References (`bezout.html` §4) tend to gloss every named theorem they invoke ("**Theorem (resultant = common-root detector).**").
- **"localization sequence"** (§4 line 628) — first occurrence on the page, used unpinned.
- **"Chern roots" and "splitting principle"** (§5 line 729, "live not in $A^*(X)$ but in the cohomology of an auxiliary 'splitting principle' cover") — these are introduced inline with quotes around the technical term, but no precise pointer/callback. The widget readout then uses "Chern roots" again.
- **"Chern character"** and **"Todd class"** are defined at first use (§6 line 843) — good — but **"Hirzebruch–Riemann–Roch"** is named in §6 line 844 before its statement appears; the proof scrubber later uses the abbreviation HRR/GRR. Mild.

### Tone mismatches
- The page is generally on-tone for the corpus, but §1 line 275 contains a sentence that drifts denser than the section peers: "Indeed, $\alpha \sim_{\mathrm{rat}} \alpha'$ iff there is a cycle $\Gamma$ on $X \times \mathbb{P}^1$ (flat over $\mathbb{P}^1$ on each component) whose fibre over $0$ is $\alpha$ and whose fibre over $\infty$ is $\alpha'$." — flatness is invoked parenthetically without a callback or one-line gloss; `bezout.html` would lead with the picture and footnote the technicality.
- §2 line 340 ("kernel detects 'algebraic but homologically trivial' cycles (Griffiths' results on the Fano threefold), and the cokernel reflects transcendental classes invisible to algebraic geometry") reads as a research-paper aside rather than the conversational "you" voice of `bezout.html` §1 ("Pick two conics in the real affine plane $\mathbb{R}^2$"). Consider rephrasing as a "what this is telling you" sentence or moving to a `<p class="small">` aside.
- §3 line 484 packs Serre's Tor formula plus the Cohen–Macaulay simplification into a single dense paragraph with no transitional "here's what this is doing" sentence — a pure formula wall, by the standards of §3 in `bezout.html` which alternates each formula with a one-line geometric translation.
- §7 ("Connections") drops to a notably terser, less narrated voice (3–4 line micro-sections under `<h3>` headings) that reads as a cheat-sheet rather than the conversational close-out used in `sheaf-cohomology.html` §10 ("Coda: toward étale cohomology", which has multi-paragraph narration and a proper "Why étale, concretely?" payoff list).

### Missing worked examples
- **§7 ("Connections") has no widget and no concrete computation** — it is four `<h3>` micro-sections of pure prose. Both `bezout.html` (§9 "Applications and forward references") and `sheaf-cohomology.html` (§10) similarly close with prose, but those pages' final sections also reference back to the existing widgets and have a more structured taxonomy (e.g. sheaf-cohomology's `<h3>Why étale, concretely?` numbered list with three concrete symptoms). Lower priority than the other items, since AGENTS.md only requires a worked widget per numbered `<h2>` section and §7 is genuinely a wrap-up.
- All numbered §1–§6 sections do have a widget; coverage at the canonical level is good.
- §5 (Chern classes) introduces "Chern roots" and the splitting principle in prose but the `Whitney sum` widget only exhibits the multiplicative-on-direct-sum case; a curious reader has no way to poke at a non-split bundle (the `T_{\mathbb{P}^2}` option is in the dropdown but is computed as if it were split — see line 766 comment "Euler seq → c=…" — i.e. the widget does not demonstrate the splitting trick, only quotes the result).

### KaTeX macros / formatting
- No locally-defined macros beyond the shared six (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`); KaTeX loader block is byte-identical to `bezout.html` and `sheaf-cohomology.html`. Good.
- Helper `<script>` block at top of `<body>` (lines 188–240) includes the full `$, $$, SVG, ensureArrow, drawArrow, drawNode` set verbatim from `category-theory.html`; matches the canonical helper. `bezout.html` ships a trimmed version (only `ensureArrow`, no `drawArrow`/`drawNode`) which is a minor variation, but the target is the conformant one.
- `$\,k$` with explicit thin space (`\Spec\, k`) appears in three places; the rest of the corpus mostly uses `\Spec\,k` with no surrounding space. Cosmetic.
- §2 widget readout uses raw Unicode `ℙ¹`, `𝔸¹`, `ℤ` in `<select>` `<option>` labels (lines 345–347). AGENTS.md flags LaTeX-in-`<option>` requiring `katex-select.js`; the loader is wired (line 178) and the option text is rendered KaTeX-friendly via `$…$`, but the title strings inside the JS object (e.g. line 359 `'On ℙ¹: …'`) use raw Unicode for prose strings — fine since they are not in `<option>` elements, only flagging that the convention is split between `$\mathbb{P}^1$` (in option) and `ℙ¹` (in plain titles).
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.readout`, `.row`, `.note`, `.ok`, `.bad`) is used consistently and matches the canonical template; no ad-hoc classes detected. Color tokens via `var(--…)` only — no raw hex literals in widget SVG markup.
- The `MVProofScrubber` widget (used in §1 and §6) is a registry slug; both invocations follow the documented `init('#id', {title, hint, viewBox, autoplayMs, steps})` shape; loader at line 180. Not present in the two reference pages, but a legitimate registry widget (not an ad-hoc reinvention).

## Severity
minor polish — semantic name-drift on "Bezout" needs fixing; the rest is cosmetic spelling alignment plus a handful of jargon callbacks worth adding.
