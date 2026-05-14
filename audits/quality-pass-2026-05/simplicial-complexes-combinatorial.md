# simplicial-complexes-combinatorial — pedagogical audit (2026-05)

**Section:** Combinatorics & graph theory
**Compared against:** enumerative-combinatorics, extremal-combinatorics

## Summary
The page is structurally well-aligned with its peers and the canonical `category-theory.html` template: identical helper block, six numbered sections each with a worked widget plus an outro, and prose that holds the conversational-but-precise voice. A handful of cosmetic notation drifts (operator naming, link/anchor mismatches in the outro) and one real bug — a stale "Used in" backlink that points at a non-existent anchor — are the only items worth touching.

## Findings
### Notation drift
- `\operatorname{lk}_K(\sigma)` (#shell) for the link is fine, but `lk` is not lifted into the page-global macro list the way `\Hom`, `\Spec`, `\Gal` are; if links recur in many topology pages, consider adding `\lk` to the shared loader. Cosmetic, low priority.
- `\mathrm{VR}_r(X)` and `\mathrm{diam}` (#persistence, line 949) are spelled with `\mathrm`, while extremal-combinatorics uses `\mathrm{ex}`, `\mathrm{PG}` consistently and the head-loader exposes operators via `\operatorname` macros. Consistent with peers, but a `\VR` / `\operatorname{VR}` macro would match the loader convention. Cosmetic.
- Field of coefficients is written as lowercase `k` in #stanley-reisner (`k[K]`, `k[x_1,...,x_n]`) and in #persistence (`H_k(-;k)` line 952), where `k` does double duty as both the homology-degree index and the field. Inside the same paragraph (line 952–956) `k` is the degree, then `k[t]` is a polynomial ring in `t` over the field — never identified by name. Semantic, medium: pick a separate symbol for the field (e.g. `\mathbb{F}` or `\Bbbk`) or explicitly disambiguate.
- Boundary formula at line 506 writes `\partial\sigma = \sum (-1)^i \sigma \setminus \{v_i\}` with no parens around `\sigma \setminus \{v_i\}`; reads as `(-1)^i \sigma` minus a set. Cosmetic but parses awkwardly compared with the cleaner `\sum_v` style used in enumerative-combinatorics §6.

### Undefined jargon
- "**pure** $(d-1)$-complex" appears at #shell line 666 ("Call a pure $(d-1)$-complex $K$ shellable…") with no prior definition; "pure" then recurs in §2 line 418 ("…the number of facets when $K$ is pure"). The §2 hint there is forward-only; a parenthetical "(pure = all facets have the same dimension)" at first use would close the loop.
- "**Cohen–Macaulay**" is used in the §4 heading and in the bulleted result "shellable ⇒ Cohen–Macaulay (over any field)" at line 675 *before* the Reisner-criterion paragraph at line 678 explains what it means. The flow inverts the usual definition-then-use cadence; consider lifting the one-line definition before the bullet list.
- "**Gorenstein** and **Buchsbaum**" appear in the Stanley–Reisner bridge note (line 808: "Cohen–Macaulay, Gorenstein, and Buchsbaum properties of $k[K]$…") with no explanation or a "see also" link. Acceptable as namedrops, but flag.
- "**reduced homology** $\widetilde{H}_i$" appears in Reisner's criterion (line 681–682) without a tilde-vs-untilded explanation; readers from #realize would have seen ordinary $H_n$ but not the reduced variant.
- "**extendably shellable**" (#shell hint, line 692) — italicised as if a defined term, but never defined.
- "**Krull dim**" surfaces in the Stanley–Reisner widget readout ("Krull dim k[K] = 1 + dim K") with no callback to commutative-algebra. Minor — a live readout, not body prose.

### Tone mismatches
- Hero paragraph (line 260) packs eight named objects (f-vector, h-vector, Dehn–Sommerville, shellings, Cohen–Macaulayness, Stanley–Reisner, nerves, persistent homology) into a single sentence. Compare extremal-combinatorics §hero, which names five theorems but with breathing room. Borderline; legible but dense.
- §6 first paragraph ("The trick: don't pick a single complex, pick a family.") and §3 hero ("So combinatorics on the cover recovers topology of the space, and that is what makes simplicial complexes a viable computational substitute for topological spaces.") nail the canonical conversational voice — these are the high points.
- §5's prose is a little textbook-flat compared with §3 / §6 — three definition paragraphs back-to-back before the table. The table rescues it, but a one-sentence "why you'd care" lead-in (à la the §6 opener) would lift it.

### Missing worked examples
- All six numbered sections carry a working widget (face explorer, f→h converter, disk-cover nerve, shelling order, Stanley–Reisner ring, Vietoris–Rips persistence) — coverage matches enumerative-combinatorics and extremal-combinatorics. _No section is bare._

### KaTeX macros / formatting
- No locally-introduced macros beyond what the head-loader provides; the page uses inline `\operatorname{lk}` / `\mathrm{VR}` / `\mathrm{diam}` directly — consistent with peers.
- Delimiters: `$…$` and `$$…$$` only; no invented forms.
- Helper block at top of `<body>` (lines 187–239) is verbatim against `category-theory.html` and `enumerative-combinatorics.html` — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`. _Clean._
- Widget chrome is uniform: every widget uses `.widget / .hd / .ttl / .hint`, plus standard `.row / .readout / .small / .note`. No ad-hoc classes.
- Stale backlink (semantic): the §2 "Used in" aside at line 443 links to `simplicial-complexes-combinatorial.html#shell` with anchor text "Shellable and Cohen–Macaulay complexes". The §4 actual `<h2>` (line 665) reads "Shellings and Cohen–Macaulay complexes" — text drift only, since `#shell` exists. Cosmetic.
- Real bug — broken outro link: `<a href="./matroid-theory.html">` at line 1143 in §7. The file `matroid-theory.html` does not exist in this repo (the matroid topic is `matroids.html` per the index — actually neither exists; verify against `concepts/index.json`). This is a 404 in the user-facing "Connections" section. High priority cleanup. _(extremal-combinatorics.html line 1068 has the same dangling link — both pages should be fixed in concert.)_
- Outro link `./spectral-graph-theory.html` (line 1147) — this file _does_ exist. OK.
- `<table class="plain">` row "two edges $\{12, 23\}$" (line 817) contains the literal string "⟂ already cont." in the `$I_K$` column — looks like an editing artefact ("perpendicular" symbol + truncated word) that escaped review. Cosmetic but visible to readers.

## Severity
minor polish
