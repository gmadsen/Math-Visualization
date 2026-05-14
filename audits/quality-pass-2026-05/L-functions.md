# L-functions — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** dirichlet-series-euler-products, bsd

## Summary
The page is in good shape — it reads as a deliberate capstone synthesis of its two siblings, with the four-costumes framing as an effective spine. A few small terminology lapses and one undefined-jargon-on-first-use issue would benefit from a polish pass.

## Findings
### Notation drift
- `\mathrm{Re}\,s` is used everywhere on this page (sections 1, 2, 3, 8, etc.); `dirichlet-series-euler-products` mixes `\mathrm{Re}\,s` and `\operatorname{Re}(s)` is rare — both pages already converge on `\mathrm{Re}\,s`. `bsd.html` § 3 instead writes `\operatorname{Re}(s) > 3/2`. Low-priority cosmetic drift; pick `\mathrm{Re}\,s` to match the two number-theory siblings.
- `\Lambda(E,s) = w\,\Lambda(E, 2-s)` (L-functions § 5) vs. `\Lambda(E, s) = \pm \Lambda(E, 2-s)` (bsd § 3). Two different conventions for the sign symbol coexist; both pages also call it `w` and "root number." Low priority — the L-functions page itself is consistent (always `w`), but a one-line note that bsd's `±` is the same `w` would help readers crossing between pages.
- `S_k(\Gamma_0(N))` in L-functions § 4 / § 7 matches the convention in `modular-forms.html` (good). The companion `dirichlet-series-euler-products` doesn't use this notation, so no drift to flag.
- L-functions hero says coefficients "come from local data (a prime at a time)"; `dirichlet-series-euler-products` § 3 calls Euler factors "local at $p$." Cosmetic only — both phrasings work.
- L-functions § 3 uses `\#E(\mathbb{F}_p)`; `bsd.html` § 2 uses `\#E(\mathbb{F}_p)` as well via `countNp`. Consistent.

### Undefined jargon
- **"Newform"** — § 7 (`#modularity`) opens with "there exists a weight-$2$ newform $f \in S_2(\Gamma_0(N))$." The earlier § 4 introduces eigenforms but never defines "newform" or links it to the eigenform-on-the-new-subspace distinction. First offending sentence: *"there exists a weight-2 newform $f \in S_2(\Gamma_0(N))$ such that $L(E,s) = L(f,s)$."* A one-line gloss or a link to `modular-forms.html#newforms` would close the gap.
- **"Trace of Frobenius"** — § 3 (`#elliptic`) writes "$a_p = p + 1 - \#E(\mathbb{F}_p)$, the prime-to-$p$ part of the *trace of Frobenius*." First-use of the phrase, with no definition or callback. Reader has to take "trace of Frobenius" on faith. The page doesn't link out to `galois-representations.html#frob` (which `bsd.html` § 2 does in its callback). Recommend adding a parenthetical link.
- **"Root number"** — § 5 introduces the term inside its definition: "$w$ is the **root number** (or sign of the functional equation)." Acceptable as it stands; the inline gloss serves as the definition. Not flagged.
- **"Sha"** / **`\Sha`** — § 9 mentions "the order of Sha" with no glyph and no definition (`bsd.html` defines `\Sha` as `\text{Ш}` and devotes § 5 to it). Reader who lands on L-functions § 9 first will be lost. Either add the glyph + a one-line definition or a callback link to `bsd.html#sha-tate-shafarevich`.
- **"CM by $\mathbb{Z}[i]$"** — § 3 widget caption: *"This curve has CM by $\mathbb{Z}[i]$: $a_p = 0$ whenever $p \equiv 3 \pmod 4$."* "CM" never expanded. `bsd.html` § 3 zoo widget also uses "CM by Z[ω]" without expansion, so this is a corpus-wide habit, not a local lapse — mention but low priority.
- **"Conductor"** — § 3 introduces "conductor $N$ (same prime support as $\Delta$; see singular-cubics-reduction)" — good, this one is handled correctly with a callback.

