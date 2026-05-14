# extremal-combinatorics — pedagogical audit (2026-05)

**Section:** Combinatorics & graph theory
**Compared against:** probabilistic-method, enumerative-combinatorics

## Summary
The page is in strong shape — six numbered sections each carry a worked widget, theorems are stated cleanly with sharp asymptotics, and the helper block / chrome / KaTeX macro set match the section peers verbatim. The main drift is a within-page American/British spelling collision around §4 "Ramsey numbers" (`coloring` vs `colouring`) that both peers avoid by committing to British throughout.

## Findings
### Notation drift
- §4 ramsey: page uses both spellings within ~20 lines: "every $2$-edge-**coloring** of $K_{R(k,\ell)}$" (line 636) and "in any $2$-**coloring** of $K_6$" (line 652) versus "by **colouring** $K_n$ uniformly" (655), "any $r$-**colouring** of $\{1,\ldots,S(r)\}$" (658), "the $C_5$ **colouring**" (671). Both peers commit to British: probabilistic-method.html#ramsey reads "every $2$-edge-**colouring** of $K_n$" (line 396) and the hero sub of extremal itself uses British "**centre** of the field" (260). Recommend: settle on `colouring` per peer and the page's own register. Cosmetic but jarring within one section.
- The page mixes `\mathrm{ex}` (line 265, 268, 387, etc.) and bare-text operator names. This matches enumerative-combinatorics.html's `\mathrm{inv}` / `\mathrm{GL}_n` style and probabilistic-method's `\mathbb{E}` / `\mathbb{P}`, so internally consistent — no drift, but worth pinning.
- `2^{[n]}` (Boolean lattice notation, §5 line 795) is introduced without a one-line gloss; enumerative-combinatorics establishes set-of-subsets language earlier, but this page is the first one in section to use the power-set-as-cube shorthand. Cosmetic.
- §6: the page uses `$\mathbb{Z}/N\mathbb{Z}$` (line 941) — standard and matches the macro convention; no drift.

### Undefined jargon
- §6 line 941 introduces "**tripartite graph**" with no prior definition or callback. The Turán material (§1) only mentions "complete $r$-partite", and "tripartite" is then assumed. Quote: *"build a tripartite graph on three copies of $\mathbb{Z}/N\mathbb{Z}$"*. Recommend a half-line gloss.
- §6 line 938 first uses "**supersaturated**" in bold prose ("triangles come in **supersaturated** packs") before the term is defined. The supersaturation step is named in §3 line 534 ("supersaturation step — many edges $\Rightarrow$ many copies"), but the §6 sentence reads as if the reader has the formal notion already, and the §3 mention is itself a parenthetical rather than a definition.
- §6 line 944 uses "$\varepsilon$-regular" with the parenthetical *"their bipartite density is robust to taking large sub-pairs"*. That gloss is good but the technical condition (density on every $|A'|\ge\varepsilon|V_i|$ subpair within $\delta$ of $d(V_i,V_j)$) is hand-waved. Acceptable for a survey page; flag only because the same paragraph then leans on the term to state the regularity lemma.
- §5 line 802: "**LYM inequality**" gives the four-name attribution but never expands what the L/Y/M/B initials stand for in body — the §3.2 BLYM heading also assumes the reader will infer the "B". Cosmetic.

### Tone mismatches
- The page's voice is "encyclopedic-survey-with-proof-sketches" — closer to a Princeton-Companion entry than to the conversational register of probabilistic-method.html (which uses "you" deliberately: *"Suppose you want to prove ..."*, *"You don't have to find that point"*) or enumerative-combinatorics.html (*"How many things are there?"*, *"if you want to split $n$ distinguishable objects"*). The target uses second person only twice (line 663 widget hint, line 671 widget caption, plus the contrapositive "you must delete" on 938) and otherwise stays in dry textbook voice. This is the most actionable tone gap.
- §3 line 534: long compound sentence with three parenthetical asides — *"if $G$ has more than $(1-1/(\chi(H)-1))n^2/2 + \varepsilon n^2$ edges, then $G$ contains many copies of $K_{\chi(H),\chi(H),\ldots,\chi(H)}$ (the balanced complete multipartite with one part per colour class of $H$), into which $H$ embeds"*. Reads like a research paper proof step, not a Brilliant-style narration.
- §6 lines 944–946 stack three dense definitions back-to-back (regularity-lemma statement, "translation" paragraph, then "the whole package" note) with no widget interaction in between. The widget arrives one paragraph later but does not embody the tower-type bound; the note even concedes "the actual delta is tower-type tiny; we use delta = eps^3 / 6 for the visualisation" (line 977 comment). This is borderline a "formula-without-narration" wall.

### Missing worked examples
- All six numbered sections (§1 Turán, §2 KST, §3 Erdős–Stone, §4 Ramsey, §5 Sperner, §6 removal) carry a widget. §7 "Connections" is intentionally a bridges-out summary and does not need one. **No section is missing a poke-toy.**
- One soft gap: §5 has the LYM inequality and a Boolean-lattice clicker, but the BLYM strengthening / Bollobás set-pair theorem (line 810) gets a full paragraph with no concrete two-family example to chew on (e.g. small $A_1,B_1,A_2,B_2$ illustrating the disjointness/intersection conditions). The Sperner widget exercises LYM but not BLYM.
- §6 widget is acknowledged as "toy" because real δ(ε) is tower-type, so it does not actually exhibit the supersaturation phenomenon at the regularity scale — it just plots two analytic curves. The §6 widget is the weakest in pedagogical force on the page; it shows the *shape* of the inequality, not the regularity-driven explosion.

### KaTeX macros / formatting
- Macro block matches probabilistic-method.html and enumerative-combinatorics.html byte-for-byte (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`). No locally introduced macros. Good.
- Helper block (lines 187–239: `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is verbatim against category-theory.html — `diff` returns empty.
- Widget chrome on all six widgets uses `.widget / .hd / .ttl / .hint / .readout / .row / .small / .note` — matches house conventions, no ad-hoc classes.
- §1 line 282 widget hint uses `$T(n, r)$` inside a `.ttl`; renders fine because KaTeX auto-renders, but the §4 widget title at line 663 uses `$R(3, 3) = 6$` — same pattern. Both peers do this. No drift.
- Standard `$…$` / `$$…$$` delimiters throughout; no invented delimiters.
- Minor: `tfrac` shows up at line 268, 387, 419, 523 — same as enumerative-combinatorics line 268, fine.
- §5 widget (line 832) emits a callback `<aside>` between the `.widget` and the `.quiz` placeholder — this is generated by the callback injector and matches the pattern in §1 (line 295) and §4 (line 673), so structurally consistent.

## Severity
minor polish
