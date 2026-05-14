# designs — pedagogical audit (2026-05)

**Section:** Combinatorics & graph theory
**Compared against:** extremal-combinatorics, coding-theory

## Summary
designs.html is a tightly written, widget-rich page that matches the section's voice and chrome conventions almost exactly. The only material concern is one factually wrong example in §1 (the page claims divisibility rules out a $(7,3,2)$-design, but the divisibility conditions are actually satisfied for those parameters); everything else is minor polish.

## Findings

### Notation drift
- `[n]` is defined in §4 ("Latin squares") as `$[n] = \{0, 1, \ldots, n-1\}$`, then re-used in §5 ("Designs from codes") as if it meant `$\{1, \ldots, n\}$` (the codeword index set runs `1..7`/`1..23`/`1..24`). extremal-combinatorics §5 uses `$[n] = \{1, \ldots, n\}$` consistently. Recommend picking one convention for the page (probably the standard `1..n`) and adjusting the §4 sentence.
- §1 writes the incidence-matrix entry as `$N_{p, B}$` (comma-separated subscript) while §2 writes the same matrix as `$N_{p, B} = \begin{cases} 1 & \text{if } p \in B \ldots$`. Same notation, fine — no drift, but the §2 incidence-matrix sentence reintroduces $N$ without back-referencing §1, so a first-time reader may not realise it's the same object.
- The macro block declares `\Spec, \Gal, \Hom, \tr, \ad, \ind` (verbatim copy of the canonical set used by extremal-combinatorics and coding-theory) but designs.html never uses any of them. Cosmetic only — same dead-weight as the references.

### Undefined jargon
- §3 introduces "Steiner system $S(2, q+1, q^2+q+1)$" without ever defining the general $S(t, k, v)$ notation. The notation then reappears in §5 (`$S(2, 3, 7)$`, `$S(4, 7, 23)$`, `$S(5, 8, 24)$`) and §6 (`$S(2, 3, n)$`). One sentence near the §3 first occurrence ("a Steiner system $S(t, k, v)$ is a $t$-$(v, k, 1)$ design") would close the gap.
- §5 first sentence: "Take a binary linear code $C \subseteq \mathbb{F}_2^n$." No definition of "linear code" or "weight" before the Hamming-Fano example; the section relies on the reader knowing them. The `Connections` outro links out to coding-theory but no in-text "(see coding-theory)" pointer appears at the §5 opener.
- §5 Assmus–Mattson `.note` mentions "dual distance $d^\perp$" with no definition. Buried in a theorem statement, so the impact is limited, but a parenthetical would help.
- §6 "Combinatorial software testing" introduces an `$\mathrm{OA}(N, k, n, 2)$` notation; the prose explains the gist operationally but does not unpack what each of the four parameters means. The reference pages (extremal-combinatorics §6 on regularity; coding-theory §5 on BCH) are typically more explicit when they introduce a four-parameter object.

### Tone mismatches
- The voice is consistent with the two references — definition-first, then a labelled theorem, then a short proof or proof-idea, then a widget. No textbook-dryness or meme tone.
- §1 second-paragraph sentence "These are **necessary** conditions but quite far from sufficient. They rule out, e.g., a $(7, 3, 2)$-design …" is **factually wrong**: $(v,k,\lambda) = (7,3,2)$ has $r = \lambda(v-1)/(k-1) = 12/2 = 6$ and $b = vr/k = 14$, both integers, so divisibility does *not* rule it out (the design actually exists; it is the biplane of order 2). This is the highest-priority issue on the page — semantic, not cosmetic. Replace with a genuine non-divisibility example such as $(8, 3, 1)$ ($r = 7/2$, fails) or $(6, 3, 1)$ ($r = 5/2$, fails).
- §6 "Round-robin tournaments and Steiner triples" claims a Steiner triple system "solves the Kirkman schoolgirl problem". An STS is necessary but not sufficient: Kirkman requires a *resolvable* STS (a partition of blocks into parallel classes). Worth a one-word fix to "a *resolvable* Steiner triple system $S(2, 3, n)$ solves the Kirkman schoolgirl problem".
- Coding-theory and extremal-combinatorics occasionally address the reader in second person ("you will fail", "drag the sliders"); designs.html stays in third person throughout the prose and only uses second person inside widget hint strings ("step through", "click two points"). Mild voice-flatness but consistent across the page.

### Missing worked examples
- _None._ Every numbered `<h2>` (§1–§6) ships at least one interactive widget plus a worked computation in prose. §7 ("Connections") is the standard outro pattern shared with both references and intentionally has no widget.

### KaTeX macros / formatting
- KaTeX delimiters used: `$…$`, `$$…$$`. No invented delimiters. Consistent with house conventions.
- No locally re-defined macros beyond the shared block. `\mathrm{PG}`, `\mathrm{AG}`, `\mathrm{MOLS}`, `\mathrm{rank}` are written out via `\mathrm{}` rather than as new macros — this matches extremal-combinatorics' use of `\mathrm{ex}` and coding-theory's `\mathrm{ev}`/`\mathrm{Ham}`/`\mathrm{RM}`.
- Helper `<script>` block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is verbatim-identical to category-theory.html / extremal-combinatorics.html. Spot-checked.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.small`, `.note`) is used cleanly throughout; no ad-hoc classes introduced. The §1 BIBD widget uses an inline `style="width:70px"` on its `<input type="number">` — same pattern appears in extremal-combinatorics' KST and Erdős–Stone widgets. Consistent.
- Two readout strings emit Unicode `λ`, `≥`, `✗`, `✓`, `²`, `−`, `→` directly rather than going through KaTeX (since `.readout` is plain text inside a `font-family:ui-monospace` block, not a KaTeX surface). Same trick as extremal-combinatorics' KST readout. Fine.
- Minor cosmetic broken anchor: the `<section id="connections">` outro link `./galois.html#defn` points to an anchor that does not exist on `galois.html`; `./mathematics-and-cryptography.html` is linked without an anchor at all. Both cosmetic; the page itself opens, just doesn't deep-jump.

## Severity
minor polish (one factual fix in §1 and one wording fix in §6 are the only must-haves; everything else is cosmetic).
