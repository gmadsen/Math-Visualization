# dirac-equation — pedagogical audit (2026-05)

**Section:** Mathematical physics
**Compared against:** klein-gordon-equation, quantum-field-theory

## Summary
The Dirac page is structurally and stylistically aligned with its peers — same head/style block, same helper script, six numbered worked sections each with an interactive widget, plus a Connections outro. The only substantive friction is the unflagged metric-signature switch from KG (mostly-plus) to Dirac (mostly-minus), which QFT explicitly callouts but Dirac does not.

## Findings
### Notation drift
- **Metric-signature drift, semantic.** Dirac §2 uses mostly-minus `$\eta = \mathrm{diag}(+1,-1,-1,-1)$` (line 398, also surfaced inside the γ-matrix widget readout "mostly-minus signature: η⁰⁰=+1, ηⁱⁱ=−1"); Klein-Gordon §2 declares mostly-plus `$\eta_{\mu\nu} = \mathrm{diag}(-1,+1,+1,+1)$` (line 342, with `$\Box = \partial_t^2 - \nabla^2$` in §1 line 276). QFT §4 line 665 carries an explicit `<aside class="note">` "Convention. Throughout this page we work in mostly-minus signature… [KG] uses the opposite mostly-plus convention; all amplitudes are convention-independent, but watch the sign when comparing $p^2-m^2$ across pages." Dirac is silent on the conflict. Recommend adding a parallel one-line `<aside class="note">` near the §2 boxed equation pointing to the same caveat.
- **Notation for the Dirac sea is consistent across all three** (`hole theory`, `Dirac sea`, `positron`); QFT line 263 even back-references "Dirac's first-order equation fixed the sign of $j^0$ but introduced a filled negative-energy *sea*" using identical vocabulary.
- **Creation operators are spelled the same** across pages (`a_p, a_p^\dagger, b_p, b_p^\dagger, d_p^\dagger`), modulo a small inconsistency: Dirac §5 uses `b_{p,s}^\dagger v_s(p)` for positrons; QFT §1 uses `d_p^\dagger` for positrons and `b_p^\dagger` for electrons. Cosmetic — physicists swap `b/d` between conventions — but worth a line ("we use `b` for positrons here; QFT page uses `d` and reserves `b` for electrons") if you want zero mismatch.
- **Spinor indices.** Dirac uses `$\psi^\dagger$` and `$\bar\psi = \psi^\dagger\gamma^0$` consistently with QFT §4 (`$i(\not{p}+m)$`). No drift.

### Undefined jargon
- "**spinor**" first appears in §1 line 277 inside the same paragraph that defines it ("$\psi$ must be a 4-component spinor: …"). Acceptable — the bolded use is the definition.
- "**Clifford algebra**" first appears in §1 line 277 inline-defined in the same sentence. OK.
- "**chiral components**" appears in §2 line 398 with a one-line inline gloss ("the projectors $P_{L,R}$ split $\psi$ into chiral components — the building blocks of the Standard Model's left-handed weak-interacting spinors"). Adequate, though "left-handed" is invoked without prior definition; readers from KG would benefit from a half-sentence saying "chiral = handedness eigenstate of $\gamma^5$".
- "**double cover**" in §3 line 576 is mentioned then defined in the next clause via `$\mathrm{Spin}(1,3) \cong \mathrm{SL}(2,\mathbb{C})$` and the $2\pi/4\pi$ rotation discussion. Borderline OK.
- "**Spin structure**" in §Connections line 1042 is dropped without definition: "probes the geometry of $\mathrm{Spin}$ structures on a manifold (an obstruction-theoretic concept that does not apply to scalars)". The parenthetical is too thin for a reader who hasn't met characteristic classes; either expand by a sentence or drop.
- "**Pauli identity**" §6 line 955 is named and immediately stated — fine.
- "**Born rule**" §4 line 685 ("The Born rule applies cleanly") is invoked without definition or callback. Low priority since the surrounding text makes the meaning clear, but a one-word gloss ("$|\psi|^2$ as probability density") would close the loop.
- _No instance of a term used in prose more than one sentence before its definition or callback — the page is well-paced._

### Tone mismatches
- §5 line 827 has "the result is a positive-energy electron PLUS a hole in the sea" with PLUS in all-caps. Slightly meme-y vs. peers' steady tone — KG and QFT do not use shouting capitalization. Recommend lowercase "plus" or italics.
- §5 line 822 inline aside "(spin $\pm 1/2$)" reads as a parenthetical bracket; consistent with peers. Fine.
- The conversational "Now the payoff." opener in §4 line 675 is consistent with KG's "How does the Klein-Gordon equation reduce to Schrödinger's…" rhetorical style and QFT's "An equivalent — and for many purposes more powerful — formulation". On-tone.
- No formula-walls without narration; every boxed equation has surrounding prose.

### Missing worked examples
- _None._ Every numbered §1–§6 has at least one interactive widget (Clifford anticommutator card, γ-matrix grid, spinor-under-boost, $j^0$ comparison, Dirac-sea click-to-create-pair, lower-spinor decimation). Connections is text-only — consistent with the corresponding outros on KG (line 884) and QFT.

### KaTeX macros / formatting
- Macros block (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) is byte-identical with KG and QFT. None of these macros are actually used on the Dirac page; harmless but the same is true of the peers.
- All KaTeX uses standard `$…$`, `$$…$$`. No invented delimiters. Spinor sub/superscripts (`\psi_1, \gamma^\mu, \bar\psi`) are standard.
- Two cosmetic notes: §2 line 398 uses `\mathrm{diag}(+1,-1,-1,-1)` while elsewhere on the page diagonal matrices are written out explicitly with `\begin{pmatrix}`. KG uses both forms too; not drift.
- §4 widget readout (line 807) uses unicode `j⁰` in plain text rather than KaTeX `$j^0$` — this is the corpus convention inside `.readout` strings (KG widget readout on line 767 does the same `j⁰` plain text).
- Helper `<script>` block at top of `<body>` is functionally identical to KG/category-theory (only inline `//` comments differ in whitespace; no API drift). `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all present and verbatim.
- Widget chrome uses `.widget / .hd / .ttl / .hint / .row / .readout / .small` throughout; only one ad-hoc class (`.cliff-btn`, `.gam-btn`) which is the standard pattern of per-widget button classes (KG and QFT do the same with their own scoped classes). No `.note / .ok / .bad` callouts on this page; KG and QFT also don't use them outside specific contexts.

## Severity
minor polish