### Tone mismatches
- The page voice is consistent with `dirichlet-series-euler-products` — both lean confident, second-person-occasional ("Every $L$-function we meet on this page wears four costumes at once"), and they share the "watch the partial sieve converge" / "watch both approach $L(E,s)$" widget-caption rhythm. No major drift.
- § 9 (`#special-values`) closes with the slogan *"special values of $L$-functions are where analysis sees arithmetic directly"* — exactly the conversational-but-precise register the style template wants. Good.
- One mild dry patch: § 8 (`#continuation`) is wall-to-wall prose with no widget. The two prose paragraphs are well-written but the section breaks the "every numbered $h2$ has a toy to poke" expectation set by `category-theory.html`. See "missing worked examples" below.
- The hero-paragraph framing ("$\zeta(s)$ is the template, $L(E,s)$ and $L(f,s)$ are the arithmetic payload, and modularity makes them agree") matches the bsd hero's "born on EDSAC printouts" energy. Good.

### Missing worked examples
- **§ 8 `#continuation` has no widget.** This is the only numbered section on the page without an interactive toy. The prose covers the Mellin split-at-$y=1$ / modular-relation argument well, but a small companion to the § 6 Mellin diagram — e.g. a slider on $y$ that shows $f(iy)$ on $[0,1]$ being mapped by $y\mapsto 1/y$ onto $[1,\infty)$, or a bar showing the $\Gamma$-pole locations being eaten — would re-up the "every section has a toy" contract.
- **§ 9 `#special-values` is also widget-free.** Numerical illustrations of $\zeta(2k) = \pi^{2k}\cdot B_{2k}/\text{stuff}$ for $k = 1, 2, 3, 4$ would land cheaply (just a table or a tiny "pick $k$" stepper). The Bernoulli-numbers / class-number-formula / BSD trio is exactly the kind of pattern a Brilliant-style toy makes memorable.
- Compare `dirichlet-series-euler-products`, where § 7 (Perron) and § 8 (Dirichlet AP) both have widgets, and `bsd.html`, where every numbered section has at least one. L-functions has 7/9 (sections 1-7 are well-toyed); the last two need the same treatment.

### KaTeX macros / formatting
- Macro block in L-functions § head matches the corpus shared block: `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`. Identical to the macro block in `dirichlet-series-euler-products`. Consistent.
- `bsd.html` head has a benign drift to flag: it declares `macros: { '\\Sha': '\\text{Ш}' }` and then redeclares `macros: { '\\Spec': ..., '\\Gal': ..., ... }` two lines later — the second `macros` key clobbers the first, so `\Sha` is silently undefined in `bsd.html`. **This is a `bsd.html` bug, not an L-functions bug**, but it's relevant because L-functions § 9 mentions Sha and would inherit the same problem if it ever tried to use the macro. Recommend (separate task) merging the two `macros:` blocks in `bsd.html`'s head.
- L-functions does not introduce any locally-defined macros beyond the shared block — good.
- Helper `<script>` block at top of `<body>` matches `category-theory.html` verbatim (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`). Consistent across all three pages audited.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.readout`, `.row`, `.note`, `.ok`, `.bad`, `.small`) is used correctly throughout; no ad-hoc class names spotted.
- Delimiters: only `$…$`, `$$…$$`, `\(…\)`, `\[…\]` in use. No re-invention.
- One spot to mention: § 5 has `\boxed{\;\Lambda(s) \;=\; \Lambda(1-s).\;}` in `dirichlet-series-euler-products`; L-functions § 5 doesn't use `\boxed` for its functional-equation statement (it just italicizes "Theorem (consequence of modularity)"). Both readable; consistency is a polish-pass concern, not a correctness one.
- SVG titles are present on every widget (good for a11y).

## Severity
minor polish
