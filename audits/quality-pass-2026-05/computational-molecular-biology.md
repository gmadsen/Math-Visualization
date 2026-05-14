# computational-molecular-biology — pedagogical audit (2026-05)

**Section:** Probability & statistics
**Compared against:** mathematical-biology, information-theory

## Summary
Strong, well-structured page that hits the canonical conversational-but-precise tone and ships a worked widget for every section. Drifts are minor and mostly cosmetic; no semantic problems found.

## Findings
### Notation drift
- Section 5 uses `\mathrm{Exp}\bigl(\binom{k}{2}/(2N_e)\bigr)` while `mathematical-biology.html#coalescent` (the page §5 explicitly delegates to) uses `\mathrm{Exp}\!\left(\binom{k}{2}\right)` after rescaling time by $2N$. The two look mismatched on a side-by-side read; consider stating the time-scaling explicitly so a reader bouncing between pages doesn't think the rates differ.
- Population-size symbol drift: `mathematical-biology.html` consistently uses `2N` (sometimes `N_e` in a callout); `computational-molecular-biology.html` switches to `N_e` in §5 ("$2N_e$ generations") without first defining $N_e$ on this page. Cosmetic — both pages know the convention — but a one-line "effective population size $N_e$ (see mathematical biology §1)" would smooth the handoff.
- Cyrillic/Latin `\Sigma` overload: `\Sigma_{\mathrm{DNA}}`, `\Sigma_{\mathrm{aa}}` (alphabet) appear in the lead and `\Sigma_{ij}` (covariance matrix) appears in §7 widget caption. Both are standard but the reuse of $\Sigma$ inside a single page deserves a one-line gloss when $\Sigma$ first reappears in §7.
- $L$ overload in §4 vs §7: `L_v(s)` is "partial likelihood" (Felsenstein), `L` is "last column of BWT" in §2, and `L` is "protein length" in §7. None ambiguous in context, but `L_v(s)` immediately next to a Bowtie/BWA reference in the same page invites a millisecond of confusion.

### Undefined jargon
- §2 hero paragraph: "$\sim 100$ bp" — `bp` (base pair) is used before being unpacked anywhere on the page. Reader from a stats background may guess but it isn't free.
- §2 names "Bowtie and BWA" without a one-line gloss. Acceptable namedrops, but `BWA` is used twice with no expansion (Burrows–Wheeler Aligner). Cosmetic.
- §3 lead: "CpG-island toy" appears in the widget hint before CpG islands are defined. Worth a parenthetical "(stretches of unusually GC-rich DNA)".
- §3 lists "PFAM and HMMER tools" and "profile HMMs" in one compound paragraph; neither tool nor "profile HMM" is unpacked. Fine for a graduate page, but distance from `category-theory.html`'s habit of always one-lining a name on first use.
- §5 introduces "Tajima's $D$", "$F_{ST}$", "Watterson's $\hat\theta$" rapid-fire. The list includes brief definitions for each, so this is borderline OK; "site-frequency spectrum" is used inside Tajima's $D$ bullet before the widget caption defines it. Reverse the order, or define SFS in the lead.
- §7 uses "MSA" three times before any expansion of "multiple sequence alignment" (which appears in §3 inside another sentence). Add `(MSA)` on first use in §7.
- §7 lead: "Anfinsen hypothesis" and "Levinthal's paradox" each get a one-line definition — good — but "geometric attention transformer", "invariant point attention", "$\mathrm{SE}(3)$-equivariant" land in a dense closing sentence with no pause. Consider splitting; it currently reads as a name-dropping flourish rather than the otherwise careful glossing on the page.
- §6: "Turner free-energy model" used by name without explanation; later "Watson–Crick + wobble" appears in widget caption — both fine in scientific register but slightly heavier than `mathematical-biology.html`'s usage standard, which always pre-glosses (e.g. "Wright–Fisher model: each of the 2N offspring independently picks a parent…").

