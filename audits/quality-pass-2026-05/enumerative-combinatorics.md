# enumerative-combinatorics — pedagogical audit (2026-05)

**Section:** Combinatorics & graph theory
**Compared against:** extremal-combinatorics, matroid-theory

## Summary
Voice, notation, and widget chrome are well-aligned with the two section peers — the page reads as a confident first-pass on counting, with strong opening and closing widgets. The main pedagogical gap is § 4 (permutation statistics): two of its three sub-statistics (Eulerian descents and Stirling cycles) are stated identity-only with no worked numeric example or widget tie-in, leaving the section's interactive depth uneven against extremal-combinatorics' six-deep-widget pattern.

## Findings

### Notation drift
- _None._ `\binom{n}{k}`, `\mathrm{inv}/\mathrm{PG}(2,q)/\mathrm{GL}_n`, `\mathbb{F}_p`, `\mathbb{Z}/N\mathbb{Z}`, and `\langle\,,\,\rangle` for Eulerian numbers all match the section conventions (extremal uses `\mathrm{ex}`, `\mathrm{PG}(2,q)`; matroid uses `\mathrm{cl}`, `\mathbb{F}_2`, `\mathbb{Z}_{\ge 0}`). Local `\mathrm{inv}(\sigma)` is consistent with the peer practice of inlining short operator names via `\mathrm{}` rather than declaring a page-level `\operatorname` macro.

### Undefined jargon
- "Wilf's 'snake oil', saturation" in § 7 (`#outro`) — "snake oil" is dropped with quotes-as-acknowledgment, but "saturation" is undefined; a reader without prior generating-function exposure will not know what either method is. Compare to extremal-combinatorics `#outro`, where every named technique is either linked or self-evidently labelled.
- "OGFs/EGFs" in § 7 paragraph "Singularity analysis…" — § 3 introduced "ordinary" and "exponential" generating functions but never the acronyms; first occurrence of the abbreviations is in the connections paragraph.
- "Pólya enumeration of colourings under group actions" in § 4 (cycles subsection) — name-dropped at the closing line of "Cycles and Stirling numbers" without any prior reference, callback, or one-sentence sketch.
- Minor: "weak compositions" appears inside the displayed equation `#\{\text{weak compositions of }n\text{ into }r\text{ parts}\}` in § 1 before the prose explicitly names that term; the surrounding sentence defines the count operationally, so this is a low-priority gloss only.

### Tone mismatches
- "Worked example: Catalan bijection." in § 6 (`#bijections`) reads as a stranded label — a bare paragraph that announces a worked example and is immediately followed by a generic motivational sentence, not the example itself. The actual worked content is in the next two h3s. Compare to matroid-theory `#examples` "$M(K_4)$ as a vector matroid." which uses a `<div class="note">` callout to frame the same kind of named worked example.
- "Hardy–Ramanujan's asymptotic formula… is one of the gems of analytic combinatorics" (§ 5) is slightly more effusive than the peer voice; extremal/matroid tend to mark significance via `<div class="note">` rather than an inline superlative. Cosmetic.

### Missing worked examples
- § 4 (`#permutation-stats`) **Descents and Eulerian numbers** — a single sentence defines `\langle{n\atop k}\rangle` and states Worpitzky's identity, with no numerical example (e.g. the Eulerian triangle for $n=3$ or $n=4$) and no widget interaction with descents. The page widget reports descents only as a number alongside inversions/cycles.
- § 4 (`#permutation-stats`) **Cycles and Stirling numbers** — rising-factorial identity stated, but no concrete computation (e.g. expanding $x(x+1)(x+2)$ to read off $c(3,1), c(3,2), c(3,3) = 2,3,1$). The widget shows cycles as a count but does not surface $c(n,k)$ values.
- § 6 (`#bijections`) **RSK and Young tableaux** — the bijection is described and the identity $n! = \sum (f^\lambda)^2$ stated, but the only widget on this section is the Catalan path↔triangulation pairing. RSK is the second h3 of the section and has no example or interactive — significant against extremal-combinatorics' pattern (every theorem ships with a widget) and matroid-theory's (every section has at least one widget illustrating the named object).
- Compare counts: extremal has 6 sections / 6 interactive widgets; matroid has 8 sections / 7 interactive widgets; enumerative has 7 sections / 6 widgets, but two of the named sub-objects (Eulerian, Stirling, RSK) lack any concrete poke-able instance.

### KaTeX macros / formatting
- `\langle {n\atop k}\rangle` for Eulerian numbers (§ 4) uses the legacy TeX `\atop` primitive. KaTeX supports it but discourages it in favour of `{n\brack k}` or `\genfrac{\langle}{\rangle}{0pt}{}{n}{k}`. Neither extremal nor matroid uses `\atop`. Low priority — renders cleanly — but worth noting against the house "no invented delimiters" guidance.
- All three pages share the identical header KaTeX loader and macro block (`\Spec, \Gal, \Hom, \tr, \ad, \ind`); the target does not introduce any new local macros, in line with the AGENTS.md convention.
- Helper `<script>` block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is byte-for-byte identical to the extremal/matroid copies and to the canonical `category-theory.html` block. Widget chrome (`.widget / .hd / .ttl / .hint / .readout / .row / .small / .note / .ok`) is used uniformly; no ad-hoc classes; color tokens (`var(--yellow)`, `var(--cyan)`, `var(--pink)`, `var(--violet)`, `var(--mute)`, `var(--ink)`) only — no hex literals inside widget bodies.

## Severity
minor polish
