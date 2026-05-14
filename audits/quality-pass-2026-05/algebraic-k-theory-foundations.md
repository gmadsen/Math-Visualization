# algebraic-k-theory-foundations — pedagogical audit (2026-05)

**Section:** Algebra & homological
**Compared against:** homological, derived-categories

## Summary
Strong, well-structured page: every numbered section has a working interactive widget, the §1–§5 spine moves cleanly $K_0 \to K_1 \to K_2 \to Q$-construction $\to$ localization, and notation matches peers on the basics ($\mathbb{Z}$, $\Hom$). Main rough edges are jargon density in §2/§7 (Wh group, s-cobordism, TC/THH, chromatic, Lurie) and a steady drift of monospace/ASCII inside SVG `text` and `readout` blocks (e.g. `pi_1`, `~=`, `(+)`, `>=`, `Z*`, `tilde`) where peers prefer KaTeX or unicode glyphs.

## Findings

### Notation drift
- `\mathrm{Hom}` is never invoked in target prose, but `\Hom` macro IS defined in the head (line 25) and is heavily used in `derived-categories.html` and `homological.html`. Target's only Hom-style construction uses `\operatorname{Hom}` indirectly via the macro definition in the head — but no `Hom` actually appears in the prose, so this is consistent by absence. (No drift here.)
- Inside SVG text and readouts the page consistently writes `~=` for $\cong$, `(+)` for $\oplus$, `Z*` for $\mathbb{Z}^\times$, `pi_1` for $\pi_1$, `K~_0` / `tilde K_0` for $\widetilde{K}_0`, `>=` for $\ge`, `<=` for $\le`, `sqrt(-5)` for $\sqrt{-5}`, `zeta_p` for $\zeta_p`. Examples: lines 295 (`K0(Z) ~= Z`), 304 (`(+)`), 437 (`diag(det A, 1, 1, ...)`), 741 (`pi_1(BQP(R)) = K_0(R) = Z`), 1001 (`K~_0(Z[C_p])`). `derived-categories.html` and `homological.html` also avoid KaTeX inside `<text>` SVG nodes (KaTeX cannot render there) — so the constraint is real — but they reach for unicode glyphs (`≅`, `⊕`, `→`, `ℤ`, `π`, `≥`) in display strings instead of ASCII transliteration (e.g. `derived-categories.html` line 397 uses `ℤ`, `—2→`, `ℤ/2`). Cosmetic drift, but it's pervasive and visually jarring against the peers.
- §2 line 368 writes `GL(R)^{\mathrm{ab}}` and line 370 writes `G^{\mathrm{ab}}`. `homological.html` and `derived-categories.html` use no `\mathrm{ab}` notation, but it's standard. Low priority.
- §3 Steinberg group is written `\mathrm{St}(R)` (line 476, 484, 486). Standard, no peer conflict.
- §6 line 946 introduces `\widetilde{K}_0` for reduced K-theory. The same object appears as `K~_0` in the SVG/readout (lines 1001–1011). Two different glyphs for the same group within one section. **Semantic drift, medium priority** — the reader has to learn that `K~_0` = `\widetilde{K}_0`.
- `K_n(\mathcal{O}_F)` (line 838) — `\mathcal{O}_F` is introduced without a sentence saying "ring of integers of a number field $F$". The Borel block then uses $r_1, r_2$ unannotated. Mild notation drift from the page's otherwise-explicit habit.

### Undefined jargon
- §2 line 370: "houses the **s-cobordism obstruction in surgery theory**" — both "s-cobordism" and "surgery theory" appear cold, with no callback or one-sentence gloss. First and only mention on the page.
- §2 line 366: `\varinjlim` (filtered colimit / direct limit) is used without naming the symbol. Peers usually say "the colimit, written $\varinjlim$, is …". Minor.
- §4 line 681: "**exact category** $\mathcal{E}$ — an additive category with a notion of admissible monomorphisms ($\hookrightarrow$) and admissible epimorphisms ($\twoheadrightarrow$) such that 'short exact sequences' are well-defined" — this is a one-line gloss for a heavy concept. The Quillen Q-construction is then defined in terms of it without further unpacking. Acceptable for an "intermediate" page but on the thin side compared with how `derived-categories.html` builds up to triangulated structure (§4 there is a full section).
- §4 line 698: "Waldhausen later extended the framework to **categories with cofibrations and weak equivalences (the $S_\bullet$-construction)**" — three new technical terms in one parenthetical, no callback, no further use on the page until §7.
- §6 line 950 (Beilinson-Lichtenbaum subsection): "**Voevodsky's resolution (2011) of the Bloch-Kato conjecture**", "**motivic cohomology**", "$\ell$-localization", "Voevodsky's motivic coefficient sheaf", "**Milnor K-theory**", "étale cohomology $H^n_{\text{ét}}(F,\mu_\ell^{\otimes n})$", "**chromatic-prime level**" — eight technical terms in one paragraph, none defined or callback'd. This is the densest sentence on the page.
- §7 line 1062 (Connections): "**trace methods program (Hesselholt-Madsen's TC/THH approximating $K(R)$ via cyclotomic spectra)**", "**chromatic perspective via $K(n)$-local stable homotopy**", "**Lurie's $\infty$-categorical reformulation**". Conventional for a Connections paragraph (peers also coast a bit there), but this one is unusually heavy.
- §5 line 822: "$\mathcal{H}_S(R)$ … of finite **Tor-dimension**" — Tor-dimension is not defined on the page; readers without a prior pass through `homological.html` will stall. A `<aside class="callback">` to `homological.html#derived-functors-ext-tor` would help.

