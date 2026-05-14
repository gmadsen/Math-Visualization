# elementary-topos-theory — pedagogical audit (2026-05)

**Section:** Higher categories & toposes
**Compared against:** heyting-algebras-toposes, grothendieck-topologies-sites

## Summary
A solid, well-paced graduate-level intro: every numbered section has a worked widget, the seven-section arc tracks Mac Lane–Moerdijk Ch I–IV cleanly, and the prose voice is on-tone. Main issue is a single notation drift on the presheaf-topos hat (`\hat{C}` vs peers' `\widehat{C}`) and one stray Yoneda-embedding character that appears nowhere else in the corpus.

## Findings
### Notation drift
- **`\hat{C}` everywhere here vs. `\widehat{C}` in both peers** (high priority — appears in §5 `<h2>`, in TOC, in callbacks, in §2/§4 prose). Examples:
  - elementary-topos-theory.html:571 `<h2>5. Presheaf toposes $\hat{C} = [C^{\mathrm{op}}, \mathbf{Set}]$</h2>`
  - heyting-algebras-toposes.html:429,599,687,725,748 all use `$\widehat{C}$`
  - grothendieck-topologies-sites.html:271,667,765,817 all use `$\widehat{C}$`
  - Recommend: settle on `\widehat{C}` (peers' choice; renders larger and is the convention in Mac Lane–Moerdijk).
- **Yoneda embedding written as bare Japanese character `よ(c)`** at line 573 — this character appears nowhere else in the corpus (verified across all `*.html`, including category-theory.html which discusses Yoneda extensively). Since it sits inside a math-mode `$…$` not wrapped in `\text{}`, KaTeX rendering is fragile. Recommend either dropping the `= よ(c)` aside or expressing it as `\text{よ}(c)` / `\mathrm{y}(c)` / just removing the alternative notation since it's introduced and never reused.
- **`\mathsf{Set}` vs `\mathbf{Set}`** is a peer split (grothendieck uses `\mathsf`, heyting + this page use `\mathbf`). Cosmetic; this page is consistent with heyting and with the corpus majority. No action needed.
- **Section 2 display equation uses `\begin{array}{ccc}` for the pullback square** (line 343) instead of `xymatrix`/`array` styling that peers use elsewhere — peers tend to inline pullback squares as SVG widgets rather than display math. Cosmetic.

### Undefined jargon
- §7 first paragraph: "subject to the constraint that $f^*$ is **left exact**" — "left exact" appears as a load-bearing technical term but is paraphrased ("preserves all finite limits") in the same clause, so this is fine.
- §7 second paragraph mentions **"sober space"** (line 922) without definition or callback: *"the topos $\mathrm{Sh}(X)$ remembering all the topological information of a sober space."* Quote: `the topos $\mathrm{Sh}(X)$ remembering all the topological information of a sober space.` The peer pages don't define it either, but a one-clause gloss ("a space recovered from its open-set lattice") would help readers without a topology background. Low priority.
- §7 fourth paragraph mentions **"Lawvere–Tierney topology"** implicitly via "$f^* = $ sheafification" without naming it; heyting-algebras-toposes §5 introduces Lawvere–Tierney explicitly. Not strictly undefined but a named callback would tighten the cross-page weave.
- §6 mentions **"Frobenius reciprocity"** at line 766 (`Equivariant maps $G/H \to G/K$ correspond to $H$-fixed cosets $K\setminus G^H$, which by Frobenius reciprocity is non-empty iff $H \le K$ up to conjugation`) without callback to representation-theory or definition. It's a side aside, not load-bearing — but flag for a See-also pointer.

### Tone mismatches
- §1 paragraph 1 (line 275) opens with a textbook-citation parenthetical ("Mac Lane and Moerdijk's *Sheaves in Geometry and Logic* develops the theory in this order; Johnstone's *Elephant* takes the power-object route.") right after the bare definition. Peers (heyting §1, grothendieck §1) defer such citations to mid-section or omit them. Slightly drier opener than peer norm. Low priority.
- §7 final aside (`(One symbol; two functors; the asymmetry is real.)` line 921) is good — that's the conversational register category-theory.html sets. Compliant.
- Overall the page hits a slightly more "encyclopedic" register than heyting-algebras-toposes (which leans more on second-person "you'll see…", e.g. heyting §1 line 281 *"Click any pair of elements to compute…"*). This page does have similar invitations in widget hints, just fewer in body prose. Cosmetic.

### Missing worked examples
_None._ Every numbered section has its own widget (proof-scrubber for §1/§2/§4, custom interactive SVGs for §3/§5/§6/§7). Coverage is actually stronger than the peers' average.

### KaTeX macros / formatting
- Page-level macro block (lines 23–28) declares `\Spec, \Gal, \Hom, \tr, \ad, \ind` — identical to the heyting and grothendieck headers. No drift, no ad-hoc local macros.
- `\Hom_{\hat C}` at line 572 is the only use of the macro with a hat-subscript; peers tend to leave the subscript off or use `\Hom_C`. Renders fine but visually awkward inside an already-hatted context. Cosmetic.
- §2 line 343 uses `\begin{array}{ccc} … \end{array}` for a pullback square inside `<p>$$ … $$</p>`. KaTeX handles it, but peers prefer either an SVG diagram (so the "square" is visual) or `\xrightarrow` in a single line. Not a bug, just stylistic drift.
- No misuse of `\mathrm` vs `\operatorname` — `\mathrm{Sub}, \mathrm{Sh}, \mathrm{op}, \mathrm{true}, \mathrm{ev}` are all "names of structures" (consistent with peer convention), and `\Hom, \Spec` use the page-macro `\operatorname`-expansion.

## Severity
minor polish (single high-priority `\hat`→`\widehat` notation drift across the page; one stray Yoneda character; otherwise the page is in good shape).
