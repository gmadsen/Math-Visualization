# group-cohomology — pedagogical audit (2026-05)

**Section:** Algebra & homological
**Compared against:** galois-cohomology-and-brauer, homological

## Summary
Solid page overall — strong "one machine, six payoffs" arc that mirrors the galois-cohomology peer's structure, every numbered section has at least one widget, helper block and chrome are byte-clean. Two real issues: (1) the `\bar k` / `\bar K` base-field convention silently flips between sections and disagrees with the Galois-cohomology peer (semantic-adjacent drift, easy to mistake for two distinct fields), and (2) §1's prose drops `\mathrm{Ext}` instead of `\Hom`-style `\operatorname{Ext}` even though the page already loads `\Hom` as a macro.

## Findings

### Notation drift
- **Base field of absolute Galois group.** §4 ends with `$G=\Gal(\bar k/k)$ and $A=\bar k^\times$` (line 459) and §7 opens with `$\bar k/k$` and `$G_k=\Gal(\bar k/k)$` (lines 567–569), but §8 immediately reverts to `$H^2(\Gal(\bar K/K), \bar K^\times)$` (line 621). The Galois-cohomology peer is uniformly capital `K` (`$G=\Gal(L/K)$`, `$G_K=\Gal(\bar K/K)$`, line 262). Recommend: pick one (capital `K` matches the peer and the §7 anchor title text), apply through §4–§8.
- **`\mathrm{Ext}` vs the loaded `\Hom` macro.** Line 270 writes `$\mathrm{Ext}^n_{\mathbb{Z}[G]}(\mathbb{Z},M)$` but line 278 immediately uses `$\Hom_{\mathbb{Z}[G]}(-,M)$` via the macro. homological.html line 2126 uses `\operatorname{Ext}^i_A(M,N)` (and `\operatorname{Tor}` likewise). Recommend: bare `\mathrm` for an operator-name spacing-sensitive symbol breaks consistency — either add `\Ext`/`\Tor` to the macro list or write `\operatorname{Ext}` explicitly.
- **`\mathrm{im}` vs the loaded operator style.** §5 table writes `$\mathrm{im}\,N$` and `$\mathrm{im}(\sigma-1)$` (lines 490–491). homological uses `\operatorname{im}` consistently (e.g. line 395). Cosmetic but the one peer that does linear-algebra notation in this section uses the other form.
- **`Br` is `\mathrm`, while peer mixes both.** Line 459 `$\mathrm{Br}(k)$` matches peer galois-cohomology line 246/417. Consistent — flagging only because it interacts with the `\bar k`/`\bar K` drift above (the §4 callsite is the one with `\bar k`).
- **étale typesetting.** Line 412: `$H^1_{\mathrm{\acute et}}(\Spec\,K,\mathbb{G}_m)$` and line 571: `$H^1_{\mathrm{\acute et}}(\Spec\,k,\mathbb{G}_m)$`. The galois-cohomology peer doesn't use this notation, so no peer disagreement, but `\mathrm{\acute et}` rendering is fragile (the accent over `e` inside `\mathrm` looks ragged in KaTeX). Recommend `{\text{ét}}` or define a `\et` macro in the auto-render macros block.

### Undefined jargon
- "central simple algebras" appears at §4 line 459 ("classifies central simple algebras over $k$") with no definition or callback to one. The galois-cohomology peer defines "CSA" carefully at line 419 before invoking it. group-cohomology never defines the term and §7 reuses it ("classifies central simple $k$-algebras"). Recommend: parenthetical one-line definition or a "see galois-cohomology #brauer" callback at first use.
- "Morita equivalence" appears at §7 line 583 ("up to Morita equivalence") with no gloss. Neither peer defines it on this page, but both peers also don't *use* it — galois-cohomology talks about Brauer-equivalence directly via the `M_m(A) ≅ M_n(B)` rule (line 419). Recommend: replace with the explicit Brauer-equivalence definition or add a one-clause gloss.
- "gerbes" appears at §4 line 459 ("classifies *gerbes*, projective representations, and obstruction classes") as a one-word reference with no definition or hyperlink. Acceptable as a gesture toward downstream theory but consider italicizing-and-deferring more explicitly ("higher analogue called *gerbes*; see [link]") since neither peer defines it.
- "Schur multipliers are $H_2(G,\mathbb{Z})$" at §8 line 625 — galois-cohomology line 382 properly introduces the Schur multiplier as `$M(G):=H^2(G,\mathbb{C}^\times)$`. The two definitions are dual but not literally equal; the casual aside in group-cohomology uses the *homology* version without comment. Recommend: either match the peer's $H^2(G,\mathbb{C}^\times)$ formulation or add "(equivalently $H_2(G,\mathbb{Z})$ by universal coefficients)".
- "cohomological dimension $\mathrm{cd}(k)$" is defined inline at §7 line 603 — good, no issue, just noting it's handled correctly in contrast to the items above.