### Tone mismatches
- Prose voice is excellent and matches `derived-categories.html` closely (clean paragraphs, occasional second person, motivating asides like "what is $K_3$? Or $K_n$ for general $n$?"). No drift in the body text.
- Inside widget readouts the voice abruptly slips into ALL-CAPS shouting and meme-ish parentheticals: `'mod E(R) (kill electrons)'` at line 435 — "kill electrons" is a joke that doesn't land and is the sole instance of comedic register on the page; `'== 1'` / `'is not (yet) constrained'` (line 633); `'NOT a unit -- not in K1'` (line 441); `'NOT projective'`, `'NOT free'` in the §1 readout (lines 295, 301). `derived-categories.html` readouts (e.g. lines 489–494) stay neutral and KaTeX-rendered. Minor but distinctive.
- §1 line 243 closing line ("K-theory is the universal home for 'objects you can add but not always cancel.'") and the same phrase echoed at §7 line 1062 ("objects you can add but only stably classify") — nice motif, but the slogan-with-quotes pattern doesn't appear in `homological.html` or `derived-categories.html`. Cosmetic; this is a target-specific voice flourish.
- §6 uses three `<h3>` subsections (Bass-Quillen, Wall, motivic) with one paragraph each followed by a single shared widget for all three. Pacing is denser than `derived-categories.html` §7 (where one big idea = one section). Reads more like a textbook synopsis than a guided tour.

### Missing worked examples
- §6 the three `<h3>` subsections each get a paragraph of theory then collapse into a single button-flip widget (`ak-apps`). Each app deserves a worked computation in prose; the widget is doing all the lifting and currently truncates strings (`val.length > 24 ? slice(0,23)+'...' : val`, line 1042) which silently elides answers like `Z (Bass-Quillen ==> sa...`. Peers (`derived-categories.html` §3, §5) put a `<p>Worked example: …</p>` directly in the prose.
- §3 has the symbol `\{-1,-1\}` cited as the generator of $K_2(\mathbb{Z})=\mathbb{Z}/2$ but never walks through *why* — the widget computes tame symbols but doesn't verify $\{-1,-1\}$ is order 2. A two-line prose computation would close that gap.
- §4 line 690 defines $K_n(\mathcal{E}) := \pi_{n+1}(BQ\mathcal{E},*)$ but never computes anything — not even $K_0(\mathcal{P}(k))=\mathbb{Z}$ from the Q-construction. The widget gestures at "loops at $R^n$" but doesn't walk a single concrete loop.
- §7 (Connections) is six bullets with no widget. Peers do the same — this is house style — so flag as informational, not an error.

### KaTeX macros / formatting
- Head macros block (lines 22–29) is the canonical six-macro set inherited from `category-theory.html` — `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`. Verbatim copy, good.
- No bespoke macros introduced. Page favors `\mathrm{...}` for ad-hoc operators (`\mathrm{Proj}`, `\mathrm{Cl}`, `\mathrm{diag}`, `\mathrm{ab}`, `\mathrm{Wh}`, `\mathrm{St}`, `\mathrm{Br}`). House convention per the macro list and `derived-categories.html` (line 459: `\mathrm{Mod}\,R`, `\mathrm{Ext}_R^i`) prefers `\mathrm{...}` for one-off operators and `\operatorname{...}` (via macros) for the recurring ones. Consistent — no drift.
- Line 838 Borel formula uses raw `\begin{cases} ... \end{cases}` with `\pmod 4` — renders fine, standard KaTeX.
- §3 line 490 mixes multiplicative and additive notation for Matsumoto symbols: "modulo bilinearity ($\{aa',b\}=\{a,b\}\{a',b\}$) and the Steinberg relation $\{a,1-a\}=1$" with multiplicative `=1`, but later line 481 uses additive `(r+s)` for the Steinberg generator additivity. Mathematically correct (the symbols form a multiplicative group, the entries form an additive ring) but the reader has to keep straight which side is which — a one-sentence reminder would help.
- Helper-block (lines 155–204): byte-identical with `derived-categories.html` and `category-theory.html`. Widget chrome (`.widget / .hd / .ttl / .hint / .readout / .row`) used consistently across all five widgets — no ad-hoc classes. Good hygiene.

## Severity
minor polish — strong page overall; tighten widget-text ASCII transliteration toward unicode/peer style, gloss the two cold technical terms in §2 ("s-cobordism", "surgery theory"), and either thin or callback'd the §6 motivic-cohomology paragraph and §7 Connections jargon.
