# string-theory — pedagogical audit (2026-05)

**Section:** Mathematical physics
**Compared against:** gauge-theory, quantum-field-theory

## Summary
The page is a strong, well-paced capstone with one widget per major numbered section and an unusually frank "honest framing" note up top. The drift vs the section peers is mostly cosmetic (group-name notation, an unused `\tr` macro, `\mathrm{Hom}` instead of the page-defined `\Hom`); the one substantive pedagogical gap is a small cluster of physics-jargon terms (BRST, reparametrization ghosts, super-conformal ghosts) that appear in §2–§4 without a one-liner of definition.

## Findings
### Notation drift
- Group names `\mathrm{SU}(3)`, `\mathrm{SO}(6)`, `\mathrm{Spin}(32)/\mathbb{Z}_2`, `\mathrm{PSL}(2,\mathbb{R})` (string-theory §2, §4, §5) vs. bare italic `$SU(2)$`, `$SO(n)$`, `$SU(3)$` everywhere in gauge-theory.html (§4 BPST instanton, §5 Chern–Simons knots, §6 lattice, §7 Donaldson). Quantum-field-theory.html mixes both (`\mathrm{SU}(3)`, but also bare `SU(2)` in legend strings). Settle on roman `\mathrm{SU}(N)` site-wide (matches AGENTS.md house preference for upright Lie-group names) — string-theory is already there; gauge-theory is the outlier, but for *this* trio the drift is real.
- `\mathrm{Hom}(T^3_b, U(1))` at line 879 (SYZ paragraph) vs. the page-local macro `\Hom` declared in the head (line 25) and used elsewhere on the site. Cosmetic, low priority — one-line fix is `\Hom(T^3_b, U(1))`.
- `\tr` macro is defined at the top of string-theory.html (line 26) but never invoked in the body, even though the page discusses $\tr_R\,\mathrm{Hol}_A(\gamma)$-style objects (Wilson loops, characters, McKay–Thompson series). Gauge-theory uses `\tr` heavily (10 occurrences). Either drop the dead macro or use it in the AdS/CFT and moonshine prose for consistency.
- "$U(N)$ gauge theory" in §7 (line 994) is bare italic `$U(N)$`, while the rest of §4–§5 uses `\mathrm{SU}/SO/Spin`. Internally inconsistent within string-theory itself.
- Apostrophe-in-prime in "Wilson 't Hooft" — `\alpha'` is fine, but `mass / (1/√α′)` is rendered with a literal Unicode prime (line 940) rather than `$\alpha'$`. Cosmetic, only inside readout strings.

### Undefined jargon
- "BRST anomaly cancellation" at line 526 ("The same number reappears via BRST anomaly cancellation: $c_{\mathrm{matter}} + c_{\mathrm{ghost}} = D + (-26) = 0$.") — BRST is never defined or expanded; reader who knows the central-charge picture from §2 still has no anchor for "BRST". A six-word parenthetical (e.g. "BRST = Becchi–Rouet–Stora–Tyutin gauge-fixing cohomology") would close the gap.
- "reparametrization ghosts (from gauge-fixing $h_{ab}$)" at line 421 introduces ghosts as a contributing term to the central charge with no prior mention of what a Faddeev–Popov ghost *is*. QFT.html similarly does not pre-define ghosts, so the reader following the section's natural lineage has no callback to lean on. A one-line note (or a callback to a future ghost-section/page) would help.
- "super-conformal ghosts contribute $c_{\mathrm{ghost}} = -15$" at line 626 — same as above; ghost is used as a quantity without a referent.
- "no-ghost theorem in 26D bosonic string used directly" surfaces in the §7 widget readout for monstrous moonshine (line 1041) — third use of "ghost", still no definition anywhere on the page.
- "holonomy representations of $X$" at line 734 — the page uses the holonomy concept to motivate $\mathrm{SU}(3)$-holonomy CY, but never defines holonomy on this page; the only callback is at the end of §1 to riemannian-geometry/general-relativity (which point at metric/spacetime, not holonomy). gauge-theory §3 *defines* holonomy explicitly. A "see gauge-theory.html#gauge-transformations-holonomy" callback in §5 would mirror §1's pattern and resolve this.
- "Spin$^c$ Dirac operator" appears only obliquely (via gauge-theory cross-reference) and isn't a string-theory drift, so leave it.

### Tone mismatches
- The §4 table of five 10D theories (lines 632–641) is dense reference material with no narrative around it. gauge-theory's analogous catalog (§7 SW basic-classes table) is followed by a plain-English paragraph that says what to take from the table; string-theory just rolls into "These five 10D theories are connected by a web of dualities…". A one-sentence "How to read this table:" lead-in would match the section peers.
- The §6 mirror-symmetry paragraph "Concretely, Candelas–de la Ossa–Green–Parkes (1991) computed the Picard–Fuchs equation governing periods on the mirror of the quintic and read off — under the mirror map — Gromov–Witten counts of rational curves on the quintic: 2,875 lines, 609,250 conics, …" (line 887) packs four named objects (Picard–Fuchs equation, periods, mirror map, Gromov–Witten) into one sentence. Gauge-theory and QFT generally introduce one new named object per sentence with a brief gloss. Low priority — this density is appropriate for a capstone, but it's the densest sentence on the page.
- Otherwise voice matches the peers well: second-person rare but present ("Now quantize" §3, "you observe four" §5), worked widgets at the end of every section, "the cleanest example is" / "this is one of the most striking results in physics" rhetorical signposts that mirror gauge-theory.

### Missing worked examples
- _None._ All seven numbered concept sections (§1 worldsheet-action, §2 worldsheet-cft, §3 bosonic-strings-critical, §4 superstrings-susy, §5 compactification-cy, §6 string-dualities, §7 branes-string-math) carry exactly one widget. §8 "Connections" has no widget, matching gauge-theory.html and quantum-field-theory.html (also widget-less in their final §8/§7 "Connections" sections).

### KaTeX macros / formatting
- `\mathrm{Hom}` should be `\Hom` (the page-defined macro) at line 879.
- Dead macro: `\tr` declared but never used in the body. Either invoke it or trim.
- All other macros (`\Spec`, `\Gal`, `\ad`, `\ind`) are also declared-but-never-used in this page, but they're declared identically across all three pages (head boilerplate is byte-identical), so removing them is a section-wide cleanup question, not a string-theory issue.
- Helper-block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) at lines 189–238 is byte-identical to gauge-theory.html lines 194–243 — ok.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.readout`, `.row`, `.note`, `.ok`, `.bad`, `.small`) is canonical throughout; no ad-hoc widget classes detected.
- Hygiene drift (also present in gauge-theory.html, so not unique to this page but worth flagging): §1, §5, §6 each contain duplicate `<aside class="callback">` blocks — one hand-authored before line 310/781/908 and one inside the `<!-- callback-auto-begin -->` fence immediately after. The auto-injector should own the only copy; the hand-authored one above the fence is a stale duplicate that `audit-callbacks.mjs --fix` was meant to obviate. Same pattern in gauge-theory.html lines 303/432/762/1096.

## Severity
minor polish
