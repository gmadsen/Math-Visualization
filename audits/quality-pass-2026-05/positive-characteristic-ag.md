# positive-characteristic-ag — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** crystalline-cohomology, etale-cohomology

## Summary
Strong, well-paced page that reads as a confident peer of the two references — same KaTeX macro set, same widget chrome, same conversational-but-precise voice. The notable issues are a handful of undefined jargon terms (slope, Newton polygon, Hodge polygon) that the references *do* define and that pos-char uses without a callback, plus a duplicated `<head>` script-loader block that no other Algebraic-geometry page exhibits.

## Findings
### Notation drift
- `\mathcal{H}^i(F_*\Omega^\bullet_{X/k})` (target §3) vs `\mathbb{H}^i(X,\Omega^\bullet_{X/W})` (crystalline §3). Both are used here for a hypercohomology-flavored object but spelled differently — pos-char uses script `\mathcal{H}` for the cohomology *sheaves* of a complex (correct usage) while crystalline uses upright `\mathbb{H}` for global hypercohomology. Different objects, same letter family — could trip a reader who jumps between pages. Cosmetic; leave alone unless a unifying glossary is added.
- Witt-vector level subscript: pos-char writes `W_n(\mathbb{F}_p)` (target §6) whereas crystalline §3 writes `W_2(k)=W/p^2`. Both consistent with each other, but pos-char never spells out the equivalence `W_n = W/p^n` even though it later refers to "$W_2(k)$-lifts" (target §3 last paragraph and §7 'lift' pathology entry). Low priority.
- pos-char §5 hero-line uses `\mathbb{Z}/p` for the Galois group; etale-cohomology consistently uses `\mathbb{Z}/\ell^n` and `\mathbb{Z}/p^n`. Both omit `\mathbb{Z}` after the slash — consistent. No drift.
- Frobenius operator naming on cohomology: pos-char calls it `F` (in `FV=p=VF`, §6) and `\varphi` (in "Newton polygon decomposition of $\varphi$", §6 last sentence) within a single paragraph. Crystalline §4 uses `\varphi` exclusively for the cohomological Frobenius and reserves `F` for the geometric/scheme-level map. Worth aligning to crystalline's `\varphi` for the cohomological side — this is *semantic* drift, not cosmetic, since the same letter `F` later refers to the Frobenius pushforward in the same section.

### Undefined jargon
- **"slope"** appears five times in §6 ("raising slopes by $p$", "$FV=p=VF$ on slopes", "slope filtration", "slope decomposition") with no in-page definition or callback. Crystalline §5 defines slope via Dieudonné–Manin (`\lambda=s/r\in\mathbb{Q}` with `\varphi^r=p^s\cdot\mathrm{id}`); pos-char §6 should at minimum link to `crystalline-cohomology.html#f-isocrystals`.
- **"Newton polygon"** appears in §6 ("recovers the Newton polygon of Frobenius", "Newton polygon decomposition") undefined; crystalline §5 builds it explicitly. Same fix: callback to crystalline §5 or a one-sentence inline definition.
- **"projection formula"** invoked in §2 step-1 readout (`F_*(F^*L^{-1}\otimes\mathcal{O}_X)=L^{-1}\otimes F_*\mathcal{O}_X`) without naming where it comes from. Reasonable for an advanced page, but the readers most likely to land on §2 are the same ones who haven't yet internalised it. Consider a parenthetical or a callback to a sheaf-cohomology section.
- **"Hodge-to-de-Rham degeneration"** mentioned in §3 closing paragraph as a target Deligne–Illusie achieves; never defined here (it would belong in `algebraic-de-rham-cohomology.html` or `hodge-theory.html`). One-line gloss or a callback would help.
- **"Borel–Weil–Bott"** dropped into §2 note without context. Acceptable for a name-drop, but could use a parenthetical "(cohomology of line bundles on $G/B$)".
- **"K3 surface"** appears in §7 hodge-pathology readout text; assumed background. Standard practice, but worth noting it's the only place a K3 enters the page with no setup.

