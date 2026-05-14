# shimura-varieties — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** modular-curves, automorphic-forms-adelic

## Summary
A genuinely strong, dense graduate-level page whose six widgets all hit the "toy you can poke" bar; chrome, helper block, color tokens, and KaTeX macros all match the canonical template. The main remediation work is the `Connections` outro: it has multiple broken cross-page anchors and an embarrassing comment-string leak that calls out the section's templated origin.

## Findings
### Notation drift
- _None of consequence._ Shimura uses `\mathbb{Q}/\mathbb{R}/\mathbb{C}/\mathbb{Z}` consistently with both peers; `\mathrm{GL}_2`, `\mathrm{GSp}_{2g}`, `\mathrm{Res}_{F/\mathbb{Q}}`, `\mathrm{Im}\,\tau`, `\mathrm{Pic}^0` are spelled the same way as in `modular-curves` and `automorphic-forms-adelic`. The `\Hom`, `\Gal`, `\Spec`, `\tr`, `\ad`, `\ind` macro block is verbatim from category-theory.
- (cosmetic) Inside SVG `<text>` and `readout` strings, shimura mixes Unicode `ℋ` for the symmetric space (e.g. widget 1 options "(GSp₄, ℋ₂)", widget 4 "X = ℋ^${f.d}") while the prose uses `\mathbb{H}` and `\mathfrak{H}_g`. Peers do the same Unicode-in-SVG trick (`modular-curves` widget 4 uses `S₂(Γ₀)` etc.), so this is consistent across the section, not drift.
- (cosmetic) Widget-6 select text labels X₀(11) and X₀(17) as "Siegel-like, dim 1". They are modular curves, not Siegel; the label is a slight semantic stretch in service of grouping examples, not a notation collision.

### Undefined jargon
- "Deligne torus" is named at line 268 in §1 prose `\mathbb{S} = \mathrm{Res}_{\mathbb{C}/\mathbb{R}} \mathbb{G}_m` is the Deligne torus — the algebraic group whose real points are $\mathbb{C}^\times$." — this self-defines fine.
- "Cartan involution" appears in (SV2) at line 274 ("`$\mathrm{ad}(h(i))$ is a Cartan involution on $G^{\mathrm{ad}}_\mathbb{R}$`") with no definition or callback. First-time graduate readers in this section won't have it. No prereq edge to lie-groups for it.
- "Hermitian symmetric domain" first occurs in §1 list (SV2) and in the table caption "Hermitian symmetric domains classified by Cartan" — no definition, no callback. The §1 "See also" callback points to lie-groups#intro and upper-half-plane#H, neither of which discusses Hermitian symmetric domains.
- "neat $K$" appears in the Baily–Borel theorem box (§2) without definition: "For neat $K$, $\mathrm{Sh}_K(G,X)$ is …" — graduate-but-non-specialist readers will not know "neat" is a technical condition (no torsion in conjugates).
- "reflex field" is named in §1 then defined a paragraph later — borderline OK, the definition arrives in the same section.
- "spherical Hecke algebra" is referenced in §2 ("the action of an unramified Hecke algebra at $p \nmid N$") and §5 (`\mathcal{H}(G(\mathbb{A}_f) /\!/ K)`) without definition; the §2 callback to `automorphic-forms-adelic#satake` covers it nicely, but the §5 mention has no callback.
- "Hodge–Tate types/weights" appear in §5 closing paragraph ("The Tate twists, weights, and Hodge–Tate types are read off from the Hodge cocharacter") with no prior definition or callback.
- "Honda–Tate theory" introduced in §6 with a one-sentence gloss ("isogeny classes of abelian varieties over $\mathbb{F}_q$ are parametrized by Weil $q$-numbers"). Acceptable as a forward-reference, but no link target for readers who want more.
- "Kottwitz triples", "orbital integrals", "$\sigma$-twisted orbital integrals", "Kottwitz signs" all named in the Langlands–Kottwitz formula in §6 with only inline gloss; this is intrinsic to the topic's depth and matches the surrounding density, but readers without trace-formula background will hit a wall.
- "Rapoport–Zink", "perfectoid", "Newton stratification", "local models", "parahoric level", "Beilinson–Bloch–Kato" all appear unexplained in the §7 "Connections" outro and in §6's local-global sidebar. Tolerable in a frontier paragraph, but worth a one-line gloss for at least Rapoport–Zink space which is referenced in widget 6 readout ("Rapoport–Zink space").

