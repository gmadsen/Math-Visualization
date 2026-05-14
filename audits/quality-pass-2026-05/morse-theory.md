# morse-theory — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** algebraic-topology, differential-forms

## Summary
Strong page overall — voice, widget cadence (one per numbered section through §8), and helper-block usage all match section peers. Findings are minor: a real-projective-space notation inconsistency inside §6, a `\mathrm{Crit}` symbol used without a one-line gloss, and a few cosmetic deviations (helper block uses double-quoted SVG namespace where category-theory and differential-forms use single quotes).

## Findings

### Notation drift
- **Real projective space inconsistency within §6.** Prose at line 477–478 uses `\mathbb{R}P^2` ("$S^2$ vs $\mathbb{R}P^2$", "$\chi(\mathbb{R}P^2)=1$") while the immediately following widget at lines 481, 484, 488 uses `\mathbb{RP}^2` ("Widget · $S^2$ vs $\mathbb{RP}^2$", "$\mathbb{RP}^2$ as a CW complex"). The peer `algebraic-topology.html#pi1` uses `\mathbb{RP}^n` (line 334) consistently. Recommend: settle on `\mathbb{RP}^n` everywhere on this page to match the section neighbour. (Semantic-cosmetic — reader sees two glyphs for the same space within four paragraphs.)
- **`\mathrm{Crit}` used as if a known operator.** First appears inside the displayed equation at line 438 (`p \in \mathrm{Crit}(f)`) without a "where $\mathrm{Crit}(f)$ denotes the set of critical points" gloss. Reused at lines 506, 509. Cosmetic but a one-clause definition on first appearance is the house pattern (cf. how `differential-forms.html#integration` glosses each new symbol like $\Delta^k$ inline).
- **`\mathrm{rank}` and `\mathrm{int}` mid-formula.** Line 396 has `\mathrm{rank}\,H_k(M;\mathbb{Q})`; line 318 has `M^b\setminus \mathrm{int}(M^a)`. Both are fine in isolation, but the page macro list already promotes `\operatorname{...}` style for `\Hom`, `\Spec`, `\tr`, `\ind`. Low-priority cosmetic alignment: prefer `\operatorname{rank}` / `\operatorname{int}` (or just `\dim_{\mathbb{Q}}`).
- **`\mathrm{Sym}^2_+ T^*M` at line 513** is dense and undefined. Peer pages would either spell it out ("the cone of positive-definite symmetric $(0,2)$-tensors") or omit. Low priority; only one occurrence.

### Undefined jargon
- **`\mathrm{Crit}(f)`** — introduced inside a displayed equation rather than in surrounding prose; see notation-drift item above.
- **"core disk"** at line 363 (§3): "$D^k\times\{0\}$" is glossed inline, so the term itself is defined the moment it's used. Fine — flagging only because the bold marker `<strong>core disk</strong>` advertises it as a defined term.
- **§6 "exotic 7-spheres"** (line 475) and **"$S^3$-bundles over $S^4$"** appear with no definition or callback. Acceptable inside an "Applications and generalisations" survey (peer §9 outros do the same), but a single parenthetical "(non-standard smooth structures on $S^7$)" would soften the leap. Low priority.
- **§6 "Bott periodicity"** (line 492) and **"action functional"**, **"pseudo-holomorphic cylinders"**, **"Arnold conjecture"** (line 494) appear undefined. Same caveat: this is the survey section, and the references in §9 cover the lineage. Low priority.
- **§9 "Łojasiewicz inequalities"** (line 614), **"$A_\infty$/$L_\infty$-Morse theory"**, **"Khovanov-homology bridge"** (line 628) — survey-section name-dropping, consistent with how `differential-forms.html#outro` lists frontiers. No action.

### Tone mismatches
- _None._ Voice is conversational-precise throughout: "that is the whole idea" (hero), "Two reasons" (§1), "Why $\partial^2 = 0$ in one line" (§7), "Now <em>vary</em> $f$" (§8). Matches `algebraic-topology.html` ("a gelatinous continuous thing", "loops have room to slide off") and `differential-forms.html` ("Forms are the things you integrate") in register.

### Missing worked examples
- _None._ Every numbered §1–§8 carries an interactive widget (`#w-morse`, `#w-handles`, `#w-cw`, `#w-ineq`, `#w-flow`, `#w-app`, `#w-msmale`, `#w-cerf`). §9 ("Connections") is a coda with no widget, matching the pattern of `differential-forms.html#outro` and `algebraic-topology.html` final sections.

### KaTeX macros / formatting
- **No new locally-defined macros.** Page uses only the inherited macro list (`\Spec, \Gal, \Hom, \tr, \ad, \ind`), of which `\ind` is the only one exercised. Same set as references — no drift.
- **No delimiter abuse.** Only `$…$` and `$$…$$` in prose; widget code uses standard math.
- **Helper-block string-quoting deviation.** The page-global helper at lines 187–236 uses double-quoted SVG namespace (`"http://www.w3.org/2000/svg"`) and double-quoted attribute keys throughout, whereas `category-theory.html` (line 191) and `differential-forms.html` (line 189) — and AGENTS.md "copy verbatim" rule — use single quotes. Functionally identical, but the AGENTS.md instruction is verbatim. Low priority cosmetic; only worth fixing if a future fan-out audit flags helper-block divergence.

## Severity
minor polish