### Tone mismatches
- Most of the page hits the right register. Two minor wobbles:
  - §2 reads slightly more dry-textbook than the surrounding prose ("Append a sentinel $\$$ to the text $T$, list all cyclic rotations, sort them lexicographically, and read off the last column."). Compare to the warm voice in `mathematical-biology.html` §1 ("That is: with no selection, every founder allele's fate is decided by genetic drift alone, and the fairness of the lottery is exactly its initial share."). Consider adding one "the miracle is…"-style hand-hold beat after the LF-mapping definition.
  - §7 closing paragraph mixes "graveyard problem", "subsumed half of the field in 2020–2024", and "geometric deep learning meets statistical mechanics meets graph algorithms" — three flourishes in a row crosses from playful into breathless. One of them is the right amount.
- Strengths to preserve: the lead paragraph's "four hammers", the Bellman-equation framing reused across sections, and the §5 widget caption explaining what positive/negative Tajima's $D$ mean — all match the `information-theory.html` voice well.

### Missing worked examples
- _None._ Every numbered section has a widget plus a `.readout`-driven concrete example (NW table, BWT rotation grid, HMM Viterbi sequence, Felsenstein partial-likelihood vectors, SFS bars, Nussinov dot plot, MI-vs-DCA panels). The §8 "Connections" section has no widget, which matches the convention used by both reference pages.

### KaTeX macros / formatting
- Helper KaTeX macro block (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) is the verbatim copy from `category-theory.html` — good. None of those are actually used on this page; that's the standard posture across the corpus, so leave it alone.
- Page uses `\operatorname{Exp}` via `\mathrm{Exp}` (not the helper) — `mathematical-biology.html` does the same (`\mathrm{Exp}`), so consistent across siblings.
- `\AA` (Ångström) appears in §7 — KaTeX-supported standard, not a re-invention.
- `\mathtt{A}`, `\mathtt{C}`, `\mathtt{G}`, `\mathtt{T}` for nucleotides is consistent throughout (good: avoids the temptation to use `\texttt` or raw letters).
- Display math is delivered via `<p style="text-align:center">$…$</p>` rather than `$$…$$` blocks. Both reference pages do the same in places, so this is house-consistent (not a drift).
- One readout-string formatting nit: §5 widget readout uses literal Greek (`θ_W`, `π`) in plain text inside `<div class="readout">`, while §3 readout uses ASCII (`H-fraction`, `Viterbi`). Minor; both reference pages also mix.
- Helper `<script>` block at top of `<body>` (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is byte-identical to the one in `category-theory.html` and `mathematical-biology.html`. Good.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.readout`, `.row`, `.note`, `.ok`, `.bad`, `.pill`) — all standard; no ad-hoc classes introduced.
- Sole non-standard element: §6 includes `<aside class="related"><div class="ttl">Also worth knowing</div>…</aside>` (in §2 of the page, not §6 — re-checking: it's the BWT section that uses the `.related` class for a hand-authored "Also worth knowing" callout about suffix arrays + LCP, not for the auto-generated "Used in" backlinks). House convention is to use `aside.related` only for the auto-generated "Used in" block (cf. `mathematical-biology.html` and `information-theory.html`). Consider switching this to `<div class="note">` so the auto-injected backlink injector and human readers don't both lay claim to the `.related` semantics.
- §6 ends with another hand-authored `<aside class="callback">` (the enumerative-combinatorics one) that lives outside the `<!-- callback-auto-begin -->/<!-- callback-auto-end -->` fence. That's a fragile pattern: next time `audit-callbacks.mjs --fix` runs it will not touch this block, but a human looking at the section may wonder which is auto and which is hand. Either move the enumerative-combinatorics link into the concept's `prereqs` so the auto-injector picks it up, or move the hand block into a `<div class="note">` for visual distinction. Same nit applies to the §6 "Connections-style" `.callback` and to the §8 link list, which is just a `<ul>` rather than the canonical Connections-section pattern used by `mathematical-biology.html` (a free `<ul>` is fine; just noting the inconsistency).
- §8 has an explicitly-styled "not in the notebook yet" placeholder link to `hidden-markov-models.html` with inline `style="color:var(--mute);text-decoration:none;cursor:default"`. House convention elsewhere is to omit such placeholders entirely; if it stays, consider lifting the inline style into a `.unbuilt` class so future audits can find them.

## Severity
minor polish