### Tone mismatches
- Hero subtitle is one 39-word run-on sentence ("Higher-dimensional generalizations of modular curves: locally symmetric quasi-projective varieties whose points parametrize Hodge structures, whose canonical models live over arithmetic number fields, and whose étale cohomology realizes the automorphic-to-Galois bridge of the Langlands program."). Peer hero subs are crisper: `modular-curves` uses one 24-word sentence; `automorphic-forms-adelic` uses two short sentences. Fine reading register, just slightly denser than the section baseline.
- §6 opens with "The deepest application of Shimura varieties to arithmetic is the explicit count of $\mathbb{F}_q$-points of their integral models" — this is exactly the conversational-but-precise voice category-theory.html sets. Same for the §1 walk through `(G, X)` examples. Tone is on-target.
- §5 has a long stack of attributions ("generalized by Deligne (weight $\ge 2$ holomorphic), Carayol (Hilbert modular forms via Shimura curves, level-by-level), Brylinski–Labesse (totally real fields), Kottwitz …, culminating in Shin–Caraiani–Scholze … Fargues–Scholze …"). This reads as a name-dropping textbook paragraph more than a conversational one — peers in this section don't do attribution chains this long. Consider trimming or pushing to a "history" footnote.
- §6 closing sentence ("plays the formula off symmetric powers on Hilbert modular varieties") is slightly slangy ("plays the formula off"); minor.
- The §7 outro exposes a comment that should never have shipped: `<!-- Connections outro — pedagogy reviewer's templated closure pattern. -->` (lines 967-969). This breaks the fourth wall and tells the reader the section was templated by a process audit. Strip the comment.

### Missing worked examples
- Every numbered §1–§6 ships a widget. §7 (Connections) is link-list only, which is appropriate for an outro and matches `automorphic-forms-adelic` pattern (no widget in its trailing section either).
- §3 (Siegel) widget 3 visualises positivity of `Im τ` for $g=2$, but doesn't compute anything moduli-flavoured (e.g. the polarisation type, or the dimension count `dim_C \mathfrak{H}_g = g(g+1)/2`). The §1 widget already shows dimension; §3 could surface a number that's specific to `\mathfrak{H}_2` to make the widget less redundant. Minor — the positivity slider is a real toy.
- §4 widget 4 prints a typo in the readout: `lines.push(\`compact? ${f.d===0?"":"no"}  (cusps present, indexed by the cl(F))\`);` — when `f.d != 0` (always the case in the menu) the conditional emits "no", but for $F=\mathbb{Q}$ the Hilbert variety is just a modular curve and is also non-compact for the same reason. The bigger issue is the dangling parenthetical "indexed by the cl(F)" which conflates "cusps" with "class number"; for `F=ℚ` there's only one cusp class and `cl(ℚ)=1`, so the line accidentally still reads true, but it's loose.

### KaTeX macros / formatting
- Macro block is verbatim from `category-theory.html`: `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`. No new macros are introduced; no new delimiters; nothing to flag.
- All KaTeX in widget SVGs is rendered as Unicode glyphs (`ℋ`, `ℚ`, `ℤ`, `ℂ`, `μ_h`, `α_p`) rather than `$…$` — this matches both peers' practice (`modular-curves` widget 6 uses `Γ₀` Unicode; `automorphic-forms-adelic` widget 5 uses `α_p, β_p` Unicode). Consistent.
- One small inconsistency: §1 widget readouts use a raw KaTeX-flavoured string `\\mathrm{diag}(z,z,1,1)` inside the `data` table values but never feed them through `renderMathInElement` (the readout is a `<div class="readout">` with `textContent`). The `\\mathrm{diag}` therefore renders as the literal characters `\mathrm{diag}(z,z,1,1)` in the readout. Consider either Unicode-ising (`diag(z,z,1,1)`) or writing the readout to `innerHTML` with `$…$` so KaTeX picks it up. This is a real polish item visible on render.

### Cross-page anchor health (high priority)
The §7 Connections list and one §5 callback contain broken anchors. These show as silent 404 jumps in the browser:

- `etale-cohomology.html#l-adic-cohomology` — id is `ladic` (the §5 inline callback uses the right id; only the §7 outro is wrong). Both occurrences should match.
- `galois-representations.html#galois-rep-definition` — closest existing id is `rep`.
- `langlands-program.html#global-langlands-gl-n` — no such id; existing sections include `global`, `philosophy`, `cft-as-gl1`, `modularity`, `functoriality`, `capstone`.
- `automorphic-forms-adelic.html#automorphic-form-definition` — no such id; the string `automorphic-form-definition` is the quiz `data-concept` for §3 whose section id is `auto-form`.
- `modularity-and-flt.html#level-lowering` — no such id (sections are `frey, modularity, ribet, deformation, rt`); referenced twice (§4 inline and §7 outro).
- `abelian-varieties.html#polarization`, `#definition`, `#tate` — these resolve correctly.
- `complex-multiplication.html#cm-abelian` — resolves correctly.
- `modular-curves.html#y0-x0` — resolves correctly.

These are content bugs, not style drift. Recommend running `node scripts/audit-callbacks.mjs --fix` after correcting the anchor strings in the JSON outro.

## Severity
minor polish (style drift is negligible) plus one batch of broken cross-page anchors in the §7 Connections outro that warrants a content fix.
