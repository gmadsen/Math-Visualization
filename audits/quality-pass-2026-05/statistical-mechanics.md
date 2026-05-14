# statistical-mechanics — pedagogical audit (2026-05)

**Section:** Mathematical physics
**Compared against:** hamiltonians-classical-mechanics, quantum-field-theory

## Summary
Strong, well-paced capstone with a worked widget in every numbered section and a tone that matches the peers. Two real defects: (a) duplicate hand-written + auto-injected `<aside class="callback">` blocks in §1, §3, §7; (b) recurring `\mathrm mc` / `\mathrm tot` / `\mathrm bath` / `\mathrm MF` (no braces) which KaTeX renders as upright single character + italic remainder. Plus two silently-broken cross-page anchors in §8.

## Findings
### Notation drift
- Recurring KaTeX brace-omission semantic bug. Target uses `\rho_{\mathrm mc}` (line 280, 293), `E_{\mathrm tot}` (lines 395-403), `N_{\mathrm bath}` (line 403), `T_c^{\mathrm MF}` (line 794). Without braces, KaTeX styles only the first letter upright (`m`, `t`, `b`, `M`) and renders the rest as math italic. QFT consistently uses `\mathrm{int}`, `\mathrm{cl}`, `\mathrm{SM}`, `\mathrm{em}`, `\mathrm{QED}`, `\mathrm{QCD}` with explicit braces (lines 521, 667, 802, 937, 941). High priority — semantic, not cosmetic.
- §8 list item links `./hamiltonians-classical-mechanics.html#liouville-flow` — the peer has no `#liouville-flow` anchor, only `#phase-space` and `#hamilton-eq` (the §1 hand-callback correctly targets `#hamilton-eq`). Silent 404 per AGENTS.md anchor contract.
- §7 hand-callback and §8 list item link `./large-deviations.html#cramer-theorem` — `large-deviations.html` only defines `#cramer`. Silent 404.
- "8. Connections" (line 1219) is numbered; both peers use unnumbered `<h2>Connections</h2>` (hamiltonians line 1050, qft line 1067). Cosmetic only.
- Inline LaTeX uses `\mathrm{Var}(E)` and `\mathrm{Cov}(A, B)` (lines 415, 1094); no peer-side macro to harmonize against, so this is consistent with house style. No action needed.

### Undefined jargon
- "tombstone formula" (line 282) appears as the named introduction of $S = k_B\log\Omega$ before the explanation that this is Boltzmann's $S$ formula. The widget caption (line 306) and a §3 callback (line 529) both refer back to it; the term itself is metaphorical (Boltzmann's gravestone in Vienna) and never spelled out. One quick parenthetical would fix the leak.
- "Schottky regime" appears in the §2 caption (line 436) — defined two paragraphs earlier (line 424 "Schottky anomaly") but the caption strings the term as if reader knows the regime, not just the anomaly peak; minor.
- "Birkhoff zones" — not in target, used in peer; no issue.
- "conformal field theories classified by Belavin-Polyakov-Zamolodchikov" (line 810) — drops a major name without explanation in a section that is otherwise well-paced. Either trim ("classified by Belavin-Polyakov-Zamolodchikov in 1984") or omit. Low priority.
- §8 opening paragraph (line 1221): "Donsker-Varadhan theory of Markov chains and KPZ universality"; "conformal bootstrap and integrable systems" — all dropped in a sentence with no callbacks. Acceptable for a closing-vista paragraph (peers do similar in their Connections), but the four name-drops in a row are denser than the QFT or hamiltonians equivalents.

### Tone mismatches
- Voice broadly matches the peers — second-person occasional ("we more often hold the temperature fixed by coupling…", line 393), prose mini-derivations between display equations, named-theorem callouts. No dry-textbook drift, no over-casual drift.
- §6 (RG) uses Wilson/Kadanoff "Nobel-winning reformulation" (line 917) — slightly more breathless than the peers, but not out of pocket for a capstone.
- §3 proof-sketch (line 525) ends with `$\square$`; peers do not use proof-end glyphs. Cosmetic.

### Missing worked examples
- _None._ All seven numbered concept sections (§1-§7) carry an interactive widget. §8 is Connections-only, matching peer convention (hamiltonians and qft also have no widget in their Connections section).

### KaTeX macros / formatting
- Macros block at the top of `<body>` is the verbatim corpus copy (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`); no locally-introduced macros. `\tr e^{-\beta H}` (lines 406, 654) and `\tr\,\rho(\log\rho - \log\sigma)` (line 531) use the corpus `\tr` correctly.
- Helper `<script>` block at top of `<body>` is verbatim from the corpus template (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`); no deviation.
- Widget chrome consistently uses `.widget / .hd / .ttl / .hint / .row / .readout / .small / .note`; no ad-hoc classes.
- `\mathbf{1}{E \le H \le E + \Delta E}` (line 280) — set-membership braces inside `\mathbf{1}{…}` work in KaTeX but are ambiguous; `\mathbf{1}\{…\}` would be the safer braces-rendered form. Low priority.

## Severity
minor polish
