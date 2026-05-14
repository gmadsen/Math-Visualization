# lie-groups — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** smooth-manifolds, differential-geometry

## Summary
Strong, well-paced page that earns its scope: voice, KaTeX macro block, helper block, and widget chrome all match the section peers. One section (§6 adjoint representation) is definition-only with no toy, and §7 contains a small dangling-promise prose seam where a picture is announced but never inlined. Otherwise polish-only.

## Findings
### Notation drift
- _None significant._ `\mathbb{R}`, `\mathbb{C}`, `\mathfrak{g}`, `\mathrm{SO}(n)`, `\mathrm{SU}(n)`, `\mathrm{GL}_n` match the conventions in `smooth-manifolds.html` (see its §2 matrix-groups table at lines 463–471) and `differential-geometry.html`. KaTeX macros block (`\Spec`, `\Hom`, `\tr`, `\ad`, `\ind`) is byte-identical to the other two and to `category-theory.html`.
- Minor cosmetic: lie-groups uses `\binom{n}{2}` for `dim O(n)` in its §1 table (line 344) while smooth-manifolds writes the same dimension as `n(n-1)/2` (line 467). Same value, different rendering — readers cross-checking the two pages will see a non-obvious match. Low priority.
- Minor cosmetic: `\dim_{\mathbb R}` (lie-groups line 516) vs the bare `\dim` used elsewhere on the page (e.g. line 503 table header). Internally consistent in context but worth a future homogenisation pass.

### Undefined jargon
- "spinor sign" appears at line 798 ("…this is the 'spinor sign' that distinguishes $\mathrm{SU}(2)$ from $\mathrm{SO}(3)$") with quote marks but no inline gloss; the term is reused at line 1040 where the geometric content is finally explained. The first appearance reads as if it's pointing at something the reader is assumed to know. Recommend a half-sentence in §3 or a forward pointer to §5.
- "fermions are 'real'" at line 1040 ("…the reason fermions are 'real' — they live in a representation of $\mathrm{SU}(2)$ that does not descend to $\mathrm{SO}(3)$") leans on a physics term that's been hinted at but not defined; the gloss is sufficient for readers who know the word, opaque otherwise. Cosmetic.
- §6 note at line 1078 stacks "flag manifolds", "Kirillov–Kostant–Souriau", "orbit method", "spin-$r$ phase space" in one sentence — fine as a "preview" note, but four undefined names back-to-back is the densest jargon block on the page.
- §8 outro line 1297 fires "Yang–Mills, Wigner classification, symmetric spaces, automorphic forms on $G(\mathbb{A}_F)$, Schubert calculus, Kazhdan–Lusztig" in one breath. Fine for a closing "where this goes" paragraph (the pattern is also used in `differential-geometry.html` §11 and `smooth-manifolds.html` §11), so consistent with section convention.

### Tone mismatches
- _None._ Voice matches peers: second-person prompts ("Move the sliders", "Slide $t$ down", "Click 'flip'"), worked computations alongside pictures, occasional first-person plural ("Let us repeat the construction"). Hero sub at line 330 hits the same conversational-precise register as `smooth-manifolds.html` line 274 and `differential-geometry.html` line 344.

### Missing worked examples
- **§6 (adjoint representation)** is the clearest gap: pure definition + Killing form one-liner + a single `<div class="note">` with adjoint orbits. No widget, no concrete matrix computation of $\ad_h$ on $\mathfrak{sl}_2$, no Killing-form numerical check on a basis. Both peer pages give every numbered `<h2>` at least one widget or worked example. Recommend either (a) a small widget that takes $X\in\mathfrak{so}(3)$ or $\mathfrak{sl}_2$ and displays $\ad_X$ as a $3\times3$ matrix on a chosen basis, with eigenvalues; or (b) at minimum, a worked computation: "for $\mathfrak{sl}_2$ basis $(e,f,h)$, $\ad_h$ is $\operatorname{diag}(2,-2,0)$, and $B(h,h)=8$". The §4 BCH widget already exposes the bracket grids; reusing that pattern in §6 would close the gap with little new code.
- **§7 minor seam**: line 1110 ends "As a picture in $\mathfrak{h}^*\cong\mathbb{R}$:" with a colon that promises an inline picture, but the next element is the `<h3>` for $A_2$ — the actual root-system widget appears later and covers both $A_1$ and $A_2$. Either drop the dangling colon or insert a one-line pointer ("…shown in the widget below").

### KaTeX macros / formatting
- _None._ The macros object is the canonical six-entry block shared with category-theory and the two reference pages. Page-local symbols (`\mathfrak{su}`, `\mathfrak{so}`, `\mathfrak{sl}`, `\mathrm{Ad}`, `\mathrm{End}`) all use stock KaTeX with no re-invention. Subscript/superscript conventions for $T_eG$, $\mathrm{Ad}_g$, $\ad_X$ are consistent with `differential-geometry.html` ($\exp_p$, `\mathrm{Ric}`).
- Helper `<script>` block at top of `<body>` (lines 191–308): the canonical 2D core (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`, `fmt`) is byte-identical to `smooth-manifolds.html` lines 193–252. Lie-groups extends the block with page-specific matrix helpers (`matMul`, `matAdd`, `matSub`, `matScale`, `eye`, `matExpSeries`, `rodrigues`, `renderMat`) — additions, not deviations, and appropriate for a matrix-Lie-group page. Widget chrome (`.widget / .hd / .ttl / .hint / .row / .readout / .small / .matgrid / .note / .tabs`) all match house conventions; no ad-hoc classes spotted.

## Severity
minor polish
