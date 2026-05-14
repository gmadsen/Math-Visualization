# algebraic-number-theory — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** galois, p-adic-numbers

## Summary
Pedagogically strong: hero promise is concrete ("repair UFD by promoting elements to ideals"), the four central widgets (ring of integers, ramification trichotomy, $\mathbb{Z}[\sqrt{-5}]$ lattice, Minkowski body, Pell unit) carry the reasoning, and the tone matches the canonical category-theory voice. Drift is cosmetic — a couple of micro-inconsistencies in `\mathrm{...}` vs the registered macros, and §1 / §3 are the only numbered sections without a poke-able widget.

## Findings
### Notation drift
- `\Gal(K/\mathbb{Q})` (using the registered macro) is used alongside `\mathrm{Frob}_\mathfrak{p}` (raw `\mathrm`) in the same outro paragraph at line 1335. p-adic-numbers.html line 1117 also reaches for raw `\mathrm{GL}_n`; galois.html consistently uses the `\Gal` macro and never needs the others. Cosmetic — both pages tolerate the mix, but a `\Cl`, `\Tr`, `\Frob` macro registration would tighten things if you ever want it. Low priority.
- `\mathrm{Tr}_{K/\mathbb{Q}}` (line 291) and `\mathrm{GL}_n(\mathbb{Z})` (line 292) sit next to a `\Gal` macro use elsewhere on the page — minor stylistic inconsistency, identical issue to the bullet above.
- `\mathrm{Cl}` is used uniformly across the page (lines 530, 720, 722, 726, 741) — internally consistent, just not promoted to a macro. Cosmetic.
- `\mathbb{Z}, \mathbb{Q}, \mathbb{R}, \mathbb{C}, \mathbb{F}_p` are uniform across all three pages. No drift on the bedrock alphabets.
- `\mathfrak{p}, \mathfrak{q}_i` consistent within the page and matches the convention p-adic-numbers reaches for via `\mathfrak{m}_L = (\pi)` at line 995. No drift.
- Widget readouts use Unicode `Δ_K`, `√d`, `ω`, `O_K`, `√-5` (e.g. lines 478, 700, 856) instead of LaTeX. This matches p-adic-numbers' readout style (lines 351, 521) and galois.html's inline readouts — consistent house pattern, not a drift. Documenting because someone might "fix" it.

### Undefined jargon
- "DVR" in §3 (line 516, "every localization $R_\mathfrak{p}$ at a nonzero prime is a DVR") — never expanded on this page. p-adic-numbers.html §4 uses "complete DVR" with surrounding context but also doesn't define the acronym. Borderline at graduate level, but a one-clause expansion ("(discrete valuation ring)") would close the gap.
- "Krull dimension $\le 1$" in the §3 Dedekind definition (line 500) and again line 522 — used without a callback. There IS a "Commutative algebra · Integral extensions and Noether normalization" backlink in §4 but no forward-direction callback in §3 itself. Minor.
- "Selmer group $\mathrm{Sel}(E/K)$" in §8 (line 1341) — undefined; outro context ("Beyond"), so acceptable, but it's the densest unexplained acronym on the page.
- "Néron–Tate pairing" in §8 (line 1341) — name-dropped without an inline gloss. Outro, so acceptable.
- "Arakelov simplex" in §6 (line 880, in scare quotes) — undefined and unlinked, used only once. Either gloss it ("the box $\{|x_i|\le t_i\}$") more clearly or drop the proper noun; the rest of the sentence already gives the construction.
- "Galois-theoretic reflex of $K$" in §1 (line 279) — decorative phrase, no harm but unnecessarily ornate before the embeddings have done any work.

### Tone mismatches
- Voice matches category-theory.html and the two references throughout. Highlights: "The failure of UFD in $\mathbb{Z}[\sqrt{-5}]$ is not fatal — it is exactly the sort of failure that *ideal theory* was invented to repair" (line 494); "The proof is a beautiful pigeonhole" (line 874); "tragedy (and its resolution)" (h3, line 728). All match the canonical conversational-but-precise register.
- §3 (Dedekind) leans textbook-dense: a definition box, a theorem statement, a four-row table, then a paragraph proving each axiom, then an `.ok` takeaway. The single line "The 'local' characterization is the one you use in practice" (line 520) is the only conversational beat. Not a mismatch, but the most clinical section relative to the page average. Could absorb one short worked computation (e.g. localize $\mathbb{Z}[\sqrt{-5}]$ at $(2,1+\sqrt{-5})$ and watch it become a DVR) to lift it to par.
- The §8 outro paragraph "Next stops: $L$-functions ..." (line 1344) packs five untriggered concepts into one sentence. Functional and kept short — borderline acceptable for an outro, but slightly drier than the rest.

### Missing worked examples
- §1 (intro): no widget. The h3 "discriminant in one paragraph" (line 289) supplies concrete formulas for $\Delta_{\mathbb{Q}(\sqrt{d})}$ and $\Delta_{\mathbb{Q}(\zeta_p)}$, so the section isn't pure abstraction, but compared with p-adic §1 (which has the $v_p$/$|\cdot|_p$ calculator widget), this is the only fully numbered concept here without an interactive toy. Low priority — the structural bridge to §2 is short and §2's ring-of-integers widget is the natural toy.
- §3 (Dedekind domains): definition + four-equivalence table + axiom-checking paragraph + `.ok` takeaway + h3 fractional ideals. No widget and no "compute this for $\mathbb{Z}[\sqrt{-5}]$" exercise within the section itself (the example arrives in §5). For grad audiences this is fine; for Brilliant-style pedagogy, a small "is this ring Dedekind?" toy (toggle between $\mathbb{Z}[\sqrt{-5}], \mathbb{Z}[\sqrt{2}], k[x,y], \mathbb{Z}[\frac{1+\sqrt{-3}}{2}]$ and tick the three axioms) would make this the sort of section a reader returns to.
- §8 (Connections): correctly outro-shaped, no widget expected. Not flagged.
- §2, §4, §5, §6, §7 each carry at least one full widget plus inline computation. Above bar.

### KaTeX macros / formatting
- Page registers exactly the canonical macro set `\Spec, \Gal, \Hom, \tr, \ad, \ind` from category-theory.html lines 22–29. No bespoke macros introduced; no `throwOnError:true` slip; no novel delimiters. Clean.
- Standard KaTeX `\bigl/\bigr`, `\tfrac`, `\!\left[…\right]`, `\colon`, `\hookrightarrow`, `\pmod`, `\bmod`, `\varprojlim`-adjacent constructs all used correctly. Consistent with both references.
- One stylistic note: `\colon` is used for embeddings (`\sigma\colon K\hookrightarrow\mathbb{C}` line 279) matching galois.html line 793 (`\sigma\colon L\to L`). Good.
- `\!\left[\tfrac{1+\sqrt{d}}{2}\right]` (line 319) in a `\begin{cases}` cell — renders fine; preserved across the round-trip.

## Severity
minor polish
