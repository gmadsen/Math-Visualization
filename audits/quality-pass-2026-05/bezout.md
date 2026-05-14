# bezout — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** projective-plane, elliptic-curves

## Summary
The page is in strong shape: voice, helper block, widget chrome, and section structure all match section peers. A few low-priority notation inconsistencies and one section without an interactive widget are the only items worth touching.

## Findings
### Notation drift
- Bézout uses `$\overline{k}$` (bezout.html:309, :555) and `$\overline{\mathbb{Q}}$` (bezout.html:1098), but also `$\bar k$` once (bezout.html:1080). Elliptic-curves consistently uses `$\bar k$` (elliptic-curves.html:272, :600, :952, :959). Cosmetic; pick one form (the rest of the page leans on `\overline{…}`, so the `\bar k` at line 1080 is the outlier).
- Resultants are written `$\mathrm{Res}(f,g)$` and `$\mathrm{Res}_x(f,g)$` (bezout.html:545, :555, :557, :656, :681). Page macro registry already defines `\Spec, \Gal, \Hom, \tr, \ad, \ind` via `\operatorname{...}` — `\mathrm` for an operator name is a small stylistic break with the page's own convention; either add `'\\Res':'\\operatorname{Res}'` to the macros block or switch to `\operatorname{Res}` inline. Same comment on `$\mathrm{length}_{\mathcal{O}_{\mathbb{P}^n,P}}$` at bezout.html:1069.
- The local-ring symbol drifts within bezout itself: `$\mathcal{O}_{\mathbb{A}^2,P}$` (line 379), then `$\mathcal{O}_{P}$` (line 533), then `$\mathcal{O}_P$` in the table (line 697), then `$\mathcal{O}_{\mathbb{P}^2,P}$` (line 537, 1106). Cosmetic; the unsubscripted form silently changes ambient space partway through §3.
- "Chord–tangent" (en-dash) on bezout (line 225, 914, 1031, 1043, 1096, 1117) vs "chord-and-tangent" (lowercase "and") on elliptic-curves (line 362, 387, 390). Both pages cross-link the construction; cosmetic, but a casual reader hopping between them sees two phrasings for the same gesture.
- bezout.html:805 uses `$\mathbb{P}^2_{\mathbb{C}}$` in a readout string while §2 and §5 favour `$\mathbb{P}^2$` with the field implicit. Not wrong, just an unannounced subscripted-field appearance inside widget output.

### Undefined jargon
- "common irreducible component" (bezout.html:667 in the theorem statement, line 678 in the discussion) is used without ever defining "irreducible." Reader has only seen "no common component" earlier (line 655). Minor; the surrounding text is self-explanatory enough that the adjective "irreducible" reads as emphasis rather than load-bearing.
- "structure sheaf" appears in the §2 slogan (bezout.html:373) before sheaves have been introduced or callback-linked; the actual `<a href="./sheaves.html">sheaves</a>` link does not arrive until §9 (bezout.html:1107). One sentence in a `.note` aside, low impact, but a reader who pauses on it has nowhere to click.
- "no common component" (bezout.html:678) and "common irreducible component" (bezout.html:667) are used interchangeably — the equivalence is left implicit (it requires the field to be reduced/curves to be reduced subschemes). For a v1 audience this is fine, but it leans on undefined "component."
- "Hilbert–Samuel multiplicity" (bezout.html:1113) is named in passing in §9 with no callback. Acceptable as a forward reference, but it is the only named-multiplicity-theory object on the page that gets no link or one-line gloss.
- §7's "$(\mathbb{Z}/3)^2$-subgroup of $E$" (bezout.html:1047) and §9's "$|E[n]|=n^2$ over $\overline{\mathbb{Q}}$" (bezout.html:1098) both use the $E$-torsion subgroup notation $E[n]$ with no in-page introduction; the elliptic-curves callback provides the home, but bezout's own §7 mentions it before any link to that page — the section's lone callback at line 1055 points only to `elliptic-curves.html#intro`, not to the torsion section. Low priority.

### Tone mismatches
- §1–§6 read in the conversational-but-precise voice that matches `category-theory.html` and `projective-plane.html`. §7 (Cayley–Bacharach) and §8 (higher dimensions) drift toward the drier exposition register seen in late sections of `elliptic-curves.html` — fewer second-person beats, longer technical paragraphs (e.g. bezout.html:1041, 1078). Not a problem, just noticeable when read end-to-end.
- "associativity miracle" in the §7 heading (bezout.html:1035) and "nine-point miracle" subhead (bezout.html:1026), plus "the miracle pays off" (bezout.html:1043), use "miracle" three times in adjacent sections. Stylistically loud; one is enough.
- "Mobius-style degree count" in the resultant widget readout (bezout.html:612) reads as a casual tossed-off remark with no referent — it is inside a widget the reader is supposed to learn from, and `Mobius` is unaccented and unexplained. Low-priority polish.

### Missing worked examples
- **§2 "Three refinements"** — has the `Homogenize to $\mathbb{P}^2$` widget for refinement (b) only; refinements (a) algebraic closure and (c) multiplicity are prose-only at the §2 level (multiplicity gets its own §3 with a full widget, so this is partially mitigated). Not a gap, but the section reads as one widget for three ideas.
- **§5 "Statement of Bézout's theorem"** — pure definition + proof sketch + properties table; no widget, no toy. The two TOC neighbours each carry a widget per major section; this is the only numbered `<h2>` on the page with no interactive element. The §6 examples mostly compensate, but a small "pick $d, e$, see $de$" affordance attached to the statement itself would be the obvious add.
- **§8 "Bézout in higher dimensions"** — no widget; pure prose with one Chow-ring formula. Comparable to elliptic-curves.html §6 (Mordell), which is also widget-free, so not anomalous; flagging for completeness.
- **§9 "Applications and forward references"** — no widget, but functionally a "what's next" outro and analogous to elliptic-curves §7; consistent with peer practice.

### KaTeX macros / formatting
- `\mathrm{Res}` and `\mathrm{length}` (bezout.html:545, :555, :557, :656, :681, :1069) are not in the page's `macros: { … }` block, while every other operator name on the page is registered via `\operatorname`. Either register them or rewrite inline as `\operatorname{Res}` / `\operatorname{length}` to match peer style.
- `\mathfrak{m}_P` (bezout.html:380) appears once and is a standard KaTeX-supported macro — flagging only because it is the only `\mathfrak` symbol on the page; the prose around it does not say "maximal ideal," so a reader who has never seen the gothic `m` has nothing to anchor on.
- `\dim_{k} H^0(\mathbb{P}^2,\mathcal{O}/(F,G))` (bezout.html:1112) introduces sheaf cohomology notation with no explanation in §9; this is a forward reference and is linked, so it is acceptable, but it is the single densest formula on the page and lives in the closing summary.
- All KaTeX delimiters are the four canonical forms (`$…$`, `$$…$$`, `\(…\)`, `\[…\]`); no ad-hoc delimiters introduced.
- The KaTeX inside `<option>` elements at lines 319–322 and 564–567 means `katex-select.js` is required — confirmed loaded at line 178. Good.
- Helper `<script>` block (bezout.html:186–202) is the verbatim 2D helper from `category-theory.html`; widget chrome uses `.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok` consistently; no ad-hoc classes.

## Severity
minor polish
