# heyting-algebras-toposes — pedagogical audit (2026-05)

**Section:** Higher categories & toposes
**Compared against:** elementary-topos-theory, grothendieck-topologies-sites

## Summary
The page is in strong shape: every section pairs prose with an interactive widget, the voice and KaTeX conventions are tightly aligned with `elementary-topos-theory.html`, and the cross-page callbacks land on the right anchors. Only minor polish issues — a couple of small notation drifts and one place where the §3 widget caption assumes the reader already knows what a "Beck–Chevalley left adjoint" is.

## Findings
### Notation drift
- `\widehat{C}` (Heyting §2 line 429, §4 line 599) vs `\hat{C}` in elementary-topos-theory body (§5 line 572) and the callback labels emitted on every page. Both renderings appear in the same paragraph cluster (callback at line 668 says `\hat{C}`, body at line 599 says `\widehat{C}`). Cosmetic — pick one form for body prose.
- `$G$-$\mathbf{Set}$` (Heyting §5 line 687, "$G$-$\mathbf{Set}$ (sets with a $G$-action)") vs `G\text{-}\mathbf{Set}` in elementary-topos-theory line 765 (`[\mathbf{B}G^{\mathrm{op}}, \mathbf{Set}] = G\text{-}\mathbf{Set}`). The two-`$`-segment form on Heyting renders a literal hyphen between two math islands instead of a single math expression. Low-priority but the case-library widget uses the same `$G$-$\mathbf{Set}$` form (line 714) and it leaks into a button label.
- `\mathsf{Set}` vs `\mathbf{Set}`: Heyting uses `\mathbf{Set}` throughout (matches elementary-topos-theory). `grothendieck-topologies-sites.html` body uses `\mathsf{Set}` but its outbound callback labels switch to `\mathbf{Set}`. Heyting is internally consistent; flag is on grothendieck-sites, not Heyting — included for awareness.
- `\mathrm{Sh}_{\neg\neg}` (Heyting §5 line 686) vs the convention everywhere else of writing `\mathrm{Sh}(C, J)` / `\mathrm{Sh}(X)` with the topology in parentheses. Subscripted-topology form is unusual; consider `\mathrm{Sh}(\mathcal{E}, \neg\neg)` or `\mathrm{Sh}_{j_{\neg\neg}}` for parallelism with the Lawvere–Tierney `j` introduced one sentence earlier.

### Undefined jargon
- "Beck–Chevalley" appears in the §3 dictionary readout (line 531: "Beck–Chevalley left adjoint to pullback") and again in §6 line 801, with no definition or callback. Neither peer page introduces the term; first reader contact is here. One-line gloss ("the commutativity-of-pullback-with-image square") would suffice.
- "locally cartesian closed" (line 533, "this is the locally cartesian closed structure") used in passing. Not defined on this page; `category-theory.html#cartesian-closed` covers cartesian closure but not the locally-cartesian variant. Either drop the phrase or footnote it.
- "Lawvere–Tierney topology" (line 686) is introduced as `j\colon \Omega \to \Omega` with the gloss "an internal closure operator" — that's adequate, but the §5 widget's last case `\mathrm{Sh}_{\neg\neg}(\widehat{C})` then assumes the reader can interpret subscript-by-Lawvere–Tierney-topology fluently. Minor.
- "regular open" (line 742, "$U$ is regular open") in the §5 case-library readout — undefined. Either gloss inline ("$U = \mathrm{int}(\overline{U})$") or drop.

### Tone mismatches
- §2 paragraph at line 428 is the densest formula-without-narration block on the page: three $\Omega \times \Omega$ subobjects defined back-to-back with semicolons separating them. The scrubber that follows does a great job re-narrating, but the prose paragraph reads more like Mac Lane–Moerdijk than the §1 voice. Consider breaking into three sentences, one per operation.
- §4 line 590 ends the long $\Vdash$ display block with a short narrative sentence ("Notice the asymmetry…"). That's the right voice — flag is just that the paragraph immediately preceding is a five-line `aligned` block with no English between rules. Peer pages (elementary-topos §5 sieves paragraph at line 573, grothendieck-sites §1 line 270) tend to inline shorter chunks of formal data.
- Voice is otherwise consistently matched to peers — second-person occasional ("Take $X = \{1,…,6\}$"), declarative-but-friendly, parenthetical asides.

### Missing worked examples
- §6 (geometric-morphisms-logic) has the connective-explorer widget but no concrete example of a geometric morphism that breaks $\Rightarrow$ or $\forall$. The peer `elementary-topos-theory.html` §7 hands the reader Sh($X$)→Sh($Y$) and Spec maps as concrete instances; §6 here would benefit from one analogous concrete `f` for which $f^*(\varphi \Rightarrow \psi) \ne f^*\varphi \Rightarrow f^*\psi$ can actually be witnessed. Right now the "NOT in general" verdicts are asserted but not exhibited.
- §5 has a strong case-library widget but no explicit walk-through of the canonical Cohen-style construction the prose alludes to ("for the right base topos … the $\neg\neg$-sheaves model ZFC where the Continuum Hypothesis fails"). One scrubber step or `<aside class="note">` sketching "base = $\mathrm{Fn}(\omega_2 \times \omega, 2)$" would land the punchline. Optional — the page is already widget-rich.

### KaTeX macros / formatting
- `\llbracket … \rrbracket` (denotational semantic brackets) used heavily in §3 — appropriate and standard KaTeX, no drift.
- `\Vdash`, `\not\Vdash` in §4 — standard KaTeX, used correctly.
- The header macros block (lines 22–29) declares `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind` — identical to elementary-topos-theory and grothendieck-sites. No drift.
- `\mathrm{int}` used in §1 line 280 and §5 line 685 for topological interior. Consider `\operatorname{int}` for spacing parity with the `\Hom` / `\Spec` macros, but `\mathrm` is fine and matches the peer pages' use of `\mathrm{Sub}`, `\mathrm{Sh}`, `\mathrm{op}`.
- `\mathrm{Sub}(\llbracket\Gamma\rrbracket)` in §3 line 498: harmless but visually busy. The peer pages use plain `\mathrm{Sub}(X)` because they don't have semantic brackets in scope — flag is informational.
- §6 widget readouts use plain-string `'NOT in general'` rather than KaTeX-renderable text (line 803). Consider `\text{not in general}` for visual parity with the green "preserved" verdicts that are already wrapped in the same color span. Minor cosmetic.

## Severity
minor polish

