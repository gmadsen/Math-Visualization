# moduli-spaces — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** algebraic-curves-higher-genus, stacks

## Summary
Page is well-structured, conversational, and every numbered section has a poke-able widget. The main semantic drift is internal: $M_g$ vs $\mathcal{M}_g$ (script-vs-italic) gets mixed inside §6, and the automorphism-group notation diverges from the sibling stacks page (`\mathbb{Z}/n` here vs `\mu_n` there for the same Aut groups at $j=0,1728$).

## Findings
### Notation drift
- **Semantic (high priority):** `\operatorname{Aut}(E) \cong \mathbb{Z}/6` at moduli-spaces#jline vs `\mathrm{Aut}(E)=\mu_6` at stacks#m11 — for the *same* extra automorphism group at $j=0$. Same divergence at $j=1728$ (`\mathbb{Z}/4` vs `\mu_4`) and the generic `\mathbb{Z}/2` vs `\mu_2`. The forward-link aside ("stacks ... lets us replace ...") sits one paragraph below where the page used `\mathbb{Z}/6`, so a reader clicking through immediately sees the same group spelled differently. Recommend settling on `\mu_n` per stacks.html, since the CM-by-roots-of-unity intuition motivates that choice.
- **Semantic (medium):** §6 mixes `M_g` / `M_{g,n}` (italic) and `\mathcal{M}_{1,1}` / `\overline{\mathcal{M}}_{g,n}` (script) inside the same paragraph: "Let $M_g$ be the (coarse) moduli space ... and $M_{g,n}$ the moduli of such curves" then later "smooth proper Deligne–Mumford stack $\overline{\mathcal{M}}_{g,n}$ with coarse space $\overline{M}_{g,n}$." Both reference pages use `\mathcal{M}_g` for the stack/moduli object throughout (`\mathcal{M}_g`, `\mathcal{M}_{1,1}`, `\overline{\mathcal{M}}_g`). The page title's `$M_{g,n}$` and the §6 heading also disagree with the other six pages of cross-references that point at `\mathcal{M}_g`. Recommend `\mathcal{M}_g` everywhere and reserve `M_g` only for the explicit "coarse space of" usage, matching algebraic-curves-higher-genus.
- **Cosmetic:** `\operatorname{Aut}` (moduli-spaces) vs `\mathrm{Aut}` (stacks). KaTeX renders both identically; sibling consistency would help a reader scanning the two pages side by side.
- **Cosmetic:** §6 dimension table uses italic `M_g` in `\dim M_g`; algebraic-curves-higher-genus#moduli-of-curves-genus-g table uses `\dim \mathcal{M}_g`.

### Undefined jargon
- "orbifold" appears once at moduli-spaces#whyfail ("makes $\mathcal{M}_{1,1}$ an *orbifold* / *Deligne–Mumford stack*") with no definition and no callback. The Deligne–Mumford half is forgiveable (the §7 forward-link `ok` aside resolves it), but "orbifold" is left dangling. Minor — drop the word or add a one-clause gloss.
- "arithmetic genus" used in §6 stable-curve definition ("at-worst-nodal curve of arithmetic genus $g$") without prior definition on the page; algebraic-curves-higher-genus#smooth-projective-curve defines it but moduli-spaces does not callback there. Low priority; a parenthetical ("= $1 - \chi(\mathcal{O}_C)$") or callback would close it.
- "linear equivalence", "Picard group", "Galois group" all show up with no in-page definition; all are upstream concepts and a reader at this level should have them, but the sibling pages have callbacks for the same terms.

### Tone mismatches
- _None._ The voice ("Automorphisms are the villain and the hero", "click through small-$(g,n)$ examples", the "Point-of-view shift" note) is on register with category-theory.html and the two siblings.

### Missing worked examples
- §7 "Mental model summary" has no widget. This is typical for a synthesis section across the corpus and the table + forward-link aside arguably substitute; flagging only because the AGENTS guidance says every numbered `<h2>` should have a widget. Treat as cosmetic / by-design.
- §5 "Rigidifying with level structure" has W5 (2-torsion visualizer) which fixes a $j=1728$ curve and only demonstrates *why $N=2$ fails*. There is no toy where the reader picks an $N \ge 3$ basis and watches the level structure rigidify. Currently the worked content for the central claim ("for $N \ge 3$, no non-trivial automorphism fixes a level-$N$ structure") is delivered in the prose `note`, not the widget. Medium priority — the section's headline statement is asserted but not poked.

### KaTeX macros / formatting
- No locally-defined macros; page uses only the head-block macros (`\Spec`, `\Hom`) plus standard KaTeX. Clean.
- `\xrightarrow{\;\sim\;}` is used twice (§1 and §5) — matches algebraic-curves-higher-genus convention.
- W2's DATA object embeds Unicode-only math in readout strings (e.g. `'(x,y) ↦ (ω x, -y), ω = e^{2πi/3}'`). Same convention is used in stacks W1 and elsewhere — sibling-consistent.
- W3's caption uses Unicode `ℳ(S) ≅ Hom(S,M)` in a `<text>` element rather than KaTeX. Sibling convention (stacks#fib does the same with `ℳ`, `Sch`); fine.
- Helper `<script>` block at top of `<body>` (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is verbatim with category-theory.html. Good.
- Widget chrome (`.widget` / `.hd` / `.ttl` / `.hint` / `.readout` / `.row` / `.note` / `.ok`) is used consistently; no ad-hoc classes.

## Severity
minor polish