### Tone mismatches
- Tone overall matches the references well — conversational openings ("the same theorem, but in characteristic $p$ is rarely the same theorem", "the answer is no; for p=13 yes", "rarely the same theorem"). No dry-textbook wall.
- §6 last paragraph is the densest stretch on the page: three named theorems (Bloch–Illusie–Deligne, Newton polygon decomposition, slope decomposition) compressed into two sentences, with no narration breath. Consider splitting into two paragraphs or interleaving a "the upshot is" sentence; crystalline §5 manages comparable density by handing each theorem its own `<div class="ok">` block first.
- §7 "Bloch–Kato conjecture's positive-char roots" `note` block at the very end is somewhat oracular ("Failure modes are productive: they force new invariants") — fine as a closer, but it name-drops Bloch–Kato, Fontaine–Mazur, and Voevodsky's Milnor proof in one sentence with no follow-through. Crystalline §6 is a useful counter-template: it name-drops similar machinery but always pairs each name with a concrete role.

### Missing worked examples
- **§7 Pathologies** is a single readout-only widget — pick a theorem from a `<select>`, read a static paragraph. No interactive computation, no SVG. Crystalline's analogous "this is what's lost" section (the `bad` callout in §1) is shorter but supported by the active `w-zoo` widget that earns its place. Consider adding even a small "click a counterexample dot on a Hodge / Newton polygon plot" interaction, or borrow the polygon visualization style from crystalline §5.
- **§8 Connections** has no widget; this matches house style for terminal Connections sections (crystalline §7 same), so not a flag.
- All seven other content sections have at least one interactive widget — coverage is otherwise strong.

### KaTeX macros / formatting
- KaTeX macro block is byte-identical to the references' (six entries: `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`). No new macros introduced, no re-invented delimiters.
- All non-standard symbols used (`\wp`, `\xrightarrow`, `\bullet`, `\varprojlim`, `\hookrightarrow`, `\twoheadrightarrow`, `\overline{\mathcal{C}_f}`) are stock KaTeX. No issues.
- §5 widget readout uses bare `y\to y-x^{m/p}` inside a backtick template literal that *isn't* wrapped in `$…$` — KaTeX won't render it inside the `<span class="readout">`. Minor: the surrounding readout text is plain ASCII anyway, and reads fine, but it's the one place a `$…$` was intended (see line 653 `reducedNote = '... (substitute $y\\to y-x^{m/p}$); ...'` — the `readout` element is plain-text-rendered via `textContent`, so the `$…$` is shown literally). The §3 widget readout has the same pattern (`$…$` literals in `out.textContent`). Crystalline and etale handle this the same way, so it's a corpus-wide pattern, not a pos-char-specific bug.
- Helper-block hygiene: the page-global 2D helpers (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) are byte-identical to crystalline-cohomology and the canonical category-theory.html. No drift.
- **Widget chrome is uniform** — every widget uses `.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad`. No ad-hoc classes.
- **Hygiene defect: duplicated `<head>` script loaders.** Lines 165–172 of the target manually load `breadcrumb.js`, `glossary-popover.js`, `theme-toggle.js`, `concepts/bundle.js`, `topic-hotkeys.js`, `topic-lineage.js`, plus the two stylesheets — and lines 173–183 then load all of them *again* inside the `breadcrumb-head-auto-begin/end` injector fence. Similarly `display-prefs.js` loads on line 190 and again on line 192 inside the `display-prefs-head-auto-begin/end` fence. `grep -c` confirms `breadcrumb.js`/`display-prefs.js` appear 4× total in the target vs 2× in each reference. Duplicate `<script>` tags don't break anything functionally (the browser dedupes the actual fetch via cache) but they do execute the IIFEs twice, which can register listeners twice. The likely cause: hand-authored loaders that were left in place when the auto-injectors ran. Recommend stripping lines 165–172 and 190 from `content/positive-characteristic-ag.json`.

## Severity
minor polish