### Tone mismatches
- **§5 "Tate periodicity" intro is dry.** Lines 481–495 march from "remarkably small free resolution" → table → "periodic with period 2" with no narrative arc. Compare galois-cohomology §1 line 264 ("Three theorems organise the entire subject. ... Six sections, six widgets.") or category-theory's conversational scaffolding. Recommend: one-sentence motivation before the resolution display ("Cyclic groups admit a two-term repeating resolution because $\mathbb{Z}[C_n]$ has a built-in shift, and this is why class field theory is computable …").
- **§4 ending "Reincarnated yet again" is over-casual.** Line 459 packs "Brauer group → gerbes → projective reps → obstruction classes" into a single throwaway sentence. The peer galois-cohomology takes a full section (§3) to develop the Brauer / Schur cover machine. Either trim the gesture (the §8 "Connections" block already covers this) or expand into proper paragraphs.
- **Hero sub uses bracketed jargon density.** Line 260 "Derived $G$-fixed points: a single machine that controls extensions, twisted forms, Hilbert 90, and Brauer groups." The peer galois-cohomology hero (line 259) reads "Cocycles on a Galois group know about twisted forms, central simple algebras, and the obstructions to local-to-global lifting — one cohomological machine, six concrete payoffs." Both are good but the target's "Derived $G$-fixed points" lands cold for a reader who hasn't met derived functors yet (§1 only defines them on line 263). Acceptable but consider softer entry.

### Missing worked examples
- **§8 "Connections"** — h2 with no widget, only narrative bullets. This is the standard outro pattern shared by category-theory's last section, so OK by precedent; not flagging.
- **§3 (Hilbert 90) is fine.** Has `w-h90` widget. Good.
- **§5 "Tate periodicity"** has the `w-tate` widget but the table reading exercise (lines 487–493) goes by quickly with no toy "compute one entry by hand" prompt. The widget does the table, but a hand-worked $H^1(C_2, \mathbb{Z}/4)$ example in prose would help bridge bar-formula understanding (§3) to periodic-resolution understanding. Low priority.
- **§6 (LHS spectral sequence)** — `w-lhs` widget shows the $E_2$ page but never walks through a $d_2$ differential or a single five-term inflation–restriction computation in prose. The reader sees the formula in display, then a widget showing entries, but no hand-computed $H^1$ via the five-term sequence. Both peers (galois-cohomology §3 ext widget, homological §11 spectral pages) do walk through a small concrete computation step-by-step. Recommend adding one sentence like "Example: take $G=C_4$, $H=C_2$, $M=\mathbb{F}_2$ trivial — the five-term sequence …".

### KaTeX macros / formatting
- **Standard delimiters only** — `$…$` and `$$…$$` throughout, no `\(…\)` or invented bracket pairs. Clean.
- **Macros block matches peers verbatim** (lines 22–29 identical to galois-cohomology and homological). Good.
- **`\mathrm{Ext}`, `\mathrm{im}`, `\mathrm{res}`, `\mathrm{inf}`, `\mathrm{cts}`-adjacent** — see notation drift section. The page uses `\mathrm{...}` for operator names not in the macros block, and the result is inconsistent kerning compared to `\Hom`/`\Gal` calls one line over. Recommend: extend the macros block to include `\Ext`, `\Tor`, `\Br`, `\res`, `\inf`, `\inv`, `\cd` since they recur, then strip the bare `\mathrm{}` calls.
- **`{}_NM/(\sigma-1)M`** at lines 491, 497 — the prefix subscript trick `{}_NM` is correct KaTeX but unusual; the reader who sees it once on the §5 table and again in the Tate-cohomology note has nowhere to anchor what the leading subscript means. Recommend: either gloss as `M[N]` (kernel-of-`N`) or define inline at first use ("`${}_NM := \ker N$`").
- **Helper-block hygiene OK** — lines 187–238 are byte-equivalent to category-theory's helper (only diff: missing `// shorten endpoints` comment). All widgets use `.widget / .hd / .ttl / .hint / .readout / .row / .small / .pill / .note / .ok / .bad`; no ad-hoc classes spotted.
- **SVG titles present** on every widget SVG (lines 454, 506, 542 of comparable widgets all have `<title>...</title>`). Good a11y.
- **Color tokens** — widget script uses `var(--green)`, `var(--blue)`, `var(--violet)`, `var(--yellow)`, `var(--mute)`, `var(--ink)`, `var(--cyan)`, `var(--pink)`, `var(--panel2)` (lines 920–949 spot-check). No raw hex. Clean.

## Severity
minor polish
