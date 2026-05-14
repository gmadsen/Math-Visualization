# topological-data-analysis — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** algebraic-topology, cohomology-and-duality

## Summary
The page is in strong shape: voice, helper block, widget chrome, and notation conventions all line up with the section peers and with `category-theory.html`. Findings are minor — one stray `\mathbb{S}` typo, two cases of jargon that get used a few sections before they are formally introduced, and a couple of opportunities to strengthen prose around the most algebra-heavy spots.

## Findings
### Notation drift
- `\mathbb{S}^1` at §7 line 988 ("1-cocycles with $\mathbb{S}^1$ coefficients") is the only `\mathbb{S}` in the entire repo. Every other reference on this page (and on the peers) writes `S^1`. Fix: `S^1`. Severity: cosmetic.
- The page consistently writes `\mathrm{im}\partial_{n+1}` / `\ker \partial_n` (§2 line 430, 432); cohomology-and-duality writes the same expressions as `\operatorname{im}` / `\ker` (line 270). Both peers actually mix `\mathrm{`/`\operatorname{` freely (algebraic-topology line 787 uses `\operatorname{im}` while line 432 of TDA uses `\mathrm{im}`), so this isn't a hard drift, but settling on `\operatorname{}` (the convention KaTeX hints at via the macro list) would be cleaner. Severity: cosmetic.
- TDA writes `H_k(-; k)` (§3 line 518) using the same letter `k` for both the homological degree index and the coefficient field. The peers consistently use `n` for degree and reserve `k` for the field (e.g. cohomology-and-duality line 444 uses `k` only as the field, and `n` as degree). Recommend renaming the degree index to `n` here for parity. Severity: low (locally readable but trips a reader two paragraphs later).

### Undefined jargon
- "By the **nerve theorem**, the homotopy type of $X_\epsilon$ is captured by an abstract simplicial complex" (§1 line 269) — "nerve" itself is not defined until §6 line 837 ("the **nerve** of the cover by clusters"), and the nerve theorem is never stated. A one-clause parenthetical defining nerve at first use, or pushing the §1 sentence to "by a classical result (see §6 for the nerve construction)" would close the loop.
- "Compare two filtrations by **tame functions** $f, g : K \to \mathbb{R}$" (§4 line 702) — "tame" is undefined and not callbacked. Most readers will guess "finitely many critical values / pointwise-finite-dim modules", but a one-liner ("tame = finitely many homological critical values, equivalently the persistence module is pointwise finite-dimensional") would make the stability hypothesis legible.
- "**ε-interleaving** of persistence modules" first appears inside the stability widget caption (§4 line 722) and is then named in step 2 of the proof scrubber, but never defined as a standalone term in body prose. It is the central object of the section after the bottleneck distance, and the reader is expected to take it on faith. A two-sentence definition above the widget — "An ε-interleaving is a pair of cross-maps F_t → G_{t+ε}, G_t → F_{t+ε} that compose to the natural maps F_t → F_{t+2ε} and G_t → G_{t+2ε}" — would land the move.
- §7 mentions "**Gabriel-quiver classification of $A_n$-type representations**" (line 992) with no callback. This is the algebraic content of the structure theorem and worth either a one-liner or a `<aside class="callback">` to representation-theory or quiver-style content.
- §7 lists "rank invariant, fibered barcode, persistence landscape, $\Lambda$-Hilbert function, GRIL" (line 996). These are name-drops without definitions — fine for a "broader toolkit" section, but the peer pattern (cohomology-and-duality §6 "Characteristic classes preview") shows three name-drops with one-line definitions each. Recommend adding a short clause to each (or trimming GRIL/$\Lambda$-Hilbert which a typical reader will not have heard of).

### Tone mismatches
- The hero ("Hand a computer a finite point cloud and ask *what shape is this?*") nails the conversational-but-precise register of `category-theory.html` and the peers. Same for the §3 close ("Long bars = robust features … short bars near the diagonal = topological noise") and the §4 "Noisy data ⇒ noisy diagrams, but only as noisy as the data."
- §5 ("Structure theorem") slides into denser textbook voice: three consecutive paragraphs with no example, no widget, and no second-person address (line 800–813). The peers always cushion algebraic punchlines with a "concretely:" or "for example:" sentence. Recommend a one-liner like "Concretely: a barcode with bars [0,1), [0.3,0.8), [0.5,∞) describes a unique persistence module up to iso." Severity: medium.
- §7 "Software ecosystem" is a flat bulleted list with no narrative thread (line 1004–1010) — readable but feels copied from a README rather than the rest of the page's prose. Adding a one-line "Pick Ripser for speed, GUDHI for breadth, scikit-tda when you live in a sklearn pipeline" would restore the page's voice. Severity: low.

### Missing worked examples
- §5 "Structure theorem" is the only numbered section without an interactive widget or a worked numerical example. The structure theorem is exactly the kind of result the peer pages illustrate with a small computation (cohomology-and-duality §1 worked $H^*(T^2)$, algebraic-topology §3 winding-number scrubber). Recommend a tiny widget or worked snippet showing a 3-vertex filtration whose interval decomposition is `I[0,1) ⊕ I[0.5,∞)` so the multiset definition is concrete. Severity: medium — this is the section most likely to feel abstract on first read.
- §7 has the Ripser sandbox at the end but the four sub-headings (Persistent cohomology, Zigzag, Multi-parameter, Reeb graphs & merge trees) are pure exposition with no toy. The sandbox plausibly covers it, but Reeb graphs in particular deserve their own micro-diagram (or a forward link to a future Reeb-graph topic). Severity: low (§7 is by design a "broader toolkit" survey).

### KaTeX macros / formatting
- No new `\macros{}` are introduced — the loader is a verbatim copy of category-theory.html's. Good.
- The page leans on `\mathrm{VR}_\epsilon`, `\mathrm{Dgm}`, `\check C_\epsilon` — all standard KaTeX, all consistent with peers' use of `\mathrm{dR}`, `\mathrm{Tor}`, etc.
- Helper block (lines 187–239) is byte-identical with category-theory.html / cohomology-and-duality.html. Spot-checked `$`, `$$`, `SVG`, `drawArrow`, `drawNode`.
- Widget chrome is clean: every interactive uses `.widget / .hd / .ttl / .hint / .row / .readout / .small`, plus standard `.note / .ok` boxes. No ad-hoc classes detected. The Ripser sandbox in §7 uses an inline `style=` on its `<textarea>` rather than a class — minor, but the only other place a code-edit sandbox appears (`inline-code-cell` widget in the registry) would be the registry-backed home for it if §7 ever gets re-extracted.

## Severity
minor polish
